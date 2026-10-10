/**
 * Advanced Higher, Vectors: how each 2019 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/vectors.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int, nonZero, pick, until } from '../../core/draw';
import { poly, rounded, sqrtOf, sum } from '../../core/maths/format';
import { gcd } from '../../core/maths/integer';
import { type V3, add3, column, content3, coords, dot3, scale3, sub3 } from '../../core/maths/vector';

// ── 2019 Q15 ───────────────────────────────────────────────────────────────
// (a) verify L1: (x0 + aλ, y0 + bλ, λ) lies in π1 and π2; (b) the acute angle
// between L1 and π3; (c) whether L1 meets L2, the line through P along π3's
// normal. Half the draws they meet; half (the paper's kind) P is lifted off
// the meeting point in z, so the x and y equations agree and the z one fails.

interface Q15of2019 {
  /** L1's point at λ = 0, (x0, y0, 0), and its direction (a, b, 1). */
  A0: V3; d: V3;
  n1: V3; n2: V3; n3: V3; c3: number;
  /** Where on each line the x and y equations meet: L1 at λ0, L2 at μ0. */
  lambda0: number; mu0: number;
  /** 0 when the lines meet; otherwise the z gap the third equation finds. */
  lift: number;
}

const degrees2019 = (radians: number) => (radians * 180) / Math.PI;
/** The acute angle between a line along d and a plane with normal n, in radians. */
const angle2019 = (d: V3, n: V3) => Math.asin(Math.abs(dot3(d, n)) / Math.sqrt(dot3(d, d) * dot3(n, n)));
const within2019 = (v: V3, limit: number) => v.every(c => Math.abs(c) <= limit);
/** Clear of a rounding boundary at `dp` places. */
const clear2019 = (x: number, dp: number) => {
  const f = x * 10 ** dp - Math.floor(x * 10 ** dp);
  return Math.abs(f - 0.5) > 0.05;
};

/** |d||n| as a paper writes it, `\sqrt{6}\sqrt{29}`, a whole root first. */
function lengths2019(dd: number, nn: number): string {
  const [a, b] = [sqrtOf(dd), sqrtOf(nn)];
  const whole = (s: string) => !s.startsWith('\\');
  if (whole(a) && whole(b)) return `${a} \\times ${b}`;
  return whole(b) ? `${b}${a}` : `${a}${b}`;
}

/**
 * The cosine |d·n|/(|d||n|), finished where the denominator allows: a whole
 * denominator worked out (√6√6 is 6, 3 × 3 is 9) and a common factor with a
 * whole length cancelled (12/(3√29) is 4/√29). Two different surds are left
 * as they come, as the marking instructions write 3/(√6√29). (The owner, full
 * read 2026-10-05.)
 */
function cosine2019(top: number, dd: number, nn: number): string {
  const [a, b] = [sqrtOf(dd), sqrtOf(nn)];
  const whole = (s: string) => !s.startsWith('\\');
  if (!whole(a) && !whole(b) && dd !== nn) return `\\frac{${top}}{${lengths2019(dd, nn)}}`;
  const surd = whole(a) && whole(b) ? '' : dd === nn ? '' : whole(a) ? b : a;
  const W = whole(a) && whole(b) ? Number(a) * Number(b) : dd === nn ? dd : Number(whole(a) ? a : b);
  const g = gcd(top, W);
  const w = W / g;
  const over = (t: number, n: number) => `\\frac{${t}}{${surd ? `${n === 1 ? '' : n}${surd}` : n}}`;
  return g === 1 ? over(top, W) : `${over(top, W)} = ${over(top / g, w)}`;
}

