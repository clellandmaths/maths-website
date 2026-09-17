/**
 * Does the site meet its own sizing rules, on every kind of device?
 *
 *   node scripts/check-responsive.mjs              fast: a sample per template
 *   node scripts/check-responsive.mjs --all        every page (slow, ~90 min)
 *   node scripts/check-responsive.mjs --baseline   record what is wrong today
 *
 * **Why this exists.** The site is 518 pages and five courses. Nobody can look
 * at that on four devices, and the faults it catches are the ones that do not
 * announce themselves: a button that is 36px instead of 44px looks fine until
 * a finger misses it, and an expression too wide for its card is CLIPPED — the
 * card is an <article> with overflow-x:hidden, so there is no scrollbar and no
 * sideways page scroll to give it away. It just loses its right-hand end.
 *
 * **It runs against the built site**, not the source, because every one of
 * these is a property of the rendered page. Run `npm run build` first.
 *
 * **The baseline is the point.** A site this size has existing violations, and
 * a check that is red on day one gets ignored within a week. So today's
 * violations are recorded in `responsive-baseline.json` and this fails only on
 * NEW ones. The recorded list is the burn-down, and it can only get shorter:
 * `--baseline` refuses to write a baseline that is worse than the one on disk.
 *
 * **Sampling, and its limit.** The default run takes a few pages per template,
 * because 518 pages x 4 viewports is 90 minutes and a build gate has to be
 * quick. That catches anything wrong with a TEMPLATE, which is most of it. It
 * does NOT catch a single hand-authored page with a fixed pixel width in it —
 * that is what `--all` is for, and it should be run before any release and
 * after any change to shared CSS.
 */
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile, writeFile, stat, readdir } from 'node:fs/promises';
import { existsSync, readdirSync, statSync, rmSync } from 'node:fs';
import { ownProfile, sweepStaleProfiles } from './browser-drive.mjs';
import { join, extname, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'out');
const BASELINE = join(ROOT, 'scripts', 'responsive-baseline.json');
const PORT = 8079;
const CDP = 9360;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const ALL = process.argv.includes('--all');
const WRITE_BASELINE = process.argv.includes('--baseline');

// ── the rules ──────────────────────────────────────────────────────────────
//
// Each one is a published standard, not a preference, and each names the
// source so a future reader can argue with the standard rather than with us.
const RULES = {
  'tap-target':   'interactive element under 44x44 (Apple HIG; Material asks 48)',
  'text-floor':   'visible text under 12px',
  'input-zoom':   'form control under 16px — iOS Safari zooms the page on focus',
  'measure':      'a line of text longer than 75 characters (45-75 is readable)',
  'page-overflow':'the page itself scrolls sideways (WCAG 1.4.10 Reflow)',
  'clipped':      'content wider than its container, with nothing to scroll it',
  'scroll-defeated': 'an overflow-x:auto box is wider than the space it was given, so it never scrolls',
};

/**
 * Deliberate exceptions, each with the reason it is one.
 *
 * Kept as a visible list rather than silently skipped, so the decision stays
 * in front of whoever reads this next — the same pattern `pool.ts` uses in the
 * generator for its thin topics. An exception needs a reason, not just a path.
 */
const EXCEPTIONS = [
  {
    page: '/course/higher-apps/rstudio/index.html',
    rules: ['page-overflow', 'clipped'],
    why: 'an embedded code editor with wide data tables. Horizontal scrolling '
       + 'was accepted here deliberately: shrinking a dataset to fit a phone '
       + 'makes it unreadable, and the editor brings its own scrolling.',
  },
];
const excused = (page, rule) =>
  EXCEPTIONS.some((e) => e.page === page && e.rules.includes(rule));

const ALL_VIEWPORTS = [
  ['phone-sm', 320, 640, true],
  ['phone', 390, 844, true],
  ['tablet', 768, 1024, true],
  ['desktop', 1440, 900, false],
];

