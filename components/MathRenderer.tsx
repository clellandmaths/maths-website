'use client';

import { useEffect, useRef } from 'react';
import katex from 'katex';

interface MathRendererProps {
  html: string;
  className?: string;
}

export default function MathRenderer({ html, className = '' }: MathRendererProps) {
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
    processed = processed.replace(/\$([^$\n]+?)\$/g, (_, tex) => {
      try {
        return katex.renderToString(tex.trim(), {
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
        return katex.renderToString(tex.trim(), {
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
  }, [html]);

  return <div ref={ref} className={className} />;
}
