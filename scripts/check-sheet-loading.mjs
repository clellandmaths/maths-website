/**
 * **A shared sheet shows what it already knows while it loads** (the owner, 2026-10-14, card 1 of the loading-states
 * sheet: "Yes"). In Chrome on the built site, a recorded version 4 link of 20 AH generated questions:
 *
 *  - on a throttled phone (CPU 4x, 150 ms, 1.6 Mbit/s): the header, with "20 questions", is on screen before any
 *    question; Print and Full screen are there but cannot be pressed; the "Setting out" panel waits its half second
 *    after the header, then counts ("k of 20"); the sheet arrives whole; then the buttons wake and a screen reader is
 *    told "Worksheet ready";
 *  - nothing moves while it loads (layout shift, measured in a run that does not read the page while it waits: reading
 *    layout to time things forces half-finished frames and reads false shifts, tools/loading/time-waits.mjs);
 *  - unthrottled, on a sheet of paper questions, the panel never shows at all: no flicker on a fast device;
 *  - under "reduce motion", the bar's sweep holds still.
 *
 *   node scripts/check-sheet-loading.mjs              (after npm run build)
 *   SITE=https://clellandmaths.com node scripts/check-sheet-loading.mjs   (live before this change: fails, as it should)
 */
import fs from 'node:fs';
import { withPage, tally } from './browser-drive.mjs';

const t = tally();
const sheets = JSON.parse(fs.readFileSync(new URL('./fixtures/share-links-v4-2026-10-11.json', import.meta.url), 'utf8')).sheets;
const AH20 = sheets[54];   // 20 AH generated questions
const N5P = sheets[0];     // 17 N5 paper questions
if (AH20.refs.length !== 20 || !AH20.refs.every(r => r.startsWith('g:'))) throw new Error('fixture 54 is not 20 generated questions');
const SITE = process.env.SITE;
const url = (port, c, s) => `${SITE ?? `http://127.0.0.1:${port}`}/worksheet?c=${c}&q=${encodeURIComponent(s.q)}`;

const slow = async send => {
  await send('Network.enable');
  await send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 });
};
const phone = send => send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });

// Marks taken every frame from the start: none of them reads layout.
const MARKS = `window.__t = {}; window.__seen = { maxOpacity: 0, disabledWhileLoading: null, count: '' };
  const m = (k, f) => { if (!(k in __t) && f()) __t[k] = Math.round(performance.now()); };
  const tick = () => {
    const panel = document.querySelector('.loading-reveal');
    const qs = document.querySelectorAll('main li.worksheet-question').length;
    m('header', () => !!document.querySelector('main h1'));
    m('sheet', () => qs > 0);
    if (panel) {
      __seen.maxOpacity = Math.max(__seen.maxOpacity, +getComputedStyle(panel).opacity);
      m('panelShown', () => +getComputedStyle(panel).opacity > 0.5);
      const c = (panel.innerText.match(/(\\d+) of (\\d+)/) || [])[0]; if (c) __seen.count = c;
    }
    if (document.querySelector('main h1') && !qs && __seen.disabledWhileLoading === null) {
      const b = [...document.querySelectorAll('main button')];
      const print = b.find(x => x.textContent.trim() === 'Print'), full = b.find(x => x.textContent.trim() === 'Full screen');
      __seen.headerCount = (document.querySelector('main h1')?.parentElement?.innerText.match(/(\\d+) questions?/) || [])[1] ?? null;
      __seen.disabledWhileLoading = !!(print && full && print.disabled && full.disabled);
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);`;

