import { paperRef } from '@/lib/question-number.mjs';

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
