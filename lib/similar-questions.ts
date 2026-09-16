import { paperRef } from '@/lib/question-number.mjs';
import type { QuestionWithMetadata } from '@/lib/data-loader';

/**
 * Which past paper questions can offer a freshly generated variation.
 *
 * **Nothing here imports the engine.** This module is reached by every question
 * card the Explorer draws, and the engine is 33,000 lines — one value import
 * would put it on the whole past paper archive. The engine is loaded with
 * `await import()` at the moment a teacher actually asks for a question.
 */

/**
 * The shape the National 5 variation registry writes in `basedOn`.
 *
 * Deliberately strict. `2017 Spec P1 Q1` and `Specimen Q10` are real labels on
 * this site and nothing is modelled on them; a looser pattern would show the
 * control and then find nothing behind it.
 */
const N5_PAPER_LABEL = /^\d{4} P[12] Q\d+$/;

/**
 * The label to ask the generator about, or null if this question cannot have
 * variations.
 *
 * Taken from the question's printed badge — see `paperRef`. Never rebuilt from
 * `year`/`paperNumber`/`questionNumber`, which is wrong on at least one surface
 * in a way that produces a plausible label for the wrong question.
 */
export function variationLabel(questionHtml: string | undefined): string | null {
  const ref = questionHtml ? paperRef(questionHtml) : null;
  return ref && N5_PAPER_LABEL.test(ref) ? ref : null;
}

/**
 * The label for a question, preferring one the surface already holds.
 *
 * **An explicit label beats a scraped one, and both beat nothing.** Guided
 * practice renders past paper questions with the badge stripped out —
 * `resolveQuestions` moves it to `ResolvedQuestion.paper` — so anything that
 * only scrapes finds nothing there, and silently offers nothing on the very
 * questions that have a marking instruction behind them.
 *
 * What it will *not* do is accept a label built from `year`/`paperNumber`/
 * `questionNumber`: at least one surface synthesises those and would produce a
 * plausible label for the wrong question. Callers pass the printed badge or
 * nothing.
 */
export function paperLabelOf(
  explicit: string | null | undefined,
  questionHtml?: string,
): string | null {
  if (explicit && N5_PAPER_LABEL.test(explicit)) return explicit;
  return variationLabel(questionHtml);
}

/**
 * Should this question offer "add a variation"?
 *
 * National 5 only: the other four courses have no audited variations and no
 * seeding. On those the control must be **absent**, not disabled — four courses
 * out of five carrying a dead button on every card reads as a broken site
 * rather than as a roadmap.
 *
 * A true here is a strong hint, not a promise: all 328 National 5 past paper
 * questions are modelled on by some variation today, and the generator's
 * `paper-coverage` check keeps that true, but the caller must still handle
 * getting nothing back.
 */
/**
 * Does this course have hints behind it at all?
 *
 * National 5 only, like everything else the generator backs. Kept as one
 * function rather than three `=== 'n5'` literals because the controls that read
 * it live in three files, and a control that renders where nothing can answer
 * it is a dead control — which on four courses out of five reads as a broken
 * site rather than as a roadmap.
 */
export function courseHasHints(courseId: string | undefined): boolean {
  return courseId === 'n5';
}

/**
 * Papers we hold questions from but hold no marking instructions for.
 *
 * **2021 is the only one, and it is the whole year.** Every other year in
 * `reference/N5_Markschemes/` has a transcribed `.md` beside its PDF; 2021 has
 * `mi_N5_Mathematics_all_2021.pdf` and nothing else, so `readSchemes` has never
 * seen a row of it and `PLAN_OF` has no entry for any of its 21 questions.
 *
 * **Why this is a set of papers rather than a list of the 21 labels.** The gap
 * is a property of the paper, not of the questions we happen to have typed up
 * so far. A list of labels would go stale the moment a twenty-second 2021
 * question was added to a practice topic — and it would go stale *silently*,
 * putting the dead button straight back. Two strings cannot.
 *
 * **What went wrong without it.** `paperLabelOf` answers "is this a National 5
 * past paper question", and that was being read as "does this have a ladder".
 * For 2021 the two came apart: the button rendered, `reveal()` looked
 * `PLAN_OF["2021 P1 Q2"]` up, got nothing, and left `staged` null — so the
 * overlay opened empty, under a footer offering `More help (2 left)` that could
 * be pressed for ever and never produce a word. An absent button is honest; a
 * button that opens nothing is not.
 *
 * This is an absence with a way out: the PDF is sitting in the reference
 * folder. Transcribe it, re-emit `paper-plan.ts`, and `check:hintgap` will
 * insist these strings are deleted — it fails on a suppression that has stopped
 * being true as hard as on a gap that is not suppressed.
 */
const NO_MARKSCHEME: ReadonlySet<string> = new Set(['2021 P1', '2021 P2']);

/** The papers with no marking instructions, for the check that polices them. */
export const NO_MARKSCHEME_PAPERS: readonly string[] = [...NO_MARKSCHEME];

