/**
 * Advanced Higher, Matrices: how each 2019 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/matrices.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int, nonZero, until } from '../draw';
import { pmatrix } from '../maths/matrix';
import { joinTerms, sum } from '../maths/format';

// ── 2019 Q2 ────────────────────────────────────────────────────────────────
// A 3 × 3 with p in its middle, det A = Cp + K given, so p; B 3 × 2 with q in
// its second row; AB, with the p found; AB is not square, so no inverse.

type Row3 = [number, number, number];

interface Q2of2019 {
  /** A with its middle entry left out (0 here): p goes there. */
  A: [Row3, Row3, Row3];
  p: number;
  /** B's entries; B[1][0] is q's place, 0 here. */
  B: [[number, number], [number, number], [number, number]];
}

/** det A = Cp + K, from A's other entries. */
const detOf = ({ A }: Q2of2019) => {
  const [[a, b, c], [d, , f], [g, h, i]] = A;
  return { C: a * i - c * g, K: -a * f * h - b * (d * i - f * g) + c * d * h };
};

const q2019q2: CardRoutine<Q2of2019> = {
  draw: () => until(
    () => {
      const e = () => nonZero(-5, 5);
      const small = () => int(-3, 5);
      return {
        A: [[e(), e(), e()], [e(), 0, e()], [e(), e(), e()]] as [Row3, Row3, Row3],
        p: nonZero(-6, 6),
        B: [[small(), small()], [0, small()], [small(), small()]] as Q2of2019['B'],
      };
    },
    (n) => {
      const { C, K } = detOf(n);
      const D = C * n.p + K;
      // Both terms of Cp + K, a determinant that is not 0, and the paper's size.
      return C !== 0 && K !== 0 && D !== 0 && Math.abs(D) <= 30 && Math.abs(K) <= 60;
    },
  ),

  build: (n): Built => {
    const { A, p, B } = n;
    const { C, K } = detOf(n);
    const D = C * p + K;
    const [[a, b, c], [d, , f], [g, h, i]] = A;
    const vm = (w: string | number, x: string | number, y: string | number, z: string | number) =>
      `\\begin{vmatrix}${w} & ${x}\\\\${y} & ${z}\\end{vmatrix}`;
    const Ap = pmatrix([[a, b, c], [d, 'p', f], [g, h, i]]);
    const Bq = pmatrix([[B[0][0], B[0][1]], ['q', B[1][1]], [B[2][0], B[2][1]]]);
    const expansion = joinTerms([
      `${a}${vm('p', f, h, i)}`,
      `${b > 0 ? '-' : ''}${Math.abs(b)}${vm(d, f, g, i)}`,
      `${c}${vm(d, 'p', g, h)}`,
    ]);
    const det = sum([{ coef: C, body: 'p' }, { coef: K, body: '' }]);
    // AB with p known: column 1 is (row of A)·(b11, q, b31), column 2 plain numbers.
    const withP: Row3[] = [[a, b, c], [d, p, f], [g, h, i]];
    const col1 = withP.map(r => sum([{ coef: r[1], body: 'q' }, { coef: r[0] * B[0][0] + r[2] * B[2][0], body: '' }]));
    const col2 = withP.map(r => r[0] * B[0][1] + r[1] * B[1][1] + r[2] * B[2][1]);
    const AB = pmatrix(col1.map((e1, k) => [e1, col2[k]]));
    const reason = '$AB$ is a $3 \\times 2$ matrix, not a square matrix, and only square matrices have inverses.';
    return {
      questionLines: [
        'Matrix $A$ is defined by',
        '',
        `$A = ${Ap}$`,
        '',
        'where $p \\in \\mathbb{R}.$',
        `<b>(a)</b> Given that the determinant of $A$ is $${D}$, find the value of $p.$`,
        'Matrix $B$ is defined by',
        '',
        `$B = ${Bq}$`,
        '',
        'where $q \\in \\mathbb{R}.$',
        '<b>(b)</b> Find $AB.$',
        '<b>(c)</b> Explain why $AB$ does not have an inverse.',
      ],
      solutionSteps: [
        `<strong>(a)</strong> Expanding along the first row, $\\det A = ${expansion}$`,
        `<strong>(a)</strong> $\\det A = ${det}$`,
        `<strong>(a)</strong> $${det} = ${D}$, so $p = ${p}$`,
        `<strong>(b)</strong> With $p = ${p}$, the first row of $AB$ is $${col1[0]}$ and $${col2[0]}$`,
        `<strong>(b)</strong> $AB = ${AB}$`,
        `<strong>(c)</strong> ${reason}`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1],
      finalAnswer: `(a) $p = ${p}$<br>(b) $AB = ${AB}$<br>(c) ${reason}`,
      ladder: {
        moves: [
          'How do you find a $3 \\times 3$ determinant? Expand along a row or a column.',
          '(a) Expand the determinant along a row or a column.',
          '(a) Simplify it to an expression in $p$.',
          `(a) Set it equal to $${D}$ and solve.`,
          '(b) Multiply $A$ by $B$, row by column. What size is the answer?',
          '(c) What shape must a matrix be to have an inverse?',
        ],
        marks: [0, 1, 1, 1, 2, 1],
        shows: [null, `$${expansion}$`, `$${det}$`, null, `$${AB}$`, null],
        watch: { at: 5, text: 'Explain in general terms: say which matrices can have an inverse.' },
      },
    };
  },
};

export const ROUTINES = {
  '2019 Q2': q2019q2,
};
