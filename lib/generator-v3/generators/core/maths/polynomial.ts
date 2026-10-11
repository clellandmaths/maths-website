/**
 * Polynomials as coefficient lists, highest power first: [1, -4, 5] is
 * z² - 4z + 5. Whole-number coefficients; pure, draws nothing.
 */

/** The product of two polynomials. */
export function mulPoly(a: readonly number[], b: readonly number[]): number[] {
  const out = new Array<number>(a.length + b.length - 1).fill(0);
  a.forEach((x, i) => b.forEach((y, j) => { out[i + j] += x * y; }));
  return out;
}

/** The monic quadratic whose roots are p ± qi: z² - 2pz + (p² + q²). */
export const conjugatePair = (p: number, q: number): number[] => [1, -2 * p, p * p + q * q];
