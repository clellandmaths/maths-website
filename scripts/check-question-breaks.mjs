// A guided-practice question with several parts must break them onto lines.
//
// Nothing was broken here in the rendering sense — practice and past papers
// go through the same renderMath, and <br> works in both. It was authoring
// drift. The Applications courses were written to the convention (277 of 306
// Higher Apps questions carried breaks); the two maths courses had drifted,
// and 107 questions ran their parts together into a wall of text:
//
//   A complex number \(z=2-\sqrt{3}\,i\). (a) Write down the complex
//   conjugate \(\overline{z}\). (b) Find \(z\overline{z}\).
//
// The convention, which 44 of the 71 multi-part questions already followed:
//
//   stem<br>(a) first part<br>(b) second part
//
// This fails the build on a question that has parts or a separate instruction
// and no break between them, so the drift cannot start again.
//
//   node scripts/check-question-breaks.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIR = path.join(ROOT, 'src/practice/data');

const INSTRUCTION = String.raw`Find|Determine|Show|Calculate|Express|State|Hence|Obtain|Write|Solve|Evaluate|Prove|Use|Explain|Justify|Interpret|Simplify|Differentiate|Integrate|Sketch|Deduce|Describe|Verify|Given|What|Why|Is|By|If|Make|Estimate|For|How|Identify|Give`;

/**
 * Text as the reader meets it.
 *
 * Maths collapses to a single token so that \(f(a)\) is not read as part (a)
 * and a decimal point is not read as a sentence end. A span whose own last
 * character is a full stop keeps that stop visible, because the house style
 * folds terminal punctuation into the trailing maths:
 *
 *   Its area is less than \(30\) cm\(^2.\) Find the range of …
 */
function plain(v) {
  return v
    .replace(/\\\\\([\s\S]*?\\\\\)/g, m => (/[.?]\s*\\\\\)$/.test(m) ? ' M. ' : ' M '))
    .replace(/\$\$[\s\S]*?\$\$/g, ' M ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const faults = [];
let questions = 0;

for (const file of fs.readdirSync(DIR).filter(f => /\.ts$/.test(f))) {
  const raw = fs.readFileSync(path.join(DIR, file), 'utf8');

  for (const m of raw.matchAll(/\b(question|answer)\s*:\s*`([^`]*)`/g)) {
    const field = m[1];
    const value = m[2];
    if (field === 'question') questions++;
    if (/<br\s*\/?>|<\/p>|<\/li>/i.test(value)) continue;

    const text = plain(value);
    const letters = [...text.matchAll(/(?:^|\s)\(([a-e])\)(?=\s)/g)].map(x => x[1]);
    const multiPart = new Set(letters).size >= 2;

    // An answer's parts go on their own lines, as the past papers write them,
    // but a second sentence there is usually a working step that reads
    // correctly on one line — so only questions get the instruction rule.
    const splitInstruction = field === 'question'
      && new RegExp(String.raw`[.?]\s+(?:${INSTRUCTION})\b`).test(text);

    if (!multiPart && !splitInstruction) continue;

    faults.push({
      file, line: raw.slice(0, m.index).split('\n').length,
      why: multiPart
        ? `${field}: ${new Set(letters).size} parts on one line`
        : 'question: instruction runs on from the stem',
      text: text.slice(0, 150),
    });
  }
}

if (!faults.length) {
  console.log(`question breaks: ${questions} practice questions and their answers, parts and instructions on their own lines`);
  process.exit(0);
}

console.log('FAILED — practice questions running together:\n');
for (const f of faults) {
  console.log(`  ${f.file}:${f.line}  ${f.why}`);
  console.log(`      ${f.text}…\n`);
}
console.log(`total: ${faults.length}`);
console.log('\nconvention:  stem<br>(a) first part<br>(b) second part');
process.exit(1);
