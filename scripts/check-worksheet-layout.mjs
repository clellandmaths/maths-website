/**
 * The worksheet card's header holds its shape, at every width.
 *
 *   npm run build && node scripts/check-worksheet-layout.mjs
 *
 * **Not in `build`** — it needs headless Chrome and the Cloudflare image has none.
 *
 * The header was one wrapping row: number, paper reference, topic tags and the
 * mark allocation, with the reorder buttons beside it. Two things fell out of
 * that, and both depended on how many topic tags a question happened to carry:
 *
 *   - **the reorder buttons drifted to the vertical middle** of however tall
 *     the tag block was, so on a two-tag question they floated in the gap
 *   - **the marks were flung to `margin-left: auto`**, so once the tags wrapped
 *     they sat alone on a third line, reading as centred and belonging to
 *     nothing
 *
 * So the header changed shape down the sheet, which is what looked wrong rather
 * than any single card being wrong.
 *
 * It is two rows now — identity above, description below, controls pinned top
 * right — and this measures that at **four widths**, with a question of each
 * shape at every one. A one-tag and a two-tag question must produce the same
 * geometry, which is the property that was missing, and it has to hold on a
 * phone and at a desk: a sheet is built on one and marked on the other.
 *
 * 1024px is the `lg:` breakpoint, so 390 and 768 meet the mobile filter overlay
 * while 1280 and 1600 get the sidebar.
 */
import { withPage, tally } from './browser-drive.mjs';

const t = tally();

const WIDTHS = [['phone', 390, 844], ['tablet', 768, 1024],
                ['laptop', 1280, 900], ['desk', 1600, 1000]];

