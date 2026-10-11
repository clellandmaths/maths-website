/**
 * 2 by 2 matrices over exact rationals, and their LaTeX.
 *
 * Pure: draws nothing and writes no sentences.
 */
import { type Q, q, sub, mul, div, neg } from './rational';
import { num } from './format';

export type M2 = readonly [readonly [Q, Q], readonly [Q, Q]];

const asQ = (v: Q | number): Q => (typeof v === 'number' ? q(v) : v);

/** A matrix from whole numbers or rationals, row by row. */
export const m2 = (a: Q | number, b: Q | number, c: Q | number, d: Q | number): M2 =>
  [[asQ(a), asQ(b)], [asQ(c), asQ(d)]];

export const det2 = (m: M2): Q => sub(mul(m[0][0], m[1][1]), mul(m[0][1], m[1][0]));

/** The adjugate: the diagonal swapped, the other two negated. */
export const adj2 = (m: M2): M2 => [[m[1][1], neg(m[0][1])], [neg(m[1][0]), m[0][0]]];

/** The inverse. Throws on a singular matrix. */
export function inverse2(m: M2): M2 {
  const d = det2(m);
  const a = adj2(m);
  return [[div(a[0][0], d), div(a[0][1], d)], [div(a[1][0], d), div(a[1][1], d)]];
}

/** `\begin{pmatrix}a & b\\c & d\end{pmatrix}`; an entry may be LaTeX already (`x`). */
export function pmatrix(m: readonly (readonly (Q | number | string)[])[]): string {
  const cell = (v: Q | number | string) => (typeof v === 'string' ? v : num(v));
  return `\\begin{pmatrix}${m.map(r => r.map(cell).join(' & ')).join('\\\\')}\\end{pmatrix}`;
}
