/**
 * Advanced Higher, Vectors: how each card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/vectors.ts` under the same label.
 */
import type { Built, CardRoutine } from '../types';
import { int, nonZero, pick, until } from '../draw';
import { poly, rounded, sqrtOf, sum } from '../maths/format';
import { gcd } from '../maths/integer';
import { augmented, det3, eliminate, opText, type Row } from '../maths/linear';
import { type V3, add3, column, content3, coords, cross3, dot3, scale3, sub3 } from '../maths/vector';

// ── 2026 P2 Q14 ────────────────────────────────────────────────────────────
// (a) the plane through P, Q, R; (b) where the line meets it, S;
// (c) the acute angle between them

interface P2Q14 {
  P: V3;
  /** PQ and PR, both in the plane. */
  u: V3; v: V3;
  /** Where the line meets the plane, and its direction. */
  S: V3; d: V3;
  /** The parameter at S, from the line's printed point G = S - tS d. */
  tS: number;
}

/** A whole vector at right angles to n, or null when the third component is not whole. */
function along(n: V3): V3 | null {
  const x = int(-4, 4), y = int(-4, 4);
  const top = -(n[0] * x + n[1] * y);
  return top % n[2] === 0 ? [x, y, top / n[2]] : null;
}

const within = (v: V3, limit: number) => v.every(c => Math.abs(c) <= limit);
const degrees = (radians: number) => (radians * 180) / Math.PI;

/** The acute angle between the line and the plane, in degrees. */
const angleOf = (d: V3, n: V3) => degrees(Math.asin(Math.abs(dot3(d, n)) / Math.sqrt(dot3(d, d) * dot3(n, n))));

/** |d||n| as a paper writes it: `\sqrt{14}\sqrt{6}`, a whole root first. */
function lengths(dd: number, nn: number): string {
  const [a, b] = [sqrtOf(dd), sqrtOf(nn)];
  const whole = (s: string) => !s.startsWith('\\');
  if (whole(a) && whole(b)) return `${a} \\times ${b}`;
  return whole(b) ? `${b}${a}` : `${a}${b}`;
}

