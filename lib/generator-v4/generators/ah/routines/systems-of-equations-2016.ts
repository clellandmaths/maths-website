/**
 * Advanced Higher, Systems of Equations: how each 2016 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/systems-of-equations.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { nonZero, pick, until } from '../../core/draw';
import { num, sum } from '../../core/maths/format';
import { gcd } from '../../core/maths/integer';
import { opText } from '../../core/maths/linear';
import { q } from '../../core/maths/rational';

// ── 2016 Q4 ────────────────────────────────────────────────────────────────
// Three equations, 2λ as row 3's z coefficient, and the λ for redundancy.
// Built so row 3's x, y and constant are αR1 + βR2 with α + βu = 1 (u is
// row 2's x): then R3 - R1 is β times R2 - uR1 in y and the constant, and the
// last row reduces to 0, 0, 2λ - K, 0 with K = αs + βt, so λ = K/2, as the
// paper's (2λ - 1 = 0, λ = 1/2).

interface Q4of2016 { p: number; s: number; d1: number; u: number; qy: number; t: number; d2: number; beta: 1 | -1 }

function system2016({ p, s, d1, u, qy, t, d2, beta }: Q4of2016) {
  const alpha = 1 - beta * u;
  const R1 = [1, p, s, d1];
  const R2 = [u, qy, t, d2];
  // Row 3's z entry is 2λ, written by the build; 0 here stands for it.
  const R3 = [1, alpha * p + beta * qy, 0, alpha * d1 + beta * d2];
  // R2 - uR1, turned round when its y entry is negative, as the scheme's
  // 2R1 - R2 = (0, 5, 2 | 1).
  const less = [0, qy - u * p, t - u * s, d2 - u * d1];
  const turn = less[1] < 0 ? -1 : 1;
  const r2 = less.map(v => turn * v);
  const r3 = [0, R3[1] - p, -s, R3[3] - d1];
  return { alpha, R1, R2, R3, r2, r3, turn, K: alpha * s + beta * t };
}

/** An augmented matrix whose cells may be written already, as `2\lambda - 3`. */
const cells2016 = (rows: readonly (readonly (number | string)[])[]) =>
  `\\left(\\begin{array}{ccc|c}${rows.map(r => r.join(' & ')).join('\\\\')}\\end{array}\\right)`;

/** `2\lambda - 3`, or `2\lambda` alone. */
const twoLambda = (c: number) => sum([{ coef: 2, body: '\\lambda' }, { coef: c, body: '' }]);

const q2016q4: CardRoutine<Q4of2016> = {
  draw: () => until(
    () => ({
      p: nonZero(-3, 3), s: nonZero(-4, 4), d1: nonZero(-6, 6),
      // Row 2 starts with 2x or 3x, as the paper's 2x, so R2 - uR1 clears it.
      u: pick([2, 3]), qy: nonZero(-5, 5), t: nonZero(-5, 5), d2: nonZero(-9, 9),
      beta: pick([1, -1] as const),
    }),
    (n) => {
      const { R2, R3, r2, K } = system2016(n);
      // Every printed number nonzero, the coefficients within 6 and the
      // constants within 9, as the paper's within 5; the first stage's within
      // 9, none zero, as 5, 2, 1; K within 9, so λ = K/2 is a whole number or
      // a half, as 1/2. No row to divide through.
      const ok = (v: number, cap: number) => v !== 0 && Math.abs(v) <= cap;
      const rowGcd = (r: readonly number[]) => r.reduce((g, v) => gcd(g, v), 0);
      return ok(R3[1], 6) && ok(R3[3], 9) && r2.slice(1).every(v => ok(v, 9)) && ok(K, 9)
        && rowGcd(R2) === 1 && rowGcd(r2) === 1;
    },
    2000,
  ),

  build: (n): Built => {
    const { R1, R2, R3, r2, r3, turn, K } = system2016(n);
    const { u, beta } = n;
    const equation = (r: readonly number[], z: string) => `${sum([{ coef: r[0], body: 'x' }, { coef: r[1], body: 'y' }, { coef: r[2], body: z }])} = ${r[3]}`;
    const lines = [equation(R1, 'z'), equation(R2, 'z'), equation([R3[0], R3[1], 2, R3[3]], '\\lambda z')];
    const M0 = cells2016([R1, R2, [R3[0], R3[1], '2\\lambda', R3[3]]]);
    const M1 = cells2016([R1, r2, [0, r3[1], twoLambda(r3[2]), r3[3]]]);
    const M2 = cells2016([R1, r2, [0, 0, twoLambda(-K), 0]]);
    const first = turn > 0 ? opText({ row: 2, t: 1, with: 1, o: -u }) : `${u}R_1 - R_2`;
    const second = opText({ row: 3, t: 1, with: 1, o: -1 });
    const third = opText({ row: 3, t: 1, with: 2, o: -beta * turn });
    const lambda = num(q(K, 2));
    return {
      questionLines: [
        'Below is a system of equations:',
        '',
        ...lines.map(l => `$${l}$`),
        '',
        'Use Gaussian elimination to find the value of $\\lambda$ which leads to redundancy.',
      ],
      solutionSteps: [
        `The augmented matrix: $${M0}$`,
        `With $${first}$ and $${second}$: $${M1}$`,
        `With $${third}$: $${M2}$`,
        `Redundancy needs the whole last row zero: $${twoLambda(-K)} = 0$, so $\\lambda = ${lambda}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `$\\lambda = ${lambda}$`,
      ladder: {
        moves: [
          'What does the last row of a reduced matrix look like when a system has redundancy?',
          'Write the augmented matrix, with $\\lambda$ in the third row.',
          'Use row operations to make zeros below the top entry of the first column.',
          'Make the last zero, in row 3 of column 2.',
          'Which value of $\\lambda$ makes the whole last row zero?',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, `$${M0}$`, `$${M1}$`, `$${M2}$`, null],
        watch: { at: 4, text: 'Redundancy needs the whole last row zero, including the right-hand side.' },
      },
    };
  },
};

export const ROUTINES = {
  '2016 Q4': q2016q4,
};
