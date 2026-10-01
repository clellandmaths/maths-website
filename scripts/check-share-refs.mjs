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
// And the short format of 2026-10-01 ("the short format" below): 300 links
// recorded before it, and 200 short links recorded when it was made, must read
// exactly as they did, every paper question and variation must pack, and no
// link may spell anything on LINK_WORDS. scripts/verify-share-fixtures.mts
// re-makes the questions behind the recorded links; check-short-links.mjs
// opens them on the built site.
//
// Run: node scripts/check-share-refs.mjs
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  packRef, unpackRef, decodeRefs, TOKEN_LENGTH, SPECIAL_YEARS,
  packGenerated, unpackGenerated, generatedRef, parseGeneratedRef,
  GENERATED_MARK, GENERATED_TOKEN_LENGTH, CODE_LENGTH, SEED_LENGTH,
  encodeShortRefs, spellsInLink, SHORT_MARK, SHORT_SEED_LENGTH, LINK_ALPHABET,
} from '../lib/worksheet-refs.mjs';
import { LINK_ID_CODES } from '../lib/link-ids.mjs';

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

// ------------------------------------------------- generated questions
// A generated question travels as a marker, a variation code and a seed, in
// the SAME ordered stream as the paper ones. The order of a sheet is part of
// the sheet, so a second parameter would have lost it.
console.log('\ngenerated questions:');
{
  const code = 'xqt6z';
  const seed = '3f9a1b';
  const parent = 2;
  const token = packGenerated(code, seed, parent);

  if (token !== GENERATED_MARK + code + seed + parent.toString(36)) {
    fail(`packGenerated gave "${token}"`);
  }
  if (token && token.length !== GENERATED_TOKEN_LENGTH) {
    fail(`a generated token is ${token.length} characters, not ${GENERATED_TOKEN_LENGTH}`);
  }
  if (unpackGenerated(token) !== generatedRef(code, seed, parent)) {
    fail(`a generated token does not round-trip: ${unpackGenerated(token)}`);
  }

  // The marker must be outside base36, or it could begin a paper token, and it
  // must survive URLSearchParams untouched or every link grows by two
  // characters a question and stops being readable by eye.
  if (/[0-9a-z]/.test(GENERATED_MARK)) {
    fail(`the generated marker "${GENERATED_MARK}" is a base36 character`);
  }
  const encoded = new URLSearchParams({ q: token }).toString();
  if (encoded !== `q=${token}`) {
    fail(`a generated token is percent-encoded in a link: ${encoded}`);
  }

  // Mixed streams, in both orders, and the paper half unchanged either way.
  const paper = packRef({ year: 2026, paperNumber: 1, questionIndex: 6 });
  const cases = [
    [paper + token, ['2026-1-6', generatedRef(code, seed, parent)]],
    [token + paper, [generatedRef(code, seed, parent), '2026-1-6']],
    [paper + token + paper,
      ['2026-1-6', generatedRef(code, seed, parent), '2026-1-6']],
  ];
  for (const [input, expected] of cases) {
    const got = decodeRefs(input);
    if (JSON.stringify(got) !== JSON.stringify(expected)) {
      fail(`mixed stream "${input}" gave ${JSON.stringify(got)}`);
    }
  }

  // A malformed generated token must be skipped WHOLE. Resyncing one character
  // at a time would read its tail as paper tokens and put questions on the
  // sheet that nobody picked — worse than losing one.
  const broken = GENERATED_MARK + 'XXXXXXXXXXXX';
  if (JSON.stringify(decodeRefs(broken + paper)) !== JSON.stringify(['2026-1-6'])) {
    fail('a malformed generated token was not skipped whole');
  }

  // And a sheet of only paper questions packs to exactly what it always did.
  // Links are printed on handouts; they do not get to expire.
  if (decodeRefs('c16a23').join() !== '2026-1-6,2024-2-3') {
    fail('paper-only links no longer decode as they did');
  }

  const parsed = parseGeneratedRef(generatedRef(code, seed, parent));
  if (parsed?.code !== code || parsed?.parentIndex !== parent) {
    fail(`parseGeneratedRef does not invert generatedRef: ${JSON.stringify(parsed)}`);
  }
  console.log(`  ok  ${token} round-trips, mixed streams keep their order`);
}

