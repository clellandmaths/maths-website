/**
 * The question card's two faces, driven in a real browser.
 *
 *   npm run build && node scripts/check-card-variation.mjs
 *
 * **Not in `build`.** It needs headless Chrome and the Cloudflare image has
 * none — the same reason `check-responsive.mjs` sits outside the build.
 *
 * A card in the Explorer shows a past paper question and can swap to a freshly
 * generated one modelled on it. The thing worth proving is what the swap
 * changed: the old button drew a question and put it straight in the basket, so
 * a teacher found out what they had added on a different tab. Now it is shown
 * first, and **looking must not add**.
 *
 * What this drives, in one pass on one card:
 *
 *   1. the filter, because the grid renders nothing until one is set
 *   2. Variation  — the face swaps, names the paper it is based on, and offers
 *                   Another / Add 5 like it / Exam question
 *   3. Another    — a genuinely different question, not the same one again
 *   4. Exam question — back to where it started
 *   5. the basket is still empty, which is the whole point
 *   6. Add 5 like it — five on the sheet, five distinct uids, and five
 *      distinct question bodies. Uids alone would pass on five copies of one
 *      question with different seeds, which is the bug the exclude set exists
 *      to prevent, so the bodies are compared too.
 *
 * **Clicks go through CDP Input.dispatchMouseEvent**, not element.click(),
 * which does not register on these React controls.
 *
 * Topics in the sidebar are <label>s. The first version of this looked for a
 * button, found nothing, and then reported nine failures against an unfiltered
 * empty page — so the filter step is asserted before anything else is read.
 */
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const OUT = join(ROOT, 'out');
const PORT = 8123, CDP = 9223;

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };

const server = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  let file = join(OUT, p);
  if (!extname(file)) {
    if (existsSync(file + '.html')) file += '.html';
    else file = join(file, 'index.html');
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404); res.end('nope'); }
});
await new Promise(r => server.listen(PORT, r));

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
if (!existsSync(CHROME)) { console.error('no Chrome at ' + CHROME); server.close(); process.exit(1); }
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
  `--remote-debugging-port=${CDP}`, 'about:blank'], { stdio: 'ignore' });

const sleep = ms => new Promise(r => setTimeout(r, ms));

let target = null;
for (let i = 0; i < 60 && !target; i++) {
  await sleep(250);
  try { target = (await (await fetch(`http://127.0.0.1:${CDP}/json`)).json()).find(x => x.type === 'page'); } catch {}
}
if (!target) { console.error('no CDP target'); chrome.kill(); server.close(); process.exit(1); }

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r, { once: true }));
let id = 0;
const pending = new Map();
ws.addEventListener('message', e => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
});
const send = (method, params = {}) => new Promise(res => {
  const n = ++id; pending.set(n, res); ws.send(JSON.stringify({ id: n, method, params }));
});
const evaluate = async expr => {
  const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
  return r.result?.result?.value;
};

/** Click the centre of the first element matching a predicate, via real mouse events. */
const clickBy = async (js) => {
  const box = await evaluate(`(() => {
    const el = ${js};
    if (!el) return null;
    el.scrollIntoView({ block: 'center' });
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  })()`);
  if (!box) return false;
  for (const type of ['mousePressed', 'mouseReleased']) {
    await send('Input.dispatchMouseEvent', { type, x: box.x, y: box.y, button: 'left', clickCount: 1 });
  }
  return true;
};

const fail = [];
const check = (ok, msg) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${msg}`); if (!ok) fail.push(msg); };

await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride',
  { width: 1600, height: 1000, deviceScaleFactor: 1, mobile: false });

await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/explorer?c=n5` });
await sleep(4000);

/* Filter to a topic so the grid renders. Topics are <label>s, not buttons —
   the first attempt looked for a button and found nothing, so every later
   check failed on an empty page rather than on anything real.

   "Fractions" has exactly one subtopic, and FilterSidebar collapses a
   one-subtopic topic to a flat checkbox, so this label IS the subtopic. */
const ticked = await clickBy(
  `[...document.querySelectorAll('label')].find(e => e.textContent.trim() === 'Fractions')`);
check(ticked, 'clicked the Fractions filter');
await sleep(2500);
const showing = await evaluate(
  `(document.body.innerText.split('Showing ')[1] || '').split(' questions')[0]`);
check(Number(showing) > 0, `sidebar reports "Showing ${showing} questions"`);

const cards = await evaluate(`document.querySelectorAll('.question-card').length`);
check(cards > 0, `${cards} cards rendered`);