/**
 * The label to ask the hint table about, or null where no ladder can exist.
 *
 * `paperLabelOf` with the papers we hold no marking instructions for taken out.
 * Everything that decides whether to offer help goes through here, so the
 * button and the note explaining its absence cannot disagree.
 */
export function ladderLabel(
  explicit: string | null | undefined,
  questionHtml?: string,
): string | null {
  const label = paperLabelOf(explicit, questionHtml);
  if (label === null) return null;
  // "2021 P1 Q2" -> "2021 P1". The label shape is fixed by N5_PAPER_LABEL.
  return NO_MARKSCHEME.has(label.slice(0, 7)) ? null : label;
}

/**
 * Does this question have a hint ladder behind it at all?
 *
 * The one test, so that `Hints` and the note explaining why `Hints` rendered
 * nothing cannot drift apart. A generated question carries its own worked
 * solution and needs no table; a past paper question needs a transcribed
 * marking instruction, which is what `ladderLabel` is checking for.
 */
export function hasHintLadder(
  courseId: string | undefined,
  question: { skill?: string; method?: string; label?: string | null; question?: string },
  given?: string | null,
): boolean {
  if (!courseHasHints(courseId)) return false;
  if (question.skill && question.method) return true;
  return ladderLabel(given ?? question.label, question.question) !== null;
}

export function canAddVariation(
  courseId: string | undefined,
  questionHtml: string | undefined,
): boolean {
  return courseId === 'n5' && variationLabel(questionHtml) !== null;
}

/**
 * Can this question offer another like it, and what is it modelled on?
 *
 * **Past paper questions only.** An earlier version fell back to the topic a
 * question files under when nothing was modelled on the question itself, which
 * made the control near-universal and was wrong: `Fractions and mixed numbers`
 * is one subtopic covering adding, subtracting, multiplying and dividing, plain
 * and mixed. A pupil working through adding fractions pressed "another like
 * this one" and got a multiplication. The subtopic is where a question *files*,
 * not what it *is*, and only the paper reference carries that.
 *
 * Generating across a topic is still offered — on the practice page's "Keep
 * practising" section, which says that is what it does.
 *
 * Null where there is nothing behind the question, and the control then renders
 * nothing: absent rather than disabled, like everything else the generator
 * backs.
 */
export interface MoreLikeThisSource {
  /**
   * The printed badge, e.g. `2018 P1 Q1`, when the surface already has it.
   *
   * **Practice pages must pass this.** `resolveQuestions` strips the badge out
   * of the HTML before rendering and puts it on `ResolvedQuestion.paper`, so
   * scraping finds nothing there.
   */
  label?: string | null;
  /** The question HTML, scraped only when no explicit label is given. */
  questionHtml?: string;
  /** A generated question's own parentage, so it can offer more of its kind. */
  basedOn?: readonly string[];
  parentIndex?: number;
}

export function moreLikeThis(
  courseId: string | undefined,
  source: MoreLikeThisSource,
): { label: string } | null {
  if (!courseHasHints(courseId)) return null;
  // An explicit label beats a scraped one, and a generated question falls back
  // to the paper it was modelled on — so "another like this one" works on a
  // generated question too, meaning the same thing both times.
  const parent = source.basedOn?.[source.parentIndex ?? 0];
  const label = paperLabelOf(source.label, source.questionHtml) ?? paperLabelOf(parent);
  return label ? { label } : null;
}

/** Past paper questions by their printed label, for finding a parent video. */
export function byPaperLabel(
  questions: readonly QuestionWithMetadata[],
): Map<string, QuestionWithMetadata> {
  const out = new Map<string, QuestionWithMetadata>();
  for (const q of questions) {
    const ref = paperRef(q.question);
    if (ref && !out.has(ref)) out.set(ref, q);
  }
  return out;
}

/**
 * Give a generated question the video of the paper question behind it.
 *
 * A generated question has no solution of its own filmed, but the question it
 * was modelled on does — all 328 National 5 past paper questions carry a video
 * and a timestamp. Watching the original worked is the tutorial for the
 * generated one: same method, different numbers.
 *
 * **`basedOn[0]` and nothing else.** The engine orders those most recent first
 * so that a teacher's copy and a pupil's copy of the same question resolve to
 * the same video — a shared link carries only a code and a seed, so there is no
 * other way for the two to agree.
 *
 * Returns the question unchanged when it is not generated, when it names no
 * paper, or when that paper is not among the ones loaded.
 */
export function withParentVideo(
  q: QuestionWithMetadata,
  byLabel: Map<string, QuestionWithMetadata>,
): QuestionWithMetadata {
  // `parentIndex` is which paper the maker was looking at, carried in the uid
  // so that every copy of this question resolves to the same video.
  const label = q.basedOn?.[q.parentIndex ?? 0];
  const parent = label ? byLabel.get(label) : undefined;
  if (!parent?.videoId) return q;
  return {
    ...q,
    videoId: parent.videoId,
    timestamp: parent.timestamp,
    // What the video actually shows. Every surface that offers it reads this,
    // so the wording is in one place: a pupil checking their answer against a
    // video of different numbers has to be told, or they conclude they are wrong.
    videoOf: label,
  };
}
