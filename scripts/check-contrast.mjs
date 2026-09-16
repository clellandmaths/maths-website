/**
 * Every piece of text on the site clears WCAG AA against what is behind it.
 *
 *   npm run build && node scripts/check-contrast.mjs
 *   node scripts/check-contrast.mjs --selftest   (prove it can fail)
 *   node scripts/check-contrast.mjs --baseline   (record what is there today)
 *
 * **Not in `build`** — it needs headless Chrome and the Cloudflare image has none.
 *
 * ## Why this exists before the light mode does
 *
 * Nothing on this site measured colour. Eighteen browser checks measure
 * geometry, counts and presence; a page could render white on white and every
 * one would stay green. That was survivable with one theme that had been looked
 * at by eye for two years. A second theme doubles 542 pages, and eyes do not
 * scale. So this is written first and pointed at the **dark** site: whatever it
 * finds now has been shipping, and whatever it finds later is the light mode.
 *
 * ## The browser does the colour, not this file
 *
 * **Tailwind 4 computes colours as `lab()` and `oklab()`, not `rgb()`.** On the
 * homepage 137 of 439 computed text colours are in a space an `rgba(...)`
 * parser cannot read — and the first version of this probe dropped every one of
 * them *without counting it*, then reported a clean sweep. The gradients are
 * `lab()` too, and they carry another 95 nodes on that page alone.
 *
 * So no colour is parsed here. A 1x1 canvas is painted with the CSS string and
 * the pixel read back, which is the browser's own conversion to sRGB and works
 * for `lab`, `oklab`, `oklch`, `color()` and anything added later.
 * **Compositing is done the same way** — the layers are painted onto the canvas
 * bottom-up and the result read once, rather than this file implementing
 * source-over and un-premultiplying `getImageData`'s rounding.
 *
 * ## Gradients are measured, not skipped
 *
 * A gradient's stops are extracted and the text tested against **every one**,
 * reporting the worst. That is the honest reading: `text-white` over
 * `from-cyan-600 to-blue-600` has to clear AA at both ends, not on average.
 *
 * ## What it does NOT cover, and these matter
 *
 * - **Text over a bitmap** (`url(...)`). No single colour exists; counted and
 *   reported, never guessed.
 * - **`opacity` on an ancestor.** Lowers real contrast below what is computed
 *   here. Counted.
 * - **Anything not painted when measured** — a closed overlay, a collapsed
 *   panel. The three overlays are driven open below for exactly that reason,
 *   but coverage is what is driven, not everything.
 * - **Non-text contrast** (3:1 for borders, icons, focus rings). An icon-only
 *   button that fails is invisible to this.
 *
 * Every text node lands in exactly one bucket and the buckets are asserted to
 * sum, so a node cannot go missing the way 137 of them did.
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { withPage, tally } from './browser-drive.mjs';

const t = tally();
const args = process.argv.slice(2);
const SELFTEST = args.includes('--selftest');
const RECORD = args.includes('--baseline');
/**
 * Which theme to measure.
 *
 * `--theme=light` stamps `data-theme` after each navigation rather than relying
 * on the built HTML, so the light palette can be measured while the site still
 * ships dark by default. Each theme keeps its own baseline: they are different
 * sites and a shared file would let a fault in one hide behind the other.
 */
const THEME = (args.find(a => a.startsWith('--theme=')) || '--theme=dark').slice(8);
if (THEME !== 'light' && THEME !== 'dark') {
  console.error(`  --theme must be light or dark, not "${THEME}"`);
  process.exit(1);
}
const BASELINE = join(import.meta.dirname,
  THEME === 'dark' ? 'contrast-baseline.json' : `contrast-baseline-${THEME}.json`);

/**
 * The pages, chosen to cover every template rather than every page.
 *
 * `check:budget` groups 542 pages into 27 templates, and text colour is a
 * property of the template rather than of the question on it.
 */
