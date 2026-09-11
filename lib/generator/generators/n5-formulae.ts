import { GeneratedQuestion } from './types';
import { getRandomInt, gcd, nonZeroInt } from './utils';

/**
 * How heavy a denominator this variation's ANSWER may print.
 *
 * Chosen by the user on 2026-09-10 from a priced table, and every number is
 * anchored to what the cited paper's own answer uses. These are judgements
 * about difficulty rather than fixes for faults - nothing here was wrong, it
 * was heavier than the exam sets, and four of the five are non-calculator.
 *
 * **Cost was not the constraint.** Measured at 600 draws, even the strictest
 * column considered left more than 200 distinct questions per variation, and a
 * sheet needs six. The only thing at stake was how hard they should be.
 */
/** inequalities.fractions */
const MAX_INEQ_DEN = 8;

/**
 * National 5 Changing the Subject (9 questions) and Inequalities (5, plus 2026).
 *
 * Both are mechanical topics — every markscheme is a sequence of inverse
 * operations, one mark each — but the paper's families are not the ones the
 * subtopic tag suggests.
 *
 * The gap table listed a "subject appears twice, needs collecting" family for
 * 2019 P1 Q7, 2023 P2 Q7 and 2025 P2 Q9. Reading them, the subject appears once
 * in all three; what they actually share is a fractional coefficient (1/2, 1/3,
 * 1/4) that has to be cleared first. Corrected here and in the gap table.
 *
 *   A = (1/2)h(x+y)   make x       ->  x = 2A/h - y
 *   P = (1/3)mn - r   make m       ->  m = 3(P+r)/n
 *   B = (1/4)kc^2-3c  make k       ->  k = 4(B+3c)/c^2
 *
 * Inequalities:
 *
 *   - the paper alternates "inequality" (2015, 2017) and "inequation" (2018,
 *     2024, 2026, 2023), so the generator alternates too
 *   - 2015 P1 Q2 is the one where the x term ends up negative and the sign
 *     flips: 11-2(1+3x) < 39 gives x > -5. That case is generated deliberately
 *     rather than left to chance, because it is the one pupils lose marks on.
 *   - 2023 P1 Q14's answer is -25/4, so the fraction variation is allowed a
 *     fractional answer; the bracket variation keeps integers as the papers do
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
type Q = Omit<GeneratedQuestion, 'topic'>;

const frac = (n: string, d: string) => `\\frac{${n}}{${d}}`;

/** "-3x", "x", "5x" — a coefficient attached to a letter. */
function term(coef: number, letter: string): string {
  if (coef === 1) return letter;
  if (coef === -1) return `-${letter}`;
  return `${coef}${letter}`;
}

/** " + 4" / " - 4", or nothing at all when the constant is zero. */
function tail(c: number): string {
  return c === 0 ? '' : ` ${c < 0 ? '-' : '+'} ${Math.abs(c)}`;
}

const LOWER = ['a', 'b', 'c', 'd', 'e', 'g', 'h', 'k', 'm', 'n', 'p', 'r', 's', 't', 'u', 'w'];

/** n distinct letters, so a formula never uses the same one for two things. */
function letters(n: number, upper = false): string[] {
  const pool = [...LOWER];
  const out: string[] = [];
  for (let i = 0; i < n; i++) out.push(pool.splice(getRandomInt(0, pool.length - 1), 1)[0]);
  return upper ? [out[0].toUpperCase(), ...out.slice(1)] : out;
}

// ── the subject sits in a numerator — 2017 P1 Q10, 2022 P1 Q7, 2024 P2 Q9 ──
//
//   F = (t^2 + 4b)/c   to b   ->  b = (Fc - t^2)/4
//   D = (B + 4)/C^2    to B   ->  B = DC^2 - 4      (no fraction when k = 1)
//   f = (2d + 3)/e     to d   ->  d = (ef - 3)/2
//
// Input-first: every choice of letters and coefficients gives a fair question,
// so nothing needs rejecting beyond keeping the letters distinct.

