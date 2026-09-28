/**
 * Test mode: a worksheet whose questions give nothing away before they are read.
 *
 *   npm run build && node scripts/check-test-mode.mjs
 *
 * **Not in `build`**: it needs headless Chrome.
 *
 * The owner, 2026-09-28: "a button on worksheets that is test mode for teachers
 * so that when they print the pdf paper or share it they can choose to just
 * display the question number and marks with no header giving away the topic".
 *
 * Three things name a question on a card, and all three must go: the topic
 * tags, the caption ("2024 Paper 1 Q3"), and the badge a past paper question
 * carries inside its own text ("2024 P1 Q3"). That last one is the easy one to
 * miss, since it is part of the question rather than the header. The number and
 * the marks must stay, or it is not a test paper either.
 *
 * Also held: a generated card no longer repeats its topic as a variation name
 * with a "New question" badge beside the grey tags ("once is fine, the grey
 * one"), and the toolbar says "Full screen", not "Present".
 */
import { withPage, tally } from './browser-drive.mjs';

const t = tally();

const CARDS = `[...document.querySelectorAll('.worksheet-question')]`;
/** What a pupil could read off the cards about where each question came from. */
const GIVEAWAYS = `(() => {
  const cards = ${CARDS};
  return {
    cards: cards.length,
    tags: cards.reduce((n, c) => n + c.querySelectorAll('.topic-tag').length, 0),
    captions: cards.filter(c => /[0-9]{4} Paper [0-9] Q[0-9]/.test(c.firstElementChild?.innerText ?? '')).length,
    badges: cards.filter(c => /[0-9]{4} P[0-9] Q[0-9]/.test(c.querySelector('.question-content')?.innerText ?? '')).length,
    newQuestion: cards.filter(c => /New question/.test(c.firstElementChild?.innerText ?? '')).length,
    marks: cards.filter(c => c.querySelector('.q-marks')).length,
  };
})()`;

await withPage({ port: 8179, cdp: 9279, width: 1600, height: 1000 }, async ({ evaluate, click, go, sleep, labelNamed, buttonNamed }) => {
  // Past paper questions, then one generated alongside each Surds question.
  await go('/explorer?c=n5&q=2024-1-0,2024-1-1,2024-1-2', 7000);
  // A shared link opens on the sheet; the filters work on the browse view.
  await click(`[...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Browse Questions')`);
  await sleep(1000);
  await click(`[...document.querySelectorAll('aside label')]
    .filter(l => l.getBoundingClientRect().width > 0).find(l => l.textContent.trim() === 'Surds')`);
  await sleep(1500);
  await click(`[...document.querySelectorAll('button')].find(b => /variation of each/.test(b.textContent))`);
  await sleep(8000);
  await click(`[...document.querySelectorAll('button')].find(b => /My Worksheet/.test(b.textContent))`);
  await sleep(2500);

  const before = await evaluate(GIVEAWAYS);
  t.check(before.cards >= 4, `a sheet of past paper and generated questions (${before.cards} cards)`);
  t.check(before.tags > 0 && before.captions > 0 && before.badges > 0,
    `which, as normal, names its questions (${before.tags} tags, ${before.captions} captions, ${before.badges} badges)`);
  t.check(before.newQuestion === 0,
    'and a generated card no longer says "New question" beside its topic tags');
  t.check(!!(await evaluate(`!!(${buttonNamed('Full screen')})`)) && !(await evaluate(`!!(${buttonNamed('Present')})`)),
    'the toolbar says "Full screen", not "Present"');

  t.check(await click(labelNamed('Test mode')), 'the worksheet offers Test mode');
  await sleep(800);
  const test = await evaluate(GIVEAWAYS);
  t.check(test.tags === 0, `with it on, no topic tags (${test.tags})`);
  t.check(test.captions === 0, `no paper captions (${test.captions})`);
  t.check(test.badges === 0, `and no paper badge inside a question (${test.badges})`);
  t.check(test.marks === test.cards, `but every question keeps its marks (${test.marks} of ${test.cards})`);

  // Shared: the handout starts in test mode and says so in its link.
  await click(buttonNamed('Share'));
  await sleep(1200);
  const locked = await evaluate(`[...document.querySelectorAll('input')]
    .map(i => i.value).find(v => v.includes('/worksheet?')) ?? null`);
  t.check(/[?&]o=[a-z]*t/.test(locked ?? ''), `the handout link carries test mode (${(locked ?? '').replace(/q=[^&]*/, 'q=…')})`);

  if (locked) {
    await go(new URL(locked).pathname + new URL(locked).search, 8000);
    const shared = await evaluate(`(() => {
      const cards = ${CARDS};
      return {
        cards: cards.length,
        badges: cards.filter(c => /[0-9]{4} P[0-9] Q[0-9]/.test(c.innerText)).length,
        marks: cards.filter(c => c.querySelector('.q-marks')).length,
      };
    })()`);
    t.check(shared.cards === test.cards, `the shared sheet holds the same ${test.cards} questions (${shared.cards})`);
    t.check(shared.badges === 0, `with no paper named on any of them (${shared.badges})`);
    t.check(shared.marks === shared.cards, `and marks on every one (${shared.marks})`);
  }
});

t.done('a worksheet in test mode heads each question with its number and marks only');
