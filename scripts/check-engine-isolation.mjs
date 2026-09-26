/**
 * The generator engine must not be on any page.
 *
 *   npm run build && node scripts/check-engine-isolation.mjs
 *   node scripts/check-engine-isolation.mjs --baseline   record, don't compare
 *   node scripts/check-engine-isolation.mjs --accept-growth "<why>"
 *                                                        record a bigger engine, with the reason
 *
 * **Two things, and the second was missing for months.** The engine must be on
 * no page — that is what this was written for — and it must not grow without
 * anyone deciding to let it. This printed its size and compared it to nothing,
 * so it drifted from the 645 KB quoted in three separate source comments to
 * 932 KB with nothing to notice. Lazy is not free: it is what a pupil waits
 * for on the first press of Variation, on a phone, on schools' wifi.
 *
 * So the size is now ratcheted against `scripts/engine-size-baseline.json`,
 * the way `check-js-budget.mjs` ratchets the eager chunks, with 64 KB of
 * headroom — room for the registry to keep gaining variations as the
 * question-by-question review goes on, and not room for a library to be
 * pulled in unnoticed. Re-record with `--baseline` when the growth is one
 * somebody chose; the recording refuses if it would make the baseline worse
 * than the one on disk by more than the headroom.
 *
 * The engine is about 33,000 lines. It is loaded only through
 * `await import('@/lib/generated-question')` inside event handlers, so it lands
 * in its own lazy chunks and no page carries it. Every call site has a comment
 * saying so, and the measurements in the porting plan depend on it: the home
 * page, a past paper page and the notes pages were 824 / 826 / 814 KB before
 * the generator existed and are the same today.
 *
 * **One careless `import { … } from '@/lib/generator/…'` at the top of a shared
 * component undoes all of that**, silently, with no error and no visible
 * change — the site just gets much heavier for everyone. Source review cannot
 * catch it reliably because the import can be several files away from the page
 * that ends up paying. So this checks the only thing that actually settles it:
 * what the built HTML references.
 *
 * Two ways this check could lie, and what is done about each:
 *
 *   - **It finds no engine chunk and reports success.** That is the failure
 *     mode this repo has been bitten by — `reference/` is gitignored and nine
 *     generator checks quietly reported "nothing to check". So finding the
 *     markers in zero chunks is a FAILURE, not a pass.
 *   - **The marker strings get renamed** and stop matching. Several markers are
 *     used and all of them must be found, so a rename shows up as the failure
 *     above rather than as a false green.
 *
 * Chunk filenames carry content hashes and change on every build, so nothing
 * here is pinned to a name.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const OUT = path.join(root, 'out');
const CHUNKS = path.join(OUT, '_next', 'static', 'chunks');

const BASELINE = path.join(root, 'scripts', 'engine-size-baseline.json');
/**
 * 64 KB, about 7%. A registry entry is one to two KB minified, so the review
 * can add its remaining variations without anyone re-recording; a static
 * import of something real moves the total by far more than this.
 */
const HEADROOM = 64 * 1024;
const acceptAt = process.argv.indexOf('--accept-growth');
const acceptWhy = acceptAt >= 0 ? (process.argv[acceptAt + 1] ?? '').trim() : '';
const recording = process.argv.includes('--baseline') || acceptAt >= 0;
if (acceptAt >= 0 && !acceptWhy) {
  console.error('\n  --accept-growth needs a reason: what grew, and why it is earned.\n');
  process.exit(1);
}

/**
 * Variation ids, which appear as object keys in the registry and nowhere else
 * on the site. String literals survive minification, so these are stable
 * without depending on any bundler behaviour.
 */
const MARKERS = [
  'fractions.add-mixed',
  'quadratics.discriminant',
  'straight-line.best-fit-grid',
];

if (!fs.existsSync(OUT)) {
  console.error('\n  no out/ — run `npm run build` first. Nothing was checked.\n');
  process.exit(1);
}
if (!fs.existsSync(CHUNKS)) {
  console.error(`\n  no ${path.relative(root, CHUNKS)}. Nothing was checked.\n`);
  process.exit(1);
}

// ── which chunks carry the engine ──────────────────────────────────────────
const engine = new Map();               // filename -> bytes
const foundMarker = new Map(MARKERS.map(m => [m, 0]));

for (const f of fs.readdirSync(CHUNKS).filter(f => f.endsWith('.js'))) {
  const full = path.join(CHUNKS, f);
  const text = fs.readFileSync(full, 'utf8');
  let hit = false;
  for (const m of MARKERS) {
    if (text.includes(m)) { foundMarker.set(m, foundMarker.get(m) + 1); hit = true; }
  }
  if (hit) engine.set(f, fs.statSync(full).size);
}

