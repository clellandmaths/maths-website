/**
 * A paper's name as a pupil reads it: "2024 Paper 1", or "2019 Paper" for a
 * year with a single paper.
 *
 * The owner, 2026-09-30: "Advanced Higher single papers should not be called
 * Paper 1. Just 2019 Paper." Advanced Higher before 2020 and Higher
 * Applications each set one paper, which the site stores as paper 1 (the
 * addresses keep `paper-1`, so no link breaks); only the name changes. The same
 * rule as the paper page's "Calculator allowed" line.
 */
export function isSinglePaper(courseId: string, year: number | string): boolean {
  return courseId === 'higher-apps' || (courseId === 'ah' && Number(year) < 2020);
}

export function paperName(courseId: string, year: number | string, paperNumber: number): string {
  return isSinglePaper(courseId, year) ? `${year} Paper` : `${year} Paper ${paperNumber}`;
}
