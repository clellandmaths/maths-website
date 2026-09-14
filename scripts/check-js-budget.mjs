/**
 * How much JavaScript each kind of page loads, and a ratchet on it.
 *
 *   npm run build && node scripts/check-js-budget.mjs
 *   node scripts/check-js-budget.mjs --baseline      record, don't compare
 *
 * The number is the sum of the **unique** `/_next/static/chunks/*.js` files a
 * page's HTML references. That is the eager JavaScript: what the browser must
 * fetch before the page works. Lazy chunks reached through `await import()` are
 * deliberately not counted, because not paying for them is the whole point.
 *
 * This method reproduces the figures the porting plan recorded by hand — home
 * **824 KB**, a past paper page **826 KB**, notes **814 KB** — so it measures
 * the same thing those decisions were made against.
 *
 * **One entry per template, not per page.** 520 pages are about 30 shapes, and
 * a per-page baseline would be 520 lines of noise that nobody reads and one
 * line that matters. Pages are grouped by route pattern (digits and slugs
 * folded to `*`) and the **largest** page of each group is the one recorded,
 * because the budget is about the worst case.
 *
 * **Headroom is 10 KB.** A new shared control costs two to four; the generator
 * engine costs six hundred and forty-five. There is nothing in between, so a
 * threshold anywhere in that gap separates "someone added a button" from
 * "someone imported the engine" without argument. Growth inside the headroom is
 * reported, never failed — see `check-engine-isolation.mjs` for the rule that
 * has no tolerance at all.
 *
 * Three routes are **pinned** and reported individually whatever else changes,
 * because they are the ones the porting plan promised would not move.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const OUT = path.join(root, 'out');
const BASELINE = path.join(root, 'scripts', 'js-budget-baseline.json');

const HEADROOM = 10 * 1024;
const recording = process.argv.includes('--baseline');

/**
 * Reported by name every run: the pages whose size was promised, and the two
 * templates the generator work is about to touch.
 *
 * **The porting plan's "notes 814 KB" is the notes *hub*** (`/course/n5/notes`),
 * which folds into `course/*` here. A notes *topic* page — the one a pupil
 * actually reads, and where a "try one" control would go — is **829 KB**. They
 * are different pages and the second is the one to budget against.
 */
const PINNED = [
  'index.html',                    // 824 KB — promised not to move
  'course/n5/papers/*/*.html',     // 826 KB — promised not to move
  'course/n5/notes/*/*.html',      // 829 KB — notes topic pages
  'course/n5/*/*.html',            // 866 KB — practice topic pages
];

if (!fs.existsSync(OUT)) {
  console.error('\n  no out/ — run `npm run build` first. Nothing was checked.\n');
  process.exit(1);
}

// ── measure ────────────────────────────────────────────────────────────────
function htmlFiles(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== '_next') out.push(...htmlFiles(full)); }
    else if (e.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const sizes = new Map();                 // chunk filename -> bytes
const chunkDir = path.join(OUT, '_next', 'static', 'chunks');
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.name.endsWith('.js')) sizes.set(e.name, fs.statSync(full).size);
  }
})(chunkDir);

if (!sizes.size) {
  console.error('\n  no chunks under out/_next/static/chunks. Nothing was checked.\n');
  process.exit(1);
}

/** Fold a page path into the template it was built from. */
function template(rel) {
  return rel.split(path.sep).join('/')
    .replace(/\/\d{4}\/paper-\d+\.html$/, '/*/*.html')     // papers/2024/paper-1
    .replace(/\/[^/]+\/[^/]+\.html$/, m => {
      // notes/<section>/<topic>.html — two variable segments
      const parts = m.split('/');
      return parts.length === 3 ? '/*/*.html' : m;
    })
    .replace(/\/[^/]+\.html$/, m => (m === '/index.html' ? m : '/*.html'));
}

const pages = htmlFiles(OUT);
const byTemplate = new Map();

