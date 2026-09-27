// Advanced Higher: 2016–2019 and 2021 papers have no video solutions, so their
// marking instructions are shown instead (mirrors the live app's "Show
// Markscheme" behaviour).
//
// Since 2026-09-27 they come from the transcribed marking instructions, the
// same table the printed markscheme uses (`lib/course-markschemes`), on the
// owner's word: "The new markscheme should be one that website uses". The
// older machine-extracted files in `src/ah/markschemes/` are no longer read.

import { ahCard, cardScheme, loadCourseSchemes } from '@/lib/course-markschemes';

const NO_VIDEO_PAPERS = new Set(['2016-1', '2017-1', '2018-1', '2019-1', '2021-1', '2021-2']);

export function hasMarkscheme(year: number | string, paperNumber: number): boolean {
  return NO_VIDEO_PAPERS.has(`${year}-${paperNumber}`);
}

/** This card's rows and notes, or null when its question has no transcription. */
export async function getCardScheme(questionHtml: string) {
  const card = ahCard(questionHtml);
  if (!card) return null;
  const { table } = await loadCourseSchemes('ah');
  const scheme = table[card.label];
  return scheme ? { ref: card.ref, ...cardScheme(scheme, card.parts) } : null;
}
