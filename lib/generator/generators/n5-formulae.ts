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

/**
 * **Which shape each paper on the `k != 1` branch actually sets.**
 *
 * The owner, on the 2024 P2 sheet: *"Agreed"*, against two findings measured
 * over 300 draws.
 *
 *   2024 P2 Q9   `change-subject.fraction`          f = (2d + 3)/e
 *   2017 P1 Q10  `change-subject.fraction-pre2023`  F = (t^2 + 4b)/c
 *
 * Both have a **plain** denominator, and the routine was squaring it in 57 of
 * 300 draws — a shape neither paper sets anywhere. And the term beside the
 * subject was a coin toss, so each paper got the other's shape about half the
 * time: a squared letter in 139 draws, a plain constant in 161.
 *
 * `asked` and not `wanted`: 2017's id is an alias of 2024's, so both arrive
 * with the same `wanted`.
 */
const NUMERATOR_SHAPE: Record<string, { constTerm: boolean }> = {
  'change-subject.fraction': { constTerm: true },           // 2024 P2 Q9: + 3
  'change-subject.fraction-pre2023': { constTerm: false },  // 2017 P1 Q10: t^2
};

function subjectInNumerator(wanted?: string, asked?: string): Q {
  const [v, subj, den, other] = letters(4, true);
  // Taught: k === 1 is the two-step question and anything else is the other,
  // so the asked id decides which side of that line to draw on. The odds
  // among the non-one values are unchanged, and so is the roll count.
  /**
   * **2017 P1 Q10 takes a wider coefficient, 2 to 9.** It made four questions:
   * the coefficient was all that varied, and letters are never counted. The
   * owner, on the 2017 P1 sheet: *"Yes widen and key"*. Keyed on `asked` -
   * 2017's id is an alias of 2024's, so `wanted` is the same for both - and
   * `pick` is one random whatever the list's length, so the stream is the
   * one it was and 2024 P2 Q9, signed off, draws exactly what it drew.
   */
  const k = wanted === 'change-subject.fraction-two-step' ? 1
    : asked === 'change-subject.fraction-pre2023' ? pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
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
  // **The roll still happens** — both papers named above want a plain
  // denominator, but skipping the draw would shift the stream for the
  // two-step branch, which clones 2022 P1 Q7. Only the value read off it
  // changes. Same reasoning as the `flavour` note below.
  const squareDen = k === 1 ? true
    : asked !== undefined && asked in NUMERATOR_SHAPE ? false
    : denRoll === 1;
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
  // `flavour` is still drawn above, in the same place and on the same scale;
  // the two named papers simply stop consulting it and take their own shape.
  const constTerm = k === 1 ? true
    : NUMERATOR_SHAPE[asked ?? '']?.constTerm
    ?? flavour < 4;

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
  /**
   * **`numberBeside`, never `picked`.** `picked` is null whenever
   * `flavour >= 4`, and until the 2024 P2 pin that could not happen on this
   * branch because `constTerm` WAS `flavour < 4`. Forcing `constTerm` true
   * broke that tie and half the draws printed `2d + null`, which the owner
   * read off the sheet: *"Can't have null written has to be a number"*.
   * `numberBeside` is the same value wherever `picked` was non-null, so the
   * unpinned ids are untouched.
   */
  const tTex = wide ? `${numberBeside}`
    : constTerm ? `${numberBeside}` : `${other}^{2}`;
  /**
   * **A minus is reachable where the term is a number.** *"...and can be minus
   * a number"* — the owner, same note. The draw is made only for 2024 P2 Q9,
   * so no other id on this routine gains or loses a random: 2022 P1 Q7 reads
   * its sign off `flavour` exactly as before, and 2017 P1 Q10's term is a
   * squared letter rather than a number, so it keeps its plus.
   */
  /**
   * **2017 P1 Q10 takes either sign on the subject's term too** - the owner,
   * on the 2017 P1 sheet: *"8 questions still very thin, I think you could
   * have + or - on the top and expand the coefficients further"*. So t^2 + kb
   * or t^2 - kb. The draw is made on 2017's id alone, so 2024 P2 Q9's stream
   * is the one it was.
   */
  const is2017 = asked === 'change-subject.fraction-pre2023';
  const minusRoll = asked === 'change-subject.fraction' || is2017 ? getRandomInt(0, 1) : 0;
  const minus = !is2017 && (wide ? (flavour & 1) !== 0 : minusRoll === 1);
  const subjMinus = is2017 && minusRoll === 1;
  // 2017 P1 Q10 writes the squared term first, as its paper does:
  // F = (t^2 + 4b)/c.
  const numTex = is2017
    ? `${tTex} ${subjMinus ? '-' : '+'} ${term(k, subj)}`
    : `${term(k, subj)} ${minus ? '-' : '+'} ${tTex}`;
  const product = `${v}${dTex}`;
  const undo = is2017 ? `${product} - ${tTex}` : `${product} ${minus ? '+' : '-'} ${tTex}`;
  // With the subject's term negative, dividing by -k is written the way a
  // pupil would leave it: the t^2 first and a positive denominator.
  const rhs = k === 1 ? undo
    : subjMinus ? frac(`${tTex} - ${product}`, `${k}`)
    : frac(undo, `${k}`);

  // Every mark in these schemes is one operation: •¹ multiply by c, •² subtract
  // t^2, •³ divide by 4. So when k is 1 there is no division to do and the
  // question is worth two, which is exactly what 2022 P1 Q7 is — and the third
  // step here said so out loud ("the subject is already on its own"), earning
  // nothing while being the step the app withholds. A pupil taking every
  // available hint was handed both real steps and left to supply a no-op.
  const move = minus ? 'Add' : 'Subtract';
  const toFrom = minus ? 'to' : 'from';
  const steps = is2017 ? [
    // 2017 P1 Q10's scheme: multiply by c, subtract t^2, divide by 4.
    `<strong>1.</strong> Multiply both sides by $${dTex}$:<br><br>$${product} = ${numTex}$`,
    `<strong>2.</strong> Subtract $${tTex}$ from both sides:<br><br>$${undo} = ${subjMinus ? '-' : ''}${term(k, subj)}$`,
    `<strong>3.</strong> Divide both sides by $${subjMinus ? -k : k}$:<br><br>$${subj} = ${rhs}$`,
  ] : [
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

function subjectWithRoot(wanted?: string, asked?: string): Q {
  const insideRootDraw = getRandomInt(0, 1) === 0;
  /**
   * **The two papers here are two different questions, and one id was
   * handing out both — 2026-09-22.**
   *
   *   2016 P2 Q12   L = sqrt(4kt - p)   square, add, divide
   *   2018 P1 Q14   y = g sqrt(x) + h   subtract, divide, square
   *
   * Different method and a different shape of answer, chosen by a coin toss
   * that neither paper could see. Measured over 400 draws of 2018 P1 Q14:
   * **206 of them were 2016's question.**
   *
   * `one-form` passes this, and would pass it again. There is no figure on
   * either, both ask in one instruction, both use the same vocabulary and
   * both are three marks — the difference lives entirely in the algebra,
   * which is the third hiding place `docs/review-paper.md` names.
   *
   * Keyed on `asked` rather than `wanted`, because 2016 sits on the alias
   * `change-subject.root-2016` and an alias resolves `wanted` to its target.
   * The draw above still happens either way, so the random stream keeps the
   * same shape and nothing that shares this routine moves.
   */
  const insideRoot = asked === 'change-subject.root-2016' ? true
    : asked === 'change-subject.root' ? false
    : insideRootDraw;
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
    // **Widened again 2026-09-21, at the owner's word on the 2026 P1 sheet.**
    // 2 to 12 against two signs is exactly 22 questions, which is what the
    // card reported. 2 to 20 makes 38. No extra random is drawn, so nothing
    // that shares this routine moves for it.
    const k = getRandomInt(2, 20);
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
    /**
     * **2016 P2 Q12 widened — 2026-09-24.** It made five questions, the
     * coefficient being the only thing that varied once the letters are set
     * aside. The owner, on the 2016 P2 sheet: *"So we won't be having a
     * worksheet made where question is identical except variable name
     * different. So id suggest widen by allowing - or + and also widening the
     * coefficient of kt."* So for this id the loose term may be added or
     * taken away inside the root, and the coefficient runs 2 to 12: 22
     * questions, the same three operations (square, undo the term, divide).
     * Both randoms are drawn only for this id; a topic sheet keeps 2 to 6 and
     * the minus.
     */
    const wide = asked === 'change-subject.root-2016';
    const k = wide ? getRandomInt(2, 12) : pick([2, 3, 4, 5, 6]);
    const plus = wide && getRandomInt(0, 1) === 1;
    const [sign, undo, back] = plus ? ['+', `Subtract $${b}$ from`, '-'] : ['-', `Add $${b}$ to`, '+'];
    return {
      subTopic: 'Changing the Subject with Roots',
      difficulty: 'exam',
      variationId: 'change-subject.root',
      questionLines: [
        `Change the subject of the formula $${v} = \\sqrt{${k}${subj}${a} ${sign} ${b}}$ to $${subj}$.`,
      ],
      boardQuestionLines: [`$${v} = \\sqrt{${k}${subj}${a} ${sign} ${b}}$, make $${subj}$ the subject`],
      solutionSteps: [
        `<strong>1.</strong> Square both sides to undo the root:<br><br>$${v}^{2} = ${k}${subj}${a} ${sign} ${b}$`,
        `<strong>2.</strong> ${undo} both sides:<br><br>$${v}^{2} ${back} ${b} = ${k}${subj}${a}$`,
        `<strong>3.</strong> Divide both sides by $${k}${a}$:<br><br>$${subj} = ${frac(`${v}^{2} ${back} ${b}`, `${k}${a}`)}$`,
      ],
      // 2016 P2 Q12: •¹ square, •² add p, •³ divide by 4t — one per operation
      stepMarks: [1, 1, 1],
      finalAnswer: `$${subj} = ${frac(`${v}^{2} ${back} ${b}`, `${k}${a}`)}$`,
    };
  }

  // v = a·sqrt(subj) + b — the root itself has to be undone last
  const bSign = getRandomInt(0, 1) === 0 ? 1 : -1;
  /**
   * **Widened 2026-09-22, at the owner's word on the 2018 P1 sheet** — *"Yes
   * split. But we need to find more structures for this question."*
   *
   * Splitting 2016 off (see `insideRoot` above) left this branch, which is
   * 2018 P1 Q14's own, making **two** questions: the sign, and nothing else,
   * because `questionKey` normalises the letters. That is thinner than
   * anything else in the paper and thinner than it was before the split, so
   * the split had to come with this.
   *
   * The two levers are the coefficient in front of the root and the loose
   * term, each of which may be a number instead of a letter. The paper uses
   * letters for both (`y = g sqrt(x) + h`) and that stays the common case;
   * a number in either place is the same three marks and the same three
   * operations — subtract, divide, square — so it is widening, not a second
   * question. This is the lever `change-subject.root-two-step` was widened
   * with on 2026-09-21, for the same reason.
   *
   * **Both randoms are drawn inside this branch, which nothing else reaches**
   * now that 2016 is keyed away and the two-step shape returns above — so no
   * other variation's stream moves. `frozen` is the backstop and was run.
   */
  const coef = getRandomInt(1, 2) === 1 ? a : String(getRandomInt(2, 12));
  const term = getRandomInt(1, 2) === 1 ? b : String(getRandomInt(2, 20));
  const inner = frac(`${v} ${bSign > 0 ? '-' : '+'} ${term}`, coef);
  return {
    subTopic: 'Changing the Subject with Roots',
    difficulty: 'exam',
    variationId: 'change-subject.root',
    questionLines: [
      `Change the subject of the formula $${v} = ${coef}\\sqrt{${subj}}${bSign > 0 ? ` + ${term}` : ` - ${term}`}$ to $${subj}$.`,
    ],
    boardQuestionLines: [`$${v} = ${coef}\\sqrt{${subj}}${bSign > 0 ? ` + ${term}` : ` - ${term}`}$, make $${subj}$ the subject`],
    solutionSteps: [
      `<strong>1.</strong> ${bSign > 0 ? `Subtract $${term}$ from` : `Add $${term}$ to`} both sides:<br><br>$${v} ${bSign > 0 ? '-' : '+'} ${term} = ${coef}\\sqrt{${subj}}$`,
      `<strong>2.</strong> Divide both sides by $${coef}$:<br><br>$${inner} = \\sqrt{${subj}}$`,
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
  // **Widened 2026-09-21, on the owner's word at the 2025 P2 pass.**
  // Three denominators against two constant coefficients and a sign is
  // exactly the twelve different questions the card reported. Four and
  // three takes it to about thirty. No extra random is drawn.
  const d = bracketOnly ? getRandomInt(2, 30)
    /**
     * **`-plain` is 2023 P2 Q7, and it was widened on 2026-09-21.**
     *
     * This read `pick([2, 3, 4])` and said so deliberately: *"Only the paper
     * the owner widened. `-plain` is 2023 P2 Q7, which is signed off and was
     * not in scope; it draws from the pool it was approved with."* That held
     * until its own paper came up for review and the owner read the count off
     * the card — three denominators against two signs is six different
     * questions, and 1/2, 1/3, 1/4 are the only fractions the papers set.
     *
     *   *"This needs widened the denominator of the fraction could be any
     *   positive number - widen to 30 variations."*
     *
     * Fifteen denominators against the sign is thirty, which is the number
     * asked for. One `getRandomInt` either way, so the draw count is
     * unchanged and the squared sibling does not move.
     */
    : wanted === 'change-subject.fraction-coefficient-plain' ? getRandomInt(2, 16)
    : pick([2, 3, 4, 5, 6]);
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
  /**
   * **2025 P2 Q9 is B = ¼kc² − 3c: the other term holds the squared
   * letter.** — 2026-09-25
   *
   * Measured on the 2014 P2 sheet, where its card was shown at the owner's
   * request, 400 draws: the other term never held the squared letter
   * (`A = ⅕nm² − 2w`). The owner: *"Yes"*. The sign was pinned to the
   * paper's minus as well, which halved the clone to 15 questions, and the
   * owner took that back - *"Plus or minus is fine surely as well"* - so
   * the sign stays free (30 questions), then *"Confirmed"*.
   *
   * The squared shape only - `plain` is 2023 P2 Q7 (LOCKED) and keeps its
   * own letter. 2014 P2 Q11 leaves before here.
   */
  const minus = getRandomInt(0, 1) === 0;
  // 2023 P2 Q7's constant is bare; 2025 P2 Q9's carries a 3.
  const tCoef = plain ? 1 : pick([2, 3, 4]);
  const tTex = term(tCoef, squareM ? mLetter : tLetter);
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

/**
 * **2014 P2 Q11 is s = ut + ½at², to a.** — 2026-09-25
 *
 * The note above called this "a third shape again ... not built here at all",
 * sharing the squared id as the nearest. Measured on the 2014 P2 sheet, 400
 * draws: the fraction term always first, and the other term never containing
 * the squared letter (0 of 400) - `A = ⅕nm² − 2w` where the paper's first term,
 * ut, holds the t that is squared. The owner: *"Yes"* to its own shape: the
 * other term first, a product containing the squared letter, a plus, and a
 * unit fraction.
 *
 * `-pre2023` cites 2014 P2 Q11 alone, but it is an ALIAS of the id LOCKED
 * 2025 P2 Q9 is on, so it is sent here from the dispatch before the shared
 * routine draws anything. The other term may carry a small whole coefficient,
 * as 2025's 3c does; 1 is the paper's.
 */
const SUVAT_2014 = 'change-subject.fraction-coefficient-pre2023';

function subjectSuvat2014(): Q {
  const [v, other, sq, subj] = letters(4);
  const d = getRandomInt(2, 10);
  const k = pick([1, 1, 2, 3]);
  const kTerm = `${k === 1 ? '' : k}${other}${sq}`;
  const sqTex = `${sq}^{2}`;
  return {
    subTopic: 'Changing the Subject with a Fractional Coefficient',
    difficulty: 'exam',
    variationId: 'change-subject.fraction-coefficient',
    questionLines: [
      `Change the subject of the formula $${v} = ${kTerm} + ${frac('1', `${d}`)}${subj}${sqTex}$ to $${subj}$.`,
    ],
    boardQuestionLines: [`$${v} = ${kTerm} + ${frac('1', `${d}`)}${subj}${sqTex}$, make $${subj}$ the subject`],
    solutionSteps: [
      `<strong>1.</strong> Subtract $${kTerm}$ from both sides:<br><br>$${v} - ${kTerm} = ${frac('1', `${d}`)}${subj}${sqTex}$`,
      `<strong>2.</strong> Multiply both sides by $${d}$:<br><br>$${d}(${v} - ${kTerm}) = ${subj}${sqTex}$`,
      `<strong>3.</strong> Divide both sides by $${sqTex}$:<br><br>$${subj} = ${frac(`${d}(${v} - ${kTerm})`, sqTex)}$`,
    ],
    // 2014 P2 Q11: •¹ subtract ut, •² multiply by 2, •³ divide by t²
    stepMarks: [1, 1, 1],
    finalAnswer: `$${subj} = ${frac(`${d}(${v} - ${kTerm})`, sqTex)}$`,
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

/**
 * **Which way each paper points.** Four of the five say `<` and 2017 P1 Q8
 * says `>`, so pinning the lot to `<` - which is what was first recommended,
 * from having read two of them - would have made 2017 P1 Q8 wrong. Read all
 * the cited papers before capping anything: that rule is in CLAUDE.md and
 * this is the second time it has earned its place.
 */
const REL_OF: Record<string, string> = {
  'inequalities.brackets': '\\lt',            // 2026 P1 Q4
  'inequalities.brackets-2024': '\\lt',       // 2024 P2 Q4
  'inequalities.brackets-pre2023': '\\lt',    // 2018 P2 Q4
  'inequalities.brackets-2017': '\\gt',       // 2017 P1 Q8
  'inequalities.brackets-2015': '\\lt',       // 2015 P1 Q2
};

function inequalityBrackets(wanted?: string, asked?: string): Q {
  for (let tries = 0; tries < 500; tries++) {
    // x in all ten *Linear equations and inequations* papers; `y` and `p` in
    // none. An inequality is solved for x for the same reason an equation is.
    const v = 'x';
    // Taught: a paper points one way and the clone should point that way
    // too. The owner, on the 2026 P1 sheet: *"Agree"*. Nothing asked - a
    // topic sheet - keeps the even draw, so browsing still meets both.
    const rel = REL_OF[asked ?? ''] ?? pick(['\\lt', '\\gt']);
    /**
     * **2015 P1 Q2's own shape: `11 - 2(1 + 3x) < 39`.** A number minus a
     * bracket on the left, a bare number on the right, so collecting leaves
     * `-6x < 30` and the sign has to turn. The clone put an x on both sides
     * in 400 of 400 draws. The owner, on the 2015 P1 sheet: *"Yes key the
     * shape for this question."* Every coin below is still drawn; 2015's id
     * only reads them differently, so the four LOCKED papers on this routine
     * see the same stream as before.
     */
    const paper2015 = asked === 'inequalities.brackets-2015';
    // **2024 P2 Q4's bracket is on the left, `5(x - 2) + 4 < 7x + 8`**, and
    // the clone put it on the right in 181 of 400 draws. The owner, at the
    // foot of the 2015 P1 sheet: *"Left and right side opposite of what paper
    // is"*. The coin is still drawn.
    //
    // **The other three papers put the bracket on the right**: 2017 P1 Q8
    // `19 + x > 15 + 3(x - 2)`, 2018 P2 Q4 `3x < 6(x - 1) - 12`, 2026 P1 Q4
    // `x + 8 < 3(x - 2) + 20`, and each clone put it on the left in about
    // half its draws. The owner, on each card: *"Yes key"*.
    const paper2024 = asked === 'inequalities.brackets-2024';
    const bracketRight = asked === 'inequalities.brackets-2017'      // 2017 P1 Q8
      || asked === 'inequalities.brackets-pre2023'                    // 2018 P2 Q4
      || asked === 'inequalities.brackets';                           // 2026 P1 Q4
    const coinLeft = getRandomInt(0, 1) === 0;
    const bracketLeft = paper2015 || paper2024 ? true : bracketRight ? false : coinLeft;
    // one in five should end with a negative x coefficient, so the sign flips —
    // that is 2015 P1 Q2, and it is where the marks are lost
    const wantFlip = getRandomInt(1, 5) === 1 || paper2015;

    const k = nonZeroInt(-6, 6);                // multiplier on the bracket
    const inner = nonZeroInt(-9, 9);            // constant inside the bracket
    const innerCoef = pick([1, 1, 2, 3]);       // coefficient of v inside
    const outside = nonZeroInt(-12, 12);        // constant beside the bracket
    // Positive, as it is in every paper that has one: 19 + x, 3x, x + 8. A
    // negative there opened the question on a negative variable term, '-x - 8',
    // and put two sign reversals in a three-mark question.
    const drawnCoef = getRandomInt(1, 6);       // v coefficient on the other side
    const otherCoef = paper2015 ? 0 : drawnCoef;
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
    if (paper2015 && k > 0) continue;           // the bracket is subtracted

    const bracketTex = `${Math.abs(k)}(${term(innerCoef, v)}${tail(inner)})`;
    const withBracket = k < 0
      ? `${outside} - ${bracketTex}`
      : `${bracketTex}${tail(outside)}`;
    const plain = otherCoef ? `${term(otherCoef, v)}${tail(otherConst)}` : `${otherConst}`;

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
      // 2015 P1 Q2's own words, on the owner's "Pin the wording". Both are
      // still drawn, so the four LOCKED papers keep their stream.
      questionLines: [(() => {
        const lead = pick(INEQ_LEAD), word = pick(INEQ_WORD);
        // 2026 P1 Q4's own words and its stop: "Solve, algebraically, the
        // inequation x + 8 < 3(x − 2) + 20." The owner, 2026 re-review: "Yes".
        // Its id is the base one; the picks above are still drawn.
        return paper2015
          ? `Solve algebraically the inequality $${lhs} ${rel} ${rhs}$`
          : asked === 'inequalities.brackets'
            ? `Solve, algebraically, the inequation $${lhs} ${rel} ${rhs}.$`
            // 2024 P2 Q4 ends "5(x − 2) + 4 < 7x + 8." with the stop inside the
            // maths. The owner, on the 2024 re-review sheet: "do the full stop
            // fix" - the stop only, so its words keep the draw they had.
            : asked === 'inequalities.brackets-2024'
            ? `${lead} ${word} $${lhs} ${rel} ${rhs}.$`
            : `${lead} ${word} $${lhs} ${rel} ${rhs}$`;
      })()],
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
    /**
     * **The paper sets a strict greater-than, and this clones only that
     * paper.** 2023 P1 Q14 is `(x + 1)/3 - 2 > 3x/5`, and its markscheme
     * carries the direction through to `x < -25/4`, where the sign turns over
     * because the `x` term ends up negative. That turn is the third mark.
     *
     * This was `pick(['\\lt', '\\gt'])`, so 143 draws of 300 asked under this
     * paper's name a question no paper sets. The owner, on the 2023 P1 sheet:
     * *"Yes pin it and ensure it only affects this papers question"* — and it
     * does: nothing else cites `inequalities.fractions`, as the note below
     * the return records.
     *
     * `outRel` still flips when the coefficient comes out negative, so the
     * ANSWER is a less-than as often as the algebra demands. Only the
     * question's own operator is fixed.
     */
    const rel = '\\gt';
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
    // The question always asks with `>` (see `rel` above), so the answer turns
    // over exactly when the `x` coefficient comes out negative — which is the
    // paper's third mark, and happens in about 95% of draws.
    const outRel = A < 0 ? '\\lt' : '\\gt';

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
  'Changing the Subject': (w, a) => subjectInNumerator(w, a),
  'Changing the Subject with Roots': (w, a) => subjectWithRoot(w, a),
  // Wrapped, not bare. Dispatch now hands the routine the variation id the
  // caller asked for, and a bare reference would take that string as
  // `bracketOnly` - which is truthy. frozen caught it on 2023 P2 Q7 and
  // 2025 P2 Q9 the moment the argument was introduced.
  // 2014 P2 Q11 leaves before the shared routine draws anything, so the
  // stream 2023 P2 Q7 and 2025 P2 Q9 read is untouched.
  'Changing the Subject with a Fractional Coefficient': (w, a) =>
    a === SUVAT_2014 ? subjectSuvat2014() : subjectFractionCoefficient(false, w),
  // 2019 P1 Q7 - its own loop, so its denominator can run 2 to 30 without
  // moving 2023 P2 Q7 or 2025 P2 Q9, which share the other one.
  'Changing the Subject Inside a Bracket': (w) => subjectFractionCoefficient(true, w),
  'Solving Inequalities': (w, a) => inequalityBrackets(w, a),
  'Inequalities with Fractions': inequalityFractions,
};
