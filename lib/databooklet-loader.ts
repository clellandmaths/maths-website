// Higher Applications data booklets.
//
// Pulled out of DataBookletModal so the printed worksheet can render the same
// booklet the modal shows. Two copies of the year-resolution rule would drift,
// and the failure would be quiet: a printed booklet with the wrong tax bands
// looks exactly like a right one.

export interface BookletSection {
  title: string;
  content: string;
}

export interface Booklet {
  title: string;
  sections: BookletSection[];
}

const bookletFiles: Record<string, () => Promise<Booklet>> = {
  'Specimen': () => import('@/src/higherapps/databookletSpec1').then(m => m.higherAppsDataBookletSpec1 as Booklet),
  '2022': () => import('@/src/higherapps/databooklet2022').then(m => m.higherAppsDataBooklet2022 as Booklet),
  '2023': () => import('@/src/higherapps/databooklet2023').then(m => m.higherAppsDataBooklet2023 as Booklet),
  '2024': () => import('@/src/higherapps/databooklet2024').then(m => m.higherAppsDataBooklet2024 as Booklet),
  '2025': () => import('@/src/higherapps/databooklet2025').then(m => m.higherAppsDataBooklet2025 as Booklet),
  '2026': () => import('@/src/higherapps/databooklet2026').then(m => m.higherAppsDataBooklet2026 as Booklet),
};

/** Newest booklet, used when a question is not tied to a particular paper. */
export const LATEST = '2026';

/**
 * Which booklet to show for a given label.
 *
 * Callers pass whatever they have: a year, a paper reference like "2023 Q4",
 * or a guided practice topic name. The previous exact-key lookup found nothing
 * for the last two and rendered an empty booklet — worse than no button at
 * all, since a question saying "refer to the data booklet" then gave a pupil
 * no way to see the tax bands.
 */
export function resolveBookletYear(label: number | string): { key: string; exact: boolean } {
  const s = String(label);
  if (/spec/i.test(s)) return { key: 'Specimen', exact: true };
  const year = s.match(/(?:19|20)\d{2}/)?.[0];
  if (year && bookletFiles[year]) return { key: year, exact: true };
  return { key: LATEST, exact: false };
}

export function loadBooklet(key: string): Promise<Booklet> {
  return (bookletFiles[key] ?? bookletFiles[LATEST])();
}

/**
 * The distinct booklets a set of questions needs, in a stable order.
 *
 * A worksheet mixing 2023 and 2025 questions needs both: the tax bands and
 * allowances differ year to year, so printing one booklet for a mixed sheet
 * would give wrong figures for half the questions.
 */
export function bookletKeysFor(years: (number | string)[]): string[] {
  const keys = new Set<string>();
  for (const y of years) keys.add(resolveBookletYear(y).key);
  return [...keys].sort();
}
