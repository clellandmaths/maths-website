/**
 * How a question is written into a shared worksheet link.
 *
 * A reference used to be spelled out — "2026-1-4" — and joined with commas.
 * That is eight characters carrying about ten bits, and URLSearchParams
 * percent-encodes the comma, so every separator cost "%2C" rather than ",".
 * A twenty-question sheet came to 318 characters, 38 of them separators.
 *
 * Now each question is three base36 characters: year, paper, index. Fixed
 * width is the point — it means no separator at all. The same sheet is 107
 * characters, and "c16" still reads as year c (2026), paper 1, question 6, so
 * a link that misbehaves can be diagnosed by eye.
 *
 * Short links of the tinyurl kind are not possible here without storing the
 * sheet somewhere: twenty questions is ~200 bits and five base36 characters is
 * 25, so a short link has to be a lookup key. That would mean the worksheet
 * leaving the reader's device and links that die if the store does. These
 * links cannot expire, which is worth more than the extra length.
 *
 * .mjs, not .ts, on purpose: scripts/check-share-refs.mjs imports this, and a
 * build script that imports a .ts file kills the Cloudflare build — it runs
 * Node 22.16, which cannot strip types unflagged. See the note at the top of
 * scripts/check-paper-registry.mjs, which enforces that rule.
 */

/** Year 2014 is code 0. A FIXED origin, deliberately — see packRef. */
export const YEAR_EPOCH = 2014;

/**
 * Years that are not numbers. Higher Apps has a Specimen paper, and
 * examBoardFor in lib/exam-board.ts already treats non-numeric years as real.
 *
 * These take codes from the top of the base36 range so they can never collide
 * with a year counting up from the epoch. Anything not listed here fails the
 * build gate rather than silently encoding as NaN.
 */
export const SPECIAL_YEARS = { Specimen: 'z' };

const SPECIAL_BY_CODE = Object.fromEntries(
  Object.entries(SPECIAL_YEARS).map(([year, code]) => [code, year])
);

/** Highest offset a numeric year may take, leaving the top codes reserved. */
const MAX_YEAR_OFFSET = 34;

export const TOKEN_LENGTH = 3;

/**
 * Three characters for one question, or null if it will not fit.
 *
 * The year code counts from a fixed epoch rather than indexing into the years
 * the site happens to hold. That matters: indexing into the data would mean
 * adding a 2027 paper shifted every later code by one and silently repointed
 * every link already shared. An epoch cannot shift.
 *
 * Returns null rather than throwing so the build gate can report every
 * offender at once instead of stopping at the first.
 */
export function packRef({ year, paperNumber, questionIndex }) {
  const raw = String(year);
  let yearCode = SPECIAL_YEARS[raw];
  if (!yearCode) {
    const n = Number(raw);
    if (!Number.isInteger(n)) return null;
    const offset = n - YEAR_EPOCH;
    if (offset < 0 || offset > MAX_YEAR_OFFSET) return null;
    yearCode = offset.toString(36);
  }
  if (!Number.isInteger(paperNumber) || paperNumber < 0 || paperNumber > 35) return null;
  if (!Number.isInteger(questionIndex) || questionIndex < 0 || questionIndex > 35) return null;
  return yearCode + paperNumber.toString(36) + questionIndex.toString(36);
}

/** Three characters back to a spelled-out "2026-1-4" reference, or null. */
export function unpackRef(token) {
  if (typeof token !== 'string' || token.length !== TOKEN_LENGTH) return null;
  const [y, p, i] = token;
  const special = SPECIAL_BY_CODE[y];
  let year;
  if (special) {
    year = special;
  } else {
    const offset = parseInt(y, 36);
    if (!Number.isInteger(offset)) return null;
    year = String(YEAR_EPOCH + offset);
  }
  const paper = parseInt(p, 36);
  const index = parseInt(i, 36);
  if (!Number.isInteger(paper) || !Number.isInteger(index)) return null;
  return `${year}-${paper}-${index}`;
}

