/**
 * Advanced Higher, Differential Equations: how each card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/differential-equations.ts` under the same label.
 */
import type { Built, CardRoutine } from '../types';
import { distinct, int, nonZero, pick, until } from '../draw';
import { num, poly, rounded, sum } from '../maths/format';
import { type Q, q } from '../maths/rational';

// ── 2026 P1 Q4 ─────────────────────────────────────────────────────────────
// a y'' + b y' + c y = 0 from (αm - β)(m - γ) = 0, with y(0) and y'(0) given.

interface Q4 { alpha: number; beta: number; gamma: number; k: number; B: number }

const D2 = '\\frac{d^{2}y}{dx^{2}}';
const D1 = '\\frac{dy}{dx}';

const q2026p1q4: CardRoutine<Q4> = {
  draw: () => until(
    () => ({ alpha: pick([2, 3]), beta: nonZero(-3, 3), gamma: nonZero(-3, 3), k: nonZero(-3, 3), B: nonZero(-6, 6) }),
    ({ alpha, beta, gamma, k, B }) => {
      if (beta % alpha === 0 || beta === gamma * alpha) return false;
      const b = -(beta + alpha * gamma), c = beta * gamma;
      const A = alpha * k;
      const y0 = A + B, y1 = beta * k + gamma * B;
      return b !== 0 && c !== 0 && y0 !== 0 && y1 !== 0;
    },
  ),

  build: ({ alpha, beta, gamma, k, B }): Built => {
    const a = alpha, b = -(beta + alpha * gamma), c = beta * gamma;
    const A = alpha * k;
    const y0 = A + B, y1 = beta * k + gamma * B;
    const m1 = q(beta, alpha);
    const exp1 = `e^{${sum([{ coef: m1, body: 'x' }])}}`;
    const exp2 = `e^{${sum([{ coef: gamma, body: 'x' }])}}`;

    const equation = `${sum([{ coef: a, body: D2 }, { coef: b, body: D1 }, { coef: c, body: 'y' }])} = 0`;
    const auxiliary = `${poly([a, b, c], 'm')} = 0`;
    const factorised = `(${poly([alpha, -beta], 'm')})(${poly([1, -gamma], 'm')}) = 0`;
    const roots = `m = ${num(m1)},\\ m = ${gamma}`;
    const general = `y = Ae^{${sum([{ coef: m1, body: 'x' }])}} + Be^{${sum([{ coef: gamma, body: 'x' }])}}`;
    const derivative = `${D1} = ${sum([{ coef: m1, body: `A${exp1}` }, { coef: gamma, body: `B${exp2}` }])}`;
    const simultaneous = `A + B = ${y0}$ and $${sum([{ coef: m1, body: 'A' }, { coef: gamma, body: 'B' }])} = ${y1}`;
    const particular = `y = ${sum([{ coef: A, body: exp1 }, { coef: B, body: exp2 }])}`;

    return {
      questionLines: [
        'Find the particular solution of the differential equation',
        '',
        `$${equation}$`,
        '',
        `given that $y = ${y0}$ and $${D1} = ${y1}$ when $x = 0.$`,
      ],
      solutionSteps: [
        `The auxiliary equation is $${auxiliary}$`,
        `$${factorised}$, so $${roots}$ and $${general}$`,
        `$${derivative}$`,
        `At $x = 0$: $${simultaneous}$`,
        `So $A = ${A},\\ B = ${B}$ and $${particular}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `$${particular}$`,
      ladder: {
        moves: [
          'A second-order equation with zero on the right: what equation in $m$ does it lead to?',
          'Write the auxiliary equation from the coefficients.',
          'Solve it and write the general solution, with two constants.',
          'Differentiate the general solution.',
          `Put $x = 0$ into both $y$ and $${D1}$ to get two equations in $A$ and $B$.`,
          'Solve them and state the particular solution, starting "$y =$".',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [null, null, null, `$${derivative}$`, `$${simultaneous}$`, null],
        watch: { at: 1, text: 'Write "$= 0$" on the auxiliary equation, or the first mark goes.' },
      },
    };
  },
};

// ── 2025 P1 Q7 ─────────────────────────────────────────────────────────────
// dy/dx = y/(2x + β), y = K m at the x where 2x + β = m²: y = K(2x + β)^{1/2}.

interface P1Q7 { beta: -1 | 1 | 3; m: 3 | 5; K: number }

const q2025p1q7: CardRoutine<P1Q7> = {
  draw: () => ({ beta: pick([-1, 1, 3] as const), m: pick([3, 5] as const), K: int(2, 6) }),

  build: ({ beta, m, K }): Built => {
    const den = poly([2, beta]);
    const x0 = (m * m - beta) / 2, y0 = K * m;
    const half = '\\frac{1}{2}';
    const answer = `y = ${K}(${den})^{${half}}`;
    const separated = `\\int \\frac{dy}{y} = \\int \\frac{dx}{${den}}`;
    const rhs = `${half}\\ln(${den}) + c`;
    const constant = `c = \\ln ${K}`;

    return {
      questionLines: [
        'Solve the differential equation',
        '',
        `$${D1} = \\frac{y}{${den}}$, $x, y > 1$,`,
        '',
        `given that $y = ${y0}$ when $x = ${x0}.$ Express $y$ in terms of $x.$`,
      ],
      solutionSteps: [
        `Separating the variables: $${separated}$`,
        'The left side: $\\ln y$',
        `The right side: $${rhs}$`,
        `At $x = ${x0}$, $y = ${y0}$: $\\ln ${y0} = ${half}\\ln ${m * m} + c = \\ln ${m} + c$, so $${constant}$`,
        `$\\ln y = \\ln(${den})^{${half}} + \\ln ${K} = \\ln(${K}(${den})^{${half}})$, so $${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `$${answer}$, or $y = ${K}\\sqrt{${den}}$`,
      ladder: {
        moves: [
          'Can you get all the $y$ on one side and all the $x$ on the other?',
          'Separate the variables and write both sides as integrals.',
          'Integrate the $y$ side.',
          'Integrate the $x$ side, with the constant.',
          `Use $y = ${y0}$ when $x = ${x0}$ to find the constant.`,
          'Use the log laws to write $y$ in terms of $x$.',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [null, `$${separated}$`, '$\\ln y$', `$${rhs}$`, `$${constant}$`, null],
        watch: { at: 3, text: 'Leave out the constant and the last two marks are gone.' },
      },
    };
  },
};

// ── 2025 P2 Q12 ────────────────────────────────────────────────────────────
// y'' + Py' + Qy = a quadratic, roots m1 and m2, particular integral
// Cx² + Dx + E, then y(0) and y'(0): built from the answer.

interface P2Q12 { m1: number; m2: number; C: number; D: number; E: number; A: number; B: number }

/** The right-hand side's coefficients for this particular integral: L[Cx² + Dx + E]. */
function rightSide({ m1, m2, C, D, E }: P2Q12): [number, number, number] {
  const P = -(m1 + m2), Q = m1 * m2;
  return [Q * C, 2 * P * C + Q * D, 2 * C + P * D + Q * E];
}

const q2025p2q12: CardRoutine<P2Q12> = {
  draw: () => until(
    () => {
      const [m1, m2] = distinct([-3, -2, -1, 1, 2, 3, 4, 5, 6], 2).sort((a, b) => a - b);
      return { m1, m2, C: nonZero(-2, 2), D: nonZero(-3, 3), E: nonZero(-5, 5), A: nonZero(-5, 5), B: nonZero(-5, 5) };
    },
    (n) => {
      const { m1, m2, D, E, A, B } = n;
      // Every term present, as the paper's: a y' term, a quadratic with all
      // three terms, and both conditions non-zero; numbers within 60.
      const rhs = rightSide(n);
      const y0 = A + B + E, y1 = m1 * A + m2 * B + D;
      return m1 + m2 !== 0 && rhs.every(c => c !== 0 && Math.abs(c) <= 60) && y0 !== 0 && y1 !== 0 && Math.abs(y1) <= 40;
    },
  ),

  build: (n): Built => {
    const { m1, m2, C, D, E, A, B } = n;
    const P = -(m1 + m2), Q = m1 * m2;
    const rhs = poly(rightSide(n));
    const y0 = A + B + E, y1 = m1 * A + m2 * B + D;
    const exp = (m: number) => `e^{${sum([{ coef: m, body: 'x' }])}}`;
    const equation = `${sum([{ coef: 1, body: D2 }, { coef: P, body: D1 }, { coef: Q, body: 'y' }])} = ${rhs}`;
    const auxiliary = `${poly([1, P, Q], 'm')} = 0`;
    const cf = `y = A${exp(m1)} + B${exp(m2)}`;
    const pi = `y = Cx^{2} + Dx + E$, $${D1} = 2Cx + D$, $${D2} = 2C`;
    const coefIn = (k: number, expr: string) => (k === 1 ? ` + (${expr})` : k === -1 ? ` - (${expr})` : `${k < 0 ? ' - ' : ' + '}${Math.abs(k)}(${expr})`);
    const substituted = `2C${coefIn(P, '2Cx + D')}${coefIn(Q, 'Cx^{2} + Dx + E')}`;
    const general = `y = ${sum([
      { coef: 1, body: `A${exp(m1)}` }, { coef: 1, body: `B${exp(m2)}` },
      { coef: C, body: 'x^{2}' }, { coef: D, body: 'x' }, { coef: E, body: '' },
    ])}`;
    const derivative = `${D1} = ${sum([{ coef: m1, body: `A${exp(m1)}` }, { coef: m2, body: `B${exp(m2)}` }, { coef: 2 * C, body: 'x' }, { coef: D, body: '' }])}`;
    const simultaneous = `A + B = ${y0 - E}$, $${sum([{ coef: m1, body: 'A' }, { coef: m2, body: 'B' }])} = ${y1 - D}`;
    const answer = `y = ${sum([{ coef: A, body: exp(m1) }, { coef: B, body: exp(m2) }, { coef: C, body: 'x^{2}' }, { coef: D, body: 'x' }, { coef: E, body: '' }])}`;
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
        `$(${poly([1, -m1], 'm')})(${poly([1, -m2], 'm')}) = 0$, so the complementary function is $${cf}$`,
        `For the particular integral, $${pi}$`,
        `$${substituted} = ${rhs}$`,
        `Comparing coefficients: $C = ${C},\\ D = ${D},\\ E = ${E}$`,
        `The general solution is $${general}$`,
        `$${derivative}$`,
        `At $x = 0$: $${simultaneous}$`,
        `So $A = ${A},\\ B = ${B}$ and $${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1, 1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          'The right-hand side is a quadratic. What form should the particular integral take?',
          'Write the auxiliary equation.',
          'Solve it and write the complementary function.',
          'Write a general quadratic as the particular integral, and differentiate it twice.',
          'Substitute into the left-hand side of the equation.',
          'Compare coefficients to find the three constants.',
          'Write the general solution: the complementary function plus the particular integral.',
          'Differentiate the general solution.',
          'Put in the conditions at $x = 0$ to get two equations in $A$ and $B$.',
          'Solve them and state the particular solution.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        shows: [null, `$${auxiliary}$`, `$${cf}$`, `$${pi}$`, `$${substituted}$`, `$C = ${C},\\ D = ${D},\\ E = ${E}$`, `$${general}$`, `$${derivative}$`, `$${simultaneous}$`, null],
        watch: { at: 1, text: 'Write "$= 0$" on the auxiliary equation, or the first mark goes.' },
      },
    };
  },
};

// ── 2025 P2 Q14 ────────────────────────────────────────────────────────────
// dy/dx - (n/x)y = xⁿ sec² kx: integrating factor x^{-n}, y = xⁿ((1/k) tan kx + c)

interface P2Q14 { n: number; k: number }

const q2025p2q14: CardRoutine<P2Q14> = {
  // n from 2: at n = 1 the right side is a bare x, the paper's x^n shape gone.
  draw: () => ({ n: int(2, 4), k: int(2, 9) }),

  build: ({ n, k }): Built => {
    const xn = `x^{${n}}`;
    const coefY = `\\frac{${n}}{x}`;
    const sec = `\\sec^{2} ${k}x`;
    const IFform = `e^{\\int -\\frac{${n}}{x}\\,dx}`;
    const IF = `\\frac{1}{${xn}}`;
    const integral = `\\frac{y}{${xn}} = \\int \\frac{1}{${xn}}${xn}${sec}\\,dx`;
    const integrated = `\\frac{1}{${k}}\\tan ${k}x + c`;
    const answer = `y = ${xn}\\left(${integrated}\\right)`;
    return {
      questionLines: [
        'Find the general solution of the differential equation',
        '',
        `$${D1} - ${coefY}y = ${xn}${sec}.$`,
        '',
        'Give your answer in the form $y = f(x).$',
      ],
      solutionSteps: [
        `The integrating factor is $${IFform}$`,
        `$= e^{-${n}\\ln x} = ${IF}$`,
        `$${integral}$`,
        `$\\frac{y}{${xn}} = ${integrated}$`,
        `$${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          'The equation is linear in $y$. What do you multiply through by to make the left side one derivative?',
          'Write the integrating factor as $e$ to the integral of the coefficient of $y$.',
          'Simplify the integrating factor.',
          'Multiply through and write the equation as an integral equation.',
          'Integrate, including the constant.',
          'Rearrange to give $y = f(x)$.',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [null, `$${IFform}$`, `$${IF}$`, `$${integral}$`, `$${integrated}$`, null],
        watch: { at: 1, text: `The coefficient of $y$ is $-${coefY}$. Keep its minus sign in the integrating factor.` },
      },
    };
  },
};

// ── 2024 P2 Q4 ─────────────────────────────────────────────────────────────
// y'' + b y' + c y = 0 from two whole roots, with y(0) and y'(0) given.

interface P2Q4of2024 { m1: number; m2: number; A: number; B: number }

const q2024p2q4: CardRoutine<P2Q4of2024> = {
  // The roots in order, the smaller first, as the paper's -2 and 4.
  draw: () => until(
    () => {
      const [r, s] = distinct([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6], 2);
      return { m1: Math.min(r, s), m2: Math.max(r, s), A: nonZero(-6, 6), B: nonZero(-6, 6) };
    },
    // The y' term stays (roots not summing to 0), and neither condition is 0.
    ({ m1, m2, A, B }) => m1 + m2 !== 0 && A + B !== 0 && m1 * A + m2 * B !== 0,
  ),

  build: ({ m1, m2, A, B }): Built => {
    const y0 = A + B, y1 = m1 * A + m2 * B;
    const e = (m: number) => `e^{${sum([{ coef: m, body: 'x' }])}}`;
    const equation = `${sum([{ coef: 1, body: D2 }, { coef: -(m1 + m2), body: D1 }, { coef: m1 * m2, body: 'y' }])} = 0`;
    const auxiliary = `${poly([1, -(m1 + m2), m1 * m2], 'm')} = 0`;
    const factorised = `(${poly([1, -m1], 'm')})(${poly([1, -m2], 'm')}) = 0`;
    const general = `y = A${e(m1)} + B${e(m2)}`;
    const derivative = `${D1} = ${sum([{ coef: m1, body: `A${e(m1)}` }, { coef: m2, body: `B${e(m2)}` }])}`;
    const simultaneous = `A + B = ${y0}$ and $${sum([{ coef: m1, body: 'A' }, { coef: m2, body: 'B' }])} = ${y1}`;
    const particular = `y = ${sum([{ coef: A, body: e(m1) }, { coef: B, body: e(m2) }])}`;
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
        `$${factorised}$, so $m = ${m1},\\ m = ${m2}$ and $${general}$`,
        `$${derivative}$`,
        `At $x = 0$: $${simultaneous}$, so $A = ${A}$`,
        `Then $B = ${B}$, and $${particular}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `$${particular}$`,
      ladder: {
        moves: [
          'A second-order equation with zero on the right: what equation in $m$ does it lead to?',
          'Write the auxiliary equation from the coefficients.',
          'Solve it and write the general solution, with two constants.',
          'Differentiate the general solution.',
          `Put $x = 0$ into both $y$ and $${D1}$, and solve for one constant.`,
          'Find the other constant and state the particular solution, starting "$y =$".',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [null, `$${auxiliary}$`, `$${general}$`, `$${derivative}$`, `$A = ${A}$ or $B = ${B}$`, null],
        watch: { at: 1, text: 'Write "$= 0$" on the auxiliary equation, or the first mark goes.' },
      },
    };
  },
};

// ── 2024 P2 Q15 ────────────────────────────────────────────────────────────
// dW/dt = (M - W)/k, W(0) = W0: (a) W in t; (b) the rate at t = T; (c) the limit M.

interface P2Q15of2024 { M: number; k: number; W0: number; T: number }

/** A power of e with a fraction for its exponent, as the paper: `e^{-\frac{67}{120}}`, `e^{-\frac{1}{120}t}`. */
const eMinus = (c: Q, body = '') =>
  `e^{-${c.d === 1n ? `${c.n === 1n && body ? '' : c.n}` : `\\frac{${c.n}}{${c.d}}`}${body}}`;

const q2024p2q15: CardRoutine<P2Q15of2024> = {
  draw: () => until(
    () => {
      const M = int(20, 60);
      return { M, k: pick([100, 120, 150, 180, 200, 240]), W0: int(2, M - 5), T: int(20, 99) };
    },
    // The rate in (b) at least 0.1 kg per minute, so two places show it, as the paper's 0.13.
    ({ M, k, W0, T }) => ((M - W0) / k) * Math.exp(-T / k) >= 0.1,
  ),

  build: ({ M, k, W0, T }): Built => {
    const gap = M - W0;
    const inT = eMinus(q(1, k), 't');
    const W = `W = ${M} - ${gap}${inT}`;
    const rateC = q(gap, k);
    const exact = `${rateC.d === 1n ? rateC.n : `\\frac{${rateC.n}}{${rateC.d}}`}${eMinus(q(T, k))}`;
    const value = rounded((gap / k) * Math.exp(-T / k), 2);
    const DW = '\\frac{dW}{dt}';
    const separated = `\\int \\frac{dW}{${M} - W} = \\int \\frac{dt}{${k}}`;
    const inTermsOfT = `${DW} = \\frac{${M} - (${M} - ${gap}${inT})}{${k}}`;
    return {
      questionLines: [
        'A storage tank contains a mixture of salt and water. An additional amount of salt and water pours in while, at the same time, some of the existing mixture pours out.',
        'The process can be modelled by the differential equation',
        '',
        `$${DW} = \\frac{${M} - W}{${k}}, W \\lt ${M}$`,
        '',
        `where $W$ is the amount of salt in kilograms at time $t$ minutes. Initially, the storage tank contains ${W0} kilograms of salt.`,
        '<b>(a)</b> Express $W$ in terms of $t.$',
        `<b>(b)</b> Find the rate at which the amount of salt is increasing after ${T} minutes.`,
        '',
        'As the process continues, the amount of salt approaches a limit $L$ kilograms.',
        '<b>(c)</b> Find the value of $L$, justifying your answer.',
      ],
      solutionSteps: [
        `<strong>(a)</strong> Separating the variables, $${separated}$`,
        `<strong>(a)</strong> The left side is $-\\ln(${M} - W)$`,
        `<strong>(a)</strong> The right side is $\\frac{1}{${k}}t + c$`,
        `<strong>(a)</strong> At $t = 0$, $W = ${W0}$: $-\\ln ${gap} = c$, so $c = -\\ln ${gap}$`,
        `<strong>(a)</strong> $\\ln(${M} - W) = \\ln ${gap} - \\frac{1}{${k}}t$, so $${W}$`,
        `<strong>(b)</strong> $${inTermsOfT}$`,
        `<strong>(b)</strong> At $t = ${T}$, $${DW} = ${exact} \\approx ${value}$ kilograms per minute`,
        `<strong>(c)</strong> $L = ${M}$, because $${inT} \\to 0$ as $t \\to \\infty.$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1, 1],
      finalAnswer: `(a) $${W}$<br>(b) $${exact}$ (or $${value}$) kilograms per minute<br>(c) $L = ${M}$, because $${inT} \\to 0$ as $t \\to \\infty.$`,
      ladder: {
        moves: [
          'Can you get the $W$ terms on one side and the $t$ terms on the other?',
          '(a) Separate the variables and write both sides as integrals.',
          '(a) Integrate the $W$ side. Watch the sign.',
          '(a) Integrate the $t$ side, with a constant.',
          '(a) Use the starting amount to find the constant.',
          '(a) Rearrange to give $W$ in terms of $t$.',
          `(b) Use the differential equation, or your answer to (a), to write $${DW}$ in terms of $t$.`,
          `(b) Evaluate it at $t = ${T}$.`,
          '(c) What happens to the exponential term as $t$ gets very large?',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1, 1],
        shows: [null, `$${separated}$`, `$-\\ln(${M} - W)$`, `$\\frac{1}{${k}}t + c$`, `$c = -\\ln ${gap}$`, null, `$${inTermsOfT}$`, `$${exact}$ (kilograms per minute)`, null],
        watch: { at: 1, text: 'Write both integral signs, with $dW$ on one side and $dt$ on the other, or the first mark goes.' },
      },
    };
  },
};

