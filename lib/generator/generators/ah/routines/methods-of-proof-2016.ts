/**
 * Advanced Higher, Methods of Proof: how each 2016 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/methods-of-proof.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { pick } from '../../core/draw';
import { poly, sum } from '../../core/maths/format';

// ── 2016 Q5 ────────────────────────────────────────────────────────────────
// By induction: the sum of r(3r + b) from 1 to n is n(n + 1)(n + c), with b
// odd and c = (1 + b)/2. The paper's b = -1, c = 0: n²(n + 1). The step:
// k(k + 1)(k + c) + (k + 1)(3k + 3 + b) = (k + 1)(k + 2)(k + 1 + c).

interface Q5of2016 { b: number }

/**
 * b odd, so the sum factorises with whole numbers, as the paper's; never a
 * multiple of 3, where r(3r + b) has a factor a paper would take out; from
 * -1 (the paper) to 25, so every term is positive, as the paper's, and c runs
 * from 0 to 13. 23 and 25 added so nine remain once the paper's own is kept
 * out (the owner on the AH widening sheet, 2026-10-10: "A").
 */
const B2016 = [-1, 1, 5, 7, 11, 13, 17, 19, 23, 25];

/** n(n + 1)(n + c) as a paper writes it: `n^{2}(n + 1)`, `n(n + 1)^{2}`, `n(n + 1)(n + 3)`. */
function rhs2016(c: number, v: string): string {
  const plus = (k: number) => (v.length > 1 ? `(${v}) ${k < 0 ? '-' : '+'} ${Math.abs(k)}` : poly([1, k], v));
  const bare = v.length > 1 ? `(${v})` : v;
  if (c === 0) return `${bare}^{2}(${plus(1)})`;
  if (c === 1) return `${bare}(${plus(1)})^{2}`;
  return `${bare}(${plus(1)})(${plus(c)})`;
}

