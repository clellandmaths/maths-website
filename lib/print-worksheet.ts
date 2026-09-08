// Make sure a worksheet's diagrams are actually loaded before the browser
// takes its print snapshot.
//
// Question images carry loading="lazy" (see render-math.ts), which is right
// for browsing — the Explorer grid holds hundreds of them. But a lazy image
// that has never scrolled into view has never been fetched, so it prints
// blank. Chromium force-loads lazy images when printing; WebKit does not, so
// iPhone and iPad silently dropped every diagram below the fold.
//
// Two halves:
//
//   warmWorksheetImages()  quietly, in the background, while the sheet is open
//   printWorksheet()       a short top-up on the click, then print
//
// Everything is scoped to `.worksheet-container` — the questions someone
// deliberately added. The browse grid renders through `.question-card`
// instead and is never touched, so filtering a course full of diagrams stays
// exactly as fast as it is now.
//
// Fail-safe by construction: every step is optional, wrapped and capped. If
// warming errors, or the network hangs, print still fires and the result is
// exactly today's behaviour. Nothing here can regress what already works.

/** Worksheet question images. Deliberately not `.question-card` — see above. */
const SELECTOR = '.worksheet-container img';

/** Sources already pulled this session, so revisiting a sheet costs nothing. */
const warmed = new Set<string>();

/**
 * Low Data Mode. Chrome and Android expose it; iOS does not, so this is a
 * courtesy where the browser offers one, never a guarantee.
 */
function saveDataOn(): boolean {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return conn?.saveData === true;
}

/** requestIdleCallback where it exists — Safari only got it in 16.4. */
function whenIdle(run: () => void): void {
  const ric = (window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  }).requestIdleCallback;
  if (ric) ric(run, { timeout: 2000 });
  else setTimeout(run, 1000);
}

/**
 * Pull one source into the HTTP cache.
 *
 * Resolves on error as readily as on success: a missing image must never be
 * able to hold up somebody's print.
 */
function fetchOne(src: string): Promise<void> {
  return new Promise(resolve => {
    const probe = new Image();
    // A hint, not a dependency — ignored before Chrome 102 / Safari 17.2.
    (probe as HTMLImageElement & { fetchPriority?: string }).fetchPriority = 'low';
    probe.onload = probe.onerror = () => resolve();
    probe.src = src;
  });
}

function sourcesIn(root: ParentNode): string[] {
  return Array.from(root.querySelectorAll<HTMLImageElement>(SELECTOR))
    .map(img => img.currentSrc || img.src)
    .filter(src => Boolean(src) && !src.startsWith('data:'));
}

/** Run jobs a few at a time, so warming can never flood a slow connection. */
async function pool(jobs: Array<() => Promise<void>>, limit = 6): Promise<void> {
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, jobs.length) }, async () => {
    while (next < jobs.length) await jobs[next++]();
  });
  await Promise.all(workers);
}

/** Fetch anything not already warmed. No deferral — callers choose the timing. */
function warmNow(root: ParentNode): void {
  const todo = sourcesIn(root).filter(src => !warmed.has(src));
  for (const src of todo) warmed.add(src);
  if (todo.length) void pool(todo.map(src => () => fetchOne(src)));
}

/**
 * Pull the worksheet's diagrams into cache in the background.
 *
 * Call whenever the question list changes, not on mount: the shared worksheet
 * page resolves its questions asynchronously, so at mount there is nothing in
 * the DOM and this would find no images at all.
 */
export function warmWorksheetImages(root: ParentNode = document): void {
  if (typeof window === 'undefined' || saveDataOn()) return;
  whenIdle(() => warmNow(root));
}

/** A promise that settles after ms, for racing anything that might not. */
const after = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

/**
 * How long the click may wait for images before printing anyway.
 *
 * Capped rather than unbounded because window.print() needs the tap that
 * triggered it to still count as recent — transient activation lapses after
 * about five seconds on iOS — so waiting on a slow image would trade a missing
 * diagram for a Print button that silently does nothing at all. Worse bug.
 *
 * 3.5s, not 2s: a full-course sheet is about 1 MB of diagrams, which needs
 * roughly 5 Mbps to arrive inside two seconds. At 3.5s that drops to about
 * 3 Mbps, which covers weak 4G. Still comfortably inside the iOS window.
 * A normal 10–20 question sheet is 45–80 KB and clears either budget on 3G.
 */
const BUDGET_MS = 3500;

/**
 * Print, having given anything still in flight a moment to arrive.
 *
 * **Waits on the elements, not on copies of them.** This used to fetch each
 * pending source into the HTTP cache through a throwaway `new Image()` and
 * then allow a single animation frame for the real `<img>` to catch up. That
 * is a guess: nothing verified the elements on the page were ready, and the
 * frame is about 16ms. `decode()` resolves precisely when an element is
 * decoded and ready to paint, so "ready" becomes a fact rather than a hope.
 *
 * In practice the wait is near zero, because warmWorksheetImages has usually
 * run while the sheet was on screen — and when every image is already loaded
 * this does not wait at all.
 */
export async function printWorksheet(root: ParentNode = document): Promise<void> {
  const imgs = Array.from(root.querySelectorAll<HTMLImageElement>(SELECTOR));

  // Release anything the browser is still holding back. Honoured from Chrome
  // 77 / Safari 15.4; older WebKit ignores it and decode() below covers it.
  for (const img of imgs) img.loading = 'eager';

  const waiting = imgs.filter(img => !(img.complete && img.naturalWidth > 0));

  if (waiting.length) {
    // decode() rejects on a broken or src-less image; a missing diagram must
    // never be able to hold up somebody's print, so every one of them is
    // swallowed and the sheet prints with whatever arrived.
    await Promise.race([
      Promise.all(waiting.map(img => img.decode().catch(() => {}))),
      after(BUDGET_MS),
    ]);

    // One frame to paint what just decoded — raced, never awaited on its own.
    // A bare requestAnimationFrame does not fire in a page with no compositor
    // (a backgrounded tab, some mobile suspend states), and this is the last
    // step before window.print(): awaiting it unguarded turns "a diagram is
    // missing" into "the Print button does nothing at all", which is worse and
    // silent. Found by a test harness hanging here forever.
    await Promise.race([
      new Promise<void>(resolve => requestAnimationFrame(() => resolve())),
      after(50),
    ]);
  }

  window.print();
}

/**
 * Cmd-P, Ctrl-P and the browser's own print menu never reach the button, so
 * catch the browser announcing a print and release the images then.
 *
 * Chromium and Firefox fire beforeprint early enough for this to help. Safari
 * does not implement it at all, and its matchMedia equivalent fires mid-print,
 * too late to load anything — so that one path stays beyond reach from here.
 * The button, which is what the UI actually offers, is covered everywhere.
 *
 * Returns its own cleanup, for useEffect.
 */
export function watchSystemPrint(): () => void {
  if (typeof window === 'undefined') return () => {};
  const onBeforePrint = () => {
    document.querySelectorAll<HTMLImageElement>(SELECTOR)
      .forEach(img => { img.loading = 'eager'; });
    warmNow(document);
  };
  window.addEventListener('beforeprint', onBeforePrint);
  return () => window.removeEventListener('beforeprint', onBeforePrint);
}
