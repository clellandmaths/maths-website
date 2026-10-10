/**
 * Advanced Higher, Binomial Theorem: how each card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/binomial-theorem.ts` under the same label.
 */
import type { Built, CardRoutine } from '../types';
import { int, pick, until } from '../../core/draw';
import { joinTerms, num, power, sum } from '../../core/maths/format';
import { binom, coprime } from '../../core/maths/integer';
import { type Q, q, abs, mul, pow } from '../../core/maths/rational';

// ── 2026 P2 Q2 ─────────────────────────────────────────────────────────────
// (x^m - a/x)^4 written out and simplified, a whole (2 to 10) or 1/b (b 2 to 5)

interface P2Q2 {
  m: 2 | 3;
  /** a = top/bottom: a whole number over 1, or 1 over a whole number. */
  top: number; bottom: number;
}

/** The owner, on the sheet: "Let's go number 2 to 10 and fraction". */
const NUMBERS: readonly [number, number][] = [
  ...[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n): [number, number] => [n, 1]),
  ...[2, 3, 4, 5].map((b): [number, number] => [1, b]),
];

/** p over d times x^k, as a paper writes it: `\frac{5}{x}`, `\frac{1}{2x}`, `\frac{3x^{4}}{2x^{2}}`. */
const over = (top: string, d: bigint, k: number) => `\\frac{${top}}{${d === 1n ? '' : d}${power('x', k)}}`;

/** A coefficient before a body, 1 not written: `20x^{5}`, `x^{8}`. */
const times = (c: bigint, body: string) => (c === 1n && body ? body : `${c}${body}`);

