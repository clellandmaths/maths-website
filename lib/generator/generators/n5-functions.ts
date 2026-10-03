import { GeneratedQuestion } from './types';
import type { Gen } from './n5';
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
type Shape = { tex: (v: string) => string; at: (x: number) => number; how: string;
  /** The substitution as the working prints it for a positive number, where `tex` would glue a coefficient to it. */
  work?: (v: string) => string };

/**
 * The four shapes, **in the order `evaluate`'s id list expects them**. An
 * entry moved here without moving there gives a paper another paper's function
 * under its own name, which is the fault this split exists to end.
 */
function shapes(which?: number): Shape[] {
  const b = nonZeroInt(2, 6), c = nonZeroInt(2, 9), a = nonZeroInt(2, 5);
  /**
   * **2022 P1 Q2 is `x^3 - 2`, and the minus is the question.**
   *
   * `nonZeroInt(2, 9)` only ever returns 2..9, so over 200 draws the constant
   * came out positive 200 times and the clone could never be its own paper.
   * The printed form has carried the `c < 0` branch since it was written; the
   * only thing missing was a constant that ever takes it.
   *
   * **The sign is taken from `a`, not drawn.** The same `c` is the offset in
   * `(x + c)^2`, which is 2024 P1 Q2 - signed off - and `a` is the multiplier
   * in `a x^3`, which this shape does not use. `a` runs 2..5, so its parity
   * splits the sign evenly and independently of `c`'s size.   *
   * **It costs no new random number, and that is not a detail.** `evaluate`
   * is a rejection sampler: it draws a shape at random and throws the draw
   * away when it is not the one asked for. A *discarded* draw still moves the
   * stream on, so an extra `getRandomInt` behind `which === 2` still shifts
   * every later draw of the other three shapes - `frozen` named 2024 P1 Q2,
   * which is signed off, on exactly that. Taking the sign off `a`, which is
   * already drawn and which this shape does not otherwise use, changes the
   * value and nothing else.
   */
  const cube = which === 2 && a % 2 === 0 ? -c : c;
  return [
    // 2017 P1 Q1: f(x) = x^2 + 3x
    { tex: v => `${v}^{2} ${b < 0 ? '-' : '+'} ${Math.abs(b)}${v}`,
      at: x => x * x + b * x,
      how: `square the number, then add ${b} times it`,
      // 2026-10-02 full read, the owner's "Yes": `tex('3')` printed "3^{2} + 63"
      work: v => `${v}^{2} ${b < 0 ? '-' : '+'} ${Math.abs(b)} \\times ${v}` },
    // 2019 P1 Q1: f(x) = 5x^3
    { tex: v => `${a}${v}^{3}`,
      at: x => a * x * x * x,
      how: `cube the number, then multiply by ${a}` },
    // 2022 P1 Q2: f(x) = x^3 - 2
    { tex: v => `${v}^{3} ${cube < 0 ? '-' : '+'} ${Math.abs(cube)}`,
      at: x => x * x * x + cube,
      how: `cube the number, then ${cube < 0 ? 'subtract' : 'add'} ${Math.abs(cube)}` },
    // 2024 P1 Q2: f(x) = (x + 3)^2
    { tex: v => `(${v} ${c < 0 ? '-' : '+'} ${Math.abs(c)})^{2}`,
      at: x => (x + c) * (x + c),
      how: `work out the bracket first, then square it` },
  ];
}

// ── evaluate — 2017 P1 Q1, 2019 P1 Q1, 2022 P1 Q2, 2024 P1 Q2 ────────────

/**
 * **One shape per variation, because the shape is the question.**
 *
 * The four papers set four different functions, and this used to pick between
 * them on every draw. Press Variation on 2024 P1 Q2 - which is `(x + 3)^2` -
 * and three times in four you were handed 2019's `5x^3`, 2022's `x^3 - 2` or
 * 2017's `x^2 + 3x`. Same marks, same two scheme rows, and not the question
 * you asked for; the owner read it off the contact sheet as "using more than
 * one generator", which is exactly what it looked like.
 *
 * So each shape has its own id and its own paper:
 *
 *   functions.evaluate                 x^2 + bx      2017 P1 Q1
 *   functions.evaluate-cube-multiple   a x^3         2019 P1 Q1
 *   functions.evaluate-cube-plus       x^3 + c       2022 P1 Q2
 *   functions.evaluate-square          (x + c)^2     2024 P1 Q2
 *
 * The shape is drawn **once, before the retry loop** - the rule in
 * `docs/diagram-questions.md` section 2 - so the mix is even rather than
 * whatever survives the guards below.
 */
