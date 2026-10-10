import type { QuestionWithMetadata } from './data-loader';

/**
 * **Which question-maker opens a link: the one it was made with.**
 *
 * A shared link carries each generated question's code and seed, never the
 * question itself, so it reopens exactly what was shared only while the maker
 * behind it is the same. When the maker changes what a seed makes, new links
 * carry the new version (`LINK_VERSION` in `worksheet-refs.mjs`) and the maker
 * each older version was made with is kept here, frozen, to open its links
 * (the owner, 2026-10-09: "I don't really want to annoy any teachers who have
 * homework out right now"). docs/link-versions.md has the rules.
 *
 *   version 1  `lib/generator-v1/`, the maker live from 2026-10-06 (website
 *              767a87c), byte for byte. Every link made before versions existed.
 *              Locked by `scripts/check-frozen-engines.mjs`.
 *   version 2  `lib/generator-v2/`, the maker live from 2026-10-09 (website
 *              a794574), byte for byte: the 18 widened National 5 cards, never
 *              the paper's own question, no twins on a sheet. Locked the same way.
 *   version 3  `lib/generator/`, the current one: Advanced Higher's six widened
 *              cards, never any AH paper's own question, no twins on an AH sheet,
 *              2025 P1 Q8 no longer giving up.
 *
 * Each maker is reached only through `await import()`, so a version costs
 * nothing until a link made with it is opened, and an old maker is never
 * fetched for a new link.
 */
export interface LinkEngine {
  questionFromCode(code: string, seed: string, index: number, parentIndex?: number): Promise<QuestionWithMetadata | null>;
}

export async function engineForVersion(version: number): Promise<LinkEngine> {
  if (version === 1) return import('./generated-question-v1');
  if (version === 2) return import('./generated-question-v2');
  // The current version, and any version newer than this site knows (a link
  // from a later deploy): the newest maker here is the nearest it has.
  return import('./generated-question');
}
