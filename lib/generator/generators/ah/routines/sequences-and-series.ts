/**
 * Advanced Higher, Sequences & Series: how each card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/sequences-and-series.ts` under the same label.
 */
import type { Built, CardRoutine } from '../types';
import { int, nonZero, pick, until } from '../draw';
import { decimal, num, poly, power, rounded, sum, truncated } from '../maths/format';
import { q, add, div, mul, pow, sub, toNumber } from '../maths/rational';

// ── 2026 P2 Q6 ─────────────────────────────────────────────────────────────
// (a) arithmetic: u_p, u_q to d, a, S_N; (b) geometric: v_3, v_4 to r, a, S_n;
// (c) the least n with S_n > S_N

interface P2Q6 {
  /** First term, and d in halves (1 or 3). */
  a: number; halves: 1 | 3;
  /** The two terms given, u_p and u_{p + gap}, and how many to sum. */
  p: 3 | 5; gap: 6 | 8 | 10; N: number;
  /** r = (s + 1)/s, first term t s^3. */
  s: 2 | 3 | 4; t: 1 | 2;
}

/** Everything the card states or finds, exactly. */
function worked(n: P2Q6) {
  const d = q(n.halves, 2);
  const term = (i: number) => add(q(n.a), mul(q(i - 1), d));
  const sumN = mul(q(n.N, 2), add(q(2 * n.a), mul(q(n.N - 1), d)));
  const r = q(n.s + 1, n.s);
  const first = n.t * n.s ** 3;
  const v3 = mul(q(first), pow(r, 2)), v4 = mul(q(first), pow(r, 3));
  const coefficient = n.t * n.s ** 4;
  // (c): coefficient (r^n - 1) > S_N, so r^n > S_N / coefficient + 1.
  const bound = add(div(sumN, q(coefficient)), q(1));
  const L = Math.log(toNumber(bound)) / Math.log(toNumber(r));
  return { d, up: term(n.p), uq: term(n.p + n.gap), sumN, r, first, v3, v4, coefficient, bound, L };
}