const q2026p2q14: CardRoutine<P2Q14> = {
  // A piece at a time, each with its own light test, so no one rejection
  // loop has to satisfy everything at once.
  draw: () => {
    // The normal: small, no zero component, the first positive.
    const n = until((): V3 => [int(1, 3), nonZero(-3, 3), nonZero(-3, 3)], v => content3(v) === 1);
    const inPlane = () => until(() => along(n), w => w !== null && content3(w) > 0 && within(w, 6)) as V3;
    const u = inPlane();
    const v = until(inPlane, v => content3(cross3(u, v)) > 0);
    const P = until((): V3 => [nonZero(-5, 6), nonZero(-5, 6), nonZero(-6, 6)],
      P => within(add3(P, u), 9) && within(add3(P, v), 9) && dot3(n, P) !== 0);
    const S = until(() => add3(P, inPlane()), S => within(S, 9));
    // The line: not parallel to the plane, at a readable angle never on a
    // rounding boundary, its printed point with no zero coordinate.
    const DIRECTION = [-3, -2, -1, 2, 3];
    const d = until((): V3 => [pick(DIRECTION), pick(DIRECTION), pick(DIRECTION)], d => {
      if (dot3(d, n) === 0) return false;
      const angle = angleOf(d, n);
      const tenth = angle * 10 - Math.floor(angle * 10);
      return angle > 8 && angle < 82 && Math.abs(tenth - 0.5) > 0.05;
    });
    const tS = until(() => pick([-3, -2, -1, 1, 2, 3]), t => {
      const G = sub3(S, scale3(t, d));
      return within(G, 12) && G.every(c => c !== 0);
    });
    return { P, u, v, S, d, tS };
  },

  build: ({ P, u, v, S, d, tS }): Built => {
    const Q = add3(P, u), R = add3(P, v);
    const cross = cross3(u, v);
    const k = content3(cross) * (cross[0] < 0 ? -1 : 1);
    const n: V3 = [cross[0] / k, cross[1] / k, cross[2] / k];
    const D = dot3(n, P);
    const axes = ['x', 'y', 'z'] as const;
    const lhs = sum(axes.map((axis, i) => ({ coef: n[i], body: axis })));
    const plane = `${lhs} = ${D}`;
    const G = sub3(S, scale3(tS, d));
    const symmetric = axes.map((axis, i) =>
      `\\frac{${sum([{ coef: 1, body: axis }, { coef: -G[i], body: '' }])}}{${d[i]}}`).join(' = ');
    const lines = axes.map((_, i) => poly([d[i], G[i]], 't'));
    const parametric = axes.map((axis, i) => `${axis} = ${lines[i]}`).join(',\\ ');
    const substituted = lines.map((line, i) => {
      const c = Math.abs(n[i]);
      const term = c === 1 ? `(${line})` : `${c}(${line})`;
      if (i === 0) return n[i] === 1 ? line : `${n[i]}(${line})`;
      return `${n[i] < 0 ? ' - ' : ' + '}${term}`;
    }).join('');
    const collected = sum([{ coef: dot3(n, d), body: 't' }, { coef: dot3(n, G), body: '' }]);
    const vmatrix = `\\begin{vmatrix}\\mathbf{i} & \\mathbf{j} & \\mathbf{k}\\\\${u.join(' & ')}\\\\${v.join(' & ')}\\end{vmatrix}`;
    const cosine = `\\frac{${dot3(d, n)}}{${lengths(dot3(d, d), dot3(n, n))}}`;
    const theta = angleOf(d, n);
    const phi = 90 - theta;
    const normalLine = k === 1 ? '' : `, so take $\\mathbf{n} = ${column(n)}$`;
    return {
      questionLines: [
        `The plane $\\pi$ contains the points $P${coords(P)}$, $Q${coords(Q)}$ and $R${coords(R)}.$`,
        '<b>(a)</b> Determine the Cartesian equation of $\\pi.$',
        '',
        'The line $L$ has symmetric equations',
        '',
        `$${symmetric}.$`,
        '',
        '$L$ intersects $\\pi$ at the point $S.$',
        '<b>(b)</b> Find the coordinates of $S.$',
        '<b>(c)</b> Calculate the size of the acute angle between $L$ and $\\pi.$',
      ],
      solutionSteps: [
        `<strong>(a)</strong> $\\overrightarrow{PQ} = ${column(u)}$ and $\\overrightarrow{PR} = ${column(v)}$`,
        `<strong>(a)</strong> $\\overrightarrow{PQ} \\times \\overrightarrow{PR} = ${vmatrix}$`,
        `<strong>(a)</strong> $\\overrightarrow{PQ} \\times \\overrightarrow{PR} = ${column(cross)}$${normalLine}`,
        `<strong>(a)</strong> Using $P$: $${plane}$`,
        `<strong>(b)</strong> $${parametric}$`,
        `<strong>(b)</strong> $${substituted} = ${D}$`,
        `<strong>(b)</strong> $${collected} = ${D}$, so $t = ${tS}$ and $S${coords(S)}$`,
        `<strong>(c)</strong> $\\mathbf{d} = ${column(d)}$`,
        `<strong>(c)</strong> $\\cos\\phi = \\frac{\\mathbf{d} \\cdot \\mathbf{n}}{|\\mathbf{d}||\\mathbf{n}|} = ${cosine}$`,
        `<strong>(c)</strong> The acute angle between $L$ and the normal is $${rounded(phi, 1)}^{\\circ}$, so the acute angle between $L$ and $\\pi$ is $90^{\\circ} - ${rounded(phi, 1)}^{\\circ} = ${rounded(theta, 1)}^{\\circ}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      finalAnswer: `(a) $${plane}$<br>(b) $S${coords(S)}$<br>(c) $${rounded(theta, 1)}^{\\circ}$`,
      ladder: {
        moves: [
          'A plane\'s normal is perpendicular to every direction in it. How can two vectors in the plane give you one?',
          '(a) Find two vectors in the plane from the three points.',
          '(a) Set up their vector product.',
          '(a) Work out the vector product to get a normal.',
          '(a) Use the normal and one of the points to write the equation of the plane.',
          '(b) Turn the symmetric equations of $L$ into parametric form.',
          '(b) Substitute into the plane\'s equation and solve for the parameter.',
          '(b) Put the parameter back to find $S$.',
          '(c) Read the direction vector of $L$ from its equations.',
          '(c) Use the scalar product of the direction and the normal.',
          '(c) The angle with the normal is not the angle with the plane: adjust, and give the acute angle.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        shows: [
          null,
          `$${column(u)}$, $${column(v)}$`,
          `$${vmatrix}$`,
          `$${column(cross)}$`,
          null,
          null,
          `$${substituted} = ${D}$`,
          null,
          `$${column(d)}$`,
          `$${cosine}$`,
          null,
        ],
        watch: { at: 9, text: 'The angle between a line and a plane is $90^{\\circ}$ minus the angle between the line and the normal.' },
      },
    };
  },
};

// ── 2025 P1 Q8 ─────────────────────────────────────────────────────────────
// (a) T, where three planes meet, by Gaussian elimination; (b) P, where a line
// in symmetric form meets the third plane; (c) the line through T and P.
// Built from the answers: T first, then P = T + v with v in the third plane,
// then the line's printed point G = P - μ d.

interface P1Q8 {
  rows: Row[];
  T: V3;
  /** TP, at right angles to the third plane's normal, so P is on it. */
  v: V3;
  /** L1's direction, and the parameter at P from its printed point. */
  d: V3; mu: number;
}

const q2025p1q8: CardRoutine<P1Q8> = {
  // A piece at a time, each with its own light test, as 2026 P2 Q14.
  draw: () => {
    const { rows, T } = until(
      () => {
        const T: V3 = [nonZero(-5, 5), nonZero(-5, 5), nonZero(-5, 5)];
        const coef = [
          [1, nonZero(-4, 4), nonZero(-4, 4)],
          [nonZero(-3, 3), nonZero(-4, 4), nonZero(-4, 4)],
          [nonZero(-3, 3), nonZero(-4, 4), nonZero(-4, 4)],
        ];
        return { rows: coef.map(c => [...c, dot3(c as unknown as V3, T)]) as Row[], T };
      },
      ({ rows }) => {
        if (det3(rows) === 0 || !rows.every(r => Math.abs(r[3]) <= 30)) return false;
        // No plane a pupil would divide through first, as 2x + 2y + 2z = -10.
        if (!rows.every(r => r.reduce((g, c) => gcd(g, c), 0) === 1)) return false;
        const e = eliminate(rows);
        const small = (m: readonly Row[]) => m.every(r => r.every(c => Math.abs(c) <= 40));
        // No zero in the working until the one being made, as 2026 P1 Q2.
        return !!e && small(e.first) && small(e.second) && e.first.slice(1).every(r => r[1] !== 0 && r[2] !== 0);
      },
    );
    const n: V3 = [rows[2][0], rows[2][1], rows[2][2]];
    const v = until((): V3 | null => {
      const x = int(-4, 4), y = int(-4, 4);
      const top = -(n[0] * x + n[1] * y);
      return top % n[2] === 0 ? [x, y, top / n[2]] : null;
    }, w => w !== null && w.some(c => c !== 0) && w.every(c => Math.abs(c) <= 8)
      && add3(T, w).every(c => Math.abs(c) <= 12)) as V3;
    const P = add3(T, v);
    const d = until((): V3 => [nonZero(-3, 3), nonZero(-3, 3), nonZero(-3, 3)], d => dot3(d, n) !== 0 && content3(d) === 1);
    const mu = until(() => pick([-3, -2, -1, 1, 2, 3]), m => {
      const G = sub3(P, scale3(m, d));
      return G.every(c => c !== 0 && Math.abs(c) <= 12);
    });
    return { rows, T, v, d, mu };
  },

  build: ({ rows, T, v, d, mu }): Built => {
    const e = eliminate(rows)!;
    const axes = ['x', 'y', 'z'] as const;
    const lhs = (r: Row) => sum(axes.map((axis, i) => ({ coef: r[i], body: axis })));
    const n: V3 = [rows[2][0], rows[2][1], rows[2][2]], D = rows[2][3];
    const P = add3(T, v);
    const G = sub3(P, scale3(mu, d));
    const [op2, op3] = e.firstOps;
    const last = e.second[2];
    const tValues = `x = ${T[0]},\\ y = ${T[1]},\\ z = ${T[2]}`;

    const symmetric = axes.map((axis, i) =>
      `\\frac{${sum([{ coef: 1, body: axis }, { coef: -G[i], body: '' }])}}{${d[i]}}`).join(' = ');
    const lines = axes.map((_, i) => poly([d[i], G[i]], '\\mu'));
    const parametric = axes.map((axis, i) => `${axis} = ${lines[i]}`).join(',\\ ');
    const substituted = lines.map((line, i) => {
      const c = Math.abs(n[i]);
      const term = c === 1 ? `(${line})` : `${c}(${line})`;
      if (i === 0) return n[i] === 1 ? line : n[i] === -1 ? `-(${line})` : `${n[i]}(${line})`;
      return `${n[i] < 0 ? ' - ' : ' + '}${term}`;
    }).join('');
    const collected = sum([{ coef: dot3(n, d), body: '\\mu' }, { coef: dot3(n, G), body: '' }]);
    const l2 = axes.map((axis, i) => `${axis} = ${sum([{ coef: P[i], body: '' }, { coef: v[i], body: '\\lambda' }])}`).join(',\\ ');

    return {
      questionLines: [
        'Three planes are defined by',
        '',
        ...rows.map((r, i) => `$\\pi_${i + 1}:\\quad ${lhs(r)} = ${r[3]}$`),
        '',
        '<b>(a)</b> Use Gaussian elimination to find T, the point of intersection of the three planes.',
        '',
        `The line $L_1$ is defined by $${symmetric}.$`,
        '<b>(b)</b> Find P, the point of intersection of the line $L_1$ and the plane $\\pi_3.$',
        '',
        'The line $L_2$ passes through points T (the point of intersection of the three planes) and P (the point of intersection of the line $L_1$ and the plane $\\pi_3$).',
        '<b>(c)</b> Find, in parametric form, the equations of the line $L_2.$',
      ],
      solutionSteps: [
        `<strong>(a)</strong> The augmented matrix: $${augmented(rows)}$`,
        `<strong>(a)</strong> $${opText(op2)}$ and $${opText(op3)}$: $${augmented(e.first)}$`,
        `<strong>(a)</strong> $${opText(e.secondOp)}$: $${augmented(e.second)}$`,
        `<strong>(a)</strong> So $${sum([{ coef: last[2], body: 'z' }])} = ${last[3]}$, and by back substitution $${tValues}$: $T${coords(T)}$`,
        `<strong>(b)</strong> Setting each fraction equal to $\\mu$: $${parametric}$`,
        `<strong>(b)</strong> Substituting into $\\pi_3$: $${substituted} = ${D}$`,
        `<strong>(b)</strong> $${collected} = ${D}$, so $\\mu = ${mu}$ and $P${coords(P)}$`,
        `<strong>(c)</strong> $\\overrightarrow{TP} = ${column(v)}$`,
        `<strong>(c)</strong> Through $P$: $${l2}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1, 1, 1],
      finalAnswer: `(a) $T${coords(T)}$<br>(b) $P${coords(P)}$<br>(c) $${l2}$ (or equivalent)`,
      ladder: {
        moves: [
          'Three planes meet at a point when all three equations hold. How can you solve them systematically?',
          '(a) Write the augmented matrix.',
          '(a) Use row operations to make zeros below the top of the first column.',
          '(a) Complete the row operations to upper triangular form.',
          '(a) Back-substitute to find $T$.',
          '(b) Set the symmetric equations of $L_1$ equal to a parameter, and write $x$, $y$ and $z$ in terms of it.',
          '(b) Substitute into the equation of $\\pi_3$ and solve.',
          '(b) Put the parameter back to find $P$.',
          '(c) Subtract the position vectors of $T$ and $P$ to get a direction.',
          '(c) Use a point and the direction to write the parametric equations.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        shows: [
          null,
          `$${augmented(rows)}$`,
          `$${augmented(e.first)}$`,
          `$${augmented(e.second)}$`,
          null,
          `$${parametric}$`,
          `$${substituted} = ${D}$`,
          null,
          `$${column(v)}$`,
          null,
        ],
        watch: { at: 2, text: 'Only row operations earn the elimination marks. Solving by substitution does not.' },
      },
    };
  },
};