/**
 * A generated question in a link: a marker, a variation code, and a seed.
 *
 * Generated questions go in the same ordered stream as paper ones, because the
 * order of a sheet is part of the sheet. A second parameter would have lost it.
 *
 * So the stream carries two token shapes and stays self-delimiting:
 *
 *     c16             a paper question - three base36, exactly as before
 *     _xqt6z3f9a1b0   a generated one - mark, 5-char code, 6-char seed, and
 *                     one character saying which of the variation's past paper
 *                     questions its video is of
 *
 * The mark is `_` and the choice is not arbitrary. It has to be outside base36,
 * or it could be the first character of a paper token; `URLSearchParams` has to
 * leave it alone, which rules out `~` (it becomes `%7E`); and it must not be
 * `-`, which `decodeRefs` sniffs on to recognise the legacy spelled-out format.
 * `_`, `.` and `*` all survive; `_` reads most clearly in a link.
 *
 * **Existing links are untouched.** A sheet of paper questions packs to exactly
 * the same string it did before, character for character. Links are printed on
 * handouts and emailed to classes, and they do not get to expire.
 *
 * The seed is six base36 characters, about 2^31. That is matched to the
 * generator's `mulberry32`, whose state is 32 bits: a longer seed would be
 * entropy the stream cannot use.
 *
 * Since 2026-10-01 new seeds are four characters of the short format's
 * alphabet (below), 390,625 for each question: no card makes more than a few
 * thousand different questions, and a sheet refuses a repeat by its content
 * (worksheetKeys), so two seeds making one question cannot both land on it.
 * This six-character form is how links made before then carry theirs.
 */
export const GENERATED_MARK = '_';
export const CODE_LENGTH = 5;
export const SEED_LENGTH = 6;
/**
 * Which past paper question the video is of, as an index into the variation's
 * own list, most recent first.
 *
 * One character, because the most any variation cites is nine and base36 holds
 * thirty-six. It is here rather than derived because a pupil's browser has only
 * the link: a teacher clicking "Variation" on a 2014 question was looking at
 * the 2014 question, and without this the sheet they share would send their
 * class to a different paper's video - 138 of 335 question/variation pairs.
 */
export const PARENT_LENGTH = 1;
export const GENERATED_TOKEN_LENGTH = 1 + CODE_LENGTH + SEED_LENGTH + PARENT_LENGTH;

const BASE36 = /^[0-9a-z]+$/;

/**
 * The spelled-out form of a generated reference.
 *
 * This is the same string the engine's `generatedUid()` puts on a question, and
 * it is deliberately the same: the basket dedupes on it, the link carries it,
 * and one identity is easier to reason about than two that must agree.
 *
 * It is defined twice, here and in `lib/generator/worksheet-question.ts`, and
 * that is forced rather than chosen - this file is `.mjs` because build scripts
 * import it, and a build script that imports a `.ts` file kills the Cloudflare
 * build. `check-share-refs.mjs` pins the two together so the duplication cannot
 * drift silently.
 */
export function generatedRef(code, seed, parentIndex = 0) {
  return `g:${code}:${seed}:${parentIndex.toString(36)}`;
}

/** "g:xqt6z:3f9a1b:0" split back into its parts, or null if it is not one. */
export function parseGeneratedRef(ref) {
  if (typeof ref !== 'string') return null;
  const parts = ref.split(':');
  if (parts.length !== 4 || parts[0] !== 'g') return null;
  const [, code, seed, parent] = parts;
  if (!BASE36.test(code) || !BASE36.test(seed) || !BASE36.test(parent)) return null;
  return { code, seed, parentIndex: parseInt(parent, 36) };
}

/** Twelve characters for one generated question, or null if it will not fit. */
export function packGenerated(code, seed, parentIndex = 0) {
  if (typeof code !== 'string' || code.length !== CODE_LENGTH || !BASE36.test(code)) return null;
  if (typeof seed !== 'string' || seed.length !== SEED_LENGTH || !BASE36.test(seed)) return null;
  if (!Number.isInteger(parentIndex) || parentIndex < 0 || parentIndex > 35) return null;
  return GENERATED_MARK + code + seed + parentIndex.toString(36);
}

/** Twelve characters back to a spelled-out "g:code:seed" reference, or null. */
export function unpackGenerated(token) {
  if (typeof token !== 'string' || token.length !== GENERATED_TOKEN_LENGTH) return null;
  if (token[0] !== GENERATED_MARK) return null;
  const code = token.slice(1, 1 + CODE_LENGTH);
  const seed = token.slice(1 + CODE_LENGTH, 1 + CODE_LENGTH + SEED_LENGTH);
  const parent = token.slice(1 + CODE_LENGTH + SEED_LENGTH);
  if (!BASE36.test(code) || !BASE36.test(seed) || !BASE36.test(parent)) return null;
  return generatedRef(code, seed, parseInt(parent, 36));
}

