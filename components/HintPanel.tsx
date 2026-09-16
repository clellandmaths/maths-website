'use client';

import dynamic from 'next/dynamic';
import { Lightbulb, X } from 'lucide-react';
import MathRenderer from '@/components/MathRenderer';
import type { QuestionWithMetadata } from '@/lib/data-loader';
import type { CourseTheme } from '@/lib/course-theme';
import type { Staged } from '@/components/Hints';

const WorkedExample = dynamic(() => import('@/components/WorkedExample'), { ssr: false });

/**
 * The hint ladder itself, over the page.
 *
 * **Split out of `Hints` so it is fetched when somebody presses, not shipped to
 * every page that carries a Hint button.** Inline, the ladder cost the course
 * templates 11 KB against 10 KB of budget headroom; behind one `next/dynamic`
 * boundary it costs the loader. Most people never press it.
 *
 * Everything about *why* it is an overlay rather than a panel on the card, and
 * why the question comes with it, is in `Hints`.
 */
interface Props {
  question: QuestionWithMetadata;
  theme: CourseTheme;
  courseId?: string;
  given?: string | null;
  staged: Staged | null;
  shown: number;
  total: number;
  more: boolean;
  loading: boolean;
  own: boolean;
  body: string;
  aside: string;
  onReveal: () => void;
  onClose: () => void;
}

export default function HintPanel({
  question, theme, courseId, given, staged, shown, total, more, loading, own,
  body, aside, onReveal, onClose,
}: Props) {
  return (
      <div
        className="no-print fixed inset-0 z-[60] flex items-end justify-center bg-black/70 sm:items-center sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-label="Hint"
        onClick={onClose}
      >
        <div
          className="flex max-h-[88vh] w-full flex-col rounded-t-2xl border border-border bg-background sm:max-w-2xl sm:rounded-2xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
            <span className={`flex items-center gap-2 font-semibold ${theme.text}`}>
              <Lightbulb className="h-5 w-5" />
              Hint
            </span>
            <button
              onClick={onClose}
              aria-label="Close the hint"
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
            {/* The question, small and first, so the hint has something to be
                about. */}
            <div className="mb-4 rounded-lg border border-border bg-card/60 p-3">
              <MathRenderer
                html={question.question}
                className="question-content text-sm text-muted-foreground"
              />
            </div>

            {staged && (
              <div className="space-y-2">
        {/*
          Both prose lines go through the renderer, not just the steps.
          They are mostly words, but a dozen of them name the thing they are
          about — "Write x² + bx + c in the form (x + p)² + q" — and until
          this they were the one part of a hint shown as raw text, carets and
          all. A div rather than a p: MathRenderer renders an element, and an
          element inside a p is invalid nesting.
        */}
        <div className={body}>
          <span className={`font-semibold ${theme.text}`}>What it asks: </span>
          <MathRenderer html={staged.skill} className="inline text-foreground-2" />
        </div>
        {shown > 1 && (
          <div className={body}>
            <span className={`font-semibold ${theme.text}`}>How the marks go: </span>
            <MathRenderer html={staged.method} className="inline text-foreground-2" />
          </div>
        )}
        {staged.rungs.slice(0, Math.max(0, shown - 2)).map((rung, i) => (
          <div key={i} className="border-t border-border pt-2">
            <div className="flex items-start gap-2">
              <MathRenderer
                html={rung.move}
                className={`answer-content flex-1 ${body} text-foreground-2`}
              />
              {/* **A move worth 0 shows nothing at all.** Two variations are
                  worth a single mark and still take two moves to explain —
                  moves are pedagogy, marks are accounting — so the first of
                  those earns nothing on its own. "0 marks" beside a hint
                  reads as a fault; an absent chip reads as what it is. */}
              {rung.marks !== undefined && rung.marks > 0 && (
                <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                  {rung.marks} mark{rung.marks === 1 ? '' : 's'}
                </span>
              )}
            </div>
            {/* This question's own working as the move begins — the concrete
                half. Absent where showing it would hand over an answer. */}
            {rung.shows && (
              <MathRenderer
                html={rung.shows}
                className={`answer-content mt-1 ${aside} text-muted-foreground`}
              />
            )}
          </div>
        ))}
        {!more && (
          <div className="border-t border-border pt-2">
            <p className="text-xs text-muted-foreground">
              {staged.heldBack
                ? 'That is as far as a hint goes — the last step is the answer itself.'
                : staged.rungs.length
                  ? 'That is the whole method. The working for the last move is the answer, so it is not here.'
                  : 'That is as far as a hint goes for a past paper question — the full working is in the video solution.'}
            </p>
            {/*
              **Only a past paper question gets a worked example, and only it
              needs one.**

              A generated question already *is* a twin — offering it another,
              worked, is `Show answer` with extra steps, and *Another* sits
              right there on the card besides. So the branch turns on `own`,
              the same test the rest of this component uses.

              **There is no video button here for either kind, and that was a
              correction.** One was written for the generated half on the
              reasoning that a generated question has no video of its own. It
              does — `useGeneratedDraw` attaches the parent's — and every one
              of the six surfaces that renders this ladder already puts a video
              control on the card. A second one inside the panel is a duplicate
              a few pixels from the first. The same argument had already been
              used to deny the *paper* half a video; it just took the JS budget
              check failing on `explorer.html` to notice it applied to both.
            */}
            {!own && (
              <WorkedExample
                question={question}
                theme={theme}
                courseId={courseId}
                label={given}
              />
            )}
          </div>
        )}
              </div>
            )}
          </div>

          {more && (
            <div className="border-t border-border px-4 py-3 sm:px-6">
              <button
                onClick={onReveal}
                disabled={loading}
                className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition-colors disabled:opacity-50 ${theme.tint} ${theme.text} hover:bg-foreground/10`}
              >
                <Lightbulb className="h-4 w-4" />
                {/* **"Next step (k of N)" would lie now.** N used to be the
                    mark count, one rung per mark; a ladder is two to four
                    authored moves and a 7-mark question no longer takes eight
                    presses. What is left to say is how much help remains. */}
                {loading
                  ? 'Loading…'
                  : shown === 1
                    ? 'Another hint'
                    : `More help (${total - shown} left)`}
              </button>
            </div>
          )}
        </div>
      </div>
  );
}
