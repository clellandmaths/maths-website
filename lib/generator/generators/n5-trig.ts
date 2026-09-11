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
//    2014 P2 Q12, 2016 P2 Q14, 2018 P2 Q8, 2019 P2 Q14, 2022 P2 Q9, 2024 P2 Q11

function solveEquation(): Q {
  for (let tries = 0; tries < 400; tries++) {
    const fn = pick(['sin', 'sin', 'cos', 'cos', 'tan'] as const);
    const a = getRandomInt(2, 20);
    const b = getRandomInt(-9, 9);
    const c = getRandomInt(-9, 12);
    if (b === c) continue;                          // the ratio would be zero
    const r = (c - b) / a;
    // a fifth of the time the ratio is negative, which the papers have not yet
    // used but the specification allows and pupils get wrong
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

    return {
      subTopic: 'Solving Trigonometric Equations',
      difficulty: 'skill',
      variationId: 'trig-equations.solve',
      questionLines: [
        `Solve the equation $${lhs} = ${c}$, for $0 \\le x \\le 360$.`,
      ],
      boardQuestionLines: [`Solve $${lhs} = ${c}$, $0 \\le x \\le 360$`],
      // •¹ rearrange, •² find one value of x, •³ find another. The two values
      // are separate marks, so they are separate steps — printing both at once
      // meant the withheld hint carried both, and a pupil who took every hint
      // was left to produce two answers rather than one.
      solutionSteps: [
        `<strong>1.</strong> Get the ${fn} on its own:<br><br>$${times(a, tex)} = ${c - b}$, so $${tex} = ${ratioTex}$`,
        `<strong>2.</strong> Take the inverse of the <strong>positive</strong> ratio to find the reference angle, $${dp1(base)}$. ${r < 0 ? `The ratio is <strong>negative</strong>, so both answers come from the quadrants where $\\${fn}$ is negative` : `The ratio is positive`}, and the two solutions in $0 \\le x \\le 360$ are ${rule}. The first is:<br><br>$x = ${dp1(x1)}$`,
        `<strong>3.</strong> And the second:<br><br>$x = ${dp1(x2)}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: `$x = ${dp1(x1)}$ or $x = ${dp1(x2)}$`,
    };
  }
  throw new Error('trig-equations.solve: no valid question found');
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

// ── simplify using tan = sin/cos, or a common factor ─────────────────────
//    2016 P1 Q11, 2018 P1 Q18, 2023 P2 Q13

function simplify(): Q {
  const shape = pick(['tan-squared', 'tan-product', 'common-factor'] as const);

  if (shape === 'tan-squared') {
    // tan^2 x cos^2 x = (sin^2/cos^2)(cos^2) = sin^2
    return {
      subTopic: 'Simplifying Trigonometric Expressions',
      difficulty: 'exam',
      variationId: 'trig-identities.simplify',
      questionLines: [`Simplify $\\tan^{2}x^{\\circ}${C2}$.`, WORKING],
      boardQuestionLines: [`Simplify $\\tan^{2}x^{\\circ}${C2}$`],
      solutionSteps: [
        `<strong>1.</strong> Replace the tangent using $\\tan x^{\\circ} = \\frac{${S}}{${C}}$:<br><br>$\\frac{${S2}}{${C2}} \\times ${C2}$`,
        `<strong>2.</strong> The $${C2}$ cancels:<br><br>$${S2}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$${S2}$`,
    };
  }

  if (shape === 'tan-product') {
    // sin x cos x tan x = sin x cos x (sin x / cos x) = sin^2 x
    return {
      subTopic: 'Simplifying Trigonometric Expressions',
      difficulty: 'exam',
      variationId: 'trig-identities.simplify',
      questionLines: [`Express $${S}${C}${T}$ in its simplest form.`, WORKING],
      boardQuestionLines: [`Simplify $${S}${C}${T}$`],
      solutionSteps: [
        `<strong>1.</strong> Replace the tangent using $\\tan x^{\\circ} = \\frac{${S}}{${C}}$:<br><br>$${S}${C} \\times \\frac{${S}}{${C}}$`,
        `<strong>2.</strong> The $${C}$ cancels:<br><br>$${S2}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$${S2}$`,
    };
  }

  // sin^2 x cos^2 x + cos^4 x = cos^2 x (sin^2 x + cos^2 x) = cos^2 x, and the
  // same at first power: cos x sin^2 x + cos^3 x = cos x. 2026 P2 Q12 sets the
  // odd one, and it is the harder read — the common factor is a bare cos x
  // sitting beside a squared term, so it does not announce itself the way a
  // matched pair of squares does.
  const sinFirst = getRandomInt(0, 1) === 0;
  const odd = getRandomInt(0, 1) === 0;
  const [keep, other] = sinFirst
    ? [odd ? C : C2, S2]
    : [odd ? S : S2, C2];
  const cubed = sinFirst
    ? (odd ? '\\cos^{3}x^{\\circ}' : '\\cos^{4}x^{\\circ}')
    : (odd ? '\\sin^{3}x^{\\circ}' : '\\sin^{4}x^{\\circ}');
  // "cos x sin^2 x", not "sin^2 x cos x" — the paper leads with the factor
  const product = odd ? `${keep}${other}` : `${other}${keep}`;

  return {
    subTopic: 'Simplifying Trigonometric Expressions',
    difficulty: 'exam',
    variationId: 'trig-identities.simplify',
    questionLines: [`Simplify $${product} + ${cubed}$.`, WORKING],
    boardQuestionLines: [`Simplify $${product} + ${cubed}$`],
    solutionSteps: [
      `<strong>1.</strong> Take out the common factor $${keep}$:<br><br>$${keep}\\left(${other} + ${odd ? (sinFirst ? C2 : S2) : keep}\\right)$`,
      `<strong>2.</strong> The bracket is $${S2} + ${C2} = 1$:<br><br>$${keep} \\times 1 = ${keep}$`,
    ],
    stepMarks: [1, 1],
    finalAnswer: `$${keep}$`,
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

/** Angles whose sine, cosine and tangent a pupil can be handed. */
const KNOWN: { deg: number; sin: string; cos: string; tan: string }[] = [
  { deg: 30, sin: '0.5', cos: '0.866', tan: '0.577' },
  { deg: 45, sin: '0.707', cos: '0.707', tan: '1' },
  { deg: 60, sin: '0.866', cos: '0.5', tan: '1.732' },
  { deg: 20, sin: '0.342', cos: '0.940', tan: '0.364' },
  { deg: 25, sin: '0.423', cos: '0.906', tan: '0.466' },
  { deg: 40, sin: '0.643', cos: '0.766', tan: '0.839' },
  { deg: 70, sin: '0.940', cos: '0.342', tan: '2.747' },
  { deg: 80, sin: '0.985', cos: '0.174', tan: '5.671' },
];

function relatedAngle(): Q {
  const base = pick(KNOWN);
  const fn = pick(['sin', 'cos', 'tan'] as const);
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
  const value = base[fn];
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
  'Solving Trigonometric Equations': solveEquation,
  'Trigonometric Equations in a Formula': inFormula,
  'Simplifying Trigonometric Expressions': simplify,
  'Expanding Trigonometric Brackets': expandBracket,
  'Trigonometric Fractions': splitFraction,
  'Writing in a Given Trigonometric Form': givenForm,
};
