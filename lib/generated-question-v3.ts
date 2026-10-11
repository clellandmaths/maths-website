import type { QuestionWithMetadata } from './data-loader';
import { questionFromCode as fromCode } from './generator-v3/worksheet-question';
import { VARIATION_BY_CODE } from './generator-v3/generators/variation-codes';

/**
 * **Version 3's door: the frozen maker that opens version 3 links.**
 *
 * `lib/generator-v3/` is the generator exactly as it was live from 2026-10-10
 * (website 3e570a3: Advanced Higher's six widened cards, never any AH paper's
 * own question word for word, no twins on an AH sheet), copied byte for byte
 * and locked by `scripts/check-frozen-engines.mjs`. A link made from then until
 * version 4 carries the version 3 mark, and `lib/link-engines.ts` sends its
 * generated questions here, so they come out exactly as they were shared.
 *
 * **Never edit `lib/generator-v3/`.** If the site's question shape ever
 * changes, adapt it in this file; the copy stays as it is.
 *
 * Mirrors `questionFromCode` in `generated-question.ts` as it was at 3e570a3:
 * National 5's codes, its generators and paper guard fetched together
 * (`readyN5`, which changes only when the files arrive, never a draw), then
 * Advanced Higher's. The return type is the drift check, as it is there.
 */
let n5Files: Promise<unknown> | null = null;
function readyN5() {
  n5Files ??= Promise.all([
    import('./generator-v3/generators/n5'),
    import('./generator-v3/generators/paper-guard'),
  ]).catch(e => { n5Files = null; throw e; });
  return n5Files;
}

export async function questionFromCode(
  code: string,
  seed: string,
  index: number,
  parentIndex = 0,
): Promise<QuestionWithMetadata | null> {
  if (VARIATION_BY_CODE[code]) await readyN5();
  return (await fromCode(code, seed, index, parentIndex))
    ?? (await import('./generator-v3/generators/ah/site')).ahQuestionFromCode(code, seed, index);
}
