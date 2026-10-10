/**
 * Advanced Higher, Differentiation: how each 2025 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/differentiation.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges the two into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int, nonZero, pick, until } from '../../core/draw';
import { num, sum } from '../../core/maths/format';
import { gcd } from '../../core/maths/integer';
import { type Q, q, div } from '../../core/maths/rational';

const DYDX = '\\frac{dy}{dx}';

/** `\frac{3}{4}` as the top and bottom of a fraction with a body: `\frac{3\sec^{2} t}{4t}`, 1 not written. */
const over = (c: Q, top: string, bottom: string) =>
  `\\frac{${c.n === 1n ? '' : c.n}${top}}{${c.d === 1n ? '' : c.d}${bottom}}`;

// ── 2025 P2 Q1 ─────────────────────────────────────────────────────────────
// f(x) = c cos^{-1} kx

interface P2Q1 { c: number; k: number }

const q2025p2q1: CardRoutine<P2Q1> = {
  draw: () => ({ c: int(1, 3), k: int(2, 9) }),

  build: ({ c, k }): Built => {
    const lead = c === 1 ? '' : `${c}`;
    const root = `\\sqrt{1 - (${k}x)^{2}}`;
    const start = `-\\frac{${c}}{${root}}`;
    const answer = `-\\frac{${c * k}}{${root}}`;
    return {
      questionLines: [
        `A function is defined by $f(x) = ${lead}\\cos^{-1} ${k}x.$`,
        'Find $f\'(x).$',
      ],
      solutionSteps: [
        `The derivative of $\\cos^{-1}$: $${start} \\times \\ldots$`,
        `By the chain rule, $f'(x) = ${start} \\times ${k} = ${answer}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$f'(x) = ${answer}$, or $-\\frac{${c * k}}{\\sqrt{1 - ${k * k}x^{2}}}$`,
      ladder: {
        moves: [
          'Which standard derivative has $\\sqrt{1 - (\\ldots)^{2}}$ underneath, with a minus sign in front?',
          `Differentiate $\\cos^{-1} ${k}x$, starting with the standard derivative.`,
          `Apply the chain rule for the $${k}x$ inside.`,
        ],
        marks: [0, 1, 1],
        shows: [null, `$${start}$`, null],
        watch: { at: 2, text: `The chain rule multiplies by the derivative of $${k}x$. Leaving it out loses the second mark.` },
      },
    };
  },
};

// ── 2025 P2 Q2 ─────────────────────────────────────────────────────────────
// a y² + b x e^{my} = c x, implicitly: dy/dx = (c - b e^{my})/(2a y + bm x e^{my})

interface P2Q2 { a: number; b: number; m: number; c: number }

const q2025p2q2: CardRoutine<P2Q2> = {
  draw: () => until(
    () => ({ a: int(1, 4), b: int(2, 6), m: int(2, 5), c: int(1, 9) }),
    // No factor common to the whole answer, as 3, 4, 4, 8 share none.
    ({ a, b, c }) => gcd(gcd(c, b), 2 * a) === 1,
  ),

  build: ({ a, b, m, c }): Built => {
    const E = `e^{${m}y}`;
    const eq = `${a === 1 ? '' : a}y^{2} + ${b}x${E} = ${c === 1 ? '' : c}x`;
    const product = `${b}${E} + ${b * m}x${E}${DYDX}`;
    const whole = `${2 * a}y${DYDX} + ${b}${E} + ${b * m}x${E}${DYDX} = ${c}`;
    const answer = `\\frac{${c} - ${b}${E}}{${2 * a}y + ${b * m}x${E}}`;
    return {
      questionLines: [
        `A curve is defined by the equation $${eq}.$`,
        `Find an expression for $${DYDX}$ in terms of $x$ and $y.$`,
      ],
      solutionSteps: [
        `By the product rule, $\\frac{d}{dx}\\left(${b}x${E}\\right) = ${product}$`,
        `$${whole}$`,
        `$${DYDX} = ${answer}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `$${DYDX} = ${answer}$`,
      ladder: {
        moves: [
          'The $y$ is tangled up with $x$. How do you differentiate a $y$-term with respect to $x$?',
          `Differentiate $${b}x${E}$ with the product rule. The $${E}$ part picks up $${DYDX}$.`,
          `Differentiate the other terms, including $${a === 1 ? '' : a}y^{2}$, and write the whole equation.`,
          `Gather the $${DYDX}$ terms on one side and make $${DYDX}$ the subject.`,
        ],
        marks: [0, 1, 1, 1],
        shows: [null, `$${product}$`, `$${whole}$`, null],
        watch: { at: 1, text: `Every $y$-term you differentiate needs a $${DYDX}$. Missing one ruins the rearrangement.` },
      },
    };
  },
};

// ── 2025 P2 Q5 ─────────────────────────────────────────────────────────────
// y = x^{a cot x} by logarithmic differentiation

interface P2Q5 { a: number }

const q2025p2q5: CardRoutine<P2Q5> = {
  draw: () => ({ a: nonZero(-9, 9) }),

  build: ({ a }): Built => {
    const power = sum([{ coef: a, body: '\\cot x' }]);
    const y = `x^{${power}}`;
    const DY = `\\frac{1}{y}${DYDX}`;
    const cosecTerm = { coef: -a, body: '\\operatorname{cosec}^{2} x\\ln x' };
    const productTerm = { coef: a, body: '\\cot x \\cdot \\frac{1}{x}' };
    const oneTerm = `${sum([cosecTerm])} + \\ldots`;
    const both = sum([cosecTerm, productTerm]);
    // The number inside the fraction, as the paper's \frac{\cot x}{x}: \frac{7\cot x}{x}.
    const size = Math.abs(a);
    const cotOverX = { coef: Math.sign(a), body: `\\frac{${size === 1 ? '' : size}\\cot x}{x}` };
    const answer = `${DYDX} = ${y}\\left(${sum([cosecTerm, cotOverX])}\\right)`;
    return {
      questionLines: [
        `A curve is defined by $y = ${y}.$`,
        `Use logarithmic differentiation to find $${DYDX}.$`,
        'Write your answer in terms of $x.$',
      ],
      solutionSteps: [
        `Taking logs of both sides: $\\ln y = ${sum([{ coef: a, body: '\\cot x\\ln x' }])}$`,
        `Differentiating the left-hand side: $${DY}$`,
        `By the product rule, $${DY} = ${oneTerm}$`,
        `$${DY} = ${both}$`,
        `So $${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          'The power has $x$ in it. What does taking logs do to a power?',
          'Take natural logs of both sides and bring the power down.',
          'Differentiate the left-hand side implicitly.',
          'Differentiate the right-hand side with the product rule.',
          `Multiply through by $y$ and replace it with $${y}$.`,
        ],
        marks: [0, 1, 1, 2, 1],
        shows: [null, `$\\ln y = ${sum([{ coef: a, body: '\\cot x\\ln x' }])}$`, `$${DY}$`, `$${oneTerm}$`, null],
        watch: { at: 3, text: `$${sum([{ coef: a, body: '\\cot x\\ln x' }])}$ is a product. Without the product rule, the middle marks are gone.` },
      },
    };
  },
};

// ── 2025 P2 Q7 ─────────────────────────────────────────────────────────────
// x = a t², y = b tan t: (a) dy/dx; (b) d²y/dx² by the quotient rule, then ÷ dx/dt

interface P2Q7 { a: number; b: number }

const q2025p2q7: CardRoutine<P2Q7> = {
  // b never a multiple of 2a, so dy/dx keeps a t below the line with a number
  // before it, as the paper's 2t, and (b)'s quotient rule has its (Dt)^2.
  draw: () => until(() => ({ a: int(1, 4), b: int(1, 5) }), ({ a, b }) => b % (2 * a) !== 0),

  build: ({ a, b }): Built => {
    const x = `${a === 1 ? '' : a}t^{2}`;
    const y = `${b === 1 ? '' : b}\\tan t`;
    const first = q(b, 2 * a);
    const B = Number(first.n), D = Number(first.d);
    const dydt = `${b === 1 ? '' : b}\\sec^{2} t`;
    const dydx = over(first, '\\sec^{2} t', 't');
    const setUp = `\\frac{${2 * B}\\sec t \\times \\sec t\\tan t \\times ${D}t - \\ldots}{(${D}t)^{2}}`;
    const whole = `\\frac{${2 * B}\\sec t \\times \\sec t\\tan t \\times ${D}t - ${B === 1 ? '' : B}\\sec^{2} t \\times ${D}}{(${D}t)^{2}}`;
    // The t-derivative of (B/D) sec²t / t, divided by dx/dt = 2at, is
    // B/(2aD) (2t sec²t tan t - sec²t)/t³; the paper's is 1/4 of it.
    const second = div(first, q(2 * a));
    const bracket = '2t\\sec^{2} t\\tan t - \\sec^{2} t';
    const d2 = `\\frac{${second.n === 1n ? bracket : `${second.n}(${bracket})`}}{${second.d === 1n ? '' : second.d}t^{3}}`;
    const D2 = '\\frac{d^{2}y}{dx^{2}}';
    return {
      questionLines: [
        `A curve is defined on a suitable domain by the equations $x = ${x}$ and $y = ${y}.$`,
        'Find in terms of $t$:',
        `<b>(a)</b> $${DYDX}$`,
        `<b>(b)</b> $${D2}$`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> $\\frac{dy}{dt} = ${dydt}$ and $\\frac{dx}{dt} = ${2 * a}t$`,
        `<strong>(a)</strong> $${DYDX} = ${dydx}$`,
        `<strong>(b)</strong> By the quotient rule, $\\frac{d}{dt}\\left(${DYDX}\\right) = ${setUp}$`,
        `<strong>(b)</strong> $\\frac{d}{dt}\\left(${DYDX}\\right) = ${whole}$`,
        `<strong>(b)</strong> Dividing by $\\frac{dx}{dt} = ${2 * a}t$: $${D2} = ${d2}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `(a) $${DYDX} = ${dydx}$<br>(b) $${D2} = ${d2}$`,
      ladder: {
        moves: [
          `For a parametric curve, how do you get $${DYDX}$ from the two derivatives with respect to $t$?`,
          '(a) Differentiate $y$ with respect to $t$.',
          '(a) Divide by $\\frac{dx}{dt}$, leaving the answer in terms of $t$.',
          '(b) Differentiate your answer to (a) with respect to $t$, using the quotient rule.',
          '(b) Complete that derivative.',
          '(b) Divide by $\\frac{dx}{dt}$ again to get the second derivative.',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [null, `$\\frac{dy}{dt} = ${dydt}$`, `$${DYDX} = ${dydx}$`, `$${setUp}$`, `$${whole}$`, null],
        watch: { at: 5, text: `The second derivative is the $t$-derivative of $${DYDX}$ divided by $\\frac{dx}{dt}$, not just the $t$-derivative.` },
      },
    };
  },
};

// ── 2025 P2 Q9 ─────────────────────────────────────────────────────────────
// v = a t + e^{kt}: (a) s with s = 0 at t = 0; (b) the acceleration is positive

interface P2Q9 { a: number; k: number }

const q2025p2q9: CardRoutine<P2Q9> = {
  draw: () => ({ a: int(1, 9), k: int(2, 9) }),

  build: ({ a, k }): Built => {
    const E = `e^{${k}t}`;
    const v = `${a === 1 ? '' : a}t + ${E}`;
    const integrated = `\\frac{${a === 1 ? '' : a}t^{2}}{2} + \\frac{1}{${k}}${E} + c`;
    const s = sum([{ coef: q(a, 2), body: 't^{2}' }, { coef: q(1, k), body: E }, { coef: q(-1, k), body: '' }]);
    const acc = `${a} + ${k}${E}`;
    const shown = `Since $${E} \\gt 0$ for all $t$, $a \\gt 0$ (shown)`;
    return {
      questionLines: [
        `Relative to a fixed origin, the velocity, $v$ metres per second, of an object at time $t$ seconds is given by $v = ${v}.$`,
        '<b>(a)</b> Find an expression for the displacement of the object, $s$ metres, in terms of $t$, given that when $t = 0, s = 0.$',
        '<b>(b)</b> Show that the acceleration of the object is always positive.',
      ],
      solutionSteps: [
        `<strong>(a)</strong> $s = \\int v\\,dt = ${integrated}$`,
        `<strong>(a)</strong> At $t = 0$, $s = 0$: $0 = \\frac{1}{${k}} + c$, so $c = -\\frac{1}{${k}}$ and $s = ${s}$`,
        `<strong>(b)</strong> $a = \\frac{dv}{dt} = ${acc}$`,
        `<strong>(b)</strong> ${shown}`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `(a) $s = ${s}$<br>(b) $a = ${acc}.$ ${shown}`,
      ladder: {
        moves: [
          'Velocity is the rate of change of displacement. So how do you get $s$ from $v$?',
          '(a) Integrate $v$ with respect to $t$.',
          '(a) Use $s = 0$ when $t = 0$ to find the constant, and write $s$ in full.',
          '(b) Differentiate $v$ to find the acceleration.',
          '(b) Say why every part of that expression is positive.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, `$${integrated}$`, `$s = ${s}$`, null, null],
        watch: { at: 2, text: '$e^{0}$ is 1, not 0. Check the constant carefully.' },
      },
    };
  },
};

// ── 2025 P2 Q17 ────────────────────────────────────────────────────────────
// V = h³/m; piped in at R, leaking at √h/L; dh/dt at h = s²

interface P2Q17 { m: number; R: number; L: number; s: number }

const q2025p2q17: CardRoutine<P2Q17> = {
  // s is a multiple of L, so the leak at that depth, s/L, is whole, as the
  // paper's 2 is; the water still rises: R is more than the leak.
  draw: () => {
    const L = pick([5, 10, 20]);
    const leak = int(1, 4);
    return { m: int(2, 6), R: leak + int(1, 6), L, s: L * leak };
  },

  build: ({ m, R, L, s }): Built => {
    const h = s * s;
    const leak = s / L;
    const dVdh = sum([{ coef: q(3, m), body: 'h^{2}' }]);
    const atDepth = q(3 * h * h, m);
    const dhdt = num(div(q(R - leak), atDepth));
    const unreduced = `\\frac{${R - leak}}{${num(atDepth)}}`;
    const chain = '\\frac{dh}{dt} = \\frac{dh}{dV} \\times \\frac{dV}{dt}';
    const dVdt = `${R} - \\frac{1}{${L}}\\sqrt{h}`;
    return {
      questionLines: [
        'The volume, $V$ cm$^{3}$, of water in a tank is given by',
        '',
        `$V = \\frac{1}{${m}}h^{3}$, where $h$ cm is the depth of water in the tank.`,
        '',
        `Water is being piped into the tank at a rate of ${R} cm$^{3}$/second.`,
        `Water is leaking from the bottom of the tank at a rate of $\\frac{1}{${L}}\\sqrt{h}$ cm$^{3}$/second.`,
        `Calculate the rate of change of the depth of water when $h = ${h}.$`,
      ],
      solutionSteps: [
        `$${chain}$`,
        `$\\frac{dV}{dh} = ${dVdh}$`,
        `$\\frac{dV}{dt} = ${dVdt}$`,
        // Already in lowest terms, the rate is printed once (the owner, full read 2026-10-05).
        `At $h = ${h}$: $\\frac{dV}{dh} = ${num(atDepth)}$ and $\\frac{dV}{dt} = ${R} - ${leak} = ${R - leak}$, so $\\frac{dh}{dt} = ${unreduced === dhdt ? dhdt : `${unreduced} = ${dhdt}`}$ cm/sec`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `$\\frac{dh}{dt} = ${dhdt}$ cm/sec`,
      ladder: {
        moves: [
          'Water comes in and water leaks out. What is the overall rate of change of the volume?',
          'Write the chain rule linking $\\frac{dh}{dt}$, $\\frac{dh}{dV}$ and $\\frac{dV}{dt}$.',
          'Differentiate $V$ with respect to $h$.',
          'Write $\\frac{dV}{dt}$ as the rate in minus the rate out.',
          `Substitute $h = ${h}$ and evaluate $\\frac{dh}{dt}$, with units.`,
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, `$${chain}$`, `$\\frac{dV}{dh} = ${dVdh}$`, `$\\frac{dV}{dt} = ${dVdt}$`, null],
        watch: { at: 4, text: 'Start the last line "$\\frac{dh}{dt} =$", so it is clear which rate you found.' },
      },
    };
  },
};

export const ROUTINES = {
  '2025 P2 Q1': q2025p2q1,
  '2025 P2 Q2': q2025p2q2,
  '2025 P2 Q5': q2025p2q5,
  '2025 P2 Q7': q2025p2q7,
  '2025 P2 Q9': q2025p2q9,
  '2025 P2 Q17': q2025p2q17,
};