// --viewport <name> runs one width. A layout fault shows at the narrowest
// width and nowhere else adds information, so sweeping every page at 320px
// costs a quarter of what the full matrix does.
const vpAt = process.argv.indexOf('--viewport');
const VIEWPORTS = vpAt !== -1
  ? ALL_VIEWPORTS.filter((v) => v[0] === process.argv[vpAt + 1])
  : ALL_VIEWPORTS;

if (!VIEWPORTS.length) {
  console.error(`\n  unknown viewport. One of: ${ALL_VIEWPORTS.map((v) => v[0]).join(', ')}\n`);
  process.exit(1);
}

const RELOAD_EACH = process.argv.includes('--reload-each');

if (!existsSync(OUT)) {
  console.error('\n  no out/ — run `npm run build` first. Nothing was checked.\n');
  process.exit(1);
}

/**
 * What the built site looked like when we started reading it.
 *
 * This check reads `out/`, and a full run takes minutes. A rebuild part-way
 * through means the first half measured one version of the site and the second
 * half another — and the result looks perfectly normal. That happened three
 * times while recording the first baseline, and each time the only clue was
 * remembering having run `npm run build`.
 *
 * So: fingerprint before and after. If the build moved, refuse to write a
 * baseline and say so. A wrong baseline is worse than no baseline, because
 * every later run is measured against it.
 *
 * Stat only — no file contents — so it costs well under a second on 6,700
 * files.
 */
function fingerprint(dir) {
  let files = 0;
  let newest = 0;
  let bytes = 0;
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) { walk(p); continue; }
      const s = statSync(p);
      files++;
      bytes += s.size;
      if (s.mtimeMs > newest) newest = s.mtimeMs;
    }
  };
  walk(dir);
  return { files, bytes, newest };
}
const sameBuild = (a, b) => a.files === b.files && a.bytes === b.bytes && a.newest === b.newest;

const buildAtStart = fingerprint(OUT);

// ── which pages ────────────────────────────────────────────────────────────
async function htmlPages(dir) {
  const found = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) found.push(...await htmlPages(p));
    else if (e.name.endsWith('.html')) found.push('/' + relative(OUT, p).replace(/\\/g, '/'));
  }
  return found;
}

/** One page is representative of its template; the rest differ only in content. */
function templateOf(page) {
  if (/\/papers\/.*paper-\d+\.html$/.test(page)) return 'past paper';
  if (/\/notes\/.+\.html$/.test(page)) return 'notes';
  if (/\/practice\/.+\.html$/.test(page)) return 'practice';
  if (/^\/course\/[^/]+\.html$/.test(page)) return 'course landing';
  if (/\/(notes|practice)\.html$/.test(page)) return 'section index';
  if (/^\/(index|academy|connect|privacy)\.html$/.test(page)) return 'marketing';
  if (/^\/(explorer|worksheet|exam-hall)\.html$/.test(page)) return 'app surface';
  return 'other';
}

/**
 * Pages this cannot baseline, because they do not render the same twice.
 *
 * The Exam Hall picks a course from stored state and a Warm Up that changes,
 * so its controls differ between loads. Measured: a baseline recorded and then
 * compared against minutes later, on an unchanged build, reported 12 NEW
 * violations — all of them here. A gate that cries wolf on an unchanged site
 * gets switched off within a week.
 *
 * These surfaces are not unchecked, they are checked differently: they need
 * driving — filter, add, open, present — and a static sweep cannot do that.
 * The browser scripts that verified them are the right instrument.
 */
const NOT_BASELINEABLE = [
  '/exam-hall.html',
  '/explorer.html',
  '/worksheet.html',
  '/course/n5/generate.html',
  // An embedded R runtime with async status text — "Running hidden code
  // cells" is present or absent depending on how far it has got when the
  // measurement is taken.
  '/course/higher-apps/rstudio/index.html',
];

const every = (await htmlPages(OUT))
  .filter((p) => !/(404|_not-found)\.html$/.test(p))
  .filter((p) => !NOT_BASELINEABLE.includes(p))
  .sort();