// ── 2024 P2 Q14 ────────────────────────────────────────────────────────────
// (a) the plane through A, B, C from AB × AC; (b) a line parallel to it, off
// it: substituting gives a constant that is not the plane's.

interface P2Q14of2024 {
  A: V3;
  /** AB and AC, both in the plane. */
  u: V3; v: V3;
  /** The line's printed point, off the plane, and its direction, in the plane's directions. */
  G: V3; w: V3;
}

/**
 * Every whole vector at right angles to n with x and y from -4 to 4, no
 * component 0 and none past `limit`: listed, not drawn, so a normal with few
 * of them is refused up front rather than exhausting a rejection loop.
 */
function across(n: V3, limit: number): V3[] {
  const out: V3[] = [];
  for (let x = -4; x <= 4; x++) for (let y = -4; y <= 4; y++) {
    const top = -(n[0] * x + n[1] * y);
    if (top % n[2] !== 0) continue;
    const w: V3 = [x, y, top / n[2]];
    if (w.every(c => c !== 0) && within(w, limit)) out.push(w);
  }
  return out;
}

const q2024p2q14: CardRoutine<P2Q14of2024> = {
  draw: () => {
    // The normal: small, no zero component, the first positive, as the paper's (1, 5, 1),
    // with two independent sides for the plane and a small direction for the line.
    const n = until((): V3 => [int(1, 3), nonZero(-5, 5), nonZero(-5, 5)], v => {
      if (content3(v) !== 1) return false;
      const sides = across(v, 9);
      return sides.some(a => sides.some(b => content3(cross3(a, b)) > 0)) && across(v, 5).some(w => content3(w) === 1);
    });
    const sides = across(n, 9);
    const u = pick(sides);
    const v = until(() => pick(sides), v => content3(cross3(u, v)) > 0);
    const A = until((): V3 => [nonZero(-5, 9), nonZero(-5, 9), nonZero(-5, 9)],
      A => within(add3(A, u), 12) && within(add3(A, v), 12));
    // The line's direction: in the plane's directions, so parallel, no common factor, as (1, -1, 4).
    const w = pick(across(n, 5).filter(w => content3(w) === 1));
    const G = until((): V3 => [nonZero(-6, 6), nonZero(-6, 6), nonZero(-6, 6)], G => dot3(n, G) !== dot3(n, A));
    return { A, u, v, G, w };
  },

  build: ({ A, u, v, G, w }): Built => {
    const B = add3(A, u), C = add3(A, v);
    const cross = cross3(u, v);
    const k = content3(cross) * (cross[0] < 0 ? -1 : 1);
    const n: V3 = [cross[0] / k, cross[1] / k, cross[2] / k];
    const D = dot3(n, A), off = dot3(n, G);
    const axes = ['x', 'y', 'z'] as const;
    const plane = `${sum(axes.map((axis, i) => ({ coef: n[i], body: axis })))} = ${D}`;
    const symmetric = axes.map((axis, i) =>
      `\\frac{${sum([{ coef: 1, body: axis }, { coef: -G[i], body: '' }])}}{${w[i]}}`).join(' = ');
    // Point first, as the paper's x = 1 + λ.
    const lines = axes.map((_, i) => sum([{ coef: G[i], body: '' }, { coef: w[i], body: '\\lambda' }]));
    const parametric = axes.map((axis, i) => `${axis} = ${lines[i]}`).join(',\\ ');
    // As the paper's 1 + λ + 5(-1 - λ) - 1 + 4λ: a coefficient of 1 takes no bracket.
    const substituted = lines.map((line, i) => {
      const c = n[i];
      if (c === 1) return i === 0 ? line : line.startsWith('-') ? ` - ${line.slice(1)}` : ` + ${line}`;
      if (c === -1) return i === 0 ? `-(${line})` : ` - (${line})`;
      const term = `${Math.abs(c)}(${line})`;
      return i === 0 ? `${c < 0 ? '-' : ''}${term}` : `${c < 0 ? ' - ' : ' + '}${term}`;
    }).join('');
    const vmatrix = `\\begin{vmatrix}\\mathbf{i} & \\mathbf{j} & \\mathbf{k}\\\\${u.join(' & ')}\\\\${v.join(' & ')}\\end{vmatrix}`;
    const normalLine = k === 1 ? '' : `, so take $\\mathbf{n} = ${column(n)}$`;
    const vectors = `$\\vec{AB} = ${column(u)}$, $\\vec{AC} = ${column(v)}$`;
    const conclusion = `${off} \\neq ${D}`;
    return {
      questionLines: [
        `A plane passes through $A${coords(A)}$, $B${coords(B)}$ and $C${coords(C)}.$`,
        '<b>(a)</b> (i) Determine $\\vec{AB}$ and $\\vec{AC}.$',
        '',
        '<b>(a)</b> (ii) Hence find the Cartesian equation of the plane.',
        '',
        `A line is defined by the equations $${symmetric}.$`,
        '<b>(b)</b> Show that the line and the plane do not intersect.',
      ],
      solutionSteps: [
        `<strong>(a)(i)</strong> ${vectors}`,
        `<strong>(a)(ii)</strong> $\\vec{AB} \\times \\vec{AC} = ${vmatrix}$`,
        `<strong>(a)(ii)</strong> $\\vec{AB} \\times \\vec{AC} = ${column(cross)}$${normalLine}`,
        `<strong>(a)(ii)</strong> Using $A$: $${plane}$`,
        `<strong>(b)</strong> $${parametric}$`,
        `<strong>(b)</strong> Substituting into the left-hand side: $${substituted} = ${off}$`,
        `<strong>(b)</strong> $${conclusion}$: the equation is inconsistent, so the line and the plane do not intersect.`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1],
      finalAnswer: `(a)(i) ${vectors}<br>(a)(ii) $${plane}$<br>(b) Substituting $${parametric}$ into the plane gives $${conclusion}$, so they do not intersect.`,
      ladder: {
        moves: [
          'A plane\'s normal is perpendicular to every direction in it. How can two vectors in the plane give you one?',
          '(a)(i) Subtract the position vectors to find $\\vec{AB}$ and $\\vec{AC}$.',
          '(a)(ii) Set up their vector product.',
          '(a)(ii) Work out the vector product to get a normal.',
          '(a)(ii) Use the normal and one of the points to write the equation of the plane.',
          '(b) Write the line in parametric form.',
          '(b) Substitute into the left-hand side of the plane\'s equation and simplify.',
          '(b) Compare the result with the right-hand side, and say what that means.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1],
        shows: [null, `$${column(u)}$, $${column(v)}$`, `$${vmatrix}$`, `$${column(n)}$`, null, null, `$${substituted}$`, null],
        watch: { at: 2, text: 'Use direction vectors between the points, not the points\' position vectors, for the normal.' },
      },
    };
  },
};

// ── 2021 P2 Q12 ────────────────────────────────────────────────────────────
// (a) the plane π1 through A, B, C from AB × AC; (b) the parallel plane π2
// through the origin; (c) the sphere touching π1 at A and π2 at Q, so AQ runs
// along the normal: its parametric equations, then Q where it meets π2.
// Built backwards from Q on π2 and A = Q + t n, as the paper's Q(2, 4, 2),
// n = (1, -2, 3), t = 2, with AB × AC exactly n, as the paper's.

interface P2Q12of2021 {
  n: V3; Q: V3; t: number;
  /** AB and AC, in the plane, with AB × AC = n. */
  u: V3; v: V3;
}

/** Every (u, v) of sides across n, components up to 6, whose vector product is n itself. */
function sidesCrossingTo(n: V3): [V3, V3][] {
  const sides = across(n, 6);
  return sides.flatMap(u => sides.filter(v => cross3(u, v).every((c, i) => c === n[i])).map((v): [V3, V3] => [u, v]));
}

const q2021p2q12: CardRoutine<P2Q12of2021> = {
  draw: () => {
    // The normal: small, no zero component, the first positive, as the paper's (1, -2, 3),
    // and the vector product of two small sides with no factor to take out.
    const n = until((): V3 => [int(1, 3), nonZero(-4, 4), nonZero(-4, 4)],
      v => content3(v) === 1 && sidesCrossingTo(v).length > 0 && across(v, 6).length > 0);
    return until(() => {
      const [u, v] = pick(sidesCrossingTo(n));
      return { n, Q: pick(across(n, 6)), t: nonZero(-3, 3), u, v };
    }, ({ n, Q, t, u, v }) => {
      const A = add3(Q, scale3(t, n));
      return within(A, 12) && within(add3(A, u), 12) && within(add3(A, v), 12);
    });
  },

  build: ({ n, Q, t, u, v }): Built => {
    const A = add3(Q, scale3(t, n));
    const B = add3(A, u), C = add3(A, v);
    const D = dot3(n, A), nn = dot3(n, n);
    const axes = ['x', 'y', 'z'] as const;
    const left = sum(axes.map((axis, i) => ({ coef: n[i], body: axis })));
    const [plane1, plane2] = [`${left} = ${D}`, `${left} = 0`];
    // Point first, as the paper's x = 4 + t; a zero coordinate leaves y = -2t.
    const lines = axes.map((_, i) => sum([{ coef: A[i], body: '' }, { coef: n[i], body: 't' }]));
    const parametric = axes.map((axis, i) => `${axis} = ${lines[i]}`).join(',\\ ');
    // As the paper's 4 + t - 2(-2t) + 3(8 + 3t): a coefficient of 1 takes no bracket.
    const substituted = lines.map((line, i) => {
      const c = n[i];
      if (c === 1) return i === 0 ? line : line.startsWith('-') ? ` - ${line.slice(1)}` : ` + ${line}`;
      if (c === -1) return i === 0 ? `-(${line})` : ` - (${line})`;
      const term = `${Math.abs(c)}(${line})`;
      return i === 0 ? `${c < 0 ? '-' : ''}${term}` : `${c < 0 ? ' - ' : ' + '}${term}`;
    }).join('');
    const collected = sum([{ coef: nn, body: 't' }, { coef: D, body: '' }]);
    const vmatrix = `\\begin{vmatrix}\\mathbf{i} & \\mathbf{j} & \\mathbf{k}\\\\${u.join(' & ')}\\\\${v.join(' & ')}\\end{vmatrix}`;
    const vectors = `$\\overrightarrow{AB} = ${column(u)}$, $\\overrightarrow{AC} = ${column(v)}$`;
    return {
      questionLines: [
        `The points $A${coords(A)}$, $B${coords(B)}$ and $C${coords(C)}$ all lie on the plane $\\pi_1.$`,
        '<b>(a)</b> Find the Cartesian equation of $\\pi_1.$',
        'The plane $\\pi_2$ is parallel to $\\pi_1$ and passes through the origin.',
        '<b>(b)</b> State the equation of $\\pi_2.$',
        'A sphere touches $\\pi_1$, where $A$ is the point of contact. The sphere also has a single point of contact, $Q$, with $\\pi_2.$',
        '<b>(c)</b> (i) Find parametric equations for the line $AQ.$',
        '(ii) Hence find the coordinates for $Q.$',
      ],
      solutionSteps: [
        `<strong>(a)</strong> ${vectors}`,
        `<strong>(a)</strong> $\\overrightarrow{AB} \\times \\overrightarrow{AC} = ${vmatrix}$`,
        `<strong>(a)</strong> $\\mathbf{n} = ${column(n)}$`,
        `<strong>(a)</strong> Using $A$: $${plane1}$`,
        `<strong>(b)</strong> The same normal, through the origin: $${plane2}$`,
        `<strong>(c)(i)</strong> Along the normal from $A$: $${parametric}$`,
        `<strong>(c)(ii)</strong> $${substituted} = 0$`,
        `<strong>(c)(ii)</strong> $${collected} = 0$, so $t = ${-t}$ and $Q${coords(Q)}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1, 1],
      finalAnswer: `(a) $${plane1}$<br>(b) $${plane2}$<br>(c)(i) $${parametric}$<br>(c)(ii) $Q${coords(Q)}$`,
      ladder: {
        moves: [
          'A plane\'s normal is perpendicular to every direction in it. How can two vectors in the plane give you one?',
          '(a) Find two vectors in the plane from the three points.',
          '(a) Set up their vector product.',
          '(a) Work out the vector product to get a normal.',
          '(a) Use the normal and one of the points to write the equation.',
          '(b) A parallel plane has the same normal. Which constant puts it through the origin?',
          '(c)(i) $AQ$ is perpendicular to both planes. Use $A$ and the normal as its direction.',
          '(c)(ii) Substitute the line into the equation of $\\pi_2$ and solve.',
          '(c)(ii) Put the parameter back to find $Q$.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1, 1],
        shows: [null, vectors, `$${vmatrix}$`, `$\\mathbf{n} = ${column(n)}$`, null, null, null, `$${substituted} = 0$`, null],
        watch: { at: 6, text: 'The line $AQ$ goes along the normal. That is what the tangent sphere tells you.' },
      },
    };
  },
};

export const ROUTINES = {
  '2021 P2 Q12': q2021p2q12,
  '2024 P2 Q14': q2024p2q14,
  '2025 P1 Q8': q2025p1q8,
  '2026 P2 Q14': q2026p2q14,
};
