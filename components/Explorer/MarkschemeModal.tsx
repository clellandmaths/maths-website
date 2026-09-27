'use client';

import { useState, useEffect } from 'react';
import { X, ClipboardCheck } from 'lucide-react';
import { getCardScheme } from '@/lib/ah-markschemes';
import SchemeTable from '@/components/SchemeTable';
import type { CourseTheme } from '@/lib/course-theme';

// Qualifications Scotland marking instructions for an AH question without a
// video solution, from the transcribed table (see lib/ah-markschemes).

interface Props {
  theme: CourseTheme;
  year: number | string;
  paperNumber: number;
  questionHtml: string;
  title: string;
  onClose: () => void;
}

export default function MarkschemeModal({ theme, questionHtml, title, onClose }: Props) {
  // undefined while loading; null when the question has no transcription.
  const [card, setCard] = useState<Awaited<ReturnType<typeof getCardScheme>> | undefined>(undefined);

  useEffect(() => {
    getCardScheme(questionHtml).then(setCard);
  }, [questionHtml]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        <div className={`h-1 shrink-0 bg-gradient-to-r ${theme.gradient}`} />
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2 min-w-0">
            <ClipboardCheck className={`h-5 w-5 ${theme.text} shrink-0`} />
            <h2 className="font-semibold truncate">Marking Instructions — {title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-foreground/5 shrink-0"
            aria-label="Close markscheme"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-5 space-y-6">
          {card === undefined ? (
            <div className="flex items-center justify-center py-12">
              <div className={`h-8 w-8 border-4 ${theme.border} border-t-transparent rounded-full animate-spin`} />
            </div>
          ) : card === null || card.rows.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No marking instructions found for this question.
            </p>
          ) : (
            <SchemeTable rows={card.rows} notes={card.notes} accent={theme.text} />
          )}
        </div>
      </div>
    </div>
  );
}
