/**
 * Advanced Higher, Differentiation: how each 2024 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/differentiation.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int, nonZero, pick, until } from '../draw';
import { poly, sum } from '../maths/format';
import { gcd } from '../maths/integer';
import { q } from '../maths/rational';

const DYDX = '\\frac{dy}{dx}';
const HALF = '^{\\frac{1}{2}}';
const MINUS_HALF = '^{-\\frac{1}{2}}';

// ── 2024 P1 Q1 ─────────────────────────────────────────────────────────────
// (a) y = cot kx      (b) f(x) = c x (ax + b)^{1/2}, by the product rule

interface P1Q1of2024 { k: number; c: number; a: number; b: number }

const q2024p1q1: CardRoutine<P1Q1of2024> = {
  draw: () => {
    const k = int(2, 9);
    const { c, a, b } = until(
      () => ({ c: int(2, 6), a: int(2, 6), b: nonZero(-9, 9) }),
      // The bracket as plain as 4x - 7, and the second term's number whole, as 10.
      ({ c, a, b }) => gcd(a, Math.abs(b)) === 1 && (c * a) % 2 === 0,
    );
    return { k, c, a, b };
  },

  build: ({ k, c, a, b }): Built => {
    // (a)
    const cosec = `\\operatorname{cosec}^{2} ${k}x`;
    const begun = `-${cosec}`;
    const dydx = `-${k}${cosec}`;

    // (b)
    const br = `(${poly([a, b])})`;
    const first = `${c}${br}${HALF}`;
    const chain = `${c}x \\times \\frac{1}{2} \\times ${a}${br}${MINUS_HALF}`;
    const second = `${(c * a) / 2}x${br}${MINUS_HALF}`;
    const answer = `${first} + ${second}`;

    return {
      questionLines: [
        'Differentiate the following with respect to $x$:',
        `<b>(a)</b> $y = \\cot ${k}x$`,
        `<b>(b)</b> $f(x) = ${c}x${br}${HALF}$`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> The derivative of $\\cot$: $${begun} \\times \\ldots$`,
        `<strong>(a)</strong> By the chain rule, $${DYDX} = ${dydx}$`,
        `<strong>(b)</strong> By the product rule, $f'(x) = ${first} + ${chain}$`,
        `<strong>(b)</strong> $f'(x) = ${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `(a) $${DYDX} = ${dydx}$<br>(b) $f'(x) = ${answer}$`,
      ladder: {
        moves: [
          '(a) is a standard trig derivative with something inside; (b) is two factors multiplied. Which rules?',
          '(a) Differentiate $\\cot$ of the angle.',
          `(a) Apply the chain rule for the $${k}x$ inside.`,
          '(b) Use the product rule. The bracket\'s derivative needs the chain rule too.',
        ],
        marks: [0, 1, 1, 2],
        // As the paper card's ladder: its last move, worth 2, shows the first mark's working.
        shows: [null, null, null, `$${first} + \\ldots$ or $\\ldots + ${chain}$`],
        watch: { at: 3, text: 'The product rule gives two terms. Only one term earns nothing.' },
      },
    };
  },
};

// ── 2024 P1 Q7 ─────────────────────────────────────────────────────────────
// a x²y + b xy² = c implicitly, then the one stationary point with y > 0.
// Built from the point: x0 = -b y0/(2a) and c = -b² y0³/(4a), both whole.

interface P1Q7of2024 { b: number; y0: number }

/** The x^2 y term's coefficient: 1, as the paper's (see the draw). */
const a = 1;

