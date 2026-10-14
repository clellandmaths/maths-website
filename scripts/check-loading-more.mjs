/**
 * **The rest of the loading-states sheet** (the owner, 2026-10-14: "Yes" to cards 2, 4, 5, 7, 8, 9 and 10; "Go").
 * In Chrome on the built site, a slowed phone (CPU 4x, 150 ms, 1.6 Mbit/s), a fresh browser for each part:
 *
 *  2  a shared sheet's maths fonts are in by the time its questions are shown (no letters as gaps);
 *  4  the practice paper's buttons are there, waiting, while it builds; nothing moves once the questions start
 *     arriving, nor on "Another practice paper";
 *  5  Start Paper opens its frame on the press, named for the paper; the page is never empty; Cancel leaves it;
 *  7  "Another like this one": at no moment is neither the button nor the new question on screen; a slow press says
 *     "Making a new question…"; on a practice page "Add 10 to a worksheet" spins itself, not its neighbour;
 *  8  a markscheme that is not ready in time says "press again", and the second press prints;
 *  9  Formulae draws its frame on the press, and the frame does not move when the list fills it; "Open as a
 *     worksheet" says "Opening…" at once.
 *
 * Shifts are measured in parts that do not read layout while they wait (reading layout every frame forces
 * half-finished frames: tools/loading/time-waits.mjs).
 *
 *   node scripts/check-loading-more.mjs     (after npm run build)
 *   SITE=https://clellandmaths.com node scripts/check-loading-more.mjs   (live before this change: fails)
 */
import fs from 'node:fs';
import { withPage, tally } from './browser-drive.mjs';

const t = tally();
const SITE = process.env.SITE;
const at = (port, path) => `${SITE ?? `http://127.0.0.1:${port}`}${path}`;
const sheets = JSON.parse(fs.readFileSync(new URL('./fixtures/share-links-v4-2026-10-11.json', import.meta.url), 'utf8')).sheets;
const AH20 = sheets[54];
const PAPER = '/course/n5/papers/2025/paper-1';
const PRACTICE = '/course/n5/generate/paper/2025/paper-1';

const slow = async send => {
  await send('Network.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 });
};
const SHIFTS = `window.__shifts = []; new PerformanceObserver(l => { for (const e of l.getEntries()) __shifts.push([e.startTime, e.value]); }).observe({ type: 'layout-shift', buffered: true });
  window.print = () => { window.__printed = (window.__printed || 0) + 1; };`;
const after = (ms, from) => `__shifts.filter(([s]) => s > ${from}).reduce((a, [, v]) => a + v, 0)`;
const press = text => `(() => { const b = [...document.querySelectorAll('button')].filter(b => b.getBoundingClientRect().width > 0).find(b => b.textContent.trim() === ${JSON.stringify(text)}); if (!b) return false; b.scrollIntoView({ block: 'center' }); b.click(); return true; })()`;
/** The button is there and React has taken it over: a press before that does nothing (the page is drawn ahead of time). */
const live = text => `[...document.querySelectorAll('button')].some(b => b.textContent.trim() === ${JSON.stringify(text)} && Object.keys(b).some(k => k.startsWith('__reactProps')))`;
const waitFor = async (evaluate, sleep, cond, ms = 60000) => { for (let i = 0; i < ms / 100; i++) { if (await evaluate(`(() => { try { return !!(${cond}); } catch { return false; } })()`)) return true; await sleep(100); } return false; };

// 2. The shared sheet: fonts in when the questions show.
await withPage({ port: 8236, cdp: 9336, width: 390, height: 844 }, async ({ send, evaluate, sleep }) => {
  await slow(send);
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `window.__f = null; const tick = () => { if (window.__f === null && document.querySelector('main li.worksheet-question')) window.__f = document.fonts.check('1em KaTeX_Main') && document.fonts.check('italic 1em KaTeX_Math'); requestAnimationFrame(tick); }; requestAnimationFrame(tick);` });
  await send('Page.navigate', { url: at(8236, `/worksheet?c=ah&q=${encodeURIComponent(AH20.q)}`) });
  await waitFor(evaluate, sleep, `window.__f !== null`);
  t.check(await evaluate('window.__f') === true, 'card 2: the maths fonts are in when a shared sheet shows its questions');
});

