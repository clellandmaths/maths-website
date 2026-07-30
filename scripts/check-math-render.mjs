// Fixtures for the maths renderer. Run: node scripts/check-math-render.mjs
//
// Every case here is a fault that actually reached the site, or the behaviour
// that a fix must not break. Add a case whenever something renders wrongly, so
// it can only happen once.
//
// Tests lib/render-math directly — the same function the server pages and the
// client surfaces both use, so passing here means passing everywhere.
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, '..');

// Load the TS source through a tiny transform — no build step needed for a
// module that is plain functions.
const ts = await import('node:fs').then(fs =>
  fs.readFileSync(path.join(root, 'lib/render-math.ts'), 'utf8'));
const js = ts
  .replace(/^import katex from 'katex';/m, '')
  .replace(/export interface[\s\S]*?\n}\n/m, '')
  .replace(/: RenderMathOptions|: string|: boolean|: number/g, '')
  .replace(/export type[^\n]*\n/g, '')
  .replace(/export /g, '');
const katex = require('katex');
const renderMath = new Function('katex', `${js}; return renderMath;`)(katex);

let pass = 0;
const failures = [];

const check = (name, actual, assertion, detail) => {
  if (assertion) { pass++; return; }
  failures.push(`${name}\n     ${detail}\n     got: ${String(actual).slice(0, 160)}`);
};

// ── currency must never be treated as maths ──────────────────────
{
  const row = '<th>Price of silver ($)</th><th>Price of gold ($)</th>';
  const out = renderMath(row);
  check('currency pair in a table header',
    out, out === row, 'the row must pass through untouched, with no KaTeX');
}
{
  const s = '<p>The bag costs $12 and the hat costs $8 in total.</p>';
  const out = renderMath(s);
  check('two plain currency amounts on one line',
    out, !out.includes('katex'), 'nothing between the amounts may become maths');
}
{
  const s = '<p>Prices rose from $15.60 ($ per ounce) to $17.40.</p>';
  const out = renderMath(s);
  check('currency with a bracketed unit',
    out, !out.includes('katex'), 'no run here is maths');
}
// The coordinate rule below admits comma-separated single characters. These
// prove it cannot swallow money: a comma between two amounts is not a point.
{
  const s = '<p>It costs $5, or $7 with delivery.</p>';
  const out = renderMath(s);
  check('two amounts separated by a comma',
    out, !out.includes('katex'), '"5, or " is not a coordinate');
}
{
  const s = '<p>The prize was $1,000$ and change.</p>';
  const out = renderMath(s);
  check('thousands separator inside a dollar pair',
    out, !out.includes('katex'), '"1,000" has a two-digit term, so it is not a coordinate');
}
{
  const s = '<p>Tickets are $3, $4 and $5 each.</p>';
  const out = renderMath(s);
  check('three amounts in a list',
    out, !out.includes('katex'), 'no run between these is maths');
}

// ── maths carrying no operator at all ────────────────────────────
// These all reached the site. The guard used to list the marks of maths, so
// anything with no operator, command or brace was called prose and printed its
// own dollar signs — on the formulae lists, which every pupil opens.
{
  const out = renderMath('represents a circle centre $(a,b)$ and radius $r$.');
  check('coordinate pair in $…$',
    out, out.includes('katex') && !out.includes('$(a,b)$'),
    '$(a,b)$ must render as maths, not print its dollar signs');
}
{
  const out = renderMath('the points $(x, y)$ and $(p,q,r)$');
  check('spaced and three-term coordinates',
    out, !out.includes('$('), 'both must render');
}
{
  // Headed the derivative and integral tables in Higher and AH.
  const out = renderMath('<th>$f(x)$</th><th>$f\'(x)$</th>');
  check('function notation as a table heading',
    out, !out.includes('$f('), 'f(x) and f\'(x) must render');
}
{
  // The AH vector product determinant is 405 characters — it was refused by a
  // 400-character cap and shown to pupils as raw LaTeX.
  const long = '\\left| \\begin{matrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ '
    + 'a_1 & a_2 & a_3 \\\\ b_1 & b_2 & b_3 \\end{matrix} \\right|'.padEnd(340, ' ');
  const out = renderMath(`$${long}$`);
  check('formula longer than 400 characters',
    out, out.includes('katex'), 'length alone must not disqualify maths');
}

// ── maths that must NOT be re-classified as prose ────────────────
// Juxtaposed variables look like short words. Caught by sweeping the corpus:
// a first attempt at the prose rule broke all of these.
for (const [name, tex] of [
  ['trig with juxtaposed variables', '\\cos ax'],
  ['prism volume', 'V = Ah'],
  ['triangle area', 'A = \\frac{1}{2}ab \\sin C'],
  ['binomial coefficient', '\\binom{n}{r} = {}^nC_r'],
  ['spreadsheet variable name', 'Interest_Rate'],
]) {
  const out = renderMath(`the formula $${tex}$ here`);
  check(`${name} stays maths`,
    out, out.includes('katex'), `"${tex}" is maths, not a sentence`);
}

// ── the worksheet generator's $…$ must still work ────────────────
{
  const out = renderMath('the value is $x^2 + 3y$ exactly');
  check('genuine $…$ inline maths still renders',
    out, out.includes('katex'), 'a run with operators and powers is maths');
}
{
  const out = renderMath('let $x$ be positive');
  check('bare variable in $…$ still renders',
    out, out.includes('katex'), '$x$ is maths');
}

// ── \(…\) is unambiguous and always maths ────────────────────────
{
  const out = renderMath('Evaluate \\(\\frac{2}{5} + \\frac{1}{4}\\)');
  // KaTeX emits each fraction twice, once in MathML and once in HTML, so this
  // counts at least two rather than exactly two
  check('\\(…\\) fractions render',
    out, (out.match(/mfrac/g) ?? []).length >= 2, 'both fractions must render');
}
{
  const out = renderMath('cost is \\(\\$5\\) exactly');
  check('escaped dollar inside \\(…\\)',
    out, out.includes('katex'), 'maths containing a dollar sign still renders');
}

// ── display style, the reason fractions are legible ──────────────
{
  const on = renderMath('\\(\\frac{3x}{x^2-4x-5}\\)');
  const off = renderMath('\\(\\frac{3x}{x^2-4x-5}\\)', { displayStyle: false });
  check('displayStyle on by default',
    on, on !== off && on.length > off.length, 'default must differ from textstyle');
  check('displayStyle emits no literal "displaystyle" text',
    on, !/>displaystyle</.test(on) && !/mathdefault">d</.test(on),
    'a dropped backslash would set the word in italics');
}

// ── $$…$$ stays display mode ─────────────────────────────────────
{
  const out = renderMath('$$\\frac{a}{b}$$');
  check('$$…$$ renders as display mode',
    out, out.includes('katex-display'), 'must be centred block maths');
}

// ── malformed maths degrades, never throws ───────────────────────
{
  const out = renderMath('\\(\\frac{1}{\\)');
  check('broken LaTeX does not throw',
    out, typeof out === 'string' && out.length > 0, 'must return something renderable');
}

// ── images get lazy loading ──────────────────────────────────────
{
  const out = renderMath('<img src="/a.png">');
  check('images are lazy by default',
    out, out.includes('loading="lazy"'), 'off-screen diagrams must not block load');
}

console.log(`math renderer fixtures: ${pass} passed, ${failures.length} failed`);
for (const f of failures) console.log(`\n  FAIL ${f}`);
process.exit(failures.length ? 1 : 0);
