// Every LaTeX command in a question or answer must sit inside maths delimiters.
//
// A command written outside them never reaches KaTeX, so it prints its own
// source at the reader. N5 Applications 2024 P2 Q4 shipped an answer reading
//
//   Total area of 4 triangles = 4 \times (\frac{1}{2} \times 9 \times 7) = 126 m²
//
// with the line above and the line below both correctly wrapped. The page
// builds, returns 200 and throws nothing.
//
// check-rendered-math.mjs catches this on prerendered pages, but the Explorer,
// the worksheet and full screen build their content in the browser from the
// same data, so a fault that shows only there is invisible to it. This reads
// the source, which covers every surface at once.
//
// SCOPE, which took three attempts to get right:
//
//   - only `question:` and `answer:` values, because those are the strings
//     that go through lib/render-math.ts
//   - not the course notes, which pass LaTeX to <InlineMath math="..." /> as a
//     prop. KaTeX renders that directly and it needs no delimiters; treating
//     it as text reported 8,930 correct expressions as faults
//   - delimiters are consumed exactly as render-math consumes them, in its
//     order, including the single-dollar form the formulae files use. Guessing
//     instead flagged every formula sheet on the site
//
//   node scripts/check-latex-delimiters.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

function dataFiles() {
  const out = [];
  const walk = dir => {
    const full = path.join(ROOT, dir);
    if (!fs.existsSync(full)) return;
    for (const e of fs.readdirSync(full, { withFileTypes: true })) {
      const p = path.join(full, e.name);
      if (e.isDirectory()) {
        // notes pass LaTeX as component props, not as delimited strings
        if (e.name === 'notes') continue;
        walk(path.relative(ROOT, p));
        continue;
      }
      if (/\.(js|ts)$/.test(e.name)) out.push(path.relative(ROOT, p).replace(/\\/g, '/'));
    }
  };
  walk('src');
  return out;
}

const COMMANDS = [
  'frac', 'dfrac', 'tfrac', 'sqrt', 'times', 'cdot', 'div', 'pm', 'mp',
  'begin', 'end', 'left', 'right', 'sum', 'int', 'lim', 'infty',
  'sin', 'cos', 'tan', 'log', 'ln', 'pi', 'theta', 'alpha', 'beta', 'lambda',
  'le', 'ge', 'neq', 'approx', 'overrightarrow', 'vec', 'mathbb', 'text',
  'binom', 'circ', 'bullet', 'quad',
];
const CMD = new RegExp(String.raw`\\(${COMMANDS.join('|')})\b`, 'g');

/** Strip what render-math would consume, in its order. */
function leftovers(value) {
  let s = value
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/\\\([\s\S]*?\\\)/g, ' ')
    .replace(/\$[^$\n]+?\$/g, ' ');
  return s;
}

const faults = [];
const files = dataFiles();

for (const file of files) {
  const raw = fs.readFileSync(path.join(ROOT, file), 'utf8');

  // question: `...`  /  answer: `...`   — the fields render-math receives
  for (const m of raw.matchAll(/\b(question|answer)\s*:\s*`([^`]*)`/g)) {
    // a doubled backslash in source is one backslash at runtime
    const value = m[2].replace(/\\\\/g, '\\');
    const rest = leftovers(value);
    for (const c of rest.matchAll(CMD)) {
      const line = raw.slice(0, m.index).split('\n').length;
      faults.push({
        file, line, field: m[1], cmd: c[1],
        around: rest.slice(Math.max(0, c.index - 60), c.index + 60).replace(/\s+/g, ' ').trim(),
      });
    }
  }
}

if (!faults.length) {
  console.log(`LaTeX delimiters: ${files.length} content files, every command inside maths`);
  process.exit(0);
}

const byFile = {};
for (const f of faults) (byFile[f.file] ??= []).push(f);

console.log('FAILED — LaTeX outside maths delimiters, so it prints as source:\n');
for (const [file, list] of Object.entries(byFile)) {
  console.log(`  ${file}  (${list.length})`);
  for (const f of list.slice(0, 6)) console.log(`     line ${String(f.line).padStart(4)}  ${f.field}  \\${f.cmd}   …${f.around}…`);
  if (list.length > 6) console.log(`     …and ${list.length - 6} more`);
  console.log();
}
console.log(`total: ${faults.length}`);
process.exit(1);
