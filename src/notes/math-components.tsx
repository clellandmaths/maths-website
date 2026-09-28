// **Not a client component.** These only turn LaTeX into HTML, so they render
// when the site is built, and the notes pages ship the finished maths instead
// of KaTeX itself. Marked 'use client', they put all of KaTeX (76 KB
// compressed, a third of the page's script) into every notes page to redo in
// the browser what the build had already done (measured 2026-09-28). Only
// server code imports the notes (lib/notes-loader and the notes routes).
import katex from 'katex';

export function InlineMath({ math }: { math: string }) {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(math, { throwOnError: false }),
      }}
    />
  );
}

export function BlockMath({ math }: { math: string }) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(math, { displayMode: true, throwOnError: false }),
      }}
    />
  );
}
