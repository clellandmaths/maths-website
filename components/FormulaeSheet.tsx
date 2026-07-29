'use client';

import { useEffect, useState } from 'react';
import { getFormulae, type FormulaeList } from '@/lib/formulae-loader';
import { renderMathHtml } from '@/components/MathHtml';

// The formulae list, printed at the front of a worksheet — page 2, where Qualifications Scotland
// puts it on a real paper, so a pupil finds it where they expect.
//
// Print-only by default: on screen the same content is available from the
// Formulae button, and repeating it down the page would just be noise.

export default function FormulaeSheet({
  courseId,
  className = '',
}: {
  courseId: string;
  className?: string;
}) {
  const [list, setList] = useState<FormulaeList | null>(null);

  useEffect(() => {
    let cancelled = false;
    getFormulae(courseId).then(f => { if (!cancelled) setList(f); });
    return () => { cancelled = true; };
  }, [courseId]);

  if (!list) return null;

  return (
    <div className={`print-formula-sheet ${className}`}>
      <h2>{list.title}</h2>
      {list.sections.map(section => (
        <div key={section.title} className="mb-4">
          <h3 className="font-semibold text-sm mb-1">{section.title}</h3>
          <div
            className="formula-content text-sm"
            dangerouslySetInnerHTML={{ __html: renderMathHtml(section.content, { displayStyle: true }) }}
          />
        </div>
      ))}
    </div>
  );
}