// ── the short format (2026-10-01) ─────────────────────────────────────────
//
// The owner, 2026-10-01: shorter links, none that spells a word or a number
// read as one, and every link already shared still opening the same sheet.
//
// A short link's q= starts with "." and is written in LINK_ALPHABET: no vowel,
// and none of 0, 1, 3, 4, 5, which read as o, i, e, a, s. Without vowels almost
// nothing can be spelled; what still can (xxx, fck, 69, 88…) is in LINK_WORDS,
// and the encoder breaks any such run with a ".", which the decoder ignores.
//
//     .c9f            a paper question: year, paper and index as one number,
//                     three characters
//     _k2bq7w9        a generated one: "_", the variation's position in
//                     lib/link-ids.mjs (three), a four-character seed, and
//                     which past paper question its video is of (one)
//     __xqt6z3f9a1b0  a generated question made before this format, with its
//                     old six-character seed: kept exactly, so re-sharing an
//                     old sheet keeps its questions
//
// Every older link still reads as it always did: they never start with ".".
// The question's identity inside the site ("g:code:seed:parent") is unchanged;
// only how a link writes it is new.

import { LINK_ID_CODES } from './link-ids.mjs';

export const LINK_ALPHABET = '26789bcdfghjklmnpqrstvwxz';
export const SHORT_MARK = '.';

// ── which question-maker a link was made with (2026-10-09) ────────────────
//
// A link carries each generated question's code and seed, never the question,
// so it opens exactly what was shared only while the question-maker behind it
// is the same. When the maker changes what a seed makes (the owner's "never the
// paper's own question", 2026-10-09: 18 cards widened and a guard), new links
// are marked with the new version, and the maker each old version was made with
// is kept, frozen, to open its links (`lib/link-engines.ts`, docs/link-versions.md).
//
// Version 1 is every link made before marks existed: no mark, in any format.
// A later version is one character straight after the leading ".". It must be
// outside LINK_ALPHABET and "_" (so it can't be read as part of a question),
// not a vowel or 0 1 3 4 5 (no words), and one URLSearchParams leaves alone;
// check-share-refs holds every mark here to all of that.

/** The version new links are made with. Raise it only with a frozen copy of the maker it replaces. */
export const LINK_VERSION = 3;
/**
 * The character that marks each version after the first. Append only. Version 3
 * (2026-10-10, Advanced Higher's "never the paper's own question") is "-": every
 * lower-case consonant outside LINK_ALPHABET is used ("y"), and "-" is left alone
 * by URLSearchParams and used nowhere else in a link.
 */
export const VERSION_MARKS = { 2: 'y', 3: '-' };
const VERSION_OF_MARK = new Map(Object.entries(VERSION_MARKS).map(([v, m]) => [m, Number(v)]));

/**
 * The version a q= value was made with, from its mark: 1 when it has none.
 * A link in an older format (never written now) carries `v=` instead; that is
 * read by `decodeWorksheet`, not here.
 */
export function linkVersion(q) {
  if (typeof q !== 'string' || !q.startsWith(SHORT_MARK)) return 1;
  return VERSION_OF_MARK.get(q[1]) ?? 1;
}
export const SHORT_PAPER_LENGTH = 3;
export const SHORT_ID_LENGTH = 3;
/** 25^4 = 390,625 versions of each question, against at most a few thousand any card makes. */
export const SHORT_SEED_LENGTH = 4;
export const SHORT_GENERATED_LENGTH = 1 + SHORT_ID_LENGTH + SHORT_SEED_LENGTH + PARENT_LENGTH;
export const KEPT_GENERATED_LENGTH = 2 + CODE_LENGTH + SEED_LENGTH + PARENT_LENGTH;

/**
 * Strings no link may contain, letters or digits read as letters. Short links
 * can only form the consonant and number ones; the rest are here for the old
 * six-character seeds a re-shared sheet keeps.
 */
export const LINK_WORDS = [
  // consonants and numbers, all the link alphabet can make
  'xxx', 'kkk', 'fck', 'fk', 'fkn', 'fkd', 'cnt', 'wtf', 'sht', 'dck', 'ngr', 'ngg', 'kys', 'fml',
  'sx', 'bj', 'prn', 'wnk', 'twt', 'jzz', 'cmm', 'nzi', 'ss', 'hh', '69', '88', '666',
  // with vowels, for kept old seeds
  'sex', 'fuk', 'fuc', 'shit', 'cunt', 'dick', 'cock', 'piss', 'tit', 'twat', 'wank', 'arse', 'ass',
  'fag', 'nob', 'slag', 'slut', 'whor', 'crap', 'bum', 'poo', 'porn', 'cum', 'jiz', 'rape', 'nazi',
  'dyke', 'homo', 'paki', 'nig', 'spaz', 'bitch', 'boob', 'anus', 'anal', 'pube', 'turd', 'hoe',
  'die', 'kill', 'gay', 'fat', 'ugly', 'pee', 'wee', 'bra', 'nud', 'sux', 'suck', 'lick', 'butt',
  'dung', 'fart', 'stfu', 'gtfo',
];
/** Digits as the letters they pass for. Same length, so positions line up. */
const asLetters = s => s.replace(/[0-9]/g, d => 'oizeasgtbg'[Number(d)]);

