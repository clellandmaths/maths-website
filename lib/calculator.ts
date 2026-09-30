import { paperRef } from '@/lib/question-number.mjs';

/**
 * "Calculator" or "Non-calculator": what a pupil needs to know before starting
 * a question, on every view that shows one, past paper or generated, in test
 * mode too. Null for a question with no paper behind it (a skills question).
 *
 * The owner, 2026-09-30: generated questions did not say which paper they were
 * like, and test mode took the paper away with the rest of the reference; then,
 * "just have a label somehow for calculator and non calculator questions",
 * never "Paper 1" for a year or course that has one paper, as that confuses;
 * then "the calculator icon needs to appear everywhere".
 *
 * Every course's Paper 1 is the non-calculator paper and its Paper 2 the
 * calculator one (the marking instructions say so: "Paper-1-Non-calculator").
 * A label with no paper in it is a one-paper course or year, and both are
 * calculator: Higher Applications ("2022 Q1") and Advanced Higher before its
 * two papers ("2019 Q4").
 *
 * Read from the question's own label, "2024 P1 Q3", or, where it has none (a
 * generated question), from the paper question it was modelled on, the same
 * `basedOn[parentIndex]` its printed markscheme names. No N5 variation cites
 * both papers (measured 2026-09-30: 160 Paper 1 only, 168 Paper 2 only, 44
 * none), so that label is the variation's paper, not a guess among several.
 *
 * Its own small module: full screen and focus mode are on the course
 * templates' JS budget, and the worksheet-sharing code this began in is not.
 */
export function calculatorLabel(
  q: { question?: string; basedOn?: string[]; parentIndex?: number },
  courseId: string,
): 'Calculator' | 'Non-calculator' | null {
  return calculatorFor(paperRef(q.question ?? '') ?? q.basedOn?.[q.parentIndex ?? 0], courseId);
}

/** The same, from a paper label alone ("2024 P1 Q3", "2019 Q4"), for a view that keeps only the label. */
export function calculatorFor(ref: string | null | undefined, courseId: string): 'Calculator' | 'Non-calculator' | null {
  if (!ref) return null;
  const paper = /\bP([12])\b/.exec(ref)?.[1];
  if (paper) return paper === '1' ? 'Non-calculator' : 'Calculator';
  return courseId === 'ah' || courseId === 'higher-apps' ? 'Calculator' : null;
}
