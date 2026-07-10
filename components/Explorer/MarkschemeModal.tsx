'use client';

import { useState, useEffect } from 'react';
import { X, ClipboardCheck } from 'lucide-react';
import { getMarkschemeEntries, type MarkschemeEntry } from '@/lib/ah-markschemes';
import { renderMathHtml } from '@/components/MathHtml';
import type { CourseTheme } from '@/lib/course-theme';

// Full SQA marking instructions for an AH question without a video solution.

interface Props {
  theme: CourseTheme;
  year: number | string;
  paperNumber: number;
  questionHtml: string;
  title: string;
  onClose: () => void;
}

export default function MarkschemeModal({ theme, year, paperNumber, questionHtml, title, onClose }: Props) {
  const [entries, setEntries] = useState<MarkschemeEntry[] | null>(null);

  useEffect(() => {
    getMarkschemeEntries(year, paperNumber, questionHtml).then(setEntries);
  }, [year, paperNumber, questionHtml]);

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
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5 shrink-0"
            aria-label="Close markscheme"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-5 space-y-6">
          {entries === null ? (
            <div className="flex items-center justify-center py-12">
              <div className={`h-8 w-8 border-4 ${theme.border} border-t-transparent rounded-full animate-spin`} />
            </div>
          ) : entries.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No marking instructions found for this question.
            </p>
          ) : (
            entries.map(entry => (
              <section key={entry.questionNumber}>
                <h3 className={`font-mono text-xs font-semibold uppercase tracking-widest ${theme.text} mb-2`}>
                  Question {entry.questionNumber}
                </h3>
                <div
                  className="text-foreground/85 text-sm leading-relaxed space-y-2"
                  dangerouslySetInnerHTML={{ __html: renderMathHtml(entry.answer) }}
                />
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
