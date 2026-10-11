/**
 * Advanced Higher, Vectors: how each 2017 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/vectors.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int, nonZero, pick, until } from '../../core/draw';
import { poly, sum } from '../../core/maths/format';
import { type V3, add3, column, content3, coords, cross3, dot3, scale3, sub3 } from '../../core/maths/vector';

// ── 2017 Q15 ───────────────────────────────────────────────────────────────
// (a) the line through B and T in parametric form; (b) the plane through P,
// Q and R, its normal PQ × PR exactly, as the paper's (4, 2, -1); (c) where
// the line meets it, H. Built backwards: the plane, H on it, the line's
// direction, B a whole number of directions from H, T more along.

interface Q15of2017 {
  P: V3;
  /** PQ and PR. */
  u: V3; v: V3;
  /** H = P + s u + t v; B = H - lam d; T = B + mu d. */
  s: number; t: number; d: V3; lam: number; mu: number;
}

const within2017 = (v: V3, limit: number) => v.every(c => Math.abs(c) <= limit);
const noZero2017 = (v: V3) => v.every(c => c !== 0);

/** `make` until `ok`, at most `tries` times, or null: one stage of the draw, which starts again on null. */
function stage2017<T>(make: () => T, ok: (v: T) => boolean, tries = 40): T | null {
  for (let i = 0; i < tries; i++) {
    const v = make();
    if (ok(v)) return v;
  }
  return null;
}

/** One try at the whole draw, a stage at a time; null when a stage finds nothing. */
function draw2017q15(): Q15of2017 | null {
  // PQ and PR small, their vector product the normal itself, with no factor
  // to take out, no zero component and the first positive, as (4, 2, -1), so
  // the plane's equation starts 4x, as the paper's.
  const uv = stage2017((): [V3, V3] => [
    [int(-3, 3), int(-3, 3), int(-3, 3)],
    [int(-6, 6), int(-6, 6), int(-8, 8)],
  ], ([u, v]) => {
    const n = cross3(u, v);
    return n[0] > 0 && noZero2017(n) && content3(n) === 1 && within2017(n, 6) && noZero2017(u) && noZero2017(v);
  }, 400);
  if (!uv) return null;
  const [u, v] = uv;
  const n = cross3(u, v);
  const P = stage2017((): V3 => [nonZero(-6, 6), nonZero(-6, 6), nonZero(-9, 9)],
    P => within2017(add3(P, u), 9) && within2017(add3(P, v), 9) && noZero2017(add3(P, u)) && noZero2017(add3(P, v)));
  if (!P) return null;
  // H whole on the plane, none of P, Q and R.
  const st = stage2017(() => [int(-2, 2), int(-2, 2)], ([s, t]) => {
    const H = add3(P, add3(scale3(s, u), scale3(t, v)));
    const given = (s === 0 && t === 0) || (s === 1 && t === 0) || (s === 0 && t === 1);
    return !given && within2017(H, 9) && noZero2017(H);
  });
  if (!st) return null;
  const [s, t] = st;
  const H = add3(P, add3(scale3(s, u), scale3(t, v)));
  // The beam not parallel to the plane.
  const d = stage2017((): V3 => [nonZero(-6, 6), nonZero(-6, 6), nonZero(-3, 3)],
    d => content3(d) === 1 && dot3(n, d) !== 0);
  if (!d) return null;
  const lam = stage2017(() => pick([-3, -2, -1, 1, 2, 3]), lam => {
    const B = sub3(H, scale3(lam, d));
    return within2017(B, 12) && noZero2017(B);
  });
  if (lam === null) return null;
  const B = sub3(H, scale3(lam, d));
  const mu = stage2017(() => pick([-5, -4, -3, -2, 2, 3, 4, 5]), mu => {
    const T = add3(B, scale3(mu, d));
    return within2017(T, 25) && noZero2017(T);
  });
  if (mu === null) return null;
  return { P, u, v, s, t, d, lam, mu };
}

