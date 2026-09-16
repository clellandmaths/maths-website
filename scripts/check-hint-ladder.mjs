/**
 * The hint ladder, pressed to the bottom, on both kinds of question.
 *
 *   npm run build && node scripts/check-hint-ladder.mjs
 *
 * **Not in `build`** — it needs headless Chrome and the Cloudflare image has none.
 *
 * The ladder used to be the marking instructions replayed one row per mark, and
 * it ran downhill: `2015 P2 Q4` went "start process", then "solution", each
 * press carrying less than the one before. What ships now is two to four
 * authored moves with this question's own working beside them. That is a claim
 * about what a pupil sees, and the only way to check it is to press the button.
 *
 * What has to hold:
 *
 *   1. every rung says something — no bare process word, no empty line
 *   2. the ladder never exceeds six presses. It used to be mark count, so a
 *      7-mark question took eight
 *   3. a mark chip never reads "0 marks". Two variations are worth one mark
 *      across two moves, and the free one shows no chip at all
 *   4. a past paper question ends on a worked example, and the question it
 *      works is **not the one on screen** — that is the whole reason a twin can
 *      show its answer
 *   5. a generated question is never offered a twin. It already is one, and
 *      handing it another with the answer printed is `Show answer` with steps
 *   6. no rung hands over the answer to the question being asked
 */
import { withPage, tally } from './browser-drive.mjs';

const t = tally();

/**
 * **Pin one ladder before pressing it.**
 *
 * A practice page has five of these. Selecting "the first Hint button" works
 * until that ladder is exhausted — its button then disappears and the NEXT
 * question's becomes the first, so a walk marches across questions and reports
 * ten presses for a two-press ladder. Tagging the container once and selecting
 * inside it is what keeps a walk on one question.
 */
const PIN = (n) => `(() => {
  const laid = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  document.querySelectorAll('[data-ladder]').forEach(el => el.removeAttribute('data-ladder'));
  const b = [...document.querySelectorAll('button')].filter(laid)
    .filter(x => /^(Hint|Another hint|More help)/i.test(x.textContent.trim()))[${n}];
  if (!b) return false;
  b.parentElement.setAttribute('data-ladder', 'here');
  return true;
})()`;

const BUTTON = `(() => {
  const box = document.querySelector('[data-ladder]');
  const laid = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  return box ? [...box.querySelectorAll('button')].filter(laid)
    .find(x => /^(Hint|Another hint|More help)/i.test(x.textContent.trim())) : null;
})()`;

/**
 * Read one ladder. KaTeX renders its maths twice — an invisible MathML copy
 * beside the visible HTML — and `innerText` returns both, so every symbol comes
 * back doubled and one line reads as twenty. Dropped on a clone.
 */
const PANEL = `(() => {
  const box = document.querySelector('[data-ladder]');
  const laid = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const b = box ? [...box.querySelectorAll('button')].filter(laid)
    .find(x => /^(Hint|Another hint|More help)/i.test(x.textContent.trim())) : null;
  const panel = box ? box.querySelector('div.rounded-lg') : null;
  let text = '';
  let chips = [];
  let rungs = 0;
  if (panel) {
    /* **Strip the MathML from the LIVE node, not from a clone.**
       KaTeX renders its maths twice — a hidden-but-rendered MathML copy beside
       the visible HTML — so live \`innerText\` returns every symbol doubled.
       The obvious fix is to clone and strip, and it is wrong: a detached node
       has no layout, so \`innerText\` falls back to \`textContent\` and every
       line break disappears. The panel then comes back as one run-on string,
       and a check that reads it line by line sees nothing at all. Removing the
       MathML in place gives both — no doubling, and real lines. The page is
       navigated away from afterwards, so nothing is owed a restore. */
    panel.querySelectorAll('.katex-mathml').forEach(x => x.remove());
    text = panel.innerText.replace(/[ \\t]+/g, ' ').trim();
    chips = [...panel.querySelectorAll('span.font-mono')].map(s => s.textContent.trim());
    rungs = panel.querySelectorAll('div.border-t').length;
  }
  return {
    button: b ? b.textContent.trim() : null,
    text, chips, rungs,
    // Scoped to this ladder, not the page: another question's control must not
    // be mistaken for this one's.
    worked: !!box && /worked right through/i.test(box.innerText),
  };
})()`;

/** Press one pinned ladder to the bottom, collecting what each press showed. */
async function walk({ evaluate, click, sleep }, n, cap = 10) {
  if (!(await evaluate(PIN(n)))) return [];
  const seen = [];
  for (let i = 0; i < cap; i++) {
    const before = await evaluate(PANEL);
    if (!before.button) break;
    await click(BUTTON);
    await sleep(900);
    const after = await evaluate(PANEL);
    seen.push(after);
    if (!after.button) break;
  }
  return seen;
}

