'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { moreLikeThis } from '@/lib/similar-questions';
import AnotherLikeThis from '@/components/AnotherLikeThis';
import type { QuestionWithMetadata } from '@/lib/data-loader';
import type { CourseTheme } from '@/lib/course-theme';

/**
 * The card is lazy; the button is not.
 *
 * Nothing is drawn until somebody presses, so the card and everything it
 * renders is dead weight on every page carrying this control until then. The
 * button has to be there on arrival, so it stays eager. Measured: moving the
 * card out took the practice templates back under their budget.
 */
const DrawnQuestion = dynamic(() => import('@/components/DrawnQuestion'), { ssr: false });

/**
 * "Another like this one", opening below the question rather than replacing it.
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
 * **Below, not instead.** A pupil pressing this is usually stuck on the one in
 * front of them, and taking it away loses the thing they were working on. Full
 * screen swaps in place instead, because there is one card there and no below —
 * so it offers its own way back rather than this one.
 *
 * **Two surfaces, one component.** A guided practice page renders it directly;
 * Focus mode renders it per row through `next/dynamic` and pays nothing for it
 * until a pupil asks. They differ by two class names, which is not enough to
 * justify a second copy of the behaviour.
 *
 * **The button follows the reading.** Once a question is drawn the button moves
 * to the foot of it. It used to stay above the card, so asking for a second one
 * meant scrolling back past the question and its answer to reach a control you
 * had already used. Moving it costs `AnotherLikeThis` its memory of what it has
 * drawn — a button in a new place is a new component — so the list lives here
 * and goes back in as `alsoExclude`.
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
  /**
   * Which surface this is on, and so how it is painted.
   *
   * **A name rather than three class strings**, which is not the usual way round
   * here — a caller's CSS normally belongs to the caller. It is a name because
   * the strings would then be *eager*: `FocusMode` reaches this component
   * through `next/dynamic`, so anything passed in as a prop sits in the
   * course-page bundle whether or not a pupil ever presses the button, and
   * `check:budget` measured it as the last kilobyte over the line.
   */
  tone?: 'page' | 'overlay';
  /**
   * Twins drawn by the *other* copies of this control on the same page.
   *
   * Focus mode is a whole paper at once, each question carrying its own. With
   * no list between them, working down the page hands the same twin out twice
   * on two different questions.
   */
  alsoExclude?: readonly QuestionWithMetadata[];
  onDrawn?: (q: QuestionWithMetadata) => void;
}

const TONES = {
  page: {
    shell: 'border-border bg-card/40',
    button: 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground text-sm font-medium hover:text-foreground hover:bg-foreground/5 transition-colors disabled:opacity-60',
    notice: 'mt-2 text-sm text-muted-foreground',
  },
  overlay: {
    shell: 'border-border bg-card/60',
    button: 'inline-flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted-hover text-muted-foreground rounded-lg text-sm font-medium transition-colors disabled:opacity-60',
    notice: 'mt-2 text-sm text-muted-foreground',
  },
} as const;

export default function MoreLikeThis({
  courseId, theme, label, questionHtml, className = '',
  tone = 'page', alsoExclude, onDrawn,
}: Props) {
  const paint = TONES[tone];
  const [question, setQuestion] = useState<QuestionWithMetadata | null>(null);
  const [drawn, setDrawn] = useState<QuestionWithMetadata[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  // Bring what was just drawn into view. Pressing the button at the foot of a
  // card replaces the card ABOVE it, so without this a pupil is left looking at
  // the button they pressed with the new question off the top of the screen.
  // `nearest` scrolls the least that makes it visible, and does nothing at all
  // when it already is.
  useEffect(() => {
    if (!question) return;
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [question]);

  // Nothing modelled on this question: render nothing, not an empty box with a
  // margin on it. Absent, not disabled.
  if (!moreLikeThis(courseId, { label, questionHtml })) return null;

  /** Enough of the question on screen for the draw to model a twin on. */
  const source = { question: questionHtml ?? '' } as QuestionWithMetadata;

  const button = (
    <AnotherLikeThis
      courseId={courseId}
      question={source}
      label={label}
      showing={!!question}
      alsoExclude={alsoExclude ? [...drawn, ...alsoExclude] : drawn}
      onDrawn={(made) => { setQuestion(made); setDrawn(d => [...d, made]); onDrawn?.(made); }}
      className={paint.button}
      noticeClassName={paint.notice}
    />
  );

  return (
    <div className={className}>
      {!question && button}

      {question && (
        <div ref={cardRef}>
          {/* Remounted per question, which is what resets its answer and its
              video without this component tracking either. */}
          <DrawnQuestion
            key={question.uid}
            question={question}
            theme={theme}
            courseId={courseId}
            onClose={() => setQuestion(null)}
            shell={paint.shell}
          >
            {button}
          </DrawnQuestion>
        </div>
      )}
    </div>
  );
}