const q2019q15: CardRoutine<Q15of2019> = {
  // A piece at a time, each with its own light test.
  draw: () => {
    const d: V3 = [nonZero(-3, 3), nonZero(-3, 3), 1];
    const A0: V3 = [nonZero(-5, 5), nonZero(-5, 5), 0];
    // A normal at right angles to d: n·d = 0 fixes its z, as d's z is 1.
    const normal = () => until((): V3 => {
      const x = nonZero(-4, 4), y = nonZero(-4, 4);
      return [x, y, -(x * d[0] + y * d[1])];
    }, n => n[0] > 0 && n[2] !== 0 && Math.abs(n[2]) <= 5 && content3(n) === 1
      // The plane's constant never 0 and within 20, as the paper's 9 and 2.
      && dot3(n, A0) !== 0 && Math.abs(dot3(n, A0)) <= 20);
    const n1 = normal();
    const n2 = until(normal, n => n[0] !== n1[0] || n[1] !== n1[1]);
    const n3 = until((): V3 => [nonZero(-4, 4), nonZero(-4, 4), nonZero(-4, 4)], n => {
      if (dot3(d, n) === 0 || content3(n) !== 1) return false;
      // The x and y equations of (c) have one solution.
      if (d[1] * n[0] - d[0] * n[1] === 0) return false;
      const t = angle2019(d, n), deg = degrees2019(t);
      return deg > 8 && deg < 82 && clear2019(deg, 1) && clear2019(t, 3);
    });
    const meet = pick([true, false]);
    return until(() => ({
      A0, d, n1, n2, n3, c3: nonZero(-9, 9),
      lambda0: int(-2, 2), mu0: nonZero(-3, 3), lift: meet ? 0 : nonZero(-6, 6),
    }), (n) => {
      const Q = add3(n.A0, scale3(n.lambda0, n.d));
      const P = add3(sub3(Q, scale3(n.mu0, n.n3)), [0, 0, n.lift]);
      return within2019(P, 9);
    });
  },

  build: ({ A0, d, n1, n2, n3, c3, lambda0, mu0, lift }): Built => {
    const L = '\\lambda', M = '\\mu';
    const axes = ['x', 'y', 'z'] as const;
    const c1 = dot3(n1, A0), c2 = dot3(n2, A0);
    const planeText = (n: V3, c: number) => `${sum(axes.map((axis, i) => ({ coef: n[i], body: axis })))} = ${c}`;
    const lineL1 = axes.map((_, i) => poly([d[i], A0[i]], L));
    // Each coordinate of L1 put into a plane: 2(2λ + 3) - 3(λ - 1) - λ.
    const substituted = (n: V3) => lineL1.map((line, i) => {
      const bracketed = line === L ? L : `(${line})`;
      const c = Math.abs(n[i]);
      const term = c === 1 ? bracketed : `${c}${bracketed}`;
      if (i === 0) return n[i] < 0 ? `-${term}` : term;
      return `${n[i] < 0 ? ' - ' : ' + '}${term}`;
    }).join('');
    const Q = add3(A0, scale3(lambda0, d));
    const P = add3(sub3(Q, scale3(mu0, n3)), [0, 0, lift]);
    const lineL2 = axes.map((_, i) => poly([n3[i], P[i]], M));
    const cos = cosine2019(Math.abs(dot3(d, n3)), dot3(d, d), dot3(n3, n3));
    const theta = angle2019(d, n3);
    const deg = degrees2019(theta);
    const angleText = `$${rounded(deg, 1)}^{\\circ}$ (or $${rounded(theta, 3)}$ radians)`;
    const eqX = `${lineL1[0]} = ${lineL2[0]}`, eqY = `${lineL1[1]} = ${lineL2[1]}`;
    const zLeft = lambda0, zRight = n3[2] * mu0 + P[2];
    const third = `In $z$, $${L} = ${lineL2[2]}$: LHS $= ${zLeft}$, RHS $= ${zRight}$`;
    const conclusion = lift === 0
      ? `${third}, so the third equation holds: the lines intersect, at $${coords(Q)}.$`
      : `${third}, so the third equation fails: the lines do not intersect.`;
    const answerC = lift === 0 ? `The lines intersect, at $${coords(Q)}.$` : 'The lines do not intersect.';
    return {
      questionLines: [
        'The equations of two planes are given below.',
        '',
        `$\\pi_1: ${planeText(n1, c1)}$`,
        `$\\pi_2: ${planeText(n2, c2)}$`,
        '',
        '<b>(a)</b> Verify that the line of intersection, $L_1$, of these two planes has parametric equations',
        '',
        ...axes.map((axis, i) => `$${axis} = ${lineL1[i]}$`),
        '',
        `<b>(b)</b> Let $\\pi_3$ be the plane with equation $${planeText(n3, c3)}.$`,
        'Calculate the acute angle between the line $L_1$ and the plane $\\pi_3.$',
        `<b>(c)</b> $L_2$ is the line perpendicular to $\\pi_3$ passing through $P${coords(P)}.$`,
        'Determine whether or not $L_1$ and $L_2$ intersect.',
      ],
      solutionSteps: [
        `<strong>(a)</strong> In $\\pi_1$: $${substituted(n1)} = ${c1}$, so $L_1$ lies in $\\pi_1$`,
        `<strong>(a)</strong> In $\\pi_2$: $${substituted(n2)} = ${c2}$; therefore the line lies on both planes`,
        `<strong>(b)</strong> $\\mathbf{d} = ${column(d)}$, $\\mathbf{n} = ${column(n3)}$`,
        `<strong>(b)</strong> $\\cos\\phi = \\frac{|\\mathbf{d} \\cdot \\mathbf{n}|}{|\\mathbf{d}||\\mathbf{n}|} = ${cos}$`,
        `<strong>(b)</strong> The angle between $L_1$ and the normal is $${rounded(90 - deg, 1)}^{\\circ}$, so the acute angle between $L_1$ and $\\pi_3$ is ${angleText}`,
        `<strong>(c)</strong> $L_2$: $x = ${lineL2[0]};\\ y = ${lineL2[1]};\\ z = ${lineL2[2]}$`,
        `<strong>(c)</strong> $${eqX}$; $${eqY}$`,
        `<strong>(c)</strong> $${M} = ${mu0};\\ ${L} = ${lambda0}$`,
        `<strong>(c)</strong> ${conclusion}`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1, 1, 1],
      finalAnswer: [
        `(a) $${substituted(n1)} = ${c1}$ and $${substituted(n2)} = ${c2}$, so $L_1$ lies on both planes.`,
        `(b) ${angleText}`,
        `(c) ${answerC}`,
      ].join('<br>'),
      ladder: {
        moves: [
          'A line lies in a plane when every point of it fits the plane\'s equation. How can you show that?',
          '(a) Substitute the line\'s $x$, $y$ and $z$ into the equation of $\\pi_1$.',
          '(a) Do the same for $\\pi_2$, and say what that shows.',
          '(b) Write the direction of $L_1$ and the normal of $\\pi_3$.',
          '(b) Use the scalar product to find the angle between them.',
          '(b) The angle with the normal is not the angle with the plane: adjust, and give the acute angle.',
          '(c) $L_2$ goes along the normal of $\\pi_3$ through $P$. Write its parametric equations.',
          '(c) Equate two of the coordinates of the lines, with a different parameter for each.',
          '(c) Solve for the two parameters.',
          '(c) Check them in the third coordinate, and say what that shows.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        shows: [
          null,
          `$${substituted(n1)} = ${c1}$`,
          `$${substituted(n2)} = ${c2}$; therefore the line lies on both planes`,
          `$${column(d)}$, $${column(n3)}$`,
          `$\\cos\\phi = ${cos}$`,
          angleText,
          `$x = ${lineL2[0]};\\ y = ${lineL2[1]};\\ z = ${lineL2[2]}$`,
          `$${eqX}$; $${eqY}$`,
          `$${M} = ${mu0};\\ ${L} = ${lambda0}$`,
          null,
        ],
        watch: { at: 5, text: 'The angle between a line and a plane is $90^{\\circ}$ minus the angle between the line and the normal.' },
      },
    };
  },
};

export const ROUTINES = {
  '2019 Q15': q2019q15,
};
