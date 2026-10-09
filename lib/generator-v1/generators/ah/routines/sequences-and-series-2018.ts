/**
 * Advanced Higher, Sequences and Series: how each 2018 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/sequences-and-series.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { pick } from '../draw';
import { num, sum } from '../maths/format';
import { q } from '../maths/rational';

// ── 2018 Q14 ───────────────────────────────────────────────────────────────
// A geometric sequence, first term a and ratio 1/r: its 7th term a/r⁶ and sum
// to infinity ar/(r - 1). An arithmetic one with the same first term and a
// falling difference -e, its first five summing to 5a - 10e; then S_n = T at
// two whole n, chosen first: n₁ + n₂ = 1 + 2a/e and T = e·n₁n₂/2.

interface Q14of2018 { a: number; r: number; e: number; n1: number; n2: number }

/**
 * Every set with a from 20 to 120 (the paper's 80), r from 2 to 5 (the
 * paper's 3) with r - 1 dividing a so the sum to infinity is whole, e from 2
 * to 24 (the paper's 16), n₁ + n₂ from 7 to 15 (the paper's 11), n₁ at least
 * 2 and the two roots at least 2 apart (the paper's 2 and 9).
 */
const Q14_SETS2018: readonly Q14of2018[] = (() => {
  const out: Q14of2018[] = [];
  for (let a = 20; a <= 120; a++) {
    for (let r = 2; r <= 5; r++) {
      if (a % (r - 1) !== 0) continue;
      for (let e = 2; e <= 24; e++) {
        if ((2 * a) % e !== 0) continue;
        const s = 1 + (2 * a) / e;
        if (s < 7 || s > 15) continue;
        for (let n1 = 2; 2 * n1 + 2 <= s; n1++) {
          const n2 = s - n1;
          if ((e * n1 * n2) % 2 === 0) out.push({ a, r, e, n1, n2 });
        }
      }
    }
  }
  return out;
})();

const q2018q14: CardRoutine<Q14of2018> = {
  draw: () => pick(Q14_SETS2018),

  build: ({ a, r, e, n1, n2 }): Built => {
    const ratio = `\\frac{1}{${r}}`;
    const seventh = num(q(a, r ** 6));
    const infinity = (a * r) / (r - 1);
    const S5 = 5 * a - 10 * e;
    const T = (e * n1 * n2) / 2;
    const nth = sum([{ coef: a + e, body: '' }, { coef: -e, body: 'n' }]);
    const quadratic = `${sum([{ coef: e, body: 'n^{2}' }, { coef: -(2 * a + e), body: 'n' }, { coef: 2 * T, body: '' }])} = 0`;
    const fiveSum = `\\frac{5}{2}(2 \\times ${a} + (5 - 1)d) = ${S5}`;
    const setUp = `\\frac{n}{2}\\left[${2 * a} + (n - 1)(-${e})\\right] = ${T}`;
    return {
      questionLines: [
        `A geometric sequence has first term ${a} and common ratio $${ratio}.$`,
        '<b>(a)</b> For this sequence, calculate:',
        '(i) the $7^{\\text{th}}$ term;',
        '(ii) the sum to infinity of the associated geometric series.',
        'The first term of this geometric sequence is equal to the first term of an arithmetic sequence.',
        `The sum of the first five terms of this arithmetic sequence is ${S5}.`,
        '<b>(b)</b> (i) Find the common difference of this sequence.',
        '(ii) Write down and simplify an expression for the $n^{\\text{th}}$ term.',
        'Let $S_n$ represent the sum of the first $n$ terms of this arithmetic sequence.',
        `<b>(c)</b> Find the values of $n$ for which $S_n = ${T}.$`,
      ],
      solutionSteps: [
        `<strong>(a)(i)</strong> $u_7 = ${a}\\left(${ratio}\\right)^{6}$`,
        `<strong>(a)(i)</strong> $u_7 = ${seventh}$`,
        `<strong>(a)(ii)</strong> $S_\\infty = \\frac{${a}}{1 - ${ratio}}$`,
        `<strong>(a)(ii)</strong> $S_\\infty = ${infinity}$`,
        `<strong>(b)(i)</strong> $${fiveSum}$`,
        `<strong>(b)(i)</strong> $${5 * a} + 10d = ${S5}$, so $d = -${e}$`,
        `<strong>(b)(ii)</strong> $u_n = ${a} + (n - 1)(-${e}) = ${nth}$`,
        `<strong>(c)</strong> $${setUp}$`,
        `<strong>(c)</strong> $${quadratic}$`,
        `<strong>(c)</strong> $(n - ${n1})(n - ${n2}) = 0$, so $n = ${n1}$, $n = ${n2}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      finalAnswer: [
        `(a)(i) $${seventh}$`,
        `(a)(ii) $${infinity}$`,
        `(b)(i) $-${e}$`,
        `(b)(ii) $${nth}$`,
        `(c) $n = ${n1}$, $n = ${n2}$`,
      ].join('<br>'),
      ladder: {
        moves: [
          '(a) is geometric and (b) is arithmetic, with the same first term. Which formulas do you need?',
          '(a)(i) Multiply the first term by the right power of the ratio.',
          '(a)(i) Evaluate the 7th term.',
          '(a)(ii) Substitute into the sum to infinity formula.',
          '(a)(ii) Evaluate.',
          `(b)(i) Put the first term and $n = 5$ into the arithmetic sum formula, and set it equal to ${S5}.`,
          '(b)(i) Solve for $d$.',
          '(b)(ii) Write the $n$th term formula and simplify.',
          `(c) Set the arithmetic sum of $n$ terms equal to ${T}.`,
          '(c) Rearrange into a quadratic in $n$.',
          '(c) Solve it. Are both roots possible values of $n$?',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        shows: [
          null,
          `$${a}\\left(${ratio}\\right)^{\\ldots}$`,
          `$${seventh}$`,
          `$\\frac{${a}}{1 - ${ratio}}$`,
          null,
          `$${fiveSum}$`,
          null,
          null,
          `$${setUp}$`,
          `$${quadratic}$`,
          null,
        ],
        watch: { at: 1, text: 'The 7th term has the ratio raised to the power 6, not 7.' },
      },
    };
  },
};

export const ROUTINES = {
  '2018 Q14': q2018q14,
};
