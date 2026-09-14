/**
 * The Explorer's generate controls, driven in a real browser.
 *
 *   npm run build && node scripts/check-explorer-generate.mjs
 *
 * **Not in `build`** — it needs headless Chrome and the Cloudflare image has none.
 *
 * Five things, each one reported as wrong by someone using the site:
 *
 *   1. **"Build by skill" showed only when a topic filter was set.** It lived
 *      inside the topic-generate block and inherited its gate, so filtering by
 *      year alone hid the only link on the site to the by-skill builder — a
 *      page that does not care what the filter is.
 *   2. **It was a `text-xs` underline** in a row of buttons: the quietest thing
 *      in the toolbar, and the door to the more capable of the two builders.
 *   3. **The by-skill page was a dead end.** The only ways out were the course
 *      breadcrumb and "Go to your sheet", which does not appear until you have
 *      generated something.
 *   4. **A flat count across several topics** is a guess at something the
 *      teacher already knows. Past one topic it now asks how many of each.
 *   5. **"Add all to worksheet" had no counterpart** that adds a new question
 *      like each one instead of the originals.
 */
import { withPage, tally } from './browser-drive.mjs';

const t = tally();

await withPage({ port: 8138, cdp: 9238 }, async ({ evaluate, click, buttonNamed, buttonMatching, go, sleep }) => {
  const toolbar = () => evaluate(`(() => {
    const t = document.body.innerText;
    return {
      bySkill: [...document.querySelectorAll('a')]
        .filter(a => /build by skill/i.test(a.textContent || ''))
        .map(a => a.getAttribute('href')),
      varyEach: /Add a variation of each \\((\\d+)\\)/.exec(t)?.[1] ?? null,
      generate: /Generate (\\d+) new on this topic|Generate new on (\\d+) topics/.exec(t)?.[0] ?? null,
      addAll: /Add all (\\d+) to worksheet/.exec(t)?.[1] ?? null,
    };
  })()`);

  // ── 1 & 2. a year filter alone ──────────────────────────────────────────
  await go('/explorer?c=n5', 4000);
  await click(`[...document.querySelectorAll('label')].find(e => e.textContent.trim() === '2024')`);
  await sleep(2500);

  const byYear = await toolbar();
  t.check(byYear?.addAll !== null, `a year filter shows the toolbar (${byYear?.addAll} questions)`);
  t.check(byYear?.bySkill?.length === 1,
    'and "Build by skill" is there with no topic picked');
  t.check(byYear?.bySkill?.[0] === '/course/n5/generate',
    `pointing at the builder: ${JSON.stringify(byYear?.bySkill?.[0])}`);
  t.check(byYear?.varyEach !== null,
    `"Add a variation of each" offers a count (${byYear?.varyEach})`);
  // It is a styled control now, not a bare underline.
  const looksLikeAButton = await evaluate(`(() => {
    const a = [...document.querySelectorAll('a')].find(x => /build by skill/i.test(x.textContent || ''));
    if (!a) return null;
    const s = getComputedStyle(a);
    return { pad: parseFloat(s.paddingLeft), radius: parseFloat(s.borderRadius), size: parseFloat(s.fontSize) };
  })()`);
  t.check((looksLikeAButton?.pad ?? 0) >= 8 && (looksLikeAButton?.size ?? 0) >= 13,
    `and reads as a control, not a footnote (${looksLikeAButton?.size}px, ${looksLikeAButton?.pad}px padding)`);

  // ── 5. a variation of each ──────────────────────────────────────────────
  await click(`[...document.querySelectorAll('label')].find(e => e.textContent.trim() === '2024')`);
  await sleep(1200);
  await click(`[...document.querySelectorAll('label')].find(e => e.textContent.trim() === 'Fractions')`);
  await sleep(2500);

  const one = await toolbar();
  t.check(one?.generate?.includes('on this topic'),
    `one topic keeps the simple count: ${JSON.stringify(one?.generate)}`);

  t.check(await click(buttonMatching(/Add a variation of each/)), 'pressed "Add a variation of each"');
  await sleep(12000);
  const sheet = await evaluate(`(() => {
    let items = [];
    try { items = JSON.parse(sessionStorage.getItem('worksheet_n5') || '[]'); } catch {}
    const bodies = items.map(q => (q.question || '')
      .replace(/<[^>]+>/g, ' ').replace(/\\s+/g, ' ').trim().slice(0, 50));
    return { n: items.length, generated: items.filter(q => q.uid).length, distinct: new Set(bodies).size };
  })()`);
  t.check(sheet?.n === Number(one?.varyEach),
    `one new question per clonable question (${sheet?.n} of ${one?.varyEach})`);
  t.check(sheet?.generated === sheet?.n, 'all of them generated, none the original');
  t.check(sheet?.distinct === sheet?.n, `and all different (${sheet?.distinct})`);

  // ── 4. several topics asks how many of each ─────────────────────────────
  await go('/explorer?c=n5', 4000);
  for (const topic of ['Fractions', 'Surds']) {
    await click(`[...document.querySelectorAll('label')].find(e => e.textContent.trim() === ${JSON.stringify(topic)})`);
    await sleep(1500);
  }
  const many = await toolbar();
  t.check(many?.generate?.includes('topics'),
    `two topics ask rather than guess: ${JSON.stringify(many?.generate)}`);

  await click(buttonMatching(/Generate new on \d+ topics/));
  await sleep(1200);
  const panel = await evaluate(`(() => {
    const t = document.body.innerText;
    return {
      asks: /how many new questions on each/i.test(t),
      steppers: document.querySelectorAll('[aria-label^="One more "]').length,
      confirm: /Pick some|Generate \\d+/.test(t),
    };
  })()`);
  t.check(panel?.asks, 'the panel asks how many of each');
  t.check(panel?.steppers >= 2, `one stepper per topic (${panel?.steppers})`);
  t.check(panel?.confirm, 'and will not draw until something is picked');

  // Two on the first topic, one on the second.
  await click(`document.querySelectorAll('[aria-label^="One more "]')[0]`);
  await sleep(300);
  await click(`document.querySelectorAll('[aria-label^="One more "]')[0]`);
  await sleep(300);
  await click(`document.querySelectorAll('[aria-label^="One more "]')[1]`);
  await sleep(500);
  t.check(await evaluate(`/Generate 3\\b/.test(document.body.innerText)`),
    'the confirm button counts what was asked for');

  /* **The delta, not the total.** The sheet still holds what the earlier step
     put there — sessionStorage survives navigation within one browser — so
     asserting the total reads 14 and looks like a bug in the planner when the
     planner drew exactly the 3 it was asked for. */
  const held = await evaluate(
    `(() => { try { return JSON.parse(sessionStorage.getItem('worksheet_n5') || '[]').length; } catch { return -1; } })()`);

  await click(buttonMatching(/^Generate 3$/));
  await sleep(14000);
  const planned = await evaluate(`(() => {
    let items = [];
    try { items = JSON.parse(sessionStorage.getItem('worksheet_n5') || '[]'); } catch {}
    return { n: items.length, note: /Added \\d+/.test(document.body.innerText) };
  })()`);
  t.check(planned?.n - held === 3,
    `drew exactly what was asked for (${planned?.n} - ${held} = ${planned?.n - held})`);
  t.check(planned?.note, 'and said so');

  // ── 3. the by-skill page has a way back ─────────────────────────────────
  await go('/course/n5/generate', 3000);
  const back = await evaluate(`[...document.querySelectorAll('a')]
    .map(a => a.getAttribute('href')).filter(h => h && h.startsWith('/explorer'))`);
  t.check((back?.length ?? 0) > 0,
    `the by-skill page offers a way back without generating first: ${JSON.stringify(back?.[0])}`);
});

t.done('the Explorer asks before it guesses, and nothing is a dead end');
