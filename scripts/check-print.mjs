/**
 * What the printer is handed is the same in both themes.
 *
 *   npm run build && node scripts/check-print.mjs
 *
 * **Not in `build`** — it needs headless Chrome and the Cloudflare image has none.
 *
 * ## Why this exists
 *
 * Print was the last thing light mode could not prove. The print rules were
 * re-keyed during that work — the booklets' hard-coded `bg-gray-*` fills moved
 * onto `bg-card` and `bg-muted`, and a print rule still naming the old literals
 * would have matched nothing and put screen colours on paper — and the only
 * verification was reading the CSS.
 *
 * **The requirement is not "light mode prints well". It is that print does not
 * know which theme is on.** `@media print` forces `background: white` and
 * `color: #111` over everything, so a sheet handed to a class must be identical
 * whether the teacher who pressed print was in dark mode or light. That is a
 * comparison, not a judgement, and a comparison can be checked exactly.
 *
 * ## How
 *
 * Chrome is told to emulate print media, which applies `@media print` without
 * a printer, a dialog, or a PDF. The page is then measured twice — once with
 * the theme set to dark, once to light — and the two readings must agree.
 *
 * Reading colours rather than comparing screenshots: two renders of the same
 * page differ by a pixel or two for reasons that have nothing to do with theme
 * (font hinting, a caret, subpixel rounding), and a hash would fail on those
 * while saying nothing useful. What matters is the ink.
 */
import { withPage, tally } from './browser-drive.mjs';

const t = tally();

/**
 * **The things that are actually printed, and nothing else.**
 *
 * The first version of this measured a past paper page, a notes topic and a
 * practice topic, and reported four differences. They were real readings of
 * pages nobody prints: `@media print` forces the ground and text colour on
 * `body`, and descendants keep whatever the theme gave them, so any page
 * without print rules of its own reads differently in the two themes. That is
 * not a fault, it is a page that was never a print target.
 *
 * The site has exactly three: the worksheet a class is handed, the formula
 * sheet issued with the exam, and the markscheme a teacher keeps. Each has its
 * own rules — `.worksheet-question`, `.print-formula-sheet`, `.markscheme-doc`
 * — and those rules are what has to be theme-blind.
 */
const SHEET_FROM = '/course/n5/generate/paper/2024/paper-1';

/**
 * Every distinct ink on the page, with how many elements use it.
 *
 * Not per-element: a list keyed by element index would differ between runs for
 * innocent reasons. The set of colours in use, and how much of each, is the
 * thing that must not change.
 */
const INKS = `(() => {
  const laid = el => { const r = el.getBoundingClientRect();
    return r.width >= 1 && r.height >= 1; };
  const fg = new Map(), bg = new Map();
  const bump = (m, k) => m.set(k, (m.get(k) || 0) + 1);
  for (const el of document.querySelectorAll('body *')) {
    if (!laid(el)) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    bump(fg, cs.color);
    if (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)') {
      bump(bg, cs.backgroundColor);
    }
  }
  // **Which colours, not how many elements.**
  //
  // Each run builds a different random worksheet, so the same page legitimately
  // has a different number of elements in it — 1820 spans of #111 in one run
  // and 1895 in the next. Counting them compared the draw, not the ink, and
  // reported a difference in identical colours. The set is the thing that must
  // not change with the theme.
  const norm = m => [...m.keys()].sort();
  return JSON.stringify({
    text: norm(fg),
    fills: norm(bg),
    bodyBg: getComputedStyle(document.body).backgroundColor,
    bodyColor: getComputedStyle(document.body).color,
  });
})()`;

/** Build a real shared worksheet, the way a teacher does, then print-emulate it. */
async function readSheet(theme) {
  let inks = null;
  await withPage({ port: 8191, cdp: 9291, width: 1280, height: 900 },
    async ({ evaluate, click, send, go, sleep }) => {
      await go('/', 1500);
      await evaluate(`localStorage.setItem('theme', ${JSON.stringify(theme)})`);
      await go(SHEET_FROM, 2500);
      for (let i = 0; i < 40; i++) {
        if (!(await evaluate('/Drawing question/.test(document.body.innerText)'))) break;
        await sleep(1000);
      }
      await click(`[...document.querySelectorAll('button')]
        .find(x => /open as a worksheet/i.test(x.textContent || ''))`);
      await sleep(7000);
      if (!(await evaluate("location.pathname === '/worksheet'"))) return;

      // On screen first: the control. If the two themes do not differ HERE,
      // the probe is blind and its agreement under print means nothing.
      const onScreen = JSON.parse(await evaluate(INKS));

      await send('Emulation.setEmulatedMedia', { media: 'print' });
      await sleep(800);
      inks = JSON.parse(await evaluate(INKS));
      inks.screen = onScreen;

      // The formula sheet prints as its own document, from the same page.
      await send('Emulation.setEmulatedMedia', { media: 'screen' });
      await click(`[...document.querySelectorAll('button')]
        .find(x => /formulae/i.test(x.textContent || ''))`);
      await sleep(1800);
      // The click reporting true only means something was pressed. The first
      // version trusted that and read the worksheet again, then compared it
      // with itself and called it the formula sheet.
      const isOpen = await evaluate("!!document.querySelector('.print-formula-sheet')");
      if (isOpen) {
        await send('Emulation.setEmulatedMedia', { media: 'print' });
        await sleep(600);
        inks.formula = JSON.parse(await evaluate(
          INKS.replace("document.querySelectorAll('body *')",
                       "document.querySelectorAll('.print-formula-sheet *')")));
      }
    });
  return inks;
}

