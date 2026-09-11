import { GeneratedQuestion } from './types';
import { getRandomInt, gcd, simplifyFraction } from './utils';
import { SURD_GENERATORS } from './n5-surds';
import { INDICES_GENERATORS } from './n5-indices';
import { PERCENTAGE_GENERATORS } from './n5-percentages';
import { EXPANDING_GENERATORS } from './n5-expanding';
import { FACTORISING_GENERATORS } from './n5-factorising';
import { QUADRATIC_GENERATORS } from './n5-quadratics';
import { SUM_CONTEXTS } from './n5-contexts';
import { ALG_FRACTION_GENERATORS } from './n5-alg-fractions';
import { FORMULA_GENERATORS } from './n5-formulae';
import { SIMEQ_GENERATORS } from './n5-simeq';
import { FUNCTION_GENERATORS } from './n5-functions';
import { DATA_GENERATORS } from './n5-data';
import { TRIG_GENERATORS } from './n5-trig';
import { VECTOR_GENERATORS } from './n5-vectors';
import { SCINOT_GENERATORS } from './n5-scinot';
import { PYTHAGORAS_GENERATORS } from './n5-pythagoras';
import { TRIG_DIAGRAM_GENERATORS } from './n5-trig-diagram';
import { BEARINGS_GENERATORS } from './n5-bearings';
import { COMPOSITE_TRIG_GENERATORS } from './n5-composite-trig';
import { SECTOR_GENERATORS } from './n5-sector';
import { VOLUME_GENERATORS } from './n5-volume';
import { FORM_EQUATION_GENERATORS } from './n5-form-equation';
import { VECTOR_PATHWAY_GENERATORS } from './n5-vector-pathway';
import { COORDS_3D_GENERATORS } from './n5-coordinates-3d';
import { PARABOLA_GRAPH_GENERATORS } from './n5-parabola-graph';
import { LINE_GRAPH_GENERATORS } from './n5-line-graph';
import { SKETCH_PARABOLA_GENERATORS } from './n5-sketch-parabola';
import { TRIG_GRAPH_GENERATORS } from './n5-trig-graph';
import { QUADRATIC_CONTEXT_GENERATORS } from './n5-quadratic-context';
import { ANGLE_GENERATORS } from './n5-angles';
import { TANGENT_GENERATORS } from './n5-tangent';
import { SIMILARITY_GENERATORS } from './n5-similarity';
import { TRIANGLE_TRIG_GENERATORS } from './n5-triangle-trig';
import { ROUNDING_GENERATORS } from './n5-rounding';
import { MEASURE_GENERATORS } from './n5-measure';
import { LINEAR_EQUATION_GENERATORS } from './n5-linear-equations';

/**
 * National 5 question generation.
 *
 * Built on two axes, because the generator serves two jobs:
 *
 *   the skill axis   from the Zeta Maths checklist and the course specification
 *                    — every skill a pupil is taught and drilled, whether or not
 *                    the exam ever asks it on its own
 *   the shape axis   from the past papers — the forms the exam actually uses,
 *                    with the marks and working taken from the markschemes
 *
 * Neither is a subset of the other. Zeta separates "Add and Subtract Fractions"
 * (2/3 + 4/5) from "Add and Subtract Mixed Numbers" (2 2/3 + 3 4/5), and a
 * starter for a weaker class wants the first. The papers ask brackets and word
 * problems that no skill list mentions.
 */

// ── exact fractions ────────────────────────────────────────────────────────

interface Frac { n: number; d: number; }

const improper = (whole: number, num: number, den: number): Frac =>
  ({ n: whole * den + num, d: den });

/**
 * The common denominator to show in the working — the lowest, not the product.
 * Adding 19/8 + 9/4 over 32 is valid but clumsy, and the markscheme's first mark
 * is "identify common denominator", so the working should model a sensible one.
 */
const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

