/**
 * A question card's header holds its shape at every width.
 *
 *   npm run build && node scripts/check-card-header.mjs
 *
 * **Not in `build`** — it needs headless Chrome and the Cloudflare image has none.
 *
 * ## The fault
 *
 * Reported from a phone: the chips on a worksheet card stacked one per line,
 * each indented under the last as though nested, and a generated question's
 * header ran to nine lines and 216px before its maths began.
 *
 * The cause is the same in both places it appeared, and it is not about
 * phones. A card header is an identity column beside a `shrink-0` control
 * cluster. The cluster takes its width first; the identity column gets the
 * remainder. On the Explorer's checkout the cluster is about 150px — the
 * reorder pair is `p-3` so it can be hit with a thumb — and the chip row gives
 * up another 44px to the `pl-11` that aligns it under the label. A 150px chip
 * then cannot share a line with a 70px badge inside 130px, so it does not.
 *
 * ## The invariant, and why it is not "the chips always share a line"
 *
 * At 320px "Fractions and mixed numbers" and "2 Marks" genuinely do not fit
 * across one line, and stacking them is correct. An assertion that they always
 * share a line would be wrong at the floor and would push someone to shrink the
 * text to satisfy it.
 *
 * So the rule is conditional, and it is the same rule at every width:
 *
 *   **if everything on the chip row would fit inside the card's content box,
 *   it must all be on one line.**
 *
 * That is false exactly when something else has taken the width — which is the
 * fault — and true whenever the wrap is honest. It needs no breakpoints and no
 * magic numbers, so it does not have to be revisited when a new device appears.
 *
 * ## Widths
 *
 * 320 / 390 / 768 / 1440, which is what `check-responsive.mjs` drives and what
 * `docs/responsive.md` sets as the standard. **320 is the floor, not 390.**
 * This was first fixed at 390 alone, because 390 was the width of the phone the
 * fault was reported from, which is not a reason for anything.
 *
 * ## Both surfaces, because the fault was in both
 *
 * The browse card (`components/Explorer/QuestionCard.tsx`) and the checkout
 * card (the `.worksheet-question` block in `app/explorer/page.tsx`) are
 * separate markup that grew the same shape. The first fix went to the browse
 * card while the report was about the checkout, and the sweep that went looking
 * for "anywhere else" only examined `justify-between` rows — which the checkout
 * card is not. Hence: both, by name, at every width.
 */
import { withPage, tally } from './browser-drive.mjs';

const t = tally();

/** The project's standard set — `docs/responsive.md`. */
const WIDTHS = [
  ['phone-sm', 320, 640],
  ['phone', 390, 844],
  ['tablet', 768, 1024],
  ['desk', 1440, 900],
];

const LAID = `(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; })`;

/**
 * For every card on screen: the chip row's geometry, and whether the wrap in it
 * is honest.
 *
 * `cardInner` is the card's content box — its width less its own padding — so
 * "would they fit" is asked against the space the card actually offers, not
 * against the squeezed box the chips were handed.
 */
const MEASURE = cardSelector => `(() => {
  const laid = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const out = [];
  for (const card of [...document.querySelectorAll(${JSON.stringify(cardSelector)})].filter(laid)) {
    // The marks badge is the anchor: Marks renders "N Marks" as a leaf span.
    const marks = [...card.querySelectorAll('span')]
      .find(el => !el.children.length && laid(el) && /^\\d+ Marks?$/.test(el.textContent.trim()));
    if (!marks) continue;
    const row = marks.parentElement?.parentElement;   // Marks wraps its badge in a div
    if (!row) continue;
    // Everything on the row, the marks badge included. Measuring one chip
    // against the badge is not enough: a card carrying two topics overflows a
    // squeezed row on the pair of them, while the single-chip sum says it fits
    // — so the row wrapped, the rule stayed silent about why, and the failure
    // it did report named a width that was not the problem.
    const items = [...row.children].filter(laid);
    if (items.length < 2) continue;

    const cs = getComputedStyle(card);
    const cardRect = card.getBoundingClientRect();
    const cardInner = cardRect.width
      - parseFloat(cs.paddingLeft || 0) - parseFloat(cs.paddingRight || 0);

    const gap = parseFloat(getComputedStyle(row).columnGap || 8) || 8;
    // Any indent the row carries is space the chips cannot use.
    const indent = parseFloat(getComputedStyle(row).paddingLeft || 0) || 0;

    const rects = items.map(el => el.getBoundingClientRect());
    const needs = rects.reduce((a, r) => a + r.width, 0) + gap * (items.length - 1) + indent;

    // On one line if every item's vertical span overlaps every other's.
    //
    // NOT by comparing top. The topic chip has less vertical padding than the
    // marks badge, so two items sitting on the same centred line report tops
    // 2px apart — and bucketing those tops reported a second line that is not
    // on screen. It failed 13 of 30 cards at 320px and 16 at 1440px, every one
    // of them correct, which would have had someone "fixing" working layout to
    // satisfy it. Overlap asks the question the eye asks.
    //
    // No backticks in here: this whole probe is a template literal, and a
    // backtick in a comment ends it. That has now cost this project twice.
    const sameLine = Math.max(...rects.map(r => r.top)) < Math.min(...rects.map(r => r.bottom));

    out.push({
      label: (card.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 40),
      cardInner: Math.round(cardInner),
      rowWidth: Math.round(row.getBoundingClientRect().width),
      items: items.length,
      needs: Math.round(needs),
      sameLine,
    });
  }
  return JSON.stringify(out);
})()`;

