'use client';

import { useEffect, useState } from 'react';
import { bookletKeysFor, loadBooklet, type Booklet } from '@/lib/databooklet-loader';
import { renderMathHtml } from '@/components/MathHtml';

/**
 * Higher Applications data booklets, printed at the front of a worksheet.
 *
 * The counterpart of FormulaeSheet for the one course that is issued a booklet
 * instead of a formulae list. Higher Apps questions routinely say "refer to the
 * data booklet", so a printed sheet without it cannot be attempted away from a
 * screen — which is the whole point of printing it.
 *
 * One booklet per distinct year in the sheet, because the tax bands and
 * allowances change annually and a mixed worksheet genuinely needs both.
 */
export default function DataBookletSheet({
  years,
  className = '',
}: {
  years: (number | string)[];
  className?: string;
}) {
  const keys = bookletKeysFor(years);
  const [booklets, setBooklets] = useState<Booklet[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all(keys.map(loadBooklet)).then(loaded => {
      if (!cancelled) setBooklets(loaded);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys.join(',')]);

  if (!booklets?.length) return null;

  return (
    <div className={`print-formula-sheet ${className}`}>
      {booklets.map((booklet, i) => (
        <div key={keys[i]} className="break-after-page">
          <h2>{booklet.title}</h2>
          {booklet.sections.map(section => (
            <div key={section.title} className="mb-4">
              <h3 className="font-semibold text-sm mb-1">{section.title}</h3>
              <div
                className="formula-content text-sm"
                dangerouslySetInnerHTML={{ __html: renderMathHtml(section.content) }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
