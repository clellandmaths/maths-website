'use client';

import { ArrowLeft } from 'lucide-react';
import AnotherLikeThis from '@/components/AnotherLikeThis';
import type { QuestionWithMetadata } from '@/lib/data-loader';

/**
 * Full screen's two twin controls: draw another, and go back to yours.
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
  /** True while a twin is on the card. */
  showing: boolean;
  alsoExclude: readonly QuestionWithMetadata[];
  onDrawn: (q: QuestionWithMetadata) => void;
  onBack: () => void;
}

const BUTTON =
  'w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-60';

export default function TwinControls({
  courseId, question, showing, alsoExclude, onDrawn, onBack,
}: Props) {
  return (
    <>
      <AnotherLikeThis
        courseId={courseId}
        question={question}
        label={question.label}
        showing={showing}
        alsoExclude={alsoExclude}
        onDrawn={onDrawn}
        className={BUTTON}
        noticeClassName="w-full text-center text-sm text-slate-400"
      />
      {showing && (
        <button onClick={onBack} className={BUTTON}>
          <ArrowLeft className="h-5 w-5" />
          Back to the question
        </button>
      )}
    </>
  );
}
