/**
 * Advanced Higher, Differentiation: how each 2019 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/differentiation.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int, nonZero, pick, until } from '../../core/draw';
import { num, power, sum } from '../../core/maths/format';
import { gcd } from '../../core/maths/integer';
import { q } from '../../core/maths/rational';

const DYDX = '\\frac{dy}{dx}';

// ── 2019 Q1(a) ─────────────────────────────────────────────────────────────
// f(x) = x^n cot kx by the product rule

interface Q1aOf2019 { n: number; k: number }

const q2019q1a: CardRoutine<Q1aOf2019> = {
  // k never 1, so the chain rule always brings a number out, as the paper's 5.
  draw: () => ({ n: int(2, 8), k: int(2, 7) }),

  build: ({ n, k }): Built => {
    const cot = `\\cot ${k}x`;
    const cosec = `\\operatorname{cosec}^{2} ${k}x`;
    const first = `${n}${power('x', n - 1)}${cot}`;
    const second = `${k}x^{${n}}${cosec}`;
    const answer = `${first} - ${second}`;
    return {
      questionLines: [`Differentiate $f(x) = x^{${n}}${cot}.$`],
      solutionSteps: [
        `By the product rule, $f'(x) = ${first} + x^{${n}}(\\ldots)$`,
        `$f'(x) = ${answer}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$f'(x) = ${answer}$`,
      ladder: {
        moves: [
          '$f(x)$ is two factors multiplied together. Which rule does that need?',
          'Use the product rule: differentiate each factor in turn.',
          `Differentiate $${cot}$ with the chain rule, and write both terms.`,
        ],
        marks: [0, 1, 1],
        shows: [null, `$${first} \\pm x^{${n}}(\\ldots)$ or $-${second} + (\\ldots)${cot}$`, null],
        watch: { at: 1, text: 'The product rule gives two terms. Only one term earns nothing.' },
      },
    };
  },
};

// ── 2019 Q1(b) ─────────────────────────────────────────────────────────────
// y = (a x^n + b)/(x^n + c) by the quotient rule; the numerator collects to
// one term, n(ac - b)x^{n-1}.

interface Q1bOf2019 { a: number; b: number; c: number; n: number }

const q2019q1b: CardRoutine<Q1bOf2019> = {
  // ac = b would make y a constant; never.
  draw: () => until(() => ({ a: int(2, 5), b: nonZero(-9, 9), c: nonZero(-6, 6), n: int(2, 4) }), v => v.a * v.c !== v.b),

  build: ({ a, b, c, n }): Built => {
    const xn = `x^{${n}}`;
    const top = sum([{ coef: a, body: xn }, { coef: b, body: '' }]);
    const bottom = sum([{ coef: 1, body: xn }, { coef: c, body: '' }]);
    const squared = `(${bottom})^{2}`;
    const xm = power('x', n - 1);
    const left = `${a * n}${xm}(${bottom})`;
    const right = `(${top})(${n}${xm})`;
    const whole = `\\frac{${left} - ${right}}{${squared}}`;
    const answer = `\\frac{${n * (a * c - b)}${xm}}{${squared}}`;
    return {
      questionLines: [`Given $y = \\frac{${top}}{${bottom}}$, find $${DYDX}.$ Simplify your answer.`],
      solutionSteps: [
        `By the quotient rule, $${DYDX} = \\frac{${left} - \\ldots}{${squared}}$`,
        `$${DYDX} = ${whole}$`,
        `$${DYDX} = ${answer}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `$${DYDX} = ${answer}$`,
      ladder: {
        moves: [
          'The function is one expression divided by another. Which rule does that need?',
          `Set up the quotient rule with $${squared}$ as the denominator.`,
          'Complete the numerator: the top\'s derivative times the bottom, minus the top times the bottom\'s derivative.',
          'Multiply out the numerator and collect like terms.',
        ],
        marks: [0, 1, 1, 1],
        shows: [null, `$\\frac{${left} - \\ldots}{${squared}}$ or $\\frac{\\ldots - ${right}}{${squared}}$`, `$${whole}$`, null],
        watch: { at: 3, text: 'The last mark needs the brackets multiplied out and the like terms collected.' },
      },
    };
  },
};

// ── 2019 Q1(c) ─────────────────────────────────────────────────────────────
// f(x) = cos^{-1} kx, f'(x) = -k/√(1 - k²x²), at an x where kx is one of the
// exact values √3/2 (the paper's), 1/√2 or 1/2.

interface Q1cOf2019 { k: number; at: 'r3' | 'r2' | 'half' }

/** kx at the point, 1 - (kx)^2, its root, and f' there as a multiple of k. */
const EXACT2019 = {
  r3: { x: (k: number) => `\\frac{\\sqrt{3}}{${2 * k}}`, inside: '\\frac{3}{4}', root: '\\frac{1}{2}', value: (k: number) => String(-2 * k) },
  r2: { x: (k: number) => `\\frac{\\sqrt{2}}{${2 * k}}`, inside: '\\frac{1}{2}', root: '\\frac{1}{\\sqrt{2}}', value: (k: number) => `-${k}\\sqrt{2}` },
  half: {
    x: (k: number) => `\\frac{1}{${2 * k}}`, inside: '\\frac{1}{4}', root: '\\frac{\\sqrt{3}}{2}',
    // -2k/√3 = -(2k/3)√3, written as the papers write it.
    value: (k: number) => {
      const c = q(2 * k, 3);
      return c.d === 1n ? `-${c.n}\\sqrt{3}` : `-\\frac{${c.n}\\sqrt{3}}{${c.d}}`;
    },
  },
} as const;

