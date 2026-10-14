'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';

// Client-side counterpart to MathHtml, for surfaces that assemble their content
// in the browser (Explorer, Focus, the presenter, Exam Hall).
//
// The transform itself lives in lib/render-math and is shared with the server
// path, so both behave identically and a fix lands in one place.

type RenderMath = typeof import('@/lib/render-math');
/** KaTeX, once it is here: lets `immediate` boxes draw before the first paint. */
let loaded: RenderMath | null = null;
const fetchRenderMath = () => import('@/lib/render-math').then(m => (loaded = m));

/**
 * **Fetch the maths drawer ahead of the maths** (the shared sheet, 2026-10-14).
 * A page that knows maths is coming calls this as soon as it starts loading,
 * waits for it, and gives its boxes `immediate`, so they are drawn full rather
 * than empty and then filled.
 */
export function warmMathRenderer(): Promise<void> {
  return fetchRenderMath().then(() => undefined);
}

// Layout effects do not run while the page is rendered ahead of time.
const useBeforePaint = typeof window === 'undefined' ? useEffect : useLayoutEffect;

interface MathRendererProps {
  html: string;
  className?: string;
  /** See RenderMathOptions.displayStyle. On by default, matching the server. */
  displayStyle?: boolean;
  /**
   * Draw before the browser paints when KaTeX is already here (see
   * `warmMathRenderer`). Off by default, so every other caller draws exactly
   * as before. **Why it exists:** a box drawn empty for a frame and filled the
   * next moves everything under it; on the shared sheet that was 0.34 of
   * layout shift on a slowed phone, in 1 run of 3 even with KaTeX fetched
   * early, because an ordinary effect can run after a paint.
   */
  immediate?: boolean;
}

export default function MathRenderer({ html, className = '', displayStyle = true, immediate = false }: MathRendererProps) {
  const ref = useRef<HTMLDivElement>(null);

  useBeforePaint(() => {
    if (immediate && loaded && ref.current) {
      ref.current.innerHTML = loaded.renderMath(html, { displayStyle });
    }
  }, [html, displayStyle, immediate]);

  useEffect(() => {
    if (immediate && loaded) return;   // drawn already, before the paint
    // **KaTeX is fetched here, when there is maths to draw, not with the page.**
    // Imported at the top, it put 76 KB compressed into every page that could
    // show this component, including the home page, before anything was drawn
    // (2026-09-28). The maths was always drawn after the page loaded, in this
    // effect, so nothing appears later than it did; the file is fetched once
    // and every later call reuses it.
    let live = true;
    fetchRenderMath().then(({ renderMath }) => {
      if (!live || !ref.current) return;
      // Rendered from the raw string before the browser parses it, so & and <
      // inside maths cannot be mangled on the way in.
      ref.current.innerHTML = renderMath(html, { displayStyle });
    });
    return () => { live = false; };
  }, [html, displayStyle, immediate]);

  return <div ref={ref} className={className} />;
}
