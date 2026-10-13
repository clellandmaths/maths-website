/**
 * Long inline maths on a narrow phone (the owner, 2026-10-13: "Let's go E"; contact sheet
 * https://claude.ai/artifact/TW8b6stFtwqeLnEDZqvFT9; tools/never-the-paper/scripts/wrap-e.js is the measured
 * prototype). KaTeX breaks a long inline formula after "=" or "+", and when the next line starts with a tall
 * fraction its top reaches into the line above (AH 2026 P2 Q13: 10 px). On phones only:
 *
 *   1. a formula that fits on a line of its own stays WHOLE: it moves to the next line as one piece;
 *   2. one a little too wide stays whole, set smaller, never below 85%;
 *   3. one longer than that breaks, with the lines spaced apart (the CSS in globals.css), at full size;
 *   4. only a piece that cannot fit even broken is set smaller, down to 70% (AH 2025 P2 Q18's bracket).
 *
 * Nothing scrolls sideways. This only MARKS formulas (data-whole, data-fit-scale, --fit); every effect is a rule under
 * `@media screen and (max-width: 767px)` in globals.css, so print is never touched (proven box for box,
 * wrap-print-proof.mjs). Loaded after the page, on phones only (components/MathsFit.tsx), so no page grows.
 *
 * Measured on every AH paper page with every answer open, at 320 px: overlaps 158 -> 0, off the edge 14 -> 0, splits
 * 349 -> 222; at 390 px: 97 -> 0, 1 -> 0, 187 -> 109.
 */
const FLOOR_WHOLE = 0.85;
const FLOOR_PIECE = 0.7;
const DONE = 'fitDone';
/**
 * The scale, rounded DOWN so a fitted formula can never overshoot its column by a rounding. A fraction of the size the
 * formula has now: globals.css multiplies it into the site's own 1.1em (the measured prototype multiplied it into 1em,
 * so everything it shrank came out a further 10% smaller than its figures said).
 */
const scaleFor = (s: number) => (Math.floor(s * 1000) / 1000).toFixed(3);

/**
 * Inline formulas not yet fitted: not display maths, not a formula inside another, and **not in a table**. A table's
 * columns grow to their content, so a formula kept whole in a cell widened its column instead of fitting it: the
 * marking-instructions tables went wider than the phone and scrolled sideways (AH papers, 320 px: 71 such boxes today,
 * 95 with formulas kept whole in cells; 390 px: 15 and 56; wrap-scrollboxes.mjs). In a cell a formula breaks, with
 * the lines spaced (globals.css), as it fits the cell.
 */
function candidates(root: ParentNode): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>('.katex')].filter(k =>
    !k.dataset[DONE] && !k.closest('.katex-display') && !k.parentElement?.closest('.katex') && !k.closest('td, th'));
}

/** The width a formula has to fit in: its nearest block-level ancestor's content box. */
function room(k: HTMLElement): number {
  let col = k.parentElement;
  while (col && getComputedStyle(col).display.startsWith('inline')) col = col.parentElement;
  if (!col) return Infinity;
  const cs = getComputedStyle(col);
  return col.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
}

/**
 * Fit every new formula under `root`. In batches (all writes, then all reads), so a paper page of several hundred
 * formulas costs a handful of layouts, not one per formula.
 */
export function fitMaths(root: ParentNode = document): void {
  const ks = candidates(root);
  if (!ks.length) return;
  for (const k of ks) { k.dataset[DONE] = '1'; k.dataset.whole = '1'; }
  const sized = ks.map(k => ({ k, html: k.querySelector<HTMLElement>(':scope > .katex-html'), room: room(k) }))
    .map(x => ({ ...x, wide: x.html ? x.html.getBoundingClientRect().width : 0 }));
  const broken: typeof sized = [];
  for (const x of sized) {
    if (!x.html || x.wide <= x.room + 1) continue;
    if (x.wide * FLOOR_WHOLE <= x.room + 1) {
      x.k.style.setProperty('--fit', scaleFor(x.room / x.wide));
      x.k.dataset.fitScale = '1';
    } else {
      delete x.k.dataset.whole;
      broken.push(x);
    }
  }
  const pieces = broken.map(x => ({ ...x, widest: Math.max(0, ...[...x.k.querySelectorAll(':scope > .katex-html > .base')].map(b => b.getBoundingClientRect().width)) }));
  for (const x of pieces) {
    if (x.widest <= x.room + 1) continue;
    x.k.style.setProperty('--fit', scaleFor(Math.max(FLOOR_PIECE, x.room / x.widest)));
    x.k.dataset.fitScale = '1';
  }
}

/** Forget every decision, for a new width (the phone turned). */
function unfit(): void {
  for (const k of document.querySelectorAll<HTMLElement>('.katex[data-fit-done]')) {
    delete k.dataset[DONE]; delete k.dataset.whole; delete k.dataset.fitScale; k.style.removeProperty('--fit');
  }
}

/**
 * Fit what is on the page now, what arrives later (hints, answers, generated questions are drawn in the browser),
 * and again when the width changes. Only below 768 px on screen; on a wider screen it does nothing.
 */
export function startMathsFit(): () => void {
  const phone = matchMedia('screen and (max-width: 767px)');
  let frame = 0;
  const soon = () => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; if (phone.matches) fitMaths(); }); };
  const observer = new MutationObserver(records => {
    if (records.some(r => [...r.addedNodes].some(n => n.nodeType === 1 && ((n as Element).matches('.katex') || (n as Element).querySelector('.katex'))))) soon();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  let width = innerWidth;
  const onResize = () => { if (innerWidth === width) return; width = innerWidth; unfit(); soon(); };
  addEventListener('resize', onResize);
  // **Not before KaTeX's fonts.** Measured in the fallback font, a formula is narrower than it will be, so it was kept
  // whole and then ran off the edge once the real font arrived (2 at 320 px on the first build). So: fit once the
  // fonts are in, and fit everything again whenever more fonts load (a page can need a KaTeX face it had not yet).
  const fonts = document.fonts;
  const refit = () => { unfit(); soon(); };
  if (fonts) {
    fonts.ready.then(soon);
    fonts.addEventListener?.('loadingdone', refit);
  } else soon();
  return () => { observer.disconnect(); removeEventListener('resize', onResize); fonts?.removeEventListener?.('loadingdone', refit); };
}
