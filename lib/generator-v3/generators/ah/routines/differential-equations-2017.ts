/**
 * Advanced Higher, Differential Equations: how each 2017 card is made.
 * What each card is, and why its numbers are what they are, is in
 * `../registry/differential-equations.ts` under the same label.
 *
 * The topic's routines are split by year so no file passes 700 lines
 * (`ah-purity`); `index.ts` merges them into the topic's one loader.
 */
import type { Built, CardRoutine } from '../types';
import { int, nonZero, pick, until } from '../../core/draw';
import { joinTerms, num, poly, sum } from '../../core/maths/format';
import { type Q, add, isInt, mul, q, sub } from '../../core/maths/rational';

const D2 = '\\frac{d^{2}y}{dx^{2}}';
const D1 = '\\frac{dy}{dx}';

// ── 2017 Q9 ────────────────────────────────────────────────────────────────
// dy/dx = ae^{kx}(1 + y²), y = y₀ at x = 0: tan⁻¹ y = (a/k)e^{kx} + c, with
// tan⁻¹ y₀ a standard angle, so c = θ₀ - a/k, as the paper's π/4 - 1/2 (a = 1).
// The number in front, a from 1 to 4, on the owner's yes (variation-depth sheet,
// card 2, 2026-10-05): twenty equations where there were five.

interface Q9of2017 { a: number; k: number; start: number }

/** y₀ and its inverse tangent, in sixths and quarters of π: the paper's 1 and π/4 first. */
const STARTS2017: readonly { y: string; angle: string; sign: 1 | -1 }[] = [
  { y: '1', angle: '\\frac{\\pi}{4}', sign: 1 },
  { y: '\\sqrt{3}', angle: '\\frac{\\pi}{3}', sign: 1 },
  { y: '\\frac{1}{\\sqrt{3}}', angle: '\\frac{\\pi}{6}', sign: 1 },
  { y: '-1', angle: '\\frac{\\pi}{4}', sign: -1 },
  { y: '-\\sqrt{3}', angle: '\\frac{\\pi}{3}', sign: -1 },
  { y: '-\\frac{1}{\\sqrt{3}}', angle: '\\frac{\\pi}{6}', sign: -1 },
];

