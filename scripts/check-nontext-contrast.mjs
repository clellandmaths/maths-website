/**
 * The parts of the site that are not text can still be seen.
 *
 *   npm run build && node scripts/check-nontext-contrast.mjs [--theme=light]
 *
 * **Not in `build`** — it needs headless Chrome and the Cloudflare image has none.
 *
 * ## Why this exists
 *
 * `check-contrast.mjs` measures text, and every text node on 287 pages clears
 * AA in both themes. That is a real result about exactly one thing. An icon
 * with no label, the edge of a card, the ring that says which control has the
 * keyboard — none of those are text, none of them were ever measured, and light
 * mode was called finished without them. WCAG 1.4.11 asks **3:1** for them.
 *
 * It matters more in light than in dark. A dark interface separates surfaces by
 * lightness, so an edge is a bonus; a light interface separates them with the
 * edge itself, and `--border` moved from `#e2e2e8` to `#d7d7e0` during that
 * work on the strength of how it looked rather than what it measured.
 *
 * ## What is checked, and what is deliberately not
 *
 * **Icons.** Every laid-out `<svg>`, against what is behind it. These are
 * lucide icons drawn in `currentColor`, so an icon inherits the text colour of
 * whatever it sits in and can be dimmed by a `text-muted-*` class that was
 * chosen for words rather than for a shape.
 *
 * **The boundaries that identify a control.** Not every border, and not
 * cards. 1.4.11 covers what is needed to *identify a component or its state*,
 * and the first version of this ignored that: it flagged 54 plain text-grouping
 * `<div>`s on one page, which is how a check teaches someone to stop reading
 * it. A card holding prose is not a control, and a button whose own label names
 * it is identified by that label — its text contrast is already measured.
 *
 * What is left is the case where the box **is** the control and there is no
 * text inside it to identify it:
 *
 *   - form fields — `input`, `select`, `textarea`, a checkbox or radio: empty
 *     until someone fills them, so the outline is the whole affordance
 *   - controls with no text at all — an icon-only button, where both the icon
 *     and its box carry the entire meaning
 *
 * and each passes on **either** its edge or its fill against what is outside
 * it, since either one alone makes it visible.
 *
 * **A box-shadow counts as a boundary and is not measured.** The light theme
 * separates surfaces with shadow rather than edges — that is the documented
 * decision behind `--shadow-1` — so an element carrying one has a visible
 * boundary whatever its border does. A soft alpha gradient has no single
 * contrast value to quote, so this records that a shadow is present and does
 * not pretend to a number. It is the one place here that trusts a design
 * decision instead of measuring it, and it is written down for that reason.
 *
 * **Focus rings.** Each interactive element is focused and measured, because
 * the ring is the only thing telling a keyboard user where they are, and it is
 * the single most commonly broken non-text contrast on any site. Measured as
 * drawn: `outline-color` where there is an outline, otherwise the `box-shadow`
 * ring Tailwind's `ring-*` utilities produce.
 *
 * **Not checked:** the maths. KaTeX draws fraction bars and radicals as
 * borders on tiny boxes in `currentColor`, so they carry exactly the contrast
 * of the text they belong to, which `check-contrast.mjs` already measures. They
 * would be thousands of duplicate readings of a number already known.
 */
import { withPage, tally } from './browser-drive.mjs';
import { COLOUR_PRELUDE } from './contrast-probe.mjs';

const t = tally();
const args = process.argv.slice(2);
const THEME = (args.find(a => a.startsWith('--theme=')) || '--theme=dark').slice(8);
if (THEME !== 'dark' && THEME !== 'light') {
  console.error('\n  --theme must be dark or light. Nothing was checked.\n');
  process.exit(1);
}

/** Enough of the site to meet every surface, in the order a pupil would. */
const PAGES = [
  ['/', 'home'],
  ['/explorer?c=n5', 'explorer'],
  ['/course/n5', 'course'],
  ['/course/n5/notes/expressions-and-formulae/surds', 'notes'],
  ['/course/n5/practice/3d-coordinates', 'practice'],
  ['/course/n5/papers/2024/paper-1', 'paper'],
  ['/exam-hall', 'exam hall'],
  ['/course/higher-apps/notes', 'apps notes'],
];

