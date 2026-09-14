/**
 * A practice topic does not run out any more. Driven in a real browser.
 *
 *   npm run build && node scripts/check-practice-generate.mjs
 *
 * **Not in `build`** — it needs headless Chrome and the Cloudflare image has none.
 *
 * A National 5 practice topic holds about thirteen questions and then stops.
 * `PracticeGenerate` puts a "Keep practising" section at the foot of the page
 * that draws new ones on the same subtopics. What has to be true:
 *
 *   1. it is **there** on a National 5 topic that has variations behind it
 *   2. it is **absent** on Rounding, which the exam does not set on its own, so
 *      the three rounding variations are warm-up tier and carry no subtopic
 *   3. it is **absent** on the other four courses, which have no audited
 *      variations — absent rather than disabled, because a dead button on four
 *      courses out of five reads as a broken site
 *   4. pressing it gives a question, and pressing again gives a *different* one
 *   5. the answer reveals
 *   6. "Add 10 to a worksheet" puts ten distinct questions on the sheet, from a
 *      page that has no `WorksheetProvider` at all — this is the one that
 *      proves `appendToSession` rather than a second provider
 *
 * Point 6 compares rendered question bodies, not just uids. Uids alone would
 * pass on ten copies of one question with ten different seeds, which is exactly
 * the repeat the exclude set exists to prevent.
 */
import { withPage, tally } from './browser-drive.mjs';

const t = tally();

