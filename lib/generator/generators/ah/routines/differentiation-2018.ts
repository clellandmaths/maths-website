/**
 * Advanced Higher, Differentiation: how each 2018 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/differentiation.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int, pick, until } from '../draw';
import { decimal, num, sum } from '../maths/format';
import { coprime } from '../maths/integer';
import { add, q } from '../maths/rational';
import { type Scene, add as plus, dimensionArrow, mid, pt, scale, unit } from '../../../diagrams/scene';
import { renderScene } from '../../../diagrams/render';

const DYDX = '\\frac{dy}{dx}';

// ── 2018 Q1(a) ─────────────────────────────────────────────────────────────
// f(x) = a sin^{-1} kx, f'(x) = ak/√(1 - k²x²)

interface Q1aOf2018 { a: number; k: number }

const q2018q1a: CardRoutine<Q1aOf2018> = {
  draw: () => ({ a: int(1, 4), k: int(2, 9) }),

  build: ({ a, k }): Built => {
    const front = a === 1 ? '' : String(a);
    const answer = `\\frac{${a * k}}{\\sqrt{1 - ${k * k}x^{2}}}`;
    return {
      questionLines: [`Given $f(x) = ${front}\\sin^{-1} ${k}x$ find $f'(x).$`],
      solutionSteps: [
        `$f'(x) = \\frac{${a}}{\\sqrt{1 - (${k}x)^{2}}} \\times \\ldots$`,
        `$f'(x) = ${answer}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$f'(x) = ${answer}$`,
      ladder: {
        moves: [
          'Which standard derivative has $\\sqrt{1 - (\\ldots)^2}$ underneath?',
          `Differentiate $\\sin^{-1} ${k}x$, starting with the standard derivative.`,
          `Apply the chain rule for the $${k}x$ inside.`,
        ],
        marks: [0, 1, 1],
        shows: [null, `$\\frac{${a}}{\\sqrt{1 - (${k}x)^{2}}} \\times \\ldots$`, null],
        watch: { at: 1, text: `Square the whole $${k}x$ under the root, not just the $x$.` },
      },
    };
  },
};

// ── 2018 Q1(b) ─────────────────────────────────────────────────────────────
// y = e^{ax}/(bx + c) by the quotient rule, left unsimplified as the paper's
// answer is

interface Q1bOf2018 { a: number; b: number; c: number }

const q2018q1b: CardRoutine<Q1bOf2018> = {
  // b and c share no factor, as the paper's 7x + 1: a paper never prints 4x + 2.
  draw: () => until(() => ({ a: int(2, 6), b: int(2, 9), c: int(1, 9) }), v => coprime(v.b, v.c)),

  build: ({ a, b, c }): Built => {
    const bottom = `${b}x + ${c}`;
    const e = `e^{${a}x}`;
    const squared = `(${bottom})^{2}`;
    const left = `${a}(${bottom})${e}`;
    const right = `${b}${e}`;
    const answer = `\\frac{${left} - ${right}}{${squared}}`;
    return {
      questionLines: [`Differentiate $y = \\frac{${e}}{${bottom}}.$`],
      solutionSteps: [
        `By the quotient rule, $${DYDX} = \\frac{${left} \\ldots}{${squared}}$`,
        `$${DYDX} = ${answer}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$${DYDX} = ${answer}$`,
      ladder: {
        moves: [
          'The function is one expression divided by another. Which rule does that need?',
          `Set up the quotient rule with $${squared}$ as the denominator.`,
          `Complete the numerator. The $${e}$ needs the chain rule.`,
        ],
        marks: [0, 1, 1],
        shows: [null, `$\\frac{${left} \\ldots}{${squared}}$ or $\\frac{\\ldots - ${right}}{${squared}}$`, null],
      },
    };
  },
};

// ── 2018 Q1(c) ─────────────────────────────────────────────────────────────
// y cos x + by² = kx: dy/dx cos x - y sin x + 2by dy/dx = k, so
// dy/dx = (k + y sin x)/(cos x + 2by)

interface Q1cOf2018 { b: number; k: number }

const q2018q1c: CardRoutine<Q1cOf2018> = {
  draw: () => ({ b: int(1, 3), k: int(2, 12) }),

  build: ({ b, k }): Built => {
    const ySq = `${b === 1 ? '' : b}y^{2}`;
    const twoBy = `${2 * b}y`;
    const product = `${DYDX}\\cos x - y\\sin x`;
    const answer = `\\frac{${k} + y\\sin x}{\\cos x + ${twoBy}}`;
    return {
      questionLines: [`For $y \\cos x + ${ySq} = ${k}x$, use implicit differentiation to find $${DYDX}.$`],
      solutionSteps: [
        `By the product rule, $y\\cos x$ gives $${DYDX}\\cos x + \\ldots$`,
        `$${product}$`,
        `$${product} + ${twoBy}${DYDX} = ${k}$`,
        `$${DYDX}(\\cos x + ${twoBy}) = ${k} + y\\sin x$, so $${DYDX} = ${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `$${DYDX} = ${answer}$`,
      ladder: {
        moves: [
          '$y\\cos x$ is a product. What does differentiating each part give, when $y$ depends on $x$?',
          'Differentiate $y\\cos x$ with the product rule. The $y$ part picks up $\\frac{dy}{dx}$.',
          'Complete the product term.',
          `Differentiate $${ySq}$ and $${k}x$.`,
          'Gather the $\\frac{dy}{dx}$ terms and make $\\frac{dy}{dx}$ the subject.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [
          null,
          `$${DYDX}\\cos x + \\ldots$ or $-y\\sin x + \\ldots$`,
          `$${product}$`,
          `$+ ${twoBy}${DYDX} = ${k}$`,
          null,
        ],
        watch: { at: 1, text: '$y\\cos x$ gives two terms. One term alone loses both product-rule marks.' },
      },
    };
  },
};

// ── 2018 Q6 ────────────────────────────────────────────────────────────────
// x = t² + c, y = ln(at + b), the tangent where at + b = 1, so y = 0 there:
// t₀ = -e/a with e = b - 1, gradient -a²/(2e), x₀ = e²/a² + c.

interface Q6of2018 { a: number; e: number; c: number }

/**
 * a from 2 to 7 and e = b - 1 from 1 to 8: a sharing no factor with e, so t₀
 * is a fraction, as the paper's -1/3, and none with b, so the log is never
 * ln(2t + 4), which a paper would not print. That leaves a = 3, 5 or 7 (with a
 * even, e odd makes b even).
 */
