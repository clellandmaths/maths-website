import { GeneratedQuestion } from './types';
import { getRandomInt, nonZeroInt } from './utils';

/**
 * National 5 Functions — 7 paper questions, the simplest topic in the course.
 *
 * Five of the seven are two-mark evaluations, which makes this the best board
 * starter supply in N5 alongside vector components.
 *
 * The papers use two wordings, and they go with the two question types:
 *
 *   "Given that f(x)=x^2+3x, evaluate f(-5)."          2017, 2019, 2022, 2024
 *   "A function is defined as f(x)=5+4x. Given that
 *    f(a)=73, calculate a."                            2018, 2025
 *
 * Three of the four evaluations substitute a negative number, which is where
 * the marks go — (-5)^2 and (-2)^3 are the two slips — so negatives are
 * generated most of the time rather than occasionally.
 *
 * 2016 P1 Q9 is also a function evaluation, but its answer is a surd; it is
 * already built as surds.in-function and is not duplicated here.
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
type Q = Omit<GeneratedQuestion, 'topic'>;

/**
 * The function is always `f`, because at National 5 it always is.
 *
 * All **8** function-notation questions across the eleven papers name the
 * function `f` and its variable `x` - f:8, x:8 of 8. This used to rotate `f`,
 * `g` and `h`, so 70-83% of draws named a function no N5 paper ever names.
 *
 * `g(x)` and `h(x)` are perfectly ordinary notation and Higher uses them
 * freely; this is not a claim they are wrong. It is that a pupil recognises a
 * question partly by its letter, and at this level the exam gives them one.
 * See `__checks__/variables.ts`.
 */
const FN = ['f'];

/** The four function shapes the papers use, as printed form plus evaluator. */
type Shape = { tex: (v: string) => string; at: (x: number) => number; how: string };

function shapes(): Shape[] {
  const b = nonZeroInt(2, 6), c = nonZeroInt(2, 9), a = nonZeroInt(2, 5);
  return [
    // 2017 P1 Q1: f(x) = x^2 + 3x
    { tex: v => `${v}^{2} ${b < 0 ? '-' : '+'} ${Math.abs(b)}${v}`,
      at: x => x * x + b * x,
      how: `square the number, then add ${b} times it` },
    // 2019 P1 Q1: f(x) = 5x^3
    { tex: v => `${a}${v}^{3}`,
      at: x => a * x * x * x,
      how: `cube the number, then multiply by ${a}` },
    // 2022 P1 Q2: f(x) = x^3 - 2
    { tex: v => `${v}^{3} ${c < 0 ? '-' : '+'} ${Math.abs(c)}`,
      at: x => x * x * x + c,
      how: `cube the number, then ${c < 0 ? 'subtract' : 'add'} ${Math.abs(c)}` },
    // 2024 P1 Q2: f(x) = (x + 3)^2
    { tex: v => `(${v} ${c < 0 ? '-' : '+'} ${Math.abs(c)})^{2}`,
      at: x => (x + c) * (x + c),
      how: `work out the bracket first, then square it` },
  ];
}

// ── evaluate — 2017 P1 Q1, 2019 P1 Q1, 2022 P1 Q2, 2024 P1 Q2 ────────────

function evaluate(): Q {
  for (let tries = 0; tries < 200; tries++) {
    const s = pick(shapes());
    const fn = pick(FN);
    // three of the four papers substitute a negative
    const input = getRandomInt(1, 4) === 1 ? getRandomInt(2, 8) : -getRandomInt(2, 6);
    const out = s.at(input);
    if (!Number.isInteger(out) || Math.abs(out) > 400) continue;

    const sub = input < 0 ? `(${input})` : `${input}`;
    return {
      subTopic: 'Evaluating a Function',
      difficulty: 'skill',
      variationId: 'functions.evaluate',
      questionLines: [`Given that $${fn}(x) = ${s.tex('x')}$, evaluate $${fn}(${input})$.`],
      boardQuestionLines: [`$${fn}(x) = ${s.tex('x')}$. Find $${fn}(${input})$`],
      solutionSteps: [
        `<strong>1.</strong> Replace every $x$ with $${sub}$. Keep the brackets — they are what makes the sign come out right:<br><br>$${fn}(${input}) = ${s.tex(sub)}$`,
        `<strong>2.</strong> Now ${s.how}:<br><br>$${fn}(${input}) = ${out}$`,
      ],
      // •¹ substitute, •² evaluate — the same two marks in all four papers
      stepMarks: [1, 1],
      finalAnswer: `$${out}$`,
    };
  }
  throw new Error('functions.evaluate: no valid question found');
}

