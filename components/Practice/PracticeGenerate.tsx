'use client';

import { useRef, useState } from 'react';
import { Dices, Eye, Loader2, ArrowRight } from 'lucide-react';
import { useGeneratedDraw } from '@/lib/use-generated-draw';
import MathRenderer from '@/components/MathRenderer';
import Marks from '@/components/Marks';
import type { QuestionWithMetadata } from '@/lib/data-loader';
import type { CourseTheme } from '@/lib/course-theme';

/**
 * What a practice topic offers once its questions run out.
 *
 * A National 5 practice topic holds about thirteen questions. A pupil who works
 * through them has finished the topic — not because they have learned it, but
 * because the page has nothing else. **This is the only place on the site where
 * running out is the page's own failure**, and the generator has been able to
 * fix it since before it shipped.
 *
 * Two audiences, one section:
 *
 *   a pupil   presses *Another question* and gets one, in place, with an answer
 *             to reveal — the same shape as the questions above it, so there is
 *             nothing new to learn
 *   a teacher presses *Add 10 to a worksheet* and gets a printable sheet
 *
 * **Absent, not disabled, when there is nothing to draw**: on the other four
 * courses, and on a topic the exam does not set on its own (Rounding). A dead
 * button on a page that promises more questions is worse than no button.
 */
interface Props {
  courseId: string;
  /** Which of the website's subtopics this topic covers. Empty renders nothing. */
  subtopics: string[];
  topicName: string;
  theme: CourseTheme;
}

export default function PracticeGenerate({ courseId, subtopics, topicName, theme }: Props) {
  const [question, setQuestion] = useState<QuestionWithMetadata | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [added, setAdded] = useState(0);

  // The hook attaches the video of the paper question behind whatever it draws,
  // so this only has to say what to draw.
  const draw = useGeneratedDraw(courseId, async (engine, exclude) => {
    const [made] = await engine.generateForSubtopics(subtopics, 1, engine.worksheetKeys(exclude));
    return made ?? null;
  });

  // Nothing to offer: say nothing. See the note above.
  if (courseId !== 'n5' || subtopics.length === 0) return null;

  const busy = draw.state === 'drawing';

  const next = async () => {
    const made = await draw.one();
    if (made) { setQuestion(made); setShowAnswer(false); }
  };

  const addSome = async (want: number) => {
    const n = await draw.toSheet(want);
    setAdded(a => a + n);
  };

  return (
    <section className="mt-10 pt-8 border-t border-border">
      <p className={`font-mono text-xs uppercase tracking-widest ${theme.text} mb-2`}>
        Keep practising
      </p>
      <h2 className="font-display text-xl font-bold tracking-tight mb-2">
        More {topicName.toLowerCase()} questions
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        New questions, modelled on past paper questions and checked against their
        marking instructions. Not reprints — you have not seen these before.
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={next}
          disabled={busy}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${theme.border} ${theme.tint} ${theme.text} text-sm font-medium transition-colors hover:bg-foreground/10 disabled:opacity-60`}
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Dices className="h-3.5 w-3.5" />}
          {question ? 'Another question' : 'Give me a question'}
        </button>
        <button
          onClick={() => addSome(10)}
          disabled={busy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground text-sm font-medium hover:text-foreground hover:bg-foreground/5 transition-colors disabled:opacity-60"
        >
          Add 10 to a worksheet
        </button>
        {added > 0 && (
          <a
            href={`/explorer?c=${courseId}`}
            className={`inline-flex items-center gap-1.5 text-sm font-medium ${theme.text} hover:opacity-80`}
          >
            {added} on your worksheet
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {/* Running out is a fact about how many different questions this topic can
          make, not a fault. A pupil who has taken all of them has been served. */}
      {draw.state === 'exhausted' && (
        <p className="mt-3 text-sm text-muted-foreground">
          {draw.seen > 0
            ? `That is all ${draw.seen} different questions this topic can make just now.`
            : 'No new question could be made for this topic just now.'}
        </p>
      )}
      {draw.state === 'failed' && (
        <p className="mt-3 text-sm text-amber-300/90">
          Could not make a question just now. Try again in a moment.
        </p>
      )}

      {question && (
        <div key={question.uid} className="card-face mt-5 border border-border rounded-xl p-5 bg-card/40">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`font-mono text-xs px-1.5 py-0.5 rounded ${theme.tint} ${theme.text}`}>
              New question
            </span>
            {/* Which paper it is modelled on. A generated question's own label
                is the skill it tests, so showing that instead leaves a pupil
                unable to tell what it came from. */}
            {question.basedOn?.[question.parentIndex ?? 0] && (
              <span className="font-mono text-xs text-muted-foreground">
                based on {question.basedOn[question.parentIndex ?? 0]}
              </span>
            )}
            <Marks marks={question.marks} theme={theme} />
          </div>

          <MathRenderer html={question.question} className="question-content text-foreground" />

          <div className="flex flex-wrap items-center gap-2 mt-4">
            {!showAnswer && (
              <button
                onClick={() => setShowAnswer(true)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${theme.border} ${theme.tint} ${theme.text} text-sm font-medium transition-colors hover:bg-foreground/10`}
              >
                <Eye className="h-3.5 w-3.5" />
                Show answer
              </button>
            )}
            {/* The video is of the paper question, worked with different
                numbers. A pupil not told that concludes they are wrong. */}
            {question.videoOf && (
              <span className="text-xs text-muted-foreground">
                the video for {question.videoOf} shows this method
              </span>
            )}
          </div>

          {showAnswer && (
            <MathRenderer
              html={question.answer}
              className="mt-3 rounded-lg p-3 bg-foreground/5 answer-content text-foreground"
            />
          )}
        </div>
      )}
    </section>
  );
}