const q2016q5: CardRoutine<Q5of2016> = {
  draw: () => ({ b: pick(B2016) }),

  build: ({ b }): Built => {
    const c = (1 + b) / 2;
    const term = `r(${sum([{ coef: 3, body: 'r' }, { coef: b, body: '' }])})`;
    const sumTo = (top: string) => `\\sum_{r=1}^{${top}}${term}`;
    const next = `(k + 1)(${sum([{ coef: 3, body: '(k + 1)' }, { coef: b, body: '' }])})`;
    const nextSimple = `(k + 1)(${poly([3, 3 + b], 'k')})`;
    const left = 3 + b;
    const base = `LHS $= 1(3 ${b < 0 ? '-' : '+'} ${Math.abs(b)}) = ${left}$ and RHS $= ${rhs2016(c, '1')} = ${left}$`;
    const quadratic = poly([1, c + 3, 3 + b], 'k');
    const factors = c === 0 ? '(k + 1)(k + 1)(k + 2)' : `(k + 1)(k + 2)(${poly([1, 1 + c], 'k')})`;
    const stepped = `${rhs2016(c, 'k')} + ${nextSimple} = (k + 1)\\left[${quadratic}\\right] = ${factors}`;
    const target = rhs2016(c, 'k + 1');
    const conclusion = 'Thus if true for $n = k$ then true for $n = k + 1$, but since true for $n = 1$, then by induction true for all $n \\in \\mathbb{N}.$';
    return {
      questionLines: [`Prove by induction that $${sumTo('n')} = ${rhs2016(c, 'n')}$, $\\forall n \\in \\mathbb{N}.$`],
      solutionSteps: [
        `When $n = 1$: ${base}, so the statement is true for $n = 1.$`,
        `Assume true for $n = k$: $${sumTo('k')} = ${rhs2016(c, 'k')}.$ Consider $n = k + 1$: $${sumTo('k+1')} = ${sumTo('k')} + ${next}$`,
        `$= ${stepped}$`,
        `$= ${target}.$ ${conclusion}`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `Proven: true for $n = 1$, and if true for $n = k$ then $${sumTo('k+1')} = ${target}$, true for $n = k + 1$; so by induction true $\\forall n \\in \\mathbb{N}.$`,
      ladder: {
        moves: [
          'An induction proof has a base case, an assumption and a step. What is the base case here?',
          'Show the statement is true for $n = 1$, working out both sides.',
          'Assume it is true for $n = k$, write that sum, and write the sum to $k + 1$ terms.',
          'Add the next term to the assumption, and take out the common factor $(k + 1)$. Factorise what is left.',
          'Write the result in terms of $k + 1$, then write the conclusion in full.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [
          null,
          `${base}, so true for $n = 1$`,
          `$${sumTo('k')} = ${rhs2016(c, 'k')}$ and $${sumTo('k+1')} = ${sumTo('k')} + ${next}$`,
          null,
          null,
        ],
        watch: { at: 2, text: 'Write "assume true for $n = k$". Phrases such as "consider $n = k$" do not earn the mark.' },
      },
    };
  },
};

// ── 2016 Q10 ───────────────────────────────────────────────────────────────
// A: "if p is prime then so is ap + b", false, by the first prime that makes
// it composite; B: "if n has remainder r on division by m then n³ has
// remainder r too", true, from (ma + r)³ = m(…) + r. The paper's A is 2p + 1
// (p = 7, 15) and B is m = 3, r = 1.

interface Q10of2016 { a: number; b: number; m: number; r: number }

const PRIMES = [2, 3, 5, 7, 11, 13];
const isPrime = (v: number) => v > 1 && Array.from({ length: Math.floor(Math.sqrt(v)) - 1 }, (_, i) => i + 2).every(d => v % d !== 0);

/**
 * A: ap + b with a 2, 4 or 6 and b odd from -5 to 19, so every value is odd
 * and no counterexample is a plain even number, as the paper's 2p + 1; the
 * first prime to fail is 3 to 11 (the paper's 7), so a pupil tries a few,
 * and 2 gives a prime, so the first try never fails.
 */
const A2016: readonly { a: number; b: number; p: number }[] = (() => {
  const out: { a: number; b: number; p: number }[] = [];
  for (const a of [2, 4, 6]) {
    for (let b = -5; b <= 19; b += 2) {
      const p = PRIMES.find(v => !isPrime(a * v + b));
      if (p !== undefined && p >= 3 && p <= 11 && isPrime(a * 2 + b)) out.push({ a, b, p });
    }
  }
  return out;
})();

/** B: m from 2 to 5 and r with r³ leaving r again, as the paper's 1 on 3 (r ≡ ±1). */
const B2016_10: readonly { m: number; r: number }[] = [
  { m: 2, r: 1 }, { m: 3, r: 1 }, { m: 3, r: 2 }, { m: 4, r: 1 }, { m: 4, r: 3 }, { m: 5, r: 1 }, { m: 5, r: 4 },
];

const q2016q10: CardRoutine<Q10of2016> = {
  draw: () => {
    const { a, b } = pick(A2016), { m, r } = pick(B2016_10);
    return { a, b, m, r };
  },

  build: ({ a, b, m, r }): Built => {
    const p = PRIMES.find(v => !isPrime(a * v + b))!;
    const value = a * p + b;
    const f = Array.from({ length: value }, (_, i) => i + 2).find(d => value % d === 0)!;
    const expr = sum([{ coef: a, body: 'p' }, { coef: b, body: '' }]);
    const at = `${a}(${p}) ${b < 0 ? '-' : '+'} ${Math.abs(b)} = ${value}`;
    const counter = `Choose $p = ${p}$: $${at}$, and since $${value} = ${f} \\times ${value / f}$, it is not prime, so the statement is false.`;
    const n = `n = ${sum([{ coef: m, body: 'a' }, { coef: r, body: '' }])}`;
    const cubed = poly([m ** 3, 3 * m * m * r, 3 * m * r * r, r ** 3], 'a');
    const inner = poly([m * m, 3 * m * r, 3 * r * r, (r ** 3 - r) / m], 'a');
    const split = `${m}(${inner}) + ${r}`;
    const proof = `$n^{3} = ${split}$, so $n^{3}$ has remainder ${r} when divided by ${m}: the statement is true.`;
    return {
      questionLines: [
        'For each of the following statements, decide whether it is true or false.',
        'If true, give a proof; if false, give a counterexample.',
        `A. If a positive integer $p$ is prime, then so is $${expr}.$`,
        `B. If a positive integer $n$ has remainder ${r} when divided by ${m}, then $n^{3}$ also has remainder ${r} when divided by ${m}.`,
      ],
      solutionSteps: [
        `A: ${counter}`,
        `B: $${n}$, $a \\in \\mathbb{N}_0$`,
        `B: $n^{3} = (${n.slice(4)})^{3} = ${cubed}$`,
        `B: ${proof}`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: [
        `A: False. Counterexample: let $p = ${p}$, then $${expr.replace('p', `(${p})`)} = ${value}$, which is not prime.`,
        `B: True. Proof: let $${n}$, then $n^{3} = ${cubed} = ${split}$, which leaves a remainder of ${r} when divided by ${m}.`,
      ].join('<br>'),
      ladder: {
        moves: [
          'To show a statement false, one example is enough. To show one true, you need an argument that covers every case.',
          `A: Try primes until $${expr}$ is not prime, and say why it is not.`,
          `B: Write a number with remainder ${r} on division by ${m} in general form.`,
          'B: Expand its cube.',
          `B: Write the cube as ${m} times something plus ${r}, and state the conclusion.`,
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, counter, `$${n}$, $a \\in \\mathbb{N}_0$`, `$n^{3} = ${cubed}$`, null],
        watch: { at: 3, text: `Expand $(${n.slice(4)})^3$ carefully: it has four terms.` },
      },
    };
  },
};

export const ROUTINES = {
  '2016 Q5': q2016q5,
  '2016 Q10': q2016q10,
};
