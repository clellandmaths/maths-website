/**
 * Advanced Higher, Maclaurin Series: how each 2016 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/maclaurin-series.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int } from '../../core/draw';
import { num, series, sum } from '../../core/maths/format';
import { q, ZERO } from '../../core/maths/rational';
import { expSeries, mulSeries } from '../../core/maths/series';

// ── 2016 Q6 ────────────────────────────────────────────────────────────────
// sin ax = ax - (a³/6)x³ and e^{bx} = 1 + bx + (b²/2)x² + (b³/6)x³, each
// from its derivatives at 0; then their product to x³:
// ax + abx² + (ab²/2 - a³/6)x³, as the paper's 3x + 12x² + (39/2)x³.

interface Q6of2016 { a: number; b: number }

const q2016q6: CardRoutine<Q6of2016> = {
  // The paper's sin 3x and e^{4x}: a and b from 2 to 6. The x³ term of the
  // product, ab²/2 - a³/6, is never 0 (3b² = a² has no whole solution).
  draw: () => ({ a: int(2, 6), b: int(2, 6) }),

  build: ({ a, b }): Built => {
    const s = `\\sin ${a}x`, e = `e^{${b}x}`;
    const primes = ['', '\'', '\'\'', '\'\'\''];
    const sinBody = [s, `\\cos ${a}x`, s, `\\cos ${a}x`];
    const sinCoef = [1, a, -(a ** 2), -(a ** 3)];
    const sinAt0 = [0, a, 0, -(a ** 3)];
    const sinDerivatives = primes.map((p, i) =>
      `$f${p}(x) = ${sum([{ coef: sinCoef[i], body: sinBody[i] }])}$, $f${p}(0) = ${sinAt0[i]}$`).join('; ');
    const formula = 'f(x) = f(0) + f\'(0)x + \\frac{f\'\'(0)}{2!}x^{2} + \\frac{f\'\'\'(0)}{3!}x^{3} \\ldots';
    const sinTerms = [ZERO, q(a), ZERO, q(-(a ** 3), 6)];
    const sinText = series(sinTerms);
    const sinWorked = `f(x) = ${a}x - \\frac{${a ** 3}}{3!}x^{3} = ${sinText}`;
    const expDerivatives = primes.map((p, i) =>
      `$f${p}(x) = ${sum([{ coef: b ** i, body: e }])}$, $f${p}(0) = ${b ** i}$`).join('; ');
    const expTerms = expSeries(b, 3);
    const expText = series(expTerms);
    const expWorked = `f(x) = 1 + ${b}x + \\frac{${b ** 2}x^{2}}{2} + \\frac{${b ** 3}x^{3}}{6} = ${expText}`;
    const productTerms = mulSeries(sinTerms, expTerms, 3);
    const productText = series(productTerms);
    // The x³ term in its two parts, as the scheme collects them: ab²/2 from
    // ax times (b²/2)x², and -a³/6 from the sine's own x³.
    const multiplied = `\\left(${sinText} \\ldots\\right)\\left(${expText} \\ldots\\right) = ${series([ZERO, q(a), q(a * b)])} + ${num(q(a * b * b, 2))}x^{3} - ${num(q(a ** 3, 6))}x^{3} \\ldots`;
    const product = `${e}${s}`;
    return {
      questionLines: [
        `Find Maclaurin expansions for $${s}$ and $${e}$ up to and including the term in $x^{3}.$`,
        `Hence obtain an expansion for $${product}$ up to and including the term in $x^{3}.$`,
      ],
      solutionSteps: [
        `${sinDerivatives}; $${formula}$`,
        `$${sinWorked}$`,
        expDerivatives,
        `$${expWorked}$`,
        `$${product} = ${multiplied}$`,
        `$= ${productText} \\ldots$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1],
      finalAnswer: [`$${s} = ${sinText} \\ldots$`, `$${e} = ${expText} \\ldots$`, `$${product} = ${productText} \\ldots$`].join('<br>'),
      ladder: {
        moves: [
          'A Maclaurin series needs the function and its derivatives at one particular value of $x$. Which value?',
          `Differentiate $${s}$ three times, and evaluate it and each derivative at $x = 0$.`,
          'Put those values into the Maclaurin formula.',
          `Do the same for $${e}$.`,
          'Put those values into the Maclaurin formula.',
          'Multiply the two series.',
          'Expand, keeping only terms up to $x^3$.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1],
        shows: [null, `${sinDerivatives}; $${formula}$`, `$${sinWorked}$`, expDerivatives, `$${expWorked}$`, `$${product} = ${multiplied}$`, null],
        watch: { at: 6, text: 'Only keep terms up to $x^3$ when you multiply out.' },
      },
    };
  },
};

export const ROUTINES = {
  '2016 Q6': q2016q6,
};