// 4. The practice paper: buttons waiting, and nothing moves once questions arrive.
await withPage({ port: 8238, cdp: 9338, width: 390, height: 844 }, async ({ send, evaluate, sleep }) => {
  await slow(send);
  await send('Page.addScriptToEvaluateOnNewDocument', { source: SHIFTS + `window.__first = null; window.__waiting = null; const tick = () => {
      const card = document.querySelector('.worksheet-container article .question-content');
      if (window.__first === null && card && card.innerText.trim()) window.__first = performance.now();
      if (window.__waiting === null && /Drawing question/.test(document.body.innerText)) {
        const b = [...document.querySelectorAll('button')].find(x => /Print \\/ Save PDF/.test(x.textContent));
        window.__waiting = !!b && b.disabled; }
      requestAnimationFrame(tick); }; requestAnimationFrame(tick);` });
  await send('Page.navigate', { url: at(8238, PRACTICE) });
  await waitFor(evaluate, sleep, `!/Drawing question/.test(document.body.innerText) && window.__first !== null`, 90000);
  await sleep(1500);
  t.check(await evaluate('window.__waiting') === true, 'card 4: the practice paper\'s buttons are there, waiting, while it builds');
  const from = await evaluate('window.__first');
  const moved = await evaluate(after(0, from - 50));
  t.check(moved < 0.02, `card 4: nothing moves once its questions start arriving (shift ${moved.toFixed(3)})`);
  const before = await evaluate('performance.now()');
  await evaluate(press('Another practice paper'));
  await sleep(1000);
  await waitFor(evaluate, sleep, `!/Drawing question/.test(document.body.innerText)`, 90000);
  await sleep(1500);
  const again = await evaluate(after(0, before));
  t.check(again < 0.02, `card 4: "Another practice paper" keeps the page still while it redraws (shift ${again.toFixed(3)})`);
});

// 5. Start Paper: the frame at once, never an empty page, and Cancel.
await withPage({ port: 8240, cdp: 9340, width: 390, height: 844 }, async ({ send, evaluate, sleep }) => {
  await slow(send);
  await send('Page.addScriptToEvaluateOnNewDocument', { source: SHIFTS });
  await send('Page.navigate', { url: at(8240, '/course/n5/papers') });
  await waitFor(evaluate, sleep, `[...document.querySelectorAll('button')].some(b => b.textContent.trim() === 'Start Paper')`);
  await sleep(1500);
  const r = JSON.parse(await evaluate(`(async () => {
    const b = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Start Paper');
    const t0 = performance.now(); b.click();
    let frameAt = null, emptyFrames = 0, presenterAt = null;
    await new Promise(res => { const tick = () => {
      const fixed = [...document.querySelectorAll('.fixed.inset-0')].filter(e => e.getBoundingClientRect().width > 0);
      if (frameAt === null && fixed.some(e => /Cancel/.test(e.innerText) && /2026|2025|Paper/.test(e.innerText))) frameAt = performance.now() - t0;
      if (!fixed.length && !document.querySelector('main')?.innerText.trim()) emptyFrames++;
      if (fixed.some(e => e.querySelector('.question-content')?.innerText.trim())) { presenterAt = performance.now() - t0; return res(); }
      if (performance.now() - t0 > 20000) return res();
      requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
    return JSON.stringify({ frameAt: frameAt && Math.round(frameAt), emptyFrames, presenterAt: presenterAt && Math.round(presenterAt) });
  })()`));
  t.note(`Start Paper: frame at ${r.frameAt} ms, full screen at ${r.presenterAt} ms`);
  t.check(r.frameAt !== null && r.frameAt < 300, `card 5: Start Paper opens its frame, named for the paper, on the press (${r.frameAt} ms)`);
  t.check(r.emptyFrames === 0, `card 5: the page is never empty on the way (${r.emptyFrames} empty frames)`);
  t.check(r.presenterAt !== null, 'card 5: then full screen arrives');
});
await withPage({ port: 8242, cdp: 9342, width: 390, height: 844 }, async ({ send, evaluate, sleep }) => {
  await slow(send);
  await send('Page.navigate', { url: at(8242, '/course/n5/papers') });
  await waitFor(evaluate, sleep, `[...document.querySelectorAll('button')].some(b => b.textContent.trim() === 'Focus Mode')`);
  await sleep(1500);
  await evaluate(press('Focus Mode'));
  await sleep(150);
  const cancelled = await evaluate(press('Cancel'));
  await sleep(6000);
  const left = await evaluate(`!document.querySelector('.fixed.inset-0') && /Past Papers/.test(document.querySelector('main')?.innerText || '')`);
  t.check(cancelled && left, 'card 5: Cancel leaves the list as it was, and the press does not open later');
});

