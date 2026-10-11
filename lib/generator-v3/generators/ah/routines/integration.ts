/**
 * Advanced Higher, Integration: how each card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/integration.ts` under the same label.
 */
import type { Built, CardRoutine } from '../types';
import { int, pick, until } from '../../core/draw';
import { num, piTimes, poly, power, sum } from '../../core/maths/format';
import { type Q, q } from '../../core/maths/rational';
import { type Element, type Pt, type Scene, pt } from '../../../diagrams/scene';
import { renderScene } from '../../../diagrams/render';

// ── 2026 P1 Q6 ─────────────────────────────────────────────────────────────
// (a) the integral of ax(x - k)^n by u = x - k; (b) the volume of y = c√(ax)(x - k)^{n/2}.

interface Q6 { k: number; n: number; a: number; c: number }

/** `(x - 1)^{4}`, or `(x - 1)` to the first power. */
const bracketPower = (k: number, p: number) => `(${poly([1, -k])})${p === 1 ? '' : `^{${p}}`}`;

/**
 * The (k, n, a) the card sets. The owner, on the 2026 P1 sheet: "Could the power
 * go up?", and "Don't make it slightly harder": the paper's (x - k)^4, or the power
 * up, (x - 1)^6; no coefficient inside the bracket, which adds a step the paper does
 * not have. Then, on the variation-depth sheet (card 16, 2026-10-05): a coefficient
 * of x, a = 1, 2, 3 or 5 (never 4: √(4x) is 2√x, which no paper writes), kept to the
 * by-hand size the card already had, a k^{n+2} at most 2^6 = 64 (the owner turned
 * down k = 2 with the power 6 for its 256). So k = 2 keeps a = 1: nine integrals,
 * one draw in nine each.
 */
const Q6_FORMS: readonly Omit<Q6, 'c'>[] = [
  ...[1, 2, 3, 5].flatMap(a => [{ k: 1, n: 4, a }, { k: 1, n: 6, a }]),
  { k: 2, n: 4, a: 1 },
];