await withPage({ port: 8191, cdp: 9291, width: 1280, height: 1000 }, async (page) => {
  const { evaluate, go } = page;

  // ── a past paper question ───────────────────────────────────────────────
  await go('/course/n5/practice/completing-the-square', 3500);
  const paper = await walk(page, 0);
  t.check(paper.length > 0, `a past paper question offers a ladder (${paper.length} presses)`);
  t.check(paper.length <= 6,
    `it takes ${paper.length} presses, and six is the most a ladder may take`);

  const last = paper[paper.length - 1] ?? { text: '', chips: [], rungs: 0 };
  t.check(last.rungs >= 1, `${last.rungs} rung(s) appeared beneath the two prose lines`);
  t.check(!last.chips.includes('0 marks'),
    `no chip reads "0 marks" (${JSON.stringify(last.chips)})`);

  /* A rung that says nothing is the fault this work exists to remove. The old
     table's own words are the control: if any of them come back, the ladder is
     reading `paper-steps` again.
     **Line by line, with the chip taken off first.** A rung and its "1 mark"
     chip sit in one flex row, so they come back as a single line — a pattern
     ending `\s*(\n|$)` never matched, and a move replaced by the word
     "solution" passed the check while the panel visibly shrank by 98 chars. */
  const WORDS = /^(start process|complete process|solution|answer|evaluate|simplify|calculate|valid strategy|begin valid strategy|consistent answer)$/i;
  const bareRungs = last.text.split('\n')
    .map(l => l.replace(/\s*\d+\s*marks?\s*$/i, '').trim())
    .filter(l => WORDS.test(l));
  t.check(bareRungs.length === 0,
    `no rung is a bare process word from the old scheme table${bareRungs.length ? ` — found ${JSON.stringify(bareRungs)}` : ''}`);
  t.check(last.text.length > 80, `the panel carries real prose (${last.text.length} chars)`);

  // ── and it ends on a worked example, of a DIFFERENT question ────────────
  t.check(last.worked, 'the bottom of a past paper ladder offers one worked right through');

  /* Guided practice renders its question as `.prose-practice`, not the
     `.question-content` the worksheet and paper pages use. One selector does
     not fit every surface, and the wrong one returns '' — which `includes()`
     then finds inside anything. */
  const onScreen = await evaluate(`(() => {
    const laid = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const q = [...document.querySelectorAll('.prose-practice, .question-content')]
      .filter(laid)[0];
    return q ? q.innerText.replace(/\\s+/g, ' ').trim().slice(0, 80) : '';
  })()`);

  const hit = await page.click(`[...document.querySelectorAll('button')]
    .find(b => /worked right through/i.test(b.textContent || ''))`);
  if (!hit) {
    const buttons = await evaluate(`(() => {
      const laid = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      return [...document.querySelectorAll('button')].filter(laid)
        .map(b => b.textContent.trim().slice(0, 40));
    })()`);
    t.check(false, `the worked-example button could not be clicked. Buttons: ${JSON.stringify(buttons)}`);
  }
  // The engine is fetched on this press — 645 KB and a draw. Give it room, and
  // stop as soon as it has landed rather than always waiting the worst case.
  let twin = { opened: false, body: '', state: '' };
  for (let i = 0; i < 25; i++) {
    await page.sleep(1000);
    twin = await evaluate(`(() => {
      const t = document.body.innerText;
      /* **innerText is RENDERED text.** That heading carries an \`uppercase\`
         class, so it comes back as "THE SAME METHOD, DIFFERENT NUMBERS" and an
         indexOf on the source spelling finds nothing — which read as the worked
         example never arriving when it had arrived in under two seconds. The
         same trap this repo already records for "KEEP PRACTISING". */
      const i = t.search(/the same method, different numbers/i);
      return {
        opened: i >= 0,
        body: i >= 0 ? t.slice(i, i + 700).replace(/\\s+/g, ' ') : '',
        state: /Working one out/i.test(t) ? 'drawing'
          : /did not work|no other question like this/i.test(t) ? 'failed' : 'idle',
      };
    })()`);
    if (twin.opened || twin.state === 'failed') break;
  }
  if (!twin.opened) t.check(false, `the worked example never arrived (state: ${twin.state})`);
  t.check(twin.opened, 'it opens, and says it is the same method on different numbers');
  /* Guard the comparison itself. `includes('')` is true for every string, so an
     empty `onScreen` — a selector that found nothing — would report the twin as
     identical to the question and read as a leak. */
  t.check(onScreen.length > 20, `the question on screen was read (${onScreen.length} chars)`);
  t.check(twin.opened && onScreen.length > 20 && !twin.body.includes(onScreen.slice(0, 40)),
    'the question it works is NOT the one on screen — which is why it may show its answer');
  t.check(/Answer:/i.test(twin.body), 'and it does show that answer, all the way through');

  /* ── a generated question ──────────────────────────────────────────────
     Not the practice paper page, which draws generated questions and renders
     no ladder at all — pointing at it reported "0 presses" and looked like a
     fault in the product. A generated question with a ladder lives inside
     `MoreLikeThis`, which every practice question offers. */
  await go('/course/n5/practice/completing-the-square', 3500);
  /* Tag every ladder that exists BEFORE the draw. The twin's is then the only
     untagged one — which beats guessing at document order, and beats "the last
     one on the page", which is question five's and offers a worked example
     exactly as a past paper question should. */
  await evaluate(`(() => {
    const laid = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    [...document.querySelectorAll('button')].filter(laid)
      .filter(b => /^(Hint|Another hint|More help)/i.test(b.textContent.trim()))
      .forEach(b => b.parentElement.setAttribute('data-pre', '1'));
    return true;
  })()`);
  await page.click(`[...document.querySelectorAll('button')]
    .find(b => /another like this one/i.test(b.textContent || ''))`);
  for (let i = 0; i < 25; i++) {
    await page.sleep(1000);
    if (await evaluate(`/Watch the method|Show answer/i.test(document.body.innerText)
      && document.querySelectorAll('button').length > 0`)) break;
  }
  /* **The twin's ladder is the one that FOLLOWS the draw button, not the last
     on the page.** `MoreLikeThis` renders under the question it was drawn from,
     and there are five questions below it, so "the last ladder" is question
     five's — a past paper one, which correctly offers a worked example and so
     read as the generated half being offered a twin. Document order is the
     thing that identifies it. */
  const nth = await evaluate(`(() => {
    const laid = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const ladders = [...document.querySelectorAll('button')].filter(laid)
      .filter(b => /^(Hint|Another hint|More help)/i.test(b.textContent.trim()));
    return ladders.findIndex(b => !b.parentElement.hasAttribute('data-pre'));
  })()`);
  t.check(nth >= 0, `the drawn twin brought its own ladder (index ${nth})`);
  const gen = nth >= 0 ? await walk(page, nth) : [];
  t.check(gen.length > 0, `a generated question offers a ladder (${gen.length} presses)`);
  t.check(gen.length <= 6, `it takes ${gen.length} presses, and six is the most`);

  const genLast = gen[gen.length - 1] ?? { text: '', worked: true };
  t.check(!genLast.worked,
    'a generated question is NEVER offered a worked twin — it already is one');
  t.check(/as far as a hint goes/i.test(genLast.text),
    'it closes by saying the last step is the answer itself');
});

