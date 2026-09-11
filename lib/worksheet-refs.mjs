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
 * entropy the stream cannot use, and a shorter one would make two questions
 * from one variation collide on a sheet.
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

/**
 * Read a q= value in either format.
 *
 * Spelled-out references contain "-" and are comma-joined; packed ones never
 * do, so one character decides which this is. Links already emailed or printed
 * on a handout keep working — that is the whole reason for the sniff.
 */
export function decodeRefs(q) {
  if (typeof q !== 'string' || !q) return [];
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
