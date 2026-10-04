/**
 * Advanced Higher, Methods of Proof: how each 2021 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/methods-of-proof.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int } from '../draw';
import { num } from '../maths/format';
import { gcd } from '../maths/integer';
import { q } from '../maths/rational';

// ── 2021 P2 Q10 ────────────────────────────────────────────────────────────
// By induction from n = 2: the sum of c/((r + a)(r + a - 1)) from r = 2 is
// c(n - 1)/((1 + a)(n + a)), written as C(n - 1)/(D(n + a)) with c/(1 + a) in
// its lowest terms C/D. The paper's a = 0, c = 1: 1/(r(r - 1)), (n - 1)/n.
// The step's numerator is always C((k - 1)(k + a + 1) + (1 + a)) = Ck(k + a),
// as the paper's (k - 1)(k + 1) + 1 = k².

interface P2Q10of2021 { a: number; c: number }

/** `v + a`, or `v` when a is 0. */
const plus = (v: string, a: number) => (a === 0 ? v : `${v} + ${a}`);
/** `(v + a)`, or `v` alone when a is 0. */
const factor = (v: string, a: number) => (a === 0 ? v : `(${v} + ${a})`);
/** A number in front: nothing for 1. */
const times = (c: number) => (c === 1 ? '' : `${c}`);

const q2021p2q10: CardRoutine<P2Q10of2021> = {
  // c up to 4 on the owner's word (the 2021 P2 sheet: "Do number in front up to 4").
  draw: () => ({ a: int(0, 3), c: int(1, 4) }),

  build: ({ a, c }): Built => {
    const g = gcd(c, 1 + a), C = c / g, D = (1 + a) / g;
    // The term's bottom: the paper's r(r - 1), then r(r + 1), (r + 1)(r + 2), (r + 2)(r + 3).
    const bottom = (v: string) => (a === 0 ? `${v}(${v} - 1)` : `${factor(v, a - 1)}(${v} + ${a})`);
    const term = (v: string) => `\\frac{${c}}{${bottom(v)}}`;
    // The right side at v ("n", "k", "2", or "(k + 1)" standing for k + 1).
    const rhs = (v: string) => {
      const top = C === 1 ? `${v} - 1` : `${C}(${v} - 1)`;
      const under = a === 0 ? v.replace(/^\((.*)\)$/, '$1') : D === 1 ? plus(v, a) : `${D}(${plus(v, a)})`;
      return `\\frac{${top}}{${under}}`;
    };
    const sumTo = (top: string) => `\\sum_{r=2}^{${top}} ${term('r')}`;
    const statement = `${sumTo('n')} = ${rhs('n')}`;
    const first = num(q(c, (2 + a) * (1 + a)));
    const base = `LHS $= ${term('2')} = ${first}$ and RHS $= ${rhs('2')} = ${first}$`;
    // The next term, its bottom as the paper's (k + 1)k: (k + a)(k + a + 1) from a = 1.
    const next = a === 0 ? `\\frac{${c}}{(k + 1)k}` : `\\frac{${c}}{(k + ${a})(k + ${a + 1})}`;
    const stepSum = `${rhs('k')} + ${next}`;
    const common = `${times(D)}${factor('k', a)}(k + ${a + 1})`;
    const single = `\\frac{${C === 1 ? '' : `${C}(`}(k - 1)(k + ${a + 1}) + ${1 + a}${C === 1 ? '' : ')'}}{${common}}`;
    const factored = a === 0 ? `\\frac{${times(C)}k^{2}}{${common}}` : `\\frac{${times(C)}k(k + ${a})}{${common}}`;
    const target = rhs('(k + 1)');
    const conclusion = 'If true for $n = k$ then true for $n = k + 1.$ Also shown true for $n = 2$, therefore, by induction, true for all $n \\ge 2.$';
    return {
      questionLines: [
        'Prove by induction that',
        `$${statement}$`,
        'for all positive integers $n \\ge 2.$',
      ],
      solutionSteps: [
        `When $n = 2$: ${base}, so true for $n = 2.$`,
        `Assume true for $n = k$: $${sumTo('k')} = ${rhs('k')}.$ Consider $n = k + 1$: $${sumTo('k + 1')} = \\ldots$`,
        `$${sumTo('k + 1')} = ${stepSum}$`,
        `$= ${single}$`,
        `$= ${factored} = ${target}.$ ${conclusion}`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `Proven: true for $n = 2$, and if true for $n = k$ then $${sumTo('k + 1')} = ${target}$, true for $n = k + 1$; so by induction true for all $n \\ge 2.$`,
      ladder: {
        moves: [
          'An induction proof has a base case, an assumption and a step. Here the sum starts at $r = 2$, so what is the base case?',
          'Show the statement is true for $n = 2$, working out both sides.',
          'Assume it is true for $n = k$, write that sum, and write the sum to $k + 1$ that you are aiming for.',
          'Write the sum to $k + 1$ as the sum to $k$ plus the next term, using the assumption.',
          'Combine the two fractions into one.',
          'Simplify, write it in terms of $k + 1$, then write the conclusion in full.',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [
          null,
          `${base}, so true for $n = 2$`,
          `$${sumTo('k')} = ${rhs('k')}$ and $${sumTo('k + 1')} = \\ldots$`,
          `$\\ldots = ${stepSum}$`,
          `$${single}$`,
          null,
        ],
        watch: { at: 1, text: 'The first case is $n = 2$, not $n = 1$.' },
      },
    };
  },
};

export const ROUTINES = {
  '2021 P2 Q10': q2021p2q10,
};
