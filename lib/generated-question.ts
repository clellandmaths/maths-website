import type { QuestionWithMetadata } from './data-loader';
import type { GeneratedQuestion } from './generator/generators/types';
import {
  toWorksheetQuestion as build,
  questionFromCode as fromCode,
  similarTo as fromLabel,
  generateForSubtopics as fromSubtopics,
  keysOfQuestion,
  GENERATED_UID_PREFIX,
  type ToWorksheetOptions,
} from './generator/worksheet-question';
import { LINK_ALPHABET, SHORT_SEED_LENGTH, spellsInLink } from './worksheet-refs.mjs';
import { paperRef } from './question-number.mjs';

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
  parentIndex = 0,
): Promise<QuestionWithMetadata | null> {
  // National 5's codes, then Advanced Higher's. No code is in both (the
  // generator's `ah-registry` fails if one ever is), so a link needs no course
  // to find its question, and a National 5 sheet never loads AH's engine.
  return (await fromCode(code, seed, index, parentIndex)) ?? (await ah()).ahQuestionFromCode(code, seed, index);
}

/**
 * Advanced Higher's adapter, loaded the first time an AH question is asked
 * for. Its routines then load a topic at a time (`ah/routines/index.ts`).
 */
const ah = () => import('./generator/generators/ah/site');

/**
 * **Load the routine files a batch of Advanced Higher cards needs, all at once.**
 *
 * A batch (a variation of each filtered question, a practice paper) asks for
 * its cards one at a time, and each card's routine file loads the first time
 * it is asked for, so 195 cards fetched 69 small files one after another:
 * 8.3 s on a throttled phone, against National 5's 3.4 s for 104 (the owner,
 * 2026-10-05: "a loading spinner for some time"). Fetched together first, the
 * draws that follow find them already loaded. Nothing about the draw changes:
 * the same cards, seeds and questions, only the order the files arrive in.
 * A file that fails here is left for the draw itself to report.
 */
export async function warmForCards(labels: readonly (string | null | undefined)[], courseId: string): Promise<void> {
  if (courseId !== 'ah') return;
  const [{ idForCard }, { routineFor }] = await Promise.all([
    import('./generator/generators/ah/registry'),
    import('./generator/generators/ah/engine'),
  ]);
  const ids = [...new Set(labels.filter((l): l is string => !!l).map(l => idForCard(l)).filter((id): id is string => !!id))];
  await Promise.all(ids.map(id => routineFor(id).catch(() => undefined)));
}

/**
 * What a first press would load, fetched ahead of it (`lib/warm-generator.ts`).
 * Nothing is drawn. National 5: its generators, which the engine imports on
 * demand (`generator.ts`, `await import('./generators/n5')`, 595 KB, and the
 * piece a slowed phone waited on). Advanced Higher: its adapter and the card's
 * routine file.
 */
export async function warmCourse(courseId: string, label?: string | null): Promise<void> {
  if (courseId === 'ah') {
    await Promise.all([ah(), label ? warmForCards([label], 'ah') : undefined]);
  } else if (courseId === 'n5') {
    const n5 = await import('./generator/generators/n5');
    if (typeof n5.generateN5Question !== 'function') throw new Error('n5 generators');
  }
}

/**
 * Fresh questions modelled on one past paper question.
 *
 * Backs "add a variation of this" in the Explorer. The label comes from the
 * question's printed badge — `variationLabel()` in `lib/similar-questions.ts`.
 *
 * Returns fewer than asked, or none at all, when the variations behind that
 * question cannot make that many different ones. **The caller must handle a
 * short answer**: a sheet quietly coming up shorter than the teacher asked for,
 * with nothing saying which question did it, is the failure worth avoiding.
 *
 * Every question that comes back carries a `uid` that regenerates it, so it can
 * go in a sheet and survive being shared.
 *
 * **Pass `exclude`**, or repeated clicks repeat themselves. The engine dedupes
 * within one call and has no memory between calls, so ten clicks on a pool of
 * six returned four different questions and six identical ones. Build the list
 * with `worksheetKeys()`.
 */
export async function similarTo(
  paperLabel: string,
  count: number,
  exclude: readonly string[] = [],
  courseId = 'n5',
): Promise<QuestionWithMetadata[]> {
  // **By course, never by label alone**: "2025 P1 Q3" is a card in both
  // courses. The label comes from `generationLabel(courseId, …)`.
  if (courseId === 'ah') return (await ah()).ahLike(paperLabel, count, newSeed, exclude);
  return fromLabel(paperLabel, count, newSeed, exclude);
}

