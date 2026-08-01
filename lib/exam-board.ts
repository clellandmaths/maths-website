// Naming the awarding body.
//
// The SQA became Qualifications Scotland during 2025, so which name is correct
// depends on the year being talked about:
//
//   a 2019 paper IS an SQA past paper — that is its actual historical title,
//   and renaming it would be wrong as well as unsearchable;
//
//   anything forward-looking — the course, the exam a pupil is sitting, the
//   site's own voice — is Qualifications Scotland.
//
// This also matters for search. Pupils overwhelmingly search "SQA past papers"
// today, but "Qualifications Scotland" and "QS maths" will grow. Using the
// historically correct name per paper means we rank for both honestly, rather
// than stuffing keywords or going stale.

/** First exam diet awarded under the Qualifications Scotland name. */
export const QS_FROM_YEAR = 2026;

/** The body that set a given paper. Specimen papers follow the current name. */
export function examBoardFor(year: number | string): string {
  const n = typeof year === 'number' ? year : parseInt(String(year), 10);
  if (Number.isNaN(n)) return 'Qualifications Scotland'; // "Specimen" and similar
  return n >= QS_FROM_YEAR ? 'Qualifications Scotland' : 'SQA';
}

/** Short form, for tight spaces. */
export function examBoardShortFor(year: number | string): string {
  return examBoardFor(year) === 'SQA' ? 'SQA' : 'QS';
}

/**
 * Both names, for metadata where we want to be found either way — e.g.
 * "SQA (Qualifications Scotland)". Only worth it on pre-2026 papers, where a
 * reader searching the new name still needs to find the old one.
 */
export function examBoardWithAlias(year: number | string): string {
  return examBoardFor(year) === 'SQA' ? 'SQA (Qualifications Scotland)' : 'Qualifications Scotland';
}

/**
 * The copyright notice Qualifications Scotland requires on reproduced material,
 * word for word. Do not paraphrase or trim it.
 *
 * Kept as one constant because it has to be identical on the site and on
 * anything printed from it, and a notice that drifts between copies is worse
 * than useless. Qualifications Scotland is the successor body, so this covers
 * the pre-2026 SQA papers too.
 */
export const QS_COPYRIGHT_NOTICE =
  'This content is an original creation of Qualifications Scotland. ' +
  'Qualifications Scotland does not promote or endorse the use of any content ' +
  'associated with its reproduction. Copyright © Qualifications Scotland.';

/**
 * What the notice is about.
 *
 * The notice opens "This content is an original creation of..." — true of the
 * papers, but the site is mostly not theirs: the course notes, the authored
 * practice questions and maths.scot's questions are all someone else's work.
 * Printed bare it would read as crediting them with all of it, so it never
 * appears without this scope in front of it.
 */
export const QS_NOTICE_SCOPE = 'Past paper questions and marking instructions:';
