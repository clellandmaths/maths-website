import type { Difficulty, Topic } from './types';

/**
 * The National 5 variation registry.
 *
 * One table doing four jobs, which is why it is worth keeping in step by hand:
 *
 *   basedOn      "generate more questions like this past paper one" — a reverse
 *                lookup from a paper question to the variations modelled on it
 *   difficulty   composing a sheet that builds from skill to exam level
 *   answerShape  the property checks assert the final answer matches
 *   the key      the "target variation" column of docs/n5-gap-table.md
 *
 * `basedOn` uses the paper label — "2023 P1 Q1" — because that identifier
 * already exists in three places and needs no new plumbing: the app writes it
 * into each question's white-space:nowrap badge, the practice data references
 * questions by it, and lib/practice-loader.ts already parses it.
 *
 * It records what a variation was *modelled on*, not a promise of equivalence.
 * A variation drawn from several questions is a blend.
 */

/** What "a clean answer" means for a variation, asserted by the property checks. */
export type AnswerShape =
  | 'integer'
  | 'fraction'        // a fraction or mixed number, never a decimal
  | 'surd'
  | 'money'           // 2 decimal places
  | 'rounded'         // rounded as the question instructs
  | 'expression'      // algebraic, not a number
  | 'text';           // a stated conclusion

/**
 * How the question was built. Stated rather than inferred — the Higher files
 * leave a reader guessing, and one of them silently changed strategy halfway
 * through without the comment being updated.
 */
export type Strategy =
  /** Pick inputs, reject degenerate cases, compute in exact rationals. */
  | 'input-first'
  /** Pick the answer, build the question backwards from it. */
  | 'answer-first'
  /** Choose from a hand-listed set of known-good parameters. */
  | 'curated-pool';

/**
 * Which list this variation came from.
 *
 * The generator serves two jobs, and the sources serve them differently: Zeta
 * and the specification give the skills a pupil is drilled on, the papers give
 * the shapes the exam asks. Recording it means coverage can be checked against
 * each list separately.
 */
export type Source = 'spec' | 'zeta' | 'paper' | 'practice'
  | 'zeta+paper' | 'zeta+practice';

/**
 * `source` says where a variation came from, and the three do different jobs.
 *
 *   'paper'    a past paper question, cloned with its marking instructions.
 *              The papers decide coverage of the exam tier: all of them.
 *   'zeta'     the checklist of named skills the notes teach.
 *   'practice' the practice bank, used only as a cross-check on the skill tier
 *              — a kind of question the notes did not show. Its own past-paper
 *              references are ignored, because those questions are already
 *              being cloned from the papers themselves at exam level.
 *
 * There is no 'applied' difficulty. See docs/PLAN.md.
 */
export interface VariationMeta {
  topic: Topic;
  /**
   * The tier, and it follows `basedOn` and nothing else.
   *
   * `exam` means a past paper question stands behind this; `skill` means none
   * does. It used to track question *length* instead, which is a different line
   * entirely: 33 variations cloning real paper questions were tagged `skill`
   * because they were short, and one drawn from the practice bank was tagged
   * `exam` because it was long. `tiers.ts` reads it; `generateQuestion` copies
   * it onto every question it produces.
   */
  difficulty: Difficulty;
  strategy: Strategy;
  source: Source;
  /** Paper labels this was modelled on. Empty for a warm-up. */
  basedOn: string[];
  answerShape: AnswerShape;
  /** One line on what the pupil is being asked to do. */
  skill: string;
  /**
   * Where this files on the website, in the website's own spelling.
   *
   * The website has 57 subtopics; this generator has 210 topic names; they
   * share exactly one string between them. That is deliberate on both sides.
   * The generator's name is *the skill you ask for* — "Adding Mixed Numbers" —
   * and the website's is *where it files* — "Fractions and mixed numbers".
   * Collapsing 210 into 57 would destroy per-skill selection; renaming the 57
   * would break every past paper question already tagged. So the generator
   * carries both, and this is the second one.
   *
   * **The website's taxonomy is fixed and is not ours to change.** It is closed
   * and well kept — 57 declared, 57 used, no orphan either way, every question
   * tagged — and every topic page on the site filters by it.
   *
   * For a variation citing papers this is **derived, not judged**: the
   * subtopics common to every question it cites. Intersection rather than
   * union, because a union inherits one paper's incidental second topic and
   * files the variation somewhere it does not teach. All 194 citing variations
   * derive at least one tag, so there is no judgement call in that half at all,
   * and `webtopics.ts` re-derives and compares — change a citation and the tag
   * has to move with it.
   *
   * More than one tag is normal and 40 have it: the website multi-tags 58 of
   * its own questions and matches on any of them.
   *
   * **Five carry `[]`, and that is a finding rather than a gap.** The website's
   * taxonomy comes from what the exam tests, so a warm-up with nowhere to file
   * is one the exam never sets on its own: the three `rounding.*` (there is no
   * rounding subtopic at all), `pythagoras.find-side` (the site has *in 3d*,
   * *in circle diagrams* and *converse*, but not a plain right-angled
   * triangle), and `percentages.change` (the site has *Appreciation and
   * Depreciation*, which is compound growth over years, and *Reversing a
   * percentage change* — neither is "what percentage change is this"). Forcing
   * them into a near-miss subtopic would put questions on a topic page where
   * they do not belong, which is the one outcome that damages the site's
   * taxonomy. They stay reachable from the generator's own skill list.
   *
   * An empty list is allowed **only** where `basedOn` is empty, and the check
   * enforces that.
   */
  webTopics: string[];
  /**
   * What the paper question this was modelled on is worth.
   *
   * Taken from the marking instructions in `reference/N5_Markschemes`, which
   * cover 2014-2019 and 2022-2025 and give the skill each mark is for. The
   * marks are the one thing from a markscheme that can be carried in the open:
   * a count is not the copyright, and everything else stays reference-only.
   *
   * `marksInferred` says the split was reconstructed rather than read. 2026 has
   * no published markscheme, so a 2026 question's marks are our reading of the
   * pattern the other years set, and are to be corrected when the real one
   * appears rather than quietly kept as fact.
   */
  marks?: number;
  marksInferred?: true;
  /**
   * Citations worth a different total from `marks`, and what that total is.
   *
   * A variation clones a *shape*, and the exam sometimes sets the same shape
   * for different money: the converse of Pythagoras is four marks in four
   * papers and three in 2017, which merges the comparison with the conclusion.
   * That is a real thing to record, not a fault to hide.
   *
   * It used to be recorded in `route` prose, which nothing could check, and
   * `markschemes.ts` bought the quiet by only ever comparing a variation that
   * cited exactly one paper. Seven genuine disagreements sat inside that
   * exemption, and one of them - `inequalities.brackets` naming a 3D
   * coordinates question - was a citation with nothing to do with the
   * variation at all.
   *
   * So the difference is declared here with the source's own number, and the
   * check verifies the declaration too: get the number wrong and it fails just
   * as an undeclared difference does. Say *why* in `route`; this says what.
   */
  marksDiffer?: Record<string, number>;
  /**
   * The markscheme's own route, one line, as its marks are worded.
   *
   * `marks` proves the scheme was open. It cannot prove the working follows it,
   * and nothing else can either — only a person reading both. So the route is
   * written down at the moment it is read, which makes it something you can
   * spot-check against the scheme later instead of taking on trust.
   *
   * Where our working deliberately takes a different route, say so here. That
   * is allowed when the scheme names no required method, and it has happened
   * once: 2016 P2 Q5 closes with the isosceles triangle the two equal tangents
   * make and we close with the quadrilateral at the centre.
   */
  route?: string;
}

