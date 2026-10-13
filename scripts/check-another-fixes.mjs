/**
 * The owner's phone check of the AH preview (2026-10-13), each answer proved in Chrome on the built site.
 *
 *   1. Full screen: a card that has run out says so and offers "Start again" (the owner: "Yes to start again
 *      button"); Next does not carry the message onto the next question (it did); going back still knows the card
 *      ran out, and "Start again" lets it draw again.
 *   2. The Worksheet Builder's Focus Mode offers "Another like this one" on generated questions, as full screen does
 *      (it offered nothing: MoreLikeThis did not pass a generated question's parentage).
 *   3. A shared handout offers it on each card when the maker ticked Hints, not when they did not, and never prints
 *      it (the owner: "Yes on cards on shared page if teacher has enabled hints").
 *
 *   node scripts/check-another-fixes.mjs   (after npm run build)
 */

import { withPage, tally } from './browser-drive.mjs';
import { encodeShortRefs } from '../lib/worksheet-refs.mjs';

const t = tally();
const OVERLAY = `document.querySelector('.fixed.inset-0')`;
const inScope = (scope, re) =>
  `[...(${scope}?.querySelectorAll('button') ?? [])].find(b => ${re}.test((b.textContent || '').trim()))`;
const DRAW = '/another (like this one|one)$/i';
const textOf = scope => `(${scope}?.innerText ?? '')`;
const link = (path, refs, o = '') => `${path}?c=ah&q=${encodeURIComponent(encodeShortRefs(refs, 4))}${o ? `&o=${o}` : ''}`;

// Three generated Advanced Higher questions, by their permanent codes (lib/generator/generators/ah/codes.ts):
// 2024 P1 Q7, 2022 P1 Q6, 2019 Q10. Not taken from the recorded links, which mix National 5 sheets in.
const generated = ['g:pkk8p:kggn:0', 'g:8exe8:6c27:0', 'g:86aq5:gmmm:0'];

await withPage({ port: 8191, cdp: 9291 }, async ({ send, evaluate, click, buttonNamed, go, sleep }) => {
  // ── 1. full screen, a card that runs out: 2022 P2 Q12 makes two questions ──
  await go(link('/explorer', ['2022-2-11', '2022-2-10']), 7000);
  await click(buttonNamed('Full screen'));
  await sleep(4000);
  t.check(await evaluate(`/2022 P2 Q12/.test(${textOf(OVERLAY)})`), 'full screen opens on AH 2022 P2 Q12, a card of two questions');
  let ranOut = false;
  for (let i = 0; i < 6 && !ranOut; i++) {
    await click(inScope(OVERLAY, DRAW));
    await sleep(5000);
    ranOut = await evaluate(`/had them all/.test(${textOf(OVERLAY)})`);
  }
  t.check(ranOut, 'pressing until the card runs out says "you have had them all"');
  t.check(await evaluate(`!!${inScope(OVERLAY, '/^start again$/i')}`), 'and offers "Start again"');
  await click(inScope(OVERLAY, '/^next$/i'));
  await sleep(1500);
  t.check(!(await evaluate(`/had them all/.test(${textOf(OVERLAY)})`)), 'Next does not carry the message onto the next question');
  await click(inScope(OVERLAY, '/^previous$/i'));
  await sleep(1500);
  t.check(!(await evaluate(`/had them all/.test(${textOf(OVERLAY)})`)), 'nor does coming back to it');
  await click(inScope(OVERLAY, DRAW));
  await sleep(5000);
  t.check(await evaluate(`/had them all/.test(${textOf(OVERLAY)})`), 'the card still knows it ran out');
  await click(inScope(OVERLAY, '/^start again$/i'));
  await sleep(800);
  await click(inScope(OVERLAY, DRAW));
  await sleep(5000);
  t.check(await evaluate(`/new question/i.test(${textOf(OVERLAY)}) && !/had them all/.test(${textOf(OVERLAY)})`),
    '"Start again" lets it draw a question again');
  await click(inScope(OVERLAY, '/close/i'));
  await sleep(1000);

  // ── 2. the Builder's Focus Mode, generated questions ──
  await go(link('/explorer', generated), 7000);
  await click(buttonNamed('Focus'));
  // Each row's control arrives with its own lazy chunk: wait for them rather than guess a time.
  const countOffers = `[...(${OVERLAY}?.querySelectorAll('button') ?? [])].filter(b => ${DRAW}.test((b.textContent || '').trim())).length`;
  let offers = 0;
  for (let i = 0; i < 30 && offers < generated.length; i++) { await sleep(500); offers = await evaluate(countOffers); }
  t.check(await evaluate(`/2024 P1 Q7|implicit/i.test(${textOf(OVERLAY)}) || ${OVERLAY}?.querySelectorAll('.question-content').length === ${generated.length}`),
    `Focus Mode shows the ${generated.length} generated Advanced Higher questions`);
  t.check(offers === generated.length, `Focus Mode offers another like it on every generated question (${offers} of ${generated.length})`);
  await click(inScope(OVERLAY, '/close/i'));
  await sleep(1000);

  // ── 3. a shared handout's cards ──
  const papers = ['2022-2-10', '2024-1-1'];
  await go(link('/worksheet', papers, 'h'), 7000);
  const onCards = await evaluate(`[...document.querySelectorAll('main button')].filter(b => ${DRAW}.test((b.textContent || '').trim())).length`);
  t.check(onCards === papers.length, `with Hints ticked, every card offers another like it (${onCards} of ${papers.length})`);
  const before = await evaluate(`document.querySelectorAll('main .question-content').length`);
  await click(`[...document.querySelectorAll('main button')].find(b => ${DRAW}.test((b.textContent || '').trim()))`);
  await sleep(6000);
  t.check(await evaluate(`document.querySelectorAll('main .question-content').length`) === before + 1, 'pressing one opens a new question below its card');
  await send('Emulation.setEmulatedMedia', { media: 'print' });
  await sleep(500);
  t.check(await evaluate(`[...document.querySelectorAll('main button')].filter(b => ${DRAW}.test((b.textContent || '').trim()) && b.offsetParent !== null).length === 0
    && document.querySelectorAll('main .question-content').length === ${before + 1}
    && [...document.querySelectorAll('main .question-content')].filter(e => e.offsetParent !== null).length === ${before}`),
    'and neither the button nor the drawn question prints');
  await send('Emulation.setEmulatedMedia', { media: '' });
  await go(link('/worksheet', papers), 7000);
  t.check(await evaluate(`![...document.querySelectorAll('main button')].some(b => ${DRAW}.test((b.textContent || '').trim()))`),
    'without Hints ticked, no card offers it');
});

t.done('the phone-check fixes: full screen running out, Focus Mode on generated questions, the handout\'s cards');