/**
 * Fresh questions across a set of the website's own subtopics.
 *
 * What the Explorer's filter produces. Returns fewer than asked, or none, when
 * those subtopics cannot make that many different questions — the caller must
 * say so rather than let the sheet come up quietly short.
 *
 * Takes `exclude` for the same reason `similarTo` does, and it matters on a
 * wide filter too: three clicks of five on surds repeated one question.
 */
export async function generateForSubtopics(
  subtopics: readonly string[],
  count: number,
  exclude: readonly string[] = [],
  courseId = 'n5',
  held: readonly QuestionWithMetadata[] = [],
): Promise<QuestionWithMetadata[]> {
  // Math.random orders the cards only (the engine may not read it itself);
  // each question is still made from its code and seed.
  if (courseId === 'ah') return (await ah()).ahForSubtopics(subtopics, count, newSeed, Math.random, exclude, heldCards(held));
  return fromSubtopics(subtopics, count, newSeed, exclude);
}

/**
 * Fresh Advanced Higher questions on one practice topic. Its practice ids
 * are the generator's topic files ("differential-equations"), one to one.
 */
export async function generateForPracticeTopic(
  slug: string,
  count: number,
  exclude: readonly string[] = [],
  held: readonly QuestionWithMetadata[] = [],
): Promise<QuestionWithMetadata[]> {
  return (await ah()).ahForTopic(slug, count, newSeed, Math.random, exclude, heldCards(held));
}

/**
 * The Advanced Higher cards a sheet already holds, for the family rule: a
 * paper card by its printed badge, a generated one by the card behind it.
 * Generating across a topic then takes one of a family (the Euclid cards,
 * say) before a second of anything (the owner, 2026-10-04).
 */
function heldCards(held: readonly QuestionWithMetadata[]): string[] {
  return held.flatMap(q => {
    const card = q.uid?.startsWith(`${GENERATED_UID_PREFIX}:`) ? q.basedOn?.[0] : paperRef(q.question);
    return card ? [card] : [];
  });
}

/**
 * What a worksheet already holds, in the form the engine excludes on.
 *
 * The keying is the engine's — it merges questions that differ only in their
 * variable letters, and ignores where a figure's lines happen to fall — so it
 * is asked for rather than reimplemented here, where it would drift.
 *
 * Past paper questions go through it harmlessly: nothing generated matches one.
 */
export function worksheetKeys(
  questions: readonly { question: string; answer?: string | null; coreKey?: string }[],
): string[] {
  // Both keys per question: a sheet rejects a repeat of the whole question and
  // a repeat of its sum in a new story, and an exclusion list carrying only the
  // first lets the second back in on the next click.
  // An Advanced Higher thin card's core too (`ah/cores.ts`), so a sheet that adds
  // more questions takes a fresh equation first (the owner, 2026-10-05). The engine
  // treats it as a preference, never a refusal.
  return questions.flatMap(q => (q.coreKey ? [...keysOfQuestion(q), q.coreKey] : keysOfQuestion(q)));
}

/**
 * A fresh seed for a new question.
 *
 * Its length and its characters come from the link format rather than being
 * chosen here: the seed has to survive a round trip through a URL as a
 * fixed-width token, so it is the link's business and this follows it. Since
 * 2026-10-01 that is four characters of the short link alphabet (no vowels,
 * none of 0, 1, 3, 4, 5), and a seed that spells a listed string is drawn
 * again, so the link it travels in starts clean. Seeds made before then, six
 * base36 characters, still make exactly the question they always did.
 *
 * Built a character at a time rather than from `Math.random().toString(36)`,
 * which yields a short string whenever the draw happens to be small — and a
 * short seed is one the link cannot carry.
 */
export function newSeed(): string {
  for (;;) {
    let s = '';
    for (let i = 0; i < SHORT_SEED_LENGTH; i++) {
      s += LINK_ALPHABET[Math.floor(Math.random() * LINK_ALPHABET.length)];
    }
    if (!spellsInLink(s)) return s;
  }
}

export { GENERATED_UID_PREFIX, generatedUid } from './generator/worksheet-question';
export type { ToWorksheetOptions } from './generator/worksheet-question';
