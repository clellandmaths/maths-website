/**
 * Advanced Higher, Complex Numbers: how each 2022 P2 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/complex-numbers.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int, nonZero, pick, until } from '../draw';
import { poly, sum } from '../maths/format';
import { binom } from '../maths/integer';
import { conjugatePair } from '../maths/polynomial';

// ── 2022 P2 Q7 ─────────────────────────────────────────────────────────────
// z = p + qi a root of z² - 2pz + a = 0: (a) the conjugate; (b) a = p² + q²;
// (c) (z² - 2pz + a)(z + m) = z³ + (m - 2p)z² + (a - 2pm)z + am, so b = am.

interface P2Q7of2022 { p: number; qq: number; m: number }

/** The cubic's z² and z coefficients, and b. */
function cubicOf({ p, qq, m }: P2Q7of2022): { z2: number; z1: number; b: number; a: number } {
  const a = p * p + qq * qq;
  return { z2: m - 2 * p, z1: a - 2 * p * m, b: a * m, a };
}

const q2022p2q7: CardRoutine<P2Q7of2022> = {
  draw: () => until(
    () => ({ p: int(1, 6), qq: int(1, 4), m: nonZero(-6, 6) }),
    // Every term of the cubic printed, as z^3 - z^2 - 20z + b.
    (n) => { const { z2, z1 } = cubicOf(n); return z2 !== 0 && z1 !== 0; },
  ),

  build: (n): Built => {
    const { p, qq, m } = n;
    const { z2, z1, b, a } = cubicOf(n);
    const im = qq === 1 ? 'i' : `${qq}i`;
    const root = `${p} + ${im}`, other = `${p} - ${im}`;
    const quadA = `${poly([1, -2 * p, 0], 'z')} + a`;
    const quad = poly(conjugatePair(p, qq), 'z');
    const cubic = `${poly([1, z2, z1, 0], 'z')} + b`;
    const factor = poly([1, m], 'z');
    const product = `(z - (${other}))(z - (${root}))`;
    return {
      questionLines: [
        `The complex number $z = ${root}$ is a root of $${quadA} = 0$ where $a$ is a real number.`,
        `<b>(a)</b> State the second root of $${quadA} = 0.$`,
        '<b>(b)</b> Hence, or otherwise, find the value of $a.$',
        `The expression $${quadA}$ is a factor of $${cubic}$ where $b$ is a real number.`,
        '<b>(c)</b> Find the value of $b.$',
      ],
      solutionSteps: [
        `<strong>(a)</strong> The coefficients are real, so the conjugate $${other}$ is the second root`,
        `<strong>(b)</strong> $${quadA} = ${product}$`,
        `<strong>(b)</strong> $${product} = (z - ${p})^{2} + ${qq * qq} = ${quad}$, so $a = ${a}$`,
        `<strong>(c)</strong> $${cubic} = (${quad})(${factor})$: the $z^{2}$ terms give $${-2 * p} + ${m < 0 ? `(${m})` : m} = ${z2}$, so the other factor is $${factor}$ and $b = ${a} \\times ${m < 0 ? `(${m})` : m} = ${b}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: [`(a) $${other}$`, `(b) $a = ${a}$`, `(c) $b = ${b}$`].join('<br>'),
      ladder: {
        moves: [
          'The coefficients are real. What does that tell you about complex roots?',
          `(a) State the conjugate of $${root}$.`,
          '(b) Write the product of the two linear factors.',
          '(b) Multiply out and compare with the quadratic to find $a$.',
          '(c) The quadratic is a factor of the cubic. What is the other factor, and what must the remainder be?',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, null, `$${product}$`, null, null],
        watch: { at: 4, text: 'Show your working in (c). A value with no working earns nothing.' },
      },
    };
  },
};

// ── 2022 P2 Q12 ────────────────────────────────────────────────────────────
// z = cos θ + i sin θ: (a) zⁿ by de Moivre; (b) the binomial expansion;
// (c)(i) cos nθ in powers of cos θ, from the real parts; (c)(ii) sin θ cot nθ
// in cos θ only, from both. n = 4 is the paper's; 3 and 5 are the same steps.

interface P2Q12of2022 { n: 3 | 4 | 5 }

const C = '\\cos\\theta', S = '\\sin\\theta';
/** cos^k θ as a paper writes it: `\cos^{3}\theta`, `\cos\theta`, or '' for k = 0. */
const cosPow = (k: number) => (k === 0 ? '' : k === 1 ? C : `\\cos^{${k}}\\theta`);
const sinPow = (k: number) => (k === 0 ? '' : k === 1 ? S : `\\sin^{${k}}\\theta`);

/** Polynomials in cos θ, lowest power first: [1, 0, -8, 0, 8] is 8cos⁴θ - 8cos²θ + 1. */
type P = number[];
const addP = (a: P, b: P): P => Array.from({ length: Math.max(a.length, b.length) }, (_, i) => (a[i] ?? 0) + (b[i] ?? 0));
const mulP = (a: P, b: P): P => {
  const out = new Array<number>(a.length + b.length - 1).fill(0);
  a.forEach((x, i) => b.forEach((y, j) => { out[i + j] += x * y; }));
  return out;
};
/** (1 - cos²θ)^j, which is sin^{2j}θ. */
const oneMinus = (j: number): P => Array.from({ length: j }).reduce<P>(acc => mulP(acc, [1, 0, -1]), [1]);
/** A polynomial in cos θ, highest power first, as the paper prints 8\cos^{4}\theta - 8\cos^{2}\theta + 1. */
const inCos = (c: P) => sum(c.map((k, i) => ({ coef: k, body: cosPow(i) })).reverse());

/** The k-th term of (cos θ + i sin θ)ⁿ: its real sign (i^k) and whether it carries i. */
const iPower = (k: number) => ({ sign: k % 4 < 2 ? 1 : -1, imaginary: k % 2 === 1 });

const q2022p2q12: CardRoutine<P2Q12of2022> = {
  draw: () => ({ n: pick([3, 4, 5] as const) }),

  build: ({ n }): Built => {
    const ks = Array.from({ length: n + 1 }, (_, k) => k);
    const raw = ks.map(k => {
      const coef = binom(n, k) === 1 ? '' : String(binom(n, k));
      const c = n - k === 0 ? '' : n - k === 1 ? `(${C})` : `(${C})^{${n - k}}`;
      const s = k === 0 ? '' : k === 1 ? `(i${S})` : `(i${S})^{${k}}`;
      return `${coef}${c}${s}`;
    }).join(' + ');
    const term = (k: number) => {
      const { sign, imaginary } = iPower(k);
      return { coef: sign * binom(n, k), body: `${imaginary ? 'i' : ''}${cosPow(n - k)}${sinPow(k)}` };
    };
    const simplified = sum(ks.map(term));
    const firstThree = `${sum(ks.slice(0, 3).map(term))} + \\ldots`;
    const powers = ks.slice(2).map(k => {
      const { sign, imaginary } = iPower(k);
      return `$i^{${k}} = ${sign < 0 ? '-' : ''}${imaginary ? 'i' : '1'}$`;
    });
    const iList = powers.length > 1 ? `${powers.slice(0, -1).join(', ')} and ${powers.at(-1)}` : powers[0];
    const evens = ks.filter(k => k % 2 === 0), odds = ks.filter(k => k % 2 === 1);
    const realPart = sum(evens.map(k => ({ coef: (k % 4 === 0 ? 1 : -1) * binom(n, k), body: `${cosPow(n - k)}${sinPow(k)}` })));
    const imagPart = sum(odds.map(k => ({ coef: (k % 4 === 1 ? 1 : -1) * binom(n, k), body: `${cosPow(n - k)}${sinPow(k)}` })));
    // sin^{2j}θ written as (1 - cos²θ)^j, then multiplied out in powers of cos θ.
    const sq = (j: number) => (j === 1 ? `(1 - \\cos^{2}\\theta)` : `(1 - \\cos^{2}\\theta)^{${j}}`);
    const substituted = sum(evens.map(k => ({ coef: (k % 4 === 0 ? 1 : -1) * binom(n, k), body: `${cosPow(n - k)}${k ? sq(k / 2) : ''}` })));
    const cosN = evens.reduce<P>((acc, k) => addP(acc, mulP([...new Array(n - k).fill(0), (k % 4 === 0 ? 1 : -1) * binom(n, k)], oneMinus(k / 2))), [0]);
    // sin nθ = sin θ × (the odd terms over sin θ), with sin²θ = 1 - cos²θ again.
    const sinOver = odds.reduce<P>((acc, k) => addP(acc, mulP([...new Array(n - k).fill(0), (k % 4 === 1 ? 1 : -1) * binom(n, k)], oneMinus((k - 1) / 2))), [0]);
    const sinOverText = sum(odds.map(k => ({ coef: (k % 4 === 1 ? 1 : -1) * binom(n, k), body: `${cosPow(n - k)}${sinPow(k - 1)}` })));
    const result = inCos(cosN), sinFactor = inCos(sinOver);
    const cot = `\\frac{${realPart}}{${imagPart}}`;
    const answer = `\\frac{${result}}{${sinFactor}}`;
    const nT = `${n}\\theta`;
    return {
      questionLines: [
        `Let $z = ${C} + i${S}.$`,
        `<b>(a)</b> Use de Moivre's theorem to state an expression for $z^{${n}}.$`,
        `<b>(b)</b> State and simplify the binomial expansion of $(${C} + i${S})^{${n}}.$`,
        '<b>(c)</b> Hence show that:',
        `(i) $\\cos ${nT} = ${result}.$`,
        `(ii) $${S}\\cot ${nT}$ can be written in terms of $${C}$ only.`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> $z^{${n}} = \\cos ${nT} + i\\sin ${nT}$`,
        `<strong>(b)</strong> $(${C} + i${S})^{${n}} = ${raw}$`,
        `<strong>(b)</strong> With ${iList}: $${firstThree}$`,
        `<strong>(b)</strong> $(${C} + i${S})^{${n}} = ${simplified}$`,
        `<strong>(c)(i)</strong> Equating real parts: $\\cos ${nT} = ${realPart}$`,
        `<strong>(c)(i)</strong> With $\\sin^{2}\\theta = 1 - \\cos^{2}\\theta$: $\\cos ${nT} = ${substituted}$, which leads to $\\cos ${nT} = ${result}$`,
        `<strong>(c)(ii)</strong> Equating imaginary parts, $\\sin ${nT} = ${imagPart}$, so $\\cot ${nT} = ${cot}$`,
        `<strong>(c)(ii)</strong> $\\sin ${nT} = ${S}(${sinOverText}) = ${S}(${sinFactor})$, so $${S}\\cot ${nT} = ${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1, 1],
      finalAnswer: [
        `(a) $\\cos ${nT} + i\\sin ${nT}$`,
        `(b) $${simplified}$`,
        `(c)(i) Equating real parts: $\\cos ${nT} = ${realPart} = ${result}$`,
        `(c)(ii) $${S}\\cot ${nT} = ${answer}$`,
      ].join('<br>'),
      ladder: {
        moves: [
          `You have two ways to write $(${C} + i${S})^{${n}}$. What happens if you compare them?`,
          `(a) De Moivre's theorem: multiply the argument by ${n}.`,
          // Every term written out, not a general term (the owner, full read 2026-10-05).
          `(b) Write out all ${['', '', '', 'four', 'five', 'six', 'seven', 'eight'][n]} terms of the binomial expansion, each with its coefficient and its powers of $\\cos\\theta$ and $i\\sin\\theta$.`,
          '(b) Simplify the powers of $i$ in three of the terms.',
          '(b) Finish simplifying.',
          '(c)(i) Set the real part of (a) equal to the real part of (b).',
          '(c)(i) Replace $\\sin^{2}\\theta$ with $1 - \\cos^{2}\\theta$, and simplify.',
          `(c)(ii) Use the imaginary parts for $\\sin ${nT}$, and write $\\cot ${nT}$ as a fraction.`,
          '(c)(ii) Multiply by $\\sin\\theta$, and use the identity again to leave only $\\cos\\theta$.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1, 1],
        shows: [
          null,
          null,
          `$${raw}$`,
          `three from: $${simplified}$`,
          `$${simplified}$`,
          null,
          `$\\cos ${nT} = ${substituted}$ leading to $\\cos ${nT} = ${result}$`,
          `$${cot}$`,
          null,
        ],
        watch: { at: 3, text: 'Simplify every power of $i$. An unsimplified $i^2$ or $i^3$ spoils the real and imaginary parts.' },
      },
    };
  },
};

export const ROUTINES = {
  '2022 P2 Q7': q2022p2q7,
  '2022 P2 Q12': q2022p2q12,
};