const PAGES = [
  ['/', 'home'],
  ['/explorer?c=n5', 'explorer'],
  ['/worksheet', 'worksheet'],
  ['/exam-hall', 'exam hall'],
  ['/academy', 'academy'],
  ['/connect', 'connect'],
  ['/course/n5', 'course'],
  ['/course/n5/practice/fractions', 'practice topic'],
  ['/course/n5/papers/2024/paper-1', 'paper'],
  ['/course/n5/notes/algebra/algebraic-fractions', 'notes'],
  ['/course/n5/generate', 'generate'],
];

const PROBE = `(() => {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 1;
  const cx = cv.getContext('2d', { willReadFrequently: true });

  /** Is this string a colour the browser understands? */
  const SENTINEL = '#010203';
  const valid = s => {
    if (!s) return false;
    cx.fillStyle = SENTINEL;
    cx.fillStyle = s;
    if (cx.fillStyle !== SENTINEL) return true;
    return String(s).trim().toLowerCase() === SENTINEL;   // it really was that
  };

  /**
   * Paint \`layers\` bottom-up over \`base\` and read the sRGB result.
   * The browser composites; nothing here implements source-over.
   */
  const flatten = (base, layers) => {
    cx.globalCompositeOperation = 'source-over';
    cx.globalAlpha = 1;
    cx.clearRect(0, 0, 1, 1);
    cx.fillStyle = base;
    cx.fillRect(0, 0, 1, 1);
    for (const l of layers) { cx.fillStyle = l; cx.fillRect(0, 0, 1, 1); }
    const d = cx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]];
  };

  const sRGB = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const lum = p => 0.2126 * sRGB(p[0]) + 0.7152 * sRGB(p[1]) + 0.0722 * sRGB(p[2]);
  const ratio = (a, b) => { const x = lum(a), y = lum(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

  /** Split on commas that are not inside brackets. No regex: depth counting. */
  const topLevel = s => {
    const out = []; let depth = 0, cur = '';
    for (const ch of s) {
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; }
      else cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  };

  /**
   * The colour stops of every gradient in a background-image.
   *
   * A stop is "colour position" — drop whitespace-separated pieces off the end
   * until what is left converts. That also discards \`to right\` and \`90deg\`,
   * which never convert, so no list of direction keywords is needed here.
   */
  const stopsOf = bi => {
    if (bi.indexOf('url(') !== -1) return null;         // a bitmap: unknowable
    const stops = [];
    for (const part of topLevel(bi)) {
      const open = part.indexOf('(');
      if (open < 0 || part.indexOf('gradient') < 0) continue;
      const body = part.slice(open + 1, part.lastIndexOf(')'));
      for (const raw of topLevel(body)) {
        const bits = raw.split(' ').filter(Boolean);
        for (let n = bits.length; n > 0; n--) {
          const cand = bits.slice(0, n).join(' ');
          if (valid(cand)) { stops.push(cand); break; }
        }
      }
    }
    return stops.length ? stops : null;
  };

  const alphaOf = s => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = s;
    cx.fillRect(0, 0, 1, 1); return cx.getImageData(0, 0, 1, 1).data[3]; };

  /**
   * Candidate backgrounds behind \`el\`, already flattened to sRGB.
   * Returns null when a bitmap is in the way.
   */
  const backdrops = el => {
    const layers = [];            // CSS strings, nearest the text first
    const gradients = [];         // index in \`layers\` -> list of stop strings
    let base = 'white', found = false;
    for (let node = el; node; node = node.parentElement) {
      const cs = getComputedStyle(node);
      const bi = cs.backgroundImage;
      if (bi && bi !== 'none') {
        const stops = stopsOf(bi);
        if (!stops) return null;
        const opaque = stops.every(s => alphaOf(s) === 255);
        if (opaque) { gradients.push({ at: layers.length, stops }); layers.push(stops[0]); found = true; base = null; break; }
        gradients.push({ at: layers.length, stops });
        layers.push(stops[0]);
      }
      const bc = cs.backgroundColor;
      const a = alphaOf(bc);
      if (a > 0) {
        layers.push(bc);
        if (a === 255) { base = bc; layers.pop(); found = true; break; }
      }
    }
    if (!found) base = 'white';
    const bottomUp = layers.slice().reverse();
    // Expand the gradient layers into candidate stacks, capped so a page of
    // many-stop gradients cannot turn into thousands of canvas reads.
    let stacks = [bottomUp];
    for (const g of gradients) {
      const idx = bottomUp.length - 1 - g.at;
      const next = [];
      for (const st of stacks) {
        for (const stop of g.stops.slice(0, 4)) {
          const copy = st.slice(); copy[idx] = stop; next.push(copy);
        }
      }
      stacks = next.slice(0, 12);
    }
    return stacks.map(st => flatten(base || 'white', st));
  };

  const out = {
    total: 0, measured: 0, blank: 0, script: 0, hidden: 0, zeroBox: 0,
    faded: 0, onBitmap: 0, unreadableColour: 0, fails: [],
  };
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const text = (n.nodeValue || '').trim();
    if (!text) continue;
    const el = n.parentElement;
    if (!el) continue;
    if (seen.has(el)) continue;
    seen.add(el);
    out.total++;
    const tag = el.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'TITLE') { out.script++; continue; }
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') { out.hidden++; continue; }
    const box = el.getBoundingClientRect();
    if (box.width < 1 || box.height < 1) { out.zeroBox++; continue; }
    let fade = false;
    for (let p = el; p; p = p.parentElement) {
      const o = parseFloat(getComputedStyle(p).opacity);
      if (!isNaN(o) && o < 1) { fade = true; break; }
    }
    if (fade) { out.faded++; continue; }
    if (!valid(cs.color)) { out.unreadableColour++; continue; }
    const bgs = backdrops(el);
    if (!bgs) { out.onBitmap++; continue; }
    out.measured++;

    const size = parseFloat(cs.fontSize);
    const weight = parseInt(cs.fontWeight, 10) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const need = large ? 3 : 4.5;

    let worst = null;
    for (const bg of bgs) {
      const fg = flatten(hex(bg), [cs.color]);   // the text colour over its own ground
      const got = ratio(fg, bg);
      if (!worst || got < worst.got) worst = { got, fg, bg };
    }
    if (worst && worst.got < need - 0.005) {
      out.fails.push({
        text: text.slice(0, 48),
        tag: tag.toLowerCase(),
        cls: (el.className && el.className.baseVal !== undefined
              ? el.className.baseVal : String(el.className || '')).slice(0, 78),
        fg: hex(worst.fg), bg: hex(worst.bg),
        ratio: Math.round(worst.got * 100) / 100, need, size: Math.round(size), weight,
      });
    }
  }
  function hex(p) { return '#' + p.map(v => v.toString(16).padStart(2, '0')).join(''); }
  return out;
})()`;

