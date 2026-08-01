'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Printer, Eye, EyeOff, Compass, Maximize2, Play } from 'lucide-react';
import MathRenderer from '@/components/MathRenderer';
import Marks from '@/components/Marks';
import QRCodeImage from '@/components/QRCodeImage';
import { decodeWorksheet, resolveWorksheet, NO_OPTIONS, type WorksheetOptions } from '@/lib/worksheet-share';
import QuestionPresenter from '@/components/Explorer/QuestionPresenter';
import VideoModal from '@/components/VideoModal';
import {
  getAllN5Questions, getAllHigherQuestions, getAllAHQuestions,
  getAllN5AppsQuestions, getAllHigherAppsQuestions,
  type QuestionWithMetadata,
} from '@/lib/data-loader';
import { getCourseTheme } from '@/lib/course-theme';
import { QS_COPYRIGHT_NOTICE, QS_NOTICE_SCOPE } from '@/lib/exam-board';
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
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [video, setVideo] = useState<{ videoId: string; timestamp: number; title: string } | null>(null);
  const [options, setOptions] = useState<WorksheetOptions>(NO_OPTIONS);
  const [fullScreenFrom, setFullScreenFrom] = useState<number | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const shared = decodeWorksheet(window.location.search);
    if (!shared || !LOADERS[shared.courseId]) { setNotFound(true); return; }
    setCourseId(shared.courseId);
    setTitle(shared.title);
    setOptions(shared.options);
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
      <div className="mb-8 no-print">
        <p className={`font-mono text-xs uppercase tracking-widest ${theme.text} mb-2`}>
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
        {/* Working through it full screen changes how the questions are read,
            not what was handed over, so it is always offered — and it obeys the
            same answer and video settings. */}
        <button
          onClick={() => setFullScreenFrom(0)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-muted/40 hover:bg-muted/60 text-foreground text-sm font-medium rounded-lg transition-colors"
        >
          <Maximize2 className="h-4 w-4" />
          Full screen
        </button>
        {options.answers && (
          <button
            onClick={() => setRevealed(r => r.size === questions.length ? new Set() : new Set(questions.map((_, i) => i)))}
            className="inline-flex items-center gap-2 px-4 py-2 bg-muted/40 hover:bg-muted/60 text-foreground text-sm font-medium rounded-lg transition-colors"
          >
            {revealed.size === questions.length ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {revealed.size === questions.length ? 'Hide all answers' : 'Show all answers'}
          </button>
        )}
      </div>

      {/* Print-only header. The worksheet print stylesheet already knows these
          class names from the Explorer, so a handout comes out of the printer
          looking like one built there rather than a screenshot of a dark app. */}
      <div className="print-only print-header">
        <p className="print-strapline">clellandmaths.com — free maths revision for Scottish students</p>
        <div className="flex justify-between items-end">
          <h1 className="text-2xl font-bold">{title || `${COURSE_NAMES[courseId ?? ''] ?? ''} Worksheet`}</h1>
          <div className="text-right text-sm">
            <div>{questions.length} question{questions.length === 1 ? '' : 's'}</div>
            {totalMarks > 0 && <div>{totalMarks} marks</div>}
          </div>
        </div>
      </div>

      <ol className="worksheet-container space-y-6">
        {questions.map((q, i) => {
          const isOpen = revealed.has(i);
          return (
            <li
              key={`${q.year}-${q.paperNumber}-${q.questionIndex}`}
              className="worksheet-question bg-card border border-border rounded-xl p-5 sm:p-6 break-inside-avoid"
            >
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className={`q-badge flex items-center justify-center h-7 w-7 ${theme.tint} ${theme.text} text-sm font-bold rounded-lg shrink-0`}>
                  {i + 1}
                </span>
                {/* No paper reference here: every question's own html opens with
                    its "2026 P1 Q1" label, so repeating it prints it twice. */}
                <Marks marks={q.marks} theme={theme} className="q-marks ml-auto" />
                {/* Beside the number rather than under the question, matching
                    the Explorer's sheet — it keeps the QR out of the reading
                    flow, on screen and on paper alike. */}
                {options.qrCodes && q.videoId && (
                  <QRCodeImage
                    url={`https://www.youtube.com/watch?v=${q.videoId}&t=${timestampToSeconds(q.timestamp)}`}
                    size={64}
                    className="shrink-0 rounded"
                  />
                )}
              </div>

              <MathRenderer html={q.question} className="question-content text-foreground/90" />

              {/* Whatever the maker granted, offered here on the card as well as
                  in full screen — a pupil reading down the page should not have
                  to go full screen to get at an answer they were given. */}
              {(options.answers || (options.video && q.videoId)) && (
                <div className="no-print flex flex-wrap gap-2 mt-4">
                  {options.answers && (
                    <button
                      onClick={() => setRevealed(r => {
                        const next = new Set(r);
                        if (next.has(i)) next.delete(i); else next.add(i);
                        return next;
                      })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted/40 hover:bg-muted/60 text-foreground text-sm font-medium rounded-lg transition-colors"
                    >
                      {isOpen ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {isOpen ? 'Hide answer' : 'Show answer'}
                    </button>
                  )}
                  {options.video && q.videoId && (
                    <button
                      onClick={() => setVideo({
                        videoId: q.videoId,
                        timestamp: timestampToSeconds(q.timestamp),
                        title: `${q.year} Paper ${q.paperNumber} Q${q.questionNumber}`,
                      })}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${theme.tint} ${theme.text} hover:bg-white/10 text-sm font-medium rounded-lg transition-colors`}
                    >
                      <Play className="h-4 w-4" />
                      Watch solution
                    </button>
                  )}
                </div>
              )}

              {options.answers && isOpen && (
                <div className="answer-section mt-4 pt-4 border-t border-border">
                  <p className={`answer-label font-mono text-xs uppercase tracking-widest ${theme.text} mb-2`}>Answer</p>
                  <MathRenderer html={q.answer} className="answer-content text-foreground/80" />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {/* The site footer is hidden on print, so a printed handout would leave
          the building carrying no attribution at all. The notice travels with
          the questions instead. */}
      <div className="print-only print-footer">
        <p>clellandmaths.com — free past papers, video solutions and worksheets</p>
        <p className="print-notice">{QS_NOTICE_SCOPE} {QS_COPYRIGHT_NOTICE}</p>
      </div>

      {video && (
        <VideoModal
          isOpen={true}
          onClose={() => setVideo(null)}
          videoId={video.videoId}
          timestamp={video.timestamp}
          title={video.title}
        />
      )}

      {fullScreenFrom !== null && (
        <QuestionPresenter
          theme={theme}
          courseId={courseId ?? undefined}
          hasDataBooklet={courseId === 'higher-apps'}
          questions={questions}
          startIndex={fullScreenFrom}
          allowAnswers={options.answers}
          allowVideo={options.video}
          onClose={() => setFullScreenFrom(null)}
        />
      )}

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