const q2019q1c: CardRoutine<Q1cOf2019> = {
  draw: () => ({ k: int(2, 6), at: pick(['r3', 'r2', 'half'] as const) }),

  build: ({ k, at }): Built => {
    const e = EXACT2019[at];
    const x0 = e.x(k);
    const start = `\\frac{-1}{\\sqrt{1 - (${k}x)^{2}}}`;
    const chained = `${start} \\times ${k}`;
    const value = e.value(k);
    return {
      questionLines: [`For $f(x) = \\cos^{-1} ${k}x$, evaluate $f'\\left(${x0}\\right).$`],
      solutionSteps: [
        `$f'(x) = ${start} \\times \\ldots$`,
        `$f'(x) = ${chained}$`,
        `$f'\\left(${x0}\\right) = \\frac{-${k}}{\\sqrt{1 - ${e.inside}}} = \\frac{-${k}}{${e.root}} = ${value}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `$f'\\left(${x0}\\right) = ${value}$`,
      ladder: {
        moves: [
          'Which standard derivative has $\\sqrt{1 - (\\ldots)^2}$ underneath, with a minus sign in front?',
          `Differentiate $\\cos^{-1} ${k}x$, starting with the standard derivative.`,
          `Apply the chain rule for the $${k}x$ inside.`,
          `Substitute $x = ${x0}$ and evaluate.`,
        ],
        marks: [0, 1, 1, 1],
        shows: [null, `$${start}$`, `$${chained}$`, null],
        watch: { at: 1, text: `Square the whole $${k}x$ under the root, not just the $x$.` },
      },
    };
  },
};

// ── 2019 Q5 ────────────────────────────────────────────────────────────────
// x = ln(at + b), y = ct²: dy/dx = (2c/a)t(at + b), then
// d²y/dx² = (2c/a)(2at + b) ÷ dx/dt = (2c/a²)(at + b)(2at + b).

interface Q5of2019 { a: 1 | 2; b: number; c: number }

const q2019q5: CardRoutine<Q5of2019> = {
  // a and b share no factor, so ln(at + b) is as plain as the paper's ln(2t + 7).
  draw: () => {
    const a = pick([1, 2] as const);
    return { a, b: until(() => int(1, 9), b => gcd(a, b) === 1), c: int(1, 3) };
  },

  build: ({ a, b, c }): Built => {
    const inner = sum([{ coef: a, body: 't' }, { coef: b, body: '' }]);
    const doubled = sum([{ coef: 2 * a, body: 't' }, { coef: b, body: '' }]);
    const y = sum([{ coef: c, body: 't^{2}' }]);
    const dxdt = `\\frac{${a}}{${inner}}`;
    const dydt = sum([{ coef: 2 * c, body: 't' }]);
    const first = sum([{ coef: 2 * c, body: 't^{2}' }, { coef: q(2 * c * b, a), body: 't' }]);
    const diffed = sum([{ coef: 4 * c, body: 't' }, { coef: q(2 * c * b, a), body: '' }]);
    const lead = q(2 * c, a * a);
    const leadText = lead.n === 1n && lead.d === 1n ? '' : num(lead);
    const second = `${leadText}(${inner})(${doubled})`;
    const DX = '\\frac{dx}{dt}', D2 = '\\frac{d^2y}{dx^2}';
    return {
      questionLines: [
        `For $x = \\ln(${inner})$ and $y = ${y}$, $t > 0$, find`,
        `<b>(a)</b> $${DYDX}$`,
        `<b>(b)</b> $${D2}.$`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> $${DX} = ${dxdt}$ and $\\frac{dy}{dt} = ${dydt}$`,
        `<strong>(a)</strong> $${DYDX} = ${dydt} \\div ${dxdt} = ${first}$`,
        `<strong>(b)</strong> $\\frac{d}{dt}\\left(${DYDX}\\right) = ${diffed}$, so $${D2} = (${diffed}) \\div ${DX}$`,
        `<strong>(b)</strong> $${D2} = (${diffed}) \\times ${a === 1 ? `(${inner})` : `\\frac{${inner}}{${a}}`} = ${second}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `(a) $${DYDX} = ${first}$<br>(b) $${D2} = ${second}$`,
      ladder: {
        moves: [
          'For a parametric curve, how do you get $\\frac{dy}{dx}$ from the two derivatives with respect to $t$?',
          '(a) Differentiate $x$ with respect to $t$.',
          '(a) Divide $\\frac{dy}{dt}$ by $\\frac{dx}{dt}$ and simplify.',
          '(b) Differentiate your answer to (a) with respect to $t$.',
          '(b) Divide by $\\frac{dx}{dt}$ again to get the second derivative.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, `$${dxdt}$`, null, `$(${diffed}) \\times \\ldots$`, null],
        watch: { at: 3, text: 'The second derivative is the $t$-derivative of $\\frac{dy}{dx}$ divided by $\\frac{dx}{dt}$, not just the $t$-derivative.' },
      },
    };
  },
};

// ── 2019 Q6 ────────────────────────────────────────────────────────────────
// A sphere deflating at R cm³ s⁻¹: dr/dt = -R/(4πr²) at r = r0.

interface Q6of2019 { R: number; r0: number }

const q2019q6: CardRoutine<Q6of2019> = {
  draw: () => ({ R: 10 * int(1, 12), r0: int(2, 8) }),

  build: ({ R, r0 }): Built => {
    const rate = q(R, 4 * r0 * r0);
    const drdt = `-\\frac{${rate.n}}{${rate.d === 1n ? '' : rate.d}\\pi}`;
    const chain = '\\frac{dV}{dt} = \\frac{dV}{dr} \\times \\frac{dr}{dt}';
    const substituted = `-${R} = 4\\pi(${r0})^{2}\\frac{dr}{dt}`;
    return {
      questionLines: [
        `A spherical balloon of radius $r$ cm, $r > 0$, deflates at a constant rate of ${R} cm$^{3}$s$^{-1}.$`,
        `Calculate the rate of change of the radius with respect to time when $r = ${r0}.$`,
        '[The volume of a sphere is given by $V = \\frac{4}{3}\\pi r^{3}.$]',
      ],
      solutionSteps: [
        `$\\frac{dV}{dr} = 4\\pi r^{2}$ and $${chain}$`,
        `$${substituted}$`,
        `$\\frac{dr}{dt} = ${drdt}$ cm s$^{-1}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `$\\frac{dr}{dt} = ${drdt}$ cm s$^{-1}$`,
      ladder: {
        moves: [
          'You know how fast the volume changes and want how fast the radius changes. Which rule links them?',
          'Differentiate $V$ with respect to $r$, and write the chain rule linking the rates.',
          `Substitute $r = ${r0}$ and the rate. Is the volume going up or down?`,
          'Evaluate $\\frac{dr}{dt}$, with units.',
        ],
        marks: [0, 1, 1, 1],
        shows: [null, `$\\frac{dV}{dr} = 4\\pi r^{2}$ and $${chain}$`, `$${substituted}$`, null],
        watch: { at: 3, text: 'Give units, and a negative rate: the balloon is shrinking.' },
      },
    };
  },
};

// ── 2019 Q10 ───────────────────────────────────────────────────────────────
// ax² + y² = bxy + N: dy/dx = (by - 2ax)/(2y - bx); vertical tangents where
// 2y = bx, so x² = 4N/(4a - b²) = K² and k = ±K.

interface Q10of2019 { a: number; b: number; K: number; N: number }

/**
 * Every curve with a whole K from 2 to 6 and N at most 100: b² < 4a keeps the points real.
 * a from 1 to 5 on the owner's yes (variation-depth sheet, card 11, 2026-10-05; a to 3
 * before): N vanishes when you differentiate, so (a) changes only with a and b.
 */
const Q10_CURVES2019: readonly Q10of2019[] = (() => {
  const out: Q10of2019[] = [];
  for (let a = 1; a <= 5; a++) {
    for (let b = 1; b * b < 4 * a; b++) {
      for (let K = 2; K <= 6; K++) {
        const fourN = K * K * (4 * a - b * b);
        if (fourN % 4 || fourN / 4 > 100) continue;
        out.push({ a, b, K, N: fourN / 4 });
      }
    }
  }
  return out;
})();

const q2019q10: CardRoutine<Q10of2019> = {
  draw: () => pick(Q10_CURVES2019),

  build: ({ a, b, K, N }): Built => {
    const ax2 = sum([{ coef: a, body: 'x^{2}' }]);
    const bxy = sum([{ coef: b, body: 'xy' }]);
    const curve = `${ax2} + y^{2} = ${bxy} + ${N}`;
    const prod = `${sum([{ coef: b, body: 'y' }])} + ${sum([{ coef: b, body: 'x' }])}${DYDX}`;
    const whole = `${sum([{ coef: 2 * a, body: 'x' }])} + 2y${DYDX} = ${prod}`;
    const top = sum([{ coef: b, body: 'y' }, { coef: -2 * a, body: 'x' }]);
    const bottom = sum([{ coef: 2, body: 'y' }, { coef: -b, body: 'x' }]);
    const answer = `\\frac{${top}}{${bottom}}`;
    // With an even b, top and bottom share a 2: cancelled, and the answer given so (the owner,
    // full read 2026-10-05, on 2xy). b = 4 is (2y - ax)/(y - 2x).
    const h = b / 2;
    const even = b % 2 === 0;
    const reduced = even
      ? `\\frac{${sum([{ coef: h, body: 'y' }, { coef: -a, body: 'x' }])}}{${sum([{ coef: 1, body: 'y' }, { coef: -h, body: 'x' }])}}`
      : answer;
    const finished = even ? `${answer} = ${reduced}` : answer;
    // b from 1 to 4 (b² < 4a, a at most 5): y = x/2, x, 3x/2 or 2x.
    const yOf = even ? sum([{ coef: h, body: 'x' }]) : `\\frac{${b === 1 ? '' : b}x}{2}`;
    const sub = even
      ? `${ax2} + ${sum([{ coef: h * h, body: 'x^{2}' }])} = ${sum([{ coef: b * h, body: 'x^{2}' }])} + ${N}`
      : `${ax2} + \\left(${yOf}\\right)^{2} = ${b === 1 ? '' : b}x\\left(${yOf}\\right) + ${N}`;
    return {
      questionLines: [
        `A curve is defined implicitly by the equation $${curve}.$`,
        `<b>(a)</b> Find an expression for $${DYDX}$ in terms of $x$ and $y.$`,
        '<b>(b)</b> There are two points where the tangent to the curve has equation $x = k$, $k \\in \\mathbb{R}.$',
        'Find the values of $k.$',
      ],
      solutionSteps: [
        `<strong>(a)</strong> $y^{2}$ gives $2y${DYDX}$ and $${bxy}$ gives $${prod}$`,
        `<strong>(a)</strong> $${whole}$`,
        `<strong>(a)</strong> $${DYDX} = ${finished}$`,
        `<strong>(b)</strong> A tangent $x = k$ is vertical, so the denominator is zero: $${bottom} = 0$, $y = ${yOf}$`,
        `<strong>(b)</strong> $${sub}$, so $x^{2} = ${K * K}$ and $k = \\pm ${K}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `(a) $${DYDX} = ${reduced}$<br>(b) $k = \\pm ${K}$`,
      ladder: {
        moves: [
          'A tangent with equation $x = k$ is vertical. What does that mean for $\\frac{dy}{dx}$?',
          '(a) Differentiate $y^2$ with the chain rule, or $xy$ with the product rule.',
          '(a) Complete the differentiation of every term.',
          '(a) Gather the $\\frac{dy}{dx}$ terms and make $\\frac{dy}{dx}$ the subject.',
          '(b) A vertical tangent means the gradient is undefined. Which part of the fraction is zero?',
          '(b) Substitute that relationship into the curve\'s equation and find $x$.',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [null, `$2y${DYDX}$ or $${prod}$`, `$${whole}$`, `$${DYDX} = ${answer}$`, `$${bottom} = 0$`, null],
        watch: { at: 3, text: '$\\frac{dy}{dx}$ must appear more than once after you differentiate, before you rearrange.' },
      },
    };
  },
};

export const ROUTINES = {
  '2019 Q1(a)': q2019q1a,
  '2019 Q1(b)': q2019q1b,
  '2019 Q1(c)': q2019q1c,
  '2019 Q5': q2019q5,
  '2019 Q6': q2019q6,
  '2019 Q10': q2019q10,
};
