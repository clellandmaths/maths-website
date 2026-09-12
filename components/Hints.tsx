'use client';

import { useEffect, useState } from 'react';
import { Lightbulb } from 'lucide-react';
import MathRenderer from '@/components/MathRenderer';
import { variationLabel, courseHasHints } from '@/lib/similar-questions';
import type { QuestionWithMetadata } from '@/lib/data-loader';
import type { CourseTheme } from '@/lib/course-theme';

/**
 * Staged help, one press at a time.
 *
 * A pupil who is stuck has two problems and they are different: not knowing
 * what is being asked, and not knowing how to start. So the first press says
 * what the question wants, the second says how the marks are earned, and only
 * then — on a generated question, which carries its own worked solution — do
 * the steps appear one at a time with what each is worth.
 *
 * **Where this comes from.** A generated question carries `skill` and `method`
 * from the variation registry, and `steps` verified against the real marking
 * instructions. A past paper question carries none of that — its data is a
 * final answer and a video — so its hints are fetched from
 * `lib/generator/generators/paper-hints.ts`, keyed on the paper label printed
 * on the question. That table has no imports, so this costs 68 KB rather than
 * the whole engine.
 *
 * The answer itself is not here. Revealing the answer is a different act with
 * its own control, and a maker who grants hints has not thereby granted that.
 */

interface Props {
  question: QuestionWithMetadata;
  theme: CourseTheme;
  /** National 5 is the only course with hints behind it. */
  courseId?: string;
  className?: string;
}

interface Staged {
  skill: string;
  method: string;
  steps: string[];
  stepMarks: number[];
  /** True when a final step was withheld because it lands the answer. */
  heldBack: boolean;
}

export default function Hints({ question, theme, courseId, className = '' }: Props) {
  const [shown, setShown] = useState(0);
  const [staged, setStaged] = useState<Staged | null>(null);
  const [loading, setLoading] = useState(false);

  const label = variationLabel(question.question);
  // A generated question brings its own; a paper one needs the table.
  const own = question.skill && question.method;
  const possible = courseHasHints(courseId) && (own || label !== null);

  // Reset when the question in this slot changes — a re-rolled question must
  // not arrive with the previous one's hints already open.
  useEffect(() => {
    setShown(0);
    setStaged(null);
  }, [question.uid, question.question]);

  if (!possible) return null;

  const reveal = async () => {
    if (staged) {
      setShown((n) => Math.min(n + 1, staged.steps.length + 2));
      return;
    }
    setLoading(true);
    try {
      let next: Staged | null = null;
      if (own) {
        // All but the last step. The steps ARE the worked solution, so the
        // final one lands the answer — and a hint that finishes the question is
        // not a hint. What is left is the method and the setup; the landing is
        // the pupil's, and `Show answer` is a separate thing a maker grants
        // separately.
        const all = question.steps ?? [];
        next = {
          skill: question.skill!,
          method: question.method!,
          steps: all.slice(0, -1),
          stepMarks: (question.stepMarks ?? []).slice(0, -1),
          heldBack: all.length > 0,
        };
      } else if (label) {
        const { PAPER_HINTS } = await import('@/lib/generator/generators/paper-hints');
        const hit = PAPER_HINTS[label];
        // A paper question has no worked solution on this site, so its help
        // stops at the method. The video is what comes after.
        if (hit) {
          next = { skill: hit.skill, method: hit.method, steps: [], stepMarks: [], heldBack: false };
        }
      }
      if (next) {
        setStaged(next);
        setShown(1);
      }
    } finally {
      setLoading(false);
    }
  };

  const total = staged ? staged.steps.length + 2 : 2;
  const more = shown < total;

  return (
    <div className={`no-print ${className}`}>
      {shown > 0 && staged && (
        <div className="mb-2 space-y-2 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          {/*
            Both prose lines go through the renderer, not just the steps.
            They are mostly words, but a dozen of them name the thing they are
            about — "Write x² + bx + c in the form (x + p)² + q" — and until
            this they were the one part of a hint shown as raw text, carets and
            all. A div rather than a p: MathRenderer renders an element, and an
            element inside a p is invalid nesting.
          */}
          <div className="text-sm">
            <span className={`font-semibold ${theme.text}`}>What it asks: </span>
            <MathRenderer html={staged.skill} className="inline text-slate-300" />
          </div>
          {shown > 1 && (
            <div className="text-sm">
              <span className={`font-semibold ${theme.text}`}>How the marks go: </span>
              <MathRenderer html={staged.method} className="inline text-slate-300" />
            </div>
          )}
          {staged.steps.slice(0, Math.max(0, shown - 2)).map((step, i) => (
            <div key={i} className="flex items-start gap-2 border-t border-slate-800 pt-2">
              <MathRenderer html={step} className="answer-content flex-1 text-sm text-slate-300" />
              {staged.stepMarks[i] !== undefined && (
                <span className="shrink-0 rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
                  {staged.stepMarks[i]} mark{staged.stepMarks[i] === 1 ? '' : 's'}
                </span>
              )}
            </div>
          ))}
          {!more && (
            <p className="border-t border-slate-800 pt-2 text-xs text-muted-foreground">
              {staged.heldBack
                ? 'That is as far as a hint goes — the last step is the answer itself.'
                : 'That is as far as a hint goes for a past paper question — the full working is in the video solution.'}
            </p>
          )}
        </div>
      )}

      {more && (
        <button
          onClick={reveal}
          disabled={loading}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${theme.tint} ${theme.text} hover:bg-white/10`}
        >
          <Lightbulb className="h-4 w-4" />
          {loading
            ? 'Loading…'
            : shown === 0
              ? 'Hint'
              : shown === 1
                ? 'Another hint'
                : `Next step (${shown - 1} of ${staged?.steps.length ?? 0})`}
        </button>
      )}
    </div>
  );
}
