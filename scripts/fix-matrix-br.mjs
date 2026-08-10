import fs from 'node:fs';

/**
 * Replace <br> used as a matrix row separator with the LaTeX row break.
 *
 * The practice data was imported with <br> between matrix rows:
 *
 *   \begin{pmatrix} -9 & 3<br>n & 4 \end{pmatrix}
 *
 * KaTeX has no idea what a <br> is inside maths and typesets it literally, so
 * a 2x2 matrix rendered on the live site as "(3 0 < br > lambda -2)" — the
 * rows collapsed onto one line with the tag shown as text. The past paper data
 * writes the same matrices with \\ and has always rendered correctly, which is
 * the spelling to match.
 *
 * Only <br> between \begin{...matrix} and \end{...matrix} is touched. The
 * 1,299 elsewhere are ordinary line breaks in prose and must stay.
 *
 *   node scripts/fix-matrix-br.mjs          # dry run
 *   node scripts/fix-matrix-br.mjs --write
 */

const WRITE = process.argv.includes('--write');
const FILES = [
  'src/practice/data/national5Maths.ts',
  'src/practice/data/higherMaths.ts',
  'src/practice/data/advancedHigherMaths.ts',
  'src/practice/data/national5Apps.ts',
  'src/practice/data/higherApps.ts',
];

// In the TypeScript source a LaTeX backslash is written doubled, so the row
// break \\ has to be spelled with four.
const ROW_BREAK = '\\\\\\\\ ';

let total = 0;
for (const file of FILES) {
  const src = fs.readFileSync(file, 'utf8');
  let count = 0;

  const out = src.replace(
    /\\\\begin\{(pmatrix|bmatrix|matrix|vmatrix)\}([\s\S]*?)\\\\end\{\1\}/g,
    (whole, env, body) => {
      if (!/<br\s*\/?>/.test(body)) return whole;
      const fixed = body.replace(/\s*<br\s*\/?>\s*/g, (m) => { count++; return ROW_BREAK; });
      return `\\\\begin{${env}}${fixed}\\\\end{${env}}`;
    }
  );

  if (count) {
    console.log(`  ${file.split('/').pop().padEnd(26)} ${count} row separator${count === 1 ? '' : 's'}`);
    if (WRITE) fs.writeFileSync(file, out);
  }
  total += count;
}

console.log(`\n${WRITE ? 'fixed' : 'would fix'}: ${total}`);
if (!WRITE) console.log('dry run — pass --write to apply');