// ------------------------------------------- the two spellings must agree
// `generatedRef` is defined here and `generatedUid` in the engine, and they
// must produce the same string: the basket dedupes on one and the link carries
// the other. The duplication is forced — this file is .mjs because build
// scripts import it, and a build script that imports a .ts file kills the
// Cloudflare build — so it is pinned instead.
console.log('\nthe identity is spelled the same on both sides:');
{
  const engine = fs.readFileSync(
    path.join(root, 'lib/generator/worksheet-question.ts'), 'utf8');

  const wanted =
    'return `${GENERATED_UID_PREFIX}:${code}:${seed}:${parentIndex.toString(36)}`;';
  if (!engine.includes(wanted)) {
    fail('the engine no longer builds a uid as `${GENERATED_UID_PREFIX}:${code}:${seed}` '
      + '— generatedRef in lib/worksheet-refs.mjs must be changed to match');
  }
  if (!/GENERATED_UID_PREFIX = 'g'/.test(engine)) {
    fail("the engine's GENERATED_UID_PREFIX is no longer 'g'");
  }
  if (generatedRef('abcde', 'fghij1', 3) !== 'g:abcde:fghij1:3') {
    fail(`generatedRef gives ${generatedRef('abcde', 'fghij1', 3)}`);
  }

  // The code and seed widths are the link's business, and the engine's codes
  // have to fit them.
  const codes = fs.readFileSync(
    path.join(root, 'lib/generator/generators/variation-codes.ts'), 'utf8');
  const literals = [...codes.matchAll(/'([0-9a-z]{2,12})',/g)].map(m => m[1]);
  const wrong = literals.filter(c => c.length !== CODE_LENGTH);
  if (!literals.length) {
    fail('no variation codes found in the engine — has the table moved?');
  } else if (wrong.length) {
    fail(`${wrong.length} variation codes are not ${CODE_LENGTH} characters: ${wrong.slice(0, 5)}`);
  } else {
    console.log(`  ok  ${literals.length} variation codes, all ${CODE_LENGTH} characters, seed ${SEED_LENGTH}`);
  }
}

