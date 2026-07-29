'use client';

import { useEffect, useRef } from 'react';
import katex from 'katex';

interface MathRendererProps {
  html: string;
  className?: string;
  /**
   * Inline maths in display *style* — full-size fractions and roots, still
   * inline. On by default so the client surfaces match the server-rendered
   * pages; see MathHtml.
   */
  displayStyle?: boolean;
}

export default function MathRenderer({ html, className = '', displayStyle = true }: MathRendererProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Process math on the raw string BEFORE the browser parses it
    // This prevents the browser from corrupting & and < inside math delimiters
    let processed = html;

    // Replace display math $$...$$
    processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (_, tex) => {
      try {
        return katex.renderToString(tex.trim(), {
          displayMode: true,
          throwOnError: false,
          trust: true,
        });
      } catch {
        return `<span class="text-red-500">[Math Error]</span>`;
      }
    });

    // Replace inline math $...$ (single-dollar, used by worksheet generator)
    // Safe to apply here because $$...$$ has already been converted to HTML above
    // Must not span an HTML tag: "Price of silver ($)…Price of gold ($)" would
    // otherwise pair the two currency symbols and send the markup between them
    // to KaTeX. Genuine maths has no raw < or > here — those arrive escaped.
    processed = processed.replace(/\$([^$\n<>]+?)\$/g, (_, tex) => {
      try {
        // `\\` — in a template literal `\d` is not an escape, so a single
        // backslash is dropped and KaTeX receives the word "displaystyle" as
        // text to set in italics.
        return katex.renderToString(displayStyle ? `\\displaystyle ${tex.trim()}` : tex.trim(), {
          displayMode: false,
          throwOnError: false,
          trust: true,
        });
      } catch {
        return `<span class="text-red-500">[Math Error]</span>`;
      }
    });

    // Replace inline math \(...\)
    processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, (_, tex) => {
      try {
        // `\\` — in a template literal `\d` is not an escape, so a single
        // backslash is dropped and KaTeX receives the word "displaystyle" as
        // text to set in italics.
        return katex.renderToString(displayStyle ? `\\displaystyle ${tex.trim()}` : tex.trim(), {
          displayMode: false,
          throwOnError: false,
          trust: true,
        });
      } catch {
        return `<span class="text-red-500">[Math Error]</span>`;
      }
    });

    // Add lazy loading to all images so off-screen images don't load until scrolled to
    processed = processed.replace(/<img /g, '<img loading="lazy" ');

    // Set innerHTML once with fully processed content
    ref.current.innerHTML = processed;
  }, [html, displayStyle]);

  return <div ref={ref} className={className} />;
}