/** A few of each template, spread across courses so one course cannot hide a fault. */
function sample(pages, perTemplate = 3) {
  const byTemplate = new Map();
  for (const p of pages) {
    const t = templateOf(p);
    if (!byTemplate.has(t)) byTemplate.set(t, []);
    byTemplate.get(t).push(p);
  }
  const picked = [];
  for (const [, list] of byTemplate) {
    const step = Math.max(1, Math.floor(list.length / perTemplate));
    for (let i = 0; i < list.length && picked.length < pages.length; i += step) {
      picked.push(list[i]);
      if (picked.filter((x) => templateOf(x) === templateOf(list[i])).length >= perTemplate) break;
    }
  }
  return [...new Set(picked)].sort();
}

// --only <substring> narrows the run to matching pages. For working on one
// page, and for proving a rule fires on a page known to break it: a rule that
// has never gone red has established nothing.
const onlyAt = process.argv.indexOf('--only');
const ONLY = onlyAt !== -1 ? process.argv[onlyAt + 1] : null;

const PAGES = ONLY
  ? every.filter((p) => p.includes(ONLY))
  : ALL ? every : sample(every);

if (ONLY && !PAGES.length) {
  console.error(`\n  no page matches "${ONLY}". Nothing was checked.\n`);
  process.exit(1);
}

// ── serve the built site ───────────────────────────────────────────────────
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.webp': 'image/webp' };

const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    let file = join(OUT, p);
    try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html'); }
    catch { if (!extname(file)) file += '.html'; }
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404); res.end('not found'); }
});
await new Promise((r) => server.listen(PORT, r));

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
if (!existsSync(CHROME)) {
  console.error(`\n  no Chrome at ${CHROME}. Set CHROME_PATH. Nothing was checked.\n`);
  server.close();
  process.exit(1);
}
// **Its own profile directory, removed when this exits.**
//
// Chrome makes one anyway when it is not given one, and never removes it here
// because this script kills the process rather than asking it to leave. That
// leak reached 1,296 abandoned profiles holding 36.4GB and filled the disk —
// see `makeProfile` in browser-drive.mjs, which this borrows rather than
// growing a third copy of the same fix.
sweepStaleProfiles();
const profile = ownProfile();

const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-sandbox',
  '--hide-scrollbars', `--user-data-dir=${profile}`,
  // 518 pages at four viewports is a lot of cache nobody will ever read again.
  '--disk-cache-size=1', '--media-cache-size=1',
  `--remote-debugging-port=${CDP}`, 'about:blank'], { stdio: 'ignore' });

let ws, id = 0;
const pending = new Map();
const send = (m, p = {}) => {
  const i = ++id;
  ws.send(JSON.stringify({ id: i, method: m, params: p }));
  return new Promise((res, rej) => { pending.set(i, { res, rej }); setTimeout(() => rej(new Error(m)), 45000); });
};
const ev = async (e) => {
  const r = await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? 'threw');
  return r.result.value;
};

