'use client';

import { useCallback, useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Eye, Play, ExternalLink, Maximize2 } from 'lucide-react';
import type { CourseTheme } from '@/lib/course-theme';

// Full-screen drilling, one question at a time — the app's question view.
// Keyboard driven, because that is how anyone doing thirty questions wants to
// work: arrows to move, space to reveal, Escape to leave.

export interface FocusQuestion {
  questionHtml: string;
  answerHtml: string;
  videoId?: string;
  timestamp?: number;
  paper?: string;
  solutionUrl?: string;
}

interface Props {
  topicName: string;
  questions: FocusQuestion[];
  theme: CourseTheme;
}

export default function PracticeFocus({ topicName, questions, theme }: Props) {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(false);
  const [playing, setPlaying] = useState(false);

  const go = useCallback((delta: number) => {
    setI(prev => {
      const next = Math.min(Math.max(prev + delta, 0), questions.length - 1);
      if (next !== prev) { setShown(false); setPlaying(false); }
      return next;
    });
  }, [questions.length]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setShown(true); }
    }
    window.addEventListener('keydown', onKey);
    // Stop the page behind scrolling while the overlay is up
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, go]);

  if (!questions.length) return null;

  if (!open) {
    return (
      <button
        onClick={() => { setOpen(true); setI(0); setShown(false); setPlaying(false); }}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${theme.border} ${theme.tint} ${theme.text} font-medium hover:bg-white/10 transition-colors`}
      >
        <Maximize2 className="h-4 w-4" />
        Focus mode
      </button>
    );
  }

  const q = questions[i];
  const embedSrc = q.videoId
    ? `https://www.youtube-nocookie.com/embed/${q.videoId}?start=${q.timestamp ?? 0}&autoplay=1&rel=0`
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border shrink-0">
        <div className="min-w-0">
          <p className={`font-mono text-xs uppercase tracking-widest ${theme.text}`}>{topicName}</p>
          <p className="font-mono text-xs text-muted-foreground">
            Question {i + 1} of {questions.length}
          </p>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-white/5 text-sm transition-colors"
        >
          <X className="h-4 w-4" />
          Close
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-8">
        <div className="mx-auto max-w-2xl space-y-5">
          {q.paper && (
            <span className="inline-block font-mono text-[11px] text-muted-foreground border border-border rounded px-1.5 py-0.5">
              {q.paper}
            </span>
          )}
          <div
            className="prose-practice text-foreground text-lg"
            dangerouslySetInnerHTML={{ __html: q.questionHtml }}
          />

          {!shown ? (
            <button
              onClick={() => setShown(true)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border ${theme.border} ${theme.tint} ${theme.text} font-medium hover:bg-white/10 transition-colors`}
            >
              <Eye className="h-4 w-4" />
              Show answer
              <span className="font-mono text-[11px] opacity-60 ml-1">space</span>
            </button>
          ) : (
            <div className="rounded-lg bg-slate-800/60 border border-border p-4 space-y-3">
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Answer</p>
              <div
                className="prose-practice text-foreground"
                dangerouslySetInnerHTML={{ __html: q.answerHtml }}
              />
              <div className="flex flex-wrap gap-2 pt-1">
                {embedSrc && !playing && (
                  <button
                    onClick={() => setPlaying(true)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${theme.border} ${theme.text} text-sm font-medium hover:bg-white/10 transition-colors`}
                  >
                    <Play className="h-3.5 w-3.5" />
                    Watch the solution
                  </button>
                )}
                {q.solutionUrl && (
                  <a
                    href={q.solutionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground text-sm font-medium hover:text-foreground hover:bg-white/5 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Full written solution at maths.scot
                  </a>
                )}
              </div>
              {playing && embedSrc && (
                <div className="rounded-lg overflow-hidden border border-border aspect-video bg-black">
                  <iframe
                    src={embedSrc}
                    title="Worked solution"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <footer className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-border shrink-0">
        <button
          onClick={() => go(-1)}
          disabled={i === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm font-medium disabled:opacity-30 hover:bg-white/5 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>
        <p className="font-mono text-[11px] text-muted-foreground hidden sm:block">
          ← → to move · space to reveal · esc to close
        </p>
        <button
          onClick={() => go(1)}
          disabled={i === questions.length - 1}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border ${theme.border} ${theme.text} text-sm font-medium disabled:opacity-30 hover:bg-white/10 transition-colors`}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </footer>
    </div>
  );
}
