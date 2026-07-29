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
