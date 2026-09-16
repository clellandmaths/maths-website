'use client';

import { useState } from 'react';
import { BookOpen, Loader2, X } from 'lucide-react';
import MathRenderer from '@/components/MathRenderer';
import { useGeneratedDraw } from '@/lib/use-generated-draw';
import { paperLabelOf } from '@/lib/similar-questions';
import type { QuestionWithMetadata } from '@/lib/data-loader';
import type { CourseTheme } from '@/lib/course-theme';

/**
 * One like it, worked right through — the bottom of the hint ladder.
 *
 * A pupil who has taken every hint and is still stuck has run out of things to
 * be told. What is left is to be *shown*: a question built on the same
 * variation as the one in front of them, with every step of its working and its
 * answer at the end.
 *
 * **It can show the answer because the numbers are different.** That is the
 * whole reason this is a twin rather than the question itself, and it is why
 * `Hints` can stop short of the last step while this does not.
 *
 * **Not `MoreLikeThis`, which looks similar and is not.** That control's framing
 * is *try another one*: it hands over a question to attempt and withholds the
 * final step by rendering `<Hints>`. This is a worked example to read. They
 * answer different questions and only one of them belongs under a ladder that
 * has run out.
 *
 * **It must never import `Hints`.** `MoreLikeThis` imports it, `Hints` imports
 * this, and a third edge would close the loop. The dependency runs one way:
 *
 *     Hints ──> WorkedExample ──> use-generated-draw ──await import()──> engine
 *     MoreLikeThis ──> Hints
 *
 * The engine stays off every page because `use-generated-draw` reaches it
 * through `await import()` and nothing here reaches past that.
 */
interface Props {
  /** The question a pupil is stuck on. Its variation is what gets drawn. */
  question: QuestionWithMetadata;
  theme: CourseTheme;
  courseId?: string;
  /** The printed badge, where the surface holds it rather than the HTML. */
  label?: string | null;
}

export default function WorkedExample({ question, theme, courseId, label: given }: Props) {
  const [shown, setShown] = useState<QuestionWithMetadata | null>(null);

  const label = paperLabelOf(given ?? question.label, question.question);
  const draw = useGeneratedDraw(courseId, async (engine, exclude) => {
    if (!label) return null;
    const [made] = await engine.similarTo(label, 1, engine.worksheetKeys(exclude));
    return made ?? null;
  });

  // Nothing to model a twin on. Absent rather than disabled — a control that
  // cannot do anything should not be offered.
  if (!label) return null;

  if (!shown) {
    return (
      <div className="no-print pt-1">
        <button
          onClick={async () => {
            const made = await draw.one();
            if (made) setShown(made);
          }}
          disabled={draw.state === 'drawing'}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${theme.tint} ${theme.text} hover:bg-foreground/10`}
        >
          {draw.state === 'drawing'
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <BookOpen className="h-4 w-4" />}
          {draw.state === 'drawing' ? 'Working one out…' : 'Still stuck? See one worked right through'}
        </button>
        {draw.state === 'failed' && (
          <p className="mt-1 text-xs text-muted-foreground">
            That did not work. The video solution walks through this one.
          </p>
        )}
        {draw.state === 'exhausted' && (
          <p className="mt-1 text-xs text-muted-foreground">
            There is no other question like this one to work through — the video
            solution walks through this one.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="no-print mt-2 rounded-lg border border-border bg-card/60 p-3">
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          The same method, different numbers
        </p>
        <button
          onClick={() => setShown(null)}
          className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground"
          aria-label="Close the worked example"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <MathRenderer
        html={shown.question}
        className="question-content text-sm text-foreground"
      />

      {/* Every step, the last one included. This is not the pupil's question,
          so finishing it takes nothing away from them. */}
      <ol className="mt-3 space-y-2">
        {(shown.steps ?? []).map((step, i) => (
          <li key={i} className="border-t border-border pt-2">
            <MathRenderer
              html={step}
              className="answer-content text-sm text-foreground-2"
            />
          </li>
        ))}
      </ol>

      {shown.answer && (
        <div className="mt-3 border-t border-border pt-2">
          <span className={`text-sm font-semibold ${theme.text}`}>Answer: </span>
          <MathRenderer html={shown.answer} className="inline answer-content text-sm text-foreground" />
        </div>
      )}

      <p className="mt-2 text-xs text-muted-foreground">
        Now go back and try yours — the numbers differ, the method does not.
      </p>
    </div>
  );
}
