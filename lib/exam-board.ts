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
