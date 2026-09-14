/**
 * The generator engine must not be on any page.
 *
 *   npm run build && node scripts/check-engine-isolation.mjs
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
console.log('  the engine is built, and it is on no page\n');
