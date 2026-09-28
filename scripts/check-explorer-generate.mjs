/**
 * The Explorer's generate controls, driven in a real browser.
 *
 *   npm run build && node scripts/check-explorer-generate.mjs
 *
 * **Not in `build`** — it needs headless Chrome and the Cloudflare image has none.
 *
 * Each one reported as wrong by someone using the site:
 *
 *   1. **"Build by skill" is gone** (the owner, 2026-09-28: "Build by skill is
 *      too much"), and nothing in the toolbar links to it.
 *   2. **Nothing reads as cut off.** "Generate new on 2 topics…" ended in an
 *      ellipsis meaning "opens a panel", and it read as a label truncated; the
 *      filter chips were cut at 25 characters. The button says "Generate new
 *      questions", with an arrow when it opens a panel, and the chips carry the
 *      whole name.
 *   4. **A flat count across several topics** is a guess at something the
 *      teacher already knows. Past one topic it asks how many of each.
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
      generate: /Generate new questions/.test(t),
      count: Boolean(document.getElementById('gen-count')),
      opens: [...document.querySelectorAll('button[aria-expanded]')]
        .some(b => /Generate new questions/.test(b.textContent || '')),
      ellipsis: [...document.querySelectorAll('button')]
        .map(b => (b.textContent || '').trim())
        .some(s => s.endsWith('…') || s.endsWith('...')),
      addAll: /Add all (\\d+) to worksheet/.exec(t)?.[1] ?? null,
    };
  })()`);

  // ── 1 & 2. a year filter alone ──────────────────────────────────────────
  await go('/explorer?c=n5', 4000);
  await click(`[...document.querySelectorAll('label')].find(e => e.textContent.trim() === '2024')`);
  await sleep(2500);

  const byYear = await toolbar();
  t.check(byYear?.addAll !== null, `a year filter shows the toolbar (${byYear?.addAll} questions)`);
  t.check(byYear?.bySkill?.length === 0, 'and no "Build by skill" link');
  t.check(byYear?.varyEach !== null,
    `"Add a variation of each" offers a count (${byYear?.varyEach})`);

  // ── 5. a variation of each ──────────────────────────────────────────────
  await click(`[...document.querySelectorAll('label')].find(e => e.textContent.trim() === '2024')`);
  await sleep(1200);
  await click(`[...document.querySelectorAll('label')].find(e => e.textContent.trim() === 'Fractions')`);
  await sleep(2500);

  const one = await toolbar();
  t.check(one?.generate && one?.count && !one?.opens,
    `one topic keeps the simple count, with no panel: ${JSON.stringify(one)}`);

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
  t.check(many?.generate && many?.opens && !many?.count,
    `several topics open a panel instead, marked with an arrow: ${JSON.stringify(many)}`);
  t.check(!many?.ellipsis, 'no button label ends in an ellipsis');
  t.check(await evaluate(`[...document.querySelectorAll('button')]
      .some(b => (b.textContent || '').trim() === 'Rationalising the denominator')`),
    'the filter chips carry the whole subtopic name');

  await click(buttonMatching(/Generate new questions/));
  await sleep(1200);
  const panel = await evaluate(`(() => {
    const t = document.body.innerText;
    return {
      asks: /how many new questions on each/i.test(t),
      explains: /set a whole topic, or the kinds under it/i.test(t),
      kinds: /Surds\\s*·\\s*2 kinds/i.test(t),
      topicSteppers: document.querySelectorAll('[aria-label="One more Surds"]').length,
      kindSteppers: document.querySelectorAll('[aria-label="One more Simplifying surds"]').length,
      confirm: /Pick some|Generate \\d+/.test(t),
    };
  })()`);
  t.check(panel?.asks, 'the panel asks how many of each');
  t.check(panel?.explains, 'and says you can set a topic or the kinds under it');
  t.check(panel?.kinds, 'Surds is labelled as 2 kinds');
  t.check(panel?.topicSteppers === 1, 'the topic itself has a stepper');
  t.check(panel?.kindSteppers === 1, 'and so does each kind under it');
  t.check(panel?.confirm, 'and it will not draw until something is picked');

  /* "Three surds" without saying which kind: press the topic three times and
     the split lands 2 and 1, not 3 and 0. */
  for (let i = 0; i < 3; i++) {
    await click(`document.querySelector('[aria-label="One more Surds"]')`);
    await sleep(300);
  }
  const spread = await evaluate(`(() => {
    const v = name => {
      const b = document.querySelector('[aria-label="One more ' + name + '"]');
      return b ? Number(b.previousElementSibling.textContent.trim()) : null;
    };
    return {
      simplifying: v('Simplifying surds'),
      rationalising: v('Rationalising the denominator'),
      total: v('Surds'),
    };
  })()`);
  t.check(spread?.total === 3, `three on the topic (${spread?.total})`);
  t.check(spread?.simplifying === 2 && spread?.rationalising === 1,
    `spread across its kinds rather than piled on one (${spread?.simplifying} and ${spread?.rationalising})`);

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
});

t.done('the Explorer asks before it guesses, and no control reads as cut off');
