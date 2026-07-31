// Positive control for check-paper-markup.mjs.
//
// A checker that reports "clean" is only worth the errors it has been shown to
// catch. This plants one defect of each class it claims to detect into a real
// paper file and asserts the checker fails on every one — then asserts it still
// passes on the untouched file.
//
// Usage: node scripts/selftest-paper-markup.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const SRC = path.join(root, 'src/n5apps/n5apps2026P1.js');
const PROBE = path.join(root, 'src/n5apps/__markup_probe.js');
const original = fs.readFileSync(SRC, 'utf8');

const plants = [
  ['fraction left as plain text', s => s.replace('have had a dose.</p>', 'have had a dose.</p><p>4/21</p>')],
  ['KaTeX syntax error',          s => s.replace('\\\\frac{2}{3}\\\\)', '\\\\frac{2}{3\\\\)')],
  ['unbalanced delimiters',       s => s.replace('of his sheep a dose', 'of \\\\( his sheep a dose')],
  ['<sup> instead of glyph',      s => s.replace('54 m³', '54 m<sup>3</sup>')],
  ['HTML entity for maths',       s => s.replace('\\\\(\\\\pi=3.14\\\\)', '&pi; = 3.14')],
  ['flattened bullet list',       s => s.replace(
      /<p>\(a\) For this data, calculate:<\/p>[\s\S]*?<\/ul>/,
      '<p>(a) For this data, calculate: the median, the upper and lower quartiles.</p>')],
  ['wrong marks total',           s => s.replace('marks: [3],', 'marks: [4],')],
  ['missing videoId',             s => s.replace('videoId: "y8NNGijXZ3o",\n          timestamp: "47s"', 'timestamp: "47s"')],
  ['png instead of webp',         s => s.replace('2026_P1_Q1.webp', '2026_P1_Q1.png')],
];

/** Run the checker on the probe file. Returns true when it FAILS (exit != 0). */
function checkerRejects() {
  try {
    execFileSync(process.execPath,
      [path.join(root, 'scripts/check-paper-markup.mjs'), PROBE, 'probePaper', '35'],
      { cwd: root, stdio: 'pipe' });
    return false;
  } catch {
    return true;
  }
}

let failures = 0;

// Negative control: the untouched file must pass, or every plant below is
// "caught" for the wrong reason.
fs.writeFileSync(PROBE, original.replace('n5AppsMaths2026P1', 'probePaper'));
if (checkerRejects()) {
  console.log('NEGATIVE CONTROL FAILED — the checker rejects the clean file');
  failures++;
} else {
  console.log('clean file passes ✓');
}

for (const [name, mutate] of plants) {
  const mutated = mutate(original);
  if (mutated === original) {
    console.log(`NOT APPLIED  ${name} — the plant matched nothing, so it proves nothing`);
    failures++;
    continue;
  }
  fs.writeFileSync(PROBE, mutated.replace('n5AppsMaths2026P1', 'probePaper'));
  if (checkerRejects()) {
    console.log(`caught ✓      ${name}`);
  } else {
    console.log(`MISSED ✗      ${name}`);
    failures++;
  }
}

fs.unlinkSync(PROBE);
console.log(failures ? `\nself-test FAILED (${failures})` : '\nself-test passed — every planted defect was caught');
process.exit(failures ? 1 : 0);
