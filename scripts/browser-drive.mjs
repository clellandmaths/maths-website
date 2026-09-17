/**
 * Serve `out/` and drive it in headless Chrome.
 *
 * Shared by the checks that have to press a button and see what happens, rather
 * than read the source and hope. Nothing here is a check itself.
 *
 * **Clicks go through CDP `Input.dispatchMouseEvent`.** `element.click()` does
 * not register on the React controls on this site, which cost an afternoon to
 * work out the first time.
 *
 * `check-responsive.mjs` does not use `withPage` — it had its own copy first
 * and measures 518 pages at four viewports, so it has different needs and
 * moving it is a bigger change than it is worth. It does import `ownProfile`
 * and `sweepStaleProfiles` from here, because a profile leak fixed in one
 * driver and not the other is not fixed.
 */
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, mkdtempSync, rmSync, readdirSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'out');

/**
 * **Every run gets its own profile directory, and takes it away again.**
 *
 * Chrome launched without `--user-data-dir` makes a temp profile of its own and
 * removes it when it exits cleanly. This driver does not let it exit cleanly —
 * it calls `kill()` — so every launch abandoned about 29MB under the system
 * temp directory, named `HeadlessChrome<pid><nonce>`.
 *
 * Nobody noticed because one is nothing. But an 18-check suite is 18 of them,
 * `check:contrast --all` is more, and they never expire: on 2026-09-17 there
 * were **1,296 of them holding 36.4GB**, which filled the disk and stopped all
 * work — including, for a while, every shell command, since each one writes its
 * output to a file before it can be read.
 *
 * So the directory is ours: made here, passed to Chrome, and removed in the
 * `finally` alongside the socket and the server. `rmSync` with `force` because
 * tidying up must never be the thing that fails a check.
 */
export function ownProfile() {
  return mkdtempSync(join(tmpdir(), 'cm-check-'));
}

/**
 * Sweep profiles a killed run left behind, ours and Chrome's own.
 *
 * A check that crashes hard skips its `finally`, so self-healing matters more
 * than tidiness here: without it the leak returns the first time something
 * throws. Only touches directories this project or headless Chrome created, and
 * only those over an hour old, so a concurrent run is never disturbed.
 */
export function sweepStaleProfiles() {
  const dir = tmpdir();
  const hourAgo = Date.now() - 60 * 60 * 1000;
  let freed = 0;
  try {
    for (const name of readdirSync(dir)) {
      if (!/^(cm-check-|HeadlessChrome|scoped_dir)/.test(name)) continue;
      const path = join(dir, name);
      try {
        if (statSync(path).mtimeMs > hourAgo) continue;
        rmSync(path, { recursive: true, force: true });
        freed++;
      } catch { /* in use, or gone already */ }
    }
  } catch { /* no temp dir listing — nothing to sweep */ }
  return freed;
}

const TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ico': 'image/x-icon',
  '.txt': 'text/plain', '.xml': 'application/xml',
};

export const sleep = ms => new Promise(r => setTimeout(r, ms));

/**
 * Give `fn` a driven page, then tidy up whatever happens.
 *
 * @param {object} opts  port, cdp, width, height
 * @param {(page: object) => Promise<void>} fn
 */
