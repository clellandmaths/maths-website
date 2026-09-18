import { GeneratedQuestion } from './types';
import { getRandomInt, gcd } from './utils';
import { ROTATING_CONTEXTS, withUnit } from './n5-contexts';

/**
 * National 5 trigonometric equations and identities — the parts needing no
 * diagram. 15 paper questions.
 *
 * Equations are uniform: "Solve the equation 11cos x° - 2 = 3, for 0 ≤ x ≤ 360",
 * three marks, two answers to one decimal place. All six paper examples leave a
 * positive ratio, so that case dominates here, but a negative one is in scope
 * and is generated a fifth of the time — it is where the second quadrant trips
 * pupils up.
 *
 * ⚠️ The gap table lists three identity types. Reading the six questions there
 * are **five** distinct shapes, all worth two marks:
 *
 *   tan substitution   tan²x cos²x                -> sin²x        2016 P1 Q11
 *                      sin x cos x tan x          -> sin²x        2018 P1 Q18
 *   expand a bracket   (sin x + cos x)²           -> 1 + 2sinxcosx 2019 P2 Q17
 *   common factor      sin²x cos²x + cos⁴x        -> cos²x        2023 P2 Q13
 *   split a fraction   (sin x + 2cos x)/cos x     -> tan x + 2    2022 P2 Q13
 *   a given form       3cos²x - 1 = a + b sin²x                    2024 P2 Q16
 *
 * Four of the six say "Show your working." — it is printed most of the time.
 *
 * The formula questions (2017 P2 Q15, 2023 P2 Q11, 2025 P2 Q14) are the same
 * question three ways: a height h = B ± A cos x°, then evaluate it, find its
 * extremes, or solve for x. They are set in a context, so they draw on
 * ROTATING_CONTEXTS — see docs/context-variety.md.
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
type Q = Omit<GeneratedQuestion, 'topic'>;

const S = '\\sin x^{\\circ}';
const C = '\\cos x^{\\circ}';
const T = '\\tan x^{\\circ}';
const S2 = '\\sin^{2}x^{\\circ}';
const C2 = '\\cos^{2}x^{\\circ}';
const WORKING = 'Show your working.';

/** "3\sin x^{\circ}", with a unit coefficient left implicit. */
const times = (k: number, tex: string): string =>
  k === 1 ? tex : k === -1 ? `-${tex}` : `${k}${tex}`;

const dp1 = (v: number): string => v.toFixed(1);

// ── solve a trigonometric equation ───────────────────────────────────────
//    sin  2018 P2 Q8, 2022 P2 Q9, 2024 P2 Q11
//    cos  2014 P2 Q12, 2019 P2 Q14
//    tan  2016 P2 Q14, 2026 P2 Q8

/**
 * **The ratio is the question, so the clone takes it from the paper.**
 *
 * Seven papers ask this and all seven are the same three marks with the same
 * scheme wording — rearrange, find one value, find the other. What differs is
 * which ratio, and that is not a number: the second solution comes from a
 * different quadrant rule for each, which is where the third mark goes.
 *
 *   sin   2018 P2 Q8, 2022 P2 Q9, 2024 P2 Q11     second value 180 - x
 *   cos   2014 P2 Q12, 2019 P2 Q14                second value 360 - x
 *   tan   2016 P2 Q14, 2026 P2 Q8                 second value 180 + x
 *
 * This drew the ratio at random, so pressing Variation on a cos paper returned
 * a sin question two times in five. Within each ratio the papers really are the
 * same question with different numbers — including the sign, which follows from
 * them — so each ratio gets one variation and no more.
 */