// ── the audit, run inside the page ─────────────────────────────────────────
const AUDIT = `(async () => {
  for (const d of document.querySelectorAll('details')) d.open = true;
  await Promise.all([...document.images].map(i =>
    i.complete ? null : new Promise(r => { i.onload = r; i.onerror = r; setTimeout(r, 1500); })));
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

  const vw = document.documentElement.clientWidth;
  const v = [];
  const seen = new Set();
  // One entry per distinct fault, not per element: a toolbar of six 36px
  // buttons is one thing to fix, and six lines of output is how a report
  // becomes something nobody reads.
  const add = (rule, detail, where) => {
    const k = rule + '|' + detail;
    if (seen.has(k)) return;
    seen.add(k);
    v.push({ rule, detail, where });
  };

  const visible = (el) => {
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const label = (el) => (el.getAttribute('aria-label') || el.textContent || '')
    .replace(/\\s+/g, ' ').trim().slice(0, 28) || '<' + el.tagName.toLowerCase() + '>';

  // ── tap targets ─────────────────────────────────────────────────────
  for (const el of document.querySelectorAll('button, a[href], [role="button"], summary')) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.height >= 44 && r.width >= 44) continue;
    // WCAG 2.5.8 exempts a target "in a sentence or block of text". The test
    // for that is the element's own display: an inline <a> flows with the
    // words around it and cannot be given a 44px box without breaking the
    // line. Checking ancestors instead missed a link in a photo caption and
    // reported it as a 163x17 control.
    if (el.tagName === 'A' && getComputedStyle(el).display === 'inline') continue;
    add('tap-target', label(el) + '  ' + Math.round(r.width) + 'x' + Math.round(r.height), label(el));
  }

  // ── form controls that make iOS zoom ────────────────────────────────
  for (const el of document.querySelectorAll('input, select, textarea')) {
    if (!visible(el)) continue;
    const px = parseFloat(getComputedStyle(el).fontSize);
    if (px < 16) add('input-zoom', (el.getAttribute('name') || el.type || 'control') + '  ' + px + 'px', 'form');
  }

  // ── text too small to read ──────────────────────────────────────────
  for (const el of document.querySelectorAll('p, li, td, th, span, div, h1, h2, h3, h4')) {
    if (!el.firstChild || el.firstChild.nodeType !== 3) continue;   // own text only
    if (!visible(el)) continue;
    // Spacers are not text. A zero-width space in a 1px span is a layout
    // trick, and reporting it as unreadable is the kind of false positive
    // that teaches people to ignore the whole report.
    const words = (el.textContent || '').replace(/[\\s\\u200b\\u00a0\\u200c\\u200d]/g, '');
    if (!words) continue;
    const px = parseFloat(getComputedStyle(el).fontSize);
    if (px < 12) {
      // Identified by WHERE it is, not by what it says.
      //
      // The text used to be in the key, and the homepage has digits that
      // change between loads — so the same undersized element was "8.8px 2"
      // one run and "8.8px 3" the next. Against a baseline recorded minutes
      // earlier on an unchanged build that read as 8 violations fixed, and a
      // key that comes and goes will eventually read as one ADDED and fail a
      // build for nothing.
      const cls = typeof el.className === 'string' && el.className
        ? '.' + el.className.trim().split(/\\s+/)[0] : '';
      add('text-floor', px + 'px  <' + el.tagName.toLowerCase() + cls + '>', 'text');
    }
  }

  // ── reading measure ─────────────────────────────────────────────────
  for (const el of document.querySelectorAll('.notes-body p, .prose-practice p, .question-content, .answer-content')) {
    if (!visible(el)) continue;
    const cs = getComputedStyle(el);
    const chars = el.getBoundingClientRect().width / (parseFloat(cs.fontSize) * 0.5);
    if (chars > 75) add('measure', Math.round(chars) + ' chars', el.className.split(' ')[0] || 'text');
  }

  // ── the page itself must not scroll sideways ────────────────────────
  if (document.documentElement.scrollWidth > vw + 1) {
    add('page-overflow', document.documentElement.scrollWidth + 'px in ' + vw + 'px', 'page');
  }

  // ── content clipped with no way to reach it ─────────────────────────
  //
  // overflow-x:hidden is NOT a fix: it clips. Only auto/scroll count as the
  // author having handled it. Counting hidden as handled made an earlier
  // version of this blind — it passed with 44px text at 320px.
  const handled = (el) => {
    for (let p = el.parentElement; p; p = p.parentElement) {
      const o = getComputedStyle(p).overflowX;
      if (o === 'auto' || o === 'scroll') return true;
    }
    return false;
  };
  const availFor = (el) => {
    for (let p = el.parentElement; p; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (cs.display === 'inline') continue;
      const r = p.getBoundingClientRect();
      const w = r.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      if (w > 40) return w;
    }
    return vw;
  };
  // Only the boxes actually laid out. Measuring every descendant reported
  // KaTeX's own stretchy glyph SVGs and its hidden MathML copy as 6,800px
  // faults, which they are not.
  const candidates = [
    ...document.querySelectorAll('.katex-html'),
    ...[...document.querySelectorAll('img, svg')].filter(e => !e.closest('.katex')),
    ...document.querySelectorAll('table, pre'),
  ];
  for (const el of candidates) {
    if (!visible(el) || el.closest('.katex-mathml') || handled(el)) continue;
    const w = el.getBoundingClientRect().width;
    const avail = availFor(el);
    if (w <= avail + 1) continue;
    const kind = el.classList.contains('katex-html') ? 'maths'
      : el.tagName === 'TABLE' ? 'table' : el.tagName === 'PRE' ? 'code' : 'figure';
    add('clipped', kind + '  ' + Math.round(w) + 'px into ' + Math.round(avail) + 'px'
      + '  (' + Math.round((avail / w) * 100) + '%)', kind);
  }

  // ── a scroll container that cannot scroll ───────────────────────────
  //
  // overflow-x:auto only works if the box is allowed to be narrower than its
  // content. A flex item defaults to min-width:auto, which refuses to shrink
  // below its content — so a scroll container inside one silently inherits its
  // content's width, the overflow escapes to the page, and the part that ends
  // up LEFT of the viewport cannot be reached at all, because a page cannot
  // scroll past zero.
  //
  // Found on higher/notes/differentiation: .katex-display had overflow-x:auto
  // and was still 384px inside a 343px card, pushing the page to 380px and
  // putting 5px of the formula permanently off the left edge.
  //
  // This is the generic symptom, so it catches the whole class: a scroll
  // container wider than the space it was given is doing nothing at all.
  for (const el of document.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    if (cs.overflowX !== 'auto' && cs.overflowX !== 'scroll') continue;
    if (!visible(el)) continue;
    // Compared against the VIEWPORT, not the parent. The first version of this
    // compared against the immediate parent and found nothing, because on the
    // page it was written for the parent was oversized too (384px inside 384px)
    // — the element that refused to shrink was three levels further up. A
    // scroll container that works is never wider than the screen, whatever its
    // parent is doing, so that is the test that holds in every arrangement.
    const r = el.getBoundingClientRect();
    const w = r.width;
    const room = vw;
    if (w <= room + 1 && r.left > -1) continue;
    // Name the ancestor that refused to shrink, since that is what to fix.
    let culprit = '';
    for (let p = el.parentElement; p; p = p.parentElement) {
      const s = getComputedStyle(p);
      const ps = p.parentElement ? getComputedStyle(p.parentElement) : null;
      if (ps && (ps.display === 'flex' || ps.display === 'inline-flex') && s.maxWidth === 'none') {
        // min-w-0 is the remedy everyone reaches for, and it was the first
        // thing suggested here. Measured on higher/notes/differentiation, it
        // changes nothing: in a COLUMN flex container with align-items:center
        // an item is sized to its content on the cross axis, and min-width
        // does not clamp that. max-width does — page 352px -> 320px, and the
        // equation then scrolls inside its own box as intended.
        culprit = ' — unclamped flex item, needs max-w-full (min-w-0 will NOT fix this)';
        break;
      }
      if (s.display === 'grid' || s.display === 'flex') { culprit = ' — inside a ' + s.display + ' container'; break; }
    }
    add('scroll-defeated',
      (el.className && typeof el.className === 'string' ? el.className.split(' ')[0] : el.tagName.toLowerCase())
      + '  ' + Math.round(w) + 'px in ' + Math.round(room) + 'px' + culprit, 'layout');
  }

  return v;
})()`;

