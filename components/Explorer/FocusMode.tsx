'use client';

import { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Play, Check, BookOpen, Paperclip, ClipboardCheck } from 'lucide-react';
import dynamic from 'next/dynamic';
import DataBookletModal from '@/components/Explorer/DataBookletModal';
import MarkschemeModal from '@/components/Explorer/MarkschemeModal';
import { hasMarkscheme } from '@/lib/ah-markschemes';
import { QuestionWithMetadata, questionLabel } from '@/lib/data-loader';
import MathRenderer from '@/components/MathRenderer';
import Hints from '@/components/Hints';
import NoHintNote from '@/components/NoHintNote';
import Marks from '@/components/Marks';
import FormulaeButton from '@/components/FormulaeButton';
import VideoModal from '@/components/VideoModal';
import type { CourseTheme } from '@/lib/course-theme';
import { timestampToSeconds } from '@/lib/timestamp.mjs';

/**
 * Lazily, the way `Hints` loads its worked example.
 *
 * The same control a guided practice page renders directly — a twin opening
 * below the question, never replacing it — and the same reasoning: this
 * component is on the course templates, which sit inside 10 KB of JS budget
 * headroom, and nothing here is on screen until a pupil asks for it.
 * `check:budget` is what says so, and it refused this change until the card
 * came out of the eager bundle.
 */
const MoreLikeThis = dynamic(() => import('@/components/MoreLikeThis'), { ssr: false });

// localStorage helpers for done tracking
function getDoneKey(questions: QuestionWithMetadata[]): string {
  if (questions.length === 0) return 'focusmode_done_unknown';
  const q = questions[0];
  return `focusmode_done_${q.year}_${q.paperNumber}`;
}

function loadDoneSet(questions: QuestionWithMetadata[]): Set<number> {
  if (typeof window === 'undefined') return new Set();
  try {
    const stored = localStorage.getItem(getDoneKey(questions));
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function saveDoneSet(questions: QuestionWithMetadata[], doneSet: Set<number>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getDoneKey(questions), JSON.stringify([...doneSet]));
  } catch {
    // localStorage full or unavailable
  }
}

interface FocusModeProps {
  /** Course this question set belongs to — enables the Formulae button. */
  courseId?: string;
  theme: CourseTheme;
  hasDataBooklet?: boolean;
  questions: QuestionWithMetadata[];
  onClose: () => void;
  /**
   * May a pupil draw another question like one of these?
   *
   * Default true — a past paper and a practice topic both want it. **The
   * Explorer's own worksheet passes false**: it already offers *Variation* on
   * every card, *Add a variation of each* and *Generate on N topics*, and a
   * twin drawn here would be the only one of the four that does not end up on
   * the sheet. See `QuestionPresenter`, which carries the same prop and the
   * shared-worksheet rule that goes with it.
   */
  allowAnother?: boolean;
}