/** Whether a string holds a listed word, as written or with its digits read as letters. */
export function spellsInLink(s) {
  const read = asLetters(s);
  return LINK_WORDS.some(w => s.includes(w) || read.includes(w));
}

const R = LINK_ALPHABET.length;
const toAlphabet = (n, width) => {
  let s = '';
  for (let i = 0; i < width; i++) { s = LINK_ALPHABET[n % R] + s; n = Math.floor(n / R); }
  return n === 0 ? s : null;
};
const fromAlphabet = s => {
  let n = 0;
  for (const c of s) {
    const d = LINK_ALPHABET.indexOf(c);
    if (d < 0) return null;
    n = n * R + d;
  }
  return n;
};

/** Paper slots: 36 years (the 35th is Specimen, as in packRef), 4 papers, 108 questions. */
const SLOT_PAPERS = 4, SLOT_QUESTIONS = 108;

/** A paper question in three link-alphabet characters, or null if it will not fit. */
export function packShortRef({ year, paperNumber, questionIndex }) {
  const old = packRef({ year, paperNumber, questionIndex: 0 });
  if (old === null) return null;
  const slot = parseInt(old[0], 36);
  if (!Number.isInteger(paperNumber) || paperNumber < 0 || paperNumber >= SLOT_PAPERS) return null;
  if (!Number.isInteger(questionIndex) || questionIndex < 0 || questionIndex >= SLOT_QUESTIONS) return null;
  return toAlphabet((slot * SLOT_PAPERS + paperNumber) * SLOT_QUESTIONS + questionIndex, SHORT_PAPER_LENGTH);
}

/** Three link-alphabet characters back to "2026-1-4", or null. */
export function unpackShortRef(token) {
  if (typeof token !== 'string' || token.length !== SHORT_PAPER_LENGTH) return null;
  const n = fromAlphabet(token);
  if (n === null) return null;
  const index = n % SLOT_QUESTIONS, paper = Math.floor(n / SLOT_QUESTIONS) % SLOT_PAPERS;
  const slot = Math.floor(n / (SLOT_QUESTIONS * SLOT_PAPERS));
  if (slot > 35) return null;
  return unpackRef(slot.toString(36) + paper.toString(36) + index.toString(36));
}

const ID_OF_CODE = new Map(LINK_ID_CODES.map((c, i) => [c, i]).filter(([c]) => c));

/** A seed the short format can carry: four characters of the link alphabet. */
export const isShortSeed = seed =>
  typeof seed === 'string' && seed.length === SHORT_SEED_LENGTH && [...seed].every(c => LINK_ALPHABET.includes(c));

/**
 * A generated question as a short token, or, when its seed is an old
 * six-character one, kept exactly as "__" and the old twelve characters. Null
 * if neither fits (a code with no link id yet: check-share-refs catches that).
 */
export function packShortGenerated(code, seed, parentIndex = 0) {
  if (!Number.isInteger(parentIndex) || parentIndex < 0 || parentIndex >= R) return null;
  if (isShortSeed(seed)) {
    const id = ID_OF_CODE.get(code);
    const idText = id === undefined ? null : toAlphabet(id, SHORT_ID_LENGTH);
    return idText ? GENERATED_MARK + idText + seed + LINK_ALPHABET[parentIndex] : null;
  }
  const kept = packGenerated(code, seed, parentIndex);
  return kept ? GENERATED_MARK + kept : null;
}

/**
 * The q= for a sheet in the short format, or null if any question will not pack.
 * Marked with `version` (the current one unless a check asks for another).
 */
