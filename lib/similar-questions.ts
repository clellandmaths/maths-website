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
export function canAddVariation(
  courseId: string | undefined,
  questionHtml: string | undefined,
): boolean {
  return courseId === 'n5' && variationLabel(questionHtml) !== null;
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
  const parent = q.basedOn?.length ? byLabel.get(q.basedOn[0]) : undefined;
  if (!parent?.videoId) return q;
  return {
    ...q,
    videoId: parent.videoId,
    timestamp: parent.timestamp,
    // What the video actually shows. Every surface that offers it reads this,
    // so the wording is in one place: a pupil checking their answer against a
    // video of different numbers has to be told, or they conclude they are wrong.
    videoOf: q.basedOn![0],
  };
}
