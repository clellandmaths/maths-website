import { hasHintLadder, courseHasHints } from '@/lib/similar-questions';

/**
 * Why this question has no Hint button.
 *
 * **One sentence, one file, four surfaces.** The card, full screen, Focus and
 * anything else that renders `Hints` all need to explain the same absence, and
 * a sentence copied four times is a sentence that drifts three ways. It also
 * means the note and the button read the *same* predicate — `hasHintLadder` —
 * so it is not possible to ship a question that has both, or neither.
 *
 * **Two different questions land here and the sentence is true of both.**
 *
 * - The 205 National 5 practice questions written for the site rather than
 *   lifted from an exam. Presses 1 and 2 of a ladder come from the variation
 *   modelled on a paper question and press 3 carries the working out of its
 *   marking instructions; a written question has neither, so there is nothing
 *   to build a ladder from.
 * - The 22 questions we hold from **2021**, whose marking instructions were
 *   never transcribed — see `NO_MARKSCHEME` in `lib/similar-questions.ts`.
 *   These are the ones that used to carry a button opening an empty overlay.
 *
 * Both were checked: every one of them carries a `solutionUrl`, which is the
 * "Full written solution at Maths.scot" link inside the answer this sentence
 * points at. The `solutionUrl` gate is therefore belt and braces rather than a
 * filter — but it is what keeps the sentence from ever claiming a solution that
 * is not there.
 *
 * Only where hints exist at all. On the other four courses no question has them
 * and the absence is the norm, so a note on every card would be noise rather
 * than an explanation.
 */
interface Props {
  courseId: string | undefined;
  /**
   * The question, for its own `skill`/`method` and `label`.
   *
   * A generated question carries its own worked solution and therefore its own
   * ladder, so it must never get this note — `hasHintLadder` is what knows
   * that, and it is the same call `Hints` makes.
   */
  question: { skill?: string; method?: string; label?: string | null; question?: string };
  /**
   * The printed badge, where the surface holds it rather than the HTML.
   *
   * Guided practice strips the badge out — `resolveQuestions` moves it to
   * `ResolvedQuestion.paper` — so the card passes it explicitly, exactly as it
   * does to `Hints`. Full screen and Focus get it on `question.label` instead
   * and pass nothing.
   */
  given?: string | null;
  /** The written solution this sentence promises. No link, no sentence. */
  solutionUrl?: string;
  className?: string;
}

export default function NoHintNote({
  courseId, question, given, solutionUrl, className = '',
}: Props) {
  if (!courseHasHints(courseId)) return null;
  if (hasHintLadder(courseId, question, given)) return null;
  if (!solutionUrl) return null;

  return (
    <p className={`no-print text-xs text-muted-foreground ${className}`}>
      No hints on this one — its full written solution is with the answer.
    </p>
  );
}