const q2026p1q6: CardRoutine<Q6> = {
  draw: () => ({ ...pick(Q6_FORMS), c: int(1, 5) }),

  build: ({ k, n, a, c }): Built => {
    const sub = poly([1, -k]);
    const ax = a === 1 ? 'x' : `${a}x`;
    const integrand = `${ax}${bracketPower(k, n)}`;
    const top = q(a, n + 2), next = q(a * k, n + 1);
    const inU = `\\int (${sum([{ coef: a, body: `u^{${n + 1}}` }, { coef: a * k, body: `u^{${n}}` }])})\\,du`;
    const result = (v: string) => sum([{ coef: top, body: `${v}^{${n + 2}}` }, { coef: next, body: `${v}^{${n + 1}}` }]);
    const answerA = `${sum([{ coef: top, body: bracketPower(k, n + 2) }, { coef: next, body: bracketPower(k, n + 1) }])} + c`;

    const cc = c * c;
    const lead = cc === 1 ? '' : `${cc}`;
    const y = `${c === 1 ? '' : c}\\sqrt{${ax}}${bracketPower(k, n / 2)}`;
    // y² as c² times (a)'s integrand, so the match with (a) shows.
    const ySquared = a === 1 || cc === 1 ? `${lead}${integrand}` : `${cc} \\times ${integrand}`;
    const bracket = `\\left[${sum([{ coef: top, body: bracketPower(k, n + 2) }, { coef: next, body: bracketPower(k, n + 1) }])}\\right]_{0}^{${k}}`;
    // At x = 0, with n even: a k^{n+2}/(n + 2) - a k^{n+2}/(n + 1).
    const kp = a * k ** (n + 2);
    const atZero = `\\left(${num(q(kp, n + 2))} - ${num(q(kp, n + 1))}\\right)`;
    const volume = piTimes(q(cc * kp, (n + 1) * (n + 2)));

    return {
      questionLines: [
        `<b>(a)</b> Use the substitution $u = ${sub}$ to find $\\int ${integrand}\\,dx.$`,
        `<b>(b)</b> Hence find the exact volume of the solid formed by rotating the curve with equation $y = ${y}$ about the $x$ axis through $2\\pi$ radians, from $x = 0$ to $x = ${k}.$`,
      ],
      solutionSteps: [
        `<strong>(a)</strong> $u = ${sub}$, so $\\frac{du}{dx} = 1$, $du = dx$ and $x = ${poly([1, k], 'u')}$`,
        `<strong>(a)</strong> $\\int ${a === 1 ? '' : a}(${poly([1, k], 'u')})u^{${n}}\\,du = ${inU}$`,
        `<strong>(a)</strong> $= ${result('u')} + c = ${answerA}$`,
        `<strong>(b)</strong> $V = \\pi\\int_{0}^{${k}} y^{2}\\,dx$`,
        `<strong>(b)</strong> $= \\pi\\int_{0}^{${k}} ${ySquared}\\,dx$`,
        `<strong>(b)</strong> $= ${lead}\\pi${bracket}$`,
        `<strong>(b)</strong> $= ${lead}\\pi\\left(0 - ${atZero}\\right) = ${volume}$ cubic units`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1],
      finalAnswer: `(a) $${answerA}$<br>(b) $${volume}$ cubic units`,
      ladder: {
        moves: [
          `With $u = ${sub}$, what is $x$ in terms of $u$?`,
          '(a) Differentiate the substitution to replace $dx$.',
          '(a) Rewrite the whole integral in terms of $u$ and expand the bracket.',
          '(a) Integrate each power of $u$, then substitute back for $u$.',
          '(b) Write the volume integral, with its limits.',
          '(b) Square $y$ and tidy it so that it matches the integral in (a).',
          '(b) Use your answer to (a), with the limits.',
          '(b) Evaluate, keeping the answer exact.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1],
        shows: [
          null,
          '$\\frac{du}{dx} = 1$ or $du = dx$',
          `$${inU}$`,
          `$${answerA}$`,
          `$\\pi\\int_{0}^{${k}} y^{2}\\,dx$`,
          `$\\pi\\int_{0}^{${k}} ${ySquared}\\,dx$`,
          `$${lead}\\pi${bracket}$`,
          null,
        ],
        watch: { at: 4, text: 'The volume integral needs its limits and $dx$ written, or that mark goes.' },
      },
    };
  },
};

// ── 2026 P2 Q11 ────────────────────────────────────────────────────────────
// ∫ (2x + ma)/(x² + a²) dx = ln(x² + a²) + m tan^{-1}(x/a) + c

interface P2Q11 { a: number; m: number }

const q2026p2q11: CardRoutine<P2Q11> = {
  draw: () => ({ a: int(2, 6), m: int(1, 4) }),

  build: ({ a, m }): Built => {
    const bottom = `x^{2} + ${a * a}`;
    const integrand = `\\frac{2x + ${m * a}}{${bottom}}`;
    const split = `\\frac{2x}{${bottom}} + \\frac{${m * a}}{${bottom}}`;
    const atan = `\\tan^{-1}\\left(\\frac{x}{${a}}\\right)`;
    const answer = `${sum([{ coef: 1, body: `\\ln(${bottom})` }, { coef: m, body: atan }])} + c`;
    return {
      questionLines: ['Find', '', `$\\int${integrand}\\,dx.$`],
      solutionSteps: [
        `$${integrand} = ${split}$`,
        `$\\int \\frac{2x}{${bottom}}\\,dx = \\ln(${bottom})$, as the top is the derivative of the bottom`,
        `$\\int \\frac{${m * a}}{${bottom}}\\,dx = ${m * a} \\times \\frac{1}{${a}}${atan}$`,
        `$\\int${integrand}\\,dx = ${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          'The top is close to the derivative of the bottom. Could you split the fraction in two?',
          `Split the integrand into two fractions over $${bottom}$.`,
          'Integrate the first: its top is the derivative of its bottom.',
          'Integrate the second as an inverse tangent.',
          'Put the coefficients right in both terms and add the constant.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, `$${split}$`, null, `$${atan}$`, null],
        watch: { at: 4, text: 'Check both coefficients by differentiating your answer: it should give back the integrand.' },
      },
    };
  },
};

// ── 2025 P1 Q5 ─────────────────────────────────────────────────────────────
// ∫ a/(1 + k²x²) dx = (a/k) tan^{-1}(kx) + c, a/k never whole, as the paper's 1/2

interface P1Q5 { a: number; k: number }

const q2025p1q5: CardRoutine<P1Q5> = {
  draw: () => {
    const k = int(2, 10);
    return { k, a: pick([1, 2, 3].filter(a => a % k !== 0)) };
  },

  build: ({ a, k }): Built => {
    const integrand = `\\frac{${a}}{1 + ${k * k}x^{2}}`;
    const atan = `\\tan^{-1}${k}x`;
    const answer = `${sum([{ coef: q(a, k), body: atan }])} + c`;
    const standard = a === 1
      ? `$\\int \\frac{1}{1 + (${k}x)^{2}}\\,dx$ is an inverse tangent: $\\ldots${atan}$`
      : `$\\int \\frac{${a}}{1 + (${k}x)^{2}}\\,dx = ${a}\\int \\frac{1}{1 + (${k}x)^{2}}\\,dx$, an inverse tangent: $\\ldots${atan}$`;
    return {
      questionLines: [`Find $\\int ${integrand}\\,dx.$`],
      solutionSteps: [
        standard,
        `$\\int ${integrand}\\,dx = ${answer}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          'The denominator is 1 plus a square. Which standard integral has that shape?',
          'Write the integral as an inverse tangent of a multiple of $x$.',
          `Get the coefficient right for the $${k}x$ inside, and add the constant.`,
        ],
        marks: [0, 1, 1],
        shows: [null, `$\\tan^{-1}\\ldots x$`, null],
        watch: { at: 1, text: 'This is an inverse tangent, not a logarithm. A $\\ln$ answer earns nothing.' },
      },
    };
  },
};

