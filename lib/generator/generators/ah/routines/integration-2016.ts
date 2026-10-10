/**
 * Advanced Higher, Integration: how each 2016 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/integration.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int } from '../../core/draw';
import { num, power, sum } from '../../core/maths/format';
import { type Q, div, neg, q } from '../../core/maths/rational';

// ── 2016 Q9 ────────────────────────────────────────────────────────────────
// ∫ a xⁿ (ln x)² dx by parts twice, N = n + 1:
// (a/N)x^N(ln x)² - (2a/N)∫xⁿ ln x dx, then with K = 2a/N²,
// (a/N)x^N(ln x)² - Kx^N ln x + (K/N)x^N + c.

interface Q9of2016 { a: number; n: number }

/** A coefficient in front of a body, 1 not written: `\frac{1}{8}x^{8}`, `x^{2}`. */
const times = (c: Q, body: string) => sum([{ coef: c, body }]);

const q2016q9: CardRoutine<Q9of2016> = {
  // The paper's x^7: n from 1 to 9; n alone makes 9, so a number in front, a
  // from 1 (the paper) to 4, a bigger number, not a step.
  draw: () => ({ a: int(1, 4), n: int(1, 9) }),

  build: ({ a, n }): Built => {
    const N = n + 1;
    const xn = power('x', n), xN = `x^{${N}}`;
    const integrand = `${a === 1 ? '' : a}${xn}(\\ln x)^{2}`;
    const first = q(a, N), half = q(2 * a, N), K = q(2 * a, N * N), last = div(K, q(N));
    const uv = times(first, `${xN}(\\ln x)^{2}`);
    // A factor of 1 is left out, "- ∫x⁴ × …" (the owner, full read 2026-10-05).
    const left = `\\ldots - ${num(first) === '1' ? '' : num(first)}\\int ${xN} \\times \\frac{d}{dx}\\left((\\ln x)^{2}\\right)dx`;
    const simplified = `${uv} - ${times(half, `\\int ${xn}\\ln x\\,dx`)}`;
    const second = `\\ldots - \\left[${times(K, `${xN}\\ln x`)} - ${times(K, `\\int ${xN}\\left(\\frac{1}{x}\\right)dx`)}\\right]`;
    const done = `\\ldots - \\left[${times(K, `${xN}\\ln x`)} - ${times(last, xN)}\\right]`;
    const answer = `${sum([
      { coef: first, body: `${xN}(\\ln x)^{2}` }, { coef: neg(K), body: `${xN}\\ln x` }, { coef: last, body: xN },
    ])} + c`;
    return {
      questionLines: [`Obtain $\\int ${integrand} \\,dx.$`],
      solutionSteps: [
        `By parts, integrating $${a === 1 ? '' : a}${xn}$ and differentiating $(\\ln x)^{2}$: $${uv} - \\ldots$`,
        `$${left}$`,
        `$\\frac{d}{dx}(\\ln x)^{2} = \\frac{2\\ln x}{x}$, so the integral is $${simplified}$`,
        `By parts again, integrating the power of $x$: $${second}$`,
        `$${done}$`,
        `$= ${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          'You cannot easily integrate $(\\ln x)^2$, but you can differentiate it. Which factor should you integrate?',
          `Integrate $${a === 1 ? '' : a}${xn}$ and write the "$uv$" part.`,
          'Write the integral that is left.',
          'Differentiate $(\\ln x)^2$ with the chain rule, and simplify the integral.',
          'That integral needs integration by parts again. Start it, integrating the power of $x$.',
          'Complete the second application.',
          'Simplify, and add the constant.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1],
        shows: [null, `$${uv} - \\ldots$`, `$${left}$`, `$${simplified}$`, `$${second}$`, `$${done}$`, null],
        watch: { at: 3, text: 'Differentiating $(\\ln x)^2$ needs the chain rule: it gives $\\frac{2\\ln x}{x}$.' },
      },
    };
  },
};

export const ROUTINES = {
  '2016 Q9': q2016q9,
};
