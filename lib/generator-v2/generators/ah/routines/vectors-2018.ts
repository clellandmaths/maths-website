/**
 * Advanced Higher, Vectors: how each 2018 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/vectors.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int, nonZero, pick, until } from '../draw';
import { rounded, sqrtOf, sum } from '../maths/format';
import { opText } from '../maths/linear';
import { type V3, column, content3, dot3, scale3 } from '../maths/vector';

// ── 2018 Q16 ───────────────────────────────────────────────────────────────
// Three planes meeting in a line for one a, built backwards: π1 starts with
// x; π2 = pπ1 + (0, 1, c2 | d2), so R2 - pR1 leaves a leading 1 in y; π3 is
// λπ1 + μπ2 with its z coefficient a, so R3 - (λ + μp)R1 then R3 - μR2 leaves
// (0, 0, a - a0 | 0). Then the line, the acute angle between π1 and π4, and
// π4 against π2: half the draws parallel (the paper's), half perpendicular,
// since a card that asks the pupil to decide must not always give the same
// answer (the owner's rule from 2023 P1 Q3).

interface Q16of2018 {
  b1: number; c1: number; d1: number;
  p: number; c2: number; d2: number;
  lambda: number; mu: number;
  kind: 'parallel' | 'perpendicular';
  n4: V3; e4: number;
}

interface Planes2018 { n1: V3; g1: number; n2: V3; g2: number; x3: number; y3: number; g3: number; a0: number }

function planes2018(v: Pick<Q16of2018, 'b1' | 'c1' | 'd1' | 'p' | 'c2' | 'd2' | 'lambda' | 'mu'>): Planes2018 {
  const { b1, c1, d1, p, c2, d2, lambda, mu } = v;
  const n1: V3 = [1, b1, c1];
  const n2: V3 = [p, p * b1 + 1, p * c1 + c2];
  const g2 = p * d1 + d2;
  return {
    n1, g1: d1, n2, g2,
    x3: lambda + mu * p, y3: lambda * b1 + mu * n2[1], g3: lambda * d1 + mu * g2,
    a0: lambda * c1 + mu * n2[2],
  };
}

/** Normals whose entries are 1 to 6 in size, at right angles to n2, not at right angles to n1 and not along it. */
function perpendicularTo2018(n1: V3, n2: V3): V3[] {
  const out: V3[] = [];
  const range = [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6];
  for (const x of range) for (const y of range) for (const z of range) {
    const v: V3 = [x, y, z];
    if (dot3(v, n2) !== 0 || content3(v) !== 1 || dot3(v, n1) === 0) continue;
    if (v[0] * n1[1] === v[1] * n1[0] && v[0] * n1[2] === v[2] * n1[0]) continue;
    out.push(v);
  }
  return out;
}

const fits = (k: number, size: number) => k !== 0 && Math.abs(k) <= size;

