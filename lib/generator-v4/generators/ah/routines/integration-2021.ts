/**
 * Advanced Higher, Integration: how each 2021 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/integration.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int, nonZero, pick, until } from '../../core/draw';
import { num, piTimes, sum } from '../../core/maths/format';
import { gcd } from '../../core/maths/integer';
import { q } from '../../core/maths/rational';

// ── 2021 P1 Q3 ─────────────────────────────────────────────────────────────
// ∫ a cos θ sin^n θ dθ with u = sin θ: ∫ a u^n du = a/(n + 1) sin^{n+1} θ + c

interface P1Q3of2021 { a: number; n: number }

const q2021p1q3: CardRoutine<P1Q3of2021> = {
  draw: () => ({ a: int(1, 5), n: int(2, 7) }),

  build: ({ a, n }): Built => {
    const lead = a === 1 ? '' : String(a);
    const integral = `\\int ${lead}\\cos\\theta\\sin^{${n}}\\theta\\,d\\theta`;
    const inU = `\\int ${lead}u^{${n}}\\,du`;
    const coef = q(a, n + 1);
    const inUDone = sum([{ coef, body: `u^{${n + 1}}` }]);
    const answer = `${sum([{ coef, body: `\\sin^{${n + 1}}\\theta` }])} + c`;
    return {
      questionLines: [
        `Use the substitution $u = \\sin\\theta$ to find $${integral}.$`,
        'Write your answer in terms of $\\theta.$',
      ],
      solutionSteps: [
        `$\\frac{du}{d\\theta} = \\cos\\theta$, so $du = \\cos\\theta\\,d\\theta$ and $${integral} = ${inU}$`,
        `$${inU} = ${inUDone} + c = ${answer}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          'With $u = \\sin\\theta$, what does $\\cos\\theta\\,d\\theta$ become?',
          'Rewrite the integral in terms of $u$.',
          'Integrate, substitute back for $u$, and add the constant.',
        ],
        marks: [0, 1, 1],
        shows: [null, `$${inU}$`, null],
      },
    };
  },
};

// ── 2021 P1 Q5 ─────────────────────────────────────────────────────────────
// y = c√(x + s) from x = a to x = b about the x-axis:
// V = π∫ c²(x + s) dx = c²((b² - a²)/2 + s(b - a))π. The paper's is s = 0.
// s from 0 to 3 on the owner's yes (variation-depth sheet, card 3, 2026-10-05):
// the integrand c²(x + s) changes with the curve, not only its multiple.

interface P1Q5of2021 { c: number; s: number; a: number; b: number }

/**
 * Every curve and pair of limits the card sets, listed rather than drawn
 * until one fits: the volume a whole multiple of π, as the paper's 32π, and
 * no product bigger than the paper's biggest, 2 × 25 = 50 at the top limit
 * (the owner on 2023 P1: "biggest should be no larger than paper"): the
 * antiderivative at the top, c²(b²/2 + sb), at most 50.
 */
const Q5_SOLIDS: readonly P1Q5of2021[] = (() => {
  const out: P1Q5of2021[] = [];
  for (let c = 1; c <= 4; c++) {
    for (let s = 0; s <= 3; s++) {
      for (let a = 1; a <= 5; a++) {
        for (let b = a + 1; b <= 7; b++) {
          const twice = c * c * (b * b - a * a + 2 * s * (b - a));
          if (twice % 2 === 0 && c * c * (b * b + 2 * s * b) <= 100) out.push({ c, s, a, b });
        }
      }
    }
  }
  return out;
})();

