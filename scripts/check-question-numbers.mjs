// Does every past-paper question yield the number the exam prints?
//
// N5 Applications and Advanced Higher papers are split into one entry per part
// where the topic changes, so N5 Apps 2026 Paper 2 is 17 entries but 7
// questions. Counting entries told a pupil they were on "question 9 of 17"
// while their booklet said 6(b), and there is no question 9.
//
// The number is read off the label span. That is only safe if the label is
// really there and really parses, so this checks all of them, and unit-tests
// the parser on the shapes the data actually contains — including the two the
// obvious regex gets wrong:
//
//   "Specimen Q4"                 Higher Apps has no year in its label
//   "…nowrap;">1.5 metres.</span> a second nowrap span mid-question, which a
//                                 "first span in the HTML" rule would grab
//
// Run: node scripts/check-question-numbers.mjs
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { questionNumber, lastQuestionNumber, isWholePaper } from '../lib/question-number.ts';

const root = path.resolve(import.meta.dirname, '..');
let failures = 0;
const fail = msg => { failures++; console.log(`  FAIL  ${msg}`); };
const label = (text) => `<small><strong><span style="white-space: nowrap;">${text}</span></strong></small><p>body</p>`;

// ------------------------------------------------------------- unit tests
const CASES = [
  ['2026 P2 Q6(b)-(c)', '6(b)-(c)'],
  ['2026 P1 Q13', '13'],
  ['2016 Q10', '10'],                  // AH single-paper years, no P
  ['Specimen Q4', '4'],                // Higher Apps
  ['2023 P2 Q5 (a), (b)', '5 (a), (b)'],
  ['2024 P2 Q8(a) & (b)', '8(a) & (b)'],
  ['2021 P2 Q9(a) and (b)', '9(a) and (b)'],
  ['2018 P2 Q6 & Q7', '6 & 7'],        // the "& Q" tidy-up
];
console.log('parser:');
for (const [text, expected] of CASES) {
  const got = questionNumber(label(text));
  if (got !== expected) fail(`"${text}" → ${JSON.stringify(got)}, expected ${JSON.stringify(expected)}`);
}

// A second nowrap span inside the body must not be mistaken for the label.
const decoy = `<small><strong><span style="white-space: nowrap;">2026 P1 Q3</span></strong></small>` +
              `<p>The pipe is <span style="white-space: nowrap;">1.5 metres.</span> long</p>`;
if (questionNumber(decoy) !== '3') fail(`decoy span: got ${JSON.stringify(questionNumber(decoy))}, expected "3"`);
// and a question with no label at all yields null rather than nonsense
if (questionNumber('<p>no label here</p>') !== null) fail('unlabelled question should give null');

// isWholePaper decides whether to count in exam numbering at all. If it simply
// returned true it would relabel hand-picked worksheets too, so prove it says
// no to the three ways a set can fail to be a paper.
const q = (year, paperNumber, questionIndex) => ({ year, paperNumber, questionIndex });
if (!isWholePaper([q(2026, 2, 0), q(2026, 2, 1), q(2026, 2, 2)])) fail('a contiguous paper should be recognised');
if (isWholePaper([q(2026, 2, 0), q(2026, 2, 3)])) fail('gaps in the sequence are a worksheet, not a paper');
if (isWholePaper([q(2026, 1, 0), q(2026, 2, 1)])) fail('mixed paper numbers are a worksheet');
if (isWholePaper([q(2025, 2, 0), q(2026, 2, 1)])) fail('mixed years are a worksheet');
if (isWholePaper([q(2026, 2, 0)])) fail('a single question is not a paper');

if (!failures) console.log(`  ${CASES.length + 7} cases pass`);

// ---------------------------------------------------------------- the data
const dirs = ['src/n5/pastpapers', 'src/higher/pastpapers', 'src/ah/pastpapers', 'src/n5apps', 'src/higherapps'];
let total = 0, split = 0;
const papers = [];

for (const d of dirs) {
  const dir = path.join(root, d);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
    let mod;
    try { mod = await import(pathToFileURL(path.join(dir, f)).href); } catch { continue; }
    for (const v of Object.values(mod)) {
      if (!v?.papers) continue;
      for (const p of v.papers) {
        const numbers = [];
        p.questions.forEach((q, i) => {
          total++;
          const n = questionNumber(q.question);
          if (n === null) { fail(`${f} ${v.year} P${p.paperNumber} Q${i + 1}: no readable label`); return; }
          if (/^\d{4}|^P\d|^Q/i.test(n)) fail(`${f} ${v.year} P${p.paperNumber} entry ${i + 1}: "${n}" still carries its prefix`);
          numbers.push(n);
        });
        const flat = p.questions.map((q, i) => ({ year: v.year, paperNumber: p.paperNumber, questionIndex: i }));
        const last = lastQuestionNumber(p.questions, p.questions.length);
        const isSplit = String(p.questions.length) !== last;
        if (isSplit) split++;
        if (!isWholePaper(flat)) fail(`${f} ${v.year} P${p.paperNumber}: not recognised as a whole paper`);
        papers.push({ where: `${v.year} P${p.paperNumber}`, entries: p.questions.length, last, isSplit, first: numbers[0] });
      }
    }
  }
}

console.log(`\nquestions: ${total}`);
console.log(`papers where entries ≠ printed questions: ${split}`);
for (const p of papers.filter(p => p.isSplit)) {
  console.log(`   ${p.where.padEnd(12)} ${String(p.entries).padStart(2)} entries → "Question … of ${p.last}"`);
}

if (failures) {
  console.log(`\nquestion number check FAILED (${failures})`);
  process.exit(1);
}
console.log('\nevery question yields the number its paper prints');
