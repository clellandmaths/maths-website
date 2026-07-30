'use client';

import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import DataBookletModal from '@/components/Explorer/DataBookletModal';
import type { CourseTheme } from '@/lib/course-theme';

// Opens the year's Higher Apps data booklet from a statically rendered paper page.
export default function BookletButton({
  year,
  theme,
  compact = false,
}: {
  year: number | string;
  theme: CourseTheme;
  /** Sits on a question card rather than the page header — matches FormulaeButton. */
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          compact
            ? `inline-flex items-center gap-1.5 px-2.5 py-1 ${theme.tint} ${theme.text} hover:bg-white/10 rounded-lg text-xs font-medium transition-colors`
            : `inline-flex items-center gap-1.5 px-3 py-1.5 ${theme.tint} ${theme.text} hover:bg-white/10 rounded-lg text-sm font-medium transition-colors`
        }
      >
        <BookOpen className={compact ? 'h-3 w-3' : 'h-4 w-4'} />
        Data Booklet
      </button>
      {open && <DataBookletModal year={year} theme={theme} onClose={() => setOpen(false)} />}
    </>
  );
}
