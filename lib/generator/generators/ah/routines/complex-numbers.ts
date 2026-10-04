/**
 * Advanced Higher, Complex Numbers: how each card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/complex-numbers.ts` under the same label.
 */
import type { Built, CardRoutine } from '../types';
import { int, nonZero, pick, until } from '../draw';
import { piTimes, poly, sum } from '../maths/format';
import { q } from '../maths/rational';
import { conjugatePair, mulPoly } from '../maths/polynomial';

// ── 2026 P1 Q3 ─────────────────────────────────────────────────────────────
// z = ±a√3 ± ai: polar form, then z³ purely imaginary by de Moivre.

type Quadrant = 1 | 2 | 3 | 4;
interface Q3 { a: number; quadrant: Quadrant }

/** Signs of the real and imaginary parts, the principal argument in sixths of π, and how it is found. */
const QUADRANTS: Record<Quadrant, { re: 1 | -1; im: 1 | -1; sixths: number; where: string }> = {
  1: { re: 1, im: 1, sixths: 1, where: '' },
  2: { re: -1, im: 1, sixths: 5, where: 'the second quadrant, so ' },
  3: { re: -1, im: -1, sixths: -5, where: 'the third quadrant, so ' },
  4: { re: 1, im: -1, sixths: -1, where: 'the fourth quadrant, so ' },
};

/** `\cos\frac{\pi}{6}`, or with brackets round a negative angle: `\cos\left(-\frac{\pi}{6}\right)`. */
const trig = (fn: 'cos' | 'sin', angle: string) =>
  angle.startsWith('-') ? `\\${fn}\\left(${angle}\\right)` : `\\${fn}${angle}`;
const polar = (r: string, angle: string) => `${r}\\left(${trig('cos', angle)} + i${trig('sin', angle)}\\right)`;

