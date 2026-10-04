/**
 * Advanced Higher, Integration: how each 2018 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/integration.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int } from '../draw';
import { num, power } from '../maths/format';
import { q } from '../maths/rational';

// ── 2018 Q8 ────────────────────────────────────────────────────────────────
// ∫ from π/6 to π/2 of A sin^n θ cos θ dθ with u = sin θ: A∫ from 1/2 to 1 of
// u^n du = A(1 - (1/2)^{n+1})/(n + 1).

interface Q8of2018 { A: number; n: number }

const q2018q8: CardRoutine<Q8of2018> = {
  draw: () => ({ A: int(1, 6), n: int(2, 6) }),

  build: ({ A, n }): Built => {
    const front = A === 1 ? '' : String(A);
    const top = 2 ** (n + 1);
    const value = num(q(A * (top - 1), (n + 1) * top));
    // The upper limit as ^1: the prose rule reads ^{1} after a lower limit with braces inside it as a power.
    const inU = `${front}\\int_{\\frac{1}{2}}^1 u^{${n}}\\,du`;
    const limits = 'When $\\theta = \\frac{\\pi}{6}$, $u = \\frac{1}{2}$; when $\\theta = \\frac{\\pi}{2}$, $u = 1$';
    return {
      questionLines: [
        'Using the substitution $u = \\sin \\theta$, or otherwise, evaluate',
        `$\\int_{\\frac{\\pi}{6}}^{\\frac{\\pi}{2}} ${front}\\sin^{${n}} \\theta \\cos \\theta \\, d\\theta.$`,
      ],
      solutionSteps: [
        '$\\frac{du}{d\\theta} = \\cos\\theta$',
        limits,
        `$${inU}$`,
        `$${num(q(A, n + 1))}\\left[u^{${n + 1}}\\right]_{\\frac{1}{2}}^1 = ${num(q(A, n + 1))}\\left(1 - \\frac{1}{${top}}\\right) = ${value}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `$${value}$`,
      ladder: {
        moves: [
          'With $u = \\sin\\theta$, what are $du$ and the new limits?',
          'Differentiate the substitution.',
          'Change the limits to values of $u$.',
          'Rewrite the integral in terms of $u$.',
          'Integrate and evaluate between the new limits.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, '$\\frac{du}{d\\theta} = \\cos\\theta$', null, `$${inU}$`, null],
        watch: { at: 3, text: 'Replace every $\\theta$. An integral with both $u$ and $\\theta$ in it cannot be done.' },
      },
    };
  },
};

// ── 2018 Q15 ───────────────────────────────────────────────────────────────
// (a) ∫ x sin kx dx = -(x/k) cos kx + (1/k²) sin kx + c; (b)
// dy/dx - (m/x)y = x^{m+1} sin kx has integrating factor 1/x^m, so y/x^m is
// (a)'s integral; y = 0 at x = π gives c = (π/k)(-1)^k.

interface Q15of2018 { k: number; m: number }

const q2018q15: CardRoutine<Q15of2018> = {
  draw: () => ({ k: int(2, 6), m: int(1, 3) }),

  build: ({ k, m }): Built => {
    const xm = power('x', m);
    const over = `\\frac{1}{${xm}}`;
    const coef = `\\frac{${m}}{x}`;
    const rhs = `x^{${m + 1}} \\sin ${k}x`;
    const uv = `-\\frac{x}{${k}}\\cos ${k}x`;
    const left = `\\int -\\frac{1}{${k}}\\cos ${k}x\\,dx`;
    const partA = `${uv} + \\frac{1}{${k * k}}\\sin ${k}x + c`;
    const even = k % 2 === 0;
    // cos kπ = (-1)^k, so y = 0 at x = π gives c = (π/k)(-1)^k.
    const cText = even ? `\\frac{\\pi}{${k}}` : `-\\frac{\\pi}{${k}}`;
    const lastTerm = `${even ? '+' : '-'} \\frac{\\pi ${xm}}{${k}}`;
    const answer = `y = -\\frac{x^{${m + 1}}}{${k}}\\cos ${k}x + \\frac{${xm}}{${k * k}}\\sin ${k}x ${lastTerm}`;
    const factorIntegral = `e^{\\int -${coef}dx}`;
    const product = `\\frac{d}{dx}\\left(${over}y\\right) = ${over}(${rhs})`;
    const integralEq = `${over}y = \\int x\\sin ${k}x\\,dx`;
    const integrated = `${over}y = ${partA}`;
    const atPi = `0 = -\\frac{\\pi}{${k}}\\cos ${k}\\pi + \\frac{1}{${k * k}}\\sin ${k}\\pi + c = ${even ? '-' : ''}\\frac{\\pi}{${k}} + c`;
    return {
      questionLines: [
        `<b>(a)</b> Use integration by parts to find $\\int x \\sin ${k}x \\, dx.$`,
        '<b>(b)</b> Hence find the particular solution of',
        `$\\frac{dy}{dx} - ${coef}y = ${rhs}$, $x \\neq 0$`,
        'given that $x = \\pi$ when $y = 0.$',
        'Express your answer in the form $y = f(x).$',
      ],
      solutionSteps: [
        `<strong>(a)</strong> With $u = x$ and $\\frac{dv}{dx} = \\sin ${k}x$: $\\int x\\sin ${k}x\\,dx = ${uv} - \\ldots$`,
        `<strong>(a)</strong> $= ${uv} - ${left}$`,
        `<strong>(a)</strong> $= ${partA}$`,
        `<strong>(b)</strong> The integrating factor is $${factorIntegral}$`,
        `<strong>(b)</strong> $${factorIntegral} = e^{-${m === 1 ? '' : m}\\ln x} = ${over}$`,
        `<strong>(b)</strong> $${product}$`,
        `<strong>(b)</strong> $${integralEq}$`,
        `<strong>(b)</strong> By (a), $${integrated}$`,
        `<strong>(b)</strong> $x = \\pi$, $y = 0$: $${atPi}$, so $c = ${cText}$`,
        `<strong>(b)</strong> $${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      finalAnswer: [`(a) $${partA}$`, `(b) $${answer}$`].join('<br>'),
      ladder: {
        moves: [
          '(a) prepares an integral you will meet in (b). Where does it appear?',
          `(a) Integrate $\\sin ${k}x$ and write the "$uv$" part.`,
          '(a) Write the integral that is left.',
          '(a) Integrate it, and add the constant.',
          '(b) Write the integrating factor as $e$ to the integral of the coefficient of $y$.',
          '(b) Simplify the integrating factor.',
          '(b) Multiply through, so the left side is the derivative of one product.',
          '(b) Write the equation as an integral equation.',
          '(b) Use (a) to integrate.',
          '(b) Substitute $x = \\pi$, $y = 0$ to find the constant.',
          '(b) Make $y$ the subject.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        shows: [
          null,
          `$${uv} - \\ldots$`,
          `$\\ldots${left}$`,
          `$= ${partA}$`,
          `$${factorIntegral}$`,
          `$${over}$`,
          `$${product}$`,
          `$${integralEq}$`,
          `$${integrated}$`,
          `$c = ${cText}$`,
          null,
        ],
        watch: { at: 4, text: `The coefficient of $y$ is $-${coef}$. Keep its minus sign in the integrating factor.` },
      },
    };
  },
};

export const ROUTINES = {
  '2018 Q8': q2018q8,
  '2018 Q15': q2018q15,
};
