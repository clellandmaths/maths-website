'use client';

import { useRef, useState } from 'react';
import { Eye, Play, ExternalLink } from 'lucide-react';
import Marks from '@/components/Marks';
import type { CourseTheme } from '@/lib/course-theme';

// One practice question. Question and answer HTML arrive already rendered to
// KaTeX by the server, so this component only handles the reveal.
//
// Two deliberate choices:
//
// 1. The answer is ALWAYS in the DOM, hidden with CSS rather than conditionally
//    rendered. Crawlers then index it — it is unique maths content and half the
//    value of the page — while a pupil still has to choose to see it.
// 2. It takes rendered strings, never the practice data module. Importing that
//    here would pull 157 KB of questions into the client bundle.

interface Props {
  index: number;
  questionHtml: string;
  answerHtml: string;
  videoId?: string;
  timestamp?: number;
  paper?: string;
  solutionUrl?: string;
  marks?: number[];
  theme: CourseTheme;
}

export default function PracticeQuestion({
  index, questionHtml, answerHtml, videoId, timestamp, paper, solutionUrl, marks, theme,
}: Props) {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const answerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  function reveal() {
    setOpen(true);
    // Match the app: bring the answer into view, or on a long question it opens
    // below the fold and looks like nothing happened.
    requestAnimationFrame(() => {
      answerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  function play() {
    setPlaying(true);
    requestAnimationFrame(() => {
      videoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // Embedded inline at the right second, as the app does — sending a pupil to
  // YouTube loses their place in the question set. The iframe is only created
  // on click, so no YouTube script loads with the page.
  const embedSrc = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?start=${timestamp ?? 0}&autoplay=1&rel=0`
    : null;

  return (
    <div className="border border-border rounded-xl p-5 bg-card/40">
      <div className="flex items-start gap-3 mb-3">
        <span className={`font-mono text-xs ${theme.text} shrink-0 mt-1`}>{index}</span>
        <div className="min-w-0 flex-1">
          {(paper || marks) && (
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {paper && (
                <span className="inline-block font-mono text-[11px] text-muted-foreground border border-border rounded px-1.5 py-0.5">
                  {paper}
                </span>
              )}
              <Marks marks={marks} theme={theme} />
            </div>
          )}
          <div
            className="prose-practice text-foreground"
            dangerouslySetInnerHTML={{ __html: questionHtml }}
          />
        </div>
      </div>

      {!open && (
        <button
          onClick={reveal}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${theme.border} ${theme.tint} ${theme.text} text-sm font-medium transition-colors hover:bg-white/10`}
        >
          <Eye className="h-3.5 w-3.5" />
          Show answer
        </button>
      )}

      {/* Always rendered so it is indexable; hidden until asked for. */}
      <div
        ref={answerRef}
        hidden={!open}
        className="mt-3 rounded-lg bg-slate-800/60 border border-border p-4 space-y-3"
      >
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-1">Answer</p>
          <div
            className="prose-practice text-foreground"
            dangerouslySetInnerHTML={{ __html: answerHtml }}
          />
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {embedSrc && !playing && (
            <button
              onClick={play}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${theme.border} ${theme.text} text-sm font-medium hover:bg-white/10 transition-colors`}
            >
              <Play className="h-3.5 w-3.5" />
              Watch the solution
            </button>
          )}
          {solutionUrl && (
            // Condition of using these questions: the full written solution
            // stays on maths.scot. See docs/guided-practice-attribution.md
            <a
              href={solutionUrl}
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
          <div ref={videoRef} className="rounded-lg overflow-hidden border border-border aspect-video bg-black">
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
    </div>
  );
}
