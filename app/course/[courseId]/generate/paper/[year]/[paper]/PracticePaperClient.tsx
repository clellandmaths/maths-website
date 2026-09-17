'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Loader2, Printer, Share2, Dices, ArrowLeft, ClipboardCheck } from 'lucide-react';
import dynamic from 'next/dynamic';
import { byPaperLabel, withParentVideo } from '@/lib/similar-questions';
import { printWorksheet } from '@/lib/print-worksheet';
import MathRenderer from '@/components/MathRenderer';
import Marks from '@/components/Marks';
import type { QuestionWithMetadata } from '@/lib/data-loader';
import type { CourseTheme } from '@/lib/course-theme';
import type { PaperScheme } from '@/lib/generator/generators/paper-markscheme';

/**
 * The marking instructions, as their own printed document.
 *
 * Behind a boundary because nobody who only prints the paper should pay for
 * it, and because this page is on the course templates' JS budget.
 */
const MarkschemeSheet = dynamic(() => import('@/components/Explorer/MarkschemeSheet'), { ssr: false });

interface PlanRow { label: string | null; number: string; marks: number }

interface Props {
  courseId: string;
  courseName: string;
  year: string;
  paperNumber: number;
  plan: PlanRow[];
  theme: CourseTheme;
}

/**
 * Draw one new question for each question of a real paper.
 *
 * Every one of the 328 National 5 past paper questions has at least one
 * exam-tier variation modelled on it — `scripts/check-variation-reach.mjs`
 * fails the build if that stops being true — so a whole paper can be cloned.
 *
 * **Sequentially, with a yield between draws.** The generator's random stream
 * is module-level, so concurrent draws steal each other's numbers: a measured
 * ten-question `Promise.all` changed all ten and two concurrent runs did not
 * agree. The `setTimeout(0)` hands the main thread back so the counter paints —
 * at 12 to 19 questions a frozen page reads as broken.
 *
 * **Marks are reported, not promised.** `similarTo` has no marks filter and the
 * marks that ship come from the variation's own step marks rather than a
 * declared total, so a clone can be worth a mark more or less than its model.
 * Measured across the archive, a candidate matches its model for 319 of 328.
 * Showing both totals is honest; claiming they are equal is not.
 */