const NEED = 3;

const PROBE = `(() => {
${COLOUR_PRELUDE}

  const out = { icons: 0, boundaries: 0, rings: 0, skipped: 0,
               labelled: 0, byShadow: 0, uaPainted: 0, fails: [] };

  const laid = el => { const r = el.getBoundingClientRect();
    return r.width >= 1 && r.height >= 1; };
  const faded = el => {
    for (let p = el; p; p = p.parentElement) {
      const o = parseFloat(getComputedStyle(p).opacity);
      if (!isNaN(o) && o < 1) return true;
    }
    return false;
  };
  const shown = el => {
    const cs = getComputedStyle(el);
    return cs.visibility !== 'hidden' && cs.display !== 'none' && laid(el) && !faded(el);
  };
  function hex(p) { return '#' + p.map(v => v.toString(16).padStart(2, '0')).join(''); }

  /** The worst ratio of a colour against every backdrop the element may have. */
  const worstAgainst = (colour, bgs) => {
    let worst = null;
    for (const bg of bgs) {
      const fg = flatten(hex(bg), [colour]);
      const got = ratio(fg, bg);
      if (!worst || got < worst.got) worst = { got, fg: hex(fg), bg: hex(bg) };
    }
    return worst;
  };

  const record = (kind, el, worst, note) => {
    out.fails.push({
      kind, note: note || '',
      tag: el.tagName.toLowerCase(),
      cls: (el.className && el.className.baseVal !== undefined
            ? el.className.baseVal : String(el.className || '')).slice(0, 74),
      fg: worst.fg, bg: worst.bg,
      ratio: Math.round(worst.got * 100) / 100,
    });
  };

  // ── icons ────────────────────────────────────────────────────────────────
  for (const svg of document.querySelectorAll('svg')) {
    if (!shown(svg)) continue;
    // Inside a link or button whose own text says the same thing, the icon is
    // decoration; alone, it is the control. Both are measured — an icon too
    // faint to see is poor either way — but the note says which it was.
    const cs = getComputedStyle(svg);
    // lucide strokes in currentColor; some marks fill instead.
    const ink = (cs.stroke && cs.stroke !== 'none') ? cs.stroke
              : (cs.fill && cs.fill !== 'none') ? cs.fill
              : cs.color;
    if (!valid(ink) || alphaOf(ink) === 0) { out.skipped++; continue; }
    const bgs = backdrops(svg);
    if (!bgs) { out.skipped++; continue; }
    out.icons++;
    const worst = worstAgainst(ink, bgs);
    if (worst && worst.got < ${NEED} - 0.005) {
      const host = svg.closest('a, button, [role=button]');
      const labelled = host && (host.textContent || '').trim().length > 0;
      record('icon', svg, worst, labelled ? 'beside a label' : 'the control itself');
    }
  }

  // ── component boundaries ─────────────────────────────────────────────────
  //
  // A card or a control is identified either by its edge or by its fill. It
  // fails only when neither can be seen against what is outside it.
  const BOUNDARY = 'input, select, textarea, [role=checkbox], [role=radio],'
    + ' button, [role=button], a[href], summary';
  for (const el of document.querySelectorAll(BOUNDARY)) {
    if (!shown(el)) continue;
    const cs = getComputedStyle(el);

    // A control whose own words identify it does not need a visible box: its
    // text contrast is measured by check-contrast.mjs and that is the
    // requirement. A field is empty until it is filled, so it never qualifies.
    const isField = /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)
      || el.getAttribute('role') === 'checkbox' || el.getAttribute('role') === 'radio';
    if (!isField && (el.textContent || '').trim().length > 0) { out.labelled++; continue; }

    // **A native control is painted by the browser, not by this stylesheet.**
    //
    // appearance:auto means Chrome draws the checkbox — border, tick and all —
    // and the CSS border-color is inert: border-width computes to 0 and nothing
    // of it reaches the screen. Measuring the declared colours reported all 39
    // filter checkboxes as invisible at 1.07:1 in light and 1.35:1 in dark. A
    // screenshot at 3x shows six crisp, clearly-bordered boxes. Same mistake as
    // reading outline-color under outline-style:auto, and the same answer:
    // count it, name it, do not pretend to a number.
    if (cs.appearance === 'auto'
        && /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)
        && el.type !== 'text' && el.type !== 'search' && el.type !== 'email') {
      out.uaPainted++;
      continue;
    }

    const w = parseFloat(cs.borderTopWidth) || 0;
    const hasBorder = w > 0 && cs.borderTopStyle !== 'none' && alphaOf(cs.borderTopColor) > 0;
    const fill = cs.backgroundColor;
    const hasFill = alphaOf(fill) > 0;
    // Shadow is a boundary too, and the light theme leans on it deliberately.
    if (cs.boxShadow && cs.boxShadow !== 'none') { out.byShadow++; continue; }
    if (!hasBorder && !hasFill) continue;          // nothing drawn: nothing to see

    // What is behind the component, which is its parent's ground, not its own.
    const outside = el.parentElement ? backdrops(el.parentElement) : null;
    if (!outside) { out.skipped++; continue; }
    out.boundaries++;

    const byBorder = hasBorder ? worstAgainst(cs.borderTopColor, outside) : null;
    const byFill = hasFill ? worstAgainst(fill, outside) : null;
    const best = [byBorder, byFill].filter(Boolean)
      .reduce((a, b) => (a && a.got >= b.got ? a : b), null);
    if (best && best.got < ${NEED} - 0.005) {
      record('boundary', el, best,
        hasBorder && hasFill ? 'neither edge nor fill'
        : hasBorder ? 'edge only' : 'fill only');
    }
  }

  window.__nontext = out;
  return JSON.stringify(out);
})()`;

