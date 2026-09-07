// Does every question that needs a diagram actually have one — and is every
// diagram we hold actually used?
//
// This has bitten twice. The first time was N5 2026 P1 Q12, found by hand while
// building the paper: "the paper says 'on the axes below', so the blank axes
// are part of the question — found by comparing the images supplied against the
// images referenced" (commit 1e1bfe3).
//
// The second time nobody was building anything, so nobody compared, and five
// questions sat on the site referring to a diagram that was not there — three
// of them with the image already prepared and simply never linked. Reported as
// "diagrams sometimes fail to come over when printing", which is what a missing
// diagram looks like from the far end: it depends which questions are on the
// sheet, so it seems intermittent.
//
// Two rules, and they catch different things:
//
//   1. an image on disk that nothing references  — finds the case where the
//      picture was made and the <img> never landed. Silent otherwise: the file
//      just sits there.
//   2. a question whose words promise a picture and carries no <img> — finds
//      the case where the picture was never made at all, which rule 1 cannot
//      see.
//
// Both allow-lists carry a reason per entry, so an exception is a decision
// somebody made and can argue with, rather than a rule quietly loosened.
//
// Usage: node scripts/check-question-images.mjs
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(import.meta.dirname, '..');

const PAPER_DIRS = [
  'src/n5/pastpapers', 'src/higher/pastpapers', 'src/ah/pastpapers',
  'src/n5apps', 'src/higherapps',
];

/** Where past paper diagrams live. Not practice/, academy/ or logo/. */
const IMAGE_DIRS = [
  'N5_Past_Papers', 'Higher_Past_Papers', 'Adv_Higher_Maths_Past_Papers',
  'N5_Apps_Past_Papers', 'Higherapps_Past_Papers',
];

/**
 * Words that promise the reader a picture.
 *
 * Deliberately narrow. "shown below", "below shows" and "as shown" are NOT
 * here: they introduce a table or a list of numbers far more often than a
 * diagram, and every one of them on the site today is inline data. Adding them
 * would produce ten false alarms and train everyone to ignore this check.
 */
const PROMISES_A_PICTURE =
  /the diagram|in the diagram|diagram below|diagram shows|diagram opposite|on the diagram provided|the figure|figure below|axes provided|axes below|grid provided|grid below/i;

/** Images kept on purpose that no question references. */
const UNUSED_IS_FINE = new Map([
  ['/img/N5_Past_Papers/2016/2016_P2_Q2.png',
    'a photograph of sunflowers beside a pollen-mass calculation — decoration in the paper, and no maths depends on it'],
  ['/img/N5_Past_Papers/2023/2023_P1_Q10.png',
    'superseded by 2023_P1_Q10_1 and _2, which the question does reference'],
  ['/img/N5_Past_Papers/2022/2022_P1_Q14.png',
    'blank axes for a sketch; reviewed against the paper and deliberately not shown'],
]);

/** Questions that promise a picture and deliberately have none. */
const NO_PICTURE_IS_FINE = new Map([
  ['N5 2022 P1 Q14', 'sketch on blank axes — reviewed and left as text'],
  ['Higher 2018 P1 Q15', 'sketch on the answer booklet axes — reviewed and left as text'],
  ['Higher 2025 P1 Q13', 'sketch on the answer booklet axes — reviewed and left as text'],
  ['AH 2021 P1 Q7', 'sketch on the diagram provided — reviewed and left as text'],
]);

const COURSE_OF = {
  'src/n5/pastpapers': 'N5', 'src/higher/pastpapers': 'Higher',
  'src/ah/pastpapers': 'AH', 'src/n5apps': 'N5 Apps', 'src/higherapps': 'Higher Apps',
};

let failures = 0;
const fail = msg => { failures++; console.log(`  ${msg}`); };

// ── what the questions say ──────────────────────────────────────────────
const referenced = new Set();
const promisedWithNoImage = [];
let questions = 0, withImage = 0;

for (const d of PAPER_DIRS) {
  const dir = path.join(root, d);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
    let mod;
    try { mod = await import(pathToFileURL(path.join(dir, f)).href); } catch { continue; }
    for (const v of Object.values(mod)) {
      if (!v?.papers) continue;
      for (const p of v.papers) {
        for (const q of p.questions) {
          const html = `${q.question ?? ''}${q.answer ?? ''}`;
          questions++;
          for (const m of html.matchAll(/src="(\/img\/[^"]+)"/g)) referenced.add(m[1]);
          if (/<img/i.test(q.question ?? '')) { withImage++; continue; }
          if (!PROMISES_A_PICTURE.test(q.question ?? '')) continue;
          const label = (/nowrap;">([^<]+)</.exec(q.question ?? '') ?? [])[1]?.trim() ?? '?';
          promisedWithNoImage.push({
            key: `${COURSE_OF[d]} ${label}`,
            phrase: PROMISES_A_PICTURE.exec(q.question)[0],
          });
        }
      }
    }
  }
}

// ── what is on disk ─────────────────────────────────────────────────────
const onDisk = [];
for (const d of IMAGE_DIRS) {
  const dir = path.join(root, 'public/img', d);
  if (!fs.existsSync(dir)) continue;
  const walk = p => {
    for (const e of fs.readdirSync(p, { withFileTypes: true })) {
      const full = path.join(p, e.name);
      if (e.isDirectory()) walk(full);
      else onDisk.push('/img/' + path.relative(path.join(root, 'public/img'), full).split(path.sep).join('/'));
    }
  };
  walk(dir);
}

console.log(`${questions} questions, ${withImage} carrying a diagram`);
console.log(`${onDisk.length} past paper images on disk, ${referenced.size} referenced\n`);

// ── rule 1 ──────────────────────────────────────────────────────────────
const unused = onDisk.filter(f => !referenced.has(f));
const unexpectedlyUnused = unused.filter(f => !UNUSED_IS_FINE.has(f));
if (unexpectedlyUnused.length) {
  console.log('images on disk that no question references:');
  for (const f of unexpectedlyUnused) fail(f);
  console.log('');
}

// ── rule 2 ──────────────────────────────────────────────────────────────
const unexpectedlyBare = promisedWithNoImage.filter(q => !NO_PICTURE_IS_FINE.has(q.key));
if (unexpectedlyBare.length) {
  console.log('questions that promise a picture and have none:');
  for (const q of unexpectedlyBare) fail(`${q.key.padEnd(20)} "${q.phrase}"`);
  console.log('');
}

// ── the allow-lists, printed every run so they stay visible ─────────────
const staleUnused = [...UNUSED_IS_FINE.keys()].filter(f => referenced.has(f) || !onDisk.includes(f));
const staleBare = [...NO_PICTURE_IS_FINE.keys()]
  .filter(k => !promisedWithNoImage.some(q => q.key === k));
for (const f of staleUnused) fail(`allow-list is stale: ${f} is now referenced or gone — remove the entry`);
for (const k of staleBare) fail(`allow-list is stale: ${k} no longer needs an exception — remove the entry`);

console.log(`allowed: ${UNUSED_IS_FINE.size} unused images, ${NO_PICTURE_IS_FINE.size} questions without one`);

if (failures) {
  console.log(`\nquestion image check FAILED (${failures})`);
  process.exit(1);
}
console.log('\nevery diagram we hold is used, and every question that promises one has one');
