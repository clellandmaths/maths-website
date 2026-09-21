import { GeneratedQuestion } from './types';
import type { Gen } from './n5';
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

function subjectInNumerator(wanted?: string): Q {
  const [v, subj, den, other] = letters(4, true);
  // Taught: k === 1 is the two-step question and anything else is the other,
  // so the asked id decides which side of that line to draw on. The odds
  // among the non-one values are unchanged, and so is the roll count.
  const k = wanted === 'change-subject.fraction-two-step' ? 1
    : wanted === 'change-subject.fraction' ? pick([2, 3, 4, 5])
    : pick([1, 1, 2, 3, 4, 5]);           // 1 gives the no-fraction answer
  /**
   * **2022 P1 Q7's denominator is always a square.**
   *
   * The owner, on the 2022 P1 sheet: *"Keep the shape same as question, have a
   * square term in denominator and numerator being variable plus or minus a
   * number."* The paper is `D = (B + 4)/C^2` - a squared denominator and a
   * plain number beside the subject - and the sheet had drawn
   * `G = (n + 15)/w`, which is neither.
   *
   * The roll still happens, in the same place and with the same range, so the
   * k != 1 branch (`change-subject.fraction`, which cites the signed-off 2024
   * P2 Q9) reads exactly the value it always read. The two-step branch simply
   * stops consulting it.
   */
  const denRoll = getRandomInt(1, 3);
  const squareDen = k === 1 ? true : denRoll === 1;
  /**
   * **Three choices out of one draw, on the two-step branch only.**
   *
   * `subjectInNumerator` is a rejection sampler - it draws, and the caller
   * throws the draw away when `k` did not give the id that was asked for - so
   * a *discarded* k = 1 draw that consumed two extra random numbers still
   * shifts the stream for the k != 1 draw that follows it. That moved 2024
   * P2 Q9, which is signed off, and `frozen` named it.
   *
   * `getRandomInt` is one `random()` call whatever its range, so a single
   * `getRandomInt(0, 7)` sits in exactly the place `getRandomInt(0, 1)` sat
   * and carries three bits instead of one.
   *
   * **The same count of draws is not enough - the same decision has to come
   * out of the same random value.** The first attempt read `constTerm` off the
   * low bit, so for a given `random()` the old code and the new one disagreed
   * about it half the time; `constTerm` is what decides whether `pick(consts)`
   * is called at all, so a *discarded* k = 1 attempt then consumed a different
   * number of draws and everything after it moved. `frozen` named 2024 P2 Q9
   * twice over that. Reading it off the **top** bit makes `flavour < 4` mean
   * exactly what `getRandomInt(0, 1) === 0` meant - both are `random() < 0.5` -
   * and scaling the other branch's draw by 4 puts it on the same scale, so
   * that branch is value-for-value what it always was.
   */
  const flavour = k === 1 ? getRandomInt(0, 7) : getRandomInt(0, 1) * 4;
  // k != 1 keeps the choice it always made. k = 1 always takes a number, per
  // the owner's note above - but `pick(consts)` must still be called exactly
  // when `flavour < 4`, or a discarded draw consumes a different number of
  // randoms and 2024 P2 Q9 moves again. See `numberBeside` below.
  const constTerm = k === 1 ? true : flavour < 4;

  const dTex = squareDen ? `${den}^{2}` : den;
  // "5g + 5" shares a factor a pupil would want to take out; the papers keep the
  // coefficient and the constant coprime — 2d + 3, t^2 + 4b.
  /**
   * **Wider, but only on the two-step id.**
   *
   * `k === 1` is `change-subject.fraction-two-step`, which clones 2022 P1 Q7
   * and nothing else. Its whole pool was eight constants and a square, times
   * a squared or plain denominator: **18 distinct questions**, which is under
   * the floor and thin for a question a pupil may meet a dozen times.
   *
   * Three things widen it, none of which changes what is being asked - it is
   * still multiply by the denominator, then undo the term beside the subject,
   * two operations for two marks:
   *
   *   constants to 15    "+ 12" is no harder to subtract than "+ 4"
   *   a bare letter      2017 P1 Q10 already puts a letter there, as t^2
   *   a minus sign       (B - 4)/C^2 makes the second step an addition
   *
   * That is 60 shapes rather than 18.
   *
   * **Every extra draw is behind `k === 1`.** The other branch of this routine
   * is `change-subject.fraction`, which cites 2024 P2 Q9 - signed off. Widening
   * the shared `consts` array, or drawing the sign before the branch, would
   * shift the random stream and move a frozen question. `k` is chosen above,
   * so the branch is known before any of this is drawn, and `pick(consts)`
   * stays in the same position in the stream either way.
   */
  const wide = k === 1;
  const consts = (wide ? [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
                       : [2, 3, 4, 5, 6, 7, 8, 9]).filter(c => gcd(c, k) === 1);
  /**
   * **The draw pattern is fixed; only the value is free.**
   *
   * `pick(consts)` is called if and only if `flavour < 4` - which is what the
   * k != 1 branch has always done, and what it must keep doing, because a
   * *discarded* k = 1 attempt that calls `pick` a different number of times
   * shifts every draw after it. `frozen` named 2024 P2 Q9 on exactly this,
   * twice.
   *
   * So the two-step branch takes the picked constant when there is one, and
   * otherwise builds one out of bits it already has: `flavour` is 4..7 there,
   * and `denRoll` is 1..3 and no longer used for the denominator, which is
   * twelve combinations mapped onto the first six constants. Half the draws
   * reach all fourteen and half reach six, so the shape count is 14 x 2 signs
   * = 28 - comfortably clear of the floor, and every one of them is the
   * paper's shape.
   */
  const picked = flavour < 4 ? pick(consts) : null;
  const numberBeside = picked ?? consts[((flavour - 4) * 3 + denRoll - 1) % 6];
  const tTex = wide ? `${numberBeside}`
    : constTerm ? `${picked}` : `${other}^{2}`;
  const minus = wide && (flavour & 1) !== 0;
  const numTex = `${term(k, subj)} ${minus ? '-' : '+'} ${tTex}`;
  const product = `${v}${dTex}`;
  const undo = `${product} ${minus ? '+' : '-'} ${tTex}`;
  const rhs = k === 1 ? undo : frac(undo, `${k}`);

  // Every mark in these schemes is one operation: •¹ multiply by c, •² subtract
  // t^2, •³ divide by 4. So when k is 1 there is no division to do and the
  // question is worth two, which is exactly what 2022 P1 Q7 is — and the third
  // step here said so out loud ("the subject is already on its own"), earning
  // nothing while being the step the app withholds. A pupil taking every
  // available hint was handed both real steps and left to supply a no-op.
  const move = minus ? 'Add' : 'Subtract';
  const toFrom = minus ? 'to' : 'from';
  const steps = [
    `<strong>1.</strong> Multiply both sides by $${dTex}$:<br><br>$${product} = ${numTex}$`,
    k === 1
      ? `<strong>2.</strong> ${move} $${tTex}$ ${toFrom} both sides, which leaves the subject on its own:<br><br>$${subj} = ${rhs}$`
      : `<strong>2.</strong> ${move} $${tTex}$ ${toFrom} both sides:<br><br>$${undo} = ${term(k, subj)}$`,
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

function subjectWithRoot(wanted?: string): Q {
  const insideRoot = getRandomInt(0, 1) === 0;
  // Taught: the two-step shape is 2026 P1 Q8 and is worth two marks where
  // the others are worth three — its own id for that reason, so the asked
  // id decides it. Drawn here rather than in the `if` below so that the
  // stream is the same shape whether or not an id was asked for.
  const twoStep = wanted !== undefined
    ? wanted === 'change-subject.root-two-step'
    : getRandomInt(1, 3) === 1;
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
  if (twoStep) {
    /**
     * **Widened 2026-09-20, on the owner's word at the 2026 locked-year pass.**
     *
     * This made **five** questions. The coefficient was the only thing that
     * varied - `questionKey` normalises the letters - so a pupil pressing
     * *another like this* a sixth time had seen them all, and `pool` reported
     * the topic as one of its two standing reds because of it.
     *
     * Two levers, both faithful to a two-mark square-then-take-across:
     *
     * - the coefficient runs **2 to 12** rather than 2 to 6;
     * - the sign inside the root varies, so `P = \sqrt{T + 3L}` is reachable.
     *   The same lever took 2019 P1 Q7 from three questions to six.
     *
     * **The sign costs no new random number, and that is not a detail.** This
     * routine serves `change-subject.root` as well and is reached by drawing
     * and discarding, so an extra `getRandomInt` here would move 2016 P2 Q12
     * and 2018 P1 Q14 on every draw that landed in this branch and was thrown
     * away. `insideRoot` is already drawn above, splits evenly, and this
     * branch does not otherwise use it - so it names the sign. That is the
     * trick 2022 P1 Q2's cube constant uses, for the same reason.
     */
    const k = getRandomInt(2, 12);
    const plus = insideRoot;
    const sign = plus ? '+' : '-';
    const undo = plus ? 'Subtract' : 'Add';
    const back = plus ? '-' : '+';
    return {
      subTopic: 'Changing the Subject with Roots',
      difficulty: 'exam',
      variationId: 'change-subject.root-two-step',
      questionLines: [
        `Change the subject of the following formula to $${subj}$.`,
        `$${v} = \\sqrt{${subj} ${sign} ${k}${a}}$`,
      ],
      boardQuestionLines: [`$${v} = \\sqrt{${subj} ${sign} ${k}${a}}$, make $${subj}$ the subject`],
      solutionSteps: [
        `<strong>1.</strong> Square both sides to undo the root:<br><br>$${v}^{2} = ${subj} ${sign} ${k}${a}$`,
        `<strong>2.</strong> ${undo} $${k}${a}$ ${plus ? 'from' : 'to'} both sides:<br><br>$${subj} = ${v}^{2} ${back} ${k}${a}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$${subj} = ${v}^{2} ${back} ${k}${a}$`,
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

/**
 * **`bracketOnly` is 2019 P1 Q7's own loop, and it exists to widen `d`.**
 *
 * Splitting the bracket shape onto its own id showed it made three distinct
 * questions: `questionKey` normalises letters, so the only real variable was
 * the divisor, one of 2, 3, 4.
 *
 * The owner, 2026-09-20: *"we can vary the denominator of the fraction to be
 * almost any number as long as the numerator stays as 1"*, and then, on the
 * denominator specifically: *"keep it to positive numbers only ... and widen
 * it so it can take any number from 2 to 30."*
 *
 * That cannot be done in the shared loop. `d` is drawn **before** the branch
 * and used by the squared shape too, so widening its pool changes what the
 * squared shape draws - and that is 2023 P2 Q7 and 2025 P2 Q9, both signed
 * off. Drawing a second `d` inside the branch is no better: the extra random
 * shifts the stream for every discarded bracket draw, which moves the same
 * two papers. Both were tested rather than assumed; `frozen` named them.
 *
 * So the bracket shape gets a **subTopic of its own**, and therefore its own
 * draw loop, where `d` can be drawn from whatever pool suits it.
 */
function subjectFractionCoefficient(bracketOnly = false, wanted?: string): Q {
  // Taught: all four ids this routine stamps are named for their shape, so
  // the asked id settles both flags. Nothing asked keeps the 1-in-3.
  const bracketed = bracketOnly || (wanted !== undefined
    ? wanted.includes('-bracket')
    : getRandomInt(1, 3) === 1);   // the 2019 shape, 1 of the 4
  // 2 to 30 and always positive in its own loop. The shared loop keeps the
  // pool it always had, so the squared and plain shapes draw what they drew.
  const d = bracketOnly ? getRandomInt(2, 30) : pick([2, 3, 4]);
  const [v, subj, mLetter, tLetter] = letters(4, true);
  /**
   * **Plain, or squared with a coefficient — two of the papers, two shapes.**
   *
   *   2023 P2 Q7   P = (1/3)mn - r       no square, and a bare constant
   *   2025 P2 Q9   B = (1/4)kc^2 - 3c    a square, and a coefficient on it
   *
   * Drawn independently, `squareM` and `tCoef` made four combinations from two
   * papers, and 2023 P2 Q7 got its own in one draw of four. The owner read the
   * result off the contact sheet as "seems slightly harder", which is exactly
   * what it was: `S = (1/3)aw^2 - 2c` where the paper is `P = (1/3)mn - r`.
   *
   * 2014 P2 Q11 - `s = ut + (1/2)at^2` - is a third shape again, with a whole
   * extra term, and is not built here at all; it shares `-squared`'s id as the
   * nearest of the two. That is a known compromise, not a claim they match.
   */
  const plain = wanted !== undefined
    ? wanted === 'change-subject.fraction-coefficient-plain'
    : getRandomInt(0, 1) === 0;
  const squareM = !plain;
  const mTex = squareM ? `${mLetter}^{2}` : mLetter;

  if (bracketed) {
    /**
     * **The sign inside the bracket, taken from a draw already made.**
     *
     * Splitting this shape onto its own id showed how thin it really is: three
     * distinct questions in 300 draws, because `questionKey` normalises
     * letters and the only thing that actually varied was `d`, one of 2, 3, 4.
     * Sharing an id with the squared shape had been hiding that.
     *
     * `plain` is drawn above and goes unused on this path, so reading the sign
     * off it doubles the pool to six and **consumes no new random**. That
     * matters: an extra draw here would shift the stream for every discarded
     * bracket draw, which moves `change-subject.fraction-coefficient-plain` -
     * 2023 P2 Q7, signed off, and no part of the decision that authorised
     * this split.
     *
     * Six is still thin, and it is the ceiling without touching 2023 P2 Q7:
     * `d` is drawn before the branch and shared, so widening it moves that
     * paper too. Reported rather than worked around.
     */
    const inner = plain ? '+' : '-';
    /*
     * **V = (1/d)*M*(S + T) - the trapezium shape, and 2019 P1 Q7's own.**
     *
     * This used to be stamped `change-subject.fraction-coefficient`, the same
     * id as the squared shape below, so one id covered two genuinely different
     * questions: 2019 P1 Q7 is `A = (1/2)h(x + y)` with the subject **inside a
     * bracket**, and 2025 P2 Q9 is `B = (1/4)kc^2 - 3c`, a squared term and no
     * bracket. Measured: 47% of 2025 P2 Q9's draws were the bracket shape and
     * 53% of 2019 P1 Q7's were the squared one. Each paper's clone was the
     * other paper's question about half the time.
     *
     * The fix is the one this project already settled on: **let the toss
     * choose the id, not the presentation.** The routine is untouched - it
     * still draws `bracketed` one time in three and produces both shapes at
     * exactly the rates it did - and only the name stamped on the way out
     * changes. `generateQuestion` then discards until it has the id asked for,
     * so a clone of 2019 P1 Q7 is always the bracket and a clone of 2025 P2 Q9
     * always the square.
     *
     * **A worksheet built from the topic still sees both**, because it asks
     * for the topic rather than an id and takes whatever the routine emits.
     * That was the owner's condition for splitting at all: *"if we can still
     * get access to all the variations anyway when building a sheet ... then
     * point is mute and we should split to ensure specific question clones
     * based on itself."* Verified on the sibling trig-graph case by drawing
     * 400 times from the topic and finding every form still present at the
     * same rates.
     *
     * `-plain` already did this correctly for 2023 P2 Q7; this is the same
     * separation for the two shapes that were left sharing.
     */
    return {
      /**
       * **Two ids for one shape, because two loops produce it.**
       *
       * 2019 P1 Q7's own loop makes the exam variation, with the wide
       * denominator. The *shared* loop still makes this shape a third of the
       * time and cannot stop without moving the questions that share its
       * random stream - tested, and it moves 2023 P2 Q7 and 2025 P2 Q9, both
       * signed off.
       *
       * Leaving those draws stamped with the exam id was the first attempt and
       * `mix` refused it, correctly: 142 draws in 400 of the shared topic came
       * out carrying an id the registry files under a different topic. An
       * undeclared variation is exactly what that check is for, and the reply
       * to it is to declare, not to suppress.
       *
       * So the shared loop's copies are named for what they are - a practice
       * variation with no paper behind it, in the topic that produces them.
       */
      subTopic: bracketOnly
        ? 'Changing the Subject Inside a Bracket'
        : 'Changing the Subject with a Fractional Coefficient',
      difficulty: bracketOnly ? 'exam' : 'skill',
      variationId: bracketOnly
        ? 'change-subject.fraction-coefficient-bracket'
        : 'change-subject.fraction-coefficient-bracket-practice',
      questionLines: [
        `A formula is given by $${v} = ${frac('1', `${d}`)}${mLetter}(${subj} ${inner} ${tLetter})$.`,
        `Make $${subj}$ the subject of the formula.`,
      ],
      boardQuestionLines: [`$${v} = ${frac('1', `${d}`)}${mLetter}(${subj} ${inner} ${tLetter})$, make $${subj}$ the subject`],
      solutionSteps: [
        `<strong>1.</strong> Multiply both sides by $${d}$ to clear the fraction:<br><br>$${d}${v} = ${mLetter}(${subj} ${inner} ${tLetter})$`,
        `<strong>2.</strong> Divide both sides by $${mLetter}$:<br><br>$${frac(`${d}${v}`, mLetter)} = ${subj} ${inner} ${tLetter}$`,
        `<strong>3.</strong> ${plain ? `Subtract $${tLetter}$ from` : `Add $${tLetter}$ to`} both sides:<br><br>$${subj} = ${frac(`${d}${v}`, mLetter)} ${plain ? '-' : '+'} ${tLetter}$`,
      ],
      // 2019 P1 Q7: •¹ multiply by 2, •² divide by h, •³ subtract y
      stepMarks: [1, 1, 1],
      finalAnswer: `$${subj} = ${frac(`${d}${v}`, mLetter)} ${plain ? '-' : '+'} ${tLetter}$`,
    };
  }

  // V = (1/d)·S·M ± T, where T may itself carry a coefficient
  const minus = getRandomInt(0, 1) === 0;
  // 2023 P2 Q7's constant is bare; 2025 P2 Q9's carries a 3.
  const tCoef = plain ? 1 : pick([2, 3]);
  const tTex = term(tCoef, tLetter);
  const flipped = minus ? '+' : '-';            // the sign after moving T across

  return {
    subTopic: 'Changing the Subject with a Fractional Coefficient',
    difficulty: 'exam',
    variationId: plain ? 'change-subject.fraction-coefficient-plain'
      : 'change-subject.fraction-coefficient',
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
    // Positive, as it is in every paper that has one: 19 + x, 3x, x + 8. A
    // negative there opened the question on a negative variable term, '-x - 8',
    // and put two sign reversals in a three-mark question.
    const otherCoef = getRandomInt(1, 6);       // v coefficient on the other side
    const otherConst = nonZeroInt(-20, 20);

    // **The bracket has a multiplier.** The five papers use 2, 3, 5, 6 and 3;
    // a multiplier of 1 prints "(x - 4) - 3", where the first mark - "multiply
    // out bracket" - is for removing a pair of brackets that do nothing, and a
    // pupil scores it by copying the line out.
    if (Math.abs(k) < 2) continue;
    // A negative multiplier is 2015 P1 Q2, and it writes it the way a paper
    // does: the constant first and the bracket subtracted, `11 - 2(1 + 3x)`.
    // Written the other way round the question opened on a negative bracket,
    // `-3(x - 5) - 3`, which none of the five does.
    if (k < 0 && outside < 0) continue;

    const bracketTex = `${Math.abs(k)}(${term(innerCoef, v)}${tail(inner)})`;
    const withBracket = k < 0
      ? `${outside} - ${bracketTex}`
      : `${bracketTex}${tail(outside)}`;
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
    // **Subtracted, as the one paper subtracts.** 2023 P1 Q14 is
    // `(x + 1)/3 - 2 > 3x/5`: the loose constant comes off the left-hand
    // fraction. Drawn across zero it was added in a quarter of draws, which
    // puts a question no paper sets under that paper name.
    const b = getRandomInt(1, 6);                // the loose constant, taken away
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
      // **One paper, one wording.** 2023 P1 Q14 is the only question this
      // clones and it reads "Solve, algebraically, the inequation". The pools
      // above carry both wordings because `inequalities.brackets` has five
      // papers that use both; this one does not get to choose.
      questionLines: [`${INEQ_LEAD[1]} ${INEQ_WORD[1]} $${lhs} ${rel} ${rhs}$`],
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

export const FORMULA_GENERATORS: Record<string, Gen> = {
  'Changing the Subject': (w) => subjectInNumerator(w),
  'Changing the Subject with Roots': (w) => subjectWithRoot(w),
  // Wrapped, not bare. Dispatch now hands the routine the variation id the
  // caller asked for, and a bare reference would take that string as
  // `bracketOnly` - which is truthy. frozen caught it on 2023 P2 Q7 and
  // 2025 P2 Q9 the moment the argument was introduced.
  'Changing the Subject with a Fractional Coefficient': (w) =>
    subjectFractionCoefficient(false, w),
  // 2019 P1 Q7 - its own loop, so its denominator can run 2 to 30 without
  // moving 2023 P2 Q7 or 2025 P2 Q9, which share the other one.
  'Changing the Subject Inside a Bracket': (w) => subjectFractionCoefficient(true, w),
  'Solving Inequalities': inequalityBrackets,
  'Inequalities with Fractions': inequalityFractions,
};
