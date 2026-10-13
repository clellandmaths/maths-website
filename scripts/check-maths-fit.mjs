/**
 * Long inline maths on a phone (lib/maths-fit.ts; the owner, 2026-10-13: "Let's go E"), held in Chrome on the built
 * site, on three AH papers that have the worst cases (2026 P2 Q13's fraction, 2025 P2 Q18's bracket, 2016's marking
 * instructions), at 320 and 390 px, with every answer open:
 *   - no formula's lines overlap (by its characters: a fraction's numerator is drawn above its piece's box, which is
 *     how 2026 P2 Q13's "1" reached 10 px into the line above while the boxes only touched);
 *   - no formula runs past its column;
 *   - no box is wider than the screen that is not already so with the fit switched off (a formula kept whole in a
 *     table cell once widened the marking tables: 71 -> 95 at 320 px);
 *   - printed, every formula and question box is exactly where it is with the fit switched off.
 * "Switched off" answers no to the script's own phone test, so it never starts.
 *
 *   node scripts/check-maths-fit.mjs   (after npm run build)
 */
import { withPage, tally } from './browser-drive.mjs';

const t = tally();
const PAGES = ['/course/ah/papers/2026/paper-2', '/course/ah/papers/2025/paper-2', '/course/ah/papers/2016/paper-1'];
const OFF = `(() => { const mm = window.matchMedia.bind(window); window.matchMedia = q => q === 'screen and (max-width: 767px)' ? mm('(min-width: 99999px)') : mm(q); })()`;
const FORMULAS = `(() => {
  let overlap = 0, over = 0;
  for (const k of document.querySelectorAll('main .katex')) {
    if (k.closest('.katex-display') || k.parentElement.closest('.katex')) continue;
    const lines = [];
    for (const b of k.querySelectorAll(':scope > .katex-html > .base')) {
      const r = b.getBoundingClientRect(); if (!r.width) continue;
      let top = Infinity, bottom = -Infinity;
      const w = document.createTreeWalker(b, NodeFilter.SHOW_TEXT);
      for (let n = w.nextNode(); n; n = w.nextNode()) { if (!n.textContent.trim()) continue; const g = document.createRange(); g.selectNodeContents(n); for (const x of g.getClientRects()) if (x.height) { top = Math.min(top, x.top); bottom = Math.max(bottom, x.bottom); } }
      const l = lines.find(l => r.top < l.bb - 2 && r.bottom > l.bt + 2);
      if (l) { l.top = Math.min(l.top, top); l.bottom = Math.max(l.bottom, bottom); l.bt = Math.min(l.bt, r.top); l.bb = Math.max(l.bb, r.bottom); }
      else lines.push({ top, bottom, bt: r.top, bb: r.bottom });
      let col = k.parentElement; while (col && getComputedStyle(col).display.startsWith('inline')) col = col.parentElement;
      if (col && !col.closest('.overflow-x-auto, table') && r.right > col.getBoundingClientRect().right + 1) over++;
    }
    lines.sort((a, b) => a.bt - b.bt);
    for (let i = 1; i < lines.length; i++) if (lines[i - 1].bottom - lines[i].top > 1) { overlap++; break; }
  }
  return JSON.stringify({ overlap, over });
})()`;
const WIDE = `[...document.querySelectorAll('main table, main .overflow-x-auto, main .katex-display')].filter(e => e.scrollWidth > e.clientWidth + 1).length + (document.documentElement.scrollWidth > innerWidth + 1 ? 1000 : 0)`;
const BOXES = `[...document.querySelectorAll('main .katex, main .question-content')].map(e => { const b = e.getBoundingClientRect(); return [b.x, b.y, b.width, b.height].map(v => Math.round(v * 10)).join(','); }).join(';') + '|' + document.documentElement.scrollHeight`;

for (const width of [320, 390]) {
  for (const off of [true, false]) {
    await withPage({ port: off ? 8216 : 8217, cdp: off ? 9316 : 9317, width, height: 844 }, async ({ send, evaluate, go, sleep }) => {
      if (off) await send('Page.addScriptToEvaluateOnNewDocument', { source: OFF });
      for (const page of PAGES) {
        await send('Emulation.setEmulatedMedia', { media: '' });
        await go(page, 5000);
        await evaluate(`[...document.querySelectorAll('main button')].filter(b => /^show answer$/i.test(b.textContent.trim())).forEach(b => b.click())`);
        await sleep(1500);
        const f = JSON.parse(await evaluate(FORMULAS));
        const wide = await evaluate(WIDE);
        await send('Emulation.setEmulatedMedia', { media: 'print' });
        await sleep(800);
        const printed = await evaluate(BOXES);
        (globalThis.seen ??= {})[`${width}${page}${off}`] = { f, wide, printed };
      }
    });
  }
  for (const page of PAGES) {
    const on = globalThis.seen[`${width}${page}false`], off = globalThis.seen[`${width}${page}true`];
    const name = page.replace('/course/ah/papers/', 'AH ');
    t.check(on.f.overlap === 0, `${width}px ${name}: no formula's lines overlap (${on.f.overlap}; ${off.f.overlap} with the fit off)`);
    t.check(on.f.over === 0, `${width}px ${name}: no formula runs past its column (${on.f.over}; ${off.f.over} off)`);
    t.check(on.wide <= off.wide, `${width}px ${name}: nothing wider than the screen that is not so already (${on.wide}; ${off.wide} off)`);
    t.check(on.printed === off.printed, `${width}px ${name}: printed exactly as with the fit off`);
  }
}

t.done('long inline maths fitted to a phone');
