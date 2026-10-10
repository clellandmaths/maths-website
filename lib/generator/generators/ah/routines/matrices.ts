/**
 * Advanced Higher, Matrices: how each card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/matrices.ts` under the same label.
 */
import type { Built, CardRoutine } from '../types';
import { distinct, int, nonZero, pick, until } from '../../core/draw';
import { joinTerms, piTimes, poly, sum } from '../../core/maths/format';
import { gcd } from '../../core/maths/integer';
import { adj2, det2, inverse2, m2, pmatrix } from '../../core/maths/matrix';
import { isInt, q } from '../../core/maths/rational';

// ── 2026 P1 Q5 ─────────────────────────────────────────────────────────────
// A = (p q; r x): det A, then det B from det AB, then B from B^{-1}.

interface Q5 { p: number; qq: number; r: number; b: [number, number, number, number] }

const bracketed = (v: number) => (v < 0 ? `(${v})` : `${v}`);

const q2026p1q5: CardRoutine<Q5> = {
  draw: () => {
    const { p, qq, r } = until(
      () => ({ p: int(2, 5), qq: nonZero(-6, 6), r: nonZero(-6, 6) }),
      ({ p, qq, r }) => gcd(p, qq * r) === 1,
    );
    const b = until(
      () => [int(1, 9), int(1, 9), int(1, 9), int(1, 9)] as [number, number, number, number],
      ([a, bb, c, d]) => {
        const det = a * d - bb * c;
        if (det < 2 || det > 6) return false;
        const inv = inverse2(m2(a, bb, c, d));
        return inv.flat().some(v => !isInt(v));
      },
    );
    return { p, qq, r, b };
  },

  build: ({ p, qq, r, b }): Built => {
    const A = pmatrix([[p, qq], [r, 'x']]);
    const detA = poly([p, -qq * r]);
    const B = m2(...b);
    const d = Number(det2(B).n);
    const detAB = poly([d * p, -d * qq * r]);
    const Binv = pmatrix(inverse2(B));
    const rewritten = `\\frac{1}{${d}}${pmatrix(adj2(B))}`;
    const Bm = pmatrix(B);

    return {
      questionLines: [
        `Matrix $A$ is defined by $A = ${A}.$`,
        '<b>(a)</b> State an expression for the determinant of $A$ in terms of $x.$',
        '',
        `Matrix $A$ is multiplied by matrix $B$ such that $\\det AB = ${detAB}.$`,
        '<b>(b)</b> State the determinant of $B.$',
        '',
        `The inverse of matrix $B$ is $B^{-1} = ${Binv}.$`,
        '<b>(c)</b> Find matrix $B.$',
      ],
      solutionSteps: [
        `<strong>(a)</strong> $\\det A = ${p}x - ${bracketed(qq)} \\times ${bracketed(r)} = ${detA}$`,
        `<strong>(b)</strong> $\\det AB = \\det A \\det B$, so $(${detA})\\det B = ${detAB} = ${d}(${detA})$ and $\\det B = ${d}$`,
        `<strong>(c)</strong> $B^{-1} = ${rewritten}$`,
        `<strong>(c)</strong> $B = ${Bm}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `(a) $\\det A = ${detA}$<br>(b) $\\det B = ${d}$<br>(c) $B = ${Bm}$`,
      ladder: {
        moves: [
          'What does multiplying two matrices do to their determinants?',
          '(a) Use $ad - bc$ on $A$.',
          `(b) Use $\\det AB = \\det A \\times \\det B$, and compare $${detAB}$ with your answer to (a).`,
          // The working's method, the scheme's method 1 (the owner, full read 2026-10-05).
          '(c) Write $B^{-1}$ as $\\frac{1}{\\det B}$ times a matrix, using $\\det B$ from (b).',
          '(c) Swap and negate that matrix\'s entries: that is $B$.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, null, null, `$${rewritten}$`, null],
        watch: { at: 3, text: 'You cannot divide by a matrix. Invert $B^{-1}$ instead.' },
      },
    };
  },
};

// ── 2025 P1 Q4 ─────────────────────────────────────────────────────────────
// (a) kA + mB; (b) A'B, its determinant in λ, and the λ that makes it singular.
// A keeps the paper's zero below its diagonal, so the top row of A'B has no λ.

interface P1Q4 {
  a11: number; a12: number; a22: number;
  b11: number; b12: number; b21: number;
  /** The λ that makes A'B singular: b12 b21 / b11, whole. */
  lambda: number;
  k: number; m: number;
}

const L = '\\lambda';

/** A number and a multiple of λ, the number first as the paper writes `3 + 2\lambda`. */
const withLambda = (c: number, l: number) => sum([{ coef: c, body: '' }, { coef: l, body: L }]);

const q2025p1q4: CardRoutine<P1Q4> = {
  draw: () => until(
    () => {
      // The paper's signs: A's first entry either sign (the paper's -3), the
      // rest positive, so λ is positive as the paper's 5.
      const b11 = int(1, 5), b12 = int(1, 6), b21 = int(1, 6);
      const [k, m] = distinct([2, 3, 4], 2);
      return { a11: nonZero(-4, 4), a12: int(1, 4), a22: int(1, 3), b11, b12, b21, lambda: (b12 * b21) / b11, k, m };
    },
    ({ a11, a12, a22, b11, b12, b21, lambda, k, m }) => {
      if (!Number.isInteger(lambda) || lambda > 10) return false;
      // No zero in the working but the paper's own, and entries a pupil
      // works without a calculator: within 30.
      const entries = [k * a11 + m * b11, k * a12 + m * b12, m * b21, k * a22, a11 * b11, a11 * b12, a12 * b11 + a22 * b21, a12 * b12];
      // And the determinant's first factor is a number, as -6(4 + λ), never 1(…).
      return entries.every(v => v !== 0 && Math.abs(v) <= 30) && Math.abs(a11 * b11) > 1;
    },
  ),

  build: ({ a11, a12, a22, b11, b12, b21, lambda, k, m }): Built => {
    const A = pmatrix([[a11, a12], [0, a22]]);
    const B = pmatrix([[b11, b12], [b21, L]]);
    const sumAB = pmatrix([[k * a11 + m * b11, k * a12 + m * b12], [m * b21, withLambda(k * a22, m)]]);
    const At = pmatrix([[a11, 0], [a12, a22]]);
    const p = a11 * b11, qq = a11 * b12, r = a12 * b11 + a22 * b21;
    const s = withLambda(a12 * b12, a22);
    const AtB = pmatrix([[p, qq], [r, s]]);
    const bracketed = (v: number) => (v < 0 ? `(${v})` : `${v}`);
    const detExpr = `${p}(${s}) - ${bracketed(qq)}(${r})`;
    // p(c + a22 λ) - q r, which is a11 a22 (b11 λ - b12 b21).
    const detSimple = withLambda(p * a12 * b12 - qq * r, p * a22);
    const answerB = `${L} = ${lambda}`;

    return {
      questionLines: [
        `Matrices $A$ and $B$ are defined by $A = ${A}$ and $B = ${B}$ where $${L} \\in \\mathbb{R}.$`,
        `<b>(a)</b> Find $${k}A + ${m}B.$`,
        '<b>(b)</b> (i) Find $A\'B$, where $A\'$ is the transpose of $A.$',
        '(ii) Find an expression for the determinant of $A\'B.$',
        `(iii) Determine the value of $${L}$ such that $A'B$ is singular.`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> $${k}A + ${m}B = ${sumAB}$`,
        `<strong>(b)(i)</strong> $A' = ${At}$`,
        `<strong>(b)(i)</strong> $A'B = ${AtB}$`,
        `<strong>(b)(ii)</strong> $\\det(A'B) = ${detExpr} = ${detSimple}$`,
        `<strong>(b)(iii)</strong> $A'B$ is singular when its determinant is zero: $${detExpr} = 0$`,
        `<strong>(b)(iii)</strong> $${answerB}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1],
      finalAnswer: `(a) $${sumAB}$<br>(b)(i) $${AtB}$<br>(b)(ii) $${detExpr}$ or $${detSimple}$<br>(b)(iii) $${answerB}$`,
      ladder: {
        moves: [
          'Which matrix operations here need the sizes to match, and which need rows times columns?',
          '(a) Multiply each matrix by its number, then add entry by entry.',
          '(b)(i) Write the transpose of $A$ by swapping its rows and columns.',
          '(b)(i) Multiply $A\'$ by $B$, row by column.',
          '(b)(ii) Use $ad - bc$ on $A\'B$.',
          '(b)(iii) What is the determinant of a singular matrix? Set up that equation.',
          `(b)(iii) Solve it for $${L}$.`,
        ],
        marks: [0, 1, 1, 1, 1, 1, 1],
        shows: [null, null, `$${At}$`, null, null, `$${detExpr} = 0$`, null],
        watch: { at: 2, text: 'Transpose $A$ before multiplying. Using $A$ itself changes every entry of the product.' },
      },
    };
  },
};

// ── 2025 P2 Q8 ─────────────────────────────────────────────────────────────
// A² = pA + qI with q = ±1: (a) A³ = (p² + q)A + pqI; (b) A^{-1} = q(A - pI)

interface P2Q8 { p: number; qq: 1 | -1 }

const q2025p2q8: CardRoutine<P2Q8> = {
  // Never p² + q = 0 (p = ±1, q = -1): A³ would be -I, no A in "pA + qI".
  draw: () => until(() => ({ p: nonZero(-9, 9), qq: pick([-1, 1] as const) }), ({ p, qq }) => p * p + qq !== 0),

  build: ({ p, qq }): Built => {
    const AI = (a: number, i: number) => sum([{ coef: a, body: 'A' }, { coef: i, body: 'I' }]);
    const given = AI(p, qq);
    const expanded = sum([{ coef: p, body: 'A^{2}' }, { coef: qq, body: 'AI' }]);
    const cube = AI(p * p + qq, p * qq);
    // A = pI + qA^{-1}, so A^{-1} = q(A - pI), with q = ±1.
    const inverse = sum([{ coef: -p * qq, body: 'I' }, { coef: qq, body: 'A' }]);
    const rearranged = `A = ${sum([{ coef: p, body: 'I' }, { coef: qq, body: 'A^{-1}' }])}`;
    return {
      questionLines: [
        'The matrix $A$ has the following property:',
        '',
        `$A^{2} = ${given}$, where $I$ is the identity matrix.`,
        '',
        '<b>(a)</b> Express $A^{3}$ in the form $pA + qI$, where $p, q \\in \\mathbb{R}.$',
        'Matrix $A$ is non-singular.',
        '<b>(b)</b> Find a similar expression for $A^{-1}$ in terms of $A$ and $I.$',
      ],
      solutionSteps: [
        `<strong>(a)</strong> $A^{3} = A \\times A^{2} = A(${given}) = ${expanded}$`,
        // A p of 1 or -1 is not written: "(A + I) + A", "-(-A + I) + A" (the owner, full read 2026-10-05).
        `<strong>(a)</strong> $A^{3} = ${p === 1 ? '' : p === -1 ? '-' : p}(${given})${qq < 0 ? ' - ' : ' + '}A = ${cube}$`,
        `<strong>(b)</strong> $A^{-1}A^{2} = A^{-1}(${given})$`,
        `<strong>(b)</strong> $${rearranged}$, so $A^{-1} = ${inverse}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `(a) $A^{3} = ${cube}$<br>(b) $A^{-1} = ${inverse}$`,
      ladder: {
        moves: [
          'You know $A^{2}$ in terms of $A$. How can you get $A^{3}$ from that?',
          '(a) Multiply both sides of the identity by $A$ and expand.',
          '(a) Replace the $A^{2}$ that appears, and collect terms into the required form.',
          '(b) Multiply the given identity by $A^{-1}$.',
          '(b) Simplify each side and make $A^{-1}$ the subject.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, `$${expanded}$`, null, `$A^{-1}A^{2} = A^{-1}(${given})$`, null],
        watch: { at: 3, text: 'You cannot divide by a matrix. Multiply by $A^{-1}$ instead.' },
      },
    };
  },
};

// ── 2024 P1 Q4 ─────────────────────────────────────────────────────────────
// (a) A^{-1} from det A and the adjugate; (b) M = A^{-1}B from AM = B.
// Built from the answer: M whole, then B = AM.

type Four = [number, number, number, number];
interface P1Q4of2024 { A: Four; M: Four }

const times = ([a, b, c, d]: Four, [e, f, g, h]: Four): Four => [a * e + b * g, a * f + b * h, c * e + d * g, c * f + d * h];
const rows = ([a, b, c, d]: Four) => [[a, b], [c, d]];

const q2024p1q4: CardRoutine<P1Q4of2024> = {
  draw: () => until(
    () => ({
      // A from its determinant: det from 2 to 9, as 7, so c = (ad - det)/b.
      A: until(
        () => {
          const det = int(2, 9), a = int(1, 12), b = int(1, 12), d = int(1, 12);
          return [a, b, (a * d - det) / b, d] as Four;
        },
        ([a, b, c, d]) => Number.isInteger(c) && c >= 1 && c <= 12
          // Nothing to cancel with the determinant, so 1/det stays in front.
          && gcd(gcd(gcd(a, b), gcd(c, d)), a * d - b * c) === 1,
      ),
      M: [nonZero(-4, 4), nonZero(-4, 4), nonZero(-4, 4), nonZero(-4, 4)] as Four,
    }),
    // M non-singular with both signs in it, as (-1 1; 2 -3); B = AM non-zero and within 30.
    ({ A, M: [p, r, s, t] }) => p * t - r * s !== 0 && [p, r, s, t].some(v => v < 0) && [p, r, s, t].some(v => v > 0)
      && times(A, [p, r, s, t]).every(v => v !== 0 && Math.abs(v) <= 30),
    1000,
  ),

  build: ({ A, M }): Built => {
    const [a, b, c, d] = A;
    const det = a * d - b * c;
    const B = times(A, M);
    const adj: Four = [d, -b, -c, a];
    const inverse = `\\frac{1}{${det}}${pmatrix(rows(adj))}`;
    const product = times(adj, B);
    const Am = pmatrix(rows(A)), Bm = pmatrix(rows(B)), Mm = pmatrix(rows(M));
    return {
      questionLines: [
        `Matrix $A$ is defined by $A = ${Am}.$`,
        '<b>(a)</b> Find $A^{-1}$, the inverse of matrix $A.$',
        '',
        `Matrix $B$ is defined by $B = ${Bm}.$`,
        '<b>(b)</b> Find the matrix $M$ such that $AM = B.$',
      ],
      solutionSteps: [
        `<strong>(a)</strong> $\\det A = ${a} \\times ${d} - ${b} \\times ${c} = ${det}$`,
        `<strong>(a)</strong> $A^{-1} = ${inverse}$`,
        '<strong>(b)</strong> Multiplying both sides of $AM = B$ on the left by $A^{-1}$: $M = A^{-1}B$',
        `<strong>(b)</strong> $M = ${inverse}${Bm} = \\frac{1}{${det}}${pmatrix(rows(product))} = ${Mm}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `(a) $A^{-1} = ${inverse}$<br>(b) $M = ${Mm}$`,
      ladder: {
        moves: [
          'For a $2 \\times 2$ matrix, what do you swap, what do you negate, and what do you divide by?',
          '(a) Find the determinant of $A$.',
          '(a) Swap the leading diagonal, negate the other two entries, and divide by the determinant.',
          '(b) Multiply both sides of $AM = B$ by $A^{-1}$. Which side does it go on?',
          '(b) Multiply out to find $M$.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, `$\\det A = ${det}$ or $${pmatrix(rows(adj))}$`, `$${inverse}$`, '$M = A^{-1}B$', null],
        watch: { at: 3, text: 'You cannot divide by a matrix. Multiply both sides by $A^{-1}$ instead.' },
      },
    };
  },
};

// ── 2024 P1 Q6 ─────────────────────────────────────────────────────────────
// (a) a transformation's matrix; (b) describe another's; (c) the first
// followed by the second, C = BA.

type Motion = 'x-axis' | 'y-axis' | 'y=x' | 'y=-x' | 'r90' | 'r180' | 'r270';
interface P1Q6of2024 { first: Motion; then: Motion }

const MOTIONS: Record<Motion, { matrix: Four; name: string; described: string }> = {
  'x-axis': { matrix: [1, 0, 0, -1], name: 'a reflection in the $x$-axis', described: 'Reflection in the $x$-axis.' },
  'y-axis': { matrix: [-1, 0, 0, 1], name: 'a reflection in the $y$-axis', described: 'Reflection in the $y$-axis.' },
  'y=x': { matrix: [0, 1, 1, 0], name: 'a reflection in the line $y = x$', described: 'Reflection in the line $y = x.$' },
  'y=-x': { matrix: [0, -1, -1, 0], name: 'a reflection in the line $y = -x$', described: 'Reflection in the line $y = -x.$' },
  r90: { matrix: [0, -1, 1, 0], name: 'a rotation of $90^{\\circ}$ anticlockwise about the origin', described: 'Rotation of $90^{\\circ}$ anticlockwise about the origin.' },
  r180: { matrix: [-1, 0, 0, -1], name: 'a rotation of $180^{\\circ}$ about the origin', described: 'Rotation of $180^{\\circ}$ about the origin.' },
  r270: { matrix: [0, 1, -1, 0], name: 'a rotation of $90^{\\circ}$ clockwise about the origin', described: 'Rotation of $90^{\\circ}$ clockwise about the origin.' },
};

/** `(x, y)` as the image of a unit vector. */
const image = (x: number, y: number) => `(${x}, ${y})`;

/** A name ending a sentence, the stop inside the maths when it ends in maths: `$y = x.$`. */
const ending = (name: string) => (name.endsWith('$') ? `${name.slice(0, -1)}.$` : `${name}.`);

const q2024p1q6: CardRoutine<P1Q6of2024> = {
  draw: () => until(
    () => {
      const [first, then] = distinct(Object.keys(MOTIONS) as Motion[], 2);
      return { first, then };
    },
    // Never a pair that undoes itself: C would be the identity.
    ({ first, then }) => times(MOTIONS[then].matrix, MOTIONS[first].matrix).join() !== '1,0,0,1',
  ),

  build: ({ first, then }): Built => {
    const A = MOTIONS[first], B = MOTIONS[then];
    const Am = pmatrix(rows(A.matrix)), Bm = pmatrix(rows(B.matrix));
    const C = times(B.matrix, A.matrix);
    const Cm = pmatrix(rows(C));
    const [b11, b12, b21, b22] = B.matrix;
    return {
      questionLines: [
        `<b>(a)</b> Find the $2 \\times 2$ matrix, $A$, associated with ${ending(A.name)}`,
        `<b>(b)</b> Describe the transformation associated with the matrix $B = ${Bm}.$`,
        `<b>(c)</b> Find the $2 \\times 2$ matrix, $C$, associated with ${A.name} followed by the transformation associated with $${Bm}.$`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> $A = ${Am}$`,
        `<strong>(b)</strong> $B$ sends $(1, 0)$ to $${image(b11, b21)}$ and $(0, 1)$ to $${image(b12, b22)}$: ${B.described[0].toLowerCase()}${B.described.slice(1)}`,
        `<strong>(c)</strong> The transformation done first goes on the right: $C = BA = ${Bm}${Am}$`,
        `<strong>(c)</strong> $C = ${Cm}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `(a) $A = ${Am}$<br>(b) ${B.described}<br>(c) $C = ${Cm}$`,
      ladder: {
        moves: [
          'Where do the unit vectors along the axes end up after the transformation?',
          `(a) Write the matrix for ${ending(A.name)}`,
          '(b) What does $B$ do to $(1, 0)$ and to $(0, 1)$? Describe the transformation.',
          '(c) Write the product in the right order: the transformation done first goes on the right.',
          '(c) Multiply the matrices.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, null, null, `$${Bm}${Am}$`, null],
        watch: { at: 4, text: 'Multiply carefully, then check your answer by seeing where it sends $(1, 0)$.' },
      },
    };
  },
};

// ── 2023 P1 Q9 ─────────────────────────────────────────────────────────────
// (a) A, a quarter-turn; (b) AB with B a rotation through kπ/6, and its angle
// α; (c) the least n with (AB)^n = I. Angles are counted in sixths of π.

interface P1Q9of2023 { k: number; anticlockwise: boolean }

/** cos and sin of jπ/6, exact, as a paper writes them. */
function trigSixths(j: number): [string, string] {
  const values = ['1', '\\frac{\\sqrt{3}}{2}', '\\frac{1}{2}', '0', '-\\frac{1}{2}', '-\\frac{\\sqrt{3}}{2}', '-1'];
  // cos(jπ/6) for j = 0..6, then by symmetry; sin(jπ/6) = cos((3 - j)π/6).
  const cosOf = (i: number) => {
    const r = ((i % 12) + 12) % 12;
    return values[r <= 6 ? r : 12 - r];
  };
  return [cosOf(j), cosOf(3 - j)];
}

/** `-x` of an entry written already: `\frac{1}{2}` to `-\frac{1}{2}`, `-1` to `1`, `0` stays. */
const negated = (v: string) => (v === '0' ? '0' : v.startsWith('-') ? v.slice(1) : `-${v}`);

/** The rotation through jπ/6 anticlockwise. */
function rotation(j: number): string {
  const [c, s] = trigSixths(j);
  return pmatrix([[c, negated(s)], [s, c]]);
}

const q2023p1q9: CardRoutine<P1Q9of2023> = {
  // B off the axes, as the paper's 7π/6, so AB is never a quarter- or half-turn.
  draw: () => ({ k: pick([1, 2, 4, 5, 7, 8, 10, 11]), anticlockwise: pick([true, false]) }),

  build: ({ k, anticlockwise }): Built => {
    const turn = anticlockwise ? 3 : -3;
    const m = (((k + turn) % 12) + 12) % 12;
    const A = rotation(turn), B = rotation(k), AB = rotation(m);
    const [c, s] = trigSixths(m);
    const alpha = piTimes(q(m, 6));
    const other = m > 6 ? ` (or $${piTimes(q(m - 12, 6))}$)` : '';
    const n = 12 / gcd(m, 12);
    const sense = anticlockwise ? 'an anti-clockwise' : 'a clockwise';
    const general = '\\begin{pmatrix}\\cos\\alpha & -\\sin\\alpha\\\\\\sin\\alpha & \\cos\\alpha\\end{pmatrix}';
    return {
      questionLines: [
        `<b>(a)</b> State the matrix $A$, associated with ${sense} rotation of $\\frac{\\pi}{2}$ radians about the origin.`,
        '',
        `The matrix $B$ is given by $B = ${B}.$`,
        'The matrix $AB$ is associated with an anti-clockwise rotation of $\\alpha$ radians about the origin.',
        '',
        '<b>(b)</b> (i) Determine $AB.$',
        '',
        '<b>(b)</b> (ii) Find the value of $\\alpha.$',
        '',
        '<b>(c)</b> Determine the least positive integer value of $n$ such that $(AB)^{n} = I$, where $I$ is the $2 \\times 2$ identity matrix.',
      ],
      solutionSteps: [
        `<strong>(a)</strong> $A = ${A}$`,
        `<strong>(b)(i)</strong> $AB = ${A}${B} = ${AB}$`,
        `<strong>(b)(ii)</strong> $AB = ${general}$ with $\\cos\\alpha = ${c}$ and $\\sin\\alpha = ${s}$, so $\\alpha = ${alpha}$`,
        `<strong>(c)</strong> $(AB)^{n}$ is a rotation through $n\\alpha$, which is $I$ when $n\\alpha$ is a whole number of turns: $${n} \\times ${alpha} = ${(n * m) / 6}\\pi$, so $n = ${n}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `(a) $A = ${A}$<br>(b)(i) $AB = ${AB}$<br>(b)(ii) $\\alpha = ${alpha}$${other}<br>(c) $n = ${n}$`,
      ladder: {
        moves: [
          'Where does a rotation send the point $(1, 0)$, and where does it send $(0, 1)$?',
          `(a) Write the rotation matrix for a quarter-turn ${anticlockwise ? 'anticlockwise' : 'clockwise'}.`,
          '(b)(i) Multiply $A$ by $B$, row by column.',
          '(b)(ii) Match $AB$ to the general rotation matrix and find the angle.',
          '(c) How many turns of that angle make a whole number of full turns?',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, null, null, `$${alpha}$`, null],
        watch: { at: 3, text: 'Give the angle in radians. Degrees are not accepted here.' },
      },
    };
  },
};

// ── 2023 P2 Q3 ─────────────────────────────────────────────────────────────
// A = (a bx c; x d 0; e 0 f): (a) det A = -bf x² + d(af - ce); (b) whether
// A⁻¹ exists for every x. Half the draws it does (the paper's 4x² + 8), half
// the determinant is 0 at x = ±√m.

interface P2Q3of2023 { a: number; b: number; c: number; d: number; e: number; f: number; always: boolean }

/** det A = L x² + K. */
const detParts = ({ a, b, c, d, e, f }: P2Q3of2023) => ({ L: -b * f, K: d * (a * f - c * e) });

/** √m for a whole m: `3`, `\sqrt{2}`; m is square or has no square factor. */
const rootOf = (m: number) => {
  const r = Math.round(Math.sqrt(m));
  return r * r === m ? `${r}` : `\\sqrt{${m}}`;
};
const squareFree = (m: number) => [2, 3, 5, 7].every(p => m % (p * p) !== 0);

const q2023p2q3: CardRoutine<P2Q3of2023> = {
  draw: () => {
    const always = pick([true, false]);
    return until(
      () => ({
        a: pick([-1, 1]) * int(2, 5), b: pick([-1, 1]) * int(2, 4), c: pick([-1, 1]) * int(2, 5),
        d: nonZero(-5, 5), e: nonZero(-5, 5), f: nonZero(-5, 5), always,
      }),
      (n) => {
        const { L, K } = detParts(n);
        if (K === 0 || Math.abs(K) > 60) return false;
        if (n.always) return L * K > 0;
        // Zero where x² = -K/L: a whole number, square or with no square factor.
        const m = -K / L;
        const r = Math.round(Math.sqrt(m));
        return m > 0 && Number.isInteger(m) && m <= 30 && (r * r === m || squareFree(m));
      },
    );
  },

  build: (n): Built => {
    const { a, b, c, d, e, f } = n;
    const { L, K } = detParts(n);
    const bx = sum([{ coef: b, body: 'x' }]);
    const A = pmatrix([[a, bx, c], ['x', d, 0], [e, 0, f]]);
    const vm = (p: string, qq: string, r: string, s: string) => `\\begin{vmatrix}${p} & ${qq}\\\\${r} & ${s}\\end{vmatrix}`;
    const expansion = joinTerms([
      `${a}${vm(`${d}`, '0', '0', `${f}`)}`,
      `${b > 0 ? '-' : ''}${Math.abs(b)}x${vm('x', '0', `${e}`, `${f}`)}`,
      `${c}${vm('x', `${d}`, `${e}`, '0')}`,
    ]);
    const worked = sum([{ coef: a * d * f, body: '' }, { coef: -b * f, body: 'x^{2}' }, { coef: -c * d * e, body: '' }]);
    const det = poly([L, 0, K]);
    const m = -K / L;
    const conclusion = n.always
      ? `Since $x^{2} \\ge 0$, $${det} ${K > 0 ? '\\gt' : '\\lt'} 0$ for all real $x$, so $\\det A \\neq 0$ and $A^{-1}$ exists for all values of $x.$`
      : `$${det} = 0$ when $x^{2} = ${m}$, that is when $x = \\pm ${rootOf(m)}$, so $A^{-1}$ does not exist for all values of $x$: not for $x = \\pm ${rootOf(m)}.$`;
    const answerB = n.always
      ? `Since $${det} ${K > 0 ? '\\gt' : '\\lt'} 0$ for all real $x$, $A^{-1}$ always exists.`
      : `No: $${det} = 0$ when $x = \\pm ${rootOf(m)}$, so $A^{-1}$ does not exist for $x = \\pm ${rootOf(m)}.$`;
    return {
      questionLines: [
        'Matrix $A$ is defined by',
        '',
        `$A = ${A}$`,
        '',
        'where $x \\in \\mathbb{R}.$',
        '<b>(a)</b> Find a simplified expression for the determinant of $A.$',
        '<b>(b)</b> Hence, determine whether $A^{-1}$ exists for all values of $x.$',
      ],
      solutionSteps: [
        `<strong>(a)</strong> Expanding along the first row, $\\det A = ${expansion}$`,
        `<strong>(a)</strong> $\\det A = ${worked} = ${det}$`,
        `<strong>(b)</strong> ${conclusion}`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `(a) $${det}$<br>(b) ${answerB}`,
      ladder: {
        moves: [
          'How do you find a $3 \\times 3$ determinant? Expand along a row or a column.',
          '(a) Expand along a row or a column, with a $2 \\times 2$ determinant for each entry.',
          '(a) Evaluate and simplify.',
          '(b) An inverse exists when the determinant is not zero. Can your expression ever be zero?',
        ],
        marks: [0, 1, 1, 1],
        shows: [null, `$${expansion}$`, null, null],
        watch: { at: 3, text: 'Give the reason in (b): say whether the determinant can ever be zero, and why.' },
      },
    };
  },
};

// ── 2022 P2 Q5 ─────────────────────────────────────────────────────────────
// A = (1 b 1; d k e; k f g): det A = -k² + (g + be)k + f(d - e) - bdg, which is
// -(k - r1)(k - r2): built from the two values of k.

interface P2Q5of2022 { b: number; d: number; e: number; r1: number; r2: number }

/** g and f from the roots: g + be = r1 + r2, and f(d - e) - bdg = -r1 r2. */
function entries2022({ b, d, e, r1, r2 }: P2Q5of2022): { g: number; f: number } {
  const g = r1 + r2 - b * e;
  return { g, f: (b * d * g - r1 * r2) / (d - e) };
}

const q2022p2q5: CardRoutine<P2Q5of2022> = {
  draw: () => until(
    () => {
      const [r1, r2] = distinct([-8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8], 2).sort((x, y) => y - x);
      return { b: int(1, 4), d: int(1, 4), e: int(1, 5), r1, r2 };
    },
    // The paper's sizes (3, 2, 3, 18, -7): f whole and within 20, g within 9,
    // neither 0, and a k term in the quadratic, as -k^2 + 2k + 24.
    (n) => {
      if (n.d === n.e || n.r1 + n.r2 === 0) return false;
      const { g, f } = entries2022(n);
      return g !== 0 && Math.abs(g) <= 9 && Number.isInteger(f) && f !== 0 && Math.abs(f) <= 20;
    },
    2000,
  ),

  build: (n): Built => {
    const { b, d, e, r1, r2 } = n;
    const { g, f } = entries2022(n);
    const A = pmatrix([[1, b, 1], [d, 'k', e], ['k', f, g]]);
    const vm = (p: string | number, qq: string | number, r: string | number, s: string | number) => `\\begin{vmatrix}${p} & ${qq}\\\\${r} & ${s}\\end{vmatrix}`;
    const expansion = `1${vm('k', e, f, g)} - ${b}${vm(d, e, 'k', g)} + 1${vm(d, 'k', 'k', f)}`;
    const minors = [
      poly([g, -e * f], 'k'),
      sum([{ coef: d * g, body: '' }, { coef: -e, body: 'k' }]),
      sum([{ coef: d * f, body: '' }, { coef: -1, body: 'k^{2}' }]),
    ];
    const worked = `(${minors[0]}) - ${b === 1 ? '' : b}(${minors[1]}) + (${minors[2]})`;
    const det = poly([-1, r1 + r2, -r1 * r2], 'k');
    const monic = poly([1, -(r1 + r2), r1 * r2], 'k');
    const factors = `(${poly([1, -r1], 'k')})(${poly([1, -r2], 'k')})`;
    return {
      questionLines: [
        `Matrix $A$ is given by $A = ${A}$, where $k \\in \\mathbb{R}.$`,
        'Find the values of $k$ so that the matrix $A$ is singular.',
      ],
      solutionSteps: [
        `Expanding along the first row, $\\det A = ${expansion}$`,
        `$\\det A = ${worked} = ${det}$`,
        `$A$ is singular when $${det} = 0$, so $${monic} = 0$ and $${factors} = 0$, giving $k = ${r1}$ and $k = ${r2}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `$k = ${r1}$ and $k = ${r2}$`,
      ladder: {
        moves: [
          'What is special about the determinant of a singular matrix?',
          'Expand the determinant along a row or a column.',
          'Simplify it to a quadratic in $k$.',
          'Set it equal to zero and solve.',
        ],
        marks: [0, 1, 1, 1],
        shows: [null, `$${expansion}$`, `$${det}$`, null],
        watch: { at: 3, text: 'Write "$= 0$" when you set up the equation, or the last mark goes.' },
      },
    };
  },
};

export const ROUTINES = {
  '2022 P2 Q5': q2022p2q5,
  '2023 P1 Q9': q2023p1q9,
  '2023 P2 Q3': q2023p2q3,
  '2024 P1 Q4': q2024p1q4,
  '2024 P1 Q6': q2024p1q6,
  '2025 P1 Q4': q2025p1q4,
  '2025 P2 Q8': q2025p2q8,
  '2026 P1 Q5': q2026p1q5,
};
