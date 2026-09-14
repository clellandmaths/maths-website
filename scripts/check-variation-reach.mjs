/**
 * Two invariants that a piece of UI copy rests on.
 *
 *   node scripts/check-variation-reach.mjs
 *
 * The "more like this" control tells a pupil which kind of question it is about
 * to make, *before* it makes one:
 *
 *   "Another like this one"   — there is a variation modelled on this exact
 *                               past paper question
 *   "More on Surds"           — there is not, so it falls back to the subtopic
 *
 * Choosing between those two without loading the 33,000-line engine means
 * reasoning from the question's own data — a paper label, or a subtopic tag.
 * That is only honest while two things hold:
 *
 *   1. **every past paper question is cited by at least one exam-tier
 *      variation**, so a label really does imply tier 1 exists
 *   2. **every one of the website's subtopics has at least one exam-tier
 *      variation**, so a tag really does imply tier 2 exists
 *
 * Both are true today. Neither is enforced anywhere else, and both are the kind
 * of thing that stops being true quietly — a variation retired, a subtopic
 * added. Without this check the headings are true by luck.
 *
 * It also prints the **pool depth** — how many variations sit behind each paper
 * question — because that number is what "another like this one" is worth. It
 * is 1 for almost every question, which is worth seeing rather than assuming.
 *
 * **Read as text, not imported.** The registry is TypeScript and this is a
 * plain .mjs script that has to run on a build machine. Parsing is therefore
 * the risk, so the parser refuses to report anything if it found no variations
 * at all — a check that cannot run must say so loudly rather than pass.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { paperRef } from '../lib/question-number.mjs';

const root = path.resolve(import.meta.dirname, '..');
const REGISTRY = path.join(root, 'lib', 'generator', 'generators', 'n5-variations.ts');
const TOPICS = path.join(root, 'lib', 'n5-topics.ts');

// The same shape `similar-questions.ts` uses. A label that does not match this
// is not offered a variation, so it must not be counted as covered either.
const N5_PAPER_LABEL = /^\d{4} P[12] Q\d+$/;

let failures = 0;
const fail = msg => { failures++; console.log(`  FAIL  ${msg}`); };

// ── the registry, read as text ─────────────────────────────────────────────
/**
 * Each entry looks like:
 *
 *   'straight-line.best-fit': {
 *     topic: 'The Equation of a Line of Best Fit',
 *     difficulty: 'exam', strategy: '…', source: 'paper',
 *     basedOn: ['2014 P1 Q6', '2016 P1 Q5'],
 *     webTopics: ['Straight Line Equation'],
 *   },
 *
 * Split on the id lines and read each block up to the next one. Splitting
 * rather than matching a whole block keeps this robust to the fields moving
 * around, which they have done.
 */
function readRegistry(text) {
  const out = [];
  const ids = [...text.matchAll(/^ {2}'([a-z0-9-]+\.[a-z0-9-]+)':\s*\{/gm)];
  for (let i = 0; i < ids.length; i++) {
    const from = ids[i].index;
    const to = i + 1 < ids.length ? ids[i + 1].index : text.length;
    const block = text.slice(from, to);

    const tier = /difficulty:\s*'([a-z-]+)'/.exec(block)?.[1] ?? null;
    const list = name => {
      const m = new RegExp(`${name}:\\s*\\[([^\\]]*)\\]`, 's').exec(block);
      return m ? [...m[1].matchAll(/'([^']*)'/g)].map(x => x[1]) : [];
    };
    out.push({ id: ids[i][1], tier, basedOn: list('basedOn'), webTopics: list('webTopics') });
  }
  return out;
}

if (!fs.existsSync(REGISTRY)) {
  console.error(`\n  no ${path.relative(root, REGISTRY)} — nothing was checked.\n`);
  process.exit(1);
}
const variations = readRegistry(fs.readFileSync(REGISTRY, 'utf8'));

// The parse is the risk. Refuse rather than report zeros.
if (variations.length < 200) {
  console.error(`\n  parsed only ${variations.length} variations from the registry, expected 200+.` +
                `\n  The file moved or the shape changed. Nothing was checked.\n`);
  process.exit(1);
}
const exam = variations.filter(v => v.tier === 'exam');
if (!exam.length) {
  console.error('\n  parsed no exam-tier variations. Nothing was checked.\n');
  process.exit(1);
}

// ── the website's subtopics, read as text ──────────────────────────────────
// Every quoted string inside a `"Topic": [ ... ]` array in n5TopicCategories.
function readSubtopics(text) {
  const body = text.slice(text.indexOf('n5TopicCategories'), text.indexOf('export const n5Topics'));
  const out = new Set();
  for (const m of body.matchAll(/"[^"]+":\s*\[([^\]]*)\]/gs)) {
    for (const s of m[1].matchAll(/"([^"]+)"/g)) out.add(s[1]);
  }
  return [...out];
}
const subtopics = readSubtopics(fs.readFileSync(TOPICS, 'utf8'));
if (subtopics.length !== 57) {
  // Not a failure by itself — the taxonomy may legitimately grow — but the
  // count is quoted all over the docs, so say when it moves.
  console.log(`  note: ${subtopics.length} subtopics declared, the docs say 57`);
}

// ── 1. every past paper question has a variation modelled on it ────────────
/**
 * **Match on the stem, exactly as the engine does.** A variation may cite
 * "2017 P2 Q15c" because it clones that part alone, while what a teacher clicks
 * is the whole question "2017 P2 Q15". `variationsBasedOn` in the registry
 * strips a trailing lowercase letter from both sides for this reason, and its
 * comment records that exact matching "returned nothing for those, silently".
 *
 * The first version of this check did exact matching and reported 2017 P2 Q15
 * as uncloned. The engine was right and the check was wrong. If this rule and
 * the engine's ever diverge, this check goes green while the feature breaks —
 * so it is written the same way round, deliberately.
 */
const stem = s => s.trim().replace(/([a-z])$/, '');

const depth = new Map();            // question stem -> how many exam variations
for (const v of exam) {
  // Count each variation once per question, not once per citation: one
  // variation citing both "Q15a" and "Q15b" is one thing to draw, not two.
  for (const s of new Set(v.basedOn.map(stem))) {
    depth.set(s, (depth.get(s) ?? 0) + 1);
  }
}

const dir = path.join(root, 'src', 'n5', 'pastpapers');
let questions = 0, unlabelled = 0;
const uncited = [];

for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
  const mod = await import(pathToFileURL(path.join(dir, f)).href);
  for (const v of Object.values(mod)) {
    if (!v?.papers) continue;
    for (const p of v.papers) {
      for (const q of p.questions) {
        questions++;
        const ref = paperRef(q.question);
        if (!ref || !N5_PAPER_LABEL.test(ref)) { unlabelled++; continue; }
        if (!depth.has(stem(ref))) uncited.push(ref);
      }
    }
  }
}