const mulF = (a: Frac, b: Frac): Frac => ({ n: a.n * b.n, d: a.d * b.d });
const divF = (a: Frac, b: Frac): Frac => ({ n: a.n * b.d, d: a.d * b.n });
const addF = (a: Frac, b: Frac): Frac => ({ n: a.n * b.d + b.n * a.d, d: a.d * b.d });
const subF = (a: Frac, b: Frac): Frac => ({ n: a.n * b.d - b.n * a.d, d: a.d * b.d });

/** LaTeX for a value, written as a mixed number when top-heavy. */
function mixed(f: Frac): string {
  const { num, den } = simplifyFraction(f.n, f.d);
  if (den === 1) return `${num}`;
  if (Math.abs(num) < den) return `\\frac{${num}}{${den}}`;
  const whole = Math.trunc(num / den);
  const rest = Math.abs(num % den);
  return rest === 0 ? `${whole}` : `${whole}\\frac{${rest}}{${den}}`;
}

const topHeavy = (f: Frac): string => `\\frac{${f.n}}{${f.d}}`;

/** Scaled to a given denominator, for the common-denominator step. */
const over = (f: Frac, d: number): string => `\\frac{${f.n * (d / f.d)}}{${d}}`;

/**
 * Does this still need simplifying?
 *
 * **This does not apply to the add and subtract clones, and believing it did
 * was a real fault.** 2023 P1 Q1, whose note says the final mark "is only
 * available where simplifying is required", is a *division* — as are the other
 * questions that ask for simplest form. The add and subtract questions ask no
 * such thing: 2024 P1 Q1 pays its second mark for a "consistent answer" and
 * takes 29/12 or 2 5/12 alike. Generalising the divide note to "every N5
 * fractions question" forced non-coprime denominators on every clone, because a
 * coprime pair can never produce an answer that needs simplifying.
 *
 * So it holds for multiply, divide and the bracket questions, where the papers
 * do ask, and for the plain-fraction warm-ups, where it is a teaching choice
 * about what the drill practises rather than a markscheme obligation.
 */
const needsSimplifying = (f: Frac): boolean => gcd(f.n, f.d) > 1;

/**
 * A term to print in a question. Always already in simplest form — no exam
 * prints $\frac{2}{8}$, and doing so is an instant tell that a machine wrote it.
 */
interface Term { w: number; n: number; d: number; }

function properTerm(maxDen = 9): Term {
  for (;;) {
    const d = getRandomInt(2, maxDen);
    const n = getRandomInt(1, d - 1);
    if (gcd(n, d) === 1) return { w: 0, n, d };
  }
}

const mixedTerm = (minW: number, maxW: number, maxDen = 9): Term =>
  ({ ...properTerm(maxDen), w: getRandomInt(minW, maxW) });

const value = (t: Term): Frac => improper(t.w, t.n, t.d);
const show = (t: Term): string =>
  t.w ? `${t.w}\\frac{${t.n}}{${t.d}}` : `\\frac{${t.n}}{${t.d}}`;

type Q = Omit<GeneratedQuestion, 'topic'>;
const SIMPLEST = 'Give your answer in its simplest form.';

// ── the four operations, over plain fractions or mixed numbers ─────────────
//
// Zeta lists these as separate skills, and they are: a pupil meets 2/3 + 4/5
// long before 2 2/3 + 3 4/5.

type Op = 'add' | 'subtract' | 'multiply' | 'divide';

const SYMBOL: Record<Op, string> = {
  add: '+', subtract: '-', multiply: '\\times', divide: '\\div',
};

const COMBINE: Record<Op, (a: Frac, b: Frac) => Frac> = {
  add: addF, subtract: subF, multiply: mulF, divide: divF,
};

interface OpOpts {
  op: Op;
  /**
   * The heaviest denominator this variation's answer may print.
   *
   * Per variation rather than global, because `operation` serves eight of
   * them and only one was measured as too heavy. A drill that adds two
   * proper fractions cannot reach a big denominator anyway.
   */
  maxDen?: number;
  /** Mixed numbers, or plain proper fractions. */
  useMixed: boolean;
  subTopic: string;
  variationId: string;
  /**
   * What each step is worth, when this variation is grounded in a paper
   * question. Every fraction question in the papers is two marks with the same
   * split — start the calculation correctly, then a consistent answer — and the
   * two steps below are written to be exactly that. Not "in simplest form":
   * that is asked by the multiply, divide and bracket questions and by none of
   * the adds or subtracts.
   *
   * The plain-fraction drills have no paper behind them, so they carry nothing:
   * a mark split with no markscheme under it is the invention this whole
   * exercise exists to stop.
   */
  stepMarks?: number[];
}