/**
 * Tab through the page and measure what marks the control that has the keyboard.
 *
 * **Two things here were wrong the first time, and both flattered the site.**
 *
 * `el.focus()` does not reliably set `:focus-visible`, which is the state a
 * keyboard ring is written against — so a page full of perfectly good rings
 * reported "no visible ring" 25 times. Focus has to arrive the way a keyboard
 * user sends it, so this dispatches real Tab keys and measures whatever ends up
 * as `document.activeElement`.
 *
 * And a ring is what focus *adds*. Reading `box-shadow` while focused caught
 * `--shadow-1`, the shadow the light theme puts under every card, and reported
 * it as a failed focus indicator at 1.08:1 on eleven cards that were never
 * focused at all. So each control's shadow and outline are recorded **before**
 * any focus, and the ring is the difference. No difference means no indicator,
 * which is the finding worth having.
 */
const SNAPSHOT = `(() => {
  const laid = el => { const r = el.getBoundingClientRect();
    return r.width >= 1 && r.height >= 1; };
  const out = {};
  let i = 0;
  for (const el of document.querySelectorAll('a[href], button, input, select, textarea, summary')) {
    if (!laid(el) || getComputedStyle(el).visibility === 'hidden') continue;
    const id = 'ntc' + (i++);
    el.setAttribute('data-ntc', id);
    const cs = getComputedStyle(el);
    out[id] = { shadow: cs.boxShadow, outline: cs.outlineStyle + ' ' + cs.outlineWidth };
  }
  return JSON.stringify(out);
})()`;

