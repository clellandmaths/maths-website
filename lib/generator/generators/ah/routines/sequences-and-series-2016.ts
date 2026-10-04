/**
 * Advanced Higher, Sequences and Series: how each 2016 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/sequences-and-series.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { pick } from '../draw';
import { num } from '../maths/format';
import { gcd } from '../maths/integer';
import { q } from '../maths/rational';

// ── 2016 Q2 ────────────────────────────────────────────────────────────────
// A geometric sequence from its second and fifth terms: (a) r³ = T₅/T₂, so
// r; (b) why the sum to infinity exists; (c) a = T₂/r, then a/(1 - r).
// Built from the ratio r = p/m: T₂ = km³ and T₅ = kp³, so a = km⁴/p and the
// sum is km⁵/(p(m - p)), both whole, as the paper's 324 and 486.

interface Q2of2016 { p: number; m: number; k: number }

/**
 * Every ratio p/m with |p| < m from 2 to 5, sharing no factor, each with its
 * k from 1 up: the second term at most 400 (the paper's 108), the fifth from
 * 2 to 20 in size (the paper's 4), and the first term and the sum whole. One
 * list per ratio, so the ratio is drawn first: 1/2 alone has most of the k.
 */
const SETS2016: readonly (readonly Q2of2016[])[] = (() => {
  const out: Q2of2016[][] = [];
  for (let m = 2; m <= 5; m++) {
    for (let p = 1 - m; p < m; p++) {
      if (p === 0 || gcd(Math.abs(p), m) !== 1) continue;
      const sets: Q2of2016[] = [];
      for (let k = 1; k * m ** 3 <= 400; k++) {
        const a = k * m ** 4, s = k * m ** 5, T5 = Math.abs(k * p ** 3);
        if (T5 >= 2 && T5 <= 20 && a % p === 0 && s % (p * (m - p)) === 0) sets.push({ p, m, k });
      }
      if (sets.length) out.push(sets);
    }
  }
  return out;
})();

/** A ratio in brackets when it is negative: `\left(-\frac{1}{3}\right)`. */
const signed = (c: string) => (c.startsWith('-') ? `\\left(${c}\\right)` : c);

const q2016q2: CardRoutine<Q2of2016> = {
  draw: () => pick(pick(SETS2016)),

  build: ({ p, m, k }): Built => {
    const T2 = k * m ** 3, T5 = k * p ** 3;
    const r = num(q(p, m)), cube = num(q(p ** 3, m ** 3));
    const a = (k * m ** 4) / p, S = (k * m ** 5) / (p * (m - p));
    const terms = `ar = ${T2}$ and $ar^{4} = ${T5}`;
    const divided = `\\frac{ar^{4}}{ar} = ${T5 < 0 ? '-' : ''}\\frac{${Math.abs(T5)}}{${T2}}$, so $r^{3} = ${cube}`;
    const condition = `-1 \\lt ${r} \\lt 1`;
    const sum = `S_{\\infty} = \\frac{${a}}{1 - ${signed(r)}} = ${S}`;
    return {
      questionLines: [
        `A geometric sequence has second and fifth terms $${T2}$ and $${T5}$ respectively.`,
        '<b>(a)</b> Calculate the value of the common ratio.',
        '<b>(b)</b> State why the associated geometric series has a sum to infinity.',
        '<b>(c)</b> Find the value of this sum to infinity.',
      ],
      solutionSteps: [
        `<strong>(a)</strong> $${terms}$`,
        `<strong>(a)</strong> $${divided}$`,
        `<strong>(a)</strong> $r = ${r}$`,
        `<strong>(b)</strong> A sum to infinity exists because $${condition}$`,
        `<strong>(c)</strong> $a = ${T2} \\div ${signed(r)} = ${a}$`,
        `<strong>(c)</strong> $${sum}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1],
      finalAnswer: [`(a) $r = ${r}$`, `(b) A sum to infinity exists because $${condition}$`, `(c) $${S}$`].join('<br>'),
      ladder: {
        moves: [
          'Going from the second term to the fifth, how many times do you multiply by $r$?',
          '(a) Write the second and fifth terms in terms of $a$ and $r$.',
          '(a) Divide one by the other.',
          '(a) Solve for $r$.',
          '(b) State the condition on $r$ for a sum to infinity.',
          '(c) Use $r$ to find the first term.',
          '(c) Use the sum to infinity formula.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1],
        shows: [null, `$${terms}$`, `$${divided}$`, null, `$${condition}$`, `$a = ${a}$`, null],
        watch: { at: 4, text: '$r$ must be strictly between $-1$ and 1. Say "strictly", or use $\\lt$ signs.' },
      },
    };
  },
};

export const ROUTINES = {
  '2016 Q2': q2016q2,
};