/**
 * Adding and subtracting *proper* fractions needs twelfths to have a question
 * space at all.
 *
 * The `needsSimplifying` filter below asks that the answer still need
 * simplifying as the pupil reaches it, over the lowest common denominator. That
 * is a hard constraint: the numerator over the LCM has to share a factor with
 * it, and enumerating the whole space shows how hard. Capped at ninths there
 * are **four** subtraction questions and four additions in total — every one of
 * them with denominators from {2, 3, 6}, because 6 is the only LCM those
 * denominators can produce that ever admits a reducible result. A teacher
 * asking for six of one on a homework cannot have six different ones.
 *
 * Twelfths are where it opens up — ¼ + 1/12 = 3/12 + 1/12 = 4/12 needs
 * simplifying, and nothing at or below ninths does the equivalent. It takes
 * subtraction from 4 to 36 and addition from 4 to 36, and it changes nothing
 * about what the drill teaches: **every answer still needs simplifying**, so
 * "give your answer in its simplest form" stays true of every question.
 *
 * Only these two. `fractions.add` and `fractions.subtract` are warm-ups citing
 * no paper, so no markscheme binds their numbers. The mixed-number versions
 * clone real paper questions and keep the papers' own scale — and they are not
 * thin, because the whole-number part multiplies their space out. Multiplying
 * and dividing keep it too: they have no LCM step, so the filter never squeezed
 * them.
 */
const PROPER_DEN = (op: string) => (op === 'add' || op === 'subtract' ? 12 : 9);

/**
 * Which of these are clones of a paper add/subtract, and so must be coprime.
 *
 * The mixed-number add and subtract, and nothing else. Multiplying and dividing
 * have no common-denominator step, and the papers deliberately go the other way
 * there — 5/12 x 2 2/9, 1 5/6 ÷ 3/4, 2 1/6 ÷ 8/9 — because non-coprime is what
 * gives a pupil something to cancel. The plain proper-fraction versions are
 * warm-ups citing no paper.
 */
const COPRIME_REQUIRED = (op: string, useMixed: boolean) =>
  useMixed && (op === 'add' || op === 'subtract');

/**
 * The largest common denominator the papers ever make a pupil work with.
 *
 * Their add and subtract pairs are (5,3), (3,5), (3,4), (4,3), (3,7), (5,4) —
 * common denominators of 15, 15, 12, 12, 21, 20. Coprime denominators multiply,
 * so without a cap 7 and 9 come up and the pupil is asked for 306/63 - 175/63
 * without a calculator, which is not a National 5 question. 21 is the papers'
 * own ceiling and there are eight coprime pairs at or under it.
 */
export const MAX_COMMON = 21;

/**
 * How heavy a denominator a fraction ANSWER may print, per variation.
 *
 * Chosen by the user on 2026-09-10 from a priced table, and anchored to the
 * cited papers' own answers: 2023 P1 Q1 and 2017 P1 Q3 answer 2 7/16 and
 * 2 4/9, and 2016 P1 Q2 and 2022 P1 Q1 answer 13/28 and 19/30.
 *
 * Separate from `MAX_COMMON`, which caps the *common denominator reached
 * while working* on an add or subtract. This caps what the answer prints,
 * which for a multiply or divide is a different number entirely - the
 * product of the two denominators rather than their lowest common multiple.
 * Reusing MAX_COMMON here would have capped the wrong quantity.
 */
const MAX_DIVIDE_MIXED_DEN = 20;
const MAX_BRACKET_DEN = 40;