const q2017q15: CardRoutine<Q15of2017> = {
  // A piece at a time, each with its own light test, as 2026 P2 Q14's; a
  // stage that finds nothing (a P with no room for H) starts the draw again.
  draw: () => until(draw2017q15, v => v !== null, 500) as Q15of2017,

  build: ({ P, u, v, s, t, d, lam, mu }): Built => {
    const Q = add3(P, u), R = add3(P, v);
    const n = cross3(u, v);
    const H = add3(P, add3(scale3(s, u), scale3(t, v)));
    const B = sub3(H, scale3(lam, d));
    const T = add3(B, scale3(mu, d));
    const D = dot3(n, P);
    const axes = ['x', 'y', 'z'] as const;
    const plane = `${sum(axes.map((axis, i) => ({ coef: n[i], body: axis })))} = ${D}`;
    const lines = axes.map((_, i) => poly([d[i], B[i]], '\\lambda'));
    const parametric = axes.map((axis, i) => `${axis} = ${lines[i]}`).join(',\\ ');
    const BT = sub3(T, B);
    const direction = `\\overrightarrow{BT} = ${column(BT)} = ${mu}${column(d)}$, so $\\mathbf{d} = ${column(d)}`;
    const vmatrix = `\\begin{vmatrix}\\mathbf{i} & \\mathbf{j} & \\mathbf{k}\\\\${u.join(' & ')}\\\\${v.join(' & ')}\\end{vmatrix}`;
    const substituted = lines.map((line, i) => {
      const c = Math.abs(n[i]);
      const term = c === 1 ? `(${line})` : `${c}(${line})`;
      if (i === 0) return n[i] === 1 ? `(${line})` : `${n[i] === -1 ? '-' : n[i]}(${line})`;
      return `${n[i] < 0 ? ' - ' : ' + '}${term}`;
    }).join('');
    const collected = sum([{ coef: dot3(n, d), body: '\\lambda' }, { coef: dot3(n, B), body: '' }]);
    return {
      questionLines: [
        `<b>(a)</b> A beam of light passes through the points $B${coords(B)}$ and $T${coords(T)}.$`,
        'Obtain parametric equations of the line representing the beam of light.',
        `<b>(b)</b> A sheet of metal is represented by a plane containing the points $P${coords(P)}$, $Q${coords(Q)}$ and $R${coords(R)}.$`,
        'Find the Cartesian equation of the plane.',
        '<b>(c)</b> The beam of light passes through a hole in the metal at point $H.$',
        'Find the coordinates of $H.$',
      ],
      solutionSteps: [
        `<strong>(a)</strong> $${direction}$`,
        `<strong>(a)</strong> Through $B$: $${parametric}$`,
        `<strong>(b)</strong> $\\overrightarrow{PQ} = ${column(u)}$ and $\\overrightarrow{PR} = ${column(v)}$`,
        `<strong>(b)</strong> $\\overrightarrow{PQ} \\times \\overrightarrow{PR} = ${vmatrix}$`,
        `<strong>(b)</strong> $\\mathbf{n} = ${column(n)}$`,
        `<strong>(b)</strong> Using $P$: $${plane}$`,
        `<strong>(c)</strong> $${substituted} = ${D}$`,
        // When the line is already λ = k, print it once (the owner, full read 2026-10-05).
        dot3(n, d) === 1 && dot3(n, B) === 0
          ? `<strong>(c)</strong> $\\lambda = ${lam}$`
          : `<strong>(c)</strong> $${collected} = ${D}$, so $\\lambda = ${lam}$`,
        `<strong>(c)</strong> $H${coords(H)}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1, 1, 1],
      finalAnswer: [`(a) $${parametric}$ (or equivalent)`, `(b) $${plane}$`, `(c) $H${coords(H)}$`].join('<br>'),
      ladder: {
        moves: [
          'A line needs a point and a direction. Where do you get the direction from two points?',
          '(a) Subtract the two points to get a direction vector.',
          '(a) Use a point and the direction to write parametric equations.',
          '(b) Find two vectors in the plane from the three points.',
          '(b) Set up their vector product.',
          '(b) Work out the vector product to get a normal.',
          '(b) Use the normal and one of the points to write the equation of the plane.',
          '(c) Substitute the line\'s equations into the plane\'s equation.',
          '(c) Solve for the parameter.',
          '(c) Put it back to find $H$.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        shows: [
          null,
          `$\\mathbf{d} = ${column(d)}$ or a multiple of it`,
          `$${parametric}$`,
          `$\\overrightarrow{PQ} = ${column(u)}$, $\\overrightarrow{PR} = ${column(v)}$`,
          `$${vmatrix}$`,
          `$\\mathbf{n} = ${column(n)}$`,
          null,
          `$${substituted} = ${D}$`,
          `$\\lambda = ${lam}$`,
          null,
        ],
        watch: { at: 2, text: 'Give parametric equations, as asked, not a vector or symmetric form.' },
      },
    };
  },
};

export const ROUTINES = {
  '2017 Q15': q2017q15,
};
