/**
 * Advanced Higher, Differentiation: how each 2021 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/differentiation.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int, pick, sign } from '../draw';
import { num, power, sum } from '../maths/format';
import { q } from '../maths/rational';

const DYDX = '\\frac{dy}{dx}';

// ── 2021 P1 Q1(a) ──────────────────────────────────────────────────────────
// y = x^n e^{kx} by the product rule

interface P1Q1aOf2021 { n: number; k: number }

const q2021p1q1a: CardRoutine<P1Q1aOf2021> = {
  // k never ±1, so the chain rule always brings a number out, as the paper's 5.
  draw: () => ({ n: int(2, 4), k: sign() * int(2, 6) }),

  build: ({ n, k }): Built => {
    const e = `e^{${sum([{ coef: k, body: 'x' }])}}`;
    const y = `x^{${n}}${e}`;
    const first = `${n}${power('x', n - 1)}`;
    const answer = sum([{ coef: n, body: `${power('x', n - 1)}${e}` }, { coef: k, body: `x^{${n}}${e}` }]);
    return {
      questionLines: [`Differentiate $y = ${y}.$`],
      solutionSteps: [
        `By the product rule, $${DYDX} = ${first}${e} + x^{${n}}(\\ldots)$`,
        `$${DYDX} = ${answer}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$${DYDX} = ${answer}$`,
      ladder: {
        moves: [
          '$y$ is two factors multiplied together. Which rule does that need?',
          'Use the product rule: differentiate each factor in turn.',
          `Differentiate $${e}$ with the chain rule, and write both terms.`,
        ],
        marks: [0, 1, 1],
        shows: [null, `$${first}(\\ldots) + \\ldots$ or $${sum([{ coef: 1, body: '\\ldots' }, { coef: k, body: `${e}(\\ldots)` }])}$`, null],
      },
    };
  },
};

// ── 2021 P1 Q1(b) ──────────────────────────────────────────────────────────
// y = tan x/(x^n + c) by the quotient rule

interface P1Q1bOf2021 { n: number; c: number }

const q2021p1q1b: CardRoutine<P1Q1bOf2021> = {
  draw: () => ({ n: int(2, 8), c: int(1, 5) }),

  build: ({ n, c }): Built => {
    const bottom = `x^{${n}} + ${c}`;
    const squared = `(${bottom})^{2}`;
    const first = `(${bottom})\\sec^{2} x`;
    const second = `${n}${power('x', n - 1)}\\tan x`;
    const whole = `\\frac{${first} - ${second}}{${squared}}`;
    return {
      questionLines: [`Given $y = \\frac{\\tan x}{${bottom}}$`, `find $${DYDX}.$`],
      solutionSteps: [
        `By the quotient rule, $${DYDX} = \\frac{${first} - \\ldots}{${squared}}$`,
        `$${DYDX} = ${whole}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$${DYDX} = ${whole}$`,
      ladder: {
        moves: [
          'The function is one expression divided by another. Which rule does that need?',
          `Set up the quotient rule with $${squared}$ as the denominator.`,
          'Complete the numerator: the top\'s derivative times the bottom, minus the top times the bottom\'s derivative.',
        ],
        marks: [0, 1, 1],
        shows: [null, `$\\frac{${first} - \\ldots}{${squared}}$ or $\\frac{\\ldots - ${second}}{${squared}}$`, null],
      },
    };
  },
};

// ── 2021 P1 Q6 ─────────────────────────────────────────────────────────────
// v = 3m t^2 - B e^{-kt}, zero displacement at t = 0: (a) integrate and fit
// the constant, s = m t^3 + (B/k)e^{-kt} - B/k; (b) a = dv/dt at 0 is Bk.

interface P1Q6of2021 { m: number; B: number; k: number }

const q2021p1q6: CardRoutine<P1Q6of2021> = {
  draw: () => ({ m: int(1, 4), B: int(1, 3), k: int(2, 5) }),

  build: ({ m, B, k }): Built => {
    const e = `e^{-${k}t}`;
    const v = sum([{ coef: 3 * m, body: 't^{2}' }, { coef: -B, body: e }]);
    const lead = sum([{ coef: m, body: 't^{3}' }]);
    const share = q(B, k);
    const integrated = sum([{ coef: m, body: 't^{3}' }, { coef: share, body: e }]);
    const s = sum([{ coef: m, body: 't^{3}' }, { coef: share, body: e }, { coef: q(-B, k), body: '' }]);
    const accel = sum([{ coef: 6 * m, body: 't' }, { coef: B * k, body: e }]);
    const at0 = B * k;
    const ms2 = '\\ \\text{ms}^{-2}';
    return {
      questionLines: [
        `The velocity, $v$ ms$^{-1}$, of a particle after $t$ seconds is given by $v = ${v}.$ At time $t = 0$ the displacement of the particle is zero.`,
        '<b>(a)</b> Find an expression for the displacement of the particle.',
        '<b>(b)</b> Calculate the acceleration of the particle when $t = 0.$',
      ],
      solutionSteps: [
        `<strong>(a)</strong> The displacement is $\\int v\\,dt = ${integrated} + c$`,
        `<strong>(a)</strong> At $t = 0$ the displacement is $0$: $0 = ${num(share)} + c$, so $c = ${num(q(-B, k))}$ and the displacement is $${s}$`,
        `<strong>(b)</strong> $a = \\frac{dv}{dt} = ${accel}$`,
        `<strong>(b)</strong> At $t = 0$, $a = ${6 * m} \\times 0 + ${at0} \\times e^{0} = ${at0}${ms2}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `(a) $${s}$<br>(b) $${at0}${ms2}$`,
      ladder: {
        moves: [
          'Velocity is the rate of change of displacement. So how do you get the displacement from $v$?',
          '(a) Integrate $v$ with respect to $t$.',
          '(a) Use zero displacement at $t = 0$ to find the constant.',
          '(b) Differentiate $v$ to find the acceleration.',
          '(b) Substitute $t = 0$, and give units.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [
          null,
          `$${lead}\\ldots$ or $\\ldots - \\frac{${B}}{-${k}}${e}$`,
          `$${s}$`,
          `$${accel}$`,
          null,
        ],
        watch: { at: 2, text: '$e^{0}$ is 1, not 0. Check the constant carefully.' },
      },
    };
  },
};

// ── 2021 P2 Q1 ─────────────────────────────────────────────────────────────
// f(x) = c sec kx, f'(x) = ck sec kx tan kx, at x = π/(km), so kx is π/m:
// exact values at π/6, π/4 or π/3.

interface P2Q1of2021 { c: number; k: number; m: 3 | 4 | 6 }

/** sec and tan of π/m as the papers write them, and their product as an exact multiple. */
const EXACT2021: Record<3 | 4 | 6, { sec: string; tan: string; times: (n: number) => string }> = {
  3: { sec: '2', tan: '\\sqrt{3}', times: n => `${2 * n}\\sqrt{3}` },
  4: { sec: '\\sqrt{2}', tan: '1', times: n => `${n === 1 ? '' : n}\\sqrt{2}` },
  6: { sec: '\\frac{2}{\\sqrt{3}}', tan: '\\frac{1}{\\sqrt{3}}', times: n => num(q(2 * n, 3)) },
};

