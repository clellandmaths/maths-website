/**
 * Browsing questions on a desktop screen. Driven in a real browser.
 *
 *   npm run build && node scripts/check-explorer-desktop.mjs
 *
 * **Not in `build`** — it needs headless Chrome and the Cloudflare image has none.
 *
 * Reported as "the cards can be a bit small and the diagrams a bit squashed on
 * desktop", and measured, it was two faults that had nothing to do with each
 * other.
 *
 *   **Widening the window made the cards smaller.** The browse grid counted
 *   columns — two from 1024px, three from 1536px — so a 1600px monitor drew
 *   405px cards where a 1440px laptop drew 536px ones, and it only recovered
 *   past about 1900px. `.browse-grid` now sets a floor of 27.5rem and lets the
 *   browser decide how many fit.
 *
 *   **The diagram never grew at all.** `.question-card img` capped it at 5rem
 *   by 10rem at every width, so a 2560px monitor showed the same 123x80
 *   picture as a phone — 31% of a source image that is typically 402x261.
 *
 * **Below 1280px this must be byte-for-byte the old layout**, and that is the
 * first thing checked. A tablet in landscape is 1024px and reads correctly
 * today; the complaint was about desktop and the fix is scoped to desktop.
 *
 * The Explorer shows nothing until a filter is chosen — that is its own
 * deliberate empty state, "Build Your Worksheet" — so every width here ticks
 * 2024 first.
 */
import { withPage, tally } from './browser-drive.mjs';

const t = tally();

/** The floor `.browse-grid` promises, in px. Below this, no card may go. */
const FLOOR = 27.5 * 16;

const seen = [];

for (const width of [1024, 1280, 1440, 1600, 1920, 2560]) {
  await withPage({ port: 8163, cdp: 9263, width, height: 1000 }, async ({ evaluate, click, go, sleep }) => {
    await go('/explorer?c=n5', 7000);
    await click(`[...document.querySelectorAll('label,button')].find(e => e.textContent.trim() === '2024')`);
    await sleep(4500);

    const m = await evaluate(`(() => {
      const laid = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const body = [...document.querySelectorAll('.question-card')].filter(laid)[0];
      if (!body) return null;
      const card = body.closest('div[class*="rounded"]') || body.parentElement;
      const grid = [...document.querySelectorAll('.browse-grid')].filter(laid)[0];
      const img = [...document.querySelectorAll('.question-card img')].filter(laid)[0];
      return {
        vw: innerWidth,
        cols: grid ? getComputedStyle(grid).gridTemplateColumns.split(' ').length : 0,
        cardW: Math.round(card.getBoundingClientRect().width),
        fontPx: parseFloat(getComputedStyle(body).fontSize),
        imgH: img ? Math.round(img.getBoundingClientRect().height) : 0,
        imgPct: img && img.naturalWidth
          ? Math.round(100 * img.getBoundingClientRect().width / img.naturalWidth) : 0,
      };
    })()`);

    t.check(!!m, `${width}px · the browse grid has cards in it`);
    if (!m) return;
    seen.push(m);

    if (width < 1280) {
      /* The tablet promise. These are the numbers the old layout drew, and
         nothing above 1280px is allowed to reach down here and change them. */
      t.check(m.cols === 2, `${width}px · still two columns, as a tablet in landscape had (${m.cols})`);
      t.check(m.fontPx === 14, `${width}px · question text still 14px (${m.fontPx})`);
      t.check(m.imgH > 0 && m.imgH <= 80,
        `${width}px · the diagram is still the 80px thumbnail (${m.imgH})`);
      return;
    }

    t.check(m.cardW >= FLOOR,
      `${width}px · ${m.cols} column(s), card ${m.cardW}px — at or above the ${FLOOR}px floor`);
    /* 16px from 1280, 18px from 1536 — the steps follow the card width, and it
       stops short of full screen's 20px because this is a card you are choosing
       from rather than a question you are working. Exact, not a minimum: a
       later change that quietly took every card to 20px should have to say so
       here. */
    const want = width >= 1536 ? 18 : 16;
    t.check(m.fontPx === want,
      `${width}px · question text is ${m.fontPx}px, where a tablet keeps 14`);
    t.check(m.imgH >= 200,
      `${width}px · the diagram is ${m.imgH}px tall and ${m.imgPct}% of full size, not 31%`);
  });
}

/* ── the fault, stated as the fault ─────────────────────────────────────────
   Not "the cards are big enough" but "a wider window is never a worse one".
   Card width may fall when a new column appears — that is what a column is —
   but it may never fall below the floor every width above 1280 promises, and
   it may never be worse than the 1280px starting point. */
const desktop = seen.filter(m => m.vw >= 1280);
const narrowest = Math.min(...desktop.map(m => m.cardW));
const atStart = desktop.find(m => m.vw === 1280)?.cardW ?? 0;
t.check(narrowest >= FLOOR,
  `across every desktop width the narrowest card is ${narrowest}px (floor ${FLOOR})`);
t.check(narrowest >= atStart,
  `and no wider screen draws a card narrower than 1280px does (${atStart}px)`);
t.note(desktop.map(m => `${m.vw}px -> ${m.cols} x ${m.cardW}px`).join('  ·  '));

t.done('browsing questions on a desktop screen');
