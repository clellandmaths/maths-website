/**
 * Advanced Higher, Methods of Proof: how each 2018 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/methods-of-proof.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int, pick } from '../../core/draw';
import { num } from '../../core/maths/format';
import { add, q } from '../../core/maths/rational';

// ── 2018 Q9 ────────────────────────────────────────────────────────────────
// Two direct proofs in the paper's steps: (a) a sum of consecutive integers
// written with one letter and collected to a multiple; (b) a number written in
// general form and split as the statement says.

type Sum2018 = 'three' | 'five' | 'threeEven' | 'threeOdd';
type Split2018 = 'oddTwo' | 'fourOdd' | 'oddSquares' | 'threeThree';

interface Q9of2018 { a: Sum2018; b: Split2018 }

/** (a): what is summed, the divisor, the sum written out, and it collected. */
const SUMS2018: Readonly<Record<Sum2018, { what: string; by: number; terms: string; total: string }>> = {
  three: { what: 'three consecutive integers', by: 3, terms: '(n - 1) + n + (n + 1)', total: '3n' },
  five: { what: 'five consecutive integers', by: 5, terms: '(n - 2) + (n - 1) + n + (n + 1) + (n + 2)', total: '5n' },
  threeEven: { what: 'three consecutive even integers', by: 6, terms: '(2n - 2) + 2n + (2n + 2)', total: '6n' },
  threeOdd: { what: 'three consecutive odd integers', by: 3, terms: '(2n - 1) + (2n + 1) + (2n + 3)', total: '6n + 3 = 3(2n + 1)' },
};

/** (b): the statement, the number in general form, and how it splits. */
const SPLITS2018: Readonly<Record<Split2018, { statement: string; number: string; into: string; split: string }>> = {
  oddTwo: { statement: 'any odd integer can be expressed as the sum of two consecutive integers', number: 'an odd integer', into: 'split it into two consecutive integers', split: '2k + 1 = k + (k + 1)' },
  fourOdd: { statement: 'any multiple of 4 can be expressed as the sum of two consecutive odd integers', number: 'a multiple of 4', into: 'split it into two consecutive odd integers', split: '4k = (2k - 1) + (2k + 1)' },
  oddSquares: { statement: 'any odd integer can be expressed as the difference of the squares of two consecutive integers', number: 'an odd integer', into: 'write it as the difference of the squares of two consecutive integers', split: '2k + 1 = (k + 1)^{2} - k^{2}' },
  threeThree: { statement: 'any multiple of 3 can be expressed as the sum of three consecutive integers', number: 'a multiple of 3', into: 'split it into three consecutive integers', split: '3k = (k - 1) + k + (k + 1)' },
};

