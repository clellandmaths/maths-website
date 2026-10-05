/**
 * Advanced Higher, Integration: how each 2017 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/integration.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { distinct, int, pick, until } from '../draw';
import { num, piTimes, sqrtOf, sum } from '../maths/format';
import { gcd } from '../maths/integer';
import { neg, q } from '../maths/rational';
import { type Element, type Pt, type Scene, pt } from '../../../diagrams/scene';
import { renderScene } from '../../../diagrams/render';

// ── 2017 Q6 ────────────────────────────────────────────────────────────────
// ∫ ax/√(1 - k²x⁴) dx from 0 to 1/√(2k) by u = kx²: du = 2kx dx, u from 0 to
// 1/2, (a/2k)[sin⁻¹ u] = aπ/(12k).

interface Q6of2017 { k: number; a: number }

const q2017q6: CardRoutine<Q6of2017> = {
  // k from 2 to 9 (the paper's 5) and a number in front, a from 1 (the paper) to 4.
  draw: () => ({ k: int(2, 9), a: int(1, 4) }),

  build: ({ k, a }): Built => {
    const top = `\\frac{1}{${sqrtOf(2 * k)}}`;
    const integrand = `\\frac{${a === 1 ? '' : a}x}{\\sqrt{1 - ${k * k}x^{4}}}`;
    const integral = `\\int_{0}^{${top}} ${integrand} \\,dx`;
    // a/2k in front, not written when it is 1 (a = 4, k = 2).
    const coef = a === 2 * k ? '' : num(q(a, 2 * k));
    const half = '\\frac{1}{2}';
    const du = `\\frac{du}{dx} = ${2 * k}x$ or $du = ${2 * k}x\\,dx`;
    const limits = `u = 0,\\ u = ${half}`;
    const swapped = `${coef}\\int\\ldots du`;
    const inU = `${coef}\\int_{0}^{${half}} \\frac{1}{\\sqrt{1 - u^{2}}}\\,du`;
    const integrated = `${coef}\\left[\\sin^{-1} u\\right]_{0}^{${half}}`;
    const answer = piTimes(q(a, 12 * k));
    return {
      questionLines: [`Use the substitution $u = ${k}x^{2}$ to find the exact value of $${integral}.$`],
      solutionSteps: [
        `$${du}$`,
        `When $x = 0$, $u = 0$; when $x = ${top}$, $u = ${k} \\times \\frac{1}{${2 * k}} = ${half}$: $${limits}$`,
        `$${a === 1 ? '' : a}x\\,dx = ${coef ? `${coef}\\,du` : 'du'}$, so the integral is $${swapped}$`,
        `$${k * k}x^{4} = u^{2}$: $${inU}$`,
        `$= ${integrated}$`,
        `$= ${coef}${coef ? '\\left(' : ''}\\frac{\\pi}{6} - 0${coef ? '\\right)' : ''} = ${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          `With $u = ${k}x^2$, what are $du$ and the new limits? And what does $${k * k}x^4$ become?`,
          'Differentiate the substitution.',
          'Change the limits to values of $u$.',
          'Replace $x\\,dx$ with a multiple of $du$.',
          'Write the whole integrand in terms of $u$.',
          'Which standard integral has $\\sqrt{1 - u^2}$ underneath? Integrate.',
          'Evaluate between the new limits, exactly.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1],
        shows: [null, `$${du}$`, `$${limits}$`, `$${swapped}$`, `$${inU}$`, `$${integrated}$`, null],
        watch: { at: 4, text: 'Replace every $x$. An integral with both $u$ and $x$ in it cannot be done.' },
      },
    };
  },
};

// ── 2017 Q16 ───────────────────────────────────────────────────────────────
// The ellipse x²/X² + y²/Y² = 1, written Y²x² + X²y² = X²Y² over their common
// factor; its first-quadrant section rotated about the y-axis:
// V = π∫₀^Y (X² - (X²/Y²)y²) dy = (2/3)πX²Y.

interface Q16of2017 { X: number; Y: number; around: 'x' | 'y' }

/**
 * The paper's figure: arrowed axes, x, y and 0, and the quarter-ellipse
 * shaded. Drawn to scale, the larger semi-axis a fixed length, so the shape
 * follows the draw; no numbers, as the paper's.
 */
