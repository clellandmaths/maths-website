/**
 * Advanced Higher, Partial Fractions: how each 2016 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/partial-fractions.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int, until } from '../../core/draw';
import { poly } from '../../core/maths/format';
import { gcd } from '../../core/maths/integer';
import { gcdB } from '../../core/maths/rational';

// ── 2016 Q13 ───────────────────────────────────────────────────────────────
// A/(x + p) + B/(q - x), combined: ((B - A)x + Aq + Bp)/((x + p)(q - x)),
// then integrated from L to L + 1 as [A ln|x + p| - B ln|q - x|], one log:
// ln(((U + p)/(L + p))^A ((q - L)/(q - U))^B), as the paper's ln(486/49).

interface Q13of2016 { A: number; B: number; p: number; q: number; L: number }

/** The fraction inside the log, in lowest terms. */
function fraction2016({ A, B, p, q, L }: Q13of2016): [bigint, bigint] {
  const U = L + 1;
  const top = BigInt(U + p) ** BigInt(A) * BigInt(q - L) ** BigInt(B);
  const bottom = BigInt(L + p) ** BigInt(A) * BigInt(q - U) ** BigInt(B);
  const g = gcdB(top, bottom);
  return [top / g, bottom / g];
}

const q2016q13: CardRoutine<Q13of2016> = {
  draw: () => until(
    () => {
      const q = int(3, 9);
      return { A: int(1, 4), B: int(2, 5), p: int(1, 6), q, L: int(0, q - 2) };
    },
    (n) => {
      const [top, bottom] = fraction2016(n);
      // B more than A, so the top's x term is positive, as the paper's 3x;
      // the top sharing no factor, as 3x + 32; the fraction not whole and
      // within 10 000 each way, as 486/49.
      return n.B > n.A && gcd(n.B - n.A, n.A * n.q + n.B * n.p) === 1 && bottom !== 1n && top <= 10000n && bottom <= 10000n;
    },
    1000,
  ),

  build: (n): Built => {
    const { A, B, p, q, L } = n;
    const U = L + 1;
    const top = poly([B - A, A * q + B * p]);
    const plus = `x + ${p}`, minus = `${q} - x`;
    const bottom = `(${plus})(${minus})`;
    const whole = `\\frac{${top}}{${bottom}}`;
    const [P, Q] = fraction2016(n);
    const ln = (k: number, inside: string) => `${k === 1 ? '' : k}\\ln|${inside}|`;
    const template = `${whole} = \\frac{A}{${plus}} + \\frac{B}{${minus}}`;
    const identity = `${top} = A(${minus}) + B(${plus})`;
    const split = `\\int_{${L}}^{${U}}\\left(\\frac{${A}}{(${plus})} + \\frac{${B}}{(${minus})}\\right)dx`;
    const limits = `(${ln(A, `${U} + ${p}`)} - ${ln(B, `${q} - ${U}`)}) - (${ln(A, `${L} + ${p}`)} - ${ln(B, `${q} - ${L}`)})`;
    const answer = `\\ln\\left(\\frac{${P}}{${Q}}\\right)`;
    return {
      questionLines: [
        `Express $${whole}$ in partial fractions and hence evaluate`,
        `$\\int_{${L}}^{${U}}${whole} \\,dx.$`,
        'Give your answer in the form $\\ln\\left(\\frac{p}{q}\\right).$',
      ],
      solutionSteps: [
        `$${template}$`,
        `$${identity}$`,
        `At $x = ${-p}$: $${(B - A) * -p + A * q + B * p} = ${q + p}A$, so $A = ${A}$`,
        `At $x = ${q}$: $${(B - A) * q + A * q + B * p} = ${q + p}B$, so $B = ${B}$`,
        `$${split}$`,
        `$\\left[${ln(A, plus)} \\ldots\\right.$`,
        `$\\left.\\ldots - ${ln(B, minus)}\\right]_{${L}}^{${U}}$`,
        `$${limits}$`,
        `$= ${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1, 1, 1],
      finalAnswer: `Partial fractions: $\\frac{${A}}{${plus}} + \\frac{${B}}{${minus}}$<br>Integral evaluation: $${answer}$`,
      ladder: {
        moves: [
          'Two different linear factors underneath. What does each partial fraction look like?',
          'Write the template, with a constant over each factor.',
          'Multiply through by the denominator.',
          'Choose a value of $x$ that makes one bracket vanish, and find one constant.',
          'Find the other constant.',
          'Write the integral as two simpler fractions.',
          'Integrate the first as a log.',
          `Integrate the second. The $-x$ in $${minus}$ brings a minus sign.`,
          'Substitute the limits.',
          'Use the log laws to write the result as one logarithm.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        shows: [
          null, `$${template}$`, `$${identity}$`, `$A = ${A}$`, `$B = ${B}$`, `$${split}$`,
          `$\\left[${ln(A, plus)}\\ldots\\right.$`, `$\\left.\\ldots - ${ln(B, minus)}\\right]_{${L}}^{${U}}$`, `$${limits}$`, null,
        ],
        watch: { at: 8, text: 'Check the sign of each log term before you combine them. A slip there changes the fraction.' },
      },
    };
  },
};

export const ROUTINES = {
  '2016 Q13': q2016q13,
};
