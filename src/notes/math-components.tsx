'use client';
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