const all = [];
const totals = {
  total: 0, measured: 0, script: 0, hidden: 0, zeroBox: 0,
  faded: 0, onBitmap: 0, unreadableColour: 0,
};
const add = r => { for (const k of Object.keys(totals)) totals[k] += r[k] || 0; };

await withPage({ port: 8173, cdp: 9273, width: 1440, height: 1000 }, async ({
  evaluate, click, buttonNamed, go: navigate, sleep,
}) => {
  /**
   * Navigate, then put the page in the theme being measured.
   *
   * Stamped after every navigation rather than once: each `go` is a fresh
   * document and the built HTML carries `data-theme="dark"`, so a theme set on
   * the previous page is gone. Measuring light against a page that quietly
   * reverted to dark would report the dark site twice and call it a pass.
   */
  const go = async (path, settle) => {
    await navigate(path, settle);
    const got = await evaluate(
      `(document.documentElement.setAttribute('data-theme', ${JSON.stringify(THEME)}),`
      + ` document.documentElement.getAttribute('data-theme'))`);
    if (got !== THEME) throw new Error(`could not put the page in ${THEME} (got ${got})`);
  };

  const measure = async (where) => {
    const r = await evaluate(PROBE);
    add(r);
    for (const f of r.fails) all.push({ ...f, where });
    return r;
  };

  // ── prove the probe can fail, in every colour space the site uses ──────
  /* An all-green contrast run is exactly what a probe that silently measures
     nothing produces, and the first version of this file did precisely that.
     A plant in `rgb()` alone would not have caught it — the bug was that
     `lab()` was unreadable — so one plant is plausible and three are a test. */
  await go('/', 5000);
  const planted = await evaluate(`(() => {
    const mk = (css, label) => {
      const d = document.createElement('div');
      d.style.cssText = 'background:#ffffff;font-size:14px;padding:6px;color:' + css;
      d.textContent = 'CONTRAST SELF TEST ' + label;
      document.body.appendChild(d);
    };
    mk('#f2f2f2', 'rgb');                          // grey on white
    mk('lab(96 0 0)', 'lab');                      // near-white on white
    mk('oklab(0.96 0 0)', 'oklab');                // near-white on white
    const g = document.createElement('div');
    g.style.cssText = 'background-image:linear-gradient(to right, #ffffff 0%, #000000 100%);'
                    + 'font-size:14px;padding:6px;color:#ffffff';
    g.textContent = 'CONTRAST SELF TEST gradient';  // white on a white-to-black ramp
    document.body.appendChild(g);
    return true;
  })()`);
  const probed = await evaluate(PROBE);
  const caught = probed.fails.filter(f => f.text.indexOf('CONTRAST SELF TEST') === 0);
  const kinds = caught.map(f => f.text.split(' ').pop()).sort();
  t.check(planted && caught.length === 4,
    `the probe catches planted unreadable text in every colour space (${caught.length} of 4: ${kinds.join(', ')})`);
  t.check(probed.unreadableColour === 0,
    `no computed colour defeated it (${probed.unreadableColour} unreadable)`);
  t.check(probed.measured > 100,
    `and it is reading the real page, not only the plants (${probed.measured} measured of ${probed.total})`);
  if (SELFTEST) {
    console.log('\n  planted failures as measured:');
    for (const c of caught) console.log(`    ${String(c.ratio).padStart(5)}:1  ${c.fg} on ${c.bg}  ${c.text}`);
    t.done('the contrast probe can fail');
    process.exit(0);
  }

  // ── the templates ──────────────────────────────────────────────────────
  for (const [path, name] of PAGES) {
    await go(path, 4500);
    const r = await measure(name);
    t.check(r.measured > 15 && r.unreadableColour === 0,
      `${name.padEnd(15)} ${String(r.measured).padStart(4)} measured of ${String(r.total).padStart(4)}`
      + `  ${r.fails.length} below AA`
      + (r.onBitmap ? `  (${r.onBitmap} on a bitmap)` : '')
      + (r.unreadableColour ? `  (${r.unreadableColour} UNREADABLE)` : ''));
  }

  // ── the states no URL can reach ────────────────────────────────────────
  /* The two full-screen modes and the hint overlay are the densest users of
     literal colour on the site and none of them has an address. A sweep of
     pages alone reports them clean by never opening them. */
  const overlay = async (name, open) => {
    await go('/course/n5/practice/fractions', 5000);
    if (!(await open())) { t.check(false, `could not open ${name} — that surface went unmeasured`); return; }
    await sleep(2200);
    const r = await measure(name);
    t.check(r.measured > 15 && r.unreadableColour === 0,
      `${name.padEnd(15)} ${String(r.measured).padStart(4)} measured of ${String(r.total).padStart(4)}`
      + `  ${r.fails.length} below AA`);
  };

  await overlay('focus overlay', () => click(buttonNamed('Focus')));
  await overlay('full screen', () => click(buttonNamed('Full screen')));

  /* The hint overlay needs a question that HAS a ladder. Fractions question 1
     is written for the site and carries no Hint button, so opening full screen
     and pressing straight away finds nothing — which is how this surface went
     unmeasured on the first run while everything else looked fine. */
  await go('/course/n5/practice/fractions', 5000);
  if (await click(buttonNamed('Full screen'))) {
    await sleep(2000);
    let opened = false;
    for (let i = 0; i < 12 && !opened; i++) {
      if (await click(buttonNamed('Hint'))) {
        await sleep(1600);
        opened = await evaluate(`!!document.querySelector('[role="dialog"][aria-label="Hint"]')`);
      }
      if (!opened) { await click(buttonNamed('Next')); await sleep(600); }
    }
    if (opened) {
      const r = await measure('hint overlay');
      t.check(r.measured > 10 && r.unreadableColour === 0,
        `${'hint overlay'.padEnd(15)} ${String(r.measured).padStart(4)} measured of ${String(r.total).padStart(4)}`
        + `  ${r.fails.length} below AA`);
    } else t.check(false, 'the hint overlay never opened — that surface went unmeasured');
  } else t.check(false, 'could not open full screen for the hint overlay');
});

