'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Lightbulb } from 'lucide-react';
import MathRenderer from '@/components/MathRenderer';
/**
 * **Loaded at the last press, not with the page.**
 *
 * A static import put this on every card in the Explorer grid and the budget
 * check caught it: explorer.html went 997 KB to 1008 KB, past the 10 KB
 * headroom. Most pupils never reach the bottom of a ladder, so the worked
 * example should not be part of what the browse page downloads to show them a
 * question. It also keeps Hints off the static graph that reaches the engine.
 */
const WorkedExample = dynamic(() => import('@/components/WorkedExample'), { ssr: false });
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
 * **Where this comes from, and the two halves are not alike.** A generated
 * question carries `skill`, `method` and `steps` on itself — the steps are its
 * own worked solution, numbered against the pupil's own numbers, and the last
 * is withheld because it states the answer. A past paper question carries none
 * of that: its data is a final answer and a video. Its ladder is fetched from
 * `lib/generator/generators/paper-plan.ts`, keyed on the paper label printed on
 * the question. No imports on that table, so this costs a fetch rather than the
 * 33,000-line engine.
 *
 * **The paper ladder used to be the marking instructions, and it ran downhill.**
 * `paper-steps.ts` is the generic scheme, one row per mark, and that column
 * answers *what does this mark reward* where a pupil is asking *what do I do
 * next*. Where those come apart there is nothing in the string to rescue —
 * `2015 P2 Q4` went "start process", then "solution", each press carrying less
 * than the one before. So the instruction is authored per variation now, two to
 * four moves, with this question's own working from the scheme beside each one.
 *
 * **Moves, not marks.** Ladder length used to be the mark count, so a 7-mark
 * question took eight presses and a 2-mark one spent a press on "consistent
 * answer in simplest form". A move carries what it is worth instead, and a move
 * worth nothing carries no chip at all.
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

/** One press of the ladder, once the two prose lines are past. */
interface Rung {
  /** What to do next. */
  move: string;
  /** What it is worth. **0 prints no chip at all**, never "0 marks". */
  marks?: number;
  /** This question's own working as the move begins, where any is safe to show. */
  shows?: string | null;
}

interface Staged {
  skill: string;
  method: string;
  rungs: Rung[];
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
      setShown((n) => Math.min(n + 1, staged.rungs.length + 2));
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
        const marks = question.stepMarks ?? [];
        next = {
          skill: question.skill!,
          method: question.method!,
          rungs: all.slice(0, -1).map((move, i) => ({ move, marks: marks[i] })),
          heldBack: all.length > 0,
        };
      } else if (label) {
        /**
         * **Authored moves, not the marking instructions replayed.**
         *
         * This used to read `paper-steps.ts`, which is the generic scheme one
         * row per mark. That was the wrong table: the scheme column answers
         * *what does this mark reward*, a pupil is asking *what do I do next*,
         * and where those come apart there is nothing in the string to rescue.
         * `2015 P2 Q4` went "start process", then "solution" — each press
         * carrying less than the one before it.
         *
         * `paper-plan.ts` is two to four authored moves per variation, with
         * this question's own working from the marking instructions beside
         * each. `PLANS` is keyed by variation because the method is shared;
         * `PLAN_OF` is keyed by paper label because the marks and the working
         * are not. Still one table with no imports, so this costs a fetch
         * rather than the engine.
         */
        const { PLANS, PLAN_OF } = await import('@/lib/generator/generators/paper-plan');
        const of = PLAN_OF[label];
        const plan = of ? PLANS[of.v] : undefined;
        if (plan) {
          next = {
            skill: plan.skill,
            method: plan.method,
            rungs: plan.moves.map((move, i) => ({
              move,
              marks: of.marks[i],
              shows: of.shows[i],
            })),
            // Every move is shown; it is the *working* on the last one that is
            // withheld, because that working is the answer.
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

  const total = staged ? staged.rungs.length + 2 : 2;
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
          {staged.rungs.slice(0, Math.max(0, shown - 2)).map((rung, i) => (
            <div key={i} className="border-t border-slate-800 pt-2">
              <div className="flex items-start gap-2">
                <MathRenderer
                  html={rung.move}
                  className="answer-content flex-1 text-sm text-slate-300"
                />
                {/* **A move worth 0 shows nothing at all.** Two variations are
                    worth a single mark and still take two moves to explain —
                    moves are pedagogy, marks are accounting — so the first of
                    those earns nothing on its own. "0 marks" beside a hint
                    reads as a fault; an absent chip reads as what it is. */}
                {rung.marks !== undefined && rung.marks > 0 && (
                  <span className="shrink-0 rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-slate-400">
                    {rung.marks} mark{rung.marks === 1 ? '' : 's'}
                  </span>
                )}
              </div>
              {/* This question's own working as the move begins — the concrete
                  half. Absent where showing it would hand over an answer. */}
              {rung.shows && (
                <MathRenderer
                  html={rung.shows}
                  className="answer-content mt-1 text-sm text-slate-400"
                />
              )}
            </div>
          ))}
          {!more && (
            <div className="border-t border-slate-800 pt-2">
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

      {more && (
        <button
          onClick={reveal}
          disabled={loading}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${theme.tint} ${theme.text} hover:bg-white/10`}
        >
          <Lightbulb className="h-4 w-4" />
          {/* **"Next step (k of N)" would lie now.** N used to be the mark
              count, one rung per mark; a ladder is two to four authored moves
              and a 7-mark question no longer takes eight presses. What is left
              to say is how much help remains. */}
          {loading
            ? 'Loading…'
            : shown === 0
              ? 'Hint'
              : shown === 1
                ? 'Another hint'
                : `More help (${total - shown} left)`}
        </button>
      )}

    </div>
  );
}