function evaluate(wanted?: string): Q {
  const ids = ['functions.evaluate', 'functions.evaluate-cube-multiple',
               'functions.evaluate-cube-plus', 'functions.evaluate-square'];
  // Taught for docs/one-question-one-generator.md. `ids` is one id per shape,
  // so the id the caller asked for IS the index — no draw to discard. A topic
  // sheet names none and keeps the even draw across all four.
  const asked = wanted === undefined ? -1 : ids.indexOf(wanted);
  const which = asked >= 0 ? asked : getRandomInt(0, 3);
  for (let tries = 0; tries < 200; tries++) {
    const s = shapes(which)[which];
    const fn = pick(FN);
    /**
     * **2022 P1 Q2 always substitutes a negative, because that IS the
     * question.** It is `f(-3)` on `x^3 - 2`, and the second mark is for
     * knowing `(-3)^3 = -27` rather than `27`. Measured on the second pass:
     * the input came out POSITIVE in 79 of 300 draws, and `f(4)` on `x^3 + 6`
     * is `64 + 6` with no sign to get wrong — a different and easier question.
     * The owner, on the 2022 P1 sheet: *"Agree"*.
     *
     * **Pinned for this shape only.** Only three of the four papers substitute
     * a negative, and one of the four — 2024 P1 Q2 — is signed off. `which` is
     * read straight off the id the caller asked for and nothing is discarded to
     * reach it, so this branch never runs on another id and their draws are
     * untouched.
     *
     * The first pass fixed the sign of the CONSTANT on this shape and never
     * looked at the sign of the input.
     *
     * **2019 P1 Q1 is pinned for the same reason, added 2026-09-22.** It is
     * `f(-2)` on `5x^3`, answering -40, and the second mark is knowing
     * `(-2)^3 = -8` rather than `8`. Measured on its own second pass: positive
     * in **49 of 300** draws, so one in six was `5 x 8` with no sign to get
     * wrong. The owner: *"Agree to pin negative"*.
     *
     * That leaves the two shapes whose papers genuinely mix: `functions.
     * evaluate` (2017 P1 Q1) and `functions.evaluate-square` (2024 P1 Q2,
     * SIGNED OFF), which keep the draw they had.
     */
    const pinNegative = ids[which] === 'functions.evaluate-cube-plus'    // 2022 P1 Q2
      || ids[which] === 'functions.evaluate-cube-multiple';              // 2019 P1 Q1
    const input = pinNegative
      ? -getRandomInt(2, 6)
      // the papers on the remaining two shapes substitute either sign
      : getRandomInt(1, 4) === 1 ? getRandomInt(2, 8) : -getRandomInt(2, 6);
    const out = s.at(input);
    if (!Number.isInteger(out) || Math.abs(out) > 400) continue;
    // **Never zero.** The four papers answer 10, -40, -29 and 100. Zero is
    // reachable three ways here - x^2 + bx at x = -b, (x + c)^2 at x = -c, and
    // x^3 + 8 at x = -2 - and it came up twice in twelve draws. The second mark
    // is for evaluating, and an answer of 0 is the one value that can be
    // reached by more than one wrong route as easily as by the right one, so it
    // tells a pupil least about whether their substitution was sound.
    if (out === 0) continue;
    // **Nor 1 on 2024's square.** (x + c)^2 at x = -c +/- 1 squares a 1 and
    // leaves nothing to evaluate - 67 of 400 draws were 0 or 1. The owner, on
    // the 2024 re-review sheet: "Negative input is fine never answer 0 or 1".
    // Only this shape, read straight off the asked id.
    if (ids[which] === 'functions.evaluate-square' && out === 1) continue;

    const sub = input < 0 ? `(${input})` : `${input}`;
    // 2017 P1 Q1's shape only (the one with `work`): a positive number gets a
    // times sign, and no talk of brackets it does not have.
    const step1 = s.work && input > 0
      ? `<strong>1.</strong> Replace every $x$ with $${sub}$:<br><br>$${fn}(${input}) = ${s.work(sub)}$`
      : `<strong>1.</strong> Replace every $x$ with $${sub}$. Keep the brackets — they are what makes the sign come out right:<br><br>$${fn}(${input}) = ${s.tex(sub)}$`;
    return {
      subTopic: 'Evaluating a Function',
      difficulty: 'skill',
      variationId: ids[which],
      questionLines: [`Given that $${fn}(x) = ${s.tex('x')}$, evaluate $${fn}(${input})$.`],
      boardQuestionLines: [`$${fn}(x) = ${s.tex('x')}$. Find $${fn}(${input})$`],
      solutionSteps: [
        step1,
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

function findUnknown(wanted?: string, asked?: string): Q {
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
  // Taught: the two-part shape is 2025 P1 Q7 and has its own id, so the
  // asked id decides it rather than a coin.
  const twoPart = wanted !== undefined
    ? wanted === 'functions.evaluate-then-solve'
    : getRandomInt(0, 1) === 0;         // the 2025 P1 Q7 shape
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
        // 2015 P2 Q2 says "find a", where 2018 P2 Q6 says "calculate a". The owner,
        // on the 2015 P2 sheet: "Yes pin the word" (2026-09-25). Read from the asked
        // id alone, so no other paper's draws move.
        `Given that $${fn}(${unknown}) = ${target}$, ${asked === 'functions.find-unknown-2015' ? 'find' : 'calculate'} $${unknown}$.`,
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

function evaluateTrig(wanted?: string): Q {
  for (let tries = 0; tries < 300; tries++) {
    const fn = pick(FN);
    const k = getRandomInt(2, 9);              // the multiplier outside
    const inner = pick([2, 2, 3]);             // the multiplier on x
    const target = pick(QUADRANTAL);
    if (target.deg === 0 || target.deg % inner !== 0) continue;
    const at = target.deg / inner;
    // Taught: the cosine form is 2026 P1 Q13 and the sine form has no paper
    // behind it, so the asked id decides which is built.
    const ratio = wanted === 'functions.evaluate-trig' ? 'cos' as const
      : wanted === 'functions.evaluate-trig-sine-practice' ? 'sin' as const
      : pick(['sin', 'cos'] as const);
    const value = ratio === 'sin' ? target.sin : target.cos;
    // A zero answer hides the multiplier entirely and tests nothing about it
    if (value === 0) continue;
    const answer = k * value;

    return {
      subTopic: 'Evaluating a Trigonometric Function',
      difficulty: 'exam',
      /*
       * **The id follows the ratio — 2026-09-20.**
       *
       * 2026 P1 Q13 is `f(x) = 5 cos 2x`, and the second of its two marks is
       * knowing `cos 180 = -1` cold. The toss handed a pupil a sine question
       * under that paper's name in 58% of draws — measured, cosine came up in
       * 42%.
       *
       * Approved as two forms on the 2026–2023 closure sheet, and reopened
       * under the later *"cos gives cos and sin gives sin"* ruling. The owner,
       * at https://claude.ai/artifact/T9VBXrkAsE2nLdXGrJZNnY: *"Split by
       * function"*.
       *
       * The sine form has no paper behind it and is declared rather than
       * dropped, so a worksheet built from this topic still meets both.
       * Measured after the split, 300 draws each: both sides make 32 distinct
       * questions, so nothing was lost by narrowing.
       *
       * `ratio` is already drawn; reading it costs no randomness.
       */
      variationId: ratio === 'cos' ? 'functions.evaluate-trig'   // 2026 P1 Q13
        : 'functions.evaluate-trig-sine-practice',               // no paper
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

export const FUNCTION_GENERATORS: Record<string, Gen> = {
  'Evaluating a Function': evaluate,
  'Finding an Unknown in a Function': (w, asked) => findUnknown(w, asked),
  'Evaluating a Trigonometric Function': (w) => evaluateTrig(w),
};
