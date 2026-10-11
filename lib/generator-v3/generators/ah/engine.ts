/**
 * The Advanced Higher engine: make a card from its id and a seed.
 *
 * Separate from National 5's `generateQuestion`, on purpose:
 *
 * - **It makes, it never filters.** A card is asked for by id and its own
 *   routine builds it: one draw, nothing thrown away. National 5's engine
 *   draws until the wanted id comes up, and those discards are what tied its
 *   questions together (docs/building-a-course.md, "The five that cost the
 *   most", 1).
 * - **Labels are per course.** "2025 P1 Q3" is a card in National 5 and in
 *   Advanced Higher, so nothing here looks a card up by label in a table that
 *   holds another course's. The website, which knows the course, calls this.
 * - **National 5 is untouched.** Nothing in `../generator.ts` or its routines
 *   changes, so every locked N5 question is byte-for-byte what it was.
 *
 * Always under a seed. A shared link carries the code and the seed, and this
 * is what makes the same pair give the same question in every browser.
 */
import type { GeneratedQuestion } from '../types';
import { drawWith, makeWith, withSeed } from '../core/seeded';
import { questionKey } from '../../question-key';
import type { Built, CardLabel, CardRoutine, Ladder } from './types';
import { AH_CARDS, idForCard, type Registered } from './registry';
import { ROUTINE_LOADERS } from './routines';
import { AH_CODES } from './codes';
import { SITE_CARDS } from './site-cards';
import { guarded } from './not-the-paper';

/**
 * A generated Advanced Higher card: the question every consumer of the engine
 * takes, plus its hint ladder, which National 5's questions carry in their
 * registry instead (a National 5 plan names no values; an Advanced Higher
 * ladder does, so it comes from the draw).
 */
export type AhQuestion = GeneratedQuestion & { ladder: Ladder };

/**
 * The seeded draw, `makeWith` and `drawWith` live in the shared core since
 * 2026-10-07 (`../core/seeded.ts`), unchanged; they are re-exported here
 * under their AH names so every caller is as it was.
 */
export { drawWith, makeWith };
export const withAhSeed = withSeed;

/** The registered card for an id. Throws on an id that is not one. */
export function cardMeta(id: string): Registered {
  const meta = AH_CARDS[id];
  if (!meta) throw new Error(`AH engine: no card has the id ${id}`);
  return meta;
}

/**
 * Load the routine that makes a card, as its topic file writes it: it can draw
 * a past paper's own question. Only the checks that prove the guard use this;
 * everything else takes `routineFor`.
 */
export async function unguardedRoutineFor(id: string): Promise<CardRoutine> {
  const meta = cardMeta(id);
  const load = ROUTINE_LOADERS[meta.file];
  if (!load) throw new Error(`AH engine: no routine file "${meta.file}" for ${meta.card}`);
  const routine = (await load()).ROUTINES[meta.card];
  if (!routine) throw new Error(`AH engine: ${meta.file} has no routine for ${meta.card}`);
  return routine;
}

const GUARDED = new Map<string, CardRoutine>();

/**
 * Load the routine that makes a card. One topic file, loaded once. It never
 * draws a past paper's own question (`not-the-paper.ts`); every other draw is
 * what the card's routine draws.
 */
export async function routineFor(id: string): Promise<CardRoutine> {
  const have = GUARDED.get(id);
  if (have) return have;
  const routine = guarded(cardMeta(id).card, await unguardedRoutineFor(id));
  GUARDED.set(id, routine);
  return routine;
}

/** A built card, dressed as the question every consumer of the engine takes. */
export function dress(id: string, built: Built): AhQuestion {
  const meta = cardMeta(id);
  const site = SITE_CARDS[meta.card];
  return {
    topic: site?.topics[0],
    subTopic: site?.subtopics[0] ?? site?.topics[0] ?? meta.card,
    questionLines: built.questionLines,
    solutionSteps: built.solutionSteps,
    stepMarks: built.stepMarks,
    finalAnswer: built.finalAnswer,
    ladder: built.ladder,
    ...(built.figure ? { figure: built.figure } : {}),
    // A generated card always has a paper behind it: it is that card.
    difficulty: 'exam',
    webTopics: site?.subtopics ?? [],
    variationId: id,
    code: AH_CODES[id],
  };
}

/** Make one card from its id and a seed. */
export async function makeCard(id: string, seed: number | string): Promise<AhQuestion> {
  return dress(id, makeWith(await routineFor(id), seed));
}

/**
 * Up to `count` different questions like one card, for "Another like this
 * one" and the Worksheet Builder.
 *
 * Different means a different `questionKey`, and anything in `exclude` (the
 * keys of what the sheet already holds) counts as taken. Returns fewer when
 * the card cannot make that many: the caller must say so, not pad the sheet.
 * `seeds` supplies a fresh seed per attempt, and each result carries the one
 * that made it, which is what a shared link stores.
 */
export async function cardsLike(
  card: CardLabel,
  count: number,
  seeds: () => string,
  exclude: readonly string[] = [],
): Promise<{ question: AhQuestion; seed: string }[]> {
  const id = idForCard(card);
  if (!id) return [];
  const routine = await routineFor(id);
  const taken = new Set(exclude);
  const out: { question: AhQuestion; seed: string }[] = [];
  for (let attempt = 0; attempt < count * 8 && out.length < count; attempt++) {
    const seed = seeds();
    const question = dress(id, makeWith(routine, seed));
    const key = questionKey(question);
    if (taken.has(key)) continue;
    taken.add(key);
    out.push({ question, seed });
  }
  return out;
}
