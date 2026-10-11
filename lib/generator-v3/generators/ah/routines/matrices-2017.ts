/**
 * Advanced Higher, Matrices: how each 2017 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/matrices.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int, nonZero, until } from '../../core/draw';
import { sum } from '../../core/maths/format';

// ── 2017 Q7 ────────────────────────────────────────────────────────────────
// P = (x b; c d) with det P = D given: (a)(i) x = (D + bc)/d; (ii) P⁻¹;
// (iii) P⁻¹Q' with y left as a letter; (b) z making R = (r1 r2; z r4)
// singular, z = r1 r4/r2.

interface Q7of2017 {
  D: number; x: number; b: number; c: number; d: number;
  e: number; f: number; g: number;
  r1: number; r2: number; r4: number;
}

/** A 2 by 2 matrix of LaTeX cells. */
const mat2017 = (m: readonly (readonly (number | string)[])[]) =>
  `\\begin{pmatrix}${m.map(r => r.join(' & ')).join('\\\\')}\\end{pmatrix}`;

/** k + my, constant first, as the scheme writes -4 - 2y. */
const inY2017 = (k: number, m: number) => sum([{ coef: k, body: '' }, { coef: m, body: 'y' }]);

const q2017q7: CardRoutine<Q7of2017> = {
  draw: () => until(
    () => {
      const D = int(2, 6), b = nonZero(-6, 6), c = nonZero(-6, 6), d = nonZero(-6, 6);
      // x from det P = xd - bc = D; not whole when d does not divide D + bc, which the test refuses.
      return {
        D, x: (D + b * c) / d, b, c, d, e: nonZero(-6, 6), f: nonZero(-6, 6), g: nonZero(-6, 6),
        r1: nonZero(-9, 9), r2: nonZero(-9, 9), r4: nonZero(-9, 9),
      };
    },
    // x whole and nonzero, within 12 (the paper's 8); the product's number
    // entries nonzero, as the paper's 4 and -14; z whole, within 30 (the paper's 15).
    (n) => {
      const z = (n.r1 * n.r4) / n.r2;
      return Number.isInteger(n.x) && n.x !== 0 && Math.abs(n.x) <= 12
        && n.d * n.e - n.b * n.f !== 0 && n.x * n.f - n.c * n.e !== 0 && Number.isInteger(z) && Math.abs(z) <= 30;
    },
  ),

  build: ({ D, x, b, c, d, e, f, g, r1, r2, r4 }): Built => {
    const P = mat2017([['x', b], [c, d]]);
    const Q = mat2017([[e, f], [g, 'y']]);
    const R = mat2017([[r1, r2], ['z', r4]]);
    const adj = mat2017([[d, -b], [-c, x]]);
    const inverse = `P^{-1} = \\frac{1}{${D}}${adj}`;
    const Qt = `Q' = ${mat2017([[e, g], [f, 'y']])}`;
    const cells = [[d * e - b * f, inY2017(d * g, -b)], [x * f - c * e, inY2017(-c * g, x)]];
    const product = `\\frac{1}{${D}}${mat2017(cells)}`;
    // Divided through where every entry allows it, as the scheme's (2, -2 - y; -7, 10 + 4y).
    const whole = [d * e - b * f, d * g, b, x * f - c * e, c * g, x].every(v => v % D === 0);
    const halved = whole
      ? mat2017([[(d * e - b * f) / D, inY2017((d * g) / D, -b / D)], [(x * f - c * e) / D, inY2017((-c * g) / D, x / D)]])
      : '';
    const result = `P^{-1}Q' = ${product}${whole ? ` = ${halved}` : ''}`;
    const detP = `${sum([{ coef: d, body: 'x' }, { coef: -b * c, body: '' }])} = ${D}`;
    const z = (r1 * r4) / r2;
    const detR = `\\det R = ${sum([{ coef: r1 * r4, body: '' }, { coef: -r2, body: 'z' }])} = 0`;
    return {
      questionLines: [
        `Matrices $P$ and $Q$ are defined by $P = ${P}$ and $Q = ${Q}$, where $x, y \\in \\mathbb{R}.$`,
        `<b>(a)</b> Given the determinant of $P$ is ${D}, obtain:`,
        '(i) The value of $x.$',
        '(ii) $P^{-1}.$',
        '(iii) $P^{-1}Q\'$, where $Q\'$ is the transpose of $Q.$',
        `<b>(b)</b> The matrix $R$ is defined by $R = ${R}$, where $z \\in \\mathbb{R}.$`,
        'Determine the value of $z$ such that $R$ is singular.',
      ],
      solutionSteps: [
        `<strong>(a)(i)</strong> $\\det P = ${detP}$, so $x = ${x}$`,
        `<strong>(a)(ii)</strong> $${inverse}$`,
        `<strong>(a)(iii)</strong> $${Qt}$`,
        `<strong>(a)(iii)</strong> $${result}$`,
        '<strong>(b)</strong> $R$ is singular when $\\det R = 0$',
        `<strong>(b)</strong> $${detR}$, so $z = ${z}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1],
      finalAnswer: [
        `(a)(i) $x = ${x}$`,
        `(a)(ii) $${inverse}$`,
        `(a)(iii) $${result}$`,
        `(b) $z = ${z}$`,
      ].join('<br>'),
      ladder: {
        moves: [
          'For a $2 \\times 2$ matrix, what is the determinant, and what do you swap and negate for the inverse?',
          `(a)(i) Set the determinant of $P$ equal to ${D} and solve for $x$.`,
          '(a)(ii) Swap the leading diagonal, negate the other two entries, and divide by the determinant.',
          '(a)(iii) Write $Q\'$ by swapping the rows and columns of $Q$.',
          '(a)(iii) Multiply $P^{-1}$ by $Q\'$, row by column.',
          '(b) What is the determinant of a singular matrix? Write that condition.',
          '(b) Solve for $z$.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1],
        shows: [null, null, `$${inverse}$`, `$${Qt}$`, `$${result}$`, '$\\det R = 0$ or one row is a multiple of the other', null],
        watch: { at: 5, text: 'Show the condition you use. $z$ with no reason loses the first mark in (b).' },
      },
    };
  },
};

export const ROUTINES = {
  '2017 Q7': q2017q7,
};
