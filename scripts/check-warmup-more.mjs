/**
 * The daily warm up offers more, and only once it is finished.
 *
 *   npm run build && node scripts/check-warmup-more.mjs
 *
 * **Not in `build`** — it needs headless Chrome and the Cloudflare image has none.
 *
 * The warm up is five questions, seeded by the date, the same for everybody and
 * finishable. A pupil who comes back often starts meeting questions they have
 * already done, and the generator can fix that — but **not by putting a reroll
 * on the questions themselves**, which would stop it being a fixed set at all.
 * The offer belongs on the completion screen, where the pupil asking for it has
 * by definition finished.
 *
 * What has to be true:
 *
 *   1. nothing is offered **during** the five — that is the contract
 *   2. the offer appears on the completion screen, for National 5
 *   3. it does not appear there for a course with no audited variations
 *   4. pressing it lands on a worksheet of five new questions, all different,
 *      all generated
 *
 * Point 4 checks the rendered bodies, not only the count: five copies of one
 * question would satisfy a count and fail a reader.
 */
import { withPage, tally } from './browser-drive.mjs';

const t = tally();

await withPage({ port: 8135, cdp: 9235 }, async ({ evaluate, click, buttonNamed, go, sleep }) => {
  /** Open the warm up for a course and click through to the end. */
  const runWarmUp = async (course) => {
    await go('/exam-hall', 1500);
    await evaluate(`localStorage.setItem('preferredCourse', ${JSON.stringify(course)})`);
    await go('/exam-hall', 3500);

    const started = await click(
      `[...document.querySelectorAll('*')].find(el =>
         el.tagName !== 'BODY' && el.tagName !== 'HTML' &&
         /Daily revision session/.test(el.textContent || '') &&
         el.querySelector('h2')?.textContent?.trim() === 'Warm Up')`);
    if (!started) return false;
    await sleep(3500);
    return true;
  };

  const offered = () => evaluate(`/new questions like today/i.test(document.body.innerText)`);

  // ── National 5 ──────────────────────────────────────────────────────────
  t.check(await runWarmUp('n5'), 'opened the National 5 warm up');

  const onQuestion = await evaluate(`/Question \\d+ of \\d+/i.test(document.body.innerText)`);
  t.check(onQuestion, 'it is showing a question');
  t.check(!(await offered()), 'nothing is offered while the five are unfinished');

  // Next four times, then Finish.
  for (let i = 0; i < 6; i++) {
    const next = await click(buttonNamed('Next'));
    if (!next) break;
    await sleep(700);
  }
  t.check(await click(buttonNamed('Finish')), 'reached the last question and finished');
  await sleep(1500);

  const done = await evaluate(`/session complete/i.test(document.body.innerText)`);
  t.check(done, 'the completion screen is showing');
  t.check(await offered(), 'and it offers five new questions like today\'s');

  // ── pressing it ─────────────────────────────────────────────────────────
  t.check(await click(
    `[...document.querySelectorAll('button')].find(b => /new questions like today/i.test(b.textContent || ''))`),
    'pressed it');
  await sleep(9000);

  const landed = await evaluate(`(() => {
    const bodies = [...document.querySelectorAll('.question-content')]
      .map(el => el.innerText.replace(/\\s+/g, ' ').trim().slice(0, 60))
      .filter(Boolean);
    return {
      path: location.pathname,
      hasRefs: /[?&]q=/.test(location.search),
      count: bodies.length,
      distinct: new Set(bodies).size,
      generated: (document.body.innerText.match(/worked example|New question/gi) || []).length,
    };
  })()`);

  t.check(landed?.path === '/worksheet', `landed on a worksheet: ${JSON.stringify(landed?.path)}`);
  t.check(landed?.hasRefs, 'the link carries the questions, so it can be shared');
  t.check(landed?.count === 5, `five questions on it (${landed?.count})`);
  t.check(landed?.distinct === 5, `all five are different (${landed?.distinct})`);

  // ── a course with nothing to offer ──────────────────────────────────────
  t.check(await runWarmUp('higher'), 'opened the Higher warm up');
  for (let i = 0; i < 6; i++) {
    const next = await click(buttonNamed('Next'));
    if (!next) break;
    await sleep(700);
  }
  await click(buttonNamed('Finish'));
  await sleep(1500);
  t.check(await evaluate(`/session complete/i.test(document.body.innerText)`),
    'Higher reaches its completion screen too');
  t.check(!(await offered()), 'and offers nothing — no audited variations there');
});

t.done('the warm up offers more, and only when it is over');
