// Every question must survive a round trip through the shared-worksheet link.
//
// A shared sheet travels entirely in the URL: lib/worksheet-refs.mjs packs each
// question into three base36 characters — year, paper, index — and the reader's
// browser unpacks them again. Fixed width is what removes the separators, so
// the packing has to be total: a question that does not fit does not merely
// look wrong, it comes back as a DIFFERENT question or vanishes from the sheet.
//
// The ranges are comfortable today (years 2014-2026, papers 1-2, at most 20
// questions on a paper against a ceiling of 36) which is exactly why this needs
// a gate rather than a memory. The failure it guards against is silent: the
// first paper with 36+ questions, or a new non-numeric year like "Sample",
// would produce links that resolve to the wrong question rather than breaking.
//
// It also pins the legacy format. Links are printed on handouts and emailed to
// classes; a sheet shared last term must still open. decodeRefs sniffs on "-",
// and that sniff is easy to break by accident.
//
// Run: node scripts/check-share-refs.mjs
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { packRef, unpackRef, decodeRefs, TOKEN_LENGTH, SPECIAL_YEARS } from '../lib/worksheet-refs.mjs';

const root = path.resolve(import.meta.dirname, '..');
let failures = 0;
const fail = msg => { failures++; console.log(`  FAIL  ${msg}`); };

// ------------------------------------------------------- the legacy format
// These are the shapes already in circulation. They must keep resolving.
console.log('legacy links:');
{
  const cases = [
    ['2026-1-4', ['2026-1-4']],
    ['2026-1-4,2025-2-3', ['2026-1-4', '2025-2-3']],
    ['2026-1-4, 2025-2-3', ['2026-1-4', '2025-2-3']],   // stray spaces
    ['Specimen-1-2', ['Specimen-1-2']],
  ];
  for (const [input, expected] of cases) {
    const got = decodeRefs(input);
    if (JSON.stringify(got) !== JSON.stringify(expected)) {
      fail(`legacy "${input}" → ${JSON.stringify(got)}, expected ${JSON.stringify(expected)}`);
    }
  }
  if (!failures) console.log(`  ${cases.length} cases pass`);
}

// -------------------------------------------------------- the packed format
console.log('\npacked links:');
{
  const cases = [
    ['c14', '2026-1-4'],
    ['000', '2014-0-0'],
    ['z12', 'Specimen-1-2'],
  ];
  for (const [token, expected] of cases) {
    const got = unpackRef(token);
    if (got !== expected) fail(`"${token}" → ${JSON.stringify(got)}, expected ${JSON.stringify(expected)}`);
  }
  // a packed string is read in threes with no separator
  const multi = decodeRefs('c14b23');
  if (JSON.stringify(multi) !== JSON.stringify(['2026-1-4', '2025-2-3'])) {
    fail(`packed pair → ${JSON.stringify(multi)}`);
  }
  // out of range must refuse rather than wrap around to another question
  const bad = [
    { year: 2013, paperNumber: 1, questionIndex: 0 },   // before the epoch
    { year: 2050, paperNumber: 1, questionIndex: 0 },   // past the reserved codes
    { year: 2026, paperNumber: 1, questionIndex: 36 },  // index off the end
    { year: 'Sample', paperNumber: 1, questionIndex: 0 },  // unlisted special year
  ];
  for (const q of bad) {
    if (packRef(q) !== null) fail(`${JSON.stringify(q)} should not pack, but did`);
  }
  if (!failures) console.log(`  ${cases.length + 1 + bad.length} cases pass`);
}

// ---------------------------------------------------------------- the data
const dirs = ['src/n5/pastpapers', 'src/higher/pastpapers', 'src/ah/pastpapers', 'src/n5apps', 'src/higherapps'];
let total = 0;
const years = new Set();
let longest = 0, longestWhere = '';

for (const d of dirs) {
  const dir = path.join(root, d);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
    let mod;
    try { mod = await import(pathToFileURL(path.join(dir, f)).href); } catch { continue; }
    for (const v of Object.values(mod)) {
      if (!v?.papers) continue;
      for (const p of v.papers) {
        years.add(String(v.year));
        if (p.questions.length > longest) {
          longest = p.questions.length;
          longestWhere = `${v.year} P${p.paperNumber}`;
        }
        p.questions.forEach((_, i) => {
          total++;
          const q = { year: v.year, paperNumber: p.paperNumber, questionIndex: i };
          const ref = `${v.year}-${p.paperNumber}-${i}`;
          const token = packRef(q);
          if (token === null) {
            fail(`${ref} cannot be packed — out of range for the three-character format`);
            return;
          }
          if (token.length !== TOKEN_LENGTH) {
            fail(`${ref} packed to "${token}", which is ${token.length} characters not ${TOKEN_LENGTH}`);
            return;
          }
          // the round trip is the point: a token that unpacks to a different
          // question silently hands the reader the wrong worksheet
          const back = unpackRef(token);
          if (back !== ref) fail(`${ref} → "${token}" → ${JSON.stringify(back)}`);
        });
      }
    }
  }
}

// Two questions packing to the same token would merge them in a shared sheet.
{
  const seen = new Map();
  for (const d of dirs) {
    const dir = path.join(root, d);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
      let mod;
      try { mod = await import(pathToFileURL(path.join(dir, f)).href); } catch { continue; }
      for (const v of Object.values(mod)) {
        if (!v?.papers) continue;
        for (const p of v.papers) {
          p.questions.forEach((_, i) => {
            const token = packRef({ year: v.year, paperNumber: p.paperNumber, questionIndex: i });
            if (!token) return;
            const ref = `${v.year}-${p.paperNumber}-${i}`;
            // the same paper appears in more than one course file; only a
            // genuine clash between different references matters
            const prev = seen.get(token);
            if (prev && prev !== ref) fail(`token "${token}" is used by both ${prev} and ${ref}`);
            seen.set(token, ref);
          });
        }
      }
    }
  }
}

const unlisted = [...years].filter(y => !/^\d{4}$/.test(y) && !(y in SPECIAL_YEARS));
for (const y of unlisted) {
  fail(`year "${y}" is neither a number nor listed in SPECIAL_YEARS in lib/worksheet-refs.mjs`);
}

console.log(`\nquestions round-tripped: ${total}`);
console.log(`years in use: ${[...years].sort().join(', ')}`);
console.log(`most questions on a paper: ${longest} (${longestWhere}) — the format holds 36`);

if (failures) {
  console.log(`\nshare reference check FAILED (${failures})`);
  process.exit(1);
}
console.log('\nevery question survives a shared link, and old links still parse');