const q2026p1q3: CardRoutine<Q3> = {
  draw: () => ({ a: int(1, 4), quadrant: pick<Quadrant>([1, 2, 3, 4]) }),

  build: ({ a, quadrant }): Built => {
    const Q = QUADRANTS[quadrant];
    const z = sum([{ coef: Q.re * a, body: '\\sqrt{3}' }, { coef: Q.im * a, body: 'i' }]);
    const r = 2 * a;
    const theta = piTimes(q(Q.sixths, 6));
    // Tripled but not simplified, as the scheme writes it: 3π/6, 15π/6.
    const n = 3 * Q.sixths;
    const tripledAngle = `${n < 0 ? '-' : ''}\\frac{${Math.abs(n)}\\pi}{6}`;
    const cube = Q.sixths > 0 ? `${r ** 3}i` : `-${r ** 3}i`;
    const argument = quadrant === 1
      ? `\\arg z = \\tan^{-1}\\frac{1}{\\sqrt{3}} = ${theta}`
      : `\\arg z = ${theta}`;
    const modulus = `|z| = \\sqrt{${3 * a * a} + ${a * a}} = ${r}`;
    const shown = `$z^{3} = ${cube}$: its real part is zero, so $z^{3}$ is purely imaginary (shown)`;

    return {
      questionLines: [
        `A complex number is defined by $z = ${z}.$`,
        '<b>(a)</b> Express $z$ in polar form.',
        '<b>(b)</b> Use de Moivre\'s theorem to show that $z^{3}$ is purely imaginary.',
      ],
      solutionSteps: [
        Q.where
          ? `<strong>(a)</strong> $${modulus}$; $z$ is in ${Q.where}$${argument}$`
          : `<strong>(a)</strong> $${modulus}$ and $${argument}$`,
        `<strong>(a)</strong> $z = ${polar(String(r), theta)}$`,
        `<strong>(b)</strong> $z^{3} = ${polar(`${r}^{3}`, tripledAngle)}$`,
        `<strong>(b)</strong> ${shown}`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `(a) $z = ${polar(String(r), theta)}$<br>(b) ${shown}`,
      ladder: {
        moves: [
          `Where does $${z}$ sit on an Argand diagram, and how far is it from the origin?`,
          '(a) Find the modulus and the argument, using the quadrant to check the angle.',
          '(a) Write $z$ in the form $r(\\cos\\theta + i\\sin\\theta)$.',
          '(b) De Moivre\'s theorem: cube the modulus and multiply the argument by 3.',
          '(b) Evaluate the cosine and sine, and say why the result is purely imaginary.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, `$${r}$ or $${theta}$`, `$${polar(String(r), theta)}$`, `$${polar(`${r}^{3}`, tripledAngle)}$`, null],
        watch: { at: 3, text: `Multiplying out $(${z})^{3}$ instead of using de Moivre's theorem earns nothing in (b).` },
      },
    };
  },
};

// ── 2026 P1 Q7 ─────────────────────────────────────────────────────────────
// A real quartic with root p + qi: the conjugate, then the remaining m ± ni.

interface Q7 { p: number; qi: number; m: number; n: number }

/** `2 + i`, `-1 - 3i`, and with ± for a pair: `-1 \pm 2i`. */
const complex = (re: number, im: number) => sum([{ coef: re, body: '' }, { coef: im, body: 'i' }]);
const pair = (re: number, im: number) => `${re} \\pm ${im === 1 ? '' : im}i`;

const q2026p1q7: CardRoutine<Q7> = {
  draw: () => until(
    () => ({ p: nonZero(-3, 3), qi: int(1, 3), m: nonZero(-3, 3), n: int(1, 3) }),
    ({ p, qi, m, n }) => {
      if (p === m && qi === n) return false;
      const c = quartic(p, qi, m, n);
      return c.every(v => v !== 0 && Math.abs(v) <= 60);
    },
  ),

  build: ({ p, qi, m, n }): Built => {
    const s = p * p + qi * qi, t = m * m + n * n;
    const coef = quartic(p, qi, m, n);
    const equation = poly(coef, 'z');
    const first = poly(conjugatePair(p, qi), 'z');
    const second = poly(conjugatePair(m, n), 'z');
    const root = complex(p, qi), conj = complex(p, -qi);
    const lead = poly([1, -2 * p, s, 0, 0], 'z');
    const b = -2 * m;
    const formula = `z = \\frac{${-b} \\pm \\sqrt{${b * b} - ${4 * t}}}{2} = \\frac{${-b} \\pm ${2 * n}i}{2} = ${pair(m, n)}`;
    const remaining = `$z = ${complex(m, n)}$ and $z = ${complex(m, -n)}$`;

    return {
      questionLines: [
        `The complex number $z = ${root}$ is a root of the polynomial equation`,
        '',
        `$${equation} = 0.$`,
        '<b>(a)</b> State a second root of the equation.',
        '<b>(b)</b> Find the remaining roots.',
      ],
      solutionSteps: [
        `<strong>(a)</strong> The coefficients are real, so the conjugate $z = ${conj}$ is also a root.`,
        `<strong>(b)</strong> Two linear factors: $z - (${root})$ and $z - (${conj})$`,
        `<strong>(b)</strong> Their product: $${first}$`,
        `<strong>(b)</strong> Dividing $${equation}$ by $${first}$: the first term is $z^{2}$, and $z^{2}(${first}) = ${lead}$`,
        `<strong>(b)</strong> The second quadratic factor: $${second}$`,
        `<strong>(b)</strong> $${formula}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1],
      finalAnswer: `(a) $z = ${conj}$<br>(b) ${remaining}`,
      ladder: {
        moves: [
          'The coefficients are all real. What does that tell you about complex roots?',
          `(a) State the conjugate of $${root}$.`,
          '(b) Write the two linear factors and multiply them into one quadratic.',
          '(b) Divide the quartic by that quadratic.',
          '(b) Finish the division to get the second quadratic factor.',
          '(b) Solve the second quadratic with the quadratic formula.',
        ],
        marks: [0, 1, 2, 1, 1, 1],
        shows: [null, null, null, `$${first}$ into $${equation}$: the first term is $z^{2}$, then $${lead}$`, null, null],
        watch: { at: 4, text: 'Check the second quadratic by multiplying back. One that does not divide exactly loses its mark.' },
      },
    };
  },
};

/** The quartic with roots p ± qi and m ± ni, highest power first. */
const quartic = (p: number, qi: number, m: number, n: number) => mulPoly(conjugatePair(p, qi), conjugatePair(m, n));

// ── 2025 P1 Q3 ─────────────────────────────────────────────────────────────
// z/w in the form a + bi, built from the answer: z = (p + qi)w.

interface P1Q3 { p: number; qi: number; r: number; s: number }

const q2025p1q3: CardRoutine<P1Q3> = {
  draw: () => until(
    () => ({ p: nonZero(-5, 5), qi: nonZero(-5, 5), r: int(1, 4), s: nonZero(-4, 4) }),
    ({ p, qi, r, s }) => {
      const x = p * r - qi * s, y = p * s + qi * r;
      // z has both parts, as 11 + 10i, within 30; w is never 1 ± i, whose
      // conjugate makes the bottom a bare 2.
      return x !== 0 && y !== 0 && Math.abs(x) <= 30 && Math.abs(y) <= 30 && r * r + s * s > 2;
    },
  ),

  build: ({ p, qi, r, s }): Built => {
    const x = p * r - qi * s, y = p * s + qi * r;
    const z = complex(x, y), w = complex(r, s), conj = complex(r, -s);
    const modulus = r * r + s * s;
    const answer = complex(p, qi);
    const multiplied = `\\frac{${z}}{${w}} \\times \\frac{${conj}}{${conj}}`;
    // (x + yi)(r - si) term by term, then i^2 = -1.
    const expanded = sum([
      { coef: x * r, body: '' }, { coef: -x * s, body: 'i' }, { coef: y * r, body: 'i' }, { coef: -y * s, body: 'i^{2}' },
    ]);
    const top = complex(x * r + y * s, y * r - x * s);
    const worked = `\\frac{${expanded}}{${r * r} + ${s * s}} = \\frac{${top}}{${modulus}} = ${answer}`;

    return {
      questionLines: [
        `Two complex numbers are defined as $z = ${z}$ and $w = ${w}.$`,
        'Find $\\frac{z}{w}$ in the form $a + bi$, where $a, b \\in \\mathbb{R}.$',
      ],
      solutionSteps: [
        `$\\frac{z}{w} = ${multiplied}$`,
        `$= ${worked}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          'How do you get rid of $i$ from the bottom of a fraction?',
          'Multiply the top and the bottom by the complex conjugate of $w$.',
          'Multiply out both, using $i^{2} = -1$, and write the result as $a + bi$.',
        ],
        marks: [0, 1, 1],
        shows: [null, `$${multiplied}$`, null],
        watch: { at: 1, text: 'Multiply both the numerator and the denominator by the conjugate, not just one of them.' },
      },
    };
  },
};

// ── 2025 P2 Q18 ────────────────────────────────────────────────────────────
// w, one of z̄ ± iz or z ± iz̄, is (a multiple of) 1 ± i: (a) Cartesian, then its
// argument on one side of the line; (b) given its polar form on the other
// side, both square roots by de Moivre.

type Which = 'conj+iz' | 'conj-iz' | 'z+iconj' | 'z-iconj';
interface P2Q18 { which: Which; swap: boolean }

const P2Q18_FORMS: Record<Which, {
  w: string; expand: string; cartesian: string;
  /** The condition making the multiplier positive, and its opposite. */
  pos: string; neg: string;
  /** The argument, in quarters of π, when the multiplier is positive and when negative. */
  argPos: number; argNeg: number;
  /** For the ladder: the parts when the multiplier is positive and when negative. */
  seePos: string; seeNeg: string;
}> = {
  'conj+iz': {
    w: '\\bar{z} + iz', expand: 'x - iy + i(x + iy) = x - iy + ix - y', cartesian: '(x - y) + i(x - y)',
    pos: 'x \\gt y', neg: 'x \\lt y', argPos: 1, argNeg: -3,
    seePos: 'equal and positive', seeNeg: 'equal and negative',
  },
  'conj-iz': {
    w: '\\bar{z} - iz', expand: 'x - iy - i(x + iy) = x - iy - ix + y', cartesian: '(x + y) - i(x + y)',
    pos: 'x + y \\gt 0', neg: 'x + y \\lt 0', argPos: -1, argNeg: 3,
    seePos: 'equal in size, the real part positive and the imaginary part negative',
    seeNeg: 'equal in size, the real part negative and the imaginary part positive',
  },
  'z+iconj': {
    w: 'z + i\\bar{z}', expand: 'x + iy + i(x - iy) = x + iy + ix + y', cartesian: '(x + y) + i(x + y)',
    pos: 'x + y \\gt 0', neg: 'x + y \\lt 0', argPos: 1, argNeg: -3,
    seePos: 'equal and positive', seeNeg: 'equal and negative',
  },
  'z-iconj': {
    w: 'z - i\\bar{z}', expand: 'x + iy - i(x - iy) = x + iy - ix - y', cartesian: '(x - y) - i(x - y)',
    pos: 'x \\gt y', neg: 'x \\lt y', argPos: -1, argNeg: 3,
    seePos: 'equal in size, the real part positive and the imaginary part negative',
    seeNeg: 'equal in size, the real part negative and the imaginary part positive',
  },
};

const q2025p2q18: CardRoutine<P2Q18> = {
  draw: () => ({ which: pick<Which>(['conj+iz', 'conj-iz', 'z+iconj', 'z-iconj']), swap: pick([false, true]) }),

  build: ({ which, swap }): Built => {
    const F = P2Q18_FORMS[which];
    // The paper asks (a)(ii) on the positive side and gives (b) on the negative.
    const [askCond, askArg, see] = swap ? [F.neg, F.argNeg, F.seeNeg] : [F.pos, F.argPos, F.seePos];
    const [givenCond, givenArg] = swap ? [F.pos, F.argPos] : [F.neg, F.argNeg];
    const asked = piTimes(q(askArg, 4));
    const given = piTimes(q(givenArg, 4));
    // Half the argument, then half a turn on, brought into (-π, π].
    const half = givenArg; // in eighths of π
    const other = half > 0 ? half - 8 : half + 8;
    const [r1, r2] = [piTimes(q(half, 8)), piTimes(q(other, 8))];
    const root1 = polar('\\sqrt{r}', r1), root2 = polar('\\sqrt{r}', r2);
    const expression = `${F.w} = ${F.expand} = ${F.cartesian}`;
    return {
      questionLines: [
        'Let $z = x + iy$ be a complex number, where $x, y \\in \\mathbb{R}.$',
        `<b>(a)</b> (i) Express $${F.w}$ in Cartesian form, where $\\bar{z}$ is the complex conjugate of $z.$`,
        `(ii) Given $${askCond}$, find the argument of $${F.w}.$`,
        '',
        `When $${givenCond}$, $${F.w} = ${polar('r', given)}$ where $r$ is the modulus of $${F.w}.$`,
        `<b>(b)</b> Use de Moivre's theorem to find, in polar form, both square roots of $${F.w}.$`,
      ],
      solutionSteps: [
        '<strong>(a)(i)</strong> $\\bar{z} = x - iy$',
        `<strong>(a)(i)</strong> $${expression}$`,
        `<strong>(a)(ii)</strong> When $${askCond}$ the real and imaginary parts are ${see}, so $\\arg(${F.w}) = ${asked}$`,
        `<strong>(b)</strong> One square root: $${root1}$`,
        `<strong>(b)</strong> Adding $2\\pi$ to the argument before halving gives the other: $${root2}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `(a)(i) $${F.cartesian}$<br>(a)(ii) $${asked}$<br>(b) $${root1}$ and $${root2}$`,
      ladder: {
        moves: [
          'What is the complex conjugate of $x + iy$, and what does multiplying by $i$ do?',
          '(a)(i) Write down $\\bar{z}$.',
          `(a)(i) ${which.includes('-') ? 'Subtract' : 'Add'} the other term, using $i^{2} = -1$, and group the real and imaginary parts.`,
          `(a)(ii) The real and imaginary parts are ${see}. Which angle is that?`,
          '(b) De Moivre: take the square root of the modulus and halve the argument.',
          '(b) Find the second root by adding a full turn to the argument before halving.',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [null, '$x - iy$', null, `$${asked}$`, `$${root1}$`, null],
        watch: { at: 5, text: 'The two square roots are half a turn apart. Give both arguments in the principal range.' },
      },
    };
  },
};

// ── 2024 P1 Q2 ─────────────────────────────────────────────────────────────
// z = ±a ± ai: polar form, then z^n evaluated by de Moivre to a single number.

interface P1Q2of2024 { a: number; n: number; quadrant: Quadrant }

/** Signs of the real and imaginary parts and the principal argument in quarters of π. */
const QUARTERS: Record<Quadrant, { re: 1 | -1; im: 1 | -1; quarters: number; where: string }> = {
  1: { re: 1, im: 1, quarters: 1, where: '' },
  2: { re: -1, im: 1, quarters: 3, where: 'the second quadrant, so ' },
  3: { re: -1, im: -1, quarters: -3, where: 'the third quadrant, so ' },
  4: { re: 1, im: -1, quarters: -1, where: 'the fourth quadrant, so ' },
};

/** `i^k` times a whole number: `16`, `-4`, `8i`, `-8i`. */
const onAxis = (size: number, turns: number) => {
  const k = ((turns % 4) + 4) % 4;
  return [`${size}`, `${size}i`, `-${size}`, `-${size}i`][k];
};

const q2024p1q2: CardRoutine<P1Q2of2024> = {
  // The power even, so z^n lands on an axis and is a single number, as 16;
  // |z^n| at most 64: a = 1 with n 4, 6 or 8, or a = 2 with n = 4.
  draw: () => {
    const [a, n] = pick<[number, number]>([[1, 4], [1, 6], [1, 8], [2, 4]]);
    return { a, n, quadrant: pick<Quadrant>([1, 2, 3, 4]) };
  },

  build: ({ a, n, quadrant }): Built => {
    const Q = QUARTERS[quadrant];
    const z = sum([{ coef: Q.re * a, body: '' }, { coef: Q.im * a, body: 'i' }]);
    const r = a === 1 ? '\\sqrt{2}' : `${a}\\sqrt{2}`;
    const theta = piTimes(q(Q.quarters, 4));
    const modulus = `|z| = \\sqrt{${a * a} + ${a * a}} = ${r}`;
    const argument = quadrant === 1 ? `\\arg z = \\tan^{-1} 1 = ${theta}` : `\\arg z = ${theta}`;
    // Multiplied but not simplified, as the scheme writes it: 8π/4.
    const m = n * Q.quarters;
    const raised = `${m < 0 ? '-' : ''}\\frac{${Math.abs(m)}\\pi}{4}`;
    const size = a ** n * 2 ** (n / 2);
    const simplified = piTimes(q(m, 4));
    const value = onAxis(size, m / 2);
    const polarZ = polar(r, theta);
    const deMoivre = polar(`(${r})^{${n}}`, raised);

    return {
      questionLines: [
        `A complex number is defined by $z = ${z}.$`,
        '<b>(a)</b> Express $z$ in polar form.',
        `<b>(b)</b> Use de Moivre's theorem to evaluate $z^{${n}}.$`,
      ],
      solutionSteps: [
        Q.where
          ? `<strong>(a)</strong> $${modulus}$; $z$ is in ${Q.where}$${argument}$`
          : `<strong>(a)</strong> $${modulus}$ and $${argument}$`,
        `<strong>(a)</strong> $z = ${polarZ}$`,
        `<strong>(b)</strong> $z^{${n}} = ${deMoivre}$`,
        `<strong>(b)</strong> $z^{${n}} = ${polar(String(size), simplified)} = ${value}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `(a) $z = ${polarZ}$<br>(b) $z^{${n}} = ${value}$`,
      ladder: {
        moves: [
          `Where does $${z}$ sit on an Argand diagram, and how far is it from the origin?`,
          '(a) Find the modulus and the argument.',
          '(a) Write $z$ in the form $r(\\cos\\theta + i\\sin\\theta)$.',
          `(b) De Moivre: raise the modulus to the power ${n} and multiply the argument by ${n}.`,
          '(b) Evaluate the cosine and sine to get a single number.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, `$${r}$ or $${theta}$`, `$${polarZ}$`, `$${trig('cos', raised)} + i${trig('sin', raised)}$`, null],
        watch: { at: 3, text: 'Simplify the argument to one number before you evaluate. Leaving it as a variable loses the mark.' },
      },
    };
  },
};

// ── 2024 P2 Q12 ────────────────────────────────────────────────────────────
// z² + p z̄ + q = 0 with y ≠ 0: the imaginary part gives x = p/2, the real
// part y² = 3x² + q. Built from the roots x0 ± y0 i: p = 2x0, q = y0² - 3x0².

interface P2Q12of2024 { x0: number; y0: number }

const q2024p2q12: CardRoutine<P2Q12of2024> = {
  draw: () => until(
    () => ({ x0: nonZero(-12, 12), y0: int(1, 15) }),
    // No constant term missing, and the constant no bigger than the paper's kind, as -156.
    ({ x0, y0 }) => y0 * y0 !== 3 * x0 * x0 && Math.abs(y0 * y0 - 3 * x0 * x0) <= 400,
  ),

  build: ({ x0, y0 }): Built => {
    const p = 2 * x0, c = y0 * y0 - 3 * x0 * x0;
    const equation = `${sum([{ coef: 1, body: 'z^{2}' }, { coef: p, body: '\\bar{z}' }, { coef: c, body: '' }])} = 0`;
    const substituted = `${sum([{ coef: 1, body: '(x + iy)^{2}' }, { coef: p, body: '(x - iy)' }, { coef: c, body: '' }])} = 0`;
    const real = `${sum([{ coef: 1, body: 'x^{2}' }, { coef: -1, body: 'y^{2}' }, { coef: p, body: 'x' }, { coef: c, body: '' }])} = 0`;
    const imaginary = `${sum([{ coef: 2, body: 'xy' }, { coef: -p, body: 'y' }])} = 0`;
    const x = `x = ${x0}`;
    const roots = `z = ${x0} \\pm ${y0 === 1 ? '' : y0}i`;
    return {
      questionLines: [
        'Given $z = x + iy$, $y \\neq 0$, solve the equation',
        '',
        `$${equation}$`,
        '',
        'where $\\bar{z}$ is the complex conjugate of $z.$',
      ],
      solutionSteps: [
        '$\\bar{z} = x - iy$',
        `$${substituted}$`,
        `Real parts: $${real}$; imaginary parts: $${imaginary}$`,
        `$2y(${sum([{ coef: 1, body: 'x' }, { coef: -x0, body: '' }])}) = 0$ and $y \\neq 0$, so $${x}$`,
        `Then $${sum([{ coef: x0 * x0, body: '' }, { coef: -1, body: 'y^{2}' }, { coef: p * x0, body: '' }, { coef: c, body: '' }])} = 0$, so $y^{2} = ${y0 * y0}$, $y = \\pm ${y0}$ and $${roots}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `$${roots}$`,
      ladder: {
        moves: [
          'If $z = x + iy$, what is $\\bar{z}$?',
          'Write $\\bar{z}$ in terms of $x$ and $y$.',
          'Substitute for $z$ and $\\bar{z}$ in the equation.',
          'Expand, and separate the real and imaginary parts.',
          'Solve the imaginary-part equation, remembering that $y \\neq 0$.',
          'Use the real-part equation to find $y$, and write both solutions.',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [null, '$x - iy$', `$${substituted}$`, `$${real}$ or $${imaginary}$`, `$${x}$`, null],
        watch: { at: 4, text: '$y \\neq 0$, so you can divide the imaginary part by $y$.' },
      },
    };
  },
};

// ── 2023 P1 Q6 ─────────────────────────────────────────────────────────────
// z = ±a ± a√3 i: polar form, then z³ real by de Moivre.

interface P1Q6of2023 { a: number; quadrant: Quadrant }

/** Signs of the real and imaginary parts, the principal argument in thirds of π, and how it is found. */
const THIRDS: Record<Quadrant, { re: 1 | -1; im: 1 | -1; thirds: number; where: string }> = {
  1: { re: 1, im: 1, thirds: 1, where: '' },
  2: { re: -1, im: 1, thirds: 2, where: 'the second quadrant, so ' },
  3: { re: -1, im: -1, thirds: -2, where: 'the third quadrant, so ' },
  4: { re: 1, im: -1, thirds: -1, where: 'the fourth quadrant, so ' },
};

const q2023p1q6: CardRoutine<P1Q6of2023> = {
  draw: () => ({ a: int(1, 4), quadrant: pick<Quadrant>([1, 2, 3, 4]) }),

  build: ({ a, quadrant }): Built => {
    const T = THIRDS[quadrant];
    const z = sum([{ coef: T.re * a, body: '' }, { coef: T.im * a, body: '\\sqrt{3}i' }]);
    const r = 2 * a;
    const theta = piTimes(q(T.thirds, 3));
    // Tripled but not simplified, as the scheme writes it: 3π/3.
    const m = 3 * T.thirds;
    const tripled = `${m < 0 ? '-' : ''}\\frac{${Math.abs(m)}\\pi}{3}`;
    // 3θ is an odd or even multiple of π, so z³ = ∓r³.
    const cube = T.thirds % 2 === 0 ? `${r ** 3}` : `-${r ** 3}`;
    const modulus = `|z| = \\sqrt{${a * a} + ${3 * a * a}} = ${r}`;
    const argument = quadrant === 1 ? `\\arg z = \\tan^{-1}\\sqrt{3} = ${theta}` : `\\arg z = ${theta}`;
    const polarZ = polar(String(r), theta);
    const deMoivre = polar(`${r}^{3}`, tripled);
    const shown = `$z^{3} = ${cube}$: its imaginary part is zero, so $z^{3}$ is real (shown)`;

    return {
      questionLines: [
        `<b>(a)</b> Express $z = ${z}$ in polar form.`,
        '<b>(b)</b> Hence, or otherwise, show that $z^{3}$ is real.',
      ],
      solutionSteps: [
        T.where
          ? `<strong>(a)</strong> $${modulus}$; $z$ is in ${T.where}$${argument}$`
          : `<strong>(a)</strong> $${modulus}$ and $${argument}$`,
        `<strong>(a)</strong> $z = ${polarZ}$`,
        `<strong>(b)</strong> By de Moivre's theorem, $z^{3} = ${deMoivre}$`,
        `<strong>(b)</strong> $z^{3} = ${polar(String(r ** 3), piTimes(q(m, 3)))} = ${cube}$: its imaginary part is zero, so $z^{3}$ is real`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `(a) $z = ${polarZ}$<br>(b) ${shown}`,
      ladder: {
        moves: [
          `Where does $${z}$ sit on an Argand diagram, and how far is it from the origin?`,
          '(a) Find the modulus and the argument.',
          '(a) Write $z$ in the form $r(\\cos\\theta + i\\sin\\theta)$.',
          '(b) De Moivre\'s theorem: cube the modulus and multiply the argument by 3.',
          '(b) Show that the imaginary part is zero.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, `$r = ${r}$ or $\\theta = ${theta}$`, `$${polarZ}$`, `$${deMoivre}$`, null],
        watch: { at: 1, text: 'Working in degrees? The degree symbol must appear at least once.' },
      },
    };
  },
};

// ── 2023 P2 Q14 ────────────────────────────────────────────────────────────
// w = a + ib with a, b > 0 and w² = p + qi: equate parts, eliminate b, and
// solve the quartic a⁴ - pa² - (q/2)² = 0 as a quadratic in a². Built from
// the answer, the paper's a = 3, b = 1 (8 + 6i).

interface P2Q14of2023 { a: number; b: number }

const q2023p2q14: CardRoutine<P2Q14of2023> = {
  // a and b different, so w² has a real part, as the paper's 8.
  draw: () => until(() => ({ a: int(1, 6), b: int(1, 6) }), ({ a, b }) => a !== b),

  build: ({ a, b }): Built => {
    const p = a * a - b * b, qq = 2 * a * b, h = a * b;
    const w2 = sum([{ coef: p, body: '' }, { coef: qq, body: 'i' }]);
    const expanded = 'a^{2} - b^{2} + 2abi';
    const equated = `a^{2} - b^{2} = ${p}$ and $2ab = ${qq}`;
    const substituted = `a^{2} - \\frac{${h * h}}{a^{2}} = ${p}`;
    const quartic = `${poly([1, 0, -p, 0, -h * h], 'a')} = 0`;
    const factorised = `(a^{2} - ${a * a})(a^{2} + ${b * b}) = 0`;
    return {
      questionLines: [
        'A complex number is defined by $w = a + ib$, where $a$ and $b$ are positive real numbers.',
        `Given $w^{2} = ${w2}$, determine the values of $a$ and $b.$`,
      ],
      solutionSteps: [
        `$(a + ib)^{2} = a^{2} + 2abi + i^{2}b^{2} = ${expanded}$`,
        `Equating real and imaginary parts: $${equated}$`,
        `$b = \\frac{${h}}{a}$, so $${substituted}$`,
        `$${quartic}$, so $${factorised}$ and $a^{2} = ${a * a}$ (as $a^{2} \\gt 0$); so $a = ${a}$ (as $a \\gt 0$) and $b = ${b}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `$a = ${a}$ and $b = ${b}$`,
      ladder: {
        moves: [
          `Square $a + ib$. Which parts must match the real and imaginary parts of $${w2}$?`,
          'Expand $(a + ib)^2$, using $i^2 = -1$.',
          'Set the real parts equal, and the imaginary parts equal.',
          'Use the imaginary equation to replace $b$ in the real one.',
          'Rearrange into a quartic, solve it as a quadratic in $a^2$, and keep the positive values.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, `$${expanded}$`, `$${equated}$`, `$${substituted}$`, null],
        watch: { at: 4, text: 'Solve it algebraically. Values found by trial and error do not earn the marks.' },
      },
    };
  },
};

// ── 2022 P1 Q3 ─────────────────────────────────────────────────────────────
// z1 times the conjugate of z2, in the form a + ib.

interface P1Q3of2022 { a: number; b: number; c: number; d: number }

const q2022p1q3: CardRoutine<P1Q3of2022> = {
  // Every part positive, as 5 + 3i and 6 + 2i; the answer's imaginary part, bc - ad, never 0.
  draw: () => until(
    () => ({ a: int(1, 9), b: int(1, 9), c: int(1, 9), d: int(1, 9) }),
    ({ a, b, c, d }) => b * c !== a * d,
  ),

  build: ({ a, b, c, d }): Built => {
    const z1 = complex(a, b), z2 = complex(c, d), conj = complex(c, -d);
    const expanded = sum([
      { coef: a * c, body: '' }, { coef: -a * d, body: 'i' }, { coef: b * c, body: 'i' }, { coef: -b * d, body: 'i^{2}' },
    ]);
    const answer = complex(a * c + b * d, b * c - a * d);
    return {
      questionLines: [
        `Given that $z_1 = ${z1}$ and $z_2 = ${z2}$, express $z_1\\overline{z_2}$ in the form $a + ib$ where $a$ and $b$ are real numbers.`,
      ],
      solutionSteps: [
        `$\\overline{z_2} = ${conj}$`,
        `$z_1\\overline{z_2} = (${z1})(${conj}) = ${expanded} = ${answer}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          `What is the complex conjugate of $${z2}$?`,
          'Write down $\\overline{z_2}$.',
          'Multiply $z_1$ by it, using $i^{2} = -1$, and write the answer as $a + ib$.',
        ],
        marks: [0, 1, 1],
        shows: [null, `$${conj}$`, null],
        watch: { at: 1, text: 'The bar is on $z_2$ only. Multiply $z_1$ as it is.' },
      },
    };
  },
};

export const ROUTINES = {
  '2022 P1 Q3': q2022p1q3,
  '2023 P1 Q6': q2023p1q6,
  '2023 P2 Q14': q2023p2q14,
  '2024 P1 Q2': q2024p1q2,
  '2024 P2 Q12': q2024p2q12,
  '2025 P1 Q3': q2025p1q3,
  '2025 P2 Q18': q2025p2q18,
  '2026 P1 Q3': q2026p1q3,
  '2026 P1 Q7': q2026p1q7,
};
