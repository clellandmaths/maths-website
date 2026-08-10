import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

/**
 * What has Andrew added to maths.scot that we do not carry?
 *
 * add-mathsscot-links.mjs points the other way: it links questions we already
 * hold to his written solutions. This looks for the reverse — past paper
 * questions on his topic pages that are missing from our guided practice.
 *
 * Only past paper questions are reported. His own worked examples are his
 * writing; the past paper ones are Qualifications Scotland material the site
 * already holds in full, so adding one costs a reference rather than a copy.
 *
 * A reported question is only actionable if the archive stocks that paper —
 * a reference to a paper we do not hold resolves to nothing and silently drops
 * out of the sheet. That is checked here, and anything unstocked is listed
 * separately rather than mixed in with the additions.
 *
 * Read-only. Prints a report and writes scan-mathsscot-new.json.
 *
 *   node scripts/scan-mathsscot-new.mjs
 */

const CACHE = 'node_modules/.cache/mathsscot';
const FILES = ['national5Maths', 'higherMaths', 'advancedHigherMaths'];
const FRESH = process.argv.includes('--fresh');

fs.mkdirSync(CACHE, { recursive: true });

async function page(url) {
  const key = path.join(CACHE, url.replace(/[^a-z0-9]+/gi, '_') + '.html');
  if (!FRESH && fs.existsSync(key)) return fs.readFileSync(key, 'utf8');
  const res = await fetch(url, { headers: { 'user-agent': 'clellandmaths-link-builder' } });
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  const html = await res.text();
  fs.writeFileSync(key, html);
  await new Promise(r => setTimeout(r, 400));
  return html;
}

/**
 * Reduce a past paper credit to a comparable key.
 *
 * Same shapes as add-mathsscot-links.mjs: "SQA Higher Maths 2015 Paper 1 Q1" on
 * his pages, "2015 P1 Q1" in ours, and Advanced Higher years with no paper
 * number at all because those diets were a single paper.
 */
function normalise(label) {
  const s = String(label)
    .replace(/specimen/gi, 'spec')
    .replace(/[^0-9a-z]+/gi, ' ')
    .trim()
    .toLowerCase();
  const year = (s.match(/(?:^|\s)((?:19|20)\d{2})(?:\s|$)/) || [])[1];
  const paper = (s.match(/(?:^|\s)paper\s*([12])(?:\s|$)/) || [])[1]
             ?? (s.match(/(?:^|\s)p\s*([12])(?:\s|$)/) || [])[1]
             ?? null;
  const qm = s.match(/(?:^|\s)q\s*(\d+)\s*([a-d])?(?:\s|$)/);
  if (!year || !qm) return null;
  const variant = /(?:^|\s)spec(?:\s|$)/.test(s) ? 'spec' : '';
  return {
    key: [year, variant, paper ?? '', qm[1], qm[2] ?? ''].join('|'),
    year, paper, q: qm[1], part: qm[2] ?? '',
    ref: `${year}${paper ? ` P${paper}` : ''} Q${qm[1]}${qm[2] ?? ''}`,
  };
}

/** Every past paper credit on one of his topic pages, with its anchor. */
function hisQuestions(html) {
  const out = [];
  const anchors = [...html.matchAll(/id="(\d+)"/g)];
  for (let i = 0; i < anchors.length; i++) {
    const from = anchors[i].index;
    const to = i + 1 < anchors.length ? anchors[i + 1].index : html.length;
    const block = html.slice(from, to);
    const hash = Number(anchors[i][1]);
    for (const m of block.matchAll(/SQA[^<]{0,70}/g)) {
      const n = normalise(m[0]);
      if (!n) continue;
      if (!out.some(o => o.key === n.key)) out.push({ ...n, hash, credit: m[0].trim() });
      break;
    }
  }
  return out;
}

// ---------------------------------------------------- what the archive holds
const PAPER_DIRS = {
  national5Maths: 'src/n5/pastpapers',
  higherMaths: 'src/higher/pastpapers',
  advancedHigherMaths: 'src/ah/pastpapers',
};

async function stockedPapers(dir) {
  const held = new Set();
  const full = path.resolve(dir);
  if (!fs.existsSync(full)) return held;
  for (const f of fs.readdirSync(full).filter(f => f.endsWith('.js'))) {
    let mod;
    try { mod = await import(pathToFileURL(path.join(full, f)).href); } catch { continue; }
    for (const v of Object.values(mod)) {
      if (!v?.papers) continue;
      for (const p of v.papers) held.add(`${v.year}|${p.paperNumber}`);
    }
  }
  return held;
}

// ------------------------------------------------------------------ compare
const report = [];
let totalNew = 0, totalUnstocked = 0;

for (const name of FILES) {
  const file = `src/practice/data/${name}.ts`;
  const src = fs.readFileSync(file, 'utf8');
  const held = await stockedPapers(PAPER_DIRS[name]);

  const topics = [];
  for (const m of src.matchAll(/name:\s*"([^"]+)",\s*\n\s*questions:\s*\[/g)) {
    topics.push({ name: m[1], start: m.index + m[0].length });
  }
  topics.forEach((t, i) => { t.end = i + 1 < topics.length ? topics[i + 1].start : src.length; });

  for (const t of topics) {
    const chunk = src.slice(t.start, t.end);
    const base = (chunk.match(/solutionUrl:\s*"(https:\/\/www\.maths\.scot\/[a-z0-9-]+\/[a-z0-9-]+)#/) || [])[1];
    if (!base) continue;

    // what we already carry in this topic
    const ours = new Set();
    for (const m of chunk.matchAll(/(?:ref|paper):\s*['"]([^'"]+)['"]/g)) {
      const n = normalise(m[1]);
      if (n) ours.add(n.key);
    }

    let html;
    try { html = await page(base); }
    catch (e) { console.log(`  ! ${base}: ${e.message}`); continue; }

    for (const his of hisQuestions(html)) {
      if (ours.has(his.key)) continue;
      // his page may credit a paper the archive does not stock
      const stocked = [...held].some(k => {
        const [y, p] = k.split('|');
        return y === his.year && (his.paper === null || String(p) === his.paper);
      });
      if (stocked) totalNew++; else totalUnstocked++;
      report.push({
        course: name, topic: t.name, ref: his.ref, credit: his.credit,
        solutionUrl: `${base}#${his.hash}`, stocked,
      });
    }
  }
}

fs.writeFileSync('scan-mathsscot-new.json', JSON.stringify(report, null, 1));

const byCourse = {};
for (const r of report) (byCourse[r.course] ??= []).push(r);

console.log('Past paper questions on maths.scot that our practice does not carry\n');
for (const [course, rows] of Object.entries(byCourse)) {
  console.log(`${course}  (${rows.filter(r => r.stocked).length} addable, ${rows.filter(r => !r.stocked).length} paper not in the archive)`);
  const byTopic = {};
  for (const r of rows) (byTopic[r.topic] ??= []).push(r);
  for (const [topic, list] of Object.entries(byTopic)) {
    console.log(`  ${topic}`);
    for (const r of list) {
      console.log(`     ${r.stocked ? '+' : '·'} ${r.ref.padEnd(16)} ${r.solutionUrl}${r.stocked ? '' : '   (paper not stocked)'}`);
    }
  }
  console.log();
}
console.log(`addable now: ${totalNew}`);
console.log(`his page credits a paper the archive does not hold: ${totalUnstocked}`);
console.log('\nwritten to scan-mathsscot-new.json — nothing has been changed');