/* ── the help is not the smallest thing on screen ────────────────────────
   Measured before this was asserted: the ladder was 14px on every surface,
   against a 16px question on a practice page and a 24px one in full screen,
   and the Hint button was 32px tall and 73px wide beside four 48px full-width
   blocks. The help was the least prominent control in the row and the smallest
   text on the page — on the one surface built for a pupil who is stuck. */
await withPage({ port: 8158, cdp: 9258, width: 1280, height: 900 }, async ({ evaluate, click, go, sleep }) => {
  const LAID = `(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; })`;
  await go('/course/n5', 4000);
  await click(`[...document.querySelectorAll('button')].filter(${LAID}).find(b=>/^Start Paper$/.test(b.textContent.trim()))`);
  await sleep(4000);

  const row = await evaluate(`(() => {
    const s = [...document.querySelectorAll('.fixed.inset-0 div')]
      .find(d => d.className.includes('justify-center') && d.querySelectorAll('button').length > 1);
    if (!s) return null;
    const b = [...s.querySelectorAll('button,a')].filter(${LAID})
      .map(x => ({ t: x.textContent.trim(), h: Math.round(x.getBoundingClientRect().height) }));
    const hint = b.find(x => /hint/i.test(x.t));
    return { heights: [...new Set(b.map(x => x.h))], hint: hint ? hint.h : 0, n: b.length };
  })()`);
  t.check(row && row.n >= 4, `full screen offers ${row?.n} controls in one row`);
  t.check(row && row.heights.length === 1,
    `all the same height (${row?.heights.join(', ')}px) — not a 32px control beside a 96px one`);
  t.check(row && row.hint >= 44,
    `and the Hint button clears the 44px tap target (${row?.hint}px)`);

  await click(`[...document.querySelectorAll('.fixed.inset-0 button')].filter(${LAID}).find(b=>/hint/i.test(b.textContent||''))`);
  await sleep(2500);
  const px = await evaluate(`(() => {
    const span = [...document.querySelectorAll('.fixed.inset-0 span')].filter(${LAID})
      .find(e => /^What it asks:/.test(e.textContent || ''));
    return span ? Math.round(parseFloat(getComputedStyle(span).fontSize)) : 0;
  })()`);
  t.check(px >= 18,
    `and the ladder is set at ${px}px against a 24px question — help no smaller than what it explains`);
});

t.done('the ladder says something on every press, on both kinds of question');