const q2021p2q1: CardRoutine<P2Q1of2021> = {
  draw: () => ({ c: int(1, 5), k: int(2, 6), m: pick([3, 4, 6] as const) }),

  build: ({ c, k, m }): Built => {
    const lead = c === 1 ? '' : String(c);
    const at = `\\frac{\\pi}{${k * m}}`;
    const angle = `\\frac{\\pi}{${m}}`;
    const e = EXACT2021[m];
    const derivative = `f'(x) = ${lead}\\sec ${k}x\\tan ${k}x \\times ${k}`;
    const answer = e.times(c * k);
    return {
      questionLines: [`Given $f(x) = ${lead}\\sec ${k}x$ find the exact value of $f'\\left(${at}\\right).$`],
      solutionSteps: [
        `$${derivative}$`,
        `$f'\\left(${at}\\right) = ${c * k}\\sec ${angle}\\tan ${angle} = ${c * k} \\times ${e.sec} \\times ${e.tan} = ${answer}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$f'\\left(${at}\\right) = ${answer}$`,
      ladder: {
        moves: [
          `Which standard derivative is $\\sec$'s, and what does the $${k}x$ inside add?`,
          `Differentiate $${lead}\\sec ${k}x$, using the chain rule for the $${k}x$.`,
          `Substitute $x = ${at}$ and use exact values.`,
        ],
        marks: [0, 1, 1],
        shows: [null, `$${derivative}$`, null],
        watch: { at: 2, text: `Use exact values for $\\sec$ and $\\tan$ of $${angle}$: the question asks for an exact answer.` },
      },
    };
  },
};

// ── 2021 P2 Q4 ─────────────────────────────────────────────────────────────
// x = a sin⁻¹ kt, y = b tan⁻¹ t: (a) dx/dt and dy/dt; (b) the tangent at
// t = 0, through the origin with gradient b/(ak).

interface P2Q4of2021 { a: number; k: number; b: number }

const q2021p2q4: CardRoutine<P2Q4of2021> = {
  draw: () => ({ a: int(1, 3), k: int(2, 5), b: int(1, 3) }),

  build: ({ a, k, b }): Built => {
    const lead = (n: number) => (n === 1 ? '' : String(n));
    const dxdt = `\\frac{${a * k}}{\\sqrt{1 - ${k * k}t^{2}}}`;
    const dydt = `\\frac{${b}}{1 + t^{2}}`;
    const begun = `${a === 1 ? '' : `${a} \\times `}\\frac{1}{\\sqrt{1 - (${k}t)^{2}}}`;
    const m = q(b, a * k);
    const tangent = `y = ${sum([{ coef: m, body: 'x' }])}`;
    const DX = '\\frac{dx}{dt}', DY = '\\frac{dy}{dt}';
    return {
      questionLines: [
        `A curve is defined parametrically by $x = ${lead(a)}\\sin^{-1} ${k}t$ and $y = ${lead(b)}\\tan^{-1} t.$`,
        `<b>(a)</b> Find $${DX}$ and $${DY}.$`,
        '<b>(b)</b> When $t = 0$ find the equation of the tangent to the curve.',
      ],
      solutionSteps: [
        `<strong>(a)</strong> $${DX} = ${begun}\\ldots$`,
        `<strong>(a)</strong> $${DX} = ${begun} \\times ${k} = ${dxdt}$`,
        `<strong>(a)</strong> $${DY} = ${dydt}$`,
        // Reduced when it is not in lowest terms, "3/3 = 1", "2/6 = 1/3" (the owner, full read 2026-10-05).
        `<strong>(b)</strong> At $t = 0$, $x = 0$ and $y = 0$, and $\\frac{dy}{dx} = ${DY} \\div ${DX} = \\frac{${b}}{${a * k}}${`\\frac{${b}}{${a * k}}` === num(m) ? '' : ` = ${num(m)}`}$`,
        `<strong>(b)</strong> The tangent is $${tangent}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `(a) $${DX} = ${dxdt},\\ ${DY} = ${dydt}$<br>(b) $${tangent}$`,
      ladder: {
        moves: [
          'Which standard derivatives have $\\sqrt{1 - (\\ldots)^2}$ and $1 + (\\ldots)^2$ underneath?',
          `(a) Differentiate $${lead(a)}\\sin^{-1} ${k}t$.`,
          `(a) Apply the chain rule for the $${k}t$ inside.`,
          `(a) Differentiate $${lead(b)}\\tan^{-1} t$.`,
          '(b) Find the point at $t = 0$, and $\\frac{dy}{dx}$ there from the two derivatives.',
          '(b) Write the equation of the tangent.',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [null, `$${begun}$`, `$\\ldots \\times ${k}$`, `$${dydt}$`, `$(0, 0)$ or $\\frac{dy}{dx} = ${num(m)}$`, null],
        watch: { at: 4, text: '$\\frac{dy}{dx}$ is $\\frac{dy}{dt}$ divided by $\\frac{dx}{dt}$, not the other way up.' },
      },
    };
  },
};

// ── 2021 P2 Q8 ─────────────────────────────────────────────────────────────
// x²y³ + e^{ky} = N: dy/dx implicitly, then the one stationary point, x = 0
// and y = (1/k) ln N, since y = 0 would need 1 = N.

interface P2Q8of2021 { k: number; N: number }

/** N with ln N / k not simpler written another way: no perfect k-th power. */
const Q8_CURVES2021: readonly P2Q8of2021[] = (() => {
  const out: P2Q8of2021[] = [];
  for (let k = 1; k <= 4; k++) {
    for (let N = 2; N <= 10; N++) {
      const root = Math.round(N ** (1 / k));
      if (k > 1 && root ** k === N) continue;
      out.push({ k, N });
    }
  }
  return out;
})();

const q2021p2q8: CardRoutine<P2Q8of2021> = {
  draw: () => pick(Q8_CURVES2021),

  build: ({ k, N }): Built => {
    const e = `e^{${k === 1 ? '' : k}y}`;
    const ke = `${k === 1 ? '' : k}${e}`;
    const D = '\\frac{dy}{dx}';
    const answer = `\\frac{-2xy^{3}}{3x^{2}y^{2} + ${ke}}`;
    const y0 = k === 1 ? `\\ln ${N}` : `\\frac{1}{${k}}\\ln ${N}`;
    const point = `\\left(0, ${y0}\\right)`;
    return {
      questionLines: [
        `A curve is defined by $x^{2}y^{3} + ${e} = ${N}.$`,
        `<b>(a)</b> Find $${D}$ in terms of $x$ and $y.$`,
        '<b>(b)</b> Show that there is only one stationary point on the curve.',
      ],
      solutionSteps: [
        `<strong>(a)</strong> By the product rule, $x^{2}y^{3}$ gives $2xy^{3} + \\ldots$`,
        `<strong>(a)</strong> $2xy^{3} + 3x^{2}y^{2}${D}$`,
        `<strong>(a)</strong> $2xy^{3} + 3x^{2}y^{2}${D} + ${ke}${D} = 0$`,
        `<strong>(a)</strong> $${D} = ${answer}$`,
        `<strong>(b)</strong> At a stationary point $${answer} = 0$`,
        `<strong>(b)</strong> So $-2xy^{3} = 0$: $x = 0$ or $y = 0$`,
        `<strong>(b)</strong> When $x = 0$, $${e} = ${N}$, so $y = ${y0}$; when $y = 0$, $0 + 1 = ${N}$, which has no solution. So the only stationary point is $${point}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1],
      finalAnswer: [
        `(a) $${D} = ${answer}$`,
        `(b) $${D} = 0$ gives $-2xy^{3} = 0$, so $x = 0$ or $y = 0.$ When $x = 0$, $${e} = ${N}$, so $y = ${y0}.$ When $y = 0$, $0 + 1 = ${N}$, which has no solution. Hence there is only one stationary point, at $${point}.$`,
      ].join('<br>'),
      ladder: {
        moves: [
          'The first term is a product of two functions of different variables. Which rule does it need?',
          '(a) Differentiate $x^{2}y^{3}$ with the product rule. The $y^{3}$ part picks up $\\frac{dy}{dx}$.',
          '(a) Complete the product term.',
          `(a) Differentiate $${e}$ and the constant.`,
          '(a) Gather the $\\frac{dy}{dx}$ terms and make $\\frac{dy}{dx}$ the subject.',
          '(b) Set $\\frac{dy}{dx} = 0$.',
          '(b) When is the numerator zero? Find both possibilities.',
          '(b) Test each one in the curve\'s equation. Which gives a point, and which is impossible?',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1],
        shows: [
          null,
          '$2xy^{3}$ or $3x^{2}y^{2}\\frac{dy}{dx}$',
          '$3x^{2}y^{2}\\frac{dy}{dx}$ or $2xy^{3}$',
          `$\\ldots ${ke}\\frac{dy}{dx} = 0$`,
          `$${answer}$`,
          `$${answer} = 0$`,
          '$x = 0$ and $y = 0$',
          null,
        ],
        watch: { at: 7, text: 'Check both cases in the original equation. One of them gives no point at all.' },
      },
    };
  },
};

export const ROUTINES = {
  '2021 P1 Q1(a)': q2021p1q1a,
  '2021 P1 Q1(b)': q2021p1q1b,
  '2021 P1 Q6': q2021p1q6,
  '2021 P2 Q1': q2021p2q1,
  '2021 P2 Q4': q2021p2q4,
  '2021 P2 Q8': q2021p2q8,
};