function subjectInNumerator(): Q {
  const [v, subj, den, other] = letters(4, true);
  const k = pick([1, 1, 2, 3, 4, 5]);           // 1 gives the no-fraction answer
  const squareDen = getRandomInt(1, 3) === 1;
  const constTerm = getRandomInt(0, 1) === 0;   // "+ 4" or "+ t^2"

  const dTex = squareDen ? `${den}^{2}` : den;
  // "5g + 5" shares a factor a pupil would want to take out; the papers keep the
  // coefficient and the constant coprime — 2d + 3, t^2 + 4b.
  const consts = [2, 3, 4, 5, 6, 7, 8, 9].filter(c => gcd(c, k) === 1);
  const tTex = constTerm ? `${pick(consts)}` : `${other}^{2}`;
  const numTex = `${term(k, subj)} + ${tTex}`;
  const product = `${v}${dTex}`;
  const rhs = k === 1 ? `${product} - ${tTex}` : frac(`${product} - ${tTex}`, `${k}`);

  // Every mark in these schemes is one operation: •¹ multiply by c, •² subtract
  // t^2, •³ divide by 4. So when k is 1 there is no division to do and the
  // question is worth two, which is exactly what 2022 P1 Q7 is — and the third
  // step here said so out loud ("the subject is already on its own"), earning
  // nothing while being the step the app withholds. A pupil taking every
  // available hint was handed both real steps and left to supply a no-op.
  const steps = [
    `<strong>1.</strong> Multiply both sides by $${dTex}$:<br><br>$${product} = ${numTex}$`,
    k === 1
      ? `<strong>2.</strong> Subtract $${tTex}$ from both sides, which leaves the subject on its own:<br><br>$${subj} = ${rhs}$`
      : `<strong>2.</strong> Subtract $${tTex}$ from both sides:<br><br>$${product} - ${tTex} = ${term(k, subj)}$`,
    ...(k === 1 ? [] : [`<strong>3.</strong> Divide both sides by $${k}$:<br><br>$${subj} = ${rhs}$`]),
  ];

  return {
    subTopic: 'Changing the Subject',
    difficulty: 'skill',
    variationId: k === 1 ? 'change-subject.fraction-two-step' : 'change-subject.fraction',
    questionLines: [`Change the subject of the formula $${v} = ${frac(numTex, dTex)}$ to $${subj}$.`],
    boardQuestionLines: [`$${v} = ${frac(numTex, dTex)}$, make $${subj}$ the subject`],
    solutionSteps: steps,
    stepMarks: steps.map(() => 1),
    finalAnswer: `$${subj} = ${rhs}$`,
  };
}

// ── a square or a square root — 2014 P2 Q11 aside, 2016 P2 Q12, 2018 P1 Q14 ─
//
//   L = sqrt(4kt - p)  to k  ->  k = (L^2 + p)/(4t)
//   y = g sqrt(x) + h  to x  ->  x = ((y - h)/g)^2

