import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

/**
 * Would each proposed addition actually resolve?
 *
 * scan-mathsscot-new.mjs only checks that the archive stocks the paper. That is
 * not enough: practice-loader keys its index on the label written in the
 * question's own badge, and an entry whose ref does not hit a key resolves to
 * nothing and disappears from the sheet without an error.
 *
 * The gap that matters is part questions. maths.scot credits "Q8a"; the archive
 * badges the same question "Q8(a)", sometimes "Q8 (a)", sometimes
 * "Q7 (b), (c), (d)". practice-loader keeps everything after the number with
 * spaces stripped, so the ref has to be spelled the archive's way, not his.
 *
 * Reads scan-mathsscot-new.json, prints the exact ref to use for each, and
 * flags anything that cannot be resolved.
 *
 *   node scripts/check-mathsscot-refs.mjs
 */

const BADGE = /^\s*<small>\s*<strong>[\s\S]*?>([^<]+)</i;
const LABEL = /\b(?:((?:19|20)\d{2})\s*)?(Spec\w*|Exemplar)?\s*(?:P([12])\s*)?Q(\d+)\s*(.*)$/i;

/** Exactly what lib/practice-loader.ts does, so the keys line up. */
function labelOf(questionHtml) {
  const badge = String(questionHtml).match(BADGE);
  if (!badge) return null;
  const m = badge[1].trim().match(LABEL);
  if (!m) return null;
  const [, year, special, paper, num, rest] = m;
  if (!year && !special) return null;
  const parts = (rest ?? '').replace(/\s+/g, '');
  const head = [year, special].filter(Boolean).join(' ');
  return `${head}${paper ? ` P${paper}` : ''} Q${num}${parts}`;
}

const DIRS = {
  national5Maths: 'src/n5/pastpapers',
  higherMaths: 'src/higher/pastpapers',
  advancedHigherMaths: 'src/ah/pastpapers',
};

async function indexFor(dir) {
  const keys = new Set();
  const full = path.resolve(dir);
  if (!fs.existsSync(full)) return keys;
  for (const f of fs.readdirSync(full).filter(f => f.endsWith('.js'))) {
    let mod;
    try { mod = await import(pathToFileURL(path.join(full, f)).href); } catch { continue; }
    for (const v of Object.values(mod)) {
      if (!v?.papers) continue;
      for (const p of v.papers) {
        for (const q of p.questions) {
          const label = labelOf(q.question);
          if (label) keys.add(label);
        }
      }
    }
  }
  return keys;
}

const report = JSON.parse(fs.readFileSync('scan-mathsscot-new.json', 'utf8'));
const indexes = {};
for (const [course, dir] of Object.entries(DIRS)) indexes[course] = await indexFor(dir);

const resolvable = [], ambiguous = [], missing = [];

for (const r of report.filter(r => r.stocked)) {
  const keys = indexes[r.course];
  if (keys.has(r.ref)) { resolvable.push({ ...r, key: r.ref }); continue; }

  // his "Q8a" against the archive's "Q8(a)" / "Q8 (a)" / "Q7(b),(c)"
  const m = r.ref.match(/^(.*Q\d+)([a-d])$/);
  if (m) {
    const [, head, part] = m;
    const cands = [...keys].filter(k => k.startsWith(head) && k.length > head.length
      && new RegExp(`\\(${part}\\)`).test(k));
    if (cands.length === 1) { resolvable.push({ ...r, key: cands[0], viaPart: true }); continue; }
    if (cands.length > 1) { ambiguous.push({ ...r, cands }); continue; }
  }
  // a whole-question ref where the archive splits the question into parts
  const whole = [...keys].filter(k => k.startsWith(r.ref) && k !== r.ref);
  if (whole.length === 1) { resolvable.push({ ...r, key: whole[0], viaWhole: true }); continue; }
  if (whole.length > 1) { ambiguous.push({ ...r, cands: whole }); continue; }
  missing.push(r);
}

const show = (title, rows, extra = () => '') => {
  console.log(`\n${title}: ${rows.length}`);
  for (const r of rows) {
    console.log(`  ${r.course.replace('Maths', '').padEnd(16)} ${r.topic.padEnd(24)} ${r.ref.padEnd(15)} ${extra(r)}`);
  }
};

show('RESOLVE CLEANLY — safe to add', resolvable.filter(r => !r.viaPart && !r.viaWhole));
show('RESOLVE via a differently-written part — use the archive spelling', resolvable.filter(r => r.viaPart || r.viaWhole),
  r => `-> "${r.key}"`);
show('AMBIGUOUS — more than one candidate, NOT safe', ambiguous, r => `candidates: ${r.cands.join(' | ')}`);
show('NO MATCH — the paper is stocked but this question is not in it', missing);

fs.writeFileSync('mathsscot-additions.json', JSON.stringify(resolvable, null, 1));
console.log(`\nready to add: ${resolvable.length}`);
console.log(`needs a decision: ${ambiguous.length + missing.length}`);
console.log('\nwritten to mathsscot-additions.json — nothing has been changed');