const q2018q9: CardRoutine<Q9of2018> = {
  draw: () => ({
    a: pick(['three', 'five', 'threeEven', 'threeOdd'] as const),
    b: pick(['oddTwo', 'fourOdd', 'oddSquares', 'threeThree'] as const),
  }),

  build: ({ a, b }): Built => {
    const s = SUMS2018[a], t = SPLITS2018[b];
    const count = s.what.split(' ')[0];
    const formed = `$${s.terms}$, where $n \\in \\mathbb{Z}$`;
    const divisible = `$${s.terms} = ${s.total}$, which is divisible by ${s.by}`;
    const split = `$${t.split}$, where $k \\in \\mathbb{Z}$`;
    return {
      questionLines: [
        'Prove directly that:',
        `<b>(a)</b> the sum of any ${s.what} is divisible by ${s.by};`,
        `<b>(b)</b> ${t.statement}.`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> Any ${s.what}, added: ${formed}`,
        `<strong>(a)</strong> ${divisible}`,
        `<strong>(b)</strong> ${split}`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: [
        `(a) ${divisible}, where $n \\in \\mathbb{Z}.$`,
        `(b) $${t.split}$, where $k \\in \\mathbb{Z}.$`,
      ].join('<br>'),
      ladder: {
        moves: [
          `How do you write "any ${s.what}" with one letter?`,
          `(a) Write ${s.what} with one letter, and add them.`,
          // "Simplify" fits every form: only one has a factor to take out (the owner, full read 2026-10-05).
          `(a) Simplify, and say why the result is divisible by ${s.by}.`,
          `(b) Write ${t.number} in general form, say what kind of number your letter is, and ${t.into}.`,
        ],
        marks: [0, 1, 1, 1],
        shows: [null, null, `$${s.total}$ which is divisible by ${s.by}`, null],
        watch: { at: 1, text: `Use letters. Adding ${count} particular numbers proves nothing.` },
      },
    };
  },
};

// ── 2018 Q12 ───────────────────────────────────────────────────────────────
// By induction: the sum from r = 1 of c·a^{r-1} is F(a^n - 1), F = c/(a - 1).
// The paper's c = 1, a = 3: F = 1/2. The step collects the terms in a^k:
// (F + c)a^k - F = F·a·a^k - F.

interface Q12of2018 { a: number; c: number }

const q2018q12: CardRoutine<Q12of2018> = {
  draw: () => ({ a: int(2, 7), c: int(1, 3) }),

  build: ({ a, c }): Built => {
    const F = q(c, a - 1);
    const one = F.n === 1n && F.d === 1n;
    const front = one ? '' : num(F);
    const times = (v: string) => (c === 1 ? v : `${c} \\times ${v}`);
    const term = times(`${a}^{r-1}`);
    const rhs = (power: string) => (one ? `${a}^{${power}} - 1` : `${front}(${a}^{${power}} - 1)`);
    const sumTo = (top: string) => `\\sum_{r=1}^{${top}} ${term}`;
    const base = `LHS: $${times(`${a}^{0}`)} = ${c}$, RHS: $${one ? `${a} - 1` : `${front}(${a} - 1)`} = ${c}$`;
    const stepped = `${rhs('k')} + ${times(`${a}^{(k+1)-1}`)}`;
    const collected = `${num(add(F, q(c)))} \\times ${a}^{k} - ${num(F)}`;
    const target = rhs('k+1');
    const conclusion = 'If true for $n = k$ then true for $n = k + 1.$ Also shown true for $n = 1$, therefore, by induction, true for all positive integers $n.$';
    return {
      questionLines: [
        'Prove by induction that, for all positive integers $n$,',
        `$${sumTo('n')} = ${rhs('n')}.$`,
      ],
      solutionSteps: [
        `When $n = 1$: ${base}, so the statement is true for $n = 1.$`,
        `Assume true for $n = k$: $${sumTo('k')} = ${rhs('k')}.$ Consider $n = k + 1$: $${sumTo('k+1')} = \\ldots$`,
        `$${sumTo('k+1')} = ${stepped}$`,
        `$= ${collected}$`,
        `$= ${target}.$ ${conclusion}`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `Proven: true for $n = 1$, and if true for $n = k$ then $${sumTo('k+1')} = ${target}$, true for $n = k + 1$; so by induction true for all positive integers $n.$`,
      ladder: {
        moves: [
          'An induction proof has a base case, an assumption and a step. What is the base case here?',
          'Show the statement is true for $n = 1$, working out both sides.',
          'Assume it is true for $n = k$, write that sum, and write the sum to $k + 1$ terms that you are aiming for.',
          'Write the sum to $k + 1$ terms as the sum to $k$ terms plus the next term, using the assumption.',
          `Combine the terms in $${a}^k$.`,
          'Write the result in terms of $k + 1$, then write the conclusion in full.',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [
          null,
          `${base}, so true for $n = 1$`,
          `$${sumTo('k')} = ${rhs('k')}$ and $${sumTo('k+1')} = \\ldots$`,
          `$\\ldots = ${stepped}$`,
          `$${collected}$`,
          null,
        ],
        watch: { at: 1, text: '"LHS = RHS" alone is not enough for $n = 1$. Show the substitution on both sides.' },
      },
    };
  },
};

export const ROUTINES = {
  '2018 Q9': q2018q9,
  '2018 Q12': q2018q12,
};
