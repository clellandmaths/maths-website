// No page may ship maths that failed to render.
//
// Two of these reached the live site and sat there, because nothing catches
// them: the page builds, returns 200, throws no error, and is simply wrong on
// screen.
//
//   <br> used as a matrix row separator, so KaTeX typeset the tag and a 2x2
//   matrix printed as "( 3 0 < br > lambda -2 )" — Advanced Higher Matrices,
//   live for twelve days.
//
//   \begin{eqnarray}, which KaTeX has never implemented, so three National 5
//   simultaneous-equations questions printed as red raw LaTeX.
//
// check:math already exists but tests the renderer against fixtures. This
// tests the actual built pages, which is where the faults were.
//
// Runs after next build, so it reads out/ rather than the source.
//
//   node scripts/check-rendered-math.mjs
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'out/course';
if (!fs.existsSync(OUT)) {
  console.log('no out/course — run next build first');
  process.exit(0);
}

/**
 * Text a reader actually sees.
 *
 * KaTeX emits a hidden MathML copy of every expression alongside the visual
 * one; leaving it in would double every count and, worse, report the LaTeX
 * inside <annotation> as though it had failed to render.
 */
function visible(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<span class="katex-mathml"[\s\S]*?<\/span><span class="katex-html"/g, '<span class="katex-html"')
    .replace(/<annotation[\s\S]*?<\/annotation>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

const CHECKS = [
  ['KaTeX could not parse it', h => (h.match(/class="[^"]*katex-error/g) || []).length],
  ['an HTML tag was typeset as maths', h => (visible(h).match(/<\s*(br|p|b|i|div|span)\s*\/?\s*>/gi) || []).length],
  ['maths delimiters never ran', h => (visible(h).match(/\\\(|\\\)|\\\[|\\\]/g) || []).length],
  ['a control sequence printed as text', h => (visible(h).match(/\\(frac|begin|end|sqrt|left|right|times|cdot)\b/g) || []).length],
];

const faults = [];
let pages = 0;

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { walk(p); continue; }
    if (!e.name.endsWith('.html')) continue;
    pages++;
    const html = fs.readFileSync(p, 'utf8');
    for (const [name, fn] of CHECKS) {
      const n = fn(html);
      if (n > 0) faults.push({ page: p.replace(/\\/g, '/').replace('out/course/', ''), name, n });
    }
  }
}

for (const course of fs.readdirSync(OUT, { withFileTypes: true })) {
  if (!course.isDirectory()) continue;
  for (const section of ['practice', 'notes', 'papers']) {
    const dir = path.join(OUT, course.name, section);
    if (fs.existsSync(dir)) walk(dir);
  }
}

console.log(`rendered maths: ${pages} pages checked`);
if (!faults.length) {
  console.log('  every expression rendered');
  process.exit(0);
}

console.log('\nFAILED — maths that did not render:\n');
for (const f of faults) console.log(`  ${String(f.n).padStart(4)}  ${f.name}\n        ${f.page}`);
process.exit(1);