const Q6_PAIRS2018: readonly [number, number][] = (() => {
  const out: [number, number][] = [];
  for (let a = 2; a <= 7; a++) for (let e = 1; e <= 8; e++) if (coprime(a, e) && coprime(a, e + 1)) out.push([a, e]);
  return out;
})();

const q2018q6: CardRoutine<Q6of2018> = {
  draw: () => {
    const [a, e] = pick(Q6_PAIRS2018);
    return { a, e, c: int(1, 5) };
  },

  build: ({ a, e, c }): Built => {
    const b = e + 1;
    const t0 = num(q(-e, a));
    const inside = `${a}t + ${b}`;
    const dydt = `\\frac{${a}}{${inside}}`;
    const m = q(-a * a, 2 * e);
    const x0 = add(q(e * e, a * a), q(c));
    const k = add(q(e, 2), q(a * a * c, 2 * e));
    const line = sum([{ coef: m, body: 'x' }, { coef: k, body: '' }]);
    const relate = `\\frac{dx}{dt} = 2t$ and $${DYDX} = \\frac{dy/dt}{dx/dt}`;
    // dy/dt is a/1 at t0: written as a (the owner, full read 2026-10-05).
    const gradient = `${DYDX} = ${a} \\div 2\\left(${t0}\\right) = ${num(m)}`;
    const point = `x = ${num(x0)}$, $y = \\ln 1 = 0`;
    return {
      questionLines: [
        `On a suitable domain, a curve is defined parametrically by $x = t^{2} + ${c}$ and $y = \\ln(${inside}).$`,
        `Find the equation of the tangent to the curve where $t = ${t0}.$`,
      ],
      solutionSteps: [
        `$\\frac{dy}{dt} = ${dydt}$`,
        `$${relate}$`,
        `At $t = ${t0}$, $${gradient}$`,
        `$${point}$`,
        `$y - 0 = ${num(m)}\\left(x - ${num(x0)}\\right)$, so $y = ${line}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `$y = ${line}$`,
      ladder: {
        moves: [
          'For a parametric curve, how do you get $\\frac{dy}{dx}$ from the two derivatives with respect to $t$?',
          'Differentiate $y$ with respect to $t$, using the chain rule on the log.',
          'Differentiate $x$, and write $\\frac{dy}{dx}$ as $\\frac{dy}{dt}$ over $\\frac{dx}{dt}$.',
          'Evaluate the gradient at the given $t$.',
          'Find $x$ and $y$ at the same $t$.',
          'Write the equation of the tangent and tidy it.',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [null, `$\\frac{dy}{dt} = ${dydt}$`, `$${relate}$`, `$${DYDX} = ${num(m)}$`, `$${point}$`, null],
        watch: { at: 5, text: 'Rearrange the tangent\'s equation. Leaving it as "$y - 0 = \\ldots$" loses the mark.' },
      },
    };
  },
};

// ── 2018 Q13 ───────────────────────────────────────────────────────────────
// A rhombus of side L: (x/2)² + (h/2)² = L², so h = √(4L² - x²); x falls at
// R cm/s, and at x = X, dh/dt = RX/h. (X/2, h/2, L) is a Pythagorean triple,
// so h is whole there, as the paper's 40.

interface Q13of2018 { p: number; s: number; L: number; r: number }

/** Half-diagonals and side, L from 10 to 30 cm, either half-diagonal across. */
const Q13_TRIPLES2018: readonly [number, number, number][] = (() => {
  const base: [number, number, number][] = [
    [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20],
    [15, 20, 25], [7, 24, 25], [10, 24, 26], [20, 21, 29], [18, 24, 30],
  ];
  return base.flatMap(([u, v, L]) => [[u, v, L], [v, u, L]] as [number, number, number][]);
})();

/**
 * The paper's model: the rhombus on its diagonals (dashed), h measured up the
 * left and x along the bottom, the side's length on the upper right. Not to
 * scale, as the paper's (its x at 30 would be narrower than h): only the
 * side's label changes.
 */
function rhombusFigure(L: number): Scene {
  const W = 110, H = 64;
  const left = pt(-W, 0), right = pt(W, 0), top = pt(0, H), bottom = pt(0, -H);
  const centre = pt(0, 0);
  const side = mid(top, right);
  const out = unit(pt(H, W));
  return {
    elements: [
      { kind: 'polygon', points: [left, top, right, bottom] },
      { kind: 'segment', from: left, to: right, dashed: true },
      { kind: 'segment', from: top, to: bottom, dashed: true },
      ...dimensionArrow(bottom, top, pt(-200, 0), W + 26, 'h'),
      ...dimensionArrow(left, right, pt(0, -200), H + 22, 'x'),
      { kind: 'label', text: `${L} cm`, anchor: plus(side, scale(out, 6)), away: centre },
    ],
  };
}

const q2018q13: CardRoutine<Q13of2018> = {
  draw: () => {
    const [p, s, L] = pick(Q13_TRIPLES2018);
    return { p, s, L, r: int(1, 5) };
  },

  build: ({ p, s, L, r }): Built => {
    const N = 4 * L * L;
    const X = 2 * p;
    const rate = `0.${r}`;
    const value = q(r * p, 10 * s);
    const exact = num(value);
    const answer = `${exact}$ cm s$^{-1}$ (or $${decimal(value, 4)}$ cm s$^{-1}$)`;
    const relation = `x^{2} + h^{2} = ${N}$, $h = \\sqrt{${N} - x^{2}}`;
    const dhdx = `\\frac{dh}{dx} = -2x \\cdot \\frac{1}{2}(${N} - x^{2})^{-\\frac{1}{2}}`;
    const chain = '\\frac{dh}{dt} = \\frac{dh}{dx} \\cdot \\frac{dx}{dt}';
    const multiplied = `\\frac{dh}{dt} = \\frac{${rate}x}{\\sqrt{${N} - x^{2}}}`;
    const scene = rhombusFigure(L);
    return {
      questionLines: [
        'An engineer has designed a lifting device. The handle turns a screw which shortens the horizontal length and increases the vertical height.',
        `The device is modelled by a rhombus, with each side ${L} cm.`,
        'The horizontal length is $x$ cm, and the vertical height is $h$ cm as shown.',
        renderScene(scene),
        `<b>(a)</b> Show that $h = \\sqrt{${N} - x^{2}}.$`,
        `<b>(b)</b> The horizontal length decreases at a rate of ${rate} cm per second as the handle is turned.`,
        `Find the rate of change of the vertical height when $x = ${X}.$`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> The diagonals of a rhombus bisect each other at right angles, so $\\left(\\frac{x}{2}\\right)^{2} + \\left(\\frac{h}{2}\\right)^{2} = ${L}^{2}$, which gives $${relation}$`,
        `<strong>(b)</strong> $\\frac{dx}{dt} = -${rate}$`,
        `<strong>(b)</strong> $${dhdx}$`,
        `<strong>(b)</strong> $${chain}$`,
        `<strong>(b)</strong> $${multiplied}$`,
        `<strong>(b)</strong> When $x = ${X}$, $\\frac{dh}{dt} = \\frac{${rate} \\times ${X}}{\\sqrt{${N} - ${X * X}}} = \\frac{${rate} \\times ${X}}{${2 * s}} = ${answer}`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1],
      finalAnswer: [
        `(a) $\\left(\\frac{x}{2}\\right)^{2} + \\left(\\frac{h}{2}\\right)^{2} = ${L}^{2}$, so $${relation}$`,
        `(b) $\\frac{dh}{dt} = ${answer}`,
      ].join('<br>'),
      figure: { scene, claims: [] },
      ladder: {
        moves: [
          'The diagonals of a rhombus cut each other in half at right angles. What triangle does that make?',
          '(a) Use Pythagoras in one of the four right-angled triangles, and rearrange for $h$.',
          '(b) Write the given rate as $\\frac{dx}{dt}$. Is $x$ getting bigger or smaller?',
          '(b) Differentiate $h$ with respect to $x$, using the chain rule.',
          '(b) Write the chain rule linking $\\frac{dh}{dt}$, $\\frac{dh}{dx}$ and $\\frac{dx}{dt}$.',
          '(b) Multiply the two derivatives.',
          `(b) Substitute $x = ${X}$ and evaluate, with units.`,
        ],
        marks: [0, 1, 1, 1, 1, 1, 1],
        shows: [null, `$${relation}$`, `$\\frac{dx}{dt} = -${rate}$`, `$${dhdx}$`, `$${chain}$`, `$${multiplied}$`, null],
        watch: { at: 6, text: 'Give units with the final rate, or the last mark goes.' },
      },
    };
  },
};

export const ROUTINES = {
  '2018 Q1(a)': q2018q1a,
  '2018 Q1(b)': q2018q1b,
  '2018 Q1(c)': q2018q1c,
  '2018 Q6': q2018q6,
  '2018 Q13': q2018q13,
};