const q2017q9: CardRoutine<Q9of2017> = {
  // a from 1 (the paper) to 4, k from 2 (the paper) to 6; y₀ one of ±1, ±√3, ±1/√3,
  // so tan⁻¹ y₀ is exact.
  draw: () => ({ a: int(1, 4), k: int(2, 6), start: int(0, STARTS2017.length - 1) }),

  build: ({ a, k, start }): Built => {
    const s = STARTS2017[start];
    const e = `e^{${k}x}`;
    const front = a === 1 ? '' : `${a}`;
    // a/k in lowest terms: the integral's number, and the constant's.
    const ratio = num(q(a, k));
    const inv = ratio === '1' ? '' : ratio;
    const theta = `${s.sign < 0 ? '-' : ''}${s.angle}`;
    const c = joinTerms([theta, `-${ratio}`]);
    const inside = joinTerms([`${inv}${e}`, theta, `-${ratio}`]);
    const separated = `\\int \\frac{dy}{1 + y^{2}} = \\int ${front}${e}\\,dx`;
    const answer = `y = \\tan\\left(${inside}\\right)`;
    const yAt = s.y.startsWith('-') ? `(${s.y})` : s.y;
    return {
      questionLines: [
        `Solve $${D1} = ${front}${e}(1 + y^{2})$ given that when $x = 0$, $y = ${s.y}.$`,
        'Express $y$ in terms of $x.$',
      ],
      solutionSteps: [
        `Separating the variables: $${separated}$`,
        '$\\int \\frac{dy}{1 + y^{2}} = \\tan^{-1} y$',
        `$\\int ${front}${e}\\,dx = ${inv}${e} + c$, so $\\tan^{-1} y = ${inv}${e} + c$`,
        `At $x = 0$, $y = ${s.y}$: $\\tan^{-1} ${yAt} = ${ratio} + c$, so $${theta} = ${ratio} + c$ and $c = ${c}$`,
        `$${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          'Can you get all the $y$ on one side and all the $x$ on the other?',
          'Separate the variables and write both sides as integrals.',
          'Integrate the $y$ side. Which standard integral has $1 + y^2$ underneath?',
          'Integrate the $x$ side, with a constant.',
          `Use $y = ${s.y}$ at $x = 0$ to find the constant, in radians.`,
          'Take the tangent of both sides to write $y$ in terms of $x$.',
        ],
        marks: [0, 1, 1, 1, 1, 1],
        shows: [null, `$${separated}$`, '$\\tan^{-1}y$', `$${inv}${e} + c$`, `$c = ${c}$`, null],
        watch: { at: 2, text: 'The $y$ side is an inverse tangent, not a logarithm.' },
      },
    };
  },
};

// ── 2017 Q14 ───────────────────────────────────────────────────────────────
// y'' - 2ry' + r²y = P sin x + Q cos x, a repeated root r: complementary
// function (A + Bx)e^{rx}, particular integral C sin x + D cos x with C or D
// a half, as the paper's -1/2, then y(0) and y'(0). Built from the answer.
// Its own routine; 2022 P2 Q10 asks the same with whole C and D.

interface Q14of2017 { r: number; A: number; B: number; c2: number; d2: number }

/** The right-hand side's sin and cos coefficients for C = c2/2, D = d2/2. */
function rightSide2017({ r, c2, d2 }: Q14of2017): [Q, Q] {
  const C = q(c2, 2), D = q(d2, 2), r2 = q(r * r - 1), tr = q(2 * r);
  return [add(mul(r2, C), mul(tr, D)), sub(mul(r2, D), mul(tr, C))];
}

const q2017q14: CardRoutine<Q14of2017> = {
  draw: () => until(
    () => ({ r: pick([-3, -2, 2, 3]), A: nonZero(-6, 6), B: nonZero(-15, 15), c2: nonZero(-6, 6), d2: nonZero(-6, 6) }),
    // C or D a half, as the paper's -1/2; both trig terms on the right whole,
    // nonzero and within 30, as 8 sin x + 19 cos x; y(0) within 12 and y'(0)
    // within 15, as 7 and 1/2.
    (n) => {
      const [P, Qc] = rightSide2017(n);
      const half = n.c2 % 2 !== 0 || n.d2 % 2 !== 0;
      const y0 = add(q(n.A), q(n.d2, 2)), y1 = add(q(n.r * n.A + n.B), q(n.c2, 2));
      const within = (v: Q, m: number) => Math.abs(Number(v.n) / Number(v.d)) <= m;
      return half && isInt(P) && isInt(Qc) && P.n !== 0n && Qc.n !== 0n && within(P, 30) && within(Qc, 30)
        && within(y0, 12) && within(y1, 15);
    },
    1000,
  ),

  build: (n): Built => {
    const { r, A, B, c2, d2 } = n;
    const C = q(c2, 2), D = q(d2, 2);
    const [P, Qc] = rightSide2017(n);
    const y0 = add(q(A), D), y1 = add(q(r * A + B), C);
    const exp = `e^{${sum([{ coef: r, body: 'x' }])}}`;
    const rhs = sum([{ coef: P, body: '\\sin x' }, { coef: Qc, body: '\\cos x' }]);
    const equation = `${sum([{ coef: 1, body: D2 }, { coef: -2 * r, body: D1 }, { coef: r * r, body: 'y' }])} = ${rhs}`;
    const auxiliary = `${poly([1, -2 * r, r * r], 'm')} = 0`;
    const cf = `y = A${exp} + Bx${exp}`;
    const pi = 'y = C\\sin x + D\\cos x';
    const derivs = `${D1} = C\\cos x - D\\sin x$, $${D2} = -C\\sin x - D\\cos x`;
    const coefIn = (k: number, expr: string) => `${k < 0 ? ' - ' : ' + '}${Math.abs(k)}(${expr})`;
    const substituted = `-C\\sin x - D\\cos x${coefIn(-2 * r, 'C\\cos x - D\\sin x')}${coefIn(r * r, 'C\\sin x + D\\cos x')} = ${rhs}`;
    const sinEq = `${sum([{ coef: r * r - 1, body: 'C' }, { coef: 2 * r, body: 'D' }])} = ${num(P)}`;
    const cosEq = `${sum([{ coef: -2 * r, body: 'C' }, { coef: r * r - 1, body: 'D' }])} = ${num(Qc)}`;
    const constants = `C = ${num(C)},\\ D = ${num(D)}`;
    const trig = (c: Q | number, d: Q | number) => [{ coef: c, body: '\\sin x' }, { coef: d, body: '\\cos x' }];
    const general = `y = ${sum([{ coef: 1, body: `A${exp}` }, { coef: 1, body: `Bx${exp}` }, ...trig(C, D)])}`;
    const derivative = `${D1} = ${sum([
      { coef: r, body: `A${exp}` }, { coef: 1, body: `B${exp}` }, { coef: r, body: `Bx${exp}` },
      { coef: C, body: '\\cos x' }, { coef: q(-d2, 2), body: '\\sin x' },
    ])}`;
    const answer = `y = ${sum([{ coef: A, body: exp }, { coef: B, body: `x${exp}` }, ...trig(C, D)])}`;
    const aLine = `${sum([{ coef: 1, body: 'A' }, { coef: D, body: '' }])} = ${num(y0)}`;
    const bLine = `${sum([{ coef: r, body: 'A' }, { coef: 1, body: 'B' }, { coef: C, body: '' }])} = ${num(y1)}`;
    return {
      questionLines: [
        'Find the particular solution of the differential equation',
        '',
        `$${equation}$`,
        '',
        `given that $y = ${num(y0)}$ and $${D1} = ${num(y1)}$ when $x = 0.$`,
      ],
      solutionSteps: [
        `The auxiliary equation is $${auxiliary}$`,
        `$(${poly([1, -r], 'm')})^{2} = 0$, a repeated root $m = ${r}$, so the complementary function is $${cf}$`,
        `For the particular integral, $${pi}$`,
        `$${derivs}$`,
        `$${substituted}$`,
        `Comparing coefficients of $\\sin x$ and $\\cos x$: $${sinEq}$, $${cosEq}$`,
        `$${constants}$`,
        `The general solution is $${general}$, and $${derivative}$`,
        `At $x = 0$, $y = ${num(y0)}$: $${aLine}$, so $A = ${A}$`,
        `At $x = 0$, $${D1} = ${num(y1)}$: $${bLine}$, so $B = ${B}$ and $${answer}$`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      finalAnswer: `$${answer}$`,
      ladder: {
        moves: [
          'The auxiliary equation has a repeated root. What does that change in the complementary function?',
          'Write the auxiliary equation.',
          'Solve it and write the complementary function for a repeated root.',
          'Write a particular integral with a sine and a cosine.',
          'Differentiate it twice.',
          'Substitute into the equation.',
          'Compare the coefficients of $\\sin x$ and $\\cos x$ to get two equations.',
          'Solve them for the two constants.',
          'Differentiate the general solution.',
          'Use the conditions at $x = 0$ to find one constant.',
          'Find the other and state the particular solution.',
        ],
        marks: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        shows: [
          null,
          `$${auxiliary}$`,
          `$${cf}$`,
          `$${pi}$`,
          `$${derivs}$`,
          `$${substituted}$`,
          `$${sinEq}$, $${cosEq}$`,
          `$${constants}$`,
          `$${derivative}$`,
          `$A = ${A}$ or $B = ${B}$`,
          null,
        ],
        watch: { at: 1, text: 'Write "$= 0$" on the auxiliary equation, or the first mark goes.' },
      },
    };
  },
};

export const ROUTINES = {
  '2017 Q9': q2017q9,
  '2017 Q14': q2017q14,
};
