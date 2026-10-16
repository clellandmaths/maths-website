/**
 * Advanced Higher, Methods of Proof: how each 2019 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/methods-of-proof.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { pick } from '../../core/draw';
import { sum } from '../../core/maths/format';

// ── 2019 Q11 ───────────────────────────────────────────────────────────────
// (a) a counterexample to "n² + bn + c is always prime"; (b) the contrapositive
// of "if n² + Bn + C is even then n is odd" (B even, C odd), proved with
// n = 2k: 4k² + 2Bk + C = 2(2k² + Bk + (C - 1)/2) + 1.

interface Q11of2019 { b: number; c: number; B: number; C: number }

const smallestFactor = (v: number) => {
  for (let p = 2; p * p <= v; p++) if (v % p === 0) return p;
  return v;
};
/** The first n from 1 where n² + bn + c is not prime. */
const firstComposite = (b: number, c: number) => {
  for (let n = 1; ; n++) {
    const v = n * n + b * n + c;
    if (smallestFactor(v) !== v) return n;
  }
};

/** (b, c) whose first counterexample is from 2 to 6, as the paper's n = 4: n² + n is even, so c odd keeps every value odd. */
const Q11_PRIMES2019: readonly [number, number][] = [1, 3, 5].flatMap(b =>
  [1, 3, 5, 7, 9, 11].filter(c => { const n = firstComposite(b, c); return n >= 2 && n <= 6; }).map((c): [number, number] => [b, c]));

/** (B, C) with 2k² + Bk + (C - 1)/2 a natural number for every k from 1, as the paper's 2k² - 2k + 3. */
const Q11_PARITY2019: readonly [number, number][] = [-6, -4, -2, 2, 4, 6].flatMap(B =>
  [1, 3, 5, 7, 9, 11, 13, 15].filter(C =>
    [1, 2, 3, 4, 5].every(k => 2 * k * k + B * k + (C - 1) / 2 >= 1)).map((C): [number, number] => [B, C]));

