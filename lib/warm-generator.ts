/**
 * **Get the question generator ready before anyone presses for one** (the owner,
 * 2026-10-06: "essentially anywhere you could generate a new variation ... Has to
 * be professional").
 *
 * Every "make a question" control loads the engine at the press, because it is
 * ~930 KB of code and on no page (`check-engine-isolation.mjs`). On a slowed
 * phone that made the first press take 5 to 7 seconds; every press after it is
 * instant. This moves that wait to while the page is being read:
 *
 *   1. **The page first.** Nothing starts until the load event, and then only in
 *      the browser's idle time (`requestIdleCallback`), so it never competes with
 *      what the visitor is looking at.
 *   2. **Only where a control is.** It is called by the controls themselves, so a
 *      page with none fetches nothing.
 *   3. **Considerate.** Not when the phone asks to save data, nor on a 2G
 *      connection: those keep loading at the press, exactly as before.
 *   4. **Once.** The engine is fetched once per page; the browser caches its
 *      files, so the next page has them already. Then what the engine itself
 *      loads on demand: National 5's generators, or Advanced Higher's adapter and
 *      the routine file of each card on the page (`warmCourse`); and the course's
 *      past papers, which the first draw reads for the video.
 *
 * Fail-safe: anything that errors here is dropped, and the press loads as it
 * always did. Imported lazily by its callers, so it adds nothing to a page's own
 * code beyond the call.
 */

type Connection = { saveData?: boolean; effectiveType?: string };

let engine: Promise<unknown> | null = null;
const papers = new Set<string>();
const warmed = new Set<string>();

function considerate(): boolean {
  const c = (navigator as Navigator & { connection?: Connection }).connection;
  return !(c?.saveData || /(^|-)2g$/.test(c?.effectiveType ?? ''));
}

/** After the page has loaded, in idle time. */
function whenSettled(run: () => void): void {
  const idle = () => {
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    if (ric) ric(run, { timeout: 5000 });
    else setTimeout(run, 1500);
  };
  if (document.readyState === 'complete') idle();
  else addEventListener('load', idle, { once: true });
}

export function warmGenerator(courseId: string | undefined, label?: string | null): void {
  // Only the courses that generate (`courseGenerates`): the others never fetch it.
  if (typeof window === 'undefined' || (courseId !== 'n5' && courseId !== 'ah') || !considerate()) return;
  whenSettled(() => {
    engine ??= import('@/lib/generated-question').catch(() => { engine = null; });
    if (!papers.has(courseId)) {
      papers.add(courseId);
      import('@/lib/data-loader')
        .then(d => (courseId === 'ah' ? d.getAllAHQuestions() : d.getAllN5Questions()))
        .catch(() => papers.delete(courseId));
    }
    // The course's own generators (N5), or this card's routine file (AH): the
    // part of a first press the engine itself loads on demand. Once per card.
    const key = `${courseId}|${courseId === 'ah' ? label ?? '' : ''}`;
    if (!warmed.has(key)) {
      warmed.add(key);
      engine
        .then(() => import('@/lib/generated-question'))
        .then(g => g.warmCourse(courseId, label))
        .catch(() => warmed.delete(key));
    }
  });
}