// 1. A throttled phone, 20 AH generated questions.
await withPage({ port: 8228, cdp: 9328, width: 390, height: 844 }, async ({ send, evaluate, sleep }) => {
  await phone(send); await slow(send);
  await send('Page.addScriptToEvaluateOnNewDocument', { source: MARKS });
  await send('Page.navigate', { url: url(8228, 'ah', AH20) });
  for (let i = 0; i < 60 && !(await evaluate(`'sheet' in (window.__t || {})`)); i++) await sleep(1000);
  await sleep(1500);
  const r = JSON.parse(await evaluate(`JSON.stringify({ t: __t, seen: __seen, n: document.querySelectorAll('main li.worksheet-question').length,
    ready: [...document.querySelectorAll('main [role="status"]')].map(e => e.textContent.trim()).filter(Boolean),
    printOn: !![...document.querySelectorAll('main button')].find(x => x.textContent.trim() === 'Print' && !x.disabled) })`));
  t.note(`header ${r.t.header} ms, panel shown ${r.t.panelShown ?? 'never'} ms, sheet ${r.t.sheet} ms`);
  t.check(r.t.header < r.t.sheet - 1000, `the header is up well before the questions (${r.t.header} ms against ${r.t.sheet} ms)`);
  t.check(r.seen.headerCount === '20', `and says how many: "${r.seen.headerCount} questions"`);
  t.check(r.seen.disabledWhileLoading === true, 'Print and Full screen are there but cannot be pressed while it loads');
  t.check(r.t.panelShown - r.t.header >= 400, `the panel waits its half second after the header (${r.t.panelShown - r.t.header} ms)`);
  t.check(r.t.panelShown < r.t.sheet, 'and shows before the sheet on a wait this long');
  t.check(/^\d+ of 20$/.test(r.seen.count), `it counts the questions as they are made ("${r.seen.count}")`);
  t.check(r.n === 20, `the whole sheet arrives (${r.n} of 20)`);
  t.check(r.printOn, 'then Print can be pressed');
  t.check(r.ready.includes('Worksheet ready: 20 questions'), `and a screen reader is told (${JSON.stringify(r.ready)})`);

  // Card 13a (2026-10-14): every card's code asked for at once when the link is read, not as each question's turn
  // came. Counted as waves of script requests after first paint (a gap of 250 ms starts a new wave): live's code
  // before 13a made 8 on this sheet (18 on a 50-question one); with it, 5 for both.
  const waves = await evaluate(`(() => {
    const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? 0;
    const s = performance.getEntriesByType('resource').filter(e => /\\.js(\\?|$)/.test(e.name) && e.startTime > fcp).map(e => e.startTime).sort((a, b) => a - b);
    let n = 0, last = -1e9; for (const x of s) { if (x - last > 250) n++; last = x; } return n; })()`);
  t.check(waves <= 6, `the question code is asked for together, not question by question (${waves} waves of requests)`);
});

// 2. The same, with nothing reading the page while it waits: does anything move?
await withPage({ port: 8230, cdp: 9330, width: 390, height: 844 }, async ({ send, evaluate, sleep }) => {
  await phone(send); await slow(send);
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `window.__cls = 0; new PerformanceObserver(l => { for (const e of l.getEntries()) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });` });
  await send('Page.navigate', { url: url(8230, 'ah', AH20) });
  await sleep(22000);
  const cls = await evaluate('window.__cls');
  const n = await evaluate(`document.querySelectorAll('main li.worksheet-question').length`);
  t.check(n === 20, `(the sheet was in by the time it was read: ${n})`);
  t.check(cls < 0.02, `nothing moves while it loads (layout shift ${cls.toFixed(3)})`);
});

// 3. Unthrottled, 17 paper questions: the panel never shows.
await withPage({ port: 8232, cdp: 9332, width: 390, height: 844 }, async ({ send, evaluate, sleep }) => {
  await phone(send);
  await send('Page.addScriptToEvaluateOnNewDocument', { source: MARKS });
  await send('Page.navigate', { url: url(8232, 'n5', N5P) });
  await sleep(5000);
  const r = JSON.parse(await evaluate('JSON.stringify({ t: __t, seen: __seen })'));
  t.note(`unthrottled: header ${r.t.header} ms, sheet ${r.t.sheet} ms`);
  t.check(r.t.sheet !== undefined && r.seen.maxOpacity < 0.05, `on a fast device the panel never shows (most it reached: ${r.seen.maxOpacity})`);
});

// 4. "Reduce motion": the sweep holds still.
await withPage({ port: 8234, cdp: 9334, width: 390, height: 844 }, async ({ send, evaluate, sleep }) => {
  await phone(send); await slow(send);
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await send('Page.navigate', { url: url(8234, 'ah', AH20) });
  let anim = null;
  for (let i = 0; i < 40 && anim === null; i++) {
    await sleep(250);
    anim = await evaluate(`(() => { const e = document.querySelector('.loading-sweep'); return e ? getComputedStyle(e).animationName : null; })()`);
  }
  t.check(anim === 'none', `under reduce motion the bar does not sweep (animation: ${anim})`);
});

t.done('a shared sheet shows its header at once, counts while it waits, and moves nothing');
