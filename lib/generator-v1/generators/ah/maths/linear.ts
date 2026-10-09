/**
 * Three equations in three unknowns, reduced as a paper's Gaussian elimination
 * reduces them: whole-number row operations to upper triangular form.
 *
 * Pure: given the augmented matrix, it returns every stage and the operation
 * that made it. It draws nothing and writes no sentences; `augmented` writes
 * a matrix's LaTeX.
 */
import { gcd } from './integer';
import { sum } from './format';

/** One row of an augmented matrix: [a, b, c, d] for ax + by + cz = d. */
export type Row = readonly number[];

/** `t` times `target` plus `o` times `other`, entry by entry. */
export const combine = (t: number, target: Row, o: number, other: Row): Row =>
  target.map((v, i) => t * v + o * other[i]);

export const det3 = (m: readonly Row[]): number =>
  m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
  - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
  + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

/** A row operation as a paper writes it: `R_2 - 2R_1`, `3R_3 + R_2`. */
export interface RowOp { row: number; t: number; with: number; o: number }
export const opText = (op: RowOp): string =>
  sum([{ coef: op.t, body: `R_${op.row}` }, { coef: op.o, body: `R_${op.with}` }]);

export interface Elimination {
  /** After clearing column 1 below a leading 1 in row 1. */
  first: Row[];
  firstOps: [RowOp, RowOp];
  /** After clearing row 3, column 2: upper triangular. */
  second: Row[];
  secondOp: RowOp;
}

/**
 * Reduce a system whose first row starts with 1, in the paper's two stages:
 * `R_2 - aR_1` and `R_3 - bR_1`, then `pR_3 - qR_2` with p and q the smallest
 * whole numbers that clear the entry (p positive). No row is divided, as the
 * papers' own working does not divide one (2026 P1 Q2 ends on -2z = 2).
 * Returns null when a stage would need a row swap: a zero pivot.
 */
export function eliminate(m: readonly Row[]): Elimination | null {
  if (m[0][0] !== 1) return null;
  const op2: RowOp = { row: 2, t: 1, with: 1, o: -m[1][0] };
  const op3: RowOp = { row: 3, t: 1, with: 1, o: -m[2][0] };
  const r2 = combine(1, m[1], -m[1][0], m[0]);
  const r3 = combine(1, m[2], -m[2][0], m[0]);
  if (r2[1] === 0 || r3[1] === 0) return null;
  const g = gcd(r2[1], r3[1]);
  let p = r2[1] / g, q = r3[1] / g;
  if (p < 0) { p = -p; q = -q; }
  const r3b = combine(p, r3, -q, r2);
  if (r3b[2] === 0) return null;
  return {
    first: [m[0], r2, r3],
    firstOps: [op2, op3],
    second: [m[0], r2, r3b],
    secondOp: { row: 3, t: p, with: 2, o: -q },
  };
}

/** An augmented matrix's LaTeX, as the scheme prints one. */
export function augmented(rows: readonly Row[]): string {
  const body = rows.map(r => `${r[0]} & ${r[1]} & ${r[2]} & ${r[3]}`).join('\\\\');
  return `\\left(\\begin{array}{ccc|c}${body}\\end{array}\\right)`;
}
