'use client';

import { lazy, Suspense, useState } from 'react';
import { Sigma, X } from 'lucide-react';
import { hasFormulae } from '@/lib/formulae-loader';

// The sheet, and the KaTeX it draws with, arrive when the button is pressed.
// Imported at the top, they put 76 KB compressed into every page carrying the
// button, the course hub among them, for a sheet most visits never open
// (2026-09-28). The formulae themselves were already loaded on demand.
//
// **React.lazy rather than next/dynamic** (the owner, 2026-10-14, card 9 of the
// loading-states sheet: "Yes"). The press used to show nothing for 0.4 s on a
// slowed phone while this file loaded, then the list's frame saying
// "Loading…". With Suspense the frame below (`FormulaeFrame`) is drawn on the
// press, and the list takes its place in the same commit when its file is here.
const FormulaeModal = lazy(() => import('@/components/FormulaeModal'));
import type { CourseTheme } from '@/lib/course-theme';

// Opens the course's formulae list. Renders nothing for Higher Applications,
// which is issued a data booklet instead — so the button can be dropped onto
// any question surface without a per-course check at the call site.

/**
 * The list's frame while its file loads: the same box as `FormulaeModal`
 * (top-anchored, so it does not move when the list fills it), with its title
 * and close button, and the words the list itself shows while it loads.
 */
function FormulaeFrame({ theme, onClose }: { theme: CourseTheme; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[7.5vh]">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        <div className={`h-1 shrink-0 bg-gradient-to-r ${theme.gradient}`} />
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2 min-w-0">
            <Sigma className={`h-5 w-5 ${theme.text} shrink-0`} />
            <h2 className="font-semibold truncate">Formulae List</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-foreground/5 shrink-0"
            aria-label="Close formulae list"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-5 space-y-6">
          <p className="text-muted-foreground text-sm" role="status">Loading the formulae&hellip;</p>
        </div>
      </div>
    </div>
  );
}

export default function FormulaeButton({
  courseId,
  theme,
  className,
  compact = false,
}: {
  courseId: string;
  theme: CourseTheme;
  className?: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  if (!hasFormulae(courseId)) return null;

  const base = compact
    ? `inline-flex items-center gap-1.5 px-2.5 py-1 ${theme.tint} ${theme.text} hover:bg-foreground/10 rounded-lg text-xs font-medium transition-colors`
    : `inline-flex items-center gap-1.5 px-3 py-1.5 ${theme.tint} ${theme.text} hover:bg-foreground/10 rounded-lg text-sm font-medium transition-colors`;

  return (
    <>
      <button onClick={() => setOpen(true)} className={className ?? base}>
        <Sigma className={compact ? 'h-3 w-3' : 'h-4 w-4'} />
        Formulae
      </button>
      {open && (
        <Suspense fallback={<FormulaeFrame theme={theme} onClose={() => setOpen(false)} />}>
          <FormulaeModal courseId={courseId} theme={theme} onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
