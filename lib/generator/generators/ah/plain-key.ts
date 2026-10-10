/**
 * A question's plain key: its text in one plain form, so the site's own past
 * paper question and a card's draw of it compare equal word for word.
 *
 * The site writes `\(…\)`, `\dfrac`, `x\ge0`, `\operatorname{cosec}`, "(c) (ii)"
 * and a raw "<"; a card writes `$…$`, `\frac`, `x \ge 0`, `\text{cosec }`,
 * "(ii)" and `\lt`. Each spelling was found by reading a near miss between the
 * two (tools/never-the-paper, "AH: STARTED"), and this is the form all 215 AH
 * cards were measured in: the same code as `tools/never-the-paper/scripts/
 * ahrepeat2.mts`. Figures (a card's SVG, the site's scan) are left out: the
 * three cards whose figure carries the paper's numbers are compared whole
 * (`not-the-paper.ts`).
 *
 * Nothing in National 5 uses this; it is Advanced Higher's own.
 */

function plain(s: string): string {
  return s.replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<img[^>]*>/g, ' ')
    .replace(/<small>[\s\S]*?<\/small>/g, ' ')
    // a tag starts with a letter: the site's raw "<" in "-\pi<\theta" is maths, and reading it as a tag
    // deleted the rest of 2021 P2 Q13 and hid its paper question
    .replace(/<\/?[a-zA-Z][^>]*>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&minus;|[−–]/g, '-').replace(/[’‘]/g, "'").replace(/[“”]/g, '"')
    // a Greek letter typed as itself is the same as its LaTeX name
    .replace(/θ/g, ' \\theta ').replace(/π/g, ' \\pi ').replace(/λ/g, ' \\lambda ').replace(/α/g, ' \\alpha ').replace(/β/g, ' \\beta ')
    .replace(/≤/g, ' \\le ').replace(/≥/g, ' \\ge ').replace(/×/g, ' \\times ')
    .replace(/\\\(|\\\)|\\\[|\\\]|\$/g, ' ')
    // a matrix's row break, however many backslashes and spaces the site or the card spells it with
    .replace(/\\\\+/g, ' ROWBREAK ')
    // part labels out: the site writes "(c) (ii)" where a card writes "(ii)" (2021 P1 Q7)
    .replace(/\((?:[a-h]|i{1,3}|iv|vi{0,3})\)/g, ' ')
    .replace(/\\(?:d|t)frac/g, '\\frac')
    // one symbol, two spellings (2026 P2 Q7: the site's ">" against the card's \gt);
    // (?![a-z]) not \b: the site writes "x\ge0" (2026 P2 Q13)
    .replace(/\\gt(?![a-zA-Z])/g, '>').replace(/\\lt(?![a-zA-Z])/g, '<').replace(/\\geq?(?![a-zA-Z])/g, '≥').replace(/\\leq?(?![a-zA-Z])/g, '≤')
    .replace(/>=/g, '≥').replace(/<=/g, '≤').replace(/\\neq?(?![a-zA-Z])/g, '≠').replace(/\\q?quad(?![a-zA-Z])/g, ' ')
    // \operatorname{cosec} and \text{cosec } are one word (2022 P1 Q1(b))
    .replace(/\\operatorname\{([^}]*)\}/g, ' $1 ')
    .replace(/\\(?:mathbb|mathbf|boldsymbol)\{([^}]*)\}/g, ' $1 ')
    .replace(/\\(?:left|right|big|Big|bigg|Bigg|displaystyle|textstyle)\b/g, ' ')
    .replace(/\\[,;:! ]|~/g, ' ')
    .replace(/\\text\{([^}]*)\}|\\mathrm\{([^}]*)\}/g, ' $1$2 ')
    .replace(/[{}]/g, ' ')
    .replace(/(\d),(\d{3})\b/g, '$1$2');
}

// Greek letters spelled \lambda or lambda are one token (2016 Q7); full stops and commas are not tokens
// (2023 P2 Q11's card ends a line with a stop its paper does not).
const GREEK = /^\\(alpha|beta|gamma|delta|epsilon|theta|lambda|mu|pi|sigma|phi|omega|rho|tau)$/;

/** The question's tokens, joined: equal for the site's paper question and a draw of it. */
export function plainKey(html: string): string {
  return (plain(html).match(/\\[a-zA-Z]+|[a-zA-Z]+|\d+(?:\.\d+)?|[^\s\w.,]/g) ?? [])
    .map(t => GREEK.test(t) ? t.slice(1) : /^[A-Za-z]{2,}$/.test(t) ? t.toLowerCase() : t)
    .join(' ');
}

/** A 64-bit FNV-1a hash of a key, as 16 hex digits: the table holds these, not the papers' text. */
export function keyHash(key: string): string {
  let h1 = 0x811c9dc5, h2 = 0x050c5d1f;
  for (let i = 0; i < key.length; i++) {
    const c = key.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
    h2 = Math.imul(h2 ^ c, 0x01000193) >>> 0;
    h2 = (h2 ^ (h1 >>> 7)) >>> 0;
  }
  return h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0');
}