if (!questions) {
  console.error(`\n  no questions found in ${path.relative(root, dir)}. Nothing was checked.\n`);
  process.exit(1);
}

console.log(`\n  ${variations.length} variations parsed, ${exam.length} exam tier`);
console.log(`  ${questions} National 5 past paper questions\n`);

for (const ref of uncited) fail(`${ref} has no exam-tier variation modelled on it`);
if (unlabelled) fail(`${unlabelled} question${unlabelled === 1 ? '' : 's'} carry no readable ${N5_PAPER_LABEL} label`);
if (!uncited.length && !unlabelled) {
  console.log(`  ${questions} of ${questions} questions are cited by an exam-tier variation`);
}

// ── the pool depth, which is what "another like this one" is worth ─────────
const hist = new Map();
for (const ref of depth.keys()) {
  const n = depth.get(ref);
  hist.set(n, (hist.get(n) ?? 0) + 1);
}
const depths = [...hist.keys()].sort((a, b) => a - b);
console.log('\n  variations behind one question:');
for (const n of depths) {
  console.log(`    ${String(hist.get(n)).padStart(4)}  question${hist.get(n) === 1 ? ' has ' : 's have'} ${n}`);
}
console.log('\n  So "another like this one" usually means the same kind with new numbers.');
console.log('  How many different questions one variation can make is what `pool` measures.');

// ── 2. every subtopic has a variation ──────────────────────────────────────
const bySubtopic = new Map(subtopics.map(s => [s, 0]));
const orphanTags = new Set();
for (const v of exam) {
  for (const t of v.webTopics) {
    if (bySubtopic.has(t)) bySubtopic.set(t, bySubtopic.get(t) + 1);
    else orphanTags.add(t);
  }
}

const barren = subtopics.filter(s => bySubtopic.get(s) === 0);
console.log('');
for (const s of barren) fail(`subtopic "${s}" has no exam-tier variation — "More on ${s}" would draw nothing`);
for (const t of orphanTags) fail(`variation tag "${t}" is not one of the website's subtopics`);
if (!barren.length && !orphanTags.length) {
  console.log(`  ${subtopics.length} of ${subtopics.length} subtopics have an exam-tier variation`);
}

const counts = [...bySubtopic.values()].sort((a, b) => a - b);
const thin = subtopics.filter(s => bySubtopic.get(s) <= 2).length;
console.log(`  depth per subtopic: ${counts[0]} to ${counts[counts.length - 1]}, ` +
            `median ${counts[Math.floor(counts.length / 2)]}, ${thin} at 2 or fewer`);

if (failures) {
  console.log(`\n  ${failures} problem${failures === 1 ? '' : 's'}. ` +
              `The "more like this" headings promise something that is not there.\n`);
  process.exit(1);
}
console.log('\n  a paper label implies a variation, and a subtopic tag implies one too\n');
