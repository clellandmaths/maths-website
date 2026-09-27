'use client';

import { useEffect, useState } from 'react';
import {
  bookletSectionsOf, isRCommands, LATEST, loadBooklet, resolveBookletYear, sectionOf,
  type Booklet, type BookletSection,
} from '@/lib/databooklet-loader';
import { renderMathHtml } from '@/components/MathHtml';

/**
 * Higher Applications data booklets on a printed worksheet.
 *
 * Higher Apps is issued a data booklet instead of a formulae list, and a
 * question that needs it cannot be attempted on paper without it. But most
 * questions need none of it, and printing every year's whole booklet at the
 * front ran to pages of data nobody on the sheet used (the owner, 2026-09-27).
 *
 * So each question says which sections it needs (`dataBookletSection`, or
 * `dataBooklets` for several), and the sheet prints only those:
 *
 *   - `DataBookletSheet`, at the front: the R commands, once, and only when a
 *     question on the sheet uses them. The latest booklet's, whatever the
 *     questions' years: "it supersedes previous ones for R Studio" (the owner).
 *   - `BookletExtract`, directly above its question: that question's other
 *     sections, from its own year's booklet, because the tax bands and data
 *     change year to year. Two questions using one section print it twice, so
 *     neither sends the pupil back through the sheet to find it.
 */
type BookletQuestion = {
  year: number | string;
  dataBooklets?: { section: number }[];
  dataBookletSection?: number;
};

function useBooklet(key: string | null) {
  const [booklet, setBooklet] = useState<Booklet | null>(null);
  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    loadBooklet(key).then(loaded => { if (!cancelled) setBooklet(loaded); });
    return () => { cancelled = true; };
  }, [key]);
  return key ? booklet : null;
}

function Section({ section, title = section.title }: { section: BookletSection; title?: string }) {
  return (
    <div className="mb-4">
      {title && <h3 className="font-semibold text-sm mb-1">{title}</h3>}
      <div
        className="formula-content text-sm"
        dangerouslySetInnerHTML={{ __html: renderMathHtml(section.content) }}
      />
    </div>
  );
}

/**
 * Whether a question uses its booklet's R commands. Every booklet numbers
 * them last, so it is read from the question's own year's booklet.
 */
async function usesR(q: BookletQuestion): Promise<boolean> {
  const numbers = bookletSectionsOf(q);
  if (!numbers.length) return false;
  const booklet = await loadBooklet(resolveBookletYear(q.year).key);
  return numbers.some(n => { const s = sectionOf(booklet, n); return Boolean(s && isRCommands(s)); });
}

/** The R commands, once, at the front, when a question on the sheet uses them. */
export default function DataBookletSheet({
  questions,
  className = '',
}: {
  questions: BookletQuestion[];
  className?: string;
}) {
  const [needed, setNeeded] = useState(false);
  const signature = questions.map(q => `${q.year}:${bookletSectionsOf(q).join('+')}`).join(',');
  useEffect(() => {
    let cancelled = false;
    Promise.all(questions.map(usesR)).then(r => { if (!cancelled) setNeeded(r.some(Boolean)); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);
  const latest = useBooklet(needed ? LATEST : null);
  const section = latest?.sections.find(isRCommands);
  if (!needed || !section) return null;

  return (
    <div className={`print-formula-sheet ${className}`}>
      <div className="break-after-page">
        <h2>Data booklet: some helpful R commands</h2>
        <Section section={section} title="" />
      </div>
    </div>
  );
}

/** The sections of its own year's booklet that one question needs, printed above it. */
export function BookletExtract({ question }: { question: BookletQuestion }) {
  const numbers = bookletSectionsOf(question);
  const key = resolveBookletYear(question.year).key;
  const booklet = useBooklet(numbers.length ? key : null);
  if (!booklet) return null;
  const sections = numbers
    .map(n => sectionOf(booklet, n))
    .filter((s): s is BookletSection => Boolean(s) && !isRCommands(s as BookletSection));
  if (!sections.length) return null;

  return (
    <div className="print-only booklet-extract print-formula-sheet mb-4">
      <p className="text-xs font-semibold uppercase tracking-wide mb-2">
        From the {key} data booklet
      </p>
      {sections.map(section => <Section key={section.title} section={section} />)}
    </div>
  );
}
