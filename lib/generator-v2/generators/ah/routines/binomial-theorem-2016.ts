/**
 * Advanced Higher, Binomial Theorem: how each 2016 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/binomial-theorem.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { pick } from '../draw';
import { binom, coprime } from '../maths/integer';

// ── 2016 Q3 ────────────────────────────────────────────────────────────────
// (a/x - bx)ⁿ: the general term C(n, r) aⁿ⁻ʳ(-b)ʳ x^{2r - n}, simplified,
// then the term in x^k at r = (n + k)/2.

interface Q3of2016 { n: number; a: number; b: number; r: number }

/**
 * n from 8 to 13 (the paper's 13), a from 2 to 5 and b 2 or 3 (the paper's
 * 3 and 2), sharing no factor, as 3 and 2, so the signs and the numbers both
 * have something to simplify (b = 1 would leave (-1)^r); the power asked for
 * positive, x^2 or more, reached by an r short of n (the last term has no
 * power of a), as the paper's x^9 at r = 11; the term at most 10^7 in size,
 * a calculator's whole number, as -1437696.
 */
const SETS2016: readonly Q3of2016[] = (() => {
  const out: Q3of2016[] = [];
  for (let n = 8; n <= 13; n++) {
    for (let a = 2; a <= 5; a++) {
      for (let b = 2; b <= 3; b++) {
        if (!coprime(a, b)) continue;
        for (let r = 1; r < n; r++) {
          if (2 * r - n >= 2 && binom(n, r) * a ** (n - r) * b ** r <= 1e7) out.push({ n, a, b, r });
        }
      }
    }
  }
  return out;
})();

const q2016q3: CardRoutine<Q3of2016> = {
  draw: () => pick(SETS2016),

  build: ({ n, a, b, r }): Built => {
    const k = 2 * r - n;
    const bx = `${b}x`;
    const expression = `\\left(\\frac{${a}}{x} - ${bx}\\right)^{${n}}`;
    const C = `\\binom{${n}}{r}`;
    const written = `${C}\\left(\\frac{${a}}{x}\\right)^{${n}-r}(-${bx})^{r}`;
    const numbers = `(${a})^{${n}-r}(-${b})^{r}`;
    const xPart = `x^{2r-${n}}`;
    const general = `${C}${numbers}${xPart}`;
    const value = binom(n, r) * a ** (n - r) * (-b) ** r;
    const power = n - r === 1 ? `${a}` : `${a}^{${n - r}}`;
    const term = `${value}x^{${k}}`;
    return {
      questionLines: [
        `Write down and simplify the general term in the binomial expansion of $${expression}.$`,
        `Hence, or otherwise, find the term in $x^{${k}}.$`,
      ],
      solutionSteps: [
        `The general term is $${written}$`,
        `The numbers and signs: $${numbers}$; the powers of $x$: $x^{-(${n}-r)}x^{r} = ${xPart}$`,
        `$${general}$`,
        `$2r - ${n} = ${k} \\Rightarrow r = ${r}$`,
        `$\\binom{${n}}{${r}}${power}(-${b})^{${r}}x^{${k}} = ${term}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: [`General term: $${general}$`, `Term in $x^{${k}}$: $${term}$`].join('<br>'),
      ladder: {
        moves: [
          'The general term of $(a + b)^n$ has three parts. What are they, and what powers do $a$ and $b$ carry?',
          `Write the general term, with $${C}$ and both powers.`,
          'Collect the powers of $x$ into a single power, or the numbers and signs.',
          'Write the fully simplified general term.',
          `Set the power of $x$ equal to ${k} and solve for $r$.`,
          'Put that $r$ back to evaluate the term.',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [null, `$${written}$`, `$${numbers}$ or $${xPart}$`, `$${general}$`, `$2r - ${n} = ${k} \\Rightarrow r = ${r}$`, null],
        watch: { at: 2, text: `$\\frac{${a}}{x}$ is $${a}x^{-1}$. Keep track of the negative power when you collect powers of $x$.` },
      },
    };
  },
};

export const ROUTINES = {
  '2016 Q3': q2016q3,
};
