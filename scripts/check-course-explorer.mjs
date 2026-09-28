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
 * **Since 2026-09-28 the course bar carries it both ways** (`CourseBar`,
 * docs/navigation.md). The Explorer is a tab of every course page, and the
 * Explorer carries the same bar, whose Overview tab is the way back. It
 * replaced a pair of stop-gap controls ("Open the Topic Explorer" above the
 * archive, "Back to National 5" in the Explorer). Below `lg` its six sections
 * sit behind one Menu button rather than scrolling sideways, and the overflow
 * assertions at the bottom hold the page and the bar to the phone's width.
 *
 * **The Explorer is `/course/<id>/explorer` since 2026-09-28**, built with its
 * course. `/explorer?c=<id>` still works: it is forwarded there.
 *
 * One name is checked too. The tool answered to "Explorer" in the navbar,
 * "Topic Explorer" in the footer and its own heading, and "Practise by topic"
 * on the course page. Three names for one tool is why nobody built a model of
 * it, so the name is now an assertion rather than a convention.
 */
import { withPage, tally } from './browser-drive.mjs';

const t = tally();

await withPage({ port: 8177, cdp: 9277, width: 1280, height: 900 }, async ({ evaluate, click, go, sleep }) => {
  // ── course → Explorer, from the course bar, on the first screen ─────────
  /* The course bar's own links, not the navbar's: the navbar says "Topic
     Explorer" too, and an unscoped sweep once checked the navbar link instead
     and passed for the wrong reason. */
  const barLink = name => `[...document.querySelectorAll('nav[aria-label$="sections"] a')]
    .find(x => (x.textContent || '').trim() === ${JSON.stringify(name)})`;

  for (const page of ['/course/n5', '/course/n5/papers']) {
    await go(page, 4000);
    const wayIn = await evaluate(`(() => {
      const a = ${barLink('Topic Explorer')};
      return a ? { href: a.getAttribute('href'), y: Math.round(a.getBoundingClientRect().top), vh: innerHeight } : null;
    })()`);
    t.check(!!wayIn, `${page}: the course bar offers the Topic Explorer`);
    t.check(wayIn?.href === '/course/n5/explorer',
      `which is that course's own Explorer rather than trusting localStorage (${wayIn?.href})`);
    t.check(wayIn && wayIn.y < wayIn.vh, `and it is on the first screen (${wayIn?.y}px of ${wayIn?.vh}px)`);
  }

  await click(barLink('Topic Explorer'));
  await sleep(5000);

  t.check(await evaluate(`location.pathname === '/course/n5/explorer'`), 'it lands on the Explorer');
  t.check(await evaluate(`(document.querySelector('nav[aria-label$="sections"] summary')?.textContent || '').trim() === 'National 5'`),
    'showing the course it came from, in its own course bar');

  // ── and back again ──────────────────────────────────────────────────────
  const back = await evaluate(`(() => { const a = ${barLink('Overview')}; return a ? { href: a.getAttribute('href') } : null; })()`);
  t.check(!!back, 'the Explorer offers a way back to the course');
  t.check(back?.href === '/course/n5', `to that exact course (${back?.href})`);

  await click(barLink('Overview'));
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
    for (const path of ['/course/n5', '/course/n5/papers', '/course/n5/explorer', '/course/n5/exam-hall', '/explorer?c=n5']) {
      await go(path, 4000);
      const m = await evaluate(`({ doc: Math.round(document.documentElement.scrollWidth), vw: innerWidth })`);
      t.check(m.doc <= m.vw, `${width}px · ${path} still fits the phone (${m.doc}/${m.vw})`);
      const scrolls = await evaluate(`[...document.querySelectorAll('nav[aria-label$="sections"] *')]
        .filter(e => e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflowX !== 'visible').length`);
      t.check(scrolls === 0, `and nothing in its course bar scrolls sideways (${scrolls})`);
    }
  });
}

t.done('a course and the Topic Explorer are a round trip');