// ── the exam face ─────────────────────────────────────────────────────────
const before = await evaluate(`(() => {
  const c = document.querySelector('.question-card')?.closest('div.bg-slate-900');
  return { text: c?.innerText.slice(0, 120), h: Math.round(c?.getBoundingClientRect().height) };
})()`);
check(/\d{4} Paper \d Q\d/.test(before?.text ?? ''), `exam face shows a paper label: ${JSON.stringify(before?.text?.split('\n')[0])}`);

// ── press Variation ───────────────────────────────────────────────────────
const pressed = await clickBy(`[...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Variation')`);
check(pressed, 'pressed Variation');
await sleep(3500);

const after = await evaluate(`(() => {
  const c = document.querySelector('.question-card')?.closest('div.bg-slate-900');
  const t = c?.innerText ?? '';
  return {
    first: t.split('\\n')[0],
    hasNew: t.includes('New question'),
    hasBasedOn: /based on \\d{4} P\\d Q\\d/.test(t),
    hasAnother: t.includes('Another'),
    hasAdd5: t.includes('Add 5 like it'),
    hasBack: t.includes('Exam question'),
    body: (c?.querySelector('.question-card')?.innerText ?? '').slice(0, 90),
    h: Math.round(c?.getBoundingClientRect().height),
  };
})()`);
check(after?.hasNew, 'variation face shows the "New question" badge');
check(after?.hasBasedOn, 'variation face names the paper it is based on');
check(after?.hasAnother && after?.hasAdd5 && after?.hasBack, 'Another / Add 5 like it / Exam question all present');
console.log(`        body now: ${JSON.stringify(after?.body)}`);
console.log(`        card height ${before?.h}px -> ${after?.h}px`);

// ── Another gives a different question ────────────────────────────────────
await clickBy(`[...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Another')`);
await sleep(3000);
const second = await evaluate(`(document.querySelector('.question-card')?.innerText ?? '').slice(0, 90)`);
check(second !== after?.body, 'Another drew a different question');
console.log(`        then:     ${JSON.stringify(second)}`);

// ── and back ──────────────────────────────────────────────────────────────
await clickBy(`[...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Exam question')`);
await sleep(1200);
const back = await evaluate(`(() => {
  const c = document.querySelector('.question-card')?.closest('div.bg-slate-900');
  const t = c?.innerText ?? '';
  return { first: t.split('\\n')[0], hasNew: t.includes('New question') };
})()`);
check(!back?.hasNew && back?.first === before?.text?.split('\n')[0],
  `back to the exam question: ${JSON.stringify(back?.first)}`);

// ── nothing was added to the sheet by looking ─────────────────────────────
const basket = await evaluate(`(() => {
  try { return JSON.parse(sessionStorage.getItem('worksheet_n5') || '[]').length; } catch { return -1; }
})()`);
check(basket === 0, `sheet still empty after looking at two variations (${basket})`);

// ── Add 5 like it ─────────────────────────────────────────────────────────
await clickBy(`[...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Variation')`);
await sleep(3000);
await clickBy(`[...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Add 5 like it')`);
await sleep(6000);

const sheet = await evaluate(`(() => {
  let items = [];
  try { items = JSON.parse(sessionStorage.getItem('worksheet_n5') || '[]'); } catch {}
  const uids = items.map(q => q.uid).filter(Boolean);
  const bodies = items.map(q => (q.question || '').replace(/<[^>]+>/g, ' ').replace(/\\s+/g, ' ').trim().slice(0, 40));
  return {
    n: items.length,
    generated: uids.length,
    distinctUids: new Set(uids).size,
    distinctBodies: new Set(bodies).size,
    face: (document.querySelector('.question-card')?.closest('div.bg-slate-900')?.innerText ?? '').split('\\n')[0],
  };
})()`);
check(sheet?.n === 5, `Add 5 put 5 questions on the sheet (${sheet?.n})`);
check(sheet?.generated === 5, `all 5 are generated, carrying a uid (${sheet?.generated})`);
check(sheet?.distinctUids === 5, `5 distinct uids — no repeats (${sheet?.distinctUids})`);
check(sheet?.distinctBodies === 5, `5 genuinely different questions (${sheet?.distinctBodies})`);
check(!/New question/.test(sheet?.face ?? 'New question'),
  `card returned to the exam question after adding: ${JSON.stringify(sheet?.face)}`);

console.log(fail.length ? `\n  ${fail.length} FAILED\n` : '\n  all good\n');
ws.close(); chrome.kill(); server.close();
process.exit(fail.length ? 1 : 0);
