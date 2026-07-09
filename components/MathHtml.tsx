import katex from 'katex';

// Server-safe counterpart to MathRenderer: the same string transform, but
// done synchronously so the maths is baked into the prerendered HTML and
// crawlable. Use this on statically generated content pages; MathRenderer
// remains for client-only surfaces (explorer, presenter).

export function renderMathHtml(html: string): string {
  let processed = html;

  const render = (tex: string, displayMode: boolean) => {
    try {
      return katex.renderToString(tex.trim(), { displayMode, throwOnError: false, trust: true });
    } catch {
      return `<span class="text-red-500">[Math Error]</span>`;
    }
  };

  processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (_, tex) => render(tex, true));
  processed = processed.replace(/\$([^$\n]+?)\$/g, (_, tex) => render(tex, false));
  processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, (_, tex) => render(tex, false));
  processed = processed.replace(/<img /g, '<img loading="lazy" ');

  return processed;
}

export default function MathHtml({ html, className = '' }: { html: string; className?: string }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: renderMathHtml(html) }} />;
}
