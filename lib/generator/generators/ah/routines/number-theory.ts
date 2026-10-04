/**
 * Advanced Higher, Number Theory: how each card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/number-theory.ts` under the same label.
 */
import type { Built, CardRoutine } from '../types';
import { int, pick, until } from '../draw';
import { digits, euclid } from '../maths/integer';

// ── 2026 P2 Q4 ─────────────────────────────────────────────────────────────
// (a) gcd(A, B) = d by the Euclidean algorithm, four lines; (b) Aa + Bb = d

interface P2Q4 { d: number; q1: number; q2: number; q3: number; q4: number }

/** The two numbers whose algorithm has these quotients and ends at d, built from the bottom line up. */
function numbersFor({ d, q1, q2, q3, q4 }: P2Q4): { A: number; B: number } {
  const r2 = q4 * d, r1 = q3 * r2 + d, B = q2 * r1 + r2;
  return { A: q1 * B + r1, B };
}

const q2026p2q4: CardRoutine<P2Q4> = {
  draw: () => until(
    () => ({ d: int(7, 40), q1: int(2, 4), q2: int(1, 3), q3: int(1, 3), q4: int(2, 15) }),
    (n) => {
      const { A, B } = numbersFor(n);
      return A >= 1000 && A <= 9999 && B >= 100 && B <= 999;
    },
  ),

  build: (n): Built => {
    const { A, B } = numbersFor(n);
    const rows = euclid(A, B);
    const [first, second, third] = rows;
    const d = third.r, r1 = first.r, r2 = second.r;
    const lines = rows.map(r => `$${r.a} = ${r.q} \\times ${r.b}${r.r ? ` + ${r.r}` : ''}$`).join(', ');
    // Back from the third line: d = r1 - q3 r2 = r1 - q3(B - q2 r1) = (1 + q2 q3) r1 - q3 B,
    // then r1 = A - q1 B.
    const a = 1 + second.q * third.q;
    const b = -(first.q * a + third.q);
    const inR1 = `${d} = ${r1} - ${third.q} \\times (${B} - ${second.q} \\times ${r1})`;
    return {
      questionLines: [
        `<b>(a)</b> Use the Euclidean algorithm to find $d$, the greatest common divisor of ${A} and ${B}.`,
        `<b>(b)</b> Find integers $a$ and $b$ such that $${A}a + ${B}b = d.$`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> ${lines}, so $d = ${d}$`,
        `<strong>(b)</strong> $${d} = ${r1} - ${third.q} \\times ${r2}$, so $${inR1} = ${a} \\times ${r1} - ${third.q} \\times ${B}$`,
        `<strong>(b)</strong> $${d} = ${a} \\times (${A} - ${first.q} \\times ${B}) - ${third.q} \\times ${B} = ${a} \\times ${A} - ${-b} \\times ${B}$, so $a = ${a}$ and $b = ${b}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `(a) $d = ${d}$<br>(b) $a = ${a}$ and $b = ${b}$`,
      ladder: {
        moves: [
          'The Euclidean algorithm divides the larger number by the smaller. What do you do with the remainder?',
          '(a) Keep dividing the last divisor by the last remainder until the remainder is zero, and say which number is the gcd.',
          `(b) Work backwards through your lines, writing the gcd in terms of ${B} and ${r1}.`,
          `(b) Substitute for ${r1} so that only ${A} and ${B} are left, and read off $a$ and $b$.`,
        ],
        marks: [0, 1, 1, 1],
        shows: [null, `$${first.a} = ${first.q} \\times ${first.b} + ${r1}$, leading to $\\gcd = ${d}$`, `$${inR1}$`, null],
        watch: { at: 2, text: 'A correct $a$ and $b$ with no working backwards earns nothing in (b).' },
      },
    };
  },
};

// ── 2025 P2 Q4 ─────────────────────────────────────────────────────────────
// (a) gcd(A, B) = d by the Euclidean algorithm, four lines; (b) hence Aa + Bb = d.
// The same shape as 2026 P2 Q4, on its own numbers and wording (rule 3).

interface P2Q4of2025 { d: number; q1: number; q2: number; q3: number; q4: number }

/** The two numbers whose algorithm has these quotients and ends at d, from the bottom line up. */
function numbers2025({ d, q1, q2, q3, q4 }: P2Q4of2025): { A: number; B: number } {
  const r2 = q4 * d, r1 = q3 * r2 + d, B = q2 * r1 + r2;
  return { A: q1 * B + r1, B };
}

const q2025p2q4: CardRoutine<P2Q4of2025> = {
  // The paper's 1118 and 416: quotients 2, 1, 2, 5 and d = 26.
  draw: () => until(
    () => ({ d: int(7, 40), q1: int(2, 4), q2: int(1, 3), q3: int(1, 3), q4: int(2, 9) }),
    (n) => {
      const { A, B } = numbers2025(n);
      return A >= 1000 && A <= 9999 && B >= 100 && B <= 999;
    },
  ),

  build: (n): Built => {
    const { A, B } = numbers2025(n);
    const rows = euclid(A, B);
    const [first, second, third] = rows;
    const d = third.r, r1 = first.r, r2 = second.r;
    const lines = rows.map(r => `$${r.a} = ${r.q} \\times ${r.b}${r.r ? ` + ${r.r}` : ''}$`).join(', ');
    // d = r1 - q3 r2 = r1 - q3(B - q2 r1) = (1 + q2 q3) r1 - q3 B, then r1 = A - q1 B.
    const a = 1 + second.q * third.q;
    const b = -(third.q + first.q * a);
    const inR1 = `${d} = ${r1} - ${third.q} \\times ${r2} = ${r1} - ${third.q} \\times (${B} - ${second.q} \\times ${r1})`;
    return {
      questionLines: [
        `<b>(a)</b> Use the Euclidean algorithm to find $d$, the greatest common divisor of ${A} and ${B}.`,
        `<b>(b)</b> Hence find integers $a$ and $b$ such that $${A}a + ${B}b = d.$`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> ${lines}, so $d = ${d}$`,
        `<strong>(b)</strong> $${inR1} = ${a} \\times ${r1} - ${third.q} \\times ${B}$`,
        `<strong>(b)</strong> $${d} = ${a} \\times (${A} - ${first.q} \\times ${B}) - ${third.q} \\times ${B} = ${a} \\times ${A} - ${-b} \\times ${B}$, so $a = ${a}$ and $b = ${b}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `(a) $d = ${d}$<br>(b) $a = ${a}$ and $b = ${b}$`,
      ladder: {
        moves: [
          'The Euclidean algorithm divides the larger number by the smaller. What do you do with the remainder?',
          '(a) Keep dividing the last divisor by the last remainder until the remainder is zero, and say which number is the gcd.',
          `(b) Work backwards through your lines, writing the gcd in terms of ${r1} and ${B}.`,
          `(b) Substitute for ${r1} so that only ${A} and ${B} are left, and read off $a$ and $b$.`,
        ],
        marks: [0, 1, 1, 1],
        shows: [null, `$${first.a} = ${first.q} \\times ${first.b} + ${r1}$, leading to $\\gcd = ${d}$`, `$${inR1}$`, null],
        watch: { at: 2, text: 'A correct $a$ and $b$ with no working backwards earns nothing in (b).' },
      },
    };
  },
};

// ── 2026 P2 Q9 ─────────────────────────────────────────────────────────────
// a four-digit number in one base to three digits in a larger one

interface P2Q9 { from: number; to: number; N: number }

/** The numbers with four digits in `from` and three in `to`. */
const span = (from: number, to: number) =>
  ({ lo: Math.max(from ** 3, to ** 2), hi: Math.min(from ** 4, to ** 3) - 1 });

const q2026p2q9: CardRoutine<P2Q9> = {
  draw: () => {
    const { from, to } = until(
      () => ({ from: int(3, 7), to: int(4, 9) }),
      ({ from, to }) => from < to && span(from, to).lo <= span(from, to).hi,
    );
    const { lo, hi } = span(from, to);
    const N = until(() => int(lo, hi), (v) => !digits(v, from).includes(0) && !digits(v, to).includes(0));
    return { from, to, N };
  },

  build: ({ from, to, N }): Built => {
    const src = digits(N, from);
    const number = `${src.join('')}_{${from}}`;
    const places = src.map((d, i) => {
      const p = src.length - 1 - i;
      return p === 0 ? `${d}` : p === 1 ? `${d} \\times ${from}` : `${d} \\times ${from}^{${p}}`;
    }).join(' + ');
    const divisions: string[] = [];
    for (let v = N; v > 0; v = Math.floor(v / to)) divisions.push(`${v} = ${to} \\times ${Math.floor(v / to)} + ${v % to}`);
    const shown = `$${divisions.join('$, $')}$`;
    const answer = `${digits(N, to).join('')}_{${to}}`;
    return {
      questionLines: [`Express $${number}$ in base ${to}.`],
      solutionSteps: [
        `$${number} = ${places} = ${N}_{10}$`,
        shown,
        `Reading the remainders from the last to the first: $${answer}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          `What is $${number}$ in base 10? Each digit is worth a power of ${from}.`,
          `Convert to base 10 using powers of ${from}.`,
          `Divide by ${to} repeatedly, writing down each remainder.`,
          'Read the remainders from the last one back to the first.',
        ],
        marks: [0, 1, 1, 1],
        shows: [null, null, shown, null],
        watch: { at: 1, text: `$${src.join('')}$ is in base ${from}. Converting it as if it were a base 10 number loses the first mark.` },
      },
    };
  },
};

// ── 2024 P2 Q2 ─────────────────────────────────────────────────────────────
// Aa + Bb = d, the gcd given, by the Euclidean algorithm and working backwards

interface P2Q2of2024 { d: number; q1: number; q2: number; q3: number; q4: number }

/** The two numbers whose algorithm has these quotients and ends at d, from the bottom line up. */
function numbers2024({ d, q1, q2, q3, q4 }: P2Q2of2024): { A: number; B: number } {
  const r2 = q4 * d, r1 = q3 * r2 + d, B = q2 * r1 + r2;
  return { A: q1 * B + r1, B };
}

const q2024p2q2: CardRoutine<P2Q2of2024> = {
  // The paper's 533 and 455: quotients 1, 5, 1, 5 and d = 13, both numbers three digits.
  draw: () => until(
    () => ({ d: int(5, 40), q1: int(1, 2), q2: int(1, 6), q3: int(1, 3), q4: int(2, 9) }),
    (n) => {
      const { A, B } = numbers2024(n);
      return A <= 999 && B >= 100;
    },
  ),

  build: (n): Built => {
    const { A, B } = numbers2024(n);
    const rows = euclid(A, B);
    const [first, second, third] = rows;
    const d = third.r, r1 = first.r, r2 = second.r;
    const lines = rows.map((r, i) => {
      const line = `${r.a} = ${r.b} \\times ${r.q}${r.r ? ` + ${r.r}` : ''}`;
      return i === rows.length - 1 ? `$(${line})$` : `$${line}$`;
    }).join(', ');
    // d = r1 - q3 r2 = r1 - q3(B - q2 r1) = (1 + q2 q3) r1 - q3 B, then r1 = A - q1 B.
    const a = 1 + second.q * third.q;
    const b = -(third.q + first.q * a);
    const q3x = third.q === 1 ? '' : `${third.q} \\times `;
    const back = `${d} = ${r1} - ${q3x}${r2} = ${r1} - ${q3x}(${B} - ${second.q} \\times ${r1}) = ${a} \\times ${r1} - ${q3x}${B}`;
    const given = `${d} = (${A} - ${B} \\times ${first.q}) \\times ${a} - ${q3x}${B}`;
    return {
      questionLines: [`Use the Euclidean algorithm to find integers $a$ and $b$ such that $${A}a + ${B}b = ${d}.$`],
      solutionSteps: [
        lines,
        `Working backwards, $${back}$, so $${given}$`,
        `$${d} = ${a} \\times ${A} - ${-b} \\times ${B}$, so $a = ${a}$ and $b = ${b}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `$a = ${a}$ and $b = ${b}$`,
      ladder: {
        moves: [
          'The Euclidean algorithm divides the larger number by the smaller. What do you do with the remainder?',
          'Keep dividing the last divisor by the last remainder until the remainder is zero.',
          `Work backwards through your lines, writing ${d} in terms of ${A} and ${B}.`,
          'Read off $a$ and $b$, and state them.',
        ],
        marks: [0, 1, 1, 1],
        shows: [null, lines, `$${given}$`, null],
        watch: { at: 3, text: 'State $a$ and $b$ explicitly, as well as the final equation.' },
      },
    };
  },
};

// ── 2023 P2 Q6 ─────────────────────────────────────────────────────────────
// (a) gcd(A, B) = d, four lines; (b) d = Aa + Bb; (c) hence md = Ap + Bq.

interface P2Q6of2023 { d: number; q1: number; q2: number; q3: number; q4: number; m: number }

/** The two numbers whose algorithm has these quotients and ends at d, from the bottom line up. */
function numbers2023({ d, q1, q2, q3, q4 }: P2Q6of2023): { A: number; B: number } {
  const r2 = q4 * d, r1 = q3 * r2 + d, B = q2 * r1 + r2;
  return { A: q1 * B + r1, B };
}

const q2023p2q6: CardRoutine<P2Q6of2023> = {
  // The paper's 703 and 399: quotients 1, 1, 3, 5 and d = 19, both numbers three digits.
  draw: () => until(
    () => ({ d: int(5, 40), q1: int(1, 2), q2: int(1, 3), q3: int(1, 4), q4: int(2, 9), m: int(2, 6) }),
    (n) => {
      const { A, B } = numbers2023(n);
      return A <= 999 && B >= 100;
    },
  ),

  build: (n): Built => {
    const { A, B } = numbers2023(n);
    const rows = euclid(A, B);
    const [first, second, third] = rows;
    const d = third.r, r1 = first.r, r2 = second.r;
    const lines = rows.map(r => `$${r.a} = ${r.q} \\times ${r.b}${r.r ? ` + ${r.r}` : ''}$`).join(', ');
    // d = r1 - q3 r2 = r1 - q3(B - q2 r1) = (1 + q2 q3) r1 - q3 B, then r1 = A - q1 B.
    const a = 1 + second.q * third.q;
    const b = -(third.q + first.q * a);
    const inR1 = `${d} = ${r1} - ${third.q} \\times ${r2} = ${r1} - ${third.q} \\times (${B} - ${second.q} \\times ${r1})`;
    const target = n.m * d;
    return {
      questionLines: [
        `<b>(a)</b> Use the Euclidean algorithm to find $d$, the greatest common divisor of ${A} and ${B}.`,
        `<b>(b)</b> Find integers $a$ and $b$ such that $d = ${A}a + ${B}b.$`,
        `<b>(c)</b> Hence find integers $p$ and $q$ such that $${target} = ${A}p + ${B}q.$`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> ${lines}, so $d = ${d}$`,
        `<strong>(b)</strong> $${inR1}$`,
        `<strong>(b)</strong> $${d} = ${a} \\times ${r1} - ${third.q} \\times ${B} = ${a} \\times (${A} - ${first.q} \\times ${B}) - ${third.q} \\times ${B} = ${a} \\times ${A} - ${-b} \\times ${B}$, so $a = ${a}$ and $b = ${b}$`,
        `<strong>(c)</strong> $${target} = ${n.m} \\times ${d}$, so $p = ${n.m} \\times ${a} = ${n.m * a}$ and $q = ${n.m} \\times (${b}) = ${n.m * b}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `(a) $d = ${d}$<br>(b) $a = ${a}$ and $b = ${b}$<br>(c) $p = ${n.m * a}$ and $q = ${n.m * b}$`,
      ladder: {
        moves: [
          'The Euclidean algorithm divides the larger number by the smaller. What do you do with the remainder?',
          '(a) Keep dividing the last divisor by the last remainder until the remainder is zero, and say which number is the gcd.',
          `(b) Work backwards through your lines, writing the gcd in terms of ${B} and ${r1}.`,
          `(b) Substitute for ${r1} so that only ${A} and ${B} are left, and read off $a$ and $b$.`,
          `(c) How many times does the gcd go into ${target}? Scale your answer to (b).`,
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, null, `$${inR1}$`, null, null],
        watch: { at: 4, text: 'In (c), give $p$ and $q$ by name, not as $a$ and $b$ again.' },
      },
    };
  },
};

// ── 2023 P2 Q9 ─────────────────────────────────────────────────────────────
// a base 10 number to three digits in base b, by repeated division

interface P2Q9of2023 { base: number; N: number }

const q2023p2q9: CardRoutine<P2Q9of2023> = {
  // The paper's 572 in base 9 (705): three digits in the base, three in base 10.
  draw: () => {
    const base = int(5, 9);
    return { base, N: int(Math.max(100, base * base), base ** 3 - 1) };
  },

  build: ({ base, N }): Built => {
    const divisions: string[] = [];
    // "63 ÷ 9 = 7 remainder 0" rather than the scheme's "63 = 9 × 7 + 0": the
    // same division, without a "+ 0" when a digit is 0, as the paper's 705 has.
    for (let v = N; v > 0; v = Math.floor(v / base)) divisions.push(`$${v} \\div ${base} = ${Math.floor(v / base)}$ remainder $${v % base}$`);
    const shown = divisions.join(', ');
    const answer = `${digits(N, base).join('')}_{${base}}`;
    return {
      questionLines: [`Express $${N}_{10}$ in base ${base}.`],
      solutionSteps: [
        shown,
        `Reading the remainders from the last to the first: $${answer}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          `To write a number in base ${base}, divide by ${base} over and over. Which parts do you keep?`,
          `Divide by ${base} repeatedly, writing down each remainder, until the quotient is zero.`,
          'Read the remainders from the last one back to the first.',
        ],
        marks: [0, 1, 1],
        shows: [null, shown, null],
        watch: { at: 1, text: 'Keep going until the quotient is zero. The last division gives the first digit.' },
      },
    };
  },
};

// ── 2022 P2 Q3 ─────────────────────────────────────────────────────────────
// Aa + Bb = 1 by the Euclidean algorithm, three lines to the remainder 1, then
// working backwards: built from the bottom line up.

interface P2Q3of2022 { r2: number; q1: number; q2: number; q3: number }

/** The two numbers whose algorithm reaches the remainder 1 on its third line, from the bottom up. */
function numbers2022({ r2, q1, q2, q3 }: P2Q3of2022): { A: number; B: number; r1: number } {
  const r1 = q3 * r2 + 1, B = q2 * r1 + r2;
  return { A: q1 * B + r1, B, r1 };
}

const q2022p2q3: CardRoutine<P2Q3of2022> = {
  // The paper's 634 and 87: quotients 7, 3, 2, remainders 25, 12, 1; three digits and two.
  draw: () => until(
    () => ({ r2: int(2, 20), q1: int(2, 9), q2: int(1, 4), q3: int(1, 4) }),
    (n) => {
      const { A, B } = numbers2022(n);
      return B >= 40 && B <= 99 && A >= 200 && A <= 999;
    },
  ),

  build: (n): Built => {
    const { r2, q1, q2, q3 } = n;
    const { A, B, r1 } = numbers2022(n);
    // The scheme's order, "634 = 7 × 87 + 25", down to the remainder 1.
    const lines = `$${A} = ${q1} \\times ${B} + ${r1}$, $${B} = ${q2} \\times ${r1} + ${r2}$, $${r1} = ${q3} \\times ${r2} + 1$`;
    const times = (k: number, x: string) => (k === 1 ? x : `${k} \\times ${x}`);
    const bracket = (k: number, x: string) => (k === 1 ? x : `${k}${x}`);
    // 1 = r1 - q3 r2 = r1 - q3(B - q2 r1) = (1 + q2 q3) r1 - q3 B, then r1 = A - q1 B.
    const a = 1 + q2 * q3;
    const b = -(q3 + q1 * a);
    const inB = `1 = ${r1} - ${bracket(q3, `(${B} - ${times(q2, String(r1))})`)}`;
    const back = `1 = ${r1} - ${times(q3, String(r2))}$, so $${inB} = ${a} \\times ${r1} - ${times(q3, String(B))}`;
    const given = `1 = ${a}(${A} - ${q1} \\times ${B}) - ${times(q3, String(B))}`;
    return {
      questionLines: [`Use the Euclidean algorithm to find integers $a$ and $b$ such that $${A}a + ${B}b = 1.$`],
      solutionSteps: [
        lines,
        `Working backwards, $${back}$`,
        `$${given} = ${a} \\times ${A} - ${-b} \\times ${B}$, so $a = ${a}$ and $b = ${b}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `$a = ${a}$ and $b = ${b}$`,
      ladder: {
        moves: [
          'The Euclidean algorithm divides the larger number by the smaller. What do you do with the remainder?',
          'Keep dividing the last divisor by the last remainder until the remainder is 1.',
          `Work backwards through your lines, writing 1 in terms of ${B} and ${r1}.`,
          `Substitute back until only ${A} and ${B} are left, and state $a$ and $b$.`,
        ],
        marks: [0, 1, 1, 1],
        shows: [null, lines, `$${inB}$`, null],
        watch: { at: 3, text: 'State $a$ and $b$ explicitly, as well as the final equation.' },
      },
    };
  },
};

// ── 2021 P2 Q2 ─────────────────────────────────────────────────────────────
// (a) Aa + Bb = d by the Euclidean algorithm, four lines; (b) "Hence" Ax + By = md

interface P2Q2of2021 { d: number; q1: number; q2: number; q3: number; q4: number; m: number }

/** The two numbers whose algorithm has these quotients and ends at d, built from the bottom line up. */
function numbers2021({ d, q1, q2, q3, q4 }: P2Q2of2021): { A: number; B: number } {
  const r2 = q4 * d, r1 = q3 * r2 + d, B = q2 * r1 + r2;
  return { A: q1 * B + r1, B };
}

const q2021p2q2: CardRoutine<P2Q2of2021> = {
  draw: () => until(
    () => ({ d: int(2, 9), q1: int(1, 3), q2: int(1, 3), q3: int(2, 6), q4: int(2, 4), m: int(2, 15) * 10 }),
    // Two- and three-digit numbers, as 105 and 72; (b)'s right-hand side a
    // round multiple of d, as 360 = 120 × 3.
    (n) => {
      const { A, B } = numbers2021(n);
      return A >= 60 && A <= 400 && B >= 30 && B <= 250;
    },
  ),

  build: (n): Built => {
    const { A, B } = numbers2021(n);
    const rows = euclid(A, B);
    const [first, second, third] = rows;
    const d = third.r, r1 = first.r, r2 = second.r;
    const times = (q: number, b: number) => (q === 1 ? `${b}` : `${q} \\times ${b}`);
    const lines = rows.map(r => `$${r.a} = ${times(r.q, r.b)}${r.r ? ` + ${r.r}` : ''}$`).join(', ');
    // d = r1 - q3 r2 = r1 - q3(B - q2 r1) = (1 + q2 q3) r1 - q3 B, then r1 = A - q1 B.
    const a = 1 + second.q * third.q;
    const b = -(first.q * a + third.q);
    const target = n.m * d;
    const inR1 = `${d} = ${r1} - ${third.q} \\times (${B} - ${times(second.q, r1)})`;
    return {
      questionLines: [
        `<b>(a)</b> Use the Euclidean algorithm to find integers $a$ and $b$ such that $${A}a + ${B}b = ${d}.$`,
        `<b>(b)</b> Hence find integers $x$ and $y$ such that $${A}x + ${B}y = ${target}.$`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> ${lines}`,
        `<strong>(a)</strong> $${d} = ${r1} - ${third.q} \\times ${r2}$, so $${inR1}$`,
        `<strong>(a)</strong> $${d} = ${a} \\times ${r1} - ${third.q} \\times ${B} = ${a} \\times (${A} - ${times(first.q, B)}) - ${third.q} \\times ${B} = ${a} \\times ${A} - ${-b} \\times ${B}$, so $a = ${a},\\ b = ${b}$`,
        `<strong>(b)</strong> $${target} = ${n.m} \\times ${d}$, so $x = ${n.m} \\times ${a} = ${n.m * a},\\ y = ${n.m} \\times (${b}) = ${n.m * b}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `(a) $a = ${a},\\ b = ${b}$<br>(b) $x = ${n.m * a},\\ y = ${n.m * b}$`,
      ladder: {
        moves: [
          'The Euclidean algorithm divides the larger number by the smaller. What do you do with the remainder?',
          '(a) Keep dividing the last divisor by the last remainder until the remainder is zero.',
          `(a) Work backwards through your lines, writing ${d} in terms of the earlier numbers.`,
          `(a) Substitute back until only ${A} and ${B} are left, and state $a$ and $b$.`,
          `(b) How many times does ${d} go into ${target}? Scale $a$ and $b$ by it.`,
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, lines, `$${inR1}$`, null, null],
      },
    };
  },
};

// ── 2019 Q12 ───────────────────────────────────────────────────────────────
// a three-digit number in one base to three digits in a smaller one, through
// base 10: the paper's 231 in base 11 to 543 in base 7.

interface Q12of2019 { from: number; to: number; N: number }

/** The numbers with three digits in both bases. */
const span2019 = (from: number, to: number) =>
  ({ lo: Math.max(from ** 2, to ** 2), hi: Math.min(from ** 3, to ** 3) - 1 });

/**
 * Each pair of bases with the numbers it can take: no 0 in either, and no
 * digit above 9 in the first, as 231 and 543. Listed, not drawn and kept,
 * because for some pairs few numbers qualify and a draw loop would starve.
 */
const Q12_PAIRS2019: readonly { from: number; to: number; Ns: number[] }[] = (() => {
  const out: { from: number; to: number; Ns: number[] }[] = [];
  for (let from = 8; from <= 12; from++) {
    for (let to = 4; to < Math.min(from, 10); to++) {
      const { lo, hi } = span2019(from, to);
      const Ns: number[] = [];
      for (let v = lo; v <= hi; v++) {
        const src = digits(v, from), dst = digits(v, to);
        if (!src.includes(0) && !dst.includes(0) && src.every(d => d <= 9)) Ns.push(v);
      }
      if (Ns.length) out.push({ from, to, Ns });
    }
  }
  return out;
})();

const q2019q12: CardRoutine<Q12of2019> = {
  draw: () => {
    const { from, to, Ns } = pick(Q12_PAIRS2019);
    return { from, to, N: pick(Ns) };
  },

  build: ({ from, to, N }): Built => {
    const src = digits(N, from);
    const number = `${src.join('')}_{${from}}`;
    const places = src.map((d, i) => {
      const p = src.length - 1 - i;
      return p === 0 ? `${d}` : p === 1 ? `${d} \\times ${from}` : `${d} \\times ${from}^{${p}}`;
    }).join(' + ');
    const divisions: string[] = [];
    for (let v = N; v > 0; v = Math.floor(v / to)) divisions.push(`${v} = ${to} \\times ${Math.floor(v / to)} + ${v % to}`);
    const shown = `$${divisions.join('$, $')}$`;
    const answer = `${digits(N, to).join('')}_{${to}}`;
    return {
      questionLines: [`Express $${number}$ in base ${to}.`],
      solutionSteps: [
        `$${number} = ${places} = ${N}$`,
        shown,
        `Reading the remainders from the last to the first: $${answer}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          `What is $${number}$ in base 10? Each digit is worth a power of ${from}.`,
          `Convert to base 10 using powers of ${from}.`,
          `Divide by ${to} repeatedly, writing down each remainder, until the quotient is zero.`,
          'Read the remainders from the last one back to the first.',
        ],
        marks: [0, 1, 1, 1],
        shows: [null, `$${N}$`, shown, null],
        watch: { at: 1, text: `$${src.join('')}$ is in base ${from}. Treating it as a base 10 number loses the first mark.` },
      },
    };
  },
};

// ── 2018 Q5 ────────────────────────────────────────────────────────────────
// Aa + Bb = d by the Euclidean algorithm, the gcd given: four lines, as the
// paper's 306 and 119; then back from the third, d = r1 - q3 r2 =
// (1 + q2 q3) r1 - q3 B, and r1 = A - q1 B.

interface Q5of2018 { d: number; q1: number; q2: number; q3: number; q4: number }

/** The two numbers whose algorithm has these quotients and ends at d, from the bottom line up. */
function numbers2018({ d, q1, q2, q3, q4 }: Q5of2018): { A: number; B: number } {
  const r2 = q4 * d, r1 = q3 * r2 + d, B = q2 * r1 + r2;
  return { A: q1 * B + r1, B };
}

const q2018q5: CardRoutine<Q5of2018> = {
  // The paper's 306 and 119: quotients 2, 1, 1, 3 and d = 17. Both numbers three digits, as the paper's.
  draw: () => until(
    () => ({ d: int(7, 30), q1: int(1, 4), q2: int(1, 3), q3: int(1, 3), q4: int(2, 5) }),
    (n) => {
      const { A, B } = numbers2018(n);
      return A >= 200 && A <= 999 && B >= 100;
    },
  ),

  build: (n): Built => {
    const { A, B } = numbers2018(n);
    const rows = euclid(A, B);
    const [first, second, third] = rows;
    const d = third.r, r1 = first.r, r2 = second.r;
    const line = (r: { a: number; q: number; b: number; r: number }) => `$${r.a} = ${r.q} \\times ${r.b}${r.r ? ` + ${r.r}` : ''}$`;
    const a = 1 + second.q * third.q;
    const b = -(third.q + first.q * a);
    const inBoth = `${d} = -${third.q} \\times ${B} + ${a}(${A} - ${first.q} \\times ${B})`;
    return {
      questionLines: [`Use the Euclidean algorithm to find integers $a$ and $b$ such that $${A}a + ${B}b = ${d}.$`],
      solutionSteps: [
        `${line(first)}, ${line(second)}`,
        rows.slice(2).map(line).join(', '),
        `$${d} = ${r1} - ${third.q} \\times ${r2} = ${r1} - ${third.q} \\times (${B} - ${second.q} \\times ${r1}) = ${a} \\times ${r1} - ${third.q} \\times ${B}$, so $${inBoth}$`,
        `$${d} = ${a} \\times ${A} - ${-b} \\times ${B}$, so $a = ${a}$, $b = ${b}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `$a = ${a}$, $b = ${b}$`,
      ladder: {
        moves: [
          'The Euclidean algorithm divides the larger number by the smaller. What do you do with the remainder?',
          `Start the algorithm: divide ${A} by ${B}, then ${B} by the remainder.`,
          `Carry on until the remainder is ${d}.`,
          `Work backwards, writing ${d} in terms of ${A} and ${B}.`,
          'State $a$ and $b$.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, `${line(first)} (${line(second)})`, `${rows.slice(2).map(line).join(' (')}${rows.length > 3 ? ')' : ''}`, `$${inBoth}$`, null],
        watch: { at: 4, text: 'State $a$ and $b$ explicitly, as well as the final equation.' },
      },
    };
  },
};

// ── 2017 Q8 ────────────────────────────────────────────────────────────────
// Aa + Bb = d by the Euclidean algorithm, the gcd given, four lines and four
// digits, as the paper's 1595 and 1218; then d in terms of r1 and B,
// d = r1 - q3(B - q2 r1), as the scheme's third mark, and on to A and B.

interface Q8of2017 { d: number; q1: number; q2: number; q3: number; q4: number }

/** The two numbers whose algorithm has these quotients and ends at d, from the bottom line up. */
function numbers2017({ d, q1, q2, q3, q4 }: Q8of2017): { A: number; B: number } {
  const r2 = q4 * d, r1 = q3 * r2 + d, B = q2 * r1 + r2;
  return { A: q1 * B + r1, B };
}

const q2017q8: CardRoutine<Q8of2017> = {
  // The paper's 1595 and 1218: quotients 1, 3, 4, 3 and d = 29. Both numbers
  // four digits, A under 5000.
  draw: () => until(
    () => ({ d: int(11, 40), q1: int(1, 3), q2: int(1, 4), q3: int(1, 5), q4: int(2, 5) }),
    (n) => {
      const { A, B } = numbers2017(n);
      return B >= 1000 && A <= 4999;
    },
  ),

  build: (n): Built => {
    const { A, B } = numbers2017(n);
    const rows = euclid(A, B);
    const [first, second, third] = rows;
    const d = third.r, r1 = first.r, r2 = second.r;
    // The last line ends at the divisor, with no "+ 0" (the card rules).
    const line = (r: { a: number; q: number; b: number; r: number }) => `$${r.a} = ${r.q} \\times ${r.b}${r.r ? ` + ${r.r}` : ''}$`;
    const a = 1 + second.q * third.q;
    const b = -(third.q + first.q * a);
    const back =`${d} = ${r1} - ${third.q}(${B} - ${second.q} \\times ${r1})`;
    return {
      questionLines: [`Use the Euclidean algorithm to find integers $a$ and $b$ such that $${A}a + ${B}b = ${d}.$`],
      solutionSteps: [
        line(first),
        rows.slice(1).map(line).join(', '),
        `$${d} = ${r1} - ${third.q} \\times ${r2}$, so $${back}$`,
        `$${d} = ${a} \\times ${r1} - ${third.q} \\times ${B} = ${a}(${A} - ${first.q} \\times ${B}) - ${third.q} \\times ${B} = ${a} \\times ${A} - ${-b} \\times ${B}$, so $a = ${a}$, $b = ${b}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `$a = ${a}$, $b = ${b}$`,
      ladder: {
        moves: [
          'The Euclidean algorithm divides the larger number by the smaller. What do you do with the remainder?',
          `Start the algorithm: divide ${A} by ${B}.`,
          `Keep going until the remainder is ${d}.`,
          'Work backwards, writing ' + d + ' in terms of the earlier numbers.',
          `Substitute back until only ${A} and ${B} are left, and state $a$ and $b$.`,
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, line(first), rows.slice(1).map(line).join(', '), `$${back}$`, null],
      },
    };
  },
};

export const ROUTINES = {
  '2017 Q8': q2017q8,
  '2018 Q5': q2018q5,
  '2019 Q12': q2019q12,
  '2021 P2 Q2': q2021p2q2,
  '2022 P2 Q3': q2022p2q3,
  '2023 P2 Q6': q2023p2q6,
  '2023 P2 Q9': q2023p2q9,
  '2024 P2 Q2': q2024p2q2,
  '2025 P2 Q4': q2025p2q4,
  '2026 P2 Q4': q2026p2q4,
  '2026 P2 Q9': q2026p2q9,
};
