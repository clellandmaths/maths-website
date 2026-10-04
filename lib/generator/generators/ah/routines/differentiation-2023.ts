/**
 * Advanced Higher, Differentiation: how each 2023 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/differentiation.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int, nonZero, pick, until } from '../draw';
import { joinTerms, num, power, rounded, sum } from '../maths/format';
import { q } from '../maths/rational';
import { type Scene, dimensionArrow, pt } from '../../../diagrams/scene';
import { renderScene } from '../../../diagrams/render';

const DYDX = '\\frac{dy}{dx}';

// ── 2023 P1 Q1 ─────────────────────────────────────────────────────────────
// y = c x tan kx, by the product rule

interface P1Q1of2023 { c: number; k: number }

const q2023p1q1: CardRoutine<P1Q1of2023> = {
  draw: () => ({ c: int(2, 9), k: int(2, 9) }),

  build: ({ c, k }): Built => {
    const tan = `\\tan ${k}x`;
    const sec = `\\sec^{2} ${k}x`;
    const first = `${c}${tan}`;
    const begun = `${first} + ${c}x(\\ldots)`;
    const other = `(\\ldots)${tan} + ${c}x \\times ${k}${sec}`;
    const answer = `${first} + ${c * k}x${sec}`;
    return {
      questionLines: [`Given $y = ${c}x ${tan}$, find $${DYDX}.$`],
      solutionSteps: [
        `By the product rule, $${DYDX} = ${begun}$`,
        `$${DYDX} = ${answer}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$${DYDX} = ${answer}$`,
      ladder: {
        moves: [
          '$y$ is two factors multiplied together. Which rule does that need?',
          'Use the product rule: differentiate each factor in turn.',
          `Differentiate $${tan}$ with the chain rule, and write both terms.`,
        ],
        marks: [0, 1, 1],
        shows: [null, `$${begun}$ or $${other}$`, null],
        watch: { at: 1, text: 'The product rule gives two terms. Only one term earns nothing.' },
      },
    };
  },
};

// ── 2023 P2 Q1 ─────────────────────────────────────────────────────────────
// f(x) = c sin^{-1} kx, in this paper's words ("The function f is defined by")

interface P2Q1of2023 { c: number; k: number }

const q2023p2q1: CardRoutine<P2Q1of2023> = {
  draw: () => ({ c: int(2, 9), k: int(2, 9) }),

  build: ({ c, k }): Built => {
    const inside = `1 - (${k}x)^{2}`;
    const start = `\\frac{${c}}{\\sqrt{${inside}}}`;
    const bracketed = `\\frac{${c * k}}{\\sqrt{${inside}}}`;
    const answer = `\\frac{${c * k}}{\\sqrt{1 - ${k * k}x^{2}}}`;
    return {
      questionLines: [
        `The function $f$ is defined by $f(x) = ${c}\\sin^{-1} ${k}x.$`,
        'Find $f\'(x).$',
      ],
      solutionSteps: [
        `Differentiating the inverse sine, keeping the ${c} in front: $${start} \\times \\ldots$`,
        `By the chain rule, $f'(x) = ${start} \\times ${k} = ${bracketed} = ${answer}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$f'(x) = ${answer}$ (or $${bracketed}$)`,
      ladder: {
        moves: [
          'Which standard derivative has $\\sqrt{1 - (\\ldots)^{2}}$ underneath?',
          `Differentiate $\\sin^{-1}$ of the bracket, keeping the ${c} in front.`,
          `Apply the chain rule for the $${k}x$ inside.`,
        ],
        marks: [0, 1, 1],
        shows: [null, `$${start}$`, null],
        watch: { at: 2, text: `Square the whole $${k}x$ under the root, not just the $x$.` },
      },
    };
  },
};

// ── 2023 P2 Q4 ─────────────────────────────────────────────────────────────
// x²y² + py = sin kx at the origin: the product term vanishes, dy/dx = k/p

interface P2Q4of2023 { p: number; k: number }

const q2023p2q4: CardRoutine<P2Q4of2023> = {
  draw: () => ({ p: nonZero(-6, 6), k: int(2, 7) }),

  build: ({ p, k }): Built => {
    const curve = `${sum([{ coef: 1, body: 'x^{2}y^{2}' }, { coef: p, body: 'y' }])} = \\sin ${k}x`;
    const oneTerm = `$2xy^{2} + \\ldots$ or $\\ldots + 2x^{2}y${DYDX}$`;
    const product = `2xy^{2} + 2x^{2}y${DYDX}`;
    const whole = `${sum([{ coef: 2, body: 'xy^{2}' }, { coef: 2, body: `x^{2}y${DYDX}` }, { coef: p, body: DYDX }])} = ${k}\\cos ${k}x`;
    const atOrigin = `${sum([{ coef: p, body: DYDX }])} = ${k}`;
    const gradient = num(q(k, p));
    return {
      questionLines: [
        `Calculate the gradient of the tangent to the curve with equation $${curve}$ at the point $(0, 0).$`,
      ],
      solutionSteps: [
        `By the product rule, $\\frac{d}{dx}\\left(x^{2}y^{2}\\right) = 2xy^{2} + x^{2} \\times 2y${DYDX}$`,
        `$= ${product}$`,
        `Differentiating the whole equation, $${whole}$; at $(0, 0)$, $${atOrigin}$, so $${DYDX} = ${gradient}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `$${DYDX} = ${gradient}$`,
      ladder: {
        moves: [
          'Both $x$ and $y$ vary. How do you differentiate the product term?',
          `Differentiate $x^{2}y^{2}$ with the product rule. The $y^{2}$ part picks up $${DYDX}$.`,
          'Complete the product term.',
          `Differentiate the other terms, substitute $x = 0$ and $y = 0$, and solve for $${DYDX}$.`,
        ],
        marks: [0, 1, 1, 1],
        shows: [null, oneTerm, `$${product}$`, null],
        watch: { at: 1, text: 'The product rule gives two terms. One term alone loses both product-rule marks.' },
      },
    };
  },
};

// ── 2023 P2 Q10 ────────────────────────────────────────────────────────────
// y = x^{a x^m} by logarithmic differentiation. m from 2: x^{kx} (m = 1) is
// 2026 P2 Q5's question.

interface P2Q10of2023 { a: number; m: number }

const q2023p2q10: CardRoutine<P2Q10of2023> = {
  draw: () => ({ a: pick([-1, 1]) * int(2, 9), m: int(2, 4) }),

  build: ({ a, m }): Built => {
    const y = `x^{${sum([{ coef: a, body: power('x', m) }])}}`;
    const DY = `\\frac{1}{y}${DYDX}`;
    const logs = sum([{ coef: a, body: `${power('x', m)}\\ln x` }]);
    const lnTerm = { coef: a * m, body: `${power('x', m - 1)}\\ln x` };
    const productTerm = { coef: a, body: `${power('x', m)} \\cdot \\frac{1}{x}` };
    const oneTerm = `${sum([lnTerm])} + \\ldots`;
    const otherTerm = joinTerms(['\\ldots', sum([productTerm])]);
    const both = sum([lnTerm, productTerm]);
    const answer = `${DYDX} = ${y}(${sum([lnTerm, { coef: a, body: power('x', m - 1) }])})`;
    return {
      questionLines: [
        `A curve is defined by $y = ${y}$, where $x \\gt 0.$`,
        `Find $${DYDX}$ in terms of $x.$`,
      ],
      solutionSteps: [
        `Taking logs of both sides: $\\ln y = ${logs}$`,
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
        shows: [null, `$\\ln y = ${logs}$`, `$${DY}$`, `$${oneTerm}$ or $${otherTerm}$`, null],
        watch: { at: 4, text: 'Replace $y$ with the original expression. The power stays exactly as it was.' },
      },
    };
  },
};

// ── 2023 P2 Q11 ────────────────────────────────────────────────────────────
// A cone of diameter D and height H, vertex down, filling at L litres a second:
// (a) V = c π h³ by similar triangles; (b) dh/dt at h = h0.

interface P2Q11of2023 { H: number; s: number; t: number; L: number; h0: number }

/** Radius over height, s/t: the paper's 90/150 = 3/5 among them. */
const CONE_RATIOS: readonly [number, number][] = [[1, 2], [1, 3], [2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [5, 6]];

/**
 * The paper's figure: the cone's section, a triangle on its vertex, the
 * diameter marked with an arrow above and the height with one on the right.
 * Drawn in centimetres, so the picture is the cone's true shape.
 */
function coneFigure(D: number, H: number): Scene {
  const gap = 0.08 * Math.max(D, H);
  const [left, right, vertex] = [pt(0, H), pt(D, H), pt(D / 2, 0)];
  return {
    elements: [
      { kind: 'polygon', points: [left, right, vertex] },
      ...dimensionArrow(left, right, pt(D / 2, H + 10 * gap), gap, `${D} cm`),
      ...dimensionArrow(pt(D, 0), right, pt(D + 10 * gap, H / 2), gap, `${H} cm`),
    ],
  };
}

/** h0 and dh/dt = 1000 L / (π s²h0²/t²): as a rational times 1/π. */
const coneRate = ({ s, t, L, h0 }: P2Q11of2023) => q(1000 * L * t * t, s * s * h0 * h0);

const q2023p2q11: CardRoutine<P2Q11of2023> = {
  draw: () => until(
    () => {
      const [s, t] = pick(CONE_RATIOS);
      return { H: pick([100, 120, 150, 180, 200]), s, t, L: int(2, 20), h0: 5 * int(8, 39) };
    },
    (n) => {
      const R = (n.H * n.s) / n.t;
      const K = coneRate(n);
      const rate = Number(K.n) / Number(K.d) / Math.PI;
      // A whole radius, a height reached between two fifths full and just short
      // of the top, as the paper's 125 of 150; a rate two places show, as 0.57.
      return Number.isInteger(R) && 2 * R >= 60 && 2 * R <= 240 && n.h0 >= 0.4 * n.H && n.h0 <= n.H - 10
        && rate >= 0.1 && rate <= 5 && K.n <= 999n && K.d <= 999n;
    },
  ),

  build: (n): Built => {
    const { H, s, t, L, h0 } = n;
    const R = (H * s) / t, D = 2 * R;
    const c = q(s * s, 3 * t * t);
    const V = `\\frac{${c.n === 1n ? '' : c.n}\\pi h^{3}}{${c.d}}`;
    const dV = q(3n * c.n, c.d);
    const dVdh = `\\frac{${dV.n === 1n ? '' : dV.n}\\pi h^{2}}{${dV.d}}`;
    const rateIn = 1000 * L;
    const dhdtInH = `\\frac{${dV.d === 1n ? '' : `${dV.d} \\times `}${rateIn}}{${dV.n === 1n ? '' : dV.n}\\pi h^{2}}`;
    const K = coneRate(n);
    const exact = `\\frac{${K.n}}{${K.d === 1n ? '' : K.d}\\pi}`;
    const approx = rounded(Number(K.n) / Number(K.d) / Math.PI, 2);
    const ratio = `\\frac{r}{h} = \\frac{${R}}{${H}}`;
    const rOfH = `r = ${num(q(s, t))}h`;
    const scene = coneFigure(D, H);
    return {
      questionLines: [
        `On a building site, water is stored in a container. The container is a cone with diameter ${D} cm at its widest point and height of ${H} cm.`,
        renderScene(scene),
        `<b>(a)</b> Show that when the water level is at a height of $h$ cm, $0 \\le h \\le ${H}$, the volume of water in the container can be written as`,
        '',
        `$V = ${V}.$`,
        '',
        '[The volume of a cone is given by $V = \\frac{1}{3}\\pi r^{2}h.$]',
        `Water is pumped into the container at a constant rate of ${L} litres per second.`,
        `<b>(b)</b> Find the rate at which the height is increasing when $h = ${h0}.$`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> By similar triangles, $${ratio}$, so $${rOfH}$ and $V = \\frac{1}{3}\\pi\\left(${num(q(s, t))}h\\right)^{2}h = ${V}$`,
        `<strong>(b)</strong> $\\frac{dV}{dh} = ${dVdh}$`,
        '<strong>(b)</strong> $\\frac{dV}{dt} = \\frac{dV}{dh} \\times \\frac{dh}{dt}$',
        `<strong>(b)</strong> ${L} litres is ${rateIn} cm³, so $\\frac{dV}{dt} = ${rateIn}$`,
        `<strong>(b)</strong> $\\frac{dh}{dt} = ${dhdtInH}$`,
        `<strong>(b)</strong> At $h = ${h0}$, $\\frac{dh}{dt} = ${exact} \\approx ${approx}$ cm s⁻¹`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1],
      finalAnswer: `(a) $${ratio}$, so $${rOfH}$, and $V = \\frac{1}{3}\\pi\\left(${num(q(s, t))}h\\right)^{2}h = ${V}.$<br>(b) $${exact}$ cm s⁻¹ (or $${approx}$ cm s⁻¹)`,
      figure: {
        scene,
        claims: [
          { kind: 'length', from: pt(0, H), to: pt(D, H), value: D, shown: true },
          { kind: 'length', from: pt(D / 2, 0), to: pt(D / 2, H), value: H, shown: true },
        ],
      },
      ladder: {
        moves: [
          'The water is a smaller cone of the same shape. How does its radius compare with its height?',
          '(a) Use similar triangles to write $r$ in terms of $h$, and substitute into the volume formula.',
          '(b) Differentiate $V$ with respect to $h$.',
          '(b) Write the chain rule linking $\\frac{dV}{dt}$, $\\frac{dV}{dh}$ and $\\frac{dh}{dt}$.',
          '(b) Convert the pumping rate from litres to cubic centimetres.',
          '(b) Rearrange to write $\\frac{dh}{dt}$ in terms of $h$.',
          `(b) Substitute $h = ${h0}$ and evaluate, with units.`,
        ],
        marks: [0, 1, 1, 1, 1, 1, 1],
        shows: [
          null,
          `$${rOfH}$ leading to $V = ${V}$`,
          `$\\frac{dV}{dh} = ${dVdh}$`,
          '$\\frac{dV}{dt} = \\frac{dV}{dh}\\frac{dh}{dt}$',
          `$\\frac{dV}{dt} = ${rateIn}$`,
          `$\\frac{dh}{dt} = ${dhdtInH}$`,
          null,
        ],
        watch: { at: 4, text: 'The rate is in litres, but the cone\'s volume is in $\\text{cm}^3$. Convert before you substitute.' },
      },
    };
  },
};

export const ROUTINES = {
  '2023 P1 Q1': q2023p1q1,
  '2023 P2 Q1': q2023p2q1,
  '2023 P2 Q4': q2023p2q4,
  '2023 P2 Q10': q2023p2q10,
  '2023 P2 Q11': q2023p2q11,
};