// ── run it ─────────────────────────────────────────────────────────────────
const found = new Map();          // "rule|page|viewport|detail" -> row
let audited = 0, emptyPages = 0;

try {
  let t;
  for (let i = 0; i < 40 && !t; i++) {
    await sleep(250);
    try { t = (await (await fetch(`http://127.0.0.1:${CDP}/json`)).json()).find((x) => x.type === 'page'); } catch { /* waiting */ }
  }
  if (!t) throw new Error('Chrome did not start');
  ws = new WebSocket(t.webSocketDebuggerUrl);
  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data);
    const p = pending.get(m.id);
    if (!p) return;
    pending.delete(m.id);
    m.error ? p.rej(new Error(m.error.message)) : p.res(m.result);
  });
  await new Promise((r) => ws.addEventListener('open', r));
  await send('Page.enable');
  await send('Runtime.enable');

  // One navigation per page, measured at every viewport — not one full pass per
  // viewport. `--reload-each` restores the old order.
  //
  // This is four times fewer page loads: 518 navigations instead of 2,072. It
  // matters because the run reads the BUILT site, and a long run over a
  // directory that someone may rebuild is a run that quietly mixes two
  // versions of the site. Shortening it shrinks that window; the fingerprint
  // check below closes what is left.
  //
  // Verified against --reload-each on a sample before being made the default:
  // resizing after load has to produce what a fresh load at that width would,
  // and a component that reads its width once at mount would break that.
  if (RELOAD_EACH) {
    for (const [vpName, w, h, mobile] of VIEWPORTS) {
      await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile });
      for (const page of PAGES) {
        await send('Page.navigate', { url: `http://localhost:${PORT}${page}` });
        await sleep(2200);
        let rows;
        try { rows = await ev(AUDIT); } catch { continue; }
        audited++;
        if (!rows) { emptyPages++; continue; }
        for (const r of rows) {
          if (excused(page, r.rule)) continue;
          found.set(`${r.rule}|${page}|${vpName}|${r.detail}`, { ...r, page, viewport: vpName });
        }
      }
      process.stderr.write(`  ${vpName} done (${found.size} so far)\n`);
    }
  } else {
    for (const [n, page] of PAGES.entries()) {
      await send('Page.navigate', { url: `http://localhost:${PORT}${page}` });
      await sleep(2200);
      for (const [vpName, w, h, mobile] of VIEWPORTS) {
        await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile });
        await sleep(350);                   // let the resize settle
        let rows;
        try { rows = await ev(AUDIT); } catch { continue; }
        audited++;
        if (!rows) { emptyPages++; continue; }
        for (const r of rows) {
          if (excused(page, r.rule)) continue;
          found.set(`${r.rule}|${page}|${vpName}|${r.detail}`, { ...r, page, viewport: vpName });
        }
      }
      if ((n + 1) % 50 === 0) process.stderr.write(`  ${n + 1}/${PAGES.length} pages (${found.size} so far)\n`);
    }
  }
} catch (e) {
  console.error(`\n  FAILED to run: ${e.message}\n  Nothing was checked.\n`);
  try { ws?.close(); } catch { /* gone */ }
  chrome.kill();
  server.close();
  rmSync(profile, { recursive: true, force: true });
  process.exit(1);
} finally {
  try { ws?.close(); } catch { /* gone */ }
  chrome.kill();
  server.close();
  // A moment for Chrome to drop its file handles, then take the profile away.
  await new Promise(r => setTimeout(r, 250));
  rmSync(profile, { recursive: true, force: true });
}

