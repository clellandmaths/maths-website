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

export function canAddVariation(
  courseId: string | undefined,
  questionHtml: string | undefined,
): boolean {
  return courseId === 'n5' && variationLabel(questionHtml) !== null;
}

/**
 * What "more like this" can offer for one question, and what to call it.
 *
 * Two tiers, and **the wording says which one fired**:
 *
 *   `question`  there is a variation modelled on this exact past paper
 *               question — "Another like this one"
 *   `subtopic`  there is not, so it falls back to the topic the question
 *               files under — "More on Simplifying surds"
 *
 * Tier 2 is what makes the control near-universal: every one of the website's
 * 57 subtopics has at least one exam-tier variation. But it can hand a pupil
 * something they would not call "like this" — `Sector area` spans plain
 * sectors, segments and a polygon in a circle — so the heading must not be
 * softened into pretending it is tier 1.
 *
 * **Both tiers rest on invariants `check-variation-reach.mjs` enforces**: every
 * paper question is cited, and every subtopic is covered. Without that check
 * these headings would be true only by luck.
 */
export type MoreLikeThis =
  | { tier: 'question'; label: string; heading: string }
  | { tier: 'subtopic'; subtopic: string; heading: string }
  | null;

/** Whatever the surface happens to hold. All optional. */
export interface MoreLikeThisSource {
  /**
   * The printed badge, e.g. `2018 P1 Q1`, when the surface already has it.
   *
   * **Practice pages must use this.** `resolveQuestions` strips the badge out
   * of the HTML before rendering and puts it on `ResolvedQuestion.paper`, so
   * scraping finds nothing there.
   */
  label?: string | null;
  /** The question HTML, scraped only when no explicit label is given. */
  questionHtml?: string;
  /** A generated question's own parentage, so it can offer more of its kind. */
  basedOn?: readonly string[];
  parentIndex?: number;
  /** The question's topic tags, in the website's vocabulary. */
  subtopics?: readonly string[];
}

export function moreLikeThis(
  courseId: string | undefined,
  source: MoreLikeThisSource,
  /** The website's subtopic names — passed in so this file stays taxonomy-free. */
  knownSubtopics: readonly string[],
): MoreLikeThis {
  if (!courseHasHints(courseId)) return null;

  // Tier 1. An explicit label beats a scraped one, and a generated question
  // falls back to the paper it was modelled on — so "another like this one"
  // works on a generated question too, meaning the same thing both times.
  const parent = source.basedOn?.[source.parentIndex ?? 0];
  const label = paperLabelOf(source.label, source.questionHtml) ?? paperLabelOf(parent);
  if (label) return { tier: 'question', label, heading: 'Another like this one' };

  // Tier 2. **One subtopic, named.** A question can carry three tags, and
  // drawing across all of them while the heading names one would be the exact
  // dishonesty this type exists to prevent. The call and the wording use the
  // same single value.
  const known = new Set(knownSubtopics);
  const subtopic = source.subtopics?.find(t => known.has(t));
  if (subtopic) return { tier: 'subtopic', subtopic, heading: `More on ${subtopic}` };

  return null;
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