function operation({ op, useMixed, subTopic, variationId, stepMarks, maxDen }: OpOpts): Q {
  for (let tries = 0; tries < 1200; tries++) {
    const x = useMixed ? mixedTerm(op === 'subtract' ? 2 : 1, 5) : properTerm(PROPER_DEN(op));
    const y = useMixed ? mixedTerm(1, op === 'add' || op === 'subtract' ? 3 : 2) : properTerm(PROPER_DEN(op));

    // add and subtract need different denominators, or there is no skill in it
    if ((op === 'add' || op === 'subtract') && x.d === y.d) continue;

    // Multiplying or dividing a fraction by ITSELF is correct and is not a
    // question. 1/2 ÷ 1/2 = 1 practises nothing and answers the drill's own
    // "give your answer in its simplest form" with a whole number; it was
    // **16.0%** of `fractions.divide`. Add and subtract are already covered by
    // the line above, which is stricter - it separates the denominators.
    //
    // Compare the WHOLE term, not the fractional part. Comparing `\frac` tokens
    // alone is what made 1 1/2 ÷ 2 1/2 look like a question divided by itself
    // and produced a 13.0% finding that had to be withdrawn.
    if ((op === 'multiply' || op === 'divide')
        && x.w === y.w && x.n === y.n && x.d === y.d) continue;

    // The exam clones scale BOTH fractions, because the exam always does.
    //
    // Every add or subtract the papers set has coprime denominators — 3 and 5,
    // 5 and 3, 3 and 4, 4 and 3, 3 and 7, 5 and 4, six for six. With 3 and 6
    // the common denominator is 6, only one fraction moves, and the question is
    // a materially easier one the exam never asks.
    //
    // It was producing that one 100% of the time, and `needsSimplifying` below
    // is why. Those two constraints cannot both hold: if gcd(d1, d2) = 1 then
    // gcd(n1·d2 ± n2·d1, d1·d2) = 1 always — each of d1 and d2 is coprime to
    // every part of that numerator it does not divide — so **a coprime pair can
    // never produce an answer that needs simplifying**. Requiring simplifying
    // therefore forced non-coprime denominators. Not usually; necessarily.
    if (COPRIME_REQUIRED(op, useMixed)
        && (gcd(x.d, y.d) !== 1 || lcm(x.d, y.d) > MAX_COMMON)) continue;

    const a = value(x), b = value(y);
    const r = COMBINE[op](a, b);
    if (r.n <= 0) continue;                       // no N5 question wants a negative
    if (r.n > (useMixed ? 300 : 120)) continue;   // hold to the scale the papers use

    // Does it need simplifying *as the pupil arrives at it*?
    //
    // Not as the raw product. Adding over the lowest common denominator,
    // 3/4 - 1/2 becomes 3/4 - 2/4 = 1/4 — already simplest, so the working would
    // end with the tautology 1/4 = 1/4. Testing the product form 2/8 instead
    // wrongly passed those.
    //
    // This rule does NOT come from the markscheme, and the belief that it did
    // was the fault above. 2024 P1 Q1 pays •¹ for "identify common denominator"
    // and •² for a "consistent answer", accepting 2 5/12 or 29/12 either way;
    // 2015, 2018 and 2024 all add a note not to penalise the mixed-number
    // conversion. Their answers — 58/15, 47/15, 29/12 — are all in lowest terms
    // already. Nothing there asks for simplifying.
    //
    // So it is kept for the *warm-ups*, where it is a teaching choice about
    // what the drill practises, and dropped for the clones, where it was
    // contradicting the papers.
    const asReached: Frac = (op === 'add' || op === 'subtract')
      ? { n: r.n / (r.d / lcm(x.d, y.d)), d: lcm(x.d, y.d) }
      : r;
    if (!COPRIME_REQUIRED(op, useMixed) && !needsSimplifying(asReached)) continue;

    // The clones still need a second step that does something.
    //
    // Dropping `needsSimplifying` above brought the tautology back in a new
    // shape rather than removing it: 3⅓ - 2½ = 5/6, and with nothing to
    // simplify and nothing to convert, step 2 read "5/6 = 5/6". The papers'
    // answers are 58/15, 47/15, 29/12 and 53/12 — every one top-heavy, every
    // one converting to a mixed number. That is what the step shows, so that is
    // what the question has to produce.
    if (COPRIME_REQUIRED(op, useMixed) && r.n <= r.d) continue;
    // The PRINTED denominator, not the raw one. `mulF` and `divF` do no
    // reducing and `mixed()` reduces on the way out, so `r.d` is always the
    // bigger number - and for these two variations it has to be, since the
    // question exists to be simplified. Capping the raw value rejected
    // questions that print small: it took the divide-mixed pool from 492 to
    // 127 where the pricing said 380. A cap that reads part of a value lies
    // about the whole, exactly as a detector does.
    if (maxDen && simplifyFraction(r.n, r.d).den > maxDen) continue;

    const steps: string[] = [];
    if (op === 'add' || op === 'subtract') {
      const common = lcm(x.d, y.d);
      const word = op === 'add' ? 'Add' : 'Subtract';
      steps.push(
        useMixed
          ? `<strong>1.</strong> Write as improper fractions with a common denominator of $${common}$:<br><br>$${topHeavy(a)} ${SYMBOL[op]} ${topHeavy(b)} = ${over(a, common)} ${SYMBOL[op]} ${over(b, common)}$`
          : `<strong>1.</strong> Use a common denominator of $${common}$:<br><br>$${show(x)} ${SYMBOL[op]} ${show(y)} = ${over(a, common)} ${SYMBOL[op]} ${over(b, common)}$`,
        // The second mark is "consistent answer", and 29/12 earns it as surely
        // as 2 5/12 does — the scheme says so in as many words. So the step
        // completes the calculation and writes it as a mixed number; it does
        // not claim to be simplifying, which for a coprime pair it never is.
        COPRIME_REQUIRED(op, useMixed)
          ? `<strong>2.</strong> ${word}, then write the answer as a mixed number:<br><br>$\\frac{${r.n / (r.d / common)}}{${common}} = ${mixed(r)}$`
          : `<strong>2.</strong> ${word} and simplify:<br><br>$\\frac{${r.n / (r.d / common)}}{${common}} = ${mixed(r)}$`,
      );
    } else if (op === 'multiply') {
      steps.push(
        useMixed
          ? `<strong>1.</strong> Write as improper fractions and multiply:<br><br>$${topHeavy(a)} \\times ${topHeavy(b)} = ${topHeavy(r)}$`
          : `<strong>1.</strong> Multiply the numerators and the denominators:<br><br>$${show(x)} \\times ${show(y)} = ${topHeavy(r)}$`,
        `<strong>2.</strong> Simplify:<br><br>$${topHeavy(r)} = ${mixed(r)}$`,
      );
    } else {
      steps.push(
        `<strong>1.</strong> ${useMixed ? 'Write as improper fractions, then multiply' : 'Multiply'} by the reciprocal:<br><br>$${topHeavy(a)} \\div ${topHeavy(b)} = ${topHeavy(a)} \\times \\frac{${b.d}}{${b.n}}$`,
        `<strong>2.</strong> Multiply and simplify:<br><br>$${topHeavy(r)} = ${mixed(r)}$`,
      );
    }

    return {
      subTopic,
      difficulty: 'skill',
      variationId,
      // "Give your answer in its simplest form" only where the papers ask it,
      // and they split cleanly: every multiply, divide and bracket question
      // asks (2014, 2016, 2017, 2019, 2022, 2023, 2025) and not one add or
      // subtract does (2015, 2018, 2024 all say just "Evaluate"). Which follows
      // from the same fact — a coprime add cannot simplify, so asking for
      // simplest form would be asking for nothing.
      questionLines: COPRIME_REQUIRED(op, useMixed)
        ? [`Evaluate $${show(x)} ${SYMBOL[op]} ${show(y)}$`]
        : [`Evaluate $${show(x)} ${SYMBOL[op]} ${show(y)}$`, SIMPLEST],
      boardQuestionLines: [`$${show(x)} ${SYMBOL[op]} ${show(y)}$`],
      solutionSteps: steps,
      stepMarks,
      finalAnswer: `$${mixed(r)}$`,
    };
  }
  throw new Error(`${variationId}: no valid question found`);
}