const q2021p1q5: CardRoutine<P1Q5of2021> = {
  draw: () => pick(Q5_SOLIDS),

  build: ({ c, s, a, b }): Built => {
    const root = s === 0 ? '\\sqrt{x}' : `\\sqrt{x + ${s}}`;
    const y = c === 1 ? root : `${c}${root}`;
    const squared = sum([{ coef: c * c, body: 'x' }, { coef: c * c * s, body: '' }]);
    const half = q(c * c, 2);
    const antiderivative = sum([{ coef: half, body: 'x^{2}' }, { coef: c * c * s, body: 'x' }]);
    const at = (x: number) => num(q(c * c * x * x + 2 * c * c * s * x, 2));
    const volume = piTimes((c * c * (b * b - a * a + 2 * s * (b - a))) / 2);
    // Two terms under the integral sign take a bracket: ∫ (4x + 4) dx.
    const integrand = s === 0 ? squared : `(${squared})`;
    const setUp = `V = \\pi\\int_{${a}}^{${b}} y^{2}\\,dx = \\pi\\int_{${a}}^{${b}} ${integrand}\\,dx`;
    return {
      questionLines: [
        `A solid is formed by rotating the curve with equation $y = ${y}$ between $x = ${a}$ and $x = ${b}$ through $2\\pi$ radians about the $x$-axis.`,
        'Calculate the exact value of the volume of this solid.',
      ],
      solutionSteps: [
        `$${setUp}$`,
        `$V = \\pi\\left[${antiderivative}\\right]_{${a}}^{${b}} = \\pi\\left(${at(b)} - ${at(a)}\\right) = ${volume}$ cubic units`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$V = ${volume}$ cubic units`,
      ladder: {
        moves: [
          'What is the formula for a volume of revolution about the $x$-axis?',
          `Write the volume integral, with limits ${a} and ${b}.`,
          'Square $y$, integrate and evaluate, keeping it exact.',
        ],
        marks: [0, 1, 1],
        shows: [null, `$\\pi\\int_{${a}}^{${b}} y^{2}\\,dx$`, null],
      },
    };
  },
};

// ── 2021 P2 Q3 ─────────────────────────────────────────────────────────────
// ∫ (ax + b) cos kx dx by parts: (1/k)(ax + b) sin kx - ∫ (a/k) sin kx dx
//   = (1/k)(ax + b) sin kx + (a/k²) cos kx + c

interface P2Q3of2021 { a: number; b: number; k: number }

const q2021p2q3: CardRoutine<P2Q3of2021> = {
  draw: () => until(
    () => ({ a: int(1, 5), b: nonZero(-9, 9), k: int(2, 6) }),
    // The bracket shares no factor, as 2x + 3, so it is not taken out first.
    ({ a, b }) => gcd(a, Math.abs(b)) === 1,
  ),

  build: ({ a, b, k }): Built => {
    const bracket = `(${sum([{ coef: a, body: 'x' }, { coef: b, body: '' }])})`;
    const uv = `${num(q(1, k))}${bracket}\\sin ${k}x`;
    const left = `\\int \\frac{${a}}{${k}}\\sin ${k}x\\,dx`;
    // A coefficient of 1 is left unwritten, "+ cos 2x" (the owner, full read 2026-10-05).
    const cosCoef = num(q(a, k * k));
    const answer = `${uv} + ${cosCoef === '1' ? '' : cosCoef}\\cos ${k}x + c`;
    return {
      questionLines: [`Use integration by parts to find $\\int ${bracket}\\cos ${k}x \\,dx.$`],
      solutionSteps: [
        `With $u = ${bracket.slice(1, -1)}$ and $\\frac{dv}{dx} = \\cos ${k}x$: $\\int ${bracket}\\cos ${k}x\\,dx = ${uv} - \\ldots$`,
        `$= ${uv} - ${left}$`,
        `$= ${answer}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          'Which factor becomes simpler when you differentiate it?',
          `Integrate $\\cos ${k}x$ and write the "$uv$" part.`,
          'Write the integral that is left.',
          'Integrate it and add the constant.',
        ],
        marks: [0, 1, 1, 1],
        shows: [null, `$${uv} - \\ldots$`, `$\\ldots ${left}$`, null],
        watch: { at: 3, text: `Integrating $\\sin ${k}x$ gives a factor of $\\frac{1}{${k}}$. Check the coefficient of your last term.` },
      },
    };
  },
};

export const ROUTINES = {
  '2021 P1 Q3': q2021p1q3,
  '2021 P1 Q5': q2021p1q5,
  '2021 P2 Q3': q2021p2q3,
};
