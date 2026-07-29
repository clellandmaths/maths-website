import katex from 'katex';

// Server-safe counterpart to MathRenderer: the same string transform, but
// done synchronously so the maths is baked into the prerendered HTML and
// crawlable. Use this on statically generated content pages; MathRenderer
// remains for client-only surfaces (explorer, presenter).

export interface MathHtmlOptions {
  /**
   * Render inline maths in display *style* — full-size fractions, roots and
   * limits — while keeping it inline in the flow. Display *mode* would centre
   * each expression on its own line, which is wrong for prose.
   *
   * On by default. Everything rendered through here is exam content —
   * questions, answers, markschemes, formulae — where textstyle squeezes
   * f(x) = 3x/(x²−4x−5) down to something a pupil has to squint at. Pass
   * false for surfaces that genuinely want inline sizing.
   */
  displayStyle?: boolean;
}

export function renderMathHtml(html: string, options: MathHtmlOptions = {}): string {
  let processed = html;
  const displayStyle = options.displayStyle ?? true;

  const render = (tex: string, displayMode: boolean) => {
    const src = tex.trim();
    try {
      return katex.renderToString(
        // $$…$$ is already display style; only inline runs need the hint
        !displayMode && displayStyle ? `\\displaystyle ${src}` : src,
        { displayMode, throwOnError: false, trust: true }
      );
    } catch {
      return `<span class="text-red-500">[Math Error]</span>`;
    }
  };

  processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (_, tex) => render(tex, true));
  // Inline $…$ must not span an HTML tag. A table header reading
  // "Price of silver ($)…Price of gold ($)" otherwise pairs the two currency
  // symbols and hands the markup between them to KaTeX, wrecking the row.
  // Genuine maths never contains a raw < or > here — those arrive escaped.
  processed = processed.replace(/\$([^$\n<>]+?)\$/g, (_, tex) => render(tex, false));
  processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, (_, tex) => render(tex, false));
  processed = processed.replace(/<img /g, '<img loading="lazy" ');

  return processed;
}

export default function MathHtml({ html, className = '' }: { html: string; className?: string }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: renderMathHtml(html) }} />;
}