// ── exam shapes ────────────────────────────────────────────────────────────

/**
 * 2016 P1 Q2: ¾(⅓ + 2/7) and 2022 P1 Q1: ⅔(⅕ + ¾). Two operations.
 *
 * Two marks, not three, and that is the whole reason the multiply and the
 * simplify share a step: the scheme gives •¹ for starting the calculation
 * correctly — the bracket over a common denominator — and •² for a consistent
 * answer in simplest form. Nothing in between is worth a mark, so a third step
 * would hand a pupil a hint the exam does not pay for and, worse, leave the
 * last hint stating the answer.
 */
function brackets(): Q {
  const mixedInside = getRandomInt(1, 4) === 1;
  for (let tries = 0; tries < 1200; tries++) {
    const out = properTerm(7), p = properTerm(7);
    const q = mixedInside ? mixedTerm(1, 2, 5) : properTerm(7);
    if (p.d === q.d) continue;
    // The bracket is an addition, so its two denominators are coprime like
    // every other addition the papers set: 2016 P1 Q2 is ⅓ + 2/7 and 2022 P1 Q1
    // is ⅕ + ¾. This was already coprime 71% of the time — the simplifying here
    // comes from multiplying by the term outside, not from the sum, so nothing
    // forced it either way. The remaining 29% were still the wrong question.
    if (gcd(p.d, q.d) !== 1 || lcm(p.d, q.d) > MAX_COMMON) continue;
    const inner = addF(value(p), value(q));
    const r = mulF(value(out), inner);
    if (r.n > 400 || !needsSimplifying(r)) continue;
    // 2016 P1 Q2 answers 13/28 and 2022 P1 Q1 answers 19/30; this reached 70.
    // The PRINTED denominator: `needsSimplifying(r)` just above guarantees
    // `r.d` is not it.
    if (simplifyFraction(r.n, r.d).den > MAX_BRACKET_DEN) continue;
    return {
      subTopic: 'Fractions with Brackets',
      difficulty: 'exam',
      variationId: 'fractions.brackets',
      questionLines: [
        `Evaluate $${show(out)}\\left(${show(p)} + ${show(q)}\\right)$`, SIMPLEST,
      ],
      boardQuestionLines: [`$${show(out)}\\left(${show(p)} + ${show(q)}\\right)$`],
      solutionSteps: [
        `<strong>1.</strong> Work out the bracket first, using a common denominator of $${lcm(p.d, q.d)}$:<br><br>$${topHeavy(value(p))} + ${topHeavy(value(q))} = ${topHeavy(inner)}$`,
        `<strong>2.</strong> Multiply by $${show(out)}$ and simplify:<br><br>$${show(out)} \\times ${topHeavy(inner)} = ${topHeavy(r)} = ${mixed(r)}$`,
      ],
      stepMarks: [1, 1],
      finalAnswer: `$${mixed(r)}$`,
    };
  }
  throw new Error('brackets: no valid question found');
}