const q2026p2q6: CardRoutine<P2Q6> = {
  draw: () => until(
    () => ({
      a: int(2, 9), halves: pick([1, 3] as const),
      p: pick([3, 5] as const), gap: pick([6, 8, 10] as const), N: 4 * int(15, 37) + 1,
      s: pick([2, 3, 4] as const), t: pick([1, 2] as const),
    }),
    // The least n is a clear rounding up, and a sensible size.
    (n) => {
      const { L } = worked(n);
      const frac = L - Math.floor(L);
      return frac > 0.05 && frac < 0.95 && Math.ceil(L) >= 5 && Math.ceil(L) <= 40;
    },
  ),

  build: (n): Built => {
    const w = worked(n);
    const q_ = n.p + n.gap;
    const rText = `\\frac{${n.s + 1}}{${n.s}}`;
    const rPower = `\\left(${rText}\\right)^{n}`;
    const Sn = `${w.coefficient}\\left(${rPower} - 1\\right)`;
    const bound = decimal(w.bound, 2);
    const least = Math.ceil(w.L);
    const SN = num(w.sumN);
    const v3 = num(w.v3), v4 = num(w.v4);
    const answers = [
      `(a)(i) $d = ${num(w.d)}$`,
      `(a)(ii) $a = ${n.a}$`,
      `(a)(iii) $S_{${n.N}} = ${SN}$`,
      `(b)(i) $r = ${rText}$`,
      `(b)(ii) $a = ${w.first}$`,
      `(b)(iii) $S_{n} = ${Sn}$`,
      `(c) $n = ${least}$`,
    ];
    return {
      questionLines: [
        `<b>(a)</b> An arithmetic sequence has terms $u_{${n.p}} = ${num(w.up)}$ and $u_{${q_}} = ${num(w.uq)}.$`,
        'For this sequence, find the:',
        '(i) common difference',
        '(ii) first term',
        `(iii) sum of the first ${n.N} terms.`,
        `<b>(b)</b> The terms $v_{3} = ${v3}$ and $v_{4} = ${v4}$ form part of a geometric sequence.`,
        'For this sequence, find:',
        '(i) the common ratio',
        '(ii) the first term',
        '(iii) an expression, in terms of $n$, for the sum of the first $n$ terms.',
        `<b>(c)</b> Find algebraically the least value of $n$ such that the sum of the geometric series exceeds the sum of the first ${n.N} terms in the arithmetic sequence.`,
      ],
      solutionSteps: [
        `<strong>(a)(i)</strong> $a + ${n.p - 1}d = ${num(w.up)}$ and $a + ${q_ - 1}d = ${num(w.uq)}$, so $${n.gap}d = ${num(sub(w.uq, w.up))}$ and $d = ${num(w.d)}$`,
        `<strong>(a)(ii)</strong> $a + ${n.p - 1} \\times ${num(w.d)} = ${num(w.up)}$, so $a = ${n.a}$`,
        `<strong>(a)(iii)</strong> $S_{${n.N}} = \\frac{${n.N}}{2}\\left(2 \\times ${n.a} + ${n.N - 1} \\times ${num(w.d)}\\right) = ${SN}$`,
        `<strong>(b)(i)</strong> $r = \\frac{${v4}}{${v3}} = ${rText}$`,
        `<strong>(b)(ii)</strong> $a\\left(${rText}\\right)^{2} = ${v3}$, so $a = ${w.first}$`,
        `<strong>(b)(iii)</strong> $S_{n} = \\frac{${w.first}\\left(${rPower} - 1\\right)}{${rText} - 1} = ${Sn}$`,
        `<strong>(c)</strong> $${Sn} \\gt ${SN}$, so $${rPower} \\gt ${bound}$ and $n \\gt \\frac{\\ln ${bound}}{\\ln ${rText}} = ${truncated(w.L, 2)}$, so the least value is $n = ${least}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1],
      finalAnswer: answers.join('<br>'),
      ladder: {
        moves: [
          `Between $u_{${n.p}}$ and $u_{${q_}}$, how many common differences are there?`,
          `(a)(i) Write $u_{${n.p}}$ and $u_{${q_}}$ in terms of $a$ and $d$, and subtract to find $d$.`,
          '(a)(ii) Put $d$ back into one equation to find $a$.',
          `(a)(iii) Use the arithmetic sum formula with $n = ${n.N}$.`,
          '(b)(i) Divide one term by the one before it.',
          '(b)(ii) Write $v_{3}$ in terms of the first term and $r$, and solve.',
          '(b)(iii) Put $a$ and $r$ into the geometric sum formula and simplify.',
          '(c) Set the geometric sum greater than your answer to (a)(iii), and solve for $n$ using logs.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1],
        shows: [null, `$${num(w.d)}$`, null, null, `$${rText}$`, null, `$${Sn}$`, null],
        watch: { at: 7, text: '$n$ has to be a whole number. Round your log answer up to the first one that works.' },
      },
    };
  },
};

// ── 2025 P2 Q10 ────────────────────────────────────────────────────────────
// Σ (a r³ - c r) with c = a p(p + 1)/2, so it factorises fully:
// (a/4) n(n + 1)(n - p)(n + p + 1)

interface P2Q10 { a: 1 | 2; p: number }

const q2025p2q10: CardRoutine<P2Q10> = {
  draw: () => ({ a: pick([1, 2] as const), p: int(1, 8) }),

  build: ({ a, p }): Built => {
    const c = (a * p * (p + 1)) / 2;
    const summand = sum([{ coef: a, body: 'r^{3}' }, { coef: -c, body: 'r' }]);
    const sigma = `\\sum_{r=1}^{n} (${summand})`;
    const cubes = `\\frac{${a === 1 ? '' : a}n^{2}(n + 1)^{2}}{4}`;
    const substituted = `${cubes} - \\frac{${c}n(n + 1)}{2}`;
    const lead = num(q(a, 4));
    const quadratic = `n^{2} + n - ${p * (p + 1)}`;
    const answer = `${lead}n(n + 1)(${poly([1, -p], 'n')})(n + ${p + 1})`;
    return {
      questionLines: [`Find and fully factorise an expression for $${sigma}.$`],
      solutionSteps: [
        `$${sigma} = ${substituted}$`,
        `$= ${lead}n(n + 1)(${quadratic}) = ${answer}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          'The sum splits into two sums you have standard results for. Which ones?',
          'Replace $\\sum r^{3}$ and $\\sum r$ with their formulae.',
          'Take out the common factors and factorise what is left fully.',
        ],
        marks: [0, 1, 1],
        shows: [null, `$${substituted}$`, null],
        watch: { at: 2, text: '"Fully factorise" means the leftover quadratic must be factorised too.' },
      },
    };
  },
};

