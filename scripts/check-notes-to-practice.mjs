/**
 * Reading to working in one click, and back again. Driven in a real browser.
 *
 *   npm run build && node scripts/check-notes-to-practice.mjs
 *
 * **Not in `build`** — it needs headless Chrome and the Cloudflare image has none.
 *
 * A notes topic ends with "Ready to practise?". That used to land on the
 * practice page, which is another page of links before any maths happens. It
 * now opens the questions full screen, and carries where the pupil came from so
 * they can get back to it.
 *
 * What has to be true:
 *
 *   1. the notes link carries `full=1` and the topic it came from
 *   2. arriving there opens the full-screen presenter without another click
 *   3. the way back is **inside** the presenter
 *   4. and **also on the page behind it**, because closing the mode drops a
 *      pupil there and would otherwise strand them one step from what they
 *      were reading
 *   5. it goes back to the right notes topic
 *   6. the practice page on its own — no query — is completely unchanged: no
 *      presenter, no back link
 *
 * Point 6 is the one that matters most. Every practice topic on the site
 * renders this component, so an enhancement that leaks into the plain page
 * would change 137 pages across five courses.
 */
import { withPage, tally } from './browser-drive.mjs';

const t = tally();

/** A notes topic with practice behind it, and the topic its link should reach. */
const NOTES = '/course/n5/notes/algebra/quadratic-graphs';

await withPage({ port: 8134, cdp: 9234 }, async ({ evaluate, click, go, sleep }) => {
  // ── 1. the link ─────────────────────────────────────────────────────────
  await go(NOTES, 2500);
  const href = await evaluate(
    `[...document.querySelectorAll('a')].map(a => a.getAttribute('href'))
       .find(h => h && h.includes('/practice/')) ?? null`);
  t.check(!!href, `the notes topic links to practice: ${JSON.stringify(href)}`);
  t.check(!!href && href.includes('full=1'), 'the link asks for full screen');
  t.check(!!href && /from=[a-z0-9-]+\/[a-z0-9-]+/.test(href),
    'and carries the topic it came from');

  // ── 6. the plain page first, so a leak shows up as a failure here ───────
  await go('/course/n5/practice/quadratics', 2500);
  const plain = await evaluate(`({
    presenter: !!document.querySelector('.fixed.inset-0'),
    back: /back to the notes/i.test(document.body.innerText),
  })`);
  t.check(!plain?.presenter, 'the practice page on its own does not open full screen');
  t.check(!plain?.back, 'and shows no back link');

  // ── 2-4. arriving from the notes ────────────────────────────────────────
  await go(href, 3500);
  const arrived = await evaluate(`({
    presenter: !!document.querySelector('.fixed.inset-0'),
    question: /Question \\d+ of \\d+/.test(document.body.innerText),
    back: [...document.querySelectorAll('a')]
      .filter(a => /back to the notes/i.test(a.textContent || ''))
      .map(a => a.getAttribute('href')),
  })`);
  t.check(arrived?.presenter, 'arriving from the notes opens full screen');
  t.check(arrived?.question, 'and it is showing a question');
  t.check((arrived?.back?.length ?? 0) >= 1, 'the way back is inside the presenter');
  t.check(arrived?.back?.[0] === NOTES,
    `and points at the topic it came from: ${JSON.stringify(arrived?.back?.[0])}`);

  // ── 4. still there once the mode is closed ──────────────────────────────
  await click(`[...document.querySelectorAll('button')]
    .find(b => /close/i.test(b.textContent || ''))`);
  await sleep(1200);
  const closed = await evaluate(`({
    presenter: !!document.querySelector('.fixed.inset-0'),
    back: [...document.querySelectorAll('a')]
      .filter(a => /back to the notes/i.test(a.textContent || ''))
      .map(a => a.getAttribute('href')),
  })`);
  t.check(!closed?.presenter, 'closing full screen leaves the practice page');
  t.check(closed?.back?.[0] === NOTES, 'and the way back is still on it');

  // ── 5. it actually goes there ───────────────────────────────────────────
  await click(`[...document.querySelectorAll('a')]
    .find(a => /back to the notes/i.test(a.textContent || ''))`);
  await sleep(2500);
  const where = await evaluate(`location.pathname`);
  t.check(where === NOTES, `back on the notes topic: ${JSON.stringify(where)}`);

  // ── a fabricated origin is refused ──────────────────────────────────────
  await go('/course/n5/practice/quadratics?full=1&from=https:%2F%2Fevil.example', 2500);
  const forged = await evaluate(`[...document.querySelectorAll('a')]
    .filter(a => /back to the notes/i.test(a.textContent || '')).length`);
  t.check(forged === 0, 'a `from` that is not two path segments is refused');
});

t.done('notes go straight to practice, and practice knows the way back');