/** Put a year's questions on screen, whichever way the filters appear. */
async function browseAYear({ evaluate, click, sleep }) {
  await click(`[...document.querySelectorAll('button')].filter(${LAID})
    .find(b => /Open Filters|^Filters$/.test((b.textContent||'').trim()))`);
  await sleep(1000);
  await click(`[...document.querySelectorAll('label')].filter(${LAID})
    .find(e => e.textContent.trim() === '2024')`);
  await sleep(1500);
  await click(`[...document.querySelectorAll('button')].filter(${LAID})
    .find(b => /^Show \\d+|^Done$|^Close$/.test((b.textContent||'').trim()))`);
  await sleep(2000);
  return Number(await evaluate(
    `[...document.querySelectorAll('button')].filter(${LAID})
       .filter(b => /^\\+?\\s*Add$/.test((b.textContent||'').trim())).length`));
}

for (const [where, width, height] of WIDTHS) {
  await withPage({ port: 8168, cdp: 9268, width, height }, async page => {
    const { evaluate, click, go, sleep } = page;
    await go('/explorer?c=n5', 4500);

    const adds = await browseAYear(page);
    t.check(adds > 0, `${where} ${width}px · a year's questions are on screen (${adds})`);
    if (!adds) return;

    // ── the browse card ────────────────────────────────────────────────────
    const browse = JSON.parse(await evaluate(MEASURE('[class*="rounded-xl"]')));
    t.check(browse.length > 0, `${where} · browse cards measured (${browse.length})`);
    const browseBad = browse.filter(c => !c.sameLine && c.needs <= c.cardInner);
    t.check(browseBad.length === 0,
      `${where} · every browse card's chip row fits one line where the card has room` +
      (browseBad.length ? ` — ${browseBad.length} do not, e.g. needs ${browseBad[0].needs}px ` +
        `of ${browseBad[0].cardInner}px available but the row is ${browseBad[0].rowWidth}px` : ''));

    // ── the checkout card ──────────────────────────────────────────────────
    for (let i = 0; i < 2; i++) {
      await click(`[...document.querySelectorAll('button')].filter(${LAID})
        .filter(b => /^\\+?\\s*Add$/.test((b.textContent||'').trim()))[${i}]`);
      await sleep(700);
    }
    await click(`[...document.querySelectorAll('button')].filter(${LAID})
      .find(b => /My Worksheet/.test((b.textContent||'').trim()))`);
    await sleep(2500);

    const checkout = JSON.parse(await evaluate(MEASURE('.worksheet-question')));
    t.check(checkout.length > 0, `${where} · checkout cards measured (${checkout.length})`);
    const checkoutBad = checkout.filter(c => !c.sameLine && c.needs <= c.cardInner);
    t.check(checkoutBad.length === 0,
      `${where} · every checkout card's chip row fits one line where the card has room` +
      (checkoutBad.length ? ` — ${checkoutBad.length} do not, e.g. needs ${checkoutBad[0].needs}px ` +
        `of ${checkoutBad[0].cardInner}px available but the row is ${checkoutBad[0].rowWidth}px` : ''));

    // Nothing may push the page sideways at any width.
    const doc = Number(await evaluate('document.documentElement.scrollWidth'));
    t.check(doc <= width, `${where} · the page does not scroll sideways (${doc}px of ${width}px)`);
  });
}

t.done('a question card\'s header holds its shape at every width');
