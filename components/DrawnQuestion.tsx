'use client';

import { useState, type ReactNode } from 'react';
import { Eye, Play, X } from 'lucide-react';
import { timestampToSeconds } from '@/lib/timestamp.mjs';
import MathRenderer from '@/components/MathRenderer';
import Marks from '@/components/Marks';
import Hints from '@/components/Hints';
import VideoModal from '@/components/VideoModal';
import type { QuestionWithMetadata } from '@/lib/data-loader';
import type { CourseTheme } from '@/lib/course-theme';

/**
 * A freshly drawn question, opened below the one a pupil is stuck on.
 *
 * Two surfaces show a twin this way — a guided practice page and Focus mode —
 * and full screen shows none, because there the twin takes the card and borrows
 * the presenter's own chrome. So this is what "opened below" looks like, in one
 * place, and the two cannot drift apart in what they offer.
 *
 * **What it offers is the point.** A new question and no more help than before
 * is no help at all. It arrives with the video of the paper question behind it,
 * its own hints and an answer to reveal, and it names the paper it was modelled
 * on. Three call sites once forgot the video and took the QR code and both
 * full-screen modes' video links with it, which is why `useGeneratedDraw`
 * attaches it rather than leaving it to whoever draws.
 *
 * **Not `WorkedExample`, which looks similar and is not.** That is a twin to
 * *read*, with every step and its answer, at the bottom of a hint ladder that
 * has run out. This is a twin to *attempt*: the hints it carries stop short of
 * the last step, exactly as they do on the pupil's own question.
 *
 * The foot is the caller's — `children` lands under the answer, which is where
 * the control that drew this belongs once a pupil has worked it through.
 */
interface Props {
  question: QuestionWithMetadata;
  theme: CourseTheme;
  courseId?: string;
  onClose: () => void;
  /**
   * The shell's border and ground.
   *
   * Defaults to the page's own tokens. Inside a full-screen overlay the page's
   * card colour is a shade adrift of the slate everything else there is painted
   * in, so `FocusMode` passes its own.
   */
  shell?: string;
  /** The foot of the card. "Another one" goes here. */
  children?: ReactNode;
}

export default function DrawnQuestion({
  question, theme, courseId, onClose,
  shell = 'border-border bg-card/40', children,
}: Props) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [playing, setPlaying] = useState(false);

  return (
    <div className={`card-face border rounded-xl p-4 ${shell}`}>
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
          onClick={onClose}
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
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${theme.border} ${theme.tint} ${theme.text} text-sm font-medium transition-colors hover:bg-foreground/10`}
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground text-sm font-medium hover:text-foreground hover:bg-foreground/5 transition-colors"
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
          className="mt-3 rounded-lg p-3 bg-foreground/5 answer-content text-foreground"
        />
      )}

      {/* The foot: the control that drew this, so asking for another does not
          mean scrolling back past the question you just worked. */}
      {children && <div className="mt-4 pt-3 border-t border-border/60">{children}</div>}

      {playing && question.videoId && (
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