const dark = await readSheet('dark');
const light = await readSheet('light');

t.check(dark && light, 'a worksheet was built and print-emulated in both themes');

if (dark && light) {
  t.check(dark.bodyBg === light.bodyBg,
    `the sheet prints on the same ground in both themes (${dark.bodyBg} / ${light.bodyBg})`);
  t.check(dark.bodyColor === light.bodyColor,
    `and in the same text colour (${dark.bodyColor} / ${light.bodyColor})`);

  const sameText = JSON.stringify(dark.text) === JSON.stringify(light.text);
  t.check(sameText, 'every text colour on the sheet matches'
    + (sameText ? ` (${dark.text.length} distinct)`
      : `
        dark:  ${dark.text.slice(0, 5).join(' | ')}`
        + `
        light: ${light.text.slice(0, 5).join(' | ')}`));

  const sameFills = JSON.stringify(dark.fills) === JSON.stringify(light.fills);
  t.check(sameFills, 'every fill on the sheet matches'
    + (sameFills ? ` (${dark.fills.length} distinct)`
      : `
        dark:  ${dark.fills.slice(0, 5).join(' | ')}`
        + `
        light: ${light.fills.slice(0, 5).join(' | ')}`));

  t.check(dark.text.length > 1, `the sheet is a document, not one flat colour (${dark.text.length} inks)`);

  // **The control, and the reason any of the above can be believed.**
  //
  // The same sheet, the same probe, without print emulation: on screen the two
  // themes must disagree. If they ever match here, the theme is not being
  // applied, the probe is reading nothing, and every "matches" above is a pass
  // earned by measuring the same thing twice.
  const screenDiffers = JSON.stringify(dark.screen.text) !== JSON.stringify(light.screen.text)
    || JSON.stringify(dark.screen.fills) !== JSON.stringify(light.screen.fills);
  t.check(screenDiffers,
    'and on screen the two themes DO differ, so the probe can tell them apart'
    + (screenDiffers
      ? ` (${dark.screen.text.length} vs ${light.screen.text.length} text colours)`
      : ' — they did not, so nothing above was actually compared'));

  if (dark.formula && light.formula) {
    const fText = JSON.stringify(dark.formula.text) === JSON.stringify(light.formula.text);
    const fFill = JSON.stringify(dark.formula.fills) === JSON.stringify(light.formula.fills);
    t.check(fText, 'the formula sheet prints the same text colours'
      + (fText ? '' : `
        dark:  ${dark.formula.text.slice(0, 5).join(' | ')}`
        + `
        light: ${light.formula.text.slice(0, 5).join(' | ')}`));
    t.check(fFill, 'the formula sheet prints the same fills'
      + (fFill ? '' : `
        dark:  ${dark.formula.fills.slice(0, 5).join(' | ')}`
        + `
        light: ${light.formula.fills.slice(0, 5).join(' | ')}`));
  } else {
    t.check(false, 'the formula sheet was opened and print-emulated');
  }
}

/**
 * **Everything that will reach the paper is released before the dialog opens.**
 *
 * Question diagrams carry `loading="lazy"`, which is right for browsing and
 * wrong for printing: an image that never scrolled into view was never
 * fetched. Chromium force-loads them when printing; WebKit does not, so on an
 * iPhone they print blank.
 *
 * The helper used to look for them by container class — `.worksheet-container
 * img` — which made it a rule somebody had to remember when they built the
 * next printable surface, and the failure only ever showed up on someone
 * else's iPad. Now it asks what will actually print.
 *
 * This holds that: press Print, and no image that would reach the paper may
 * still be marked lazy. `window.print` is replaced first, because a real print
 * dialog cannot be dismissed from here.
 */
await withPage({ port: 8191, cdp: 9291, width: 1280, height: 900 },
  async ({ evaluate, click, go, sleep }) => {
    await go(SHEET_FROM, 2500);
    for (let i = 0; i < 40; i++) {
      if (!(await evaluate('/Drawing question/.test(document.body.innerText)'))) break;
      await sleep(1000);
    }
    await click(`[...document.querySelectorAll('button')]
      .find(x => /open as a worksheet/i.test(x.textContent || ''))`);
    await sleep(7000);

    const on = await evaluate("location.pathname === '/worksheet'");
    t.check(on, 'a sheet to print was built');
    if (!on) return;

    await evaluate('window.__printed = 0; window.print = () => { window.__printed++; };');
    await click(`[...document.querySelectorAll('button')]
      .find(x => /print/i.test(x.textContent || ''))`);
    await sleep(4000);

    const r = JSON.parse(await evaluate(`(() => {
      const printable = [...document.querySelectorAll('img')]
        .filter(i => !i.closest('.no-print, .glass'));
      return JSON.stringify({
        printed: window.__printed || 0,
        printable: printable.length,
        stillLazy: printable.filter(i => i.loading === 'lazy').length,
        notLoaded: printable.filter(i => !(i.complete && i.naturalWidth > 0)).length,
      });
    })()`));

    t.check(r.printed > 0, `the print path ran (${r.printed})`);
    t.check(r.printable > 0, `the sheet has images to lose (${r.printable})`);
    t.check(r.stillLazy === 0,
      `no image that will print is still lazy (${r.stillLazy} of ${r.printable})`);
    t.check(r.notLoaded === 0,
      `and every one of them has actually loaded (${r.notLoaded} outstanding)`);
  });

t.done('what the printer is handed is the same in both themes');
