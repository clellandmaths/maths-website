/**
 * Advanced Higher, Maclaurin Series: how each card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/maclaurin-series.ts` under the same label.
 */
import type { Built, CardRoutine } from '../types';
import { int, pick, until } from '../../core/draw';
import { gcd } from '../../core/maths/integer';
import { num, piTimes, series, sum } from '../../core/maths/format';
import { type Q, q, add, div, mul, neg, pow, ZERO } from '../../core/maths/rational';
import { expSeries, log1pSeries, mulSeries } from '../../core/maths/series';

// ── 2026 P2 Q3 ─────────────────────────────────────────────────────────────
// (a) e^{kx} and ln(1 + x) to x^3; (b) hence e^{kx} ln(1/(1 + x))

interface P2Q3 { k: number }

/** ln(1 + x), its three derivatives and their values at 0: the same on every draw. */
const LOG_DERIVATIVES = [
  '$f(x) = \\ln(1 + x)$, $f(0) = 0$',
  '$f\'(x) = \\frac{1}{1 + x}$, $f\'(0) = 1$',
  '$f\'\'(x) = -\\frac{1}{(1 + x)^{2}}$, $f\'\'(0) = -1$',
  '$f\'\'\'(x) = \\frac{2}{(1 + x)^{3}}$, $f\'\'\'(0) = 2$',
].join('; ');

const RECIPROCAL = '\\ln\\left(\\frac{1}{1 + x}\\right)';

