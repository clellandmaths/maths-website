/**
 * Advanced Higher, Differentiation: how each 2022 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/differentiation.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int, nonZero, pick, until } from '../draw';
import { num, piTimes, sum } from '../maths/format';
import { gcd } from '../maths/integer';
import { q } from '../maths/rational';
import { type Element, type Scene, angleMark, dimensionArrow, mid, pt } from '../../../diagrams/scene';
import { renderScene } from '../../../diagrams/render';

const DYDX = '\\frac{dy}{dx}';

// ── 2022 P1 Q1(a) ──────────────────────────────────────────────────────────
// y = (p + qx)/(x^2 + c) by the quotient rule, simplified

interface P1Q1aOf2022 { p: number; q: number; c: number }

/** q odd and coprime with p, so the simplified top, -qx^2 - 2px + qc, has no common factor. */
const Q1A_TOPS: readonly [number, number][] = (() => {
  const out: [number, number][] = [];
  for (let p = 1; p <= 6; p++) {
    for (const q of [-7, -5, -3, -1, 1, 3, 5, 7]) if (gcd(p, q) === 1) out.push([p, q]);
  }
  return out;
})();

const q2022p1q1a: CardRoutine<P1Q1aOf2022> = {
  draw: () => {
    const [p, q] = pick(Q1A_TOPS);
    return { p, q, c: int(1, 9) };
  },

  build: ({ p, q, c }): Built => {
    const top = sum([{ coef: p, body: '' }, { coef: q, body: 'x' }]);
    const bottom = `x^{2} + ${c}`;
    const squared = `(${bottom})^{2}`;
    const first = sum([{ coef: q, body: `(${bottom})` }]);
    const second = `2x(${top})`;
    const whole = `\\frac{${first} - ${second}}{${squared}}`;
    const answer = `\\frac{${sum([{ coef: -q, body: 'x^{2}' }, { coef: -2 * p, body: 'x' }, { coef: q * c, body: '' }])}}{${squared}}`;
    return {
      questionLines: [`Given $y = \\frac{${top}}{${bottom}}$, find $${DYDX}.$ Simplify your answer.`],
      solutionSteps: [
        `By the quotient rule, $${DYDX} = \\frac{${first}\\ldots}{${squared}}$`,
        `$${DYDX} = ${whole}$`,
        `$${DYDX} = ${answer}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `$${DYDX} = ${answer}$`,
      ladder: {
        moves: [
          'The function is one expression divided by another. Which rule does that need?',
          `Set up the quotient rule with $${squared}$ as the denominator.`,
          'Complete the numerator: the top\'s derivative times the bottom, minus the top times the bottom\'s derivative.',
          'Multiply out the numerator and collect like terms.',
        ],
        marks: [0, 1, 1, 1],
        shows: [
          null,
          `$\\frac{${first}\\ldots}{${squared}}$ or $\\frac{\\ldots - ${second}}{${squared}}$`,
          `$${whole}$`,
          null,
        ],
        watch: { at: 3, text: 'The last mark needs the brackets multiplied out and the like terms collected.' },
      },
    };
  },
};

// ── 2022 P1 Q1(b) ──────────────────────────────────────────────────────────
// f(x) = c cosec kx: the standard derivative, then the chain rule

interface P1Q1bOf2022 { c: number; k: number }

const q2022p1q1b: CardRoutine<P1Q1bOf2022> = {
  draw: () => ({ c: int(1, 3), k: int(2, 9) }),

  build: ({ c, k }): Built => {
    const cosec = `\\operatorname{cosec} ${k}x`;
    const lead = c === 1 ? '' : String(c);
    const begun = `-${lead}${cosec}\\cot ${k}x`;
    const answer = `-${c * k}${cosec}\\cot ${k}x`;
    return {
      questionLines: [`Given $f(x) = ${lead}${cosec}$, find $f'(x).$`],
      solutionSteps: [
        `The derivative of $\\operatorname{cosec}$: $${begun} \\times \\ldots$`,
        `By the chain rule, $f'(x) = ${answer}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$f'(x) = ${answer}$`,
      ladder: {
        moves: [
          `Which standard derivative is $\\operatorname{cosec}$'s, and what does the $${k}x$ inside add?`,
          c === 1 ? 'Differentiate $\\operatorname{cosec}$ of the angle.' : `Differentiate $\\operatorname{cosec}$ of the angle, keeping the ${c} in front.`,
          `Apply the chain rule for the $${k}x$ inside.`,
        ],
        marks: [0, 1, 1],
        shows: [null, `$${begun}$`, null],
        watch: { at: 2, text: `The chain rule brings out the ${k}. Leaving it out loses the second mark.` },
      },
    };
  },
};

// ── 2022 P1 Q4 ─────────────────────────────────────────────────────────────
// y^3 + ay = bxy + c: dy/dx implicitly, the gradient at y = y0, and no
// stationary point, since dy/dx = 0 forces y = 0 and then 0 = c.

interface P1Q4of2022 { a: number; b: number; c: number; y0: number }

/**
 * Every curve the card can set, listed rather than drawn until one fits
 * (`ah-course.md`, 2024 P2): x at y = y0 whole and not 0, and the gradient
 * there a whole number, not 0, as the paper's -2 at (3, -1).
 */
const Q4_CURVES: readonly P1Q4of2022[] = (() => {
  const out: P1Q4of2022[] = [];
  for (let a = 1; a <= 6; a++) {
    for (let b = 1; b <= 4; b++) {
      for (let c = -6; c <= 6; c++) {
        if (c === 0) continue;
        for (const y0 of [-2, -1, 1, 2]) {
          const x0 = q4x(a, b, c, y0);
          if (x0 === null || x0 === 0) continue;
          const D = 3 * y0 * y0 + a - b * x0;
          if (D === 0 || (b * y0) % D !== 0) continue;
          const m = (b * y0) / D;
          if (m !== 0 && Math.abs(m) <= 12) out.push({ a, b, c, y0 });
        }
      }
    }
  }
  return out;
})();

/** x on the curve at y = y0, when it is whole. */
function q4x(a: number, b: number, c: number, y0: number): number | null {
  const top = y0 ** 3 + a * y0 - c, bot = b * y0;
  return top % bot === 0 ? top / bot : null;
}

const q2022p1q4: CardRoutine<P1Q4of2022> = {
  draw: () => pick(Q4_CURVES),

  build: ({ a, b, c, y0 }): Built => {
    const x0 = q4x(a, b, c, y0);
    if (x0 === null) throw new Error('2022 P1 Q4: x is not whole');
    const D = 3 * y0 * y0 + a - b * x0;
    const m = (b * y0) / D;
    const left = sum([{ coef: 1, body: 'y^{3}' }, { coef: a, body: 'y' }]);
    const right = sum([{ coef: b, body: 'xy' }, { coef: c, body: '' }]);
    const chainPart = `3y^{2}${DYDX}`;
    const productPart = sum([{ coef: b, body: 'y' }, { coef: b, body: `x${DYDX}` }]);
    const differentiated = `${sum([{ coef: 3, body: `y^{2}${DYDX}` }, { coef: a, body: DYDX }])} = ${productPart}`;
    const numerator = sum([{ coef: b, body: 'y' }]);
    const denominator = sum([{ coef: 3, body: 'y^{2}' }, { coef: a, body: '' }, { coef: -b, body: 'x' }]);
    const dydx = `\\frac{${numerator}}{${denominator}}`;
    const atY = `${num(y0 ** 3 + a * y0)} = ${sum([{ coef: b * y0, body: 'x' }, { coef: c, body: '' }])}`;
    const mLine = D === 1 ? `m = ${num(m)}` : `m = \\frac{${num(b * y0)}}{${num(D)}} = ${num(m)}`;
    return {
      questionLines: [
        `A curve is defined by the equation $${left} = ${right}.$`,
        `<b>(a)</b> Use implicit differentiation to find an expression for $${DYDX}.$`,
        `<b>(b)</b> Find the gradient of the tangent to the curve when $y = ${y0}.$`,
        '<b>(c)</b> Show that the curve has no stationary point.',
      ],
      solutionSteps: [
        `<strong>(a)</strong> By the chain rule, $\\frac{d}{dx}\\left(y^{3}\\right) = ${chainPart}$, and by the product rule, $\\frac{d}{dx}\\left(${sum([{ coef: b, body: 'xy' }])}\\right) = ${productPart}$`,
        `<strong>(a)</strong> $${differentiated}$`,
        `<strong>(a)</strong> $${DYDX} = ${dydx}$`,
        `<strong>(b)</strong> When $y = ${y0}$, $${atY}$, so $x = ${x0}$, and $${mLine}$`,
        `<strong>(c)</strong> At a stationary point $${DYDX} = 0$, so $${numerator} = 0$ and $y = 0$`,
        `<strong>(c)</strong> Putting $y = 0$ into the curve's equation, the left-hand side is $0$ and the right-hand side is $${c}$: inconsistent, so the curve has no stationary point`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1],
      finalAnswer: [
        `(a) $${DYDX} = ${dydx}$`,
        `(b) $${num(m)}$`,
        `(c) $${DYDX} = 0$ gives $y = 0$; then the left-hand side of the curve's equation is $0$ and the right-hand side is $${c}$, which is inconsistent, so there is no stationary point (shown).`,
      ].join('<br>'),
      ladder: {
        moves: [
          '$y$ is tangled up with $x$. How do you differentiate a $y$-term with respect to $x$?',
          `(a) Differentiate $y^{3}$ and $${sum([{ coef: a, body: 'y' }])}$ with the chain rule, or $${sum([{ coef: b, body: 'xy' }])}$ with the product rule.`,
          '(a) Complete the differentiation of every term.',
          `(a) Gather the $${DYDX}$ terms on one side and make $${DYDX}$ the subject.`,
          `(b) Find the value of $x$ that goes with $y = ${y0}$, then substitute both into $${DYDX}$.`,
          `(c) A stationary point needs $${DYDX} = 0$. What does that say about $y$?`,
          '(c) Put that value back into the curve\'s equation and see what happens.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1],
        shows: [
          null,
          `$${chainPart}$ or $${productPart}$`,
          `$${differentiated}$`,
          `$${DYDX} = ${dydx}$`,
          `$m = ${num(m)}$`,
          null,
          null,
        ],
        watch: { at: 6, text: 'You need to show the contradiction: put the value back into the original equation.' },
      },
    };
  },
};

// ── 2022 P2 Q8 ─────────────────────────────────────────────────────────────
// (a) d/dx(x ln x - x) = ln x; (b) y' + ky ln x = jk x^{-kx}: the integrating
// factor e^{kx ln x - kx} = x^{kx}e^{-kx} cancels the x^{-kx}, leaving jk e^{-kx}.

interface P2Q8of2022 { k: number; j: number }

const q2022p2q8: CardRoutine<P2Q8of2022> = {
  // j to 6 on the owner's "Widen j to 6" (2026-10-01).
  draw: () => ({ k: int(1, 4), j: int(1, 6) }),

  build: ({ k, j }): Built => {
    const m = j * k;
    const kx = k === 1 ? 'x' : `${k}x`;
    const kk = k === 1 ? '' : String(k);
    const rhs = `${m === 1 ? '' : m}x^{-${kx}}`;
    const exp = `${kx}\\ln x - ${kx}`;
    const factor = `e^{\\int ${kk}\\ln x\\,dx}`;
    const integral = `ye^{${exp}} = \\int e^{${exp}} \\times ${rhs}\\,dx`;
    const top = `${sum([{ coef: -j, body: `e^{-${kx}}` }])} + c`;
    const y = `y = \\frac{${top}}{x^{${kx}}e^{-${kx}}}`;
    return {
      questionLines: [
        `<b>(a)</b> Differentiate $x\\ln x - x$ with respect to $x.$`,
        `<b>(b)</b> Hence find the general solution of the differential equation $${DYDX} + ${kk}y\\ln x = ${rhs}.$`,
      ],
      solutionSteps: [
        '<strong>(a)</strong> By the product rule, $\\frac{d}{dx}(x\\ln x) = \\ln x + x \\times \\frac{1}{x}$',
        '<strong>(a)</strong> $\\frac{d}{dx}(x\\ln x - x) = \\ln x + 1 - 1 = \\ln x$',
        `<strong>(b)</strong> The integrating factor is $${factor}$`,
        `<strong>(b)</strong> By (a), $\\int ${kk}\\ln x\\,dx = ${exp}$, so the integrating factor is $e^{${exp}}$`,
        `<strong>(b)</strong> $${integral}$`,
        `<strong>(b)</strong> $e^{${exp}} = x^{${kx}}e^{-${kx}}$, so $ye^{${exp}} = \\int ${m === 1 ? '' : m}e^{-${kx}}\\,dx = ${top}$ and $${y}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1],
      finalAnswer: `(a) $\\ln x$<br>(b) $${y}$`,
      ladder: {
        moves: [
          '(a) is two factors multiplied. (b) is linear in $y$: what do you multiply through by?',
          '(a) Use the product rule on $x\\ln x$.',
          '(a) Complete the differentiation and simplify.',
          '(b) Write the integrating factor as $e$ to the integral of the coefficient of $y$.',
          '(b) Use (a) to do that integral.',
          '(b) Multiply through and write the equation as an integral equation.',
          '(b) Simplify the right-hand side, integrate, and make $y$ the subject.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1],
        shows: [null, '$\\ln x + \\ldots$ or $\\ldots + x \\times \\frac{1}{x}$', null, `$${factor}$`, `$e^{${exp}}$`, `$${integral}$`, null],
        watch: { at: 3, text: 'This needs an integrating factor. Separating the variables earns nothing in (b).' },
      },
    };
  },
};

// ── 2022 P2 Q11 ────────────────────────────────────────────────────────────
// x = tan⁻¹ kt, dy/dx = mt(1 + k²t²): dy/dt = dy/dx × dx/dt = mkt, so
// y = (mk/2)t² + c, the constant from y at t0.

interface P2Q11of2022 { k: number; m: number; t0: number; c: number }

const q2022p2q11: CardRoutine<P2Q11of2022> = {
  draw: () => until(
    () => ({ k: int(2, 5), m: int(1, 9), t0: int(1, 3), c: nonZero(-9, 9) }),
    // mk even, so y's coefficient is whole, as the paper's 6; the value of y never 0, within 60.
    ({ k, m, t0, c }) => (m * k) % 2 === 0 && m * k <= 30 && (m * k / 2) * t0 * t0 + c !== 0 && Math.abs((m * k / 2) * t0 * t0 + c) <= 60,
  ),

  build: ({ k, m, t0, c }): Built => {
    const half = (m * k) / 2, y0 = half * t0 * t0 + c;
    const kt = `1 + ${k * k}t^{2}`;
    const dydx = `${m === 1 ? '' : m}t(${kt})`;
    const dxdt = `\\frac{${k}}{1 + (${k}t)^{2}}`;
    const equated = `\\frac{dy/dt}{\\left(\\frac{${k}}{${kt}}\\right)} = ${dydx}`;
    const dydt = `\\frac{dy}{dt} = ${m * k}t`;
    const general = sum([{ coef: half, body: 't^{2}' }]);
    const y = `y = ${sum([{ coef: half, body: 't^{2}' }, { coef: c, body: '' }])}`;
    return {
      questionLines: [
        'A curve defined parametrically has the following properties:',
        `$x = \\tan^{-1} ${k}t$`,
        `$${DYDX} = ${dydx}$`,
        `$y = ${y0}$ when $t = ${t0}.$`,
        'Find $y$ in terms of $t.$',
      ],
      solutionSteps: [
        `$\\frac{dx}{dt} = ${dxdt}$`,
        `$${DYDX} = \\frac{dy/dt}{dx/dt}$, so $${equated}$`,
        `$${dydt}$`,
        `$y = ${general} + c$, and $y = ${y0}$ when $t = ${t0}$ gives $c = ${c}$, so $${y}$`,
      ],
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `$${y}$`,
      ladder: {
        moves: [
          'You know $\\frac{dy}{dx}$ and $x$ in terms of $t$. How can you get $\\frac{dy}{dt}$?',
          'Differentiate $x$ with respect to $t$.',
          'Write $\\frac{dy}{dx}$ as $\\frac{dy}{dt}$ divided by $\\frac{dx}{dt}$, and set it equal to the given expression.',
          'Rearrange and simplify to get $\\frac{dy}{dt}$.',
          `Integrate, and use $y = ${y0}$ when $t = ${t0}$ to find the constant.`,
        ],
        marks: [0, 1, 1, 1, 1],
        shows: [null, `$\\frac{dx}{dt} = ${dxdt}$`, `$${equated}$`, `$${dydt}$`, null],
        watch: { at: 2, text: 'Do not integrate the given $\\frac{dy}{dx}$ with respect to $t$. It is not $\\frac{dy}{dt}$.' },
      },
    };
  },
};

// ── 2022 P2 Q13 ────────────────────────────────────────────────────────────
// A spotlight d m from a fence, one turn every T s: (a)(i) dθ/dt = 2π/T;
// (a)(ii) x = d tan θ, dx/dt = (2πd/T) sec²θ; (b) 1 + tan²θ = sec²θ;
// (c) at x = s, sec²θ = (d² + s²)/d², so dx/dt = 2π(d² + s²)/(Td).

interface P2Q13of2022 { d: number; T: number; s: number }

/** Periods a turning spotlight might have, in seconds (the paper's 12). */
const PERIODS = [6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 30] as const;

/**
 * The paper's figure: the fence across the top with G, P and the arrow along
 * it, the right angle at G, d m down LG, the beam LP, θ at L and x m measured
 * over GP. Not to scale, as the paper's: d changes only its label.
 */
function spotlightFigure(d: number): Scene {
  const L = pt(0, 0), G = pt(0, 110), P = pt(78, 110);
  const fenceStart = pt(-70, 110), fenceEnd = pt(112, 110);
  const ARROW = 5;
  const head = [0.4, -0.4].map((turn): Element => ({
    kind: 'segment', from: fenceEnd, to: pt(fenceEnd.x - ARROW * Math.cos(turn), fenceEnd.y - ARROW * Math.sin(turn)), decoration: true,
  }));
  return {
    elements: [
      { kind: 'segment', from: fenceStart, to: fenceEnd },
      ...head,
      { kind: 'segment', from: L, to: G },
      { kind: 'segment', from: L, to: P },
      { kind: 'rightAngle', at: G, arms: [L, P] },
      ...angleMark(L, [G, P], 'θ', 22),
      // Above the fence, as the paper's: the arrow is shifted toward the point given.
      ...dimensionArrow(G, P, pt(39, 200), 26, 'x m'),
      { kind: 'label', text: 'fence', anchor: pt(-55, 110), away: pt(-55, 0), small: true },
      { kind: 'label', text: 'G', anchor: G, away: pt(20, 0) },
      { kind: 'label', text: 'P', anchor: P, away: pt(P.x - 20, 0) },
      // Beside LG on the left, and to the right of the beam, as the paper prints them.
      { kind: 'label', text: `${d} m`, anchor: pt(-6, 55), away: pt(40, 55), small: true },
      { kind: 'label', text: 'beam of light', anchor: pt(46, 52), away: pt(30, 52), small: true },
      { kind: 'label', text: 'spotlight (L)', anchor: L, away: pt(0, 40), small: true },
    ],
  };
}

const q2022p2q13: CardRoutine<P2Q13of2022> = {
  draw: () => {
    const d = int(5, 20);
    return { d, T: pick(PERIODS), s: int(1, d) };
  },

  build: ({ d, T, s }): Built => {
    const rate = piTimes(q(2, T));
    const coef = piTimes(q(2 * d, T));
    const sec2 = q(d * d + s * s, d * d);
    const answer = piTimes(q(2 * (d * d + s * s), T * d));
    const dTheta = '\\frac{d\\theta}{dt}', dX = '\\frac{dx}{dt}';
    const chain = `${dX} = \\frac{dx}{d\\theta} \\cdot ${dTheta}`;
    const subbed = `${dX} = ${d}\\sec^{2}\\theta \\cdot ${rate}`;
    const proof = '1 + \\frac{\\sin^{2}\\theta}{\\cos^{2}\\theta} = \\frac{\\cos^{2}\\theta + \\sin^{2}\\theta}{\\cos^{2}\\theta} = \\frac{1}{\\cos^{2}\\theta} = \\sec^{2}\\theta';
    const tan = `\\tan\\theta = \\frac{${s}}{${d}}`;
    const secText = `1 + \\left(\\frac{${s}}{${d}}\\right)^{2} = \\frac{${d * d + s * s}}{${d * d}}`;
    const units = '\\ \\text{ms}^{-1}';
    const scene = spotlightFigure(d);
    return {
      questionLines: [
        `A security spotlight is situated ${d} metres from a straight fence. The spotlight rotates at a constant speed and makes one full revolution every ${T} seconds. $L$ is the spotlight, $G$ is the nearest point on the fence, $P$ is where the light hits the fence, $\\theta$ is the angle between $LG$ and $LP$, and $x$ is the distance in metres from $G$ to $P.$`,
        renderScene(scene),
        '<b>(a)</b> Show that:',
        `(i) $${dTheta} = ${rate}$ radians per second`,
        `(ii) $${dX} = ${coef}\\sec^{2}\\theta$ metres per second.`,
        '<b>(b)</b> Prove that $1 + \\tan^{2}\\theta = \\sec^{2}\\theta.$',
        `<b>(c)</b> Hence, or otherwise, find the exact value of $${dX}$ when $P$ is ${s} metres from $G.$`,
      ],
      solutionSteps: [
        `<strong>(a)(i)</strong> One full turn is $2\\pi$ radians in ${T} seconds: $${dTheta} = \\frac{2\\pi}{${T}}$, which leads to $${dTheta} = ${rate}$`,
        `<strong>(a)(ii)</strong> $${chain}$`,
        `<strong>(a)(ii)</strong> In the right-angled triangle $LGP$, $\\tan\\theta = \\frac{x}{${d}}$, so $x = ${d}\\tan\\theta$`,
        `<strong>(a)(ii)</strong> $\\frac{dx}{d\\theta} = ${d}\\sec^{2}\\theta$`,
        `<strong>(a)(ii)</strong> $${subbed}$, which leads to $${dX} = ${coef}\\sec^{2}\\theta$`,
        `<strong>(b)</strong> $${proof}$`,
        `<strong>(c)</strong> When $x = ${s}$, $${tan}$`,
        `<strong>(c)</strong> By (b), $\\sec^{2}\\theta = ${secText}$`,
        `<strong>(c)</strong> $${dX} = ${coef} \\times ${num(sec2)} = ${answer}${units}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1, 1, 1],
      finalAnswer: [
        `(a)(i) $\\frac{2\\pi}{${T}} = ${rate}$`,
        `(a)(ii) $x = ${d}\\tan\\theta$, so $${subbed} = ${coef}\\sec^{2}\\theta$`,
        '(b) $1 + \\frac{\\sin^{2}\\theta}{\\cos^{2}\\theta} = \\frac{1}{\\cos^{2}\\theta} = \\sec^{2}\\theta$',
        `(c) $${answer}${units}$`,
      ].join('<br>'),
      figure: { scene, claims: [] },
      ladder: {
        moves: [
          `The spotlight turns at a steady rate. How far does it turn in ${T} seconds?`,
          '(a)(i) Divide one full turn, in radians, by the time it takes.',
          '(a)(ii) Write the chain rule linking $\\frac{dx}{dt}$, $\\frac{dx}{d\\theta}$ and $\\frac{d\\theta}{dt}$.',
          '(a)(ii) Use the right-angled triangle to write $x$ in terms of $\\theta$.',
          '(a)(ii) Differentiate that with respect to $\\theta$.',
          '(a)(ii) Substitute and simplify.',
          '(b) Write $\\tan\\theta$ as $\\frac{\\sin\\theta}{\\cos\\theta}$, combine into one fraction, and use a trig identity.',
          `(c) Use the triangle to find $\\tan\\theta$ when $x = ${s}$.`,
          `(c) Use (b) to find the matching value of $\\sec^{2}\\theta$.`,
          '(c) Substitute into (a)(ii) and simplify, with units.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        shows: [
          null,
          `$\\frac{2\\pi}{${T}}$ leading to $${rate}$.`,
          `$${chain}$`,
          null,
          `$\\frac{dx}{d\\theta} = ${d}\\sec^{2}\\theta$`,
          `$${subbed}$ leading to $${dX} = ${coef}\\sec^{2}\\theta$`,
          `$${proof}$`,
          `$${tan}$ or $\\sec\\theta = \\frac{\\sqrt{${d * d + s * s}}}{${d}}$`,
          `$${secText}$`,
          null,
        ],
        watch: { at: 4, text: 'Write $x$ in terms of $\\theta$ from the triangle before you differentiate.' },
      },
    };
  },
};

export const ROUTINES = {
  '2022 P1 Q1(a)': q2022p1q1a,
  '2022 P1 Q1(b)': q2022p1q1b,
  '2022 P1 Q4': q2022p1q4,
  '2022 P2 Q8': q2022p2q8,
  '2022 P2 Q11': q2022p2q11,
  '2022 P2 Q13': q2022p2q13,
};