// ── the report ───────────────────────────────────────────────────────────
console.log(`\n  [${THEME}] ${totals.measured} of ${totals.total} text nodes measured`);
console.log(`  not measured: ${totals.script} script/style, ${totals.hidden} hidden, `
          + `${totals.zeroBox} zero-box, ${totals.faded} under an opacity, `
          + `${totals.onBitmap} on a bitmap, ${totals.unreadableColour} unreadable colour`);
const accounted = totals.measured + totals.script + totals.hidden + totals.zeroBox
                + totals.faded + totals.onBitmap + totals.unreadableColour;
t.check(accounted === totals.total,
  `every text node is accounted for (${accounted} of ${totals.total})`);
t.check(totals.unreadableColour === 0,
  `no computed colour defeated the reader (${totals.unreadableColour})`);

/** One row per distinct colour pair — 90 failures are usually 6 causes. */
const byPair = new Map();
for (const f of all) {
  const k = `${f.fg} on ${f.bg} @${f.need}`;
  if (!byPair.has(k)) byPair.set(k, { ...f, n: 0, wheres: new Set() });
  const e = byPair.get(k);
  e.n++; e.wheres.add(f.where);
}
const pairs = [...byPair.values()].sort((a, b) => a.ratio - b.ratio);

if (!pairs.length) {
  console.log('\n  every measured node clears AA\n');
} else {
  console.log(`\n  ${all.length} node(s) below AA, from ${pairs.length} distinct pairing(s):\n`);
  for (const p of pairs) {
    console.log(`  ${String(p.ratio).padStart(5)}:1  (needs ${p.need})  ${p.fg} on ${p.bg}  x${p.n}`);
    console.log(`           ${p.size}px/${p.weight}  ${[...p.wheres].join(', ')}`);
    console.log(`           "${p.text}"`);
    if (p.cls) console.log(`           ${p.cls}`);
  }
  console.log('');
}

