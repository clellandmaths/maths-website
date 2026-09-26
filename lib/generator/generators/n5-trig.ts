import { GeneratedQuestion } from './types';
import type { Gen } from './n5';
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
/**
 * **`withConstant` is 2022 P2 Q9's split, and what it still settles is the
 * domain.**
 *
 * It was made to guarantee the constant term as well, back when the zero was
 * only suppressed in the printing and could not be removed from the draw
 * without moving two signed-off questions. The owner then ruled that the
 * zero should never be drawn at all - *"it should always have plus or minus
 * something"* - so that now holds for every variation here and the flag no
 * longer carries it.
 *
 * What is left is the range. 2022 P2 Q9 closes its domain, `0 <= x <= 360`,
 * and a question served by one generator should not present itself two ways.
 * The other papers keep the toss between the closed and open forms, which the
 * owner read form by form and kept - see `APPROVED_MULTIFORM` in
 * `__checks__/one-form.ts`. A subTopic of its own is what gives this its own
 * draw loop, so settling the domain here moves no sibling.
 */
/**
 * **Which papers state their range which way.**
 *
 * 2026 P2 Q8 leaves it open — `0 <= x < 360` — and 2016 P2 Q14 closes it.
 * Both resolve to one clone, so the id the routine is told to build is the
 * same string for each and cannot separate them; only `asked` can. Measured
 * over 240 draws the coin was handing out 2016's range on 49% of requests
 * for 2026's question. The owner, on the 2026 P2 sheet: *"Agreed"*.
 *
 * **Only the two raised here are pinned.** The other papers on this routine
 * keep the toss between the closed and open forms, which the owner read form
 * by form and kept — see `APPROVED_MULTIFORM` in `__checks__/one-form.ts`.
 */
const DOMAIN_OF: Record<string, string> = {
  'trig-equations.solve-tan': '0 \\le x \\lt 360',          // 2026 P2 Q8
  'trig-equations.solve-tan-pre2023': '0 \\le x \\le 360',  // 2016 P2 Q14
  /**
   * **The sine pair, added after the 2024 P2 sheet.** Unlike the tangent pair
   * above, these two papers AGREE — 2024 P2 Q11 and 2018 P2 Q8 both write
   * `0 \le x < 360`. So the toss was not handing one paper the other's range;
   * it was handing both a range that neither sets, in 132 draws of 300. The
   * owner: *"Agreed"*.
   */
  'trig-equations.solve': '0 \\le x \\lt 360',              // 2024 P2 Q11
  'trig-equations.solve-pre2023': '0 \\le x \\lt 360',      // 2018 P2 Q8
  /**
   * **The cosine pair, added on the 2019 P2 sheet — and these two DISAGREE.**
   *
   * Unlike the sine pair above, the two papers here write different ranges:
   * 2019 P2 Q14 is `0 \le x < 360` (half-open) and 2014 P2 Q12 is
   * `0 \le x \le 360` (closed). So the toss WAS handing each paper the other's
   * wording — measured over 300 draws of 2019 P2 Q14's own id, 157 half-open
   * and 143 closed. This is one of the two reds `one-form` has carried since
   * 2022 was locked; it was waiting for 2019's review, which is when the fix
   * is cheap. The owner: *"Yes key it"*.
   *
   * Only the DOMAIN is keyed. The sign of the rearranged ratio also splits by
   * paper — 2019's is `cos x = -1/5`, 2014's is `+5/11` — but that is a number
   * rather than a printed form, and numbers are the one thing never to split
   * for. Raised on the sheet and deliberately not done.
   */
  'trig-equations.solve-cos': '0 \\le x \\lt 360',          // 2019 P2 Q14
  'trig-equations.solve-cos-2014': '0 \\le x \\le 360',     // 2014 P2 Q12
};