const q2024p1q7: CardRoutine<P1Q7of2024> = {
  // a stays 1 and b even, so the line is x = -(b/2)y, whole, as x = -2y: any
  // other a or an odd b puts fractions in the substitution the paper does not have.
  draw: () => until(
    () => ({ b: pick([-8, -6, -4, -2, 2, 4, 6, 8]), y0: int(1, 3) }),
    ({ b, y0 }) => (b * b * y0 ** 3) / 4 <= 150,
  ),

  build: ({ b, y0 }): Built => {
    const x0 = (-b * y0) / (2 * a), c = (-b * b * y0 ** 3) / (4 * a);
    const eq = `${sum([{ coef: a, body: 'x^{2}y' }, { coef: b, body: 'xy^{2}' }])} = ${c}`;
    const oneProduct = `${sum([{ coef: 2 * a, body: 'xy' }, { coef: a, body: `x^{2}${DYDX}` }])}`;
    const whole = `${sum([
      { coef: 2 * a, body: 'xy' }, { coef: a, body: `x^{2}${DYDX}` },
      { coef: b, body: 'y^{2}' }, { coef: 2 * b, body: `xy${DYDX}` },
    ])} = 0`;
    const top = sum([{ coef: -2 * a, body: 'xy' }, { coef: -b, body: 'y^{2}' }]);
    const bottom = sum([{ coef: a, body: 'x^{2}' }, { coef: 2 * b, body: 'xy' }]);
    const answer = `\\frac{${top}}{${bottom}}`;
    // -y(2ax + by) = 0 and y > 0, so 2ax + by = 0.
    const line = `${sum([{ coef: 2 * a, body: 'x' }, { coef: b, body: 'y' }])} = 0`;
    const xOfY = sum([{ coef: q(-b, 2 * a), body: 'y' }]);
    const substituted = `${sum([{ coef: q(b * b, 4 * a), body: 'y^{3}' }, { coef: q(-b * b, 2 * a), body: 'y^{3}' }])} = ${c}`;
    const cubed = y0 ** 3;
    const point = `(${x0}, ${y0})`;

    return {
      questionLines: [
        `A curve is defined by the equation $${eq}$, $y \\gt 0.$`,
        `<b>(a)</b> Use implicit differentiation to find an expression for $${DYDX}.$`,
        '',
        'The curve has only one stationary point.',
        '<b>(b)</b> Find the coordinates of the stationary point.',
      ],
      solutionSteps: [
        `<strong>(a)</strong> By the product rule, $\\frac{d}{dx}\\left(${sum([{ coef: a, body: 'x^{2}y' }])}\\right) = ${oneProduct}$`,
        `<strong>(a)</strong> $${whole}$`,
        `<strong>(a)</strong> $${DYDX} = ${answer}$`,
        `<strong>(b)</strong> At a stationary point $${answer} = 0$`,
        `<strong>(b)</strong> $-y(${line.replace(' = 0', '')}) = 0$ and $y \\gt 0$, so $${line}$, that is $x = ${xOfY}$`,
        `<strong>(b)</strong> Substituting, $${substituted}$, so $y^{3} = ${cubed}$, $y = ${y0}$ and $x = ${x0}$: the stationary point is $${point}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1],
      finalAnswer: `(a) $${DYDX} = ${answer}$<br>(b) $${point}$`,
      ladder: {
        moves: [
          'Both terms on the left are products of $x$ and $y$. What does each one need?',
          `(a) Differentiate one of the product terms with the product rule, picking up $${DYDX}$.`,
          '(a) Differentiate the rest, including the right-hand side.',
          `(a) Gather the $${DYDX}$ terms and make $${DYDX}$ the subject.`,
          `(b) Set $${DYDX} = 0$.`,
          '(b) That gives a straight-line relationship between $x$ and $y$ at the stationary point. Write it.',
          '(b) Substitute it into the curve\'s equation and use $y \\gt 0$ to find the point.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1],
        shows: [null, `$${oneProduct}$`, `$${whole}$`, `$${DYDX} = ${answer}$`, `$${answer} = 0$`, `$${line}$`, null],
        watch: { at: 2, text: 'The right-hand side is a constant, so it differentiates to zero. Leaving it out costs marks later.' },
      },
    };
  },
};

// ── 2024 P2 Q1 ─────────────────────────────────────────────────────────────
// y = sin kx / (c + x²), by the quotient rule

interface P2Q1of2024 { k: number; c: number }

const q2024p2q1: CardRoutine<P2Q1of2024> = {
  draw: () => ({ k: int(2, 9), c: int(1, 9) }),

  build: ({ k, c }): Built => {
    const bottom = `${c} + x^{2}`;
    const top = `${k}\\cos ${k}x(${bottom})`;
    const other = `2x\\sin ${k}x`;
    const under = `(${bottom})^{2}`;
    const begun = `\\frac{${top} - \\ldots}{${under}}`;
    const answer = `\\frac{${top} - ${other}}{${under}}`;
    return {
      questionLines: [`Given $y = \\frac{\\sin ${k}x}{${bottom}}$, find $${DYDX}.$`],
      solutionSteps: [
        `By the quotient rule, $${DYDX} = ${begun}$`,
        `$${DYDX} = ${answer}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$${DYDX} = ${answer}$`,
      ladder: {
        moves: [
          'The function is one expression divided by another. Which rule does that need?',
          `Set up the quotient rule with $${under}$ as the denominator.`,
          `Complete the numerator. The $\\sin ${k}x$ needs the chain rule.`,
        ],
        marks: [0, 1, 1],
        shows: [null, `$${begun}$ or $\\frac{\\ldots - ${other}}{${under}}$`, null],
        watch: { at: 2, text: `The derivative of $\\sin ${k}x$ brings out a factor of $${k}$. Check it is there.` },
      },
    };
  },
};

// ── 2024 P2 Q6 ─────────────────────────────────────────────────────────────
// x = a t², y = b t ln t, t > 0: (a) dy/dx; (b) d²y/dx² by the quotient rule, then ÷ dx/dt

interface P2Q6of2024 { a: number; b: number }

/** A coefficient before a body, 1 not written. */
const times = (c: number | bigint, body: string) => `${c === 1 || c === 1n ? '' : c}${body}`;

const q2024p2q6: CardRoutine<P2Q6of2024> = {
  draw: () => ({ a: int(1, 4), b: int(2, 9) }),

  build: ({ a, b }): Built => {
    // dy/dx = b(ln t + 1)/(2at) = p(ln t + 1)/(st), in lowest terms.
    const r = q(b, 2 * a);
    const p = Number(r.n), s = Number(r.d);
    const L = '(\\ln t + 1)';
    const dydt = `\\frac{dy}{dt}`;
    const begun = `$${dydt} = ${b}\\ln t + \\ldots$ or $${dydt} = \\ldots + ${b}t \\times \\frac{1}{t}$`;
    const dy = `${b}\\ln t + ${b}`;
    // No brackets round the whole top when p is 1 (the owner, full read 2026-10-05).
    const dydx = `\\frac{${p === 1 ? '\\ln t + 1' : times(p, L)}}{${times(s, 't')}}`;
    // The quotient rule on u = p(ln t + 1), v = st: (u'v - uv')/v².
    const uDashV = s === 1 ? `\\frac{${p}}{t}t` : `\\frac{${p}}{t} \\times ${s}t`;
    const uVDash = s === 1 ? times(p, L) : `${times(p, L)} \\times ${s}`;
    const vv = s === 1 ? 't^{2}' : `(${s}t)^{2}`;
    const setUp = `$\\frac{${uDashV} - \\ldots}{${vv}}$ or $\\frac{\\ldots - ${uVDash}}{${vv}}$`;
    const whole = `\\frac{${uDashV} - ${uVDash}}{${vv}}`;
    // That is -(p/s) ln t / t²; over dx/dt = 2at it is -(b/4a²) ln t / t³.
    const tDer = `\\frac{-${times(p, '\\ln t')}}{${times(s, 't^{2}')}}`;
    const c2 = q(b, 4 * a * a);
    const d2 = `\\frac{-${times(c2.n, '\\ln t')}}{${times(c2.d, 't^{3}')}}`;
    const D2 = '\\frac{d^{2}y}{dx^{2}}';
    return {
      questionLines: [
        `A curve is defined parametrically by $x = ${times(a, 't^{2}')}$ and $y = ${b}t\\ln t$ where $t \\gt 0.$`,
        'Find a fully simplified expression for:',
        `<b>(a)</b> $${DYDX}$`,
        `<b>(b)</b> $${D2}$`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> By the product rule, $${dydt} = ${b}\\ln t + \\ldots$`,
        `<strong>(a)</strong> $${dydt} = ${dy}$ and $\\frac{dx}{dt} = ${2 * a}t$`,
        `<strong>(a)</strong> $${DYDX} = \\frac{${dy}}{${2 * a}t} = ${dydx}$`,
        `<strong>(b)</strong> By the quotient rule, $\\frac{d}{dt}\\left(${DYDX}\\right) = \\frac{${uDashV} - \\ldots}{${vv}}$`,
        `<strong>(b)</strong> $\\frac{d}{dt}\\left(${DYDX}\\right) = ${whole} = ${tDer}$`,
        `<strong>(b)</strong> Dividing by $\\frac{dx}{dt} = ${2 * a}t$: $${D2} = ${d2}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1],
      finalAnswer: `(a) $${DYDX} = ${dydx}$<br>(b) $${D2} = ${d2}$`,
      ladder: {
        moves: [
          `For a parametric curve, how do you get $${DYDX}$ from the two derivatives with respect to $t$?`,
          `(a) Differentiate $y = ${b}t\\ln t$ with the product rule.`,
          `(a) Complete $${dydt}$.`,
          '(a) Divide by $\\frac{dx}{dt}$ and simplify.',
          '(b) Differentiate your answer to (a) with respect to $t$, with the quotient rule.',
          '(b) Complete that derivative.',
          '(b) Divide by $\\frac{dx}{dt}$ again, and simplify.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1],
        shows: [null, begun, `$${dydt} = ${dy}$`, `$${DYDX} = ${dydx}$`, setUp, `$${whole}$`, null],
        watch: { at: 4, text: `The second derivative is the $t$-derivative of $${DYDX}$ divided by $\\frac{dx}{dt}$, not just the $t$-derivative.` },
      },
    };
  },
};

// ── 2024 P2 Q10 ────────────────────────────────────────────────────────────
// V = kπr³ grows at R mm³ per minute: dr/dt at r = r0

interface P2Q10of2024 { k: number; R: number; r0: number }

const q2024p2q10: CardRoutine<P2Q10of2024> = {
  draw: () => ({ k: int(2, 9), R: int(2, 30), r0: int(2, 15) }),

  build: ({ k, R, r0 }): Built => {
    const rate = q(R, 3 * k * r0 * r0);
    const drdt = `\\frac{${rate.n}}{${times(rate.d, '\\pi')}}`;
    const chain = '\\frac{dV}{dt} = \\frac{dV}{dr} \\times \\frac{dr}{dt}';
    const dVdr = `${3 * k}\\pi r^{2}`;
    return {
      questionLines: [
        `A metal rod is heated such that its volume increases at a constant rate of $${R}\\text{ mm}^{3}$ per minute.`,
        `The volume of the rod is modelled, throughout the process, by $V = ${k}\\pi r^{3}$, where $r$ is measured in millimetres.`,
        `Find the rate at which $r$ is increasing when $r = ${r0}.$`,
      ],
      solutionSteps: [
        `$\\frac{dV}{dt} = ${R}$`,
        `$${chain}$`,
        `$\\frac{dV}{dr} = ${dVdr}$`,
        `At $r = ${r0}$: $${R} = ${3 * k}\\pi \\times ${r0}^{2} \\times \\frac{dr}{dt}$, so $\\frac{dr}{dt} = ${drdt}$ mm per minute`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `$\\frac{dr}{dt} = ${drdt}$ mm per minute`,
      ladder: {
        moves: [
          'You know how fast the volume changes and want how fast the radius changes. Which rule links them?',
          'Write the given rate as $\\frac{dV}{dt}$.',
          'Write the chain rule linking $\\frac{dV}{dt}$, $\\frac{dV}{dr}$ and $\\frac{dr}{dt}$.',
          'Differentiate $V$ with respect to $r$.',
          `Substitute $r = ${r0}$ and evaluate $\\frac{dr}{dt}$, with units.`,
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, `$\\frac{dV}{dt} = ${R}$`, `$${chain}$`, `$\\frac{dV}{dr} = ${dVdr}$`, null],
        watch: { at: 4, text: 'Start the last line "$\\frac{dr}{dt} =$", so it is clear which rate you found.' },
      },
    };
  },
};

export const ROUTINES = {
  '2024 P1 Q1': q2024p1q1,
  '2024 P1 Q7': q2024p1q7,
  '2024 P2 Q1': q2024p2q1,
  '2024 P2 Q6': q2024p2q6,
  '2024 P2 Q10': q2024p2q10,
};
