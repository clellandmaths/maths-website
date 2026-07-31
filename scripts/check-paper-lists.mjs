// Does the paper file have as many list items as the exam paper has bullets?
//
// This exists because reading the PDF text was not enough. The extractor
// concatenates runs at a line break, so a bulleted list arrives as
// "calculate:the medianthe upper and lower quartiles." and gets written into a
// paper file as one comma-joined sentence. I fixed one such list in N5 Apps
// 2026 P1 and reported the paper clean; the PDF actually had four, and the N5
// paper had two more that nothing had flagged.
//
// The bullet is a real character — \225 (•) in WinAnsi — so it can be counted
// rather than inferred. Some bullets are drawn from a CID font instead and
// cannot be counted, so the file legitimately has a few MORE items than the
// count; fewer is the direction that means a list was flattened.
//
// The PDFs live in reference/, which is gitignored, so this is a tool to run
// while building a paper rather than part of `npm run build`.
//
// Usage: node scripts/check-paper-lists.mjs <paper.pdf> <paper.js> <exportName> [paperNumber]
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { pathToFileURL } from 'node:url';

const [pdfPath, jsPath, exportName, paperNumber] = process.argv.slice(2);
if (!pdfPath || !jsPath || !exportName) {
  console.error('usage: node scripts/check-paper-lists.mjs <paper.pdf> <paper.js> <exportName> [paperNumber]');
  process.exit(2);
}

/** Count • glyphs in the PDF's content streams. */
function bulletsInPdf(file) {
  const buf = fs.readFileSync(file);
  const raw = buf.toString('latin1');
  let count = 0, streams = 0, letters = 0;
  const re = /stream\r?\n/g;
  let m;
  while ((m = re.exec(raw))) {
    const s = m.index + m[0].length;
    const e = raw.indexOf('endstream', s);
    if (e < 0) continue;
    let c;
    try { c = zlib.inflateSync(buf.subarray(s, e)).toString('latin1'); } catch { continue; }
    // A real content stream sets a font and opens a text object. Testing for
    // "Tj" alone matched decompressed IMAGE data — two bytes of a scan can
    // spell Tj — which made a pure scan look like 60,000 characters of text
    // and let it pass this check silently.
    if (!/\bBT\b/.test(c) || !/\/[A-Za-z0-9_]+\s+[\d.]+\s+Tf/.test(c)) continue;
    streams++;
    for (const t of c.matchAll(/\(((?:[^()\\]|\\[\s\S])*)\)/g)) {
      letters += (t[1].match(/[A-Za-z]/g) ?? []).length;
      count += (t[1].match(/\\225/g) ?? []).length;
    }
  }
  return { count, streams, letters };
}

const { count: pdfBullets, streams, letters } = bulletsInPdf(pdfPath);

const mod = await import(pathToFileURL(path.resolve(jsPath)).href);
const paper = mod[exportName];
if (!paper) { console.error(`${exportName} not exported by ${jsPath}`); process.exit(2); }

// One PDF is one paper, but a data file often holds both. Counting across the
// whole file compares P1's bullets against P1+P2's list items and passes a
// flattened list without noticing.
const papers = paperNumber
  ? paper.papers.filter(p => String(p.paperNumber) === String(paperNumber))
  : paper.papers;
if (!papers.length) { console.error(`no paper ${paperNumber} in ${exportName}`); process.exit(2); }
if (paper.papers.length > 1 && !paperNumber) {
  console.error(`${exportName} holds ${paper.papers.length} papers — pass a paperNumber so the comparison is like for like`);
  process.exit(2);
}

let items = 0, uls = 0, ols = 0;
const perQuestion = [];
for (const p of papers) {
  p.questions.forEach((q, i) => {
    const html = q.question ?? '';
    const li = (html.match(/<li>/g) ?? []).length;
    const ul = (html.match(/<ul\b/g) ?? []).length;
    const ol = (html.match(/<ol\b/g) ?? []).length;
    items += li; uls += ul; ols += ol;
    if (li) perQuestion.push(`P${p.paperNumber} Q${i + 1}: ${li} item(s) in ${ul} <ul> + ${ol} <ol>`);
  });
}

console.log(`${path.basename(pdfPath)}${paperNumber ? `  →  paper ${paperNumber}` : ''}`);
if (letters < 500) {
  console.log(`  the PDF has almost no extractable text (${letters} letters over ${streams} content streams)`);
  console.log('  it is a scan — bullets cannot be counted, so this check proves nothing here');
  process.exit(0);
}
console.log(`  bullets (\\225) in the paper: ${pdfBullets}`);
console.log(`  list items in the file:      ${items}   (${uls} <ul>, ${ols} <ol>)`);
for (const line of perQuestion) console.log(`     ${line}`);

if (items < pdfBullets) {
  console.log(`\n  FAILED — the paper bullets ${pdfBullets} points but the file lists only ${items}.`);
  console.log('  A list has been flattened. Find it with:  ORDER=1 node pdf-layout.mjs <paper.pdf>');
  process.exit(1);
}
console.log(items === pdfBullets
  ? '\n  ok — every bullet in the paper is a list item in the file'
  : `\n  ok — file has ${items - pdfBullets} more item(s) than countable bullets (CID-drawn bullets, or an <ol>)`);