function sectionFigure(X: number, Y: number): Scene {
  const S = 90 / Math.max(X, Y), OVER = 26, ARROW = 4.5, BACK = 10;
  const D = (x: number, y: number): Pt => pt(x * S, y * S);
  const head = (at: Pt, dx: number, dy: number): Element[] => [0.4, -0.4].map(turn => {
    const [cs, sn] = [Math.cos(turn), Math.sin(turn)];
    return { kind: 'segment', from: at, to: pt(at.x - ARROW * (dx * cs - dy * sn), at.y - ARROW * (dx * sn + dy * cs)), decoration: true };
  });
  const arc = Array.from({ length: 91 }, (_, i) => {
    const t = (i / 90) * (Math.PI / 2);
    return D(X * Math.cos(t), Y * Math.sin(t));
  });
  const xEnd = pt(X * S + OVER, 0), yEnd = pt(0, Y * S + OVER);
  return {
    elements: [
      { kind: 'shadedShape', points: [pt(0, 0), ...arc] },
      { kind: 'path', points: arc },
      { kind: 'segment', from: pt(-BACK, 0), to: xEnd }, ...head(xEnd, 1, 0),
      { kind: 'segment', from: pt(0, -BACK), to: yEnd }, ...head(yEnd, 0, 1),
      { kind: 'label', text: 'x', anchor: pt(xEnd.x, -4), away: pt(xEnd.x, 20), small: true },
      { kind: 'label', text: 'y', anchor: pt(-4, yEnd.y), away: pt(20, yEnd.y), small: true },
      // The letter O, as on the rest of the course (the owner, full read 2026-10-05).
      { kind: 'label', text: 'O', anchor: pt(-5, -5), away: pt(10, 10), small: true },
    ],
    target: 220,
  };
}

const q2017q16: CardRoutine<Q16of2017> = {
  // The semi-axes different (a circle would be a sphere), from 1 to 6, the
  // longer at most three times the shorter, so the section is a shape like
  // the paper's 3 across and 2 up, not a sliver.
  // The owner on the 2017 sheet: "Could we extend so that half the time it is
  // rotated about the x-axis instead?" So the axis is drawn too, half and half.
  draw: () => {
    const { X, Y } = until(() => {
      const [X, Y] = distinct([1, 2, 3, 4, 5, 6], 2);
      return { X, Y };
    }, ({ X, Y }) => Math.max(X, Y) <= 3 * Math.min(X, Y));
    return { X, Y, around: pick(['y', 'x'] as const) };
  },

  build: ({ X, Y, around }): Built => {
    const g = gcd(X * X, Y * Y);
    const A = (Y * Y) / g, B = (X * X) / g, C = (X * X * Y * Y) / g;
    const term = (c: number, v: string) => (c === 1 ? v : `${c}${v}`);
    const curve = `${term(A, 'x^{2}')} + ${term(B, 'y^{2}')} = ${C}`;
    // About the y-axis x is squared and y runs from 0 to Y (the paper);
    // about the x-axis y is squared and x runs from 0 to X.
    const [w, u, W, U] = around === 'y' ? ['x', 'y', X, Y] : ['y', 'x', Y, X];
    const w2 = sum([{ coef: W * W, body: '' }, { coef: neg(q(W * W, U * U)), body: `${u}^{2}` }]);
    const F = sum([{ coef: W * W, body: u }, { coef: neg(q(W * W, 3 * U * U)), body: `${u}^{3}` }]);
    const V = piTimes(q(2 * W * W * U, 3));
    const form = `V = \\pi\\int ${w}^{2}\\,d${u}`;
    const substituted = `V = \\pi\\int\\left(${w2}\\right)d${u}`;
    const integrated = `V = \\pi\\left[${F}\\right]_{0}^{${U}}`;
    const top = around === 'y' ? `${term(B, 'y^{2}')} = ${C}` : `${term(A, 'x^{2}')} = ${C}`;
    const scene = sectionFigure(X, Y);
    return {
      questionLines: [
        `On a suitable domain, a curve is defined by the equation $${curve}.$ A section of the curve in the first quadrant, illustrated in the diagram below, is rotated $360^\\circ$ about the $${around}$-axis.`,
        renderScene(scene),
        'Calculate the exact value of the volume generated.',
      ],
      figure: { scene, claims: [] },
      solutionSteps: [
        `$${form}$`,
        `$${w}^{2} = ${w2}$, so $${substituted}$`,
        `The section runs from $${u} = 0$ to where $${w} = 0$, $${top}$, so $${u} = ${U}$: $\\int_{0}^{${U}}\\ldots d${u}$`,
        `$${integrated}$`,
        `$V = ${V}$ cubic units`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `$${V}$ cubic units`,
      ladder: {
        moves: [
          `Rotating about the $${around}$-axis: which variable do you integrate with respect to, and what gets squared?`,
          `Write the volume integral as $\\pi$ times the integral of $${w}^2$ with respect to $${u}$.`,
          `Rearrange the curve's equation for $${w}^2$ and substitute.`,
          `Find the limits in terms of $${u}$ from the diagram and the equation.`,
          'Integrate.',
          'Evaluate exactly.',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [null, `$${form}$`, `$${substituted}$`, `$\\int_{0}^{${U}}\\ldots d${u}$ or $${u} = 0,\\ ${u} = ${U}$`, `$${integrated}$`, null],
        watch: { at: 1, text: `Rotating about the $${around}$-axis means $\\int\\pi ${w}^2\\,d${u}$, not $d${w}$.` },
      },
    };
  },
};

export const ROUTINES = {
  '2017 Q6': q2017q6,
  '2017 Q16': q2017q16,
};
