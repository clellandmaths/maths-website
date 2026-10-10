/**
 * Advanced Higher, Vectors: how each 2016 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/vectors.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int, nonZero, until } from '../../core/draw';
import { rounded, sqrtOf, sum } from '../../core/maths/format';
import { type V3, content3, coords, dot3, scale3, sub3 } from '../../core/maths/vector';

// ── 2016 Q14 ───────────────────────────────────────────────────────────────
// L₁: A + λd₁ in parametric form, L₂: (x - B)/d₂ in symmetric form, built to
// meet at P with λ = λ₀ and μ = μ₀: (a) two coordinates equated and solved,
// the third checked on both, the point; (b) the obtuse angle between the
// directions, from a negative scalar product.

interface Q14of2016 { P: V3; d1: V3; d2: V3; l0: number; m0: number }

const AXES = ['x', 'y', 'z'] as const;

/** `4 + 3\lambda`, `-7\lambda`: a coordinate of a line. */
const along = (c: number, d: number, p: string) => sum([{ coef: c, body: '' }, { coef: d, body: p }]);

/** `-1 + 3(-2)`: a coordinate at a parameter value. */
const at = (c: number, d: number, v: number) => {
  // A 1 in front is left out, "-3 + (-2)" (the owner, full read 2026-10-05).
  const times = Math.abs(d) === 1 ? (v < 0 ? `(${v})` : `${v}`) : `${Math.abs(d)}(${v})`;
  if (c === 0) return `${d < 0 ? '-' : ''}${times}`;
  return `${c} ${d < 0 ? '-' : '+'} ${times}`;
};

