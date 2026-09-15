/**
 * The round trip between a course and the Topic Explorer. In a real browser.
 *
 *   npm run build && node scripts/check-course-explorer.mjs
 *
 * **Not in `build`** — it needs headless Chrome and the Cloudflare image has none.
 *
 * It used to be one-way and hard to find. The course page linked to the
 * Explorer from a card below the entire paper archive — twenty-odd cards of
 * scrolling — and the Explorer linked back to nothing at all: no breadcrumb, no
 * `CourseTabs`, and a "Change Course" button that changes the course rather
 * than leaving it. `docs/navigation.md` had recorded the second half as
 * "/explorer has no breadcrumb and no course identity".
 *
 * **Deliberately not a fourth `CourseTabs` tab.** Measured, that row has 32px
 * of slack at 320px and "Explorer" is one word that cannot wrap, so a fourth
 * tab re-creates the horizontal scroll the comment in `CourseTabs.tsx` exists
 * to prevent. Hence a pair of ordinary controls, and hence the overflow
 * assertions at the bottom of this file: adding a control to either of these
 * two rows is exactly how that fault comes back.
 *
 * One name is checked too. The tool answered to "Explorer" in the navbar,
 * "Topic Explorer" in the footer and its own heading, and "Practise by topic"
 * on the course page. Three names for one tool is why nobody built a model of
 * it, so the name is now an assertion rather than a convention.
 */
import { withPage, tally } from './browser-drive.mjs';

const t = tally();

await withPage({ port: 8177, cdp: 9277, width: 1280, height: 900 }, async ({ evaluate, click, go, sleep }) => {
  // ── course page → Explorer, without scrolling the archive ───────────────
  await go('/course/n5', 4000);

  /* Scoped to `main`. The navbar now says "Topic Explorer" too — that is the
     point of the rename — so an unscoped sweep finds the navbar link at 12px
     from the top and checks that instead, which passed the "above the papers"
     assertion for entirely the wrong reason. */
  const wayIn = await evaluate(`(() => {
    const a = [...document.querySelectorAll('main a')]
      .filter(x => /topic explorer/i.test(x.textContent || ''))
      .map(x => ({ el: x, y: x.getBoundingClientRect().top + scrollY }))
      .sort((p, q) => p.y - q.y)[0];
    if (!a) return null;
    // The first paper card on the page — the thing you would have had to
    // scroll past to reach the old cross-link at the foot.
    const paper = [...document.querySelectorAll('button')]
      .find(b => /start paper/i.test(b.textContent || ''));
    return {
      href: a.el.getAttribute('href'),
      y: Math.round(a.y),
      paperY: paper ? Math.round(paper.getBoundingClientRect().top + scrollY) : null,
      count: [...document.querySelectorAll('main a')].filter(x => /topic explorer/i.test(x.textContent || '')).length,
    };
  })()`);

  t.check(!!wayIn, 'the course page offers a way into the Topic Explorer');
  t.check(wayIn?.href?.includes('c=n5'),
    `which carries the course rather than trusting localStorage (${wayIn?.href})`);
  /* The point of the change: findable without scrolling the archive. */
  t.check(wayIn?.paperY != null && wayIn.y < wayIn.paperY,
    `and sits above the papers, not below them (${wayIn?.y}px vs ${wayIn?.paperY}px)`);

  await click(`[...document.querySelectorAll('main a')]
    .filter(x => /topic explorer/i.test(x.textContent || ''))
    .sort((p, q) => p.getBoundingClientRect().top - q.getBoundingClientRect().top)[0]`);
  await sleep(5000);

  t.check(await evaluate(`location.pathname === '/explorer'`), 'it lands on the Explorer');
  t.check(await evaluate(`/National 5/i.test(document.body.innerText)`),
    'showing the course it came from');

  // ── and back again ──────────────────────────────────────────────────────
  const back = await evaluate(`(() => {
    const a = [...document.querySelectorAll('a')]
      .find(x => /back to national 5/i.test(x.textContent || ''));
    return a ? { href: a.getAttribute('href') } : null;
  })()`);
  t.check(!!back, 'the Explorer offers a way back to the course');
  t.check(back?.href === '/course/n5', `to that exact course (${back?.href})`);

  await click(`[...document.querySelectorAll('a')]
    .find(x => /back to national 5/i.test(x.textContent || ''))`);
  await sleep(4000);
  t.check(await evaluate(`location.pathname === '/course/n5'`),
    'and pressing it completes the round trip');

  /* ── one name ──────────────────────────────────────────────────────────
     Navigated explicitly rather than trusting the round trip above to have
     landed us here. Under a mutation that broke the trip, these ran against
     whatever page we were stranded on and passed for no reason — the third
     time this session that an assertion was true of the wrong document. */
  await go('/course/n5', 4000);
  const names = await evaluate(`(() => {
    const nav = [...document.querySelectorAll('a')]
      .filter(a => a.getAttribute('href') === '/explorer')
      .map(a => a.textContent.trim());
    return { nav, plain: nav.filter(n => /^Explorer$/.test(n)).length };
  })()`);
  t.check(names?.nav?.length > 0, `the navbar links to it (${JSON.stringify(names?.nav)})`);
  t.check(names?.plain === 0,
    'and nothing calls it bare "Explorer" any more — one name, everywhere');
  t.check(!(await evaluate(`/practise by topic/i.test(document.body.innerText)`)),
    'nor "Practise by topic", which was the third name for it');
});

/* ── the fault this shape was chosen to avoid ────────────────────────────
   Both new controls live in rows that have overflowed a phone before. A row
   here that cannot wrap pushes the document past the viewport, and a phone
   answers that by scaling the whole page down — which reads as a font bug. */
for (const width of [320, 390]) {
  await withPage({ port: 8178, cdp: 9278, width, height: 800 }, async ({ evaluate, go }) => {
    for (const path of ['/course/n5', '/explorer?c=n5']) {
      await go(path, 4000);
      const m = await evaluate(`({ doc: Math.round(document.documentElement.scrollWidth), vw: innerWidth })`);
      t.check(m.doc <= m.vw, `${width}px · ${path} still fits the phone (${m.doc}/${m.vw})`);
    }
  });
}

t.done('a course and the Topic Explorer are a round trip');
