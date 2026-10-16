import type { QuestionWithMetadata } from './data-loader';
import { questionFromCode as fromCode } from './generator-v4/worksheet-question';
import { VARIATION_BY_CODE } from './generator-v4/generators/variation-codes';

/**
 * **Version 4's door: the frozen maker that opens version 4 links.**
 *
 * `lib/generator-v4/` is the generator exactly as it was live from 2026-10-13
 * (website ee23fd2 to 4e0ff64, `lib/generator` unchanged between: Advanced
 * Higher never the paper's own question in any wording, sheets that take
 * distinct questions first, ten widened cards), copied byte for byte and locked
 * by `scripts/check-frozen-engines.mjs`. A link made from then until version 5
 * carries the version 4 mark, and `lib/link-engines.ts` sends its generated
 * questions here, so they come out exactly as they were shared.
 *
 * **Never edit `lib/generator-v4/`.** If the site's question shape ever
 * changes, adapt it in this file; the copy stays as it is.
 *
 * Mirrors `questionFromCode` and `warmForCodes` in `generated-question.ts` as
 * they were at 4e0ff64: National 5's codes, its generators and paper guard
 * fetched together (`readyN5`, which changes only when the files arrive, never a
 * draw), then Advanced Higher's, through its own one door (`ah-door-v4.ts`). The
 * return type is the drift check, as it is there.
 *
 * **Unlike versions 1 to 3, it warms** (`warmForCodes`): version 4 links were
 * opened on the live site with every card's code asked for when the link is
 * read (card 13a, 2026-10-14), so they keep that; without it a 20-question AH
 * handout went back to 8 waves of requests (`check:sheetloading`). Only when
 * the files arrive changes, never a question.
 */
let n5Files: Promise<unknown> | null = null;
function readyN5() {
  n5Files ??= Promise.all([
    import('./generator-v4/generators/n5'),
    import('./generator-v4/generators/paper-guard'),
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
  return (await fromCode(code, seed, index, parentIndex)) ?? (await ah()).ahQuestionFromCode(code, seed, index);
}

const ah = () => import('./ah-door-v4');

/** Every file a link's codes will need, asked for at once (as `warmForCodes` at 4e0ff64). */
export async function warmForCodes(codes: readonly string[]): Promise<void> {
  const ahCodes = codes.filter(c => !VARIATION_BY_CODE[c]);
  await Promise.all([
    ahCodes.length < codes.length ? readyN5().catch(() => undefined) : undefined,
    ahCodes.length ? (async () => {
      const { AH_BY_CODE, routineFor } = await ah();
      const ids = [...new Set(ahCodes.map(c => AH_BY_CODE[c]).filter((id): id is string => !!id))];
      await Promise.all(ids.map(id => routineFor(id).catch(() => undefined)));
    })().catch(() => undefined) : undefined,
  ]);
}
