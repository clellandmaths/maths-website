'use client';

import { useEffect, useState } from 'react';
import { Lightbulb } from 'lucide-react';
import MathRenderer from '@/components/MathRenderer';
import { paperLabelOf, courseHasHints } from '@/lib/similar-questions';
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
  /**
   * The printed badge, when the surface holds it rather than the HTML.
   *
   * Guided practice renders past paper questions with the badge stripped out —
   * `resolveQuestions` moves it to `ResolvedQuestion.paper` — so scraping finds
   * nothing and hints were silently unavailable on the very questions that have
   * a marking instruction behind them. An explicit label beats the scrape;
   * everywhere else keeps passing nothing and is unchanged.
   */
  label?: string | null;
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

export default function Hints({ question, theme, courseId, label: given, className = '' }: Props) {
  const [shown, setShown] = useState(0);
  const [staged, setStaged] = useState<Staged | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * An explicit label, then the question's own, then the printed badge.
   *
   * **`question.label` is why hints work in full screen and focus mode.** Those
   * two render `<Hints>` with no label prop, and a question reaching them from
   * guided practice has had its badge stripped out of the HTML — so scraping
   * found nothing and the ladder silently did not appear on exactly the
   * questions that have a marking instruction behind them.
   *
   * A generated question's `label` is the skill it tests rather than a paper
   * reference, and `paperLabelOf` rejects anything that is not `YYYY P# Q#`, so
   * this cannot mistake one for the other.
   */
  const label = paperLabelOf(given ?? question.label, question.question);
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
        const [{ PAPER_HINTS }, { PAPER_STEPS }] = await Promise.all([
          import('@/lib/generator/generators/paper-hints'),
          import('@/lib/generator/generators/paper-steps'),
        ]);
        const hit = PAPER_HINTS[label];
        if (hit) {
          // The marking instructions describe what each mark is for, and that
          // is the rest of the ladder. A paper question used to stop here and
          // send a pupil to the video, which meant the *real* exam question —
          // the one in their homework — offered less help than a made-up one.
          //
          // **Every step is shown, where a generated question withholds its
          // last.** They are different material. A generated step is the
          // worked solution and its final line states the answer; this is the
          // examiner's description of a mark and never gives a value — "round
          // to 2 significant figures", not "140 cm³". Checked rather than
          // assumed: `paper-steps.ts` compares all 194 questions that have an
          // answer recorded against every one of their steps, and none of them
          // states it.
          const steps = PAPER_STEPS[label] ?? [];
          next = {
            skill: hit.skill,
            method: hit.method,
            steps,
            // One row, one mark — that is what makes the corpus a table.
            stepMarks: steps.map(() => 1),
            heldBack: false,
          };
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
    /* **Full width only once it is open.** Closed, this is a single button and
       belongs in the row of buttons beside Formulae and Show answer; open, the
       panel needs the whole line. Sizing it by its own state lets one component
       do both, instead of every caller guessing which it will be. */
    <div className={`no-print ${shown > 0 ? 'w-full' : ''} ${className}`}>
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
                <span className="shrink-0 rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-slate-400">
                  {staged.stepMarks[i]} mark{staged.stepMarks[i] === 1 ? '' : 's'}
                </span>
              )}
            </div>
          ))}
          {!more && (
            <p className="border-t border-slate-800 pt-2 text-xs text-muted-foreground">
              {staged.heldBack
                ? 'That is as far as a hint goes — the last step is the answer itself.'
                : staged.steps.length
                  ? 'That is every mark the marking instructions award — the working itself is in the video solution.'
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
