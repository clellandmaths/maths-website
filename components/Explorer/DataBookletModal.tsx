'use client';

import { useState, useEffect } from 'react';
import { X, BookOpen } from 'lucide-react';
import { renderMathHtml } from '@/components/MathHtml';
import type { CourseTheme } from '@/lib/course-theme';
import { loadBooklet, resolveBookletYear, type Booklet } from '@/lib/databooklet-loader';

// Higher Applications data booklet — year-specific reference material
// (tax bands, formulae, R commands). Mirrors the live app's booklet modal.

interface Props {
  year: number | string;
  theme: CourseTheme;
  onClose: () => void;
}

export default function DataBookletModal({ year, theme, onClose }: Props) {
  const [booklet, setBooklet] = useState<Booklet | null>(null);
  const [loading, setLoading] = useState(true);
  const { key, exact } = resolveBookletYear(year);

  useEffect(() => {
    setLoading(true);
    loadBooklet(key).then(data => {
      setBooklet(data);
      setLoading(false);
    });
  }, [key]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        <div className={`h-1 shrink-0 bg-gradient-to-r ${theme.gradient}`} />
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen className={`h-5 w-5 ${theme.text} shrink-0`} />
            <h2 className="font-semibold truncate">
              {booklet?.title ?? `Data Booklet — ${key}`}
            </h2>
            {/* Say so when this is not the booklet for that paper's year —
                tax bands change, so a silent substitution would mislead */}
            {!exact && (
              <span className="text-xs text-muted-foreground shrink-0">({key} edition)</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5 shrink-0"
            aria-label="Close data booklet"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-5 space-y-8">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className={`h-8 w-8 border-4 ${theme.border} border-t-transparent rounded-full animate-spin`} />
            </div>
          ) : booklet ? (
            booklet.sections.map((section, idx) => (
              <section key={idx}>
                <h3 className={`font-mono text-xs font-semibold uppercase tracking-widest ${theme.text} mb-3`}>
                  {section.title}
                </h3>
                <div
                  className="text-foreground/85 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderMathHtml(section.content) }}
                />
              </section>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-10">
              No data booklet available for {year}.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
