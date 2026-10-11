/**
 * Advanced Higher, Methods of Proof: how each 2017 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/methods-of-proof.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { pick } from '../../core/draw';
import { sum } from '../../core/maths/format';

// ── 2017 Q13 ───────────────────────────────────────────────────────────────
// "If nᵖ + b is even (or odd), then n is …", proved by its contrapositive,
// one case, as the paper's "if n² is even, then n is even": p 2 or 3, b from 0
// to 3. nᵖ + b has n's parity flipped by an odd b, so the statement says n
// has b's parity when the expression is even, and the other when it is odd.

interface Q13of2017 { p: 2 | 3; b: 0 | 1 | 2 | 3; given: 'even' | 'odd' }

const other2017 = (parity: 'even' | 'odd') => (parity === 'even' ? 'odd' : 'even');

/** The expression with n written out, expanded, and as 2(…) or 2(…) + 1. */
function worked2017(p: 2 | 3, b: number, nOdd: boolean) {
  const nText = nOdd ? '2k + 1' : '2k';
  const plusB = b ? ` + ${b}` : '';
  const total = nOdd ? 1 + b : b;
  // nᵖ's terms with n = 2k or 2k + 1, its constant left out (it joins b).
  const terms = p === 2
    ? (nOdd ? [[4, 'k^{2}'], [4, 'k']] : [[4, 'k^{2}']])
    : (nOdd ? [[8, 'k^{3}'], [12, 'k^{2}'], [6, 'k']] : [[8, 'k^{3}']]);
  const expanded = sum([...terms.map(([c, body]) => ({ coef: c as number, body: body as string })), { coef: total, body: '' }]);
  const inner = sum([...terms.map(([c, body]) => ({ coef: (c as number) / 2, body: body as string })), { coef: Math.floor(total / 2), body: '' }]);
  const odd = total % 2 === 1;
  return { nText, sub: `(${nText})^{${p}}${plusB}`, expanded, inner, odd, form: `2(${inner})${odd ? ' + 1' : ''}` };
}

const q2017q13: CardRoutine<Q13of2017> = {
  draw: () => ({ p: pick([2, 3] as const), b: pick([0, 1, 2, 3] as const), given: pick(['even', 'odd'] as const) }),

  build: ({ p, b, given }): Built => {
    const E = b ? `n^{${p}} + ${b}` : `n^{${p}}`;
    const bParity = b % 2 ? 'odd' : 'even';
    // The statement: n has b's parity when E is even, the other when E is odd.
    const nParity = given === 'even' ? bParity : other2017(bParity);
    const assume = other2017(nParity), concl = other2017(given);
    const w = worked2017(p, b, assume === 'odd');
    const contra = `If $n$ is ${assume} then $${E}$ is ${concl}`;
    const form = `$n = ${w.nText}$, $k \\in \\mathbb{Z}$`;
    const shown = `$${E} = ${w.sub} = ${w.expanded} = ${w.form}$, which is ${concl}, since $${w.inner}$ is an integer`;
    const verb = p === 2 ? 'Square' : 'Cube';
    const result = w.odd ? 'one more than an even number' : 'even, 2 times an integer';
    return {
      questionLines: [
        'Let $n$ be an integer.',
        `Using proof by contrapositive, show that if $${E}$ is ${given}, then $n$ is ${nParity}.`,
      ],
      solutionSteps: [
        `The contrapositive of the original statement is: ${contra}.`,
        `Let $n = ${w.nText}$, $k \\in \\mathbb{Z}.$`,
        `${shown}.`,
        'The contrapositive statement is true, therefore the original statement is true.',
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: [
        `The contrapositive is: "${contra}."`,
        `Let $n = ${w.nText}$, $k \\in \\mathbb{Z}.$`,
        `${shown}.`,
        'Since the contrapositive statement is true, the original statement is true.',
      ].join('<br>'),
      ladder: {
        moves: [
          'A contrapositive swaps the two halves and negates both. What are the halves here?',
          'Write the contrapositive.',
          `Write ${assume === 'odd' ? 'an odd' : 'an even'} $n$ in general form.`,
          `${verb} it${b ? `, add ${b},` : ''} and show the result is ${result}.`,
          'Say what that proves: the contrapositive, and so the original statement.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, `The contrapositive of the original statement is: ${contra}`, form, `$${E} = ${w.form}$ which is ${concl}`, null],
        watch: { at: 1, text: `The contrapositive of "if $${E}$ is ${given} then $n$ is ${nParity}" starts "if $n$ is ${assume}".` },
      },
    };
  },
};

export const ROUTINES = {
  '2017 Q13': q2017q13,
};
