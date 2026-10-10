/**
 * Exact rational numbers, over `bigint`.
 *
 * A generator's arithmetic is exact or it is wrong: `240/360*60` is
 * `40.000000000000006` in floating point, and a Paper 1 answer built from that
 * prints a decimal where the paper prints a whole number. Every coefficient a
 * card computes goes through here.
 *
 * Pure: draws nothing, formats nothing (`format.ts` writes the LaTeX).
 * Always in lowest terms with a positive denominator, so two equal values are
 * equal field for field.
 */
export interface Q {
  readonly n: bigint;
  readonly d: bigint;
}

const big = (v: number | bigint): bigint => {
  if (typeof v === 'bigint') return v;
  if (!Number.isInteger(v)) throw new Error(`rational: ${v} is not a whole number`);
  return BigInt(v);
};

const absB = (v: bigint): bigint => (v < 0n ? -v : v);

export function gcdB(a: bigint, b: bigint): bigint {
  a = absB(a); b = absB(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

/** n/d in lowest terms. Throws on a zero denominator. */
export function q(n: number | bigint, d: number | bigint = 1n): Q {
  let nn = big(n), dd = big(d);
  if (dd === 0n) throw new Error('rational: zero denominator');
  if (dd < 0n) { nn = -nn; dd = -dd; }
  const g = gcdB(nn, dd) || 1n;
  return { n: nn / g, d: dd / g };
}

export const ZERO: Q = q(0);
export const ONE: Q = q(1);

export const add = (a: Q, b: Q): Q => q(a.n * b.d + b.n * a.d, a.d * b.d);
export const sub = (a: Q, b: Q): Q => q(a.n * b.d - b.n * a.d, a.d * b.d);
export const mul = (a: Q, b: Q): Q => q(a.n * b.n, a.d * b.d);
export const div = (a: Q, b: Q): Q => {
  if (b.n === 0n) throw new Error('rational: division by zero');
  return q(a.n * b.d, a.d * b.n);
};
export const neg = (a: Q): Q => q(-a.n, a.d);

/** a to a whole-number power; a negative power inverts. */
export function pow(a: Q, k: number): Q {
  if (!Number.isInteger(k)) throw new Error(`rational: power ${k} is not whole`);
  if (k < 0) return pow(div(ONE, a), -k);
  let out = ONE;
  for (let i = 0; i < k; i++) out = mul(out, a);
  return out;
}

export const eq = (a: Q, b: Q): boolean => a.n === b.n && a.d === b.d;
export const isZero = (a: Q): boolean => a.n === 0n;
export const isInt = (a: Q): boolean => a.d === 1n;
export const sign = (a: Q): -1 | 0 | 1 => (a.n < 0n ? -1 : a.n > 0n ? 1 : 0);
export const abs = (a: Q): Q => q(absB(a.n), a.d);
export const cmp = (a: Q, b: Q): -1 | 0 | 1 => sign(sub(a, b));

/** The value as a float, for the checks' tolerances only. Never for output. */
export const toNumber = (a: Q): number => Number(a.n) / Number(a.d);