const q2026p2q3: CardRoutine<P2Q3> = {
  // The owner, on the sheet: negative k "is fine", and "can't we just make
  // numbers bigger" (k to ±12: "Yes").
  draw: () => ({ k: pick([-12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) }),

  build: ({ k }): Built => {
    const e = `e^{${sum([{ coef: k, body: 'x' }])}}`;
    const primes = ['', '\'', '\'\'', '\'\'\''];
    const expDerivatives = primes.map((p, i) =>
      `$f${p}(x) = ${sum([{ coef: k ** i, body: e }])}$, $f${p}(0) = ${k ** i}$`).join('; ');
    const expTerms = expSeries(k, 3);
    const logTerms = log1pSeries(3);
    const minusLog = logTerms.map(neg);
    const expText = series(expTerms);
    const logText = series(logTerms);
    const product = `\\left(${expText}\\right)\\left(${series(minusLog)}\\right)`;
    const answer = series(mulSeries(expTerms, minusLog, 3));

    return {
      questionLines: [
        '<b>(a)</b> Find and simplify the Maclaurin expansion, up to and including the term in $x^{3}$, for:',
        `(i) $${e}$`,
        '(ii) $\\ln(1 + x).$',
        `<b>(b)</b> Hence find and simplify the Maclaurin expansion, up to and including the term in $x^{3}$, for $${e}${RECIPROCAL}.$`,
      ],
      solutionSteps: [
        `<strong>(a)(i)</strong> ${expDerivatives}`,
        `<strong>(a)(i)</strong> $${e} = ${expText}$`,
        `<strong>(a)(ii)</strong> ${LOG_DERIVATIVES}`,
        `<strong>(a)(ii)</strong> $\\ln(1 + x) = ${logText}$`,
        `<strong>(b)</strong> $${RECIPROCAL} = -\\ln(1 + x)$, so $${e}${RECIPROCAL} = ${product}$`,
        `<strong>(b)</strong> $${e}${RECIPROCAL} = ${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1],
      finalAnswer: `(a)(i) $${e} = ${expText}$<br>(a)(ii) $\\ln(1 + x) = ${logText}$<br>(b) $${e}${RECIPROCAL} = ${answer}$`,
      ladder: {
        moves: [
          'A Maclaurin series needs the function and its derivatives at one particular value of $x$. Which value?',
          `(a)(i) Differentiate $${e}$ three times, and evaluate it and each derivative at $x = 0$.`,
          '(a)(i) Put those values into the Maclaurin formula and simplify.',
          '(a)(ii) Do the same for $\\ln(1 + x)$: three derivatives, and four values at $x = 0$.',
          '(a)(ii) Substitute and simplify.',
          `(b) Use a log law to write $${RECIPROCAL}$ in terms of $\\ln(1 + x)$, then write the product of the two series.`,
          '(b) Multiply out, keeping only the terms up to $x^{3}$.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1],
        shows: [null, expDerivatives, `$${expText}$`, LOG_DERIVATIVES, `$${logText}$`, `$${product}$`, null],
        watch: { at: 5, text: `$${RECIPROCAL}$ is minus $\\ln(1 + x)$. Use that rather than starting a third series.` },
      },
    };
  },
};

// ── 2025 P2 Q6 ─────────────────────────────────────────────────────────────
// (a) cos kx to x^4 from its derivatives; (b) hence cos² kx, the square kept to x^4

interface P2Q6 { top: number; bottom: number }

/** k whole from 2 to 12 (the paper's 3), or a unit fraction ½ to ⅕. */
const P2Q6_K: readonly [number, number][] = [
  ...[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n): [number, number] => [n, 1]),
  ...[2, 3, 4, 5].map((d): [number, number] => [1, d]),
];

const q2025p2q6: CardRoutine<P2Q6> = {
  draw: () => {
    const [top, bottom] = pick(P2Q6_K);
    return { top, bottom };
  },

  build: ({ top, bottom }): Built => {
    const k = q(top, bottom);
    const arg = `${num(k)}x`;
    const fn = `\\cos ${arg}`;
    // The derivatives cycle cos, -sin, -cos, sin, cos, each with a power of k.
    const kinds = ['\\cos', '-\\sin', '-\\cos', '\\sin', '\\cos'];
    const derivs = kinds.map((f, i) => {
      const c: Q = pow(k, i);
      const minus = f.startsWith('-');
      return sum([{ coef: minus ? neg(c) : c, body: `${minus ? f.slice(1) : f} ${arg}` }]);
    });
    const at0 = kinds.map((f, i) => (f.endsWith('\\sin') ? ZERO : f.startsWith('-') ? neg(pow(k, i)) : pow(k, i)));
    const names = ['f(x)', "f'(x)", "f''(x)", "f'''(x)", 'f^{iv}(x)'];
    const names0 = ['f(0)', "f'(0)", "f''(0)", "f'''(0)", 'f^{iv}(0)'];
    const evaluations = derivs.map((d, i) => `$${names[i]} = ${d}$, $${names0[i]} = ${num(at0[i])}$`).join('; ');
    const factorials = [1, 1, 2, 6, 24];
    const cosSeries = at0.map((v, i) => div(v, q(factorials[i])));
    const squared = mulSeries(cosSeries, cosSeries, 4);
    const a = series(cosSeries);
    const b = series(squared);
    const product = `\\left(${a}\\right)\\left(${a}\\right)`;
    return {
      questionLines: [
        `<b>(a)</b> Find and simplify the Maclaurin expansion, up to and including the term in $x^{4}$, for $${fn}.$`,
        `<b>(b)</b> Hence find and simplify the Maclaurin expansion, up to and including the term in $x^{4}$, for $\\cos^{2} ${arg}.$`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> ${evaluations}`,
        `<strong>(a)</strong> $${fn} = ${a} + \\ldots$`,
        `<strong>(b)</strong> $\\cos^{2} ${arg} = ${product}$`,
        `<strong>(b)</strong> Keeping the terms up to $x^{4}$: $\\cos^{2} ${arg} = ${b} + \\ldots$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `(a) $${a}$<br>(b) $${b}$`,
      ladder: {
        moves: [
          'A Maclaurin series needs the function and its derivatives at one particular value of $x$. Which value?',
          `(a) Differentiate $${fn}$ four times, and evaluate it and each derivative at $x = 0$.`,
          '(a) Put those values into the Maclaurin formula and simplify.',
          `(b) $\\cos^{2} ${arg}$ is $${fn}$ times itself: write the product of two copies of your series.`,
          '(b) Multiply out, keeping only the terms up to $x^{4}$.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, evaluations, `$${a}$`, `$${product}$`, null],
        watch: { at: 3, text: `Use the series from (a). Writing $(${fn})^{2}$ and stopping does not earn the product mark.` },
      },
    };
  },
};

// ── 2024 P2 Q7 ─────────────────────────────────────────────────────────────
// (a) e^{ax} and sin bx to x^3; (b) hence e^{a sin bx}, a composition

interface P2Q7of2024 { a: number; b: number }

const q2024p2q7: CardRoutine<P2Q7of2024> = {
  draw: () => ({ a: pick([-5, -4, -3, -2, 2, 3, 4, 5]), b: pick([2, 3, 4, 5]) }),

  build: ({ a, b }): Built => {
    const e = `e^{${sum([{ coef: a, body: 'x' }])}}`;
    const s = `\\sin ${b}x`;
    const composed = `e^{${sum([{ coef: a, body: s }])}}`;
    const primes = ['', '\'', '\'\'', '\'\'\''];
    const expDerivatives = primes.map((p, i) =>
      `$f${p}(x) = ${sum([{ coef: a ** i, body: e }])}$, $f${p}(0) = ${a ** i}$`).join('; ');
    // sin, cos, -sin, -cos, each with a power of b; at 0 only the cosines are left.
    const kinds: [string, number][] = [['\\sin', 1], ['\\cos', 1], ['\\sin', -1], ['\\cos', -1]];
    const sinDerivatives = kinds.map(([f, sg], i) =>
      `$g${primes[i]}(x) = ${sum([{ coef: sg * b ** i, body: `${f} ${b}x` }])}$, $g${primes[i]}(0) = ${f === '\\cos' ? sg * b ** i : 0}$`).join('; ');
    const expTerms = expSeries(a, 3);
    const sinTerms: Q[] = [ZERO, q(b), ZERO, q(-(b ** 3), 6)];
    const expText = series(expTerms);
    const sinText = series(sinTerms);
    // e^{au} = 1 + au + (au)^2/2 + (au)^3/6 with u the sine's series: the paper's own set-up.
    const inner = `\\left(${sinText}\\right)`;
    const setUp = sum(expTerms.map((c, i) => ({ coef: c, body: i === 0 ? '' : i === 1 ? inner : `${inner}^{${i}}` })));
    let power: Q[] = [q(1), ZERO, ZERO, ZERO];
    let answer: Q[] = [ZERO, ZERO, ZERO, ZERO];
    expTerms.forEach((c, i) => {
      if (i > 0) power = mulSeries(power, sinTerms, 3);
      answer = answer.map((v, j) => add(v, mul(c, power[j])));
    });
    const answerText = series(answer);
    return {
      questionLines: [
        '<b>(a)</b> Find and simplify the Maclaurin expansion, up to and including the term in $x^{3}$, for:',
        `(i) $${e}$`,
        `(ii) $${s}$`,
        `<b>(b)</b> Hence find the Maclaurin expansion for $${composed}$ up to and including the term in $x^{3}.$`,
      ],
      solutionSteps: [
        `<strong>(a)(i)</strong> ${expDerivatives}`,
        `<strong>(a)(i)</strong> $${e} = ${expText}$`,
        `<strong>(a)(ii)</strong> ${sinDerivatives}`,
        `<strong>(a)(ii)</strong> $${s} = ${sinText}$`,
        `<strong>(b)</strong> In the series for $${e}$, $x$ becomes $${s}$: $${composed} = ${setUp}$`,
        `<strong>(b)</strong> Keeping the terms up to $x^{3}$: $${composed} = ${answerText}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1],
      finalAnswer: `(a)(i) $${e} = ${expText}$<br>(a)(ii) $${s} = ${sinText}$<br>(b) $${composed} = ${answerText}$`,
      ladder: {
        moves: [
          'A Maclaurin series needs the function and its derivatives at one particular value of $x$. Which value?',
          `(a)(i) Differentiate $${e}$ three times, and evaluate it and each derivative at $x = 0$.`,
          '(a)(i) Put those values into the Maclaurin formula and simplify.',
          `(a)(ii) Do the same for $${s}$.`,
          '(a)(ii) Substitute and simplify.',
          `(b) In the series for $${e}$, the $x$ becomes $${s}$. Replace it with the series for $${s}$.`,
          '(b) Expand, keeping only terms up to $x^{3}$.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1],
        shows: [null, expDerivatives, `$${expText}$`, sinDerivatives, `$${sinText}$`, `$${setUp}$`, null],
        watch: { at: 5, text: 'This is a composition, not a product. Multiplying the two series earns nothing in (b).' },
      },
    };
  },
};

// ── 2023 P2 Q15 ────────────────────────────────────────────────────────────
// f'(x) = a(x + c)/(1 + (x + c)⁴), c = ±1, f(0) = k: (a) the Maclaurin
// expansion to x², k + (ac/2)x - (a/4)x²; (b) the integral by u = (x + c)²,
// (a/2) tan⁻¹((x + c)²); (c) f(x), its constant k - aπ/8. With c = ±1, the
// paper's (x + 1), c⁴ = 1 and tan⁻¹ 1 = π/4 keep every value exact.

interface P2Q15of2023 { a: number; c: 1 | -1; k: number }

const q2023p2q15: CardRoutine<P2Q15of2023> = {
  // The paper's bare x + 1 on top half the draws, a number before it the rest.
  draw: () => ({ a: pick([true, false]) ? 1 : int(2, 3), c: pick([1, -1] as const), k: int(1, 5) }),

  build: ({ a, c, k }): Built => {
    const lin = `x ${c > 0 ? '+' : '-'} 1`;
    const top = a === 1 ? lin : `${a}(${lin})`;
    const bottom = `1 + (${lin})^{4}`;
    const fPrime = `\\frac{${top}}{${bottom}}`;
    const aTimes = (s: string) => (a === 1 ? s : `${a}(${s})`);
    const begun = `\\frac{${aTimes(bottom)} - \\ldots}{(${bottom})^{2}}`;
    const other = `\\frac{\\ldots - ${a === 1 ? '' : a}(${lin}) \\cdot 4(${lin})^{3}}{(${bottom})^{2}}`;
    const complete = `\\frac{${aTimes(bottom)} - ${a === 1 ? '' : a}(${lin}) \\cdot 4(${lin})^{3}}{(${bottom})^{2}}`;
    const expansion = series([k, q(a * c, 2), q(-a, 4)]);
    const du = `\\frac{du}{dx} = 2(${lin})`;
    const inU = `${sum([{ coef: q(a, 2), body: '\\int \\frac{du}{1 + u^{2}}' }])}`;
    const tan = `\\tan^{-1}((${lin})^{2})`;
    const integral = `${sum([{ coef: q(a, 2), body: tan }])} + c`;
    const f = `${sum([{ coef: q(a, 2), body: tan }])} + ${k} - ${piTimes(q(a, 8))}`;
    return {
      questionLines: [
        'A function $f(x)$ has the following properties:',
        `$f'(x) = ${fPrime}$`,
        `the first term in the Maclaurin expansion of $f(x)$ is ${k}.`,
        '<b>(a)</b> Find the Maclaurin expansion of $f(x)$ up to and including the term in $x^{2}.$',
        `<b>(b)</b> Use the substitution $u = (${lin})^{2}$ to find $\\int ${fPrime}\\,dx.$`,
        '<b>(c)</b> Determine an expression for $f(x).$',
      ],
      solutionSteps: [
        `<strong>(a)</strong> By the quotient rule, $f''(x) = ${begun}$`,
        `<strong>(a)</strong> $f''(x) = ${complete}$`,
        `<strong>(a)</strong> $f(0) = ${k}$, $f'(0) = ${num(q(a * c, 2))}$ and $f''(0) = ${num(q(-a, 2))}$, so $f(x) = ${expansion} + \\ldots$`,
        `<strong>(b)</strong> $${du}$`,
        `<strong>(b)</strong> $\\int ${fPrime}\\,dx = ${inU}$`,
        `<strong>(b)</strong> $= ${integral}$`,
        `<strong>(c)</strong> $f(0) = ${k}$, so $${sum([{ coef: q(a, 2), body: '\\tan^{-1}1' }])} + c = ${k}$ and $c = ${k} - ${piTimes(q(a, 8))}$`,
        `<strong>(c)</strong> $f(x) = ${f}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1, 1],
      finalAnswer: `(a) $${expansion}$<br>(b) $${integral}$<br>(c) $f(x) = ${f}$`,
      ladder: {
        moves: [
          'Maclaurin needs $f(0)$, $f\'(0)$ and $f\'\'(0)$. You are given $f\'(x)$: what else do you need?',
          '(a) Differentiate $f\'(x)$ with the quotient rule.',
          '(a) Complete the differentiation.',
          '(a) Evaluate at $x = 0$ and build the expansion, starting with the first term you are given.',
          '(b) Differentiate the substitution.',
          '(b) Rewrite the integral in terms of $u$.',
          '(b) Integrate, then substitute back for $u$.',
          '(c) The first Maclaurin term tells you $f(0)$. Write that down.',
          '(c) Use it to find the constant in your answer to (b).',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1, 1],
        shows: [
          null,
          `$${begun}$ or $${other}$`,
          `$${complete}$`,
          `$${expansion}$`,
          `$${du}$`,
          `$${inU}$`,
          `$${integral}$`,
          `$f(0) = ${k}$`,
          null,
        ],
        watch: { at: 1, text: 'You are given $f\'(x)$, so one differentiation gives $f\'\'(x)$. Do not differentiate twice.' },
      },
    };
  },
};

// ── 2022 P1 Q5 ─────────────────────────────────────────────────────────────
// (a) e^{-kx} to x^3; (b) hence (p + qx)/e^{kx}, which is (p + qx)e^{-kx}

interface P1Q5of2022 { k: number; p: number; q: number }

/** Every (p, q) the card can set: p from 1 to 5, q either sign, sharing no factor, as 3 + 2x. */
const Q5_TOPS: readonly [number, number][] = (() => {
  const out: [number, number][] = [];
  for (let p = 1; p <= 5; p++) {
    for (let qx = -5; qx <= 5; qx++) if (qx !== 0 && gcd(p, qx) === 1) out.push([p, qx]);
  }
  return out;
})();

const q2022p1q5Terms = ({ k, p, q: qx }: P1Q5of2022) => mulSeries([q(p), q(qx)], expSeries(-k, 3), 3);

const q2022p1q5: CardRoutine<P1Q5of2022> = {
  // No zero term among (b)'s first four, as 3 - 10x + 16x^2 - 16x^3 has none;
  // and no product worked by hand bigger than the paper's (the owner on 2023
  // P1: "biggest should be no larger than paper"): k^3 at most 64, and p times
  // k^3/6 and q times k^2/2 at most 32, as 3 x 32/3.
  draw: () => until(
    () => {
      const [p, qx] = pick(Q5_TOPS);
      return { k: int(2, 4), p, q: qx };
    },
    (n) => q2022p1q5Terms(n).every(c => c.n !== 0n) && n.p * n.k ** 3 <= 192 && Math.abs(n.q) * n.k ** 2 <= 64,
  ),

  build: (n): Built => {
    const { k, p, q: qx } = n;
    const e = `e^{-${k}x}`;
    const top = sum([{ coef: p, body: '' }, { coef: qx, body: 'x' }]);
    const quotient = `\\frac{${top}}{e^{${k}x}}`;
    const primes = ['', '\'', '\'\'', '\'\'\''];
    const derivatives = primes.map((pr, i) =>
      `$f${pr}(x) = ${sum([{ coef: (-k) ** i, body: e }])}$, $f${pr}(0) = ${(-k) ** i}$`).join('; ');
    const expText = series(expSeries(-k, 3));
    const product = `(${top})${e}`;
    const answer = series(q2022p1q5Terms(n));
    return {
      questionLines: [
        `<b>(a)</b> Find, and simplify, the Maclaurin expansion for $${e}$ up to and including the term in $x^{3}.$`,
        `<b>(b)</b> Hence find the first four terms of the Maclaurin expansion of $${quotient}.$`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> ${derivatives}`,
        `<strong>(a)</strong> $${e} = ${expText}$`,
        `<strong>(b)</strong> $${quotient} = ${product}$`,
        `<strong>(b)</strong> $${product} = (${top})\\left(${expText}\\right) = ${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `(a) $${e} = ${expText}$<br>(b) $${quotient} = ${answer}$`,
      ladder: {
        moves: [
          'A Maclaurin series needs the function and its derivatives at one particular value of $x$. Which value?',
          `(a) Differentiate $${e}$ three times, and evaluate it and each derivative at $x = 0$.`,
          '(a) Put those values into the Maclaurin formula and simplify.',
          `(b) Dividing by $e^{${k}x}$ is multiplying by $${e}$. Write the product.`,
          '(b) Multiply out, keeping the first four terms.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, derivatives, `$${expText}$`, `$${product}$`, null],
        watch: { at: 4, text: `$${top}$ is already a polynomial. Do not expand it as a series.` },
      },
    };
  },
};

// ── 2018 Q17 ───────────────────────────────────────────────────────────────
// (a) e^{kx} to x³; (b) tan x: its third derivative shown, then x + x³/3;
// (c) their product, x + kx² + (k²/2 + 1/3)x³; (d) its derivative, which is
// the expression given: 1 + 2kx + (3k²/2 + 1)x².

interface Q17of2018 { k: number }

/** tan x and its derivatives: the same on every draw, as (b) is the paper's. */
const TAN_SECOND2018 = 'g\'\'(x) = 2\\sec x\\sec x\\tan x';
const TAN_PRODUCT2018 = 'g\'\'\'(x) = 2\\sec^{2} x(\\ldots) + (\\ldots)\\tan x';
const TAN_THIRD2018 = 'g\'\'\'(x) = 2\\sec^{2} x(\\sec^{2} x) + (4\\sec^{2} x\\tan x)\\tan x';
const TAN_VALUES2018 = '$g(0) = 0$, $g\'(0) = 1$, $g\'\'(0) = 0$, $g\'\'\'(0) = 2$';

const q2018q17: CardRoutine<Q17of2018> = {
  // k never 0 or ±1, as 2026 P2 Q3's e^{kx}: e^{x} is the series a pupil already knows.
  draw: () => ({ k: pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]) }),

  build: ({ k }): Built => {
    const e = `e^{${k}x}`;
    const primes = ['', '\'', '\'\'', '\'\'\''];
    const expDerivatives = primes.map((p, i) =>
      `$f${p}(x) = ${sum([{ coef: k ** i, body: e }])}$, $f${p}(0) = ${k ** i}$`).join('; ');
    const expTerms = expSeries(k, 3);
    const tanTerms = [ZERO, q(1), ZERO, q(1, 3)];
    const productTerms = mulSeries(expTerms, tanTerms, 3);
    const derivativeTerms = productTerms.slice(1).map((c, i) => mul(c, q(i + 1)));
    const expText = series(expTerms), tanText = series(tanTerms);
    const product = `\\left(${series(expTerms.slice(0, 3))} + \\ldots\\right)\\left(${tanText} \\ldots\\right)`;
    const productText = series(productTerms);
    const given = `${sum([{ coef: k, body: `${e}\\tan x` }, { coef: 1, body: `${e}\\sec^{2} x` }])}`;
    const derivativeText = series(derivativeTerms);
    return {
      questionLines: [
        `<b>(a)</b> Given $f(x) = ${e}$ obtain the Maclaurin expansion for $f(x)$ up to, and including, the term in $x^{3}.$`,
        '<b>(b)</b> On a suitable domain, let $g(x) = \\tan x.$',
        '(i) Show that the third derivative of $g(x)$ is given by',
        '$g\'\'\'(x) = 2 \\sec^{4} x + 4 \\tan^{2} x \\sec^{2} x.$',
        '(ii) Hence obtain the Maclaurin expansion for $g(x)$ up to and including the term in $x^{3}.$',
        `<b>(c)</b> Hence, or otherwise, obtain the Maclaurin expansion for $${e} \\tan x$ up to, and including, the term in $x^{3}.$`,
        '<b>(d)</b> Write down the first three non-zero terms in the Maclaurin expansion for',
        `$${given}.$`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> ${expDerivatives}`,
        `<strong>(a)</strong> $f(x) = ${expText} \\ldots$`,
        `<strong>(b)(i)</strong> $g'(x) = \\sec^{2} x$, so $${TAN_SECOND2018}$`,
        `<strong>(b)(i)</strong> By the product rule, $${TAN_PRODUCT2018}$`,
        `<strong>(b)(i)</strong> $${TAN_THIRD2018} = 2\\sec^{4} x + 4\\tan^{2} x\\sec^{2} x$`,
        `<strong>(b)(ii)</strong> ${TAN_VALUES2018}`,
        `<strong>(b)(ii)</strong> $g(x) = ${tanText} \\ldots$`,
        `<strong>(c)</strong> $${e}\\tan x = ${product}$`,
        `<strong>(c)</strong> $${e}\\tan x = ${productText} \\ldots$`,
        `<strong>(d)</strong> The expression is the derivative of $${e}\\tan x$, so its first three non-zero terms are $${derivativeText}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      finalAnswer: [
        `(a) $${expText}$`,
        `(b)(i) $${TAN_THIRD2018} = 2\\sec^{4} x + 4\\tan^{2} x\\sec^{2} x$`,
        `(b)(ii) $${tanText}$`,
        `(c) $${productText}$`,
        `(d) $${derivativeText}$`,
      ].join('<br>'),
      ladder: {
        moves: [
          'A Maclaurin series needs the function and its derivatives at one particular value of $x$. Which value?',
          `(a) Differentiate $${e}$ three times, and evaluate it and each derivative at $x = 0$.`,
          '(a) Put those values into the Maclaurin formula.',
          '(b)(i) Differentiate $\\tan x$ twice, writing $\\sec^2 x$ as $(\\sec x)^2$.',
          '(b)(i) Differentiate $g\'\'(x)$ with the product rule.',
          '(b)(i) Complete it and show it matches the given expression.',
          '(b)(ii) Evaluate $g$ and its three derivatives at $x = 0$.',
          '(b)(ii) Put them into the Maclaurin formula.',
          '(c) Multiply your two series.',
          '(c) Expand, keeping only terms up to $x^3$.',
          // A question, so seeing the derivative is still the pupil's mark (the owner, full read 2026-10-05).
          `(d) Compare the expression in (d) with the derivative of $${e}\\tan x$. What do you notice?`,
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        shows: [
          null,
          expDerivatives,
          `$f(x) = ${expText} \\ldots$`,
          `$${TAN_SECOND2018}$`,
          `$${TAN_PRODUCT2018}$`,
          `$${TAN_THIRD2018}$`,
          TAN_VALUES2018,
          `$g(x) = ${tanText} \\ldots$`,
          `$${product}$`,
          `$${productText} \\ldots$`,
          null,
        ],
        // No longer says what the link is (the owner, full read 2026-10-05: "Change").
        watch: { at: 10, text: 'Look for a link between (d) and an earlier part.' },
      },
    };
  },
};

export const ROUTINES = {
  '2018 Q17': q2018q17,
  '2022 P1 Q5': q2022p1q5,
  '2023 P2 Q15': q2023p2q15,
  '2024 P2 Q7': q2024p2q7,
  '2025 P2 Q6': q2025p2q6,
  '2026 P2 Q3': q2026p2q3,
};
