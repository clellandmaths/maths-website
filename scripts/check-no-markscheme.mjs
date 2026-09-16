/**
 * A question with no marking instructions offers no Hint button, and says why.
 *
 *   npm run build && node scripts/check-no-markscheme.mjs
 *
 * **Not in `build`** — it needs headless Chrome and the Cloudflare image has none.
 *
 * ## The fault
 *
 * We hold 22 National 5 questions from 2021 and no transcribed marking
 * instructions for that year — `reference/N5_Markschemes/` has the PDF and
 * nothing else — so `PLAN_OF` has no entry for any of them. `Hints` decided
 * whether to render its button with `paperLabelOf`, which answers the looser
 * question "is this a past paper question", and for 2021 the two came apart.
 * The button rendered, the press found nothing, `staged` stayed null, and the
 * overlay opened with the question at the top, no ladder under it and a footer
 * reading `More help (2 left)` that could be pressed for ever. On the card, in
 * full screen and in Focus.
 *
 * ## Fractions is the fixture, and it was chosen rather than found
 *
 * `check:nozoom` is in this repo's own lessons as a check that drove the right
 * interaction on the wrong data — it ticked two topics with nothing breakable
 * in them and passed for two sessions while the bug was on screen. So this one
 * names a topic that holds **all three kinds at once**: ten past paper
 * questions with a ladder, eight written for the site, and `2021 P1 Q2`, which
 * is the kind that was broken.
 *
 * ## The invariant, and why it is stronger than "the button is gone"
 *
 * Every question carries **exactly one** of a Hint button or the note. Not one
 * assertion but nineteen, and it fails in both directions: deleting the
 * suppression puts the dead button back and breaks the count one way; a
 * suppression that swallowed the whole topic breaks it the other. Ten and nine,
 * on all three surfaces, and ten plus nine is every question on the page.
 *
 * ## What would make this pass for the wrong reason
 *
 * Hints being broken everywhere — then no question has a button, the note is
 * everywhere, and an absence check is delighted. So the ladder is opened on a
 * neighbouring question and read, and the check fails if it does not fill.
 */
import { withPage, tally } from './browser-drive.mjs';

const t = tally();

const TOPIC = '/course/n5/practice/fractions';
/** The one question in this topic whose marking instructions we do not hold. */
const SUPPRESSED = '2021 P1 Q2';
const PLANNED = 10;   // past paper questions here with a ladder behind them
const NOTED = 9;      // eight written for the site, plus the 2021 one
const NOTE = /No hints on this one/;