export async function withPage(opts, fn) {
  const { port = 8130, cdp = 9230, width = 1600, height = 1000 } = opts ?? {};

  if (!existsSync(OUT)) {
    console.error('\n  no out/ — run `npm run build` first. Nothing was checked.\n');
    process.exit(1);
  }

  const server = createServer(async (req, res) => {
    const p = decodeURIComponent(req.url.split('?')[0]);
    let file = join(OUT, p);
    if (!extname(file)) {
      if (existsSync(file + '.html')) file += '.html';
      else file = join(file, 'index.html');
    }
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404);
      res.end('not found');
    }
  });
  await new Promise(r => server.listen(port, r));

  const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  if (!existsSync(CHROME)) {
    console.error(`\n  no Chrome at ${CHROME}. Set CHROME_PATH. Nothing was checked.\n`);
    server.close();
    process.exit(1);
  }
  // Ours, so it can be taken away again — see `ownProfile`. The sweep runs
  // first so a previously killed run does not leave its profile for ever.
  sweepStaleProfiles();
  const profile = ownProfile();

  const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-sandbox',
    '--hide-scrollbars', `--user-data-dir=${profile}`,
    // The disk cache is the bulk of an abandoned profile, and a check has no
    // use for one: every run starts cold against a freshly built `out/`.
    '--disk-cache-size=1', '--media-cache-size=1',
    `--remote-debugging-port=${cdp}`, 'about:blank'], { stdio: 'ignore' });

  let target = null;
  for (let i = 0; i < 60 && !target; i++) {
    await sleep(250);
    try {
      target = (await (await fetch(`http://127.0.0.1:${cdp}/json`)).json())
        .find(x => x.type === 'page');
    } catch { /* still starting */ }
  }
  if (!target) {
    console.error('\n  Chrome never offered a page to drive. Nothing was checked.\n');
    chrome.kill(); server.close();
    rmSync(profile, { recursive: true, force: true });
    process.exit(1);
  }

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r, { once: true }));
  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', e => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  });

  const send = (method, params = {}) => new Promise(res => {
    const n = ++id;
    pending.set(n, res);
    ws.send(JSON.stringify({ id: n, method, params }));
  });

  const evaluate = async expression => {
    const r = await send('Runtime.evaluate',
      { expression, returnByValue: true, awaitPromise: true });
    return r.result?.result?.value;
  };

  /** Click the centre of whatever `js` evaluates to. False if it is not there. */
  const click = async js => {
    const box = await evaluate(`(() => {
      const el = ${js};
      if (!el) return null;
      el.scrollIntoView({ block: 'center' });
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return null;
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    })()`);
    if (!box) return false;
    for (const type of ['mousePressed', 'mouseReleased']) {
      await send('Input.dispatchMouseEvent',
        { type, x: box.x, y: box.y, button: 'left', clickCount: 1 });
    }
    return true;
  };

  /**
   * **Laid out, not merely present.**
   *
   * This site renders some controls twice — the Explorer has a desktop
   * `FilterSidebar` and a mobile one, and the hidden copy comes first in the
   * DOM. A plain `querySelectorAll(...).find(...)` therefore returns the
   * zero-sized one at a phone width, the click silently does nothing, and every
   * assertion after it fails against a page that never changed. Picking the
   * laid-out one is the difference between a check that works at two widths and
   * one that only works at the width it was written at.
   */
  const VISIBLE = `(el => { const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'; })`;

  /**
   * The first **visible** button whose trimmed text is exactly `text`.
   *
   * Exact on purpose — "Add" must not match "Add 5 like it". But a button that
   * carries a count alongside its label will not match, and that has cost time
   * here: the Explorer's tab reads `My Worksheet` until something is on the
   * sheet and `My Worksheet 1` afterwards, so an exact match stopped working at
   * the point the test became worth running. Use `buttonMatching` when a label
   * can grow.
   */
  const buttonNamed = text =>
    `[...document.querySelectorAll('button')]
       .filter(${VISIBLE}).find(b => b.textContent.trim() === ${JSON.stringify(text)})`;

  /** The first visible button whose text matches `re` — for labels that grow. */
  const buttonMatching = re =>
    `[...document.querySelectorAll('button')]
       .filter(${VISIBLE}).find(b => ${re}.test(b.textContent || ''))`;

  /** The first visible `<label>` whose trimmed text is exactly `text`. */
  const labelNamed = text =>
    `[...document.querySelectorAll('label')]
       .filter(${VISIBLE}).find(l => l.textContent.trim() === ${JSON.stringify(text)})`;

  const go = async (path, settle = 3500) => {
    await send('Page.navigate', { url: `http://127.0.0.1:${port}${path}` });
    await sleep(settle);
  };

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride',
    { width, height, deviceScaleFactor: 1, mobile: false });

  try {
    await fn({ send, evaluate, click, buttonNamed, buttonMatching, labelNamed, go, sleep, port });
  } finally {
    ws.close();
    chrome.kill();
    server.close();
    // Chrome is killed rather than asked to leave, so it never tidies its own
    // profile. Give it a moment to release its file handles, then remove it —
    // `force` so a locked file can never turn a passing check into a failure.
    await sleep(250);
    rmSync(profile, { recursive: true, force: true });
  }
}

/** A tally that prints as it goes, so a failing run says where it got to. */
export function tally() {
  const failed = [];
  return {
    check(ok, msg) {
      console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${msg}`);
      if (!ok) failed.push(msg);
    },
    note(msg) { console.log(`        ${msg}`); },
    done(what) {
      if (failed.length) {
        console.log(`\n  ${failed.length} of ${what} FAILED\n`);
        process.exit(1);
      }
      console.log(`\n  ${what}\n`);
      process.exit(0);
    },
  };
}