function solveEquation(
  fn: 'sin' | 'cos' | 'tan', withConstant = false, asked?: string,
): Q {
  for (let tries = 0; tries < 400; tries++) {
    const a = getRandomInt(2, 20);
    /**
     * **The constant is never zero.**
     *
     * The owner, 2026-09-20: *"So having 7tan x = 3 is not a clone of the
     * question. It should always have plus or minus something you just can't
     * pick 0."* Every paper this routine serves shifts a constant across as
     * its first mark - 2018 P2 Q8 `7\sin x + 2 = 3`, 2022 P2 Q9
     * `3\sin x + 4 = 6`, 2024 P2 Q11 `17\sin x + 1 = 9`, and the cos and tan
     * papers likewise - so a draw without one is a different, shorter question
     * wearing the paper's name.
     *
     * An earlier pass suppressed the *printing* of a zero, which left
     * `7\tan x^{\circ} = 3` on the page: tidier, and still not the question.
     *
     * **One draw, 18 values, no zero.** Written as a single `getRandomInt` on
     * purpose: a rejected draw costs an extra turn of the generator and would
     * move the stream by a different amount each time. This moves it once, by
     * remapping which `b` a given random produces - every question on the
     * routine moves, which is unavoidable and was done with the owner's word.
     */
    let b = getRandomInt(-9, 8);
    if (b >= 0) b += 1;
    const c = getRandomInt(-9, 12);
    if (b === c) continue;                          // the ratio would be zero
    const r = (c - b) / a;
    // A fifth of the time the ratio is negative, which two of the seven papers
    // are — 2016's tan x = -9/2 and 2019's cos x = -1/5. (This used to say the
    // papers had not used one.)
    //
    // **2016 P2 Q14 is always negative** - 2 tan x + 5 = -4, tan x = -9/2,
    // answers in the second and fourth quadrants. It got a negative ratio in
    // 53 of 400 draws. The owner, on the 2016 P2 sheet: "Yes key". The toss is
    // still drawn for every id, so no other id's stream moves; 2016 simply
    // reads its own rule. 2026 P2 Q8 (SIGNED OFF) keeps its mix.
    const negativeToss = getRandomInt(1, 5) === 1;
    if (asked === 'trig-equations.solve-tan-pre2023' ? r > 0 : r > 0 === negativeToss) continue;
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
    // `b` can no longer be zero (see its draw above), so the sign is all this
    // has to choose and there is no empty case to guard.
    const lhs = `${times(a, tex)} ${b < 0 ? '-' : '+'} ${Math.abs(b)}`;
    // **The domain as the papers write it, both ways.** Five of the nine
    // trigonometric equations in the corpus close the range - 2016 P2 Q14's
    // `0 <= x <= 360` - and four leave it open, 2026 P2 Q8 among them with
    // `0 <= x < 360`. This printed the closed form always, so a clone of 2026
    // stated a domain its paper does not. Nothing turns on it here: the guard
    // above rejects a reference angle within 0.04 of a whole number, so no
    // solution can land on 0 or on 360 and the two forms admit the same pair.
    // The split settles the domain rather than tossing for it: 2022 P2 Q9
    // closes its range, and a question served by one generator should not
    // present itself two ways. The toss stays for the others, which the owner
    // read form by form and kept (`__checks__/one-form.ts`, APPROVED_MULTIFORM).
    const domain = withConstant ? '0 \\le x \\le 360'
      : DOMAIN_OF[asked ?? '']
      ?? (getRandomInt(0, 1) === 0 ? '0 \\le x \\le 360' : '0 \\le x \\lt 360');

    return {
      subTopic: withConstant
        ? 'Solving a Trigonometric Equation with a Constant Term'
        : 'Solving Trigonometric Equations',
      difficulty: 'skill',
      variationId: withConstant ? 'trig-equations.solve-constant'
        : fn === 'sin' ? 'trig-equations.solve'
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

/**
 * **Each paper writes this formula its own way, and the clone wrote none of
 * them.** — 2026-09-21
 *
 *   2023 P2 Q11   h = 20 cos x + 147     the cosine FIRST, coefficient positive
 *   2017 P2 Q15   h = 40 + 23 cos x      the constant first, coefficient positive
 *   2025 P2 Q14   h = 10 - 8 cos x       the constant first, coefficient NEGATIVE
 *
 * Measured over 240 draws each: **every draw of all three was constant-first**,
 * because there was no cosine-first branch at all — so 2023 P2 Q11's own form
 * was unreachable, 0 of 240 — and the sign was a coin toss, so 2017 and 2025
 * handed each other their shape about half the time.
 *
 * The owner, reading the clock question on the 2023 P2 sheet: *"we need the cos
 * to come first with a positive coefficient or it's too hard"*, then *"Id agree
 * key each of the trig variations to own paper"*.
 *
 * `asked` and not `wanted`: 2023's and 2017's ids are both ALIASES of 2025's,
 * so all three arrive with the same `wanted`.
 */
const FORM_OF: Record<string, { cosFirst: boolean; minus: boolean }> = {
  'trig-equations.in-formula-2023': { cosFirst: true, minus: false },   // 2023 P2 Q11
  'trig-equations.in-formula-pre2023': { cosFirst: false, minus: false }, // 2017 P2 Q15
  'trig-equations.in-formula': { cosFirst: false, minus: true },        // 2025 P2 Q14
};

function inFormula(wanted?: string, asked?: string): Q {
  for (let tries = 0; tries < 400; tries++) {
    const ctx = pick(ROTATING_CONTEXTS);
    const B = getRandomInt(ctx.centre[0], ctx.centre[1]);
    const A = getRandomInt(ctx.swing[0], ctx.swing[1]);
    if (A >= B) continue;
    /**
     * **The draw still happens**, in the same place and with the same range,
     * so nothing sharing this routine's loop shifts. Only the value read off
     * it moves, and only for a paper whose own form is recorded above.
     */
    const drawnMinus = getRandomInt(0, 1) === 0;    // "10 - 8cos x" as in 2025

    // Taught: solving the formula and evaluating it are two questions with
    // two ids, so the asked id decides which.
    //
    // **2017 P2 Q15 is both, in one question** — its own id since 2026-09-23;
    // see the registry entry. It takes the solving path and puts the paper's
    // parts (a) and (b) in front of it, on the same formula. Asked for by id,
    // nothing else enters that branch and nothing draws a toss here, so 2023
    // P2 Q11 and 2025 P2 Q14 draw as they did. A draw by topic alone tosses
    // three ways instead of two, so the whole question is offered there too;
    // the toss sits where the two-way one did, with no draw between, and no
    // paper question is drawn that way.
    const WHOLE = 'trig-equations.in-formula-pre2023';
    const shape = wanted !== undefined
      ? (wanted === WHOLE || asked === WHOLE ? 'whole'
        : wanted === 'trig-equations.in-formula' ? 'solve' : 'evaluate')
      : (['solve', 'evaluate', 'whole'] as const)[getRandomInt(0, 2)];
    const whole = shape === 'whole';
    const form = FORM_OF[whole ? WHOLE : asked ?? ''];
    const is2025 = !whole && asked === 'trig-equations.in-formula';
    const minus = form ? form.minus : drawnMinus;
    /**
     * **Cosine-first is always `+ B`, and that is the world's constraint
     * rather than a choice.** `h = A cos x - B` has a minimum of `-A - B`, so
     * the tip of the hand, blade or car would be below the ground on every
     * one of these contexts. The owner's *"then plus or minus a number"* is
     * available on the constant-first shapes, where the sign sits on the
     * cosine and the height stays positive — which is how all three papers
     * do it.
     */
    const formula = form?.cosFirst ? `h = ${times(A, C)} + ${B}`
      : minus ? `h = ${B} - ${times(A, C)}`
      : `h = ${B} + ${times(A, C)}`;

    const solveFor = shape !== 'evaluate';
    if (solveFor) {
      // choose the target height from a whole ratio, so the angle is clean to find
      const target = B + (minus ? -1 : 1) * (getRandomInt(-(A - 1), A - 1));
      const r = minus ? (B - target) / A : (target - B) / A;
      if (Math.abs(r) >= 0.98 || Math.abs(r) < 0.06) continue;
      const base = Math.acos(Math.abs(r)) * 180 / Math.PI;
      const [x1, x2] = r > 0 ? [base, 360 - base] : [180 - base, 180 + base];
      if (Math.abs(x1 - Math.round(x1)) < 0.04) continue;

      if (whole) {
        // (a) and (b) exactly as the evaluating branch below writes them,
        // on this formula; then (c), with the range the paper states.
        const at = pick([30, 45, 60, 120, 135, 150, 210, 240, 300]);
        const value = B + (minus ? -1 : 1) * A * Math.cos(at * Math.PI / 180);
        const lowest = B - A;
        return {
          subTopic: 'Trigonometric Equations in a Formula',
          difficulty: 'exam',
          variationId: 'trig-equations.in-formula-pre2023',
          // 2017 P2 Q15 ends its formula line "0 ≤ x < 360." and has no
          // "where" line: part (a) says what x is. The owner, on the 2023
          // re-review: "change the 2 new cards with your recommendation". This
          // branch is 2017's alone.
          questionLines: [
            `${ctx.scene}`,
            `The height, $h$ ${ctx.unit}, of ${ctx.thing} above the ground is given by $${formula}$, $0 \\le x < 360.$`,
            `(a) Calculate the height of ${ctx.thing} after it has turned through an angle of $${at}^{\\circ}$.`,
            `(b) Find the minimum height of ${ctx.thing} above the ground.`,
            `(c) Calculate the values of $x$ for which ${ctx.thing} is ${target} ${ctx.unit} above the ground.`,
          ],
          boardQuestionLines: [`$${formula}$, $0 \\le x < 360$. Height at $${at}^{\\circ}$; the minimum; $x$ when $h = ${target}$`],
          // 2017 P2 Q15: •¹ (a), •² (b), then (c)'s four — substitute,
          // rearrange, one value, the second
          solutionSteps: [
            `<strong>(a)</strong> Substitute $x = ${at}$:<br><br>$h = ${B} ${minus ? '-' : '+'} ${A} \\times \\cos ${at}^{\\circ} = ${dp1(value)}$ ${ctx.unit}`,
            `<strong>(b)</strong> The cosine runs between $-1$ and $1$, so the height is smallest when $${minus ? `\\cos x^{\\circ} = 1` : `\\cos x^{\\circ} = -1`}$:<br><br>$h = ${B} - ${A} = ${lowest}$ ${ctx.unit}`,
            `<strong>(c) 1.</strong> Put the height into the formula:<br><br>$${target} = ${B} ${minus ? '-' : '+'} ${times(A, C)}$`,
            `<strong>(c) 2.</strong> Rearrange to get the cosine on its own:<br><br>$${C} = ${r.toFixed(4)}$`,
            `<strong>(c) 3.</strong> Take the inverse cosine, then use that ${r > 0 ? 'the second solution is $360 - x$' : 'a negative cosine gives solutions $180 - x$ and $180 + x$'}. The first value is:<br><br>$x = ${dp1(x1)}$`,
            `<strong>(c) 4.</strong> And the second:<br><br>$x = ${dp1(x2)}$`,
          ],
          stepMarks: [1, 1, 1, 1, 1, 1],
          finalAnswer: `(a) ${dp1(value)} ${ctx.unit}, (b) ${withUnit(lowest, ctx.unit)}, (c) $x = ${dp1(x1)}$ or $x = ${dp1(x2)}$`,
        };
      }

      return {
        subTopic: 'Trigonometric Equations in a Formula',
        difficulty: 'exam',
        variationId: 'trig-equations.in-formula',
        /**
         * **2025 P2 Q14 closes its formula with a full stop and asks for the
         * height "above the ground"**: "h = 10 − 8cos x°. Calculate the two
         * values of x for which the height of car A is 13 metres above the
         * ground." Its diagram shows where the car starts; with no diagram
         * here, the line saying what x measures stays, as its own sentence.
         * The owner, on the 2023 re-review: "change the 2 new cards with your
         * recommendation". Keyed on 2025's asked id, as FORM_OF is.
         */
        questionLines: is2025 ? [
          `${ctx.scene}`,
          `The height, $h$ ${ctx.unit}, of ${ctx.thing} above the ground is given by $${formula}.$`,
          `$x^{\\circ}$ is ${ctx.angle}.`,
          `Calculate the two values of $x$ for which the height of ${ctx.thing} is ${target} ${ctx.unit} above the ground.`,
        ] : [
          `${ctx.scene}`,
          `The height, $h$ ${ctx.unit}, of ${ctx.thing} above the ground is given by $${formula}$,`,
          `where $x^{\\circ}$ is ${ctx.angle}.`,
          // 2023 P2 Q11 asks for "the first two values": the hand keeps
          // turning and no domain is given. The owner, on the 2023
          // re-review: "Yes". Its form alone is cosine-first, so 2025 P2
          // Q14's "the two values" is untouched.
          `Calculate the ${form?.cosFirst ? 'first ' : ''}two values of $x$ for which the height of ${ctx.thing} is ${target} ${ctx.unit}.`,
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
 *
 * **Two papers, two families, and one id was shuffling between them —
 * 2026-09-22.** The entries with `p === 0` are written tangent-first and
 * asked as *"Simplify"*, which is 2016 P1 Q11; the entries with `p > 0` are
 * written sine-cosine-tangent and asked as *"Express … in its simplest
 * form"*, which is 2018 P1 Q18. Both wordings and both shapes were already
 * here — the **seventh** time a paper's own form turned out to be in the code
 * behind a toss — and each paper was getting the other's in about half its
 * draws. `TAN_FAMILY` below sorts them by the id asked for.
 *
 * **Widened at the same time, on the owner's word** — *"Fix and widen"*.
 * Keying alone would have left four questions on each side. Every triple
 * with `1 <= r <= q <= 3` is legal; the cap is `p + q + r <= 6`, which is
 * exactly the weight of `sin^2 x cos^2 x tan^2 x`, the heaviest entry the
 * pool already had. That gives six for 2016 and nine for 2018, and nothing
 * heavier than what was there before.
 */
const TAN_PRODUCTS: TanProduct[] = [
  // ── p = 0: tangent-first, "Simplify" — 2016 P1 Q11's family
  { p: 0, q: 1, r: 1 },   // tan x cos x             -> sin x
  { p: 0, q: 2, r: 1 },   // tan x cos^2 x           -> sin x cos x
  { p: 0, q: 2, r: 2 },   // tan^2 x cos^2 x         -> sin^2 x     2016 P1 Q11
  { p: 0, q: 3, r: 1 },   // tan x cos^3 x           -> sin x cos^2 x
  { p: 0, q: 3, r: 2 },   // tan^2 x cos^3 x         -> sin^2 x cos x
  { p: 0, q: 3, r: 3 },   // tan^3 x cos^3 x         -> sin^3 x
  // ── p > 0: sine-first, "in its simplest form" — 2018 P1 Q18's family
  { p: 1, q: 1, r: 1 },   // sin x cos x tan x       -> sin^2 x     2018 P1 Q18
  { p: 1, q: 2, r: 1 },   // sin x cos^2 x tan x     -> sin^2 x cos x
  { p: 1, q: 2, r: 2 },   // sin x cos^2 x tan^2 x   -> sin^3 x
  { p: 1, q: 3, r: 1 },   // sin x cos^3 x tan x     -> sin^2 x cos^2 x
  { p: 1, q: 3, r: 2 },   // sin x cos^3 x tan^2 x   -> sin^3 x cos x
  { p: 2, q: 1, r: 1 },   // sin^2 x cos x tan x     -> sin^3 x
  { p: 2, q: 2, r: 1 },   // sin^2 x cos^2 x tan x   -> sin^3 x cos x
  { p: 2, q: 2, r: 2 },   // sin^2 x cos^2 x tan^2 x -> sin^4 x
  { p: 2, q: 3, r: 1 },   // sin^2 x cos^3 x tan x   -> sin^3 x cos^2 x
];

/**
 * Which family each id draws from. 2016 sits on an alias, so this is keyed on
 * `asked` — `wanted` resolves an alias to its target and both would read the
 * same. Anything else (a worksheet built by topic) may have either.
 */
const TAN_FAMILY: Record<string, (t: TanProduct) => boolean> = {
  'trig-identities.simplify': t => t.p > 0,         // 2018 P1 Q18
  'trig-identities.simplify-2016': t => t.p === 0,  // 2016 P1 Q11
};

/** `\\sin^{2}x^{\\circ}`, or `\\sin x^{\\circ}` at the first power, or nothing. */
function power(fn: 's' | 'c' | 't', n: number): string {
  if (n <= 0) return '';
  const base = fn === 's' ? '\\sin' : fn === 'c' ? '\\cos' : '\\tan';
  return n === 1 ? `${base} x^{\\circ}` : `${base}^{${n}}x^{\\circ}`;
}

/**
 * **The quotient shape was removed on 2026-09-22.**
 *
 * It drew `sin^n x / tan^n x` one time in four — 94 of 400 measured draws —
 * and the comment that sat here admitted the problem in passing: *"the papers
 * have not set one, so it stays the minority."* A question no past paper sets
 * is not a minority, it is a third question sharing two papers' id, and it is
 * half of why `one-form` was red on this variation.
 *
 * It is a genuine National 5 manipulation and could have its own id if a paper
 * ever wants it. Nothing cites it today, so it is gone rather than parked.
 */
function substituteTan(asked?: string): Q {
  const family = asked !== undefined ? TAN_FAMILY[asked] : undefined;
  const pool = family ? TAN_PRODUCTS.filter(family) : TAN_PRODUCTS;
  const { p, q, r } = pick(pool);
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
    /**
     * **The wording follows the ID, not the shape.**
     *
     * It followed `p` at first, which is right for the two paper clones —
     * 2018 is `p > 0` and asks for *"its simplest form"*, 2016 is `p === 0`
     * and asks *"Simplify"* — and wrong for a worksheet built by TOPIC,
     * where no id is asked for, the whole pool is in play, and every draw is
     * stamped `trig-identities.simplify` whatever its shape. `instructions`
     * caught exactly that: the clone asked for simplest form in 86% of
     * draws, the missing 14% being tangent-first expressions carrying 2018's
     * id. Measuring by id alone had shown 400 of 400 and missed it.
     *
     * So only the 2016 alias says *"Simplify"*. A topic draw of a
     * tangent-first expression now reads *"Express tan²x cos²x in its
     * simplest form"*, which is what 2018's id promises and is correct
     * English for it.
     */
    questionLines: [
      asked === 'trig-identities.simplify-2016'
        ? `Simplify $${expr}$.`
        : `Express $${expr}$ in its simplest form.`,
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

function commonFactor(wanted?: string): Q {
  /**
   * **Cosine, and the coefficient runs to 12 - 2026-09-20, the owner's word on
   * the enumerated-space sheet.**
   *
   * Both papers factor out a COSINE, and this drew a sine in about half its
   * draws - measured over 900 per id, the answer was a cosine in 51-53%. The
   * sine form is kept as a paperless practice sibling rather than dropped, so a
   * worksheet built from the topic still meets it; that is the condition the
   * owner set for splitting at all, and the tangent related-angle is the
   * precedent.
   *
   * **Three draws before, three draws now, and that is deliberate.** This
   * routine shares its topic draw loop with `substituteTan`, which serves
   * 2016 P1 Q11 and 2018 P1 Q18. A discarded draw here moves those, so
   * removing or adding a `getRandomInt` would move two unreviewed papers for
   * no reason. The first draw used to choose sine against cosine; it now
   * chooses the exam pair against the practice sibling, and the third widens
   * in place. Same count, same order, so nothing outside these three ids
   * shifts by a single question.
   *
   * **Why widening stops at 12, and why that is the honest ceiling.** The
   * expression is `k f^p g^2 + k f^(p+2)`, factoring to `k f^p`. With the
   * degree split and the function pinned, `k` is the only lever left - and it
   * factors straight back out, so `3cos x sin^2 x + 3cos^3 x` and its seventh
   * cousin are one question to a pupil. Going further inflates a count without
   * adding a question. The only lever that would buy real variety is the
   * factor power, and `p = 3` prints `cos^5 x`, which no N5 paper sets.
   */
  // Taught: three ids, and the two flags between them name which.
  const practice = wanted !== undefined
    ? wanted === 'trig-identities.common-factor-sine-practice'
    : getRandomInt(0, 3) === 0;
  const odd = wanted !== undefined
    ? wanted === 'trig-identities.common-factor-cubed'
    : getRandomInt(0, 1) === 0;
  // 13 entries so 1 - the form both papers print - still lands about one draw
  // in six, while the other eleven share the rest.
  const k = pick([1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  // The exam pair factor a cosine; only the practice sibling factors a sine.
  const [keep, other] = !practice
    ? [odd ? C : C2, S2]
    : [odd ? S : S2, C2];
  const cubed = !practice
    ? (odd ? '\\cos^{3}x^{\\circ}' : '\\cos^{4}x^{\\circ}')
    : (odd ? '\\sin^{3}x^{\\circ}' : '\\sin^{4}x^{\\circ}');
  // "cos x sin^2 x", not "sin^2 x cos x" — the paper leads with the factor
  const product = odd ? `${keep}${other}` : `${other}${keep}`;
  const co = k === 1 ? '' : `${k}`;
  const factored = k === 1 ? keep : `${k}${keep}`;

  /**
   * **2023 P2 Q13 was never a cos-degree question.** — 2026-09-21
   *
   * It was recorded in the corpus as `sin^2 x cos^2 x + cos^4 x`, answering
   * `cos^2 x`, and that is what put it in this family beside 2026 P2 Q12. It
   * is not what the paper asks. The markscheme had said so all along — its two
   * steps read `2(sin^2 x + cos^2 x)` then `2` — and the question and its
   * stored answer had BOTH been transcribed to the wrong expression, so they
   * agreed with each other and only the scheme disagreed with them. The owner,
   * on the 2023 P2 sheet: *"Question should be 2 sin squared plus 2 cos
   * squared that's a mistake in the live app and live website that needs
   * fixing before we fix this"*, then *"Yes build it"*.
   *
   * Both repos were corrected first; this follows them.
   *
   *   2023 P2 Q13   k sin^2 x + k cos^2 x      -> k          a numerical factor
   *   2026 P2 Q12   cos x sin^2 x + cos^3 x    -> cos x      degree 3
   *   practice      sin x cos^2 x + sin^3 x    -> sin x      no paper
   *
   * **The three draws above are untouched**, which is the whole reason this
   * sits here rather than earlier: `practice`, `odd` and `k` happen in the
   * same places and in the same order, so `substituteTan` — sharing this
   * topic's draw loop for 2016 P1 Q11 and 2018 P1 Q18 — does not shift by a
   * single question, and nor does 2026 P2 Q12.
   */
  if (!practice && !odd) {
    // `k = 1` would print `sin^2 x + cos^2 x`, where there is nothing to take
    // out and the first mark is for taking something out. The draw still
    // happened; only the value it is read as moves, so no stream shifts.
    const kk = k === 1 ? 2 : k;
    return {
      subTopic: 'Simplifying Trigonometric Expressions',
      difficulty: 'exam',
      variationId: 'trig-identities.common-factor',              // 2023 P2 Q13
      questionLines: [`Simplify $${kk}${S2} + ${kk}${C2}$.`, WORKING],
      boardQuestionLines: [`Simplify $${kk}${S2} + ${kk}${C2}$`],
      solutionSteps: [
        `<strong>1.</strong> Take out the common factor $${kk}$:<br><br>$${kk}\\left(${S2} + ${C2}\\right)$`,
        `<strong>2.</strong> The bracket is $${S2} + ${C2} = 1$:<br><br>$${kk} \\times 1 = ${kk}$`,
      ],
      // •¹ factorise (or expand, or substitute), •² substitute and simplify —
      // the paper's two marks, whichever of its three methods a pupil takes.
      stepMarks: [1, 1],
      finalAnswer: `$${kk}$`,
    };
  }

  return {
    subTopic: 'Simplifying Trigonometric Expressions',
    difficulty: 'exam',
    /*
     * **The id follows the degree — 2026-09-20.**
     *
     * One id served two signed-off papers that set *different expressions*:
     *
     *   2026 P2 Q12   cos x sin^2 x + cos^3 x   -> cos x     (degree 3)
     *   2023 P2 Q13   sin^2 x cos^2 x + cos^4 x -> cos^2 x   (degree 4)
     *
     * Measured over 400 draws before the split, each paper got its own degree
     * in about half of them and its own wording in about half again, so each
     * landed on its own question roughly one draw in twenty.
     *
     * **Nothing in the suite could see it.** `one-form` reads presentation and
     * the two are identical on figure, parts and vocabulary; `audit-fidelity`
     * reads words and both carry sin and cos. It lives in the algebra, which
     * is a third place a fault can hide. Found by reading the draws during the
     * 2026 locked-year pass; the owner: *"Agree split by degree"*.
     */
    variationId: practice ? 'trig-identities.common-factor-sine-practice'
      : odd ? 'trig-identities.common-factor-cubed'              // 2026 P2 Q12
      : 'trig-identities.common-factor',                         // 2023 P2 Q13
    // **Both papers' instructions, because they do not use the same one.**
    // 2023 P2 Q13 says "Simplify ... Show your working."; 2026 P2 Q12 says
    // "Express the following in its simplest form:" and asks for no working.
    // The header above already said the line is printed "most of the time" -
    // it was printed every time, so one of the two papers never got its own
    // wording. The marks are the same either way: the first is for factorising
    // or substituting, which a bare answer cannot earn whether the paper asks
    // for working or not.
    // **The wording follows the id too, since 2026-09-20.** It used to be a
    // second coin toss, so each paper printed the other one's instruction half
    // the time. 2023 P2 Q13 says "Simplify ... Show your working"; 2026 P2 Q12
    // says "Express the following in its simplest form:" and asks for none.
    // The marks are the same either way - the first is for factorising or
    // substituting, which a bare answer cannot earn whichever way it is asked.
    questionLines: odd && !practice
      // 2026 P2 Q12's full stop, inside the maths. The owner, 2026 re-review:
      // "Add full stop and keep 12".
      ? ['Express the following in its simplest form:',
         `$${co}${product} + ${co}${cubed}.$`]
      : [`Simplify $${co}${product} + ${co}${cubed}$.`, WORKING],
    boardQuestionLines: [`Simplify $${co}${product} + ${co}${cubed}$`],
    solutionSteps: [
      `<strong>1.</strong> Take out the common factor $${factored}$:<br><br>$${factored}\\left(${other} + ${odd ? (!practice ? C2 : S2) : keep}\\right)$`,
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

  /**
   * **The difference of two squares is gone, and it was a deliberate choice
   * being overturned.** The note here read: *"The paper's own shape has only
   * two forms, which is too few for a worksheet. A difference of two squares
   * against 1 uses the same identity rearranged, and a common coefficient
   * scales it — both stay squarely in the N5 skill."*
   *
   * The variety argument is sound and `scaled` already carries it. What
   * `difference` carried was a **different question**: `(1 + cos x)(1 - cos x)`
   * answering `sin^2 x` is a difference of two squares, where nothing is
   * squared out and nothing collapses to a numeral — against this paper's
   * `(sin x + cos x)^2` answering `1 + 2 sin x cos x`. Different method,
   * different kind of answer, and it was **68 of 300 draws**. `one-form` had
   * been failing on it since 2022 was locked.
   *
   * **No paper sets it.** This variation is cited only by 2019 P2 Q17, which is
   * what makes removal the right move rather than a split: `docs/review-paper.md`
   * — *"Removing one of the forms is only right when no paper has it."* The
   * owner, on the 2019 P2 sheet: *"I agree"*.
   *
   * It costs two questions, not the pool: `difference` produced exactly two
   * distinct questions (the sine and the cosine version), so the count goes
   * from 12 to 10. `square` is weighted twice because k = 1 is the paper's own.
   */
  const shape = pick(['square', 'square', 'scaled'] as const);

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
  /**
   * **Only the paper's shape, a multiple of cos^2 x and a constant** - 2024
   * P2 Q16's 3cos^2 x - 1. The other shape, cos^2 x plus or minus k sin^2 x,
   * already carries a sin^2 term, so the pupil collects two of them: a step
   * the paper's two marks do not ask for. It was 211 of 400 draws. The owner,
   * on the 2024 re-review sheet: "Yes". This variation is alone on its clone.
   */
  // The constant shape: a·cos^2 x + c = a(1 - sin^2 x) + c = (a + c) - a sin^2 x
  {
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
}

// ── a related angle — 2018 P1 Q12, 2023 P1 Q11 ──────────────────────────
//
// "Given that cos 60 = 0.5, state the value of cos 240." One mark, one step,
// and nothing to calculate: what is being tested is knowing which quadrant the
// angle lands in and what that does to the sign. The value is handed over
// precisely so that arithmetic cannot be the difficulty.

/**
 * **Any acute angle, and the value is scaffolding rather than recall.**
 *
 * This table held three rows until 2026-09-20 - `sin 30 = 0.5`, `cos 60 = 0.5`,
 * `tan 45 = 1` - on a ruling the owner made on the 2026-2023 sign-off sheet:
 * *"Use angles that give 0.5 only / Or can be 1 and you can vary quadrant they
 * ask about"*. It had previously offered *"given that tan 25 = 0.466"*, and
 * that was cut as a rounded calculator value in a non-calculator paper: nothing
 * a pupil can check.
 *
 * **That ruling is overturned, deliberately and with it in front of them.**
 * Splitting the three functions apart left each paper's clone making three
 * questions, and widening was put to the owner beside the fact that it reverses
 * what they had said - https://claude.ai/artifact/3HyvSRZ6TNsvztZw29hY19 - with
 * a surd-valued middle option offered. They chose the wide one twice, and then
 * gave the reason the old ruling was answerable:
 *
 *   *"National 5 pupils don't need to know exact values anyway so this check is
 *   to see if they can work it out from the cast diagram"*
 *
 * Which resolves it rather than merely outvoting it. The earlier objection
 * assumed the value was there so that **arithmetic** could not be the
 * difficulty, and that an uncheckable 0.466 put arithmetic back. But a pupil
 * never computes this value at all - it is handed over, and the single mark is
 * the quadrant and the sign off a CAST diagram. `0.848` is exactly as
 * checkable as `0.5`, because neither is checked: both are copied, and only the
 * sign in front of them is earned.
 *
 * So the angle runs the acute range and the value is printed to three decimal
 * places. **Both papers still fall out of it word for word**, and a special
 * angle lands about one draw in three, so their look stays common.
 */

/** The three a pupil does know cold, kept frequent so the papers' form recurs. */
const SPECIAL = [30, 45, 60];

/**
 * How far the arbitrary angle runs, per function.
 *
 * Tangent stops sooner because it runs away: `tan 85 = 11.430` is a legal
 * answer and an ugly one beside a sine's `0.985`.
 */
const WIDEST: Record<'sin' | 'cos' | 'tan', number> = { sin: 85, cos: 85, tan: 80 };

function relatedAngle(wanted?: string): Q {
  // Taught for docs/one-question-one-generator.md: the function is what the id
  // names, so read it rather than draw it. A topic sheet names no id and keeps
  // the even three-way draw.
  const fn = wanted === 'trig.related-angle' ? 'sin' as const
    : wanted === 'trig.related-angle-pre2023' ? 'cos' as const
    : wanted === 'trig.related-angle-tan-practice' ? 'tan' as const
    : pick(['sin', 'cos', 'tan'] as const);
  // One draw in three is a special angle. The rest run the acute range, which
  // is what takes each id from three distinct questions to 228 (213 for tan).
  const deg = getRandomInt(0, 2) === 0 ? pick(SPECIAL) : getRandomInt(10, WIDEST[fn]);
  /**
   * Printed to three decimal places, trailing zeros trimmed - so `sin 30` still
   * reads `0.5` and `tan 45` still reads `1`, exactly as the two papers print
   * them, rather than `0.500` and `1.000`.
   *
   * The answer echoes this string back with a sign rather than recomputing, so
   * what a pupil writes and what the scheme wants agree to the digit.
   */
  const f = fn === 'sin' ? Math.sin : fn === 'cos' ? Math.cos : Math.tan;
  const value = f(deg * Math.PI / 180).toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
  // the second, third or fourth quadrant — the first would be the same angle
  const quadrant = getRandomInt(2, 4);
  const angle = quadrant === 2 ? 180 - deg
    : quadrant === 3 ? 180 + deg
    : 360 - deg;
  // CAST: all positive in the first, sine in the second, tangent in the third,
  // cosine in the fourth
  const positive = quadrant === 2 ? fn === 'sin'
    : quadrant === 3 ? fn === 'tan'
    : fn === 'cos';
  const where = quadrant === 2 ? `$180^{\\circ} - ${deg}^{\\circ}$`
    : quadrant === 3 ? `$180^{\\circ} + ${deg}^{\\circ}$`
    : `$360^{\\circ} - ${deg}^{\\circ}$`;
  const name = quadrant === 2 ? 'second' : quadrant === 3 ? 'third' : 'fourth';
  const allowed = quadrant === 2 ? 'only sine is positive'
    : quadrant === 3 ? 'only tangent is positive'
    : 'only cosine is positive';

  return {
    subTopic: 'The Value at a Related Angle',
    difficulty: 'exam',
    /*
     * **The id follows the function — 2026-09-20.**
     *
     * One id served a three-way toss, and the two papers it carries want
     * different corners of it:
     *
     *   2023 P1 Q11   `sin 30 = 0.5`, state `sin 330`   — signed off
     *   2018 P1 Q12   `cos 60 = 0.5`, state `cos 240`   — unreviewed
     *
     * Measured over 300 draws: 2023 P1 Q11 was a sine question in 32% of them
     * and a *tangent* question in 45%, so its clone was more often a question
     * its own paper does not ask than the one it does. 2018 P1 Q12 got cosine
     * in 35%.
     *
     * The owner had approved this as three forms on the 2026–2023 closure
     * sheet. It is reopened under the later ruling — *"cos gives cos and sin
     * gives sin"* — which is general and came after. On the sheet at
     * https://claude.ai/artifact/T9VBXrkAsE2nLdXGrJZNnY: *"Make it sine"* for
     * 2023 P1 Q11, *"Yes split"* for 2018 P1 Q12.
     *
     * The tangent form has no paper behind it, so it is declared rather than
     * dropped: `trig.related-angle-tan-practice`. Dropping it would take a
     * third of this topic's questions off a worksheet built by topic, and the
     * owner made keeping that access the condition of splitting at all.
     *
     * **Nothing here is retried, so no randomness moves.** `base` is a single
     * `pick` and the function comes with it.
     *
     * **This leaves three distinct questions per id** — one base angle and
     * three quadrants. The split did not cause that; it made it visible, the
     * same way 2019 P1 Q7's split did. Widening is the owner's call and the
     * plan is in `docs/verdicts/related-angle-widening.md`.
     */
    variationId: fn === 'sin' ? 'trig.related-angle'              // 2023 P1 Q11
      : fn === 'cos' ? 'trig.related-angle-pre2023'               // 2018 P1 Q12
      : 'trig.related-angle-tan-practice',                        // no paper
    questionLines: [
      `Given that $\\${fn} ${deg}^{\\circ} = ${value}$, state the value of $\\${fn} ${angle}^{\\circ}$.`,
    ],
    boardQuestionLines: [`$\\${fn} ${deg}^{\\circ} = ${value}$. Find $\\${fn} ${angle}^{\\circ}$.`],
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

export const TRIG_GENERATORS: Record<string, Gen> = {
  'The Value at a Related Angle': relatedAngle,
  'Ordering Trigonometric Values': orderBySize,
  // All three ratios are reachable from the topic, each with its own id, so
  // `variationsBasedOn` can send each paper to the one it asks for.
  // Taught: the function IS the id — a sine is not a clone of a cosine.
  'Solving Trigonometric Equations': (w, a) => solveEquation(
    w === 'trig-equations.solve' ? 'sin'
    : w === 'trig-equations.solve-cos' ? 'cos'
    : w === 'trig-equations.solve-tan' ? 'tan'
    : pick(['sin', 'cos', 'tan'] as const), false, a),
  // Sine only: all three papers on this family are sine, and the split exists
  // for 2022 P2 Q9, which is one of them.
  'Solving a Trigonometric Equation with a Constant Term': () => solveEquation('sin', true),
  'Trigonometric Equations in a Formula': (w, a) => inFormula(w, a),
  // Two moves, two variations, both reachable from the topic.
  'Simplifying Trigonometric Expressions': (w, a) =>
    w === 'trig-identities.simplify' ? substituteTan(a)
    : w !== undefined && w.startsWith('trig-identities.common-factor')
      ? commonFactor(w)
    : getRandomInt(0, 1) === 0 ? substituteTan(a) : commonFactor(),
  'Expanding Trigonometric Brackets': expandBracket,
  'Trigonometric Fractions': splitFraction,
  'Writing in a Given Trigonometric Form': givenForm,
};