/** What the focused element looks like now, against its recorded resting state. */
const FOCUSED = before => `(() => {
${COLOUR_PRELUDE}
  function hex(p) { return '#' + p.map(v => v.toString(16).padStart(2, '0')).join(''); }

  const el = document.activeElement;
  if (!el || el === document.body) return JSON.stringify({ none: true });
  const id = el.getAttribute('data-ntc');
  const was = (${before})[id];
  if (!was) return JSON.stringify({ none: true });

  const cs = getComputedStyle(el);
  const desc = {
    id,
    tag: el.tagName.toLowerCase(),
    cls: String(el.className || '').slice(0, 58),
    text: (el.textContent || '').trim().slice(0, 28),
  };

  // The ring is what focus added, never what was already drawn.
  let ink = null;
  const ow = parseFloat(cs.outlineWidth) || 0;
  const outlineNow = cs.outlineStyle + ' ' + cs.outlineWidth;

  // **outline-style: auto is the browser's own ring, and its colour is a lie.**
  //
  // This site does not draw focus itself — it leaves the UA ring in place, and
  // Chrome paints a two-tone ring designed to stay visible on any background.
  // The computed outline-color still reports something (usually whatever the
  // element inherited), Chrome ignores it, and measuring it produced seven
  // failures at exactly 1:1 — including a ring reported as #0a0a0c on #0a0a0c,
  // which is the page's own background twice over. Not measurable here, and
  // not a fault: counted separately and named in the output so the number is
  // never mistaken for a pass that was earned.
  if (cs.outlineStyle === 'auto' && ow > 0 && outlineNow !== was.outline) {
    return JSON.stringify({ ...desc, uaRing: true });
  }

  if (ow > 0 && cs.outlineStyle !== 'none' && outlineNow !== was.outline
      && alphaOf(cs.outlineColor) > 0) {
    ink = cs.outlineColor;
  }

  // **Every layer of the shadow, not the first one.**
  //
  // A Tailwind ring computes to two shadows: an offset drawn in the page's own
  // background colour, then the ring itself. Taking the first gave the offset —
  // a colour identical to its backdrop by construction — and reported perfectly
  // good rings at exactly 1:1. A focus indicator is visible if ANY layer of it
  // is, so every layer is measured and the best one is the answer.
  const inks = ink ? [ink] : [];
  if (!ink && cs.boxShadow && cs.boxShadow !== 'none' && cs.boxShadow !== was.shadow) {
    for (const layer of topLevel(cs.boxShadow)) {
      for (const piece of layer.split(' ')) {
        if (valid(piece) && alphaOf(piece) > 0) { inks.push(piece); break; }
      }
      // A layer can lead with its colour or trail it; try the whole run too.
      const lead = layer.slice(0, layer.indexOf(')') + 1);
      if (lead && valid(lead) && alphaOf(lead) > 0) inks.push(lead);
    }
  }
  if (!inks.length) return JSON.stringify({ ...desc, noRing: true });

  const bgs = backdrops(el.parentElement || el);
  if (!bgs) return JSON.stringify({ ...desc, unmeasurable: true });

  // Worst backdrop for each layer; the layer that shows best is the indicator.
  let best = null;
  for (const one of inks) {
    let worst = null;
    for (const bg of bgs) {
      const fg = flatten(hex(bg), [one]);
      const got = ratio(fg, bg);
      if (!worst || got < worst.got) worst = { got, fg: hex(fg), bg: hex(bg) };
    }
    if (worst && (!best || worst.got > best.got)) best = worst;
  }
  return JSON.stringify({ ...desc, fg: best.fg, bg: best.bg,
    ratio: Math.round(best.got * 100) / 100, layers: inks.length });
})()`;

const totals = { icons: 0, boundaries: 0, rings: 0, skipped: 0, noRing: 0,
                 labelled: 0, byShadow: 0, uaRing: 0, uaPainted: 0 };
const fails = [];