// ── find the unknown — 2018 P2 Q6, and 2025 P1 Q7 with its lead-in ────────
//
// Linear in both papers. 2025 leads in with an evaluation as part (a), so that
// two-part form is generated too. Answer-first: choose the unknown, then work
// out the target value, so the answer is always whole.
//
// Two variation ids, not one, because the two papers are worth different
// totals: 2018 P2 Q6 is two marks (•¹ valid strategy, •² state the value) and
// 2025 P1 Q7 is three (1 for part (a), then the same two for part (b)). One id
// covering both would have to claim a single `marks` for two different
// questions, and its steps could only add up half the time.
//
// The scheme gives no mark for rearranging, which is why the solve is two steps
// and not three: "set up the equation" then "state the value". A third step
// would be a hint the exam does not pay for.

function findUnknown(): Q {
  const fn = pick(FN);
  // The letter the question solves for is its own pool, separate from the
  // function's name: 2018 and 2025 write "f(a) = 73, calculate a" and 2022
  // writes it with p. `k` and `b` appear in no paper, and did in ~44% of draws.
  const unknown = pick(['a', 'a', 'p']);   // weighted as the papers weight it
  const m = nonZeroInt(2, 8);
  const c = nonZeroInt(-12, 12);
  // 2018 P2 Q6 writes "5 + 4x", so the constant does lead sometimes — but only
  // when it is positive, or the question reads "-4 + 5x" where "5x - 4" is meant
  const constantFirst = c > 0 && getRandomInt(0, 1) === 0;
  const tex = constantFirst
    ? `${c} + ${m}x`
    : `${m}x ${c < 0 ? '-' : '+'} ${Math.abs(c)}`;

  const answer = nonZeroInt(-9, 15);
  const target = m * answer + c;
  const twoPart = getRandomInt(0, 1) === 0;         // the 2025 P1 Q7 shape
  const evalAt = getRandomInt(2, 9);
  const evalOut = m * evalAt + c;

  const setUp = `Set the function equal to the given value:<br><br>$${m === 1 ? '' : m}${unknown} ${c < 0 ? '-' : '+'} ${Math.abs(c)} = ${target}$`;
  const solved = `${c < 0 ? `Add $${-c}$ to` : `Subtract $${c}$ from`} both sides, then divide by $${m}$:<br><br>$${m === 1 ? '' : m}${unknown} = ${target - c}$, so $${unknown} = ${answer}$`;

  if (!twoPart) {
    return {
      subTopic: 'Finding an Unknown in a Function',
      difficulty: 'skill',
      variationId: 'functions.find-unknown',
      questionLines: [
        `A function is defined as $${fn}(x) = ${tex}$.`,
        `Given that $${fn}(${unknown}) = ${target}$, calculate $${unknown}$.`,
      ],
      boardQuestionLines: [`$${fn}(x) = ${tex}$ and $${fn}(${unknown}) = ${target}$. Find $${unknown}$`],
      solutionSteps: [
        `<strong>1.</strong> ${setUp}`,
        `<strong>2.</strong> ${solved}`,
      ],
      // 2018 P2 Q6: •¹ valid strategy, •² state the value
      stepMarks: [1, 1],
      finalAnswer: `$${unknown} = ${answer}$`,
    };
  }

  return {
    subTopic: 'Finding an Unknown in a Function',
    difficulty: 'skill',
    variationId: 'functions.evaluate-then-solve',
    questionLines: [
      `A function is defined as $${fn}(x) = ${tex}$.`,
      `(a) Evaluate $${fn}(${evalAt})$.`,
      `(b) Given that $${fn}(${unknown}) = ${target}$, find the value of $${unknown}$.`,
    ],
    boardQuestionLines: [`$${fn}(x) = ${tex}$. Find $${fn}(${evalAt})$, then $${unknown}$ when $${fn}(${unknown}) = ${target}$`],
    solutionSteps: [
      `<strong>(a)</strong> Replace $x$ with $${evalAt}$:<br><br>$${fn}(${evalAt}) = ${evalOut}$`,
      `<strong>(b)</strong> ${setUp}`,
      `<strong>(b)</strong> ${solved}`,
    ],
    // 2025 P1 Q7: •¹ state f(6) for part (a), then •² valid strategy and
    // •³ state the value for part (b)
    stepMarks: [1, 1, 1],
    finalAnswer: `(a) $${evalOut}$, (b) $${unknown} = ${answer}$`,
  };
}