/** Practice: 4½ − 1⅔ + 2¼. The specification allows "combinations of operations". */
function threeTerm(): Q {
  for (let tries = 0; tries < 2000; tries++) {
    const x = mixedTerm(3, 6, 6), y = mixedTerm(1, 2, 6), z = mixedTerm(1, 3, 6);
    if (x.d === y.d && y.d === z.d) continue;
    const a = value(x), b = value(y), c = value(z);
    const r = addF(subF(a, b), c);
    if (r.n <= 0 || !needsSimplifying(r)) continue;
    if (x.d * y.d * z.d > 200) continue;
    return {
      subTopic: 'Three-Term Fractions',
      difficulty: 'exam',
      variationId: 'fractions.three-term',
      questionLines: [`Evaluate $${show(x)} - ${show(y)} + ${show(z)}$`, SIMPLEST],
      boardQuestionLines: [`$${show(x)} - ${show(y)} + ${show(z)}$`],
      solutionSteps: [
        `<strong>1.</strong> Write each as an improper fraction:<br><br>$${topHeavy(a)} - ${topHeavy(b)} + ${topHeavy(c)}$`,
        `<strong>2.</strong> Work left to right:<br><br>$${topHeavy(subF(a, b))} + ${topHeavy(c)}$`,
        `<strong>3.</strong> Simplify:<br><br>$${topHeavy(r)} = ${mixed(r)}$`,
      ],
      finalAnswer: `$${mixed(r)}$`,
    };
  }
  throw new Error('threeTerm: no valid question found');
}

