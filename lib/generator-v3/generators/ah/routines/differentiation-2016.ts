/**
 * Advanced Higher, Differentiation: how each 2016 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/differentiation.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int, until } from '../../core/draw';
import { num, sum } from '../../core/maths/format';
import { coprime } from '../../core/maths/integer';
import { q } from '../../core/maths/rational';

const DYDX = '\\frac{dy}{dx}';

/** A number in front, 1 not written: `3x`, `x`. */
const lead = (c: number, body: string) => `${c === 1 ? '' : c}${body}`;

// ── 2016 Q1(a) ─────────────────────────────────────────────────────────────
// y = ax tan⁻¹ kx: by the product rule, a tan⁻¹ kx + akx/(1 + k²x²).

interface Q1aOf2016 { a: number; k: number }

const q2016q1a: CardRoutine<Q1aOf2016> = {
  // k from 2 to 9 (the paper's 2), never 1, so the chain rule always brings a
  // number out; a number in front, a from 1 (the paper) to 4.
  draw: () => ({ a: int(1, 4), k: int(2, 9) }),

  build: ({ a, k }): Built => {
    const inv = `\\tan^{-1} ${k}x`;
    const ax = lead(a, 'x');
    const y = `${ax}${inv}`;
    const begun = `(\\ldots)${inv} + ${ax}(\\ldots)`;
    const first = `${a === 1 ? '1 \\cdot ' : ''}${lead(a, inv)}`;
    const second = `${ax} \\cdot \\frac{1}{1 + (${k}x)^{2}} \\cdot ${k}`;
    const answer = `${lead(a, inv)} + \\frac{${a * k}x}{1 + ${k * k}x^{2}}`;
    return {
      questionLines: [`Differentiate $y = ${y}.$`],
      solutionSteps: [
        `By the product rule: $${DYDX} = ${begun}$`,
        `$${DYDX} = ${first} + ${second}$`,
        `$${DYDX} = ${answer}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `$${DYDX} = ${answer}$`,
      ladder: {
        moves: [
          '$y$ is two factors multiplied together, and one is an inverse tangent. Which rules?',
          'Set up the product rule: each factor\'s derivative times the other.',
          `Differentiate $${inv}$, using the chain rule for the $${k}x$.`,
          'Write out both terms and simplify.',
        ],
        marks: [0, 1, 1, 1],
        shows: [null, `$${begun}$`, `$${first}$ or $${second}$`, null],
        watch: { at: 2, text: `$${inv}$ is the inverse tangent, not $\\frac{1}{\\tan ${k}x}$.` },
      },
    };
  },
};

// ── 2016 Q1(b) ─────────────────────────────────────────────────────────────
// f(x) = (a - bx²)/(c + dx²): by the quotient rule the x³ terms cancel, and
// f'(x) = -2(bc + ad)x/(c + dx²)², as the paper's -10x/(1 + 4x²)².

interface Q1bOf2016 { a: number; b: number; c: number; d: number }

const q2016q1b: CardRoutine<Q1bOf2016> = {
  // The paper's 1 - x² over 1 + 4x²: a from 1 to 4, b 1 or 2, c from 1 to 3,
  // d from 2 to 5, the top and the bottom each sharing no factor, as the
  // paper's (never 2 - 4x²).
  draw: () => until(
    () => ({ a: int(1, 4), b: int(1, 2), c: int(1, 3), d: int(2, 5) }),
    ({ a, b, c, d }) => coprime(a, b) && coprime(c, d),
  ),

  build: ({ a, b, c, d }): Built => {
    const top = sum([{ coef: a, body: '' }, { coef: -b, body: 'x^{2}' }]);
    const bottom = sum([{ coef: c, body: '' }, { coef: d, body: 'x^{2}' }]);
    const dTop = `${-2 * b}x`, dBottom = `${2 * d}x`;
    const square = `(${bottom})^{2}`;
    const begun = `(${dTop})(${bottom}) - \\ldots`;
    const whole = `\\frac{(${dTop})(${bottom}) - (${top}) \\cdot ${dBottom}}{${square}}`;
    const expanded = sum([
      { coef: -2 * b * c, body: 'x' }, { coef: -2 * b * d, body: 'x^{3}' },
      { coef: -2 * a * d, body: 'x' }, { coef: 2 * b * d, body: 'x^{3}' },
    ]);
    const k = 2 * (b * c + a * d);
    const answer = `-\\frac{${k}x}{${square}}`;
    return {
      questionLines: [`Given $f(x) = \\frac{${top}}{${bottom}}$, find $f'(x)$, simplifying your answer.`],
      solutionSteps: [
        `By the quotient rule, with $${square}$ as the denominator: $f'(x) = \\frac{${begun}}{${square}}$`,
        `$f'(x) = ${whole}$`,
        `Multiplying out the numerator, $\\frac{${expanded}}{${square}}$, and the $x^{3}$ terms cancel: $f'(x) = ${answer}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `$f'(x) = ${answer}$`,
      ladder: {
        moves: [
          'The function is one expression divided by another. Which rule does that need?',
          `Set up the quotient rule with $${square}$ as the denominator.`,
          'Complete the numerator.',
          'Multiply out the numerator and collect like terms.',
        ],
        marks: [0, 1, 1, 1],
        shows: [null, `$${begun}$`, `$\\frac{\\ldots(${top}) \\cdot ${dBottom}}{${square}}$`, null],
        watch: { at: 3, text: 'Expand and simplify the numerator carefully. An error after a correct answer loses the last mark.' },
      },
    };
  },
};

// ── 2016 Q1(c) ─────────────────────────────────────────────────────────────
// x = at, y = b - c cos t: dy/dx = (c sin t)/a.

interface Q1cOf2016 { a: number; b: number; c: number }

const q2016q1c: CardRoutine<Q1cOf2016> = {
  // The paper's x = 6t, y = 1 - cos t: a from 2 to 9, b from 1 to 4, a number
  // in front of the cosine, c from 1 (the paper) to 3, less than a, so the
  // answer is a fraction of sin t, as the paper's 1/6.
  draw: () => until(() => ({ a: int(2, 9), b: int(1, 4), c: int(1, 3) }), ({ a, c }) => c < a),

  build: ({ a, b, c }): Built => {
    const dydt = lead(c, '\\sin t');
    const answer = `${num(q(c, a))}\\sin t`;
    return {
      questionLines: [
        `A curve is given by the parametric equations $x = ${a}t$ and $y = ${b} - ${lead(c, '\\cos t')}.$`,
        `Find $${DYDX}$ in terms of $t.$`,
      ],
      solutionSteps: [
        `$\\frac{dx}{dt} = ${a}$ and $\\frac{dy}{dt} = ${dydt}$`,
        `$${DYDX} = \\frac{dy/dt}{dx/dt} = \\frac{${dydt}}{${a}} = ${answer}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$${DYDX} = ${answer}$`,
      ladder: {
        moves: [
          `For a parametric curve, how do you get $${DYDX}$ from the two derivatives with respect to $t$?`,
          'Differentiate $x$ and $y$ with respect to $t$.',
          'Divide $\\frac{dy}{dt}$ by $\\frac{dx}{dt}$.',
        ],
        marks: [0, 1, 1],
        shows: [null, `$${a}$ and $${dydt}$`, null],
      },
    };
  },
};

// ── 2016 Q11 ───────────────────────────────────────────────────────────────
// A cube's height grows at R cm/s: V = h³, dV/dt = 3h² × R at h = H. Or, on the
// owner's yes (variation-depth sheet, card 18, 2026-10-05), a box on a square base of
// side h whose height is always a times the side: V = ah³, dV/dt = 3ah² × R. The cube
// is a = 1; a from 2 to 4 gives the same steps with a number that reaches the working.

interface Q11of2016 { R: number; H: number; a: number }

const q2016q11: CardRoutine<Q11of2016> = {
  // The paper's 5 cm per second at a height of 3 cm: both whole, R and H from 2 to 9.
  // The box's rate no bigger than the cube's biggest, 3 × 9² × 9 = 2187.
  draw: () => until(
    () => ({ R: int(2, 9), H: int(2, 9), a: int(1, 4) }),
    ({ R, H, a }) => 3 * a * H * H * R <= 2187,
  ),

  build: ({ R, H, a }): Built => {
    const units = '\\ \\text{cm}^{3}\\,\\text{s}^{-1}';
    const rate = 3 * a * H * H * R;
    const chain = '\\frac{dV}{dt} = \\frac{dV}{dh} \\cdot \\frac{dh}{dt}';
    const cube = a === 1;
    const V = cube ? 'h^{3}' : `${a}h^{3}`;
    const dV = `${3 * a}h^{2}`;
    const what = cube ? 'the height' : 'the side of the base';
    return {
      questionLines: cube
        ? [
          `The height of a cube is increasing at the rate of $${R}$ cm s$^{-1}.$`,
          `Find the rate of increase of the volume when the height of the cube is $${H}$ cm.`,
        ]
        : [
          `A box has a square base, and its height is always ${a === 2 ? 'twice' : `${a} times`} the length of a side of the base. The side of the base is increasing at the rate of $${R}$ cm s$^{-1}.$`,
          `Find the rate of increase of the volume when the side of the base is $${H}$ cm.`,
        ],
      solutionSteps: [
        `$\\frac{dh}{dt} = ${R}$${cube ? '' : `, where $h$ is the side of the base`}`,
        `$${chain}$, with $V = ${cube ? 'h^{3}' : `h \\times h \\times ${a}h = ${V}`}$`,
        `$\\frac{dV}{dh} = ${dV}$`,
        `$\\frac{dV}{dt} = ${dV} \\times ${R} = ${3 * a}(${H})^{2} \\times ${R} = ${rate}${units}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `$${rate}${units}$`,
      ladder: {
        moves: [
          `You know how fast ${what} changes and want how fast the volume changes. Which rule links them?`,
          'Write the given rate as $\\frac{dh}{dt}$.',
          'Write the volume in terms of $h$, and the chain rule linking the rates.',
          'Differentiate $V$ with respect to $h$.',
          `Substitute $h = ${H}$ and the rate, and evaluate with units.`,
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, `$\\frac{dh}{dt} = ${R}$`, `$${chain}$, $V = ${V}$`, `$\\frac{dV}{dh} = ${dV}$`, null],
        watch: cube
          ? { at: 2, text: 'All the edges of a cube grow together. Letting only the height change does not give a cube.' }
          : { at: 2, text: 'The height grows with the base: write it in terms of $h$ before you multiply out the volume.' },
      },
    };
  },
};

export const ROUTINES = {
  '2016 Q1(a)': q2016q1a,
  '2016 Q1(b)': q2016q1b,
  '2016 Q1(c)': q2016q1c,
  '2016 Q11': q2016q11,
};
