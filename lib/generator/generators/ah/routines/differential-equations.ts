/**
 * Advanced Higher, Differential Equations: how each card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/differential-equations.ts` under the same label.
 */
import type { Built, CardRoutine } from '../types';
import { distinct, int, nonZero, pick, until } from '../../core/draw';
import { num, poly, rounded, sum } from '../../core/maths/format';
import { type Q, q } from '../../core/maths/rational';

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
// dy/dx = ty/(2x + β), y = K m^t at the x where 2x + β = m²: y = K(2x + β)^{t/2}.
// Widened on the owner's yes (variation-depth sheet, card 1, 2026-10-05): β = -1, 1, 3 or 5
// and t = 1 (the paper's) or 3, eight equations where there were three. β stays odd, as the
// paper's -1: 2x + 2 is 2(x + 1), which opens a route to (1/2) ln(x + 1) and another
// constant that the marking instructions do not follow. β = -2 would also send y below 1
// just past x = 1, against the paper's "x, y > 1".

interface P1Q7 { beta: -1 | 1 | 3 | 5; t: 1 | 3; m: number; K: number }

const q2025p1q7: CardRoutine<P1Q7> = {
  draw: () => {
    const beta = pick([-1, 1, 3, 5] as const);
    const t = pick([1, 3] as const);
    // 2x + β = m² at a whole x > 1: m = 3 or 5 (the paper's 3). With 3y on top y = K m³,
    // so m = 3 and K to 4: y at most 108.
    const m = t === 1 ? pick([3, 5]) : 3;
    return { beta, t, m, K: t === 1 ? int(2, 6) : int(2, 4) };
  },

  build: ({ beta, t, m, K }): Built => {
    const den = poly([2, beta]);
    const x0 = (m * m - beta) / 2, y0 = K * m ** t;
    const power = `\\frac{${t}}{2}`;
    const top = t === 1 ? 'y' : `${t}y`;
    const answer = `y = ${K}(${den})^{${power}}`;
    const separated = t === 1
      ? `\\int \\frac{dy}{y} = \\int \\frac{dx}{${den}}`
      : `\\int \\frac{dy}{y} = \\int \\frac{${t}}{${den}}\\,dx`;
    const rhs = `${power}\\ln(${den}) + c`;
    const constant = `c = \\ln ${K}`;
    // ln y0 = (t/2) ln m² + c = t ln m + c, the log of m^t.
    const fit = t === 1
      ? `\\ln ${y0} = ${power}\\ln ${m * m} + c = \\ln ${m} + c`
      : `\\ln ${y0} = ${power}\\ln ${m * m} + c = ${t}\\ln ${m} + c = \\ln ${m ** t} + c`;

    return {
      questionLines: [
        'Solve the differential equation',
        '',
        `$${D1} = \\frac{${top}}{${den}}$, $x, y > 1$,`,
        '',
        `given that $y = ${y0}$ when $x = ${x0}.$ Express $y$ in terms of $x.$`,
      ],
      solutionSteps: [
        `Separating the variables: $${separated}$`,
        'The left side: $\\ln y$',
        `The right side: $${rhs}$`,
        `At $x = ${x0}$, $y = ${y0}$: $${fit}$, so $${constant}$`,
        `$\\ln y = \\ln(${den})^{${power}} + \\ln ${K} = \\ln(${K}(${den})^{${power}})$, so $${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: t === 1
        ? `$${answer}$, or $y = ${K}\\sqrt{${den}}$`
        : `$${answer}$, or $y = ${K}(${den})\\sqrt{${den}}$`,
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

export const ROUTINES = {
  '2024 P2 Q4': q2024p2q4,
  '2024 P2 Q15': q2024p2q15,
  '2025 P1 Q7': q2025p1q7,
  '2025 P2 Q12': q2025p2q12,
  '2025 P2 Q14': q2025p2q14,
  '2026 P1 Q4': q2026p1q4,
};