const q2019q11: CardRoutine<Q11of2019> = {
  draw: () => {
    const [b, c] = pick(Q11_PRIMES2019);
    const [B, C] = pick(Q11_PARITY2019);
    return { b, c, B, C };
  },

  build: ({ b, c, B, C }): Built => {
    const prime = sum([{ coef: 1, body: 'n^{2}' }, { coef: b, body: 'n' }, { coef: c, body: '' }]);
    const n0 = firstComposite(b, c), v = n0 * n0 + b * n0 + c, f = smallestFactor(v);
    const counter = `When $n = ${n0}$, $${prime} = ${v} = ${f} \\times ${v / f}$, which is not prime.`;
    const expr = sum([{ coef: 1, body: 'n^{2}' }, { coef: B, body: 'n' }, { coef: C, body: '' }]);
    const contra = `If $n$ is even then $${expr}$ is odd.`;
    const sub = sum([{ coef: 1, body: '(2k)^{2}' }, { coef: B, body: '(2k)' }, { coef: C, body: '' }]);
    const expanded = sum([{ coef: 4, body: 'k^{2}' }, { coef: 2 * B, body: 'k' }, { coef: C, body: '' }]);
    const inner = sum([{ coef: 2, body: 'k^{2}' }, { coef: B, body: 'k' }, { coef: (C - 1) / 2, body: '' }]);
    const odd = `2(${inner}) + 1`;
    const proof = `Let $n = 2k$, $k \\in \\mathbb{N}.$ $${expr} = ${sub} = ${expanded} = ${odd}.$ Since $${inner} \\in \\mathbb{N}$, this is odd. The contrapositive statement is true and therefore the original statement is true.`;
    return {
      questionLines: [
        'Let $n$ be a positive integer.',
        '<b>(a)</b> Find a counterexample to show that the following statement is false.',
        `$${prime}$ is always a prime number.`,
        '<b>(b)</b> (i) Write down the contrapositive of:',
        `If $${expr}$ is even then $n$ is odd.`,
        `(ii) Use the contrapositive to prove that if $${expr}$ is even then $n$ is odd.`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> ${counter}`,
        `<strong>(b)(i)</strong> ${contra}`,
        `<strong>(b)(ii)</strong> Let $n = 2k$, $k \\in \\mathbb{N}$: $${expr} = ${sub}$`,
        `<strong>(b)(ii)</strong> $= ${expanded} = ${odd}$, which is odd since $${inner} \\in \\mathbb{N}$`,
        '<strong>(b)(ii)</strong> The contrapositive statement is true, and therefore the original statement is true.',
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: [`(a) ${counter}`, `(b)(i) ${contra}`, `(b)(ii) ${proof}`].join('<br>'),
      ladder: {
        moves: [
          'To show a statement false, one example is enough. And a contrapositive swaps the two halves and negates both.',
          `(a) Try values of $n$ until $${prime}$ is not prime, and say why it is not.`,
          '(b)(i) Write the contrapositive, starting with the condition on $n$.',
          '(b)(ii) Write an even $n$ in general form, say what kind of number your letter is, and substitute.',
          '(b)(ii) Rearrange to show the result is one more than an even number.',
          '(b)(ii) Say what that proves: the contrapositive, and so the original statement.',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [
          null,
          counter,
          contra,
          `$n = 2k$, $k \\in \\mathbb{N}$ and $${sub}$`,
          `$${odd}$, which is odd since $${inner} \\in \\mathbb{N}$`,
          null,
        ],
        watch: { at: 2, text: 'The contrapositive starts "If $n$ is even…". Starting with the expression loses the rest.' },
      },
    };
  },
};

// ── 2019 Q14 ───────────────────────────────────────────────────────────────
// By induction: the sum from r = m of (r + s)!(r + s) is (n + s + 1)! - (m + s)!,
// for n ≥ m. The paper's s = 0, m = 1: r!r, (n + 1)! - 1. The step takes out
// (k + s + 1)! for every one: (k + s + 1)!(k + s + 2) - (m + s)!.

interface Q14of2019 { s: 0 | 1 | 2 | 3; m: 1 | 2 | 3 | 4 }

const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
/** `v + a`, or `v` when a is 0. */
const plus2019 = (v: string, a: number) => (a === 0 ? v : `${v} + ${a}`);

const q2019q14: CardRoutine<Q14of2019> = {
  draw: () => ({ s: pick([0, 1, 2, 3] as const), m: pick([1, 2, 3, 4] as const) }),

  build: ({ s, m }): Built => {
    const F = fact(m + s);
    const term = s === 0 ? 'r!\\,r' : `(r + ${s})!(r + ${s})`;
    const sumTo = (top: string) => `\\sum_{r=${m}}^{${top}} ${term}`;
    const rhs = (v: string) => `(${plus2019(v, s + 1)})! - ${F}`;
    const statement = `${sumTo('n')} = ${rhs('n')}`;
    const first = m + s, value = F * first;
    const base = `LHS $= ${first}! \\times ${first} = ${value}$, RHS $= (${m} + ${s + 1})! - ${F} = ${value}$`;
    const K = `(k + ${s + 1})!`;
    const stepSum = `${K} - ${F} + ${K}(k + ${s + 1})`;
    const taken = `${K}(k + ${s + 2}) - ${F}`;
    const target = `((k + 1) + ${s + 1})! - ${F}`;
    const range = m === 1 ? 'for all positive integers $n.$' : `for all integers $n \\ge ${m}.$`;
    const conclusion = `If true for $n = k$ then true for $n = k + 1.$ Also shown true for $n = ${m}$, therefore, by induction, true ${m === 1 ? 'for all positive integers $n.$' : `for all integers $n \\ge ${m}.$`}`;
    return {
      questionLines: [
        'Prove by induction that',
        `$${statement}$`,
        range,
      ],
      solutionSteps: [
        `When $n = ${m}$: ${base}, so the result is true when $n = ${m}.$`,
        `Assume true for $n = k$: $${sumTo('k')} = ${rhs('k')}.$ Consider $n = k + 1$: $${sumTo('k + 1')} = \\ldots$`,
        `$${sumTo('k + 1')} = ${stepSum}$`,
        `$= ${taken}$`,
        `$= ${target}.$ ${conclusion}`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `Proven: true for $n = ${m}$, and if true for $n = k$ then $${sumTo('k + 1')} = ${target}$, true for $n = k + 1$; so by induction true ${m === 1 ? 'for all positive integers $n.$' : `for all integers $n \\ge ${m}.$`}`,
      ladder: {
        moves: [
          'An induction proof has a base case, an assumption and a step. What is the base case here?',
          `Show the statement is true for $n = ${m}$, working out both sides.`,
          'Assume it is true for $n = k$, write that sum, and write the sum to $k + 1$ terms that you are aiming for.',
          'Write the sum to $k + 1$ terms as the sum to $k$ terms plus the next term, using the assumption.',
          `Take out $${K}$ as a common factor.`,
          'Write the result in terms of $k + 1$, then write the conclusion in full.',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [
          null,
          `${base}, so the result is true when $n = ${m}$`,
          `$${sumTo('k')} = ${rhs('k')}$ and $${sumTo('k + 1')} = \\ldots$`,
          null,
          null,
          null,
        ],
        watch: { at: 1, text: `"LHS = RHS" alone is not enough for $n = ${m}$. Show the substitution on both sides.` },
      },
    };
  },
};

export const ROUTINES = {
  '2019 Q11': q2019q11,
  '2019 Q14': q2019q14,
};
