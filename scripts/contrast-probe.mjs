/**
 * How a colour on this site is resolved, for any check that needs to know.
 *
 * Not a check. This is the inside of a browser probe — a string, evaluated in
 * the page — and it exists as its own file because two checks now need the same
 * answers and a second copy would drift from the first.
 *
 * **It does no colour parsing.** Tailwind 4 computes colours as `lab()` and
 * `oklab()`, and the first version of `check-contrast.mjs` parsed `rgba()` with
 * a regular expression: it dropped 137 of a page's 439 colours *without
 * counting them* and reported a clean sweep. So every conversion and every
 * composite here is done by a 1x1 canvas, which is the browser answering
 * questions about its own colour space.
 *
 * What it provides:
 *
 * - `valid(s)`      — does the browser understand this as a colour
 * - `alphaOf(s)`    — 0-255, without parsing
 * - `flatten(b, l)` — paint layers over a base, read back sRGB
 * - `ratio(a, b)`   — WCAG contrast between two sRGB triples
 * - `stopsOf(bi)`   — the colour stops of a background-image, or null for a bitmap
 * - `backdrops(el)` — every background this element could be sitting on, as
 *                     sRGB triples; a gradient yields one per stop, because
 *                     `from-cyan-600 to-blue-600` has to clear its threshold at
 *                     both ends rather than on average. Null when the answer is
 *                     unknowable, which is a bitmap behind the element.
 *
 * **No backticks anywhere below.** This is spliced into a template literal, and
 * a backtick in a comment ends the string — it has cost this project two
 * debugging sessions, once printing "0 pages failing" from a syntax error.
 */
export const COLOUR_PRELUDE = `
  const cv = document.createElement('canvas');
  cv.width = cv.height = 1;
  const cx = cv.getContext('2d', { willReadFrequently: true });

  /** Is this string a colour the browser understands? */
  const SENTINEL = '#010203';
  const valid = s => {
    if (!s) return false;
    cx.fillStyle = SENTINEL;
    cx.fillStyle = s;
    if (cx.fillStyle !== SENTINEL) return true;
    return String(s).trim().toLowerCase() === SENTINEL;   // it really was that
  };

  /**
   * Paint \`layers\` bottom-up over \`base\` and read the sRGB result.
   * The browser composites; nothing here implements source-over.
   */
  const flatten = (base, layers) => {
    cx.globalCompositeOperation = 'source-over';
    cx.globalAlpha = 1;
    cx.clearRect(0, 0, 1, 1);
    cx.fillStyle = base;
    cx.fillRect(0, 0, 1, 1);
    for (const l of layers) { cx.fillStyle = l; cx.fillRect(0, 0, 1, 1); }
    const d = cx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]];
  };

  const sRGB = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const lum = p => 0.2126 * sRGB(p[0]) + 0.7152 * sRGB(p[1]) + 0.0722 * sRGB(p[2]);
  const ratio = (a, b) => { const x = lum(a), y = lum(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

  /** Split on commas that are not inside brackets. No regex: depth counting. */
  const topLevel = s => {
    const out = []; let depth = 0, cur = '';
    for (const ch of s) {
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; }
      else cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  };

  /**
   * The colour stops of every gradient in a background-image.
   *
   * A stop is "colour position" — drop whitespace-separated pieces off the end
   * until what is left converts. That also discards \`to right\` and \`90deg\`,
   * which never convert, so no list of direction keywords is needed here.
   */
  const stopsOf = bi => {
    if (bi.indexOf('url(') !== -1) return null;         // a bitmap: unknowable
    const stops = [];
    for (const part of topLevel(bi)) {
      const open = part.indexOf('(');
      if (open < 0 || part.indexOf('gradient') < 0) continue;
      const body = part.slice(open + 1, part.lastIndexOf(')'));
      for (const raw of topLevel(body)) {
        const bits = raw.split(' ').filter(Boolean);
        for (let n = bits.length; n > 0; n--) {
          const cand = bits.slice(0, n).join(' ');
          if (valid(cand)) { stops.push(cand); break; }
        }
      }
    }
    return stops.length ? stops : null;
  };

  const alphaOf = s => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = s;
    cx.fillRect(0, 0, 1, 1); return cx.getImageData(0, 0, 1, 1).data[3]; };

  /**
   * Candidate backgrounds behind \`el\`, already flattened to sRGB.
   * Returns null when a bitmap is in the way.
   */
  const backdrops = el => {
    const layers = [];            // CSS strings, nearest the text first
    const gradients = [];         // index in \`layers\` -> list of stop strings
    let base = 'white', found = false;
    for (let node = el; node; node = node.parentElement) {
      const cs = getComputedStyle(node);
      const bi = cs.backgroundImage;
      if (bi && bi !== 'none') {
        const stops = stopsOf(bi);
        if (!stops) return null;
        const opaque = stops.every(s => alphaOf(s) === 255);
        if (opaque) { gradients.push({ at: layers.length, stops }); layers.push(stops[0]); found = true; base = null; break; }
        gradients.push({ at: layers.length, stops });
        layers.push(stops[0]);
      }
      const bc = cs.backgroundColor;
      const a = alphaOf(bc);
      if (a > 0) {
        layers.push(bc);
        if (a === 255) { base = bc; layers.pop(); found = true; break; }
      }
    }
    if (!found) base = 'white';
    const bottomUp = layers.slice().reverse();
    // Expand the gradient layers into candidate stacks, capped so a page of
    // many-stop gradients cannot turn into thousands of canvas reads.
    let stacks = [bottomUp];
    for (const g of gradients) {
      const idx = bottomUp.length - 1 - g.at;
      const next = [];
      for (const st of stacks) {
        for (const stop of g.stops.slice(0, 4)) {
          const copy = st.slice(); copy[idx] = stop; next.push(copy);
        }
      }
      stacks = next.slice(0, 12);
    }
    return stacks.map(st => flatten(base || 'white', st));
  };
`;