export const N5_VARIATIONS: Record<string, VariationMeta> = {
  // ── Fractions: the skill axis ───────────────────────────────────────────
  // Zeta's breakdown. Plain fractions and mixed numbers are separate skills —
  // a pupil meets 2/3 + 4/5 long before 2 2/3 + 3 4/5, and a starter for a
  // weaker class wants the first. `source` records which list each came from.
  'fractions.add': {
    topic: 'Adding Fractions',
    difficulty: 'skill',
    strategy: 'input-first',
    source: 'zeta',
    basedOn: [],
    answerShape: 'fraction',
    webTopics: ['Fractions and mixed numbers'],
    skill: 'Add two proper fractions using a common denominator',
  },
  'fractions.subtract': {
    topic: 'Subtracting Fractions',
    difficulty: 'skill',
    strategy: 'input-first',
    source: 'zeta',
    basedOn: [],
    answerShape: 'fraction',
    webTopics: ['Fractions and mixed numbers'],
    skill: 'Subtract two proper fractions using a common denominator',
  },
  'fractions.add-mixed': {
    topic: 'Adding Mixed Numbers',
    difficulty: 'exam',
    strategy: 'input-first',
    source: 'zeta+paper',
    basedOn: ['2018 P1 Q1'],
    marks: 2,
    route: 'identify a common denominator, then a consistent answer. The second mark is worded "consistent answer" and accepts the improper fraction as readily as the mixed number - 2024 P1 Q1 takes 29/12 or 2 5/12, and notes not to penalise the conversion. Nothing here asks for simplest form, and with coprime denominators nothing could',
    answerShape: 'fraction',
    webTopics: ['Fractions and mixed numbers'],
    skill: 'Add mixed numbers, or a mixed number and a fraction',
  },
  'fractions.subtract-mixed': {
    topic: 'Subtracting Mixed Numbers',
    difficulty: 'exam',
    strategy: 'input-first',
    source: 'zeta+paper',
    basedOn: ['2015 P1 Q1', '2024 P1 Q1'],
    marks: 2,
    route: 'identify a common denominator, then a consistent answer. The second mark is worded "consistent answer" and accepts the improper fraction as readily as the mixed number - 2024 P1 Q1 takes 29/12 or 2 5/12, and notes not to penalise the conversion. Nothing here asks for simplest form, and with coprime denominators nothing could',
    answerShape: 'fraction',
    webTopics: ['Fractions and mixed numbers'],
    skill: 'Subtract mixed numbers, or a fraction from a mixed number',
  },
  'fractions.multiply': {
    topic: 'Multiplying Fractions',
    difficulty: 'skill',
    strategy: 'input-first',
    source: 'zeta',
    basedOn: [],
    answerShape: 'fraction',
    webTopics: ['Fractions and mixed numbers'],
    skill: 'Multiply two proper fractions',
  },
  'fractions.multiply-mixed': {
    topic: 'Multiplying Mixed Numbers',
    difficulty: 'exam',
    strategy: 'input-first',
    source: 'zeta+paper',
    basedOn: ['2025 P1 Q1', '2014 P1 Q1', '2019 P1 Q2'],
    marks: 2,
    route: 'start to multiply the fractions, which means converting to improper fractions first, then a consistent answer in simplest form',
    answerShape: 'fraction',
    webTopics: ['Fractions and mixed numbers'],
    skill: 'Multiply a mixed number by a fraction or another mixed number',
  },
  'fractions.divide': {
    topic: 'Dividing Fractions',
    difficulty: 'skill',
    strategy: 'input-first',
    source: 'zeta',
    basedOn: [],
    answerShape: 'fraction',
    webTopics: ['Fractions and mixed numbers'],
    skill: 'Divide proper fractions by multiplying by the reciprocal',
  },
  'fractions.divide-mixed': {
    topic: 'Dividing Mixed Numbers',
    difficulty: 'exam',
    strategy: 'input-first',
    source: 'zeta+paper',
    basedOn: ['2023 P1 Q1', '2017 P1 Q3'],
    marks: 2,
    route: 'convert to improper fractions and multiply by the reciprocal, then a consistent answer in simplest form',
    answerShape: 'fraction',
    webTopics: ['Fractions and mixed numbers'],
    skill: 'Divide a mixed number by a fraction or a whole number',
  },

  // ── Fractions: the shape axis ───────────────────────────────────────────
  // What the papers actually ask. The specification warrants these under
  // "operations and combinations of operations on fractions".
  'fractions.brackets': {
    topic: 'Fractions with Brackets',
    difficulty: 'exam',
    strategy: 'input-first',
    source: 'paper',
    basedOn: ['2016 P1 Q2', '2022 P1 Q1'],
    marks: 2,
    route: 'start the calculation correctly, which is the bracket over a common denominator, then a consistent answer in simplest form. Both schemes accept a second method that multiplies out first; ours takes the bracket first',
    answerShape: 'fraction',
    webTopics: ['Fractions and mixed numbers'],
    skill: 'Evaluate the bracket first, then multiply - two operations',
  },
  'fractions.three-term': {
    topic: 'Three-Term Fractions',
    difficulty: 'skill',
    strategy: 'input-first',
    source: 'practice',
    basedOn: [],
    answerShape: 'fraction',
    webTopics: ['Fractions and mixed numbers'],
    skill: 'Work left to right through three terms with different denominators',
  },
  'fractions.context': {
    topic: 'Fractions in Context',
    difficulty: 'exam',
    strategy: 'input-first',
    source: 'paper',
    basedOn: ['2026 P1 Q5'],
    marks: 2, marksInferred: true,
    route: 'inferred, no published 2026 scheme: start the addition with a common denominator, then complete it and state the units. Every mixed-number addition in the transcribed years splits exactly this way, and none of them asks for simplest form',
    answerShape: 'fraction',
    webTopics: ['Fractions and mixed numbers'],
    skill: 'Read the operation from a worded situation and answer with units',
  },

  // ── Surds: the skill axis ───────────────────────────────────────────────
  'surds.simplify': {
    topic: 'Simplifying Surds',
    difficulty: 'skill',
    strategy: 'answer-first',
    source: 'zeta',
    basedOn: [],
    answerShape: 'surd',
    webTopics: ['Simplifying surds'],
    skill: 'Take out the largest square factor to simplify a surd',
  },
  'surds.add': {
    topic: 'Adding Surds',
    difficulty: 'skill',
    strategy: 'answer-first',
    source: 'zeta+paper',
    basedOn: [],
    answerShape: 'surd',
    webTopics: ['Simplifying surds'],
    skill: 'Simplify each surd to a common root, then add the coefficients',
  },
  'surds.subtract': {
    topic: 'Subtracting Surds',
    difficulty: 'exam',
    strategy: 'answer-first',
    source: 'zeta+paper',
    basedOn: ['2024 P1 Q6'],
    marks: 2,
    route: 'simplify the surds so they share a root, then complete the simplification by combining the coefficients',
    answerShape: 'surd',
    webTopics: ['Simplifying surds'],
    skill: 'Simplify each surd to a common root, then subtract the coefficients',
  },
  'surds.multiply': {
    topic: 'Multiplying Surds',
    difficulty: 'skill',
    strategy: 'input-first',
    source: 'zeta',
    basedOn: [],
    answerShape: 'surd',
    webTopics: ['Simplifying surds'],
    skill: 'Multiply under one root, then take out the largest square factor',
  },
  'surds.divide': {
    topic: 'Dividing Surds',
    difficulty: 'skill',
    strategy: 'input-first',
    source: 'zeta',
    basedOn: [],
    answerShape: 'surd',
    webTopics: ['Simplifying surds'],
    skill: 'Divide under one root, then take out the largest square factor',
  },
  'surds.rationalise': {
    topic: 'Rationalising the Denominator',
    difficulty: 'exam',
    strategy: 'input-first',
    source: 'zeta+paper',
    basedOn: ['2018 P1 Q11', '2023 P1 Q8', '2025 P1 Q12'],
    marks: 2,
    route: 'express as an equivalent fraction with a rational denominator, then express in simplest form. The second mark is only available where simplifying is required, which is why the generator rejects a numerator coprime to the radicand',
    answerShape: 'surd',
    webTopics: ['Rationalising the denominator'],
    skill: 'Multiply top and bottom by the root, then simplify',
  },

  // ── Surds: the shape axis ───────────────────────────────────────────────
  'surds.expand-bracket': {
    topic: 'Expanding Surd Brackets',
    difficulty: 'exam',
    strategy: 'answer-first',
    source: 'paper',
    basedOn: ['2022 P1 Q13'],
    marks: 3,
    route: 'expand the bracket, then express the surd in simplest form, then complete the simplification by collecting like surds',
    answerShape: 'surd',
    webTopics: ['Simplifying surds'],
    skill: 'Expand, simplify the resulting surd, then collect like surds',
  },
  'surds.in-function': {
    topic: 'Surds in a Function',
    difficulty: 'exam',
    strategy: 'input-first',
    source: 'paper',
    basedOn: ['2016 P1 Q9'],
    marks: 2,
    route: 'correct substitution into f(x), then a consistent answer with a rational denominator. This one does not simplify afterwards, which is why it is a separate shape from the plain rationalise',
    answerShape: 'surd',
    webTopics: ['Rationalising the denominator'],
    skill: 'Substitute into a function, then rationalise the denominator',
  },

  // Three surd shapes the skill drills cannot set, each three marks where the
  // drill next to it is two. In every case the extra mark is a second, distinct
  // manipulation rather than the same one done again.
  'surds.sum-three': {
    topic: 'A Sum of Three Surds',
    difficulty: 'exam',
    strategy: 'answer-first',
    source: 'paper',
    basedOn: ['2014 P1 Q8'],
    marks: 3,
    route: 'simplify the first surd, simplify the third, then state the answer in simplest form. The two simplifications are separate marks, which is what makes this three where surds.add is two',
    answerShape: 'surd',
    webTopics: ['Simplifying surds'],
    skill: 'Reduce three surds to a common root, then add the coefficients',
  },
  'surds.rationalise-simplify': {
    topic: 'Rationalising and Simplifying',
    difficulty: 'exam',
    strategy: 'input-first',
    source: 'paper',
    basedOn: ['2015 P1 Q13'],
    marks: 3,
    route: 'express as an equivalent fraction with a rational denominator, manipulate the surd, then a consistent answer - the scheme takes the first two in either order. surds.rationalise draws a square-free radicand and so can never set this one',
    answerShape: 'surd',
    webTopics: ['Rationalising the denominator'],
    skill: 'Rationalise a denominator whose surd is not yet in simplest form',
  },
  'surds.rationalise-quotient': {
    topic: 'Rationalising a Quotient of Surds',
    difficulty: 'exam',
    strategy: 'input-first',
    source: 'paper',
    basedOn: ['2019 P1 Q12'],
    marks: 3,
    route: 'a rational denominator, then the numerator in simplest form, then the whole fraction in simplest form. Ours is the scheme Method 1, multiplying through by the root rather than dividing under one root first',
    answerShape: 'surd',
    webTopics: ['Rationalising the denominator'],
    skill: 'Divide one surd by another and leave a rational denominator',
  },

  // ── Indices: the skill axis ─────────────────────────────────────────────
  'indices.laws': {
    topic: 'Laws of Indices',
    difficulty: 'exam',
    strategy: 'input-first',
    source: 'zeta+paper',
    basedOn: ['2025 P1 Q10'],
    marks: 3,
    route: 'apply the power of a power, then multiply by adding the powers, then divide by subtracting them - a mark for each law',
    answerShape: 'expression',
    webTopics: ['Laws of indices'],
    skill: 'Apply the power, multiplication and division laws in one expression',
  },
  'indices.negative-power': {
    topic: 'Negative Indices',
    difficulty: 'exam',
    strategy: 'input-first',
    source: 'zeta+paper',
    basedOn: ['2016 P2 Q10', '2022 P1 Q11', '2023 P1 Q12'],
    marks: 3,
    route: 'apply the power of a power, then add the powers, then express the result with a positive power. 2022 and 2023 accept two and three alternative orderings respectively; ours is their Method 1',
    answerShape: 'expression',
    webTopics: ['Rewriting fraction or negative index in the form ax^n', 'Laws of indices'],
    skill: 'Combine powers to a negative index, then write it with a positive power',
  },
  'indices.evaluate': {
    topic: 'Fractional Indices',
    difficulty: 'exam',
    strategy: 'answer-first',
    source: 'zeta+practice',
    basedOn: ['2015 P1 Q14'],
    marks: 2,
    route: 'interpret the index as a root and a power, then complete the evaluation. Taking the root and raising to the power are one mark between them, not two',
    answerShape: 'integer',
    webTopics: ['Evaluating a fractional or negative index numerically'],
    skill: 'Evaluate a numeric fractional index by taking the root then the power',
  },

  // ── Indices: the shape axis ─────────────────────────────────────────────
  'indices.coefficient': {
    topic: 'Indices with Coefficients',
    difficulty: 'exam',
    strategy: 'input-first',
    source: 'paper',
    basedOn: ['2018 P1 Q15'],
    marks: 2,
    route: 'start the process by taking the power to both parts of the product, then complete it',
    answerShape: 'expression',
    webTopics: ['Laws of indices'],
    skill: 'Apply the power to the coefficient as well as the variable',
  },
  // Same law, one more move, and the paper pays for it: the bracket question
  // stops once the power is distributed, this one then has a division to do
  // and a coefficient left standing under it.
  'indices.coefficient-quotient': {
    topic: 'Indices in a Quotient',
    difficulty: 'exam',
    strategy: 'input-first',
    source: 'paper',
    basedOn: ['2026 P2 Q11'],
    marks: 3, marksInferred: true,
    route: 'inferred, no published 2026 scheme: take the power to both parts of the denominator, divide the powers of the variable, then assemble the answer over the coefficient',
    answerShape: 'expression',
    webTopics: ['Laws of indices'],
    skill: 'Take a power into a bracket in a denominator, then divide',
  },
  'indices.expand': {
    topic: 'Expanding with Indices',
    difficulty: 'exam',
    strategy: 'answer-first',
    source: 'paper',
    basedOn: ['2024 P1 Q13'],
    marks: 2,
    route: 'apply one of the two multiplications, then apply both and simplify',
    answerShape: 'expression',
    webTopics: ['Laws of indices'],
    skill: 'Expand a bracket whose terms carry fractional and negative indices',
  },
  // A coefficient that divides is not the same skill as a power that divides,
  // and 2014 P2 Q8 pays for them separately. indices.laws has no numbers in it
  // at all, so a pupil drilled on it has never met the trap: subtracting 10 - 2
  // is exactly what the powers just told them to do.
  'indices.cancel-coefficients': {
    topic: 'Cancelling Coefficients with Indices',
    difficulty: 'exam',
    strategy: 'input-first',
    source: 'paper',
    basedOn: ['2014 P2 Q8'],
    marks: 3,
    route: 'simplify the powers in the numerator, cancel the constants, then eliminate the variable from the denominator',
    answerShape: 'expression',
    webTopics: ['Laws of indices'],
    skill: 'Divide coefficients and powers by their own separate rules',
  },
  'indices.root-denominator': {
    topic: 'A Root in the Denominator',
    difficulty: 'exam',
    strategy: 'input-first',
    source: 'paper',
    basedOn: ['2019 P2 Q16'],
    marks: 3,
    route: 'apply a^m x ka^n = ka^(m+n), then show evidence of the square root as a power of a half, then complete the simplification. The middle mark is for writing the root as a power at all - until then there is nothing to divide',
    answerShape: 'expression',
    webTopics: ['Laws of indices'],
    skill: 'Turn a root into a fractional index so the division law applies',
  },
  'indices.root-as-power': {
    topic: 'Writing a Root as a Power',
    difficulty: 'exam',
    strategy: 'input-first',
    source: 'paper',
    basedOn: ['2017 P2 Q12'],
    marks: 2,
    route: 'apply the nth root of x^m = x^(m/n), then apply 1/x^n = x^(-n). One mark per law, and it runs the opposite way to indices.negative-power, which turns a negative index back into a fraction',
    answerShape: 'expression',
    webTopics: ['Rewriting fraction or negative index in the form ax^n'],
    skill: 'Write a reciprocal root as a single negative fractional power',
  },

  // ── Percentages ─────────────────────────────────────────────────────────
  // The specification lists appreciation/depreciation and reverse percentages
  // as two separate skills. Zeta adds percentage change, which no paper asks on
  // its own.
  'percentages.compound': {
    topic: 'Compound Appreciation & Depreciation',
    difficulty: 'exam',
    strategy: 'input-first',
    source: 'zeta+paper',
    basedOn: ['2016 P2 Q1', '2018 P2 Q1', '2022 P2 Q2', '2024 P2 Q1', '2026 P2 Q1',
              '2014 P2 Q1', '2015 P2 Q1', '2017 P2 Q2'],
    marks: 3,
    // Seven of the eight are three marks; 2026 P2 Q1 is four for what reads as
    // the same question, and with no 2026 scheme published there is no way to
    // say which move earns the fourth. Recorded rather than guessed at, and to
    // be resolved when Qualifications Scotland publish.
    marksDiffer: { '2026 P2 Q1': 4 },
    route: 'know how to change by the rate, then know how to carry it across the years, then evaluate to the stated accuracy',
    answerShape: 'rounded',
    webTopics: ['Appreciation and Depreciation'],
    skill: 'Apply a multiplier once per year, then round as the question asks',
  },
  // The years are dates rather than a count, so a pupil has to subtract them
  // before anything else. Same maths and the same three marks as the one above
  // — a separate id because the generator has to be able to guarantee the
  // wording, which is the whole difficulty of these two.
  'percentages.compound-between-years': {
    topic: 'Appreciation Between Two Years',
    difficulty: 'exam',
    strategy: 'input-first',
    source: 'paper',
    basedOn: ['2019 P2 Q1', '2025 P2 Q1'],
    marks: 3,
    route: 'multiplier, then the number of years worked out from the two dates, then evaluate',
    answerShape: 'rounded',
    webTopics: ['Appreciation and Depreciation'],
    skill: 'Count the years between two dates, then apply the multiplier that many times',
  },
  'percentages.reverse': {
    topic: 'Reverse Percentages',
    difficulty: 'exam',
    strategy: 'answer-first',
    source: 'zeta+paper',
    basedOn: ['2022 P1 Q10', '2023 P2 Q6', '2018 P2 Q11',
              '2015 P2 Q8', '2017 P2 Q5', '2024 P2 Q5', '2025 P1 Q4'],
    marks: 3,
    route: 'know that the given amount is (100 +/- r)% of the original, then begin a valid strategy, then complete the calculation within it',
    answerShape: 'money',
    webTopics: ['Reversing a percentage change'],
    skill: 'Divide by the multiplier to recover the original quantity',
  },
  // Nothing rose or fell: the figure given simply *is* r% of the whole. That
  // moves the first mark — it is for reading "80% = 480 000", and a pupil
  // reaching for 100 + r has misread the question rather than slipped.
  'percentages.part-of-whole': {
    topic: 'Finding a Total from a Percentage',
    difficulty: 'exam',
    strategy: 'answer-first',
    source: 'paper',
    basedOn: ['2014 P1 Q9', '2026 P1 Q2'],
    marks: 3,
    route: 'know that r% is the figure given, find 1%, multiply by 100 — both are Paper 1, so it divides by hand',
    answerShape: 'integer',
    webTopics: ['Reversing a percentage change'],
    skill: 'Recover a total when a part is given as a straight percentage of it',
  },
  // A reverse percentage that stops one step short of the usual answer: having
  // divided back to the bill, the question wants the difference. The scheme's
  // third mark is for that difference and not for the bill, so a variation that
  // stopped at the bill would be answering a question nobody asked.
  'percentages.surcharge': {
    topic: 'Finding the Extra Charged',
    difficulty: 'exam',
    strategy: 'answer-first',
    source: 'paper',
    basedOn: ['2019 P2 Q9'],
    marks: 3,
    route: 'know that (100 + r)% is the total, divide back to the bill, then subtract to get the extra',
    answerShape: 'money',
    webTopics: ['Reversing a percentage change'],
    skill: 'Find a surcharge from the total that includes it',
  },
  'percentages.change': {
    topic: 'Percentage Change',
    difficulty: 'skill',
    strategy: 'answer-first',
    source: 'zeta',
    basedOn: [],
    answerShape: 'integer',
    webTopics: [],
    skill: 'Difference divided by the original, times 100',
  },
  'percentages.two-stage': {
    topic: 'Two-Stage Depreciation',
    difficulty: 'exam',
    strategy: 'input-first',
    source: 'paper',
    basedOn: ['2023 P2 Q1'],
    marks: 3,
    route: 'know how to decrease by both rates, then know how to calculate the value, then evaluate',
    answerShape: 'money',
    webTopics: ['Appreciation and Depreciation'],
    skill: 'One rate for the first year, a different rate for the years after',
  },

  // ── Expanding brackets ──────────────────────────────────────────────────
  // The specification names four forms: a(bx+c)+d(ex+f), ax(bx+c),
  // (ax+b)(cx+d) and (ax+b)(cx^2+dx+e). The papers ask the last two; practice
  // and Zeta drill the first two, which no paper asks on its own.
  'expanding.single': {
    topic: 'Expanding a Single Bracket',
    difficulty: 'skill',
    strategy: 'input-first',
    source: 'zeta',
    basedOn: [],
    answerShape: 'expression',
    webTopics: ['Expanding brackets'],
    skill: 'Multiply each term inside a bracket by the number outside',
  },
  'expanding.two-singles': {
    topic: 'Expanding Two Single Brackets',
    difficulty: 'skill',
    strategy: 'input-first',
    source: 'zeta+practice',
    basedOn: [],
    answerShape: 'expression',
    webTopics: ['Expanding brackets'],
    skill: 'Expand two single brackets and collect like terms',
  },
  'expanding.monomial': {
    topic: 'Expanding with a Term Outside',
    difficulty: 'skill',
    strategy: 'input-first',
    source: 'spec',
    basedOn: [],
    answerShape: 'expression',
    webTopics: ['Expanding brackets'],
    skill: 'Multiply a bracket by a term containing the variable',
  },
  'expanding.two-binomials': {
    topic: 'Expanding Two Brackets',
    difficulty: 'exam',
    strategy: 'input-first',
    source: 'zeta+paper',
    basedOn: ['2014 P1 Q2'],
    marks: 2,
    route: 'any three terms correct, then the fourth term and the like terms collected',
    answerShape: 'expression',
    webTopics: ['Expanding brackets'],
    skill: 'Multiply every term in one bracket by every term in the other',
  },

  'expanding.binomial-trinomial': {
    topic: 'Expanding a Trinomial',
    difficulty: 'exam',
    strategy: 'input-first',
    source: 'paper',
    basedOn: ['2022 P2 Q1', '2024 P1 Q3', '2026 P1 Q1', '2015 P1 Q4', '2017 P1 Q4', '2019 P1 Q3'],
    marks: 3,
    route: 'start to expand, evidenced by any three correct terms, then complete the expansion, then collect like terms. The third mark needs a term in x^3 and, in 2017 and 2022, a negative coefficient, which the generator\'s guards enforce',
    answerShape: 'expression',
    webTopics: ['Expanding brackets'],
    skill: 'Expand a binomial times a trinomial, giving a term in x cubed',
  },
  'expanding.product-plus': {
    topic: 'Expanding and Collecting',
    difficulty: 'exam',
    strategy: 'input-first',
    source: 'paper',
    basedOn: ['2018 P1 Q2', '2023 P1 Q2', '2025 P1 Q2'],
    marks: 3,
    route: 'start the expansion, then complete it, then collect like terms. The evidence for the second mark must show both brackets expanded, not the single bracket alone',
    answerShape: 'expression',
    webTopics: ['Expanding brackets'],
    skill: 'Expand a product and a single bracket, then collect like terms',
  },

  // ── Factorising ─────────────────────────────────────────────────────────
  // The specification names four cases and then "combinations of the above",
  // which is what "factorise fully" signals. Solving having factorised first is
  // listed separately, under solving a quadratic equation.
  'factorising.common-factor': {
    topic: 'Factorising a Common Factor',
    difficulty: 'skill', strategy: 'answer-first', source: 'zeta+practice',
    basedOn: [], answerShape: 'expression',
    webTopics: ['Factorising'],
    skill: 'Take out the highest factor every term shares',
  },
  'factorising.difference-squares': {
    topic: 'Difference of Two Squares',
    difficulty: 'skill', strategy: 'answer-first', source: 'zeta+practice',
    basedOn: [], answerShape: 'expression',
    webTopics: ['Factorising'],
    skill: 'Recognise A squared minus B squared and split it into two brackets',
  },
  'factorising.trinomial-simple': {
    topic: 'Factorising a Trinomial',
    difficulty: 'skill', strategy: 'answer-first', source: 'zeta+practice',
    basedOn: [], answerShape: 'expression',
    webTopics: ['Factorising'],
    skill: 'Find two numbers multiplying to the constant and adding to the middle',
  },
  'factorising.trinomial-hard': {
    topic: 'Factorising a Harder Trinomial',
    difficulty: 'skill', strategy: 'answer-first', source: 'zeta',
    basedOn: [], answerShape: 'expression',
    webTopics: ['Factorising'],
    skill: 'Factorise with a non-unitary x squared coefficient',
  },
  'factorising.fully': {
    topic: 'Factorising Fully',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2016 P2 Q4'], marks: 2,
    route: 'begin to factorise by taking out the common factor, then factorise fully via the difference of two squares',
    answerShape: 'expression',
    webTopics: ['Factorising'],
    skill: 'Common factor first, then the difference of two squares',
  },
  'factorising.solve': {
    topic: 'Solving by Factorising',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2018 P1 Q5'], marks: 2,
    route: 'correct factorisation, then solve for x. Setting each bracket to zero is part of the second mark, not a mark of its own',
    answerShape: 'expression',
    webTopics: ['Quadratic equation by factorising'],
    skill: 'Factorise, then set each bracket to zero',
  },
  // The non-unitary form is its own variation because the exam pays three
  // marks for it and two for the unitary one. Both were generated under the
  // id above, so half of what it produced was printed at the wrong price.
  'factorising.solve-non-unitary': {
    topic: 'Solving by Factorising',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2026 P1 Q14'], marks: 3, marksInferred: true,
    route: 'inferred, no published 2026 scheme: split the leading coefficient, complete the factorisation, then solve. The extra mark over the unitary form buys the first of those, which is the move that form does not need',
    answerShape: 'expression',
    webTopics: ['Quadratic equation by factorising'],
    skill: 'Factorise a quadratic whose x squared term has a coefficient, then solve',
  },

  // ── Quadratics, the parts needing no diagram ────────────────────────────
  // The specification allows p and q to be rational when completing the square,
  // so an odd middle coefficient is in scope and gives a fractional answer.
  'quadratics.complete-square': {
    topic: 'Completing the Square',
    difficulty: 'exam', strategy: 'input-first', source: 'zeta+paper',
    basedOn: ['2014 P1 Q3', '2016 P2 Q9', '2019 P2 Q10', '2025 P2 Q5'],
    marks: 2,
    route: 'correct bracket with square, then complete the process. Writing out the finished expression is part of the second mark',
    answerShape: 'expression',
    webTopics: ['Completing the square'],
    skill: 'Write x^2+bx+c in the form (x+p)^2+q',
  },
  // 2024 P1 Q12 is the one cited question in this group that carries an image,
  // and only in its part (c), which asks about a line PQ drawn across the graph.
  // Parts (a) and (b) — complete the square, hence state the turning point — are
  // diagram-free, and are what this variation reproduces. The reverse lookup is
  // still right: from that paper question, this is the practice worth offering.
  'quadratics.turning-point-related': {
    topic: 'A Turning Point and a Related Point',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2024 P1 Q12'],
    marks: 5,
    route: '2 + 1 + 2 - the bracket and the completed square, then the turning point, then the x and the y of Q. Part (c) is the piece nothing else produces: PQ is horizontal with P on the y-axis, so Q is P reflected in the axis of symmetry',
    answerShape: 'integer',
    webTopics: ['Completing the square', 'Turning Points and Axis of Symmetry'],
    skill: 'Complete the square, read the turning point, then reflect a point in the axis of symmetry',
  },
  'quadratics.turning-point': {
    topic: 'Turning Point of a Parabola',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2022 P1 Q5'],
    marks: 3,
    route: '2 + 1 - correct bracket with square, complete the process consistently, then state the coordinates of the turning point. 2024 P1 Q12 was cited here too, at 3 of its 5 marks with the difference declared through marksDiffer - which is the mechanism for one shape priced differently across papers, not for a question only partly cloned. quadratics.turning-point-related is that whole question',
    answerShape: 'expression',
    webTopics: ['Turning Points and Axis of Symmetry', 'Completing the square'],
    skill: 'Complete the square, then read off the turning point',
  },
  // The roots come out as d ± d√e with the same d twice, which only happens
  // when the completed-square constant is p² times a square-free number. Built
  // backwards from p and e for exactly that reason.
  'quadratics.complete-square-surd-roots': {
    topic: 'Completing the Square with Surd Roots',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2018 P1 Q19'],
    marks: 7,
    route: '2 + 1 + 4 - the bracket with the square, complete the process, state the axis of symmetry; then equate the completed square to zero, start to solve, solve, and complete. Note 2 withholds the last mark unless the simplification actually reaches the d ± d√e form',
    answerShape: 'expression',
    webTopics: ['Completing the square', 'Turning Points and Axis of Symmetry', 'Quadratic formula', 'Simplifying surds'],
    skill: 'Complete the square, read off the axis, then solve for surd roots',
  },

  // ── Reading a parabola off its graph — six questions, five shapes ───────
  //
  // The group the shape library was missing, and cheaper than the plan assumed:
  // none of the six is plotted on a grid. Each prints arrowed axes, a smooth
  // curve and a dot or two carrying coordinates, which is `sketch-axes.ts`.
  //
  // The sign of a is where all of them are lost, and the schemes say so: 2025's
  // note gives nothing for a = -5 with b = 3, and 2023 lists "a = 3, b = 2"
  // under commonly observed. The working says why rather than printing a.
  // ── The equation of a line read off a graph ─────────────────────────────
  //
  // Five papers, one variation. Their schemes are each headed "Equation of a
  // line, then evaluate" and pay the same four marks, so the difference between
  // a line of best fit through a scatter and an exact taxi fare is the story
  // and the picture, not the question. 2019 P1 Q6 and 2023 P1 Q7 are *not*
  // here: they name no points in prose, so their figures are gridded with
  // numbered axes, and faking them on axes with no scale would make them
  // unanswerable.
  'straight-line.best-fit': {
    topic: 'The Equation of a Line of Best Fit',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2014 P1 Q6', '2016 P1 Q5', '2018 P1 Q7', '2024 P1 Q9', '2026 P1 Q6'],
    marks: 4,
    route: '3 + 1 - find the gradient, substitute it with one of the points, state the equation in the question own letters and in simplest form, then evaluate it at a given value. 2018 P1 Q7 withholds the third mark for a gradient turned into a decimal, so a fractional gradient is carried as a fraction throughout',
    answerShape: 'expression',
    webTopics: ['Straight Line Equation'],
    skill: 'Read two points off a graph, find the equation, then use it',
  },
  'straight-line.best-fit-grid': {
    topic: 'A Line of Best Fit on a Grid',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2019 P1 Q6', '2023 P1 Q7'],
    marks: 4,
    route: '3 + 1, the same four as straight-line.best-fit - gradient, substitute a point, state the equation in the question letters, then evaluate. Its own id because these two name no points in their prose: the pupil reads them off the ruling, and both schemes name the exact intersections the gradient may be taken from',
    answerShape: 'integer',
    webTopics: ['Scatter Graph', 'Straight Line Equation'],
    skill: 'Read two points off a ruled scattergraph, find the line, then use it',
  },
  'straight-line.from-marked-points': {
    topic: 'The Equation of a Line Through Two Marked Points',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2025 P1 Q6'],
    marks: 3,
    route: 'calculate the gradient, substitute it with a point into y = mx + c or y - b = m(x - a), then state the equation in simplest form. Three rather than four because nothing is evaluated afterwards',
    answerShape: 'expression',
    webTopics: ['Straight Line Equation'],
    skill: 'Find the equation of a line from two points marked on a sketch',
  },

  // ── Sketching one, where the answer is the drawing ──────────────────────
  //
  // The only National 5 questions whose answer is a picture, so the working
  // ends by showing one. Two shapes because the schemes buy different things:
  // the completed-square form has no roots to find (k is positive in both
  // papers, so the curve never meets the x-axis), and the factorised form
  // starts from them.
  // ── Reading a trigonometric graph — eight questions, four shapes ────────
  //
  // The last of the group the plan billed as needing a coordinate grid, and the
  // second time reading the questions brought that down: none of these is
  // gridded either. 2015 P1 Q6 carries a 4, a 0, a -4 and a 360; 2019 P1 Q13
  // carries no numbers at all.
  'trig-graphs.amplitude-cycles': {
    topic: 'Amplitude and Period of a Trigonometric Graph',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2015 P1 Q6', '2018 P1 Q6', '2022 P1 Q8', '2024 P1 Q8'],
    marks: 2,
    route: 'state a, the amplitude read off the y-axis, then state b, the number of complete waves between 0 and 360. Two of the four ask it in two parts and two in one, and it is a mark each either way',
    answerShape: 'integer',
    webTopics: ['Identify equation of trigonometric graph'],
    skill: 'Read the amplitude off the axis and count the cycles for b',
  },
  // Departs from the paper's figure and says so in the generator: 2014 P1 Q10
  // prints eighteen degree labels standing on end, which cannot be laid out
  // here at any spacing finer than a whole turn, so the crossing carries its
  // own coordinate instead. Slightly easier than the paper, and recorded.
  'trig-graphs.shift': {
    topic: 'A Shifted Trigonometric Graph',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2014 P1 Q10'],
    marks: 2,
    route: 'state a, the amplitude, then state b from how far the graph has moved sideways. A shift of 40 to the right is b = -40, and that sign is the whole of the second mark',
    answerShape: 'integer',
    webTopics: ['Identify equation of trigonometric graph'],
    skill: 'Read an amplitude and a phase shift off a trigonometric graph',
  },
  'trig-graphs.shift-and-raise': {
    topic: 'A Raised Trigonometric Graph',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2023 P1 Q13'],
    marks: 2,
    route: '1 + 1 - state a from the sideways shift, then b from how far the whole wave has been lifted. Neither can be read off the amplitude, which is 1 throughout',
    answerShape: 'integer',
    webTopics: ['Identify equation of trigonometric graph'],
    skill: 'Separate a sideways shift from a vertical one on a trig graph',
  },
  'trig-graphs.turning-point': {
    topic: 'A Turning Point on a Trigonometric Graph',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2019 P1 Q13', '2025 P1 Q8'],
    marks: 2,
    route: 'find the x of the turning point by shifting the unshifted one, then state the coordinates. The equation is given in the prose and the figure prints no numbers at all - it is there to say which turning point',
    answerShape: 'integer',
    webTopics: ['Identify equation of trigonometric graph'],
    skill: 'Compute a turning point of a shifted trigonometric graph',
  },

  'quadratics.sketch-completed-square': {
    topic: 'Sketching a Parabola from Completed Square Form',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2016 P1 Q10', '2026 P1 Q12'],
    marks: 3,
    route: 'state the turning point, sketch a parabola with a minimum turning point consistent with it, then the y-intercept. The scheme puts the sketch at the second mark, before the intercept is known, so the figure shown there marks the turning point only',
    answerShape: 'text',
    webTopics: ['Sketch a parabola from equation'],
    skill: 'Read the turning point off completed square form and sketch the curve',
  },
  'quadratics.sketch-factorised': {
    topic: 'Sketching a Parabola from Factorised Form',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2018 P1 Q16', '2022 P1 Q14'],
    marks: 3,
    route: 'identify the roots, then the turning point or the y-intercept, then both of them on a consistently annotated sketch. The last mark is only available where the roots, the turning point and the y-intercept are all clearly marked',
    answerShape: 'text',
    webTopics: ['Sketch a parabola from equation'],
    skill: 'Take the roots from the brackets, halve between them, and sketch',
  },

  'quadratics.parabola-scale': {
    topic: 'A Parabola Through a Point',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2014 P1 Q7', '2026 P1 Q9'],
    marks: 2,
    route: 'know to substitute the marked point into y = ax^2, then solve for a',
    answerShape: 'integer',
    webTopics: ['Parabola Equation from Graph'],
    skill: 'Substitute a point on a parabola to find its stretch',
  },
  'quadratics.parabola-from-turning-point': {
    topic: 'A Parabola from its Turning Point',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2025 P1 Q9'],
    marks: 2,
    route: 'state a, then state b - a mark each, and the scheme gives nothing for a with the wrong sign even where b is right',
    answerShape: 'integer',
    webTopics: ['Parabola Equation from Graph'],
    skill: 'Read a and b off a turning point, watching the sign of a',
  },
  'quadratics.parabola-with-axis': {
    topic: 'A Parabola and its Axis of Symmetry',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2015 P1 Q7'],
    marks: 3,
    route: '1 + 1 + 1 - state a, state b, then state the equation of the axis of symmetry',
    answerShape: 'integer',
    webTopics: ['Parabola Equation from Graph', 'Turning Points and Axis of Symmetry'],
    skill: 'Read a and b off a turning point, then give the axis of symmetry',
  },
  'quadratics.parabola-y-intercept': {
    topic: 'A Parabola and its y-intercept',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2023 P1 Q4'],
    marks: 3,
    route: '1 + 1 + 1 - state a, state b, then find c by putting x = 0 into the equation. The scheme requires (b) to be consistent with (a) rather than correct outright',
    answerShape: 'integer',
    webTopics: ['Parabola Equation from Graph'],
    skill: 'Read a and b off a turning point, then find where the curve cuts the y-axis',
  },
  'quadratics.parabola-from-axis': {
    topic: 'A Parabola from its Axis of Symmetry',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2017 P1 Q14'],
    marks: 3,
    route: '1 + 2 - state a from the axis of symmetry, then substitute the marked point and state b. Its note follows part (b) through from a wrong a, which is why the working substitutes rather than reading b off the drawing',
    answerShape: 'integer',
    webTopics: ['Parabola Equation from Graph', 'Turning Points and Axis of Symmetry'],
    skill: 'Take a from the axis of symmetry, then substitute a point for b',
  },

  'quadratics.parabola-maximum': {
    topic: 'A Parabola with a Maximum Turning Point',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2019 P1 Q9'],
    marks: 3,
    route: '1 + 1 + 1 - the axis of symmetry from the turning point, then a, then b. The only parabola of the seven that opens downwards, so the square is subtracted and b is the height of the maximum, but the bracket is (x + a) as in the other six and a = -h. Note 1 accepts the equation written out in place of the two values, and the working says so',
    answerShape: 'integer',
    webTopics: ['Turning Points and Axis of Symmetry', 'Parabola Equation from Graph'],
    skill: 'Read a maximum turning point off a graph and match it to y = b - (x - a)^2',
  },

  'quadratics.reaches-height': {
    topic: 'Reaching a Height in a Quadratic Model',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2014 P1 Q13'],
    marks: 7,
    route: '4 + 3 - construct the equation, rearrange to zero, factorise and select the first of the two times; then the turning point, the maximum height, and a conclusion comparing it with the height asked about. The scheme requires equating to zero before solving, and gives 0/4 for an unworked answer',
    answerShape: 'integer',
    webTopics: ['Quadratic equation by factorising'],
    skill: 'Solve a quadratic model for a stated height, then decide whether a greater height is reached',
  },
  'quadratics.lands-below': {
    topic: 'Falling Below the Starting Height',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2019 P1 Q15'],
    marks: 5,
    route: '1 + 4 - evaluate the height at a given time, then set the equation equal to the negative drop, rearrange to zero, factorise and reject the negative root. The scheme accepts 17/5 or its decimal, and withholds the last mark where both roots come out the same sign',
    answerShape: 'integer',
    webTopics: ['Quadratic equation by factorising'],
    skill: 'Solve a quadratic model for the moment it falls below where it started',
  },

  'quadratics.discriminant': {
    topic: 'The Discriminant',
    difficulty: 'exam', strategy: 'input-first', source: 'zeta+paper',
    basedOn: ['2016 P1 Q6', '2018 P1 Q8', '2023 P1 Q5', '2025 P1 Q11'],
    marks: 2,
    route: 'calculate the discriminant, then state the nature of the roots. Naming the coefficients earns nothing',
    answerShape: 'text',
    webTopics: ['Discriminant'],
    skill: 'Calculate b^2-4ac and state the nature of the roots',
  },
  'quadratics.formula': {
    topic: 'The Quadratic Formula',
    difficulty: 'exam', strategy: 'input-first', source: 'zeta+paper',
    basedOn: ['2017 P2 Q4', '2019 P2 Q6', '2022 P2 Q7', '2024 P2 Q8'],
    marks: 3,
    marksDiffer: { '2022 P2 Q7': 4 },
    route: 'correct substitution into the quadratic formula, then evaluate the discriminant, then both roots at the stated accuracy. 2022 P2 Q7 is worth four, splitting the last mark into unrounded then rounded to two significant figures; the other three papers are three',
    answerShape: 'rounded',
    webTopics: ['Quadratic formula'],
    skill: 'Substitute into the formula and round as the question asks',
  },

  // ── Algebraic Fractions — 16 paper questions, the largest Tier 1 topic ───
  // Zeta lists multiplying as a skill, but no paper has ever asked for it on
  // its own, so that one variation carries an empty basedOn and is skill only.
  'alg-fractions.simplify': {
    topic: 'Simplifying Algebraic Fractions',
    difficulty: 'exam', strategy: 'answer-first', source: 'zeta+paper',
    basedOn: ['2015 P1 Q12', '2022 P2 Q12', '2023 P2 Q12'],
    marks: 3,
    route: 'factorise the numerator, factorise the denominator, then cancel the brackets correctly',
    answerShape: 'expression',
    webTopics: ['Simplifying algebraic fraction'],
    skill: 'Factorise numerator and denominator, then cancel',
  },
  'alg-fractions.factorise-simplify': {
    topic: 'Simplifying Algebraic Fractions',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2017 P2 Q9', '2024 P2 Q6'],
    marks: 3,
    marksDiffer: { '2017 P2 Q9': 4 },
    route: '1 + 2 - factorise for part (a), then factorise the denominator and simplify for part (b). 2017 P2 Q9 is worth four because its part (b) needs a second factorising mark, a shape this variation does not produce',
    answerShape: 'expression',
    webTopics: ['Factorising', 'Simplifying algebraic fraction'],
    skill: 'Factorise, then hence simplify — the scaffolded two-part form',
  },
  'alg-fractions.add': {
    topic: 'Adding Algebraic Fractions',
    difficulty: 'exam', strategy: 'input-first', source: 'zeta+paper',
    basedOn: ['2016 P2 Q13', '2024 P2 Q12'],
    marks: 3,
    route: 'correct common denominator, then correct numerator, then remove the brackets and collect like terms. 2017 P1 Q11 is the two-mark version of the same thing, where nothing needs expanding',
    answerShape: 'expression',
    webTopics: ['Add or subtract Algebraic Fractions'],
    skill: 'Common denominator, expand the numerator, collect like terms',
  },
  'alg-fractions.subtract': {
    topic: 'Subtracting Algebraic Fractions',
    difficulty: 'exam', strategy: 'input-first', source: 'zeta+paper',
    basedOn: ['2014 P2 Q9', '2017 P1 Q11', '2019 P2 Q15', '2023 P2 Q10', '2025 P1 Q14'],
    marks: 3,
    marksDiffer: { '2017 P1 Q11': 2 },
    route: 'correct common denominator, then correct numerator, then remove the brackets and collect like terms. 2017 P1 Q11 is the two-mark version of the same thing, where nothing needs expanding',
    answerShape: 'expression',
    webTopics: ['Add or subtract Algebraic Fractions'],
    skill: 'Common denominator, expand the numerator watching the sign, collect like terms',
  },
  // The difference of two squares on top rather than underneath. 2018 P2 Q15 is
  // the same three moves the other way up, and cancels to a bracket in the
  // denominator; this one leaves a bracket over a number.
  'alg-fractions.divide-squares-on-top': {
    topic: 'Dividing with a Difference of Squares',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2026 P2 Q9'],
    marks: 3, marksInferred: true,
    route: 'inferred, no published 2026 scheme, patterned on 2018 P2 Q15: start to divide by taking the reciprocal, factorise the difference of two squares, then cancel and state',
    answerShape: 'expression',
    webTopics: ['Multiply or divide Algebraic Fractions'],
    skill: 'Divide algebraic fractions where the numerator factorises',
  },
  'alg-fractions.multiply': {
    topic: 'Multiplying Algebraic Fractions',
    difficulty: 'skill', strategy: 'answer-first', source: 'zeta',
    basedOn: [],
    answerShape: 'expression',
    webTopics: ['Multiply or divide Algebraic Fractions'],
    skill: 'Multiply across and cancel common factors',
  },
  'alg-fractions.divide': {
    topic: 'Dividing Algebraic Fractions',
    difficulty: 'exam', strategy: 'answer-first', source: 'zeta+paper',
    basedOn: ['2015 P2 Q7', '2018 P2 Q15'],
    marks: 3,
    route: 'start the division by multiplying by the reciprocal, then factorise, then multiply and express in simplest form',
    answerShape: 'expression',
    webTopics: ['Multiply or divide Algebraic Fractions'],
    skill: 'Multiply by the reciprocal, factorise, cancel',
  },
  // 2022 P1 Q12 has nothing to factorise between the reciprocal and the
  // cancelling, and is worth two marks rather than three.
  'alg-fractions.divide-simple': {
    topic: 'Dividing Algebraic Fractions',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2022 P1 Q12'],
    marks: 2,
    route: 'start the division by multiplying by the reciprocal, then simplify. Nothing needs factorising, which is why this is two marks',
    answerShape: 'expression',
    webTopics: ['Multiply or divide Algebraic Fractions'],
    skill: 'Multiply by the reciprocal, then cancel a repeated factor',
  },
  'alg-fractions.gradient-context': {
    topic: 'Gradient as an Algebraic Fraction',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2019 P2 Q13'],
    marks: 3,
    route: 'correct substitution into the gradient formula, then factorise the numerator as a difference of two squares, then take the common factor out of the denominator and simplify',
    answerShape: 'expression',
    webTopics: ['Straight Line Equation', 'Simplifying algebraic fraction'],
    skill: 'Substitute into the gradient formula, then simplify',
  },

  // ── Changing the Subject — 9 questions, the most mechanical topic ────────
  // The gap table listed 2019 P1 Q7, 2023 P2 Q7 and 2025 P2 Q9 as "subject
  // appears twice". It does not — all three have a fractional coefficient to
  // clear, which is a different skill. Regrouped here and in the doc.
  // Every mark in a change-of-subject scheme is one operation, so the number of
  // operations *is* the mark total. 2022 P1 Q7 needs no division and is worth
  // two; the other two need three.
  'change-subject.fraction': {
    topic: 'Changing the Subject',
    difficulty: 'exam', strategy: 'input-first', source: 'zeta+paper',
    basedOn: ['2017 P1 Q10', '2024 P2 Q9'],
    marks: 3,
    route: 'multiply by the denominator, subtract the constant term, divide by the coefficient - one mark per operation',
    answerShape: 'expression',
    webTopics: ['Changing the subject of a formula'],
    skill: 'Multiply up, subtract, divide — the subject sits in a numerator',
  },
  'change-subject.fraction-two-step': {
    topic: 'Changing the Subject',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2022 P1 Q7'],
    marks: 2,
    route: 'multiply by the denominator, then subtract the constant term. There is no coefficient to divide out, which is why this is two marks and not three',
    answerShape: 'expression',
    webTopics: ['Changing the subject of a formula'],
    skill: 'Multiply up and subtract — the subject has no coefficient to divide out',
  },
  'change-subject.root': {
    topic: 'Changing the Subject with Roots',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2016 P2 Q12', '2018 P1 Q14'],
    marks: 3,
    route: 'undo the operations in turn, one mark each, with the square or the square root taken at the point it applies',
    answerShape: 'expression',
    webTopics: ['Changing the subject of a formula'],
    skill: 'Square or take a root to undo the power, then rearrange',
  },
  // The subject inside the root with no coefficient of its own: square, then
  // add, and there is nothing to divide out. Two operations, two marks — which
  // is why it cannot share the id above, whose three marks would never sum.
  'change-subject.root-two-step': {
    topic: 'Changing the Subject with Roots',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2026 P1 Q8'],
    marks: 2,
    marksInferred: true,
    route: 'square, then add — one mark per operation, which is what every published change-of-subject scheme in the set does',
    answerShape: 'expression',
    webTopics: ['Changing the subject of a formula'],
    skill: 'Square both sides, then move the one remaining term',
  },
  'change-subject.fraction-coefficient': {
    topic: 'Changing the Subject with a Fractional Coefficient',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2014 P2 Q11', '2019 P1 Q7', '2023 P2 Q7', '2025 P2 Q9'],
    marks: 3,
    route: 'clear the constant term, clear the fractional coefficient, then divide by what is left. 2023 and 2025 accept either order for the first two',
    answerShape: 'expression',
    webTopics: ['Changing the subject of a formula'],
    skill: 'Clear the fraction first, then isolate the subject',
  },

  // ── Inequalities — 5 questions plus 2026, uniformly 3 marks ──────────────
  'inequalities.brackets': {
    topic: 'Solving Inequalities',
    difficulty: 'exam', strategy: 'input-first', source: 'zeta+paper',
    // 2026 P1 Q11 was cited here and is a 3D coordinates question worth 1 + 1.
    // Nothing could see it: no 2026 markscheme exists, so the citation was
    // never compared with anything until the check learned to read the paper's
    // own totals. 2026 P1 Q4 is the inequality.
    basedOn: ['2015 P1 Q2', '2017 P1 Q8', '2018 P2 Q4', '2024 P2 Q4',
              '2026 P1 Q4'],
    marks: 3,
    route: 'expand the bracket, then collect like terms, then solve. 2024 P2 Q4 requires visible handling of a negative coefficient, either by reversing the sign at the last mark or by collecting on the right at the second',
    answerShape: 'expression',
    webTopics: ['Linear equations and inequations'],
    skill: 'Expand, collect, solve — and reverse the sign if dividing by a negative',
  },
  'inequalities.fractions': {
    topic: 'Inequalities with Fractions',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2023 P1 Q14'],
    marks: 3,
    route: 'eliminate the denominators, then rearrange into ax > b, then solve. The scheme lists three methods but only the first mark differs between them; ours is Method 1',
    answerShape: 'expression',
    webTopics: ['Linear equations and inequations'],
    skill: 'Multiply through by the lowest common multiple, then solve',
  },

  // ── Simultaneous Equations — 10 questions, half of them applied ──────────
  // 2023 P1 Q3 notes: repeated substitution scores 0/3, and so do correct
  // answers with no working. The marks are the elimination, so every worked
  // solution shows the scaling step.
  'simeq.solve-given': {
    topic: 'Solving Simultaneous Equations',
    difficulty: 'exam', strategy: 'answer-first', source: 'zeta+paper',
    basedOn: ['2015 P1 Q11', '2018 P1 Q3', '2023 P1 Q3', '2024 P1 Q7'],
    marks: 3,
    route: 'correct scaling, then a value for one variable, then a value for the other',
    answerShape: 'expression',
    webTopics: ['Simultaneous equations'],
    skill: 'Scale, eliminate, substitute back',
  },
  'simeq.intersection': {
    topic: 'Intersection of Two Lines',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2017 P1 Q13'],
    marks: 3,
    route: 'evidence of scaling to match the x or y coefficients, then a valid strategy through to values for x and y, then state the coordinates of the point. Writing the coordinates is part of the third mark, not a fourth',
    answerShape: 'expression',
    webTopics: ['Simultaneous equations'],
    skill: 'Solve the pair to find where two lines cross, answer as coordinates',
  },
  // The last mark is for communicating the answer with its units, and 2022
  // P2 Q4 note 2 requires both quantities to be named. The worked answer ends
  // with that sentence rather than a bare pair of numbers.
  'simeq.construct-solve': {
    topic: 'Constructing Simultaneous Equations',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2014 P2 Q3', '2016 P1 Q4', '2019 P1 Q8', '2022 P2 Q4', '2025 P2 Q10'],
    marks: 6,
    route: '1 + 1 + 4 - construct an equation for each situation, then correct scaling, a value, the other value, and the answer communicated in its units',
    answerShape: 'text',
    webTopics: ['Simultaneous equations'],
    skill: 'Build both equations from a context, solve, answer in units',
  },
  // 2026 P2 Q4 solves the pair and then *uses* it: "the total number of minutes
  // to make 10 cups and 8 plates". The last mark buys a quantity neither
  // equation mentions, so a variation that stopped at the two values would be
  // answering a question nobody asked.
  'simeq.construct-combine': {
    topic: 'Simultaneous Equations Used Again',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2026 P2 Q4'],
    marks: 6,
    marksInferred: true,
    route: '1 + 1 + 4 as the question data gives, mapping onto the other five papers exactly except that the last mark applies the two values rather than stating them',
    answerShape: 'text',
    webTopics: ['Simultaneous equations'],
    skill: 'Solve a constructed pair, then use both values on a new quantity',
  },

  // ── Functions — 7 questions, five of them two-mark evaluations ───────────
  // 2016 P1 Q9 is also a function evaluation, but its answer is a surd and it
  // is already built as surds.in-function.
  'functions.evaluate': {
    topic: 'Evaluating a Function',
    difficulty: 'exam', strategy: 'input-first', source: 'zeta+paper',
    basedOn: ['2017 P1 Q1', '2019 P1 Q1', '2022 P1 Q2', '2024 P1 Q2'],
    marks: 2,
    route: 'substitute the value into f(x), then evaluate',
    answerShape: 'integer',
    webTopics: ['Function notation'],
    skill: 'Substitute a value, usually negative, into f(x)',
  },
  'functions.find-unknown': {
    topic: 'Finding an Unknown in a Function',
    difficulty: 'exam', strategy: 'answer-first', source: 'zeta+paper',
    basedOn: ['2015 P2 Q2', '2018 P2 Q6'],
    marks: 2,
    route: 'valid strategy, which is setting the function equal to the given value, then state the value of the unknown. No mark for the rearrangement',
    answerShape: 'integer',
    webTopics: ['Function notation'],
    skill: 'Given f(a) = b, solve for a',
  },
  // Split off from find-unknown: 2025 P1 Q7 asks the same thing but leads in
  // with an evaluation, and is worth three marks rather than two. One id for
  // both would have to claim a single total for two different questions.
  'functions.evaluate-then-solve': {
    topic: 'Finding an Unknown in a Function',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2025 P1 Q7'],
    marks: 3,
    route: 'state f at the given value for part (a), then for part (b) a valid strategy and the value of the unknown',
    answerShape: 'integer',
    webTopics: ['Function notation'],
    skill: 'Evaluate f at a value, then solve f(a) = b for a',
  },
  // Function notation outside, a related angle inside. The paper tags it as
  // both, and it is the second that carries the question: substituting is one
  // line, and then cos 180 has to be known cold in a non-calculator paper.
  'functions.evaluate-trig': {
    topic: 'Evaluating a Trigonometric Function',
    difficulty: 'exam', strategy: 'curated-pool', source: 'paper',
    basedOn: ['2026 P1 Q13'],
    marks: 2, marksInferred: true,
    route: 'inferred, no published 2026 scheme: substitute the value and work out the angle inside, then apply the exact value and multiply. Every other function evaluation in the papers splits the same way',
    answerShape: 'integer',
    webTopics: ['Function notation', 'sin/cos/tan of related angles'],
    skill: 'Evaluate a trigonometric function at a quadrantal angle',
  },

  // ── Comparing Data Sets — 12 questions ───────────────────────────────────
  // The comparison marks are the strict part. 2023 P1 Q9(b) accepts "on average
  // the newspaper readers' ages are higher" and rejects "on average the ages
  // are higher", "the median age is less", "the range …" and anything calling
  // the quantity "results", "scores" or "data".
  'data.quartiles': {
    topic: 'Quartiles and Interquartile Range',
    difficulty: 'exam', strategy: 'input-first', source: 'zeta+paper',
    basedOn: ['2017 P1 Q2', '2025 P1 Q3'],
    marks: 2,
    route: 'find the quartiles, then calculate the range. Ordering the list and locating the median are how the quartiles are found, not marks of their own',
    answerShape: 'integer',
    webTopics: ['Median/Quartiles/Interquartile Range'],
    skill: 'Order the data, find the quartiles, then the (semi-)interquartile range',
  },
  'data.median-iqr-compare': {
    topic: 'Comparing Median and Interquartile Range',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2015 P1 Q10', '2019 P1 Q5', '2023 P1 Q9', '2024 P1 Q5',
              '2026 P1 Q3'],
    marks: 5,
    route: '3 + 2 - the median, the quartiles, the interquartile range, then a valid comparison of the medians and one of the interquartile ranges. Each comparison must name the quantity and the group: 2023 P1 Q9 accepts "on average the newspaper readers\' ages are higher" and rejects "on average the ages are higher"',
    answerShape: 'text',
    webTopics: ['Median/Quartiles/Interquartile Range', 'Comparing Calculated Statistics'],
    skill: 'Median and IQR, then one comparison of average and one of spread',
  },
  // 2014 P2 Q4 was filed under the comparison variation and is not a comparison
  // question: its part (b) is a one-mark judgement — "no, with valid
  // explanation" — where the other four carry a two-mark compare-the-means-and-
  // spreads part. Part (a) is exactly this calculation, and is worth four.
  // Part (b) is an open row in the gap table.
  'data.mean-sd-consistency': {
    topic: 'Judging Consistency from the Standard Deviation',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2014 P2 Q4'],
    marks: 5,
    route: '1 + 3 + 1 - the mean is its own part, then the squared differences, the formula and the standard deviation, then a single judgement. Not the compare-two-samples shape of the other four standard deviation papers: consistency is the standard deviation alone, and saying so is the whole of the last mark',
    answerShape: 'rounded',
    webTopics: ['Standard Deviation', 'Comparing Calculated Statistics'],
    skill: 'Find the mean and standard deviation, then judge consistency from the deviation alone',
  },
  'data.mean-sd': {
    topic: 'Mean and Standard Deviation',
    difficulty: 'skill', strategy: 'answer-first', source: 'zeta',
    basedOn: [],
    marks: 4,
    route: 'the mean, the squared differences from it, substitution into the formula, then the standard deviation. A drill rather than a clone: it cited 2014 P2 Q4a, which claimed one part of a paper question and left the rest uncloned. data.mean-sd-consistency is that whole question',
    answerShape: 'rounded',
    webTopics: ['Standard Deviation'],
    skill: 'Calculate the mean, then the standard deviation from the n-1 formula',
  },
  'data.mean-sd-compare': {
    topic: 'Comparing Mean and Standard Deviation',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2016 P2 Q6', '2018 P2 Q5', '2022 P2 Q5', '2025 P2 Q4'],
    marks: 6,
    route: '4 + 2 - the mean, the squared differences, substitution into the formula, the standard deviation, then a valid comparison of the means and one of the standard deviations',
    answerShape: 'text',
    webTopics: ['Comparing Calculated Statistics', 'Standard Deviation'],
    skill: 'Mean and standard deviation, then compare both with a second sample',
  },
  // The gap table called this "given the standard deviation, find the missing
  // values". It is not — five ratings are given and the standard deviation has
  // to be written as a√b/2. The 2 comes from sqrt(n-1) at n = 5.
  'data.sd-surd': {
    topic: 'Standard Deviation in Surd Form',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2017 P1 Q12'],
    marks: 4,
    route: 'find the mean, find the squared differences, substitute into the formula and start to evaluate, then state a and b',
    answerShape: 'integer',
    webTopics: ['Standard Deviation', 'Simplifying surds'],
    skill: 'Express the standard deviation of five values in the form a√b/2',
  },

  // Runs backwards, and bare: five tiny numbers with no story, where a is what
  // sits *under* the root. The scheme gives 2 out of 3 for answering the
  // standard deviation instead of the variance, which is the whole trap.
  'data.sd-find-a': {
    topic: 'Finding the Variance from a Surd',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2015 P1 Q5'],
    marks: 3,
    route: 'find the mean and the squared differences, substitute into the formula for a, then calculate a. The scheme takes either the deviations or the sums route',
    answerShape: 'integer',
    webTopics: ['Standard Deviation'],
    skill: 'Read the variance out of a standard deviation given as a root',
  },

  // ── Trigonometry, the parts needing no diagram — 15 questions ────────────
  'trig-equations.solve': {
    topic: 'Solving Trigonometric Equations',
    difficulty: 'exam', strategy: 'input-first', source: 'zeta+paper',
    basedOn: ['2014 P2 Q12', '2016 P2 Q14', '2018 P2 Q8', '2019 P2 Q14',
              '2022 P2 Q9', '2024 P2 Q11', '2026 P2 Q8'],
    marks: 3,
    route: 'rearrange the equation, find one value of x, then find the other. The two values are separate marks',
    answerShape: 'rounded',
    webTopics: ['Trigonometric equation'],
    skill: 'Isolate the ratio, take the inverse, then find both angles in the range',
  },
  // 2017 P2 Q15 is 1 + 1 + 4 and the other two are a flat 4. Its part (c) is
  // the solving shape exactly — substitute, rearrange, one value, the second —
  // and its parts (a) and (b) are the one-mark evaluations, so the two shapes
  // this generator makes line up with the parts rather than the question.
  'trig-equations.in-formula': {
    topic: 'Trigonometric Equations in a Formula',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2017 P2 Q15c', '2023 P2 Q11', '2025 P2 Q14'],
    marks: 4,
    route: 'substitute the given height into the formula, rearrange it, calculate one value of x, then the second',
    answerShape: 'rounded',
    webTopics: ['Trigonometric equation'],
    skill: 'Solve a given height formula for the angle, in a range',
  },
  'trig-equations.in-formula-evaluate': {
    topic: 'Trigonometric Equations in a Formula',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2017 P2 Q15a', '2017 P2 Q15b'],
    marks: 2,
    route: 'one mark for the height at the given angle, one for the minimum height. These are 2017 P2 Q15 parts (a) and (b)',
    answerShape: 'rounded',
    webTopics: ['Trigonometric equation'],
    skill: 'Evaluate a height formula at an angle, then state its minimum',
  },

  // The gap table lists three identity types. Reading the six questions there
  // are five distinct shapes, so they are built as four topics — the two tan
  // substitutions and the common-factor form share one, being the same move.
  'trig-identities.simplify': {
    topic: 'Simplifying Trigonometric Expressions',
    difficulty: 'exam', strategy: 'curated-pool', source: 'paper',
    basedOn: ['2016 P1 Q11', '2018 P1 Q18', '2023 P2 Q13', '2026 P2 Q12'],
    marks: 2,
    route: 'identify and substitute the correct identity, then express the result in simplest form',
    answerShape: 'expression',
    webTopics: ['Trigonometric identities'],
    skill: 'Replace tan with sin/cos, or take out a common factor, then use sin^2+cos^2=1',
  },
  'trig-identities.expand': {
    topic: 'Expanding Trigonometric Brackets',
    difficulty: 'exam', strategy: 'curated-pool', source: 'paper',
    basedOn: ['2019 P2 Q17'],
    marks: 2,
    route: 'expand the brackets, then simplify using sin squared plus cos squared equals one',
    answerShape: 'expression',
    webTopics: ['Trigonometric identities', 'Expanding brackets'],
    skill: 'Expand the square, then collect sin^2 + cos^2 into 1',
  },
  'trig-identities.fractions': {
    topic: 'Trigonometric Fractions',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2022 P2 Q13'],
    marks: 2,
    route: 'express as separate fractions, then simplify',
    answerShape: 'expression',
    webTopics: ['Trigonometric identities'],
    skill: 'Split into separate fractions, then simplify each',
  },
  'trig-identities.given-form': {
    topic: 'Writing in a Given Trigonometric Form',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2024 P2 Q16'],
    marks: 2,
    route: 'a valid substitution, then express the result in the form the question asks for',
    answerShape: 'expression',
    webTopics: ['Trigonometric identities'],
    skill: 'Substitute cos^2 = 1 - sin^2, then collect terms into the given form',
  },

  // ── Vectors — 9 paper questions, and NOT all the same idea ──────────────
  //
  // They were all listed here as component arithmetic. Reading the marking
  // instructions says otherwise: four of the nine are magnitude questions
  // (2015 P2 Q4, 2017 P2 Q1, 2018 P2 Q3, 2019 P2 Q2 — every one •¹ start the
  // process, •² solution) and belong to vectors.magnitude, which was sitting
  // with no citations at all. One more, 2016 P2 Q3, is a vector pathway worth a
  // single mark — a shape this generator does not produce, so it is recorded as
  // uncited in docs/n5-gap-table.md rather than pinned to something it is not.
  //
  // Nothing would have caught this. Eight of the nine are worth two marks, so
  // the mark counts agreed, and no check reads what a question is *about*.
  'vectors.add-from-grid': {
    topic: 'Adding Two Vectors Drawn on a Grid',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2015 P2 Q5'],
    marks: 2,
    route: 'components of either vector counted off the squares, then the components of the sum. The figure is a plain lattice with no axes and no numbers, so the components are on the drawing and nowhere else',
    answerShape: 'integer',
    webTopics: ['Adding and Subtracting vector components'],
    skill: 'Count two vectors off a square grid and add their components',
  },
  'vectors.draw-resultant': {
    topic: 'Drawing the Resultant of Two Vectors',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2025 P1 Q13'],
    marks: 2,
    route: 'the components of p+q (or a nose-to-tail diagram), then the resultant drawn consistently - and the scheme insists the arrow is what earns it: "must include arrow". The answer is the drawing, so the working ends by showing one, as the parabola sketches do',
    answerShape: 'text',
    webTopics: ['Adding and Subtracting vector components'],
    skill: 'Add two vectors in components and draw the resultant on a grid',
  },
  'vectors.components': {
    topic: 'Vector Components',
    difficulty: 'exam', strategy: 'input-first', source: 'zeta+paper',
    basedOn: ['2014 P1 Q4', '2016 P1 Q1', '2018 P1 Q4', '2024 P1 Q4'],
    marks: 2,
    route: 'calculate the scalar multiple, then the solution in component form. The second mark is withheld if the brackets are dropped or the answer is written as a coordinate',
    answerShape: 'expression',
    webTopics: ['Adding and Subtracting vector components'],
    skill: 'Scale two vectors and combine them, answering in component form',
  },
  'vectors.missing': {
    topic: 'Finding a Missing Vector',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2018 P1 Q4'],
    marks: 2,
    route: 'evidence of subtraction, then all components correct. One correct component counts as evidence for the first mark',
    answerShape: 'expression',
    webTopics: ['Adding and Subtracting vector components'],
    skill: 'Given u and u + v, subtract to find v',
  },

  // ── Straight Line — the papers ask two of Zeta's six diagram-free skills ─
  'straight-line.gradient-from-equation': {
    topic: 'Gradient from an Equation',
    difficulty: 'exam', strategy: 'input-first', source: 'zeta+paper',
    basedOn: ['2017 P2 Q11', '2024 P1 Q11'],
    marks: 2,
    route: 'isolate the term in y, or divide throughout, then state the gradient explicitly',
    answerShape: 'fraction',
    webTopics: ['Straight Line Equation'],
    skill: 'Rearrange into y = mx + c and read off the gradient',
  },
  'straight-line.intercept-from-equation': {
    topic: 'Intercept from an Equation',
    difficulty: 'exam', strategy: 'input-first', source: 'zeta+paper',
    basedOn: ['2018 P2 Q14'],
    marks: 2,
    route: 'substitute x = 0, or isolate the term in y, then state the coordinates. The scheme requires the brackets',
    answerShape: 'integer',
    webTopics: ['Coordinate Geometry with straight line equation', 'Straight Line Equation'],
    skill: 'Set x = 0 to find where the line crosses the y-axis',
  },
  'straight-line.gradient-two-points': {
    topic: 'Gradient from Two Points',
    difficulty: 'skill', strategy: 'input-first', source: 'zeta',
    basedOn: [],
    answerShape: 'fraction',
    webTopics: ['Straight Line Equation'],
    skill: 'Apply the gradient formula to two coordinates',
  },
  // The papers ask this three times and always with "give the equation in its
  // simplest form", which is what the third mark buys.
  'straight-line.equation-two-points': {
    topic: 'Equation of a Line from Two Points',
    difficulty: 'exam', strategy: 'input-first', source: 'zeta+paper',
    basedOn: ['2015 P1 Q8', '2017 P1 Q6', '2022 P1 Q6'],
    marks: 3,
    route: 'find the gradient, substitute it and a point, then state the equation in its simplest form',
    answerShape: 'expression',
    webTopics: ['Straight Line Equation'],
    skill: 'Find the equation of the line through two given points',
  },

  // ── Scientific Notation — 5 questions, all set in a context ─────────────
  // Zeta lists standard form as a skill the papers never ask alone, so the
  // conversion drill carries an empty basedOn and shows only under Skills.
  'sci-notation.convert': {
    topic: 'Writing in Scientific Notation',
    difficulty: 'skill', strategy: 'input-first', source: 'zeta',
    basedOn: [],
    answerShape: 'expression',
    webTopics: ['Scientific notation'],
    skill: 'Move the decimal point to write a number in standard form, or back',
  },
  // 2023 P2 Q2 asks for 3 significant figures for a third mark; the other four
  // give answers already at three, so it is applied throughout and the
  // instruction printed whenever the exact value needs it.
  'sci-notation.calculate': {
    topic: 'Calculating in Scientific Notation',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2016 P2 Q2', '2019 P2 Q4', '2024 P2 Q2', '2025 P2 Q3'],
    marks: 2,
    route: 'correct method, then evaluate and write in scientific notation',
    answerShape: 'rounded',
    webTopics: ['Scientific notation'],
    skill: 'Multiply, divide or take a percentage, then express in scientific notation',
  },
  // Rounding is a mark, not a flourish. 2023 P2 Q2 asks for three significant
  // figures and is worth three; the four above are worth two, with the
  // evaluation and the notation sharing the second.
  'sci-notation.calculate-3sf': {
    topic: 'Calculating in Scientific Notation',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2023 P2 Q2'],
    marks: 3,
    route: 'correct method, then evaluate, then express in scientific notation rounded to three significant figures',
    answerShape: 'rounded',
    webTopics: ['Scientific notation'],
    skill: 'As above, then round the answer to three significant figures',
  },

  // ── Pythagoras — the first topic whose questions carry a diagram ─────────
  // The question text and the figure are built from the same numbers, and
  // verifyFigure re-measures the drawing against them on every run.
  // ⚠️ This carries no paper citation, and the eight the gap table listed
  // against it are chord-in-a-circle problems, not labelled triangles — see
  // the note in docs/n5-gap-table.md. It is the Zeta drill, tiered honestly.
  'pythagoras.find-side': {
    topic: 'Pythagoras in a Right-Angled Triangle',
    difficulty: 'skill', strategy: 'answer-first', source: 'zeta',
    basedOn: [],
    answerShape: 'rounded',
    webTopics: [],
    skill: 'Form a Pythagoras statement from a labelled triangle and find the third side',
  },

  // ── Triangle trigonometry, the parts needing no diagram ─────────────────
  // Paper 1 asks all three without a picture, because without a calculator the
  // ratio has to be given and the answer has to come out whole. Those are
  // cloned directly. The Paper 2 versions carry a diagram but do not need one:
  // stated in words they are the skill tier, and the diagram versions follow
  // when the general-triangle routine exists.
  'cosine-rule.side-exact': {
    topic: 'Cosine Rule: Finding a Side',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2018 P1 Q10', '2023 P1 Q6'],
    marks: 3,
    route: 'correct substitution into the cosine rule, evaluate the square of the side, then take the root',
    answerShape: 'integer',
    webTopics: ['Cosine rule: calculate length'],
    skill: 'Substitute a given cosine into the cosine rule for an exact side',
  },
  'cosine-rule.angle-exact': {
    topic: 'Cosine Rule: Finding an Angle',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2022 P1 Q9'],
    marks: 2,
    route: 'correct substitution into the cosine rule, then calculate the cosine in its simplest form. Working the fraction out and simplifying it are one mark',
    answerShape: 'fraction',
    webTopics: ['Cosine rule: calculate angle'],
    skill: 'Rearrange the cosine rule and give the cosine as a fraction',
  },
  'sine-rule.side-exact': {
    topic: 'Sine Rule: Finding a Side',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2014 P1 Q5'],
    marks: 3,
    route: 'correct substitution into the sine rule, know how to solve it, then the correct calculation',
    answerShape: 'integer',
    webTopics: ['Sine rule: calculate length'],
    skill: 'Pair each side with its opposite angle, then multiply up',
  },
  'cosine-rule.side-degrees': {
    topic: 'Cosine Rule with a Given Angle',
    difficulty: 'skill', strategy: 'input-first', source: 'zeta',
    basedOn: [],
    answerShape: 'rounded',
    webTopics: ['Cosine rule: calculate length'],
    skill: 'Two sides and the angle between them, find the third side',
  },
  'sine-rule.side-degrees': {
    topic: 'Sine Rule with Given Angles',
    difficulty: 'skill', strategy: 'input-first', source: 'zeta',
    basedOn: [],
    answerShape: 'rounded',
    webTopics: ['Sine rule: calculate length'],
    skill: 'Two angles and a side, find another side',
  },
  'triangle-area.sine': {
    topic: 'Area of a Triangle',
    difficulty: 'skill', strategy: 'input-first', source: 'zeta',
    basedOn: [],
    answerShape: 'rounded',
    webTopics: ['Area of a Triangle'],
    skill: 'Area = 1/2 ab sin C, with the angle between the two sides',
  },

  // ── Rounding — the largest gap the practice audit found ─────────────────
  // 22 authored practice questions and nothing built against them. Zeta lists
  // decimal places and significant figures; the practice set adds counting the
  // figures a number already has, which is what the other two rest on.
  'rounding.count-sig-figs': {
    topic: 'Counting Significant Figures',
    difficulty: 'skill', strategy: 'input-first', source: 'zeta+practice',
    basedOn: [],
    answerShape: 'text',
    webTopics: [],
    skill: 'Count significant figures, knowing which zeros count',
  },
  'rounding.to-sig-figs': {
    topic: 'Rounding to Significant Figures',
    difficulty: 'skill', strategy: 'input-first', source: 'zeta+practice',
    basedOn: [],
    answerShape: 'rounded',
    webTopics: [],
    skill: 'Round to n significant figures, showing the zeros that carry precision',
  },
  'rounding.to-decimal-places': {
    topic: 'Rounding to Decimal Places',
    difficulty: 'skill', strategy: 'input-first', source: 'zeta',
    basedOn: [],
    answerShape: 'rounded',
    webTopics: [],
    skill: 'Round to n decimal places',
  },

  // ── Arcs, sectors and volume, stated in words ───────────────────────────
  // Both were missing entirely. maths.scot's own questions show they need no
  // picture, and they drill every rearrangement rather than only the forward
  // one — which is also what Zeta asks for under volume.
  'sector.arc-forward': {
    topic: 'Arc Length',
    difficulty: 'skill', strategy: 'input-first', source: 'zeta+practice',
    basedOn: [],
    answerShape: 'rounded',
    webTopics: ['Arc length'],
    skill: 'Take the angle as a fraction of 360 to find an arc length',
  },
  'sector.area-forward': {
    topic: 'Sector Area',
    difficulty: 'skill', strategy: 'input-first', source: 'zeta+practice',
    basedOn: [],
    answerShape: 'rounded',
    webTopics: ['Sector area'],
    skill: 'Take the angle as a fraction of 360 to find a sector area',
  },
  'sector.reverse': {
    topic: 'Finding a Missing Value in a Sector',
    difficulty: 'skill', strategy: 'input-first', source: 'practice',
    basedOn: [],
    answerShape: 'rounded',
    webTopics: ['Sector area', 'Arc length'],
    skill: 'Rearrange the arc or area formula for the angle or the radius',
  },
  'volume.forward': {
    topic: 'Volume of a Solid',
    difficulty: 'skill', strategy: 'input-first', source: 'zeta+practice',
    basedOn: [],
    answerShape: 'rounded',
    webTopics: ['Volume - simple shape'],
    skill: 'Substitute into the volume formula for a cylinder, cone, sphere or hemisphere',
  },
  'volume.reverse': {
    topic: 'Finding a Missing Dimension from a Volume',
    difficulty: 'skill', strategy: 'answer-first', source: 'zeta+practice',
    basedOn: [],
    answerShape: 'rounded',
    webTopics: ['Volume - simple shape'],
    skill: 'Rearrange a volume formula to find a missing radius or height',
  },

  // ── Volume at exam level — thirteen paper questions, one per shape ───────
  //
  // Split by shape rather than by mark total, even where the marking
  // instructions are word for word the same. Three of the five-mark ones share
  // a scheme exactly, so one variation with three pictures would have checked
  // out; but `basedOn` is what answers "more like this paper question", and a
  // pupil asking for more like the coated sweet would have been handed a
  // truncated cone. That is the failure the vector entries already made once.
  'volume.sphere': {
    topic: 'Volume of a Sphere',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2018 P2 Q7', '2025 P2 Q2'],
    answerShape: 'rounded',
    webTopics: ['Volume - simple shape'],
    skill: 'Halve the diameter, substitute into the volume of a sphere, and round',
    marks: 3,
    route: 'substitute, evaluate, round — the scheme exactly',
  },
  'volume.sphere-scientific': {
    topic: 'A Volume in Scientific Notation',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2015 P2 Q6'],
    answerShape: 'rounded',
    webTopics: ['Volume - simple shape', 'Scientific notation'],
    skill: 'Give a sphere\'s volume in scientific notation, then divide two such volumes',
    marks: 5,
    route: '3 for the volume in scientific notation, 2 for the division',
  },
  'volume.cone-approx-pi': {
    topic: 'Volume of a Cone',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2022 P1 Q3'],
    answerShape: 'rounded',
    webTopics: ['Volume - simple shape'],
    skill: 'Volume of a cone with pi taken as 3.14, without a calculator',
    marks: 2,
    // The scheme requires "a product of at least four numbers including a
    // fraction and 3.14" for the second mark, so the working shows the
    // fraction and the pi separately rather than folding them together.
    route: 'substitute then calculate, keeping the fraction and 3.14 visible',
  },
  'volume.pyramid-height': {
    topic: 'The Height of a Pyramid',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2018 P1 Q17'],
    answerShape: 'rounded',
    webTopics: ['Volume - simple shape'],
    skill: 'Find the height of a square-based pyramid from its volume',
    marks: 3,
    // Method 1 of the two the scheme accepts: substitute and solve, rather
    // than change the subject first. Its note requires the final division to
    // be by a number greater than 10, which the base area always is here.
    route: 'substitute into V = Ah/3 and solve, the scheme\'s method 1',
  },
  'volume.sphere-cone-equal': {
    topic: 'A Cone Matching a Sphere',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2026 P2 Q6'],
    answerShape: 'rounded',
    webTopics: ['Volume - simple shape'],
    skill: 'Find the height of a cone with the same volume as a given sphere',
    marks: 5,
    marksInferred: true,
    route: '2 for the sphere, 3 for the cone — read off the pattern the other years set',
  },
  'volume.cone-minus-hemisphere': {
    topic: 'A Cone with a Hemisphere Removed',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2014 P2 Q7'],
    answerShape: 'rounded',
    webTopics: ['Volume - composite shape'],
    skill: 'Subtract the volume of a hemisphere from the volume of a cone',
    marks: 5,
    route: 'cone, hemisphere, know to subtract, calculate, round',
  },
  'volume.cone-minus-cone': {
    topic: 'A Cone with its Tip Removed',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2016 P2 Q7'],
    answerShape: 'rounded',
    webTopics: ['Volume - composite shape'],
    skill: 'Subtract a similar cone from a cone to find the volume of a frustum',
    marks: 5,
    route: 'know it is a difference, large cone, small cone, calculate, round',
  },
  'volume.sphere-shell': {
    topic: 'The Coating on a Sphere',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2017 P2 Q6'],
    answerShape: 'rounded',
    webTopics: ['Volume - composite shape'],
    skill: 'Find the volume of a coating from the outer diameter and its thickness',
    marks: 5,
    route: 'know it is a difference, outer sphere, inner sphere, calculate, round',
  },
  'volume.cylinder-plus-hemisphere': {
    topic: 'A Cylinder with a Dome on Top',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2019 P2 Q8'],
    answerShape: 'rounded',
    webTopics: ['Volume - composite shape'],
    skill: 'Add a hemisphere to a cylinder, working the cylinder\'s height out of the total',
    marks: 5,
    route: 'hemisphere, cylinder, know to add, calculate, round',
  },
  'volume.box-plus-sphere': {
    topic: 'A Box with a Sphere on Top',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2022 P2 Q3'],
    answerShape: 'rounded',
    webTopics: ['Volume - composite shape'],
    skill: 'Add a sphere to a cuboid, working the cuboid\'s height out of the total',
    marks: 3,
    route: 'sphere, cuboid and add, calculate with units — three marks, not five',
  },
  'volume.pyramid-minus-pyramid': {
    topic: 'A Pyramid with its Tip Removed',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2023 P2 Q9'],
    answerShape: 'integer',
    webTopics: ['Volume - composite shape'],
    skill: 'Subtract a similar pyramid from a pyramid, finding the large height first',
    marks: 4,
    route: 'small pyramid, large pyramid, know to subtract, calculate with units',
  },
  'volume.box-minus-hemisphere': {
    topic: 'A Hemisphere Set into a Box',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2024 P2 Q7'],
    answerShape: 'rounded',
    webTopics: ['Volume - composite shape'],
    skill: 'Subtract a hemisphere from a cuboid',
    marks: 4,
    route: 'hemisphere, cuboid and subtract, calculate, round',
  },

  // ── Linear equations — the most fundamental algebra in the course, and it
  // had no topic at all. The name-matching audit passed it because "equations"
  // appears in Solving Simultaneous Equations: a match on a word is not a
  // match on a skill. maths.scot's nine questions are a full progression.
  'linear-equations.basic': {
    topic: 'Solving Linear Equations',
    difficulty: 'skill', strategy: 'input-first', source: 'zeta+practice',
    basedOn: [],
    answerShape: 'fraction',
    webTopics: ['Linear equations and inequations'],
    skill: 'Gather the unknowns on one side and the numbers on the other',
  },
  'linear-equations.brackets': {
    topic: 'Equations with Brackets',
    difficulty: 'skill', strategy: 'input-first', source: 'zeta+practice',
    basedOn: [],
    answerShape: 'fraction',
    webTopics: ['Linear equations and inequations'],
    skill: 'Expand the bracket first, then solve',
  },
  'linear-equations.fractions': {
    topic: 'Equations with Fractions',
    difficulty: 'skill', strategy: 'input-first', source: 'practice',
    basedOn: [],
    answerShape: 'fraction',
    webTopics: ['Linear equations and inequations'],
    skill: 'Multiply through to clear the denominators, then solve',
  },
  // The shape the papers actually set, which the drill above does not: a
  // fraction *and a whole term*. Cross-multiplication clears two fractions in
  // one move and is no use at all once a whole term is in it — every term has
  // to be multiplied by the lowest common multiple, and that is the first mark.
  'linear-equations.clear-denominators': {
    topic: 'Clearing Denominators in an Equation',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2016 P1 Q8', '2019 P1 Q14', '2025 P2 Q13'],
    marks: 3,
    route: 'eliminate the denominators, rearrange into ax = b, solve. 2016 P1 Q8 note 2 requires a non-integer answer, so one is guaranteed',
    answerShape: 'fraction',
    webTopics: ['Linear equations and inequations'],
    skill: 'Multiply every term by the lowest common multiple, then solve',
  },

  // ── forming an equation out of a shape — the five with figures ──────────
  //
  // Same three moves every time (write an expression, make it an equation,
  // solve it) and no two worth the same marks, because what the last part
  // costs depends on how it is solved: the quadratic formula is four marks,
  // factorising is three, and a linear equation is four spread differently.
  'form-equation.border': {
    topic: 'A Border Round a Rectangle',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2015 P2 Q14'],
    marks: 7,
    route: '1 for the expression, 2 for the area and the rearrangement, 4 for the formula: substitute, discriminant, solve, select and round',
    answerShape: 'rounded',
    webTopics: ['Create equation in geometric context', 'Quadratic formula'],
    skill: 'Turn a border of width x into a quadratic, then solve it',
  },
  'form-equation.three-sided': {
    topic: 'A Wall on Three Sides',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2026 P2 Q13'],
    marks: 7,
    marksInferred: true,
    route: 'the 1 + 2 + 4 the question data gives, split as 2015 P2 Q14 splits its identical parts',
    answerShape: 'rounded',
    webTopics: ['Create equation in geometric context', 'Quadratic formula'],
    skill: 'A wall on three sides grows the length twice and the width once',
  },
  'form-equation.triangle-rectangle': {
    topic: 'A Triangle Against a Rectangle',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2022 P1 Q15'],
    marks: 5,
    // Two of the scheme's notes are constraints on the numbers, not on the
    // working: the triangle's area expression must contain a fraction, so the
    // height is always odd; and the final division must not be by a single
    // digit, so the collected coefficient is always at least ten.
    route: '1 for the triangle area, then 4: equate, start to solve, rearrange, solve',
    answerShape: 'integer',
    webTopics: ['Linear equations and inequations', 'Create equation in geometric context'],
    skill: 'Equate a triangle and a rectangle, clear the fraction, solve',
  },
  'form-equation.rectangle-square': {
    topic: 'A Rectangle Against a Square',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2025 P1 Q15'],
    marks: 6,
    route: '1 for the area, 2 for the expansion and rearrangement, 3 for factorising, solving and rejecting the negative root',
    answerShape: 'integer',
    webTopics: ['Create equation in geometric context', 'Quadratic equation by factorising'],
    skill: 'Equate two areas, factorise, and reject the root that is not a length',
  },
  'form-equation.rectangle-triangle': {
    topic: 'A Rectangle Against a Triangle',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2016 P1 Q12'],
    marks: 7,
    route: '1 + 3 + 3 - an expression for the rectangle, then the two areas expanded separately and equated into the printed quadratic, then factorise, solve and reject. Distinct from form-equation.triangle-rectangle (2022 P1 Q15, 1 + 4) because the middle part is a show that and the scheme buys each expansion on its own',
    answerShape: 'integer',
    webTopics: ['Quadratic equation by factorising', 'Create equation in geometric context'],
    skill: 'Derive a quadratic from two equal areas, then solve it for the sides',
  },
  'form-equation.cuboid': {
    topic: 'A Cuboid of Given Volume',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2023 P2 Q14'],
    marks: 6,
    route: '2 for the volume expression and the rearrangement, 4 for the formula',
    answerShape: 'rounded',
    webTopics: ['Create equation in geometric context', 'Quadratic formula'],
    skill: 'Turn a cuboid volume into a quadratic, then solve it',
  },

  // Magnitude was written up as a practice-only skill with no paper behind it.
  // It has four: 2015 P2 Q4, 2017 P2 Q1, 2018 P2 Q3 and 2019 P2 Q2 are all
  // "find |v|", all two marks, and all were mis-filed under vectors.components.
  // All four papers come out whole — (6, -13, 18) is 23, (24, -12, 8) is 28 —
  // and the two marks are two marks *because* there is no surd to simplify.
  // Drawn from a pool for that reason: whole-number magnitudes in three
  // dimensions are sparse enough that rejecting until one appeared would spend
  // nearly every attempt failing.
  'vectors.magnitude': {
    topic: 'Magnitude of a Vector',
    difficulty: 'exam', strategy: 'curated-pool', source: 'zeta+paper',
    basedOn: ['2015 P2 Q4', '2017 P2 Q1', '2018 P2 Q3', '2019 P2 Q2'],
    marks: 2,
    route: 'start the process by squaring and adding the components, then the solution',
    answerShape: 'integer',
    webTopics: ['Magnitude'],
    skill: 'Square the components, add, and take an exact square root',
  },
  // 2026 P1 Q7 is the same question with a surd for an answer, and worth three
  // — the extra mark is the simplification, which is why the question data
  // tags it under Simplifying Surds as well.
  'vectors.magnitude-surd': {
    topic: 'Magnitude as a Surd',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2026 P1 Q7'],
    marks: 3,
    marksInferred: true,
    route: 'square and add, take the root, simplify the surd — one mark per skill the answer needs',
    answerShape: 'surd',
    webTopics: ['Magnitude', 'Simplifying surds'],
    skill: 'Find a magnitude that does not come out whole, and simplify it',
  },
  // The pathway is a mark of its own: the scheme reads "valid pathway", then
  // "consistent components". Getting to Q the long way and slipping on the
  // arithmetic still earns the first.
  'vectors.components-midpoint': {
    topic: 'A Pathway in Components',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2019 P1 Q10'],
    marks: 3,
    route: '1 for the direct pathway, then 2: a valid pathway through the midpoint, then consistent components',
    answerShape: 'expression',
    webTopics: ['Vector pathways', 'Adding and Subtracting vector components'],
    skill: 'Follow a pathway through a midpoint, in component form',
  },

  // ── vector pathways — the five that give a figure and two arrows ────────
  //
  // Every point in these is defined as a combination of the two named vectors
  // and the figure is drawn by evaluating those combinations, so the picture
  // and the algebra are the same arithmetic read twice. Four of the five come
  // out at the papers' own printed answers, which is the evidence the
  // constructions are read right.
  'vectors.pathway-parallelogram': {
    topic: 'A Pathway in a Parallelogram',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2016 P2 Q3'],
    marks: 1,
    route: 'one mark, one step: the route round two sides of the parallelogram',
    answerShape: 'expression',
    webTopics: ['Vector pathways'],
    skill: 'Express a diagonal of a parallelogram in terms of two sides',
  },
  'vectors.pathway-extended': {
    topic: 'A Pathway with an Extended Side',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2017 P2 Q8'],
    marks: 3,
    route: '1 for the direct route, then 2: the pathway through the extension and the midpoint, then collecting it',
    answerShape: 'expression',
    webTopics: ['Vector pathways'],
    skill: 'Use an extended side and a midpoint to reach a fourth point',
  },
  'vectors.pathway-multiples': {
    topic: 'A Pathway with Multiples',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2018 P2 Q10'],
    marks: 2,
    route: 'the pathway the long way round, then writing each piece as a multiple and collecting',
    answerShape: 'expression',
    webTopics: ['Vector pathways'],
    skill: 'Follow a route of four edges, two of them multiples of the given pair',
  },
  // ⚠️ Modelled rather than copied. SQA's printed answer to part (b) implies a
  // labelling of the rhombus that only its diagram settles: read WXYZ as the
  // cyclic order with ZX a diagonal, and the midpoint of XY gives b - 3a/2,
  // not the b - a/2 they print. The generated question states its own
  // configuration in the prose, so it is self-contained and right about
  // itself; correct it against the figure when the diagram is to hand.
  'vectors.pathway-rhombus': {
    topic: 'A Pathway in a Rhombus',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2024 P2 Q14'],
    marks: 3,
    route: '1 for the side from the diagonal, then 2: the pathway through the midpoint, then collecting it',
    answerShape: 'expression',
    webTopics: ['Vector pathways'],
    skill: 'Use a diagonal and a midpoint to cross a rhombus',
  },
  'vectors.pathway-running-on': {
    topic: 'A Pathway Running On',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2025 P2 Q15'],
    marks: 2,
    route: 'the base as a sum and the fraction of it beyond the end, then the route from the third point',
    answerShape: 'expression',
    webTopics: ['Vector pathways'],
    skill: 'Continue past a point by a fraction of the line already travelled',
  },

  // ── coordinates off a solid on the axes — 2 marks each, no working ──────
  //
  // Three of the four schemes carry the same note: at most one mark of the two
  // where the brackets are dropped or the answer is given in component form.
  // So these always answer as coordinates and never as columns.
  'coords.lettered-cuboid': {
    topic: 'A Lettered Cuboid and a Midpoint',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2026 P1 Q11'],
    marks: 2, marksInferred: true,
    route: '1 + 1 - state G, then state the midpoint of CD. The only one of the five where a coordinate is computed rather than read off, and the only one that letters every vertex: eleven labels on a projected box, which is what the label-placement work in place() was for',
    answerShape: 'integer',
    webTopics: ['3d Coordinates'],
    skill: 'Read coordinates off a fully lettered cuboid, and find a midpoint on one edge',
  },
  'coords.cube-on-cuboid': {
    topic: 'Coordinates of a Cube on a Cuboid',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2014 P2 Q2'],
    marks: 2,
    route: 'state one coordinate, state the other',
    answerShape: 'text',
    webTopics: ['3d Coordinates'],
    skill: 'Read a coordinate off a solid standing on another',
  },
  'coords.pyramid-on-cube': {
    topic: 'Coordinates of a Pyramid on a Cube',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2017 P1 Q5'],
    marks: 2,
    route: 'state one coordinate, state the other',
    answerShape: 'text',
    webTopics: ['3d Coordinates'],
    skill: 'Find the apex of a pyramid over the centre of the solid beneath it',
  },
  'coords.prism': {
    topic: 'Coordinates of a Triangular Prism',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2018 P1 Q13'],
    marks: 2,
    route: 'state one coordinate, state the other',
    answerShape: 'text',
    webTopics: ['3d Coordinates'],
    skill: 'Use an isosceles cross-section to place the far corner of a prism',
  },
  'coords.cone': {
    topic: 'Coordinates on a Cone',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2019 P2 Q5'],
    marks: 2,
    route: 'state one coordinate, state the other',
    answerShape: 'text',
    webTopics: ['3d Coordinates'],
    skill: 'Place a circle from the two axes it touches, then a point above it',
  },

  // ── the rest of the straight line and the related angles ────────────────
  //
  // 2014 P1 Q11 is one question in two parts worth 2 + 2, and the second is
  // the *x*-axis, which no other paper asks for. Its own variation rather than
  // two two-mark ones stapled together: the pupil meets the same equation
  // twice, which is the point of setting it that way.
  'straight-line.gradient-and-x-intercept': {
    topic: 'Gradient and the x-axis Crossing',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2014 P1 Q11'],
    marks: 4,
    route: '2 for starting the rearrangement and stating the gradient, 2 for knowing to set y = 0 and stating the coordinates - the scheme requires the brackets',
    answerShape: 'expression',
    webTopics: ['Coordinate Geometry with straight line equation', 'Straight Line Equation'],
    skill: 'Rearrange for the gradient, then find where the line meets the x-axis',
  },
  // One mark and nothing to calculate: the value is handed over so that the
  // only difficulty is which quadrant the angle lands in and what that does to
  // the sign.
  'trig.related-angle': {
    topic: 'The Value at a Related Angle',
    difficulty: 'exam', strategy: 'curated-pool', source: 'paper',
    basedOn: ['2018 P1 Q12', '2023 P1 Q11'],
    marks: 1,
    route: 'state the value - one mark, and the scheme asks for nothing else',
    answerShape: 'rounded',
    webTopics: ['sin/cos/tan of related angles'],
    skill: 'Use the quadrant to put the right sign on a known trigonometric value',
  },
  // The second mark is for *saying why*. An ordering with no justification
  // scores one of the two, so the reason is a step of its own.
  'trig.order-by-size': {
    topic: 'Ordering Trigonometric Values',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2015 P1 Q9'],
    marks: 2,
    route: 'state the correct order, then justify it explicitly by the sign of each value',
    answerShape: 'text',
    webTopics: ['sin/cos/tan of related angles'],
    skill: 'Order trigonometric values by sign, and say why',
  },
  // maths.scot's |a - b|, which the papers have never asked. It takes a third
  // step, since the subtraction comes first, so it cannot share a mark total
  // with the paper shape above.
  'vectors.magnitude-difference': {
    topic: 'Magnitude of a Vector',
    difficulty: 'skill', strategy: 'answer-first', source: 'zeta+practice',
    basedOn: [],
    answerShape: 'surd',
    webTopics: ['Magnitude', 'Adding and Subtracting vector components'],
    skill: 'Subtract two vectors, then find the magnitude of the result',
  },

  // The shape those eight questions actually are. Four marks, because the
  // right-angled triangle is not part of the object — the pupil produces it by
  // dropping a perpendicular from the centre to the chord, which bisects it.
  'pythagoras.chord': {
    topic: 'Pythagoras in a Circle',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2014 P1 Q12', '2015 P2 Q12', '2016 P2 Q15', '2017 P2 Q13',
              '2018 P2 Q12', '2019 P2 Q18', '2022 P2 Q8', '2023 P1 Q10',
              '2024 P2 Q10'],
    marks: 4,
    route: 'marshal the facts and recognise the right-angled triangle, then a consistent Pythagoras statement, then calculate the third side, then the length asked for',
    answerShape: 'rounded',
    webTopics: ['Pythagoras in circle diagrams'],
    skill: 'Drop a perpendicular to the chord, use Pythagoras, add or subtract the radius',
  },

  // The diagram carries no right-angle mark, because whether there is one is
  // the answer. 2026 P2 Q7 asks it with no context and no diagram at all.
  'pythagoras.converse': {
    topic: 'The Converse of Pythagoras',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2014 P2 Q6', '2023 P2 Q8', '2026 P2 Q7'],
    marks: 4,
    marksDiffer: { '2026 P2 Q7': 3 },
    route: 'valid strategy, then evaluation, then an explicit comparison, then a conclusion with a valid reason. 2026 P2 Q7 is three marks, merging the comparison and the conclusion; the schemes all accept the cosine rule instead',
    answerShape: 'text',
    webTopics: ['Pythagoras converse'],
    skill: 'Compare the two shorter sides squared with the longest squared, and conclude',
  },
  // 2017 P2 Q7 moved OUT of the entry above and into its own.
  //
  // It was cited there and its presentation was never produced: the paper gives
  // two triangles separately, with their own side lengths and a shared edge,
  // then places them together and asks about the composite. No length is in the
  // prose at all, and the base has to be formed from the two handed over before
  // the converse can be applied. `presentations.ts` could not see it until its
  // figure features were fixed - they had never fired.
  //
  // The same split `converse-from-total` makes, for the same reason: an extra
  // step in front of the same test is a different question, not a coin toss
  // inside one.
  'pythagoras.converse-joined': {
    topic: 'The Converse of Pythagoras',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2017 P2 Q7'],
    marks: 3,
    route: 'form the composite base from its two parts, then a valid strategy and an evaluation, with the comparison and the conclusion together in the third mark rather than separately - three marks, one fewer than the four-mark converse papers',
    answerShape: 'text',
    webTopics: ['Pythagoras converse'],
    skill: 'Two triangles joined along a shared edge: build the base, then test the composite',
  },
  'pythagoras.converse-from-total': {
    topic: 'The Converse of Pythagoras',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2019 P2 Q11'],
    marks: 4,
    route: 'find the third distance from the total, then the same four: strategy, evaluation, an explicit comparison, and a conclusion with a valid reason',
    answerShape: 'text',
    webTopics: ['Pythagoras converse'],
    skill: 'The same, but one distance has to be found from the total first',
  },

  // The same circle-and-chord figure with a different piece missing: 2014 gives
  // the radius and the height and wants the chord; 2026 gives the chord and the
  // perpendicular and wants the radius.
  'pythagoras.chord-reverse': {
    topic: 'Finding a Chord or Radius in a Circle',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2014 P1 Q12'],
    marks: 4,
    route: 'marshal the facts and recognise the right angle, know how to use Pythagoras, the correct calculation, then the length asked for. The first mark is getting the perpendicular out of the height, which is what makes this four rather than three',
    answerShape: 'rounded',
    webTopics: ['Pythagoras in circle diagrams'],
    skill: 'Use the bisected chord and Pythagoras to find the chord',
  },
  'pythagoras.chord-radius': {
    topic: 'Finding the Radius from a Chord',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2026 P2 Q5'],
    marks: 3, marksInferred: true,
    route: 'inferred, no published 2026 scheme: halve the chord, state Pythagoras with the radius as the hypotenuse, then evaluate and take the root. Three rather than four because the perpendicular is given outright',
    answerShape: 'rounded',
    webTopics: ['Pythagoras in circle diagrams'],
    skill: 'Use the bisected chord and Pythagoras to find the radius',
  },

  // Two applications of Pythagoras — across the base, then up to the far top
  // corner — and the markscheme pays for each separately, so the working shows
  // them as two steps rather than one square root.
  'pythagoras.space-diagonal': {
    topic: 'The Space Diagonal of a Cuboid',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2022 P2 Q11'],
    marks: 3,
    route: 'start the strategy with the face diagonal, continue it to the space diagonal, then calculate its length',
    answerShape: 'rounded',
    webTopics: ['Pythagoras in 3d'],
    skill: 'Face diagonal first, then the space diagonal',
  },
  // "Will it fit?" is a fourth mark — a valid conclusion with the comparison —
  // so 2018 P2 Q16 is four marks where 2022 P2 Q11, which stops at the
  // diagonal, is three.
  'pythagoras.space-diagonal-fits': {
    topic: 'The Space Diagonal of a Cuboid',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2018 P2 Q16'],
    marks: 4,
    route: 'as above, then a valid conclusion with the comparison against the object\'s length',
    answerShape: 'text',
    webTopics: ['Pythagoras in 3d'],
    skill: 'Space diagonal, then decide whether an object fits inside',
  },

  // Write down a vertex, then Pythagoras in three dimensions. The solid is
  // drawn on axes because part (a) is unanswerable without them.
  // KNOWN BIAS: the cuboid and the pyramid are chosen evenly, but the cuboid
  // lays out far less often — 9% of finished questions against an intended 50%.
  // Eight corner labels on a projected box crowd the edges, and the layouts
  // that survive are the lucky proportions rather than a fair sample. Worth
  // fixing by giving the projection more depth separation, not by relaxing the
  // clearance rule.
  'pythagoras.coordinates-cuboid': {
    topic: '3D Coordinates and Lengths',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2025 P2 Q8'],
    marks: 4,
    route: '1 + 3 - state the coordinates, then start a valid strategy, continue it, and calculate the length of the space diagonal',
    answerShape: 'rounded',
    webTopics: ['Pythagoras in 3d', '3d Coordinates'],
    skill: 'Read a vertex off a cuboid on axes, then find a space diagonal',
  },
  'pythagoras.coordinates-pyramid': {
    topic: '3D Coordinates and Lengths',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2016 P1 Q7'],
    marks: 4,
    route: '1 + 3 - state the coordinates of B, then know how to find AM squared, know how to find AV, and find the length of AV',
    answerShape: 'rounded',
    webTopics: ['3d Coordinates', 'Pythagoras in 3d', 'Magnitude'],
    skill: 'The apex of a pyramid sits above the centre of its base',
  },

  // Three arrangements, each read off its paper diagram. 2017 states AB as
  // 48 cm with a radius of 14, which cannot be a chord — only the picture
  // shows AB is the two straight edges end to end.
  // Three arrangements, each read off its own paper diagram, and each its own
  // variation so that one of them going missing is visible.
  'pythagoras.two-circles-overlap': {
    topic: 'Pythagoras with Two Circles',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2024 P2 Q10'],
    marks: 4,
    route: 'marshal the facts and recognise the right-angled triangle, a consistent Pythagoras statement, the third side, then the width asked for',
    answerShape: 'rounded',
    webTopics: ['Pythagoras in circle diagrams'],
    skill: 'Two equal circles overlapping, each centre on the other circle',
  },
  'pythagoras.two-circles-half-turn': {
    topic: 'Pythagoras with Two Circles',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2017 P2 Q13'],
    marks: 4,
    route: 'marshal the facts and recognise the right-angled triangle, a consistent Pythagoras statement, the third side, then the height asked for',
    answerShape: 'rounded',
    webTopics: ['Pythagoras in circle diagrams'],
    skill: 'A logo of two half-circles, the straight edges end to end',
  },
  'pythagoras.two-circles-snowman': {
    topic: 'Pythagoras with Two Circles',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2019 P2 Q18'],
    marks: 4,
    route: 'marshal the facts and recognise the right-angled triangle, a consistent Pythagoras statement, the third side, then the height asked for',
    answerShape: 'rounded',
    webTopics: ['Pythagoras in circle diagrams'],
    skill: 'A small circle resting on a larger one, total height from the radii',
  },

  // ── the triangle-trig questions that carry a diagram ─────────────────────
  // Paper 1 states its triangles in words; Paper 2 draws them, and the drawing
  // is not decoration — 2015 P2 Q3 and 2019 P2 Q7 put every number on the
  // figure and say only "Triangle ABC is shown below."
  'trig-diagram.cosine-side': {
    topic: 'Cosine Rule from a Diagram',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2015 P2 Q3', '2017 P2 Q3', '2026 P2 Q2'],
    marks: 3,
    route: 'correct substitution into the cosine rule, evaluate the square of the side, then take the root',
    answerShape: 'rounded',
    webTopics: ['Cosine rule: calculate length'],
    skill: 'Two sides and the angle between them, find the third side',
  },
  'trig-diagram.cosine-angle': {
    topic: 'Cosine Rule from a Diagram',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2019 P2 Q7', '2024 P2 Q3'],
    marks: 3,
    route: 'correct substitution into the cosine rule, evaluate the cosine, then calculate the angle. Identifying which angle is wanted earns nothing',
    answerShape: 'rounded',
    webTopics: ['Cosine rule: calculate angle'],
    skill: 'Three sides, find an angle — often the smallest',
  },
  'trig-diagram.sine-angle': {
    topic: 'Sine Rule from a Diagram',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    // 2016 P2 Q8 is a set of stepladders rather than a lettered triangle,
    // but it is this question: two lengths and the angle at the foot of one
    // of them, find the angle at the foot of the other.
    basedOn: ['2023 P2 Q4', '2016 P2 Q8'],
    marks: 3,
    route: 'correct substitution into the sine rule, rearrange it, then calculate the angle',
    answerShape: 'rounded',
    webTopics: ['Sine rule: calculate angle'],
    skill: 'Pair each side with its opposite angle, then find the acute angle',
  },
  'trig-diagram.area': {
    topic: 'Area of a Triangle from a Diagram',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2019 P2 Q3', '2022 P2 Q6'],
    marks: 2,
    route: 'correct substitution into the area of a triangle formula, then calculate the area',
    answerShape: 'rounded',
    webTopics: ['Area of a Triangle'],
    skill: 'Half ab sin C, with the angle between the two given sides',
  },

  // ── navigation ───────────────────────────────────────────────────────────
  // The sine and cosine rules with a step bolted on at each end: the angle is
  // never given, and the answer is usually wanted back as a bearing.
  'bearings.two-bearings': {
    topic: 'Bearings with the Sine Rule',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2015 P2 Q13', '2017 P2 Q10'],
    marks: 4,
    route: 'calculate the angles of the triangle from the bearings, correct substitution into the sine rule, rearrange it, then calculate the side',
    answerShape: 'rounded',
    webTopics: ['Sine rule: calculate length', 'Bearings in Trigonometry questions'],
    skill: 'Two places on a cardinal line, a bearing from each, find a distance',
  },
  // 2014 P2 Q10 is 3 + 2 and 2018 P2 Q13 is a flat 4, so they are not the same
  // question: 2014 pays two marks for the second angle where 2018 pays one for
  // turning the angle into a bearing. Part (a) is this variation exactly; 2014's
  // part (b) is an open row in the gap table.
  'bearings.three-sides-angle': {
    topic: 'Bearings with the Cosine Rule',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2014 P2 Q10'],
    marks: 5,
    route: '3 + 2 - substitute into the cosine rule, calculate the cosine, calculate the angle; then the back bearing and the shaded angle. It cited 2014 P2 Q10a and stopped at part (a), leaving two of the five marks uncloned. Distinct from bearings.three-sides-bearing (2018 P2 Q13), where the bearing is a single fourth mark rather than a two-mark part',
    answerShape: 'rounded',
    webTopics: ['Cosine rule: calculate angle', 'Bearings in Trigonometry questions'],
    skill: 'Three distances on a map, find the angle at one of them',
  },
  'bearings.three-sides-bearing': {
    topic: 'Finding a Bearing',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2018 P2 Q13'],
    marks: 4,
    route: 'correct substitution into the cosine rule, calculate the cosine, calculate the angle, then calculate the bearing',
    answerShape: 'rounded',
    webTopics: ['Cosine rule: calculate angle', 'Bearings in Trigonometry questions'],
    skill: 'Cosine rule for the angle, then add or subtract from a given bearing',
  },
  'bearings.two-sides': {
    topic: 'Finding a Bearing',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2025 P2 Q12'],
    marks: 4,
    route: 'correct substitution into the sine rule, rearrange the equation, calculate the angle, then calculate the bearing. The angle read off the given bearings is not paid for separately',
    answerShape: 'rounded',
    webTopics: ['Sine rule: calculate angle', 'Bearings in Trigonometry questions'],
    skill: 'Sine rule for the angle, then turn it back into a bearing',
  },

  // ── the five-mark composites ─────────────────────────────────────────────
  // Neither triangle has enough in it alone.
  'composite.height-from-two-angles': {
    topic: 'Two Angles of Elevation',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2019 P2 Q19'],
    marks: 5,
    route: 'correct substitution into the sine rule, rearrange it, calculate the intermediate length, consistent substitution into the right-angled trig formula, then calculate the height',
    answerShape: 'rounded',
    webTopics: ['Sine rule: calculate length'],
    skill: 'Two elevations from the ends of a base, find the height between them',
  },
  'composite.perpendicular-in-triangle': {
    topic: 'A Perpendicular Inside a Triangle',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2024 P2 Q13'],
    marks: 5,
    route: 'correct substitution into the sine rule, rearrange it, calculate the intermediate length, consistent substitution into the right-angled trig formula, then calculate the perpendicular',
    answerShape: 'rounded',
    webTopics: ['Sine rule: calculate length'],
    skill: 'Sine rule for a slant side, then the right angle at the foot',
  },
  'composite.two-elevations': {
    topic: 'Two Angles of Elevation',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2022 P2 Q14'],
    marks: 5,
    route: 'correct substitution into the sine rule, rearrange, calculate the slant length, then a valid strategy for the ground distance, then calculate it',
    answerShape: 'rounded',
    webTopics: ['Sine rule: calculate length'],
    skill: 'Two elevations from one side, using the angle on a straight line',
  },

  // Two triangles sharing the angle at a corner: the small right-angled one
  // supplies it, the large one spends it. The same figure both times.
  'composite.split-side-cosine': {
    topic: 'Two Triangles Sharing an Angle',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2016 P2 Q16'],
    marks: 4,
    route: 'identify the cosine of the shared angle, substitute into the cosine rule, calculate the square of the side, then calculate the side',
    answerShape: 'rounded',
    webTopics: ['Cosine rule: calculate length'],
    skill: 'Cosine from the small triangle, then the cosine rule in the large one',
  },
  'composite.split-side-area': {
    topic: 'Two Triangles Sharing an Angle',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2023 P2 Q15'],
    marks: 4,
    route: 'the correct trig ratio, correct substitution into the area of a triangle formula, form the equation, then solve it for the length',
    answerShape: 'integer',
    webTopics: ['Area of a Triangle'],
    skill: 'Sine from the small triangle, then the area formula run backwards',
  },

  'composite.straight-line-angle': {
    topic: 'A Point Off a Straight Line',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2018 P2 Q9'],
    marks: 3,
    route: 'correct substitution into the sine rule, rearrange it, then calculate the length. The straight-line angle is not a mark of its own',
    answerShape: 'rounded',
    webTopics: ['Sine rule: calculate length'],
    skill: 'The angle given is on the line, so the triangle takes its supplement',
  },

  'trig-diagram.area-exact': {
    topic: 'Area of a Triangle from a Diagram',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2017 P1 Q7', '2025 P1 Q5'],
    marks: 2,
    route: 'correct substitution into the area formula, then calculate the area. The sine is given, so nothing has to be looked up',
    answerShape: 'integer',
    webTopics: ['Area of a Triangle'],
    skill: 'Half ab sin C with the sine given as a fraction, no calculator',
  },

  'composite.hexagon-area': {
    topic: 'Area of a Regular Hexagon',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2015 P2 Q11'],
    marks: 4,
    route: 'the correct angle at the centre, correct substitution into the area of a triangle formula, know to multiply by six for the hexagon, then the calculation with its units',
    answerShape: 'rounded',
    webTopics: ['Area of a Triangle'],
    skill: 'Diagonals cut a regular hexagon into six triangles of half ab sin C',
  },

  // ── arcs and sectors, all on one figure ──────────────────────────────────
  // Split by which of the radius, angle and arc is missing, because that is
  // what makes them different questions — not the formula, which is the same
  // fraction of a circle every time.
  'sector.area-angle': {
    topic: 'Area of a Sector',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2025 P2 Q6'],
    marks: 3,
    route: 'appropriate fraction of the circle, consistent substitution into the area formula, then calculate the area',
    answerShape: 'rounded',
    webTopics: ['Sector area'],
    skill: 'Radius and angle to the area of the sector',
  },
  'sector.area-angle-pi314': {
    topic: 'Area of a Sector',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2016 P1 Q3'],
    marks: 3,
    route: 'appropriate fraction, correct substitution into the area formula with pi taken as 3.14, then calculate the area',
    answerShape: 'rounded',
    webTopics: ['Sector area'],
    skill: 'The same with pi taken as 3.14, which is a different sum',
  },
  'sector.arc-angle': {
    topic: 'Length of an Arc',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2018 P2 Q2', '2023 P2 Q3'],
    marks: 3,
    route: 'appropriate fraction, consistent substitution into the arc length formula, then calculate the arc',
    answerShape: 'rounded',
    webTopics: ['Arc length'],
    skill: 'Radius and angle to the arc length, major or minor',
  },
  'sector.arc-angle-pi314': {
    topic: 'Length of an Arc',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2019 P1 Q4'],
    marks: 3,
    route: 'appropriate fraction, correct substitution into the arc length formula with pi taken as 3.14, then calculate the arc',
    answerShape: 'rounded',
    webTopics: ['Arc length'],
    skill: 'The same with pi taken as 3.14, which is a different sum',
  },
  'sector.area-arc': {
    topic: 'Area of a Sector',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2024 P2 Q15'],
    marks: 3,
    route: 'the correct fraction, or start the strategy for finding the angle, then know how to calculate the sector area, then calculate it',
    answerShape: 'rounded',
    webTopics: ['Sector area'],
    skill: 'The arc gives the angle, and the angle gives the area',
  },
  'sector.angle-arc': {
    topic: 'Finding the Angle of a Sector',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2017 P2 Q14', '2022 P2 Q10'],
    marks: 3,
    route: 'an expression for the arc length, or the arc-to-circumference ratio, then know how to find the angle from it, then calculate the angle',
    answerShape: 'integer',
    webTopics: ['Arc length'],
    skill: 'The arc as a fraction of the circumference gives the angle',
  },
  'sector.radius-arc': {
    topic: 'Finding the Radius from an Arc',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2015 P2 Q10'],
    marks: 4,
    route: 'the correct fraction of the circle, construct the equation, know how to solve it, then solve it and state the radius',
    answerShape: 'rounded',
    webTopics: ['Arc length'],
    skill: 'Angle and arc back to the radius',
  },

  // Which of the two pieces is meant is carried by the shading alone, so these
  // are two variations rather than one with a flag.
  'sector.segment-major': {
    topic: 'Area of a Segment of a Circle',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2014 P2 Q13'],
    marks: 5,
    route: 'as for the minor segment, with the final mark covering the extra subtraction from the whole circle - the scheme\'s last mark is "carry out all calculations correctly within a valid strategy"',
    answerShape: 'rounded',
    webTopics: ['Area of a Triangle', 'Sector area'],
    skill: 'The whole circle less the sector-minus-triangle',
  },
  'sector.segment-minor': {
    topic: 'Area of a Segment of a Circle',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2014 P2 Q13'],
    marks: 5,
    route: 'know that the segment is the sector less the triangle, know to express the sector as a fraction of the circle, find the sector\'s area, find the triangle\'s area, then carry out the calculations',
    answerShape: 'rounded',
    webTopics: ['Area of a Triangle', 'Sector area'],
    skill: 'The sector less the triangle inside it',
  },

  'sector.triangle-minus-sector': {
    topic: 'A Sector Cut Out of a Triangle',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2018 P2 Q17'],
    marks: 5,
    route: 'the triangle by (1/2)ab sin C, the fraction of the circle, the sector area, know to subtract, then evaluate with units. The sector and the triangle share the angle at O, which is what makes it one question',
    answerShape: 'rounded',
    webTopics: ['Area of a Triangle', 'Sector area'],
    skill: 'Subtract a sector from the triangle that shares its apex and its angle',
  },
  'sector.similar-sectors': {
    topic: 'Two Similar Sectors',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2019 P2 Q12'],
    marks: 6,
    route: '3 + 3 - the linear scale factor, squared for areas, evaluated; then the larger sector area as a fraction of its circle, rearranged for the angle, evaluated. Part (b) does not use part (a). The two radii are on the figure and nowhere else',
    answerShape: 'integer',
    webTopics: ['Sector area', 'Similar areas/volumes'],
    skill: 'Scale an area between similar sectors, and recover a sector angle from its area',
  },
  'sector.polygon-segment': {
    topic: 'A Polygon Inside a Circle',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2026 P2 Q10'],
    marks: 5, marksInferred: true,
    route: 'inferred, no published 2026 scheme, patterned on 2014 P2 Q13 which pays five for the same segment with the angle given: the angle from the number of vertices, express the sector as a fraction of the circle, evaluate it, the triangle, then subtract',
    answerShape: 'rounded',
    webTopics: ['Sector area', 'Area of a Triangle'],
    skill: 'Equal vertices give the angle at the centre, then sector less triangle',
  },

  'angles.polygon-produced': {
    topic: 'A Side of a Polygon Produced',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2018 P1 Q9', '2025 P2 Q7'],
    marks: 2,
    route: 'interior angle of the polygon (or the angle at the outside point), then the angle asked for',
    answerShape: 'integer',
    webTopics: ['Angles in regular polygons'],
    skill: 'Interior angle of a regular polygon, then the angles of a triangle',
  },

  'angles.tangent-diameter': {
    topic: 'A Tangent and a Diameter',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2022 P1 Q4'],
    marks: 3,
    route: 'angle COE at the centre, then OCE from the isosceles radii, then ACE',
    answerShape: 'integer',
    webTopics: ['Angles in diagrams involving circles'],
    skill: 'Straight line at the centre, isosceles radii, then the right angle at the tangent',
  },

  'angles.tangent-semicircle': {
    topic: 'A Tangent and a Semicircle',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2015 P1 Q3'],
    marks: 3,
    route: 'angle OBD, then EDF from the semicircle, then BDF as their sum',
    answerShape: 'integer',
    webTopics: ['Angles in diagrams involving circles'],
    skill: 'Right angle at a tangent, isosceles radii, and the angle in a semicircle',
  },

  'angles.tangent-meets-diameter': {
    topic: 'A Tangent Meeting a Diameter',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2017 P1 Q9'],
    marks: 3,
    route: 'angle OBD, then ODB from the isosceles radii, then CAB',
    answerShape: 'integer',
    webTopics: ['Angles in diagrams involving circles'],
    skill: 'Isosceles radii, a straight line at the centre, then the triangle outside the circle',
  },

  'angles.two-tangents-chord': {
    topic: 'Two Tangents and a Parallel Chord',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2016 P2 Q5'],
    marks: 3,
    route: 'angle CAO across the parallels, then CAB, then ABC. The scheme closes with the isosceles triangle the two equal tangents make; this closes with quadrilateral OABC, which the scheme allows since it names no required method',
    answerShape: 'integer',
    webTopics: ['Angles in diagrams involving circles'],
    skill: 'Allied angles across parallel lines, isosceles radii, then a quadrilateral with two right angles',
  },

  'angles.two-tangents-diameters': {
    topic: 'Two Tangents and Two Diameters',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2024 P1 Q10'],
    marks: 3,
    route: 'angle OFD, then BOD as twice it, then BCD',
    answerShape: 'integer',
    webTopics: ['Angles in diagrams involving circles'],
    skill: 'Angle at the centre twice the angle at the circumference, then a quadrilateral with two right angles',
  },

  'angles.tangent-reflex': {
    topic: 'A Reflex Angle at the Centre',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2026 P1 Q10'],
    marks: 3, marksInferred: true,
    route: 'no published scheme: two isosceles triangles from the radii, one reached through the right angle at the tangent, then their sum',
    answerShape: 'integer',
    webTopics: ['Angles in diagrams involving circles'],
    skill: 'Two isosceles triangles from the radii, one reached through the right angle at a tangent',
  },

  'angles.polygon-diameter': {
    topic: 'A Polygon and a Diameter',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2019 P1 Q11'],
    marks: 3,
    route: 'angle AOB from the equal division, then FOB on the straight line, then OFB',
    answerShape: 'integer',
    webTopics: ['Angles in regular polygons', 'Angles in diagrams involving circles'],
    skill: 'Equal angles at the centre of a regular polygon, a straight line, then isosceles radii',
  },

  'angles.bar-polygon': {
    topic: 'An H Shape and a Polygon',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2023 P2 Q5'],
    marks: 2,
    route: 'interior or exterior angle of the polygon, then the shaded angle',
    answerShape: 'integer',
    webTopics: ['Angles in regular polygons'],
    skill: 'A right angle plus the exterior angle of a regular polygon',
  },

  // The five "similar areas/volumes" paper questions. Four are cloned with no
  // figure, because their photographs of cookie jars and model aircraft are
  // context and every measurement is in the prose; 2016 P2 Q11 is the one whose
  // numbers are printed only on the diagram, and it is drawn.
  'similarity.volume-scale': {
    topic: 'Volumes of Similar Solids',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2014 P2 Q5', '2026 P2 Q3'],
    marks: 3,
    route: 'state the linear scale factor, state the volume scale factor, then calculate the volume and state its units. 2014 scales up and 2026 scales down, which the scheme treats identically, so both directions are drawn under this one id',
    answerShape: 'integer',
    webTopics: ['Similar areas/volumes'],
    skill: 'Cube the linear scale factor to scale a volume',
  },
  'similarity.area-scale': {
    topic: 'Areas of Similar Figures',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2025 P2 Q11'],
    marks: 3,
    route: 'find the linear scale factor, multiply or divide the area by its square, then find the area. The scheme withholds the third mark if either scale factor was rounded, which is why nothing here rounds',
    answerShape: 'rounded',
    webTopics: ['Similar areas/volumes'],
    skill: 'Square the linear scale factor to scale an area',
  },
  'similarity.area-from-cost': {
    topic: 'Cost of a Similar Figure',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2016 P2 Q11'],
    marks: 3,
    route: 'the linear scale factor, know to multiply or divide the cost by its square, then find the cost. The scheme accepts it either way up, and the quantity scaling is proportional to an area rather than being one - the words never say "area" at all',
    answerShape: 'money',
    webTopics: ['Similar areas/volumes'],
    skill: 'Scale a quantity proportional to area by the square of the scale factor',
  },
  'similarity.not-similar': {
    topic: 'Showing Two Solids Are Not Similar',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2018 P2 Q18'],
    marks: 5,
    route: '3 + 2 - state the linear scale factor, know to multiply the volume by its cube, then the calculation with a valid comparison and conclusion; then find the volume scale factor and a calculation involving a root of it. The only one of the five that runs the argument backwards, and the only one needing a cube root',
    answerShape: 'rounded',
    webTopics: ['Similar areas/volumes'],
    skill: 'Assume similar, find the contradiction, then scale back with a cube root',
  },

  'similarity.triangle-part': {
    topic: 'A Side of a Similar Triangle',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2017 P1 Q15'],
    marks: 3,
    route: 'scale factor, form the equation, solve for x',
    answerShape: 'integer',
    webTopics: ['Similar lengths'],
    skill: 'Equal ratios across a parallel cut, then an equation in x',
  },

  'similarity.triangle-rest': {
    topic: 'The Rest of a Similar Triangle',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2024 P1 Q14'],
    marks: 3,
    route: 'scale factor, scale the whole side consistently, then subtract',
    answerShape: 'integer',
    webTopics: ['Similar lengths'],
    skill: 'The linear scale factor applied to a whole side, then what is left',
  },

  'similarity.triangle-area': {
    topic: 'The Area Left by a Similar Triangle',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2015 P2 Q9'],
    marks: 4,
    route: 'linear scale factor, square it to reach the whole area, then subtract the small triangle',
    answerShape: 'integer',
    webTopics: ['Similar lengths', 'Similar areas/volumes'],
    skill: 'The square of the linear scale factor, then a subtraction',
  },
};