await withPage({ port: 8185, cdp: 9285, width: 1280, height: 900 }, async ({ evaluate, send, go, sleep }) => {
  // The theme is chosen the way a visitor chooses it, then the page is loaded
  // again — stamping the attribute afterwards restyles nothing already drawn.
  await go('/', 2000);
  await evaluate(`localStorage.setItem('theme', ${JSON.stringify(THEME)})`);

  console.log(`\n  ${THEME}\n`);

  for (const [path, label] of PAGES) {
    await go(path, 3500);
    await sleep(500);

    const r = JSON.parse(await evaluate(PROBE));

    // Tab through the first stretch of the page, reading what focus adds at
    // each stop. Real key events, because :focus-visible is what draws a ring
    // and a programmatic focus() does not reliably set it.
    const before = await evaluate(SNAPSHOT);
    const ring = { checked: 0, ua: 0, noRing: [], fails: [] };
    const visited = new Set();
    for (let i = 0; i < 30; i++) {
      for (const type of ['rawKeyDown', 'keyUp']) {
        await send('Input.dispatchKeyEvent',
          { type, key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 });
      }
      const got = JSON.parse(await evaluate(FOCUSED(before)));
      if (got.none || visited.has(got.id)) continue;
      visited.add(got.id);
      ring.checked++;
      if (got.uaRing) { ring.ua++; continue; }
      if (got.noRing) { ring.noRing.push(got); continue; }
      if (got.unmeasurable) continue;
      if (got.ratio < NEED - 0.005) ring.fails.push(got);
    }

    totals.icons += r.icons;
    totals.boundaries += r.boundaries;
    totals.skipped += r.skipped;
    totals.labelled += r.labelled;
    totals.byShadow += r.byShadow;
    totals.uaPainted += r.uaPainted;
    totals.rings += ring.checked;
    totals.noRing += ring.noRing.length;
    totals.uaRing += ring.ua;

    for (const f of r.fails) fails.push({ ...f, page: label });
    for (const f of ring.fails) fails.push({ ...f, kind: 'focus ring', note: '', page: label });

    const bad = r.fails.length + ring.fails.length;
    console.log(`  ${label.padEnd(11)} ${String(r.icons).padStart(4)} icons  `
      + `${String(r.boundaries).padStart(4)} boundaries  ${String(ring.checked).padStart(3)} focused  `
      + (bad ? `${bad} below ${NEED}:1` : 'all clear')
      + (ring.noRing.length ? `  (${ring.noRing.length} with no visible ring)` : ''));
  }
});

console.log(`\n  ${totals.icons} icons, ${totals.boundaries} boundaries, `
  + `${totals.rings} focused controls; ${totals.skipped} unmeasurable`);

if (!fails.length) {
  console.log(`\n  everything measured clears ${NEED}:1 in ${THEME}\n`);
} else {
  // Grouped, because one class used 40 times is one decision to make.
  const byPair = new Map();
  for (const f of fails) {
    const k = `${f.kind}|${f.fg}|${f.bg}|${f.cls}`;
    const hit = byPair.get(k);
    if (hit) { hit.n++; hit.pages.add(f.page); }
    else byPair.set(k, { ...f, n: 1, pages: new Set([f.page]) });
  }
  const groups = [...byPair.values()].sort((a, b) => a.ratio - b.ratio);
  console.log(`\n  ${fails.length} below ${NEED}:1, from ${groups.length} distinct cause(s):\n`);
  for (const g of groups) {
    console.log(`  ${String(g.ratio).padStart(5)}:1  ${g.kind.padEnd(10)} ${g.fg} on ${g.bg}  x${g.n}`
      + `  [${[...g.pages].join(', ')}]`);
    console.log(`           ${g.tag}${g.note ? ` (${g.note})` : ''}  ${g.cls}`);
  }
  console.log('');
}

t.check(totals.icons > 0, `icons were found and measured (${totals.icons})`);
// **That controls were examined, not that any were eligible to fail.**
//
// Every control on these pages turns out to be identified by its own text, by a
// shadow, or by the browser painting it — so the number left needing a measured
// edge is legitimately zero, and an assertion of "more than zero measured" fails
// on a site that is doing the right thing. What must never reach zero is the
// looking.
const examined = totals.boundaries + totals.labelled + totals.byShadow + totals.uaPainted;
t.check(examined > 0,
  `controls were examined for a visible boundary (${examined}: `
  + `${totals.boundaries} measured, ${totals.labelled} named by their text, `
  + `${totals.byShadow} by shadow, ${totals.uaPainted} browser-painted)`);
t.check(totals.rings > 0, `focusable controls were focused and measured (${totals.rings})`);
t.done(`non-text contrast in ${THEME}`);
