/**
 * A full stop never goes after a closing maths delimiter.
 *
 *   node scripts/check-maths-punctuation.mjs
 *   node scripts/check-maths-punctuation.mjs --baseline
 *   node scripts/check-maths-punctuation.mjs --list <file substring>
 *
 * **This rule was learned the hard way in the app, not invented here.**
 * `Current Deployment/ARCHITECTURE.md` carries it as a CRITICAL RULE:
 *
 *   > MathJax renders inline \(...\) as an SVG span. On narrow screens
 *   > (~375px), a period placed *outside* the closing \) can wrap onto its own
 *   > line — an "orphaned period". The fix is to move the period **inside** the
 *   > closing delimiter.
 *   >
 *   > History: A bulk fix was applied in March 2026 to move 503 orphaned
 *   > periods inside \) across all existing data files.
 *
 * The website is a different renderer — KaTeX rather than MathJax — but the
 * mechanism is the same: the expression is one inline box, and anything after
 * it is a separate box that the line can break between. So the rule holds.
 *
 * **Why this check exists at all.** In September 2026 the website's 1,067
 * correctly-placed stops were read as a defect, on the grounds that a stop
 * inside the maths is set in KaTeX's serif rather than the body's sans, and a
 * scripted pass to move all of them OUT was very nearly proposed. That would
 * have recreated the March bug at twice the scale, and a render diff would
 * have called it a success — because the damage only appears on a narrow
 * screen, at a line break. This check is here so the rule is enforced rather
 * than rediscovered.
 *
 * **The serif stop is a real but separate issue**, and it is a FONT problem,
 * not a placement problem. If it is ever worth fixing, it is fixed in CSS.
 * Never by moving the character.
 *
 * **Commas are deliberately not enforced.** The app's rule speaks only of
 * periods, and the website is consistent the other way: 833 commas outside a
 * closing delimiter against 50 inside. Changing that would be inventing a rule
 * rather than enforcing one. The count is reported so the choice stays visible.
 *
 * Ratcheted, like check-responsive: today's violations are recorded and the
 * check fails only when the number goes UP. A check that is red on day one is
 * ignored within a week.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, relative, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');
const BASELINE = join(ROOT, 'scripts', 'maths-punctuation-baseline.json');

const WRITE = process.argv.includes('--baseline');
const listAt = process.argv.indexOf('--list');
const LIST = listAt !== -1 ? process.argv[listAt + 1] : null;

// In the question data a maths run closes with a backslash-escaped `\)`, which
// in the source file is two characters of backslash followed by ')'. Built
// from a char code so the pattern cannot be mangled by an editor or a patch
// script — this file is about punctuation next to backslashes, and writing
// those literally is how the bug gets reintroduced by the fix.
const B = String.fromCharCode(92);
const CLOSE = B + B + ')';

function scan(dir, out) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (!/node_modules|[.]next/.test(e.name)) scan(p, out);
      continue;
    }
    if (!/[.](js|ts|tsx)$/.test(e.name)) continue;
    const text = readFileSync(p, 'utf8');
    const rel = relative(ROOT, p).split(sep).join('/');
    let i = 0;
    let line = 1;
    let seen = 0;
    while ((i = text.indexOf(CLOSE, i)) !== -1) {
      // Track the line without splitting the whole file for every hit.
      while (seen < i) { if (text[seen] === '\n') line++; seen++; }
      const before = text[i - 1];
      const after = text[i + CLOSE.length];
      if (before === '.') out.stopInside++;
      if (before === ',') out.commaInside++;
      if (after === '.') {
        out.stopOutside.push({ file: rel, line, context: text.slice(Math.max(0, i - 46), i + CLOSE.length + 10) });
      }
      if (after === ',') out.commaOutside++;
      i += CLOSE.length;
    }
  }
  return out;
}

const found = scan(SRC, { stopInside: 0, commaInside: 0, commaOutside: 0, stopOutside: [] });
const byFile = {};
for (const h of found.stopOutside) byFile[h.file] = (byFile[h.file] || 0) + 1;

if (LIST) {
  const hits = found.stopOutside.filter((h) => h.file.includes(LIST));
  console.log(`\n  ${hits.length} full stops after a closing delimiter in files matching "${LIST}"\n`);
  for (const h of hits.slice(0, 40)) {
    console.log(`    ${h.file}:${h.line}`);
    console.log(`      ...${h.context.replace(/\n/g, ' ')}`);
  }
  if (hits.length > 40) console.log(`    ... and ${hits.length - 40} more`);
  process.exit(0);
}

console.log('\n  maths punctuation');
console.log(`    ${found.stopInside} full stops inside a closing delimiter   (correct — the app's rule)`);
console.log(`    ${found.stopOutside.length} full stops outside it                  (can orphan on a narrow screen)`);
console.log(`    ${found.commaOutside} commas outside, ${found.commaInside} inside          (not enforced — see the header)`);

if (WRITE) {
  const old = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, 'utf8')) : null;
  if (old && found.stopOutside.length > old.total) {
    console.error(`\n  REFUSING to record a worse baseline: ${found.stopOutside.length} against ${old.total} recorded.`);
    console.error('  A baseline is a burn-down. Fix them, or pass --force.\n');
    if (!process.argv.includes('--force')) process.exit(1);
  }
  writeFileSync(BASELINE, JSON.stringify({
    recordedAt: new Date().toISOString(),
    rule: 'a full stop belongs INSIDE the closing maths delimiter — see docs/maths-punctuation.md',
    total: found.stopOutside.length,
    byFile,
  }, null, 1) + '\n');
  console.log(`\n  recorded ${found.stopOutside.length} -> ${relative(ROOT, BASELINE)}\n`);
  process.exit(0);
}

if (!existsSync(BASELINE)) {
  console.log('\n  no baseline recorded. Run with --baseline, then this fails only on new ones.\n');
  process.exit(0);
}

const old = JSON.parse(readFileSync(BASELINE, 'utf8'));
const now = found.stopOutside.length;
console.log(`\n  against the baseline of ${old.total} (recorded ${old.recordedAt.slice(0, 10)}):`);

if (now > old.total) {
  console.error(`    ${now - old.total} NEW full stops after a closing delimiter\n`);
  // Name the files that grew, so the offender is found rather than hunted.
  for (const [file, n] of Object.entries(byFile).sort((a, b) => b[1] - a[1])) {
    const was = old.byFile[file] ?? 0;
    if (n > was) console.error(`      ${file}  ${was} -> ${n}`);
  }
  console.error('\n  Move the stop inside: `\\(x = 5.\\)` not `\\(x = 5\\).`');
  console.error('  Why: docs/maths-punctuation.md\n');
  process.exit(1);
}

if (now < old.total) {
  console.log(`    ${old.total - now} fixed — re-record with --baseline so they cannot come back`);
} else {
  console.log('    no change');
}
console.log('');
