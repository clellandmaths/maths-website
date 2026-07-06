'use client';

import { ClipboardList } from 'lucide-react';
import { useWorksheet } from '@/lib/worksheet-context';

interface WorksheetFABProps {
  onClick: () => void;
}

export default function WorksheetFAB({ onClick }: WorksheetFABProps) {
  const { items } = useWorksheet();
  const count = items.length;

  if (count === 0) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-900/30 transition-all hover:scale-105"
    >
      <ClipboardList className="h-5 w-5" />
      <span className="font-semibold">{count}</span>
      <span className="hidden sm:inline">
        {count === 1 ? 'question' : 'questions'}
      </span>
    </button>
  );
}
