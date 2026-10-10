/**
 * Advanced Higher, Differential Equations: how each 2021 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/differential-equations.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { distinct, int, nonZero, pick, until } from '../draw';
import { poly, sum } from '../maths/format';

const D2 = '\\frac{d^{2}y}{dx^{2}}';
const D1 = '\\frac{dy}{dx}';

// ── 2021 P1 Q8 ─────────────────────────────────────────────────────────────
// y'' - (r + s)y' + rsy = Ke^{rx}, the right-hand side's exponential already
// in the complementary function Ae^{rx} + Be^{sx}: the particular integral is
// Cxe^{rx}, with K = C(r - s). Then y(0) and y'(0). Built from the answer.

interface P1Q8of2021 { r: number; s: number; A: number; B: number; C: number }

const q2021p1q8: CardRoutine<P1Q8of2021> = {
  draw: () => until(
    () => {
      const [r, s] = distinct([-4, -3, -2, -1, 1, 2, 3, 4], 2);
      return { r, s, A: nonZero(-5, 5), B: nonZero(-5, 5), C: nonZero(-9, 9) };
    },
    // Every term on the left, as the paper's; no product bigger than the
    // paper's biggest, 5 × 7 = 35, for the right-hand side and rC (the owner on
    // 2023 P1: "biggest should be no larger than paper"); both conditions
    // nonzero, y'(0) within 30.
    ({ r, s, A, B, C }) => {
      const y1 = r * A + s * B + C;
      return r + s !== 0 && Math.abs(C * (r - s)) <= 35 && Math.abs(C * r) <= 35 && A + B !== 0 && y1 !== 0 && Math.abs(y1) <= 30;
    },
  ),

  build: ({ r, s, A, B, C }): Built => {
    const P = -(r + s), Q = r * s, K = C * (r - s);
    const y0 = A + B, y1 = r * A + s * B + C;
    const e = (m: number) => `e^{${sum([{ coef: m, body: 'x' }])}}`;
    const er = e(r), es = e(s);
    const equation = `${sum([{ coef: 1, body: D2 }, { coef: P, body: D1 }, { coef: Q, body: 'y' }])} = ${sum([{ coef: K, body: er }])}`;
    const auxiliary = `${poly([1, P, Q], 'm')} = 0`;
    const roots = `m = ${r},\\ m = ${s}`;
    const cf = `y = A${er} + B${es}`;
    const pi = `y = Cx${er}`;
    const pi1 = sum([{ coef: 1, body: `C${er}` }, { coef: r, body: `Cx${er}` }]);
    const pi2 = sum([{ coef: 2 * r, body: `C${er}` }, { coef: r * r, body: `Cx${er}` }]);
    const derivatives = `${D1} = ${pi1}$, $${D2} = ${pi2}`;
    const times = (k: number, expr: string) => `${k < 0 ? ' - ' : ' + '}${Math.abs(k) === 1 ? '' : Math.abs(k)}(${expr})`;
    const substituted = `(${pi2})${times(P, pi1)}${Q < 0 ? ' - ' : ' + '}${Math.abs(Q) === 1 ? '' : Math.abs(Q)}Cx${er}`;
    const collected = `${sum([{ coef: r - s, body: 'C' }])} = ${K}`;
    const general = `y = A${er} + B${es} + ${sum([{ coef: C, body: `x${er}` }])}`.replace('+ -', '- ');
    const derivative = `${D1} = ${sum([
      { coef: r, body: `A${er}` }, { coef: s, body: `B${es}` }, { coef: C, body: er }, { coef: C * r, body: `x${er}` },
    ])}`;
    const atZero = `A + B = ${y0}$ and $${sum([{ coef: r, body: 'A' }, { coef: s, body: 'B' }, { coef: C, body: '' }])} = ${y1}`;
    const answer = `y = ${sum([{ coef: A, body: er }, { coef: B, body: es }, { coef: C, body: `x${er}` }])}`;
    return {
      questionLines: [
        'Find the particular solution of the differential equation',
        '',
        `$${equation}$`,
        '',
        `given $y = ${y0}$ and $${D1} = ${y1}$ when $x = 0.$`,
      ],
      solutionSteps: [
        `The auxiliary equation is $${auxiliary}$, $(${poly([1, -r], 'm')})(${poly([1, -s], 'm')}) = 0$, so $${roots}$`,
        `The complementary function is $${cf}$`,
        `$${er}$ is in the complementary function, so the particular integral is $${pi}$`,
        `$${derivatives}$`,
        // When r - s is 1 the collected line is already C: say it once.
        `Substituting: $${substituted} = ${sum([{ coef: K, body: er }])}$, so $${collected}$${r - s === 1 ? '' : ` and $C = ${C}$`}`,
        `The general solution is $${general}$`,
        `$${derivative}$`,
        `At $x = 0$: $${atZero}$, so $A = ${A}$`,
        `$B = ${B}$, and $${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1, 1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          `The right-hand side is $${er}$. Is $${er}$ already in the complementary function?`,
          'Solve the auxiliary equation.',
          'Write the complementary function.',
          `$${er}$ is already in the complementary function, so multiply the usual particular integral by $x$.`,
          'Differentiate the particular integral twice.',
          'Substitute into the equation and find its constant.',
          'Write the general solution: the complementary function plus the particular integral.',
          'Differentiate the general solution.',
          'Put in the conditions at $x = 0$ and solve for one constant.',
          'Find the other constant and state the particular solution.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        shows: [
          null,
          `$${roots}$`,
          `$${cf}$`,
          `$${pi}$`,
          `$${derivatives}$`,
          `$C = ${C}$`,
          `$${general}$`,
          `$${derivative}$`,
          `$A = ${A}$ or $B = ${B}$`,
          null,
        ],
        watch: { at: 3, text: `A particular integral of $C${er}$ alone fails here, because $${er}$ is in the complementary function.` },
      },
    };
  },
};

// ── 2021 P2 Q6 ─────────────────────────────────────────────────────────────
// dy/dx + 2kxy = 2h x e^{-kx²}, y(0) = y0: integrating factor e^{kx²}, which
// cancels the right-hand side's exponential, so e^{kx²}y = hx² + y0.

interface P2Q6of2021 { k: number; h: number; y0: number }

const q2021p2q6: CardRoutine<P2Q6of2021> = {
  draw: () => ({ k: pick([1, 1, 2, 3]), h: int(1, 10), y0: nonZero(-9, 9) }),

  build: ({ k, h, y0 }): Built => {
    const kx2 = `${k === 1 ? '' : k}x^{2}`;
    const IF = `e^{${kx2}}`;
    const equation = `${D1} + ${2 * k}xy = ${2 * h}xe^{-${kx2}}`;
    const top = sum([{ coef: h, body: 'x^{2}' }, { coef: y0, body: '' }]);
    const integral = `${IF}y = \\int ${2 * h}x\\,dx`;
    const integrated = `${IF}y = ${sum([{ coef: h, body: 'x^{2}' }])} + c`;
    const answer = `y = \\frac{${top}}{${IF}}`;
    return {
      questionLines: [
        'Solve the differential equation',
        '',
        `$${equation}$`,
        '',
        `given that when $x = 0$, $y = ${y0}.$ Express $y$ in terms of $x.$`,
      ],
      solutionSteps: [
        `The integrating factor is $e^{\\int ${2 * k}x\\,dx} = ${IF}$`,
        `Multiplying through, $\\frac{d}{dx}\\left(${IF}y\\right) = ${2 * h}x$, so $${integral}$`,
        `$${integrated}$`,
        `At $x = 0$, $y = ${y0}$: $c = ${y0}$, so $${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `$${answer}$ (or $y = (${top})e^{-${kx2}}$)`,
      ladder: {
        moves: [
          'The equation is linear in $y$. What do you multiply through by to make the left side one derivative?',
          'Find the integrating factor.',
          'Multiply through and write the equation as an integral equation.',
          'Integrate the right-hand side, with a constant.',
          `Use $y = ${y0}$ at $x = 0$ to find the constant, and write $y$ in terms of $x$.`,
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, null, `$${integral}$`, `$${integrated}$`, null],
        watch: { at: 3, text: 'The exponentials cancel on the right, leaving something easy to integrate. Keep the constant.' },
      },
    };
  },
};

export const ROUTINES = {
  '2021 P1 Q8': q2021p1q8,
  '2021 P2 Q6': q2021p2q6,
};
