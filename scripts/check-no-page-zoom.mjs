/**
 * The page never gets wider than the phone, whatever you press.
 *
 *   npm run build && node scripts/check-no-page-zoom.mjs
 *
 * **Not in `build`** — it needs headless Chrome and the Cloudflare image has none.
 *
 * A phone browser answers a document wider than its viewport by **scaling the
 * whole page down to fit**. Not clipping it, not scrolling it — shrinking it.
 * So a single control that cannot wrap makes every label, button and question
 * on the page render smaller, and it looks like a font bug rather than a layout
 * one. Reported as "the text changes size when I click a topic": ticking a
 * filter took the Explorer's document from 390px to **473px** on a 390px
 * screen, and the browser drew everything at 82%.
 *
 * Two things let that happen, and both are fixed:
 *
 *   - the toolbar it came from was `flex` with no `flex-wrap`, so it demanded
 *     its full width rather than folding onto a second line
 *   - **`<main>` was `flex-1` with no `min-w-0`**, and a flex item's default
 *     `min-width: auto` means it cannot shrink below its content — so one wide
 *     child pushed the whole document out
 *
 * `check-responsive.mjs` has a sideways-scroll rule, but it measures pages as
 * they load. This drives the interactions that change a page's width after it
 * has loaded, which is where this one lived.
 */
import { withPage, tally } from './browser-drive.mjs';

const t = tally();

/** Phone and small-phone. 320px is the narrowest the site targets. */
const WIDTHS = [['phone', 390, 844], ['small', 320, 720]];

for (const [where, width, height] of WIDTHS) {
  await withPage({ port: 8146, cdp: 9246, width, height }, async ({ evaluate, click, buttonMatching, labelNamed, go, sleep }) => {
    const span = () => evaluate(
      `({ inner: window.innerWidth, scroll: document.documentElement.scrollWidth })`);

    const widest = () => evaluate(`(() => {
      let worst = null;
      for (const el of document.querySelectorAll('body *')) {
        const b = el.getBoundingClientRect();
        if (!b.width || !b.height) continue;
        if (b.right > window.innerWidth + 1 && (!worst || b.right > worst.right)) {
          worst = { right: Math.round(b.right),
            cls: String(el.className?.baseVal ?? el.className ?? '').slice(0, 60),
            text: (el.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 40) };
        }
      }
      return worst;
    })()`);

    const fits = async (step) => {
      const s = await span();
      const over = s.scroll - s.inner;
      const w = await widest();
      t.check(over <= 1,
        `${where} ${width}px · ${step} — document ${s.scroll}px in a ${s.inner}px viewport` +
        (over > 1 ? ` · widest: ${w?.cls} ${JSON.stringify(w?.text)} to ${w?.right}px` : ''));
    };

    await go('/explorer?c=n5', 4000);
    await fits('on arrival');

    await click(buttonMatching(/^Filters$/));
    await sleep(1500);
    await fits('filter overlay open');

    // The interaction that was reported. One topic, then a second.
    await click(labelNamed('Percentages'));
    await sleep(2500);
    await fits('one topic ticked');

    await click(labelNamed('Surds'));
    await sleep(2000);
    await fits('two topics ticked');

    await click(buttonMatching(/^Show \d+ questions?$/));
    await sleep(2500);
    await fits('back on the question grid');

    // And with a sheet, where the worksheet toolbar appears.
    await click(buttonMatching(/^Add all \d+ to worksheet$/));
    await sleep(1800);
    await fits('questions added');

    await click(buttonMatching(/My Worksheet/));
    await sleep(2200);
    await fits('on the worksheet');
  });
}

t.done('nothing on the Explorer makes a phone shrink the page');
