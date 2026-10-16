/**
 * Three-dimensional vectors with whole-number components, and their LaTeX.
 *
 * Pure: draws nothing and writes no sentences.
 */
import { gcd } from './integer';
import { pmatrix } from './matrix';

export type V3 = readonly [number, number, number];

export const add3 = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale3 = (k: number, a: V3): V3 => [k * a[0], k * a[1], k * a[2]];
export const dot3 = (a: V3, b: V3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/** The vector product a × b. */
export const cross3 = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];

/** The largest whole number dividing every component; 0 for the zero vector. */
export const content3 = (a: V3): number => gcd(gcd(a[0], a[1]), a[2]);

/** A column vector: `\begin{pmatrix}1\\2\\5\end{pmatrix}`. */
export const column = (a: V3): string => pmatrix([[a[0]], [a[1]], [a[2]]]);

/** Coordinates as a paper writes a point: `(2, 3, -4)`. */
export const coords = (a: V3): string => `(${a[0]}, ${a[1]}, ${a[2]})`;