// ── evaluating a trigonometric function — 2026 P1 Q13 ────────────────────
//
// "Given that f(x) = 5 cos 2x°, evaluate f(90)." Function notation on the
// outside and a related angle on the inside — the paper tags it as both, and it
// is the second that carries the question: substituting is one line, and then a
// pupil has to know cos 180° = −1 cold, in a non-calculator paper.
//
// Curated, because that is the whole constraint. The angle *after* doubling has
// to be one a pupil is expected to know exactly, and nothing else will do.

/** Angles whose sine and cosine a National 5 pupil is expected to know. */
const QUADRANTAL: { deg: number; sin: number; cos: number }[] = [
  { deg: 0, sin: 0, cos: 1 },
  { deg: 90, sin: 1, cos: 0 },
  { deg: 180, sin: 0, cos: -1 },
  { deg: 270, sin: -1, cos: 0 },
  { deg: 360, sin: 0, cos: 1 },
];

function evaluateTrig(): Q {
  for (let tries = 0; tries < 300; tries++) {
    const fn = pick(FN);
    const k = getRandomInt(2, 9);              // the multiplier outside
    const inner = pick([2, 2, 3]);             // the multiplier on x
    const target = pick(QUADRANTAL);
    if (target.deg === 0 || target.deg % inner !== 0) continue;
    const at = target.deg / inner;
    const ratio = pick(['sin', 'cos'] as const);
    const value = ratio === 'sin' ? target.sin : target.cos;
    // A zero answer hides the multiplier entirely and tests nothing about it
    if (value === 0) continue;
    const answer = k * value;

    return {
      subTopic: 'Evaluating a Trigonometric Function',
      difficulty: 'exam',
      variationId: 'functions.evaluate-trig',
      questionLines: [
        `Given that $${fn}(x) = ${k}\\,\\${ratio}\\,${inner}x^{\\circ}$, evaluate $${fn}(${at})$.`,
      ],
      boardQuestionLines: [`$${fn}(x) = ${k}\\,\\${ratio}\\,${inner}x^{\\circ}$. Find $${fn}(${at})$.`],
      solutionSteps: [
        `<strong>1.</strong> Replace $x$ with $${at}$, working out the angle inside first:<br><br>$${fn}(${at}) = ${k}\\,\\${ratio}\\,(${inner} \\times ${at})^{\\circ} = ${k}\\,\\${ratio}\\,${target.deg}^{\\circ}$`,
        `<strong>2.</strong> $\\${ratio} ${target.deg}^{\\circ} = ${value}$, so multiply:<br><br>$${k} \\times (${value}) = ${answer}$`,
      ],
      // 2026 P1 Q13 has no published scheme. Two marks, and the split follows
      // every other function evaluation in the papers: substitute, then evaluate.
      stepMarks: [1, 1],
      finalAnswer: `$${answer}$`,
    };
  }
  throw new Error('functions.evaluate-trig: no valid question found');
}

export const FUNCTION_GENERATORS: Record<string, () => Q> = {
  'Evaluating a Function': evaluate,
  'Finding an Unknown in a Function': findUnknown,
  'Evaluating a Trigonometric Function': evaluateTrig,
};
