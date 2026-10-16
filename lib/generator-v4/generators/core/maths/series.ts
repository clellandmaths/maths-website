/**
 * Power series as exact coefficient lists, lowest power first: [1, 3, 9/2]
 * is 1 + 3x + 9/2 x².
 *
 * Pure: draws nothing and writes nothing (`format.series` writes one).
 */
import { type Q, q, add, mul, pow, ZERO } from './rational';

/** The Maclaurin series of e^{kx} up to x^n: kⁱ/i!. */
export function expSeries(k: number, n: number): Q[] {
  const out: Q[] = [];
  let factorial = 1n;
  for (let i = 0; i <= n; i++) {
    if (i > 0) factorial *= BigInt(i);
    out.push(q(pow(q(k), i).n, factorial));
  }
  return out;
}

/** The Maclaurin series of ln(1 + x) up to x^n: 0, 1, -1/2, 1/3, … */
export function log1pSeries(n: number): Q[] {
  const out: Q[] = [ZERO];
  for (let i = 1; i <= n; i++) out.push(q(i % 2 ? 1 : -1, i));
  return out;
}

/** The product of two series, kept up to x^n. */
export function mulSeries(a: readonly Q[], b: readonly Q[], n: number): Q[] {
  const out: Q[] = Array.from({ length: n + 1 }, () => ZERO);
  a.forEach((x, i) => b.forEach((y, j) => {
    if (i + j <= n) out[i + j] = add(out[i + j], mul(x, y));
  }));
  return out;
}
