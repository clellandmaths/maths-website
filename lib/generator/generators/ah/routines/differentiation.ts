/**
 * Advanced Higher, Differentiation: how each card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/differentiation.ts` under the same label.
 */
import type { Built, CardRoutine } from '../types';
import { int, pick, until } from '../draw';
import { joinTerms, num, piTimes, poly, power, sum } from '../maths/format';
import { coprime, gcd } from '../maths/integer';
import { type Q, q, div } from '../maths/rational';

// ── 2026 P1 Q1 ─────────────────────────────────────────────────────────────
// (a) y = c x^n sec kx      (b) f(x) = e^{px} / (ax + b), simplified

interface Q1 {
  c: number; n: number; k: number;
  p: number; a: number; b: number;
}

const q2026p1q1: CardRoutine<Q1> = {
  draw: () => {
    const c = int(2, 5), n = int(2, 5), k = int(2, 5);
    const { p, a, b } = until(
      () => ({ p: int(2, 6), a: int(2, 4), b: int(1, 5) }),
      ({ p, a, b }) => coprime(a, b) && p * b !== a && gcd(p * a, p * b - a) === 1,
    );
    return { c, n, k, p, a, b };
  },

  build: ({ c, n, k, p, a, b }): Built => {
    // (a)
    const sec = `\\sec ${k}x`;
    const first = { coef: c * n, body: `${power('x', n - 1)}${sec}` };
    const second = { coef: c * k, body: `${power('x', n)}${sec}\\tan ${k}x` };
    const dydx = sum([first, second]);
    const oneTerm = `${sum([first])} + \\ldots`;
    const productRule = `${sum([first])} + ${c}x^{${n}} \\times ${sec}\\tan ${k}x \\times ${k}`;

    // (b)
    const den = poly([a, b]);
    const e = `e^{${p}x}`;
    const setUp = `\\frac{${p}${e}(${den}) - \\ldots}{(${den})^{2}}`;
    const whole = `\\frac{${p}${e}(${den}) - ${a}${e}}{(${den})^{2}}`;
    const simplified = `\\frac{${e}(${poly([p * a, p * b - a])})}{(${den})^{2}}`;

    return {
      questionLines: [
        'Differentiate:',
        `<b>(a)</b> $y = ${c}x^{${n}}${sec}$`,
        `<b>(b)</b> $f(x) = \\frac{${e}}{${den}}$, simplifying your answer.`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> By the product rule, $\\frac{dy}{dx} = ${productRule}$`,
        `<strong>(a)</strong> $\\frac{dy}{dx} = ${dydx}$`,
        `<strong>(b)</strong> By the quotient rule, $f'(x) = ${setUp}$`,
        `<strong>(b)</strong> $f'(x) = ${whole}$`,
        `<strong>(b)</strong> $f'(x) = ${simplified}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `(a) $\\frac{dy}{dx} = ${dydx}$<br>(b) $f'(x) = ${simplified}$`,
      ladder: {
        moves: [
          'Each function is two pieces joined together. Are they multiplied or divided?',
          `(a) Use the product rule, differentiating $${c}x^{${n}}$ and $${sec}$ separately. The chain rule brings out a factor from the $${k}x$.`,
          `(b) Set up the quotient rule with $(${den})^{2}$ as the denominator.`,
          '(b) Complete the numerator: the top\'s derivative times the bottom, minus the top times the bottom\'s derivative.',
          '(b) Take out the common factor and collect the like terms in the numerator.',
        ],
        marks: [0, 2, 1, 1, 1],
        shows: [null, `$${oneTerm}$`, `$${setUp}$`, `$${whole}$`, null],
        watch: { at: 4, text: 'The last mark needs the numerator\'s like terms collected, not just the quotient written out.' },
      },
    };
  },
};

// ── 2026 P2 Q1 ─────────────────────────────────────────────────────────────
// f(x) = c sin^{-1} kx

interface P2Q1 { c: number; k: number }

const q2026p2q1: CardRoutine<P2Q1> = {
  draw: () => ({ c: int(2, 9), k: int(2, 9) }),

  build: ({ c, k }): Built => {
    const start = `\\frac{${c}}{\\sqrt{1 - (${k}x)^{2}}}`;
    const answer = `\\frac{${c * k}}{\\sqrt{1 - ${k * k}x^{2}}}`;
    return {
      questionLines: [`Differentiate $f(x) = ${c}\\sin^{-1}${k}x.$`],
      solutionSteps: [
        `Differentiating the inverse sine, keeping the ${c} in front: $${start} \\times \\ldots$`,
        `By the chain rule, $f'(x) = ${start} \\times ${k} = ${answer}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$f'(x) = ${answer}$`,
      ladder: {
        moves: [
          'Which standard derivative has $\\sqrt{1 - (\\ldots)^{2}}$ underneath?',
          `Differentiate $\\sin^{-1} ${k}x$, keeping the ${c} in front.`,
          `Apply the chain rule for the $${k}x$ inside.`,
        ],
        marks: [0, 1, 1],
        shows: [null, `$${start}$`, null],
        watch: { at: 2, text: `The chain rule multiplies by the derivative of $${k}x$. Leaving it out loses the second mark.` },
      },
    };
  },
};

// ── 2026 P2 Q5 ─────────────────────────────────────────────────────────────
// y = x^{kx} by logarithmic differentiation

/** k = top/bottom: bottom 1 for a whole k, 2 for a half. */
interface P2Q5 { top: number; bottom: 1 | 2 }

/**
 * The owner, on the sheet: widen it, then "Yes to both": whole k from 2 to 12
 * and the halves 1/2 to 11/2, either sign (34), and the factorised answer.
 */
const Q5_POWERS: readonly [number, 1 | 2][] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  .map((n): [number, 1 | 2] => [n, 1])
  .concat([1, 3, 5, 7, 9, 11].map((n): [number, 1 | 2] => [n, 2]))
  .flatMap(([n, d]): [number, 1 | 2][] => [[n, d], [-n, d]]);

const q2026p2q5: CardRoutine<P2Q5> = {
  draw: () => {
    const [top, bottom] = pick(Q5_POWERS);
    return { top, bottom };
  },

  build: ({ top, bottom }): Built => {
    const k = q(top, bottom);
    const y = `x^{${sum([{ coef: k, body: 'x' }])}}`;
    const DY = '\\frac{1}{y}\\frac{dy}{dx}';
    const logs = sum([{ coef: k, body: 'x\\ln x' }]);
    const lnTerm = { coef: k, body: '\\ln x' };
    const productTerm = { coef: k, body: 'x \\cdot \\frac{1}{x}' };
    const oneTerm = `${sum([lnTerm])} + \\ldots`;
    const otherTerm = joinTerms(['\\ldots', sum([productTerm])]);
    const both = sum([lnTerm, productTerm]);
    const answer = `\\frac{dy}{dx} = ${y}(${sum([lnTerm, { coef: k, body: '' }])}) = ${sum([{ coef: k, body: `${y}(\\ln x + 1)` }])}`;
    return {
      questionLines: [
        `Given $y = ${y}$, use logarithmic differentiation to find $\\frac{dy}{dx}.$`,
        'Write your answer in terms of $x.$',
      ],
      solutionSteps: [
        `Taking logs of both sides: $\\ln y = ${logs}$`,
        `Differentiating the left-hand side: $${DY}$`,
        `By the product rule, $${DY} = ${oneTerm}$`,
        `$${DY} = ${both}$`,
        `So $${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          'The power has $x$ in it. What does taking logs do to a power?',
          'Take natural logs of both sides and bring the power down.',
          'Differentiate the left-hand side implicitly.',
          'Differentiate the right-hand side with the product rule.',
          `Multiply through by $y$ and replace it with $${y}$.`,
        ],
        marks: [0, 1, 1, 2, 1],
        shows: [null, null, `$${DY}$`, `$${oneTerm}$ or $${otherTerm}$`, null],
        watch: { at: 4, text: 'The answer must be in terms of $x$ only, so replace $y$ at the end.' },
      },
    };
  },
};

// ── 2026 P2 Q7 ─────────────────────────────────────────────────────────────
// (a) dy/dx for x = c ln(at + b), y = t0 t - t²/2; (b) the stationary point

interface P2Q7 { c: number; a: number; b: number; t0: number }

const q2026p2q7: CardRoutine<P2Q7> = {
  draw: () => {
    const c = int(2, 6), t0 = int(1, 3);
    const { a, b } = until(() => ({ a: int(2, 4), b: int(1, 5) }), ({ a, b }) => coprime(a, b));
    return { c, a, b, t0 };
  },

  build: ({ c, a, b, t0 }): Built => {
    const inner = poly([a, b], 't');
    const x = `${c}\\ln(${inner})`;
    const y = sum([{ coef: t0, body: 't' }, { coef: q(-1, 2), body: 't^{2}' }]);
    const dxdt = `\\frac{${c * a}}{${inner}}`;
    const dydt = sum([{ coef: t0, body: '' }, { coef: -1, body: 't' }]);
    const dydx = `\\frac{(${dydt})(${inner})}{${c * a}}`;
    const point = `\\left(${c}\\ln ${a * t0 + b}, ${num(q(t0 * t0, 2))}\\right)`;
    return {
      questionLines: [
        'A curve is defined parametrically by',
        '',
        `$x = ${x},\\quad y = ${y},$ where $t \\gt 0.$`,
        '',
        '<b>(a)</b> Find an expression for $\\frac{dy}{dx}.$ Simplify your answer.',
        '<b>(b)</b> Find the coordinates of the stationary point on the curve.',
      ],
      solutionSteps: [
        `<strong>(a)</strong> $\\frac{dx}{dt} = ${dxdt}$ and $\\frac{dy}{dt} = ${dydt}$`,
        `<strong>(a)</strong> $\\frac{dy}{dx} = \\frac{dy}{dt} \\div \\frac{dx}{dt} = ${dydx}$`,
        `<strong>(b)</strong> $\\frac{dy}{dx} = 0$ when $t = ${t0}$ or $t = ${num(q(-b, a))}$`,
        `<strong>(b)</strong> Since $t \\gt 0$, $t = ${t0}$, and the stationary point is $${point}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `(a) $\\frac{dy}{dx} = ${dydx}$<br>(b) $${point}$`,
      ladder: {
        moves: [
          'For a parametric curve, how do you get $\\frac{dy}{dx}$ from the two derivatives with respect to $t$?',
          '(a) Differentiate $x$ with respect to $t$, using the chain rule on the log.',
          '(a) Divide $\\frac{dy}{dt}$ by $\\frac{dx}{dt}$ and simplify the fraction.',
          '(b) Set $\\frac{dy}{dx} = 0$ and solve for $t$.',
          '(b) Keep only the value allowed by $t \\gt 0$, and find $x$ and $y$ from it.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, `$\\frac{dx}{dt} = ${dxdt}$`, `$\\frac{dy}{dx} = ${dydx}$`, null, null],
        watch: { at: 4, text: 'The question says $t \\gt 0$. Give one point only, having rejected the other value of $t$.' },
      },
    };
  },
};

// ── 2026 P2 Q8 ─────────────────────────────────────────────────────────────
// V = A(b + √h)^n - A bⁿ; water pumped out at a rate; dh/dt at a depth

interface P2Q8 { A: number; b: number; n: number; s: number; rate: number }

const q2026p2q8: CardRoutine<P2Q8> = {
  // `s` is the root of the depth; `rate` is in tenths of a cubic metre a second.
  // dV/dh at that depth, A n (b + s)^{n-1} / 2s, is kept whole, as the paper's is.
  draw: () => until(
    () => ({ A: int(6, 24), b: pick([1, 2]), n: int(4, 6), s: int(2, 6), rate: int(2, 9) }),
    ({ A, b, n, s }) => (A * n * (b + s) ** (n - 1)) % (2 * s) === 0,
  ),

  build: ({ A, b, n, s, rate }): Built => {
    const depth = s * s;
    const R = `0.${rate}`;
    const V = `${A}(${b} + \\sqrt{h})^{${n}} - ${A * b ** n}`;
    const dVdh = `${A} \\times ${n}(${b} + h^{\\frac{1}{2}})^{${n - 1}} \\times \\frac{1}{2}h^{-\\frac{1}{2}}`;
    const atDepth = (A * n * (b + s) ** (n - 1)) / (2 * s);
    const dhdt = num(div(q(-rate, 10), q(atDepth)));
    const chain = '\\frac{dh}{dt} = \\frac{dh}{dV} \\times \\frac{dV}{dt}';
    return {
      questionLines: [
        'The volume, $V$ cubic metres, of water held in a reservoir is given by',
        '',
        `$V = ${V}$`,
        '',
        'where $h$ metres is the depth of water.',
        `Water is pumped out of the reservoir at a constant rate of $${R}$ m³s⁻¹.`,
        `Find the rate of change of the depth of water in the reservoir when the depth is ${depth} metres.`,
      ],
      solutionSteps: [
        `Water is leaving, so $\\frac{dV}{dt} = -${R}$`,
        `$\\frac{dV}{dh} = ${dVdh}$`,
        `$${chain}$`,
        `At $h = ${depth}$, $\\frac{dV}{dh} = ${atDepth}$, so $\\frac{dh}{dt} = \\frac{1}{${atDepth}} \\times (-${R}) = ${dhdt}$ m s⁻¹`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `$\\frac{dh}{dt} = ${dhdt}$ m s⁻¹`,
      ladder: {
        moves: [
          'You know how fast the volume changes and want how fast the depth changes. Which rule links them?',
          'Write the pumping rate as $\\frac{dV}{dt}$, with the sign that shows water is leaving.',
          'Differentiate $V$ with respect to $h$, using the chain rule on the bracket.',
          'Write the chain rule linking $\\frac{dh}{dt}$, $\\frac{dh}{dV}$ and $\\frac{dV}{dt}$.',
          `Substitute $h = ${depth}$ and evaluate $\\frac{dh}{dt}$, with units.`,
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, `$\\frac{dV}{dt} = -${R}$`, `$\\frac{dV}{dh} = ${dVdh}$`, `$${chain}$`, null],
        watch: { at: 4, text: 'Give the units, and start the last line "$\\frac{dh}{dt} =$". That mark needs both.' },
      },
    };
  },
};

// ── 2026 P2 Q10 ────────────────────────────────────────────────────────────
// (a) implicit dy/dx for x²e^{ky} + x² + y^m = C; (b) why it is never zero

interface P2Q10 { k: number; m: number; C: number }

const q2026p2q10: CardRoutine<P2Q10> = {
  // k and m never both even: then top and bottom share a 2, and the paper's
  // answer (k = 6, m = 5) has no common factor.
  draw: () => until(
    () => ({ k: int(2, 9), m: int(3, 7), C: int(20, 90) }),
    ({ k, m }) => k % 2 === 1 || m % 2 === 1,
  ),

  build: ({ k, m, C }): Built => {
    const E = `e^{${k}y}`;
    const D = '\\frac{dy}{dx}';
    const yTerm = `${m}y^{${m - 1}}`;
    const productRule = `2x${E} + ${k}x^{2}${E}${D}`;
    const explicit = `\\frac{-2x${E} - 2x}{${yTerm} + ${k}x^{2}${E}}`;
    const factorised = `\\frac{-2x(${E} + 1)}{${k}x^{2}${E} + ${yTerm}}`;
    return {
      questionLines: [
        `A curve is defined by the equation $x^{2}${E} + x^{2} + y^{${m}} = ${C}.$`,
        `<b>(a)</b> Find $${D}$ in terms of $x$ and $y.$`,
        '<b>(b)</b> Given $x \\gt 0$, explain why the derivative is never zero.',
      ],
      solutionSteps: [
        `<strong>(a)</strong> By the product rule, $\\frac{d}{dx}\\left(x^{2}${E}\\right) = 2x${E} + \\ldots$`,
        `<strong>(a)</strong> $\\frac{d}{dx}\\left(x^{2}${E}\\right) = ${productRule}$`,
        `<strong>(a)</strong> So $${productRule} + 2x + ${yTerm}${D} = 0$`,
        `<strong>(a)</strong> $${D} = ${explicit} = ${factorised}$`,
        `<strong>(b)</strong> For $x \\gt 0$, $-2x \\ne 0$, and $${E} + 1 \\gt 0$ for every $y$, so the numerator is never zero. A fraction is zero only when its numerator is, so $${D}$ is never zero.`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `(a) $${D} = ${factorised}$<br>(b) For $x \\gt 0$ the numerator $-2x(${E} + 1)$ is never zero, since $-2x \\ne 0$ and $${E} + 1 \\gt 0$, so the derivative is never zero.`,
      ladder: {
        moves: [
          'The first term is a product of two functions of different variables. Which rule does it need?',
          `(a) Differentiate $x^{2}${E}$ with the product rule. Every $y$-term you differentiate picks up $${D}$.`,
          `(a) Differentiate $x^{2}$ and $y^{${m}}$, and the constant.`,
          `(a) Gather the $${D}$ terms on one side and make $${D}$ the subject.`,
          '(b) When is a fraction zero? Look at each factor of the numerator for $x \\gt 0$.',
        ],
        marks: [0, 2, 1, 1, 1],
        shows: [
          null,
          `$2x${E} + \\ldots$ or $\\ldots + ${k}x^{2}${E}${D}$`,
          `$\\ldots + 2x + ${yTerm}${D} = 0$`,
          `$${D} = ${explicit}$`,
          null,
        ],
        watch: { at: 4, text: 'Look only at the numerator in (b). Talking about the denominator being zero loses the mark.' },
      },
    };
  },
};

// ── 2026 P2 Q16 ────────────────────────────────────────────────────────────
// (a) d/dx ln(cos x) = -tan x; (b) ∫x g(x) dx = m x tan kx - ∫m tan kx dx, m = jk:
// (i) from 0 to the limit where kx is π/angle, (ii) g(x)

interface P2Q16 { k: number; j: number; angle: 3 | 4 | 6 }

/** m U tan kU + j ln cos kU with kU = π/angle and m = jk: j(α tan α + ln cos α), exact. */
function exactValue(j: number, angle: 3 | 4 | 6): string {
  const rootThree = (c: Q) =>`\\frac{${c.n === 1n ? '' : c.n}\\sqrt{3}}{${c.d}}\\pi`;
  if (angle === 3) return sum([{ coef: 1, body: rootThree(q(j, 3)) }, { coef: -j, body: '\\ln 2' }]);
  if (angle === 4) return sum([{ coef: 1, body: piTimes(q(j, 4)) }, { coef: q(-j, 2), body: '\\ln 2' }]);
  return sum([{ coef: 1, body: rootThree(q(j, 18)) }, { coef: j, body: '\\ln\\frac{\\sqrt{3}}{2}' }]);
}

const q2026p2q16: CardRoutine<P2Q16> = {
  draw: () => ({ k: int(2, 4), j: pick([1, 2]), angle: pick([3, 4, 6] as const) }),

  build: ({ k, j, angle }): Built => {
    const m = j * k;
    const U = piTimes(q(1, angle * k));
    const tan = `\\tan ${k}x`;
    const lnCos = `\\ln(\\cos ${k}x)`;
    const antiderivative = sum([{ coef: m, body: `x${tan}` }, { coef: j, body: lnCos }]);
    const value = exactValue(j, angle);
    const g = `${m * k}\\sec^{2}${k}x`;
    return {
      questionLines: [
        '<b>(a)</b> Given $y = \\ln(\\cos x),\\ 0 \\le x \\lt \\frac{\\pi}{2}$, show that $\\frac{dy}{dx} = -\\tan x.$',
        'For a function $g(x)$, it is known that',
        '',
        `$\\int xg(x)\\,dx = ${m}x${tan} - \\int ${m}${tan}\\,dx.$`,
        '',
        '<b>(b)</b>',
        `(i) Determine the exact value of $\\int_{0}^{${U}} xg(x)\\,dx.$`,
        '(ii) Find an expression for $g(x)$ in terms of $x.$',
      ],
      solutionSteps: [
        '<strong>(a)</strong> $\\frac{dy}{dx} = \\frac{1}{\\cos x} \\times \\ldots$',
        '<strong>(a)</strong> $\\frac{dy}{dx} = \\frac{1}{\\cos x} \\times (-\\sin x) = -\\tan x$',
        `<strong>(b)(i)</strong> From (a), $\\int ${m}${tan}\\,dx = ${sum([{ coef: -j, body: lnCos }])} + c$`,
        `<strong>(b)(i)</strong> $\\int_{0}^{${U}} xg(x)\\,dx = \\left[${antiderivative}\\right]_{0}^{${U}} = ${value}$`,
        `<strong>(b)(ii)</strong> Comparing with $\\int u\\frac{dv}{dx}\\,dx = uv - \\int v\\frac{du}{dx}\\,dx$: $u = x$ and $v = ${m}${tan}$, so $g(x) = \\frac{dv}{dx} = ${g}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `(a) $\\frac{dy}{dx} = -\\tan x$ (shown)<br>(b)(i) $${value}$<br>(b)(ii) $g(x) = ${g}$`,
      ladder: {
        moves: [
          '$\\ln$ of a function: which rule, and what does the inside contribute?',
          '(a) Differentiate $\\ln$ of the cosine, starting with 1 over the cosine.',
          '(a) Multiply by the derivative of the cosine and simplify.',
          `(b)(i) Use (a) to integrate $${m}${tan}$.`,
          '(b)(i) Put in the limits and evaluate exactly.',
          '(b)(ii) Compare the given line with the integration by parts formula: which part plays $\\frac{dv}{dx}$?',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [
          null,
          '$\\frac{1}{\\cos x} \\times \\ldots$',
          '$\\frac{1}{\\cos x} \\times (-\\sin x) = -\\tan x$',
          `$\\ldots${lnCos}$`,
          `$${value}$`,
          null,
        ],
        watch: { at: 3, text: `Part (a) gives the integral of $\\tan$. Adjust for the $${k}x$ inside rather than starting again.` },
      },
    };
  },
};

// ── 2025 P1 Q2 ─────────────────────────────────────────────────────────────
// f(x) = (ax^3 + bx)/(c + dx) by the quotient rule, the numerator collected

interface P1Q2 { a: number; b: number; c: number; d: number }

const q2025p1q2: CardRoutine<P1Q2> = {
  draw: () => until(
    () => ({ a: int(1, 3), b: pick([-4, -3, -2, -1, 1, 2, 3, 4]), c: int(1, 5), d: int(1, 3) }),
    // The numerator's two terms share no factor, the denominator's none, as
    // the paper's; nothing cancels (the top is never 0 at x = -c/d); and the
    // answer's top, 2ad x^3 + 3ac x^2 + bc, has no common factor, as 8, 18, 3.
    ({ a, b, c, d }) => coprime(a, b) && coprime(c, d) && a * c * c + b * d * d !== 0
      && gcd(gcd(2 * a * d, 3 * a * c), b * c) === 1,
  ),

  build: ({ a, b, c, d }): Built => {
    const top = poly([a, 0, b, 0]);
    const den = sum([{ coef: c, body: '' }, { coef: d, body: 'x' }]);
    const dTop = poly([3 * a, 0, b]);
    const f = `\\frac{${top}}{${den}}`;
    const setUp = `\\frac{(${dTop})(${den}) - \\ldots}{(${den})^{2}}`;
    const whole = `\\frac{(${dTop})(${den}) - (${top})(${d})}{(${den})^{2}}`;
    // (3ax^2 + b)(c + dx) - (ax^3 + bx)d: the x terms cancel.
    const simplified = `\\frac{${poly([2 * a * d, 3 * a * c, 0, b * c])}}{(${den})^{2}}`;

    return {
      questionLines: [
        `Given $f(x) = ${f}$, find $f'(x).$ Simplify your answer.`,
      ],
      solutionSteps: [
        `By the quotient rule, $f'(x) = ${setUp}$`,
        `$f'(x) = ${whole}$`,
        `$f'(x) = ${simplified}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `$f'(x) = ${simplified}$`,
      ladder: {
        moves: [
          'The function is one expression divided by another. Which rule does that need?',
          `Set up the quotient rule with $(${den})^{2}$ as the denominator.`,
          'Complete the numerator: the top\'s derivative times the bottom, minus the top times the bottom\'s derivative.',
          'Expand the numerator and collect like terms.',
        ],
        marks: [0, 1, 1, 1],
        shows: [null, `$${setUp}$`, `$${whole}$`, null],
        watch: { at: 3, text: 'The simplified numerator should have a term in $x^{3}$. If it does not, check the expansion.' },
      },
    };
  },
};

export const ROUTINES = {
  '2025 P1 Q2': q2025p1q2,
  '2026 P1 Q1': q2026p1q1,
  '2026 P2 Q1': q2026p2q1,
  '2026 P2 Q5': q2026p2q5,
  '2026 P2 Q7': q2026p2q7,
  '2026 P2 Q8': q2026p2q8,
  '2026 P2 Q10': q2026p2q10,
  '2026 P2 Q16': q2026p2q16,
};
