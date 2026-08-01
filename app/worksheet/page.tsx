'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Printer, Eye, EyeOff, Compass } from 'lucide-react';
import MathRenderer from '@/components/MathRenderer';
import Marks from '@/components/Marks';
import QRCodeImage from '@/components/QRCodeImage';
import { decodeWorksheet, resolveWorksheet } from '@/lib/worksheet-share';
import {
  getAllN5Questions, getAllHigherQuestions, getAllAHQuestions,
  getAllN5AppsQuestions, getAllHigherAppsQuestions,
  type QuestionWithMetadata,
} from '@/lib/data-loader';
import { getCourseTheme } from '@/lib/course-theme';
import { timestampToSeconds } from '@/lib/timestamp.mjs';

// A shared worksheet, locked. Everything comes from the query string, so this
// page is static and the link works forever without anything stored anywhere.
//
// Deliberately not the Explorer: a handout wants the questions, a title and a
// print button, and none of the add/remove/reorder machinery. Someone who
// wants to change it can open the editable link instead.

const LOADERS: Record<string, () => Promise<QuestionWithMetadata[]>> = {
  n5: getAllN5Questions,
  higher: getAllHigherQuestions,
  ah: getAllAHQuestions,
  'n5-apps': getAllN5AppsQuestions,
  'higher-apps': getAllHigherAppsQuestions,
};

const COURSE_NAMES: Record<string, string> = {
  n5: 'National 5 Maths',
  higher: 'Higher Maths',
  ah: 'Advanced Higher Maths',
  'n5-apps': 'National 5 Applications',
  'higher-apps': 'Higher Applications',
};

function SharedWorksheet() {
  const [questions, setQuestions] = useState<QuestionWithMetadata[] | null>(null);
  const [missing, setMissing] = useState(0);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [title, setTitle] = useState<string | undefined>();
  const [showAnswers, setShowAnswers] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const shared = decodeWorksheet(window.location.search);
    if (!shared || !LOADERS[shared.courseId]) { setNotFound(true); return; }
    setCourseId(shared.courseId);
    setTitle(shared.title);
    LOADERS[shared.courseId]().then(all => {
      const { questions: qs, missing: m } = resolveWorksheet(shared.refs, all);
      setQuestions(qs);
      setMissing(m);
    });
  }, []);

  const totalMarks = useMemo(
    () => (questions ?? []).reduce((sum, q) => sum + (q.marks?.reduce((a, b) => a + b, 0) ?? 0), 0),
    [questions]
  );

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold mb-3">That worksheet link is not valid</h1>
        <p className="text-muted-foreground mb-6">
          The link may have been cut short when it was copied — worksheet links are long.
        </p>
        <Link href="/explorer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-background font-bold rounded-lg transition-colors">
          <Compass className="h-4 w-4" />
          Build your own in the Explorer
        </Link>
      </div>
    );
  }

  if (!questions) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const theme = getCourseTheme(courseId ?? 'n5');

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <p className={`font-mono text-xs uppercase tracking-widest ${theme.text} mb-2 no-print`}>
          {COURSE_NAMES[courseId ?? ''] ?? 'Worksheet'} · shared worksheet
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          {title || `${COURSE_NAMES[courseId ?? ''] ?? ''} Worksheet`}
        </h1>
        <p className="font-mono text-xs text-muted-dim">
          {questions.length} question{questions.length === 1 ? '' : 's'}
          {totalMarks > 0 && ` · ${totalMarks} marks`}
        </p>
        {missing > 0 && (
          <p className="mt-3 text-sm text-muted-foreground">
            {missing} question{missing === 1 ? '' : 's'} in this link could not be found and
            {missing === 1 ? ' has' : ' have'} been left out.
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-8 no-print">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-background text-sm font-bold rounded-lg transition-colors"
        >
          <Printer className="h-4 w-4" />
          Print
        </button>
        <button
          onClick={() => setShowAnswers(s => !s)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-muted/40 hover:bg-muted/60 text-foreground text-sm font-medium rounded-lg transition-colors"
        >
          {showAnswers ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showAnswers ? 'Hide answers' : 'Show answers'}
        </button>
      </div>

      <ol className="space-y-6">
        {questions.map((q, i) => (
          <li key={`${q.year}-${q.paperNumber}-${q.questionIndex}`} className="bg-card border border-border rounded-xl p-5 sm:p-6 break-inside-avoid">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className={`flex items-center justify-center h-7 w-7 ${theme.tint} ${theme.text} text-sm font-bold rounded-lg shrink-0`}>
                {i + 1}
              </span>
              {/* No paper reference here: every question's own html opens with
                  its "2026 P1 Q1" label, so repeating it prints it twice. */}
              <Marks marks={q.marks} theme={theme} className="ml-auto" />
            </div>
            <MathRenderer html={q.question} className="question-content text-foreground/90" />
            {q.videoId && (
              <div className="mt-4 print-only">
                <QRCodeImage
                  url={`https://www.youtube.com/watch?v=${q.videoId}&t=${timestampToSeconds(q.timestamp)}`}
                  size={64}
                />
              </div>
            )}
            {showAnswers && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className={`font-mono text-xs uppercase tracking-widest ${theme.text} mb-2`}>Answer</p>
                <MathRenderer html={q.answer} className="answer-content text-foreground/80" />
              </div>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-10 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4 no-print">
        <p className="text-sm text-muted-foreground">
          Built with the Clelland Maths Topic Explorer — free for students and teachers.
        </p>
        <Link href="/explorer" className={`text-sm ${theme.text} hover:opacity-80 transition-opacity`}>
          Build your own →
        </Link>
      </div>
    </div>
  );
}

export default function WorksheetPage() {
  return (
    <Suspense fallback={null}>
      <SharedWorksheet />
    </Suspense>
  );
}
