'use client';

import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import DataBookletModal from '@/components/Explorer/DataBookletModal';
import type { CourseTheme } from '@/lib/course-theme';

// Opens the year's Higher Apps data booklet from a statically rendered paper page.
export default function BookletButton({ year, theme }: { year: number | string; theme: CourseTheme }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${theme.tint} ${theme.text} hover:bg-white/10 rounded-lg text-sm font-medium transition-colors`}
      >
        <BookOpen className="h-4 w-4" />
        Data Booklet
      </button>
      {open && <DataBookletModal year={year} theme={theme} onClose={() => setOpen(false)} />}
    </>
  );
}
