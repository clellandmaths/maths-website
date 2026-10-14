'use client';

/**
 * **The site's one loading state** (the owner, 2026-10-14, the loading-states
 * audit: "Yes" to one shared piece, used only where a wait calls for it).
 *
 * It follows the rules on that sheet:
 *
 * - **Nothing for the first half second.** The words and the bar fade in after
 *   0.5 s (CSS, `.loading-reveal`), so a wait that ends sooner, as most do on a
 *   laptop or a return visit, shows no flicker at all. The space is held from
 *   the start, so nothing moves either way.
 * - **Say what is happening, and count it where it can be counted.** With
 *   `total`, the bar fills as `done` rises; until the first one is done (or
 *   with no total) it is a gentle sweep, which holds still under "reduce
 *   motion".
 * - **A screen reader hears it once.** The label is a polite status; the count
 *   is not announced on every step, which would chatter. The page says when the
 *   wait is over (the caller's own "ready" line), because this unmounts.
 *
 * It is not a spinner, and it does not replace the button-level spinners: a
 * press that ends in under a second shows a busy button, not this.
 */
export default function LoadingStatus({
  label,
  done,
  total,
  barClass,
  className = '',
}: {
  /** What is being waited for, in words: "Setting out 20 questions". */
  label: string;
  /** How many are ready, when they can be counted. */
  done?: number;
  total?: number;
  /** The bar's fill: the course's `theme.progress`. */
  barClass: string;
  className?: string;
}) {
  const counting = total !== undefined && total > 0 && done !== undefined && done > 0;
  const pct = counting ? Math.min(100, Math.round((done! / total!) * 100)) : 0;
  return (
    // The outer box only holds the space (the caller's height, in `className`);
    // the visible panel waits its half second inside it, so a quick load shows
    // neither words nor an empty box.
    <div className={`no-print ${className}`}>
      <div role="status" className="loading-reveal rounded-xl border border-border bg-card/50 p-5">
        <p className="font-semibold text-foreground">{label}&hellip;</p>
        <p className="mt-1 font-mono text-xs text-muted-foreground" aria-hidden="true">
          {counting ? `${done} of ${total}` : ' '}
        </p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
          {counting ? (
            // **Scaled, not widened** (2026-10-14): a width animation runs on the
            // page's main thread, and while a slow phone was busy making the
            // questions the bar sat at a fifth full beside "50 of 50". A
            // transform is moved by the compositor, so it keeps up.
            <div
              className={`h-full w-full origin-left rounded-full ${barClass} motion-safe:transition-transform motion-safe:duration-300`}
              style={{ transform: `scaleX(${pct / 100})` }}
            />
          ) : (
            <div className={`h-full w-1/3 rounded-full ${barClass} loading-sweep`} />
          )}
        </div>
      </div>
    </div>
  );
}
