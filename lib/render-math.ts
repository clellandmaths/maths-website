import katex from 'katex';

/**
 * The one place maths is turned into HTML.
 *
 * Server pages and client surfaces both call this, so a change lands
 * everywhere at once. It used to be copied into MathHtml and MathRenderer,
 * which is why the same two bugs had to be fixed twice.
 *
 * Pure string → string, no React and no DOM, so it runs at build time and in
 * the browser and can be tested directly. See scripts/check-math-render.mjs.
 *
 * Delimiters, applied in this order:
 *   $$…$$   display maths, centred on its own line
 *   \(…\)   inline maths — what all the question data uses
 *   $…$     inline maths — the worksheet generator's format only
 */

export interface RenderMathOptions {
  /**
   * Inline maths in display *style*: full-size fractions, roots and limits,
   * still inline in the sentence. On by default — everything rendered here is
   * exam content, where textstyle squeezes f(x) = 3x/(x²−4x−5) down to
   * something a pupil has to squint at. Display *mode* is a different thing
   * and would centre each expression on its own line.
   */
  displayStyle?: boolean;
  /** Add loading="lazy" to images. Default true. */
  lazyImages?: boolean;
}

/**
 * Is this `$…$` run actually maths, or two currency symbols on one line?
 *
 * "Price of silver ($) … Price of gold ($)" once paired its two dollar signs
 * and handed the markup between them to KaTeX, wrecking a table header. Any
 * question mentioning two dollar amounts on one line hit it.
 *
 * So `$…$` must now *earn* it: no markup inside, and some positive sign of
 * maths. `\(…\)` needs none of this — it is unambiguous, which is why the
 * question data uses it.
 */
function looksLikeMaths(tex: string): boolean {
  if (tex.length === 0 || tex.length > 400) return false;
  if (/[<>]/.test(tex)) return false;               // never span a tag
  if (/^[\s)\].,;:!?]/.test(tex)) return false;     // "($) … ($)" style pairing
  return (
    /\\[a-zA-Z]/.test(tex) ||    // a LaTeX command
    /[\^_{}]/.test(tex) ||       // powers, subscripts, groups
    /[=<>+\-*/]/.test(tex) ||    // an operator
    /^[a-zA-Z]$/.test(tex)       // a bare variable, e.g. $x$
  );
}

export function renderMath(html: string, options: RenderMathOptions = {}): string {
  const { displayStyle = true, lazyImages = true } = options;

  const render = (tex: string, displayMode: boolean) => {
    const src = tex.trim();
    if (!src) return '';
    try {
      return katex.renderToString(
        // $$…$$ is already display style; only inline runs need the hint.
        // Note the doubled backslash: written `\displaystyle` in a template
        // literal, JavaScript drops the backslash and KaTeX sets the word in
        // italics instead.
        !displayMode && displayStyle ? `\\displaystyle ${src}` : src,
        { displayMode, throwOnError: false, trust: true }
      );
    } catch {
      return `<span class="text-red-500">[Math Error]</span>`;
    }
  };

  let out = html;
  out = out.replace(/\$\$([\s\S]*?)\$\$/g, (_, tex) => render(tex, true));
  out = out.replace(/\\\(([\s\S]*?)\\\)/g, (_, tex) => render(tex, false));
  out = out.replace(/\$([^$\n]+?)\$/g, (whole, tex) =>
    looksLikeMaths(tex) ? render(tex, false) : whole
  );

  if (lazyImages) out = out.replace(/<img /g, '<img loading="lazy" ');
  return out;
}
