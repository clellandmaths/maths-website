/**
 * Full stops sit inside the maths in hints and markschemes as well as questions (the independent audit's card 10; the
 * owner, 2026-10-13: "Yes to both"). Counted on the page, in Chrome on the built site: every rendered formula whose
 * next text starts with a lone "." (an ellipsis is not one). Open a hint ladder on Higher and on Advanced Higher
 * questions, and read an AH paper page's on-screen marking instructions.
 *
 *   node scripts/check-stops-shown.mjs   (after npm run build)
 */
import { withPage, tally } from './browser-drive.mjs';

const t = tally();
/** Formulas in `scope` followed straight away by a stop: the next text, skipping KaTeX's own pieces. */
const outside = scope => `(() => {
  const root = ${scope}; if (!root) return -1;
  let n = 0;
  for (const k of root.querySelectorAll('.katex')) {
    if (k.parentElement?.closest('.katex')) continue;
    let next = k.nextSibling;
    while (next && next.nodeType === 1 && !next.textContent) next = next.nextSibling;
    const s = next?.textContent ?? '';
    if (/^\\.(?!\\.)/.test(s)) n++;
  }
  return n;
})()`;
const PANEL = `document.querySelector('[role="dialog"][aria-label="Hint"]')`;

await withPage({ port: 8198, cdp: 9298 }, async ({ evaluate, click, go, sleep }) => {
  // Hint ladders: press "Another hint" to the end, so every rung is on screen.
  const ladder = async (path, name) => {
    await go(path, 6000);
    let opened = false;
    for (let i = 0; i < 8 && !opened; i++) {
      const pressed = await click(`[...document.querySelectorAll('main button')].filter(b => /^hint$/i.test(b.textContent.trim()))[${i}]`);
      if (!pressed) break;
      await sleep(2000);
      opened = await evaluate(`!!${PANEL}`);
    }
    if (!opened) { t.check(false, `${name}: a hint opened`); return; }
    for (let i = 0; i < 12; i++) {
      if (!(await click(`[...(${PANEL}?.querySelectorAll('button') ?? [])].find(b => /another hint|more help/i.test(b.textContent))`))) break;
      await sleep(700);
    }
    const n = await evaluate(outside(PANEL));
    const shown = await evaluate(`${PANEL}?.querySelectorAll('.katex').length ?? 0`);
    t.check(n === 0 && shown > 0, `${name}: the whole ladder open, ${shown} formulas, ${n} with a stop outside`);
    await click(`[...(${PANEL}?.querySelectorAll('button') ?? [])].find(b => b.getAttribute('aria-label') === 'Close the hint')`);
    await sleep(500);
  };
  await ladder('/course/higher/papers/2015/paper-1', 'Higher 2015 Paper 1, a hint ladder');
  await ladder('/course/ah/papers/2024/paper-1', 'AH 2024 Paper 1, a hint ladder');
  await ladder('/course/n5/papers/2014/paper-1', 'N5 2014 Paper 1, a hint ladder');

  // AH's on-screen marking instructions, on a paper with no videos.
  await go('/course/ah/papers/2016/paper-1', 7000);
  const scheme = `document.querySelector('main')`;
  const n = await evaluate(outside(scheme));
  t.check(n === 0, `AH 2016 paper page, its marking instructions and questions: ${n} formulas with a stop outside`);
});

t.done('full stops inside the maths in hints and markschemes');