/** 2026 P1 Q5: Sam walked 2¾ miles then 1⅔ miles. The answer carries its units. */

function inContext(): Q {
  for (let tries = 0; tries < 1200; tries++) {
    const x = mixedTerm(1, 4), y = mixedTerm(1, 3);
    if (x.d === y.d) continue;
    // Coprime, like every add the papers set — 2026 P1 Q5 is 2¾ + 1⅔, and
    // 4 and 3 are coprime. This carried the same `needsSimplifying` filter as
    // the drills and so produced the scale-one-fraction question 100% of the
    // time; see `operation` for why those two constraints cannot both hold.
    if (gcd(x.d, y.d) !== 1 || lcm(x.d, y.d) > MAX_COMMON) continue;
    const a = value(x), b = value(y);
    const r = addF(a, b);
    const ctx = SUM_CONTEXTS[getRandomInt(0, SUM_CONTEXTS.length - 1)];
    const common = lcm(x.d, y.d);
    return {
      subTopic: 'Fractions in Context',
      difficulty: 'exam',
      variationId: 'fractions.context',
      questionLines: [ctx.setup(`$${show(x)}$`, `$${show(y)}$`), ctx.ask],
      boardQuestionLines: [`${ctx.setup(`$${show(x)}$`, `$${show(y)}$`)} ${ctx.ask}`],
      solutionSteps: [
        `<strong>1.</strong> Add the two amounts, using a common denominator of $${common}$:<br><br>$${topHeavy(a)} + ${topHeavy(b)} = ${over(a, common)} + ${over(b, common)}$`,
        `<strong>2.</strong> Complete the addition and state the answer with its units:<br><br>$\\frac{${r.n / (r.d / common)}}{${common}} = ${mixed(r)}$ ${ctx.unit}`,
      ],
      // 2026 P1 Q5 is two marks and has no published scheme. Every mixed-number
      // addition in the transcribed years splits the same way — start the
      // addition, then complete it in simplest form — so that is what the two
      // are taken to be, flagged as inferred in the registry.
      stepMarks: [1, 1],
      finalAnswer: `$${mixed(r)}$ ${ctx.unit}`,
    };
  }
  throw new Error('inContext: no valid question found');
}

// ── dispatch ───────────────────────────────────────────────────────────────