// A marker nobody found means this check is no longer looking at anything.
const missing = MARKERS.filter(m => foundMarker.get(m) === 0);
if (missing.length) {
  console.error(`\n  these markers appear in no chunk at all:\n` +
    missing.map(m => `    ${m}`).join('\n') +
    `\n\n  Either the engine is no longer built, or the variation ids were renamed.` +
    `\n  Nothing was checked — fix the markers rather than trusting this.\n`);
  process.exit(1);
}

const engineBytes = [...engine.values()].reduce((a, b) => a + b, 0);
console.log(`\n  ${engine.size} engine chunk${engine.size === 1 ? '' : 's'}, ` +
            `${Math.round(engineBytes / 1024)} KB`);

// ── no page may reference one ──────────────────────────────────────────────
function htmlFiles(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === '_next') continue;          // the chunks themselves
      out.push(...htmlFiles(full));
    } else if (e.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const pages = htmlFiles(OUT);
if (!pages.length) {
  console.error('\n  out/ contains no HTML. Nothing was checked.\n');
  process.exit(1);
}

const offenders = [];
for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');
  const named = [...engine.keys()].filter(f => html.includes(f));
  if (named.length) offenders.push([path.relative(OUT, page), named]);
}

if (offenders.length) {
  console.log(`\n  ${offenders.length} of ${pages.length} pages load the engine:\n`);
  for (const [page, named] of offenders.slice(0, 20)) {
    console.log(`  FAIL  ${page}`);
    for (const f of named) console.log(`          ${f}  ${Math.round(engine.get(f) / 1024)} KB`);
  }
  if (offenders.length > 20) console.log(`  … and ${offenders.length - 20} more`);
  console.log(`\n  Something imports the generator statically. It must be reached only` +
              `\n  through await import('@/lib/generated-question') inside a handler.\n`);
  process.exit(1);
}

console.log(`  0 of ${pages.length} pages reference any of them\n`);

// ── and it has not grown behind anyone's back ──────────────────────────────
const kb = b => `${Math.round(b / 1024)} KB`;
const current = { chunks: engine.size, bytes: engineBytes };

if (recording) {
  if (fs.existsSync(BASELINE)) {
    const old = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
    // **Growth is recorded only on purpose, with its reason.** `--baseline`
    // alone may only replace a baseline with one no worse. The engine can
    // legitimately grow (the 2026-09 review added each paper question's own
    // plan and wording), so `--accept-growth "<why>"` records it, and keeps
    // the reason in the file where the next person to see the number will
    // read it. The 2026-09-26 run found this message pointing at a command
    // that refused, with no way through but editing the JSON by hand.
    if (current.bytes > old.bytes + HEADROOM && !acceptWhy) {
      console.error(`\n  REFUSING to record — the engine is ${kb(old.bytes)} in the ` +
        `baseline and ${kb(current.bytes)} now.\n  A baseline may only be replaced ` +
        `by one that is no worse. Find the growth first; if it is earned, record it\n` +
        `  with --accept-growth "<what grew and why>".\n`);
      process.exit(1);
    }
  }
  fs.writeFileSync(BASELINE, `${JSON.stringify({
    recorded: new Date().toISOString().slice(0, 10),
    headroomBytes: HEADROOM,
    note: 'Total bytes of every out/_next/static/chunks/*.js carrying a variation id. '
        + 'Lazy — on no page — but it is what the first press of Variation fetches.',
    ...(acceptWhy ? { acceptedGrowth: acceptWhy } : {}),
    ...current,
  }, null, 2)}\n`);
  console.log(`  baseline recorded: ${kb(current.bytes)} in ${current.chunks} chunks` +
              ` → scripts/engine-size-baseline.json\n`);
  process.exit(0);
}

if (!fs.existsSync(BASELINE)) {
  console.error('\n  no scripts/engine-size-baseline.json — record one with --baseline.' +
                '\n  The engine size was printed and compared to nothing.\n');
  process.exit(1);
}

const base = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
const delta = current.bytes - base.bytes;

if (delta > HEADROOM) {
  console.error(`  ENGINE GREW  ${kb(base.bytes)} on ${base.recorded} → ` +
    `${kb(current.bytes)} now. That is ${kb(delta)} more, against ${kb(HEADROOM)} ` +
    `of headroom.\n`);
  console.error(`  This is the download a pupil waits through on the first press of` +
    `\n  Variation. Either something was imported that need not be, or the registry` +
    `\n  has genuinely earned the weight — in which case record it deliberately, with the reason:` +
    `\n\n    node scripts/check-engine-isolation.mjs --accept-growth "<what grew and why>"\n`);
  process.exit(1);
}

if (delta < -HEADROOM) {
  console.log(`  smaller than the baseline of ${base.recorded}: ${kb(base.bytes)} → ` +
    `${kb(current.bytes)}. Record it with --baseline so the ratchet holds the gain.`);
} else {
  console.log(`  ${kb(current.bytes)} against the baseline of ${base.recorded} ` +
    `(${kb(base.bytes)}, headroom ${kb(HEADROOM)})`);
}

console.log('\n  the engine is built, it is on no page, and it has not grown\n');