// ── 2023 P1 Q5 ─────────────────────────────────────────────────────────────
// y'' + Py' + Qy = a quadratic, roots m1 > m2, particular integral
// Cx² + Dx + E, then y(0) and y'(0): built from the answer.

interface P1Q5of2023 { m1: number; m2: number; C: number; D: number; E: number; A: number; B: number }

/** The right-hand side for this particular integral: L[Cx² + Dx + E]. */
function quadraticRight({ m1, m2, C, D, E }: P1Q5of2023): [number, number, number] {
  // y'' - (m1 + m2)y' + m1 m2 y, with y = Cx² + Dx + E.
  const rootSum = m1 + m2, rootProduct = m1 * m2;
  return [rootProduct * C, rootProduct * D - 2 * rootSum * C, 2 * C - rootSum * D + rootProduct * E];
}

/** ` - 4(2Cx + D)`, ` + (…)`: a coefficient times a bracket, joined as a paper joins it. */
const timesBracket = (k: number, expr: string) =>
  `${k < 0 ? ' - ' : ' + '}${Math.abs(k) === 1 ? '' : Math.abs(k)}(${expr})`;

const q2023p1q5: CardRoutine<P1Q5of2023> = {
  draw: () => until(
    () => {
      const [m1, m2] = distinct([-3, -2, -1, 1, 2, 3, 4, 5, 6], 2).sort((a, b) => b - a);
      return { m1, m2, C: nonZero(-3, 3), D: nonZero(-3, 3), E: nonZero(-5, 5), A: nonZero(-5, 5), B: nonZero(-5, 5) };
    },
    (n) => {
      const { m1, m2, D, E, A, B } = n;
      // Every term present, as the paper's: a y' term, a quadratic with all
      // three terms, and both conditions non-zero; numbers within 60.
      const y0 = A + B + E, y1 = m1 * A + m2 * B + D;
      return m1 + m2 !== 0 && quadraticRight(n).every(c => c !== 0 && Math.abs(c) <= 60) && y0 !== 0 && y1 !== 0 && Math.abs(y1) <= 40;
    },
  ),

  build: (n): Built => {
    const { m1, m2, C, D, E, A, B } = n;
    const P = -(m1 + m2), Q = m1 * m2;
    const rhs = poly(quadraticRight(n));
    const y0 = A + B + E, y1 = m1 * A + m2 * B + D;
    const exp = (m: number) => `e^{${sum([{ coef: m, body: 'x' }])}}`;
    const equation = `${sum([{ coef: 1, body: D2 }, { coef: P, body: D1 }, { coef: Q, body: 'y' }])} = ${rhs}`;
    const auxiliary = `${poly([1, P, Q], 'm')} = 0`;
    const cf = `y = A${exp(m1)} + B${exp(m2)}`;
    const pi = `y = Cx^{2} + Dx + E$, $${D1} = 2Cx + D$, $${D2} = 2C`;
    const substituted = `2C${timesBracket(P, '2Cx + D')}${timesBracket(Q, 'Cx^{2} + Dx + E')}`;
    const constants = `C = ${C},\\ D = ${D}$ and $E = ${E}`;
    const general = `y = ${sum([
      { coef: 1, body: `A${exp(m1)}` }, { coef: 1, body: `B${exp(m2)}` },
      { coef: C, body: 'x^{2}' }, { coef: D, body: 'x' }, { coef: E, body: '' },
    ])}`;
    const derivative = `${D1} = ${sum([{ coef: m1, body: `A${exp(m1)}` }, { coef: m2, body: `B${exp(m2)}` }, { coef: 2 * C, body: 'x' }, { coef: D, body: '' }])}`;
    const simultaneous = `A + B = ${y0 - E}$, $${sum([{ coef: m1, body: 'A' }, { coef: m2, body: 'B' }])} = ${y1 - D}`;
    const answer = `y = ${sum([{ coef: A, body: exp(m1) }, { coef: B, body: exp(m2) }, { coef: C, body: 'x^{2}' }, { coef: D, body: 'x' }, { coef: E, body: '' }])}`;
    return {
      questionLines: [
        'Find the particular solution of the differential equation',
        '',
        `$${equation}$`,
        '',
        `given that $y = ${y0}$, $${D1} = ${y1}$ when $x = 0.$`,
      ],
      solutionSteps: [
        `The auxiliary equation is $${auxiliary}$`,
        `$(${poly([1, -m1], 'm')})(${poly([1, -m2], 'm')}) = 0$, so the complementary function is $${cf}$`,
        `For the particular integral, $${pi}$`,
        `Substituting into the left-hand side: $${substituted} = ${rhs}$`,
        `Comparing coefficients: $${constants}$`,
        `The general solution is $${general}$`,
        `$${derivative}$`,
        `At $x = 0$: $${simultaneous}$`,
        `So $A = ${A},\\ B = ${B}$ and $${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1, 1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          'The right-hand side is a quadratic. What form should the particular integral take?',
          'Write the auxiliary equation.',
          'Solve it and write the complementary function.',
          'Write a general quadratic as the particular integral, and differentiate it twice.',
          'Substitute into the left-hand side of the equation.',
          'Compare coefficients to find the three constants.',
          'Write the general solution: the complementary function plus the particular integral.',
          'Differentiate the general solution.',
          'Put in the conditions at $x = 0$ to get two equations in $A$ and $B$.',
          'Solve them and state the particular solution.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        shows: [null, `$${auxiliary}$`, `$${cf}$`, `$${pi}$`, `$${substituted}$`, `$${constants}$`, `$${general}$`, `$${derivative}$`, `$${simultaneous}$`, null],
        watch: { at: 1, text: 'Write "$= 0$" on the auxiliary equation, or the first mark goes.' },
      },
    };
  },
};

// ── 2023 P2 Q7 ─────────────────────────────────────────────────────────────
// (a) dy/dx - py = A e^{qx}, y(0) given: y = B e^{qx} + C e^{px}, B = A/(q - p);
// (b) that y also solves y''' - q y'' = k e^{px}: k = C p²(p - q).

interface P2Q7of2023 { p: number; q: number; B: number; C: number }

const D3 = '\\frac{d^{3}y}{dx^{3}}';

const q2023p2q7: CardRoutine<P2Q7of2023> = {
  // Built from the answer: B and C whole, so A = B(q - p) and y(0) = B + C.
  draw: () => until(
    () => ({ p: pick([-3, -2, -1, 1, 2, 3, 4]), q: int(1, 6), B: nonZero(-5, 5), C: nonZero(-5, 5) }),
    ({ p, q: qq, B, C }) => qq !== p && Math.abs(B * (qq - p)) <= 20 && B + C !== 0,
  ),

  build: ({ p, q: qq, B, C }): Built => {
    const e = (m: number) => `e^{${sum([{ coef: m, body: 'x' }])}}`;
    const A = B * (qq - p), y0 = B + C, k = C * p * p * (p - qq);
    const equation = `${sum([{ coef: 1, body: D1 }, { coef: -p, body: 'y' }])} = ${sum([{ coef: A, body: e(qq) }])}`;
    const IF = e(-p);
    const times = A === 1 ? '' : A === -1 ? '-' : `${A}`;
    const integral = `${IF}y = ${times}\\int ${e(qq)}${IF}\\,dx`;
    const over = sum([{ coef: q(1, qq - p), body: e(qq - p) }]);
    // A of 1 or -1 is not written out: "-e^{x} + c", not "(-1) × e^{x} + c" (the owner, full read 2026-10-05).
    const unit = Math.abs(A) === 1;
    const integratedTo = `${sum([{ coef: B, body: e(qq - p) }])} + c`;
    const integrated = unit ? integratedTo : `${A < 0 ? `(${A})` : A} \\times ${qq - p < 0 ? `\\left(${over}\\right)` : over} + c`;
    const general = `y = ${sum([{ coef: B, body: e(qq) }, { coef: 1, body: `c${e(p)}` }])}`;
    const particular = `y = ${sum([{ coef: B, body: e(qq) }, { coef: C, body: e(p) }])}`;
    const second = sum([{ coef: B * qq * qq, body: e(qq) }, { coef: C * p * p, body: e(p) }]);
    const third = sum([{ coef: B * qq ** 3, body: e(qq) }, { coef: C * p ** 3, body: e(p) }]);
    const lhs = sum([{ coef: 1, body: D3 }, { coef: -qq, body: D2 }]);
    return {
      questionLines: [
        '<b>(a)</b> Solve the differential equation',
        '',
        `$${equation}$`,
        '',
        `given that when $x = 0$, $y = ${y0}.$ Express $y$ in terms of $x.$`,
        '<b>(b)</b> The solution of the differential equation in (a) is also a solution of',
        '',
        `$${lhs} = ke^{${sum([{ coef: p, body: 'x' }])}}$, $k \\in \\mathbb{R}.$`,
        '',
        'Find the value of $k.$',
      ],
      solutionSteps: [
        `<strong>(a)</strong> The integrating factor is $e^{\\int ${-p} \\, dx} = ${IF}$`,
        `<strong>(a)</strong> $${integral}$`,
        `<strong>(a)</strong> $${IF}y = ${unit ? integratedTo : `${integrated} = ${integratedTo}`}$`,
        `<strong>(a)</strong> $${general}$; at $x = 0$, $${y0} = ${B} + c$, so $c = ${C}$ and $${particular}$`,
        `<strong>(b)</strong> $${D2} = ${second}$, so $${D3} = ${third}$`,
        `<strong>(b)</strong> $${lhs} = ${third} - ${qq === 1 ? '' : qq}(${second}) = ${sum([{ coef: k, body: e(p) }])}$, so $k = ${k}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1],
      finalAnswer: `(a) $${particular}$<br>(b) $k = ${k}$`,
      ladder: {
        moves: [
          '(a) is linear in $y$. What do you multiply through by to make the left side one derivative?',
          '(a) Find the integrating factor.',
          '(a) Multiply through and write the equation as an integral equation.',
          '(a) Combine the exponentials on the right, and integrate.',
          `(a) Use $y = ${y0}$ at $x = 0$ to find the constant, and write $y$ in terms of $x$.`,
          '(b) Differentiate your solution to (a) three times.',
          '(b) Substitute into the left-hand side and compare with the right to find $k$.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1],
        shows: [null, null, `$${integral}$`, `$${integrated}$`, null, `$${D3} = ${third}$`, null],
        watch: { at: 1, text: 'This one needs an integrating factor. Separating the variables earns nothing in (a).' },
      },
    };
  },
};

// ── 2023 P2 Q13 ────────────────────────────────────────────────────────────
// A decathlon field event's points, dP/dm = CP/(m - B), through one real
// performance: P = e^c (m - B)^C. The events' A, B and C are the real scoring
// tables' (the paper's long jump: 0.14354, 220, 1.4), and the given points are
// what those tables award, so every draw is true, as the paper's 807 cm and
// 1079 points are.

interface P2Q13of2023 { event: number; M: number }

interface FieldEvent {
  name: string; A: number; B: number; C: number;
  /** "the distance jumped in centimetres"; `unit` is the performance's word. */
  measure: string; unit: 'centimetres' | 'metres'; noun: string;
  /** The performance's range, in centimetres. */
  lo: number; hi: number;
}

const EVENTS: readonly FieldEvent[] = [
  { name: 'long jump', A: 0.14354, B: 220, C: 1.4, measure: 'the distance jumped in centimetres', unit: 'centimetres', noun: 'jump', lo: 600, hi: 850 },
  { name: 'high jump', A: 0.8465, B: 75, C: 1.42, measure: 'the height jumped in centimetres', unit: 'centimetres', noun: 'jump', lo: 170, hi: 230 },
  { name: 'pole vault', A: 0.2797, B: 100, C: 1.35, measure: 'the height cleared in centimetres', unit: 'centimetres', noun: 'vault', lo: 380, hi: 560 },
  { name: 'shot put', A: 51.39, B: 1.5, C: 1.05, measure: 'the distance thrown in metres', unit: 'metres', noun: 'throw', lo: 1100, hi: 1700 },
  { name: 'discus', A: 12.91, B: 4, C: 1.1, measure: 'the distance thrown in metres', unit: 'metres', noun: 'throw', lo: 3500, hi: 5200 },
  { name: 'javelin', A: 10.14, B: 7, C: 1.08, measure: 'the distance thrown in metres', unit: 'metres', noun: 'throw', lo: 4500, hi: 7200 },
];

/** The performance as the question prints it: 807 (cm), or 15.23 (m, to the centimetre). */
const performance = (ev: FieldEvent, M: number) => (ev.unit === 'metres' ? (M / 100).toFixed(2) : `${M}`);

const q2023p2q13: CardRoutine<P2Q13of2023> = {
  // The paper's long jump half the draws, the other five field events the rest.
  draw: () => {
    const event = pick([true, false]) ? 0 : int(1, EVENTS.length - 1);
    return { event, M: int(EVENTS[event].lo, EVENTS[event].hi) };
  },

  build: ({ event, M }): Built => {
    const ev = EVENTS[event];
    const m1 = Number(performance(ev, M));
    // The points the scoring tables award: A(M - B)^C, cut to a whole number.
    const P1 = Math.floor(ev.A * (m1 - ev.B) ** ev.C);
    const gap = Number((m1 - ev.B).toFixed(2));
    const c = Math.log(P1) - ev.C * Math.log(gap);
    const c2 = rounded(c, 2);
    // From the printed c, so each line follows from the one before (the owner, full read 2026-10-05).
    const coef = Math.exp(Number(c2)).toPrecision(2);
    const inM = `m - ${ev.B}`;
    const logM = `${ev.C}\\ln(${inM})`;
    const eForm = `P = e^{${logM} ${c < 0 ? '-' : '+'} ${c2.replace('-', '')}}`;
    const answer = `P = ${coef}(${inM})^{${ev.C}}`;
    const separated = `\\int \\frac{1}{P}\\,dP = \\int \\frac{${ev.C}}{${inM}}\\,dm`;
    const substituted = `\\ln ${P1} = ${ev.C}\\ln(${performance(ev, M)} - ${ev.B}) + c`;
    return {
      questionLines: [
        `Points scored in the ${ev.name} element of the decathlon can be calculated using a solution of the differential equation`,
        '',
        `$\\frac{dP}{dm} = \\frac{${ev.C}P}{${inM}}$, $m \\gt ${ev.B}$`,
        '',
        `where $m$ is ${ev.measure} and $P$ the points scored.`,
        `Given that a ${ev.noun} of ${performance(ev, M)} ${ev.unit} scores ${P1} points, find an expression for $P$ in terms of $m.$`,
      ],
      solutionSteps: [
        `Separating the variables, $${separated}$`,
        'The left side is $\\ln P$',
        `The right side is $${logM} + c$`,
        `$${substituted}$`,
        `$c = \\ln ${P1} - ${ev.C}\\ln ${gap} = ${c2}$ (to 2 decimal places)`,
        `$${eForm}$, so $${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1],
      finalAnswer: `$${answer}$ (or $${eForm}$)`,
      ladder: {
        moves: [
          'Can you get all the $P$ on one side and all the $m$ on the other?',
          'Separate the variables and write both sides as integrals.',
          'Integrate the $P$ side.',
          'Integrate the $m$ side, with a constant.',
          `Substitute the ${ev.noun} of ${performance(ev, M)} ${ev.unit === 'metres' ? 'm' : 'cm'} and its ${P1} points.`,
          'Find the constant.',
          'Use the log laws and exponentials to write $P$ in terms of $m$.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1],
        shows: [null, `$${separated}$`, '$\\ln P$', `$${logM} + c$`, `$${substituted}$`, null, null],
        watch: { at: 3, text: 'Leave out the constant and the last three marks are gone.' },
      },
    };
  },
};

export const ROUTINES = {
  '2023 P1 Q5': q2023p1q5,
  '2023 P2 Q7': q2023p2q7,
  '2023 P2 Q13': q2023p2q13,
  '2024 P2 Q4': q2024p2q4,
  '2024 P2 Q15': q2024p2q15,
  '2025 P1 Q7': q2025p1q7,
  '2025 P2 Q12': q2025p2q12,
  '2025 P2 Q14': q2025p2q14,
  '2026 P1 Q4': q2026p1q4,
};