// ── 2025 P2 Q16 ────────────────────────────────────────────────────────────
// ∫ e^{px} sin qx dx by parts twice, u = e^{px} both times, the integral
// reappearing: (p sin qx - q cos qx) e^{px}/(p² + q²) + c

interface P2Q16 { p: number; qq: number }

const q2025p2q16: CardRoutine<P2Q16> = {
  draw: () => until(() => ({ p: int(1, 5), qq: int(2, 7) }), ({ p, qq }) => p !== qq),

  build: ({ p, qq }): Built => {
    const E = p === 1 ? 'e^{x}' : `e^{${p}x}`;
    const S = `\\sin ${qq}x`, C = `\\cos ${qq}x`;
    const first = { coef: q(-1, qq), body: `${E}${C}` };
    const firstText = sum([first]);
    const setUp = `${firstText} - \\ldots`;
    const firstDone = `${firstText} - \\int -\\frac{1}{${qq}} \\cdot ${p === 1 ? '' : p}${E}${C}\\,dx`;
    const secondStart = `${firstText} + ${num(q(p, qq))}\\left[\\frac{1}{${qq}}${E}${S} - \\ldots\\right]`;
    const reappears = sum([first, { coef: q(p, qq * qq), body: `${E}${S}` }, { coef: q(-p * p, qq * qq), body: 'I' }]);
    const m = p * p + qq * qq;
    const answer = `${sum([{ coef: q(p, m), body: `${E}${S}` }, { coef: q(-qq, m), body: `${E}${C}` }])} + c`;
    // The coefficient in lowest terms, "5I", not "(20/4)I" (the owner, full read 2026-10-05).
    const collected = `${sum([{ coef: q(m, qq * qq), body: 'I' }])} = ${sum([{ coef: q(p, qq * qq), body: `${E}${S}` }, first])}`;
    return {
      questionLines: [
        'Use integration by parts to find',
        '',
        `$\\int ${E}${S}\\,dx.$`,
      ],
      solutionSteps: [
        `With $u = ${E}$ and $\\frac{dv}{dx} = ${S}$: $I = ${setUp}$`,
        `$I = ${firstDone}$`,
        `Again with $u = ${E}$: $I = ${secondStart}$`,
        `$I = ${reappears}$`,
        `$${collected}$, so $I = ${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          'Neither factor gets simpler when you differentiate it. What happens if you apply integration by parts twice?',
          'Choose which part to integrate, and start the first application.',
          'Complete the first application.',
          'Start the second application, keeping the same choice of which part to integrate.',
          'Carry on until the original integral appears again.',
          'Collect the original integral on one side and solve for it.',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [null, `$${setUp}$`, `$${firstDone}$`, `$${secondStart}$`, `$I = ${reappears}$`, null],
        watch: { at: 3, text: 'Keep the same choice in the second application. Swapping undoes the first.' },
      },
    };
  },
};

// ── 2025 P2 Q11 ────────────────────────────────────────────────────────────
// (a) ∫ x e^{-2m x²} dx by u = 2m x²; (b) the volume of y = c√x / e^{m x²}
// from 0 to 1, whose y² is c² times (a)'s integrand, as the paper arranges.

interface P2Q11of2025 { c: number; m: number; a: number }

/**
 * The paper's figure: arrowed axes, 0 and 1 on the x-axis, the curve from
 * the origin to x = 1 and a dashed line down from its end. No numbers on the
 * y-axis, so the curve is scaled to a fixed height: c never changes the
 * picture, and m changes only its shape, as the equation does.
 */
function curveFigure(m: number): Scene {
  const W = 100, H = 56, OVER = 12, ARROW = 4.5;
  const f = (x: number) => Math.sqrt(x) * Math.exp(-m * x * x);
  const samples = Array.from({ length: 121 }, (_, i) => i / 120);
  const top = Math.max(...samples.map(f));
  const D = (x: number, y: number): Pt => pt(x * W, (y / top) * H);
  const head = (at: Pt, dx: number, dy: number): Element[] => [0.4, -0.4].map(turn => {
    const [cs, sn] = [Math.cos(turn), Math.sin(turn)];
    return { kind: 'segment', from: at, to: pt(at.x - ARROW * (dx * cs - dy * sn), at.y - ARROW * (dx * sn + dy * cs)), decoration: true };
  });
  const xEnd = pt(W + OVER * 2, 0), yEnd = pt(0, H + OVER);
  const end = D(1, f(1));
  return {
    elements: [
      { kind: 'segment', from: pt(0, 0), to: xEnd }, ...head(xEnd, 1, 0),
      { kind: 'segment', from: pt(0, 0), to: yEnd }, ...head(yEnd, 0, 1),
      { kind: 'path', points: samples.map(x => D(x, f(x))) },
      { kind: 'segment', from: D(1, 0), to: end, dashed: true },
      { kind: 'label', text: 'x', anchor: xEnd, away: pt(xEnd.x, 20), small: true },
      { kind: 'label', text: 'y', anchor: yEnd, away: pt(20, yEnd.y), small: true },
      { kind: 'label', text: '0', anchor: pt(0, 0), away: pt(4, 20), small: true },
      { kind: 'label', text: '1', anchor: D(1, 0), away: pt(W, 20), small: true },
    ],
  };
}

const q2025p2q11: CardRoutine<P2Q11of2025> = {
  // On the owner's yes (variation-depth sheet, card 8, 2026-10-05): m to 4, so the power
  // up to 8x², and "a coefficient of x": y = c√(ax)/e^{mx²}, so (a) is ∫ ax e^{-2mx²} dx
  // and y² is still c² times (a)'s integrand, as the paper arranges. a = 1, 2, 3 or 5,
  // never 4: √(4x) is 2√x, which no paper writes.
  draw: () => ({ c: int(2, 7), m: int(1, 4), a: pick([1, 2, 3, 5]) }),

  build: ({ c, m, a }): Built => {
    const k = 2 * m;
    const E = `e^{-${k}x^{2}}`;
    const ax = a === 1 ? 'x' : `${a}x`;
    const integrand = `${ax}${E}`;
    const antider = `${sum([{ coef: q(-a, 2 * k), body: E }])}`;
    const outside = q(a, 2 * k);
    const outsideText = outside.n === 1n && outside.d === 1n ? '' : num(outside);
    const y = `\\frac{${c}\\sqrt{${ax}}}{e^{${m === 1 ? '' : m}x^{2}}}`;
    const inIntegrable = `${c * c}\\pi\\int_{0}^{1} ${integrand}\\,dx`;
    const K = q(c * c * a, 2 * k);
    const volume = `${K.d === 1n && K.n === 1n ? '' : num(K)}\\pi(1 - e^{-${k}})`;
    const scene = curveFigure(m);
    return {
      questionLines: [
        `<b>(a)</b> Using the substitution $u = ${k}x^{2}$, or otherwise, find $\\int ${integrand}\\,dx.$`,
        `The diagram shows part of the curve with equation $y = ${y}.$`,
        renderScene(scene),
        'A solid is generated by rotating the curve through $2\\pi$ radians about the $x$-axis from $x = 0$ to $x = 1.$',
        '<b>(b)</b> Calculate the exact value of the volume generated.',
      ],
      solutionSteps: [
        `<strong>(a)</strong> $u = ${k}x^{2}$, so $\\frac{du}{dx} = ${2 * k}x$ and $du = ${2 * k}x\\,dx$`,
        `<strong>(a)</strong> $\\int ${integrand}\\,dx = ${outsideText}\\int e^{-u}\\,du = ${antider} + c$`,
        '<strong>(b)</strong> $V = \\pi\\int_{0}^{1} y^{2}\\,dx$',
        a === 1
          ? `<strong>(b)</strong> $y^{2} = \\frac{${c * c}x}{e^{${k}x^{2}}} = ${c * c}x${E}$, so $V = ${inIntegrable}$`
          : `<strong>(b)</strong> $y^{2} = \\frac{${c * c} \\times ${ax}}{e^{${k}x^{2}}} = ${c * c} \\times ${integrand}$, so $V = ${inIntegrable}$`,
        `<strong>(b)</strong> $V = ${c * c}\\pi\\left[${antider}\\right]_{0}^{1} = ${volume}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `(a) $${antider} + c$<br>(b) $${volume}$`,
      figure: { scene, claims: [] },
      ladder: {
        moves: [
          `With $u = ${k}x^{2}$, what does $du$ become in terms of $dx$?`,
          '(a) Differentiate the substitution.',
          '(a) Rewrite the integral in $u$, integrate, and substitute back.',
          '(b) Write the volume integral, with its limits.',
          '(b) Square $y$ and simplify, so that it matches the integral in (a).',
          '(b) Use (a) with the limits and evaluate exactly.',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [
          null,
          `$\\frac{du}{dx} = ${2 * k}x$ or $du = ${2 * k}x\\,dx$`,
          `$${antider} + c$`,
          '$\\pi\\int_{0}^{1} y^{2}\\,dx$',
          `$${inIntegrable}$`,
          null,
        ],
        watch: { at: 3, text: 'The volume integral needs its limits written, or that mark goes.' },
      },
    };
  },
};

// ── 2024 P1 Q8 ─────────────────────────────────────────────────────────────
// The integral of c√(tan kx)/cos² kx from 0 to π/(4k), by u = tan kx: the
// limits become 0 and 1, and the answer is 2c/(3k).

interface P1Q8of2024 { c: number; k: number }

const q2024p1q8: CardRoutine<P1Q8of2024> = {
  draw: () => ({ c: int(1, 5), k: int(2, 6) }),

  build: ({ c, k }): Built => {
    const top = `${c === 1 ? '' : c}\\sqrt{\\tan ${k}x}`;
    const upper = `\\frac{\\pi}{${4 * k}}`;
    const integral = `\\int_{0}^{${upper}} \\frac{${top}}{\\cos^{2} ${k}x} \\,dx`;
    const du = `du = ${k}\\sec^{2} ${k}x\\,dx`;
    const inU = sum([{ coef: q(c, k), body: '\\sqrt{u}' }]);
    const antiderivative = sum([{ coef: q(2 * c, 3 * k), body: 'u^{\\frac{3}{2}}' }]);
    const answer = num(q(2 * c, 3 * k));
    return {
      questionLines: [
        `Use the substitution $u = \\tan ${k}x$ to evaluate`,
        `$${integral}.$`,
      ],
      solutionSteps: [
        `$${du}$, or $\\frac{du}{dx} = ${k}\\sec^{2} ${k}x$`,
        `When $x = 0$, $u = 0$; when $x = ${upper}$, $u = \\tan\\frac{\\pi}{4} = 1$: $\\int_{0}^{1} \\ldots \\,du$`,
        `Since $\\frac{1}{\\cos^{2} ${k}x}\\,dx = \\sec^{2} ${k}x\\,dx = \\frac{1}{${k}}\\,du$: $\\int_{0}^{1} ${inU} \\,du$`,
        `$= \\left[${antiderivative}\\right]_{0}^{1} = ${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          `With $u = \\tan ${k}x$, what are $du$ and the new limits?`,
          'Differentiate the substitution.',
          'Change the limits to values of $u$, and start rewriting the integral.',
          'Replace everything so that only $u$ and $du$ remain.',
          'Integrate and evaluate between the new limits.',
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, `$${du}$ or $\\frac{du}{dx} = ${k}\\sec^{2} ${k}x$`, '$\\int_{0}^{1} \\ldots \\,du$', `$\\int_{0}^{1} ${inU} \\,du$`, null],
        watch: { at: 2, text: 'The limits must change to values of $u$. Keeping the $x$ limits loses marks.' },
      },
    };
  },
};

// ── 2024 P2 Q8 ─────────────────────────────────────────────────────────────
// y = k/√(b² + x²) rotated about the x-axis from 0 to a: the volume
// (k²π/b) tan⁻¹(a/b) is given, so tan⁻¹(a/b) is one of the angles whose tangent
// is exact. The paper's b is 1; b = 2 or 3 on the owner's yes (variation-depth
// sheet, card 4, 2026-10-05), from the formula list's 1/(a² + x²).

interface P2Q8of2024 { k: number; b: 1 | 2 | 3; angle: 3 | 4 | 6 }

/** tan(π/n) for the three angles, as the paper writes a length. */
const TANGENT: Readonly<Record<3 | 4 | 6, string>> = { 3: '\\sqrt{3}', 4: '1', 6: '\\frac{1}{\\sqrt{3}}' };

/** a = b tan(π/n): `2\sqrt{3}`, `3`, `\frac{2}{\sqrt{3}}`, and 3/√3 as `\sqrt{3}`. */
function upperLimit(b: 1 | 2 | 3, angle: 3 | 4 | 6): string {
  if (b === 1) return TANGENT[angle];
  if (angle === 3) return `${b}\\sqrt{3}`;
  if (angle === 4) return `${b}`;
  return b === 3 ? '\\sqrt{3}' : `\\frac{${b}}{\\sqrt{3}}`;
}

const q2024p2q8: CardRoutine<P2Q8of2024> = {
  draw: () => ({ k: int(1, 6), b: pick([1, 2, 3] as const), angle: pick([3, 4, 6] as const) }),

  build: ({ k, b, angle }): Built => {
    const k2 = k * k;
    const under = `${b * b} + x^{2}`;
    const y = `\\frac{${k}}{\\sqrt{${under}}}`;
    const V = q(k2, b * angle);
    const top = `${V.n === 1n ? '' : V.n}\\pi^{2}`;
    const volume = V.d === 1n ? top : `\\frac{${top}}{${V.d}}`;
    const theta = `\\frac{\\pi}{${angle}}`;
    const form = '\\int_{0}^{a} \\pi y^{2}\\,dx';
    const squared = `\\int_{0}^{a} \\pi\\frac{${k2}}{${under}}\\,dx`;
    // k²π/b in front of the inverse tangent, and its argument x/b.
    const front = q(k2, b);
    const kPi = `${front.n === 1n && front.d === 1n ? '' : num(front)}\\pi`;
    const atan = (v: string) => (b === 1 ? `\\tan^{-1}${v}` : `\\tan^{-1}\\frac{${v}}{${b}}`);
    const a = upperLimit(b, angle);
    return {
      questionLines: [
        `A solid is formed by rotating part of the curve with equation $y = ${y}$ about the $x$-axis through $2\\pi$ radians, from $x = 0$ to $x = a.$`,
        `The value of the volume of the solid is $${volume}.$`,
        'Determine the value of $a.$',
      ],
      solutionSteps: [
        `$V = ${form}$`,
        `$V = ${squared}$`,
        `$V = \\left[${kPi}${atan('x')}\\right]_{0}^{a}$`,
        `$${kPi}${atan('a')} = ${volume}$, so $${atan('a')} = ${theta}$`,
        b === 1
          ? `$a = \\tan ${theta} = ${a}$`
          : `$\\frac{a}{${b}} = \\tan ${theta} = ${TANGENT[angle]}$, so $a = ${b === 3 && angle === 6 ? '\\frac{3}{\\sqrt{3}} = ' : ''}${a}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `$a = ${a}$`,
      ladder: {
        moves: [
          'What is the formula for a volume of revolution about the $x$-axis?',
          'Write the volume integral, with limits $0$ and $a$.',
          'Square $y$ and substitute.',
          b === 1
            ? 'Integrate. Which standard integral has $1 + x^{2}$ underneath?'
            : `Integrate. The formula list has the integral with a number plus $x^{2}$ underneath: here the number is $${b * b} = ${b}^{2}$.`,
          'Put in the limits and set the result equal to the given volume.',
          'Solve for $a$.',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        // The inverse tangent as the working writes it (the paper's tan^{-1} x), so the hint
        // shows a piece of the worked line, not a line the working never has.
        shows: [null, `$${form}$`, `$${squared}$`, `$${atan('x')}$`, `$${atan('a')} = ${theta}$`, null],
        watch: { at: 1, text: 'The volume integral needs its limits and $dx$ written, or that mark goes.' },
      },
    };
  },
};

// ── 2023 P1 Q4 ─────────────────────────────────────────────────────────────
// ∫ a xⁿ ln x dx by parts, u = ln x: (a/m)x^m ln x - (a/m²)x^m + c, m = n + 1.

interface P1Q4of2023 { a: number; n: number }

/** A fraction with its power on top, as a paper writes x^5/25: `\frac{x^{5}}{25}`, `\frac{2x^{4}}{9}`, `2x^{3}`. */
function overPower(c: Q, body: string): string {
  if (c.d === 1n) return sum([{ coef: c, body }]);
  return `\\frac{${c.n === 1n ? '' : c.n}${body}}{${c.d}}`;
}

const q2023p1q4: CardRoutine<P1Q4of2023> = {
  draw: () => ({ a: int(1, 3), n: int(1, 7) }),

  build: ({ a, n }): Built => {
    const m = n + 1;
    const xn = power('x', n), xm = `x^{${m}}`;
    const integrand = `${a === 1 ? '' : a}${xn}`;
    const integral = `\\int ${integrand} \\ln x \\, dx`;
    const uv = sum([{ coef: q(a, m), body: `${xm}\\ln x` }]);
    const left = `\\int ${xm} \\times \\frac{1}{x}\\,dx`;
    const withLeft = sum([{ coef: q(a, m), body: `${xm}\\ln x` }, { coef: q(-a, m), body: left }]);
    const leftBegun = sum([{ coef: q(a, m), body: left }]);
    const answer = `${uv} - ${overPower(q(a, m * m), xm)} + c`;
    return {
      questionLines: [`Use integration by parts to find $${integral}$, $x > 0.$`],
      solutionSteps: [
        `With $u = \\ln x$ and $\\frac{dv}{dx} = ${integrand}$: $${uv} - \\ldots$`,
        `$${integral} = ${withLeft}$`,
        `$${integral} = ${answer}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          'You cannot easily integrate $\\ln x$, but you can differentiate it. Which factor should you integrate?',
          `Integrate $${integrand}$ and write the "$uv$" part.`,
          'Write the integral that is left, and simplify it.',
          'Finish the integration.',
        ],
        marks: [0, 1, 1, 1],
        shows: [null, `$${uv} - \\ldots$`, `$\\ldots - ${leftBegun}$`, null],
        watch: { at: 1, text: `Integrate $${integrand}$ and differentiate $\\ln x$. The other way round does not work.` },
      },
    };
  },
};

// ── 2023 P2 Q2 ─────────────────────────────────────────────────────────────
// ∫ x^{n-1}/(xⁿ + c) dx = (1/n) ln|xⁿ + c| + C: the top is the bottom's
// derivative over n.

interface P2Q2of2023 { n: number; c: number }

const q2023p2q2: CardRoutine<P2Q2of2023> = {
  draw: () => ({ n: int(2, 5), c: pick([-1, 1]) * int(1, 20) }),

  build: ({ n, c }): Built => {
    const bottom = sum([{ coef: 1, body: `x^{${n}}` }, { coef: c, body: '' }]);
    const integral = `\\int \\frac{${power('x', n - 1)}}{${bottom}}\\,dx`;
    const log = `\\ln|${bottom}|`;
    const answer = `\\frac{1}{${n}}${log} + c`;
    return {
      questionLines: [`Find $${integral}.$`],
      solutionSteps: [
        `The derivative of $${bottom}$ is $${n}${power('x', n - 1)}$, so the integral is $k${log}$`,
        `$${integral} = ${answer}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          'Compare the top with the derivative of the bottom. What do you notice?',
          'Recognise the integral as a log of the denominator, times a constant.',
          'Find that constant, and add the constant of integration.',
        ],
        marks: [0, 1, 1],
        shows: [null, `$k${log}$, $k \\in \\mathbb{R}$`, null],
        watch: { at: 2, text: 'Check the coefficient by differentiating your answer: it should give back the integrand.' },
      },
    };
  },
};

export const ROUTINES = {
  '2023 P1 Q4': q2023p1q4,
  '2023 P2 Q2': q2023p2q2,
  '2024 P1 Q8': q2024p1q8,
  '2024 P2 Q8': q2024p2q8,
  '2025 P1 Q5': q2025p1q5,
  '2025 P2 Q11': q2025p2q11,
  '2025 P2 Q16': q2025p2q16,
  '2026 P1 Q6': q2026p1q6,
  '2026 P2 Q11': q2026p2q11,
};
