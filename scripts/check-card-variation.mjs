/**
 * The question card's two faces, driven in a real browser.
 *
 *   npm run build && node scripts/check-card-variation.mjs
 *
 * **Not in `build`.** It needs headless Chrome and the Cloudflare image has
 * none — the same reason `check-responsive.mjs` sits outside the build.
 *
 * A card in the Explorer shows a past paper question and can swap to a freshly
 * generated one modelled on it. The thing worth proving is what the swap
 * changed: the old button drew a question and put it straight in the basket, so
 * a teacher found out what they had added on another tab. Now it is shown
 * first, and **looking must not add**.
 *
 * What this drives, on one card:
 *
 *   1. the filter, because the grid renders nothing until one is set
 *   2. Variation  — the face swaps, names the paper it is based on, and offers
 *                   Another / Add 5 like it / Exam question
 *   3. Another    — a genuinely different question, not the same one again
 *   4. Exam question — back to where it started
 *   5. the basket is still empty, which is the whole point
 *   6. Add 5 like it — five on the sheet, five distinct uids, and five distinct
 *      question bodies. Uids alone would pass on five copies of one question
 *      with different seeds, which is the repeat the exclude set exists to
 *      prevent, so the bodies are compared too.
 *
 * Topics in the sidebar are `<label>`s. The first version of this looked for a
 * button, found nothing, and then reported nine failures against an unfiltered
 * empty page — so the filter is asserted before anything else is read.
 */
import { withPage, tally } from './browser-drive.mjs';

const t = tally();

await withPage({ port: 8132, cdp: 9232 }, async ({ evaluate, click, buttonNamed, go, sleep }) => {
  await go('/explorer?c=n5', 4000);

  // "Fractions" has one subtopic, and FilterSidebar collapses a one-subtopic
  // topic to a flat checkbox — so this label is the subtopic.
  const ticked = await click(
    `[...document.querySelectorAll('label')].find(e => e.textContent.trim() === 'Fractions')`);
  t.check(ticked, 'clicked the Fractions filter');
  await sleep(2500);

  const showing = await evaluate(
    `(document.body.innerText.split('Showing ')[1] || '').split(' questions')[0]`);
  t.check(Number(showing) > 0, `sidebar reports "Showing ${showing} questions"`);

  const card = () => evaluate(`(() => {
    const c = document.querySelector('.question-card')?.closest('div.bg-card');
    if (!c) return null;
    const t = c.innerText;
    return {
      first: t.split('\\n')[0],
      body: (c.querySelector('.question-card')?.innerText ?? '')
        .replace(/\\s+/g, ' ').trim().slice(0, 70),
      isNew: /new question/i.test(t),
      basedOn: /based on \\d{4} P\\d Q\\d/i.test(t),
      controls: ['Another', 'Add 5 like it', 'Exam question'].every(s => t.includes(s)),
      height: Math.round(c.getBoundingClientRect().height),
    };
  })()`);

  const exam = await card();
  t.check(/\d{4} Paper \d Q/.test(exam?.first ?? ''),
    `exam face shows a paper label: ${JSON.stringify(exam?.first)}`);

  // ── the swap ────────────────────────────────────────────────────────────
  t.check(await click(buttonNamed('Variation')), 'pressed Variation');
  await sleep(3500);

  const one = await card();
  t.check(one?.isNew, 'the face is labelled "New question"');
  t.check(one?.basedOn, 'and names the paper it is modelled on');
  t.check(one?.controls, 'Another / Add 5 like it / Exam question are all there');
  t.note(`showing: ${JSON.stringify(one?.body)}`);
  t.note(`card height ${exam?.height}px -> ${one?.height}px, which is why this is a`);
  t.note('cross-fade and not a flip: nothing in the grid has a fixed height');

  await click(buttonNamed('Another'));
  await sleep(3000);
  const two = await card();
  t.check(!!two?.body && two.body !== one?.body, 'Another drew a different question');
  t.note(`then:    ${JSON.stringify(two?.body)}`);

  await click(buttonNamed('Exam question'));
  await sleep(1200);
  const back = await card();
  t.check(!back?.isNew && back?.first === exam?.first,
    `back to the exam question: ${JSON.stringify(back?.first)}`);

  // ── looking must not add ────────────────────────────────────────────────
  const basket = await evaluate(
    `(() => { try { return JSON.parse(sessionStorage.getItem('worksheet_n5') || '[]').length; } catch { return -1; } })()`);
  t.check(basket === 0, `sheet still empty after looking at two variations (${basket})`);

  // ── Add 5 like it ───────────────────────────────────────────────────────
  await click(buttonNamed('Variation'));
  await sleep(3000);
  await click(buttonNamed('Add 5 like it'));
  await sleep(7000);

  const sheet = await evaluate(`(() => {
    let items = [];
    try { items = JSON.parse(sessionStorage.getItem('worksheet_n5') || '[]'); } catch {}
    const bodies = items.map(q => (q.question || '')
      .replace(/<[^>]+>/g, ' ').replace(/\\s+/g, ' ').trim().slice(0, 60));
    return {
      n: items.length,
      uids: new Set(items.map(q => q.uid).filter(Boolean)).size,
      distinct: new Set(bodies).size,
      face: (document.querySelector('.question-card')
        ?.closest('div.bg-card')?.innerText ?? '').split('\\n')[0],
    };
  })()`);

  t.check(sheet?.n === 5, `Add 5 put five questions on the sheet (${sheet?.n})`);
  t.check(sheet?.uids === 5, `five distinct uids (${sheet?.uids})`);
  t.check(sheet?.distinct === 5, `five genuinely different questions (${sheet?.distinct})`);
  t.check(!/new question/i.test(sheet?.face ?? 'new question'),
    `card returned to the exam question: ${JSON.stringify(sheet?.face)}`);
});

t.done('the card shows a variation before it adds one');
