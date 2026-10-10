/**
 * Advanced Higher, Differential Equations: how each 2023 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/differential-equations.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { distinct, int, nonZero, pick, until } from '../../core/draw';
import { num, poly, rounded, sum } from '../../core/maths/format';
import { type Q, q } from '../../core/maths/rational';

const D2 = '\\frac{d^{2}y}{dx^{2}}';
const D1 = '\\frac{dy}{dx}';

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

// On the owner's "Yes do A and B" (variation-depth sheet, card 9, 2026-10-05): A, the six
// events drawn evenly (the long jump had half the draws); B, each draw its own table near
// the real one, so the answer changes with every draw, not with the event alone. The power
// moves by -0.04 to +0.05 and the start by up to two steps either side; the multiplier is
// set so a performance in the middle of the event's range scores what the real table gives.

interface P2Q13of2023 { event: number; M: number; dC: number; dB: number }

interface FieldEvent {
  name: string; A: number; B: number; C: number;
  /** "the distance jumped in centimetres"; `unit` is the performance's word. */
  measure: string; unit: 'centimetres' | 'metres'; noun: string;
  /** The performance's range, in centimetres. */
  lo: number; hi: number;
  /** One step of the made-up table's start, in the performance's unit. */
  step: number;
}

const EVENTS: readonly FieldEvent[] = [
  { name: 'long jump', A: 0.14354, B: 220, C: 1.4, measure: 'the distance jumped in centimetres', unit: 'centimetres', noun: 'jump', lo: 600, hi: 850, step: 10 },
  { name: 'high jump', A: 0.8465, B: 75, C: 1.42, measure: 'the height jumped in centimetres', unit: 'centimetres', noun: 'jump', lo: 170, hi: 230, step: 5 },
  { name: 'pole vault', A: 0.2797, B: 100, C: 1.35, measure: 'the height cleared in centimetres', unit: 'centimetres', noun: 'vault', lo: 380, hi: 560, step: 10 },
  { name: 'shot put', A: 51.39, B: 1.5, C: 1.05, measure: 'the distance thrown in metres', unit: 'metres', noun: 'throw', lo: 1100, hi: 1700, step: 0.5 },
  { name: 'discus', A: 12.91, B: 4, C: 1.1, measure: 'the distance thrown in metres', unit: 'metres', noun: 'throw', lo: 3500, hi: 5200, step: 0.5 },
  { name: 'javelin', A: 10.14, B: 7, C: 1.08, measure: 'the distance thrown in metres', unit: 'metres', noun: 'throw', lo: 4500, hi: 7200, step: 0.5 },
];

/** The performance as the question prints it: 807 (cm), or 15.23 (m, to the centimetre). */
const performance = (ev: FieldEvent, M: number) => (ev.unit === 'metres' ? (M / 100).toFixed(2) : `${M}`);

/** A number to 2 places, without trailing zeros: 1.4, 1.43, 1.5, 220. */
const short = (x: number) => `${Number(x.toFixed(2))}`;

/** This draw's table: the power and start moved, the multiplier set so the middle of the
 * range scores as the real table does; the points it awards, and the constant c. */
function decathlonTable({ event, M, dC, dB }: P2Q13of2023) {
  const real = EVENTS[event];
  const C = Number((real.C + dC / 100).toFixed(2));
  const B = Number((real.B + dB * real.step).toFixed(2));
  const mid = (real.lo + real.hi) / 2 / (real.unit === 'metres' ? 100 : 1);
  const A = (real.A * (mid - real.B) ** real.C) / (mid - B) ** C;
  const ev = { ...real, A, B, C };
  const m1 = Number(performance(ev, M));
  // The points this table awards: A(M - B)^C, cut to a whole number.
  const P1 = Math.floor(ev.A * (m1 - ev.B) ** ev.C);
  const gap = Number((m1 - ev.B).toFixed(2));
  return { ev, P1, gap, c: Math.log(P1) - ev.C * Math.log(gap) };
}

const q2023p2q13: CardRoutine<P2Q13of2023> = {
  // Never a table whose c rounds to 0.00 or so: "c = -0.00" and "P = 1.0(m - 5)^{1.07}"
  // read as a broken question, as the real tables' constants never do.
  draw: () => until(
    () => {
      const event = int(0, EVENTS.length - 1);
      return { event, M: int(EVENTS[event].lo, EVENTS[event].hi), dC: int(-4, 5), dB: int(-2, 2) };
    },
    d => Math.abs(decathlonTable(d).c) >= 0.1,
  ),

  build: (d): Built => {
    const { M } = d;
    const { ev, P1, gap, c } = decathlonTable(d);
    const c2 = rounded(c, 2);
    // From the printed c, so each line follows from the one before (the owner, full read 2026-10-05).
    const coef = Math.exp(Number(c2)).toPrecision(2);
    const inM = `m - ${short(ev.B)}`;
    const logM = `${short(ev.C)}\\ln(${inM})`;
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
};
