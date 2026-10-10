/**
 * Whole-number helpers. Pure: they draw nothing and write nothing.
 */

/** The greatest common divisor of two whole numbers, always 0 or positive. */
export function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

/** Whether two whole numbers share no factor but 1. */
export const coprime = (a: number, b: number): boolean => gcd(a, b) === 1;

/** n choose k: the binomial coefficient, 0 outside 0 ≤ k ≤ n. */
export function binom(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let r = 1;
  // Each partial product is itself a binomial coefficient, so it stays whole.
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
}

/** A whole number's digits in a base, most significant first: `digits(497, 9)` is [6, 1, 2]. */
export function digits(n: number, base: number): number[] {
  if (!Number.isInteger(n) || n < 0 || base < 2) throw new Error(`digits: ${n} in base ${base}`);
  if (n === 0) return [0];
  const out: number[] = [];
  for (let v = n; v > 0; v = Math.floor(v / base)) out.unshift(v % base);
  return out;
}

/** A number from its digits in a base: `fromDigits([3, 4, 4, 2], 5)` is 497. */
export const fromDigits = (ds: readonly number[], base: number): number =>
  ds.reduce((v, d) => v * base + d, 0);

/** One line of the Euclidean algorithm: `a = q × b + r`. */
export interface EuclidRow { a: number; q: number; b: number; r: number }

/** The Euclidean algorithm on two positive whole numbers, every line down to the remainder 0. */
export function euclid(a: number, b: number): EuclidRow[] {
  if (!(a > 0 && b > 0)) throw new Error(`euclid: ${a} and ${b}`);
  const rows: EuclidRow[] = [];
  let [x, y] = a >= b ? [a, b] : [b, a];
  while (y > 0) {
    const r = x % y;
    rows.push({ a: x, q: Math.floor(x / y), b: y, r });
    [x, y] = [y, r];
  }
  return rows;
}
