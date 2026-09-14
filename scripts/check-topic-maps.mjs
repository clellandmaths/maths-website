/**
 * The bridge between the site's topic vocabularies cannot rot.
 *
 *   node scripts/check-topic-maps.mjs
 *
 * `lib/generatable-topics.ts` says which of the website's 57 subtopics each
 * National 5 practice topic covers, so a practice page can offer more questions
 * on what it is about. Three ways that goes wrong quietly:
 *
 *   - **a new practice topic is added** and nobody maps it, so its page shows
 *     no control and looks like the feature was forgotten
 *   - **a practice topic is renamed or removed** and its entry lingers, so the
 *     map describes a page that no longer exists
 *   - **a subtopic is misspelled**, so the control appears, draws nothing, and
 *     tells the pupil there is nothing there
 *
 * It also **derives** which mapped topics can actually produce questions rather
 * than trusting a list. That distinction is not academic: a hand-written
 * "nothing generatable" list had Line of Best Fit on it, and Line of Best Fit
 * has two exam-tier variations with seven paper citations between them.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const MAP = path.join(root, 'lib', 'generatable-topics.ts');
const TOPICS = path.join(root, 'lib', 'n5-topics.ts');
const PRACTICE = path.join(root, 'src', 'practice', 'data', 'national5Maths.ts');
const REGISTRY = path.join(root, 'lib', 'generator', 'generators', 'n5-variations.ts');

let failures = 0;
const fail = msg => { failures++; console.log(`  FAIL  ${msg}`); };

for (const f of [MAP, TOPICS, PRACTICE, REGISTRY]) {
  if (!fs.existsSync(f)) {
    console.error(`\n  no ${path.relative(root, f)}. Nothing was checked.\n`);
    process.exit(1);
  }
}

/** The same rule `topicSlug` uses in lib/practice-loader.ts. */
const slugify = name => name.toLowerCase()
  .replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ── what exists ────────────────────────────────────────────────────────────
const practiceNames = [...fs.readFileSync(PRACTICE, 'utf8')
  .matchAll(/^\s*name:\s*['"`]([^'"`]+)/gm)].map(m => m[1]);
if (practiceNames.length < 20) {
  console.error(`\n  parsed only ${practiceNames.length} practice topics, expected 30+.` +
                `\n  The data file moved or changed shape. Nothing was checked.\n`);
  process.exit(1);
}
const slugs = practiceNames.map(slugify);

const topicsText = fs.readFileSync(TOPICS, 'utf8');
const subtopics = new Set();
{
  const body = topicsText.slice(topicsText.indexOf('n5TopicCategories'),
                               topicsText.indexOf('export const n5Topics'));
  for (const m of body.matchAll(/"[^"]+":\s*\[([^\]]*)\]/gs)) {
    for (const s of m[1].matchAll(/"([^"]+)"/g)) subtopics.add(s[1]);
  }
}
if (subtopics.size < 40) {
  console.error(`\n  parsed only ${subtopics.size} subtopics. Nothing was checked.\n`);
  process.exit(1);
}

// ── the map, read as text ──────────────────────────────────────────────────
const mapText = fs.readFileSync(MAP, 'utf8');
const mapBody = mapText.slice(mapText.indexOf('PRACTICE_TO_SUBTOPICS'));
const mapped = new Map();
for (const m of mapBody.matchAll(/^\s{2}'([a-z0-9-]+)':\s*\[([^\]]*)\]/gms)) {
  mapped.set(m[1], [...m[2].matchAll(/'([^']*)'/g)].map(x => x[1]));
}
if (!mapped.size) {
  console.error('\n  parsed no entries from PRACTICE_TO_SUBTOPICS. Nothing was checked.\n');
  process.exit(1);
}

// ── exam-tier coverage per subtopic, derived from the registry ─────────────
const covered = new Set();
{
  const text = fs.readFileSync(REGISTRY, 'utf8');
  const ids = [...text.matchAll(/^ {2}'([a-z0-9-]+\.[a-z0-9-]+)':\s*\{/gm)];
  if (ids.length < 200) {
    console.error(`\n  parsed only ${ids.length} variations. Nothing was checked.\n`);
    process.exit(1);
  }
  for (let i = 0; i < ids.length; i++) {
    const block = text.slice(ids[i].index, i + 1 < ids.length ? ids[i + 1].index : text.length);
    if (/difficulty:\s*'exam'/.test(block) === false) continue;
    const tags = /webTopics:\s*\[([^\]]*)\]/s.exec(block);
    if (tags) for (const t of tags[1].matchAll(/'([^']*)'/g)) covered.add(t[1]);
  }
}

console.log(`\n  ${slugs.length} National 5 practice topics, ${subtopics.size} website subtopics`);
console.log(`  ${mapped.size} entries in PRACTICE_TO_SUBTOPICS\n`);

// ── 1. every practice topic is accounted for ───────────────────────────────
for (const [slug, name] of slugs.map((s, i) => [s, practiceNames[i]])) {
  if (!mapped.has(slug)) {
    fail(`practice topic "${name}" (${slug}) is not in the map — add it, with [] if nothing fits`);
  }
}

// ── 2. nothing stale ───────────────────────────────────────────────────────
const real = new Set(slugs);
for (const slug of mapped.keys()) {
  if (!real.has(slug)) fail(`the map has "${slug}", which is not a practice topic any more`);
}

// ── 3. every name is a real subtopic ───────────────────────────────────────
for (const [slug, list] of mapped) {
  for (const s of list) {
    if (!subtopics.has(s)) fail(`"${slug}" maps to "${s}", which is not one of the website's subtopics`);
  }
}

// ── 4. derived: what can actually produce questions ────────────────────────
const declaredNone = [...mapped].filter(([, l]) => l.length === 0).map(([s]) => s);
const deadEnds = [...mapped].filter(([, l]) => l.length > 0 && !l.some(s => covered.has(s)));

if (declaredNone.length) {
  console.log(`  declared as having nothing to generate (${declaredNone.length}):`);
  for (const s of declaredNone) console.log(`      ${s}`);
  console.log('');
}
for (const [slug, list] of deadEnds) {
  fail(`"${slug}" maps to ${list.map(s => `"${s}"`).join(', ')}, none of which has an exam-tier variation`);
}

const live = [...mapped].filter(([, l]) => l.some(s => covered.has(s)));
if (!failures) {
  console.log(`  ${live.length} of ${mapped.size} practice topics can generate questions`);
  console.log(`  every practice topic is mapped, every name is real, and nothing is stale\n`);
} else {
  console.log(`\n  ${failures} problem${failures === 1 ? '' : 's'} in the topic map.\n`);
  process.exit(1);
}
