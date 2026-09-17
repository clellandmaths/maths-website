/**
 * The pages that read the URL hydrate without complaint.
 *
 *   npm run build && node scripts/check-hydration.mjs
 *
 * **Not in `build`** — it needs headless Chrome and the Cloudflare image has none.
 *
 * ## The fault
 *
 * This site is a static export: every page is built once, with no query string
 * in existence. A lazy `useState` initialiser that reads `location` or
 * `localStorage` therefore answers one thing at build time and another in the
 * browser, so React's first client render disagrees with the HTML it is
 * hydrating — and React does not patch a mismatch. It discards the
 * server-rendered tree and rebuilds the page.
 *
 * `/explorer` did exactly that, on every shared link and every returning
 * visitor, on the heaviest page on the site. The teardown also stripped the
 * `data-theme` attribute off `<html>`, which is why `app/layout.tsx` carries a
 * `MutationObserver` to put it back.
 *
 * ## How it is detected
 *
 * React reports a mismatch through `console.error`, so a collector is installed
 * before any page script runs and the console is read afterwards. Nothing about
 * the page's own markup can be inspected for this: a rebuilt tree and a
 * hydrated one look identical once they settle. **The evidence is the console,
 * and it is only there for a moment.**
 *
 * Every console error is reported, not only hydration ones — an exception
 * during hydration produces a different message and the same broken page.
 *
 * ## The theme attribute, checked here too
 *
 * Because it is the thing the mismatch actually broke, and a check that watches
 * only for the error message would pass a page that had quietly lost its theme
 * by some other route.
 */
import { withPage, tally } from './browser-drive.mjs';

const t = tally();

/** The query-driven pages, and what each one must decide from its URL. */
const PAGES = [
  ['/explorer?c=n5', 'a shared link naming National 5'],
  ['/explorer?c=higher', 'a shared link naming Higher'],
  ['/explorer', 'no query at all'],
  ['/course/n5/practice/3d-coordinates?full=1', 'practice, straight into full screen'],
];

/**
 * Installed before any page script, so it is watching when React hydrates.
 * Kept deliberately small: it must not itself throw.
 */
const COLLECTOR = `
  window.__seen = [];
  window.__shell = [];
  (function () {
    var real = console.error;
    console.error = function () {
      try {
        window.__seen.push(Array.prototype.map.call(arguments, function (a) {
          return (a && a.message) ? a.message : String(a);
        }).join(' '));
      } catch (e) { }
      return real.apply(console, arguments);
    };
    // Hold the shell as the served HTML provides it, before React runs, so it
    // can be asked afterwards whether these same objects are still in the
    // document. Kept as references, never by selector: re-querying would find
    // whatever React built to replace them and report everything as fine.
    document.addEventListener('DOMContentLoaded', function () {
      try {
        window.__shell = [
          document.querySelector('nav'),
          document.querySelector('body > footer'),
        ].filter(Boolean);
      } catch (e) { }
    }, { once: true });
  })();
`;

for (const [path, what] of PAGES) {
  await withPage({ port: 8172, cdp: 9272, width: 1280, height: 900 }, async ({ evaluate, send, go, sleep }) => {
    // Dark stamped up front: the mismatch used to strip this, so it is the
    // canary as well as a setting.
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `try { localStorage.setItem('theme', 'dark'); } catch (e) { }\n` + COLLECTOR,
    });

    await go(path, 5000);
    await sleep(2000);

    // **That the page is actually there.**
    //
    // The first version of this named a practice topic that does not exist, so
    // every page load was the server's 404 — which carries no theme script, and
    // therefore failed the theme assertion while passing both console ones. A
    // check reporting "the theme did not survive" about a page that was never
    // served is worse than no check: it sends someone looking for a bug in the
    // wrong place. So the page says who it is before anything else is asked.
    const real = await evaluate(
      `document.querySelector('main, article, h1') !== null
       && !/^not found/i.test(document.body.textContent.trim())`);
    t.check(real === true, `${path} · the page exists and was served`);
    if (real !== true) return;

    const seen = JSON.parse(await evaluate(
      'JSON.stringify((window.__seen || []).slice(0, 8))'));

    const hydration = seen.filter(m =>
      /hydrat|did not match|server.rendered|server HTML/i.test(m));

    // The served shell, and whether React kept it.
    const shell = JSON.parse(await evaluate(`JSON.stringify({
      held: (window.__shell || []).length,
      kept: (window.__shell || []).filter(function (el) { return el.isConnected; }).length,
    })`));

    t.check(shell.held > 0, `${path} · the shell was captured before React ran (${shell.held})`);
    t.check(shell.held > 0 && shell.kept === shell.held,
      `${path} · ${what} — the served HTML is adopted, not rebuilt ` +
      `(${shell.kept}/${shell.held} kept)`);

    t.check(hydration.length === 0,
      `${path} · no hydration error reported` +
      (hydration.length ? `\n        ${hydration[0].slice(0, 200)}` : ''));

    t.check(seen.length === 0,
      `${path} · no console errors at all (${seen.length})` +
      (seen.length ? `\n        ${seen[0].slice(0, 200)}` : ''));

    // The attribute the teardown used to wipe.
    const theme = await evaluate(`document.documentElement.getAttribute('data-theme')`);
    t.check(theme === 'dark', `${path} · the theme survived hydration (${theme})`);
  });
}

t.done('the pages that read the URL hydrate without complaint');
