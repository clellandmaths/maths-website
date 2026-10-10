/**
 * Advanced Higher, Sequences & Series: how each 2021 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/sequences-and-series.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int, nonZero, pick, until } from '../../core/draw';
import { num, poly, sum } from '../../core/maths/format';
import { type Q, q, abs, cmp, div, isInt, mul, neg, pow, sub, toNumber } from '../../core/maths/rational';

/** `x - 1`, `x + 4`: a letter and a constant. */
const linear = (v: string, c: number, lead = 1) => sum([{ coef: lead, body: v }, { coef: c, body: '' }]);

/** The ending of an ordinal: 21 `st`, 12 `th`, 23 `rd`. */
function ending(n: number): string {
  if (n % 100 >= 11 && n % 100 <= 13) return 'th';
  return ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th';
}

// ── 2021 P2 Q11(a)(b) ──────────────────────────────────────────────────────
// Three consecutive terms x + p, x + q, 2x + s of an arithmetic sequence:
// (a) d = q - p, then x from the next difference; (b) x + p is the Nth term:
// the first term, and the nth term simplified. The paper's p = -1, q = -7,
// s = -9 (d = -6, x = -4) and N = 21 (a = 115, 121 - 6n).

interface P2Q11abOf2021 { p: number; q: number; x: number; N: number }