export default function FocusMode({ theme, hasDataBooklet = false, courseId, questions, onClose, allowAnother = true }: FocusModeProps) {
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());
  const [activeVideo, setActiveVideo] = useState<{videoId: string; timestamp: number; title: string} | null>(null);
  const [bookletYear, setBookletYear] = useState<number | string | null>(null);
  const [markschemeQ, setMarkschemeQ] = useState<QuestionWithMetadata | null>(null);
  const [doneSet, setDoneSet] = useState<Set<number>>(() => loadDoneSet(questions));

  /**
   * Every twin drawn anywhere on this page.
   *
   * Each row owns the one it is showing; this list is what they share. Focus
   * mode is a whole paper at once, so without it, working down the page hands
   * the same twin out twice on two different questions.
   */
  const [drawn, setDrawn] = useState<QuestionWithMetadata[]>([]);
  const toggleAnswer = (index: number) => {
    setRevealedAnswers((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const toggleDone = (index: number) => {
    setDoneSet((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      saveDoneSet(questions, next);
      return next;
    });
  };

  // Keyboard: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeVideo) return;
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, activeVideo]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const doneCount = doneSet.size;

  return (
    <>
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border no-print">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
        >
          <X className="h-5 w-5" />
          <span className="hidden sm:inline text-sm">Close</span>
        </button>
        <p className="text-muted-foreground text-sm">
          Focus Mode &middot;{' '}
          {doneCount > 0 ? (
            <span className={theme.text}>{doneCount}/{questions.length} done</span>
          ) : (
            <span className="text-foreground">{questions.length} question{questions.length === 1 ? '' : 's'}</span>
          )}
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8 space-y-4">
          {questions.map((q, index) => (
            <div
              key={`focus-${q.year}-${q.paperNumber}-${q.questionIndex}`}
              className="bg-card/50 border border-border rounded-xl p-5 sm:p-6"
            >
              {/* Question header */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className={`flex items-center justify-center w-8 h-8 ${theme.tint} ${theme.text} text-sm font-bold rounded-full shrink-0`}>
                  {index + 1}
                </span>
                <span className="text-sm text-muted-dim shrink-0">
                  {questionLabel(q)}
                </span>
                {q.topics?.slice(0, 2).map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-1 bg-muted text-muted-foreground text-xs font-medium rounded shrink-0"
                  >
                    {topic}
                  </span>
                ))}
                <Marks marks={q.marks} theme={theme} className="ml-auto shrink-0" />
              </div>

              {/* Question content */}
              <MathRenderer
                html={q.question}
                className="text-foreground question-content text-xl leading-relaxed"
              />

              {/* Higher Apps data files */}
              {q.attachments && q.attachments.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {q.attachments.map((file) => (
                    <a
                      key={file.url}
                      href={file.url}
                      download
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${theme.tint} ${theme.text} hover:bg-foreground/10 rounded-lg text-xs font-medium transition-colors`}
                    >
                      <Paperclip className="h-3 w-3" />
                      {file.name}
                    </a>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => toggleAnswer(index)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    revealedAnswers.has(index)
                      ? 'bg-muted hover:bg-muted-hover text-muted-foreground'
                      : `${theme.tint} ${theme.text} hover:bg-foreground/10`
                  }`}
                >
                  {revealedAnswers.has(index) ? (
                    <><EyeOff className="h-4 w-4" /> Hide Answer</>
                  ) : (
                    <><Eye className="h-4 w-4" /> Show Answer</>
                  )}
                </button>
                {/* Focus's own row is px-4 py-2 — 36px — so the Hint button
                    matches that rather than the presenter's 48px blocks. Same
                    fault in both places, different right answer. */}
                <Hints
                  question={q}
                  theme={theme}
                  courseId={courseId}
                  size="stage"
                  buttonClassName={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${theme.tint} ${theme.text} hover:bg-foreground/10`}
                />
                {hasDataBooklet && (
                  <button
                    onClick={() => setBookletYear(q.year)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted-hover text-muted-foreground rounded-lg text-sm font-medium transition-colors"
                  >
                    <BookOpen className="h-4 w-4" />
                    Data Booklet
                  </button>
                )}
                {courseId && (
                  <FormulaeButton
                    courseId={courseId}
                    theme={theme}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted-hover text-muted-foreground rounded-lg text-sm font-medium transition-colors"
                  />
                )}
                {q.videoId ? (
                  <button
                    onClick={() => setActiveVideo({
                      videoId: q.videoId,
                      timestamp: timestampToSeconds(q.timestamp),
                      title: questionLabel(q)
                    })}
                    className={`inline-flex items-center gap-2 px-4 py-2 ${theme.tint} ${theme.text} hover:bg-foreground/10 rounded-lg text-sm font-medium transition-colors`}
                  >
                    <Play className="h-4 w-4" />
                    {q.videoOf ? 'Watch a worked example' : 'Watch Solution'}
                  </button>
                ) : hasMarkscheme(q.year, q.paperNumber) ? (
                  <button
                    onClick={() => setMarkschemeQ(q)}
                    className={`inline-flex items-center gap-2 px-4 py-2 ${theme.tint} ${theme.text} hover:bg-foreground/10 rounded-lg text-sm font-medium transition-colors`}
                  >
                    <ClipboardCheck className="h-4 w-4" />
                    Markscheme
                  </button>
                ) : (
                  // Neither a video nor marking instructions: say so, rather
                  // than leaving a gap that reads as a missing button
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-muted text-muted-dim text-sm">
                    <Play className="h-4 w-4" />
                    Video solution coming soon
                  </span>
                )}
                <button
                  onClick={() => toggleDone(index)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    doneSet.has(index)
                      ? `${theme.tint} ${theme.text}`
                      : 'bg-muted hover:bg-muted-hover text-muted-foreground'
                  }`}
                >
                  <div
                    className={`flex items-center justify-center h-5 w-5 rounded-full border-2 shrink-0 transition-colors ${
                      doneSet.has(index)
                        ? `${theme.bg} ${theme.border}`
                        : 'border-muted-foreground'
                    }`}
                  >
                    {doneSet.has(index) && <Check className="h-3 w-3 text-white" />}
                  </div>
                  {doneSet.has(index) ? 'Done' : 'Mark as Done'}
                </button>
              </div>

              {/* Why this row has no Hint button when the ones above and below
                  it do. Rarely more than one per topic, so it explains an
                  oddity rather than repeating itself down the page. */}
              <NoHintNote
                courseId={courseId}
                question={q}
                solutionUrl={q.solutionUrl}
                className="mt-3"
              />

              {/* Answer section */}
              {revealedAnswers.has(index) && (
                <div className="mt-4 bg-card border border-border rounded-xl p-4 sm:p-6">
                  <p className={`text-sm font-medium ${theme.text} mb-2`}>Answer:</p>
                  <MathRenderer
                    html={q.answer}
                    className="text-foreground answer-content text-xl leading-relaxed"
                  />
                  {q.solutionUrl && (
                    // Guided practice questions from maths.scot: linking to his
                    // written solution is a condition of using them.
                    // See docs/guided-practice-attribution.md
                    <a
                      href={q.solutionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-4 text-sm text-muted-foreground hover:text-foreground underline transition-colors"
                    >
                      Full written solution at Maths.scot
                    </a>
                  )}
                </div>
              )}

              {/* Another like this one, under the question it is like — never
                  replacing it. A pupil here is working down a whole paper and
                  taking the question away loses their place in it.

                  Painted in this overlay's slate rather than the page's card
                  colour, which is a shade adrift of everything around it here. */}
              {allowAnother && (
                <MoreLikeThis
                  courseId={courseId}
                  theme={theme}
                  label={q.label}
                  questionHtml={q.question}
                  className="mt-4"
                  tone="overlay"
                  alsoExclude={drawn}
                  onDrawn={(made) => setDrawn(d => [...d, made])}
                />
              )}
            </div>
          ))}
        </div>
      </div>

    </div>

    {/* Video Modal */}
    {activeVideo && (
      <VideoModal
        isOpen={true}
        onClose={() => setActiveVideo(null)}
        videoId={activeVideo.videoId}
        timestamp={activeVideo.timestamp}
        title={activeVideo.title}
      />
    )}

    {/* Data Booklet (Higher Apps) */}
    {bookletYear !== null && (
      <DataBookletModal
        year={bookletYear}
        theme={theme}
        onClose={() => setBookletYear(null)}
      />
    )}

    {/* AH marking instructions */}
    {markschemeQ && (
      <MarkschemeModal
        theme={theme}
        year={markschemeQ.year}
        paperNumber={markschemeQ.paperNumber}
        questionHtml={markschemeQ.question}
        title={questionLabel(markschemeQ)}
        onClose={() => setMarkschemeQ(null)}
      />
    )}
  </>
  );
}
