/**
 * "Another like this one", on every surface that offers it — and absent on the
 * ones that deliberately do not. Driven in a real browser.
 *
 *   npm run build && node scripts/check-another-like-this.mjs
 *
 * **Not in `build`** — it needs headless Chrome and the Cloudflare image has none.
 *
 * A pupil stuck on a question should be able to have another go at the same
 * method wherever they are working. `MoreLikeThis` used to be on one surface,
 * the guided practice page, so opening the same topic in Focus or full screen
 * lost it, and so did the past paper archive, the revision marathon and a
 * shared worksheet.
 *
 * Two presentations, matched to the surface:
 *
 *   below   — a practice page and Focus mode, which have a below. The pupil is
 *             usually stuck on the question in front of them and taking it away
 *             loses it.
 *   in place — full screen, which has one card and no below. So it owes them a
 *             way back, and *Next* and *Previous* must also put the twin away.
 *
 * **The absences are decisions, and they are checked as hard as the
 * presences.**
 *
 *   the Explorer's own worksheet  — it already offers Variation on every card,
 *                                   Add a variation of each, and Generate on N
 *                                   topics, all of which put the question ON
 *                                   the sheet. A twin that vanishes would be
 *                                   the odd one out.
 *   a shared worksheet with hints off — `worksheet-share.ts` says the maker
 *                                   decides what a pupil is GIVEN. Hints on
 *                                   already grants a generated twin worked end
 *                                   to end, so this rides on that flag; hints
 *                                   off means the sheet is the sheet.
 *   any course but National 5     — nothing is modelled on those questions.
 *                                   Absent, never a dead button.
 *
 * Traps this repo has already paid for, every one of them live in here:
 * `innerText` is *rendered* text, so matching is case-insensitive · a selector
 * that finds nothing returns '', and `includes('')` is true of every string, so
 * every comparison guards its length first · Focus mode is thirteen of
 * everything, so the row is pinned before it is pressed · the page behind an
 * overlay has its own controls, so every lookup is scoped inside
 * `.fixed.inset-0` · clicks go through CDP.
 */
import { withPage, tally } from './browser-drive.mjs';

const t = tally();

/** The overlay both full-screen modes render into. */
const OVERLAY = `document.querySelector('.fixed.inset-0')`;

/**
 * The draw button, inside a scope.
 *
 * Both wordings: it reads "Another like this one" until something is drawn and
 * "Another one" after. Not "Another question", which is the practice page's
 * whole-topic control and a different offer.
 */
const drawButton = scope =>
  `[...(${scope}?.querySelectorAll('button') ?? [])]
     .find(b => /another (like this one|one)$/i.test((b.textContent || '').trim()))`;

/**
 * Text of whatever question is on the card, normalised.
 *
 * **No backslashes in this expression.** It is a template literal, so a `\\s`
 * would arrive at the browser as a bare `s` and a newline inside a regex
 * literal is a syntax error. A negated character class says the same thing and
 * survives the trip.
 */
const questionIn = scope =>
  `((${scope})?.querySelector('.question-content')?.innerText ?? '')
     .replace(/[^a-zA-Z0-9]+/g, ' ').trim()`;

