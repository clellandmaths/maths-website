import { TOPIC_GROUPS_N5 } from './types';
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
  /**
   * The pupil's plan, where the marker's route does not make one.
   *
   * The second hint has always been the first sentence of `route`, and mostly
   * that is right - how a marker describes the marks and how a pupil should
   * plan the question are usually the same sentence. Where they are not, the
   * pupil was getting the marker's words out of their context, and that goes
   * wrong in three ways, all found by reading the entries where the method
   * introduces no word the skill had not already used:
   *
   *   **wrong out of context** - `data.quartiles` routes "find the quartiles,
   *   then calculate the range". Right in front of a marking instruction about
   *   quartiles; a wrong instruction to a pupil, who needs the *interquartile*
   *   range.
   *
   *   **marker commentary** - "- a mark each", "3 for the volume in scientific
   *   notation, 2 for the division". A pupil should not be handed the mark
   *   split before they have tried the question: that is the shape of the
   *   answer, and `hints.ts` already forbids it at the start of a line.
   *
   *   **vaguer than the skill** - `volume.sphere` routes "substitute,
   *   evaluate, round", which is the scheme exactly and tells a pupil less
   *   than the line they have just read.
   *
   * So `route` stays what it is - a verification artefact, quoted as the
   * scheme words it, which is what makes a variation spot-checkable - and this
   * is the pupil-facing line for where those two jobs come apart.
   *
   * **They come apart more often than this comment used to say.** It read "set
   * it only where the route genuinely fails a pupil... most routes do not need
   * one", on 13 of 197. Reading all 197 against the marker-voice detector in
   * `__checks__/hints.ts` found 77 that hand a pupil the marker's vocabulary -
   * "begin a valid strategy", "consistent answer in simplest form", and in one
   * case "As above", a cross-reference to the neighbouring entry that a pupil
   * can never see. Those carry a `method` now.
   *
   * Write it as an instruction, in the order the work is done, naming the thing
   * it acts on: "Halve the coefficient of x to get the number inside the
   * bracket, then take off what that bracket adds on". Not "correct bracket
   * with square, then complete the process", which is what that one replaced.
   */
  method?: string;
  /**
   * What to do, in the order a pupil does it. Two to four moves.
   *
   * `method` is one sentence for the whole question; this is the ladder under
   * it. It exists because that ladder used to be the marking instructions
   * replayed one mark at a time, and that had a single fault with two faces:
   * the scheme's column answers *what does this mark reward*, and a pupil is
   * asking *what do I do next*. Where those diverge there is nothing in the
   * string to rescue - "begin valid strategy" contains nothing - and
   * `2015 P2 Q4` walked a pupil from a good second hint down to "start
   * process", then "solution". The ladder ran downhill.
   *
   * **Moves, not marks.** Ladder length used to be the mark count, so a 7-mark
   * question took eight presses to exhaust and a 2-mark one spent a press on
   * "consistent answer in simplest form". Mark count is a property of the
   * scheme; how much help somebody needs is a property of the pupil. The marks
   * are not lost - `planMarks` puts them on the move, and a move worth two
   * marks saying so is more use than two rungs of one.
   *
   * Written at the level of the **method**, because that is what it is shared
   * by: one plan serves every paper question this variation is modelled on, up
   * to nine of them. So it never names a value only one of those questions has
   * - the concrete working comes per-question from the scheme's illustrative
   * column and is attached at emit time.
   *
   * House style is the generated `solutionSteps`, which already read the right
   * way: imperative verb first, the object named, the reason carried inline.
   * Those steps are the raw material - compress them, do not copy them.
   */
  plan?: string[];
  /**
   * How the marks fall across those moves, in order. Sums to `marks`.
   *
   * **A move may be worth 0.** Moves are pedagogy and marks are accounting,
   * which is the whole premise of `plan` — so a question worth one mark can
   * still take two moves to explain. `vectors.pathway-parallelogram` is that
   * case: one mark, and a pupil needs both "pick a route round the sides" and
   * "swap each leg for its letter, minding direction". The mark lands on the
   * second. Only 2 of 197 exam variations are worth a single mark, so this is a
   * narrow allowance rather than a licence.
   *
   * A 0 may not be the last move, and there may be at most one — a plan whose
   * moves are mostly worth nothing has been split too finely. **The UI must not
   * print a "0 marks" chip**: it shows no chip there at all.
   */
  planMarks?: number[];
  /**
   * Where a cited question splits its marks differently from `planMarks`.
   *
   * The same reason `marksDiffer` exists, one level up: a variation clones a
   * shape, and the exam sometimes sets that shape for different money.
   */
  planMarksDiffer?: Record<string, number[]>;
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
    method: 'Put both parts over a common denominator, then add them and tidy the answer up',
    plan: [
      'Turn each mixed number into a top-heavy fraction, then rewrite both of them over a bottom line that each denominator divides into',
      'Add the two numerators over that shared bottom line, then turn the top-heavy total back into a mixed number and cancel it down',
    ],
    planMarks: [1, 1],
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
    method: 'Put both parts over a common denominator, then subtract and tidy the answer up',
    plan: [
      'Turn each mixed number into a top-heavy fraction, then rewrite both of them over a bottom line that each denominator divides into',
      'Take the second numerator away from the first over that shared bottom line, then write the answer back as a mixed number in its simplest form',
    ],
    planMarks: [1, 1],
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
    method: 'Turn both mixed numbers into improper fractions and multiply them, then tidy the answer up',
    plan: [
      'Turn each mixed number into a top-heavy fraction so there is no whole number left sitting outside a fraction line — whole numbers and fractions cannot be multiplied while they are separated like that',
      'Multiply the two tops together and the two bottoms together, then cancel the result down and write it as a mixed number if the top ends up bigger than the bottom',
    ],
    planMarks: [1, 1],
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
    method: 'Turn the mixed number into an improper fraction and multiply by the reciprocal, then tidy the answer up',
    plan: [
      'Turn each mixed number into a top-heavy fraction, and write any whole number over 1 so it has a bottom line to work with',
      'Flip the second fraction upside down and multiply by it instead of dividing, then cancel the result down and tidy it into a mixed number',
    ],
    planMarks: [1, 1],
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
    method: 'Work out the bracket first by putting both fractions over a common denominator, then multiply and tidy the answer up',
    plan: [
      'Rewrite the two fractions inside the bracket over a bottom line they both divide into, and combine the numerators so the bracket becomes one single fraction',
      'Multiply that single fraction by the one sitting outside the bracket, tops together and bottoms together, then cancel the result down to its simplest form',
    ],
    planMarks: [1, 1],
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
    method: 'Decide from the words which operation it is, put both fractions over a common denominator, then work it out and give the answer with its units',
    plan: [
      'Pull the two amounts out of the words and write each one as a top-heavy fraction over a bottom line they share',
      'Look at whether the question wants the two amounts brought together or one taken away from the other, carry that out on the numerators, then write the answer as a mixed number with the units it is measured in',
    ],
    planMarks: [1, 1],
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
    plan: [
      'Take the largest square factor out of each root in turn, so that both surds end up sitting on the same root',
      'With the roots now matching, subtract the second coefficient from the first and keep that shared root beside it',
    ],
    planMarks: [1, 1],
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
    method: 'Multiply top and bottom by the root in the denominator, then tidy what is left',
    plan: [
      'Write the root that sits underneath over itself as a second fraction and multiply, which turns the bottom into the whole number that was under the root',
      'Look for a number that divides both the top number and the bottom number, and cancel the fraction down by it, leaving the root alone',
    ],
    planMarks: [1, 1],
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
    method: 'Expand the bracket, take the largest square factor out of the surd that appears, then collect the like surds together',
    plan: [
      'Multiply the term in front of the bracket by each term inside it, remembering that a root times itself gives the whole number that was underneath',
      'Multiplying two different roots leaves one new root, so split it into its largest square factor times what is left and bring the root of that square factor outside',
      'Gather the terms that share the same root by adding their coefficients, and leave the whole number sitting on its own',
    ],
    planMarks: [1, 1, 1],
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
    method: 'Substitute the value into the function, then multiply top and bottom by the root to clear the denominator',
    plan: [
      'Replace every $x$ in the function rule with the number written in the brackets, so you can see the fraction you are actually working with',
      'Multiply that fraction, top and bottom, by the root underneath, so the bottom becomes a whole number',
    ],
    planMarks: [1, 1],
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
    method: 'Take the largest square factor out of the first surd, do the same to the third, then add the coefficients of the matching roots',
    plan: [
      'Split the first root into its largest square factor times what is left, and bring the root of that square factor out in front',
      'Do the same to the other root that is not yet in its simplest form',
      'All three terms now sit on the same root, so add the coefficients together and keep that root beside the total',
    ],
    planMarks: [1, 1, 1],
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
    method: 'Multiply top and bottom by the root in the denominator, take the largest square factor out of the surd that appears, then tidy the fraction',
    plan: [
      'Multiply top and bottom by the root underneath, which turns the bottom into the whole number that was sitting under that root',
      'The root now on top still has a square factor hiding inside it, so bring that factor\'s root outside and multiply it into the number already in front',
      'Divide top and bottom by the largest number that goes into both, leaving the root itself untouched',
    ],
    planMarks: [1, 1, 1],
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
    method: 'Multiply top and bottom by the root in the denominator, tidy the numerator, then tidy the whole fraction',
    plan: [
      'Multiply top and bottom by the root underneath, so the two roots on top join into a single root and the bottom becomes a whole number',
      'Take the largest square factor out of the root on top and bring the root of that factor outside, in front of what is left',
      'Cancel the number in front of the root against the number underneath by dividing both by their highest common factor',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Start with the bracket, multiplying the two powers together, since $(a^{m})^{n} = a^{mn}$',
      'Multiply the terms on the top by adding their powers',
      'Divide by subtracting the power underneath from the power above it',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Deal with the bracket first, multiplying the powers together and keeping the minus sign attached to the power it belongs to',
      'Combine what is left by adding the powers where terms multiply and subtracting them where terms divide',
      'Rewrite the result so the power is positive, using $a^{-n} = \\frac{1}{a^{n}}$',
    ],
    planMarks: [1, 1, 1],
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
    method: 'Read the bottom of the index as a root and the top as a power, then take the root first and raise the result',
    plan: [
      'Rewrite the number as a root raised to a power, the bottom of the index telling you which root and the top telling you the power, as in $a^{\\frac{m}{n}} = \\left(\\sqrt[n]{a}\\right)^{m}$',
      'Take the root first, which keeps the numbers small, then raise that result to the power',
    ],
    planMarks: [1, 1],
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
    method: 'Take the power to the number at the front as well as to the letter, then multiply the two results together',
    plan: [
      'Split the bracket into its number part and its letter part, because the outside power lands on both, $(ab)^{m} = a^{m}b^{m}$',
      'Work out the number raised to that power, multiply the powers of the letter together, then write the two results side by side',
    ],
    planMarks: [1, 1],
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
    plan: [
      'Raise both parts inside the bottom bracket to the outside power, so the number at the front gets it too, not just the letter',
      'Subtract the power of the letter underneath from the power of the letter above it',
      'The number underneath has nothing to cancel with, so write your simplified letter over it',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Multiply the term outside by the first term inside, adding their powers as usual, since a power that is a fraction or a minus still just adds on',
      'Do the same with the second term in the bracket, then write the two results as a sum, using $a^{0} = 1$ if a power cancels away to nothing',
    ],
    planMarks: [1, 1],
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
    plan: [
      'Tidy the numerator first by multiplying its terms together and adding the powers of the letter',
      'Divide the numbers at the front on their own, since they follow ordinary division rather than the index laws',
      'Subtract the power underneath from the power above to clear the letter out of the denominator',
    ],
    planMarks: [1, 1, 1],
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
    route: 'apply $a^m \\times ka^n = ka^{m+n}$, then show evidence of the square root as a power of a half, then complete the simplification. The middle mark is for writing the root as a power at all - until then there is nothing to divide',
    method: 'Use $a^m \\times ka^n = ka^{m+n}$ on the top, write the square root as a power of a half, then subtract the indices to divide',
    plan: [
      'Multiply out the numerator first, adding the powers of the letter and leaving the number at the front as it is',
      'Rewrite the square root underneath as $a^{\\frac{1}{2}}$, so top and bottom are both powers of the same letter',
      'Subtract that half from the power on top, and leave the answer carrying its fractional power',
    ],
    planMarks: [1, 1, 1],
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
    route: 'apply $\\sqrt[n]{x^m} = x^{m/n}$, then apply $\\dfrac{1}{x^n} = x^{-n}$. One mark per law, and it runs the opposite way to indices.negative-power, which turns a negative index back into a fraction',
    plan: [
      'Rewrite the root as an index, with the power from inside going on top and the root number underneath, as in $\\sqrt[n]{a^{m}} = a^{\\frac{m}{n}}$',
      'That power now sits under $1$, so flip it up by making the index negative, $\\frac{1}{a^{n}} = a^{-n}$',
    ],
    planMarks: [1, 1],
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
    plan: [
      'Turn the percentage change into a multiplier',
      'Raise that multiplier to the number of years, and multiply the starting amount by it',
      'Work it out, rounding to whatever accuracy the question asks for',
    ],
    planMarks: [1, 1, 1],
    planMarksDiffer: { '2026 P2 Q1': [1, 1, 2] },
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
    plan: [
      'Turn the percentage change into a multiplier',
      'Count the years between the two dates, then raise the multiplier to that power and multiply the starting amount by it',
      'Work the multiplication out',
    ],
    planMarks: [1, 1, 1],
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
    method: 'The amount you are given is more, or less, than 100% of the original, so write down that multiplier, divide by it, and carry the division through',
    plan: [
      'Decide what percentage of the original the amount you are given is — over 100% after an increase, under it after a decrease',
      'Divide that amount by the matching multiplier to get back to 100%',
      'Carry the division through',
    ],
    planMarks: [1, 1, 1],
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
    method: 'The amount you are given is that percentage of the total, so divide to find 1%, then multiply by 100',
    plan: [
      'Write down what you are told: that percentage of the total is the amount given',
      'Divide by that percentage to find what 1% is worth',
      'Multiply by 100 to get the whole',
    ],
    planMarks: [1, 1, 1],
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
    method: 'The total is 100% plus the extra, so divide back to the bill before it, then subtract to leave the surcharge itself',
    plan: [
      'The total already has the charge in it, so it is 100% plus the rate',
      'Divide by that multiplier to get back to the amount before the charge was added',
      'Subtract that from the total, because the question asks for the extra and not the bill',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Turn each of the two percentage changes into its own multiplier',
      'Multiply the starting amount by the first multiplier once, then by the second one raised to the number of years it covers',
      'Work it out, rounding to whatever accuracy the question asks for',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Take the first term of the left bracket across both terms of the right, then the second term across both, keeping each sign attached to the number in front of it, so you finish with four products in a row',
      'Two of those four are terms in $x$, so add their coefficients and write your answer as a squared term, a single $x$ term and a number',
    ],
    planMarks: [1, 1],
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
    plan: [
      'Multiply every term of the three-term bracket by the first term of the two-term bracket, and write those three products in a row',
      'Do the same with the second term of the two-term bracket, carrying its sign with it, and write those three products underneath the first row',
      'Add the two rows, gathering terms that share a power of $x$, and check that a cube term survives into your final line',
    ],
    planMarks: [1, 1, 1],
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
    method: 'Expand the product two terms at a time, expand the single bracket, then collect the like terms',
    plan: [
      'Deal with the pair of brackets on its own first: take each term of one across both terms of the other and tidy that part up before you look at anything else',
      'Multiply out the remaining bracket by whatever sits in front of it, watching for a minus there, because it flips both signs inside',
      'Write the two expansions side by side, then gather the squared terms, the $x$ terms and the plain numbers into one term each',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Look at both terms and find the largest number that divides into each, then write it outside a bracket with whatever is left inside',
      'Now read the bracket: two squared quantities with a minus between them split into two brackets, the same two quantities with a plus in one and a minus in the other. Keep the factor you took out sitting at the front',
    ],
    planMarks: [1, 1],
    answerShape: 'expression',
    webTopics: ['Factorising'],
    skill: 'Common factor first, then the difference of two squares',
  },
  'factorising.solve': {
    topic: 'Solving by Factorising',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2018 P1 Q5'], marks: 2,
    route: 'correct factorisation, then solve for x. Setting each bracket to zero is part of the second mark, not a mark of its own',
    plan: [
      'Hunt for the pair of numbers that multiply to give the constant and add to give the coefficient of $x$, then write the left hand side as two brackets',
      'Two things multiplying together can only give 0 if one of them is 0, so set each bracket to 0 in turn and solve the two small equations that gives you',
    ],
    planMarks: [1, 1],
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
    plan: [
      'Start from the $x^{2}$ term: pick a pair of factors of its coefficient and open two brackets with those sitting in front of the $x$',
      'Fill the second slot in each bracket with a pair of factors of the constant, then multiply the outsides and the insides and swap the pairing around until they add to the middle term',
      'A product is 0 only when one of its factors is 0, so set each bracket to 0 in turn and solve each one for $x$',
    ],
    planMarks: [1, 1, 1],
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
    method: 'Halve the coefficient of $x$ to get the number inside the bracket, then take off what that bracket adds on and bring the constant down',
    plan: [
      'Halve the coefficient of $x$. That number goes inside the bracket, and the bracket is squared',
      'Expanding that bracket would add an extra term, so subtract it again and bring the constant down beside it',
    ],
    planMarks: [1, 1],
    answerShape: 'expression',
    webTopics: ['Completing the square'],
    skill: 'Write $x^2+bx+c$ in the form $(x+p)^2+q$',
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
    plan: [
      'Halve the coefficient of $x$ for the bracket, then take off what squaring that bracket adds on and bring the constant down beside it',
      'Read the turning point straight off the completed square — the bracket is at its smallest when it is zero, and the number left outside is the height there',
      'Put $x = 0$ to find the point on the $y$-axis, then step the same distance to the other side of the turning point, because a parabola is symmetrical about it',
      'Give the second point the same $y$-coordinate as the first, since the line joining them is horizontal',
    ],
    planMarks: [2, 1, 1, 1],
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
    method: 'Halve the coefficient of $x$ for the bracket, take off what it adds on, then read the turning point straight off the completed square',
    plan: [
      'Halve the coefficient of $x$ — that number goes inside the bracket, and the bracket is squared',
      'Take off the extra term that squaring the bracket adds on, and bring the constant down beside it',
      'Read the turning point off the completed square — the bracket is zero at the $x$ that empties it, and the number left outside is the $y$-coordinate there',
    ],
    planMarks: [1, 1, 1],
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
    method: 'Complete the square and read the axis of symmetry straight off it; then set the completed square to zero, take the square root of both sides keeping both signs, and simplify the surd',
    plan: [
      'Halve the coefficient of $x$ for the bracket, then take off what squaring it carries in and bring the constant down beside it',
      'Give the axis of symmetry as the vertical line through the turning point, where the bracket is zero',
      'Set that completed square equal to zero, then take the square root of both sides, keeping both the plus and the minus',
      'Simplify the surd by pulling out the largest square factor, then match what you are left with to the form the question asks for',
    ],
    planMarks: [2, 1, 2, 2],
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
    method: 'Read two points off your line and find the gradient, substitute it with one of the points to get the intercept, write the equation in the letters the question uses, then put the given value into it',
    plan: [
      'Pick the two marked points on the line of best fit and work out the change up divided by the change across, which gives you the gradient',
      'Put that gradient and one of those two points into $y = mx + c$, so that $c$ is the only thing left unknown',
      'Work $c$ out, then write the equation using the question\'s own letters instead of $x$ and $y$',
      'Put the value given in the second part into your equation to get the quantity it asks for',
    ],
    planMarks: [1, 1, 1, 1],
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
    plan: [
      'Choose two points where the line of best fit passes exactly through a corner of the grid, so both coordinates can be read off the axes without guessing',
      'Take the change up between those points and divide it by the change across to get the gradient',
      'Feed the gradient and one of the points into $y = mx + c$, find $c$, and write the equation in the letters the question uses rather than $x$ and $y$',
      'Put the value asked about in the second part into your equation to get the missing measurement',
    ],
    planMarks: [1, 1, 1, 1],
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
    method: 'Find the gradient from the two marked points, substitute it and one point into $y = mx + c$, then tidy the equation up',
    plan: [
      'Read the coordinates of both marked points off the sketch, then divide the change in $y$ by the change in $x$ to get the gradient',
      'Put the gradient and either one of the points into $y = mx + c$, leaving $c$ as the only unknown',
      'Rearrange for $c$ and write the equation out with $y$ on its own and the numbers collected together',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Look at how far the curve climbs above the $x$-axis at its highest point, reading that distance off the scale on the $y$-axis — the wave drops the same amount below, and that distance is $a$',
      'Count how many complete waves are squeezed in along the $x$-axis between $0^{\\circ}$ and $360^{\\circ}$, and that count is $b$',
    ],
    planMarks: [1, 1],
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
    plan: [
      'Read off the $y$-axis how far the curve reaches above the $x$-axis at the peak — that distance from the middle to the top gives $a$',
      'Find where the peak sits along the $x$-axis. An unshifted $\\cos$ graph peaks at $x = 0$ and an unshifted $\\sin$ graph climbs through $0$, so the gap between that and the graph in front of you is how far the wave has slid — a slide to the right means a minus sign inside the bracket',
    ],
    planMarks: [1, 1],
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
    plan: [
      'Find the $x$ value of the marked peak. An unshifted $\\cos$ graph peaks at $x = 0$, so how far along the axis this one peaks tells you the sideways slide, and sliding right puts a minus sign inside the bracket',
      'Now read the top and bottom values off the $y$-axis. The lift does not change how tall the wave is, it moves the line the wave is balanced about — a plain $\\cos$ graph is balanced about $0$, so how far this one\'s middle has risen gives the other letter',
    ],
    planMarks: [1, 1],
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
    plan: [
      'Ask where the plain wave would turn first — $\\cos x^{\\circ}$ peaks at $x = 0$ — then slide that $x$ along by the amount in the bracket, moving right when the bracket subtracts, to get the $x$-coordinate',
      'Take the number multiplying the $\\cos$ or $\\sin$: that is how far the curve reaches from the $x$-axis, so give it the sign matching which side of the axis the marked point is on, and write the two values as a coordinate pair',
    ],
    planMarks: [1, 1],
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
    method: 'Read the turning point off the completed square, sketch a parabola with its minimum there, then mark where it crosses the $y$-axis',
    plan: [
      'Find the $x$ that makes the squared bracket zero — a square is never negative, so the curve is at its lowest there, and that fixes both coordinates of the turning point',
      'Draw a parabola opening upwards from that minimum, and annotate the turning point on the sketch',
      'Put $x = 0$ into the equation for the $y$-intercept, and mark that on the sketch too',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Set each bracket equal to zero in turn and solve — those two $x$ values are where the curve crosses the $x$-axis',
      'Take the value halfway between them for the turning point\'s $x$, since a parabola is symmetrical, then substitute it back for the $y$',
      'Put $x = 0$ for the $y$-intercept, then draw the parabola with the roots, the turning point and that intercept all annotated',
    ],
    planMarks: [1, 1, 1],
    answerShape: 'text',
    webTopics: ['Sketch a parabola from equation'],
    skill: 'Take the roots from the brackets, halve between them, and sketch',
  },

  'quadratics.parabola-scale': {
    topic: 'A Parabola Through a Point',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2014 P1 Q7', '2026 P1 Q9'],
    marks: 2,
    route: 'know to substitute the marked point into $y = ax^2$, then solve for $a$',
    plan: [
      'Read the marked point\'s coordinates off the diagram and put them in place of $x$ and $y$ in $y = ax^{2}$, since the point lies on the curve',
      'Work out the square, then divide to leave $a$ on its own',
    ],
    planMarks: [1, 1],
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
    method: 'Read a off the turning point and settle its sign before going on, then read b',
    plan: [
      'Read the turning point\'s $x$-coordinate off the graph — the bracket is zero there, so that coordinate is $-a$, and the sign flips when you write $a$ down',
      'Take $b$ from the height of the turning point, because the bracket contributes nothing where it is zero',
    ],
    planMarks: [1, 1],
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
    plan: [
      'Read the turning point\'s $x$-coordinate off the graph — the bracket is zero there, so that coordinate is $-a$, and the sign flips when you write $a$ down',
      'Take $b$ from the turning point\'s $y$-coordinate, because the bracket adds nothing where it is zero',
      'Give the axis of symmetry as the vertical line through the turning point',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Read the turning point\'s $x$-coordinate off the graph — the bracket is zero there, so that coordinate is $-a$, and the sign flips when you write $a$ down',
      'Take $b$ from the turning point\'s $y$-coordinate, because the bracket adds nothing where it is zero',
      'Put $x = 0$ into the equation you have now built, to find where the curve cuts the $y$-axis',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Match the axis of symmetry to the turning point, where the bracket is zero, so its $x$ value is $-a$ — and mind the sign as you write $a$ down',
      'Substitute the marked point\'s coordinates into $y = (x + a)^{2} + b$ now that you have $a$',
      'Work out the bracket, then rearrange to leave $b$ on its own',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Give the axis of symmetry as the vertical line through the maximum turning point, taking its $x$-coordinate',
      'Set the bracket to zero at that turning point — the square is being subtracted, so $y$ is largest there — and read $a$ off, minding the sign',
      'Take $b$ from the height of the turning point, because the bracket contributes nothing where it is zero',
    ],
    planMarks: [1, 1, 1],
    answerShape: 'integer',
    webTopics: ['Turning Points and Axis of Symmetry', 'Parabola Equation from Graph'],
    skill: 'Read a maximum turning point off a graph and match it to $y = b - (x - a)^2$',
  },

  'quadratics.reaches-height': {
    topic: 'Reaching a Height in a Quadratic Model',
    difficulty: 'exam', strategy: 'answer-first', source: 'paper',
    basedOn: ['2014 P1 Q13'],
    marks: 7,
    route: '4 + 3 - construct the equation, rearrange to zero, factorise and select the first of the two times; then the turning point, the maximum height, and a conclusion comparing it with the height asked about. The scheme requires equating to zero before solving, and gives 0/4 for an unworked answer',
    plan: [
      'Set the height formula equal to the height in the question, then gather every term on one side so the quadratic equals zero',
      'Factorise that quadratic into two brackets',
      'Set each bracket to zero for the two times, and pick the earlier one — the object passes that height on the way up and again on the way down',
      'For the second part take the time halfway between those two, work out the height at that moment, and compare it with the height you are asked about before answering',
    ],
    planMarks: [2, 1, 1, 3],
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
    plan: [
      'Put the time you are given into the height formula and work the arithmetic through',
      'Write the height below the starting point as a negative, and set the formula equal to it',
      'Gather every term on one side so the quadratic equals zero, then factorise it',
      'Set each bracket to zero, then reject the negative time — a time cannot run backwards',
    ],
    planMarks: [1, 1, 2, 1],
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
    plan: [
      'Pick out $a$, $b$ and $c$ from the equation, keeping any minus signs with them, then put them into $b^{2} - 4ac$',
      'Look at whether that number comes out positive, zero or negative, and say what that tells you about the roots',
    ],
    planMarks: [1, 1],
    answerShape: 'text',
    webTopics: ['Discriminant'],
    skill: 'Calculate $b^2-4ac$ and state the nature of the roots',
  },
  'quadratics.formula': {
    topic: 'The Quadratic Formula',
    difficulty: 'exam', strategy: 'input-first', source: 'zeta+paper',
    basedOn: ['2017 P2 Q4', '2019 P2 Q6', '2022 P2 Q7', '2024 P2 Q8'],
    marks: 3,
    marksDiffer: { '2022 P2 Q7': 4 },
    route: 'correct substitution into the quadratic formula, then evaluate the discriminant, then both roots at the stated accuracy. 2022 P2 Q7 is worth four, splitting the last mark into unrounded then rounded to two significant figures; the other three papers are three',
    method: 'Substitute $a$, $b$ and $c$ into the quadratic formula, work out the discriminant under the root, then give both roots rounded as the question asks',
    plan: [
      'Pick out $a$, $b$ and $c$ from the equation, keeping any minus signs with them, then write $x = \\frac{-b \\pm \\sqrt{b^{2}-4ac}}{2a}$ out with those numbers in place',
      'Work out the discriminant under the root on its own first, so the rest of the arithmetic stays manageable',
      'Work out both roots, taking the plus and then the minus, and round each to the accuracy the question asks for',
    ],
    planMarks: [1, 1, 1],
    planMarksDiffer: { '2022 P2 Q7': [1, 1, 2] },
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
    plan: [
      'Factorise the top on its own, checking for a factor common to both terms and for a difference of two squares',
      'Factorise the bottom of the fraction the same way, so the denominator is a product of brackets too',
      'Cancel any bracket that now appears on the top and on the bottom, and leave the rest as a single fraction',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Factorise the expression in part (a) fully — check for a factor common to both terms, and for a difference of two squares',
      'Carry that factorised form into part (b) as the top, then factorise the denominator into brackets',
      'Cancel the bracket the top and the bottom share, and leave the rest as one fraction in its simplest form',
    ],
    planMarks: [1, 1, 1],
    planMarksDiffer: { '2017 P2 Q9': [1, 2, 1] },
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
    plan: [
      'Multiply the two denominators together to make the denominator both fractions can sit over, and leave it in brackets',
      'Multiply each numerator by the denominator it is missing, so both sit over that single bottom line',
      'Expand the brackets on the top and collect like terms, leaving the bottom in its factorised form',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Find the lowest denominator both fractions can sit over — multiply the two denominators, unless one already fits inside the other',
      'Multiply each numerator by whatever its denominator was short of, keeping the minus sign in front of the second bracket',
      'Expand the top, letting that minus sign flip the sign of every term inside the second bracket, then collect like terms',
    ],
    planMarks: [1, 1, 1],
    planMarksDiffer: { '2017 P1 Q11': [0, 1, 1] },
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
    plan: [
      'Flip the second fraction upside down and multiply by it, since dividing by a fraction is multiplying by its reciprocal',
      'Factorise the numerator: it is a difference of two squares, so it splits into two brackets',
      'Cancel the bracket that now sits above and below the line, then multiply the numbers that are left',
    ],
    planMarks: [1, 1, 1],
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
    method: 'Multiply by the reciprocal of the second fraction, factorise the top and the bottom, then cancel what they share',
    plan: [
      'Flip the second fraction upside down, then multiply by it instead of dividing',
      'Look at the top and the bottom for anything that breaks into factors, such as a difference of two squares',
      'Cancel every factor that appears above and below the line, then multiply what is left across the top and across the bottom',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Flip the second fraction upside down and multiply by that reciprocal instead of dividing',
      'Cancel one copy of the repeated bracket against the matching one underneath, then multiply the rest across',
    ],
    planMarks: [1, 1],
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
    method: 'Substitute the two points into the gradient formula, factorise the numerator as a difference of two squares, then take the common factor out of the bottom and cancel',
    plan: [
      'Label the two points, then put their coordinates into the gradient formula $m = \\frac{y_{2} - y_{1}}{x_{2} - x_{1}}$',
      'Factorise the numerator, which is a difference of two squares, into two brackets',
      'Take the common factor out of the denominator, then cancel the bracket it shares with the top',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Get rid of the fraction first by multiplying both sides by the denominator, which undoes the dividing',
      'Take the term that is added on beside the subject across to the other side, leaving only the subject and the number in front of it',
      'Divide both sides by that number in front of the subject, then write the subject on its own on the left',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Clear the fraction by multiplying both sides by the denominator underneath, which undoes the dividing',
      'Take the term sitting beside the subject across to the other side, which undoes the adding and leaves the subject by itself',
    ],
    planMarks: [1, 1],
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
    plan: [
      'Start at the subject and read outwards, noting each thing that has been done to it, because you undo those things in the reverse order',
      'Clear whatever sits outside the square root first, taking a loose term across and dividing by anything multiplying the root, until the root stands alone on its side',
      'Square both sides to remove the root, then undo anything still attached to the subject so that it stands by itself',
    ],
    planMarks: [1, 1, 1],
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
    method: 'Square both sides to clear the root, then add the remaining term to the other side',
    plan: [
      'Undo the square root by squaring each side, which frees the subject from underneath it',
      'Add the term that is being taken away from the subject onto both sides, leaving the subject on its own',
    ],
    planMarks: [1, 1],
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
    plan: [
      'Read the right-hand side from the outside in and note what has been done to the subject, because you will undo those operations in the reverse order',
      'Deal with anything added or subtracted outside the fraction first, then multiply both sides by the number sitting under the $1$ so the fraction is gone',
      'Divide both sides by whatever is still multiplying the subject, and take across any term still sitting beside it',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Multiply out the bracket, taking the number outside onto each term inside it',
      'Collect the $x$ terms on one side and the plain numbers on the other, leaving the inequality sign as it stands',
      'Divide both sides by the number in front of $x$, flipping the inequality sign round if that number is negative, and give the answer as a range of values rather than a single one',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Work out the smallest number all the bottom lines divide into, then multiply each term on both sides by it so the fractions clear away',
      'Multiply out any bracket this leaves you with, then gather the $x$ terms on one side and the plain numbers on the other',
      'Divide both sides by the number in front of $x$, flipping the inequality sign round if that number is negative, and give the answer as a range of values rather than a single one',
    ],
    planMarks: [1, 1, 1],
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
    method: 'Multiply one equation so that a letter matches in both, add or subtract to eliminate that letter and get the first value, then substitute back for the second',
    plan: [
      'Multiply one equation right through, both sides, so that the $x$ terms or the $y$ terms match in size across the two equations',
      'Add or subtract the two equations so that the matching letter cancels away, leaving one equation in a single letter you can work out',
      'Put that answer back into either of the original equations to get the other letter, then write both letters out together',
    ],
    planMarks: [1, 1, 1],
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
    method: 'Scale one equation so the $x$ or the $y$ terms match, eliminate that letter and solve for both values, then write them as coordinates',
    plan: [
      'Multiply one of the two equations right through so the $x$ terms or the $y$ terms match in size across both',
      'Add or subtract the equations to cancel that matching letter, work out the letter left behind, then put it back into either equation for the other one',
      'Write the pair as coordinates in brackets with the $x$ one first, because the question asks for the point where the lines meet',
    ],
    planMarks: [1, 1, 1],
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
    method: 'Write an equation for each situation, multiply one of them so a letter matches, eliminate that letter for the first value, substitute back for the second, then give both answers in their units',
    plan: [
      'Give each of the two unknown amounts a letter and say what it stands for, then turn the first sentence into an equation: how many of each, multiplied by its letter, adding up to the total that sentence gives',
      'Do the same with the second sentence, so you have two equations sharing the same two letters',
      'Multiply one equation right through so one letter matches in both, then add or subtract to cancel that letter and work out the one left behind',
      'Put that back into either of your own equations for the other letter, then finish with a sentence naming both amounts in the units the question uses, because that wording carries a mark of its own',
    ],
    planMarks: [1, 1, 2, 2],
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
    plan: [
      'Give each of the two unknown amounts a letter and say what it stands for, then turn the first sentence into an equation: how many of each, multiplied by its letter, adding up to the total that sentence gives',
      'Do the same with the second sentence, so you have two equations sharing the same two letters',
      'Multiply one equation right through so one letter matches in both, add or subtract to cancel it, then put what comes out back in to get the other letter',
      'Go back to what the final part actually asks for, multiply each letter\'s amount by how many of that item it wants, add the two together and give the answer in its units',
    ],
    planMarks: [1, 1, 3, 1],
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
    plan: [
      'Replace every $x$ in the formula with the number written in the brackets after $f$, wrapping it in brackets of its own so a minus sign is carried into the power',
      'Work out the power first, then the adding and subtracting, until you are left with one number',
    ],
    planMarks: [1, 1],
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
    method: 'Set the function equal to the value you are given, then solve that equation for the unknown',
    plan: [
      'Write the formula out again with the unknown letter in place of $x$, and put the whole thing equal to the number the question says $f$ comes out as',
      'Take the number that is added on across to the other side, then divide both sides by the number in front of the letter',
    ],
    planMarks: [1, 1],
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
    method: 'Substitute the value into the function for part (a); for part (b) set the function equal to the number given and solve for the unknown',
    plan: [
      'For the first part, put the number from the brackets in place of every $x$ and work the arithmetic through to one number',
      'For the second part, write the formula out again with the unknown letter in place of $x$ and put it equal to the number given on the right',
      'Take the number that is added on across to the other side, then divide both sides by the number in front of the letter',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Replace $x$ with the number in the brackets, then work out the angle sitting inside the $\\sin$ or $\\cos$ before you touch anything else',
      'Use the exact value of that ratio at the angle you have ended up with, then multiply it by the number in front',
    ],
    planMarks: [1, 1],
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
    plan: [
      'Write the values out smallest to largest, since nothing below works on an unordered list',
      'Mark the median to split the list into a lower and an upper half, then take the middle value of each half for the lower and upper quartiles',
      'Subtract the lower quartile from the upper one for the interquartile range, then halve that if the question asks for the semi-interquartile range',
    ],
    planMarks: [0, 1, 1],
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
    method: 'Find the median and the two quartiles, subtract them for the interquartile range, then write one sentence comparing the medians and another comparing the spreads',
    plan: [
      'Write the values out in order and pick the middle one for the median',
      'Take the middle of the lower half and the middle of the upper half for the quartiles, then subtract the lower from the upper, halving it if the question asks for the semi-interquartile range',
      'Write one sentence comparing the two medians and name both data sets inside it, because a sentence that does not say whose values are whose scores nothing',
      'Write a second sentence comparing the two spreads, naming both sets again, since the average and the spread carry separate marks',
    ],
    planMarks: [1, 2, 1, 1],
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
    plan: [
      'Add all the values and divide by how many there are to get the mean $\\bar{x}$',
      'Subtract the mean from each value, square every one of those differences, and add them for $\\sum(x - \\bar{x})^{2}$',
      'Put that total into $s = \\sqrt{\\frac{\\sum(x - \\bar{x})^{2}}{n - 1}}$, where the top collects the squared differences and the bottom is one less than the number of values, then take the root',
      'Answer the last part from the standard deviations alone, saying what the size of each one tells you about how spread out that sample\'s values are, because the means say nothing about spread',
    ],
    planMarks: [1, 1, 2, 1],
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
    method: 'Find the mean, square each difference from it, substitute into the standard deviation formula and work it out, then write one sentence comparing the means and another comparing the spreads',
    plan: [
      'Add the values and divide by how many there are for the mean $\\bar{x}$, then subtract the mean from each value, square each difference and add those squares up',
      'Put that total into $s = \\sqrt{\\frac{\\sum(x - \\bar{x})^{2}}{n - 1}}$, where the top collects the squared differences and the bottom is one less than the number of values, then take the root',
      'Write one sentence comparing the two means and name both groups inside it, because a sentence that leaves out whose values are whose scores nothing',
      'Write a second sentence comparing the two standard deviations, naming both groups again, since the average and the spread carry separate marks',
    ],
    planMarks: [2, 2, 1, 1],
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
    plan: [
      'Add the values and divide by how many there are to get the mean $\\bar{x}$',
      'Subtract the mean from each value, square every difference, and add them for $\\sum(x - \\bar{x})^{2}$',
      'Put that total into $s = \\sqrt{\\frac{\\sum(x - \\bar{x})^{2}}{n - 1}}$, then split the root top and bottom, as the root of the bottom comes out whole and becomes the denominator you have been given',
      'Simplify the root on top by pulling out its largest square factor, then read off $a$ and $b$ by matching what you have against $\\frac{a\\sqrt{b}}{2}$',
    ],
    planMarks: [1, 1, 1, 1],
    answerShape: 'integer',
    webTopics: ['Standard Deviation', 'Simplifying surds'],
    skill: 'Express the standard deviation of five values in the form $\\dfrac{a\\sqrt{b}}{2}$',
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
    plan: [
      'Add the values and divide by how many there are for the mean $\\bar{x}$, then square each value\'s difference from it and add those squares',
      'Line the given root up against $s = \\sqrt{\\frac{\\sum(x - \\bar{x})^{2}}{n - 1}}$, so $a$ is everything sitting under the root: the total of the squared differences over one less than the number of values',
      'Work that fraction out for $a$, keeping in mind $a$ is the number under the root rather than the standard deviation itself',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Strip everything away from the trig ratio until it stands on its own — shift the added or subtracted number across first, then divide by whatever multiplies it',
      'Put that ratio through the inverse on your calculator, dropping any minus sign for the moment, to get the reference angle in the first quadrant',
      'Your calculator only ever hands back one angle, so mark the reference angle on a CAST diagram and find the other quadrant where that ratio carries the sign yours has — measuring back from $180$, back from $360$, or on past $180$ as that quadrant requires — then write down both angles',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Put the height the question hands you in place of $h$ in the formula, so the angle is the only thing left unknown',
      'Rearrange until the $\\cos$ term stands alone — take the constant across, then divide by the number in front, keeping any minus sign attached to the ratio',
      'Run that ratio through the inverse on your calculator, ignoring its minus sign if it has one, to get the reference angle',
      'The calculator gives only one angle, so put the reference angle on a CAST diagram and take both places where the cosine carries the sign yours does — measured back from $180$ or back from $360$ — then give both angles in the range asked for',
    ],
    planMarks: [1, 1, 1, 1],
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
    plan: [
      'Put the angle the question names in for $x$ and run the whole formula through your calculator in degree mode, keeping the multiplying before the adding',
      'For the smallest height, use that the cosine itself never leaves the range $-1$ to $1$: put whichever of those two ends makes the whole formula smallest in place of the $\\cos$ term, then work the height out',
    ],
    planMarks: [1, 1],
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
    method: 'Swap $\\tan x$ for $\\dfrac{\\sin x}{\\cos x}$, or take out a common factor, then use $\\sin^2 x + \\cos^2 x = 1$ to simplify what is left',
    plan: [
      'Scan the terms for a factor they all share and pull it out in front of a bracket — where a $\\tan x^{\\circ}$ blocks that, write it as $\\frac{\\sin x^{\\circ}}{\\cos x^{\\circ}}$ so every term is built from the same two functions',
      'Read what is left inside the bracket against $\\sin^{2} x^{\\circ} + \\cos^{2} x^{\\circ} = 1$: swapping that pair for $1$ lets the rest cancel down',
    ],
    planMarks: [1, 1],
    answerShape: 'expression',
    webTopics: ['Trigonometric identities'],
    skill: 'Replace $\\tan x$ with $\\dfrac{\\sin x}{\\cos x}$, or take out a common factor, then use $\\sin^2 x + \\cos^2 x = 1$',
  },
  'trig-identities.expand': {
    topic: 'Expanding Trigonometric Brackets',
    difficulty: 'exam', strategy: 'curated-pool', source: 'paper',
    basedOn: ['2019 P2 Q17'],
    marks: 2,
    route: 'expand the brackets, then simplify using sin squared plus cos squared equals one',
    plan: [
      'Multiply the bracket out against itself, term by term as you would with any squared bracket, keeping every product before you tidy anything',
      'Gather the two matching middle terms into one, then replace $\\sin^{2} x^{\\circ} + \\cos^{2} x^{\\circ}$ with $1$, since that pair always adds to $1$',
    ],
    planMarks: [1, 1],
    answerShape: 'expression',
    webTopics: ['Trigonometric identities', 'Expanding brackets'],
    skill: 'Expand the square, then collect $\\sin^2 x + \\cos^2 x$ into $1$',
  },
  'trig-identities.fractions': {
    topic: 'Trigonometric Fractions',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2022 P2 Q13'],
    marks: 2,
    route: 'express as separate fractions, then simplify',
    plan: [
      'Break the top up so that each term on the numerator sits over the denominator as a fraction of its own, joined by the sign that was between them',
      'Tidy each piece separately — one cancels down to the plain number in front of it, and a $\\frac{\\sin x^{\\circ}}{\\cos x^{\\circ}}$ left over is simply $\\tan x^{\\circ}$',
    ],
    planMarks: [1, 1],
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
    method: 'Substitute $\\cos^2 x = 1 - \\sin^2 x$, then collect the terms into the form the question asks for',
    plan: [
      'Compare what you have with the form printed in the question and spot which function has to disappear. Rearranging $\\sin^{2} x^{\\circ} + \\cos^{2} x^{\\circ} = 1$ gives you the swap that removes it, such as $\\cos^{2} x^{\\circ} = 1 - \\sin^{2} x^{\\circ}$',
      'Substitute that in, multiply out the bracket, then gather the plain numbers together so what is left has the same shape as the form asked for',
    ],
    planMarks: [1, 1],
    answerShape: 'expression',
    webTopics: ['Trigonometric identities'],
    skill: 'Substitute $\\cos^2 x = 1 - \\sin^2 x$, then collect terms into the given form',
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
    plan: [
      'Count the squares each arrow travels, going across first and then up, with left and down counted as negative',
      'Add the across components together and the up components together, and write the result as one column vector',
    ],
    planMarks: [1, 1],
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
    plan: [
      'Add the two given vectors one component at a time, across with across and up with up',
      'Draw a single arrow that moves by those components, starting anywhere on the grid, and put an arrowhead on it to show the direction',
    ],
    planMarks: [1, 1],
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
    method: 'Multiply each component by its scalar, then add the two vectors one component at a time',
    plan: [
      'Multiply every component of a vector by the number sitting in front of it, doing each vector in turn',
      'Combine the two results one component at a time, keeping the plus or minus that sits between them',
    ],
    planMarks: [1, 1],
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
    method: 'Subtract u from u + v, taking one component at a time',
    plan: [
      'Rearrange the vector equation so that $\\mathbf{v}$ is on its own, with $\\mathbf{u}$ subtracted from the sum you were given',
      'Subtract the matching components one row at a time to leave $\\mathbf{v}$ in component form',
    ],
    planMarks: [1, 1],
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
    plan: [
      'Shift everything except the term in $y$ over to the other side of the equals sign, changing signs as you go',
      'Divide every term by the number in front of $y$, and whatever is then multiplying $x$ is the gradient — sign included',
    ],
    planMarks: [1, 1],
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
    plan: [
      'Replace $x$ with 0, which kills off the $x$ term, and solve what is left for $y$',
      'Write your answer as a pair of coordinates inside brackets with 0 as the first number, since a lone value is not a point',
    ],
    planMarks: [1, 1],
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
    method: 'Find the gradient from the two points, substitute it and one point into $y - b = m(x - a)$, then tidy the equation into its simplest form',
    plan: [
      'Subtract the $y$-coordinates and divide by the difference of the $x$-coordinates, taking the points in the same order on the top and the bottom, to get the gradient',
      'Put the gradient and either point into $y - b = m(x - a)$, or into $y = mx + c$ to find $c$',
      'Multiply out any brackets and gather the numbers so the equation finishes with $y$ on its own',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Decide from the wording whether the two quantities are multiplied, or one divided by the other, or a percentage taken of one — a percentage becomes a decimal you multiply by — and write that calculation out with the powers of ten left in',
      'Work it out in one pass on your calculator using the $\\times 10^{n}$ button, then rewrite the display in scientific notation, checking the front number sits between $1$ and $10$ before you commit to it',
    ],
    planMarks: [1, 1],
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
    plan: [
      'Decide from the wording whether the quantities are multiplied or one is divided by the other, turning any percentage into a decimal multiplier, and write that calculation down with the powers of ten kept in',
      'Run the whole calculation through your calculator in one pass, using the $\\times 10^{n}$ button, and hold on to the full display rather than rounding at this stage',
      'Write the result in scientific notation with the front number between $1$ and $10$, then round that front number to three significant figures',
    ],
    planMarks: [1, 1, 1],
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
    method: 'Substitute the two sides and the cosine you are given into the cosine rule, work out the square of the missing side, then take its square root',
    plan: [
      'Name the missing side as the one facing the angle whose cosine you were handed, and write $a^{2} = b^{2} + c^{2} - 2bc\\cos A$ with the letters from your own triangle in it',
      'Put the two known lengths and the fraction straight in, then work the right hand side through — the bottom of the fraction cancels against the $2bc$, which is what keeps the arithmetic whole',
      'What you are left with is the square of the side, so take its square root and write the length down with its units',
    ],
    planMarks: [1, 1, 1],
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
    method: 'Rearrange the cosine rule to make $\\cos A$ the subject and substitute the three sides, then leave the cosine as a fraction in its simplest form',
    plan: [
      'Spot which side faces the angle you are asked about, because that is the one subtracted on the top line while the two meeting at the angle are squared and added: $\\cos A = \\frac{b^{2} + c^{2} - a^{2}}{2bc}$',
      'Put the three lengths in, work the top line and the bottom line out as whole numbers, then cancel the fraction down by whatever divides into both rather than turning it into a decimal',
    ],
    planMarks: [1, 1],
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
    method: 'Pair each side with the angle opposite it and substitute into the sine rule, multiply up to make the side the subject, then work it out',
    plan: [
      'Work out which angle faces the side you are chasing and which faces the side you already know, then write each of those sides over the sine of the angle facing it and set the two fractions equal',
      'Multiply both sides by the sine sitting underneath the missing length, so that length is on its own',
      'Work the resulting fraction out and write the length down with its units',
    ],
    planMarks: [1, 1, 1],
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
    skill: 'Area $= \\tfrac{1}{2}ab\\sin C$, with the angle between the two sides',
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
    plan: [
      'Pick out the radius — it is half the width across the sphere, and the formula is built from $r$, not the diameter',
      'Put that radius into $V = \\frac{4}{3}\\pi r^{3}$, cubing it before multiplying',
      'Work the volume out, then round it to the accuracy the question asks for and write the units in cubic form',
    ],
    planMarks: [1, 1, 1],
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
    method: 'Substitute into the volume of a sphere and evaluate, write that in scientific notation, then set up the division and evaluate it',
    plan: [
      'Substitute the radius into $V = \\frac{4}{3}\\pi r^{3}$ and work the volume out as an ordinary long number first',
      'Rewrite that number in scientific notation, rounding the front part to the accuracy the question asks for',
      'Read "how many times greater" as a division, and write the larger volume over the smaller one',
      'Divide the front numbers and subtract the powers of $10$ to finish',
    ],
    planMarks: [2, 1, 1, 1],
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
    plan: [
      'Halve the diameter for the radius, then put it and the height into $V = \\frac{1}{3}\\pi r^{2}h$, writing $3.14$ in place of $\\pi$',
      'Work through it by hand — multiply the radius squared by the height, take a third of that, then multiply by $3.14$',
    ],
    planMarks: [1, 1],
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
    route: 'substitute into $V = \\dfrac{Ah}{3}$ and solve, the scheme\'s method 1',
    plan: [
      'Put the base and an unknown height into $V = \\frac{1}{3}Ah$, setting it equal to the volume you were given',
      'Square the base length to get the area $A$, and tidy the left-hand side into a single multiple of $h$',
      'Divide the volume by that multiple to leave $h$ on its own, and write the height with its units',
    ],
    planMarks: [1, 1, 1],
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
    method: 'Work out the sphere\'s volume first, then substitute it into the volume of a cone and solve for the height',
    plan: [
      'Substitute the sphere\'s radius into $V = \\frac{4}{3}\\pi r^{3}$ and work out its volume',
      'Halve the cone\'s base diameter for its radius, then put that and an unknown height into $\\frac{1}{3}\\pi r^{2}h$ and set it equal to the volume you just found',
      'Rearrange to leave $h$ on its own, then work the height out to the accuracy the question asks for',
    ],
    planMarks: [2, 2, 1],
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
    plan: [
      'Halve the cone\'s diameter and put that radius and the height into $\\frac{1}{3}\\pi r^{2}h$ for the whole cone',
      'Do the same for the hemisphere — half of $\\frac{4}{3}\\pi r^{3}$, using half of its own diameter as the radius',
      'The part being asked about is what is left once the hemisphere is taken away, so subtract the hemisphere\'s volume from the cone\'s',
      'Carry out that subtraction on the unrounded figures, then round as asked and write the cubic units',
    ],
    planMarks: [1, 1, 1, 2],
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
    plan: [
      'Read the shape as a cone with its tip cut off, so what is left is one volume take away the other — you need both',
      'Halve the large cone\'s diameter and put that radius and its height into $\\frac{1}{3}\\pi r^{2}h$',
      'Do the same for the small cone, using its own radius and its own height',
      'Subtract the small volume from the large one, keeping the unrounded figures until the end, then round and state the cubic units',
    ],
    planMarks: [1, 1, 1, 2],
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
    plan: [
      'Halve the width across the outside to get the outer radius, then subtract the thickness of the coating from it to reach the radius underneath',
      'Put the outer radius into $\\frac{4}{3}\\pi r^{3}$ for the volume of the whole thing',
      'Put the inner radius into that same formula for the volume of the sphere sitting inside',
      'Subtract the inner volume from the outer one to leave only the coating, then round as asked and write the cubic units',
    ],
    planMarks: [1, 1, 1, 2],
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
    plan: [
      'Halve the diameter to get the radius shared by the dome and the cylinder, then find the dome as half of $\\frac{4}{3}\\pi r^{3}$',
      'Take the dome\'s own height, which is that same radius, off the total height — what is left is the cylinder\'s height',
      'Put the radius and that height into $\\pi r^{2}h$ for the cylinder',
      'Add the two volumes, then round as asked and state the cubic units',
    ],
    planMarks: [1, 1, 1, 2],
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
    plan: [
      'Halve the sphere\'s diameter and put that radius into $\\frac{4}{3}\\pi r^{3}$',
      'Take the sphere\'s full width off the total height to get the cuboid\'s height, then multiply it by the two base lengths',
      'Add the two volumes together and write the answer with its cubic units',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Work out the small pyramid with $V = \\frac{1}{3}Ah$, squaring its base length to get $A$',
      'Add the two parts of the height to find how tall the large pyramid stood before the tip came off, then use the same formula with its own base',
      'What is left behind is the large pyramid with the small one gone, so take the small volume away from the large',
      'Carry out that subtraction and write the answer with its cubic units',
    ],
    planMarks: [1, 1, 1, 1],
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
    plan: [
      'Halve the hemisphere\'s diameter for its radius, then take half of $\\frac{4}{3}\\pi r^{3}$',
      'Multiply the cuboid\'s height by its two base lengths to get the volume of the whole block',
      'The part being asked about is the block with the hemisphere scooped out, so subtract the hemisphere\'s volume from the cuboid\'s',
      'Carry out the subtraction on the unrounded figures, then round as asked and state the cubic units',
    ],
    planMarks: [1, 1, 1, 1],
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
    plan: [
      'Work out the smallest number both bottom lines divide into, then multiply each term on both sides by it so the fractions clear away',
      'Gather the $x$ terms on one side and the plain numbers on the other, tidying it down to the shape $ax = b$',
      'Divide both sides by the number in front of $x$, and leave the answer as a fraction in its simplest form rather than a rounded decimal',
    ],
    planMarks: [1, 1, 1],
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
    method: 'Write the expression for the border, form the area equation and rearrange it, then substitute into the quadratic formula, evaluate the discriminant, solve, and select and round the root that is a length',
    plan: [
      'Follow the length of the tile out to the edge of the board: the border sits at both ends, so the length gains $x$ twice, and the width gains $x$ twice for the same reason — write an expression for each',
      'Multiply those two expressions together and expand them for the area of the whole board, then set that equal to the area you are given and take every term to one side so the quadratic is equal to 0',
      'Read $a$, $b$ and $c$ straight off that quadratic, put them into the quadratic formula, and work out $b^{2} - 4ac$ underneath the square root sign',
      'Take the square root and work the fraction out twice, once with the plus and once with the minus, then throw away the negative value because a border cannot be a negative width, and round what is left to the accuracy the question asks for',
    ],
    planMarks: [1, 2, 2, 2],
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
    plan: [
      'Trace round the plan and mark which sides have a wall against them, since only those sides push the measurement outwards — count how many times $x$ gets added to each dimension, then write an expression for each',
      'Multiply those two expressions together and expand them for the area of the base, then set that equal to the area you are given and take every term to one side so the quadratic is equal to 0',
      'Read $a$, $b$ and $c$ straight off that quadratic, put them into the quadratic formula, and work out $b^{2} - 4ac$ underneath the square root sign',
      'Take the square root and work the fraction out twice, once with the plus and once with the minus, then reject the negative value because a wall cannot be a negative thickness, and round what is left to the accuracy the question asks for',
    ],
    planMarks: [1, 2, 2, 2],
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
    method: 'Write the triangle\'s area, equate it to the rectangle\'s, start to solve, rearrange, then solve',
    plan: [
      'Take the base and the height marked on the triangle and put them into half the base times the height, keeping the bracket as it stands rather than expanding it',
      'Write the area of the rectangle as its length times its breadth, then set the two areas equal because the question tells you they match',
      'Multiply both sides by 2 to clear the half, expand the brackets, gather the $x$ terms on one side and the plain numbers on the other, then divide by whatever is left multiplying $x$',
    ],
    planMarks: [1, 1, 3],
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
    method: 'Write the area, expand and rearrange it, then factorise, solve, and reject the negative root',
    plan: [
      'Multiply the length of the rectangle by its breadth and leave the answer as a pair of brackets for the moment',
      'Get the area of the square by multiplying its side by itself, set the two areas equal, expand both sides and take every term to one side so the quadratic is equal to 0',
      'Factorise that quadratic into two brackets, then set each bracket equal to 0 to get the two values of $x$',
      'Throw away the negative value because a side of a shape cannot be a negative length, then feed the one that survives back into the rectangle\'s length and breadth expressions to get its two measurements',
    ],
    planMarks: [1, 2, 2, 1],
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
    plan: [
      'Multiply the length of the rectangle by its breadth, then expand the brackets so its area is a tidy expression in $x$',
      'Read the base and the height off the triangle — watch for a base written as a multiple of a bracket — put them into half the base times the height, and expand that as well',
      'Set the two expanded areas equal, since the question says they match, and take every term to one side so the quadratic is equal to 0',
      'Factorise that quadratic into two brackets, set each bracket to 0 for the two values of $x$, reject the negative one because a length cannot be negative, and put the survivor back into the rectangle\'s expressions to get its measurements',
    ],
    planMarks: [2, 1, 1, 3],
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
    method: 'Write the volume expression and rearrange it into a quadratic, then substitute into the quadratic formula and solve',
    plan: [
      'Multiply the length, the breadth and the height of the store together to build an expression for its volume',
      'Set that expression equal to the volume given in the question, expand it, and take every term to one side so the quadratic is equal to 0',
      'Read $a$, $b$ and $c$ straight off that quadratic, put them into the quadratic formula, and work out $b^{2} - 4ac$ underneath the square root sign',
      'Take the square root and work the fraction out twice, once with the plus and once with the minus, then reject the negative value because a breadth cannot be negative, and round what is left to the accuracy the question asks for',
    ],
    planMarks: [1, 1, 2, 2],
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
    method: 'Square each component and add them up, then take the square root and leave it exact',
    plan: [
      'Square each component and add the results together',
      'Take the square root of that total, leaving it exact if it is not a whole number',
    ],
    planMarks: [1, 1],
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
    plan: [
      'Square each component and add the squares to get the number that will sit under the root',
      'Write the magnitude as the square root of that total, leaving the root in place for now',
      'Split the number under the root into its largest square factor times what is left, then bring the root of that square factor outside',
    ],
    planMarks: [1, 1, 1],
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
    method: 'Write the direct route down first, then go round through the midpoint instead, and collect the components',
    plan: [
      'Travel from one corner of the triangle to the far one by way of the corner in between, adding the two columns to express that route in component form',
      'Set off from the midpoint instead: take half of the column vector for the side it lies on, then travel the second given vector',
      'Add those columns together and write out the components of that pathway',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Pick a route between the two corners that uses only sides of the parallelogram, since no side joins them directly',
      'Swap each leg of that route for the lettered vector it copies, remembering opposite sides of a parallelogram are equal, and put a minus in front of any leg travelled against its arrow',
    ],
    planMarks: [0, 1],
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
    method: 'State the direct route, then take the pathway through the extension and the midpoint, and collect it',
    plan: [
      'Travel along the vector you are given from one corner, then back against the other one, to write the third side in terms of both letters',
      'Set off along the extended piece, which repeats the side it continues, then add half of that third side to land on its midpoint',
      'Multiply the half through the bracket and collect the terms in each letter',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Build a pathway from the start point to the end point out of the edges you have been told about, going the long way round since none of them joins the two directly',
      'Replace each edge with the multiple of the lettered vectors it stands for, flipping the sign wherever you travel against an arrow, then collect the like terms',
    ],
    planMarks: [1, 1],
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
    method: 'Get the side from the diagonal first, then take the pathway through the midpoint and collect it',
    plan: [
      'Cross from one corner to the next by reversing the side you are given and then running along the diagonal of the rhombus',
      'Add on half of the side the midpoint lies on, which is a copy of the side you were given, pointing the other way',
      'Collect the terms so each letter appears once in the pathway',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Add the two lettered vectors nose to tail to get the whole line, then take the fraction of it that the piece running on past the end is worth',
      'Build the pathway from the point you are asked about: travel to the end of that line, then on along the fraction beyond it, and gather the terms',
    ],
    planMarks: [1, 1],
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
    plan: [
      'Work out from the vertices that already carry coordinates which direction along the cuboid each of $x$, $y$ and $z$ runs',
      'Build the vertex you are asked for one coordinate at a time, taking each from whichever labelled vertex lies in line with it, and using 0 for any coordinate sitting on the floor or a wall',
      'For the midpoint, average the coordinates that change between the two ends of that edge and copy across the ones that stay the same',
    ],
    planMarks: [0, 1, 1],
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
    plan: [
      'Work out the cube\'s edge length from the solid beneath it, since it sits exactly across the top and all a cube\'s edges match',
      'For the point directly above the labelled one, keep its $x$ and $y$ and add the cube\'s edge to its height',
      'For the far top corner, step the cube\'s edge along $x$ and along $y$ from that point, checking against the diagram which way each step goes before writing it down',
    ],
    planMarks: [0, 1, 1],
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
    plan: [
      'Get the cube\'s side length from the labelled point, as that one measurement fixes every edge of it',
      'Read the far top corner of the cube off the diagram, putting the side length into each coordinate that has moved away from the origin and 0 into any that has not',
      'For the apex, halve the side length for both horizontal coordinates because it sits over the centre, then stack the pyramid\'s own height on top of the cube\'s',
    ],
    planMarks: [0, 1, 1],
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
    plan: [
      'Pick out which axis the prism\'s length runs along, and which pair of points each given edge length joins',
      'For the corner directly behind a labelled point, keep its other two coordinates and change only the one running along the prism\'s length',
      'Use the two equal sloping edges to place the last corner: it sits as far past the peak of the triangle as the given base point sits before it, and it rests on the ground so its height is 0',
    ],
    planMarks: [0, 1, 1],
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
    plan: [
      'Halve the given diameter for the radius, which is how far the centre of the base sits from each axis the circle touches',
      'Write down the point of contact: it takes the radius for the coordinate running along the axis it touches, and 0 for the other two',
      'For the point above the centre, use the radius for both horizontal coordinates and the cone\'s full height for the third',
    ],
    planMarks: [0, 1, 1],
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
    method: 'Start the rearrangement and state the gradient, then set y = 0 and state the intercept as coordinates',
    plan: [
      'Get the term in $y$ by itself on one side, moving the $x$ term and the number across',
      'Divide every term by the number in front of $y$, and whatever multiplies $x$ is the gradient',
      'For the second part go back to the original equation and replace $y$ with 0, since the line has no height where it meets the $x$-axis',
      'Solve that for $x$ and write the crossing point as coordinates in brackets, with 0 as the second number',
    ],
    planMarks: [1, 1, 1, 1],
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
    method: 'Find the related acute angle, recall its exact value, then give it the sign that quadrant requires',
    plan: [
      'Write your angle as a distance from $180$ or from $360$ — that tells you the related acute angle and which quadrant you have landed in',
      'The size of the value is unchanged from the one you were given, so keep that number and attach the sign that function carries in that quadrant, which a CAST diagram settles for you',
    ],
    planMarks: [0, 1],
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
    plan: [
      'Put each angle on a CAST diagram and work out the sign of each value from the quadrant it lands in, watching for any angle sitting exactly on an axis',
      'List them smallest first using those signs, then write out in words what the sign of each one is beside your list — that reason carries a mark of its own, so an unexplained ordering throws it away',
    ],
    planMarks: [1, 1],
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
    method: 'Drop a perpendicular from the centre to the chord to make a right-angled triangle, write Pythagoras down for it, work out the third side, then add or subtract the radius',
    plan: [
      'Halve the chord, because the perpendicular dropped from the centre lands on its midpoint and makes a right-angled triangle',
      'Write Pythagoras down for that triangle, with the radius as the hypotenuse and half the chord as one of the short sides',
      'Take the square root to get the distance from the centre to the chord',
      'Add that distance to the radius, or take it off, depending on whether the piece you want is the bigger one or the smaller one',
    ],
    planMarks: [1, 1, 1, 1],
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
    method: 'Square the two shorter sides and add them, square the longest side, compare the two numbers, then say whether it is right-angled and why',
    plan: [
      'Square the two shorter sides and add them together',
      'Square the longest side on its own',
      'Compare the two totals, then say whether the triangle is right-angled and give that comparison as your reason',
    ],
    // The shape holds across all three papers; only the money moves. 2026 P2 Q7
    // merges the comparison with the conclusion, so the last move is worth one
    // there and two everywhere else — which is exactly what a plan of moves can
    // carry and a rung-per-mark ladder could not.
    planMarks: [1, 1, 2],
    planMarksDiffer: { '2026 P2 Q7': [1, 1, 1] },
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
    method: 'Add the two parts together to get the shared base, then square and add the two shorter sides and compare with the longest squared, giving your conclusion and its reason together',
    plan: [
      'Add the two part-lengths along the base together to get the whole base, which is the longest side of the triangle',
      'Square the two shorter sides and add them together, then square that longest side on its own',
      'Compare the two totals, then say whether the triangle is right-angled and give that comparison as your reason',
    ],
    planMarks: [1, 1, 1],
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
    method: 'Work the missing distance out of the total first, then square and add the two shorter sides, compare that with the longest squared, and give your conclusion with a reason',
    plan: [
      'Take the two given distances away from the total to find the missing third side',
      'Square the two shorter sides and add them together, then square the longest side on its own',
      'Compare the two totals, checking whether they come out equal',
      'Say whether that angle is a right angle, giving the comparison as your reason',
    ],
    planMarks: [1, 1, 1, 1],
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
    method: 'The perpendicular from the centre cuts the chord in half, so write Pythagoras down for that right-angled triangle, work out the half-chord, then double it',
    plan: [
      'Take the radius off the height to get the distance from the centre down to the middle of the chord',
      'Write Pythagoras down for the right-angled triangle made by that distance, half the chord, and the radius as hypotenuse',
      'Take the square root to get half the chord',
      'Double that half, since the perpendicular from the centre cut the chord in two',
    ],
    planMarks: [1, 1, 1, 1],
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
    plan: [
      'Halve the chord, since the perpendicular from the centre meets it at its midpoint',
      'Write Pythagoras down with half the chord and the distance from the centre as the two short sides, and the radius as the hypotenuse',
      'Add those two squares, then take the square root to get the radius',
    ],
    planMarks: [1, 1, 1],
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
    method: 'Use Pythagoras across the base to get the face diagonal, then use it again with the height, and work the length out',
    plan: [
      'Square the length and the width of the base and add them, which gives the diagonal across the base, squared',
      'Add the height squared onto that total, with no need to square-root in between',
      'Take the square root to get the space diagonal, the longest straight line that fits inside the cuboid',
    ],
    planMarks: [1, 1, 1],
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
    method: 'Find the face diagonal, then the space diagonal, work its length out, then compare it with the object and say whether it fits',
    plan: [
      'Square the length and the width of the base and add them to get the diagonal across the base, squared',
      'Add the height squared onto that total, with no need to square-root in between',
      'Take the square root to get the space diagonal, the longest straight line inside the cuboid',
      'Compare that length with the object, then say whether it fits and give the comparison as your reason',
    ],
    planMarks: [1, 1, 1, 1],
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
    method: 'Read the coordinates of the vertex off the axes, use Pythagoras across the base of the cuboid, then use it again with the height to reach the space diagonal',
    plan: [
      'Write the missing corner\'s coordinates down, taking each one from whichever labelled vertex of the cuboid already shows it',
      'Square the three coordinates of that corner, since the line runs out from the origin',
      'Add the three squares together to get the square of the diagonal',
      'Take the square root to get the length of that diagonal',
    ],
    planMarks: [1, 1, 1, 1],
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
    plan: [
      'Write the missing base corner down by stepping from the given corner through the point directly below the apex, and the same distance on again',
      'Take the difference between that given corner and the apex in each of the three directions',
      'Square those three differences and add them together',
      'Take the square root to get the length from the base corner up to the apex',
    ],
    planMarks: [1, 1, 1, 1],
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
    method: 'Find the right-angled triangle joining the two centres, write Pythagoras down for it, work out the third side, then use it to reach the width',
    plan: [
      'Halve the chord that the two circles share, because the perpendicular from either centre cuts it in half',
      'Write Pythagoras down for the right-angled triangle made by that half-chord and the radius as hypotenuse, to reach the distance from a centre to the chord',
      'Take the square root to get that distance',
      'Add the radius to that distance and double it, since each circle reaches that far past the chord and then a full radius further',
    ],
    planMarks: [1, 1, 1, 1],
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
    method: 'Find the right-angled triangle hidden between the two centres, write Pythagoras down for it, work out the third side, then add what the radii contribute to the height',
    plan: [
      'Halve the straight edge to get the chord one shape stands on, then halve that chord too, since the perpendicular from the centre bisects it',
      'Write Pythagoras down with the radius as hypotenuse, taking the square of that quarter-length away from the square of the radius',
      'Take the square root to get the distance from the centre to the chord',
      'Add the radius to that distance and double it, since one shape stands clear above the straight edge and one below',
    ],
    planMarks: [1, 1, 1, 1],
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
    method: 'Find the right-angled triangle between the two centres, write Pythagoras down for it, work out the third side, then add the radii to reach the total height',
    plan: [
      'Mark in the head\'s radius twice: once out to the side of the head, and once down to the body\'s centre, which lies on the head\'s circumference',
      'Write Pythagoras down for the right-angled triangle those two make at the head\'s centre, with the body\'s radius as its hypotenuse',
      'Take the square root to get the body\'s radius',
      'Add the head\'s radius, the drop down to the body\'s centre, and the body\'s radius to reach the total height',
    ],
    planMarks: [1, 1, 1, 1],
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
    method: 'Substitute the two sides and the angle between them into the cosine rule, work out the square of the missing side, then take its square root',
    plan: [
      'Check that the given angle sits between the two known sides, which is what lets the cosine rule work here, and write $a^{2} = b^{2} + c^{2} - 2bc\\cos A$ with the missing length as $a$',
      'Put the two lengths and the angle in and work the whole right hand side out in one pass on your calculator — what you get is the square of the missing side, not the side itself',
      'Square root that number to get the length, then round it to the accuracy the question names and add the units',
    ],
    planMarks: [1, 1, 1],
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
    method: 'Substitute the three sides into the cosine rule rearranged for $\\cos A$, work out the cosine, then take the inverse to get the angle',
    plan: [
      'Call the side facing the angle you want $a$, and the two sides meeting at that angle $b$ and $c$, then write the cosine rule in its rearranged shape, $\\cos A = \\frac{b^{2} + c^{2} - a^{2}}{2bc}$',
      'Put the three lengths in and work the fraction out as a single number, keeping its minus sign if the top comes out below zero',
      'Take the inverse cosine of that number to get the angle, then round it as the question asks',
    ],
    planMarks: [1, 1, 1],
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
    method: 'Pair each side with the angle opposite it and substitute into the sine rule, rearrange to make the sine the subject, then take the inverse to get the angle',
    plan: [
      'Match each length in the diagram with the angle facing it across the triangle, then feed the two complete pairs into $\\frac{\\sin A}{a} = \\frac{\\sin B}{b}$, putting the sine of the angle you want on top',
      'Multiply both sides by the length underneath that unknown sine so the sine is by itself, then work the right hand side out as a decimal',
      'Take the inverse sine of that decimal to get the acute angle, and round it the way the question asks',
    ],
    planMarks: [1, 1, 1],
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
    method: 'Substitute the two sides and the angle between them into $\\frac{1}{2}ab\\sin C$, then work the area out',
    plan: [
      'Pick out the angle sitting between the two lengths you have been given, since the area formula only works with that one, and write $\\text{Area} = \\frac{1}{2}ab\\sin C$ with those lengths as $a$ and $b$',
      'Put the lengths and the angle in, work it through with your calculator in degree mode, then round as the question asks and finish with square units',
    ],
    planMarks: [1, 1],
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
    method: 'Turn the two bearings into the angles inside the triangle, substitute into the sine rule, rearrange it, then work out the distance',
    plan: [
      'Draw a north line at each point you were given a bearing from and subtract to turn those bearings into angles inside the triangle, then take the two you have off $180$ to get the third',
      'Pair each side with the angle facing it, and write the sine rule with the length you are after over the sine of its own angle on one side, the known pair on the other',
      'Multiply both sides by the sine sitting underneath the missing length, so that length stands alone',
      'Work the fraction out in one pass on your calculator, round to the accuracy the question names, and write the units in',
    ],
    planMarks: [1, 1, 1, 1],
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
    plan: [
      'Every side is known and no angle is, which is the cosine rule rearranged for an angle: square and add the two sides meeting at the corner you want, subtract the square of the side facing it, and divide by twice the product of those two sides',
      'Work that whole fraction out to get the cosine, keep the full decimal on the display, then press inverse cosine to turn it into the angle itself',
      'For the bearing part, add $180$ to the bearing you were given, because you are now measuring from a north line at the other end of that same line',
      'Read the diagram to see whether the angle you found turns clockwise or anticlockwise from that back bearing, apply it, and give the result as a three-figure bearing measured clockwise from north, taking $360$ off if you have gone past it',
    ],
    planMarks: [1, 2, 1, 1],
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
    method: 'Substitute the three sides into the cosine rule, work out the cosine, take the inverse to get the angle, then measure that angle from north to turn it into a bearing',
    plan: [
      'All three sides are known and no angle is, so square and add the two sides that meet at the corner you want, subtract the square of the side facing that corner, and divide the lot by twice the product of those two sides',
      'Work the top and the bottom out and divide, which leaves you the cosine of that angle rather than the angle — keep the full decimal on your calculator',
      'Press inverse cosine on that decimal to get the angle at the corner',
      'Read the diagram to see which way that angle turns from the bearing you were given, then write the answer as a three-figure bearing measured clockwise from north, rounded as the question asks',
    ],
    planMarks: [1, 1, 1, 1],
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
    method: 'Substitute into the sine rule, rearrange to make the sine the subject, take the inverse to get the angle, then measure it from north to give a bearing',
    plan: [
      'Draw a north line where the bearing is given and subtract to turn it into the angle inside the triangle, then pair each known side with the angle facing it and write the sine rule with the sines on top',
      'Rearrange so the sine of the unknown angle is on its own, and work that number out',
      'Press inverse sine to turn it into an angle, then take it and the angle you started with off $180$ to reach the angle at the corner the bearing is asked from',
      'Work out the bearing back along the side you already know, turn through that angle in the direction the diagram shows, and give a three-figure bearing measured clockwise from north',
    ],
    planMarks: [1, 1, 1, 1],
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
    method: 'Substitute into the sine rule and rearrange it to get the slant length, then put that length into the right-angled triangle and use it to find the height',
    plan: [
      'Fill in the missing angle at the top of the slanted triangle by taking both angles of elevation away from 180',
      'Pair the base length with the angle facing it in the sine rule, and the slant distance up to the object with the angle facing that, then rearrange and work the slant distance out',
      'Use that slant distance as the hypotenuse of the right-angled triangle made by dropping the height to level ground, with the angle of elevation at that end, to reach the height',
    ],
    planMarks: [1, 2, 2],
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
    method: 'Substitute into the sine rule and rearrange it to get the slant side, then use that side in the right-angled triangle to reach the perpendicular',
    plan: [
      'Take the two marked angles away from 180 to fill in the third angle of the whole triangle',
      'Pair each side with the angle facing it in the sine rule to reach the slanted side running from the top vertex down to the given base, then rearrange and work its length out — the perpendicular cannot be found without it',
      'Use that slanted side as the hypotenuse of the small right-angled triangle formed by the perpendicular, with the angle at the base vertex, to reach the perpendicular',
    ],
    planMarks: [1, 2, 2],
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
    method: 'Use the angle on the straight line to fill in the triangle, substitute into the sine rule and rearrange it for the slant length, then use that length to reach the distance along the ground',
    plan: [
      'Subtract the nearer angle of elevation from 180 to get the angle inside the triangle there, because that angle and the elevation sit together on the level ground, then take that and the far elevation from 180 for the angle at the top',
      'Pair the distance between the two viewing points with the angle facing it in the sine rule, against the slant length up to the top and its own opposite angle, and rearrange to make the slant length the subject',
      'Work that slant length out — it is the side the right-angled triangle is built on',
      'Use it as the hypotenuse in that right-angled triangle, with the nearer angle of elevation, to reach the distance along the ground',
    ],
    planMarks: [1, 1, 1, 2],
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
    plan: [
      'Take the side beside the shared angle over the hypotenuse of the small right-angled triangle to get $\\cos$ of that angle, and keep it as a fraction rather than rounding it',
      'Add the pieces along each arm to get the two full sides of the large triangle that meet at that same angle',
      'Put those two sides and your fraction into the cosine rule to get the square of the side you are after',
      'Square root that total, and round it the way the question asks',
    ],
    planMarks: [1, 1, 1, 1],
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
    method: 'Find the sine from the small right-angled triangle, put it into the area of a triangle formula, set that equal to the area you are given, then solve for the length',
    plan: [
      'Take the perpendicular over the hypotenuse in the small right-angled triangle to get $\\sin$ of the angle the two triangles share, and keep it as a fraction rather than rounding it',
      'Add the pieces along the arm to get the full side of the large triangle, then put that side, the unknown side and your fraction into $\\frac{1}{2}ab\\sin C$',
      'Set that expression equal to the area you are given, since the area is what pins the unknown length down',
      'Rearrange the equation to leave the unknown length on its own',
    ],
    planMarks: [1, 1, 1, 1],
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
    method: 'Take the supplement of the angle you are given, because it sits on a straight line, then substitute into the sine rule, rearrange it, and find the length',
    plan: [
      'Work out the angle inside the triangle at that corner by taking the marked angle from 180 — the two of them together fill the straight line',
      'Pair that angle with the side facing it in the sine rule, alongside the given side and its own opposite angle, then rearrange to make the wanted length the subject',
      'Work that length out and round it the way the question asks',
    ],
    planMarks: [1, 1, 1],
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
    method: 'Substitute the two sides and the sine you are given into $\\frac{1}{2}ab\\sin C$, then work the area out exactly',
    plan: [
      'Check that the angle whose sine you have been handed is the one between the two given lengths, then set up $\\text{Area} = \\frac{1}{2}ab\\sin C$ with those lengths in place',
      'Slot the fraction you were given straight in where $\\sin C$ goes rather than reaching for a calculator, then cancel the numbers down to a single exact value and add the square units',
    ],
    planMarks: [1, 1],
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
    method: 'Divide 360 by six for the angle at the centre, substitute into the area of a triangle formula, multiply by six for the whole hexagon, then give the area with its units',
    plan: [
      'Divide 360 by six to get the angle at the centre, then find the length from the centre out to a corner, halving a diagonal if that is what you are given',
      'Put two of those lengths and that centre angle into $\\frac{1}{2}ab\\sin C$ for the area of one triangle',
      'Multiply that area by six, since the six triangles are identical and together they fill the hexagon',
      'Give the total area with square units, rounded the way the question asks',
    ],
    planMarks: [1, 1, 1, 1],
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
    method: 'Write the angle as a fraction of 360, substitute the radius into the sector area formula, then work the area out',
    plan: [
      'Write the angle over 360 — that fraction is how much of the whole circle the sector takes up',
      'Multiply that fraction by the area of the whole circle, $\\pi$ times the radius squared',
      'Work the area out, rounding to the accuracy the question asks for',
    ],
    planMarks: [1, 1, 1],
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
    method: 'Write the angle as a fraction of 360, substitute it into the sector area formula with pi taken as 3.14, then work the area out',
    plan: [
      'Write the angle over 360 to get the sector\'s share of the whole circle',
      'Multiply that share by $\\pi$ times the radius squared, putting $3.14$ in place of $\\pi$',
      'Work the area out with $3.14$, not the calculator\'s own $\\pi$ button',
    ],
    planMarks: [1, 1, 1],
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
    method: 'Write the angle as a fraction of 360, substitute the radius into the arc length formula, then work the arc out',
    plan: [
      'Write the angle over 360 — for a major arc that is the angle going the long way round',
      'Multiply that fraction by the whole circumference, $\\pi$ times the diameter, and the diameter is twice the radius',
      'Work the arc length out and round it as the question asks',
    ],
    planMarks: [1, 1, 1],
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
    method: 'Write the angle as a fraction of 360, substitute it into the arc length formula with pi taken as 3.14, then work the arc out',
    plan: [
      'Write the angle over 360 to get the arc\'s share of the way round the circle',
      'Multiply that share by $\\pi$ times the diameter, doubling the radius for the diameter and taking $\\pi$ as $3.14$',
      'Work the arc length out with $3.14$ rather than the calculator\'s own $\\pi$',
    ],
    planMarks: [1, 1, 1],
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
    method: 'Work back from the arc to find what fraction of the circle it is, turn that fraction into the angle, then use the angle in the sector area formula',
    plan: [
      'Divide the arc by the whole circumference, $\\pi$ times the diameter, to find what fraction of the circle the sector covers',
      'Turn that fraction into the area — either as that fraction of the whole circle\'s area, or as half the arc times the radius',
      'Work the area out, rounding as the question asks',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Work out the whole circumference, $\\pi$ times the diameter, so you have something to measure the arc against',
      'Divide the arc by that circumference, then multiply by 360, since a full turn is 360 degrees',
      'Work that out and give the angle at the centre in degrees',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Write the angle over 360 — that is the share of the circle the arc covers',
      'Set that share of the circumference, $2\\pi r$, equal to the arc length you are given',
      'Divide the arc by that fraction to undo it, which leaves the whole circumference',
      'Divide the circumference by $2\\pi$ to get the radius, rounding as asked',
    ],
    planMarks: [1, 1, 1, 1],
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
    plan: [
      'Write the angle at the centre over 360, the share of the circle the small sector takes',
      'Multiply that share by the whole circle\'s area, $\\pi$ times the radius squared, to get that sector',
      'Find the triangle at the centre with $\\frac{1}{2}ab\\sin C$, using the two radii and the angle between them',
      'Take the triangle from the sector for the small piece, then take that piece away from the whole circle\'s area to leave the shaded part',
    ],
    planMarks: [1, 1, 1, 2],
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
    method: 'A segment is the sector with the triangle taken out of it, so write the angle as a fraction of 360, find the sector, find the triangle, then subtract',
    plan: [
      'Write the angle at the centre over 360, the share of the circle the sector takes',
      'Multiply that share by the whole circle\'s area, $\\pi$ times the radius squared, to get the sector',
      'Find the triangle at the centre with $\\frac{1}{2}ab\\sin C$, using the two radii and the angle between them',
      'Subtract the triangle from the sector — what is left is the shaded segment',
    ],
    planMarks: [1, 1, 1, 2],
    answerShape: 'rounded',
    webTopics: ['Area of a Triangle', 'Sector area'],
    skill: 'The sector less the triangle inside it',
  },

  'sector.triangle-minus-sector': {
    topic: 'A Sector Cut Out of a Triangle',
    difficulty: 'exam', strategy: 'input-first', source: 'paper',
    basedOn: ['2018 P2 Q17'],
    marks: 5,
    route: 'the triangle by $\\tfrac{1}{2}ab\\sin C$, the fraction of the circle, the sector area, know to subtract, then evaluate with units. The sector and the triangle share the angle at O, which is what makes it one question',
    plan: [
      'Find the triangle first: it has two sides with the angle between them, so use $\\frac{1}{2}ab\\sin C$',
      'Write the sector\'s angle over 360, and it is the same angle that sits at the apex',
      'Multiply that fraction by the whole circle\'s area, $\\pi$ times the radius squared, to get the sector',
      'Take the sector away from the triangle, work the shaded area out and put the units on it',
    ],
    planMarks: [1, 1, 1, 2],
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
    plan: [
      'For part (a), write the linear scale factor as one radius over the matching radius of the other sector',
      'Square that scale factor, because areas scale by the square of it, multiply the area you are given by it and work the other area out',
      'For part (b), set the angle over 360 times the whole circle\'s area equal to the larger sector\'s area',
      'Rearrange that equation to leave the angle on its own, then work the angle out',
    ],
    planMarks: [1, 2, 1, 2],
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
    plan: [
      'Count the vertices, then divide 360 by that count — they sit equally spaced round the circle, so that gives the angle at the centre',
      'Write that angle over 360 and multiply by the whole circle\'s area, $\\pi$ times the radius squared, to get one sector',
      'Find the triangle at the centre with $\\frac{1}{2}ab\\sin C$, two radii with that angle between them',
      'Take the triangle from the sector to leave the shaded segment, and state the units with your answer',
    ],
    planMarks: [1, 1, 1, 2],
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
    plan: [
      'Count the sides of the polygon, then find the angle at one of its corners: subtract 2 from that count, multiply by 180 and divide by the number of sides',
      'Take that corner angle off 180 where the side is produced into a straight line, then subtract both known angles from 180 in the triangle, because the angles of a triangle add to 180',
    ],
    planMarks: [1, 1],
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
    plan: [
      'Subtract the angle you are given from 180, because the diameter runs straight through the middle and the angles sitting along it add to 180',
      'Drop into the triangle made by the two radii: it is isosceles, so take that centre angle off 180 and halve what is left to get each equal base angle',
      'Add the $90^{\\circ}$ between the radius and the tangent onto that base angle, since the tangent touches at the very end of that radius',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Subtract the angle at the point of contact from $90^{\\circ}$, since a radius meets a tangent square on, then carry that size across to the far base of the triangle made by two radii',
      'Mark the $90^{\\circ}$ standing on the diameter, the angle in a semicircle, and use the angles of that triangle adding to 180 to find its remaining angle',
      'Add your two angles, as they sit on opposite sides of the diameter and together make the angle asked for',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Take the angle given at the point of contact away from $90^{\\circ}$, because a radius meets a tangent at right angles',
      'That radius and the one to the chord\'s other end make an isosceles triangle, so double your angle and subtract from 180 for the angle at the centre, then take that off 180 again as the diameter carries on as a straight line',
      'Finish in the triangle sitting outside the circle, where the angles add to 180 and the corner at the point of contact is the right angle with the tangent',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Subtract the angle given at the centre from 180 to reach the angle where that radius meets the chord, because the chord and the line it is parallel to trap a pair of angles on the same side that add to 180',
      'Copy that angle to the chord\'s other end, since the two radii make an isosceles triangle, then take both off 180 for the angle at the centre',
      'Work round the quadrilateral made by the two tangents and the two radii: its angles add to 360 and each tangent meets its radius at $90^{\\circ}$',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Take the angle you are given off 180, because the diameter carries straight on through that point and the angles along it add to 180',
      'Double that angle, since an angle at the centre is twice the angle at the circumference standing on the same arc',
      'Close the quadrilateral formed by the two tangents and the two radii drawn to their points of contact: its angles add to 360 and both radius-to-tangent corners are $90^{\\circ}$',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Start on the side where a base angle is given: the two radii make that triangle isosceles, so double the angle and take it off 180 for its angle at the centre',
      'On the other side, subtract the second given angle from the $90^{\\circ}$ between the radius and the tangent, then run the same isosceles working for that triangle\'s angle at the centre',
      'Add the two centre angles, as they lie on opposite sides of the radius and together sweep out the reflex angle',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Divide 360 by the number of corners the shape has, because its vertices are spread evenly round the circle and share the turn at the centre equally',
      'Subtract that from 180 for the angle next to it at the centre, since the diameter runs straight across',
      'Finish in the triangle made by two radii: it is isosceles, so take the centre angle off 180 and halve what is left',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Divide 360 by the number of sides of the polygon to get the turn from one side to the next at each corner',
      'Add that turn onto the $90^{\\circ}$ where the crossbar meets the upright, because the shaded angle is those two parts together',
    ],
    planMarks: [1, 1],
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
    plan: [
      'Write the linear scale factor as the height of the solid you want over the matching height of the one you are given, so it scales in the right direction',
      'Cube that scale factor, because a volume is three-dimensional and scales by the cube of the linear one, then multiply the volume you are given by it',
      'Work that out, and write the volume units beside your answer',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Write the linear scale factor as the length on the figure you want over the matching length on the figure you are given, so it scales in the right direction',
      'Square that scale factor, because an area is two-dimensional and scales by the square of the linear one, then multiply the area you are given by it',
      'Work that out, and write the square units beside your answer',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Write the linear scale factor as the length on the shape whose cost you want over the matching length on the other shape',
      'The cost follows the area, so square that scale factor, since areas scale by the square of the linear one, and multiply the cost you are given by it',
      'Work that out, and give the answer as an amount in pounds and pence',
    ],
    planMarks: [1, 1, 1],
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
    method: 'Find the linear scale factor and cube it for the volume, compare that with the volume you are given and say why they cannot be similar; then use the real volume scale factor and take its cube root',
    plan: [
      'For part (a), treat the two solids for the moment as if they were similar, and write the linear scale factor as one length over the matching length on the other',
      'Cube that scale factor, because volumes scale by the cube of the linear one, and multiply the volume you are given by it to see what the other volume would have to be',
      'Compare that with the volume the solid actually holds, and write a sentence saying what the mismatch tells you about the two solids',
      'For part (b) the solids really are similar, so divide the new volume by the original volume to get the volume scale factor, take its cube root to come back down to a length, and multiply the original length by it',
    ],
    planMarks: [1, 1, 1, 2],
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
    plan: [
      'The parallel line makes the small triangle and the whole triangle similar, so write the two parallel sides as a fraction, small over large',
      'Set the side down the sloping edge of the small triangle over the whole of that edge equal to that fraction, remembering the whole edge is $x$ plus the piece added on below it',
      'Cross-multiply, gather the $x$ terms on one side and the number on the other, then work $x$ out',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'The two triangles are similar, so write the linear scale factor as the short parallel side over the long parallel side',
      'Multiply the full length of the sloping side by that scale factor, which gives you the part of it belonging to the small triangle',
      'Subtract that part from the full length, because the piece you have been asked for is what is left over',
    ],
    planMarks: [1, 1, 1],
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
    plan: [
      'Write the linear scale factor as the height of the large triangle over the height of the small one',
      'Square that scale factor, because areas scale by the square of the linear one, and multiply the area you are given by it',
      'Work that out, which gives you the area of the whole large triangle',
      'Subtract the small triangle\'s area from it, since the section you have been asked for is what is left around the outside',
    ],
    planMarks: [1, 1, 1, 1],
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

/**
 * The variations the website may offer: exam tier, and nothing else.
 *
 * Warm-ups are deliberately out of scope for the port — they are starters to
 * put on a board, not questions to print on a homework, and a sheet that
 * mixed them in would be a sheet whose difficulty nobody chose.
 *
 * It lives here rather than in the website's adapter so that the check which
 * enforces it can live with the other checks, and so both sides read one list
 * rather than each carrying its own idea of what is offered. `codes.ts` fails
 * if a warm-up appears here, and the adapter refuses one it is handed anyway —
 * a filter and a guard, because the filter is the thing a future caller can
 * forget to apply.
 */
export function offeredVariationIds(): string[] {
  return Object.entries(N5_VARIATIONS)
    .filter(([, m]) => m.difficulty === 'exam')
    .map(([id]) => id);
}

/**
 * The groups and topics a teacher may be shown, in the course's own order.
 *
 * **Not `TOPIC_GROUPS_N5`.** 36 of the 210 topics have only warm-up variations,
 * and two whole groups — "N5 Rounding" and "N5 Arcs, Sectors and Volume" —
 * have nothing exam-tier in them at all. A picker built from the raw groups
 * would offer "Arc Length", take a count for it, and hand back nothing: the
 * sheet would silently come up short and the teacher would have no idea which
 * topic did it.
 *
 * So the picker is derived from what can actually be generated rather than
 * from what exists. A group with nothing offerable does not appear; a topic
 * with only warm-ups does not appear inside one.
 *
 * The order is the course's, because `planTopics` orders a grouped sheet by
 * `courseOrder` and a sheet should read down the picker.
 */
export function offeredTopicGroups(): Record<string, Topic[]> {
  const offerable = new Set(offeredVariationIds().map(id => N5_VARIATIONS[id].topic));
  const out: Record<string, Topic[]> = {};
  for (const [group, topics] of Object.entries(TOPIC_GROUPS_N5)) {
    const keep = topics.filter(t => offerable.has(t));
    if (keep.length) out[group] = keep;
  }
  return out;
}

/** Every offerable topic, flat, in the order the picker shows them. */
export function offeredTopics(): Topic[] {
  return Object.values(offeredTopicGroups()).flat();
}

/**
 * The variations filing under one of the website's own subtopics.
 *
 * This is the bridge that lets the Explorer generate from the filter a teacher
 * has already set. `webTopics` is spelled in the website's vocabulary - the 57
 * strings in its `lib/n5-topics.ts` - and the Explorer filters on exactly those
 * strings. So "five more on Rationalising the denominator" needs no second
 * topic picker and no mapping table: the two sides were already saying the same
 * word, and `webtopics.ts` is what keeps that true.
 *
 * Exam tier only, like everything else offered. Empty for a subtopic nothing
 * files under - which `webtopics.ts` reports cannot happen today, since all 57
 * carry at least one variation.
 */
export function variationsForSubtopic(subtopic: string): string[] {
  return offeredVariationIds()
    .filter(id => N5_VARIATIONS[id].webTopics.includes(subtopic));
}
