/**
 * Advanced Higher, Differential Equations: how each 2022 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/differential-equations.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { nonZero, pick, until } from '../../core/draw';
import { poly, sum } from '../../core/maths/format';

const D2 = '\\frac{d^{2}y}{dx^{2}}';
const D1 = '\\frac{dy}{dx}';

// ── 2022 P2 Q10 ────────────────────────────────────────────────────────────
// y'' - 2ry' + r²y = P sin x + Q cos x, a repeated root r: complementary
// function (A + Bx)e^{rx}, particular integral C sin x + D cos x, then y(0)
// and y'(0). Built from the answer.

interface P2Q10of2022 { r: number; A: number; B: number; C: number; D: number }

/** The right-hand side's sin and cos coefficients for this particular integral. */
function rightSide2022({ r, C, D }: P2Q10of2022): [number, number] {
  return [(r * r - 1) * C + 2 * r * D, (r * r - 1) * D - 2 * r * C];
}

const q2022p2q10: CardRoutine<P2Q10of2022> = {
  draw: () => until(
    () => ({ r: pick([-3, -2, 2, 3]), A: nonZero(-5, 5), B: nonZero(-5, 5), C: nonZero(-3, 3), D: nonZero(-3, 3) }),
    // Both trig terms on the right, as 9 sin x + 13 cos x, each within 30; the
    // conditions within 15.
    (n) => {
      const [P, Q] = rightSide2022(n);
      const y0 = n.A + n.D, y1 = n.r * n.A + n.B + n.C;
      return P !== 0 && Q !== 0 && Math.abs(P) <= 30 && Math.abs(Q) <= 30 && Math.abs(y0) <= 15 && Math.abs(y1) <= 15;
    },
  ),

  build: (n): Built => {
    const { r, A, B, C, D } = n;
    const [P, Q] = rightSide2022(n);
    const y0 = A + D, y1 = r * A + B + C;
    const exp = `e^{${sum([{ coef: r, body: 'x' }])}}`;
    const rhs = sum([{ coef: P, body: '\\sin x' }, { coef: Q, body: '\\cos x' }]);
    const equation = `${sum([{ coef: 1, body: D2 }, { coef: -2 * r, body: D1 }, { coef: r * r, body: 'y' }])} = ${rhs}`;
    const auxiliary = `${poly([1, -2 * r, r * r], 'm')} = 0`;
    const cf = `y = A${exp} + Bx${exp}`;
    const pi = `y = C\\sin x + D\\cos x$, $${D1} = C\\cos x - D\\sin x$, $${D2} = -C\\sin x - D\\cos x`;
    const coefIn = (k: number, expr: string) => `${k < 0 ? ' - ' : ' + '}${Math.abs(k)}(${expr})`;
    const substituted = `(-C\\sin x - D\\cos x)${coefIn(-2 * r, 'C\\cos x - D\\sin x')}${coefIn(r * r, 'C\\sin x + D\\cos x')}`;
    const sinEq = `${sum([{ coef: r * r - 1, body: 'C' }, { coef: 2 * r, body: 'D' }])} = ${P}`;
    const cosEq = `${sum([{ coef: -2 * r, body: 'C' }, { coef: r * r - 1, body: 'D' }])} = ${Q}`;
    const general = `y = A${exp} + Bx${exp} + ${sum([{ coef: C, body: '\\sin x' }, { coef: D, body: '\\cos x' }])}`.replace('+ -', '- ');
    const derivative = `${D1} = ${sum([
      { coef: r, body: `A${exp}` }, { coef: 1, body: `B${exp}` }, { coef: r, body: `Bx${exp}` },
      { coef: C, body: '\\cos x' }, { coef: -D, body: '\\sin x' },
    ])}`;
    const answer = `y = ${sum([
      { coef: A, body: exp }, { coef: B, body: `x${exp}` }, { coef: C, body: '\\sin x' }, { coef: D, body: '\\cos x' },
    ])}`;
    return {
      questionLines: [
        'Solve the differential equation',
        '',
        `$${equation}$`,
        '',
        `given that $y = ${y0}$ and $${D1} = ${y1}$ when $x = 0.$`,
      ],
      solutionSteps: [
        `The auxiliary equation is $${auxiliary}$`,
        `$(${poly([1, -r], 'm')})^{2} = 0$, a repeated root $m = ${r}$, so the complementary function is $${cf}$`,
        `For the particular integral, $${pi}$`,
        `$${substituted} = ${rhs}$`,
        `Comparing coefficients of $\\sin x$ and $\\cos x$: $${sinEq}$, $${cosEq}$`,
        `$C = ${C},\\ D = ${D}$`,
        `The general solution is $${general}$, and $${derivative}$`,
        `At $x = 0$, $y = ${y0}$: $A + ${D < 0 ? `(${D})` : D} = ${y0}$, so $A = ${A}$`,
        `At $x = 0$, $${D1} = ${y1}$: $${sum([{ coef: r, body: 'A' }, { coef: 1, body: 'B' }])} + ${C < 0 ? `(${C})` : C} = ${y1}$, so $B = ${B}$ and $${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1, 1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          'The auxiliary equation has a repeated root. What does that change in the complementary function?',
          'Write the auxiliary equation.',
          'Solve it and write the complementary function for a repeated root.',
          'Write a particular integral with a sine and a cosine, and differentiate it twice.',
          'Substitute into the left-hand side of the equation.',
          'Compare the coefficients of $\\sin x$ and $\\cos x$ to get two equations.',
          'Solve them for the two constants.',
          'Differentiate the general solution.',
          `Use $y = ${y0}$ at $x = 0$ to find one constant.`,
          `Use $\\frac{dy}{dx} = ${y1}$ at $x = 0$ for the other, and state the particular solution.`,
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        shows: [
          null,
          `$${auxiliary}$`,
          `$${cf}$`,
          `$${pi}$`,
          `$${substituted}$`,
          `$${sinEq}$, $${cosEq}$`,
          `$C = ${C},\\ D = ${D}$`,
          `$${derivative}$`,
          `$A = ${A}$`,
          null,
        ],
        watch: { at: 1, text: 'Write "$= 0$" on the auxiliary equation, or the first mark goes.' },
      },
    };
  },
};

export const ROUTINES = {
  '2022 P2 Q10': q2022p2q10,
};
