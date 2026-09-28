'use client';

import { useEffect, useRef } from 'react';

// Client-side counterpart to MathHtml, for surfaces that assemble their content
// in the browser (Explorer, Focus, the presenter, Exam Hall).
//
// The transform itself lives in lib/render-math and is shared with the server
// path, so both behave identically and a fix lands in one place.

interface MathRendererProps {
  html: string;
  className?: string;
  /** See RenderMathOptions.displayStyle. On by default, matching the server. */
  displayStyle?: boolean;
}

export default function MathRenderer({ html, className = '', displayStyle = true }: MathRendererProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // **KaTeX is fetched here, when there is maths to draw, not with the page.**
    // Imported at the top, it put 76 KB compressed into every page that could
    // show this component, including the home page, before anything was drawn
    // (2026-09-28). The maths was always drawn after the page loaded, in this
    // effect, so nothing appears later than it did; the file is fetched once
    // and every later call reuses it.
    let live = true;
    import('@/lib/render-math').then(({ renderMath }) => {
      if (!live || !ref.current) return;
      // Rendered from the raw string before the browser parses it, so & and <
      // inside maths cannot be mangled on the way in.
      ref.current.innerHTML = renderMath(html, { displayStyle });
    });
    return () => { live = false; };
  }, [html, displayStyle]);

  return <div ref={ref} className={className} />;
}
