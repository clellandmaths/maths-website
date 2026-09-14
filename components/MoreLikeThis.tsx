'use client';

import { useState } from 'react';
import { Dices, Eye, Loader2, Play, X } from 'lucide-react';
import { moreLikeThis } from '@/lib/similar-questions';
import { useGeneratedDraw } from '@/lib/use-generated-draw';
import { timestampToSeconds } from '@/lib/timestamp.mjs';
import MathRenderer from '@/components/MathRenderer';
import Marks from '@/components/Marks';
import Hints from '@/components/Hints';
import VideoModal from '@/components/VideoModal';
import type { QuestionWithMetadata } from '@/lib/data-loader';
import type { CourseTheme } from '@/lib/course-theme';

/**
 * "Another like this one" — on any surface showing a single question.
 *
 * **Past paper questions only.** It draws from the variations modelled on the
 * exact question in front of the pupil, so what comes back tests the same
 * thing. An earlier version fell back to the question's subtopic when nothing
 * was modelled on it, which made the control near-universal and wrong: someone
 * working through adding fractions pressed it and got a multiplication, because
 * `Fractions and mixed numbers` is one subtopic covering add, subtract,
 * multiply and divide. Generating across a topic is still offered, on the
 * section at the foot of a practice page that says that is what it does.
 *
 * **It opens below the question rather than replacing it.** A pupil pressing
 * this is usually stuck on the one in front of them, and taking it away loses
 * the thing they were working on. The Explorer's card swaps in place instead,
 * because there a question is something you are choosing rather than doing.
 *
 * The new question arrives with **the video of the paper question behind it**
 * and **its own hints** — a generated question carries its own skill, method
 * and worked steps, so the ladder needs nothing looked up. Without both, a
 * pupil who is stuck on the first question is handed a second one and no more
 * help than they had.
 */
interface Props {
  courseId?: string;
  theme: CourseTheme;
  /**
   * The printed badge, when the surface holds it.
   *
   * **Practice pages must pass this.** `resolveQuestions` strips the badge out
   * of the HTML before rendering and puts it on `ResolvedQuestion.paper`, so
   * scraping the html finds nothing there.
   */
  label?: string | null;
  /** The question HTML, scraped only when no label is given. */
  questionHtml?: string;
  className?: string;
}

export default function MoreLikeThis({
  courseId, theme, label, questionHtml, className = '',
}: Props) {
  const [question, setQuestion] = useState<QuestionWithMetadata | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [playing, setPlaying] = useState(false);

  const offer = moreLikeThis(courseId, { label, questionHtml });

  const draw = useGeneratedDraw(courseId, async (engine, exclude) => {
    if (!offer) return null;
    const [made] = await engine.similarTo(offer.label, 1, engine.worksheetKeys(exclude));
    return made ?? null;
  });

  // Nothing modelled on this question: render nothing. Absent, not disabled.
  if (!offer) return null;

  const busy = draw.state === 'drawing';

  const next = async () => {
    const made = await draw.one();
    if (made) { setQuestion(made); setShowAnswer(false); setPlaying(false); }
  };

  return (
    <div className={className}>
      <button
        onClick={next}
        disabled={busy}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground text-sm font-medium hover:text-foreground hover:bg-white/5 transition-colors disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Dices className="h-3.5 w-3.5" />}
        {question ? 'Another one' : 'Another like this one'}
      </button>

      {/* Running out is a fact about how many different questions this one can
          make, not a fault. */}
      {draw.state === 'exhausted' && (
        <p className="mt-2 text-sm text-muted-foreground">
          {draw.seen > 0
            ? `That is all ${draw.seen} different questions this one can make.`
            : 'No new question could be made just now.'}
        </p>
      )}
      {draw.state === 'failed' && (
        <p className="mt-2 text-sm text-amber-300/90">
          Could not make one just now. Try again in a moment.
        </p>
      )}

      {question && (
        <div key={question.uid} className="card-face mt-4 border border-border rounded-xl p-4 bg-card/40">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`font-mono text-xs px-1.5 py-0.5 rounded ${theme.tint} ${theme.text}`}>
              New question
            </span>
            {/* The paper behind it, not its own label — a generated question's
                label is the skill it tests, which tells a pupil nothing about
                where it came from. */}
            {question.basedOn?.[question.parentIndex ?? 0] && (
              <span className="font-mono text-xs text-muted-foreground">
                based on {question.basedOn[question.parentIndex ?? 0]}
              </span>
            )}
            <Marks marks={question.marks} theme={theme} />
            <button
              onClick={() => { setQuestion(null); setShowAnswer(false); draw.reset(); }}
              className="ml-auto p-1 text-muted-dim hover:text-foreground rounded transition-colors"
              title="Put this away"
              aria-label="Put this away"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <MathRenderer html={question.question} className="question-content text-foreground" />

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {!showAnswer && (
              <button
                onClick={() => setShowAnswer(true)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${theme.border} ${theme.tint} ${theme.text} text-sm font-medium transition-colors hover:bg-white/10`}
              >
                <Eye className="h-3.5 w-3.5" />
                Show answer
              </button>
            )}

            {/* **The method, as a button rather than a sentence.** A generated
                question has no filmed solution of its own; the paper question
                behind it does, and watching that worked is the tutorial — same
                method, different numbers. The wording says so, because a pupil
                checking their own answer against a video of other numbers
                concludes they are wrong. */}
            {question.videoId && (
              <button
                onClick={() => setPlaying(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground text-sm font-medium hover:text-foreground hover:bg-white/5 transition-colors"
              >
                <Play className="h-3.5 w-3.5" />
                Watch the method
              </button>
            )}

            {/* A generated question carries its own skill, method and worked
                steps, so the ladder needs nothing looked up. */}
            <Hints question={question} theme={theme} courseId={courseId} className="w-full" />
          </div>

          {showAnswer && (
            <MathRenderer
              html={question.answer}
              className="mt-3 rounded-lg p-3 bg-white/5 answer-content text-foreground"
            />
          )}
        </div>
      )}

      {playing && question?.videoId && (
        <VideoModal
          isOpen
          videoId={question.videoId}
          timestamp={timestampToSeconds(question.timestamp)}
          title={question.videoOf ? `Worked example — ${question.videoOf}` : 'Worked example'}
          onClose={() => setPlaying(false)}
        />
      )}
    </div>
  );
}