const N5_GENERATORS: Record<string, () => Q> = {
  // the skill axis — Zeta's breakdown
  // Adding and subtracting are separate topics, not one topic that picks at
  // random: a starter on subtraction is a thing a teacher asks for, and while
  // they shared a name it could not be had. The papers separate too — 2018 P1
  // Q1 is an addition and 2024 P1 Q1 a subtraction — so each half cites its own.
  'Adding Fractions': () => operation({
    op: 'add', useMixed: false,
    subTopic: 'Adding Fractions', variationId: 'fractions.add',
  }),
  'Subtracting Fractions': () => operation({
    op: 'subtract', useMixed: false,
    subTopic: 'Subtracting Fractions', variationId: 'fractions.subtract',
  }),
  'Adding Mixed Numbers': () => operation({
    op: 'add', useMixed: true,
    subTopic: 'Adding Mixed Numbers', variationId: 'fractions.add-mixed',
    stepMarks: [1, 1],   // 2018 P1 Q1
  }),
  'Subtracting Mixed Numbers': () => operation({
    op: 'subtract', useMixed: true,
    subTopic: 'Subtracting Mixed Numbers', variationId: 'fractions.subtract-mixed',
    stepMarks: [1, 1],   // 2024 P1 Q1
  }),
  'Multiplying Fractions': () => operation({
    op: 'multiply', useMixed: false,
    subTopic: 'Multiplying Fractions', variationId: 'fractions.multiply',
  }),
  'Multiplying Mixed Numbers': () => operation({
    op: 'multiply', useMixed: true,
    subTopic: 'Multiplying Mixed Numbers', variationId: 'fractions.multiply-mixed',
    stepMarks: [1, 1],   // 2025 P1 Q1, 2014 P1 Q1, 2019 P1 Q2
  }),
  'Dividing Fractions': () => operation({
    op: 'divide', useMixed: false,
    subTopic: 'Dividing Fractions', variationId: 'fractions.divide',
  }),
  'Dividing Mixed Numbers': () => operation({
    op: 'divide', useMixed: true,
    subTopic: 'Dividing Mixed Numbers', variationId: 'fractions.divide-mixed',
    stepMarks: [1, 1],   // 2023 P1 Q1, 2017 P1 Q3
    maxDen: MAX_DIVIDE_MIXED_DEN,   // the papers answer 2 7/16 and 2 4/9
  }),
  // the shape axis — what the papers ask
  'Fractions with Brackets': brackets,
  'Three-Term Fractions': threeTerm,
  'Fractions in Context': inContext,
};

export function generateN5Question(selectedTopic: string): Q {
  const gen = N5_GENERATORS[selectedTopic]
    ?? SURD_GENERATORS[selectedTopic]
    ?? INDICES_GENERATORS[selectedTopic]
    ?? PERCENTAGE_GENERATORS[selectedTopic]
    ?? EXPANDING_GENERATORS[selectedTopic]
    ?? FACTORISING_GENERATORS[selectedTopic]
    ?? QUADRATIC_GENERATORS[selectedTopic]
    ?? ALG_FRACTION_GENERATORS[selectedTopic]
    ?? FORMULA_GENERATORS[selectedTopic]
    ?? SIMEQ_GENERATORS[selectedTopic]
    ?? FUNCTION_GENERATORS[selectedTopic]
    ?? DATA_GENERATORS[selectedTopic]
    ?? TRIG_GENERATORS[selectedTopic]
    ?? VECTOR_GENERATORS[selectedTopic]
    ?? SCINOT_GENERATORS[selectedTopic]
    ?? PYTHAGORAS_GENERATORS[selectedTopic]
    ?? TRIG_DIAGRAM_GENERATORS[selectedTopic]
    ?? BEARINGS_GENERATORS[selectedTopic]
    ?? COMPOSITE_TRIG_GENERATORS[selectedTopic]
    ?? SECTOR_GENERATORS[selectedTopic]
    ?? ANGLE_GENERATORS[selectedTopic]
    ?? TANGENT_GENERATORS[selectedTopic]
    ?? SIMILARITY_GENERATORS[selectedTopic]
    ?? TRIANGLE_TRIG_GENERATORS[selectedTopic]
    ?? ROUNDING_GENERATORS[selectedTopic]
    ?? MEASURE_GENERATORS[selectedTopic]
    ?? VOLUME_GENERATORS[selectedTopic]
    ?? FORM_EQUATION_GENERATORS[selectedTopic]
    ?? VECTOR_PATHWAY_GENERATORS[selectedTopic]
    ?? COORDS_3D_GENERATORS[selectedTopic]
    ?? PARABOLA_GRAPH_GENERATORS[selectedTopic]
    ?? LINE_GRAPH_GENERATORS[selectedTopic]
    ?? SKETCH_PARABOLA_GENERATORS[selectedTopic]
    ?? TRIG_GRAPH_GENERATORS[selectedTopic]
    ?? QUADRATIC_CONTEXT_GENERATORS[selectedTopic]
    ?? LINEAR_EQUATION_GENERATORS[selectedTopic];
  if (!gen) throw new Error(`No National 5 generator for topic "${selectedTopic}"`);
  return gen();
}