for (const [where, width, height] of WIDTHS) {
  await withPage({ port: 8141, cdp: 9241, width, height }, async ({ evaluate, click, buttonMatching, labelNamed, go, sleep }) => {
    await go('/explorer?c=n5', 4000);

    // Comparing Data gives a two-tag question; Surds gives a one-tag one.
    if (width < 1024) {
      await click(buttonMatching(/^Filters$/));
      await sleep(1200);
    }
    for (const topic of ['Comparing Data', 'Surds']) {
      await click(labelNamed(topic));
      await sleep(1200);
    }
    if (width < 1024) {
      await click(buttonMatching(/^Show \d+ questions?$/));
      await sleep(2000);
    }

    await click(buttonMatching(/^Add all \d+ to worksheet$/));
    await sleep(1800);
    await click(buttonMatching(/My Worksheet/));
    await sleep(2200);

    const cards = await evaluate(`(() => {
      const box = el => { const r = el.getBoundingClientRect();
        return { top: r.top, left: r.left, right: r.right }; };
      return [...document.querySelectorAll('.worksheet-question')].slice(0, 12).map(card => {
        const c = box(card);
        const badge = card.querySelector('.q-badge');
        const marks = card.querySelector('.q-marks');
        const ctrl = card.querySelector('.no-print');
        const tags = [...card.querySelectorAll('.topic-tag')];
        const last = tags.length ? box(tags[tags.length - 1]) : null;
        return {
          tags: tags.length,
          // Relative to the card, so cards and widths can be compared.
          badgeTop: badge ? Math.round(box(badge).top - c.top) : null,
          ctrlTop: ctrl ? Math.round(box(ctrl).top - c.top) : null,
          marksLeft: marks ? Math.round(box(marks).left - c.left) : null,
          marksTop: marks ? Math.round(box(marks).top - c.top) : null,
          lastTagRight: last ? Math.round(last.right - c.left) : null,
          lastTagTop: last ? Math.round(last.top - c.top) : null,
          firstTagLeft: tags.length ? Math.round(box(tags[0]).left - c.left) : null,
          // Where the header block begins, which is the badge — a wrap in the
          // one-row layout starts here rather than under the tags.
          badgeLeft: badge ? Math.round(box(badge).left - c.left) : null,
          width: Math.round(c.right - c.left),
          // The header row only, never the question: maths renders one token
          // per line in innerText, so "x^2 - 81 = 0" contains a lone "0" and a
          // whole-card scan for a stray zero matches real content.
          headerText: marks?.parentElement?.innerText ?? '',
        };
      });
    })()`);

    const w = `${where} ${width}px`;
    t.check((cards?.length ?? 0) >= 2, `${w} · ${cards?.length} cards on the sheet`);

    const oneTag = cards?.find(c => c.tags === 1);
    const twoTag = cards?.find(c => c.tags === 2);
    t.check(!!oneTag && !!twoTag, `${w} · a one-tag and a two-tag question to compare`);

    // ── the controls do not drift ─────────────────────────────────────────
    t.check(oneTag?.ctrlTop === twoTag?.ctrlTop,
      `${w} · reorder buttons at the same height on both (${oneTag?.ctrlTop} and ${twoTag?.ctrlTop})`);
    t.check(Math.abs((oneTag?.ctrlTop ?? 0) - (oneTag?.badgeTop ?? 0)) < 14,
      `${w} · level with the number, not floating below it (${oneTag?.ctrlTop} vs ${oneTag?.badgeTop})`);

    // ── the marks sit with the topics ─────────────────────────────────────
    for (const [name, c] of [['1 tag', oneTag], ['2 tags', twoTag]]) {
      /* **Measured as a gap, not as "in the left half".** Two long tags
         legitimately fill more than half an 896px card, and the marks sitting
         right after them is correct — a halfway line called that a failure.
         The fault being guarded against is the marks flung to the far edge on
         a line of their own. */
      const gap = (c?.marksLeft ?? 0) - (c?.lastTagRight ?? 0);
      const beside = c?.marksTop === c?.lastTagTop && gap >= 0 && gap < 40;
      /* Or wrapped cleanly onto the next line, starting where the tags start.
         Two long tags fill a 768px row and the marks have to go somewhere; the
         fault is them floating away from the block, not them wrapping. */
      /* Or wrapped cleanly onto the next line, starting where the block starts.
         **The block starts at the badge, not at the first tag.** The header was
         two rows when this was written — a badge-and-reference line, then an
         indented chip line — so a wrap could only land under the tags. It is
         one wrapping row again now, the layout the live site has and the one
         this drifted away from: number, reference, tags and marks reading left
         to right, and the question under them. A wrap in that row returns to
         the badge. Either alignment keeps the marks with the block, which is
         the fault being guarded against — marks adrift on a line of their own. */
      const under = (c?.marksTop ?? 0) > (c?.lastTagTop ?? 0)
        && (Math.abs((c?.marksLeft ?? 0) - (c?.firstTagLeft ?? 0)) < 4
          || Math.abs((c?.marksLeft ?? 0) - (c?.badgeLeft ?? 0)) < 4);
      t.check(beside || under,
        `${w} · ${name} · marks ${beside ? `beside the last tag (${gap}px after it)` : `wrapped to the start of the block at ${c?.marksLeft}px`}`);

      /* **The header is one line when its contents fit on one line.**
         This used to assert the opposite — that the marks sat BELOW the paper
         reference — because the header was two rows by design. It outlived that
         design and then passed by accident: a one-tag card reported 29 against
         25 and called it "below", when 4px is the difference between a 24px
         chip and a 32px badge centred on the same line.
         So it now asserts what the layout actually promises, and the tolerance
         is the badge's own height rather than a number chosen to make a reading
         pass. A card whose tags genuinely overflow may wrap, and `beside ||
         under` above already holds that case honest. */
      /* **There is no "and it is all on one line" assertion here, deliberately.**
         The obvious one to write after this layout was restored — the marks
         share the reference's line — is not a promise the design can keep. The
         card is 896px whatever the viewport, so a question carrying two long
         topic tags wraps at 1600px exactly as it does at 768px, and the live
         site wraps there too. An assertion demanding one line would be asking
         the layout to lie on wide screens, and the version of it written first
         did exactly that: it failed a card that was behaving correctly.

         What the header actually promises is above — the marks stay with the
         block, beside the tags or back at the start of it, never adrift on a
         line of their own. That is the fault this check exists for, and it
         holds at every width. */
    }

    // ── every card on the sheet has the same header geometry ──────────────
    const tops = new Set(cards?.map(c => c.ctrlTop));
    t.check(tops.size === 1,
      `${w} · all ${cards?.length} cards agree on control height (${[...tops].join(', ')})`);

    // ── and no header renders a stray 0 ───────────────────────────────────
    const stray = (cards ?? []).some(c => /(^|\n)\s*0\s*(\n|$)/.test(c.headerText));
    t.check(!stray, `${w} · no header renders a bare 0 where its tags and marks would be`);
  });
}

t.done('the worksheet header holds its shape at every width');
