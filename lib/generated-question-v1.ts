import type { QuestionWithMetadata } from './data-loader';
import { questionFromCode as fromCode } from './generator-v1/worksheet-question';

/**
 * **Version 1's door: the frozen maker that opens links made before versions.**
 *
 * `lib/generator-v1/` is the generator exactly as it was live from 2026-10-06
 * (website 767a87c), copied byte for byte and locked by
 * `scripts/check-frozen-engines.mjs`. A link made before 2026-10-09 carries
 * no version mark, and `lib/link-engines.ts` sends its generated questions here,
 * so they come out exactly as they were shared.
 *
 * **Never edit `lib/generator-v1/`.** If the site's question shape ever
 * changes, adapt it in this file; the copy stays as it is. That is the whole of
 * the promise, and the check holds it.
 *
 * Mirrors `questionFromCode` in `generated-question.ts` as it was at 767a87c:
 * National 5's codes, then Advanced Higher's (no code is in both). The return
 * type is the drift check, as it is there.
 */
export async function questionFromCode(
  code: string,
  seed: string,
  index: number,
  parentIndex = 0,
): Promise<QuestionWithMetadata | null> {
  return (await fromCode(code, seed, index, parentIndex))
    ?? (await import('./generator-v1/generators/ah/site')).ahQuestionFromCode(code, seed, index);
}
