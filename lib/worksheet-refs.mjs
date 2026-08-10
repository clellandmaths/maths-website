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
  for (let i = 0; i + TOKEN_LENGTH <= q.length; i += TOKEN_LENGTH) {
    const ref = unpackRef(q.slice(i, i + TOKEN_LENGTH));
    if (ref) out.push(ref);
  }
  return out;
}
