'use client';

import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import FocusMode from '@/components/Explorer/FocusMode';
import type { QuestionWithMetadata } from '@/lib/data-loader';
import type { CourseTheme } from '@/lib/course-theme';

// Opens the Explorer's Focus Mode over a practice topic.
//
// Deliberately reuses that component rather than having a second full-screen
// question view: one look, one set of keyboard behaviour, and practice gets its
// markscheme, data booklet and progress tracking for nothing.

interface Props {
  questions: QuestionWithMetadata[];
  theme: CourseTheme;
  hasDataBooklet?: boolean;
}

export default function PracticeFocusButton({ questions, theme, hasDataBooklet }: Props) {
  const [open, setOpen] = useState(false);
  if (!questions.length) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${theme.border} ${theme.tint} ${theme.text} font-medium hover:bg-white/10 transition-colors`}
      >
        <Maximize2 className="h-4 w-4" />
        Focus
      </button>
      {open && (
        <FocusMode
          theme={theme}
          questions={questions}
          hasDataBooklet={hasDataBooklet}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
