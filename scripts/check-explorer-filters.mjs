/**
 * Changing a filter puts you back at the top of the list. In a real browser.
 *
 *   npm run build && node scripts/check-explorer-filters.mjs
 *
 * **Not in `build`** — it needs headless Chrome and the Cloudflare image has none.
 *
 * Reported as "unchecking a topic leaves you hanging awkwardly", and it did.
 * The Explorer's question list is the whole document, so when a filter removes
 * questions the document gets shorter and the browser clamps your scroll
 * position to whatever is left — which is the END of the new list. Measured on
 * four years of National 5, scrolled to the bottom, unticking one year took
 * `scrollY` from 25,136 to 19,561: the last row of a shorter list, with the
 * questions that had been on screen gone.
 *
 * The page already had this fix for a different trigger — switching between
 * Browse and Worksheet scrolls to the top, because the old position stopped
 * meaning anything the moment the content under it changed. A filter change is
 * the same event.
 *
 * Both directions are checked. Unticking is what was reported; ticking has the
 * same fault in reverse, because the new questions arrive above where you are
 * standing and are never seen.
 */
import { withPage, tally } from './browser-drive.mjs';

const t = tally();

await withPage({ port: 8167, cdp: 9267, width: 1600, height: 1000 }, async ({ evaluate, click, go, sleep }) => {
  /** Tick or untick one of the sidebar's year boxes. */
  const toggleYear = async (year) => {
    const hit = await click(`[...document.querySelectorAll('label,button')]
      .find(e => e.textContent.trim() === '${year}')`);
    await sleep(1800);
    return hit;
  };

  const state = () => evaluate(`({
    cards: document.querySelectorAll('.question-card').length,
    scrollY: Math.round(scrollY),
    maxScroll: Math.round(document.documentElement.scrollHeight - innerHeight),
  })`);

  await go('/explorer?c=n5', 7000);

  for (const year of ['2024', '2023', '2022', '2019']) await toggleYear(year);
  const wide = await state();
  t.check(wide.cards > 60, `four years of questions on the page (${wide.cards})`);

  /* A list long enough that the fault is visible. If the page fits the viewport
     there is no scroll position to lose and the check would pass on anything. */
  t.check(wide.maxScroll > 5000,
    `the list is ${wide.maxScroll}px longer than the window, so there is a position to lose`);

  await evaluate(`scrollTo(0, document.documentElement.scrollHeight)`);
  await sleep(900);
  const atBottom = await state();
  t.check(atBottom.scrollY > 5000, `scrolled to the bottom of it (${atBottom.scrollY}px)`);

  // ── the reported fault ──────────────────────────────────────────────────
  await toggleYear('2024');
  const afterUntick = await state();
  t.check(afterUntick.cards < wide.cards,
    `unticking a year removed questions (${wide.cards} to ${afterUntick.cards})`);
  t.check(afterUntick.scrollY === 0,
    `and put the list back at the top, not at the end of it (scrollY ${afterUntick.scrollY})`);

  // ── and the same in reverse ─────────────────────────────────────────────
  await evaluate(`scrollTo(0, document.documentElement.scrollHeight)`);
  await sleep(900);
  t.check((await state()).scrollY > 5000, 'scrolled to the bottom again');

  await toggleYear('2024');
  const afterTick = await state();
  t.check(afterTick.cards > afterUntick.cards,
    `ticking it back added them (${afterUntick.cards} to ${afterTick.cards})`);
  t.check(afterTick.scrollY === 0,
    `and that starts at the top too — the new questions are above you (scrollY ${afterTick.scrollY})`);
});

t.done('changing a filter puts you back at the top of the list');