if (RECORD) {
  writeFileSync(BASELINE, JSON.stringify({
    recorded: new Date().toISOString().slice(0, 10),
    theme: THEME,
    totals,
    pairs: pairs.map(p => ({ fg: p.fg, bg: p.bg, ratio: p.ratio, need: p.need, n: p.n,
                             where: [...p.wheres], text: p.text })),
  }, null, 2));
  console.log(`  recorded ${pairs.length} pairing(s) to ${BASELINE}\n`);
  process.exit(0);
}

if (existsSync(BASELINE)) {
  const base = JSON.parse(readFileSync(BASELINE, 'utf8'));
  const known = new Set(base.pairs.map(p => `${p.fg} on ${p.bg}`));
  const fresh = pairs.filter(p => !known.has(`${p.fg} on ${p.bg}`));
  t.check(fresh.length === 0,
    fresh.length
      ? `${fresh.length} pairing(s) below AA that were not there on ${base.recorded}: `
        + fresh.map(p => `${p.fg} on ${p.bg} (${p.ratio}:1)`).join(', ')
      : `nothing below AA that was not already there on ${base.recorded}`);
} else {
  t.check(false, 'no baseline recorded yet — run --baseline once the failures '
    + 'above are either fixed or accepted');
}

t.done('text on this site clears WCAG AA against what is behind it');
