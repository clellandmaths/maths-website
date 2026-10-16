/**
 * Advanced Higher, Integration: how each 2022 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/integration.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int, pick, until } from '../../core/draw';
import { num, sum } from '../../core/maths/format';
import { gcd } from '../../core/maths/integer';
import { neg, q } from '../../core/maths/rational';
import { type Element, type Pt, type Scene, pt } from '../../../diagrams/scene';
import { renderScene } from '../../../diagrams/render';

// ── 2022 P1 Q7 ─────────────────────────────────────────────────────────────
// x = ky/√(y² + 1), 0 ≤ y ≤ m: (a) ∫ x dy by u = y² + 1; (b) the symmetrical
// cross-section's area, twice (a); (c) y²/(y² + 1) = 1 - 1/(y² + 1); (d) the
// volume about the y-axis, k²π(m - tan⁻¹ m).

interface P1Q7of2022 { k: number; m: number }

/**
 * The paper's figure: arrowed axes, 0 at the origin and m on the y-axis, the
 * curve from the origin up to y = m, a dashed line across to its top, and the
 * curve's equation beside it. No numbers on the x-axis, so the curve is
 * scaled to a fixed width, as the paper's is drawn wider than it is: k never
 * changes the picture, and m changes only its shape.
 */
function modelFigure(k: number, m: number): Scene {
  const W = 70, H = 80, OVER = 14, ARROW = 4.5;
  const x = (y: number) => y / Math.sqrt(y * y + 1);
  const wide = x(m);
  const D = (xv: number, yv: number): Pt => pt((xv / wide) * W, (yv / m) * H);
  const head = (at: Pt, dx: number, dy: number): Element[] => [0.4, -0.4].map(turn => {
    const [cs, sn] = [Math.cos(turn), Math.sin(turn)];
    return { kind: 'segment', from: at, to: pt(at.x - ARROW * (dx * cs - dy * sn), at.y - ARROW * (dx * sn + dy * cs)), decoration: true };
  });
  const xEnd = pt(W + OVER * 3, 0), yEnd = pt(0, H + OVER);
  const samples = Array.from({ length: 121 }, (_, i) => (i / 120) * m);
  const top = D(x(m), m);
  return {
    elements: [
      { kind: 'segment', from: pt(0, 0), to: xEnd }, ...head(xEnd, 1, 0),
      { kind: 'segment', from: pt(0, 0), to: yEnd }, ...head(yEnd, 0, 1),
      { kind: 'path', points: samples.map(y => D(x(y), y)) },
      { kind: 'segment', from: pt(0, H), to: top, dashed: true },
      { kind: 'label', text: 'x', anchor: xEnd, away: pt(xEnd.x, 20), small: true },
      { kind: 'label', text: 'y', anchor: yEnd, away: pt(20, yEnd.y), small: true },
      { kind: 'label', text: '0', anchor: pt(0, 0), away: pt(20, 20), small: true },
      { kind: 'label', text: String(m), anchor: pt(0, H), away: pt(20, H), small: true },
      { kind: 'label', text: `x = ${k}y/√(y² + 1)`, anchor: D(x(m), 0.72 * m), away: pt(0, 0.72 * H), small: true },
    ],
  };
}

/** m whose m² + 1 has no square factor, so √(m² + 1) is already simplest, as √26; not 1, whose tan⁻¹ is π/4. */
const Q7_TOPS = [2, 3, 4, 5, 6, 8, 9] as const;