/** Which variations were modelled on a paper question — the reverse lookup. */
export function variationsBasedOn(paperLabel: string): string[] {
  // Match with or without a part suffix, in both directions. A variation may
  // cite "2014 P2 Q4a" because it clones that part alone, while what a teacher
  // clicks is the whole question "2014 P2 Q4" — and the reverse happens too.
  // Exact matching returned nothing for those, silently.
  const stem = (s: string) => s.trim().replace(/([a-z])$/, '');
  const wanted = stem(paperLabel);
  return Object.entries(N5_VARIATIONS)
    .filter(([, meta]) => meta.basedOn.some(l => stem(l) === wanted))
    .map(([id]) => id);
}

/** Which topics those variations live in, which is what generation needs. */
export function topicsBasedOn(paperLabel: string): string[] {
  const ids = new Set(variationsBasedOn(paperLabel));
  const topics = new Set<string>();
  for (const [id, meta] of Object.entries(N5_VARIATIONS)) {
    if (ids.has(id)) topics.add(meta.topic);
  }
  return [...topics];
}

/**
 * Every paper question some variation is modelled on, oldest first.
 *
 * This is what a "more like this one" picker can offer, and it is deliberately
 * the cited list rather than all 328: offering a question nothing can generate
 * would be a dead end. paper-coverage.ts reports the difference.
 */