const q2021p2q11ab: CardRoutine<P2Q11abOf2021> = {
  draw: () => until(
    () => ({ p: nonZero(-9, 9), q: nonZero(-9, 9), x: nonZero(-9, 9), N: int(12, 30) }),
    ({ p, q: qq, x, N }) => {
      const d = qq - p, s = d + qq - x;
      // d from 2 to 9 either sign, s a real constant, and the nth term with a constant.
      return Math.abs(d) >= 2 && Math.abs(d) <= 9 && s !== 0 && Math.abs(s) <= 15 && x + p !== 0 && x + p - N * d !== 0;
    },
  ),

  build: ({ p, q: qq, x, N }): Built => {
    const d = qq - p, s = d + qq - x;
    const u = x + p, first = u - (N - 1) * d;
    // The paper's 121 - 6n, constant first, unless only the n term is positive: 3n - 101.
    const constant = { coef: first - d, body: '' }, slope = { coef: d, body: 'n' };
    const nth = sum(first - d < 0 && d > 0 ? [slope, constant] : [constant, slope]);
    const [t1, t2, t3] = [linear('x', p), linear('x', qq), linear('x', s, 2)];
    const op = d < 0 ? '-' : '+';
    const nthTerm = `${N}${ending(N)}`;
    return {
      questionLines: [
        `Three consecutive terms of an arithmetic sequence are given by $${t1}, ${t2}, ${t3}.$`,
        '<b>(a)</b> (i) Find the common difference.',
        '(ii) Hence find the value of $x.$',
        `<b>(b)</b> Given that $${t1}$ is the $${N}^{${ending(N)}}$ term, find`,
        '(i) the value of the first term',
        '(ii) a simplified expression for the $n^{th}$ term of the sequence.',
      ],
      solutionSteps: [
        `<strong>(a)(i)</strong> $d = (${t2}) - (${t1}) = ${d}$`,
        // When nothing is left to solve, end at x (the owner, full read 2026-10-05).
        `<strong>(a)(ii)</strong> $(${t3}) - (${t2}) = ${d}$, so ${s === qq ? `$x = ${x}$` : `$${linear('x', s - qq)} = ${d}$ and $x = ${x}$`}`,
        `<strong>(b)(i)</strong> $u_{${N}} = ${t1} = ${u}$, so $a ${op} ${(N - 1) * Math.abs(d)} = ${u}$ and $a = ${first}$`,
        `<strong>(b)(ii)</strong> $u_{n} = ${first} ${op} ${Math.abs(d)}(n - 1) = ${nth}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: [`(a)(i) $${d}$`, `(a)(ii) $x = ${x}$`, `(b)(i) $${first}$`, `(b)(ii) $${nth}$`].join('<br>'),
      ladder: {
        moves: [
          'What must be true of the differences between consecutive terms in an arithmetic sequence?',
          '(a)(i) Subtract the first term from the second.',
          '(a)(ii) Set the next difference equal to it and solve for $x$.',
          `(b)(i) Work back from the ${nthTerm} term, using the common difference.`,
          '(b)(ii) Write the $n$th term formula and simplify.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, null, null, null, null],
        watch: { at: 3, text: `The ${nthTerm} term is the first term plus ${N - 1} common differences, not ${N}.` },
      },
    };
  },
};

// ── 2021 P2 Q11(c)(d) ──────────────────────────────────────────────────────
// The same kind of expressions, y + p, y + q, 2y + s, as three consecutive
// terms of a geometric sequence: (c) (y + q)^2 = (y + p)(2y + s), the
// quadratic y^2 + (s + 2p - 2q)y + (ps - q^2) = 0 and its two roots with their
// ratios; (d)(i) the root whose ratio lies in (-1, 1); (d)(ii) whether a sum
// to infinity is possible. The paper's y - 1, y - 7, 2y - 9: y = 5, r = -1/2
// and y = -8, r = 5/3; 64/3 needs a = 32, which gives -4 where 4 should be.

interface Geometric { p: number; q: number; s: number; y1: number; y2: number; r1: Q; r2: Q }

/**
 * Every (p, q, y1) with the paper's shape: the ratio at y1 negative and inside
 * (-1, 1), as the paper's -1/2, with a denominator up to 6; the other root's
 * ratio outside [-1, 1], so exactly one value has a sum to infinity; every
 * term at both roots non-zero, and neither root 0 (the quadratic keeps its
 * constant); s and the second root up to 20.
 *
 * The terms' y, y, 2y fix the ratios more than it looks: with y + p the
 * first term u, the roots' u multiply to -(q - p)^2, so a negative ratio
 * inside (-1, 1) needs q - p a multiple of 6 (ratios -1/2 and 5/3, the
 * paper's) or of 12 (-1/3 and 7/4). 24 of them: 20 the paper's ratios, 4 the
 * thirds.
 */
const GEOMETRIC: readonly Geometric[] = (() => {
  const out: Geometric[] = [];
  for (let p = -9; p <= 9; p++) for (let qq = -9; qq <= 9; qq++) for (let y1 = -9; y1 <= 9; y1++) {
    if (p === 0 || qq === 0 || p === qq || y1 === 0 || y1 + p === 0 || y1 + qq === 0) continue;
    // (y1 + q)^2 = (y1 + p)(2y1 + s) gives s, which must be a whole number.
    const top = (y1 + qq) ** 2;
    if (top % (y1 + p) !== 0) continue;
    const s = top / (y1 + p) - 2 * y1;
    // The roots sum to -(s + 2p - 2q).
    const y2 = -(s + 2 * p - 2 * qq) - y1;
    if (s === 0 || Math.abs(s) > 20 || y2 === y1 || y2 === 0 || Math.abs(y2) > 20 || y2 + p === 0 || y2 + qq === 0) continue;
    const r1 = q(y1 + qq, y1 + p), r2 = q(y2 + qq, y2 + p);
    if (!(toNumber(r1) < 0 && toNumber(r1) > -1) || r1.d > 6n || cmp(abs(r2), q(1)) <= 0) continue;
    out.push({ p, q: qq, s, y1, y2, r1, r2 });
  }
  return out;
})();

interface P2Q11cdOf2021 { g: Geometric; yes: boolean; j: number }

/** The first term a sum to infinity needs: y1 + p is the (j + 1)th term, or its negative is. */
const firstTerm = ({ g, yes, j }: P2Q11cdOf2021): Q => {
  const T = q(g.y1 + g.p);
  return div(yes ? T : neg(T), pow(g.r1, j));
};

const q2021p2q11cd: CardRoutine<P2Q11cdOf2021> = {
  // Half the draws a possible sum, half not (the owner's rule: a card that asks
  // the pupil to decide never always gives the same answer).
  draw: () => until(
    () => ({ g: pick(GEOMETRIC), yes: pick([true, false]), j: int(1, 3) }),
    // The first term a whole number of a paper's size, as the paper's 32.
    (n) => { const a = firstTerm(n); return isInt(a) && Math.abs(toNumber(a)) <= 200; },
  ),

  build: (n): Built => {
    const { g, yes, j } = n;
    const [t1, t2, t3] = [linear('y', g.p), linear('y', g.q), linear('y', g.s, 2)];
    const quadratic = poly([1, g.s + 2 * g.p - 2 * g.q, g.p * g.s - g.q * g.q], 'y');
    const expandedLeft = poly([1, 2 * g.q, g.q * g.q], 'y');
    const expandedRight = poly([2, g.s + 2 * g.p, g.p * g.s], 'y');
    const factors = `(${linear('y', -g.y1)})(${linear('y', -g.y2)})`;
    const [r1, r2] = [num(g.r1), num(g.r2)];
    const a = firstTerm(n);
    const S = div(a, sub(q(1), g.r1));
    const terms = Array.from({ length: j + 1 }, (_, i) => num(mul(a, pow(g.r1, i)))).join(', ');
    const T = g.y1 + g.p;
    const sumEq = `\\frac{a}{1 - \\left(${r1}\\right)} = ${num(S)}`;
    const reason = yes
      ? `Yes. If the sum is $${num(S)}$, then $a = ${num(a)}$, and the terms are $${terms}, \\ldots$: $${T}$ is among them, the term $${t1}$ when $y = ${g.y1}.$`
      : `No. If the sum is $${num(S)}$, then $a = ${num(a)}$, and the terms are $${terms}, \\ldots$: the term $${t1}$ would be $${-T}$, not $${T}$ as $y = ${g.y1}$ needs.`;
    return {
      questionLines: [
        `Three consecutive terms of a geometric sequence are given by $${t1}, ${t2}, ${t3}.$`,
        '<b>(c)</b> Find the two possible values of $y$ and the corresponding common ratios.',
        'One of the values of $y$ gives an associated geometric series which has a sum to infinity.',
        '<b>(d)</b> (i) Identify the value of $y$ and justify your answer.',
        `(ii) Determine whether $${num(S)}$ is a possible value for this sum to infinity. Give a reason for your answer.`,
      ],
      solutionSteps: [
        `<strong>(c)</strong> $\\frac{${t2}}{${t1}} = \\frac{${t3}}{${t2}}$`,
        `<strong>(c)</strong> $(${t2})^{2} = (${t1})(${t3})$, so $${expandedLeft} = ${expandedRight}$ and $${quadratic} = 0$`,
        `<strong>(c)</strong> $${factors} = 0$: $y = ${g.y1}$ with common ratio $${r1}$, and $y = ${g.y2}$ with common ratio $${r2}$`,
        `<strong>(d)(i)</strong> $y = ${g.y1}$, since $\\left|${r1}\\right| \\lt 1$`,
        `<strong>(d)(ii)</strong> $${sumEq}$`,
        `<strong>(d)(ii)</strong> ${reason}`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1],
      finalAnswer: [
        `(c) $y = ${g.y1}$ with common ratio $${r1}$`,
        `$y = ${g.y2}$ with common ratio $${r2}$`,
        `(d)(i) $y = ${g.y1}$ because $\\left|${r1}\\right| \\lt 1.$`,
        `(d)(ii) ${reason}`,
      ].join('<br>'),
      ladder: {
        moves: [
          'What must be true of the ratios between consecutive terms in a geometric sequence?',
          '(c) Set the two ratios of consecutive terms equal.',
          '(c) Cross-multiply and rearrange into a quadratic.',
          '(c) Solve it, and find the common ratio for each value of $y$.',
          '(d)(i) Which common ratio allows a sum to infinity? Say why.',
          `(d)(ii) Set the sum to infinity equal to $${num(S)}$ and find the first term it needs.`,
          `(d)(ii) List the terms from that first term, and look for the value of $${t1}$ your $y$ gives.`,
        ],
        marks: [0, 1, 1, 1, 1, 1, 1],
        shows: [
          null,
          `$\\frac{${t2}}{${t1}} = \\frac{${t3}}{${t2}}$`,
          `$${quadratic} = 0$`,
          `$${g.y1}$, $${r1}$ and $${g.y2}$, $${r2}$`,
          null,
          `$${sumEq}$`,
          null,
        ],
        watch: { at: 4, text: 'A sum to infinity needs the ratio strictly between $-1$ and 1. Say so.' },
      },
    };
  },
};

export const ROUTINES = {
  '2021 P2 Q11(a)(b)': q2021p2q11ab,
  '2021 P2 Q11(c)(d)': q2021p2q11cd,
};
