import type { QuestionWithMetadata } from './data-loader';
import type { GeneratedQuestion } from './generator/generators/types';
import {
  toWorksheetQuestion as build,
  questionFromCode as fromCode,
  type ToWorksheetOptions,
} from './generator/worksheet-question';
import { SEED_LENGTH } from './worksheet-refs.mjs';

/**
 * The boundary: a generated question becomes a question this site can show.
 *
 * The mapping itself is in the engine, at `lib/generator/worksheet-question.ts`,
 * so that the generator's own checks can drive it by running it — this repo has
 * no way to execute TypeScript, and giving it one would put a build dependency
 * on the repo that deploys the live site.
 *
 * **This file is the drift check.** The return type below assigns the engine's
 * shape to `QuestionWithMetadata`. If the site changes its question shape, or
 * the engine drifts from it, `next build` fails here. Nothing has to remember
 * to compare the two.
 */
export function toWorksheetQuestion(
  q: GeneratedQuestion,
  options: ToWorksheetOptions,
): QuestionWithMetadata {
  return build(q, options);
}

/**
 * Make a generated question from its variation code and seed.
 *
 * The same function the builder uses and the same one a shared link resolves
 * through — see `questionFromCode` in the engine for why that has to be one
 * function rather than two that agree.
 *
 * **This module statically imports the engine**, so anything that imports it
 * pulls in 33,000 lines. That is deliberate and it is why `worksheet-share.ts`
 * reaches this file through `await import()` rather than at the top: the engine
 * stays in its own chunk and off every page that never generates anything.
 *
 * Null when the code names no variation — a link from a newer version of the
 * site, or a variation withdrawn since. That is a missing question, counted
 * like a paper reference that will not resolve, never a substituted one.
 */
export async function questionFromCode(
  code: string,
  seed: string,
  index: number,
): Promise<QuestionWithMetadata | null> {
  return fromCode(code, seed, index);
}

const BASE36 = '0123456789abcdefghijklmnopqrstuvwxyz';

/**
 * A fresh seed for a new question.
 *
 * `SEED_LENGTH` comes from the link format rather than being chosen here: the
 * seed has to survive a round trip through a URL as a fixed-width token, so its
 * length is the link's business and this follows it.
 *
 * Built a character at a time rather than from `Math.random().toString(36)`,
 * which yields a short string whenever the draw happens to be small — and a
 * short seed is one the link cannot carry.
 */
export function newSeed(): string {
  let s = '';
  for (let i = 0; i < SEED_LENGTH; i++) {
    s += BASE36[Math.floor(Math.random() * BASE36.length)];
  }
  return s;
}

export { GENERATED_UID_PREFIX, generatedUid } from './generator/worksheet-question';
export type { ToWorksheetOptions } from './generator/worksheet-question';