// ── compare with the baseline ──────────────────────────────────────────────
const keys = [...found.keys()].sort();
const old = existsSync(BASELINE) ? JSON.parse(await readFile(BASELINE, 'utf8')) : null;

const buildAtEnd = fingerprint(OUT);
if (!sameBuild(buildAtStart, buildAtEnd)) {
  console.error('\n  out/ CHANGED WHILE THIS WAS RUNNING.');
  console.error(`    started: ${buildAtStart.files} files, ${buildAtStart.bytes} bytes`);
  console.error(`    ended:   ${buildAtEnd.files} files, ${buildAtEnd.bytes} bytes`);
  console.error('  Part of this run measured one build and part another, so the');
  console.error('  result is a mixture of two versions of the site.');
  if (WRITE_BASELINE) {
    console.error('  REFUSING to record a baseline from it. Re-run without building.\n');
    process.exit(1);
  }
  console.error('  Treat the numbers below as unreliable.\n');
}

if (WRITE_BASELINE) {
  if (old && keys.length > old.keys.length) {
    console.error(`\n  REFUSING to record a worse baseline: ${keys.length} violations against ${old.keys.length} recorded.`);
    console.error('  A baseline is a burn-down, not a dustbin. Fix them, or pass --force.\n');
    if (!process.argv.includes('--force')) process.exit(1);
  }
  await writeFile(BASELINE, JSON.stringify({
    recordedAt: new Date().toISOString(), mode: ALL ? 'all' : 'sample',
    pages: PAGES.length, keys,
  }, null, 1));
  console.log(`\n  recorded ${keys.length} violations across ${PAGES.length} pages -> ${relative(ROOT, BASELINE)}\n`);
  process.exit(0);
}

