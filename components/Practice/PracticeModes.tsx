'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Maximize2, Presentation, BookOpen, ArrowLeft } from 'lucide-react';
import FocusMode from '@/components/Explorer/FocusMode';
import FormulaeButton from '@/components/FormulaeButton';
import DataBookletModal from '@/components/Explorer/DataBookletModal';
import QuestionPresenter from '@/components/Explorer/QuestionPresenter';
import type { QuestionWithMetadata } from '@/lib/data-loader';
import type { CourseTheme } from '@/lib/course-theme';

// The two full-screen modes the rest of the site already offers, over a
// practice topic. Both are the Explorer's own components — practice should not
// have its own look, and this way it inherits their markscheme viewer, data
// booklet, video handling and progress tracking.
//
//   Focus      — every question, scrollable, reveal each in place
//   Full screen — one question at a time with prev/next, as the app does
//                 and as past papers present

interface Props {
  courseId: string;
  questions: QuestionWithMetadata[];
  theme: CourseTheme;
  hasDataBooklet?: boolean;
}

/**
 * Two path segments, and nothing else.
 *
 * The notes topic that sent a pupil here arrives in the URL, and a link is
 * built from it. **Never trust a whole URL out of a query string** — that is an
 * open redirect wearing a helpful hat. Only two slug-shaped segments are
 * accepted, and they go into a fixed same-origin template.
 */
const SEGMENT = /^[a-z0-9][a-z0-9-]*$/;

function notesOrigin(courseId: string, from: string | null): { href: string; label: string } | null {
  if (!from) return null;
  const [section, topic, ...rest] = from.split('/');
  if (rest.length || !section || !topic) return null;
  if (!SEGMENT.test(section) || !SEGMENT.test(topic)) return null;
  return { href: `/course/${courseId}/notes/${section}/${topic}`, label: 'Back to the notes' };
}

export default function PracticeModes({ courseId, questions, theme, hasDataBooklet }: Props) {
  const [focus, setFocus] = useState(false);
  const [presentFrom, setPresentFrom] = useState<number | null>(null);
  const [booklet, setBooklet] = useState(false);
  const [backTo, setBackTo] = useState<{ href: string; label: string } | null>(null);

  /**
   * A pupil sent here from a notes topic goes straight into full screen.
   *
   * **In an effect, and deliberately not in a lazy `useState` initialiser**,
   * which is how `app/explorer/page.tsx` reads its own `?c=`. This is a static
   * export: the HTML for this page is built once, with no query string in
   * existence, so an initialiser that reads `location` makes the client's first
   * render disagree with the HTML it is hydrating. An effect renders the built
   * markup first and then enhances it, which is what a query-driven mode is.
   *
   * The lint rule against `setState` in an effect is right about state that
   * could be derived during render. This is the other case it names — reading
   * from an external system, here the URL — and the alternative is a hydration
   * mismatch.
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const origin = notesOrigin(courseId, params.get('from'));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (origin) setBackTo(origin);
    if (params.get('full') === '1') setPresentFrom(0);
  }, [courseId]);

  if (!questions.length) return null;

  const btn = `inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${theme.border} ${theme.tint} ${theme.text} font-medium hover:bg-white/10 transition-colors`;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setPresentFrom(0)} className={btn}>
          <Presentation className="h-4 w-4" />
          Full screen
        </button>
        <button onClick={() => setFocus(true)} className={btn}>
          <Maximize2 className="h-4 w-4" />
          Focus
        </button>
        {/* The formulae list is issued with the exam, so it belongs on the
            question list too — not only inside the full-screen modes. Renders
            nothing for Higher Apps, which sits the exam with the booklet. */}
        <FormulaeButton courseId={courseId} theme={theme} className={btn} />
        {hasDataBooklet && (
          <button onClick={() => setBooklet(true)} className={btn}>
            <BookOpen className="h-4 w-4" />
            Data Booklet
          </button>
        )}
        {/* Also on the page, not only inside full screen. Closing the mode
            drops a pupil here, and without this they would be stranded one
            step from where they were reading. */}
        {backTo && (
          <Link
            href={backTo.href}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground font-medium hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {backTo.label}
          </Link>
        )}
      </div>

      {booklet && (
        <DataBookletModal
          year={questions[0]?.year ?? new Date().getFullYear()}
          theme={theme}
          onClose={() => setBooklet(false)}
        />
      )}

      {focus && (
        <FocusMode
          theme={theme}
          courseId={courseId}
          questions={questions}
          hasDataBooklet={hasDataBooklet}
          onClose={() => setFocus(false)}
        />
      )}

      {presentFrom !== null && (
        <QuestionPresenter
          theme={theme}
          courseId={courseId}
          questions={questions}
          startIndex={presentFrom}
          hasDataBooklet={hasDataBooklet}
          backTo={backTo ?? undefined}
          onClose={() => setPresentFrom(null)}
        />
      )}
    </>
  );
}