await withPage({ port: 8171, cdp: 9271, width: 1400, height: 1000 }, async ({
  evaluate, click, buttonNamed, go, sleep,
}) => {
  // ───────────────────────────────────────────────── the card on the page
  await go(TOPIC, 5000);

  /**
   * One row per question card.
   *
   * `span.font-mono.border` is the paper badge. The question's *number* is also
   * a `font-mono` span and comes first in the DOM, so selecting on `font-mono`
   * alone reads "1" as the badge for every card and the label match below never
   * fires — which would pass this file's own suppressed-question assertions by
   * never finding the question they are about.
   */
  const cards = await evaluate(`(() => {
    /* Deduped. A card holds two \`.prose-practice\` blocks — the question and
       the revealed answer — so mapping each to its card returned all 19 twice,
       and every count came back doubled against expectations written for 19. */
    const seen = [...new Set([...document.querySelectorAll('.prose-practice')]
      .map(p => p.closest('div.rounded-xl')).filter(Boolean))];
    return seen.map(c => ({
      badge: (c.querySelector('span.font-mono.border') || {}).textContent || '',
      hint: [...c.querySelectorAll('button')].some(b => b.textContent.trim() === 'Hint'),
      note: /${NOTE.source}/.test(c.textContent || ''),
    }));
  })()`);

  t.check(cards.length === PLANNED + NOTED,
    `${cards.length} question cards on ${TOPIC}`);

  const both = cards.filter(c => c.hint && c.note).length;
  const neither = cards.filter(c => !c.hint && !c.note).length;
  t.check(both === 0, `no card offers a hint AND says it has none (${both})`);
  t.check(neither === 0,
    `no card is silently without help — every one has a button or a reason (${neither})`);
  t.check(cards.filter(c => c.hint).length === PLANNED,
    `${cards.filter(c => c.hint).length} cards offer a Hint button (expected ${PLANNED})`);
  t.check(cards.filter(c => c.note).length === NOTED,
    `${cards.filter(c => c.note).length} cards explain the absence (expected ${NOTED})`);

  // The question the fault was about, by name.
  const bad = cards.find(c => c.badge.trim() === SUPPRESSED);
  t.check(!!bad, `${SUPPRESSED} is on this page`);
  if (bad) {
    t.check(!bad.hint, `${SUPPRESSED} offers no Hint button`);
    t.check(bad.note, `${SUPPRESSED} says where the help is instead`);
  }

  // And a neighbour that does have one, so "no buttons anywhere" cannot pass.
  const good = cards.find(c => /^\d{4} P[12] Q\d+$/.test(c.badge.trim())
                            && c.badge.trim() !== SUPPRESSED);
  t.check(!!good && good.hint,
    `a past paper neighbour (${good?.badge.trim() ?? 'none found'}) still offers one`);

  // ────────────────────────── and the ladder behind it actually has rungs
  /* Without this the whole file passes on a site where hints are dead. */
  t.check(await click(buttonNamed('Hint')), 'pressed that neighbour\'s Hint button');
  await sleep(1500);
  const ladder = await evaluate(`(() => {
    const p = document.querySelector('[role="dialog"][aria-label="Hint"]');
    if (!p) return null;
    return { text: (p.textContent || '').length, asks: /What it asks/.test(p.textContent || '') };
  })()`);
  t.check(!!ladder, 'the hint overlay opened');
  t.check(!!ladder?.asks,
    'and it has a ladder in it, not the empty panel 2021 used to get');
  await click(`document.querySelector('[aria-label="Close the hint"]')`);
  await sleep(700);

  // ─────────────────────────────────────────────────────── in Focus mode
  await go(TOPIC, 5000);
  t.check(await click(buttonNamed('Focus')), 'opened Focus');
  await sleep(2500);

  /**
   * **Scoped to the overlay, and null if it is not there.**
   *
   * Unscoped, `div.rounded-xl` inside a `space-y-4` parent matched the question
   * cards on the page *underneath*, which number 19 and carry 10 buttons and 9
   * notes — so every Focus assertion passed with the right numbers off the
   * wrong DOM, while the click that was supposed to open Focus had failed. That
   * is this repo's most expensive recurring mistake and it happened again here.
   */
  const focus = await evaluate(`(() => {
    const overlay = document.querySelector('div.fixed.inset-0.z-50.bg-background');
    if (!overlay) return null;
    const rows = [...overlay.querySelectorAll('div.rounded-xl')]
      .filter(d => d.parentElement && d.parentElement.classList.contains('space-y-4'));
    return {
      rows: rows.length,
      hints: rows.filter(r => [...r.querySelectorAll('button')]
        .some(b => b.textContent.trim() === 'Hint')).length,
      notes: rows.filter(r => /${NOTE.source}/.test(r.textContent || '')).length,
      suppressed: rows.filter(r => (r.textContent || '').includes(${JSON.stringify(SUPPRESSED)}))
        .map(r => ({
          hint: [...r.querySelectorAll('button')].some(b => b.textContent.trim() === 'Hint'),
          note: /${NOTE.source}/.test(r.textContent || ''),
        })),
    };
  })()`);

  t.check(!!focus, 'the Focus overlay is on screen — not the page behind it');
  t.check(focus?.rows === PLANNED + NOTED, `${focus?.rows} rows in Focus`);
  t.check(focus?.hints === PLANNED,
    `${focus?.hints} of them offer a Hint button (expected ${PLANNED})`);
  t.check(focus?.notes === NOTED,
    `${focus?.notes} explain the absence (expected ${NOTED})`);
  t.check(focus?.suppressed.length === 1
       && !focus.suppressed[0].hint && focus.suppressed[0].note,
    `${SUPPRESSED}'s row has the note and no button`);

  // ─────────────────────────────────────────── and in full screen, one by one
  /* Reloaded first. Focus was left open above, and this repo has lost three
     assertions to state an earlier step walked into. */
  await go(TOPIC, 5000);
  t.check(await click(buttonNamed('Full screen')), 'opened full screen');
  await sleep(2500);

  const seenHints = [];
  const seenNotes = [];
  let suppressedSeen = null;
  let lost = 0;
  for (let i = 0; i < PLANNED + NOTED; i++) {
    /* Never `|| document.body`. That fallback was here, the click above had
       failed, and the whole walk read the practice page instead — reporting a
       Hint button and a note on all 19 questions at once. An absent overlay is
       a failure, not something to substitute for. */
    const s = await evaluate(`(() => {
      const root = document.querySelector('div.fixed.inset-0.z-50.bg-background');
      if (!root) return null;
      const txt = root.textContent || '';
      return {
        hint: [...root.querySelectorAll('button')].some(b => b.textContent.trim() === 'Hint'),
        note: /${NOTE.source}/.test(txt),
        here: txt.includes(${JSON.stringify(SUPPRESSED)}),
      };
    })()`);
    if (!s) { lost++; break; }
    seenHints.push(s.hint);
    seenNotes.push(s.note);
    if (s.here) suppressedSeen = s;
    if (i < PLANNED + NOTED - 1) {
      await click(buttonNamed('Next'));
      await sleep(700);
    }
  }
  t.check(lost === 0 && seenHints.length === PLANNED + NOTED,
    `walked all ${PLANNED + NOTED} questions with the overlay up (saw ${seenHints.length})`);

  t.check(seenHints.filter(Boolean).length === PLANNED,
    `${seenHints.filter(Boolean).length} of ${PLANNED + NOTED} questions offer a Hint button in full screen (expected ${PLANNED})`);
  t.check(seenNotes.filter(Boolean).length === NOTED,
    `${seenNotes.filter(Boolean).length} explain the absence (expected ${NOTED})`);
  t.check(seenHints.every((h, i) => h !== seenNotes[i]),
    'and never both or neither on the same question');
  t.check(!!suppressedSeen, `walked past ${SUPPRESSED} in full screen`);
  t.check(!!suppressedSeen && !suppressedSeen.hint && suppressedSeen.note,
    `${SUPPRESSED} offers no button there either, and says why`);
});

t.done('a question with no marking instructions offers no hint, and says why');
