// Does a paper file actually DISPLAY correctly?
//
// The tag/image/build checks all passed on a file whose fractions were plain
// text and whose bullet lists had been flattened to commas — none of them look
// at presentation, so none of them could have caught it. This one does:
//
//   * every \(...\) run pushed through KaTeX with throwOnError, because
//     renderMath swallows failures into a red [Math Error] span that only shows
//     up if you look at the page
//   * unbalanced \( / \) delimiters, which print raw to pupils
//   * fractions still sitting in the text as "4/21"
//   * <sup>/&pi;/&frac markup where the house style is maths or a unicode glyph
//   * a list flattened onto one line ("calculate: the a, the b")
//
// Usage: node check-paper-markup.mjs <path-to-paper.js> <exportName> <expectedMarks>
import katex from 'katex';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [file, exportName, expectedMarks] = process.argv.slice(2);
if (!file || !exportName) {
  console.error('usage: node check-paper-markup.mjs <paper.js> <exportName> [expectedMarks]');
  process.exit(2);
}

const mod = await import(pathToFileURL(path.resolve(file)).href);
const paper = mod[exportName];
if (!paper) {
  console.error(`${exportName} is not exported by ${file}`);
  process.exit(2);
}

const OPEN = /\\\(([\s\S]*?)\\\)/g;
let problems = 0;
const flag = (q, msg) => { problems++; console.log(`  Q${q}  ${msg}`); };

let grand = 0;
for (const p of paper.papers) {
  let total = 0;
  let exprs = 0;
  console.log(`\nPaper ${p.paperNumber} — ${p.questions.length} questions`);

  p.questions.forEach((q, i) => {
    const n = i + 1;
    const html = `${q.question}\n${q.answer}`;
    total += (q.marks ?? []).reduce((a, b) => a + b, 0);

    for (const m of html.matchAll(OPEN)) {
      exprs++;
      try {
        // exactly what renderMath hands KaTeX for an inline run
        katex.renderToString(`\\displaystyle ${m[1].trim()}`, { throwOnError: true, trust: true });
      } catch (e) {
        flag(n, `KaTeX rejects  ${m[1].trim().slice(0, 60)}  → ${e.message.split('\n')[0].slice(0, 90)}`);
      }
    }

    const opens = (html.match(/\\\(/g) ?? []).length;
    const closes = (html.match(/\\\)/g) ?? []).length;
    if (opens !== closes) flag(n, `unbalanced maths delimiters: ${opens} open, ${closes} close`);

    // Deliberately NOT flagged: a bare < or > inside a maths run, and the
    // sentence's full stop typeset inside it. Both looked like defects on the
    // 2026 papers; both turned out to be how the whole site is written — 56
    // inequalities and 758 trailing stops across every course back to 2014,
    // all rendering correctly because renderMath hands the run to KaTeX before
    // the string is ever parsed as HTML. Flagging them would have churned the
    // 2026 papers into a style of their own for no gain to a pupil.

    const plain = html.match(/>\s*\d{1,3}\/\d{1,3}\s*</g);
    if (plain) flag(n, `fraction left as plain text: ${plain.join(', ')}`);

    if (/<sup>/.test(html)) flag(n, 'uses <sup> — house style is the unicode glyph (m³, cm³)');
    if (/&pi;|&frac|&radic;|&times;|&divide;/.test(html)) flag(n, 'HTML entity where maths is expected');

    // "calculate: the median, the upper and lower quartiles." — a bullet list
    // from the paper flattened onto one line
    if (/(calculate|find|state|work out)\s*:\s*(?!<)/i.test(q.question.replace(/<[^>]+>/g, m => m))) {
      const m = q.question.match(/(?:calculate|find|state|work out)\s*:\s*([^<]{10,})/i);
      if (m && /,/.test(m[1])) flag(n, `possible flattened bullet list: "…: ${m[1].slice(0, 70)}"`);
    }

    if (!q.videoId) flag(n, 'no videoId');
    if (!q.timestamp) flag(n, 'no timestamp');
    if (!q.topics?.length) flag(n, 'no topics');

    for (const src of [...html.matchAll(/<img[^>]*src="([^"]+)"/g)].map(m => m[1])) {
      if (!/\.webp$/.test(src)) flag(n, `image is not .webp: ${src}`);
      if (!/alt="[^"]{15,}"/.test(html.slice(html.indexOf(src)))) flag(n, `thin or missing alt text near ${src}`);
    }
  });

  console.log(`  marks: ${total} · maths expressions: ${exprs}`);
  grand += total;
}

if (expectedMarks && grand !== Number(expectedMarks)) {
  problems++;
  console.log(`\n  marks total is ${grand}, paper says ${expectedMarks}`);
}

console.log(problems ? `\nFAILED — ${problems} problem(s)` : `\nclean — ${grand} marks`);
process.exit(problems ? 1 : 0);
