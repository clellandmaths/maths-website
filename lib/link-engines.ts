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
 *   version 3  `lib/generator-v3/`, the maker live from 2026-10-10 (website
 *              3e570a3), byte for byte: Advanced Higher's six widened cards, never
 *              any AH paper's own question word for word, no twins on an AH sheet,
 *              2025 P1 Q8 no longer giving up. Locked the same way.
 *   version 4  `lib/generator-v4/`, the maker live from 2026-10-13 (website
 *              ee23fd2 to 4e0ff64), byte for byte: Advanced Higher never the
 *              paper's own question in any wording (one "same question" test for
 *              the guard and for twins), sheets that take distinct questions
 *              first, and ten widened cards. Locked the same way.
 *   version 5  `lib/generator/`, the current one: National 5 to AH's design
 *              (2026-10-16): never any N5 paper's own question in any wording,
 *              by the owner's rulings, P2 across cards; N5 sheets with the same
 *              twin test, the "feels distinct" preference, and a family of cards
 *              as one card on a topic sheet. 30 moved cards, each confirmed.
 *
 * Each maker is reached only through `await import()`, so a version costs
 * nothing until a link made with it is opened, and an old maker is never
 * fetched for a new link.
 */
export interface LinkEngine {
  questionFromCode(code: string, seed: string, index: number, parentIndex?: number): Promise<QuestionWithMetadata | null>;
  /**
   * Fetch every file a link's codes will need, at once: the current maker, and version 4's (its links were opened
   * that way on the live site, card 13a). Versions 1 to 3 load as they did.
   */
  warmForCodes?(codes: readonly string[]): Promise<void>;
}

export async function engineForVersion(version: number): Promise<LinkEngine> {
  if (version === 1) return import('./generated-question-v1');
  if (version === 2) return import('./generated-question-v2');
  if (version === 3) return import('./generated-question-v3');
  if (version === 4) return import('./generated-question-v4');
  // The current version, and any version newer than this site knows (a link
  // from a later deploy): the newest maker here is the nearest it has.
  return import('./generated-question');
}