// 7. "Another like this one": never a gap; a slow press says so.
await withPage({ port: 8244, cdp: 9344, width: 390, height: 844 }, async ({ send, evaluate, sleep }) => {
  await slow(send);
  await send('Page.navigate', { url: at(8244, PAPER) });
  await waitFor(evaluate, sleep, `[...document.querySelectorAll('button')].some(b => b.textContent.trim() === 'Another like this one')`);
  const r = JSON.parse(await evaluate(`(async () => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const b = [...document.querySelectorAll('button')].filter(vis).find(b => b.textContent.trim() === 'Another like this one');
    b.scrollIntoView({ block: 'center' });
    // This question's own control: the box MoreLikeThis draws into. Other questions' buttons do not count.
    const own = b.parentElement;
    const before = new Set([...document.querySelectorAll('main .question-content')].map(q => q.innerText));
    const t0 = performance.now(); b.click();
    let gaps = 0, said = false, doneAt = null;
    await new Promise(res => { const tick = () => {
      const buttons = [...own.querySelectorAll('button')].filter(vis).map(x => x.textContent.trim());
      const busy = buttons.some(x => /^(Another like this one|Another one|Making a new question…)$/.test(x));
      const fresh = [...own.querySelectorAll('.question-content')].some(q => vis(q) && q.innerText.trim() && !before.has(q.innerText));
      if (buttons.includes('Making a new question…')) said = true;
      if (fresh) { doneAt = performance.now() - t0; return res(); }
      if (!busy) gaps++;
      if (performance.now() - t0 > 20000) return res();
      requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
    return JSON.stringify({ gaps, said, doneAt: doneAt && Math.round(doneAt) });
  })()`));
  t.note(`Another like this one, pressed at once: the question at ${r.doneAt} ms`);
  t.check(r.doneAt !== null && r.gaps === 0, `card 7: never neither the button nor the question (${r.gaps} frames with neither)`);
  t.check(r.doneAt < 1000 || r.said, `card 7: a press over a second says "Making a new question…" (${r.doneAt} ms)`);
});
await withPage({ port: 8246, cdp: 9346, width: 390, height: 844 }, async ({ send, evaluate, sleep }) => {
  await slow(send);
  await send('Page.navigate', { url: at(8246, '/course/n5/practice/surds') });
  await waitFor(evaluate, sleep, live('Add 10 to a worksheet'));
  const r = JSON.parse(await evaluate(`(async () => {
    const find = re => [...document.querySelectorAll('button')].find(b => re.test(b.textContent.trim()));
    const ten = find(/^Add 10 to a worksheet$/), one = find(/^(Give me a question|Another question)$/);
    const t0 = performance.now(); ten.click();
    let tenSpins = false, oneSpins = false;
    await new Promise(res => { const tick = () => {
      if (ten.querySelector('.animate-spin')) tenSpins = true;
      if (one.querySelector('.animate-spin')) oneSpins = true;
      if (/on your worksheet/.test(document.body.innerText) || performance.now() - t0 > 15000) return res();
      requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
    return JSON.stringify({ tenSpins, oneSpins });
  })()`));
  t.check(r.tenSpins && !r.oneSpins, `card 7: "Add 10 to a worksheet" spins itself, not its neighbour (${JSON.stringify(r)})`);
});

