/**
 * Writing numbers and terms as a paper prints them.
 *
 * The rules, each a way a machine-written question gives itself away:
 *
 * - a coefficient of 1 is not written (`x`, not `1x`), and of -1 is a sign
 *   (`-x`);
 * - a term never follows `+ -` (`x - 3`, not `x + -3`);
 * - a zero term is left out, and an expression with none left is `0`;
 * - a fraction is `\frac{}{}` with its sign outside (`-\frac{2}{3}x`);
 * - powers are braced (`x^{2}`), so a two-digit power cannot come out as
 *   `x^12` meaning x¹ then 2.
 *
 * Pure: draws nothing. A card's wording lives in its routine; this only writes
 * the maths inside it. Output is LaTeX without the `$` delimiters.
 */
import { type Q, abs, isInt, isZero, q, sign } from './rational';

const asQ = (c: Q | number): Q => (typeof c === 'number' ? q(c) : c);

/** A number on its own: `3`, `-3`, `\frac{2}{3}`, `-\frac{2}{3}`. */
export function num(c: Q | number): string {
  const v = asQ(c);
  const s = sign(v) < 0 ? '-' : '';
  const a = abs(v);
  return isInt(a) ? `${s}${a.n}` : `${s}\\frac{${a.n}}{${a.d}}`;
}

/** `x`, `x^{2}`, or `''` for the constant term. */
export function power(variable: string, k: number): string {
  if (k === 0) return '';
  if (k === 1) return variable;
  return `${variable}^{${k}}`;
}

/** One term: a coefficient and what it multiplies. */
export interface Term {
  coef: Q | number;
  /** What the coefficient multiplies: `x^{2}`, `e^{3x}`, `\sin 2x`, or `''`. */
  body: string;
}

/** A coefficient in front of a body, sign included: `3x`, `-x`, `\frac{1}{2}x^{2}`, `5`. */
function signedTerm(coef: Q, body: string): string {
  if (!body) return num(coef);
  const a = abs(coef);
  const s = sign(coef) < 0 ? '-' : '';
  if (isInt(a) && a.n === 1n) return `${s}${body}`;
  return `${s}${num(a)}${body}`;
}

/**
 * Terms joined as a paper joins them: `x^{2} - 3x + 2`. Zero terms are
 * dropped, in the order given; no terms left is `0`.
 */
export function sum(terms: readonly Term[]): string {
  const kept = terms.map(t => ({ coef: asQ(t.coef), body: t.body })).filter(t => !isZero(t.coef));
  if (!kept.length) return '0';
  return kept.map((t, i) => {
    const text = signedTerm(t.coef, t.body);
    if (i === 0) return text;
    return text.startsWith('-') ? ` - ${text.slice(1)}` : ` + ${text}`;
  }).join('');
}

/**
 * A polynomial from its coefficients, highest power first:
 * `poly([1, -3, 2], 'x')` is `x^{2} - 3x + 2`.
 */
export function poly(coefs: readonly (Q | number)[], variable = 'x'): string {
  const top = coefs.length - 1;
  return sum(coefs.map((c, i) => ({ coef: c, body: power(variable, top - i) })));
}

/**
 * A multiple of π as a paper writes an angle: `\frac{5\pi}{6}`, `-\frac{\pi}{6}`,
 * `\frac{\pi}{2}`, `\pi`, `0`. The multiple is given as a rational.
 */
export function piTimes(c: Q | number): string {
  const v = asQ(c);
  if (isZero(v)) return '0';
  const s = sign(v) < 0 ? '-' : '';
  const a = abs(v);
  const top = a.n === 1n ? '\\pi' : `${a.n}\\pi`;
  return a.d === 1n ? `${s}${top}` : `${s}\\frac{${top}}{${a.d}}`;
}

/** A factor in brackets unless it is a single symbol: `(x - 3)`, `x`. */
export function bracket(expr: string): string {
  return /^[a-z]$/i.test(expr) ? expr : `(${expr})`;
}

/**
 * A power series, lowest power first: `series([1, 3, q(9, 2)])` is
 * `1 + 3x + \frac{9}{2}x^{2}`. Zero terms are left out, as `sum` does.
 */
export function series(coefs: readonly (Q | number)[], variable = 'x'): string {
  return sum(coefs.map((c, i) => ({ coef: c, body: power(variable, i) })));
}

/**
 * Terms already written, each maybe opening with `-`, joined as a paper joins
 * them: `['x^{8}', '-20x^{5}', '\frac{625}{x^{4}}']` is
 * `x^{8} - 20x^{5} + \frac{625}{x^{4}}`. For terms `sum` cannot write, such as
 * a number over a power.
 */
export function joinTerms(texts: readonly string[]): string {
  return texts.map((t, i) => {
    if (i === 0) return t;
    return t.startsWith('-') ? ` - ${t.slice(1)}` : ` + ${t}`;
  }).join('');
}

/** √k, or its whole root when k is a square: `\sqrt{14}`, `3`. */
export function sqrtOf(k: number): string {
  const r = Math.round(Math.sqrt(k));
  return r * r === k ? String(r) : `\\sqrt{${k}}`;
}

/**
 * A rational as a decimal to at most `dp` places: exact when it ends by then
 * (`219`, `44.0625` at 4), otherwise cut short with an ellipsis, as a pupil
 * writes a calculator display (`13.29\ldots`).
 */
export function decimal(c: Q | number, dp: number): string {
  const v = asQ(c);
  const s = sign(v) < 0 ? '-' : '';
  const a = abs(v);
  const scale = 10n ** BigInt(dp);
  const scaled = (a.n * scale) / a.d;
  const exact = (a.n * scale) % a.d === 0n;
  const whole = scaled / scale;
  let frac = (scaled % scale).toString().padStart(dp, '0');
  if (exact) frac = frac.replace(/0+$/, '');
  const text = frac ? `${whole}.${frac}` : `${whole}`;
  return `${s}${text}${exact ? '' : '\\ldots'}`;
}

/**
 * A calculator value that cannot be exact (a logarithm, an angle), cut to
 * `dp` places with an ellipsis: `13.29\ldots`. Only for irrational results on
 * a calculator paper; anything rational goes through `decimal`.
 */
export function truncated(x: number, dp: number): string {
  const scale = 10 ** dp;
  const t = Math.trunc(x * scale) / scale;
  return `${t.toFixed(dp)}\\ldots`;
}

/** A value rounded to `dp` places, as a paper asks: `19.1`. */
export const rounded = (x: number, dp: number): string => x.toFixed(dp);
