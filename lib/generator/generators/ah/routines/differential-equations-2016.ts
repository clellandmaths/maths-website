/**
 * Advanced Higher, Differential Equations: how each 2016 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/differential-equations.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { distinct, int, nonZero, pick, until } from '../../core/draw';
import { poly, sum, truncated } from '../../core/maths/format';

const D2 = '\\frac{d^{2}y}{dx^{2}}';
const D1 = '\\frac{dy}{dx}';

// ── 2016 Q15 ───────────────────────────────────────────────────────────────
// y'' + by' + cy = Px² + Qx + R with two negative roots m₁ < m₂: the
// complementary function Ae^{m₁x} + Be^{m₂x}, the particular integral
// Cx² + Dx + E, then y(0) and y'(0). Built from the answer. Its own routine;
// 2023 P1 Q5 and 2025 P2 Q12 (locked) ask the same with their own numbers.

interface Q15of2016 { m1: number; m2: number; C: number; D: number; E: number; A: number; B: number }

/** The equation's coefficients and right-hand side, and the two conditions. */
function equation2016({ m1, m2, C, D, E, A, B }: Q15of2016) {
  const b = -(m1 + m2), c = m1 * m2;
  return { b, c, P: c * C, Q: 2 * b * C + c * D, R: 2 * C + b * D + c * E, y0: A + B + E, y1: m1 * A + m2 * B + D };
}

