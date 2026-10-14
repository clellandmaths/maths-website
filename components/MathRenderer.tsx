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

/**
 * **The maths fonts, asked for with KaTeX rather than after it** (the owner,
 * 2026-10-14, card 2 of the loading-states sheet: "Yes"). KaTeX holds a letter
 * back until its font is here (`font-display: block`), and the browser only
 * asks for a font once text needing it is laid out, so every formula's letters
 * were gaps for about a second after the maths was drawn (7.6 to 8.6 s on a
 * 20-question AH sheet, first visit, older phone). These are the faces nearly
 * every formula uses; the rarer ones (big brackets, script letters) still come
 * when they are needed. Asked for by name, so no hashed file path is copied.
 */
const FACES = ['400 1em KaTeX_Main', 'italic 400 1em KaTeX_Math', '700 1em KaTeX_Main'];
let fonts: Promise<void> | null = null;
const askForFonts = (): Promise<void> => {
  fonts ??= (async () => {
    try { await Promise.all(FACES.map(f => document.fonts.load(f))); } catch { /* the page still draws */ }
  })();
  return fonts;
};
const fetchRenderMath = () => {
  askForFonts();
  return import('@/lib/render-math').then(m => (loaded = m));
};

/**
 * **Fetch the maths drawer ahead of the maths** (the shared sheet, 2026-10-14).
 * A page that knows maths is coming calls this before it shows any, waits for
 * it, and gives its boxes `immediate`, so they are drawn full rather than
 * empty and then filled, with their letters showing. The fonts are waited for
 * at most 3 s: a font that never arrives must not hold the sheet back.
 */
export function warmMathRenderer(): Promise<void> {
  const fontsOrGiveUp = Promise.race([askForFonts(), new Promise<void>(r => setTimeout(r, 3000))]);
  return Promise.all([fetchRenderMath(), fontsOrGiveUp]).then(() => undefined);
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
