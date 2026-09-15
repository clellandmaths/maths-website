'use client';

import { Dices, Loader2 } from 'lucide-react';
import { moreLikeThis } from '@/lib/similar-questions';
import { useGeneratedDraw } from '@/lib/use-generated-draw';
import type { QuestionWithMetadata } from '@/lib/data-loader';

/**
 * The button that draws one more question like the one on screen.
 *
 * **Only the button.** Where the drawn question goes is the surface's business
 * and the two surfaces disagree: guided practice opens it *below* the question,
 * because a pupil is usually stuck on the one in front of them and taking it
 * away loses their place; full screen *swaps it in*, because there is one card
 * and no below. Pulling the draw out of both means they cannot drift apart in
 * wording, in what counts as running out, or in the exclude set.
 *
 * It renders nothing when there is nothing behind the question — absent rather
 * than disabled, like everything else the generator backs.
 *
 * **No theme prop.** The two callers style their buttons differently (a quiet
 * outline on the page, a full-width slate block in full screen) and a `variant`
 * union would be two callers' CSS living in a third file.
 */
interface Props {
  courseId?: string;
  /** The question a twin is modelled on. A generated one falls back to its parent. */
  question: QuestionWithMetadata;
  /**
   * The printed badge, when the surface holds it rather than the HTML.
   *
   * **Guided practice must pass this.** `resolveQuestions` strips the badge out
   * before rendering and puts it on `ResolvedQuestion.paper`, so scraping the
   * HTML finds nothing there.
   */
  label?: string | null;
  /** True once a drawn question is on screen: the wording changes, not the act. */
  showing?: boolean;
  /**
   * What this surface has already drawn, on top of what the hook remembers.
   *
   * **This is what lets the button move.** The surfaces that open a twin below
   * the question move the button to the foot of it, so a pupil who has just
   * worked one through does not have to scroll back past it to ask for another.
   * A button rendered somewhere else is a new component with an empty memory,
   * and `useGeneratedDraw` keeps what it has drawn in a ref — so without the
   * surface holding the list too, the first press after the move hands back
   * something already seen. Measured once on a six-deep pool with no exclude
   * set at all: six byte-identical repeats.
   */
  alsoExclude?: readonly QuestionWithMetadata[];
  onDrawn: (q: QuestionWithMetadata) => void;
  className?: string;
  /** Where the "that is all of them" line goes. */
  noticeClassName?: string;
}

const NOTHING: readonly QuestionWithMetadata[] = [];

export default function AnotherLikeThis({
  courseId, question, label, showing = false, alsoExclude = NOTHING, onDrawn,
  className = '', noticeClassName = 'mt-2 text-sm text-muted-foreground',
}: Props) {
  const offer = moreLikeThis(courseId, {
    label,
    questionHtml: question.question,
    basedOn: question.basedOn,
    parentIndex: question.parentIndex,
  });

  const draw = useGeneratedDraw(courseId, async (engine, exclude) => {
    if (!offer) return null;
    const [made] = await engine.similarTo(
      offer.label, 1, engine.worksheetKeys([...exclude, ...alsoExclude]));
    return made ?? null;
  });

  // Nothing modelled on this question: render nothing.
  if (!offer) return null;

  const busy = draw.state === 'drawing';

  return (
    <>
      <button
        onClick={async () => { const made = await draw.one(); if (made) onDrawn(made); }}
        disabled={busy}
        className={className}
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Dices className="h-3.5 w-3.5" />}
        {showing ? 'Another one' : 'Another like this one'}
      </button>

      {/* Running out is a fact about how many different questions this one can
          make, not a fault. */}
      {draw.state === 'exhausted' && (
        <p className={noticeClassName}>
          {draw.seen > 0
            ? `That is all ${draw.seen} different questions this one can make.`
            : 'No new question could be made just now.'}
        </p>
      )}
      {draw.state === 'failed' && (
        <p className={noticeClassName}>Could not make one just now. Try again in a moment.</p>
      )}
    </>
  );
}
