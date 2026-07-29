'use client';

import { useState } from 'react';
import { Maximize2, Presentation } from 'lucide-react';
import FocusMode from '@/components/Explorer/FocusMode';
import QuestionPresenter from '@/components/Explorer/QuestionPresenter';
import type { QuestionWithMetadata } from '@/lib/data-loader';
import type { CourseTheme } from '@/lib/course-theme';

// The two full-screen modes the rest of the site already offers, over a
// practice topic. Both are the Explorer's own components — practice should not
// have its own look, and this way it inherits their markscheme viewer, data
// booklet, video handling and progress tracking.
//
//   Focus      — every question, scrollable, reveal each in place
//   Full screen — one question at a time with prev/next, as the app does
//                 and as past papers present

interface Props {
  courseId: string;
  questions: QuestionWithMetadata[];
  theme: CourseTheme;
  hasDataBooklet?: boolean;
}

export default function PracticeModes({ courseId, questions, theme, hasDataBooklet }: Props) {
  const [focus, setFocus] = useState(false);
  const [presentFrom, setPresentFrom] = useState<number | null>(null);

  if (!questions.length) return null;

  const btn = `inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${theme.border} ${theme.tint} ${theme.text} font-medium hover:bg-white/10 transition-colors`;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setPresentFrom(0)} className={btn}>
          <Presentation className="h-4 w-4" />
          Full screen
        </button>
        <button onClick={() => setFocus(true)} className={btn}>
          <Maximize2 className="h-4 w-4" />
          Focus
        </button>
      </div>

      {focus && (
        <FocusMode
          theme={theme}
          courseId={courseId}
          questions={questions}
          hasDataBooklet={hasDataBooklet}
          onClose={() => setFocus(false)}
        />
      )}

      {presentFrom !== null && (
        <QuestionPresenter
          theme={theme}
          courseId={courseId}
          questions={questions}
          startIndex={presentFrom}
          hasDataBooklet={hasDataBooklet}
          onClose={() => setPresentFrom(null)}
        />
      )}
    </>
  );
}