export function citedPaperQuestions(): string[] {
  const labels = new Set<string>();
  for (const meta of Object.values(N5_VARIATIONS)) {
    for (const l of meta.basedOn) labels.add(l.replace(/([a-z])$/, ''));
  }
  const key = (s: string) => {
    const m = s.match(/^(\d{4}) P(\d) Q(\d+)$/);
    return m ? Number(m[1]) * 100000 + Number(m[2]) * 1000 + Number(m[3]) : 0;
  };
  return [...labels].sort((a, b) => key(a) - key(b));
}

/**
 * Which tiers a topic belongs to — it can be both, though almost none are.
 *
 * This used to read `m.difficulty === 'exam' || m.basedOn.length > 0`, and that
 * second clause was doing real work: 33 variations cloning real paper questions
 * were tagged `skill`, and the fallback quietly filed them under Exam anyway,
 * so the picker looked right while the registry was wrong. Nothing failed and
 * nothing could, because the code compensated for the fault instead of
 * exposing it.
 *
 * So the fallback is gone and `difficulty` is read as written. What keeps it
 * honest is `tiers.ts`, which fails when a variation's tier disagrees with its
 * `basedOn` — a check that can be run, rather than a compensation that hides
 * the thing it compensates for.
 */
export type Tier = 'skill' | 'exam';

export function tiersOf(topic: string): Tier[] {
  const metas = Object.values(N5_VARIATIONS).filter(m => m.topic === topic);
  return [...new Set(metas.map(m => m.difficulty as Tier))];
}

/**
 * The variations of one topic that are in a given tier.
 *
 * The tier buttons used to filter only the *list of topics offered*, which is
 * not the same as filtering the questions: pick "Warm-ups", tick a topic that
 * holds both, and you could still be handed the exam clone. One N5 topic holds
 * both today — "Magnitude of a Vector" — so the promise was nearly true, and
 * "nearly true" is the kind of thing that stops being true quietly. Passing
 * these to `generateQuestion` as `variationIds` makes the filter mean what it
 * says.
 *
 * Empty for a topic with nothing in that tier, and for every course with no
 * registry. The caller generates unrestricted in that case rather than
 * failing — a topic offering nothing in the chosen tier is a picker problem,
 * not a reason to hand back no question at all.
 */
export function variationsInTier(topic: string, tier: Tier): string[] {
  return Object.entries(N5_VARIATIONS)
    .filter(([, m]) => m.topic === topic && m.difficulty === tier)
    .map(([id]) => id);
}