function solveEquation(fn: 'sin' | 'cos' | 'tan'): Q {
  for (let tries = 0; tries < 400; tries++) {
    const a = getRandomInt(2, 20);
    const b = getRandomInt(-9, 9);
    const c = getRandomInt(-9, 12);
    if (b === c) continue;                          // the ratio would be zero
    const r = (c - b) / a;
    // A fifth of the time the ratio is negative, which two of the seven papers
    // are — 2016's tan x = -9/2 and 2019's cos x = -1/5. (This used to say the
    // papers had not used one.)
    if (r > 0 === (getRandomInt(1, 5) === 1)) continue;
    if (fn !== 'tan' && Math.abs(r) >= 0.98) continue;
    if (Math.abs(r) < 0.06) continue;
    if (fn === 'tan' && Math.abs(r) > 6) continue;

    let x1: number, x2: number, rule: string, base = 0;
    if (fn === 'sin') {
      base = Math.asin(Math.abs(r)) * 180 / Math.PI;
      [x1, x2] = r > 0 ? [base, 180 - base] : [180 + base, 360 - base];
      rule = r > 0 ? 'x and 180 - x' : '180 + x and 360 - x';
    } else if (fn === 'cos') {
      base = Math.acos(Math.abs(r)) * 180 / Math.PI;
      [x1, x2] = r > 0 ? [base, 360 - base] : [180 - base, 180 + base];
      rule = r > 0 ? 'x and 360 - x' : '180 - x and 180 + x';
    } else {
      base = Math.atan(Math.abs(r)) * 180 / Math.PI;
      [x1, x2] = r > 0 ? [base, 180 + base] : [180 - base, 360 - base];
      rule = r > 0 ? 'x and 180 + x' : '180 - x and 360 - x';
    }
    if (Math.abs(x1 - Math.round(x1)) < 0.04) continue;   // avoid a special angle

    const tex = fn === 'sin' ? S : fn === 'cos' ? C : T;
    const g = gcd(Math.abs(c - b), a) || 1;
    const ratioTex = a / g === 1 ? `${(c - b) / g}` : `\\frac{${(c - b) / g}}{${a / g}}`;
    const lhs = `${times(a, tex)} ${b < 0 ? '-' : '+'} ${Math.abs(b)}`;
    // **The domain as the papers write it, both ways.** Five of the nine
    // trigonometric equations in the corpus close the range - 2016 P2 Q14's
    // `0 <= x <= 360` - and four leave it open, 2026 P2 Q8 among them with
    // `0 <= x < 360`. This printed the closed form always, so a clone of 2026
    // stated a domain its paper does not. Nothing turns on it here: the guard
    // above rejects a reference angle within 0.04 of a whole number, so no
    // solution can land on 0 or on 360 and the two forms admit the same pair.
    const domain = getRandomInt(0, 1) === 0 ? '0 \\le x \\le 360' : '0 \\le x \\lt 360';

    return {
      subTopic: 'Solving Trigonometric Equations',
      difficulty: 'skill',
      variationId: fn === 'sin' ? 'trig-equations.solve'
        : fn === 'cos' ? 'trig-equations.solve-cos' : 'trig-equations.solve-tan',
      questionLines: [
        `Solve the equation $${lhs} = ${c}$, for $${domain}$.`,
      ],
      boardQuestionLines: [`Solve $${lhs} = ${c}$, $${domain}$`],
      // •¹ rearrange, •² find one value of x, •³ find another. The two values
      // are separate marks, so they are separate steps — printing both at once
      // meant the withheld hint carried both, and a pupil who took every hint
      // was left to produce two answers rather than one.
      solutionSteps: [
        `<strong>1.</strong> Get the ${fn} on its own:<br><br>$${times(a, tex)} = ${c - b}$, so $${tex} = ${ratioTex}$`,
        `<strong>2.</strong> Take the inverse of the <strong>positive</strong> ratio to find the reference angle, $${dp1(base)}$. ${r < 0 ? `The ratio is <strong>negative</strong>, so both answers come from the quadrants where $\\${fn}$ is negative` : `The ratio is positive`}, and the two solutions in $${domain}$ are ${rule}. The first is:<br><br>$x = ${dp1(x1)}$`,
        `<strong>3.</strong> And the second:<br><br>$x = ${dp1(x2)}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `$x = ${dp1(x1)}$ or $x = ${dp1(x2)}$`,
    };
  }
  throw new Error(`trig-equations.solve (${fn}): no valid question found`);
}

// ── a height that follows a cosine — 2017 P2 Q15, 2023 P2 Q11, 2025 P2 Q14 ─

function inFormula(): Q {
  for (let tries = 0; tries < 400; tries++) {
    const ctx = pick(ROTATING_CONTEXTS);
    const B = getRandomInt(ctx.centre[0], ctx.centre[1]);
    const A = getRandomInt(ctx.swing[0], ctx.swing[1]);
    if (A >= B) continue;
    const minus = getRandomInt(0, 1) === 0;         // "10 - 8cos x" as in 2025
    const formula = minus ? `h = ${B} - ${times(A, C)}` : `h = ${B} + ${times(A, C)}`;

    const solveFor = getRandomInt(0, 1) === 0;
    if (solveFor) {
      // choose the target height from a whole ratio, so the angle is clean to find
      const target = B + (minus ? -1 : 1) * (getRandomInt(-(A - 1), A - 1));
      const r = minus ? (B - target) / A : (target - B) / A;
      if (Math.abs(r) >= 0.98 || Math.abs(r) < 0.06) continue;
      const base = Math.acos(Math.abs(r)) * 180 / Math.PI;
      const [x1, x2] = r > 0 ? [base, 360 - base] : [180 - base, 180 + base];
      if (Math.abs(x1 - Math.round(x1)) < 0.04) continue;

      return {
        subTopic: 'Trigonometric Equations in a Formula',
        difficulty: 'exam',
        variationId: 'trig-equations.in-formula',
        questionLines: [
          `${ctx.scene}`,
          `The height, $h$ ${ctx.unit}, of ${ctx.thing} above the ground is given by $${formula}$,`,
          `where $x^{\\circ}$ is ${ctx.angle}.`,
          `Calculate the two values of $x$ for which the height of ${ctx.thing} is ${target} ${ctx.unit}.`,
        ],
        boardQuestionLines: [`$${formula}$. Find $x$ when $h = ${target}$`],
        // •¹ substitute the height into the formula, •² rearrange, •³ one value
        // of x, •⁴ the second — the same four in 2023, 2025 and 2017's part (c)
        solutionSteps: [
          `<strong>1.</strong> Put the height into the formula:<br><br>$${target} = ${B} ${minus ? '-' : '+'} ${times(A, C)}$`,
          `<strong>2.</strong> Rearrange to get the cosine on its own:<br><br>$${C} = ${r.toFixed(4)}$`,
          `<strong>3.</strong> Take the inverse cosine, then use that ${r > 0 ? 'the second solution is $360 - x$' : 'a negative cosine gives solutions $180 - x$ and $180 + x$'}. The first value is:<br><br>$x = ${dp1(x1)}$`,
          `<strong>4.</strong> And the second:<br><br>$x = ${dp1(x2)}$`,
        ],
        stepMarks: [1, 1, 1, 1],
        finalAnswer: `$x = ${dp1(x1)}$ or $x = ${dp1(x2)}$`,
      };
    }

    // 2017 P2 Q15 parts (a) and (b): evaluate at an angle, then state the
    // minimum. One mark each, where the solving shape above is worth four, so
    // this cannot share an id with it.
    const at = pick([30, 45, 60, 120, 135, 150, 210, 240, 300]);
    const value = B + (minus ? -1 : 1) * A * Math.cos(at * Math.PI / 180);
    const lowest = B - A;

    return {
      subTopic: 'Trigonometric Equations in a Formula',
      difficulty: 'exam',
      variationId: 'trig-equations.in-formula-evaluate',
      questionLines: [
        `${ctx.scene}`,
        `The height, $h$ ${ctx.unit}, of ${ctx.thing} above the ground is given by $${formula}$,`,
        `where $x^{\\circ}$ is ${ctx.angle}.`,
        `(a) Calculate the height of ${ctx.thing} after it has turned through an angle of $${at}^{\\circ}$.`,
        `(b) Find the minimum height of ${ctx.thing} above the ground.`,
      ],
      boardQuestionLines: [`$${formula}$. Height at $${at}^{\\circ}$, and the minimum`],
      solutionSteps: [
        `<strong>(a)</strong> Substitute $x = ${at}$:<br><br>$h = ${B} ${minus ? '-' : '+'} ${A} \\times \\cos ${at}^{\\circ} = ${dp1(value)}$`,
        `<strong>(b)</strong> The cosine runs between $-1$ and $1$, so the height is smallest when $${minus ? `\\cos x^{\\circ} = 1` : `\\cos x^{\\circ} = -1`}$:<br><br>$h = ${B} - ${A} = ${lowest}$ ${ctx.unit}`,
      ],
      // one mark for the height, one for the minimum
      stepMarks: [1, 1],
      finalAnswer: `(a) ${dp1(value)} ${ctx.unit}, (b) ${withUnit(lowest, ctx.unit)}`,
    };
  }
  throw new Error('trig-equations.in-formula: no valid question found');
}

// ── substitute tan and cancel — 2016 P1 Q11, 2018 P1 Q18 ────────────────
//
// The two papers are the same move: write `tan x` as `sin x / cos x`, then
// cancel the cosine against one already in the expression. 2016 sets it as a
// pair of squares, `tan^2 x cos^2 x`; 2018 as a three-way product,
// `sin x cos x tan x`. Different powers, one move — so one variation, and the
// powers are the numbers that vary.
//
// **The pool had exactly those two expressions in it and nothing else**, so
// each paper could only ever be offered itself: `similar.ts` calls that a dead
// "more like this" link and is right to. What a National 5 pupil can be asked
// with `tan x = sin x / cos x` is wider than two, and every entry below is a
// product or a quotient a paper could set:
//
//   sin^p x cos^q x tan^r x  =  sin^(p+r) x cos^(q-r) x     needs q >= r
//   sin^n x  /  tan^n x      =  cos^n x                     divide by flipping
//
// The quotient form leans on dividing by a fraction, which is National 5
// algebraic fractions — padding the trigonometry with a skill the pupil
// already has, rather than inventing a trigonometric one.

/** A product `sin^p cos^q tan^r`, with the powers it cancels down to. */
interface TanProduct { p: number; q: number; r: number }

/**
 * The pool, every entry a legal National 5 expression.
 *
 * `q >= r` throughout: the cosine the tangent brings down has to have one to
 * cancel against, or the answer is a fraction and the question is a different
 * one. (0,2,2) is 2016 P1 Q11 and (1,1,1) is 2018 P1 Q18.
 */
const TAN_PRODUCTS: TanProduct[] = [
  { p: 0, q: 1, r: 1 },   // tan x cos x            -> sin x
  { p: 0, q: 2, r: 2 },   // tan^2 x cos^2 x        -> sin^2 x     2016 P1 Q11
  { p: 1, q: 1, r: 1 },   // sin x cos x tan x      -> sin^2 x     2018 P1 Q18
  { p: 0, q: 2, r: 1 },   // tan x cos^2 x          -> sin x cos x
  { p: 1, q: 2, r: 1 },   // sin x cos^2 x tan x    -> sin^2 x cos x
  { p: 0, q: 3, r: 2 },   // tan^2 x cos^3 x        -> sin^2 x cos x
  { p: 1, q: 2, r: 2 },   // sin x cos^2 x tan^2 x  -> sin^3 x
  { p: 2, q: 2, r: 2 },   // sin^2 x cos^2 x tan^2 x -> sin^4 x
];

/** `\\sin^{2}x^{\\circ}`, or `\\sin x^{\\circ}` at the first power, or nothing. */
function power(fn: 's' | 'c' | 't', n: number): string {
  if (n <= 0) return '';
  const base = fn === 's' ? '\\sin' : fn === 'c' ? '\\cos' : '\\tan';
  return n === 1 ? `${base} x^{\\circ}` : `${base}^{${n}}x^{\\circ}`;
}

function substituteTan(): Q {
  // A quotient one time in four: it is the same identity read the other way,
  // and the papers have not set one, so it stays the minority.
  const quotient = getRandomInt(1, 4) === 1;

  if (quotient) {
    const n = pick([1, 2]);
    const top = power('s', n), bot = power('t', n), ans = power('c', n);
    const expr = `\\frac{${top}}{${bot}}`;
    return {
      subTopic: 'Simplifying Trigonometric Expressions',
      difficulty: 'exam',
      variationId: 'trig-identities.simplify',
      questionLines: [`Simplify $${expr}$.`, WORKING],
      boardQuestionLines: [`Simplify $${expr}$`],
      solutionSteps: [
        `<strong>1.</strong> Replace the tangent using $\\tan x^{\\circ} = \\frac{${S}}{${C}}$, and divide by flipping:<br><br>$${top} \\div \\frac{${top}}{${ans}} = ${top} \\times \\frac{${ans}}{${top}}$`,
        `<strong>2.</strong> The $${top}$ cancels:<br><br>$${ans}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$${ans}$`,
    };
  }

  const { p, q, r } = pick(TAN_PRODUCTS);
  // Written tangent-first where there is no sine in front of it, as 2016 does,
  // and sine-cosine-tangent otherwise, as 2018 does.
  const expr = p === 0
    ? `${power('t', r)}${power('c', q)}`
    : `${power('s', p)}${power('c', q)}${power('t', r)}`;
  const ans = `${power('s', p + r)}${power('c', q - r)}`;
  // What the substitution leaves before anything cancels.
  const substituted = `${power('s', p)}${power('c', q)} \\times \\frac{${power('s', r)}}{${power('c', r)}}`;
  const cancelled = q === r ? power('c', r) : `${power('c', r)}`;

  return {
    subTopic: 'Simplifying Trigonometric Expressions',
    difficulty: 'exam',
    variationId: 'trig-identities.simplify',
    questionLines: [
      p === 0 ? `Simplify $${expr}$.` : `Express $${expr}$ in its simplest form.`,
      WORKING,
    ],
    boardQuestionLines: [`Simplify $${expr}$`],
    solutionSteps: [
      `<strong>1.</strong> Replace the tangent using $\\tan x^{\\circ} = \\frac{${S}}{${C}}$:<br><br>$${substituted}$`,
      `<strong>2.</strong> The $${cancelled}$ cancels:<br><br>$${ans}$`,
    ],
    stepMarks: [1, 1],
    finalAnswer: `$${ans}$`,
  };
}

// ── a common factor, then sin^2 + cos^2 = 1 — 2023 P2 Q13, 2026 P2 Q12 ───
//
// Both papers take a factor out of two terms and find the bracket is the
// identity. 2023 sets a matched pair of squares, `sin^2 x cos^2 x + cos^4 x`;
// 2026 the harder read, `cos x sin^2 x + cos^3 x`, where the common factor is a
// bare cosine beside a squared term and does not announce itself.
//
// A whole-number coefficient widens it without changing the move: it comes
// straight back out at the end, and taking a numerical factor out alongside an
// algebraic one is National 5 factorising.

function commonFactor(): Q {
  const sinFirst = getRandomInt(0, 1) === 0;
  const odd = getRandomInt(0, 1) === 0;
  const k = pick([1, 1, 2, 3, 4, 5]);          // 1 twice: the papers' own form
  const [keep, other] = sinFirst
    ? [odd ? C : C2, S2]
    : [odd ? S : S2, C2];
  const cubed = sinFirst
    ? (odd ? '\\cos^{3}x^{\\circ}' : '\\cos^{4}x^{\\circ}')
    : (odd ? '\\sin^{3}x^{\\circ}' : '\\sin^{4}x^{\\circ}');
  // "cos x sin^2 x", not "sin^2 x cos x" — the paper leads with the factor
  const product = odd ? `${keep}${other}` : `${other}${keep}`;
  const co = k === 1 ? '' : `${k}`;
  const factored = k === 1 ? keep : `${k}${keep}`;

  return {
    subTopic: 'Simplifying Trigonometric Expressions',
    difficulty: 'exam',
    variationId: 'trig-identities.common-factor',
    // **Both papers' instructions, because they do not use the same one.**
    // 2023 P2 Q13 says "Simplify ... Show your working."; 2026 P2 Q12 says
    // "Express the following in its simplest form:" and asks for no working.
    // The header above already said the line is printed "most of the time" -
    // it was printed every time, so one of the two papers never got its own
    // wording. The marks are the same either way: the first is for factorising
    // or substituting, which a bare answer cannot earn whether the paper asks
    // for working or not.
    questionLines: getRandomInt(0, 1) === 0
      ? [`Simplify $${co}${product} + ${co}${cubed}$.`, WORKING]
      : ['Express the following in its simplest form:',
         `$${co}${product} + ${co}${cubed}$`],
    boardQuestionLines: [`Simplify $${co}${product} + ${co}${cubed}$`],
    solutionSteps: [
      `<strong>1.</strong> Take out the common factor $${factored}$:<br><br>$${factored}\\left(${other} + ${odd ? (sinFirst ? C2 : S2) : keep}\\right)$`,
      `<strong>2.</strong> The bracket is $${S2} + ${C2} = 1$:<br><br>$${factored} \\times 1 = ${factored}$`,
    ],
    stepMarks: [1, 1],
    finalAnswer: `$${factored}$`,
  };
}

// ── expand a bracket — 2019 P2 Q17 ───────────────────────────────────────
//    (sin x + cos x)^2 = sin^2 + 2 sin cos + cos^2 = 1 + 2 sin x cos x

function expandBracket(): Q {
  const sign = getRandomInt(0, 1) === 0 ? '+' : '-';

  // The paper's own shape has only two forms, which is too few for a worksheet.
  // A difference of two squares against 1 uses the same identity rearranged, and
  // a common coefficient scales it — both stay squarely in the N5 skill.
  const shape = pick(['square', 'square', 'scaled', 'difference'] as const);

  if (shape === 'difference') {
    // (1 + sin x)(1 - sin x) = 1 - sin^2 x = cos^2 x
    const useSin = getRandomInt(0, 1) === 0;
    const [f, sq, other] = useSin ? [S, S2, C2] : [C, C2, S2];
    return {
      subTopic: 'Expanding Trigonometric Brackets',
      difficulty: 'exam',
      variationId: 'trig-identities.expand',
      questionLines: [`Expand and simplify $\\left(1 + ${f}\\right)\\left(1 - ${f}\\right)$.`, WORKING],
      boardQuestionLines: [`Expand $\\left(1 + ${f}\\right)\\left(1 - ${f}\\right)$`],
      solutionSteps: [
        `<strong>1.</strong> This is a difference of two squares:<br><br>$1 - ${sq}$`,
        `<strong>2.</strong> Rearranging $${S2} + ${C2} = 1$ gives $1 - ${sq} = ${other}$:<br><br>$${other}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$${other}$`,
    };
  }

  const k = shape === 'scaled' ? getRandomInt(2, 5) : 1;
  const inner = k === 1 ? `${S} ${sign} ${C}` : `${k}${S} ${sign} ${k}${C}`;
  const sq = k * k;
  const cross = 2 * k * k;

  return {
    subTopic: 'Expanding Trigonometric Brackets',
    difficulty: 'exam',
    variationId: 'trig-identities.expand',
    questionLines: [`Expand and simplify $\\left(${inner}\\right)^{2}$.`, WORKING],
    boardQuestionLines: [`Expand $\\left(${inner}\\right)^{2}$`],
    solutionSteps: [
      `<strong>1.</strong> Expand the bracket as you would any square:<br><br>$${times(sq, S2)} ${sign} ${cross}${S}${C} + ${times(sq, C2)}$`,
      k === 1
        ? `<strong>2.</strong> The two squared terms are $${S2} + ${C2} = 1$:<br><br>$1 ${sign} ${cross}${S}${C}$`
        : `<strong>2.</strong> Take out the $${sq}$: the squared terms are $${sq}\\left(${S2} + ${C2}\\right) = ${sq}$:<br><br>$${sq} ${sign} ${cross}${S}${C}$`,
    ],
    stepMarks: [1, 1],
    finalAnswer: `$${sq} ${sign} ${cross}${S}${C}$`,
  };
}

// ── split a fraction — 2022 P2 Q13 ───────────────────────────────────────
//    (sin x + 2 cos x)/cos x = tan x + 2

function splitFraction(): Q {
  const k = getRandomInt(2, 9);
  const overCos = getRandomInt(0, 1) === 0;
  const minus = getRandomInt(0, 1) === 0;
  const sign = minus ? '-' : '+';

  if (overCos) {
    return {
      subTopic: 'Trigonometric Fractions',
      difficulty: 'exam',
      variationId: 'trig-identities.fractions',
      questionLines: [`Simplify $\\frac{${S} ${sign} ${k}${C}}{${C}}$.`],
      boardQuestionLines: [`Simplify $\\frac{${S} ${sign} ${k}${C}}{${C}}$`],
      solutionSteps: [
        `<strong>1.</strong> Write it as two separate fractions:<br><br>$\\frac{${S}}{${C}} ${sign} \\frac{${k}${C}}{${C}}$`,
        `<strong>2.</strong> The first is $\\tan x^{\\circ}$ and the second cancels to $${k}$:<br><br>$${T} ${sign} ${k}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$${T} ${sign} ${k}$`,
    };
  }

  // over sin: (cos x + k sin x)/sin x = 1/tan x + k, so the papers use cos on the
  // bottom instead — keep to that and vary the numerator order
  return {
    subTopic: 'Trigonometric Fractions',
    difficulty: 'exam',
    variationId: 'trig-identities.fractions',
    questionLines: [`Simplify $\\frac{${k}${C} ${sign} ${S}}{${C}}$.`],
    boardQuestionLines: [`Simplify $\\frac{${k}${C} ${sign} ${S}}{${C}}$`],
    solutionSteps: [
      `<strong>1.</strong> Write it as two separate fractions:<br><br>$\\frac{${k}${C}}{${C}} ${sign} \\frac{${S}}{${C}}$`,
      `<strong>2.</strong> The first cancels to $${k}$ and the second is $\\tan x^{\\circ}$:<br><br>$${k} ${sign} ${T}$`,
    ],
    stepMarks: [1, 1],
    finalAnswer: `$${k} ${sign} ${T}$`,
  };
}

// ── write in a given form — 2024 P2 Q16 ──────────────────────────────────
//
// **Two shapes, and only one of them was here.** The marking instructions are
// unambiguous once the page is read as an image: •¹ is `3(1 - sin^2 x) - 1`
// and •² is `2 - 3 sin^2 x`, so SQA's question is **`3cos^2 x - 1`** — a
// multiple of cos^2 plus a constant. The paper data recorded it as
// `cos^2 x - 3 sin^2 x` with the answer `1 - 4 sin^2 x`, a different question,
// and that is the one this generator was built to. The paper data has since
// been corrected in both copies, which is what the notes and the live app's
// own topic file had said all along.
//
// Both are two marks and both are the same two skills — substitute
// cos^2 = 1 - sin^2, then collect into the given form — so they share an id.
// What differs is what the constant does, and the exam's own shape was the
// one nothing could set.

function givenForm(): Q {
  const k = getRandomInt(2, 6);
  const minus = getRandomInt(0, 1) === 0;
  // The constant shape: a·cos^2 x + c = a(1 - sin^2 x) + c = (a + c) - a sin^2 x
  if (getRandomInt(0, 1) === 0) {
    const a = 1 + k;                       // 2..7, so the multiple is never bare
    // The constant left over has to be worth stating: a + c = 0 gives
    // "0 - 3 sin^2 x", which is not the form a + b sin^2 x as anyone writes it.
    const c = minus ? -getRandomInt(1, a - 1) : getRandomInt(1, 6);
    const from = `${a}${C2} ${c < 0 ? '-' : '+'} ${Math.abs(c)}`;
    const const0 = a + c;
    return {
      subTopic: 'Writing in a Given Trigonometric Form',
      difficulty: 'exam',
      variationId: 'trig-identities.given-form',
      questionLines: [
        `Express $${from}$ in the form $a + b${S2}$.`,
        WORKING,
      ],
      boardQuestionLines: [`$${from}$ as $a + b${S2}$`],
      solutionSteps: [
        `<strong>1.</strong> Rearranging $${S2} + ${C2} = 1$ gives $${C2} = 1 - ${S2}$. Substitute it in:<br><br>$${a}(1 - ${S2}) ${c < 0 ? '-' : '+'} ${Math.abs(c)}$`,
        `<strong>2.</strong> Expand the bracket and collect the constants:<br><br>$${a} - ${a}${S2} ${c < 0 ? '-' : '+'} ${Math.abs(c)} = ${const0} - ${a}${S2}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$${const0} - ${a}${S2}$`,
    };
  }

  // cos^2 ± k sin^2 = 1 - sin^2 ± k sin^2 = 1 + (±k - 1) sin^2
  const b = (minus ? -k : k) - 1;
  return {
    subTopic: 'Writing in a Given Trigonometric Form',
    difficulty: 'exam',
    variationId: 'trig-identities.given-form',
    questionLines: [
      `Express $${C2} ${minus ? '-' : '+'} ${k}${S2}$ in the form $a + b${S2}$.`,
      WORKING,
    ],
    boardQuestionLines: [`$${C2} ${minus ? '-' : '+'} ${k}${S2}$ as $a + b${S2}$`],
    solutionSteps: [
      `<strong>1.</strong> Rearranging $${S2} + ${C2} = 1$ gives $${C2} = 1 - ${S2}$. Substitute it in:<br><br>$1 - ${S2} ${minus ? '-' : '+'} ${k}${S2}$`,
      `<strong>2.</strong> Collect the $${S2}$ terms:<br><br>$1 ${b < 0 ? '-' : '+'} ${times(Math.abs(b), S2)}$`,
    ],
    stepMarks: [1, 1],
    finalAnswer: `$1 ${b < 0 ? '-' : '+'} ${times(Math.abs(b), S2)}$`,
  };
}

// ── a related angle — 2018 P1 Q12, 2023 P1 Q11 ──────────────────────────
//
// "Given that cos 60 = 0.5, state the value of cos 240." One mark, one step,
// and nothing to calculate: what is being tested is knowing which quadrant the
// angle lands in and what that does to the sign. The value is handed over
// precisely so that arithmetic cannot be the difficulty.

/**
 * **The value handed over is exact: 0.5, or 1.**
 *
 * The owner, on the 2026-2023 sign-off sheet: *"Use angles that give 0.5 only /
 * Or can be 1 and you can vary quadrant they ask about"*. Both papers do
 * exactly that and neither does anything else -
 *
 *   2018 P1 Q12   cos 60 = 0.5,  state cos 240
 *   2023 P1 Q11   sin 30 = 0.5,  state sin 330
 *
 * - and the table used to hold 25, 40, 70 and 80 degrees as well, so the clone
 * offered "given that tan 25 = 0.466". That is a rounded calculator value in a
 * non-calculator paper: nothing a pupil can check, and nothing either paper
 * hands over. The value is given precisely so that arithmetic cannot be the
 * difficulty, and 0.466 puts it back.
 *
 * Only three pairs reach an exact value at an acute angle, and both papers sit
 * inside them. The variety is the quadrant asked about, which is what the one
 * mark is for.
 */
const KNOWN: { deg: number; fn: 'sin' | 'cos' | 'tan'; value: string }[] = [
  { deg: 30, fn: 'sin', value: '0.5' },
  { deg: 60, fn: 'cos', value: '0.5' },
  { deg: 45, fn: 'tan', value: '1' },
];

function relatedAngle(): Q {
  const base = pick(KNOWN);
  const fn = base.fn;
  // the second, third or fourth quadrant — the first would be the same angle
  const quadrant = getRandomInt(2, 4);
  const angle = quadrant === 2 ? 180 - base.deg
    : quadrant === 3 ? 180 + base.deg
    : 360 - base.deg;
  // CAST: all positive in the first, sine in the second, tangent in the third,
  // cosine in the fourth
  const positive = quadrant === 2 ? fn === 'sin'
    : quadrant === 3 ? fn === 'tan'
    : fn === 'cos';
  const value = base.value;
  const where = quadrant === 2 ? `$180^{\\circ} - ${base.deg}^{\\circ}$`
    : quadrant === 3 ? `$180^{\\circ} + ${base.deg}^{\\circ}$`
    : `$360^{\\circ} - ${base.deg}^{\\circ}$`;
  const name = quadrant === 2 ? 'second' : quadrant === 3 ? 'third' : 'fourth';
  const allowed = quadrant === 2 ? 'only sine is positive'
    : quadrant === 3 ? 'only tangent is positive'
    : 'only cosine is positive';

  return {
    subTopic: 'The Value at a Related Angle',
    difficulty: 'exam',
    variationId: 'trig.related-angle',
    questionLines: [
      `Given that $\\${fn} ${base.deg}^{\\circ} = ${value}$, state the value of $\\${fn} ${angle}^{\\circ}$.`,
    ],
    boardQuestionLines: [`$\\${fn} ${base.deg}^{\\circ} = ${value}$. Find $\\${fn} ${angle}^{\\circ}$.`],
    solutionSteps: [
      `<strong>1.</strong> $${angle}^{\\circ}$ is ${where}, so it lies in the ${name} quadrant, where ${allowed}. ` +
      `The size stays the same and only the sign can change:<br><br>$\\${fn} ${angle}^{\\circ} = ${positive ? '' : '-'}${value}$`,
    ],
    // one mark, and the scheme asks only for the value
    stepMarks: [1],
    finalAnswer: `$${positive ? '' : '-'}${value}$`,
  };
}

// ── order three values by size — 2015 P1 Q9 ─────────────────────────────
//
// Two marks, and the second is for *saying why*: "cos 100 is negative, cos 90
// is zero and cos 300 is positive". An ordering with no justification scores
// one, so the reason is a step of its own.

function orderBySize(): Q {
  for (let tries = 0; tries < 400; tries++) {
    const fn = pick(['sin', 'cos'] as const);
    const f = (d: number) => (fn === 'sin' ? Math.sin : Math.cos)(d * Math.PI / 180);
    // one that comes out zero, one negative and one positive, so the ordering
    // is settled by sign alone — which is what the justification is about
    const zeroAt = fn === 'sin' ? pick([0, 180, 360]) : pick([90, 270]);
    const angles = [zeroAt, getRandomInt(1, 35) * 10, getRandomInt(1, 35) * 10];
    if (new Set(angles).size !== 3) continue;
    const [a, b] = [angles[1], angles[2]];
    if (Math.abs(f(a)) < 0.05 || Math.abs(f(b)) < 0.05) continue;
    if ((f(a) > 0) === (f(b) > 0)) continue;            // one of each sign

    const sorted = [...angles].sort((p, q) => f(p) - f(q));
    const show = (d: number) => `$\\${fn} ${d}^{\\circ}$`;
    const sign = (d: number) => d === zeroAt ? 'zero' : f(d) > 0 ? 'positive' : 'negative';

    return {
      subTopic: 'Ordering Trigonometric Values',
      difficulty: 'exam',
      variationId: 'trig.order-by-size',
      questionLines: [
        `Write the following in order of size, starting with the smallest:`,
        `${show(angles[0])}, ${show(angles[1])}, ${show(angles[2])}`,
        `Justify your answer.`,
      ],
      boardQuestionLines: [
        `Order ${show(angles[0])}, ${show(angles[1])}, ${show(angles[2])} — smallest first.`,
      ],
      solutionSteps: [
        `<strong>1.</strong> Put them in order:<br><br>${sorted.map(show).join(', ')}`,
        `<strong>2.</strong> The reason is the sign of each, and that is a mark of its own:` +
        `<br><br>${sorted.map(d => `${show(d)} is ${sign(d)}`).join(', ')}.`,
      ],
      // •¹ the order, •² the justification stated explicitly
      stepMarks: [1, 1],
      finalAnswer: sorted.map(show).join(', '),
    };
  }
  throw new Error('trig.order-by-size: no valid question found');
}

export const TRIG_GENERATORS: Record<string, () => Q> = {
  'The Value at a Related Angle': relatedAngle,
  'Ordering Trigonometric Values': orderBySize,
  // All three ratios are reachable from the topic, each with its own id, so
  // `variationsBasedOn` can send each paper to the one it asks for.
  'Solving Trigonometric Equations': () => solveEquation(pick(['sin', 'cos', 'tan'] as const)),
  'Trigonometric Equations in a Formula': inFormula,
  // Two moves, two variations, both reachable from the topic.
  'Simplifying Trigonometric Expressions': () =>
    getRandomInt(0, 1) === 0 ? substituteTan() : commonFactor(),
  'Expanding Trigonometric Brackets': expandBracket,
  'Trigonometric Fractions': splitFraction,
  'Writing in a Given Trigonometric Form': givenForm,
};