await withPage({ port: 8156, cdp: 9256 }, async ({ evaluate, click, buttonNamed, go, sleep }) => {

  // ── the past paper archive, full screen ─────────────────────────────────
  await go('/course/n5', 3000);
  await click(buttonNamed('Start Paper'));
  await sleep(3500);

  t.check(await evaluate(`!!${OVERLAY}`), 'a National 5 past paper opens full screen');

  // The control arrives with its chunk, which is fetched at the click that
  // opened the mode — give it a moment before deciding it is missing.
  await sleep(1500);
  t.check(await evaluate(`!!(${drawButton(OVERLAY)})`),
    'and offers another like the question on screen');

  const before = await evaluate(questionIn(OVERLAY));
  t.check(before.length > 10, `read the question on screen (${before.length} chars)`);

  await click(drawButton(OVERLAY));
  await sleep(6000);

  const twin = await evaluate(questionIn(OVERLAY));
  t.check(twin.length > 10 && twin !== before, 'pressing it swaps a new question into the card');
  t.check(await evaluate(`/new question/i.test(${OVERLAY}?.innerText ?? '')`),
    'the header says it is a new question, not the paper it replaced');

  /* The whole reason full screen swaps rather than opens below: there is no
     below to scroll to, so getting back has to be a control. */
  t.check(await evaluate(`!!([...(${OVERLAY}?.querySelectorAll('button') ?? [])]
    .find(b => /back to the question/i.test(b.textContent || '')))`),
    'and it offers the way back');

  await click(`[...(${OVERLAY}?.querySelectorAll('button') ?? [])]
    .find(b => /back to the question/i.test(b.textContent || ''))`);
  await sleep(1200);
  t.check(await evaluate(questionIn(OVERLAY)) === before,
    'which puts the pupil back on the question they were stuck on');

  /* "or move to the next one" — Next must clear the twin as well, or a pupil
     who drew one would carry it into the next question of the paper. */
  await click(drawButton(OVERLAY));
  await sleep(6000);
  const second = await evaluate(questionIn(OVERLAY));
  t.check(second.length > 10 && second !== before && second !== twin,
    'a second press draws a third question, not the first one again');

  await click(`[...(${OVERLAY}?.querySelectorAll('button') ?? [])]
    .find(b => /^next$/i.test((b.textContent || '').trim()))`);
  await sleep(1500);
  const next = await evaluate(questionIn(OVERLAY));
  t.check(next.length > 10 && next !== second && next !== before,
    'Next moves on through the paper and the twin is gone');
  t.check(!(await evaluate(`/new question/i.test(${OVERLAY}?.innerText ?? '')`)),
    'and the header stops claiming a new question');

  // ── the past paper archive, Focus mode ──────────────────────────────────
  await go('/course/n5', 3000);
  await click(buttonNamed('Focus Mode'));
  await sleep(4000);

  t.check(await evaluate(`!!${OVERLAY}`), 'the same paper opens in Focus mode');
  await sleep(1500);

  /* **Pin the row before pressing it.** Focus mode is the whole paper at once,
     so "the first draw button" walks to the next question the moment this one
     has a twin — and then the assertions are about a question nobody asked
     about. Tag one row and stay inside it. */
  const rows = await evaluate(`(() => {
    const cards = [...(${OVERLAY}?.querySelectorAll('div.bg-slate-900\\\\/50') ?? [])]
      .filter(d => d.querySelector('.question-content'));
    const i = cards.findIndex(c => ${drawButton('c')});
    if (i < 0) return { n: cards.length, found: -1 };
    cards[i].setAttribute('data-pinned', '1');
    if (cards[i + 1]) cards[i + 1].setAttribute('data-neighbour', '1');
    return { n: cards.length, found: i };
  })()`);
  t.check(rows?.found >= 0,
    `${rows?.n} questions in Focus, and one of them offers another like it`);

  const PINNED = `document.querySelector('[data-pinned]')`;
  const NEIGHBOUR = `document.querySelector('[data-neighbour]')`;
  const rowBefore = await evaluate(questionIn(PINNED));

  await click(drawButton(PINNED));
  await sleep(6000);

  t.check(await evaluate(`/new question/i.test(${PINNED}?.innerText ?? '')`),
    'pressing it opens a new question under that row');
  t.check(await evaluate(questionIn(PINNED)) === rowBefore,
    'without taking away the question it is like');
  t.check(!(await evaluate(`/new question/i.test(${NEIGHBOUR}?.innerText ?? '')`)),
    'and nothing appears under the next question, which nobody asked about');

  /* The fault this change exists to fix: the button used to stay above the
     drawn question, so asking for a second one meant scrolling back past the
     first and its answer to reach a control you had already used. */
  t.check(await evaluate(`(() => {
    const panel = [...(${PINNED}?.querySelectorAll('div') ?? [])]
      .filter(d => /new question/i.test(d.innerText || '') && d.querySelector('.question-content')).pop();
    return !!(panel && ${drawButton('panel')});
  })()`), 'and the button is at the FOOT of it, not back up the page');

  // ── a shared worksheet, which the maker governs ─────────────────────────
  await go('/course/n5/generate/paper/2024/paper-1', 2500);
  for (let i = 0; i < 40; i++) {
    if (!(await evaluate(`/Drawing question/.test(document.body.innerText)`))) break;
    await sleep(1000);
  }
  await click(`[...document.querySelectorAll('button')]
    .find(x => /open as a worksheet/i.test(x.textContent || ''))`);
  await sleep(7000);

  const sheet = await evaluate(`location.pathname + location.search`);
  const granted = /[?&]o=[a-z]*h/i.test(sheet);
  t.check(sheet.startsWith('/worksheet') && granted,
    'a shared worksheet built with hints on');

  if (granted) {
    await click(`[...document.querySelectorAll('button')]
      .find(b => /full screen/i.test(b.textContent || ''))`);
    await sleep(3500);
    t.check(await evaluate(`!!(${drawButton(OVERLAY)})`),
      'grants another like this one — the same flag already grants a worked twin');

    // The same sheet, the same questions, hints withheld.
    const withheld = sheet.replace(/([?&]o=[a-z]*)h/i, '$1');
    await go(withheld, 6000);
    await click(`[...document.querySelectorAll('button')]
      .find(b => /full screen/i.test(b.textContent || ''))`);
    await sleep(3500);
    t.check(!(await evaluate(`!!(${drawButton(OVERLAY)})`)),
      'and with hints off it is absent — the sheet is the sheet');
  }

  /* ── the Explorer's own worksheet, which opts out ────────────────────────
     **Past paper references, not the generated sheet's.** The first version of
     this reused the refs from the worksheet above, which are generated
     questions — and `MoreLikeThis` does not pass their parentage through, so
     the control was absent for a reason that had nothing to do with the
     opt-out. Both assertions passed while the opt-out was mutated away. The
     badge assertion below is what keeps that from happening again: it says out
     loud that these questions DO have variations behind them, so an absence
     here is a decision rather than an empty pool. */
  await go('/explorer?c=n5&q=2024-1-0,2024-1-1,2024-1-2', 7000);
  for (const mode of ['Present', 'Focus']) {
    await click(buttonNamed(mode));
    await sleep(3500);
    t.check(await evaluate(`!!${OVERLAY}`), `the Explorer worksheet opens in ${mode}`);
    await sleep(1500);
    t.check(await evaluate(`/[0-9]{4} P[0-9] Q[0-9]/.test(${OVERLAY}?.innerText ?? '')`),
      `it is showing National 5 past paper questions, which have variations (${mode})`);
    t.check(!(await evaluate(`!!(${drawButton(OVERLAY)})`)),
      `and it still offers nothing — this page puts variations ON the sheet (${mode})`);
    await click(`[...(${OVERLAY}?.querySelectorAll('button') ?? [])]
      .find(b => /close/i.test(b.textContent || ''))`);
    await sleep(1500);
  }

  // ── the revision marathon, which takes the default ──────────────────────
  await go('/exam-hall', 3500);
  await click(`[...document.querySelectorAll('div')]
    .filter(d => /in one session/i.test(d.innerText || ''))
    .sort((a, b) => a.innerText.length - b.innerText.length)[0]`);
  await sleep(2500);
  await click(`[...document.querySelectorAll('button')]
    .find(b => /start from the beginning/i.test(b.textContent || ''))`);
  await sleep(4000);

  const inMarathon = await evaluate(`!!${OVERLAY}`);
  t.check(inMarathon, 'the revision marathon opens full screen');
  if (inMarathon) {
    await sleep(1500);
    /* Its questions carry the paper reference in their HTML and their `label`
       field is the topic, so this is the one surface where the control depends
       on scraping rather than on a field being passed. */
    t.check(await evaluate(`!!(${drawButton(OVERLAY)})`),
      'and offers another like it, from the reference printed on the question');
  }

  /* ── the static paper page, which is where a search lands ───────────────
     The ladder used to exist only in the two full-screen modes. Those have no
     URL, so every address a pupil could bookmark, be sent, or land on from a
     search had the version with no help — and these 22 pages are in the
     sitemap precisely so people land on them. Same paper, same questions, and
     for a while a different amount of help depending on which door you used. */
  await go('/course/n5/papers/2024/paper-1', 6000);
  const onPaperPage = await evaluate(`(() => {
    const laid = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const b = [...document.querySelectorAll('button,summary')].filter(laid).map(x => x.textContent.trim());
    return {
      questions: b.filter(x => /show answer/i.test(x)).length,
      hints: b.filter(x => x === 'Hint').length,
      another: b.filter(x => /another like this/i.test(x)).length,
    };
  })()`);
  t.check(onPaperPage?.questions > 0,
    `the static paper page holds ${onPaperPage?.questions} questions`);
  t.check(onPaperPage?.hints === onPaperPage?.questions,
    `and every one of them offers a hint (${onPaperPage?.hints})`);
  t.check(onPaperPage?.another === onPaperPage?.questions,
    `and another like it (${onPaperPage?.another})`);

  /* A URL is the point, so it is asserted as one: no overlay, no click to get
     here, nothing that a bookmark or a search result would miss. */
  t.check(await evaluate(`location.pathname === '/course/n5/papers/2024/paper-1'`),
    'reached by its own address rather than an overlay');

  // ── four courses out of five have nothing behind them ───────────────────
  await go('/course/higher', 3000);
  await click(buttonNamed('Start Paper'));
  await sleep(4000);
  t.check(await evaluate(`!!${OVERLAY}`), 'a Higher past paper opens full screen');
  t.check(!(await evaluate(`!!(${drawButton(OVERLAY)})`)),
    'and offers nothing — absent, not a dead button');

  /* And the same on its static paper page, where National 5 now has both. */
  await go('/course/higher/papers/2024/paper-1', 5000);
  t.check(await evaluate(`(() => {
    const laid = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const b = [...document.querySelectorAll('button,summary')].filter(laid).map(x => x.textContent.trim());
    return b.filter(x => /show answer/i.test(x)).length > 0
        && b.filter(x => x === 'Hint').length === 0;
  })()`), 'a Higher paper page has questions and no hints, which is correct there');
});

t.done('another like this one is where a pupil gets stuck, and nowhere else');
