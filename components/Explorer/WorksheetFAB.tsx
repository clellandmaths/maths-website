'use client';

import { ClipboardList } from 'lucide-react';
import { useWorksheet } from '@/lib/worksheet-context';
import type { CourseTheme } from '@/lib/course-theme';

interface WorksheetFABProps {
  theme: CourseTheme;
  onClick: () => void;
}

export default function WorksheetFAB({ theme, onClick }: WorksheetFABProps) {
  const { items } = useWorksheet();
  const count = items.length;

  if (count === 0) return null;

  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r ${theme.gradient} hover:brightness-110 text-white rounded-full shadow-lg shadow-black/40 transition-all hover:scale-105`}
    >
      <ClipboardList className="h-5 w-5" />
      <span className="font-semibold">{count}</span>
      <span className="hidden sm:inline">
        {count === 1 ? 'question' : 'questions'}
      </span>
    </button>
  );
}
