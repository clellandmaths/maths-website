import type { QuestionWithMetadata } from './data-loader';
import type { GeneratedQuestion } from './generator/generators/types';
import {
  toWorksheetQuestion as build,
  type ToWorksheetOptions,
} from './generator/worksheet-question';

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

export { GENERATED_UID_PREFIX, generatedUid } from './generator/worksheet-question';
export type { ToWorksheetOptions } from './generator/worksheet-question';