const q2016q14: CardRoutine<Q14of2016> = {
  draw: () => until(
    () => ({
      P: [int(-8, 8), int(-8, 8), int(-8, 8)] as V3,
      d1: [nonZero(-7, 7), nonZero(-7, 7), nonZero(-7, 7)] as V3,
      d2: [nonZero(-4, 4), nonZero(-4, 4), nonZero(-4, 4)] as V3,
      l0: nonZero(-3, 3), m0: nonZero(-3, 3),
    }),
    ({ P, d1, d2, l0, m0 }) => {
      const A = sub3(P, scale3(l0, d1)), B = sub3(P, scale3(m0, d2));
      const cos = dot3(d1, d2) / Math.sqrt(dot3(d1, d1) * dot3(d2, d2));
      const deg = (Math.acos(cos) * 180) / Math.PI;
      // Directions with no common factor, as (3, 4, -7) and (-2, 1, 3); the
      // x and y equations solvable on their own, as the paper's; L₁'s point
      // within 12 and L₂'s within 12 and never 0, so its symmetric form has
      // x - 3, never a bare x, as the paper's; the scalar product negative, so
      // the angle from it is the obtuse one, as the paper's -23, from 100° to
      // 165°, and its first place never a coin toss.
      return Math.abs(content3(d1)) === 1 && Math.abs(content3(d2)) === 1
        && d1[0] * d2[1] !== d1[1] * d2[0]
        && A.every(v => Math.abs(v) <= 12) && B.every(v => v !== 0 && Math.abs(v) <= 12)
        && deg >= 100 && deg <= 165 && Math.abs(((deg * 10) % 1) - 0.5) >= 0.05;
    },
    2000,
  ),

  build: ({ P, d1, d2, l0, m0 }): Built => {
    const A = sub3(P, scale3(l0, d1)), B = sub3(P, scale3(m0, d2));
    const L1 = AXES.map((v, i) => `${v} = ${along(A[i], d1[i], '\\lambda')}`).join(', ');
    const L2 = AXES.map((v, i) => `\\frac{${sum([{ coef: 1, body: v }, { coef: -B[i], body: '' }])}}{${d2[i]}}`).join(' = ');
    const param2 = AXES.map((v, i) => `${v} = ${along(B[i], d2[i], '\\mu')}`).join(', ');
    const equations = [0, 1].map(i => `${along(A[i], d1[i], '\\lambda')} = ${along(B[i], d2[i], '\\mu')}`).join(', ');
    const check = `z_1 = ${at(A[2], d1[2], l0)} = ${P[2]}$ and $z_2 = ${at(B[2], d2[2], m0)} = ${P[2]}`;
    const vec = (d: V3) => sum([{ coef: d[0], body: '\\mathbf{i}' }, { coef: d[1], body: '\\mathbf{j}' }, { coef: d[2], body: '\\mathbf{k}' }]);
    const products = [0, 1, 2].map(i => d1[i] * d2[i]);
    const dot = dot3(d1, d2);
    const dotLine = `${products[0]}${products.slice(1).map(p => ` ${p < 0 ? '-' : '+'} ${Math.abs(p)}`).join('')} = ${dot}`;
    const m1 = dot3(d1, d1), m2 = dot3(d2, d2);
    // √74√14, as the scheme; a whole magnitude takes a times sign.
    // Two whole magnitudes are multiplied out, 9 for 3 × 3 (the owner, full read 2026-10-05).
    const bothWhole = !/sqrt/.test(sqrtOf(m1)) && !/sqrt/.test(sqrtOf(m2));
    const under = bothWhole ? String(Math.sqrt(m1 * m2))
      : /sqrt/.test(sqrtOf(m1)) && /sqrt/.test(sqrtOf(m2)) ? `${sqrtOf(m1)}${sqrtOf(m2)}` : `${sqrtOf(m1)} \\times ${sqrtOf(m2)}`;
    const sizes = `|\\mathbf{d}_1| = ${sqrtOf(m1)}$, $|\\mathbf{d}_2| = ${sqrtOf(m2)}$ and $\\mathbf{d}_1 \\cdot \\mathbf{d}_2 = ${dotLine}`;
    const deg = (Math.acos(dot / Math.sqrt(m1 * m2)) * 180) / Math.PI;
    const angle = `${rounded(deg, 1)}^{\\circ}`;
    const angleLine = `\\cos^{-1}\\left(\\frac{${dot}}{${under}}\\right) \\approx ${angle}`;
    const point = coords(P);
    return {
      questionLines: [
        'Two lines $L_1$ and $L_2$ are given by the equations:',
        `$L_1: ${L1}$`,
        `$L_2: ${L2}$`,
        '<b>(a)</b> Show that the lines $L_1$ and $L_2$ intersect and find the point of intersection.',
        '<b>(b)</b> Calculate the obtuse angle between the lines $L_1$ and $L_2.$',
      ],
      solutionSteps: [
        `<strong>(a)</strong> $L_2$ in parametric form: $${param2}$`,
        `<strong>(a)</strong> Equating $x$ and $y$: $${equations}$`,
        `<strong>(a)</strong> $\\lambda = ${l0},\\ \\mu = ${m0}$`,
        `<strong>(a)</strong> $${check}$, therefore the lines intersect`,
        `<strong>(a)</strong> The point of intersection is $${point}$`,
        `<strong>(b)</strong> $\\mathbf{d}_1 = ${vec(d1)}$`,
        `<strong>(b)</strong> $\\mathbf{d}_2 = ${vec(d2)}$`,
        `<strong>(b)</strong> $${sizes}$`,
        `<strong>(b)</strong> $${angleLine}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1, 1, 1],
      finalAnswer: [`(a) Point of intersection is $${point}$`, `(b) $${angle}$`].join('<br>'),
      ladder: {
        moves: [
          'Two lines meet if one choice of their parameters gives the same point. How can you test that?',
          '(a) Write two of $L_2$\'s equations in parametric form, with its own parameter.',
          '(a) Equate two coordinates of the lines, giving two equations.',
          '(a) Solve for both parameters.',
          '(a) Check them in the third coordinate of both lines.',
          '(a) Find the point of intersection.',
          '(b) Read the direction vector of $L_1$.',
          '(b) Read the direction vector of $L_2$.',
          '(b) Find their magnitudes and their scalar product.',
          '(b) Find the angle. The question asks for the obtuse one.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        shows: [
          null, `$${param2}$`, `$${equations}$`, `$\\lambda = ${l0},\\ \\mu = ${m0}$`, `$${check}$, therefore the lines intersect`, null,
          `$\\mathbf{d}_1 = ${vec(d1)}$`, `$\\mathbf{d}_2 = ${vec(d2)}$`, `$${sizes}$`, null,
        ],
        watch: { at: 2, text: 'Use a different letter for $L_2$\'s parameter. Using $\\lambda$ for both ruins the equations.' },
      },
    };
  },
};

export const ROUTINES = {
  '2016 Q14': q2016q14,
};
