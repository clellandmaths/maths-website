/**
 * Advanced Higher, Differential Equations: how each 2019 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/differential-equations.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { distinct, int, nonZero } from '../../core/draw';
import { sum } from '../../core/maths/format';

const D2 = '\\frac{d^{2}y}{dx^{2}}';
const D1 = '\\frac{dy}{dx}';

// ── 2019 Q8 ────────────────────────────────────────────────────────────────
// y'' + b y' + c y = 0 with two negative whole roots, y = 0 and y' given at
// x = 0, so B = -A.

interface Q8of2019 { m1: number; m2: number; A: number }

const q2019q8: CardRoutine<Q8of2019> = {
  // The root nearer 0 first, as the paper's -4 and -7.
  draw: () => {
    const [r, s] = distinct([-9, -8, -7, -6, -5, -4, -3, -2, -1], 2);
    return { m1: Math.max(r, s), m2: Math.min(r, s), A: nonZero(-6, 6) };
  },

  build: ({ m1, m2, A }): Built => {
    const B = -A, y1 = m1 * A + m2 * B;
    const e = (m: number) => `e^{${sum([{ coef: m, body: 'x' }])}}`;
    const equation = `${sum([{ coef: 1, body: D2 }, { coef: -(m1 + m2), body: D1 }, { coef: m1 * m2, body: 'y' }])} = 0`;
    const auxiliary = `${sum([{ coef: 1, body: 'm^{2}' }, { coef: -(m1 + m2), body: 'm' }, { coef: m1 * m2, body: '' }])} = 0`;
    const factorised = `(${sum([{ coef: 1, body: 'm' }, { coef: -m1, body: '' }])})(${sum([{ coef: 1, body: 'm' }, { coef: -m2, body: '' }])}) = 0`;
    const roots = `m = ${m1}, ${m2}`;
    const general = `y = A${e(m1)} + B${e(m2)}`;
    const derivative = `${D1} = ${sum([{ coef: m1, body: `A${e(m1)}` }, { coef: m2, body: `B${e(m2)}` }])}`;
    const simultaneous = `A + B = 0$ and $${sum([{ coef: m1, body: 'A' }, { coef: m2, body: 'B' }])} = ${y1}`;
    const particular = `y = ${sum([{ coef: A, body: e(m1) }, { coef: B, body: e(m2) }])}`;
    return {
      questionLines: [
        'Find the particular solution of the differential equation',
        '',
        `$${equation}$`,
        '',
        `given that $y = 0$ and $${D1} = ${y1}$, when $x = 0.$`,
      ],
      solutionSteps: [
        `The auxiliary equation is $${auxiliary}$: $${factorised}$, so $${roots}$`,
        `$${general}$`,
        `$${derivative}$`,
        `At $x = 0$: $${simultaneous}$, so $A = ${A}$`,
        `Then $B = ${B}$, and $${particular}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `$${particular}$`,
      ladder: {
        moves: [
          'A second-order equation with zero on the right: what equation in $m$ does it lead to?',
          'Write and solve the auxiliary equation.',
          'Write the general solution, with two constants.',
          'Differentiate the general solution.',
          `Put $x = 0$ into both $y$ and $${D1}$, and solve for one constant.`,
          'Find the other constant and state the particular solution, starting "$y =$".',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [null, `$${roots}$`, `$${general}$`, `$${derivative}$`, `$A = ${A}$ or $B = ${B}$`, null],
        watch: { at: 5, text: 'Write "$y =$" in the final answer, or the last mark goes.' },
      },
    };
  },
};

// ── 2019 Q13 ───────────────────────────────────────────────────────────────
// dV/dt = k(M - V), V = V0 at t = 0: separate, -ln(M - V) = kt + c,
// c = -ln(M - V0), so V = M - (M - V0)e^{-kt}.

interface Q13of2019 { M: number; V0: number }

const q2019q13: CardRoutine<Q13of2019> = {
  // M - V0 at least 3, so its log is never ln 1 or ln 2 alone, as the paper's ln 10.
  draw: () => {
    const V0 = int(1, 6);
    return { M: int(V0 + 3, 24), V0 };
  },

  build: ({ M, V0 }): Built => {
    const gap = M - V0;
    const lnGap = `\\ln ${gap}`;
    const separated = `\\int \\frac{1}{${M} - V}\\,dV = \\int k\\,dt`;
    const answer = `V = ${M} - ${gap}e^{-kt}`;
    return {
      questionLines: [
        'An electronic device contains a timer circuit that switches off when the voltage, $V$, reaches a set value.',
        'The rate of change of the voltage is given by',
        '',
        `$\\frac{dV}{dt} = k(${M} - V)$,`,
        '',
        `where $k$ is a constant, $t$ is the time in seconds, and $0 \\le V \\lt ${M}.$`,
        `Given that $V = ${V0}$ when $t = 0$, express $V$ in terms of $k$ and $t.$`,
      ],
      solutionSteps: [
        `$${separated}$`,
        `$-\\ln(${M} - V) = \\ldots$`,
        `$-\\ln(${M} - V) = kt + c$`,
        `At $t = 0$, $V = ${V0}$: $c = -${lnGap}$`,
        `$\\ln(${M} - V) = ${lnGap} - kt$, so $${M} - V = ${gap}e^{-kt}$ and $${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          'Can you get all the $V$ on one side and all the $t$ on the other?',
          'Separate the variables and write both sides as integrals.',
          'Integrate the $V$ side. Watch the sign.',
          'Integrate the $t$ side, with a constant.',
          `Use $V = ${V0}$ at $t = 0$ to find the constant.`,
          'Rearrange to give $V$ in terms of $k$ and $t$.',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [null, `$${separated}$`, `$-\\ln(${M} - V)$`, '$kt + c$', `$-${lnGap}$`, null],
        watch: { at: 3, text: 'Keep the constant of integration. Without it, the last two marks are gone.' },
      },
    };
  },
};

export const ROUTINES = {
  '2019 Q8': q2019q8,
  '2019 Q13': q2019q13,
};
