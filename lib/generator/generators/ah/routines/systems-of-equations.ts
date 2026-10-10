/**
 * Advanced Higher, Systems of Equations: how each card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/systems-of-equations.ts` under the same label.
 */
import type { Built, CardRoutine } from '../types';
import { nonZero, pick, sign, until } from '../../core/draw';
import { num, sum } from '../../core/maths/format';
import { augmented, combine, det3, eliminate, opText, type Row } from '../../core/maths/linear';
import { gcd } from '../../core/maths/integer';
import { q } from '../../core/maths/rational';

// ── 2026 P1 Q2 ─────────────────────────────────────────────────────────────
// Three equations, a leading x in the first, solved by Gaussian elimination.

interface Q2 { rows: Row[]; solution: [number, number, number] }

const within = (rows: readonly Row[], cap: number) => rows.every(r => r.every(v => Math.abs(v) <= cap));

const q2026p1q2: CardRoutine<Q2> = {
  draw: () => until(
    () => {
      const solution: [number, number, number] = [nonZero(-5, 5), nonZero(-5, 5), nonZero(-5, 5)];
      const coef = [
        [1, nonZero(-3, 3), nonZero(-3, 3)],
        [nonZero(-3, 3), nonZero(-3, 3), nonZero(-3, 3)],
        [nonZero(-3, 3), nonZero(-3, 3), nonZero(-3, 3)],
      ];
      const rows = coef.map(c => [...c, c[0] * solution[0] + c[1] * solution[1] + c[2] * solution[2]]);
      return { rows, solution };
    },
    ({ rows }) => {
      if (det3(rows) === 0) return false;
      if (!rows.every(r => Math.abs(r[3]) <= 30)) return false;
      // No equation a pupil would divide through first, as 2x + 2y + 2z = -10.
      if (!rows.every(r => r.reduce((g, v) => gcd(g, v), 0) === 1)) return false;
      const e = eliminate(rows);
      if (!e || !within(e.first, 40) || !within(e.second, 40)) return false;
      // No zero in the working until the one being made: a stray zero hands
      // over an unknown early, which the paper's working never does.
      return e.first.slice(1).every(r => r[1] !== 0 && r[2] !== 0);
    },
  ),

  build: ({ rows, solution: [x, y, z] }): Built => {
    const e = eliminate(rows)!;
    const equation = (r: Row) => `${sum([{ coef: r[0], body: 'x' }, { coef: r[1], body: 'y' }, { coef: r[2], body: 'z' }])} = ${r[3]}`;
    const [op2, op3] = e.firstOps;
    const last = e.second[2];
    const values = `x = ${x},\\ y = ${y},\\ z = ${z}`;
    return {
      questionLines: [
        'A system of equations is given by',
        '',
        ...rows.map(r => `$${equation(r)}$`),
        '',
        'Use Gaussian elimination to solve this system of equations.',
      ],
      solutionSteps: [
        `The augmented matrix: $${augmented(rows)}$`,
        `$${opText(op2)}$ and $${opText(op3)}$: $${augmented(e.first)}$`,
        `$${opText(e.secondOp)}$: $${augmented(e.second)}$`,
        `So $${sum([{ coef: last[2], body: 'z' }])} = ${last[3]}$, and by back substitution $${values}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `$${values}$`,
      ladder: {
        moves: [
          'How can you write three equations as one matrix that you can row-reduce?',
          'Write the augmented matrix: one row per equation, with the constants after the line.',
          'Use row operations to make zeros below the top entry of the first column.',
          'Make the last zero, in row 3 of column 2, so the matrix is upper triangular.',
          'Back-substitute: find $z$ from the last row, then $y$, then $x$.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, `$${augmented(rows)}$`, `$${augmented(e.first)}$`, `$${augmented(e.second)}$`, null],
        watch: { at: 2, text: 'Only row operations earn the elimination marks. Solving by substitution instead does not.' },
      },
    };
  },
};

// ── 2024 P2 Q3 ─────────────────────────────────────────────────────────────
// Three equations with λ as the last z coefficient: (a) z in terms of λ by
// Gaussian elimination; (b) the λ that makes it inconsistent; (c) the
// solution at one λ.
//
// Built from the echelon form the paper's working reaches:
//   U1 = (1, u12, u13 | v1), U2 = (0, 1, u23 | v2), U3 = (0, 0, λ + m | n),
// with R1 = U1, R2 = cU1 + sU2 and R3 = U1 + dU2 + U3, so the paper's own
// operations (cR1 - R2 or R2 - cR1, R3 - R1, then R3 - dR2) undo it. R3's z
// coefficient is exactly λ when m = -u13 - d u23.

interface P2Q3of2024 {
  u12: number; u13: number; u23: number; c: number; s: 1 | -1; d: number;
  /** (c)'s solution, and λ + m there. */
  x0: number; y0: number; z0: number; k: number;
}

/** The three rows, λ written in R3's z place, and the numbers the working needs. */
function system2024(n: P2Q3of2024) {
  const { u12, u13, u23, c, s, d, x0, y0, z0, k } = n;
  const m = -u13 - d * u23;
  const v2 = y0 + u23 * z0, v1 = x0 + u12 * y0 + u13 * z0, rhs = k * z0;
  const R1 = [1, u12, u13, v1];
  const R2 = [c, c * u12 + s, c * u13 + s * u23, c * v1 + s * v2];
  const R3 = [1, u12 + d, v1 + d * v2 + rhs];
  return { m, v1, v2, rhs, lambda1: k - m, R1, R2, R3 };
}

const lam = (m: number) => sum([{ coef: 1, body: '\\lambda' }, { coef: m, body: '' }]);

/** An augmented matrix whose cells may be written already, as `\lambda + 3`. */
const matrixOf = (rows: readonly (readonly (number | string)[])[]) =>
  `\\left(\\begin{array}{ccc|c}${rows.map(r => r.join(' & ')).join('\\\\')}\\end{array}\\right)`;

const q2024p2q3: CardRoutine<P2Q3of2024> = {
  draw: () => until(
    () => ({
      u12: nonZero(-4, 4), u13: nonZero(-4, 4), u23: nonZero(-4, 4),
      c: pick([2, 3]), s: sign(), d: nonZero(-4, 4),
      x0: nonZero(-5, 5), y0: nonZero(-5, 5), z0: nonZero(-4, 4), k: nonZero(-6, 6),
    }),
    (n) => {
      const { m, v1, v2, rhs, lambda1, R1, R2, R3 } = system2024(n);
      if (m === 0 || Math.abs(m) > 10 || lambda1 === 0 || Math.abs(lambda1) > 9) return false;
      if (v1 === 0 || v2 === 0 || Math.abs(rhs) > 30) return false;
      // Every printed number nonzero and small, as the paper's; no equation to divide through.
      const coefs = [...R1.slice(0, 3), ...R2.slice(0, 3), ...R3.slice(0, 2)];
      const consts = [R1[3], R2[3], R3[2], n.d * v2 + rhs];
      if (coefs.some(v => v === 0 || Math.abs(v) > 12) || consts.some(v => v === 0 || Math.abs(v) > 30)) return false;
      return R2.reduce((g, v) => gcd(g, v), 0) === 1;
    },
    1000,
  ),

  build: (n): Built => {
    const { u12, u13, u23, c, s, d, x0, y0, z0, k } = n;
    const { m, v2, rhs, lambda1, R1, R2, R3 } = system2024(n);
    const equation = (r: readonly number[]) => `${sum([{ coef: r[0], body: 'x' }, { coef: r[1], body: 'y' }, { coef: r[2], body: 'z' }])} = ${r[3]}`;
    const lines = [
      equation(R1),
      equation(R2),
      `${sum([{ coef: R3[0], body: 'x' }, { coef: R3[1], body: 'y' }, { coef: 1, body: '\\lambda z' }])} = ${R3[2]}`,
    ];
    const M0 = matrixOf([R1, R2, [R3[0], R3[1], '\\lambda', R3[2]]]);
    const U2 = [0, 1, u23, v2];
    const M1 = matrixOf([R1, U2, [0, d, lam(-u13), d * v2 + rhs]]);
    const M2 = matrixOf([R1, U2, [0, 0, lam(m), rhs]]);
    const op2 = s === -1 ? `${c}R_1 - R_2` : `R_2 - ${c}R_1`;
    const op3 = sum([{ coef: 1, body: 'R_3' }, { coef: -d, body: 'R_2' }]);
    const z = `z = \\frac{${rhs}}{${lam(m)}}`;
    const values = `x = ${x0},\\ y = ${y0},\\ z = ${z0}`;
    return {
      questionLines: [
        '<b>(a)</b> Use Gaussian elimination to express $z$ in terms of $\\lambda$ for the system of equations:',
        '',
        ...lines.map(l => `$${l}$`),
        '',
        '<b>(b)</b> State the value of $\\lambda$ for which this system is inconsistent.',
        `<b>(c)</b> Determine the solution of this system when $\\lambda = ${lambda1}.$`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> The augmented matrix: $${M0}$`,
        `<strong>(a)</strong> $${op2}$ and $R_3 - R_1$: $${M1}$`,
        `<strong>(a)</strong> $${op3}$: $${M2}$`,
        `<strong>(a)</strong> From the last row, $(${lam(m)})z = ${rhs}$, so $${z}$`,
        `<strong>(b)</strong> When $${lam(m)} = 0$ the last row reads $0z = ${rhs}$, which is impossible: $\\lambda = ${-m}$`,
        `<strong>(c)</strong> At $\\lambda = ${lambda1}$, $z = \\frac{${rhs}}{${k}} = ${z0}$; then $y = ${v2} - (${u23})(${z0}) = ${y0}$ and $x = ${x0}$: $${values}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1],
      finalAnswer: `(a) $${z}$<br>(b) $\\lambda = ${-m}$<br>(c) $${values}$`,
      ladder: {
        moves: [
          'How can you write three equations as one matrix that you can row-reduce?',
          '(a) Write the augmented matrix, with $\\lambda$ in the third row.',
          '(a) Use row operations to make zeros below the top entry of the first column.',
          '(a) Make the last zero, in row 3 of column 2.',
          '(a) Read $z$ from the last row, in terms of $\\lambda$.',
          '(b) Which value of $\\lambda$ makes the last row impossible?',
          `(c) Put $\\lambda = ${lambda1}$ into $z$, then back-substitute for $y$ and $x$.`,
        ],
        marks: [0, 1, 1, 1, 1, 1, 1],
        shows: [null, `$${M0}$`, `$${M1}$`, `$${M2}$`, `$${z}$`, null, null],
        // The draw's own bracket, as the scheme's note names it (the owner, full read 2026-10-05).
        watch: { at: 4, text: `Give $z$ on its own. Leaving it as $(${lam(m)})z = ${rhs}$ loses the mark.` },
      },
    };
  },
};

// ── 2023 P1 Q3 ─────────────────────────────────────────────────────────────
// Three equations that Gaussian elimination shows to be inconsistent.
//
// Built from the working the paper's reaches: R1 = (1, a, b | v1), and one
// row W = (0, p, r | w) that both R2 - cR1 and R3 - eR1 give, R3's constant
// the gap more, so R3 - R2 leaves 0 = gap (the paper's (0, 7, 1 | 14),
// (0, 7, 1 | 16)). Half the draws are redundant, the gap 0, so the last row
// is 0 = 0: the owner on the 2023 P1 sheet, "Make half redundant".

interface P1Q3of2023 { a: number; b: number; v1: number; c: number; e: number; p: number; r: number; w: number; delta: number; redundant: boolean }

/** The three rows, the two stages of the working, and the last row's constant. */
function reduced2023({ a, b, v1, c, e, p, r, w, delta, redundant }: P1Q3of2023) {
  const gap = redundant ? 0 : delta;
  const R1: Row = [1, a, b, v1];
  const W: Row = [0, p, r, w];
  const W3: Row = [0, p, r, w + gap];
  return { rows: [R1, combine(c, R1, 1, W), combine(e, R1, 1, W3)], first: [R1, W, W3], second: [R1, W, [0, 0, 0, gap]], gap };
}

const q2023p1q3: CardRoutine<P1Q3of2023> = {
  draw: () => until(
    () => ({
      a: nonZero(-4, 4), b: nonZero(-4, 4), v1: nonZero(-9, 9),
      c: nonZero(-3, 3), e: nonZero(-3, 3),
      p: nonZero(-8, 8), r: nonZero(-8, 8), w: nonZero(-20, 20), delta: nonZero(-5, 5),
      redundant: pick([true, false]),
    }),
    (n) => {
      // R2 and R3 would share their coefficients at sight: the paper's do not.
      if (n.c === n.e || gcd(n.p, n.r) !== 1) return false;
      const { rows, gap } = reduced2023(n);
      if (n.w + gap === 0) return false;
      // Every printed number nonzero and small, as the paper's; no equation to divide through.
      if (rows.some(row => row.slice(0, 3).some(v => v === 0 || Math.abs(v) > 9))) return false;
      if (rows.some(row => row[3] === 0 || Math.abs(row[3]) > 30)) return false;
      return rows.every(row => row.reduce((g, v) => gcd(g, v), 0) === 1);
    },
    1000,
  ),

  build: (n): Built => {
    const { c, e, redundant } = n;
    const { rows, first, second, gap } = reduced2023(n);
    const equation = (r: Row) => `${sum([{ coef: r[0], body: 'x' }, { coef: r[1], body: 'y' }, { coef: r[2], body: 'z' }])} = ${r[3]}`;
    const ops = `$${opText({ row: 2, t: 1, with: 1, o: -c })}$ and $${opText({ row: 3, t: 1, with: 1, o: -e })}$`;
    const conclusion = redundant
      ? 'the last row reads $0 = 0$, so there are infinitely many solutions'
      : `the last row reads $0 = ${gap}$, which is impossible`;
    const kind = redundant ? 'shows redundancy' : 'is inconsistent';
    return {
      questionLines: [
        'A system of equations is defined by',
        '',
        ...rows.map(r => `$${equation(r)}$`),
        '',
        'Use Gaussian elimination to determine whether the system shows redundancy, inconsistency or has a unique solution.',
      ],
      solutionSteps: [
        `The augmented matrix: $${augmented(rows)}$`,
        `${ops}: $${augmented(first)}$`,
        `$R_3 - R_2$: $${augmented(second)}$; ${conclusion}, so the system ${kind}`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `${redundant ? 'Redundant' : 'Inconsistent'}: ${conclusion}.`,
      ladder: {
        moves: [
          'What does the last row of a reduced matrix look like for each of the three outcomes?',
          'Write the augmented matrix.',
          'Use row operations to make zeros below the top entry of the first column.',
          'Finish the elimination, then say which case it is and why.',
        ],
        marks: [0, 1, 1, 1],
        shows: [null, `$${augmented(rows)}$`, `$${augmented(first)}$`, null],
        watch: { at: 3, text: 'Give the reason with your conclusion: say what the last row means.' },
      },
    };
  },
};

// ── 2022 P1 Q2 ─────────────────────────────────────────────────────────────
// Three equations, x alone at the start of the first and the third, solved by
// Gaussian elimination. The paper's solution has z = 0.

interface P1Q2of2022 { rows: Row[]; solution: [number, number, number] }

const q2022p1q2: CardRoutine<P1Q2of2022> = {
  draw: () => until(
    () => {
      const solution: [number, number, number] = [nonZero(-5, 5), nonZero(-5, 5), pick([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5])];
      const coef = [
        [1, nonZero(-4, 4), nonZero(-4, 4)],
        [pick([2, 3]) * sign(), nonZero(-4, 4), nonZero(-4, 4)],
        [1, nonZero(-7, 7), nonZero(-7, 7)],
      ];
      const rows = coef.map(c => [...c, c[0] * solution[0] + c[1] * solution[1] + c[2] * solution[2]]);
      return { rows, solution };
    },
    ({ rows }) => {
      if (det3(rows) === 0) return false;
      if (!rows.every(r => Math.abs(r[3]) <= 30)) return false;
      // No equation a pupil would divide through first.
      if (!rows.every(r => r.reduce((g, v) => gcd(g, v), 0) === 1)) return false;
      const e = eliminate(rows);
      if (!e || !within(e.first, 40) || !within(e.second, 40)) return false;
      // No zero in the working until the one being made, as the paper's.
      return e.first.slice(1).every(r => r[1] !== 0 && r[2] !== 0);
    },
  ),

  build: ({ rows, solution }): Built => {
    const [x, y, z] = solution;
    const e = eliminate(rows)!;
    const equation = (r: Row) => `${sum([{ coef: r[0], body: 'x' }, { coef: r[1], body: 'y' }, { coef: r[2], body: 'z' }])} = ${r[3]}`;
    const [op2, op3] = e.firstOps;
    const last = e.second[2];
    const values = `x = ${x},\\ y = ${y},\\ z = ${z}`;
    return {
      questionLines: [
        'Use Gaussian elimination to solve the following system of equations:',
        '',
        ...rows.map(r => `$${equation(r)}$`),
      ],
      solutionSteps: [
        `The augmented matrix: $${augmented(rows)}$`,
        `$${opText(op2)}$ and $${opText(op3)}$: $${augmented(e.first)}$`,
        `$${opText(e.secondOp)}$: $${augmented(e.second)}$`,
        `So $${sum([{ coef: last[2], body: 'z' }])} = ${last[3]}$, and by back substitution $${values}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `$${values}$`,
      ladder: {
        moves: [
          'How can you write three equations as one matrix that you can row-reduce?',
          'Write the augmented matrix.',
          'Use row operations to make zeros below the top entry of the first column.',
          'Make the last zero, in row 3 of column 2.',
          'Back-substitute: find $z$ from the last row, then $y$, then $x$.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, `$${augmented(rows)}$`, `$${augmented(e.first)}$`, `$${augmented(e.second)}$`, null],
        watch: { at: 2, text: 'Only row operations earn the elimination marks. Solving by substitution instead does not.' },
      },
    };
  },
};

// ── 2021 P1 Q4 ─────────────────────────────────────────────────────────────
// Three equations with λ as the last z coefficient: the λ for which there is
// no solution, by Gaussian elimination.
//
// Built from the working the paper's reaches: R1 = (1, a, b | d1); R2 - cR1
// and R3 - gR1 leave (0, p, q | r2) and (0, -mp, λ - gb | r3), so R3 + mR2
// leaves (0, 0, λ - λ0 | t) with t not 0 (the paper's R2 - 3R1, R3 + 2R1,
// then R3 + R2, and the last row (0, 0, λ + 1 | -9)). R3's y coefficient h is
// what makes the second column clear with that m: h = ga - mp.

interface P1Q4of2021 { a: number; b: number; d1: number; c: number; e: number; f: number; d2: number; g: number; m: number; d3: number }

/** The rows, the two stages and the no-solution λ, from the draw. */
function system2021({ a, b, d1, c, e, f, d2, g, m, d3 }: P1Q4of2021) {
  const p = e - c * a, qq = f - c * b;
  const h = g * a - m * p;
  const r2 = d2 - c * d1, r3 = d3 - g * d1;
  return { p, qq, h, r2, r3, lambda0: g * b - m * qq, t: r3 + m * r2 };
}

/** `\lambda + k` for a λ entry shifted by k. */
const lambdaPlus2021 = (k: number) => sum([{ coef: 1, body: '\\lambda' }, { coef: k, body: '' }]);

/** An augmented matrix whose cells may be written already, as `\lambda + 2`. */
const cells2021 = (rows: readonly (readonly (number | string)[])[]) =>
  `\\left(\\begin{array}{ccc|c}${rows.map(r => r.join(' & ')).join('\\\\')}\\end{array}\\right)`;

const q2021p1q4: CardRoutine<P1Q4of2021> = {
  draw: () => until(
    () => ({
      a: nonZero(-4, 4), b: nonZero(-4, 4), d1: nonZero(-9, 9),
      c: nonZero(-4, 4), e: nonZero(-6, 6), f: nonZero(-6, 6), d2: nonZero(-15, 15),
      g: nonZero(-4, 4), m: pick([1, -1, 2, -2]), d3: nonZero(-15, 15),
    }),
    (n) => {
      const { p, qq, h, r2, r3, lambda0, t } = system2021(n);
      // Every printed number nonzero and small, as the paper's (its working
      // within 11): coefficients within 10, constants within 20; the λ that
      // fails within 9; t not 0, so that λ gives no solution, not infinitely many.
      if (p === 0 || qq === 0 || h === 0 || Math.abs(h) > 9) return false;
      if (lambda0 === 0 || Math.abs(lambda0) > 9 || r2 === 0 || r3 === 0 || t === 0) return false;
      if ([p, qq, n.g * n.b].some(v => Math.abs(v) > 10) || [r2, r3, t].some(v => Math.abs(v) > 20)) return false;
      // No product in the row operations bigger than the paper's biggest,
      // 3 × 5 = 15 (the owner on 2023 P1: "biggest should be no larger than paper").
      const products = [n.c, n.g].flatMap(k => [n.a, n.b, n.d1].map(v => k * v)).concat([p, qq, r2].map(v => n.m * v));
      if (products.some(v => Math.abs(v) > 15)) return false;
      // No equation to divide through, and rows 2 and 3 start differently.
      return [n.c, n.e, n.f, n.d2].reduce((x, v) => gcd(x, v), 0) === 1 && n.c !== n.g;
    },
    1000,
  ),

  build: (n): Built => {
    const { a, b, d1, c, e, f, d2, g, m, d3 } = n;
    const { p, qq, h, r2, r3, lambda0, t } = system2021(n);
    const equation = (r: readonly number[]) => `${sum([{ coef: r[0], body: 'x' }, { coef: r[1], body: 'y' }, { coef: r[2], body: 'z' }])} = ${r[3]}`;
    const R1 = [1, a, b, d1];
    const M0 = cells2021([R1, [c, e, f, d2], [g, h, '\\lambda', d3]]);
    const M1 = cells2021([R1, [0, p, qq, r2], [0, -m * p, lambdaPlus2021(-g * b), r3]]);
    const M2 = cells2021([R1, [0, p, qq, r2], [0, 0, lambdaPlus2021(-lambda0), t]]);
    const op2 = opText({ row: 2, t: 1, with: 1, o: -c });
    const op3 = opText({ row: 3, t: 1, with: 1, o: -g });
    const op4 = opText({ row: 3, t: 1, with: 2, o: m });
    return {
      questionLines: [
        'A system of equations is given by',
        '',
        `$${equation([1, a, b, d1])}$`,
        `$${equation([c, e, f, d2])}$`,
        `$${sum([{ coef: g, body: 'x' }, { coef: h, body: 'y' }, { coef: 1, body: '\\lambda z' }])} = ${d3}$`,
        '',
        'where $\\lambda \\in \\mathbb{R}.$',
        'Use Gaussian elimination to determine the value of $\\lambda$ for which this system of equations has no solution.',
      ],
      solutionSteps: [
        `The augmented matrix: $${M0}$`,
        `$${op2}$ and $${op3}$: $${M1}$`,
        `$${op4}$: $${M2}$`,
        `The last row reads $(${lambdaPlus2021(-lambda0)})z = ${t}$: when $${lambdaPlus2021(-lambda0)} = 0$ it says $0 = ${t}$, which is impossible, so there is no solution when $\\lambda = ${lambda0}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `$\\lambda = ${lambda0}$`,
      ladder: {
        moves: [
          'What does the last row of a reduced matrix look like when a system has no solution?',
          'Write the augmented matrix, with $\\lambda$ in the third row.',
          'Use row operations to make zeros below the top entry of the first column.',
          'Make the last zero, in row 3 of column 2.',
          'Which value of $\\lambda$ makes the last row say $0$ equals something that is not $0$?',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, `$${M0}$`, `$${M1}$`, `$${M2}$`, null],
      },
    };
  },
};

// ── 2017 Q5 ────────────────────────────────────────────────────────────────
// Three equations with 2λ as the last z coefficient: (a)(i) z in terms of λ by
// Gaussian elimination, (ii) the λ that makes it inconsistent; (b) the
// solution at λ = h/2, a half, as the paper's -2.5. Built from that solution.
// The row operations clear the numbers only, so they are the ones `eliminate`
// finds with R3's z entry taken as 0; R3 is multiplied by p at the second
// stage, so its z entry ends as 2pλ + β.

interface Q5of2017 {
  a12: number; a13: number; a21: number; a22: number; a23: number; a31: number; a32: number;
  /** 2λ at (b), odd, so λ is a half. */
  h: number;
  x0: number; y0: number; z0: number;
}

/** The rows with R3's z entry 0, the elimination, and the λ coefficient and constants it ends with. */
function system2017(n: Q5of2017) {
  const { a12, a13, a21, a22, a23, a31, a32, h, x0, y0, z0 } = n;
  const R1 = [1, a12, a13, x0 + a12 * y0 + a13 * z0];
  const R2 = [a21, a22, a23, a21 * x0 + a22 * y0 + a23 * z0];
  const R3 = [a31, a32, 0, a31 * x0 + a32 * y0 + h * z0];
  const e = eliminate([R1, R2, R3]);
  if (!e) return null;
  const p = e.secondOp.t;
  const [, r2, r3] = e.first, last = e.second[2];
  return { R1, R2, R3, e, p, r2, r3, alpha: 2 * p, beta: last[2], gamma: last[3] };
}

/** An augmented matrix whose cells may be written already, as `2\lambda + 3`. */
const cells2017 = (rows: readonly (readonly (number | string)[])[]) =>
  `\\left(\\begin{array}{ccc|c}${rows.map(r => r.join(' & ')).join('\\\\')}\\end{array}\\right)`;

/** `2\lambda + 3`, `4\lambda - 1`. */
const lambda2017 = (a: number, b: number) => sum([{ coef: a, body: '\\lambda' }, { coef: b, body: '' }]);

const q2017q5: CardRoutine<Q5of2017> = {
  draw: () => until(
    () => ({
      // Rows 2 and 3 start with a multiple of x, as the paper's 4x and 3x, so
      // the first stage takes a multiple of R1 from each.
      a12: nonZero(-4, 4), a13: nonZero(-4, 4), a21: pick([-5, -4, -3, -2, 2, 3, 4, 5]), a22: nonZero(-5, 5), a23: nonZero(-5, 5),
      a31: pick([-5, -4, -3, -2, 2, 3, 4, 5]), a32: nonZero(-5, 5), h: pick([-9, -7, -5, -3, -1, 1, 3, 5, 7, 9]),
      x0: nonZero(-5, 5), y0: nonZero(-5, 5), z0: nonZero(-4, 4),
    }),
    (n) => {
      const s = system2017(n);
      if (!s) return false;
      const { R1, R2, R3, r2, r3, alpha, beta, gamma } = s;
      // Every printed number nonzero and small, as the paper's (coefficients
      // within 5, constants within 30), and every stage within 30, as -10, 23
      // and 4λ - 1, 11; no row to divide through, and z's denominator with no
      // factor to take out, as 4λ - 1, so the λ in (a)(ii) is a fraction, as 1/4.
      const coefs = [...R1.slice(1, 3), ...R2.slice(0, 3), ...R3.slice(0, 2)];
      const consts = [R1[3], R2[3], R3[3]];
      const stages = [...r2.slice(1), ...r3.slice(1), beta, gamma];
      if (coefs.some(v => v === 0 || Math.abs(v) > 5) || consts.some(v => v === 0 || Math.abs(v) > 30)) return false;
      if (stages.some(v => v === 0 || Math.abs(v) > 30) || alpha > 10) return false;
      // Rows 2 and 3 share no factor across their terms (row 3's 2λ counted as 2).
      const row3 = [R3[0], R3[1], 2, R3[3]];
      return R2.reduce((g, v) => gcd(g, v), 0) === 1 && row3.reduce((g, v) => gcd(g, v), 0) === 1 && gcd(alpha, beta) === 1;
    },
    2000,
  ),

  build: (n): Built => {
    const { a12, a13, a31, a32, h, x0, y0, z0 } = n;
    const { R1, R2, R3, e, p, r2, r3, alpha, beta, gamma } = system2017(n)!;
    const equation = (r: readonly number[]) => `${sum([{ coef: r[0], body: 'x' }, { coef: r[1], body: 'y' }, { coef: r[2], body: 'z' }])} = ${r[3]}`;
    const lines = [
      equation(R1),
      equation(R2),
      `${sum([{ coef: a31, body: 'x' }, { coef: a32, body: 'y' }, { coef: 2, body: '\\lambda z' }])} = ${R3[3]}`,
    ];
    const M0 = cells2017([R1, R2, [a31, a32, '2\\lambda', R3[3]]]);
    const M1 = cells2017([R1, r2, [0, r3[1], lambda2017(2, r3[2]), r3[3]]]);
    const M2 = cells2017([R1, r2, [0, 0, lambda2017(alpha, beta), gamma]]);
    const ops1 = `$${opText(e.firstOps[0])}$ and $${opText(e.firstOps[1])}$`;
    const op2 = opText(e.secondOp);
    // The sign outside the fraction, as a paper writes it.
    const zText = `z = ${gamma < 0 ? '-' : ''}\\frac{${Math.abs(gamma)}}{${lambda2017(alpha, beta)}}`;
    const bad = num(q(-beta, alpha));
    const lambdaB = `${h / 2}`;
    const den = p * h + beta;
    const values = `x = ${x0},\\ y = ${y0},\\ z = ${z0}`;
    const yLine = `${sum([{ coef: r2[1], body: 'y' }, { coef: r2[2], body: `(${z0})` }])} = ${r2[3]}`;
    const xLine = `${sum([{ coef: 1, body: 'x' }, { coef: a12, body: `(${y0})` }, { coef: a13, body: `(${z0})` }])} = ${R1[3]}`;
    return {
      questionLines: [
        '<b>(a)</b> (i) Use Gaussian elimination on the system of equations below to give an expression for $z$ in terms of $\\lambda.$',
        '',
        ...lines.map(l => `$${l}$`),
        '',
        '(ii) For what value of $\\lambda$ is this system of equations inconsistent?',
        `<b>(b)</b> Determine the solution of this system when $\\lambda = ${lambdaB}.$`,
      ],
      solutionSteps: [
        `<strong>(a)(i)</strong> The augmented matrix: $${M0}$`,
        `<strong>(a)(i)</strong> ${ops1}: $${M1}$`,
        `<strong>(a)(i)</strong> $${op2}$: $${M2}$`,
        `<strong>(a)(i)</strong> From the last row, $(${lambda2017(alpha, beta)})z = ${gamma}$, so $${zText}$`,
        `<strong>(a)(ii)</strong> When $${lambda2017(alpha, beta)} = 0$ the last row reads $0z = ${gamma}$, which is impossible: $\\lambda = ${bad}$`,
        `<strong>(b)</strong> At $\\lambda = ${lambdaB}$, $z = \\frac{${gamma}}{${den}} = ${z0}$; then $${yLine}$, so $y = ${y0}$, and $${xLine}$, so $x = ${x0}$: $${values}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1],
      finalAnswer: `(a)(i) $${zText}$<br>(a)(ii) $\\lambda = ${bad}$<br>(b) $${values}$`,
      ladder: {
        moves: [
          'How can you write three equations as one matrix that you can row-reduce?',
          '(a)(i) Write the augmented matrix, with $\\lambda$ in the third row.',
          '(a)(i) Use row operations to make zeros below the top entry of the first column.',
          '(a)(i) Make the last zero, in row 3 of column 2.',
          '(a)(i) Read $z$ from the last row, in terms of $\\lambda$.',
          '(a)(ii) Which value of $\\lambda$ makes the last row impossible?',
          '(b) Put the value of $\\lambda$ into $z$, then back-substitute for $y$ and $x$.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1],
        shows: [null, `$${M0}$`, `$${M1}$`, `$${M2}$`, `$${zText}$`, null, null],
        // The draw's own bracket, as on 2024 P2 Q3 (the owner, full read 2026-10-05).
        watch: { at: 4, text: `Give $z$ on its own. Leaving it as $(${lambda2017(alpha, beta)})z = ${gamma}$ loses the mark.` },
      },
    };
  },
};

export const ROUTINES = {
  '2017 Q5': q2017q5,
  '2021 P1 Q4': q2021p1q4,
  '2022 P1 Q2': q2022p1q2,
  '2023 P1 Q3': q2023p1q3,
  '2024 P2 Q3': q2024p2q3,
  '2026 P1 Q2': q2026p1q2,
};
