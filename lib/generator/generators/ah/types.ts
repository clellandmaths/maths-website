/**
 * Advanced Higher: the shape of a card and of the routine that makes it.
 *
 * The types live in the shared core since 2026-10-07 (docs/higher-course.md,
 * step 2), because Higher's cards have the same shape and the core's checks
 * read both. They are re-exported here unchanged, so every AH file keeps its
 * `./types` import. What each type means is written beside it in
 * `../core/types.ts`.
 */
export type { Built, CardLabel, CardMeta, CardRoutine, Ladder, PaperOf } from '../core/types';
