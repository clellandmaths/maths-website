'use client';

import { useEffect, useState } from 'react';
import { X, Sigma } from 'lucide-react';
import { getFormulae, type FormulaeList } from '@/lib/formulae-loader';
import { renderMathHtml } from '@/components/MathHtml';
import type { CourseTheme } from '@/lib/course-theme';

// The formulae list a candidate is given in the exam, on screen.
//
// Mirrors DataBookletModal deliberately — same shell, same behaviour, same
// Escape-to-close — because they are the same idea: the reference sheet that
// comes with the paper. Higher Applications gets the booklet, everyone else
// gets this.

export default function FormulaeModal({
  courseId,
  theme,
  onClose,
}: {
  courseId: string;
  theme: CourseTheme;
  onClose: () => void;
}) {
  const [list, setList] = useState<FormulaeList | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getFormulae(courseId).then(f => {
      if (cancelled) return;
      setList(f);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [courseId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
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
            <Sigma className={`h-5 w-5 ${theme.text} shrink-0`} />
            <h2 className="font-semibold truncate">{list?.title ?? 'Formulae List'}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5 shrink-0"
            aria-label="Close formulae list"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-6">
          {loading && <p className="text-muted-foreground text-sm">Loading…</p>}
          {!loading && !list && (
            <p className="text-muted-foreground text-sm">
              No formulae list is issued for this course.
            </p>
          )}
          {list?.sections.map(section => (
            <section key={section.title}>
              <h3 className={`font-semibold mb-2 ${theme.text}`}>{section.title}</h3>
              <div
                className="formula-content text-foreground/90 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderMathHtml(section.content, { displayStyle: true }) }}
              />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