// 8. The markscheme, held back past its 1.5 s: it says so, and the second press prints.
await withPage({ port: 8248, cdp: 9348, width: 390, height: 844 }, async ({ send, evaluate, sleep }) => {
  await slow(send);
  await send('Page.addScriptToEvaluateOnNewDocument', { source: SHIFTS });
  await send('Page.navigate', { url: at(8248, PRACTICE) });
  await waitFor(evaluate, sleep, `!/Drawing question/.test(document.body.innerText) && [...document.querySelectorAll('button')].some(b => b.textContent.trim() === 'Markscheme' && !b.disabled)`, 90000);
  // Hold the sheet's questions off the page for the first press only.
  await evaluate(`window.__hold = new MutationObserver(() => document.querySelectorAll('.markscheme-doc .markscheme-question').forEach(e => e.classList.replace('markscheme-question', 'held-question')));
    window.__hold.observe(document.body, { childList: true, subtree: true });`);
  await evaluate(press('Markscheme'));
  const said = await waitFor(evaluate, sleep, `[...document.querySelectorAll('button')].some(b => b.textContent.trim() === 'Ready: press again to print')`, 20000);
  t.check(said && !(await evaluate('window.__printed')), 'card 8: a markscheme not ready in time says "Ready: press again to print", and nothing printed');
  await evaluate(`window.__hold.disconnect(); document.querySelectorAll('.held-question').forEach(e => e.classList.replace('held-question', 'markscheme-question'));`);
  await evaluate(press('Ready: press again to print'));
  const printed = await waitFor(evaluate, sleep, `window.__printed > 0`, 10000);
  t.check(printed, 'card 8: and the second press prints');
});

// 9. Formulae: the frame on the press, and it does not move; Open as a worksheet says so.
await withPage({ port: 8250, cdp: 9350, width: 390, height: 844 }, async ({ send, evaluate, sleep }) => {
  await slow(send);
  await send('Page.navigate', { url: at(8250, PAPER) });
  await waitFor(evaluate, sleep, live('Formulae'));
  const r = JSON.parse(await evaluate(`(async () => {
    const b = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Formulae');
    const t0 = performance.now(); b.click();
    let frameAt = null, top0 = null, moved = 0, listAt = null;
    await new Promise(res => { const tick = () => {
      const close = document.querySelector('[aria-label="Close formulae list"]');
      const box = close?.closest('.relative');
      if (box) { const top = Math.round(box.getBoundingClientRect().top);
        if (frameAt === null) { frameAt = performance.now() - t0; top0 = top; } else if (top !== top0) moved = Math.max(moved, Math.abs(top - top0)); }
      if (box && box.querySelector('section')) { listAt = performance.now() - t0; return res(); }
      if (performance.now() - t0 > 15000) return res();
      requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
    return JSON.stringify({ frameAt: frameAt && Math.round(frameAt), moved, listAt: listAt && Math.round(listAt) });
  })()`));
  t.note(`Formulae: frame at ${r.frameAt} ms, list at ${r.listAt} ms`);
  t.check(r.frameAt !== null && r.frameAt < 200, `card 9: Formulae draws its frame on the press (${r.frameAt} ms)`);
  t.check(r.listAt !== null && r.moved === 0, `card 9: and the frame does not move when the list fills it (moved ${r.moved} px)`);
});
await withPage({ port: 8252, cdp: 9352, width: 390, height: 844 }, async ({ send, evaluate, sleep }) => {
  await slow(send);
  await send('Page.navigate', { url: at(8252, PRACTICE) });
  await waitFor(evaluate, sleep, `[...document.querySelectorAll('button')].some(b => b.textContent.trim() === 'Open as a worksheet' && !b.disabled)`, 90000);
  const said = await evaluate(`(async () => { const b = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Open as a worksheet'); b.click();
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); return b.textContent.trim(); })()`);
  t.check(said === 'Opening…', `card 9: "Open as a worksheet" says "Opening…" at once ("${said}")`);
});

t.done('the rest of the loading-states sheet: nothing blank, nothing silent, nothing moving');