const byRule = {};
for (const k of keys) byRule[k.split('|')[0]] = (byRule[k.split('|')[0]] || 0) + 1;

console.log(`\n  ${PAGES.length} pages x ${VIEWPORTS.length} viewports${ALL ? '' : '  (sample — use --all before a release)'}`);
console.log(`  ${audited} page renders audited`);
for (const [rule, n] of Object.entries(byRule).sort((a, b) => b[1] - a[1])) {
  console.log(`    ${String(n).padStart(5)}  ${rule.padEnd(14)} ${RULES[rule]}`);
}
if (!keys.length) console.log('    nothing found');

// ── the fix list ───────────────────────────────────────────────────────────
//
// The raw count is misleading and demoralising: a navbar button that is 40px
// appears on all 518 pages at all four viewports, which is 2,072 violations
// and ONE fix. So group by what would actually be changed. This is the
// difference between a report someone acts on and a report someone closes.
{
  const distinct = new Map();
  for (const r of found.values()) {
    const k = `${r.rule}|${r.detail}`;
    if (!distinct.has(k)) distinct.set(k, { ...r, pages: new Set(), viewports: new Set() });
    distinct.get(k).pages.add(r.page);
    distinct.get(k).viewports.add(r.viewport);
  }
  const list = [...distinct.values()].sort((a, b) => b.pages.size - a.pages.size);
  console.log(`\n  ${list.length} distinct things to fix (${keys.length} occurrences)\n`);
  console.log('   pages  rule           what');
  for (const d of list.slice(0, 30)) {
    console.log(`   ${String(d.pages.size).padStart(5)}  ${d.rule.padEnd(14)} ${d.detail.slice(0, 62)}`);
  }
  if (list.length > 30) console.log(`          ... and ${list.length - 30} more`);
}

if (!old) {
  console.log('\n  no baseline recorded. Run with --baseline to record today, then this');
  console.log('  fails only on NEW violations.\n');
  process.exit(0);
}

const wasSet = new Set(old.keys);
const added = keys.filter((k) => !wasSet.has(k));

// "Fixed" only counts pages this run actually visited. A sample run visits 23
// of 518, so comparing the whole baseline would report 495 pages of violations
// as fixed simply for not having been looked at — a check that congratulates
// you for not testing is worse than no check.
const visited = new Set(PAGES);
const fixed = old.keys.filter((k) => {
  const page = k.split('|')[1];
  return visited.has(page) && !found.has(k);
});
const unvisited = old.keys.filter((k) => !visited.has(k.split('|')[1])).length;

console.log(`\n  against the baseline of ${old.keys.length} (recorded ${old.recordedAt.slice(0, 10)}, ${old.mode}):`);
console.log(`    ${fixed.length} fixed`);
console.log(`    ${added.length} new`);
if (unvisited) console.log(`    ${unvisited} on pages this run did not visit — use --all to judge those`);

if (fixed.length) {
  console.log('\n  fixed:');
  for (const k of fixed.slice(0, 10)) {
    const [rule, page, vp, detail] = k.split('|');
    console.log(`    ${rule.padEnd(14)} ${vp.padEnd(9)} ${page.replace('/course/', '')}  ${detail}`);
  }
  if (fixed.length > 10) console.log(`    ... and ${fixed.length - 10} more`);
  console.log('\n  Re-record with --baseline so they cannot come back.');
}

if (added.length) {
  console.log('\n  NEW violations:');
  for (const k of added.slice(0, 25)) {
    const [rule, page, vp, detail] = k.split('|');
    console.log(`    ${rule.padEnd(14)} ${vp.padEnd(9)} ${page.replace('/course/', '')}`);
    console.log(`                   ${detail}`);
  }
  if (added.length > 25) console.log(`    ... and ${added.length - 25} more`);
  console.log('');
  process.exit(1);
}

console.log('\n  no new sizing or overflow violations\n');
