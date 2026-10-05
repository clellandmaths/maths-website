/**
 * Advanced Higher, Sequences & Series: how each 2019 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/sequences-and-series.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int, nonZero, pick, until } from '../draw';
import { decimal, joinTerms, num, sum } from '../maths/format';
import { q } from '../maths/rational';

/** `3 \times 20^{2}`, `20^{2}`, `-16 \times 20`: a coefficient times a written value. */
const times = (coef: number, body: string) =>
  Math.abs(coef) === 1 ? `${coef < 0 ? '-' : ''}${body}` : `${coef} \\times ${body}`;

// ── 2019 Q7 ────────────────────────────────────────────────────────────────
// (a) Σ_{r=1}^{n}(ar + b) = (a/2)n² + (a/2 + b)n; (b) Σ_{r=p+1}^{N} as the sum
// to N less the sum to p.

interface Q7of2019 { a: number; b: number; N: number }

const q2019q7: CardRoutine<Q7of2019> = {
  // a even, so the answer has whole coefficients, as the paper's 3n^2 + 16n.
  draw: () => until(
    () => ({ a: 2 * int(1, 5), b: nonZero(-15, 15), N: int(10, 30) }),
    ({ a, b, N }) => a / 2 + b !== 0 && (a / 2) * N * N + (a / 2 + b) * N !== 0,
  ),

  build: ({ a, b, N }): Built => {
    const A = a / 2, Bc = A + b;
    const term = sum([{ coef: a, body: 'r' }, { coef: b, body: '' }]);
    const inN = sum([{ coef: A, body: 'n^{2}' }, { coef: Bc, body: 'n' }]);
    const inP = sum([{ coef: A, body: 'p^{2}' }, { coef: Bc, body: 'p' }]);
    const toN = A * N * N + Bc * N;
    const answerB = sum([{ coef: toN, body: '' }, { coef: -A, body: 'p^{2}' }, { coef: -Bc, body: 'p' }]);
    const atN = joinTerms([times(A, `${N}^{2}`), times(Bc, String(N))]);
    const split = joinTerms([`${a} \\times \\frac{n(n + 1)}{2}`, sum([{ coef: b, body: 'n' }])]);
    // "Σ1 is n" and "Σ(−1) is −n", not "1n" or "−1n" (the owner, full read 2026-10-05).
    const constantSum = b < 0 ? `\\sum (${b})$ is $${b === -1 ? '-' : b}n` : `\\sum ${b}$ is $${b === 1 ? '' : b}n`;
    return {
      questionLines: [
        `<b>(a)</b> Find an expression for $\\sum_{r=1}^{n}(${term})$ in terms of $n.$`,
        `<b>(b)</b> Hence, or otherwise, find $\\sum_{r=p+1}^{${N}}(${term}).$`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> $\\sum_{r=1}^{n}(${term}) = ${split} = ${inN}$`,
        `<strong>(b)</strong> $\\sum_{r=p+1}^{${N}}(${term}) = \\sum_{r=1}^{${N}}(${term}) - \\sum_{r=1}^{p}(${term}) = (${atN}) - (${inP})$`,
        `<strong>(b)</strong> $= ${answerB}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `(a) $${inN}$<br>(b) $${answerB}$`,
      ladder: {
        moves: [
          'The sum splits into two sums you have standard results for. Which ones?',
          `(a) Use the formula for $\\sum r$, and remember $${constantSum}$.`,
          `(b) The sum from $p + 1$ to ${N} is the sum to ${N} minus the sum to what?`,
          '(b) Substitute and simplify.',
        ],
        marks: [0, 1, 1, 1],
        shows: [null, null, `$(${atN}) - \\ldots$`, null],
        watch: { at: 2, text: 'The sum starts at $r = p + 1$. Which terms do you need to take away?' },
      },
    };
  },
};

// ── 2019 Q17 ───────────────────────────────────────────────────────────────
// Three linear terms in x, geometric at x1 with |r| < 1 (the paper's 63, -21,
// 7) and again at x2 with r = -1 (-7, 7, -7), so S_{2n} = 0. Built backwards
// from the two sequences: each term is the line through its two values.

interface Q17of2019 {
  x1: number; x2: number;
  /** The ratio at x1, rn/rd in lowest terms. */
  rn: number; rd: number;
  /** The first term at x1 is rd² t; the terms at x2 are B, -B, B. */
  t: number; B: number;
}

const RATIOS2019: readonly [number, number][] = [[1, 2], [-1, 2], [1, 3], [-1, 3], [1, 4], [-1, 4], [2, 3], [-2, 3], [3, 4], [-3, 4]];

/** The three terms' slopes and constants, s x + c. */
function q17Terms({ x1, x2, rn, rd, t, B }: Q17of2019) {
  const v1 = [rd * rd * t, rn * rd * t, rn * rn * t], v2 = [B, -B, B];
  const s = v1.map((v, i) => (v2[i] - v) / (x2 - x1));
  return { v1, v2, s, c: v1.map((v, i) => v - s[i] * x1) };
}

/**
 * Every set with whole slopes from ±1 to ±9 and constants from ±1 to ±20, as
 * 5x + 8, -2x + 1, x - 4; x1 from 2 to 12 and x2 from -12 to -1, as 11 and -3;
 * the first term at x1 positive, up to 90 (the paper's 63). B steps by
 * |x2 - x1|, the only values whose slopes can come out whole.
 */
const Q17_SETS2019: readonly Q17of2019[] = (() => {
  const out: Q17of2019[] = [];
  for (let x1 = 2; x1 <= 12; x1++) {
    for (let x2 = -12; x2 <= -1; x2++) {
      if (x1 + x2 === 0) continue;
      const step = x1 - x2;
      for (const [rn, rd] of RATIOS2019) {
        for (let t = 1; rd * rd * t <= 90; t++) {
          const first = rd * rd * t;
          for (let B = -20 + ((((first + 20) % step) + step) % step); B <= 20; B += step) {
            if (!B) continue;
            const n = { x1, x2, rn, rd, t, B };
            const { s, c } = q17Terms(n);
            if (!s.every(Number.isInteger) || s.some(k => !k || Math.abs(k) > 9)) continue;
            if (c.some(k => !k || Math.abs(k) > 20)) continue;
            if (s[1] * s[1] - s[0] * s[2] === 0) continue;
            out.push(n);
          }
        }
      }
    }
  }
  return out;
})();

/** The ratios some set has: -3/4 has none at these sizes. */
const Q17_RATIOS2019 = RATIOS2019.filter(([rn, rd]) => Q17_SETS2019.some(n => n.rn === rn && n.rd === rd));

const q2019q17: CardRoutine<Q17of2019> = {
  // The ratio first, so each is as likely, then a set with it.
  draw: () => {
    const [rn, rd] = pick(Q17_RATIOS2019);
    return pick(Q17_SETS2019.filter(n => n.rn === rn && n.rd === rd));
  },

  build: (n): Built => {
    const { x1, x2, rn, rd } = n;
    const { v1, v2, s, c } = q17Terms(n);
    const T = s.map((k, i) => sum([{ coef: k, body: 'x' }, { coef: c[i], body: '' }]));
    const r = num(q(rn, rd));
    // "1 ÷ 3 = 1/3" when the fraction is already r, not "1/3 = 1/3" (the owner, full read 2026-10-05).
    const ratio = (top: number, bottom: number) =>
      (`\\frac{${top}}{${bottom}}` === r ? `${top} \\div ${bottom} = ${r}` : `\\frac{${top}}{${bottom}} = ${r}`);
    const rBracket = rn < 0 ? `\\left(${r}\\right)` : r;
    const S = q(v1[0] * rd, rd - rn);
    const Sdec = decimal(S, 4);
    const Stext = S.d === 1n || Sdec.includes('\\ldots') ? `$${num(S)}$` : `$${num(S)}$ or $${Sdec}$`;
    // (T2)^2 = T1 T3, collected as x^2 - (x1 + x2)x + x1x2 = 0.
    const L = [s[1] * s[1], 2 * s[1] * c[1], c[1] * c[1]];
    const R = [s[0] * s[2], s[0] * c[2] + s[2] * c[0], c[0] * c[2]];
    const poly2 = (k: number[]) => sum([{ coef: k[0], body: 'x^{2}' }, { coef: k[1], body: 'x' }, { coef: k[2], body: '' }]);
    const quadratic = sum([{ coef: 1, body: 'x^{2}' }, { coef: -(x1 + x2), body: 'x' }, { coef: x1 * x2, body: '' }]);
    const equate = `\\frac{${T[1]}}{${T[0]}} = \\frac{${T[2]}}{${T[1]}}`;
    const second = `${v2[0]}, ${v2[1]}, ${v2[2]}`;
    const why = `$S_{2n} = 0$, since $r = -1$: the terms are $${v2[0]}, ${v2[1]}, \\ldots$, and $2n$ is even, so they cancel in pairs.`;
    return {
      questionLines: [
        'The first three terms of a sequence are given by',
        `$${T[0]},\\ ${T[1]},\\ ${T[2]}$`,
        `<b>(a)</b> When $x = ${x1}$, show that the first three terms form the start of a geometric sequence, and state the value of the common ratio.`,
        `<b>(b)</b> Given that the entire sequence is geometric for $x = ${x1}$`,
        '(i) state why the associated series has a sum to infinity',
        '(ii) calculate this sum to infinity.',
        '<b>(c)</b> There is a second value for $x$ that also gives a geometric sequence.',
        'For this second sequence',
        `(i) show that $${quadratic} = 0$`,
        '(ii) find the first three terms',
        '(iii) state the value of $S_{2n}$ and justify your answer.',
      ],
      solutionSteps: [
        `<strong>(a)</strong> At $x = ${x1}$ the terms are $${v1[0]}, ${v1[1]}, ${v1[2]}$; $${ratio(v1[1], v1[0])}$`,
        `<strong>(a)</strong> $${ratio(v1[2], v1[1])}$: the ratios are equal, so the sequence is geometric with $r = ${r}$`,
        `<strong>(b)(i)</strong> $\\left|${r}\\right| \\lt 1$, so the sum to infinity exists`,
        `<strong>(b)(ii)</strong> $S_{\\infty} = \\frac{${v1[0]}}{1 - ${rBracket}}$`,
        `<strong>(b)(ii)</strong> $S_{\\infty} = ${num(S)}$`,
        `<strong>(c)(i)</strong> $${equate}$`,
        `<strong>(c)(i)</strong> $(${T[1]})^{2} = (${T[0]})(${T[2]})$, so $${poly2(L)} = ${poly2(R)}$, and $${quadratic} = 0$`,
        `<strong>(c)(ii)</strong> $(${sum([{ coef: 1, body: 'x' }, { coef: -x1, body: '' }])})(${sum([{ coef: 1, body: 'x' }, { coef: -x2, body: '' }])}) = 0$, so the second value is $x = ${x2}$`,
        `<strong>(c)(ii)</strong> The first three terms are $${second}$`,
        `<strong>(c)(iii)</strong> ${why}`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      finalAnswer: [
        `(a) The terms are $${v1[0]}, ${v1[1]}, ${v1[2]}$; $${ratio(v1[1], v1[0])}$ and $${ratio(v1[2], v1[1])}$, so the sequence is geometric with $r = ${r}.$`,
        `(b)(i) $\\left|${r}\\right| \\lt 1.$`,
        `(b)(ii) ${Stext}`,
        `(c)(i) $${equate}$ gives $${quadratic} = 0$ (shown).`,
        `(c)(ii) $x = ${x2}$: $${second}$`,
        `(c)(iii) ${why}`,
      ].join('<br>'),
      ladder: {
        moves: [
          'In a geometric sequence, what is the same for every pair of consecutive terms?',
          `(a) Put $x = ${x1}$ into the terms and work out one ratio.`,
          '(a) Work out the other ratio, and state the common ratio.',
          '(b)(i) State the condition on $r$ for a sum to infinity.',
          '(b)(ii) Start to substitute into the sum to infinity formula.',
          '(b)(ii) Evaluate.',
          '(c)(i) Set the two ratios of consecutive terms equal, in terms of $x$.',
          '(c)(i) Cross-multiply and simplify to the given quadratic.',
          '(c)(ii) Solve the quadratic to find the other value of $x$.',
          '(c)(ii) Substitute it to find the first three terms.',
          '(c)(iii) What happens when you add the terms in pairs?',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        shows: [
          null,
          `$${ratio(v1[1], v1[0])}$ or $${ratio(v1[2], v1[1])}$`,
          `$${ratio(v1[2], v1[1])}$ or $${ratio(v1[1], v1[0])}$, so $r = ${r}$`,
          `$\\left|${r}\\right| \\lt 1$`,
          `$\\frac{\\ldots}{1 - ${rBracket}}$`,
          Stext,
          `$${equate}$`,
          null,
          null,
          null,
          null,
        ],
        watch: { at: 2, text: 'Show both ratios. One ratio does not prove the sequence is geometric.' },
      },
    };
  },
};

export const ROUTINES = {
  '2019 Q7': q2019q7,
  '2019 Q17': q2019q17,
};
