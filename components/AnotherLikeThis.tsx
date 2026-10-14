'use client';

import { useEffect, useState } from 'react';
import { Dices, Loader2 } from 'lucide-react';
import { moreLikeThis } from '@/lib/similar-questions';
import { useGeneratedDraw } from '@/lib/use-generated-draw';
import { useSlow } from '@/lib/use-slow';
import type { QuestionWithMetadata } from '@/lib/data-loader';

/**
 * The button that draws one more question like the one on screen.
 *
 * **Only the button.** Where the drawn question goes is the surface's business
 * and the two surfaces disagree: guided practice opens it *below* the question,
 * because a pupil is usually stuck on the one in front of them and taking it
 * away loses their place; full screen *swaps it in*, because there is one card
 * and no below. Pulling the draw out of both means they cannot drift apart in
 * wording, in what counts as running out, or in the exclude set.
 *
 * It renders nothing when there is nothing behind the question — absent rather
 * than disabled, like everything else the generator backs.
 *
 * **No theme prop.** The two callers style their buttons differently (a quiet
 * outline on the page, a full-width slate block in full screen) and a `variant`
 * union would be two callers' CSS living in a third file.
 */
interface Props {
  courseId?: string;
  /** The question a twin is modelled on. A generated one falls back to its parent. */
  question: QuestionWithMetadata;
  /**
   * The printed badge, when the surface holds it rather than the HTML.
   *
   * **Guided practice must pass this.** `resolveQuestions` strips the badge out
   * before rendering and puts it on `ResolvedQuestion.paper`, so scraping the
   * HTML finds nothing there.
   */
  label?: string | null;
  /** True once a drawn question is on screen: the wording changes, not the act. */
  showing?: boolean;
  /**
   * What this surface has already drawn, on top of what the hook remembers.
   *
   * **This is what lets the button move.** The surfaces that open a twin below
   * the question move the button to the foot of it, so a pupil who has just
   * worked one through does not have to scroll back past it to ask for another.
   * A button rendered somewhere else is a new component with an empty memory,
   * and `useGeneratedDraw` keeps what it has drawn in a ref — so without the
   * surface holding the list too, the first press after the move hands back
   * something already seen. Measured once on a six-deep pool with no exclude
   * set at all: six byte-identical repeats.
   */
  alsoExclude?: readonly QuestionWithMetadata[];
  /**
   * Where the drawn question goes. **It may take a moment** (a surface can
   * fetch the card it shows the question in): the button stays busy until it
   * is done, so there is never a gap with neither button nor question.
   */
  onDrawn: (q: QuestionWithMetadata) => void | Promise<void>;
  className?: string;
  /** Where the "that is all of them" line goes. */
  noticeClassName?: string;
}

const NOTHING: readonly QuestionWithMetadata[] = [];

/**
 * "Start again" (the owner, 2026-10-13): once a card has given every question it has, a pupil can go round again.
 * The questions this page had drawn from that card are forgotten, by uid, so they can come back. Kept here and not in
 * the component because the button is a new one each time it moves below a drawn question (or full screen moves to
 * the next question), and a forgetting that lived in it would be forgotten itself. Questions on the sheet stay off.
 */
const FORGOTTEN = new Map<string, Set<string>>();

export default function AnotherLikeThis({
  courseId, question, label, showing = false, alsoExclude = NOTHING, onDrawn,
  className = '', noticeClassName = 'mt-2 text-sm text-muted-foreground',
}: Props) {
  const offer = moreLikeThis(courseId, {
    label,
    questionHtml: question.question,
    basedOn: question.basedOn,
    parentIndex: question.parentIndex,
  });

  const forgotKey = `${courseId}|${offer?.label}`;
  const notForgotten = (qs: readonly QuestionWithMetadata[]) => {
    const gone = FORGOTTEN.get(forgotKey);
    return gone ? qs.filter(q => !q.uid || !gone.has(q.uid)) : qs;
  };

  const draw = useGeneratedDraw(courseId, async (engine, exclude) => {
    if (!offer) return null;
    const [made] = await engine.similarTo(
      offer.label, 1, engine.worksheetKeys([...exclude, ...notForgotten(alsoExclude)]), courseId);
    return made ?? null;
  });

  // Ready before the press: the engine in idle time once the page has loaded
  // (`lib/warm-generator.ts`, the owner 2026-10-06). Loaded lazily, so it costs
  // the page only this line.
  const card = offer?.label;
  useEffect(() => {
    if (card) import('@/lib/warm-generator').then(w => w.warmGenerator(courseId, card)).catch(() => {});
  }, [courseId, card]);

  // **Busy until the question is in place** (the owner, 2026-10-14, card 7 of the
  // loading-states sheet: "Yes"). On a paper page the button went as soon as
  // the question was drawn, and the card it opens in loaded after: half a
  // second with neither on screen. `placing` covers that wait. And a press
  // that runs past a second says what it is doing (a press straight after the
  // page opens can take 2 to 4 s on an older phone).
  const [placing, setPlacing] = useState(false);
  const busy = draw.state === 'drawing' || placing;
  const slow = useSlow(busy);

  // Nothing modelled on this question: render nothing.
  if (!offer) return null;
  // Had one already: drawn by this button, or by the page before this button was mounted. Below a drawn question the
  // button is a new one with a count of 0, so running out read "could not be made just now" where it meant "you have
  // had them all" (the audit, 2026-10-12, the owner "Yes").
  const hadOne = draw.seen > 0 || notForgotten(alsoExclude).some(q => q.basedOn?.includes(offer.label));

  const startAgain = () => {
    const gone = FORGOTTEN.get(forgotKey) ?? new Set<string>();
    for (const q of alsoExclude) if (q.uid && q.basedOn?.includes(offer.label)) gone.add(q.uid);
    FORGOTTEN.set(forgotKey, gone);
    draw.restart();
  };

  return (
    <>
      <button
        onClick={async () => {
          const made = await draw.one();
          if (!made) return;
          setPlacing(true);
          try { await onDrawn(made); } finally { setPlacing(false); }
        }}
        disabled={busy}
        className={className}
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Dices className="h-3.5 w-3.5" />}
        {slow ? 'Making a new question…' : showing ? 'Another one' : 'Another like this one'}
      </button>

      {/* Running out is a fact about how many different questions this one can
          make, not a fault. **No number** (the owner, 2026-10-06): `hadOne`
          counts what this page has drawn this visit, not what the card can make,
          so "That is all 3" could name a count the card does not have.
          In a status region that is always there, so a screen reader hears the
          line when it appears (card 10). `contents`, so the line is laid out
          as it was, a child of the caller's row (full screen centres it). */}
      <div role="status" className="contents">
        {draw.state === 'exhausted' && (
          <p className={noticeClassName}>
            {hadOne
              ? <>No more new questions like this one: you have had them all.{' '}
                  <button type="button" onClick={startAgain} className="underline underline-offset-2 font-medium hover:text-foreground">
                    Start again
                  </button></>
              : 'No new question could be made just now.'}
          </p>
        )}
        {draw.state === 'failed' && (
          <p className={noticeClassName}>Could not make one just now. Try again in a moment.</p>
        )}
      </div>
    </>
  );
}
