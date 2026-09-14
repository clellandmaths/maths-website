'use client';

import { useState } from 'react';
import { Dices, Eye, Loader2, X } from 'lucide-react';
import { moreLikeThis } from '@/lib/similar-questions';
import { allSubtopics } from '@/lib/n5-topics';
import { useGeneratedDraw } from '@/lib/use-generated-draw';
import MathRenderer from '@/components/MathRenderer';
import Marks from '@/components/Marks';
import type { QuestionWithMetadata } from '@/lib/data-loader';
import type { CourseTheme } from '@/lib/course-theme';

/**
 * "Another one like this" — on any surface that shows a single question.
 *
 * Two tiers, and **the wording says which one fired**. `moreLikeThis()` decides
 * from the question's own data, without loading the engine to find out:
 *
 *   *Another like this one*  a variation is modelled on this exact past paper
 *                            question
 *   *More on Simplifying surds*  there is not, so it falls back to the topic
 *                            the question files under
 *
 * Tier 2 is what makes this near-universal for National 5 — all 57 subtopics
 * have an exam-tier variation — but it can hand back something a pupil would
 * not call "like this": `Sector area` spans plain sectors, segments and a
 * polygon in a circle. The heading is the honest part and must not be softened.
 *
 * **It opens below the question rather than replacing it.** A pupil pressing
 * this is usually stuck on the one in front of them; taking it away to show a
 * different one loses the thing they were working on. The Explorer's card
 * swaps in place instead, because there the question is a thing you are
 * choosing rather than a thing you are doing.
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
  /** The question's topic tags, for the tier-2 fallback. */
  subtopics?: readonly string[];
  className?: string;
}

export default function MoreLikeThis({
  courseId, theme, label, questionHtml, subtopics, className = '',
}: Props) {
  const [question, setQuestion] = useState<QuestionWithMetadata | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const offer = moreLikeThis(courseId, { label, questionHtml, subtopics }, allSubtopics);

  const draw = useGeneratedDraw(courseId, async (engine, exclude) => {
    if (!offer) return null;
    const keys = engine.worksheetKeys(exclude);
    const [made] = offer.tier === 'question'
      ? await engine.similarTo(offer.label, 1, keys)
      : await engine.generateForSubtopics([offer.subtopic], 1, keys);
    return made ?? null;
  });

  // Nothing to offer: render nothing. Absent, not disabled — the rule this
  // whole family of controls follows.
  if (!offer) return null;

  const busy = draw.state === 'drawing';

  const next = async () => {
    const made = await draw.one();
    if (made) { setQuestion(made); setShowAnswer(false); }
  };

  return (
    <div className={className}>
      <button
        onClick={next}
        disabled={busy}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground text-sm font-medium hover:text-foreground hover:bg-white/5 transition-colors disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Dices className="h-3.5 w-3.5" />}
        {question ? 'Another one' : offer.heading}
      </button>

      {/* Running out is a fact about how many different questions this can
          make, not a fault. */}
      {draw.state === 'exhausted' && (
        <p className="mt-2 text-sm text-muted-foreground">
          {draw.seen > 0
            ? `That is all ${draw.seen} different questions this can make just now.`
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
              className="mt-3 rounded-lg p-3 bg-white/5 answer-content text-foreground"
            />
          )}
        </div>
      )}
    </div>
  );
}