const q2018q16: CardRoutine<Q16of2018> = {
  draw: () => {
    const kind = pick(['parallel', 'perpendicular'] as const);
    const base = until(
      () => ({
        b1: nonZero(-3, 3), c1: nonZero(-3, 3), d1: nonZero(-6, 6),
        p: int(2, 4), c2: nonZero(-6, 6), d2: nonZero(-15, 15),
        lambda: nonZero(-3, 3), mu: nonZero(-3, 3),
      }),
      v => {
        const P = planes2018(v);
        const printed = [...P.n2, P.g2, P.x3, P.y3, P.g3, P.a0];
        if (!printed.every(k => fits(k, 15))) return false;
        // x along the line moves with t, so the line is not parallel to a plane x = const.
        if (v.b1 * v.c2 - v.c1 === 0) return false;
        return kind === 'parallel' ? dot3(P.n1, P.n2) !== 0 : perpendicularTo2018(P.n1, P.n2).length > 0;
      },
    );
    const P = planes2018(base);
    if (kind === 'parallel') {
      // At most 30 in size: the paper's π4 is -3 times π2's normal, -9x + 15y + 6z.
      const k = pick([-3, -2, 2, 3].filter(t => P.n2.every(c => Math.abs(t * c) <= 30)));
      // The constant not a multiple of k either, so π4 does not simplify, as the paper's 20 against -3.
      return { ...base, kind, n4: scale3(k, P.n2), e4: until(() => nonZero(-20, 20), e => e % k !== 0) };
    }
    return { ...base, kind, n4: pick(perpendicularTo2018(P.n1, P.n2)), e4: nonZero(-20, 20) };
  },

  build: (v): Built => {
    const { b1, c1, d1, p, c2, d2, lambda, mu, kind, n4, e4 } = v;
    const P = planes2018(v);
    const L = lambda + mu * p;
    const plane = (n: readonly (number | string)[], g: number) => `${sum([
      { coef: n[0] as number, body: 'x' }, { coef: n[1] as number, body: 'y' },
      ...(typeof n[2] === 'string' ? [{ coef: 1, body: n[2] }] : [{ coef: n[2], body: 'z' }]),
    ])} = ${g}`;
    const aug = (rows: (number | string)[][]) => `\\left(\\begin{array}{ccc|c}${rows.map(r => r.join(' & ')).join('\\\\')}\\end{array}\\right)`;
    const row1 = [1, b1, c1, d1];
    const M1 = aug([row1, [...P.n2, P.g2], [P.x3, P.y3, 'a', P.g3]]);
    const aLess = sum([{ coef: 1, body: 'a' }, { coef: -L * c1, body: '' }]);
    const M2 = aug([row1, [0, 1, c2, d2], [0, mu, aLess, mu * d2]]);
    const M3 = aug([row1, [0, 1, c2, d2], [0, 0, sum([{ coef: 1, body: 'a' }, { coef: -P.a0, body: '' }]), 0]]);
    const ops1 = `$${opText({ row: 2, t: 1, with: 1, o: -p })}$ and $${opText({ row: 3, t: 1, with: 1, o: -L })}$`;
    const ops2 = `$${opText({ row: 3, t: 1, with: 2, o: -mu })}$`;
    const X0 = d1 - b1 * d2, Xt = b1 * c2 - c1;
    const line = `x = ${sum([{ coef: X0, body: '' }, { coef: Xt, body: 't' }])}$, $y = ${sum([{ coef: d2, body: '' }, { coef: -c2, body: 't' }])}$, $z = t`;
    const param = `z = t$, $${sum([{ coef: 1, body: 'y' }, { coef: c2, body: 't' }])} = ${d2}`;
    // π4's normal with its common factor taken out, as the scheme's (-3, 5, 2) from -9x + 15y + 6z.
    const m = scale3(1 / content3(n4), n4);
    const dot = dot3(P.n1, m);
    const A = dot3(P.n1, P.n1), B = dot3(m, m);
    const roots = [sqrtOf(A), sqrtOf(B)].sort((x, y) => Number(x.startsWith('\\')) - Number(y.startsWith('\\')));
    const under = roots.every(r => !r.startsWith('\\')) ? String(Math.sqrt(A) * Math.sqrt(B)) : roots.join('');
    const cosText = `\\cos\\theta = \\frac{${dot}}{${under}}`;
    const theta = Math.acos(dot / Math.sqrt(A * B));
    const acute = Math.min(theta, Math.PI - theta);
    const deg = (r: number) => (r * 180) / Math.PI;
    const angleText = `$${rounded(deg(acute), 1)}^{\\circ}$ (or $${rounded(acute, 3)}$ radians)`;
    const angleStep = dot < 0
      ? `$\\theta = ${rounded(deg(theta), 1)}^{\\circ}$, so the acute angle is ${angleText}`
      : `The acute angle is ${angleText}`;
    const paren = (k: number) => (k < 0 ? `(${k})` : String(k));
    const why = kind === 'parallel'
      ? `$\\pi_2$ and $\\pi_4$ are parallel, because the normal of $\\pi_4$, $${column(n4)}$, is $${n4[0] / P.n2[0]}$ times the normal of $\\pi_2$, $${column(P.n2)}$`
      : `$\\pi_2$ and $\\pi_4$ are perpendicular, because the scalar product of their normals is $${P.n2.map((k, i) => `${paren(k)} \\times ${paren(n4[i])}`).join(' + ')} = 0$`;
    return {
      questionLines: [
        'Planes $\\pi_1$, $\\pi_2$ and $\\pi_3$ have equations:',
        `$\\pi_1$: $${plane(P.n1, d1)}$`,
        `$\\pi_2$: $${plane(P.n2, P.g2)}$`,
        `$\\pi_3$: $${plane([P.x3, P.y3, 'az'], P.g3)}$`,
        'where $a \\in \\mathbb{R}.$',
        '<b>(a)</b> Use Gaussian elimination to find the value of $a$ such that the intersection of the planes $\\pi_1$, $\\pi_2$ and $\\pi_3$ is a line.',
        '<b>(b)</b> Find the equation of the line of intersection of the planes when $a$ takes this value.',
        `The plane $\\pi_4$ has equation $${plane(n4, e4)}.$`,
        '<b>(c)</b> Find the acute angle between $\\pi_1$ and $\\pi_4.$',
        '<b>(d)</b> Describe the geometrical relationship between $\\pi_2$ and $\\pi_4.$ Justify your answer.',
      ],
      solutionSteps: [
        `<strong>(a)</strong> $${M1}$`,
        `<strong>(a)</strong> ${ops1}: $${M2}$`,
        `<strong>(a)</strong> ${ops2}: $${M3}$`,
        `<strong>(a)</strong> The intersection is a line when the whole last row is zero, so $a = ${P.a0}$`,
        `<strong>(b)</strong> $${param}$`,
        `<strong>(b)</strong> $${line}$`,
        `<strong>(c)</strong> The normals are $${column(P.n1)}$ and $${column(m)}$`,
        `<strong>(c)</strong> $${cosText}$`,
        `<strong>(c)</strong> ${angleStep}`,
        `<strong>(d)</strong> ${why}`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      finalAnswer: [
        `(a) $a = ${P.a0}$`,
        `(b) $${line}$`,
        `(c) ${angleText}`,
        // why ends on maths, so its full stop goes inside it.
        `(d) ${why.slice(0, -1)}.$`,
      ].join('<br>'),
      ladder: {
        moves: [
          'Three planes meet in a line when the system has infinitely many solutions. What does the last row look like then?',
          '(a) Write the augmented matrix, with $a$ in the third row.',
          '(a) Use row operations to make zeros below the top entry of the first column.',
          '(a) Make the last zero, in row 3 of column 2.',
          '(a) Which value of $a$ makes the whole last row zero?',
          '(b) Let $z$ be a parameter, and use the second row to write $y$ in terms of it.',
          '(b) Use the first row to write $x$, and state the line\'s equations.',
          '(c) Write down the normals of $\\pi_1$ and $\\pi_4$.',
          '(c) Use the scalar product to find the angle between them.',
          '(c) Give the acute angle.',
          '(d) Compare the normals of $\\pi_2$ and $\\pi_4$. What do you notice?',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        shows: [
          null,
          `$${M1}$`,
          `$${M2}$`,
          `$${M3}$`,
          null,
          `$${param}$`,
          null,
          `$${column(P.n1)}$, $${column(m)}$`,
          `$${cosText}$`,
          null,
          null,
        ],
        watch: { at: 4, text: 'For a line of intersection, the whole last row must be zero, including the right-hand side.' },
      },
    };
  },
};

export const ROUTINES = {
  '2018 Q16': q2018q16,
};