const q2016q15: CardRoutine<Q15of2016> = {
  draw: () => until(
    () => {
      // Two different negative roots, as the paper's -3 and -2, the more
      // negative first, as the scheme's Ae^{-3x} + Be^{-2x}.
      const [r1, r2] = distinct([-5, -4, -3, -2, -1], 2);
      return {
        m1: Math.min(r1, r2), m2: Math.max(r1, r2),
        C: nonZero(-3, 3), D: nonZero(-4, 4), E: nonZero(-5, 5), A: nonZero(-15, 15), B: nonZero(-15, 15),
      };
    },
    // The quadratic on the right has all three terms, as the paper's, each
    // within 60; y(0) and y'(0) nonzero and within 20, as -6 and 3.
    (n) => {
      const { P, Q, R, y0, y1 } = equation2016(n);
      return [P, Q, R].every(v => v !== 0 && Math.abs(v) <= 60) && [y0, y1].every(v => v !== 0 && Math.abs(v) <= 20);
    },
    2000,
  ),

  build: (n): Built => {
    const { m1, m2, C, D, E, A, B } = n;
    const { b, c, P, Q, R, y0, y1 } = equation2016(n);
    const e1 = `e^{${sum([{ coef: m1, body: 'x' }])}}`, e2 = `e^{${sum([{ coef: m2, body: 'x' }])}}`;
    const lhs = sum([{ coef: 1, body: D2 }, { coef: b, body: D1 }, { coef: c, body: 'y' }]);
    const rhs = poly([P, Q, R]);
    const auxiliary = `${poly([1, b, c], 'm')} = 0`;
    const cf = `y = A${e1} + B${e2}`;
    const pi = 'y = Cx^{2} + Dx + E';
    const derivs = `${D1} = 2Cx + D$ and $${D2} = 2C`;
    const substituted = `2C ${b < 0 ? '-' : '+'} ${Math.abs(b)}(2Cx + D) + ${c}(Cx^{2} + Dx + E) = ${rhs}`;
    const general = `y = ${sum([{ coef: 1, body: `A${e1}` }, { coef: 1, body: `B${e2}` }, { coef: C, body: 'x^{2}' }, { coef: D, body: 'x' }, { coef: E, body: '' }])}`;
    const derivative = `${D1} = ${sum([{ coef: m1, body: `A${e1}` }, { coef: m2, body: `B${e2}` }, { coef: 2 * C, body: 'x' }, { coef: D, body: '' }])}`;
    const eqA = `A + B = ${y0 - E}`;
    const eqB = `${sum([{ coef: m1, body: 'A' }, { coef: m2, body: 'B' }])} = ${y1 - D}`;
    const answer = `y = ${sum([{ coef: A, body: e1 }, { coef: B, body: e2 }, { coef: C, body: 'x^{2}' }, { coef: D, body: 'x' }, { coef: E, body: '' }])}`;
    return {
      questionLines: [
        'Solve the differential equation',
        '',
        `$${lhs} = ${rhs}$`,
        '',
        `given $y = ${y0}$ and $${D1} = ${y1}$, when $x = 0.$`,
      ],
      solutionSteps: [
        `The auxiliary equation is $${auxiliary}$, so $m = ${m1}$, $m = ${m2}$`,
        `The complementary function is $${cf}$`,
        `For the particular integral, $${pi}$`,
        `$${derivs}$`,
        `Substituting, $${substituted}$; comparing the $x^{2}$ terms, $${c}C = ${P}$, so $C = ${C}$`,
        `Comparing the $x$ terms and the constants, $D = ${D},\\ E = ${E}$, so $${general}$`,
        `$${derivative}$`,
        `At $x = 0$: $${eqA}$ and $${eqB}$`,
        `$A = ${A}$`,
        `$B = ${B}$, and $${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          'The right-hand side is a quadratic. What form should the particular integral take?',
          'Write and solve the auxiliary equation.',
          'Write the complementary function.',
          'Write a general quadratic as the particular integral.',
          'Differentiate it twice.',
          'Substitute into the equation and compare coefficients to find one constant.',
          'Find the other two, and write the general solution.',
          'Differentiate the general solution.',
          'Put in the conditions at $x = 0$ to get two equations.',
          'Solve for one constant.',
          'Find the other and state the particular solution.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        shows: [
          null, `$${auxiliary}$, $m = ${m1}$, $m = ${m2}$`, `$${cf}$`, `$${pi}$`, `$${derivs}$`, `$C = ${C}$`,
          `$D = ${D},\\ E = ${E}$, $${general}$`, `$${derivative}$`, `$${eqA}$ and $${eqB}$`, `$A = ${A}$ or $B = ${B}$`, null,
        ],
        watch: { at: 8, text: 'Use the conditions on the general solution, not the complementary function on its own.' },
      },
    };
  },
};

// ── 2016 Q16 ───────────────────────────────────────────────────────────────
// Newton's cooling, dT/dt = -k(T - T_F), with t = 0 at noon:
// ln(T - T_F) = -kt + ln(R₁ - T_F); k from the reading Δ minutes later; then
// t at the starting temperature, negative, so the clock time before noon.

interface Q16of2016 { TF: number; T0: number; u1: number; u2: number; gap: 10 | 15 | 20 }

/** A temperature to one place, a whole one without it: `9.8`, `10`. */
const temp = (tenths: number) => (tenths % 10 === 0 ? `${tenths / 10}` : (tenths / 10).toFixed(1));

/** k and t, from the readings as printed. */
function times2016({ TF, T0, u1, u2, gap }: Q16of2016) {
  const k = Math.log(u1 / u2) / gap;
  const t = -Math.log((T0 - TF) / (u1 / 10)) / k;
  return { k, t };
}

const q2016q16: CardRoutine<Q16of2016> = {
  draw: () => until(
    () => {
      // The fridge from 2 to 6 °C (the paper's 4), the start from 18 to 30 °C
      // (the paper's 25); at noon 4 to 9 degrees above the fridge (the
      // paper's 5.8), and the second reading 10, 15 or 20 minutes later (the
      // paper's 15), its excess over the fridge a third to 0.7 of the first's
      // (the paper's 2.5 of 5.8) and at least 1.5 degrees.
      const u1 = int(40, 90);
      return { TF: int(2, 6), T0: int(18, 30), u1, u2: int(Math.max(15, Math.ceil(u1 / 3)), Math.floor(u1 * 0.7)), gap: pick([10, 15, 20] as const) };
    },
    // Placed in the fridge 10 to 55 minutes before noon (the paper's 22.93),
    // and t at least 0.1 of a minute from a half, so the nearest minute is
    // never a coin toss.
    (n) => {
      const { t } = times2016(n);
      const before = -t;
      return before >= 10 && before <= 55 && Math.abs((before % 1) - 0.5) >= 0.1 && n.T0 * 10 > n.TF * 10 + n.u1;
    },
    2000,
  ),

  build: (n): Built => {
    const { TF, T0, u1, u2, gap } = n;
    const { k, t } = times2016(n);
    const R1 = temp(TF * 10 + u1), R2 = temp(TF * 10 + u2), x1 = temp(u1), x2 = temp(u2);
    const minutes = Math.round(-t);
    const clock = `11:${String(60 - minutes).padStart(2, '0')}`;
    const kText = truncated(k, 5), tText = truncated(t, 2);
    const deg = (v: string | number) => `$${v}^{\\circ}\\text{C}.$`;
    const after = `12:${gap} pm`;
    const integral = '\\int \\frac{1}{(T - T_F)}\\,dT = \\int -k\\,dt';
    const integrated = '\\ln(T - T_F) = -kt + c';
    const constant = `\\ln(${R1} - ${TF}) = -k(0) + c$, $c = \\ln ${x1}`;
    const second = `\\ln(${R2} - ${TF}) = -${gap}k + \\ln ${x1}`;
    const kLine = `k = \\frac{\\ln ${x2} - \\ln ${x1}}{-${gap}} = ${kText}`;
    const start = `\\ln(${T0} - ${TF}) = -${kText}\\,t + \\ln ${x1}`;
    const tLine = `t = \\frac{\\ln ${T0 - TF} - \\ln ${x1}}{-${kText}}`;
    return {
      questionLines: [
        'A beaker of liquid was placed in a fridge.',
        'The rate of cooling is given by',
        '$\\frac{dT}{dt} = -k(T - T_F)$, $k > 0$,',
        'where $T_F$ is the constant temperature in the fridge and $T$ is the temperature of the liquid at time $t.$',
        `The constant temperature in the fridge is ${deg(TF)}`,
        `When first placed in the fridge, the temperature of the liquid was ${deg(T0)}`,
        `At 12 noon, the temperature of the liquid was ${deg(R1)}`,
        `At ${after}, the temperature of the liquid had dropped to ${deg(R2)}`,
        'At what time, to the nearest minute, was the liquid placed in the fridge?',
      ],
      solutionSteps: [
        `Separating the variables: $${integral}$`,
        `$${integrated}$`,
        `With $t = 0$ at noon: $${constant}$`,
        `At ${after}: $${second}$`,
        `$${kLine}$`,
        `When first placed in the fridge: $${start}$`,
        `$${tLine}$`,
        `$t = ${tText}$, before noon`,
        `The liquid was placed in the fridge at ${clock} (am)`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1, 1, 1],
      finalAnswer: `${clock} am`,
      ladder: {
        moves: [
          `The temperatures are given at noon and at 12:${gap}. Where is it easiest to put $t = 0$?`,
          'Separate the variables and write both sides as integrals.',
          'Integrate both sides, with a constant.',
          'Use the reading at noon to find the constant.',
          `Substitute the reading at 12:${gap}.`,
          'Solve for $k$.',
          `Now use the starting temperature, $${T0}^{\\circ}$C, in your equation.`,
          'Rearrange for $t$.',
          'Calculate $t$. What does a negative time mean?',
          'Convert to a clock time, to the nearest minute.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        shows: [null, `$${integral}$`, `$${integrated}$`, `$${constant}$`, `$${second}$`, `$${kLine}$`, `$${start}$`, `$${tLine}$`, `$t = ${tText}$`, null],
        watch: { at: 5, text: 'Keep $k$ unrounded until the end. Rounding early shifts the final time.' },
      },
    };
  },
};

export const ROUTINES = {
  '2016 Q15': q2016q15,
  '2016 Q16': q2016q16,
};