function subjectWithRoot(): Q {
  const insideRoot = getRandomInt(0, 1) === 0;
  const [v, subj, a, b] = letters(4);

  // 2026 P1 Q8 — P = sqrt(T - 3L) to T. The subject sits inside the root with
  // no coefficient of its own, so there is nothing to divide out and the whole
  // question is two operations: square, then add. It is worth two marks where
  // the others are worth three, which is why it cannot share their id — one
  // variation covering both totals could only ever add up half the time, and
  // that is a mistake this registry has already made six times.
  //
  // 2026 has no published scheme. One mark per operation is the rule every
  // other change-of-subject scheme in the set follows, so two is the reading.
  if (getRandomInt(1, 3) === 1) {
    const k = pick([2, 3, 4, 5, 6]);
    return {
      subTopic: 'Changing the Subject with Roots',
      difficulty: 'exam',
      variationId: 'change-subject.root-two-step',
      questionLines: [
        `Change the subject of the following formula to $${subj}$.`,
        `$${v} = \\sqrt{${subj} - ${k}${a}}$`,
      ],
      boardQuestionLines: [`$${v} = \\sqrt{${subj} - ${k}${a}}$, make $${subj}$ the subject`],
      solutionSteps: [
        `<strong>1.</strong> Square both sides to undo the root:<br><br>$${v}^{2} = ${subj} - ${k}${a}$`,
        `<strong>2.</strong> Add $${k}${a}$ to both sides:<br><br>$${subj} = ${v}^{2} + ${k}${a}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$${subj} = ${v}^{2} + ${k}${a}$`,
    };
  }

  if (insideRoot) {
    // v = sqrt(k·subj·a - b)
    const k = pick([2, 3, 4, 5, 6]);
    return {
      subTopic: 'Changing the Subject with Roots',
      difficulty: 'exam',
      variationId: 'change-subject.root',
      questionLines: [
        `Change the subject of the formula $${v} = \\sqrt{${k}${subj}${a} - ${b}}$ to $${subj}$.`,
      ],
      boardQuestionLines: [`$${v} = \\sqrt{${k}${subj}${a} - ${b}}$, make $${subj}$ the subject`],
      solutionSteps: [
        `<strong>1.</strong> Square both sides to undo the root:<br><br>$${v}^{2} = ${k}${subj}${a} - ${b}$`,
        `<strong>2.</strong> Add $${b}$ to both sides:<br><br>$${v}^{2} + ${b} = ${k}${subj}${a}$`,
        `<strong>3.</strong> Divide both sides by $${k}${a}$:<br><br>$${subj} = ${frac(`${v}^{2} + ${b}`, `${k}${a}`)}$`,
      ],
      // 2016 P2 Q12: •¹ square, •² add p, •³ divide by 4t — one per operation
      stepMarks: [1, 1, 1],
      finalAnswer: `$${subj} = ${frac(`${v}^{2} + ${b}`, `${k}${a}`)}$`,
    };
  }

  // v = a·sqrt(subj) + b — the root itself has to be undone last
  const bSign = getRandomInt(0, 1) === 0 ? 1 : -1;
  const inner = frac(`${v} ${bSign > 0 ? '-' : '+'} ${b}`, a);
  return {
    subTopic: 'Changing the Subject with Roots',
    difficulty: 'exam',
    variationId: 'change-subject.root',
    questionLines: [
      `Change the subject of the formula $${v} = ${a}\\sqrt{${subj}}${bSign > 0 ? ` + ${b}` : ` - ${b}`}$ to $${subj}$.`,
    ],
    boardQuestionLines: [`$${v} = ${a}\\sqrt{${subj}}${bSign > 0 ? ` + ${b}` : ` - ${b}`}$, make $${subj}$ the subject`],
    solutionSteps: [
      `<strong>1.</strong> ${bSign > 0 ? `Subtract $${b}$ from` : `Add $${b}$ to`} both sides:<br><br>$${v} ${bSign > 0 ? '-' : '+'} ${b} = ${a}\\sqrt{${subj}}$`,
      `<strong>2.</strong> Divide both sides by $${a}$:<br><br>$${inner} = \\sqrt{${subj}}$`,
      `<strong>3.</strong> Square both sides:<br><br>$${subj} = \\left(${inner}\\right)^{2}$`,
    ],
    // 2018 P1 Q14: •¹ subtract h, •² divide by g, •³ square
    stepMarks: [1, 1, 1],
    finalAnswer: `$${subj} = \\left(${inner}\\right)^{2}$`,
  };
}

// ── a fractional coefficient — 2014 P2 Q11, 2019 P1 Q7, 2023 P2 Q7, 2025 P2 Q9 ─
//
// The largest family, and the one the gap table had mislabelled. Two shapes:
//
//   V = (1/d)·S·M ± T        ->  S = d(V ∓ T)/M     [2014, 2023, 2025]
//   V = (1/d)·M·(S + T)      ->  S = dV/M - T       [2019]

function subjectFractionCoefficient(): Q {
  const bracketed = getRandomInt(1, 3) === 1;   // the 2019 shape, 1 of the 4
  const d = pick([2, 3, 4]);
  const [v, subj, mLetter, tLetter] = letters(4, true);
  const squareM = getRandomInt(0, 1) === 0;
  const mTex = squareM ? `${mLetter}^{2}` : mLetter;

  if (bracketed) {
    // V = (1/d)·M·(S + T)  — the trapezium formula's shape
    return {
      subTopic: 'Changing the Subject with a Fractional Coefficient',
      difficulty: 'exam',
      variationId: 'change-subject.fraction-coefficient',
      questionLines: [
        `A formula is given by $${v} = ${frac('1', `${d}`)}${mLetter}(${subj} + ${tLetter})$.`,
        `Make $${subj}$ the subject of the formula.`,
      ],
      boardQuestionLines: [`$${v} = ${frac('1', `${d}`)}${mLetter}(${subj} + ${tLetter})$, make $${subj}$ the subject`],
      solutionSteps: [
        `<strong>1.</strong> Multiply both sides by $${d}$ to clear the fraction:<br><br>$${d}${v} = ${mLetter}(${subj} + ${tLetter})$`,
        `<strong>2.</strong> Divide both sides by $${mLetter}$:<br><br>$${frac(`${d}${v}`, mLetter)} = ${subj} + ${tLetter}$`,
        `<strong>3.</strong> Subtract $${tLetter}$ from both sides:<br><br>$${subj} = ${frac(`${d}${v}`, mLetter)} - ${tLetter}$`,
      ],
      // 2019 P1 Q7: •¹ multiply by 2, •² divide by h, •³ subtract y
      stepMarks: [1, 1, 1],
      finalAnswer: `$${subj} = ${frac(`${d}${v}`, mLetter)} - ${tLetter}$`,
    };
  }

  // V = (1/d)·S·M ± T, where T may itself carry a coefficient
  const minus = getRandomInt(0, 1) === 0;
  const tCoef = pick([1, 1, 2, 3]);
  const tTex = term(tCoef, tLetter);
  const flipped = minus ? '+' : '-';            // the sign after moving T across

  return {
    subTopic: 'Changing the Subject with a Fractional Coefficient',
    difficulty: 'exam',
    variationId: 'change-subject.fraction-coefficient',
    questionLines: [
      `Change the subject of the formula $${v} = ${frac('1', `${d}`)}${subj}${mTex} ${minus ? '-' : '+'} ${tTex}$ to $${subj}$.`,
    ],
    boardQuestionLines: [`$${v} = ${frac('1', `${d}`)}${subj}${mTex} ${minus ? '-' : '+'} ${tTex}$, make $${subj}$ the subject`],
    solutionSteps: [
      `<strong>1.</strong> ${minus ? `Add $${tTex}$ to` : `Subtract $${tTex}$ from`} both sides:<br><br>$${v} ${flipped} ${tTex} = ${frac('1', `${d}`)}${subj}${mTex}$`,
      `<strong>2.</strong> Multiply both sides by $${d}$:<br><br>$${d}(${v} ${flipped} ${tTex}) = ${subj}${mTex}$`,
      `<strong>3.</strong> Divide both sides by $${mTex}$:<br><br>$${subj} = ${frac(`${d}(${v} ${flipped} ${tTex})`, mTex)}$`,
    ],
    // 2014 P2 Q11, 2023 P2 Q7, 2025 P2 Q9: one mark per operation, and the
    // schemes accept either order for the first two
    stepMarks: [1, 1, 1],
    finalAnswer: `$${subj} = ${frac(`${d}(${v} ${flipped} ${tTex})`, mTex)}$`,
  };
}

// ── inequalities with brackets — 2015 P1 Q2, 2017 P1 Q8, 2018 P2 Q4, ──────
//    2024 P2 Q4, 2026 P1 Q11
//
// Every one is "expand bracket -> collect like terms -> solve", 3 marks. The
// bracket sits on the left in two and the right in three, so both are built.
//
// Input-first with rejection: the answer must be a whole number, as it is in
// all five, and both sides must keep an x term or the question is trivial.

const INEQ_WORD = ['inequality', 'inequation'];
const INEQ_LEAD = ['Solve algebraically the', 'Solve, algebraically, the'];

function inequalityBrackets(): Q {
  for (let tries = 0; tries < 500; tries++) {
    // x in all ten *Linear equations and inequations* papers; `y` and `p` in
    // none. An inequality is solved for x for the same reason an equation is.
    const v = 'x';
    const rel = pick(['\\lt', '\\gt']);
    const bracketLeft = getRandomInt(0, 1) === 0;
    // one in five should end with a negative x coefficient, so the sign flips —
    // that is 2015 P1 Q2, and it is where the marks are lost
    const wantFlip = getRandomInt(1, 5) === 1;

    const k = nonZeroInt(-6, 6);                // multiplier on the bracket
    const inner = nonZeroInt(-9, 9);            // constant inside the bracket
    const innerCoef = pick([1, 1, 2, 3]);       // coefficient of v inside
    const outside = nonZeroInt(-12, 12);        // constant beside the bracket
    const otherCoef = nonZeroInt(-6, 6);        // v coefficient on the other side
    const otherConst = nonZeroInt(-20, 20);

    const bracketTex = `${k === 1 ? '' : k === -1 ? '-' : k}(${term(innerCoef, v)}${tail(inner)})`;
    const withBracket = `${bracketTex}${tail(outside)}`;
    const plain = `${term(otherCoef, v)}${tail(otherConst)}`;

    // bracket side: k·innerCoef·v + (k·inner + outside)
    const bCoef = k * innerCoef, bConst = k * inner + outside;
    const [lCoef, lConst, rCoef, rConst] = bracketLeft
      ? [bCoef, bConst, otherCoef, otherConst]
      : [otherCoef, otherConst, bCoef, bConst];

    // (lCoef - rCoef)·v  rel  (rConst - lConst)
    const a = lCoef - rCoef, b = rConst - lConst;
    if (a === 0 || b === 0) continue;
    if (b % a !== 0) continue;                  // the papers all give whole answers
    const ans = b / a;
    if (Math.abs(ans) > 12) continue;
    const flips = a < 0;
    if (flips !== wantFlip) continue;

    // dividing by a negative reverses the relation
    const outRel = flips ? (rel === '\\lt' ? '\\gt' : '\\lt') : rel;
    const lhs = bracketLeft ? withBracket : plain;
    const rhs = bracketLeft ? plain : withBracket;

    return {
      subTopic: 'Solving Inequalities',
      difficulty: 'skill',
      variationId: 'inequalities.brackets',
      questionLines: [`${pick(INEQ_LEAD)} ${pick(INEQ_WORD)} $${lhs} ${rel} ${rhs}$`],
      boardQuestionLines: [`Solve $${lhs} ${rel} ${rhs}$`],
      solutionSteps: [
        `<strong>1.</strong> Expand the bracket:<br><br>$${bracketLeft ? `${term(bCoef, v)}${tail(bConst)} ${rel} ${plain}` : `${plain} ${rel} ${term(bCoef, v)}${tail(bConst)}`}$`,
        `<strong>2.</strong> Collect the $${v}$ terms on one side and the numbers on the other:<br><br>$${term(a, v)} ${rel} ${b}$`,
        flips
          ? `<strong>3.</strong> Divide both sides by $${a}$. Dividing by a <strong>negative</strong> number reverses the inequality sign:<br><br>$${v} ${outRel} ${ans}$`
          : `<strong>3.</strong> Divide both sides by $${a}$:<br><br>$${v} ${outRel} ${ans}$`,
      ],
      // •¹ expand the bracket, •² collect like terms, •³ solve. 2024 P2 Q4 adds
      // that the negative coefficient must visibly be dealt with, either by
      // reversing the sign at •³ or by collecting on the right at •² — the
      // "flips" branch says so in the step.
      stepMarks: [1, 1, 1],
      finalAnswer: `$${v} ${outRel} ${ans}$`,
    };
  }
  throw new Error('inequalities.brackets: no valid question found');
}

// ── inequalities with fractions — 2023 P1 Q14 ────────────────────────────
//
//   (x + 1)/3 - 2 > 3x/5   ->   x < -25/4
//
// The markscheme lists three accepted methods, but •² and •³ are identical
// across all three — only the first step differs — so one worked solution is
// enough. The answer here is allowed to be a fraction, as the paper's is.

function inequalityFractions(): Q {
  for (let tries = 0; tries < 500; tries++) {
    // x in all ten *Linear equations and inequations* papers; `y` and `p` in
    // none. An inequality is solved for x for the same reason an equation is.
    const v = 'x';
    const rel = pick(['\\lt', '\\gt']);
    const p = pick([2, 3, 4, 5]), r = pick([2, 3, 4, 5]);
    if (p === r) continue;
    const a = nonZeroInt(-8, 8);                // constant inside the numerator
    const b = nonZeroInt(-6, 6);                // the loose constant
    // the paper's right-hand side is 3x/5 — positive, and in lowest terms, so
    // that -4p/2 or -5y/5 can never be printed
    const q = getRandomInt(2, 7);
    if (gcd(q, r) !== 1) continue;

    const L = p * r / gcd(p, r);                // lowest common multiple
    // L·[(v + a)/p - b]  rel  L·[q·v/r]
    const lCoef = L / p, lConst = L / p * a - L * b;
    const rCoef = L / r * q;
    const A = lCoef - rCoef, B = -lConst;
    if (A === 0 || B === 0) continue;

    const g = gcd(Math.abs(A), Math.abs(B)) || 1;
    let [num, den] = [B / g, A / g];
    if (den < 0) { num = -num; den = -den; }
    if (Math.abs(num) > 60) continue;
    // 2023 P1 Q14 answers -25/4. That is a single paper rather than a
    // pattern, so the cap is set at twice it rather than at it.
    if (den > MAX_INEQ_DEN) continue;
    const ansTex = den === 1 ? `${num}`
      : num < 0 ? `-${frac(`${-num}`, `${den}`)}` : frac(`${num}`, `${den}`);
    const outRel = A < 0 ? (rel === '\\lt' ? '\\gt' : '\\lt') : rel;

    const lhs = `${frac(`${v}${tail(a)}`, `${p}`)}${tail(-b)}`;
    const rhs = frac(term(q, v), `${r}`);

    return {
      subTopic: 'Inequalities with Fractions',
      difficulty: 'exam',
      variationId: 'inequalities.fractions',
      questionLines: [`${pick(INEQ_LEAD)} ${pick(INEQ_WORD)} $${lhs} ${rel} ${rhs}$`],
      boardQuestionLines: [`Solve $${lhs} ${rel} ${rhs}$`],
      solutionSteps: [
        `<strong>1.</strong> Multiply every term by $${L}$, the lowest common multiple of $${p}$ and $${r}$:<br><br>$${term(lCoef, `(${v}${tail(a)})`)} ${L * b < 0 ? `+ ${-(L * b)}` : `- ${L * b}`} ${rel} ${term(rCoef, v)}$`,
        `<strong>2.</strong> Expand and gather the $${v}$ terms on one side:<br><br>$${term(A, v)} ${rel} ${B}$`,
        A < 0
          ? `<strong>3.</strong> Divide by $${A}$. Dividing by a <strong>negative</strong> number reverses the inequality sign:<br><br>$${v} ${outRel} ${ansTex}$`
          : `<strong>3.</strong> Divide both sides by $${A}$:<br><br>$${v} ${outRel} ${ansTex}$`,
      ],
      // •¹ eliminate the denominators, •² rearrange to ax > b, •³ solve
      stepMarks: [1, 1, 1],
      finalAnswer: `$${v} ${outRel} ${ansTex}$`,
    };
  }
  throw new Error('inequalities.fractions: no valid question found');
}

export const FORMULA_GENERATORS: Record<string, () => Q> = {
  'Changing the Subject': subjectInNumerator,
  'Changing the Subject with Roots': subjectWithRoot,
  'Changing the Subject with a Fractional Coefficient': subjectFractionCoefficient,
  'Solving Inequalities': inequalityBrackets,
  'Inequalities with Fractions': inequalityFractions,
};
