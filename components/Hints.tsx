'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Lightbulb, X } from 'lucide-react';
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
const HintPanel = dynamic(() => import('@/components/HintPanel'), { ssr: false });
import { ladderLabel, courseHasHints } from '@/lib/similar-questions';
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
  /**
   * The button's own styling, so it matches the row it sits in.
   *
   * Measured on a 390px phone before this existed: in full screen the Hint
   * button was 32px tall and 73px wide beside four 48px full-width blocks, and
   * in Focus it was 32px beside four 36px ones. It was the smallest, narrowest
   * control in both rows — and it is the one a stuck pupil is looking for. The
   * cause was mechanical: surfaces passed `className="w-full"`, which lands on
   * the wrapper below, while the button itself is `inline-flex` and never
   * stretched.
   *
   * A caller's CSS rather than a `variant` union here, because three surfaces
   * have three different button geometries and none of them belongs in this
   * file.
   */
  buttonClassName?: string;
  /**
   * How far away the reader is.
   *
   * `page` is a question you are leaning over; `stage` is full screen, where
   * the question is set at 24px for reading at arm's length. The ladder was
   * 14px on both — the smallest text on screen, explaining the largest.
   */
  size?: 'page' | 'stage';
}

/** One press of the ladder, once the two prose lines are past. */
export interface Rung {
  /** What to do next. */
  move: string;
  /** What it is worth. **0 prints no chip at all**, never "0 marks". */
  marks?: number;
  /** This question's own working as the move begins, where any is safe to show. */
  shows?: string | null;
}

export interface Staged {
  skill: string;
  method: string;
  rungs: Rung[];
  /** True when a final step was withheld because it lands the answer. */
  heldBack: boolean;
}

export default function Hints({
  question, theme, courseId, label: given, className = '',
  buttonClassName, size = 'page',
}: Props) {
  /* 16px on a page, 18px in full screen. It was 14px on both, against a 16px
     question on a practice page and a 24px one in full screen — the help was
     the smallest thing on screen. A hint should never be harder to read than
     the question it explains. */
  const body = size === 'stage' ? 'text-lg' : 'text-base';
  const aside = size === 'stage' ? 'text-base' : 'text-sm';
  const [shown, setShown] = useState(0);
  /**
   * Whether the ladder is on screen.
   *
   * **Separate from `shown`, and that separation is the point.** `shown` is how
   * much of the ladder has been earned and it never goes down; `open` is
   * whether you are looking at it. Close the overlay and press Hint again and
   * you get back everything you had revealed, because closing is not undoing.
   */
  const [open, setOpen] = useState(false);
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
   *
   * **`ladderLabel`, not `paperLabelOf`.** Being a past paper question is not
   * the same as having a ladder: we hold 22 questions from 2021 and no
   * transcribed marking instructions for that year, so `PLAN_OF` has nothing
   * for any of them. Asking the looser question rendered the button, found
   * nothing on the press, and left the overlay empty with a `More help` footer
   * that never delivered any. The note under the card says where the help
   * actually is, and it reads the same function.
   */
  const label = ladderLabel(given ?? question.label, question.question);
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

  /** Open it, and earn the first rung if nothing has been earned yet. */
  const openLadder = async () => {
    setOpen(true);
    if (shown === 0) await reveal();
  };

  return (
    <>
      {/* The control stays in the row of buttons whatever the ladder is doing.
          It used to disappear once the ladder was spent, which is how a walk
          across a practice page ended up pressing the NEXT question's button. */}
      <div className={`no-print ${className}`}>
        <button
          onClick={openLadder}
          disabled={loading}
          className={buttonClassName
            ?? `inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${theme.tint} ${theme.text} hover:bg-white/10`}
        >
          <Lightbulb className="h-4 w-4" />
          {loading ? 'Loading…' : 'Hint'}
        </button>
      </div>

      {/* **The ladder is an overlay, not a panel on the card.**

          Inline, every press grew the card under the reader's finger — two
          prose lines, up to four moves with their working, then a whole worked
          question with every step and its answer. In full screen there was
          nowhere for that to go: the row of controls alone is 250px of an 844px
          phone. It is the same idiom as the formulae sheet and the data
          booklet, so it is not a new thing to learn.

          **The question comes with it.** A hint is about *this* question, and
          reading "halve the coefficient of x" with no x on screen means
          memorising the question first. That is the whole condition on which
          this is better than the panel it replaces.

          Above the full-screen modes, which are z-50. */}
      {open && (
        <HintPanel
          question={question}
          theme={theme}
          courseId={courseId}
          given={given}
          staged={staged}
          shown={shown}
          total={total}
          more={more}
          loading={loading}
          own={!!own}
          body={body}
          aside={aside}
          onReveal={reveal}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