await withPage({ port: 8131, cdp: 9231 }, async ({ evaluate, click, buttonNamed, go, sleep }) => {
  /**
   * **Case-insensitive, deliberately.** The eyebrow carries an `uppercase`
   * class and Chrome's `innerText` returns *rendered* text, so the page reads
   * "KEEP PRACTISING". Matching the source spelling reported the section
   * missing on a page whose own button then worked — the check was wrong, not
   * the component.
   */
  const sectionShowing = () =>
    evaluate(`/keep practising/i.test(document.body.innerText)`);

  // ── 1-3. where it appears, and where it must not ────────────────────────
  await go('/course/n5/practice/surds');
  t.check(await sectionShowing(), 'National 5 · Surds offers more questions');

  await go('/course/n5/practice/rounding', 2000);
  t.check(!(await sectionShowing()),
    'National 5 · Rounding does not — the exam does not set it on its own');

  for (const [course, slug] of [['higher', 'circle'], ['ah', 'binomial-theorem']]) {
    await go(`/course/${course}/practice/${slug}`, 2000);
    t.check(!(await sectionShowing()), `${course} · ${slug} offers nothing`);
  }

  /* ── the per-question controls ──────────────────────────────────────────
     Hints and "another like this" on each question, not only the section at
     the foot of the page. Both need the label passed explicitly: this surface
     strips the printed badge out of the HTML, so anything that scrapes finds
     nothing and offers nothing — silently, on exactly the questions that have
     a marking instruction behind them. */
  await go('/course/n5/practice/surds');

  const perQuestion = await evaluate(`(() => {
    const t = document.body.innerText;
    return {
      hint: [...document.querySelectorAll('button')].filter(b => b.textContent.trim() === 'Hint').length,
      another: [...document.querySelectorAll('button')]
        .filter(b => /another like this one/i.test(b.textContent || '')).length,
      fallback: [...document.querySelectorAll('button')]
        .filter(b => /^more on /i.test(b.textContent || '')).length,
      badges: (t.match(/\\d{4} P\\d Q\\d+/g) || []).length,
    };
  })()`);
  t.check(perQuestion?.badges > 0, `${perQuestion?.badges} past-paper-backed questions on the page`);
  t.check(perQuestion?.hint > 0, `${perQuestion?.hint} of them offer a hint`);
  /* **Only the past-paper-backed ones.** It used to fall back to the question's
     subtopic, which made it near-universal and wrong: `Fractions and mixed
     numbers` is one subtopic covering add, subtract, multiply and divide, so a
     pupil working through adding pressed it and got a multiplication. */
  t.check(perQuestion?.another === perQuestion?.badges,
    `and exactly those ${perQuestion?.badges} offer another like it (${perQuestion?.another})`);

  // The ladder opens, and opens on what the question asks rather than on working.
  await click(`[...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Hint')`);
  await sleep(2500);
  t.check(await evaluate(`/what it asks/i.test(document.body.innerText)`),
    'the first hint says what the question asks');
  await click(buttonNamed('Another hint'));
  await sleep(1200);
  t.check(await evaluate(`/how the marks go/i.test(document.body.innerText)`),
    'the second says how the marks go');

  t.check(perQuestion?.fallback === 0, 'and nothing offers a whole-subtopic fallback');

  /* ── what a pupil gets when they take one ──────────────────────────────
     A new question and no more help than before is no help. It has to arrive
     with the method behind it and its own hints. */
  await click(`[...document.querySelectorAll('button')]
    .find(b => /another like this one/i.test(b.textContent || ''))`);
  await sleep(4500);
  /* **No backslashes in these patterns.** This expression is a template
     literal, and a `\d` or `\b` inside one loses its backslash before it ever
     reaches the browser — the regex arrives as `/based on d{4}/` and never
     matches. Character classes say the same thing and survive. The first
     version failed exactly the two assertions that used backslashes and passed
     the two that did not, which is the tell. */
  const offered = await evaluate(`(() => {
    // The innermost match: an outer wrapper contains the whole page, so it
    // would pass on the practice questions' own controls.
    const all = [...document.querySelectorAll('div')]
      .filter(d => /New question/.test(d.innerText) && d.querySelector('.question-content'));
    const panel = all[all.length - 1];
    const t = panel?.innerText ?? '';
    return {
      drew: !!panel,
      basedOn: /based on [0-9]{4} P[0-9] Q[0-9]/i.test(t),
      method: /watch the method/i.test(t),
      hint: [...(panel?.querySelectorAll('button') ?? [])]
        .some(b => b.textContent.trim() === 'Hint'),
      answer: /show answer/i.test(t),
    };
  })()`);
  t.check(offered?.drew, 'pressing it draws a question');
  t.check(offered?.basedOn, 'which names the paper it is modelled on');
  t.check(offered?.method, 'and offers the video of that method');
  t.check(offered?.hint, 'and its own hints');
  t.check(offered?.answer, 'and an answer to reveal');

  /* ── hints in the two full-screen modes ────────────────────────────────
     Both render <Hints> with no label prop, and a question reaching them from
     guided practice has had its printed badge stripped out of the HTML — so
     the ladder silently did not appear on the very questions that have a
     marking instruction behind them. */
  await go('/course/n5/practice/surds', 3000);
  for (const [mode, open] of [['full screen', 'Full screen'], ['focus', 'Focus']]) {
    await click(buttonNamed(open));
    await sleep(3000);

    /* **Full screen shows one question at a time, and opens on the first.**
       A guided practice topic mixes authored questions with past paper ones,
       and question 1 on Surds is authored — so it has no paper reference and
       correctly offers no hints. Step along until a past paper question is on
       screen, which is what the claim is actually about. Focus mode needs none
       of this: it shows every question at once. */
    for (let i = 0; i < 12; i++) {
      const on = await evaluate(
        `/[0-9]{4} P[0-9] Q[0-9]/.test(document.querySelector('.fixed.inset-0')?.innerText ?? '')`);
      if (on) break;
      if (!(await click(buttonNamed('Next')))) break;
      await sleep(900);
    }

    /* **Inside the overlay only.** `document.body.innerText` includes the page
       behind it, whose own questions each carry a Hint button — so a
       whole-body scan reports hints the mode itself is not showing. */
    const hinted = await evaluate(`(() => {
      const overlay = document.querySelector('.fixed.inset-0');
      if (!overlay) return { open: false };
      return {
        open: true,
        labelled: /[0-9]{4} P[0-9] Q[0-9]/.test(overlay.innerText),
        hint: [...overlay.querySelectorAll('button')]
          .some(b => b.textContent.trim() === 'Hint'),
      };
    })()`);
    t.check(hinted?.open, `${mode} opened from a practice topic`);
    t.check(hinted?.labelled, `${mode} is showing a past paper question`);
    t.check(hinted?.hint, `${mode} offers hints on it`);
    await click(`[...document.querySelectorAll('.fixed.inset-0 button')]
      .find(b => /close/i.test(b.textContent || ''))`);
    await sleep(1500);
  }

  // Neither control on a course with nothing behind it.
  await go('/course/higher/practice/circle', 2500);
  const higher = await evaluate(`[...document.querySelectorAll('button')]
    .filter(b => /^Hint$|another like this one|more on /i.test(b.textContent || '')).length`);
  t.check(higher === 0, 'Higher practice questions offer neither');

  // ── 4. it draws, and it draws something different the second time ───────
  await go('/course/n5/practice/surds');

  const pressed = await click(buttonNamed('Give me a question'));
  t.check(pressed, 'pressed "Give me a question"');
  await sleep(4000);

  const read = () => evaluate(`(() => {
    const s = [...document.querySelectorAll('section')]
      .find(el => /keep practising/i.test(el.innerText));
    if (!s) return null;
    const body = s.querySelector('.question-content');
    return {
      text: (body?.innerText ?? '').replace(/\\s+/g, ' ').trim().slice(0, 70),
      badge: s.innerText.includes('New question'),
      basedOn: /based on \\d{4} P\\d Q\\d/.test(s.innerText),
      answerShowing: !!s.querySelector('.answer-content'),
    };
  })()`);

  const first = await read();
  t.check(!!first?.text, `drew a question: ${JSON.stringify(first?.text)}`);
  t.check(first?.badge, 'it is labelled "New question"');
  t.check(first?.basedOn, 'it names the past paper question it is modelled on');

  await click(buttonNamed('Another question'));
  await sleep(4000);
  const second = await read();
  t.check(second?.text && second.text !== first?.text,
    `"Another question" drew a different one: ${JSON.stringify(second?.text)}`);

  // ── 5. the answer ───────────────────────────────────────────────────────
  t.check(!first?.answerShowing, 'the answer starts hidden');
  /* **Scoped to the section.** A practice topic page has one "Show answer" per
     question — thirteen of them on Surds — and they come first in document
     order, so a plain by-name lookup pressed question 1's and reported the
     generated question's answer as not revealing. */
  await click(`(() => {
    const s = [...document.querySelectorAll('section')]
      .find(el => /keep practising/i.test(el.innerText));
    return s && [...s.querySelectorAll('button')]
      .find(b => b.textContent.trim() === 'Show answer');
  })()`);
  await sleep(1200);
  t.check((await read())?.answerShowing, 'Show answer reveals the generated one');

  // ── 6. ten to a worksheet, from a page with no provider ─────────────────
  const before = await evaluate(
    `(() => { try { return JSON.parse(sessionStorage.getItem('worksheet_n5') || '[]').length; } catch { return -1; } })()`);
  t.check(before === 0, `nothing on the sheet from drawing two questions (${before})`);

  await click(buttonNamed('Add 10 to a worksheet'));
  await sleep(12000);

  const sheet = await evaluate(`(() => {
    let items = [];
    try { items = JSON.parse(sessionStorage.getItem('worksheet_n5') || '[]'); } catch {}
    const bodies = items.map(q => (q.question || '')
      .replace(/<[^>]+>/g, ' ').replace(/\\s+/g, ' ').trim().slice(0, 60));
    return {
      n: items.length,
      uids: new Set(items.map(q => q.uid).filter(Boolean)).size,
      distinct: new Set(bodies).size,
      link: document.body.innerText.includes('on your worksheet'),
    };
  })()`);

  t.check(sheet?.n === 10, `ten questions on the sheet (${sheet?.n})`);
  t.check(sheet?.uids === 10, `ten distinct uids (${sheet?.uids})`);
  t.check(sheet?.distinct === 10, `ten genuinely different questions (${sheet?.distinct})`);
  t.check(sheet?.link, 'and a link through to the worksheet');
});

t.done('a practice topic keeps going');
