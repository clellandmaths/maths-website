'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Loader2, Printer, Share2, ArrowRight } from 'lucide-react';
import { byPaperLabel, withParentVideo } from '@/lib/similar-questions';
import { appendToSession } from '@/lib/worksheet-context';
import { printWorksheet } from '@/lib/print-worksheet';
import MathRenderer from '@/components/MathRenderer';
import Marks from '@/components/Marks';
import type { QuestionWithMetadata } from '@/lib/data-loader';
import type { CourseTheme } from '@/lib/course-theme';

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
  const [added, setAdded] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);

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
    // `plan` is a build-time constant for this route; drawing once is correct.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drawn = made.filter(Boolean) as QuestionWithMetadata[];
  const missing = made.filter(q => !q).length;
  const newMarks = drawn.reduce((a, q) => a + (q.marks ?? []).reduce((x, y) => x + y, 0), 0);

  const share = () => {
    const origin = window.location.origin;
    import('@/lib/worksheet-share').then(({ shareLinks }) => {
      const { locked } = shareLinks(
        origin, courseId, drawn,
        `Practice paper — modelled on ${courseName} ${year} Paper ${paperNumber}`,
      );
      window.location.href = locked;
    });
  };

  return (
    <>
      <div className="mb-8">
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
          <p className="mt-3 text-sm text-amber-300/90">
            {missing} question{missing === 1 ? '' : 's'} could not be generated. They are
            named below, with a link to the original.
          </p>
        )}
        {failed && (
          <p className="mt-3 text-sm text-amber-300/90">
            Something went wrong drawing this paper. Reload to try again.
          </p>
        )}

        {!drawing && drawn.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-5">
            <button
              onClick={() => printWorksheet(sheetRef.current ?? document)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${theme.border} ${theme.tint} ${theme.text} text-sm font-medium hover:bg-white/10 transition-colors`}
            >
              <Printer className="h-3.5 w-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={share}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground text-sm font-medium hover:text-foreground hover:bg-white/5 transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" />
              Open as a worksheet
            </button>
            <button
              onClick={() => setAdded(appendToSession(courseId, drawn))}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground text-sm font-medium hover:text-foreground hover:bg-white/5 transition-colors"
            >
              Add all to my sheet
            </button>
            {added > 0 && (
              <Link
                href={`/explorer?c=${courseId}`}
                className={`inline-flex items-center gap-1.5 text-sm font-medium ${theme.text} hover:opacity-80`}
              >
                {added} added
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        )}

        {drawing && (
          <div className="flex items-center gap-2 mt-5 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Building your paper…
          </div>
        )}
      </div>

      <div ref={sheetRef} className="worksheet-container space-y-6">
        {made.map((q, i) => (
          <article key={i} className="border border-border rounded-xl p-5 bg-card/40">
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
                <span className="font-mono text-xs text-amber-300/90">
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

      <div className="mt-8">
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