// ── 2025 P2 Q13 ────────────────────────────────────────────────────────────
// A positive geometric sequence from its second and fourth terms: r, a, why
// S∞ exists, S∞; then every term times k. Built from r = s/t and a = j t³, so
// the second term j s t² and the fourth j s³ are whole, as 100 and 16.

interface P2Q13 { s: number; t: number; j: number }

const RATIOS: readonly [number, number][] = [
  [1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 6], [5, 6],
];

const q2025p2q13: CardRoutine<P2Q13> = {
  draw: () => until(
    () => {
      const [s, t] = pick(RATIOS);
      return { s, t, j: int(1, 4) };
    },
    // Terms a pupil reads as the paper's: the second at most 600, the fourth at least 2.
    ({ s, t, j }) => j * s * t * t <= 600 && j * s ** 3 >= 2,
  ),

  build: ({ s, t, j }): Built => {
    const second = j * s * t * t, fourth = j * s ** 3;
    const r = q(s, t), a = j * t ** 3;
    const R = num(r);
    const S = num(q(a * t, t - s));
    const k = 'k';
    return {
      questionLines: [
        `An infinite geometric sequence of positive numbers has second term ${second} and fourth term ${fourth}.`,
        '<b>(a)</b> Determine:',
        '(i) the common ratio',
        '(ii) the first term of this sequence.',
        '<b>(b)</b> Explain why the associated geometric series has a sum to infinity.',
        '<b>(c)</b> Determine this sum to infinity.',
        '',
        'A new geometric sequence is formed by multiplying each term in the sequence above by the real number $k$, where $k \\neq 0.$',
        '<b>(d)</b> State the effect that this will have on:',
        '(i) the common ratio',
        '(ii) the sum to infinity of the associated series.',
      ],
      solutionSteps: [
        `<strong>(a)(i)</strong> $ar = ${second}$ and $ar^{3} = ${fourth}$`,
        `<strong>(a)(i)</strong> Dividing, $r^{2} = \\frac{${fourth}}{${second}} = ${num(q(s * s, t * t))}$; the terms are positive, so $r = ${R}$`,
        `<strong>(a)(ii)</strong> $a = \\frac{${second}}{${R}} = ${a}$`,
        `<strong>(b)</strong> $-1 \\lt ${R} \\lt 1$, so the series has a sum to infinity`,
        `<strong>(c)</strong> $S_{\\infty} = \\frac{a}{1 - r} = \\frac{${a}}{1 - ${R}} = ${S}$`,
        `<strong>(d)(i)</strong> The new terms are $${k}a, ${k}ar, ${k}ar^{2}, \\ldots$: each divided by the one before is still $r$, so the common ratio is unchanged`,
        `<strong>(d)(ii)</strong> $S_{\\infty} = \\frac{${k}a}{1 - r}$, so the sum to infinity is multiplied by $${k}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1],
      finalAnswer: [
        `(a)(i) $${R}$`,
        `(a)(ii) $${a}$`,
        `(b) A sum to infinity exists because $-1 \\lt ${R} \\lt 1$`,
        `(c) $${S}$`,
        '(d)(i) The common ratio is unchanged.',
        '(d)(ii) The sum to infinity is multiplied by $k.$',
      ].join('<br>'),
      ladder: {
        moves: [
          'Going from the second term to the fourth, how many times do you multiply by $r$?',
          '(a)(i) Write the two given terms in terms of $a$ and $r$.',
          '(a)(i) Divide one by the other to find $r$. The terms are all positive.',
          '(a)(ii) Use $r$ to find the first term.',
          '(b) State the condition on $r$ for a sum to infinity.',
          '(c) Use the sum to infinity formula.',
          '(d)(i) Divide one new term by the one before it. What happens to $k$?',
          '(d)(ii) Put the new first term into the sum to infinity formula.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1],
        shows: [null, `$ar = ${second}$ and $ar^{3} = ${fourth}$`, null, null, `$-1 \\lt ${R} \\lt 1$`, `$${S}$`, null, null],
        watch: { at: 2, text: 'The sequence is of positive numbers, so choose the positive ratio.' },
      },
    };
  },
};

// ── 2024 P1 Q3 ─────────────────────────────────────────────────────────────
// A positive geometric sequence from its third and fifth terms: r, a, why S∞
// exists, S∞. Built from r = s/t and a = j t⁴, so the third term j s² t² and
// the fifth j s⁴ are whole, as 36 and 16; j a multiple of t - s, so S∞ is.

interface P1Q3of2024 { s: number; t: number; j: number }

const RATIOS_2024: readonly [number, number][] = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]];

const q2024p1q3: CardRoutine<P1Q3of2024> = {
  draw: () => until(
    () => {
      const [s, t] = pick(RATIOS_2024);
      return { s, t, j: int(1, 6) };
    },
    // Paper 1: the sum to infinity whole, as 243, and every number one a pupil works by hand.
    ({ s, t, j }) => j % (t - s) === 0 && j * s * s * t * t <= 150 && (j * t ** 5) / (t - s) <= 1100,
  ),

  build: ({ s, t, j }): Built => {
    const third = j * s * s * t * t, fifth = j * s ** 4;
    const r = q(s, t), a = j * t ** 4;
    const R = num(r);
    const S = num(div(q(a), sub(q(1), r)));
    const condition = `\\left|${R}\\right| \\lt 1`;
    return {
      questionLines: [
        `A geometric sequence of positive terms has third term ${third} and fifth term ${fifth}.`,
        '<b>(a)</b> Calculate the value of the common ratio.',
        '<b>(b)</b> Calculate the value of the first term.',
        '<b>(c)</b> State why the associated geometric series has a sum to infinity.',
        '<b>(d)</b> Find the value of this sum to infinity.',
      ],
      solutionSteps: [
        `<strong>(a)</strong> $ar^{2} = ${third}$ and $ar^{4} = ${fifth}$`,
        `<strong>(a)</strong> Dividing, $r^{2} = \\frac{${fifth}}{${third}} = ${num(q(s * s, t * t))}$; the terms are positive, so $r = ${R}$`,
        `<strong>(b)</strong> $a = \\frac{${third}}{\\left(${R}\\right)^{2}} = ${a}$`,
        `<strong>(c)</strong> $${condition}$, so the series has a sum to infinity`,
        `<strong>(d)</strong> $S_{\\infty} = \\frac{a}{1 - r} = \\frac{${a}}{1 - ${R}} = ${S}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: [
        `(a) $${R}$`,
        `(b) $${a}$`,
        `(c) Because $${condition}$, or $-1 \\lt ${R} \\lt 1$`,
        `(d) $${S}$`,
      ].join('<br>'),
      ladder: {
        moves: [
          'Going from the third term to the fifth, how many times do you multiply by $r$?',
          '(a) Write the third and fifth terms in terms of $a$ and $r$.',
          '(a) Divide one by the other to find $r$. The terms are all positive.',
          '(b) Use $r$ in one of your equations to find the first term.',
          '(c) State the condition on $r$ that a sum to infinity needs.',
          '(d) Use the sum to infinity formula.',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [null, `$ar^{2} = ${third}$ and $ar^{4} = ${fifth}$`, `$${R}$`, null, `$${condition}$`, null],
        watch: { at: 4, text: 'Say that $r$ is strictly between $-1$ and 1. "Between" on its own is not enough.' },
      },
    };
  },
};

// ── 2024 P2 Q9 ─────────────────────────────────────────────────────────────
// First term a, difference d: (a) the jth term; (b) the ith is m times the
// jth, so d; (c) the least n with S_n above T, from the quadratic.

interface P2Q9of2024 { a: number; j: number; i: number; m: number; T: number }

const ORDINAL = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
const TIMES: Readonly<Record<number, string>> = { 2: 'twice', 3: 'three times', 4: 'four times', 5: 'five times', 6: 'six times' };

/** d from a + (i - 1)d = m(a + (j - 1)d). */
const differenceOf = ({ a, j, i, m }: P2Q9of2024) => ((m - 1) * a) / ((i - 1) - m * (j - 1));

/** The positive root of d n² + (2a - d) n - 2T = 0: where S_n reaches T. */
const rootOf = (a: number, d: number, T: number) => (-(2 * a - d) + Math.sqrt((2 * a - d) ** 2 + 8 * d * T)) / (2 * d);

const q2024p2q9: CardRoutine<P2Q9of2024> = {
  draw: () => until(
    () => {
      const j = int(2, 4);
      return { a: int(-9, -1), j, i: int(j + 3, 10), m: int(2, 6), T: pick([100, 150, 200, 250, 300, 400, 500, 600, 750, 800, 1000]) };
    },
    (n) => {
      const d = differenceOf(n);
      // d a whole number, positive so the sum grows past T, and small, as the paper's 4.
      if (!Number.isInteger(d) || d < 1 || d > 10 || n.a + (n.j - 1) * d === 0) return false;
      const root = rootOf(n.a, d, n.T);
      // Not whole, and not so near it that one decimal place reads as whole, as 17.1.
      const frac = root - Math.floor(root);
      return frac >= 0.1 && frac <= 0.9 && root >= 6 && root <= 40;
    },
    1000,
  ),

  build: (n): Built => {
    const { a, j, i, m, T } = n;
    const d = differenceOf(n);
    const jth = sum([{ coef: a, body: '' }, { coef: j - 1, body: 'd' }]);
    const ith = sum([{ coef: a, body: '' }, { coef: i - 1, body: 'd' }]);
    const substituted = `${T} = \\frac{n}{2}(${2 * a} + ${d === 1 ? '' : d}(n - 1))`;
    const quadratic = `${poly([d, 2 * a - d, -2 * T], 'n')} = 0`;
    const root = rootOf(a, d, T);
    const least = Math.ceil(root);
    const S = (k: number) => (k * (2 * a + (k - 1) * d)) / 2;
    return {
      questionLines: [
        `An arithmetic sequence has first term $${a}$ and common difference $d.$`,
        `<b>(a)</b> State an expression for the ${ORDINAL[j]} term.`,
        '',
        `The ${ORDINAL[i]} term is ${TIMES[m]} the ${ORDINAL[j]} term.`,
        '<b>(b)</b> Find the value of $d.$',
        `<b>(c)</b> Determine algebraically the least number of terms required so that the sum of the associated series is greater than ${T}.`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> The ${ORDINAL[j]} term is $a + ${j === 2 ? '' : j - 1}d = ${jth}$`,
        `<strong>(b)</strong> The ${ORDINAL[i]} term is $${ith}$, so $${ith} = ${m}(${jth})$, giving $d = ${d}$`,
        `<strong>(c)</strong> $S_{n} = \\frac{n}{2}(2a + (n - 1)d)$: $${substituted}$`,
        `<strong>(c)</strong> $${quadratic}$, so $n \\approx ${rounded(root, 1)}$, the positive root`,
        `<strong>(c)</strong> $S_{${least - 1}} = ${S(least - 1)}$ and $S_{${least}} = ${S(least)}$: the least number of terms is ${least}`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `(a) $${jth}$<br>(b) $d = ${d}$<br>(c) ${least}`,
      ladder: {
        moves: [
          `Each term is the previous one plus $d$. How many $d$s are in the ${ORDINAL[j]} term, and in the ${ORDINAL[i]}?`,
          `(a) Write the ${ORDINAL[j]} term in terms of $d$.`,
          `(b) Write the ${ORDINAL[i]} term too, and use the fact that it is ${TIMES[m]} the ${ORDINAL[j]}.`,
          `(c) Put $a$ and $d$ into the arithmetic sum formula and set it equal to ${T}.`,
          '(c) Rearrange to a quadratic in $n$ and solve.',
          `(c) Decide which whole number of terms is the least that gives more than ${T}.`,
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [null, null, null, `$${substituted}$`, `$${quadratic}$; $${rounded(root, 1)}$`, null],
        watch: { at: 5, text: '$n$ has to be a whole number. Round your root up to the next whole number.' },
      },
    };
  },
};

// ── 2023 P1 Q7 ─────────────────────────────────────────────────────────────
// (a) Σ (r² + kr) = n(n + 1)(2n + 1 + 3k)/6 = (1/3)n(n + 1)(n + b), k odd and
// b = (1 + 3k)/2; (b) the sum from L to N as the sum to N less the sum to L - 1.

interface P1Q7of2023 { k: number; L: number; N: number }

const q2023p1q7: CardRoutine<P1Q7of2023> = {
  // k odd, so 2n + 1 + 3k halves into the form's n + b; L - 1 at least 5, so
  // both sums in (b) are positive, as the paper's. The biggest product worked
  // by hand, N(N + 1)(N + b), is no bigger than the paper's 20 × 21 × 25: the
  // owner on the 2023 P1 sheet, "biggest should be no larger than paper".
  draw: () => until(
    () => ({ k: pick([-3, -1, 1, 3, 5, 7]), L: int(6, 15), N: int(12, 20) }),
    ({ k, L, N }) => N - L >= 5 && N * (N + 1) * (N + (1 + 3 * k) / 2) <= 20 * 21 * 25,
  ),

  build: ({ k, L, N }): Built => {
    const b = (1 + 3 * k) / 2;
    const S = (n: number) => (n * (n + 1) * (n + b)) / 3;
    const summand = sum([{ coef: 1, body: 'r^{2}' }, { coef: k, body: 'r' }]);
    const sigma = (from: number | string, to: number | string) => `\\sum_{r=${from}}^{${to}} (${summand})`;
    const half = '\\frac{n(n + 1)}{2}';
    const linear = Math.abs(k) === 1 ? half : `${Math.abs(k)}\\left(${half}\\right)`;
    const substituted = `\\frac{n(n + 1)(2n + 1)}{6} ${k < 0 ? '-' : '+'} ${linear}`;
    const formA = `\\frac{1}{3}n(n + 1)(${poly([1, b], 'n')})`;
    const simplified = `\\frac{n(n + 1)}{6}(2n + 1 ${k < 0 ? '-' : '+'} ${Math.abs(3 * k)}) = \\frac{n(n + 1)(${poly([2, 1 + 3 * k], 'n')})}{6} = ${formA}`;
    const plus = (v: number) => `${v} ${b < 0 ? '-' : '+'} ${Math.abs(b)}`;
    const at = (n: number) => `\\frac{1}{3}(${n})(${n} + 1)(${plus(n)})`;
    const begun = `${at(N)} - \\ldots`;
    const value = S(N) - S(L - 1);
    return {
      questionLines: [
        `<b>(a)</b> Find an expression for $${sigma(1, 'n')}$ in terms of $n.$`,
        'Express your answer in the form $\\frac{1}{3}n(n + a)(n + b).$',
        `<b>(b)</b> Hence, or otherwise, find $${sigma(L, N)}.$`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> $${sigma(1, 'n')} = ${substituted}$`,
        `<strong>(a)</strong> $= ${simplified}$`,
        `<strong>(b)</strong> $${sigma(L, N)} = ${sigma(1, N)} - ${sigma(1, L - 1)} = ${at(N)} - ${at(L - 1)}$`,
        `<strong>(b)</strong> $= ${S(N)} - ${S(L - 1)} = ${value}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `(a) $${formA}$<br>(b) $${value}$`,
      ladder: {
        moves: [
          'The sum splits into two sums you have standard results for. Which ones?',
          '(a) Replace $\\sum r^{2}$ and $\\sum r$ with their formulae.',
          '(a) Take out the common factors and simplify into the given form.',
          `(b) The sum from ${L} to ${N} is the sum to ${N} minus the sum to what?`,
          '(b) Substitute and evaluate.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, `$${substituted}$`, `$${formA}$`, `$${begun}$`, null],
        watch: { at: 3, text: `The sum starts at $r = ${L}$. Which terms do you need to take away from the sum to ${N}?` },
      },
    };
  },
};

// ── 2023 P2 Q8 ─────────────────────────────────────────────────────────────
// A geometric sequence from its i-th and (i + 3)-th terms: r (a cube root)
// and a; then S_{2n}/S_n = 1 + rⁿ. Built from r and a = c rᵉ, so the two
// terms are whole, as the paper's 9 and 243 (r = 3, a = 1/3).

interface P2Q8of2023 { r: number; c: number; e: number; i: number }

const ORDINALS = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'];

const q2023p2q8: CardRoutine<P2Q8of2023> = {
  draw: () => until(
    () => ({ r: pick([2, 3, 4, 5, -2, -3]), c: int(1, 3), e: int(-2, 1), i: int(2, 5) }),
    // Both terms whole (the power of r in the first at least 0), the later at most 5000.
    ({ r, c, e, i }) => e + i - 1 >= 0 && Math.abs(c * r ** (e + i + 2)) <= 5000,
  ),

  build: ({ r, c, e, i }): Built => {
    const a = mul(q(c), pow(q(r), e));
    const X = c * r ** (e + i - 1), Y = c * r ** (e + i + 2);
    const R = r < 0 ? `(${r})` : `${r}`;
    const A = num(a);
    const S = (power: string) => {
      const top = `1 - ${R}^{${power}}`;
      const lead = c === 1 && e === 0 ? top : `${A}(${top})`;
      return `\\frac{${lead}}{1 - ${R}}`;
    };
    const Sn = `S_n = ${S('n')}`, S2n = `S_{2n} = ${S('2n')}`;
    const divided = `\\frac{S_{2n}}{S_n} = \\frac{1 - ${R}^{2n}}{1 - ${R}^{n}} = \\frac{(1 - ${R}^{n})(1 + ${R}^{n})}{1 - ${R}^{n}} = 1 + ${R}^{n}`;
    const aFrom = i === 2 ? `\\frac{${X}}{${r}}` : `\\frac{${X}}{${R}^{${i - 1}}}`;
    return {
      questionLines: [
        `The ${ORDINALS[i]} and ${ORDINALS[i + 3]} terms of a geometric sequence are ${X} and ${Y} respectively.`,
        '<b>(a)</b> Find the:',
        '(i) common ratio',
        '(ii) first term.',
        `<b>(b)</b> Show that $\\frac{S_{2n}}{S_n} = 1 + ${R}^{n}$ where $S_n$ represents the sum of the first $n$ terms of this geometric sequence.`,
      ],
      solutionSteps: [
        `<strong>(a)(i)</strong> $a${power('r', i - 1)} = ${X}$ and $ar^{${i + 2}} = ${Y}$, so $r^{3} = \\frac{${Y}}{${X}} = ${r ** 3}$ and $r = ${r}$`,
        `<strong>(a)(ii)</strong> $a = ${aFrom} = ${A}$`,
        `<strong>(b)</strong> $${Sn}$ and $${S2n}$`,
        `<strong>(b)</strong> $${divided}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: [
        `(a)(i) $${r}$`,
        `(a)(ii) $${A}$`,
        `(b) $${Sn}$ and $${S2n}.$ Dividing, $${divided}.$`,
      ].join('<br>'),
      ladder: {
        moves: [
          `Going from the ${ORDINALS[i]} term to the ${ORDINALS[i + 3]}, how many times do you multiply by $r$?`,
          `(a)(i) Divide the ${ORDINALS[i + 3]} term by the ${ORDINALS[i]} to find $r$.`,
          '(a)(ii) Use $r$ to find the first term.',
          '(b) Write $S_n$ and $S_{2n}$ with the geometric sum formula.',
          `(b) Divide them. Factorise $1 - ${R}^{2n}$ as a difference of two squares, and cancel.`,
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, null, `$${A}$`, `$${Sn}$ and $${S2n}$`, null],
        watch: { at: 4, text: `$${R}^{2n}$ is $(${R}^n)^2$. That is what lets you factorise.` },
      },
    };
  },
};

// ── 2022 P2 Q6 ─────────────────────────────────────────────────────────────
// Terms px + q, (p + r)x + (q + s), (p + 2r)x + (q + 2s): (a) the common
// difference rx + s twice; (b) u_n; (c) S_N given, so x: built from x.

interface P2Q6of2022 { p: number; q: number; r: number; s: number; x: number; n: number; N: number }

/** S_N at the chosen x, and the bracket N/2 multiplies. */
function sumOf({ p, q, r, s, x, N }: P2Q6of2022): { S: number; inner: [number, number] } {
  const inner: [number, number] = [2 * p + (N - 1) * r, 2 * q + (N - 1) * s];
  return { S: (N / 2) * (inner[0] * x + inner[1]), inner };
}

const q2022p2q6: CardRoutine<P2Q6of2022> = {
  draw: () => until(
    () => ({ p: int(1, 3), q: int(1, 9), r: int(1, 4), s: nonZero(-6, 6), x: int(2, 9), n: int(11, 20), N: 2 * int(5, 15) }),
    // Every term keeps its number, as x + 5, 3x + 2, 5x - 1, and so do u_n and
    // the bracket in (c); the sum positive and within 5000 (the paper's 1130).
    (v) => {
      const { S, inner } = sumOf(v);
      return v.q + v.s !== 0 && v.q + 2 * v.s !== 0 && v.q + (v.n - 1) * v.s !== 0 && inner[1] !== 0 && S > 0 && S <= 5000;
    },
  ),

  build: (v): Built => {
    const { p, q, r, s, x, n, N } = v;
    const { S, inner } = sumOf(v);
    const [t1, t2, t3] = [0, 1, 2].map(i => poly([p + i * r, q + i * s]));
    const d = poly([r, s]);
    const nth = poly([p + (n - 1) * r, q + (n - 1) * s]);
    const first = `(${t2}) - (${t1}) = ${d}`, second = `(${t3}) - (${t2}) = ${d}`;
    const sub = `${t1} + (${n} - 1)(${d})`;
    const formula = `\\frac{${N}}{2}\\left[2(${t1}) + (${N} - 1)(${d})\\right] = ${S}`;
    const bracket = poly(inner);
    return {
      questionLines: [
        `The first three terms of a sequence are defined algebraically by $${t1}$, $${t2}$, $${t3}$, where $x \\in \\mathbb{N}.$`,
        '<b>(a)</b> Show that these three terms form the start of an arithmetic sequence.',
        `<b>(b)</b> Find a simplified expression for the $${n}^{th}$ term of this sequence.`,
        `<b>(c)</b> Given that the sum of the first ${N} terms of this sequence is ${S}, find the value of $x.$`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> $${first}$`,
        `<strong>(a)</strong> $${second}$: the common difference is the same, so the terms form the start of an arithmetic sequence`,
        `<strong>(b)</strong> $u_{${n}} = ${sub}$`,
        `<strong>(b)</strong> $u_{${n}} = ${nth}$`,
        `<strong>(c)</strong> $${formula}$`,
        `<strong>(c)</strong> $${N / 2}(${bracket}) = ${S}$, so $${bracket} = ${S / (N / 2)}$ and $x = ${x}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1],
      finalAnswer: [
        `(a) $${first}$ and $${second}.$ Common difference is the same, so it is arithmetic.`,
        `(b) $${nth}$`,
        `(c) $x = ${x}$`,
      ].join('<br>'),
      ladder: {
        moves: [
          'What must be true of the differences between consecutive terms in an arithmetic sequence?',
          '(a) Subtract the first term from the second.',
          '(a) Subtract the second from the third, and say what the two results show.',
          `(b) Put the first term and the common difference into the $n$th term formula with $n = ${n}$.`,
          '(b) Simplify.',
          `(c) Put them into the arithmetic sum formula with $n = ${N}$, and set it equal to ${S}.`,
          '(c) Solve for $x$.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1],
        shows: [null, `$${first}$`, `$${second}$, common difference`, `$${sub}$`, null, `$${formula}$`, null],
        watch: { at: 2, text: 'Work with $x$ as a letter. Picking a number for $x$ does not show it for every term.' },
      },
    };
  },
};

export const ROUTINES = {
  '2022 P2 Q6': q2022p2q6,
  '2023 P1 Q7': q2023p1q7,
  '2023 P2 Q8': q2023p2q8,
  '2024 P1 Q3': q2024p1q3,
  '2024 P2 Q9': q2024p2q9,
  '2025 P2 Q10': q2025p2q10,
  '2025 P2 Q13': q2025p2q13,
  '2026 P2 Q6': q2026p2q6,
};
