import { renderMath, type RenderMathOptions } from '@/lib/render-math';

// Server-side maths rendering: the transform runs at build time so the output
// is in the prerendered HTML and crawlable. MathRenderer is the client
// counterpart for surfaces that build their content in the browser.
//
// Both call renderMath, so the delimiter handling lives in exactly one place.

export type MathHtmlOptions = RenderMathOptions;

/** @deprecated prefer `renderMath` from lib/render-math — kept so existing call sites work. */
export function renderMathHtml(html: string, options: MathHtmlOptions = {}): string {
  return renderMath(html, options);
}

export default function MathHtml({ html, className = '' }: { html: string; className?: string }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: renderMath(html) }} />;
}