// ------------------------------------------------ the short format (2026-10-01)
// The owner, 2026-10-01: shorter links, none that spells a word or a number
// read as one, every link already shared still opening the same sheet, and
// "Another like this one" and the way back to the original unchanged.
console.log('\nthe short format:');
{
  const before = failures;
  // 1. Every link recorded before the change still reads the same. (The
  //    questions behind them: npx tsx scripts/verify-share-fixtures.mts.)
  const recorded = JSON.parse(fs.readFileSync(path.join(root, 'scripts/fixtures/share-links-2026-10-01.json'), 'utf8')).sheets;
  let oldBad = 0;
  for (const s of recorded) {
    if (JSON.stringify(decodeRefs(s.q)) !== JSON.stringify(s.refs)) { oldBad++; if (oldBad <= 3) fail(`a recorded ${s.format} link no longer reads the same: ${s.q.slice(0, 40)}…`); }
  }
  if (!oldBad) console.log(`  ok  ${recorded.length} links recorded before the change read exactly as they did`);

  // 2. Short links recorded when the format was made: pinned, so a later change
  //    to the alphabet, the paper slots or a link id cannot move them either.
  const shortFile = path.join(root, 'scripts/fixtures/share-links-short-2026-10-01.json');
  if (!fs.existsSync(shortFile)) fail('scripts/fixtures/share-links-short-2026-10-01.json is missing');
  else {
    const pinned = JSON.parse(fs.readFileSync(shortFile, 'utf8')).sheets;
    let pinBad = 0;
    for (const s of pinned) {
      if (JSON.stringify(decodeRefs(s.q)) !== JSON.stringify(s.refs)) { pinBad++; if (pinBad <= 3) fail(`a pinned short link no longer reads the same: ${s.q.slice(0, 40)}…`); }
    }
    if (!pinBad) console.log(`  ok  ${pinned.length} short links pinned in 2026-10-01 read exactly as they did`);
  }

  // 3. Every paper question on the site packs short and comes back.
  const allPaper = [];
  for (const d of dirs) {
    const dir = path.join(root, d);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
      let mod;
      try { mod = await import(pathToFileURL(path.join(dir, f)).href); } catch { continue; }
      for (const v of Object.values(mod)) {
        if (!v?.papers) continue;
        for (const p of v.papers) p.questions.forEach((_, i) => allPaper.push(`${v.year}-${p.paperNumber}-${i}`));
      }
    }
  }
  const shortSeen = new Map();
  for (const ref of allPaper) {
    const q = encodeShortRefs([ref]);
    if (!q) { fail(`${ref} does not pack in the short format`); continue; }
    const back = decodeRefs(q);
    if (back.length !== 1 || back[0] !== ref) fail(`${ref} → "${q}" → ${JSON.stringify(back)}`);
    const token = q.slice(1).split(SHORT_MARK).join('');
    const prev = shortSeen.get(token);
    if (prev && prev !== ref) fail(`short token "${token}" is used by both ${prev} and ${ref}`);
    shortSeen.set(token, ref);
  }
  console.log(`  ok  ${new Set(allPaper).size} paper questions pack short and come back`);

  // 4. Every variation code has a link id, append only, none that spells.
  const codesSrc = fs.readFileSync(path.join(root, 'lib/generator/generators/variation-codes.ts'), 'utf8');
  // The table itself, not the comment above it, which names both.
  const table = codesSrc.slice(codesSrc.indexOf('export const VARIATION_CODES'), codesSrc.indexOf('export const CODE_EXCEPTIONS'));
  const engineCodes = [...table.matchAll(/:\s*'([0-9a-z]{5})',/g)].map(m => m[1]);
  const idOf = new Map();
  LINK_ID_CODES.forEach((c, i) => {
    if (!c) return;
    if (idOf.has(c)) fail(`lib/link-ids.mjs lists ${c} twice`);
    idOf.set(c, i);
  });
  for (const c of engineCodes) {
    if (!idOf.has(c)) fail(`variation code ${c} has no link id: append '${c}', to LINK_ID_CODES in lib/link-ids.mjs (an empty '' first for any position whose characters spell, as the file says)`);
  }
  LINK_ID_CODES.forEach((c, i) => {
    const chars = [Math.floor(i / 625), Math.floor(i / 25) % 25, i % 25].map(k => LINK_ALPHABET[k]).join('');
    if (c && spellsInLink(chars)) fail(`link id ${i} ("${chars}") spells something, but carries ${c}: it should have been skipped`);
  });
  if (!engineCodes.length) fail('no variation codes found in the engine — has the table moved?');
  else console.log(`  ok  ${engineCodes.length} variation codes, each with a link id`);

  // 5. Mixed sheets, thousands of them, from a fixed stream: paper questions,
  //    new short seeds, and old six-character seeds kept from a re-shared
  //    sheet (some of which spell words). Each must come back exactly, carry
  //    no listed word, and a sheet of new questions must be shorter than today.
  let state = 7;
  const rand = () => { state = (state * 1103515245 + 12345) % 2147483648; return state / 2147483648; };
  const pick = xs => xs[Math.floor(rand() * xs.length)];
  const B36 = '0123456789abcdefghijklmnopqrstuvwxyz';
  const usable = engineCodes.filter(c => idOf.has(c));
  const shortSeed = () => { for (;;) { const s = Array.from({ length: SHORT_SEED_LENGTH }, () => pick(LINK_ALPHABET)).join(''); if (!spellsInLink(s)) return s; } };
  const oldSeed = () => (rand() < 0.1 ? pick(['sexabc', 'fuck00', 'a69b88', 'xxx123', 'nazi12']) : Array.from({ length: SEED_LENGTH }, () => pick(B36)).join(''));
  let sheets = 0, worded = 0, longer = 0, savedNew = 0, savedOld = 0;
  for (let n = 0; n < 4000; n++) {
    const kind = n % 4; // 0 paper, 1 new generated, 2 mixed, 3 mixed with kept old seeds
    const refs = Array.from({ length: 1 + Math.floor(rand() * 25) }, () => {
      const r = rand();
      if (kind === 0 || (kind >= 2 && r < 0.4)) return pick(allPaper);
      const seed = kind === 3 && r > 0.7 ? oldSeed() : shortSeed();
      return generatedRef(pick(usable), seed, Math.floor(rand() * 3));
    });
    const q = encodeShortRefs(refs);
    sheets++;
    if (!q) { fail(`a sheet did not pack short: ${refs.slice(0, 3)}`); continue; }
    const back = decodeRefs(q);
    if (JSON.stringify(back) !== JSON.stringify(refs)) { fail(`a short sheet did not come back: ${q.slice(0, 50)}…`); continue; }
    if (spellsInLink(q)) { worded++; if (worded <= 3) fail(`a short link spells something: ${q}`); }
    if (new URLSearchParams({ q }).toString() !== `q=${q}`) fail(`a short link is percent-encoded: ${q.slice(0, 30)}`);
    // Vowels only ever inside a kept old token ("__" and twelve base36).
    const outsideKept = q.replace(/_\.?_(?:[0-9a-z]\.?){12}/g, '');
    if (/[aeiou013451]/.test(outsideKept.replace(/^\./, ''))) fail(`a short link has a vowel or a vowel-like digit outside a kept old question: ${q.slice(0, 60)}`);
    if (kind !== 3) {
      const old = refs.map(r => { const g = parseGeneratedRef(r); if (g) return packGenerated(g.code, g.seed.padEnd(6, '0'), g.parentIndex); const m = /^(.+)-(\d+)-(\d+)$/.exec(r); return packRef({ year: m[1], paperNumber: Number(m[2]), questionIndex: Number(m[3]) }); }).join('');
      if (kind === 1) { savedNew += old.length; savedOld += q.length; }
      if (kind === 1 && q.length >= old.length) { longer++; if (longer <= 3) fail(`a sheet of new questions is not shorter than today: ${q.length} against ${old.length}`); }
    }
  }
  if (failures === before) console.log(`  ok  ${sheets} mixed sheets come back exactly, none spells anything; new generated questions take ${savedOld} characters where today's links take ${savedNew}`);

  // 6. Re-sharing: every recorded old link, read and written again short, comes
  //    back with the same questions.
  let reBad = 0;
  for (const s of recorded) {
    const q = encodeShortRefs(s.refs);
    if (!q || JSON.stringify(decodeRefs(q)) !== JSON.stringify(s.refs) || spellsInLink(q)) { reBad++; if (reBad <= 3) fail(`a recorded link re-shared short does not come back clean: ${s.q.slice(0, 40)}…`); }
  }
  if (!reBad) console.log(`  ok  all ${recorded.length} recorded links, re-shared, come back with the same questions and no word`);
}

