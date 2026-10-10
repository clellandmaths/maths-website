/**
 * Advanced Higher, Methods of Proof: how each card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/methods-of-proof.ts` under the same label.
 */
import type { Built, CardRoutine } from '../types';
import { int, pick } from '../../core/draw';
import { poly } from '../../core/maths/format';
import { coprime } from '../../core/maths/integer';
import { pmatrix } from '../../core/maths/matrix';

// ── 2026 P2 Q12 ────────────────────────────────────────────────────────────
// a^n + b divisible by d, by induction: a = 1 + id, b = jd - 1

interface P2Q12 { d: number; i: number; j: number }

const q2026p2q12: CardRoutine<P2Q12> = {
  draw: () => {
    const d = int(3, 6);
    const most = Math.floor(12 / d);
    return { d, i: int(1, most), j: int(1, most) };
  },

  build: ({ d, i, j }): Built => {
    const a = 1 + i * d, b = j * d - 1;
    // a(dm - b) + b = adm - b(a - 1) = d(am - bi), since a - 1 = id.
    const expanded = `${a * d}m - ${b * (a - 1)}`;
    const factorised = `${d}(${a}m - ${b * i})`;
    const all = '$n \\in \\mathbb{N}.$';
    return {
      questionLines: [`Prove by induction that $${a}^{n} + ${b}$ is divisible by ${d} for all $n \\in \\mathbb{N}.$`],
      solutionSteps: [
        `When $n = 1$: $${a}^1 + ${b} = ${a + b} = ${d} \\times ${(a + b) / d}$, so the statement is true for $n = 1.$`,
        `Assume true for $n = k$, so $${a}^{k} + ${b} = ${d}m$ for some $m \\in \\mathbb{Z}$, that is $${a}^{k} = ${d}m - ${b}.$ Consider $n = k + 1$: $${a}^{k+1} + ${b}.$`,
        `$${a}^{k+1} + ${b} = ${a} \\times ${a}^{k} + ${b}$`,
        `$= ${a}(${d}m - ${b}) + ${b}$`,
        `$= ${expanded} = ${factorised}$, a multiple of ${d}. So if the statement is true for $n = k$ it is true for $n = k + 1.$ It is true for $n = 1$, so by induction it is true for all ${all}`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `Proven: if $${a}^{k} + ${b} = ${d}m$ then $${a}^{k+1} + ${b} = ${factorised}$, and it is true for $n = 1$, so $${a}^{n} + ${b}$ is divisible by ${d} for all ${all}`,
      ladder: {
        moves: [
          'An induction proof has a base case, an assumption and a step. What is the base case here?',
          'Show the statement is true for $n = 1$, with the substitution written out.',
          `Assume $${a}^{k} + ${b}$ is a multiple of ${d} for some $k$, and say you will look at $n = k + 1$.`,
          `Write $${a}^{k+1} + ${b}$ using $${a}^{k}$.`,
          `Use the assumption to replace $${a}^{k}$.`,
          `Take out a factor of ${d}, then write the conclusion in full.`,
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [
          null,
          `$${a}^1 + ${b} = ${a + b}$, true for $n = 1$`,
          `$${a}^{k} + ${b} = ${d}m$, where $m \\in \\mathbb{Z}$; and $${a}^{k+1} + ${b} = \\ldots ${a}^{k} \\ldots$`,
          `$${a} \\times ${a}^{k} + ${b}$`,
          null,
          null,
        ],
        watch: { at: 2, text: 'Write "assume true for $n = k$". Phrases such as "consider $n = k$" do not earn the mark.' },
      },
    };
  },
};

// ── 2026 P2 Q15 ────────────────────────────────────────────────────────────
// The contrapositive of "r irrational implies the nth root of r irrational",
// and the proof through it: the paper's square root, or (the owner, on the
// sheet, "What about any root of r?", then "Yes") a cube, fourth or fifth
// root, and (the owner on the AH widening sheet, 2026-10-10, "A") a sixth, so
// four remain once the paper's own is kept out. Exempt from the pool
// (registry).

interface P2Q15 { n: 2 | 3 | 4 | 5 | 6 }

/** What raising to the nth power is called in the move: "square", "cube", … */
const RAISE: Record<2 | 3 | 4 | 5 | 6, string> = {
  2: 'square', 3: 'cube', 4: 'raise to the fourth power', 5: 'raise to the fifth power', 6: 'raise to the sixth power',
};

const q2026p2q15: CardRoutine<P2Q15> = {
  draw: () => ({ n: pick([2, 3, 4, 5, 6] as const) }),

  build: ({ n }): Built => {
    const root = n === 2 ? '\\sqrt{r}' : `\\sqrt[${n}]{r}`;
    const r = `\\frac{p^{${n}}}{q^{${n}}}`;
    return {
      questionLines: [
        'Let $r$ be a positive real number and consider the following statement:',
        '',
        `If $r$ is irrational then $${root}$ is irrational.`,
        '',
        '<b>(a)</b> Write down the contrapositive of the statement.',
        '<b>(b)</b> Hence prove that the statement is true.',
      ],
      solutionSteps: [
        `<strong>(a)</strong> If $${root}$ is rational then $r$ is rational.`,
        `<strong>(b)</strong> Suppose $${root}$ is rational. Then $${root} = \\frac{p}{q}$,`,
        `<strong>(b)</strong> where $p, q \\in \\mathbb{Z}$ and $q \\neq 0$, so $r = ${r}$,`,
        `<strong>(b)</strong> which is rational, since $p^{${n}}$ and $q^{${n}}$ are integers and $q^{${n}} \\neq 0.$ So the contrapositive is true, and therefore the original statement is true.`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `(a) If $${root}$ is rational then $r$ is rational.<br>(b) Proven: $${root} = \\frac{p}{q}$ with $p, q \\in \\mathbb{Z}$, $q \\neq 0$, gives $r = ${r}$, which is rational; the contrapositive is true, so the statement is true.`,
      ladder: {
        moves: [
          'A contrapositive swaps the two halves and negates both. What are the halves here?',
          '(a) Write the contrapositive.',
          `(b) Write $${root}$ as a fraction.`,
          `(b) Say what the numerator and denominator are, and ${RAISE[n]} to get $r$.`,
          '(b) Say why $r$ is rational, and what that proves about the original statement.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, null, `$${root} = \\frac{p}{q}$`, `$p, q \\in \\mathbb{Z}\\ (q \\neq 0)$, $r = ${r}$`, null],
        watch: { at: 2, text: `Do not use $r$ as a letter in your fraction for $${root}$: pick new ones.` },
      },
    };
  },
};

// ── 2025 P2 Q15 ────────────────────────────────────────────────────────────
// By induction: the sum of 1/((ar + b)(ar + b - a)) from 1 to n is n/(b(an + b)).
// The paper's a = 2, b = 1: 1/((2r + 1)(2r - 1)), n/(2n + 1).

interface P2Q15of2025 { a: number; b: number }

/** Every (a, b) with a from 2 to 6 and b from 1 to 5 sharing no factor. */
const P2Q15_PAIRS: readonly [number, number][] = [2, 3, 4, 5, 6].flatMap(a =>
  [1, 2, 3, 4, 5].filter(b => coprime(a, b)).map((b): [number, number] => [a, b]));

/** `(2r + 1)`, or with a number for r: `(2 + 1)`. */
const lin = (a: number, c: number, v: string) => `(${a}${v} ${c < 0 ? '-' : '+'} ${Math.abs(c)})`;

const q2025p2q15: CardRoutine<P2Q15of2025> = {
  draw: () => {
    const [a, b] = pick(P2Q15_PAIRS);
    return { a, b };
  },

  build: ({ a, b }): Built => {
    const term = (v: string) => `\\frac{1}{${lin(a, b, v)}${lin(a, b - a, v)}}`;
    // The right side with its bottom multiplied out, n/(abn + b²), as the
    // paper's n/(2n + 1): one shape for every b.
    const ab = a * b, bb = b * b;
    const rhs = (v: string) => `\\frac{${v}}{${ab}${v} + ${bb}}`;
    const sumTo = (top: string) => `\\sum_{r=1}^{${top}} ${term('r')}`;
    const statement = `${sumTo('n')} = ${rhs('n')}`;
    // n = 1: both sides are 1/(ab + b²).
    const base = `LHS $= \\frac{1}{(${a} + ${b})(${a} ${b - a < 0 ? '-' : '+'} ${Math.abs(b - a)})} = \\frac{1}{${ab + bb}}$ and RHS $= \\frac{1}{${ab} + ${bb}} = \\frac{1}{${ab + bb}}$`;
    const next = `\\frac{1}{(${a}(k + 1) + ${b})(${a}(k + 1) ${b - a < 0 ? '-' : '+'} ${Math.abs(b - a)})}`;
    const stepSum = `${rhs('k')} + ${next}`;
    const big = `${a}k + ${a + b}`;
    const single = `\\frac{(${big})k + ${b}}{(${ab}k + ${bb})(${big})}`;
    // abk + b² is b(ak + b), which cancels with the top's (ak + b).
    const factored = `\\frac{(k + 1)(${a}k + ${b})}{${b === 1 ? '' : b}(${a}k + ${b})(${big})}`;
    const target = `\\frac{k + 1}{${ab}(k + 1) + ${bb}}`;
    const conclusion = 'If true for $n = k$ then true for $n = k + 1.$ Also shown true for $n = 1$, therefore, by induction, true for all positive integers $n.$';
    return {
      questionLines: [
        'Prove by induction that, for all positive integers $n$,',
        '',
        `$${statement}.$`,
      ],
      solutionSteps: [
        `When $n = 1$: ${base}, so true for $n = 1.$`,
        `Assume true for $n = k$: $${sumTo('k')} = ${rhs('k')}.$ Consider $n = k + 1$: $${sumTo('k + 1')} = \\ldots$`,
        `$${sumTo('k + 1')} = ${stepSum}$`,
        `$= ${single}$`,
        `$= ${factored} = ${target}.$ ${conclusion}`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `Proven: true for $n = 1$, and if true for $n = k$ then $${sumTo('k + 1')} = ${target}$, true for $n = k + 1$; so by induction true for all positive integers $n.$`,
      ladder: {
        moves: [
          'An induction proof has a base case, an assumption and a step. What is the base case here?',
          'Show the statement is true for $n = 1$, working out both sides.',
          'Assume it is true for $n = k$, write that sum, and write the sum to $k + 1$ terms that you are aiming for.',
          'Write the sum to $k + 1$ terms as the sum to $k$ terms plus the next term, using the assumption.',
          'Combine the two fractions into one.',
          'Factorise the numerator, cancel, and write the conclusion in full.',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [
          null,
          `${base}, so true for $n = 1$`,
          `$${sumTo('k')} = ${rhs('k')}$ and $${sumTo('k + 1')} = \\ldots$`,
          `$${stepSum}$`,
          `$${single}$`,
          null,
        ],
        watch: { at: 1, text: '"LHS = RHS" alone is not enough for $n = 1$. Show the substitution on both sides.' },
      },
    };
  },
};

// ── 2024 P2 Q11 ────────────────────────────────────────────────────────────
// Two statements about the squares of two consecutive integers (or
// consecutive odd, or even, integers, or multiples of 3): one false, by
// counterexample, and one true, by a direct proof, in the paper's three steps.

type SquaresKind = 'sum' | 'difference' | 'oddSum' | 'oddDifference' | 'evenSum' | 'evenDifference'
  | 'tripleSum' | 'tripleDifference';

interface P2Q11of2024 { kind: SquaresKind }

/**
 * What each kind says, its counterexample, and its algebra. The paper's is
 * `sum`; the owner asked for more on the 2024 P2 sheet ("More please").
 */
const SQUARES: Readonly<Record<SquaresKind, {
  phrase: string; falseClaim: string; trueClaim: string;
  counter: string; not: string; form: string; letters: string; algebra: string; combine: string; which: string;
}>> = {
  sum: {
    phrase: 'The sum of the squares of any two consecutive integers',
    falseClaim: 'prime', trueClaim: 'odd',
    counter: '3^{2} + 4^{2} = 25', not: 'which is not prime, as $25 = 5 \\times 5.$',
    form: 'k,\\ k + 1,\\ k \\in \\mathbb{Z}', letters: '$k$ and $k + 1$',
    algebra: 'k^{2} + (k + 1)^{2} = 2k^{2} + 2k + 1 = 2(k^{2} + k) + 1',
    combine: 'Add their squares', which: 'integers',
  },
  difference: {
    phrase: 'The difference between the squares of any two consecutive integers',
    falseClaim: 'prime', trueClaim: 'odd',
    counter: '5^{2} - 4^{2} = 9', not: 'which is not prime, as $9 = 3 \\times 3.$',
    form: 'k,\\ k + 1,\\ k \\in \\mathbb{Z}', letters: '$k$ and $k + 1$',
    algebra: '(k + 1)^{2} - k^{2} = k^{2} + 2k + 1 - k^{2} = 2k + 1',
    combine: 'Subtract the smaller square from the larger', which: 'integers',
  },
  oddSum: {
    phrase: 'The sum of the squares of any two consecutive odd integers',
    falseClaim: 'a multiple of 4', trueClaim: 'even',
    counter: '1^{2} + 3^{2} = 10', not: 'which is not a multiple of 4.',
    form: '2k + 1,\\ 2k + 3,\\ k \\in \\mathbb{Z}', letters: '$2k + 1$ and $2k + 3$',
    algebra: '(2k + 1)^{2} + (2k + 3)^{2} = 8k^{2} + 16k + 10 = 2(4k^{2} + 8k + 5)',
    combine: 'Add their squares', which: 'odd integers',
  },
  oddDifference: {
    phrase: 'The difference between the squares of any two consecutive odd integers',
    falseClaim: 'a multiple of 16', trueClaim: 'a multiple of 8',
    counter: '3^{2} - 1^{2} = 8', not: 'which is not a multiple of 16.',
    form: '2k + 1,\\ 2k + 3,\\ k \\in \\mathbb{Z}', letters: '$2k + 1$ and $2k + 3$',
    algebra: '(2k + 3)^{2} - (2k + 1)^{2} = 4k^{2} + 12k + 9 - 4k^{2} - 4k - 1 = 8(k + 1)',
    combine: 'Subtract the smaller square from the larger', which: 'odd integers',
  },
  evenSum: {
    phrase: 'The sum of the squares of any two consecutive even integers',
    falseClaim: 'a multiple of 8', trueClaim: 'a multiple of 4',
    counter: '2^{2} + 4^{2} = 20', not: 'which is not a multiple of 8.',
    form: '2k,\\ 2k + 2,\\ k \\in \\mathbb{Z}', letters: '$2k$ and $2k + 2$',
    algebra: '(2k)^{2} + (2k + 2)^{2} = 8k^{2} + 8k + 4 = 4(2k^{2} + 2k + 1)',
    combine: 'Add their squares', which: 'even integers',
  },
  evenDifference: {
    phrase: 'The difference between the squares of any two consecutive even integers',
    falseClaim: 'a multiple of 8', trueClaim: 'a multiple of 4',
    counter: '4^{2} - 2^{2} = 12', not: 'which is not a multiple of 8.',
    form: '2k,\\ 2k + 2,\\ k \\in \\mathbb{Z}', letters: '$2k$ and $2k + 2$',
    algebra: '(2k + 2)^{2} - (2k)^{2} = 4k^{2} + 8k + 4 - 4k^{2} = 4(2k + 1)',
    combine: 'Subtract the smaller square from the larger', which: 'even integers',
  },
  // Two consecutive multiples of 3, so five remain once the paper's own is kept
  // out (the owner on the AH widening sheet, 2026-10-10: "A").
  tripleSum: {
    phrase: 'The sum of the squares of any two consecutive multiples of 3',
    falseClaim: 'a multiple of 18', trueClaim: 'a multiple of 9',
    counter: '3^{2} + 6^{2} = 45', not: 'which is not a multiple of 18.',
    form: '3k,\\ 3k + 3,\\ k \\in \\mathbb{Z}', letters: '$3k$ and $3k + 3$',
    algebra: '(3k)^{2} + (3k + 3)^{2} = 18k^{2} + 18k + 9 = 9(2k^{2} + 2k + 1)',
    combine: 'Add their squares', which: 'multiples of 3',
  },
  tripleDifference: {
    phrase: 'The difference between the squares of any two consecutive multiples of 3',
    falseClaim: 'a multiple of 18', trueClaim: 'a multiple of 9',
    counter: '6^{2} - 3^{2} = 27', not: 'which is not a multiple of 18.',
    form: '3k,\\ 3k + 3,\\ k \\in \\mathbb{Z}', letters: '$3k$ and $3k + 3$',
    algebra: '(3k + 3)^{2} - (3k)^{2} = 9k^{2} + 18k + 9 - 9k^{2} = 9(2k + 1)',
    combine: 'Subtract the smaller square from the larger', which: 'multiples of 3',
  },
};

const KINDS = Object.keys(SQUARES) as SquaresKind[];

const q2024p2q11: CardRoutine<P2Q11of2024> = {
  draw: () => ({ kind: pick(KINDS) }),

  build: ({ kind }): Built => {
    const s = SQUARES[kind];
    const form = s.form;
    return {
      questionLines: [
        'Consider statements A and B below.',
        'For each statement: if true, provide a proof; if false, provide a counterexample.',
        '',
        `A: ${s.phrase} is always ${s.falseClaim}.`,
        `B: ${s.phrase} is always ${s.trueClaim}.`,
      ],
      solutionSteps: [
        `Statement A is false: for example $${s.counter}$, ${s.not}`,
        `For statement B, let the ${s.which} be $${form}.$`,
        `Then $${s.algebra}$, which is ${s.trueClaim}, so statement B is true.`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `Statement A is false: counterexample, e.g., $${s.counter}$, ${s.not}<br>Statement B is true: let the ${s.which} be ${s.letters}, $k \\in \\mathbb{Z}.$ Then $${s.algebra}$, which is ${s.trueClaim}.`,
      ladder: {
        moves: [
          'To show a statement false, you need one example. To show one true, you need an argument that covers every case. Which is which here?',
          `For the false statement, give one pair of consecutive ${s.which} that fails, and say why it fails.`,
          `For the true statement, write two general consecutive ${s.which}, and say what kind of number your letter is.`,
          `${s.combine}, and write the result to show it is ${s.trueClaim}, then say so.`,
        ],
        marks: [0, 1, 1, 1],
        shows: [null, null, `$${form}$`, null],
        watch: { at: 2, text: 'Say your letter is an integer, eg $k \\in \\mathbb{Z}$. The mark needs it.' },
      },
    };
  },
};

// ── 2023 P1 Q8 ─────────────────────────────────────────────────────────────
// (a) a statement about two integers and their squares, false by one
// counterexample with a negative; (b) n odd, n² + c divisible by 4 directly,
// c one less than a multiple of 4, so (2k + 1)² + c = 4(k² + k + (1 + c)/4).

type OrderClaim = 'lt' | 'gt' | 'squaresLt' | 'squaresGt' | 'squaresEqual';

interface P1Q8of2023 { claim: OrderClaim; c: -1 | 3 | -5 | 7 }

/**
 * Each statement, its counterexample (with the stop inside the maths), and
 * the scheme's short form of it. The paper's is `lt`; each is broken the same
 * way, by a negative integer, in the paper's one step.
 */
const CLAIMS: Readonly<Record<OrderClaim, { statement: string; counter: string; brief: string }>> = {
  lt: {
    statement: 'if $a \\lt b$ then $a^{2} \\lt b^{2}.$',
    counter: 'let $a = -2$ and $b = 1.$ $-2 \\lt 1$ is true, but $(-2)^{2} \\lt 1^{2} \\Rightarrow 4 \\lt 1$ is false.',
    brief: '$a = -2,\\ b = 1$, 4 is not less than 1',
  },
  gt: {
    statement: 'if $a \\gt b$ then $a^{2} \\gt b^{2}.$',
    counter: 'let $a = 1$ and $b = -2.$ $1 \\gt -2$ is true, but $1^{2} \\gt (-2)^{2} \\Rightarrow 1 \\gt 4$ is false.',
    brief: '$a = 1,\\ b = -2$, 1 is not greater than 4',
  },
  squaresLt: {
    statement: 'if $a^{2} \\lt b^{2}$ then $a \\lt b.$',
    counter: 'let $a = 1$ and $b = -2.$ $1^{2} \\lt (-2)^{2} \\Rightarrow 1 \\lt 4$ is true, but $1 \\lt -2$ is false.',
    brief: '$a = 1,\\ b = -2$, 1 is not less than $-2$',
  },
  squaresGt: {
    statement: 'if $a^{2} \\gt b^{2}$ then $a \\gt b.$',
    counter: 'let $a = -2$ and $b = 1.$ $(-2)^{2} \\gt 1^{2} \\Rightarrow 4 \\gt 1$ is true, but $-2 \\gt 1$ is false.',
    brief: '$a = -2,\\ b = 1$, $-2$ is not greater than 1',
  },
  squaresEqual: {
    statement: 'if $a^{2} = b^{2}$ then $a = b.$',
    counter: 'let $a = 2$ and $b = -2.$ $2^{2} = (-2)^{2} = 4$ is true, but $2 = -2$ is false.',
    brief: '$a = 2,\\ b = -2$, $2 \\neq -2$',
  },
};

const ORDER_CLAIMS = Object.keys(CLAIMS) as OrderClaim[];

const q2023p1q8: CardRoutine<P1Q8of2023> = {
  draw: () => ({ claim: pick(ORDER_CLAIMS), c: pick([-1, 3, -5, 7] as const) }),

  build: ({ claim, c }): Built => {
    const s = CLAIMS[claim];
    const expr = `n^{2} ${c < 0 ? '-' : '+'} ${Math.abs(c)}`;
    const expanded = poly([4, 4, 1 + c], 'k');
    const inside = poly([1, 1, (1 + c) / 4], 'k');
    const algebra = `${expr} = (2k + 1)^{2} ${c < 0 ? '-' : '+'} ${Math.abs(c)} = ${expanded} = 4(${inside})`;
    const proof = `Let $n = 2k + 1$ for $k \\in \\mathbb{Z}.$ Then $${algebra}$, which is divisible by 4, as $${inside}$ is an integer.`;
    return {
      questionLines: [
        '<b>(a)</b> Consider the statement:',
        '',
        `For all integers $a$ and $b$, ${s.statement}`,
        '',
        'Find a counterexample to show that the statement is false.',
        '<b>(b)</b> Let $n$ be an odd integer.',
        `Prove directly that $${expr}$ is divisible by 4.`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> For example, ${s.counter}`,
        '<strong>(b)</strong> Let $n = 2k + 1$, $k \\in \\mathbb{Z}.$',
        `<strong>(b)</strong> $${algebra}$, which is divisible by 4, as $${inside}$ is an integer.`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `(a) e.g., ${s.counter}<br>(b) ${proof}`,
      ladder: {
        moves: [
          'To show a statement false, one example is enough. What sort of numbers might break it?',
          '(a) Choose values of $a$ and $b$ that break the statement, and show that they do.',
          '(b) Write an odd integer in general form, and say what kind of number your letter is.',
          `(b) Expand $${expr}$, take out a factor of 4, and say what that shows.`,
        ],
        marks: [0, 1, 1, 1],
        shows: [null, s.brief, '$2k + 1$, $k \\in \\mathbb{Z}$', null],
        watch: { at: 2, text: 'Say your letter is an integer, eg $k \\in \\mathbb{Z}$. Natural numbers are not enough.' },
      },
    };
  },
};

// ── 2023 P2 Q12 ────────────────────────────────────────────────────────────
// By induction: the sum of a^{r-1}(ur + v) from 1 to n is aⁿ(n - 1 + c) + 1 - c,
// where u = a - 1 and v = (a - 1)c - (a - 2). The paper's a = 2, c = 0:
// 2^{r-1}r, 2ⁿ(n - 1) + 1. Every one steps the paper's way: the sum to k plus
// the next term takes out a^k, leaving a^k · a(k + c).

interface P2Q12of2023 { a: number; c: number }

const q2023p2q12: CardRoutine<P2Q12of2023> = {
  draw: () => ({ a: int(2, 5), c: pick([0, 2, 3, 4]) }),

  build: ({ a, c }): Built => {
    const u = a - 1, v = (a - 1) * c - (a - 2);
    const factor = (lin: string) => (u === 1 && v === 0 ? lin : `(${lin})`);
    const term = `${a}^{r-1}${factor(poly([u, v], 'r'))}`;
    const tail = `${1 - c < 0 ? '-' : '+'} ${Math.abs(1 - c)}`;
    const rhs = (x: string) => `${a}^{${x}}(${poly([1, c - 1], x)}) ${tail}`;
    const sumTo = (top: string) => `\\sum_{r=1}^{${top}} ${term}`;
    const statement = `${sumTo('n')} = ${rhs('n')}`;
    const base = `(LHS $=$) $${a}^{1-1} \\times ${u + v} = ${u + v}$, (RHS $=$) $${a}(${poly([1, c - 1], '1')}) ${tail} = ${a * c + 1 - c}$`;
    // Always bracketed: even the paper's r becomes k + 1, (k + 1)2^{k}.
    const nextTerm = `(${poly([u, u + v], 'k')})${a}^{k}`;
    const stepSum = `${rhs('k')} + ${nextTerm}`;
    const inside = `${poly([1, c - 1], 'k')} + ${poly([u, u + v], 'k')}`;
    const kc = c === 0 ? 'k' : `(${poly([1, c], 'k')})`;
    const factored = `${a}^{k} \\cdot ${a}${kc} ${tail}`;
    const target = `${a}^{(k+1)}(${c === 0 ? 'k + 1 - 1' : `k + 1 + ${c - 1}`}) ${tail}`;
    const conclusion = 'If true for $n = k$ then true for $n = k + 1.$ Also true for $n = 1$, therefore, by induction, true for all positive integers $n.$';
    return {
      questionLines: [
        'Prove by induction that, for all positive integers $n$,',
        '',
        `$${statement}.$`,
      ],
      solutionSteps: [
        `When $n = 1$: ${base}, so the result is true when $n = 1.$`,
        `Assume true for $n = k$: $${sumTo('k')} = ${rhs('k')}.$ Consider $n = k + 1$: $${sumTo('k + 1')} = \\ldots$`,
        `$${sumTo('k + 1')} = ${stepSum}$`,
        `$= ${a}^{k}(${inside}) ${tail} = ${factored}$`,
        `$= ${target}.$ ${conclusion}`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `Proven: true for $n = 1$, and if true for $n = k$ then $${sumTo('k + 1')} = ${target}$, true for $n = k + 1$; so by induction true for all positive integers $n.$`,
      ladder: {
        moves: [
          'An induction proof has a base case, an assumption and a step. What is the base case here?',
          'Show the statement is true for $n = 1$, working out both sides.',
          'Assume it is true for $n = k$, write that sum, and write the sum to $k + 1$ terms that you are aiming for.',
          'Write the sum to $k + 1$ terms as the sum to $k$ terms plus the next term, using the assumption.',
          `Take out the common factor of $${a}^k$ and simplify.`,
          'Write the result in terms of $k + 1$, then write the conclusion in full.',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [
          null,
          `${base} so result is true when $n = 1$`,
          `$${sumTo('k')} = ${rhs('k')}$ and $${sumTo('k + 1')} = \\ldots$`,
          `$${stepSum}$`,
          null,
          null,
        ],
        watch: { at: 1, text: '"LHS = RHS" alone is not enough for $n = 1$. Show the substitution on both sides.' },
      },
    };
  },
};

// ── 2022 P1 Q6 ─────────────────────────────────────────────────────────────
// (a) "for all odd n, n² + c is prime", false by the first odd n that breaks
// it; (b) the difference between the cubes of two consecutive integers (or
// odd, or even, integers) is not divisible by 3, directly.

/** First odd n with n² + c not prime, and its smallest factor. */
function firstComposite(c: number): { n: number; value: number; factor: number } {
  for (let n = 1; ; n += 2) {
    const value = n * n + c;
    for (let f = 2; f * f <= value; f++) if (value % f === 0) return { n, value, factor: f };
  }
}

/**
 * The c the statement can take: even (an odd c makes every n² + c even, too
 * plain to be the paper's), and the first counterexample from n = 3 to 9,
 * so a pupil tries a few, as the paper's 9 (85 = 5 × 17). n = 1 would end the
 * search at once. 2, 4 (the paper), 6, 10, 12, 16, 18, 28 and 30.
 */
const Q6_CS: readonly number[] = Array.from({ length: 15 }, (_, i) => 2 * (i + 1))
  .filter(c => { const { n } = firstComposite(c); return n >= 3 && n <= 9; });

type CubesKind = 'integers' | 'odd' | 'even';

/** Each kind of pair, in the paper's three steps: the form, the difference, the algebra to 3(…) + r. */
const CUBES: Readonly<Record<CubesKind, { which: string; form: string; letters: string; difference: string; algebra: string; remainder: number }>> = {
  integers: {
    which: 'integers', form: 'n,\\ n + 1', letters: '$n$ and $n + 1$',
    difference: '(n + 1)^{3} - n^{3}',
    algebra: 'n^{3} + 3n^{2} + 3n + 1 - n^{3} = 3n^{2} + 3n + 1 = 3(n^{2} + n) + 1',
    remainder: 1,
  },
  odd: {
    which: 'odd integers', form: '2n + 1,\\ 2n + 3', letters: '$2n + 1$ and $2n + 3$',
    difference: '(2n + 3)^{3} - (2n + 1)^{3}',
    algebra: '8n^{3} + 36n^{2} + 54n + 27 - (8n^{3} + 12n^{2} + 6n + 1) = 24n^{2} + 48n + 26 = 3(8n^{2} + 16n + 8) + 2',
    remainder: 2,
  },
  even: {
    which: 'even integers', form: '2n,\\ 2n + 2', letters: '$2n$ and $2n + 2$',
    difference: '(2n + 2)^{3} - (2n)^{3}',
    algebra: '8n^{3} + 24n^{2} + 24n + 8 - 8n^{3} = 24n^{2} + 24n + 8 = 3(8n^{2} + 8n + 2) + 2',
    remainder: 2,
  },
};

interface P1Q6of2022 { c: number; kind: CubesKind }

const q2022p1q6: CardRoutine<P1Q6of2022> = {
  draw: () => ({ c: pick(Q6_CS), kind: pick(['integers', 'odd', 'even'] as const) }),

  build: ({ c, kind }): Built => {
    const { n, value, factor } = firstComposite(c);
    const s = CUBES[kind];
    const expr = `n^{2} + ${c}`;
    const counter = `when $n = ${n}$, $${expr} = ${value} = ${factor} \\times ${value / factor}$, which is not prime`;
    const remainder = s.remainder === 1 ? 'a remainder of 1' : 'a remainder of 2';
    return {
      questionLines: [
        `Consider the statement: For all odd numbers $n$, $${expr}$ is prime.`,
        '<b>(a)</b> Find a counterexample to show that the statement is false.',
        `<b>(b)</b> Prove directly that the difference between the cubes of any two consecutive ${s.which} is not divisible by 3.`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> For example, ${counter}, so the statement is false.`,
        `<strong>(b)</strong> Let the consecutive ${s.which} be $${s.form}$, where $n \\in \\mathbb{Z}.$`,
        `<strong>(b)</strong> The difference between their cubes is $${s.difference}.$`,
        `<strong>(b)</strong> $${s.difference} = ${s.algebra}$, which leaves ${remainder} when divided by 3, so it is not divisible by 3.`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: [
        `(a) e.g. ${counter}.`,
        `(b) Let the consecutive ${s.which} be ${s.letters}, $n \\in \\mathbb{Z}.$ Then $${s.difference} = ${s.algebra}$, which leaves ${remainder} when divided by 3, so it is not divisible by 3.`,
      ].join('<br>'),
      ladder: {
        moves: [
          'To show a statement false, one example is enough. Which odd numbers might break it?',
          `(a) Try odd numbers until $${expr}$ is not prime, and say why it is not.`,
          `(b) Write two consecutive ${s.which} in general form, and say what kind of number your letter is.`,
          '(b) Write the difference between their cubes.',
          '(b) Expand, write it as a multiple of 3 plus a remainder, and say what that shows.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, counter, `$${s.form}$ AND $n \\in \\mathbb{Z}$`, null, null],
        watch: { at: 1, text: 'Show why the number is not prime, eg by giving a factor.' },
      },
    };
  },
};

// ── 2022 P2 Q9 ─────────────────────────────────────────────────────────────
// A = (a b; 0 1) with b = ∓(a - 1): Aⁿ = (aⁿ 1 - aⁿ; 0 1), as the paper's,
// or (aⁿ aⁿ - 1; 0 1), by induction with A^{k+1} = A A^k.

interface P2Q9of2022 { a: number; down: boolean }

const q2022p2q9: CardRoutine<P2Q9of2022> = {
  draw: () => ({ a: int(2, 9), down: pick([true, false]) }),

  build: ({ a, down }): Built => {
    const b = down ? -(a - 1) : a - 1;
    const entry = (v: string) => (down ? `1 - ${a}^{${v}}` : `${a}^{${v}} - 1`);
    const power = (v: string) => `\\begin{pmatrix}${a}^{${v}} & ${entry(v)}\\\\0 & 1\\end{pmatrix}`;
    const A = pmatrix([[a, b], [0, 1]]);
    const baseEntry = down ? `1 - ${a}` : `${a} - 1`;
    const base = `When $n = 1$, $\\begin{pmatrix}${a} & ${baseEntry}\\\\0 & 1\\end{pmatrix} = ${A} = A$, so the statement is true for $n = 1.$`;
    const product = `${A}${power('k')}`;
    const multiplied = `\\begin{pmatrix}${a} \\times ${a}^{k} & ${a}(${entry('k')}) ${down ? '-' : '+'} ${a - 1}\\\\0 & 1\\end{pmatrix}`;
    const spread = down ? `${a} - ${a}^{k+1} - ${a - 1}` : `${a}^{k+1} - ${a} + ${a - 1}`;
    const simplified = `\\begin{pmatrix}${a}^{k+1} & ${spread}\\\\0 & 1\\end{pmatrix}`;
    const conclusion = 'So if the result is true for $n = k$ then it is true for $n = k + 1.$ But it is true for $n = 1$, and so by induction it is true $\\forall n \\in \\mathbb{N}.$';
    return {
      questionLines: [
        `The matrix $A$ is given by $A = ${A}.$`,
        `Prove by induction that $A^{n} = ${power('n')}, \\forall n \\in \\mathbb{N}.$`,
      ],
      solutionSteps: [
        base,
        `Assume true for $n = k$: $A^{k} = ${power('k')}.$ Consider $A^{k+1} = \\ldots$`,
        `$A^{k+1} = AA^{k} = ${product}$`,
        `$= ${multiplied}$`,
        `$= ${simplified} = ${power('k+1')}.$ ${conclusion}`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `Proven: true for $n = 1$, and if true for $n = k$ then $A^{k+1} = ${power('k+1')}$, true for $n = k + 1$; so by induction true $\\forall n \\in \\mathbb{N}.$`,
      ladder: {
        moves: [
          'An induction proof has a base case, an assumption and a step. What is the base case here?',
          'Show the statement is true for $n = 1$, by working out the right-hand side.',
          'Assume it is true for $n = k$, write that $A^k$, and say you will look at $A^{k+1}$.',
          'Write $A^{k+1}$ as $A$ times $A^k$, using the assumption.',
          'Multiply the two matrices.',
          'Simplify each entry into the form for $n = k + 1$, then write the conclusion in full.',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [
          null,
          `when $n = 1$, $\\begin{pmatrix}${a} & ${baseEntry}\\\\0 & 1\\end{pmatrix} = ${A}$ so true for $n = 1$.`,
          `assume true for $n = k$ AND $A^k = ${power('k')}$ AND $A^{k+1} = \\ldots$`,
          null,
          `$${multiplied}$`,
          null,
        ],
        watch: { at: 5, text: 'Show the algebra for each entry. Writing the final matrix without it loses the last mark.' },
      },
    };
  },
};

export const ROUTINES = {
  '2022 P1 Q6': q2022p1q6,
  '2022 P2 Q9': q2022p2q9,
  '2023 P1 Q8': q2023p1q8,
  '2023 P2 Q12': q2023p2q12,
  '2024 P2 Q11': q2024p2q11,
  '2025 P2 Q15': q2025p2q15,
  '2026 P2 Q12': q2026p2q12,
  '2026 P2 Q15': q2026p2q15,
};
