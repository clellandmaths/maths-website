'use client';

import AnotherLikeThis from '@/components/AnotherLikeThis';
import type { QuestionWithMetadata } from '@/lib/data-loader';

/**
 * Full screen's draw-another control.
 *
 * **It used to hold the way back as well, and that is why the row moved.** The
 * action row is centred, so adding a second button re-centred everything in it:
 * the draw button slid 182px left, *Show Answer*, *Formulae* and *Watch
 * Solution* went with it, and "Back to the question" landed 5px from where the
 * draw button had been. Press *another* twice in the same place and the second
 * press undid the first.
 *
 * The label made it worse — "Another like this one" became "Another one" once a
 * twin was showing, 63px narrower, re-centring the row a second time. So
 * `showing` is no longer passed: one label, one width, whatever is on the card.
 * It stays true either way, because the draw is always modelled on the paper
 * question rather than on the twin.
 *
 * The way back now sits in the header beside the words *New question*, which is
 * where the twin announces itself.
 *
 * **Why they are not written inline in `QuestionPresenter`.** That component is
 * on the course templates and the Explorer, all of which sit inside 10 KB of JS
 * budget headroom, and the Explorer had one kilobyte of it left. Everything
 * here — two long class strings and a button nobody sees until they have
 * already drawn something — is eager weight if it is written at the call site
 * and lazy weight if it lives behind one `next/dynamic` boundary. The presenter
 * keeps the state; this keeps the markup.
 *
 * Full screen swaps the twin **in**, rather than opening it below the way a
 * practice page does, because there is one card here and no below. That is what
 * makes a way back a control rather than a scroll — and it is only half of it:
 * *Next* and *Previous* put the twin away too, so a pupil who would rather move
 * on can simply move on.
 */
interface Props {
  courseId?: string;
  /** The paper question, never the twin — three presses stay anchored to it. */
  question: QuestionWithMetadata;
  alsoExclude: readonly QuestionWithMetadata[];
  onDrawn: (q: QuestionWithMetadata) => void;
}

const BUTTON =
  'w-full sm:w-auto flex items-center justify-center gap-2 whitespace-nowrap px-6 py-3 rounded-lg font-medium bg-muted hover:bg-muted-hover text-foreground-2 transition-colors disabled:opacity-60';

export default function TwinControls({
  courseId, question, alsoExclude, onDrawn,
}: Props) {
  return (
    <AnotherLikeThis
      courseId={courseId}
      question={question}
      label={question.label}
      alsoExclude={alsoExclude}
      onDrawn={onDrawn}
      className={BUTTON}
      noticeClassName="w-full text-center text-sm text-muted-foreground"
    />
  );
}
