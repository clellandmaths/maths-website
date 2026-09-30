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
 * the marks must stay, or it is not a test paper either, and since 2026-09-30
 * so must "Calculator" or "Non-calculator", on every card, which gives nothing
 * away (the owner asked for it, generated questions included).
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
    // "Calculator" or "Non-calculator": whether one is allowed, not which question.
    calculators: cards.filter(c => /^(Non-calculator|Calculator)$/.test(c.querySelector('.q-calculator')?.innerText.trim() ?? '')).length,
    generated: cards.filter(c => !/[0-9]{4} P[0-9] Q[0-9]/.test(c.querySelector('.question-content')?.innerText ?? '')).length,
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
  // The owner, 2026-09-30: a generated question did not say which paper it was like.
  t.check(before.generated > 0 && before.calculators === before.cards,
    `every card, the ${before.generated} generated ones too, says Calculator or Non-calculator (${before.calculators} of ${before.cards})`);
  // And a phone can print the marking instructions: the bottom bar, not only the desktop toolbar.
  t.check(await evaluate(`[...document.querySelectorAll('.fixed.bottom-0 button')].some(b => /Markscheme/.test(b.textContent))`),
    'the phone toolbar has the Markscheme button');
  t.check(!!(await evaluate(`!!(${buttonNamed('Full screen')})`)) && !(await evaluate(`!!(${buttonNamed('Present')})`)),
    'the toolbar says "Full screen", not "Present"');

  // Answers on first, so Test mode has something to lock out.
  await click(labelNamed('Show answers'));
  await sleep(300);
  // Each of the switches Test mode locks, as the visible toolbar shows it.
  const SWITCHES = `(() => Object.fromEntries(['Show answers', 'QR codes', 'Hints'].map(name => {
    const l = [...document.querySelectorAll('label')].find(x => x.offsetParent && x.textContent.trim() === name);
    const i = l?.querySelector('input');
    return [name, i ? { on: i.checked, disabled: i.disabled } : null];
  })))()`;
  const unlocked = await evaluate(SWITCHES);
  t.check(unlocked['Show answers']?.on && !unlocked['Show answers']?.disabled, 'answers switched on before Test mode');

  t.check(await click(labelNamed('Test mode')), 'the worksheet offers Test mode');
  await sleep(800);
  // The owner, 2026-09-28: Test mode "should lock out the other options and
  // make it clear they are locked out until test mode unlocked".
  const locks = await evaluate(SWITCHES);
  for (const [name, s] of Object.entries(locks)) {
    if (s) t.check(!s.on && s.disabled, `Test mode switches ${name} off and locks it (${JSON.stringify(s)})`);
  }
  t.check(await evaluate(`/locked in Test mode/.test(document.body.innerText)`), 'and says so beside the switch');
  const test = await evaluate(GIVEAWAYS);
  t.check(test.tags === 0, `with it on, no topic tags (${test.tags})`);
  t.check(test.captions === 0, `no paper captions (${test.captions})`);
  t.check(test.badges === 0, `and no paper badge inside a question (${test.badges})`);
  t.check(test.marks === test.cards, `but every question keeps its marks (${test.marks} of ${test.cards})`);
  // The owner, 2026-09-30: test mode took the paper away with the reference.
  // Which paper says whether a calculator is allowed, not what the question is.
  t.check(test.calculators === test.cards, `and Calculator or Non-calculator (${test.calculators} of ${test.cards})`);

  // Shared: the handout starts in test mode and says so in its link.
  await click(buttonNamed('Share'));
  await sleep(1200);
  const locked = await evaluate(`[...document.querySelectorAll('input')]
    .map(i => i.value).find(v => v.includes('/worksheet?')) ?? null`);
  t.check(/[?&]o=[a-z]*t/.test(locked ?? ''), `the handout link carries test mode (${(locked ?? '').replace(/q=[^&]*/, 'q=…')})`);
  const o = new URL(locked ?? 'http://x/').searchParams.get('o') ?? '';
  t.check(!/[aqvh]/.test(o), `and nothing Test mode locks out (o=${o})`);
  const shareLocks = await evaluate(`(() => {
    const box = [...document.querySelectorAll('h2')].find(h => /Share this worksheet/.test(h.textContent))?.closest('.rounded-2xl');
    const boxes = [...(box?.querySelectorAll('label') ?? [])].filter(l => l.querySelector('input[type=checkbox]'));
    const named = n => boxes.find(l => l.textContent.trim().startsWith(n))?.querySelector('input');
    return {
      answers: named('Answers')?.disabled ?? null,
      test: named('Test mode') ? !named('Test mode').disabled && named('Test mode').checked : null,
      said: /Test mode is on, so answers/.test(box?.innerText ?? ''),
    };
  })()`);
  t.check(shareLocks.answers === true && shareLocks.test === true && shareLocks.said,
    `the share box locks Answers under Test mode and says so (${JSON.stringify(shareLocks)})`);

  if (locked) {
    await go(new URL(locked).pathname + new URL(locked).search, 8000);
    const shared = await evaluate(`(() => {
      const cards = ${CARDS};
      return {
        cards: cards.length,
        badges: cards.filter(c => /[0-9]{4} P[0-9] Q[0-9]/.test(c.innerText)).length,
        marks: cards.filter(c => c.querySelector('.q-marks')).length,
        calculators: cards.filter(c => /^(Non-calculator|Calculator)$/.test(c.querySelector('.q-calculator')?.innerText.trim() ?? '')).length,
      };
    })()`);
    t.check(shared.cards === test.cards, `the shared sheet holds the same ${test.cards} questions (${shared.cards})`);
    t.check(shared.badges === 0, `with no paper reference on any of them (${shared.badges})`);
    t.check(shared.marks === shared.cards, `and marks on every one (${shared.marks})`);
    t.check(shared.calculators === shared.cards, `and Calculator or Non-calculator on every one (${shared.calculators})`);
  }
});

t.done('a worksheet in test mode heads each question with its number, its marks and whether a calculator is allowed');