for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');
  const referenced = new Set();
  for (const m of html.matchAll(/\/_next\/static\/chunks\/([^"'\s]+?\.js)/g)) {
    referenced.add(path.basename(m[1]));
  }
  let bytes = 0;
  for (const f of referenced) bytes += sizes.get(f) ?? 0;

  const rel = path.relative(OUT, page);
  const key = rel === 'index.html' ? 'index.html' : template(rel);
  const prev = byTemplate.get(key);
  if (!prev || bytes > prev.bytes) byTemplate.set(key, { bytes, page: rel, count: 1 });
  if (prev) byTemplate.get(key).count = prev.count + 1;
}

const kb = b => `${Math.round(b / 1024)} KB`;
const current = Object.fromEntries([...byTemplate.entries()].sort()
  .map(([k, v]) => [k, { bytes: v.bytes, worst: v.page, pages: v.count }]));

console.log(`\n  ${pages.length} pages, ${byTemplate.size} templates, ${sizes.size} chunks\n`);
for (const p of PINNED) {
  const e = current[p];
  console.log(`    ${e ? kb(e.bytes).padStart(7) : '  absent'}  ${p}`);
}

// ── record, or compare ─────────────────────────────────────────────────────
if (recording) {
  if (fs.existsSync(BASELINE)) {
    const old = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
    const worse = Object.keys(current).filter(k => old.templates[k] && current[k].bytes > old.templates[k].bytes + HEADROOM);
    if (worse.length) {
      console.error(`\n  REFUSING to record — ${worse.length} template(s) are over the current baseline:\n` +
        worse.map(k => `    ${k}  ${kb(old.templates[k].bytes)} → ${kb(current[k].bytes)}`).join('\n') +
        `\n\n  A baseline may only be replaced by one that is no worse. Fix the growth first.\n`);
      process.exit(1);
    }
  }
  fs.writeFileSync(BASELINE, JSON.stringify({
    recorded: new Date().toISOString().slice(0, 10),
    headroomBytes: HEADROOM,
    note: 'Sum of unique /_next/static/chunks/*.js referenced by the worst page of each template.',
    templates: current,
  }, null, 2) + '\n');
  console.log(`\n  baseline recorded: ${byTemplate.size} templates → scripts/js-budget-baseline.json\n`);
  process.exit(0);
}

if (!fs.existsSync(BASELINE)) {
  console.error('\n  no scripts/js-budget-baseline.json — record one with --baseline.' +
                '\n  Nothing was compared.\n');
  process.exit(1);
}

const base = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
const grew = [], shrank = [], added = [];

for (const [k, v] of Object.entries(current)) {
  const was = base.templates[k];
  if (!was) { added.push(k); continue; }
  const d = v.bytes - was.bytes;
  if (d > HEADROOM) grew.push([k, was.bytes, v.bytes]);
  else if (d < -HEADROOM) shrank.push([k, was.bytes, v.bytes]);
}
const gone = Object.keys(base.templates).filter(k => !current[k]);

console.log(`\n  against the baseline of ${base.recorded} (headroom ${kb(base.headroomBytes)}):`);
for (const k of added) console.log(`    NEW      ${k}  ${kb(current[k].bytes)}`);
for (const k of gone) console.log(`    removed  ${k}`);
for (const [k, a, b] of shrank) console.log(`    smaller  ${k}  ${kb(a)} → ${kb(b)}`);

if (!grew.length) {
  console.log(`    no template grew by more than ${kb(HEADROOM)}\n`);
  if (added.length) console.log('  New templates are recorded with --baseline once you have looked at them.\n');
  process.exit(0);
}

console.log('');
for (const [k, a, b] of grew) {
  console.log(`  FAIL  ${k}  ${kb(a)} → ${kb(b)}  (+${kb(b - a)})`);
}
console.log(`\n  Something static was added to a page that did not have it.` +
            `\n  If it is the generator, check-engine-isolation.mjs will name the chunk.\n`);
process.exit(1);