const q2022p1q7: CardRoutine<P1Q7of2022> = {
  draw: () => ({ k: int(2, 6), m: pick(Q7_TOPS) }),

  build: ({ k, m }): Built => {
    const top = m * m + 1;
    const x = `\\frac{${k}y}{\\sqrt{y^{2} + 1}}`;
    const integral = `\\int_{0}^{${m}} ${x} \\,dy`;
    const half = q(k, 2);
    const halfText = half.n === 1n && half.d === 1n ? '' : num(half);
    const inU = `${halfText}\\int_{1}^{${top}} \\frac{1}{\\sqrt{u}}\\,du`;
    const a = `${k}(\\sqrt{${top}} - 1)`;
    const area = `${2 * k}(\\sqrt{${top}} - 1)`;
    const split = '1 - \\frac{1}{y^{2} + 1}';
    const inVolume = `${k * k}\\pi\\int_{0}^{${m}}\\left(${split}\\right)dy`;
    const volume = `${k * k}\\pi(${m} - \\tan^{-1} ${m})`;
    const curve = `$x = ${x}$, $0 \\le y \\le ${m}$`;
    const scene = modelFigure(k, m);
    return {
      questionLines: [
        '<b>(a)</b> Use the substitution $u = y^{2} + 1$, or otherwise, to find the exact value of',
        `$${integral}.$`,
        `Student engineers are using a 3D printer to make a model. Relative to a suitable set of axes, the cross-section of the model is symmetrical about the $y$-axis and is represented in the first quadrant by the curve $x = ${x}$, $0 \\le y \\le ${m}.$`,
        renderScene(scene),
        '<b>(b)</b> State the area of the cross-section.',
        '<b>(c)</b> Express $\\frac{y^{2}}{y^{2} + 1}$ in the form $a + \\frac{b}{y^{2} + 1}$ where $a$ and $b$ are real numbers.',
        `The curve ${curve} will be rotated through $2\\pi$ radians about the $y$-axis to make the model.`,
        '<b>(d)</b> Find the volume of the model.',
      ],
      solutionSteps: [
        '<strong>(a)</strong> $u = y^{2} + 1$, so $\\frac{du}{dy} = 2y$ and $du = 2y\\,dy$',
        `<strong>(a)</strong> When $y = 0$, $u = 1$; when $y = ${m}$, $u = ${top}$: $\\int_{1}^{${top}} \\ldots \\,du$`,
        `<strong>(a)</strong> $${integral} = ${inU}$`,
        `<strong>(a)</strong> $= ${halfText}\\left[2\\sqrt{u}\\right]_{1}^{${top}} = ${a}$`,
        `<strong>(b)</strong> The cross-section is symmetrical about the $y$-axis, so its area is twice (a): $${area}$ square units`,
        `<strong>(c)</strong> $\\frac{y^{2}}{y^{2} + 1} = \\frac{y^{2} + 1 - 1}{y^{2} + 1} = ${split}$`,
        `<strong>(d)</strong> $V = \\pi\\int_{0}^{${m}} x^{2}\\,dy$`,
        `<strong>(d)</strong> $x^{2} = \\frac{${k * k}y^{2}}{y^{2} + 1}$, so by (c) $V = ${inVolume}$`,
        `<strong>(d)</strong> $\\int\\left(${split}\\right)dy = y - \\tan^{-1} y$`,
        `<strong>(d)</strong> $V = ${k * k}\\pi\\left[y - \\tan^{-1} y\\right]_{0}^{${m}} = ${volume}$ cubic units`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      finalAnswer: [
        `(a) $${a}$`,
        `(b) $${area}$ (square units)`,
        `(c) $${split}$`,
        `(d) $${volume}$ (cubic units)`,
      ].join('<br>'),
      figure: { scene, claims: [] },
      ladder: {
        moves: [
          'With $u = y^{2} + 1$, what are $du$ and the new limits?',
          '(a) Differentiate the substitution.',
          '(a) Change the limits to values of $u$, and start rewriting the integral.',
          '(a) Replace everything so that only $u$ and $du$ remain.',
          '(a) Integrate and evaluate between the new limits.',
          '(b) The cross-section is symmetrical about the $y$-axis. How does its area compare with (a)?',
          '(c) Split the fraction: add and subtract 1 in the numerator.',
          '(d) Write the volume integral about the $y$-axis, with its limits.',
          '(d) Square $x$ and use (c) to get it into a form you can integrate.',
          '(d) Integrate the fraction as an inverse tangent.',
          '(d) Complete the integration and evaluate.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        shows: [
          null,
          '$\\frac{du}{dy} = 2y$ or $du = 2y\\,dy$',
          `$\\int_{1}^{${top}}\\ldots du$`,
          `$${inU}$`,
          null,
          null,
          `$${split}$`,
          `$\\pi\\int_{0}^{${m}} x^{2}\\,dy$`,
          `$${inVolume}$`,
          '$\\ldots - \\tan^{-1}y$',
          null,
        ],
        watch: { at: 7, text: 'Rotating about the $y$-axis means integrating $\\pi x^2$ with respect to $y$.' },
      },
    };
  },
};

// ── 2022 P2 Q2 ─────────────────────────────────────────────────────────────
// ∫₀ᵘ ma/(ax + 1) dx = m ln(au + 1): the top a whole multiple of the bottom's
// derivative, so the answer is a whole number times one log.

interface P2Q2of2022 { a: number; m: number; u: number }

/** au + 1 values that are a power (4, 8, 9, …): m ln 9 would simplify to 2m ln 3, a step the paper does not have. */
const POWERS = [4, 8, 9, 16, 25, 27];

const q2022p2q2: CardRoutine<P2Q2of2022> = {
  draw: () => until(
    () => ({ a: int(2, 5), m: int(2, 4), u: int(1, 6) }),
    ({ a, u }) => !POWERS.includes(a * u + 1),
  ),

  build: ({ a, m, u }): Built => {
    const bottom = `${a}x + 1`, top = a * u + 1;
    const integrand = `\\frac{${m * a}}{${bottom}}`;
    const log = `\\ln(${bottom})`;
    const answer = `${m}\\ln ${top}`;
    return {
      questionLines: [`Find the exact value of $\\int_{0}^{${u}}${integrand}\\,dx.$`],
      solutionSteps: [
        `$\\int ${integrand}\\,dx = ${m}${log}$`,
        `$\\left[${m}${log}\\right]_{0}^{${u}} = ${m}\\ln ${top} - ${m}\\ln 1 = ${answer}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          'The top is a multiple of the derivative of the bottom. What kind of integral is that?',
          `Integrate as a multiple of a log of $${bottom}$.`,
          'Get the coefficient right, put in the limits and simplify.',
        ],
        marks: [0, 1, 1],
        shows: [null, `$${log}$`, null],
        watch: { at: 2, text: 'Simplify fully: $\\ln 1$ is 0, so do not leave it in.' },
      },
    };
  },
};

// ── 2022 P2 Q4 ─────────────────────────────────────────────────────────────
// ∫(x + p)(ax + b)^{1/2} dx by parts, u = x + p:
// (2/3a)(x + p)(ax + b)^{3/2} - (4/15a²)(ax + b)^{5/2} + c.

interface P2Q4of2022 { a: number; p: number; b: number }

const q2022p2q4: CardRoutine<P2Q4of2022> = {
  draw: () => until(
    () => ({ a: int(2, 4), p: int(1, 6), b: int(1, 9) }),
    // ax + b in lowest terms, as 2x + 7, and never a multiple of x + p.
    ({ a, p, b }) => gcd(a, b) === 1 && b !== a * p,
  ),

  build: ({ a, p, b }): Built => {
    const lin = `${a}x + ${b}`, xp = `x + ${p}`;
    const half = '\\frac{1}{2}', three = '\\frac{3}{2}', five = '\\frac{5}{2}';
    const v = q(2, 3 * a), w = q(4, 15 * a * a);
    const integrand = `(${xp})(${lin})^{${half}}`;
    const vText = sum([{ coef: v, body: `(${lin})^{${three}}` }]);
    const uv = sum([{ coef: v, body: `(${xp})(${lin})^{${three}}` }]);
    const left = `\\int ${vText}\\,dx`;
    const answer = `${sum([{ coef: v, body: `(${xp})(${lin})^{${three}}` }, { coef: neg(w), body: `(${lin})^{${five}}` }])} + c`;
    return {
      questionLines: [`Use integration by parts to find $\\int${integrand}\\,dx.$`],
      solutionSteps: [
        `With $u = ${xp}$ and $\\frac{dv}{dx} = (${lin})^{${half}}$, $v = ${vText}$: $${uv} - \\ldots$`,
        `$\\frac{du}{dx} = 1$: $\\ldots - ${left}$`,
        `$\\int${integrand}\\,dx = ${answer}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          'Which factor becomes simpler when you differentiate it, and which can you integrate?',
          `Integrate the bracket to the power $${half}$, and write the "$uv$" part.`,
          'Write the integral that is left.',
          'Integrate it, with the chain rule in reverse, and add the constant.',
        ],
        marks: [0, 1, 1, 1],
        shows: [null, `$${uv} - \\ldots$`, `$\\ldots ${left}$`, null],
        watch: { at: 1, text: `Differentiate $${xp}$ and integrate the bracket. The other way round gets stuck.` },
      },
    };
  },
};

export const ROUTINES = {
  '2022 P1 Q7': q2022p1q7,
  '2022 P2 Q2': q2022p2q2,
  '2022 P2 Q4': q2022p2q4,
};
