'use client';

import { useEffect, useRef } from 'react';
import { renderMath } from '@/lib/render-math';

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
    if (!ref.current) return;
    // Rendered from the raw string before the browser parses it, so & and <
    // inside maths cannot be mangled on the way in.
    ref.current.innerHTML = renderMath(html, { displayStyle });
  }, [html, displayStyle]);

  return <div ref={ref} className={className} />;
}
