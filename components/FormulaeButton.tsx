'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Sigma } from 'lucide-react';
import { hasFormulae } from '@/lib/formulae-loader';

// The sheet, and the KaTeX it draws with, arrive when the button is pressed.
// Imported at the top, they put 76 KB compressed into every page carrying the
// button, the course hub among them, for a sheet most visits never open
// (2026-09-28). The formulae themselves were already loaded on demand.
const FormulaeModal = dynamic(() => import('@/components/FormulaeModal'), { ssr: false });
import type { CourseTheme } from '@/lib/course-theme';

// Opens the course's formulae list. Renders nothing for Higher Applications,
// which is issued a data booklet instead — so the button can be dropped onto
// any question surface without a per-course check at the call site.

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
        <FormulaeModal courseId={courseId} theme={theme} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
