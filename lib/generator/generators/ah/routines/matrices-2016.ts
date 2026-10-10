/**
 * Advanced Higher, Matrices: how each 2016 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/matrices.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { nonZero, until } from '../../core/draw';
import { sum } from '../../core/maths/format';
import { pmatrix } from '../../core/maths/matrix';

// ── 2016 Q7 ────────────────────────────────────────────────────────────────
// A = (d₁ 0; λ d₂): (a) det A = d₁d₂; (b) A² = (d₁² 0; sλ d₂²) = sA + tI with
// s = d₁ + d₂ and t = -d₁d₂ (the paper's A + 2I); (c) A⁴ = (sA + tI)² =
// s²A² + 2stA + t²I = (s³ + 2st)A + (s²t + t²)I (the paper's 5A + 6I).

interface Q7of2016 { d1: number; d2: number }

const q2016q7: CardRoutine<Q7of2016> = {
  // The paper's 2 and -1: d₁ and d₂ from -4 to 4, never 0, their sum s never
  // 0 (A² would be a multiple of I alone, with no A in it) and at most 3 in
  // size, as the paper's 1, so A⁴'s numbers stay within 60.
  draw: () => until(
    () => ({ d1: nonZero(-4, 4), d2: nonZero(-4, 4) }),
    ({ d1, d2 }) => {
      const s = d1 + d2, t = -d1 * d2;
      return s !== 0 && Math.abs(s) <= 3 && Math.abs(s ** 3 + 2 * s * t) <= 60 && Math.abs(s * s * t + t * t) <= 60;
    },
  ),

  build: ({ d1, d2 }): Built => {
    const s = d1 + d2, t = -d1 * d2;
    const lam = (k: number) => sum([{ coef: k, body: '\\lambda' }]);
    const A = pmatrix([[d1, 0], ['\\lambda', d2]]);
    const A2 = pmatrix([[d1 * d1, 0], [lam(s), d2 * d2]]);
    const sAtI = sum([{ coef: s, body: 'A' }, { coef: t, body: 'I' }]);
    const compared = `A^{2} = ${pmatrix([[s * d1, 0], [lam(s), s * d2]])} + ${pmatrix([[t, 0], [0, t]])}`;
    const squared = `A^{4} = (${sAtI})^{2} = ${sum([{ coef: s * s, body: 'A^{2}' }, { coef: 2 * s * t, body: 'AI' }, { coef: t * t, body: 'I^{2}' }])}`;
    const replaced = sum([{ coef: s ** 3, body: 'A' }, { coef: s * s * t, body: 'I' }, { coef: 2 * s * t, body: 'A' }, { coef: t * t, body: 'I' }]);
    const A4 = sum([{ coef: s ** 3 + 2 * s * t, body: 'A' }, { coef: s * s * t + t * t, body: 'I' }]);
    const det = d1 * d2;
    const compare = s === 1
      ? '(b) Compare $A^2$ with $A$: what must you add to $A$ to get it?'
      : '(b) Compare $A^2$ with $A$: what multiple of $A$, and what multiple of $I$, add to give it?';
    return {
      questionLines: [
        `A is the matrix $${A}.$`,
        '<b>(a)</b> Find the determinant of matrix A.',
        '<b>(b)</b> Show that $A^{2}$ can be expressed in the form $pA + qI$, stating the values of $p$ and $q.$',
        '<b>(c)</b> Obtain a similar expression for $A^{4}.$',
      ],
      solutionSteps: [
        `<strong>(a)</strong> $\\det A = ${d1} \\times ${d2 < 0 ? `(${d2})` : d2} - 0 \\times \\lambda = ${det}$`,
        `<strong>(b)</strong> $A^{2} = ${A2}$`,
        `<strong>(b)</strong> $${compared}$, so $A^{2} = ${sAtI}$`,
        `<strong>(b)</strong> $p = ${s}$ and $q = ${t}$`,
        `<strong>(c)</strong> $${squared} = ${replaced}$`,
        `<strong>(c)</strong> $A^{4} = ${A4}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1],
      finalAnswer: [`(a) $${det}$`, `(b) $A^{2} = ${sAtI}$, so $p = ${s}$ and $q = ${t}$`, `(c) $${A4}$`].join('<br>'),
      ladder: {
        moves: [
          'You will find $A^2$ directly. How could you write it using $A$ and $I$?',
          '(a) Find the determinant of $A$.',
          '(b) Multiply $A$ by itself.',
          compare,
          '(b) Write $A^2$ in the form $pA + qI$, and state $p$ and $q$.',
          '(c) Square your expression from (b).',
          '(c) Replace $A^2$ again, and simplify.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1],
        shows: [null, null, `$A^{2} = ${A2}$`, `$${compared}$, $A^{2} = ${sAtI}$`, null, `$${squared} = ${replaced}$`, null],
        watch: { at: 4, text: 'State the values of $p$ and $q$ explicitly.' },
      },
    };
  },
};

export const ROUTINES = {
  '2016 Q7': q2016q7,
};