export function encodeShortRefs(refs, version = LINK_VERSION) {
  const tokens = [];
  for (const ref of refs) {
    const gen = parseGeneratedRef(ref);
    let token;
    if (gen) {
      token = packShortGenerated(gen.code, gen.seed, gen.parentIndex);
    } else {
      const m = /^(.+)-(\d+)-(\d+)$/.exec(ref);
      token = m ? packShortRef({ year: m[1], paperNumber: Number(m[2]), questionIndex: Number(m[3]) }) : null;
    }
    if (!token) return null;
    tokens.push(token);
  }
  const mark = version === 1 ? '' : VERSION_MARKS[version];
  if (mark === undefined) throw new Error(`encodeShortRefs: no mark for version ${version}`);
  return SHORT_MARK + mark + breakWords(tokens.join(''));
}

/**
 * A "." between every two characters of any listed word, where tokens meet as
 * much as inside one, until nothing in the stream spells one. The decoder
 * drops every "." after the first, so this changes nothing a link opens.
 */
export function breakWords(stream) {
  let s = stream;
  for (let guard = 0; guard < 1000; guard++) {
    const read = asLetters(s);
    // The earliest listed word, as written or with its digits read as letters.
    let at = -1, len = 0;
    for (const w of LINK_WORDS) {
      for (const i of [s.indexOf(w), read.indexOf(w)]) {
        if (i >= 0 && (at < 0 || i < at)) { at = i; len = w.length; }
      }
    }
    if (at < 0) return s;
    s = s.slice(0, at) + s.slice(at, at + len).split('').join(SHORT_MARK) + s.slice(at + len);
  }
  throw new Error('breakWords: did not settle');
}

/** A short-format q= (after its leading ".") back to references. */
function decodeShort(body) {
  const q = body.split(SHORT_MARK).join('');
  const out = [];
  let i = 0;
  while (i < q.length) {
    if (q[i] === GENERATED_MARK && q[i + 1] === GENERATED_MARK) {
      // An old question kept: "_" and its original twelve-character token.
      const ref = unpackGenerated(q.slice(i + 1, i + KEPT_GENERATED_LENGTH));
      i += KEPT_GENERATED_LENGTH;
      if (ref) out.push(ref);
      continue;
    }
    if (q[i] === GENERATED_MARK) {
      const token = q.slice(i, i + SHORT_GENERATED_LENGTH);
      i += SHORT_GENERATED_LENGTH;
      const id = fromAlphabet(token.slice(1, 1 + SHORT_ID_LENGTH));
      const seed = token.slice(1 + SHORT_ID_LENGTH, 1 + SHORT_ID_LENGTH + SHORT_SEED_LENGTH);
      const parent = LINK_ALPHABET.indexOf(token.slice(-1));
      const code = id === null ? undefined : LINK_ID_CODES[id];
      if (token.length === SHORT_GENERATED_LENGTH && code && isShortSeed(seed) && parent >= 0) {
        out.push(generatedRef(code, seed, parent));
      }
      continue;
    }
    const ref = unpackShortRef(q.slice(i, i + SHORT_PAPER_LENGTH));
    i += SHORT_PAPER_LENGTH;
    if (ref) out.push(ref);
  }
  return out;
}

/**
 * Read a q= value in any format.
 *
 * A short link starts with "."; no older link does. Spelled-out references
 * contain "-" and are comma-joined; packed ones never do, so one character
 * decides which this is. Links already emailed or printed on a handout keep
 * working — that is the whole reason for the sniff.
 *
 * A version mark after the "." (see LINK_VERSION) says which maker the link
 * was made with; it is not a question, so it is stepped over here.
 */
export function decodeRefs(q) {
  if (typeof q !== 'string' || !q) return [];
  if (q.startsWith(SHORT_MARK)) return decodeShort(q.slice(linkVersion(q) === 1 ? 1 : 2));
  if (q.includes('-') || q.includes(',')) {
    return q.split(',').map(r => r.trim()).filter(Boolean);
  }
  const out = [];
  let i = 0;
  while (i < q.length) {
    // The mark is outside base36, so one character decides which shape this is
    // and the stream needs no separator between them.
    if (q[i] === GENERATED_MARK) {
      const ref = unpackGenerated(q.slice(i, i + GENERATED_TOKEN_LENGTH));
      // A malformed generated token is skipped whole rather than one character
      // at a time: resyncing mid-token would read its tail as paper questions
      // and put questions on the sheet that nobody chose.
      i += GENERATED_TOKEN_LENGTH;
      if (ref) out.push(ref);
      continue;
    }
    const ref = unpackRef(q.slice(i, i + TOKEN_LENGTH));
    i += TOKEN_LENGTH;
    if (ref) out.push(ref);
  }
  return out;
}
