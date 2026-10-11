/**
 * Advanced Higher, Matrices: how each 2021 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/matrices.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int, nonZero, sign, until } from '../../core/draw';
import { pmatrix } from '../../core/maths/matrix';
import { gcd } from '../../core/maths/integer';
import { sum } from '../../core/maths/format';
import { q } from '../../core/maths/rational';

// ── 2021 P1 Q2 ─────────────────────────────────────────────────────────────
// A 2 × 2, B 3 × 2: (a) B' and AB'; (b) det A and A^{-1}, written as the
// paper writes it, 1/|det A| in front and the sign taken into the matrix.

type Four = [number, number, number, number];
type Six = [number, number, number, number, number, number];

interface P1Q2of2021 { A: Four; B: Six }

/** Row i of A times column j of B', that is row j of B. */
function productAB(A: Four, B: Six): number[][] {
  const [a, b, c, d] = A;
  const rowsOfB = [[B[0], B[1]], [B[2], B[3]], [B[4], B[5]]];
  return [[a, b], [c, d]].map(([p, r]) => rowsOfB.map(([s, t]) => p * s + r * t));
}

const q2021p1q2: CardRoutine<P1Q2of2021> = {
  draw: () => until(
    () => ({
      // A from its determinant: |det| from 2 to 5 either sign, as the paper's -2.
      A: until(
        () => {
          const det = sign() * int(2, 5), a = nonZero(-7, 7), b = nonZero(-7, 7), d = nonZero(-7, 7);
          return [a, b, (a * d - det) / b, d] as Four;
        },
        ([a, b, c, d]) => Number.isInteger(c) && c !== 0 && Math.abs(c) <= 7
          // Nothing to cancel with the determinant, so 1/|det| stays in front.
          && gcd(gcd(gcd(a, b), gcd(c, d)), a * d - b * c) === 1,
      ),
      B: [int(-5, 5), int(-5, 5), int(-5, 5), int(-5, 5), int(-5, 5), int(-5, 5)] as Six,
    }),
    // B has at most one zero, as the paper's; AB' has none, and every entry within 30.
    // No product worked by hand bigger than the paper's biggest, 7 × 3 = 21
    // (the owner on 2023 P1: "biggest should be no larger than paper").
    ({ A, B }) => B.filter(v => v === 0).length <= 1
      && productAB(A, B).flat().every(v => v !== 0 && Math.abs(v) <= 30)
      && A.every(a => B.every(v => Math.abs(a * v) <= 21))
      && Math.abs(A[0] * A[3]) <= 21 && Math.abs(A[1] * A[2]) <= 21,
    1000,
  ),

  build: ({ A, B }): Built => {
    const [a, b, c, d] = A;
    const det = a * d - b * c;
    const s = det < 0 ? -1 : 1;
    const Am = pmatrix([[a, b], [c, d]]);
    const Bm = pmatrix([[B[0], B[1]], [B[2], B[3]], [B[4], B[5]]]);
    const Bt = pmatrix([[B[0], B[2], B[4]], [B[1], B[3], B[5]]]);
    const AB = pmatrix(productAB(A, B));
    const bracket = (v: number) => (v < 0 ? `(${v})` : String(v));
    const detWorking = `\\det A = ${bracket(a)} \\times ${bracket(d)} - ${bracket(b)} \\times ${bracket(c)} = ${det}`;
    const inverse = `\\frac{1}{${Math.abs(det)}}${pmatrix([[s * d, -s * b], [-s * c, s * a]])}`;
    return {
      questionLines: [
        'Matrices $A$ and $B$ are defined as follows',
        `$A = ${Am}$,`,
        `$B = ${Bm}.$`,
        '<b>(a)</b> Find $AB\'$, where $B\'$ is the transpose of $B.$',
        '<b>(b)</b> Find $A^{-1}.$',
      ],
      solutionSteps: [
        `<strong>(a)</strong> $B' = ${Bt}$`,
        `<strong>(a)</strong> $AB' = ${Am}${Bt} = ${AB}$`,
        `<strong>(b)</strong> $${detWorking}$`,
        `<strong>(b)</strong> $A^{-1} = ${inverse}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `(a) $AB' = ${AB}$<br>(b) $A^{-1} = ${inverse}$`,
      ladder: {
        moves: [
          'Can you multiply a $2 \\times 2$ matrix by a $2 \\times 3$ one? What does transposing $B$ do to its size?',
          '(a) Write $B\'$ by swapping the rows and columns of $B$.',
          '(a) Multiply $A$ by $B\'$, row by column.',
          '(b) Find the determinant of $A$.',
          '(b) Swap the leading diagonal, negate the other two entries, and divide by the determinant.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, `$B' = ${Bt}$`, null, `$\\det A = ${det}$`, null],
        watch: { at: 1, text: 'Transpose $B$ first. $AB$ itself cannot be multiplied out.' },
      },
    };
  },
};

// ── 2021 P2 Q5 ─────────────────────────────────────────────────────────────
// A² = pA + qI: (a) A⁴ = (pA + qI)² = (p³ + 2pq)A + (p²q + q²)I;
// (b) A = pI + qA⁻¹, so A⁻¹ = (1/q)A - (p/q)I.

interface P2Q5of2021 { p: number; q: number }

const q2021p2q5: CardRoutine<P2Q5of2021> = {
  draw: () => until(
    () => ({ p: nonZero(-5, 5), q: sign() * int(2, 9) }),
    // Both of A⁴'s coefficients nonzero, as 28 and 45.
    ({ p, q: c }) => p * p + 2 * c !== 0 && p * p + c !== 0,
  ),

  build: ({ p, q: c }): Built => {
    const lin = (x: number | ReturnType<typeof q>, y: number | ReturnType<typeof q>) =>
      sum([{ coef: x, body: 'A' }, { coef: y, body: 'I' }]);
    const given = lin(p, c);
    const squared = sum([{ coef: p * p, body: 'A^{2}' }, { coef: 2 * p * c, body: 'A' }, { coef: c * c, body: 'I' }]);
    const substituted = `${p * p === 1 ? '' : p * p}(${given})${2 * p * c < 0 ? ' - ' : ' + '}${Math.abs(2 * p * c)}A + ${c * c}I`;
    const fourth = lin(p ** 3 + 2 * p * c, p * p * c + c * c);
    const inverse = lin(q(1, c), q(-p, c));
    return {
      questionLines: [
        `A non-singular matrix $A$ satisfies the equation $A^{2} = ${given}$, where $I$ is the identity matrix.`,
        '<b>(a)</b> Express $A^{4}$ in the form $pA + qI$, where $p, q \\in \\mathbb{Z}.$',
        '<b>(b)</b> Express $A^{-1}$ in the form $rA + sI$, where $r, s \\in \\mathbb{Q}.$',
      ],
      solutionSteps: [
        `<strong>(a)</strong> $A^{4} = (A^{2})^{2} = (${given})^{2} = ${squared}$`,
        `<strong>(a)</strong> $A^{4} = ${substituted} = ${fourth}$`,
        `<strong>(b)</strong> $A^{-1}A^{2} = ${sum([{ coef: p, body: 'A^{-1}A' }, { coef: c, body: 'A^{-1}I' }])}$, so $A = ${sum([{ coef: p, body: 'I' }, { coef: c, body: 'A^{-1}' }])}$`,
        `<strong>(b)</strong> $A^{-1} = ${inverse}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `(a) $A^{4} = ${fourth}$<br>(b) $A^{-1} = ${inverse}$`,
      ladder: {
        moves: [
          'You know $A^2$ in terms of $A$. How can you build $A^4$ from that?',
          '(a) Write $A^4$ as $(A^2)^2$, or as $A^2$ times $A^2$, and expand.',
          '(a) Replace each $A^2$ that appears, and collect terms.',
          '(b) Multiply the given identity by $A^{-1}$.',
          '(b) Make $A^{-1}$ the subject.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [
          null,
          `$${squared}$`,
          null,
          `$A^{-1}A^{2} = ${sum([{ coef: p, body: 'A^{-1}A' }, { coef: c, body: 'A^{-1}I' }])}$ or $A(${sum([{ coef: 1, body: 'A' }, { coef: -p, body: 'I' }])}) = ${c}I$`,
          null,
        ],
        watch: { at: 3, text: 'You cannot divide by a matrix. Multiply by $A^{-1}$ instead.' },
      },
    };
  },
};

export const ROUTINES = {
  '2021 P1 Q2': q2021p1q2,
  '2021 P2 Q5': q2021p2q5,
};
