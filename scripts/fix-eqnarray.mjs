import fs from 'node:fs';

/**
 * Replace the eqnarray environment, which KaTeX does not implement.
 *
 * Three N5 simultaneous-equations questions were written with LaTeX's eqnarray:
 *
 *   \begin{eqnarray} &&2x &+& 3y &=& 4\\ &&3x &-& y &=& 17 \end{eqnarray}
 *
 * KaTeX has never supported it, so all three rendered as red error text with
 * the raw source showing — "No such environment: eqnarray" — on one of the
 * most-used National 5 topics.
 *
 * aligned is the KaTeX equivalent and the right environment for a pair of
 * simultaneous equations: one alignment point, at the equals sign. eqnarray's
 * column separators around the operators are dropped, since aligned does not
 * use them and they would print as extra gaps.
 *
 *   node scripts/fix-eqnarray.mjs          # dry run
 *   node scripts/fix-eqnarray.mjs --write
 */

const WRITE = process.argv.includes('--write');
const FILES = [
  'src/practice/data/national5Maths.ts',
  'src/practice/data/higherMaths.ts',
  'src/practice/data/advancedHigherMaths.ts',
  'src/practice/data/national5Apps.ts',
  'src/practice/data/higherApps.ts',
];

let total = 0;
for (const file of FILES) {
  if (!fs.existsSync(file)) continue;
  const src = fs.readFileSync(file, 'utf8');
  let count = 0;

  const out = src.replace(
    /\\\\begin\{eqnarray\}([\s\S]*?)\\\\end\{eqnarray\}/g,
    (_whole, body) => {
      count++;
      const fixed = body
        .replace(/&&/g, ' ')          // eqnarray's empty leading column
        .replace(/&\s*=\s*&/g, ' &= ') // the one alignment point aligned wants
        .replace(/&\s*([+\-])\s*&/g, ' $1 ')  // operators were column-separated
        .replace(/[ \t]{2,}/g, ' ');
      return `\\\\begin{aligned}${fixed}\\\\end{aligned}`;
    }
  );

  if (count) {
    console.log(`  ${file.split('/').pop()}  ${count} eqnarray block${count === 1 ? '' : 's'}`);
    if (WRITE) fs.writeFileSync(file, out);
  }
  total += count;
}

console.log(`\n${WRITE ? 'converted' : 'would convert'}: ${total}`);
if (!WRITE) console.log('dry run — pass --write to apply');