const q2026p2q2: CardRoutine<P2Q2> = {
  draw: () => {
    const [top, bottom] = pick(NUMBERS);
    return { m: pick([2, 3] as const), top, bottom };
  },

  build: ({ m, top, bottom }): Built => {
    const a = q(top, bottom);
    const lead = power('x', m);
    const frac = over(String(a.n), a.d, 1);
    const bracketed = `\\left(${lead} - ${frac}\\right)^{4}`;
    const ks = [0, 1, 2, 3, 4];
    const firstPower = (k: number) => (k === 4 ? '' : k === 3 ? `(${lead})` : `(${lead})^{${4 - k}}`);
    /** 4 choose k times a^k: every term's size; its sign is the parity of k. */
    const coef = (k: number): Q => mul(q(binom(4, k)), pow(a, k));

    // 4 choose k, (x^m)^{4-k}, (-a/x)^k, as the scheme writes them.
    const binomial = ks.map(k => {
      const second = k === 0 ? '' : `\\left(-${frac}\\right)${k === 1 ? '' : `^{${k}}`}`;
      return `\\binom{4}{${k}}${firstPower(k)}${second}`;
    }).join(' + ');

    // The signs worked out, each power of a/x worked out.
    const signed = joinTerms(ks.map(k => {
      const ak = pow(a, k);
      const c = binom(4, k);
      const second = k === 0 ? '' : `\\left(${over(String(ak.n), ak.d, k)}\\right)`;
      const body = k === 4 ? over(String(ak.n), ak.d, 4) : `${c === 1 ? '' : c}${firstPower(k)}${second}`;
      return `${k % 2 ? '-' : ''}${body}`;
    }));

    // The coefficients multiplied out, the powers not yet combined.
    const coefficients = joinTerms(ks.map(k => {
      const c = coef(k);
      const topX = power('x', m * (4 - k));
      const body = k === 0 ? topX : over(times(c.n, topX), c.d, k);
      return `${k % 2 ? '-' : ''}${body}`;
    }));

    // Each term a number times one power of x: x^p, a constant, or a number over x^p.
    const simplified = joinTerms(ks.map(k => {
      const c = abs(coef(k));
      const p = m * (4 - k) - k;
      const body = p > 0
        ? (c.n === 1n && c.d === 1n ? power('x', p) : `${num(c)}${power('x', p)}`)
        : p === 0 ? num(c) : over(String(c.n), c.d, -p);
      return `${k % 2 ? '-' : ''}${body}`;
    }));

    return {
      questionLines: [
        'Write down the binomial expansion of',
        '',
        `$${bracketed}$`,
        '',
        'and simplify your answer.',
      ],
      solutionSteps: [
        `$${bracketed} = ${binomial}$`,
        `Resolving the signs: $${signed}$`,
        `Simplifying the coefficients: $${coefficients}$`,
        `Simplifying the powers of $x$: $${simplified}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `$${simplified}$`,
      ladder: {
        moves: [
          'Four factors of the same bracket: which row of Pascal\'s triangle gives the coefficients?',
          'Write out all five terms of the binomial expansion, each with its coefficient and its two powers.',
          'Work out each term\'s sign, and simplify the coefficients and the powers of $x$.',
          'Finish simplifying, so each term is a single number times a single power of $x$.',
        ],
        marks: [0, 1, 2, 1],
        shows: [null, `$${binomial}$`, `$${coefficients}$`, null],
        watch: { at: 1, text: `The second term inside is $-${frac}$. Keep its minus sign in every power, or the signs go wrong.` },
      },
    };
  },
};

// ── 2025 P1 Q1 ─────────────────────────────────────────────────────────────
// (1/x^p - bx)^4 written out and simplified, b whole (2 to 5) or 1/d (d 2 to 5)
// The coefficients line keeps each term over its power of x, as the scheme's
// working does: \frac{12x}{x^{3}}, and with a fraction \frac{3x^{2}}{8x^{2}}.

interface P1Q1 {
  p: 1 | 2;
  /** b = top/bottom: a whole number over 1, or 1 over a whole number. */
  top: number; bottom: number;
}

/** 2 to 5 as the paper's 3, or a unit fraction 1/2 to 1/5: Paper 1 sizes. */
const P1Q1_NUMBERS: readonly [number, number][] = [
  ...[2, 3, 4, 5].map((n): [number, number] => [n, 1]),
  ...[2, 3, 4, 5].map((d): [number, number] => [1, d]),
];

/** A positive rational times x^k as a paper writes it: `3x`, `\frac{1}{2}x`, `\frac{27}{8}x^{3}`. */
const xTerm = (c: Q, k: number) => (c.d === 1n ? times(c.n, power('x', k)) : `${num(c)}${power('x', k)}`);

const q2025p1q1: CardRoutine<P1Q1> = {
  draw: () => {
    const [top, bottom] = pick(P1Q1_NUMBERS);
    return { p: pick([1, 2] as const), top, bottom };
  },

  build: ({ p, top, bottom }): Built => {
    const b = q(top, bottom);
    const first = over('1', 1n, p);
    const second = xTerm(b, 1);
    const bracketed = `\\left(${first} - ${second}\\right)^{4}`;
    const ks = [0, 1, 2, 3, 4];
    /** The first term to the power 4 - k, as the scheme writes it. */
    const firstPower = (k: number) => (k === 4 ? '' : `\\left(${first}\\right)${k === 3 ? '' : `^{${4 - k}}`}`);
    /** 4 choose k times b^k: every term's size; its sign is the parity of k. */
    const coef = (k: number): Q => mul(q(binom(4, k)), pow(b, k));
    /** The power of x the first term brings to term k, below the line. */
    const down = (k: number) => p * (4 - k);

    // 4 choose k, (1/x^p)^{4-k}, (-bx)^k, as the scheme writes them.
    const binomial = ks.map(k => {
      const minus = k === 0 ? '' : `\\left(-${second}\\right)${k === 1 ? '' : `^{${k}}`}`;
      return `\\binom{4}{${k}}${firstPower(k)}${minus}`;
    }).join(' + ');

    // The signs worked out, each power of the two terms worked out.
    const signed = joinTerms(ks.map(k => {
      const lead = `\\left(${over('1', 1n, down(k))}\\right)`;
      const tail = `\\left(${xTerm(pow(b, k), k)}\\right)`;
      const body = k === 0 ? over('1', 1n, down(0)) : k === 4 ? xTerm(pow(b, 4), 4) : `${binom(4, k)}${lead}${tail}`;
      return `${k % 2 ? '-' : ''}${body}`;
    }));

    // The coefficients multiplied out, the powers not yet combined.
    const coefficients = joinTerms(ks.map(k => {
      const c = coef(k);
      const body = k === 0 ? over('1', 1n, down(0)) : k === 4 ? xTerm(c, 4) : over(times(c.n, power('x', k)), c.d, down(k));
      return `${k % 2 ? '-' : ''}${body}`;
    }));

    // Each term a number times one power of x: x^e, a constant, or a number over x^e.
    const simplified = joinTerms(ks.map(k => {
      const c = coef(k);
      const e = k - down(k);
      const body = e > 0 ? xTerm(c, e) : e === 0 ? num(c) : over(String(c.n), c.d, -e);
      return `${k % 2 ? '-' : ''}${body}`;
    }));

    return {
      questionLines: [
        `Use the binomial theorem to expand $${bracketed}.$`,
        'Simplify your answer.',
      ],
      solutionSteps: [
        `$${bracketed} = ${binomial}$`,
        `Resolving the signs: $${signed}$`,
        `Simplifying the coefficients: $${coefficients}$`,
        `Simplifying the powers of $x$: $${simplified}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `$${simplified}$`,
      ladder: {
        moves: [
          'A bracket to the fourth power: which row of Pascal\'s triangle gives the coefficients?',
          'Write out all five terms of the binomial expansion, each with its coefficient and its two powers.',
          'Work out each term\'s sign, and simplify the coefficients and the powers of $x$.',
          'Finish simplifying, so each term is a single number times a single power of $x$.',
        ],
        marks: [0, 1, 2, 1],
        shows: [null, `$${binomial}$`, `$${coefficients}$`, null],
        watch: { at: 1, text: `The second term inside is $-${second}$. Keep its minus sign in every power, or the signs go wrong.` },
      },
    };
  },
};

// ── 2024 P2 Q5 ─────────────────────────────────────────────────────────────
// (a) the general term of (a x^p - 1/x^q)^n, simplified; (b) the coefficient of 1/x^N

interface P2Q5of2024 { n: number; a: number; p: number; q: number; r: number }

/** The powers of x in the two terms, never equal: the paper's (2, 3). */
const POWERS: readonly [number, number][] = [[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2]];

/** The r whose term is a negative power of x, short of the last term (a^0), as the paper's r = 10 of 16. */
const negativeTerms = (n: number, p: number, s: number) =>
  Array.from({ length: n }, (_, r) => r).filter(r => (p + s) * r - p * n >= 1);

const q2024p2q5: CardRoutine<P2Q5of2024> = {
  draw: () => until(
    () => {
      const [p, qq] = pick(POWERS);
      const n = int(8, 16);
      return { n, a: pick([2, 3]), p, q: qq, r: pick(negativeTerms(n, p, qq)) };
    },
    // The coefficient a calculator shows whole, as the paper's 512512.
    ({ n, a, r }) => binom(n, r) * a ** (n - r) <= 1e8,
  ),

  build: ({ n, a, p, q: qq, r }): Built => {
    const bracket = `\\left(${a}${power('x', p)} - \\frac{1}{${power('x', qq)}}\\right)^{${n}}`;
    const N = (p + qq) * r - p * n;
    const target = `\\frac{1}{${power('x', N)}}`;
    const C = `\\binom{${n}}{r}`;
    const written = `${C}(${a}${power('x', p)})^{${n}-r}\\left(-\\frac{1}{${power('x', qq)}}\\right)^{r}`;
    const xPart = `x^{${p * n}-${p + qq}r}`;
    const numbers = `${a}^{${n}-r}(-1)^{r}`;
    const general = `${C}(-1)^{r}${a}^{${n}-r}${xPart}`;
    const value = binom(n, r) * a ** (n - r) * (r % 2 ? -1 : 1);
    const solve = `${p * n} - ${p + qq}r = -${N}`;
    const evaluate = `\\binom{${n}}{${r}}(-1)^{${r}}${n - r === 1 ? a : `${a}^{${n - r}}`} = ${value}`;
    return {
      questionLines: [
        `<b>(a)</b> State and simplify the general term in the binomial expansion of $${bracket}.$`,
        `<b>(b)</b> Hence, or otherwise, find the coefficient of $${target}$ in the expansion of $${bracket}.$`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> The general term is $${written}$`,
        `<strong>(a)</strong> The powers of $x$: $${p === 1 ? 'x' : `(x^{${p}})`}^{${n}-r}(x^{-${qq}})^{r} = ${xPart}$`,
        `<strong>(a)</strong> With the numbers and signs, $${numbers}$: $${general}$`,
        `<strong>(b)</strong> $${solve}$, so $r = ${r}$`,
        `<strong>(b)</strong> $${evaluate}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `(a) $${general}$<br>(b) $${value}$`,
      ladder: {
        moves: [
          'The general term of $(a + b)^n$ has three parts. What are they, and what powers do $a$ and $b$ carry?',
          `(a) Write the general term, with $${C}$ and both powers.`,
          '(a) Collect the powers of $x$ into a single power.',
          '(a) Collect the numbers and the signs, and write the simplified general term.',
          '(b) Set the power of $x$ equal to the power you want, and solve for $r$.',
          '(b) Put that $r$ back to evaluate the coefficient.',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [null, `$${written}$`, `$${xPart}$ or $${numbers}$`, `$${general}$`, null, null],
        watch: { at: 1, text: `Include $${C}$ in the general term. Leaving it out loses the first mark.` },
      },
    };
  },
};

// ── 2023 P2 Q5 ─────────────────────────────────────────────────────────────
// (a) the general term of (a x - b/x²)ⁿ, simplified; (b) the coefficient of x^{-N}

interface P2Q5of2023 { n: number; a: number; b: number; r: number }

const q2023p2q5: CardRoutine<P2Q5of2023> = {
  draw: () => until(
    () => {
      const n = int(6, 10);
      // The terms with a negative power of x, short of the last (x^{-2n}), as the paper's r = 3 of 8.
      const rs = Array.from({ length: n - 1 }, (_, i) => i + 1).filter(r => n - 3 * r <= -1);
      return { n, a: int(2, 5), b: int(2, 5), r: pick(rs) };
    },
    // A coefficient a calculator shows whole, as the paper's -108864.
    ({ n, a, b, r }) => binom(n, r) * a ** (n - r) * b ** r <= 1e7,
  ),

  build: ({ n, a, b, r }): Built => {
    const bracket = `\\left(${a}x - \\frac{${b}}{x^{2}}\\right)^{${n}}`;
    const N = 3 * r - n;
    const target = `x^{-${N}}`;
    const C = `\\binom{${n}}{r}`;
    const written = `${C}(${a}x)^{${n}-r}\\left(\\frac{-${b}}{x^{2}}\\right)^{r}`;
    const numbers = `${a}^{${n}-r}(-${b})^{r}`;
    const xPart = `x^{${n}-3r}`;
    const general = `${C}${numbers}${xPart}`;
    const value = binom(n, r) * a ** (n - r) * (-b) ** r;
    const evaluate = `\\binom{${n}}{${r}}${n - r === 1 ? a : `${a}^{${n - r}}`}(-${b})^{${r}} = ${value}`;
    return {
      questionLines: [
        `<b>(a)</b> Write down and simplify the general term in the binomial expansion of $${bracket}.$`,
        `<b>(b)</b> Hence, or otherwise, determine the coefficient of $${target}.$`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> The general term is $${written}$`,
        `<strong>(a)</strong> The numbers: $${numbers}$; the powers of $x$: $x^{${n}-r}(x^{-2})^{r} = ${xPart}$`,
        `<strong>(a)</strong> $${general}$`,
        `<strong>(b)</strong> $${n} - 3r = -${N}$, so $r = ${r}$`,
        `<strong>(b)</strong> $${evaluate}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `(a) $${general}$<br>(b) $${value}$`,
      ladder: {
        moves: [
          'The general term of $(a + b)^n$ has three parts. What are they, and what powers do $a$ and $b$ carry?',
          `(a) Write the general term, with $${C}$ and both powers.`,
          '(a) Collect the numbers, or the powers of $x$.',
          '(a) Write the fully simplified general term.',
          `(b) Set the power of $x$ equal to $-${N}$ and solve for $r$.`,
          '(b) Put that $r$ back to evaluate the coefficient.',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [null, `$${written}$`, `$${numbers}$ or $${xPart}$`, `$${general}$`, null, null],
        watch: { at: 3, text: `Do not simplify further than is right: $${numbers}$ is not $(-${a * b})^{${n}}$.` },
      },
    };
  },
};

// ── 2021 P2 Q7 ─────────────────────────────────────────────────────────────
// z = a + ki: (a) z³ = a³ - 3k²a + (3ka² - k³)i by the binomial expansion;
// (b) z³ + mz = b + Di, the imaginary parts give a (positive), the real b.
// Built from a, so a² comes out whole.

interface P2Q7of2021 { a: number; k: number; m: number }

const q2021p2q7: CardRoutine<P2Q7of2021> = {
  // k from 1 to 5 on the owner's yes (variation-depth sheet, card 12, 2026-10-05; 1 to 3
  // before): (a) is (a + ki)³ with a a letter, so k is all that changes it.
  draw: () => until(
    () => ({ a: int(2, 6), k: int(1, 5), m: int(1, 5) }),
    // The real part b not 0, as 80; the imaginary part D positive, as 148, since the
    // question prints b + Di (k = 5 with a = 2 would make it negative).
    ({ a, k, m }) => a ** 3 - 3 * k * k * a + m * a !== 0 && 3 * k * a * a - k ** 3 + m * k > 0,
  ),

  build: ({ a, k, m }): Built => {
    const ki = k === 1 ? 'i' : `${k}i`;
    const lead = (n: number) => (n === 1 ? '' : String(n));
    const expanded = `a^{3} - ${3 * k * k}a + (${3 * k}a^{2} - ${k ** 3})i`;
    const D = 3 * k * a * a - k ** 3 + m * k;
    const B = a ** 3 - 3 * k * k * a + m * a;
    const realB = sum([{ coef: 1, body: 'a^{3}' }, { coef: m - 3 * k * k, body: 'a' }]);
    const imagEq = `${sum([{ coef: 3 * k, body: 'a^{2}' }, { coef: m * k - k ** 3, body: '' }])} = ${D}`;
    const binomialLine = `\\binom{3}{0}a^{3} + \\binom{3}{1}a^{2}(${ki}) + \\binom{3}{2}a(${ki})^{2} + \\binom{3}{3}(${ki})^{3}`;
    const powers = `a^{3} + ${3 * k}a^{2}i + ${3 * k * k}ai^{2} + ${lead(k ** 3)}i^{3}`;
    const z = `a + ${ki}`;
    const plus = `${lead(m)}z`;
    const substituted = `${expanded} + ${lead(m)}a + ${lead(m * k)}i = b + ${D}i`;
    return {
      questionLines: [
        `A complex number is defined by $z = ${z}$ where $a$ is a positive real number.`,
        '<b>(a)</b> State and simplify the binomial expansion of $z^{3}.$',
        `<b>(b)</b> Given that $z^{3} + ${plus} = b + ${D}i$ where $b$ is a real number, find the values of $a$ and $b.$`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> $z^{3} = ${binomialLine}$`,
        `<strong>(a)</strong> $z^{3} = ${powers}$`,
        `<strong>(a)</strong> $z^{3} = ${expanded}$`,
        `<strong>(b)</strong> $${substituted}$`,
        `<strong>(b)</strong> Equating imaginary parts, $${imagEq}$; equating real parts, $${realB} = b$`,
        `<strong>(b)</strong> $a^{2} = ${a * a}$ and $a$ is positive, so $a = ${a}$ and $b = ${B}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1],
      finalAnswer: `(a) $z^{3} = ${expanded}$<br>(b) $a = ${a},\\ b = ${B}$`,
      ladder: {
        moves: [
          'A bracket to the power 3: which row of Pascal\'s triangle gives the coefficients?',
          `(a) Write the binomial expansion of $(${z})^3$.`,
          k === 1 ? '(a) Work out the coefficients.' : `(a) Work out the coefficients and the powers of ${k}.`,
          '(a) Use $i^2 = -1$ and $i^3 = -i$, and group the real and imaginary parts.',
          `(b) Add $${plus}$ to your expansion and set it equal to $b + ${D}i$.`,
          '(b) Set the real parts equal, and the imaginary parts equal.',
          '(b) Solve for $a$, keeping the positive value, then find $b$.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1],
        shows: [null, `$${binomialLine}$`, `$${powers}$`, null, `$${substituted}$`, `$${imagEq}$ and $${realB} = b$`, null],
        watch: { at: 6, text: '$a$ is positive, so reject the negative root.' },
      },
    };
  },
};

// ── 2019 Q9 ────────────────────────────────────────────────────────────────
// (a) the general term of (a x^p - d/x^q)^n with d unknown, simplified;
// (b) the coefficient of 1/x^N given, so r, then d. r = 3, the paper's: a
// cube root, and (-d)^3 has one real d.

interface Q9of2019 { n: number; a: number; p: number; q: number; r: number; d: number }

/** A whole number as a paper prints it: `-70\ 000`, a space every three digits from 10 000. */
const spaced = (v: number) => {
  const s = String(Math.abs(v));
  const body = Math.abs(v) >= 10000 ? s.replace(/\B(?=(\d{3})+$)/g, '\\ ') : s;
  return `${v < 0 ? '-' : ''}${body}`;
};

const q2019q9: CardRoutine<Q9of2019> = {
  draw: () => until(
    () => {
      const [p, qq] = pick(POWERS);
      return { n: int(5, 9), a: pick([2, 3]), p, q: qq, r: 3, d: int(2, 6) };
    },
    // The term a negative power of x, 1/x to 1/x^4, as the paper's 1/x; the
    // coefficient within a million, as -70 000.
    ({ n, a, p, q: qq, r, d }) => {
      const N = (p + qq) * r - p * n;
      return N >= 1 && N <= 4 && binom(n, r) * a ** (n - r) * d ** r <= 1e6;
    },
  ),

  build: ({ n, a, p, q: qq, r, d }): Built => {
    const bracket = `\\left(${a}${power('x', p)} - \\frac{d}{${power('x', qq)}}\\right)^{${n}}`;
    const N = (p + qq) * r - p * n;
    const target = `\\frac{1}{${power('x', N)}}`;
    const C = `\\binom{${n}}{r}`;
    const written = `${C}(${a}${power('x', p)})^{${n}-r}\\left(\\frac{-d}{${power('x', qq)}}\\right)^{r}`;
    const xPart = `x^{${p * n}-${p + qq}r}`;
    const numbers = `${a}^{${n}-r}(-d)^{r}`;
    const general = `${C}${numbers}${xPart}`;
    const k = binom(n, r) * a ** (n - r);
    const value = -k * d ** r;
    const at = `\\binom{${n}}{${r}}${n - r === 1 ? a : `${a}^{${n - r}}`}(-d)^{${r}}`;
    return {
      questionLines: [
        '<b>(a)</b> Write down and simplify the general term in the binomial expansion of',
        '',
        `$${bracket}$,`,
        '',
        'where $d$ is a constant.',
        `<b>(b)</b> Given that the coefficient of $${target}$ is $${spaced(value)}$, find the value of $d.$`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> The general term is $${written}$`,
        `<strong>(a)</strong> The powers of $x$: $${xPart}$; the numbers and signs: $${numbers}$`,
        `<strong>(a)</strong> $${general}$`,
        `<strong>(b)</strong> $${p * n} - ${p + qq}r = -${N}$, so $r = ${r}$`,
        `<strong>(b)</strong> $${at} = -${spaced(k)}d^{${r}} = ${spaced(value)}$, so $d^{${r}} = ${spaced(d ** r)}$ and $d = ${d}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `(a) $${general}$<br>(b) $d = ${d}$`,
      ladder: {
        moves: [
          'The general term of $(a + b)^n$ has three parts. What are they, and what powers do $a$ and $b$ carry?',
          `(a) Write the general term, with $${C}$ and both powers.`,
          '(a) Collect the powers of $x$ into a single power, or the numbers and signs.',
          '(a) Write the fully simplified general term.',
          `(b) Set the power of $x$ equal to $-${N}$ and solve for $r$.`,
          `(b) Put that $r$ back, set the coefficient equal to $${spaced(value)}$, and solve for $d$.`,
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [null, `$${written}$`, `$${xPart}$ or $${numbers}$`, `$${general}$`, null, null],
        watch: { at: 1, text: 'Keep the minus sign with $d$ in every power.' },
      },
    };
  },
};

// ── 2018 Q3 ────────────────────────────────────────────────────────────────
// (ax + b/x²)^n: the general term C(n, r) a^{n-r} b^r x^{n-3r}, and the term
// independent of x at r = n/3.

interface Q3of2018 { n: 6 | 9; a: number; b: number }

/**
 * n is 6 or 9 (the paper's), so n/3 is whole; a from 2 to 4 (the paper's 2)
 * and b from 2 to 9 (the paper's 5), the term independent of x at most a
 * million (the paper's 672000).
 */
const Q3_SETS2018: readonly Q3of2018[] = (() => {
  const out: Q3of2018[] = [];
  for (const n of [6, 9] as const) {
    const r = n / 3;
    for (let a = 2; a <= 4; a++) {
      for (let b = 2; b <= 9; b++) if (binom(n, r) * a ** (n - r) * b ** r <= 1e6) out.push({ n, a, b });
    }
  }
  return out;
})();

const q2018q3: CardRoutine<Q3of2018> = {
  draw: () => pick(Q3_SETS2018),

  build: ({ n, a, b }): Built => {
    const r = n / 3;
    const expression = `\\left(${a}x + \\frac{${b}}{x^{2}}\\right)^{${n}}`;
    const written = `\\binom{${n}}{r}(${a}x)^{${n}-r}\\left(\\frac{${b}}{x^{2}}\\right)^{r}`;
    const numbers = `${a}^{${n}-r}${b}^{r}`;
    const xPart = `x^{${n}-3r}`;
    const general = `\\binom{${n}}{r}${numbers}${xPart}`;
    const C = binom(n, r), value = C * a ** (n - r) * b ** r;
    return {
      questionLines: [
        `<b>(a)</b> Write down and simplify the general term in the binomial expansion of $${expression}.$`,
        '<b>(b)</b> Hence, or otherwise, find the term independent of $x.$',
      ],
      solutionSteps: [
        `<strong>(a)</strong> $${written}$`,
        `<strong>(a)</strong> The numbers give $${numbers}$ and the powers of $x$ give $x^{${n}-r}x^{-2r} = ${xPart}$`,
        `<strong>(a)</strong> $${general}$`,
        `<strong>(b)</strong> Independent of $x$: $${n} - 3r = 0$, so $r = ${r}$`,
        `<strong>(b)</strong> $\\binom{${n}}{${r}}${a}^{${n - r}}${b}^{${r}} = ${C} \\times ${a ** (n - r)} \\times ${b ** r} = ${value}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: [`(a) $${general}$`, `(b) $${value}$`].join('<br>'),
      ladder: {
        moves: [
          'The general term of $(a + b)^n$ has three parts. What are they, and what powers do $a$ and $b$ carry?',
          `(a) Write the general term, with $\\binom{${n}}{r}$ and both powers.`,
          '(a) Collect the numbers, or the powers of $x$.',
          '(a) Write the fully simplified general term.',
          '(b) "Independent of $x$" means $x$ to the power 0. Solve for $r$.',
          '(b) Put that $r$ back to evaluate the term.',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [null, `$${written}$`, `$${numbers}$ or $${xPart}$`, `$${general}$`, null, null],
        watch: { at: 4, text: 'Independent of $x$ means the power of $x$ is 0. Do not put $x = 0$.' },
      },
    };
  },
};

// ── 2017 Q1 ────────────────────────────────────────────────────────────────
// (a/y² - by)³ written out and simplified: a³/y⁶ - 3a²b/y³ + 3ab² - b³y³.
// The coefficients line keeps each term over its power of y, as 2025 P1 Q1's.

interface Q1of2017 { a: number; b: number }

/** A coefficient before a body, 1 not written: `125y^{3}`, `y^{3}`. */
const lead2017 = (c: number, body: string) => (c === 1 ? body : `${c}${body}`);

const q2017q1: CardRoutine<Q1of2017> = {
  // a from 1 to 5 (the paper's 2) and b from 1 to 6 (the paper's 5), not both
  // 1, and sharing no factor, as 2 and 5: a paper never prints 2/y² - 4y.
  draw: () => until(() => ({ a: int(1, 5), b: int(1, 6) }), ({ a, b }) => a + b > 2 && coprime(a, b)),

  build: ({ a, b }): Built => {
    const first = `\\frac{${a}}{y^{2}}`;
    const second = lead2017(b, 'y');
    const bracketed = `\\left(${first} - ${second}\\right)^{3}`;
    const ks = [0, 1, 2, 3];
    const firstPower = (k: number) => (k === 3 ? '' : `\\left(${first}\\right)${k === 2 ? '' : `^{${3 - k}}`}`);
    const secondPower = (k: number) => (k === 0 ? '' : `(-${second})${k === 1 ? '' : `^{${k}}`}`);
    const binomial = ks.map(k => `\\binom{3}{${k}}${firstPower(k)}${secondPower(k)}`).join(' + ');
    const signed = joinTerms([
      `\\frac{${a ** 3}}{y^{6}}`,
      `-3\\left(\\frac{${a * a}}{y^{4}}\\right)(${second})`,
      `3\\left(${first}\\right)(${lead2017(b * b, 'y^{2}')})`,
      `-${lead2017(b ** 3, 'y^{3}')}`,
    ]);
    const coefficients = joinTerms([
      `\\frac{${a ** 3}}{y^{6}}`,
      `-\\frac{${3 * a * a * b}y}{y^{4}}`,
      `\\frac{${3 * a * b * b}y^{2}}{y^{2}}`,
      `-${lead2017(b ** 3, 'y^{3}')}`,
    ]);
    const simplified = joinTerms([
      `\\frac{${a ** 3}}{y^{6}}`,
      `-\\frac{${3 * a * a * b}}{y^{3}}`,
      `${3 * a * b * b}`,
      `-${lead2017(b ** 3, 'y^{3}')}`,
    ]);
    return {
      questionLines: [`Write down the binomial expansion of $${bracketed}$ and simplify your answer.`],
      solutionSteps: [
        `$${bracketed} = ${binomial}$`,
        `Resolving the signs: $${signed}$`,
        `Simplifying the coefficients: $${coefficients}$`,
        `Simplifying the powers of $y$: $${simplified}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `$${simplified}$`,
      ladder: {
        moves: [
          'A bracket to the power 3: which row of Pascal\'s triangle gives the coefficients?',
          'Write out all four terms of the binomial expansion, each with its coefficient and its two powers.',
          'Work out each term\'s sign, and simplify the coefficients and the powers of $y$.',
          'Finish simplifying, so each term is a single number times a single power of $y$.',
        ],
        marks: [0, 1, 2, 1],
        shows: [null, `$${binomial}$`, `$${coefficients}$`, null],
        watch: { at: 3, text: 'Write the constant term as a number: leave no $y^0$ in the answer.' },
      },
    };
  },
};

export const ROUTINES = {
  '2017 Q1': q2017q1,
  '2018 Q3': q2018q3,
  '2019 Q9': q2019q9,
  '2021 P2 Q7': q2021p2q7,
  '2023 P2 Q5': q2023p2q5,
  '2024 P2 Q5': q2024p2q5,
  '2025 P1 Q1': q2025p1q1,
  '2026 P2 Q2': q2026p2q2,
};