// --------------------------------------- a sheet is resolved one at a time
// The generator's random stream is module-level, so two overlapping `withSeed`
// calls draw from each other. This was measured, not assumed: resolving a
// ten-question sheet with `Promise.all` changed ALL TEN questions, and two
// concurrent runs did not match each other either. Every pupil would get a
// different sheet, and a different one each time they opened the link.
//
// A source scan, because there is no output to inspect — the wrong sheet is a
// perfectly good sheet.
console.log('\nresolveWorksheet resolves sequentially:');
{
  const src = fs.readFileSync(path.join(root, 'lib/worksheet-share.ts'), 'utf8');
  const body = src.slice(src.indexOf('export async function resolveWorksheet'));
  const code = body.split('\n').filter(l => {
    const t = l.trim();
    return !t.startsWith('*') && !t.startsWith('//') && !t.startsWith('/*');
  }).join('\n');

  for (const banned of ['Promise.all', 'Promise.allSettled', 'Promise.race']) {
    if (code.includes(banned)) {
      fail(`resolveWorksheet uses ${banned}. The generator's stream is module-level: `
        + 'overlapping withSeed calls draw from each other and the sheet stops '
        + 'reproducing. Use a sequential for ... await.');
    }
  }
  if (!/for \(const ref of refs\)/.test(code)) {
    fail('resolveWorksheet no longer walks its refs in a plain for ... of loop');
  }
  console.log('  ok  no concurrent resolution');
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
