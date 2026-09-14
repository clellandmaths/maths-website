/**
 * The worksheet's own toggles, at a phone width as well as a desk one.
 *
 *   npm run build && node scripts/check-worksheet-toggles.mjs
 *
 * **Not in `build`** — it needs headless Chrome and the Cloudflare image has none.
 *
 * Someone who builds a sheet in the Explorer and then works through it there —
 * not printing it, not sharing it — should be able to see everything full
 * screen and focus mode would show them. Answers, QR codes and hints are
 * toggles; the video, formulae, markscheme and data booklet are per-question
 * buttons on the row itself.
 *
 * **Hints existed and were unreachable on a phone.** The toolbar carrying that
 * toggle is `hidden lg:block`, and the mobile bottom bar had only Answers and
 * QR — so below 1024px there was no way to turn hints on at all. That is a
 * whole class of fault a desktop-only check cannot see, which is why this runs
 * the same assertions at two widths.
 *
 * 1024px is the `lg:` breakpoint, so 1280 gets the desktop toolbar and 390 —
 * an iPhone in portrait — gets the bottom bar.
 */
import { withPage, tally } from './browser-drive.mjs';

const t = tally();

/** Every toggle the worksheet should offer, whatever the width. */
const TOGGLES = ['Show answers', 'QR codes', 'Hints'];
const MOBILE = ['Answers', 'QR', 'Hints'];

for (const [label, width, wanted] of [['desktop', 1280, TOGGLES], ['phone', 390, MOBILE]]) {
  await withPage({ port: 8139, cdp: 9239, width, height: 900 }, async ({ evaluate, click, buttonNamed, buttonMatching, labelNamed, go, sleep }) => {
    await go('/explorer?c=n5', 4000);

    /* A question on the sheet, so the worksheet tab has something in it.

       **The filter sidebar is `hidden lg:block`.** Below 1024px it lives behind
       a "Filters" button in a full-screen overlay, so clicking the topic label
       straight away finds nothing at 390px — and then every later assertion
       fails against an empty sheet rather than against the thing being tested. */
    if (width < 1024) {
      await click(buttonMatching(/^Filters$/));
      await sleep(1200);
    }
    await click(labelNamed('Fractions'));
    await sleep(2500);
    if (width < 1024) {
      // Close the overlay so the grid behind it is reachable.
      await click(`[...document.querySelectorAll('button')]
        .find(b => /^(Done|Close|Show|Apply)/i.test(b.textContent || '')) ||
        document.querySelector('[aria-label="Close filters"]')`);
      await sleep(1200);
    }
    await click(buttonNamed('Add'));
    await sleep(800);
    await click(buttonMatching(/My Worksheet/));
    await sleep(1800);

    /** A toggle counts only if it is actually on screen at this width. */
    const visible = await evaluate(`(() => {
      const on = el => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden';
      };
      return [...document.querySelectorAll('label')]
        .filter(l => l.querySelector('input[type=checkbox]') && on(l))
        .map(l => l.textContent.trim());
    })()`);

    for (const name of wanted) {
      t.check((visible ?? []).includes(name), `${label} ${width}px · "${name}" is reachable`);
    }

    // And the hints toggle does something: turning it on shows the ladder.
    const before = await evaluate(`/what it asks/i.test(document.body.innerText)`);
    t.check(!before, `${label} · hints are off to begin with`);

    await click(labelNamed(wanted[2]));
    await sleep(1500);
    await click(`[...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Hint')`);
    await sleep(2500);
    t.check(await evaluate(`/what it asks/i.test(document.body.innerText)`),
      `${label} · turning Hints on gives the hint ladder`);
  });
}

t.done('the worksheet offers its toggles at any width');
