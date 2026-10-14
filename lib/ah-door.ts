/**
 * **Advanced Higher's one door from the site** (card 13a of the loading-states
 * sheet, 2026-10-14). Everything the site reaches AH's engine for comes through
 * this one module, so the bundler packs it as one set of files.
 *
 * Why it exists: a shared link starts fetching every card's code the moment it
 * is read (`warmForCodes` in `lib/generated-question.ts`), and that needs the
 * code table and the routine loader as well as the site adapter. Imported
 * separately, each became its own set of files, and the same code was
 * downloaded twice: about 100 KB compressed more on an AH sheet. Re-exported
 * from here, they ride in the file set the site adapter already needed, which
 * already contained them. Nothing here is new code; the engine is untouched.
 */
export * from './generator/generators/ah/site';
export { AH_BY_CODE } from './generator/generators/ah/codes';
export { routineFor } from './generator/generators/ah/engine';