export default function PracticePaperClient({
  courseId, courseName, year, paperNumber, plan, theme,
}: Props) {
  const [made, setMade] = useState<(QuestionWithMetadata | null)[]>([]);
  const [done, setDone] = useState(0);
  const [failed, setFailed] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  /**
   * Where the reader came from, and a way back to it.
   *
   * **The breadcrumb is not a way back, and reading it as one is what went
   * wrong.** It says where this paper *sits* — National 5 Maths / 2024 Paper 1
   * / Practice paper — which is true and useful. But most people arrive from
   * the archive on the course page, never having opened 2024 Paper 1, and the
   * nearest crumb to hand sends them to exactly that unvisited page. The one
   * crumb that does go back is faint grey monospace at the top of the screen.
   *
   * So the two links in carry `?from=`, and this turns it into a control. Read
   * after mount rather than in a lazy initialiser: this is a static export, the
   * page is built with no query string in existence, and deciding during the
   * first render is the hydration mismatch `/explorer` was just fixed for.
   *
   * No `from` means a shared link or a bookmark, and the course archive is the
   * right place to send those: it is where the paper came from and where
   * another one can be had.
   */
  const [backTo, setBackTo] = useState<{ href: string; label: string }>({
    href: `/course/${courseId}`, label: courseName,
  });

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('from') !== 'paper') return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBackTo({
      href: `/course/${courseId}/papers/${year}/paper-${paperNumber}`,
      label: `${year} Paper ${paperNumber}`,
    });
  }, [courseId, year, paperNumber]);
  /**
   * The markscheme, printed exactly the way the Explorer's checkout prints it.
   *
   * **A separate document, on purpose.** One press, one dialog, one file — so
   * the paper can be handed to a class without the answers stapled behind it.
   * That is the checkout's reasoning and it applies here unchanged.
   *
   * `MarkschemeSheet` already reads both sources: the published instructions
   * for a past paper question, and a generated question's own worked steps and
   * their mark values. Every question on this page is generated, so it is the
   * second branch that does the work — the answers are for the numbers actually
   * printed, which regenerate from the seed in the sheet.
   *
   * `PAPER_MARKSCHEME` is loaded anyway rather than passing an empty table. It
   * is 189KB, and on a page of nothing but generated questions it will not be
   * read — but it is imported at the press, never on load, and a page that
   * silently lacked a scheme if a real question ever appeared here would be a
   * worse trade than one lazy fetch a teacher asked for.
   */
  const [schemes, setSchemes] = useState<Record<string, PaperScheme> | null>(null);
  const [markschemeBusy, setMarkschemeBusy] = useState(false);

  const printMarkscheme = async () => {
    if (markschemeBusy || !drawn.length) return;
    setMarkschemeBusy(true);
    try {
      const { PAPER_MARKSCHEME } = await import('@/lib/generator/generators/paper-markscheme');
      setSchemes(PAPER_MARKSCHEME);
      document.body.dataset.print = 'markscheme';
      // One frame for the portal to mount before the dialog reads the page.
      // Raced, never awaited alone: a backgrounded tab fires no frame, and the
      // same unguarded wait once turned a Print button into one that did
      // nothing at all.
      await Promise.race([
        new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r()))),
        new Promise<void>(r => setTimeout(r, 300)),
      ]);
      await printWorksheet();
    } finally {
      delete document.body.dataset.print;
      setMarkschemeBusy(false);
    }
  };

  /** Bumped to draw the whole paper again, with new numbers throughout. */
  const [round, setRound] = useState(0);
  const again = () => { setMade([]); setDone(0); setFailed(false); setRound(n => n + 1); };

  const total = plan.length;
  const originalMarks = plan.reduce((a, r) => a + r.marks, 0);
  const drawing = done < total && !failed;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { similarTo, worksheetKeys } = await import('@/lib/generated-question');
        const { getAllN5Questions } = await import('@/lib/data-loader');
        const byLabel = byPaperLabel(await getAllN5Questions());

        const out: (QuestionWithMetadata | null)[] = [];
        for (const row of plan) {
          if (cancelled) return;
          let q: QuestionWithMetadata | null = null;
          if (row.label) {
            // The exclude set accumulates across the paper, so two questions
            // backed by the same variation get different numbers rather than
            // the same question twice.
            const [raw] = await similarTo(row.label, 1, worksheetKeys(out.filter(Boolean) as QuestionWithMetadata[]));
            if (raw) q = withParentVideo(raw, byLabel);
          }
          out.push(q);
          if (cancelled) return;
          setMade([...out]);
          setDone(out.length);
          // Give the browser the thread back between draws.
          await new Promise(r => setTimeout(r, 0));
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => { cancelled = true; };
    // `plan` is a build-time constant for this route, so the only thing that
    // should start a fresh draw is someone asking for another paper.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  const drawn = made.filter(Boolean) as QuestionWithMetadata[];
  const missing = made.filter(q => !q).length;
  const newMarks = drawn.reduce((a, q) => a + (q.marks ?? []).reduce((x, y) => x + y, 0), 0);

  /**
   * Open it as a worksheet, with everything switched on.
   *
   * **Not the default locked handout.** A locked sheet withholds the answers,
   * the hints and the video, which is right when a teacher is setting homework
   * and chooses what to give. Nobody chose anything here: a pupil pressed
   * "generate a practice paper" for themselves, and handing them a paper with
   * the help stripped out is the one outcome that helps nobody. So all four
   * flags go on — answers, hints, the worked-example video and its QR code.
   */
  const share = () => {
    const origin = window.location.origin;
    import('@/lib/worksheet-share').then(({ shareLinks }) => {
      const { locked } = shareLinks(
        origin, courseId, drawn,
        `Practice paper — modelled on ${courseName} ${year} Paper ${paperNumber}`,
        { answers: true, hints: true, video: true, qrCodes: true },
      );
      window.location.href = locked;
    });
  };

  return (
    <>
      <div className="mb-8 no-print">
        <p className={`font-mono text-xs uppercase tracking-widest ${theme.text} mb-2`}>
          {courseName} · practice paper
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Modelled on {year} Paper {paperNumber}
        </h1>
        <p className="text-muted-foreground mb-2">
          One new question for each question of the real paper, in the same order.
          Every one is modelled on the question it replaces and checked against
          that question&apos;s marking instructions — so this is new work, not a reprint.
        </p>

        {/* Both totals, side by side. See the note on marks above. */}
        <p className="font-mono text-xs text-muted-foreground">
          {drawing
            ? `Drawing question ${Math.min(done + 1, total)} of ${total}…`
            : `${drawn.length} question${drawn.length === 1 ? '' : 's'} · ${newMarks} marks (the original is ${originalMarks})`}
        </p>

        {missing > 0 && !drawing && (
          <p className="mt-3 text-sm text-amber-800 dark:text-amber-300/90">
            {missing} question{missing === 1 ? '' : 's'} could not be generated. They are
            named below, with a link to the original.
          </p>
        )}
        {failed && (
          <p className="mt-3 text-sm text-amber-800 dark:text-amber-300/90">
            Something went wrong drawing this paper. Reload to try again.
          </p>
        )}

        {/* **A way back, in the row where the other actions are.**
            Not in the breadcrumb: that describes where the paper sits, and the
            crumb nearest to hand is the original paper, which most readers
            never opened. This one names the place they actually left. */}
        <Link
          href={backTo.href}
          className="inline-flex items-center gap-2 mt-5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground text-sm font-medium hover:text-foreground hover:bg-foreground/5 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to {backTo.label}
        </Link>

        {!drawing && drawn.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-5">
            <button
              onClick={() => printWorksheet(sheetRef.current ?? document)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${theme.border} ${theme.tint} ${theme.text} text-sm font-medium hover:bg-foreground/10 transition-colors`}
            >
              <Printer className="h-3.5 w-3.5" />
              Print / Save PDF
            </button>
            {/* **Its own document, and its own press.** Same reasoning as the
                Explorer's checkout, and the same word on the button: one
                click, one dialog, one file, so the paper goes to a class
                without the answers behind it. */}
            <button
              onClick={printMarkscheme}
              disabled={markschemeBusy}
              title="Print the marking instructions for this paper"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground text-sm font-medium hover:text-foreground hover:bg-foreground/5 disabled:opacity-60 transition-colors"
            >
              <ClipboardCheck className="h-3.5 w-3.5" />
              {markschemeBusy ? 'Preparing…' : 'Markscheme'}
            </button>
            <button
              onClick={share}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground text-sm font-medium hover:text-foreground hover:bg-foreground/5 transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" />
              Open as a worksheet
            </button>
            {/* **A whole new set, rather than "add all to my sheet".** The
                sheet is a teacher's staging area; someone who came here wanted
                a paper to sit and do, and when they have done it the useful
                offer is another one — same shapes, same marks, new numbers. */}
            <button
              onClick={again}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground text-sm font-medium hover:text-foreground hover:bg-foreground/5 transition-colors"
            >
              <Dices className="h-3.5 w-3.5" />
              Another practice paper
            </button>
          </div>
        )}

        {drawing && (
          <div className="flex items-center gap-2 mt-5 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Building your paper…
          </div>
        )}
      </div>

      {/* Portaled to the body, so it is a second document rather than part of
          the paper's print job — never in it. */}
      {schemes && (
        <MarkschemeSheet
          courseId={courseId}
          courseLabel={courseName}
          questions={drawn}
          schemes={schemes}
          totalMarks={newMarks}
        />
      )}

      <div ref={sheetRef} className="worksheet-container space-y-6">
        {made.map((q, i) => (
          /* `worksheet-question` is what the print stylesheet keys on for a
             white card with black text and a sensible page break. Without it
             this printed the page's own dark styling, and with the header and
             its four buttons still on it. */
          <article key={i} className="worksheet-question border border-border rounded-xl p-5 bg-card/40">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={`font-mono text-sm font-semibold ${theme.text}`}>{plan[i].number}.</span>
              {q ? (
                <>
                  <span className="font-mono text-xs text-muted-foreground">
                    modelled on {plan[i].label}
                  </span>
                  <Marks marks={q.marks} theme={theme} />
                </>
              ) : (
                <span className="font-mono text-xs text-amber-800 dark:text-amber-300/90">
                  no new question could be made for {plan[i].label ?? `question ${plan[i].number}`}
                </span>
              )}
            </div>

            {q ? (
              <MathRenderer html={q.question} className="question-content text-foreground" />
            ) : (
              /* The slot is kept and named rather than silently dropped, so a
                 teacher can see which question it was and go and get the
                 original. With every paper question cloned this should never
                 fire; if it does, the registry has regressed. */
              <Link
                href={`/course/${courseId}/papers/${year}/paper-${paperNumber}`}
                className={`text-sm ${theme.text} hover:opacity-80 underline`}
              >
                Show the original question
              </Link>
            )}
          </article>
        ))}
      </div>

      <div className="mt-8 no-print">
        <Link
          href={`/course/${courseId}/papers/${year}/paper-${paperNumber}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          The real {year} Paper {paperNumber}
        </Link>
      </div>
    </>
  );
}
