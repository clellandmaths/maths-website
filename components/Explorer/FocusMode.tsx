'use client';

import { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Play, Check } from 'lucide-react';
import { QuestionWithMetadata } from '@/lib/data-loader';
import MathRenderer from '@/components/MathRenderer';
import VideoModal from '@/components/VideoModal';
import type { CourseTheme } from '@/lib/course-theme';

function getTimestampSeconds(ts: string): number {
  if (ts.endsWith('s')) return parseInt(ts.replace('s', ''), 10);
  if (ts.includes(':')) {
    const [mins, secs] = ts.split(':').map(Number);
    return mins * 60 + secs;
  }
  return parseInt(ts, 10);
}

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
  theme: CourseTheme;
  questions: QuestionWithMetadata[];
  onClose: () => void;
}

export default function FocusMode({ theme, questions, onClose }: FocusModeProps) {
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());
  const [activeVideo, setActiveVideo] = useState<{videoId: string; timestamp: number; title: string} | null>(null);
  const [doneSet, setDoneSet] = useState<Set<number>>(() => loadDoneSet(questions));
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
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 no-print">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
          <span className="hidden sm:inline text-sm">Close</span>
        </button>
        <p className="text-slate-400 text-sm">
          Focus Mode &middot;{' '}
          {doneCount > 0 ? (
            <span className={theme.text}>{doneCount}/{questions.length} done</span>
          ) : (
            <span className="text-slate-300">{questions.length} question{questions.length === 1 ? '' : 's'}</span>
          )}
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8 space-y-4">
          {questions.map((q, index) => (
            <div
              key={`focus-${q.year}-${q.paperNumber}-${q.questionIndex}`}
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 sm:p-6"
            >
              {/* Question header */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className={`flex items-center justify-center w-8 h-8 ${theme.tint} ${theme.text} text-sm font-bold rounded-full shrink-0`}>
                  {index + 1}
                </span>
                <span className="text-sm text-slate-500 shrink-0">
                  {q.year} Paper {q.paperNumber} Q{q.questionIndex + 1}
                </span>
                {q.topics?.slice(0, 2).map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-1 bg-slate-800 text-slate-400 text-xs font-medium rounded shrink-0"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              {/* Question content */}
              <MathRenderer
                html={q.question}
                className="text-slate-200 question-content text-lg leading-relaxed"
              />

              {/* Action buttons */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => toggleAnswer(index)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    revealedAnswers.has(index)
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                      : 'bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30'
                  }`}
                >
                  {revealedAnswers.has(index) ? (
                    <><EyeOff className="h-4 w-4" /> Hide Answer</>
                  ) : (
                    <><Eye className="h-4 w-4" /> Show Answer</>
                  )}
                </button>
                <button
                  onClick={() => setActiveVideo({
                    videoId: q.videoId,
                    timestamp: getTimestampSeconds(q.timestamp),
                    title: `${q.year} Paper ${q.paperNumber} Q${q.questionIndex + 1}`
                  })}
                  className={`inline-flex items-center gap-2 px-4 py-2 ${theme.tint} ${theme.text} hover:bg-white/10 rounded-lg text-sm font-medium transition-colors`}
                >
                  <Play className="h-4 w-4" />
                  Watch Solution
                </button>
                <button
                  onClick={() => toggleDone(index)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    doneSet.has(index)
                      ? `${theme.tint} ${theme.text}`
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                  }`}
                >
                  <div
                    className={`flex items-center justify-center h-5 w-5 rounded-full border-2 shrink-0 transition-colors ${
                      doneSet.has(index)
                        ? `${theme.bg} ${theme.border}`
                        : 'border-slate-500'
                    }`}
                  >
                    {doneSet.has(index) && <Check className="h-3 w-3 text-white" />}
                  </div>
                  {doneSet.has(index) ? 'Done' : 'Mark as Done'}
                </button>
              </div>

              {/* Answer section */}
              {revealedAnswers.has(index) && (
                <div className="mt-4 bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6">
                  <p className={`text-sm font-medium ${theme.text} mb-2`}>Answer:</p>
                  <MathRenderer
                    html={q.answer}
                    className="text-slate-300 answer-content"
                  />
                </div>
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
  </>
  );
}
