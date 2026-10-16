/**
 * **Version 4's Advanced Higher door**: `lib/ah-door.ts` as it was at 4e0ff64, pointed at the frozen
 * `lib/generator-v4/`. One module, so the bundler packs the site adapter, the code table and the routine loader as one
 * set of files (imported separately, the same code was downloaded twice: card 13a of the loading-states sheet). Reached
 * only from `lib/generated-question-v4.ts`. Nothing here is new code; the frozen copy is untouched.
 */
export * from './generator-v4/generators/ah/site';
export { AH_BY_CODE } from './generator-v4/generators/ah/codes';
export { routineFor } from './generator-v4/generators/ah/engine';
