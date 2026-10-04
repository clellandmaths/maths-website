/**
 * Advanced Higher, Differentiation: how each 2017 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/differentiation.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int, nonZero, pick, until } from '../draw';
import { sum } from '../maths/format';
import { coprime } from '../maths/integer';
import { type Element, type Pt, type Scene, add, pt, scale, unit } from '../../../diagrams/scene';
import { renderScene } from '../../../diagrams/render';

const DYDX = '\\frac{dy}{dx}';

/** `x^{3}` with a number in front, 1 not written: `2x^{3}`, `x^{2}`, `6x`. */
const xPower = (c: number, k: number) => `${c === 1 ? '' : c}${k === 1 ? 'x' : `x^{${k}}`}`;

// ── 2017 Q3 ────────────────────────────────────────────────────────────────
// f(x) = e^u/u with u = xⁿ + c: by the quotient rule,
// f'(x) = u'e^u(u - 1)/u², the paper's (x² - 1) - 1 = x² - 2 simplified.

interface Q3of2017 { n: 2 | 3; c: number }

const q2017q3: CardRoutine<Q3of2017> = {
  // c from -9 to 9, never 0 and never 1, where u - 1 would be xⁿ alone and
  // the answer would simplify further than the paper's.
  draw: () => ({ n: pick([2, 3] as const), c: pick([-9, -8, -7, -6, -5, -4, -3, -2, -1, 2, 3, 4, 5, 6, 7, 8, 9]) }),

  build: ({ n, c }): Built => {
    const U = sum([{ coef: 1, body: `x^{${n}}` }, { coef: c, body: '' }]);
    const less = sum([{ coef: 1, body: `x^{${n}}` }, { coef: c - 1, body: '' }]);
    const du = xPower(n, n - 1);
    const e = `e^{${U}}`;
    const squared = `(${U})^{2}`;
    const begun = `${du}${e}(${U}) - \\ldots`;
    const whole = `\\frac{${du}${e}(${U}) - ${du}${e}}{${squared}}`;
    const answer = `\\frac{${du}${e}(${less})}{${squared}}`;
    return {
      questionLines: [
        `On a suitable domain, a function is defined by $f(x) = \\frac{${e}}{${U}}.$`,
        'Find $f\'(x)$ simplifying your answer.',
      ],
      solutionSteps: [
        `By the quotient rule, with the chain rule on the top: $f'(x) = \\frac{${begun}}{\\ldots}$`,
        `$f'(x) = ${whole}$`,
        `Taking out the common factor: $f'(x) = ${answer}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `$f'(x) = ${answer}$`,
      ladder: {
        moves: [
          'The function is one expression divided by another, and the top has a function inside a function. Which rules?',
          'Set up the quotient rule. The top\'s derivative needs the chain rule.',
          'Complete the numerator and write the denominator.',
          'Take out the common factor and simplify the numerator.',
        ],
        marks: [0, 1, 1, 1],
        shows: [null, `$${begun}$`, `$\\frac{\\ldots ${du}${e}}{${squared}}$`, null],
        watch: { at: 3, text: `Simplify the numerator fully. Leaving $(${U}) - 1$ unsimplified loses the mark.` },
      },
    };
  },
};

// ── 2017 Q11 ───────────────────────────────────────────────────────────────
// y = x^P with P = axⁿ + b: ln y = P ln x, so
// dy/dx = x^P(anx^{n-1} ln x + P/x).

interface Q11of2017 { a: number; n: number; b: number }

const q2017q11: CardRoutine<Q11of2017> = {
  // The paper's 2x³ + 1: a from 1 to 4, n from 2 to 4, b from -6 to 6, never
  // 0, a and b sharing no factor, as 2 and 1: a paper never prints x^{2x³ + 4}.
  draw: () => until(() => ({ a: int(1, 4), n: int(2, 4), b: nonZero(-6, 6) }), ({ a, b }) => coprime(a, Math.abs(b))),

  build: ({ a, n, b }): Built => {
    const P = sum([{ coef: a, body: `x^{${n}}` }, { coef: b, body: '' }]);
    const dP = xPower(a * n, n - 1);
    const logged = `\\ln y = (${P})\\ln x`;
    const first = `${dP}\\ln x`, second = `\\frac{${P}}{x}`;
    const right = `${first} + ${second}`;
    const answer = `${DYDX} = x^{${P}}\\left(${right}\\right)`;
    return {
      questionLines: [
        `Given $y = x^{${P}}$, use logarithmic differentiation to find $${DYDX}.$`,
        'Write your answer in terms of $x.$',
      ],
      solutionSteps: [
        `Taking logarithms and using the power rule: $${logged}$`,
        `The left side differentiates to $\\frac{1}{y}${DYDX}$`,
        `By the product rule on the right, one term is $${first}$`,
        `$\\frac{1}{y}${DYDX} = ${right}$`,
        `$${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          'The power has $x$ in it. What does taking logs do to a power?',
          'Take natural logs of both sides and bring the power down.',
          'Differentiate the left-hand side implicitly.',
          'Differentiate the right-hand side with the product rule.',
          'Multiply through by $y$ and replace it with the original expression.',
        ],
        marks: [0, 1, 1, 2, 1],
        shows: [null, `$${logged}$`, `$\\frac{1}{y}${DYDX}$`, `$${first}$ or $${second}$`, null],
        watch: { at: 3, text: 'The right-hand side is a product. Without the product rule, the middle marks are gone.' },
      },
    };
  },
};

// ── 2017 Q18 ───────────────────────────────────────────────────────────────
// x = kt cos t, y = kt sin t: the speed is k√(1 + t²), and at A, a crossing
// of an axis chosen on the diagram, t = mπ/2.

interface Q18of2017 { k: number; m: number }

/**
 * Where A can be, as t = mπ/2: the axis it is on, which crossing of that half
 * of the axis it is, counting out from O, and which way the axis half points.
 * The paper's A is m = 6, the second crossing of the negative x-axis. The
 * spiral is drawn to just past 4π, as the paper's.
 */
const CROSSINGS2017: Record<number, { axis: 'x' | 'y'; half: string; nth: string }> = {
  2: { axis: 'x', half: 'negative $x$-axis', nth: 'first' },
  3: { axis: 'y', half: 'negative $y$-axis', nth: 'first' },
  4: { axis: 'x', half: 'positive $x$-axis', nth: 'first' },
  5: { axis: 'y', half: 'positive $y$-axis', nth: 'second' },
  6: { axis: 'x', half: 'negative $x$-axis', nth: 'second' },
  7: { axis: 'y', half: 'negative $y$-axis', nth: 'second' },
};

/** mπ/2 as a paper writes it: `\pi`, `\frac{3\pi}{2}`, `2\pi`. */
function halfPi(m: number): string {
  if (m % 2) return `\\frac{${m}\\pi}{2}`;
  return m === 2 ? '\\pi' : `${m / 2}\\pi`;
}

/** 1 + t² at t = mπ/2, under the root: `1 + 9\pi^{2}`, `1 + \frac{9\pi^{2}}{4}`, `1 + \pi^{2}`. */
function onePlus(m: number): string {
  if (m % 2) return `1 + \\frac{${m * m}\\pi^{2}}{4}`;
  const h = m / 2;
  return `1 + ${h === 1 ? '' : h * h}\\pi^{2}`;
}

const SCALE2017 = 8.4, ARROW2017 = 5;

function arrow2017(at: Pt, along: Pt): Element[] {
  const u = unit(along);
  return [0.4, -0.4].map((turn): Element => {
    const [c, s] = [Math.cos(turn), Math.sin(turn)];
    const dir = pt(u.x * c - u.y * s, u.x * s + u.y * c);
    return { kind: 'segment', from: at, to: add(at, scale(dir, -ARROW2017)), decoration: true };
  });
}

/**
 * The paper's diagram: arrowed axes, x, y and 0, the spiral from O to just
 * past 4π, and A marked. A's label stands off the dot outward and to one side,
 * clear of the axis it sits on and of the curve, which crosses the axis there
 * at nearly a right angle.
 */
function spiralFigure(m: number): Scene {
  const D = (t: number) => pt(SCALE2017 * t * Math.cos(t), SCALE2017 * t * Math.sin(t));
  const points: Pt[] = [];
  const end = 4 * Math.PI + 0.2;
  for (let i = 0; i <= 400; i++) points.push(D((end * i) / 400));
  const R = SCALE2017 * end;
  const xLo = -R - 14, xHi = R + 22, yLo = -R - 12, yHi = R + 14;
  const A = D((m * Math.PI) / 2);
  const out = unit(A);
  const side = CROSSINGS2017[m].axis === 'x' ? pt(0, 1) : pt(1, 0);
  const away = add(A, scale(add(out, side), -10));
  const o = pt(0, 0);
  return {
    elements: [
      { kind: 'segment', from: pt(xLo, 0), to: pt(xHi, 0) },
      ...arrow2017(pt(xHi, 0), pt(1, 0)),
      { kind: 'segment', from: pt(0, yLo), to: pt(0, yHi) },
      ...arrow2017(pt(0, yHi), pt(0, 1)),
      { kind: 'label', text: 'x', anchor: pt(xHi, -4), away: pt(xHi, 10), small: true },
      { kind: 'label', text: 'y', anchor: pt(4, yHi), away: pt(-10, yHi), small: true },
      { kind: 'label', text: '0', anchor: add(o, pt(-6, -6)), away: pt(6, 6), small: true },
      { kind: 'path', points },
      { kind: 'dot', at: A, small: true },
      { kind: 'label', text: 'A', anchor: add(A, scale(add(out, side), 6)), away, small: true },
    ],
    target: 300,
  };
}

const q2017q18: CardRoutine<Q18of2017> = {
  // k from 1 (the paper) to 4: t alone and its six crossings make 6.
  draw: () => ({ k: int(1, 4), m: pick([2, 3, 4, 5, 6, 7]) }),

  build: ({ k, m }): Built => {
    const K = k === 1 ? '' : String(k);
    const where = CROSSINGS2017[m];
    const dxdt = k === 1 ? '\\cos t - t\\sin t' : `${k}\\cos t - ${k}t\\sin t`;
    const dydt = k === 1 ? '\\sin t + t\\cos t' : `${k}\\sin t + ${k}t\\cos t`;
    const speedFormula = 'speed $= \\sqrt{\\left(\\frac{dx}{dt}\\right)^{2} + \\left(\\frac{dy}{dt}\\right)^{2}}$';
    const speed = `${K}\\sqrt{1 + t^{2}}`;
    const expanded = k === 1
      ? `\\sqrt{(${dxdt})^{2} + (${dydt})^{2}} = \\sqrt{\\cos^{2} t + \\sin^{2} t + t^{2}(\\sin^{2} t + \\cos^{2} t)} = ${speed}`
      : `\\sqrt{(${dxdt})^{2} + (${dydt})^{2}} = \\sqrt{${k * k}(1 + t^{2})} = ${speed}`;
    const zero = where.axis === 'x' ? `${K}t\\sin t` : `${K}t\\cos t`;
    const solutions = where.axis === 'x' ? 't = 0, \\pi, 2\\pi, 3\\pi, \\ldots' : 't = \\frac{\\pi}{2}, \\frac{3\\pi}{2}, \\frac{5\\pi}{2}, \\frac{7\\pi}{2}, \\ldots';
    const first = where.axis === 'x' ? '\\pi' : '\\frac{\\pi}{2}';
    const tA = halfPi(m);
    const atA = `${K}\\sqrt{${onePlus(m)}}`;
    const scene = spiralFigure(m);
    return {
      questionLines: [
        `The position of a particle at time $t$ is given by the parametric equations $x = ${K}t\\cos t$, $y = ${K}t\\sin t$ $(t \\ge 0).$`,
        '<b>(a)</b> Find an expression for the instantaneous speed of the particle.',
        'The diagram below shows the path that the particle takes.',
        renderScene(scene),
        '<b>(b)</b> Calculate the instantaneous speed of the particle at point A.',
      ],
      figure: { scene, claims: [] },
      solutionSteps: [
        `<strong>(a)</strong> By the product rule, $\\frac{dx}{dt} = ${k === 1 ? '\\cos t' : `${k}\\cos t`} + \\ldots$`,
        `<strong>(a)</strong> $\\frac{dx}{dt} = ${dxdt}$`,
        `<strong>(a)</strong> $\\frac{dy}{dt} = ${dydt}$`,
        `<strong>(a)</strong> ${speedFormula}`,
        `<strong>(a)</strong> $${expanded}$`,
        `<strong>(b)</strong> At A, $${where.axis === 'x' ? 'y' : 'x'} = 0$: $0 = ${zero}$, so $${solutions}$`,
        `<strong>(b)</strong> A is the ${where.nth} time the path crosses the ${where.half}, so $t = ${tA}$ and the speed is $${atA}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1],
      finalAnswer: [`(a) $${speed}$`, `(b) $${atA}$`].join('<br>'),
      ladder: {
        moves: [
          'Speed is the size of the velocity. How do you get it from $\\frac{dx}{dt}$ and $\\frac{dy}{dt}$?',
          '(a) Differentiate $x$ or $y$ with the product rule.',
          '(a) Complete that derivative.',
          '(a) Find the other derivative.',
          '(a) Write the speed as the square root of the sum of the squares of the two derivatives.',
          '(a) Substitute, expand and simplify.',
          `(b) At A, $${where.axis === 'x' ? 'y' : 'x'} = 0$. Solve for $t$, and list the values in order.`,
          `(b) A is the ${where.nth} time the path crosses the ${where.half}. Choose that $t$ and find the speed.`,
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1],
        shows: [
          null,
          `$\\frac{dx}{dt} = ${k === 1 ? '\\cos t' : `${k}\\cos t`} + \\ldots$`,
          `$\\frac{dx}{dt} = ${dxdt}$`,
          `$\\frac{dy}{dt} = ${dydt}$`,
          speedFormula.replace(/^speed/, 'Speed'),
          `$${expanded}$`,
          `$0 = ${zero}$ and eg $t = ${first}$`,
          null,
        ],
        watch: { at: 7, text: `The path crosses the ${where.half} more than once. Use the diagram to choose the right crossing.` },
      },
    };
  },
};

export const ROUTINES = {
  '2017 Q3': q2017q3,
  '2017 Q11': q2017q11,
  '2017 Q18': q2017q18,
};
