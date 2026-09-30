import type { QuestionWithMetadata } from '@/lib/data-loader';
import {
  packRef, decodeRefs, packGenerated, parseGeneratedRef,
} from '@/lib/worksheet-refs.mjs';
import { byPaperLabel, withParentVideo } from '@/lib/similar-questions';
import { paperRef } from '@/lib/question-number.mjs';

/**
 * Sharing a worksheet as a link.
 *
 * The site is a static export with no backend, so a shared sheet has to travel
 * in the URL. It does not need to carry the questions themselves — every one is
 * already on the site — only which ones, so a twenty-question sheet is about
 * two hundred characters and the question text a recipient sees is always the
 * current version rather than a snapshot.
 *
 *   /explorer?c=n5&q=2026-1-4,2025-2-3        editable — loads into their sheet
 *   /worksheet?c=n5&q=...&t=Mr+Cloud's+...    locked handout with a title
 *
 * A reference is year-paper-index. The index is the question's position in its
 * paper rather than its printed number, because printed numbers contain
 * brackets — "6(b)-(c)" — which are noise once URL-encoded. Positions are
 * stable: the papers are historical documents, and check-paper-registry fails
 * the build if a paper's question count ever changes.
 */

const SEP = ',';

/**
 * What the person who built the handout decided their pupils get.
 *
 * These belong to the maker, not the reader: setting homework and handing out
 * the answers with it are different acts, and a recipient should not be able to
 * undo the choice with a toggle. They ride in the link as a short flag string —
 * "o=aqv" — so a link with no `o` is a plain question sheet.
 *
 * Working through the sheet full screen is deliberately NOT one of these. It
 * changes how a pupil reads the questions, not what they are given, so it is
 * always available and simply obeys whatever the maker chose here.
 */
export interface WorksheetOptions {
  answers: boolean;   // a — pupils can reveal the answers
  qrCodes: boolean;   // q — QR codes to the video solutions on the printout
  video: boolean;     // v — a watch-solution button
  /**
   * h — staged help: what the question asks, then how the marks are earned,
   * then the worked steps where the question has them.
   *
   * Separate from `answers` on purpose. A hint and an answer are different
   * things to hand a pupil: one gets them started, the other ends the
   * exercise. A teacher setting homework may well want the first and not the
   * second, and off by default means neither travels unless it was chosen.
   */
  hints: boolean;
  /**
   * t — test mode: each question is headed by its number and its marks and
   * nothing else. No paper reference, topic or variation name, which on a test
   * would tell a pupil what the question is about before they have read it
   * (the owner, 2026-09-28). The questions themselves are unchanged.
   */
  test: boolean;
}

export const NO_OPTIONS: WorksheetOptions = {
  answers: false, qrCodes: false, video: false, hints: false, test: false,
};

const FLAGS: [keyof WorksheetOptions, string][] = [
  ['answers', 'a'],
  ['qrCodes', 'q'],
  ['video', 'v'],
  ['hints', 'h'],
  ['test', 't'],
];

/**
 * **What Test mode switches off, and keeps off** (the owner, 2026-09-28: Test
 * mode "should lock out the other options and make it clear they are locked
 * out until test mode unlocked"). A test hands out no answers, no hints and no
 * way to a worked solution. Held here as well as in the controls, so a handout
 * link edited by hand cannot carry answers into a test.
 */
export const LOCKED_BY_TEST: readonly (keyof WorksheetOptions)[] = ['answers', 'video', 'qrCodes', 'hints'];

export function underTest(o: WorksheetOptions): WorksheetOptions {
  if (!o.test) return o;
  const out = { ...o };
  for (const key of LOCKED_BY_TEST) out[key] = false;
  return out;
}

export function encodeOptions(o: WorksheetOptions): string {
  const kept = underTest(o);
  return FLAGS.filter(([key]) => kept[key]).map(([, flag]) => flag).join('');
}

export function decodeOptions(s: string | null): WorksheetOptions {
  const set = new Set((s ?? '').toLowerCase());
  return underTest({
    answers: set.has('a'),
    qrCodes: set.has('q'),
    video: set.has('v'),
    hints: set.has('h'),
    test: set.has('t'),
  });
}

export interface SharedWorksheet {
  courseId: string;
  refs: string[];
  title?: string;
  options: WorksheetOptions;
}

/**
 * "2026-1-4" for a paper question, "g:xqt6z:3f9a1b" for a generated one.
 *
 * A generated question has no paper, so its `uid` — variation code and seed —
 * is its reference. It is the same string the basket dedupes on, which is the
 * point: one identity, whatever the source.
 */
export function questionRef(q: QuestionWithMetadata): string {
  return q.uid ?? `${q.year}-${q.paperNumber}-${q.questionIndex}`;
}

/**
 * Did this question come from the generator rather than a past paper?
 *
 * Asked of the reference rather than of a field, so there is one answer to
 * "where did this come from" and the link, the basket and the printed
 * attribution all read it the same way.
 */
export function isGenerated(q: QuestionWithMetadata): boolean {
  return parseGeneratedRef(questionRef(q)) !== null;
}

/**
 * "Calculator" or "Non-calculator": what a pupil needs to know before starting
 * a question, on every card, past paper or generated, in test mode too. Null
 * for a question with no paper behind it (a skills question).
 *
 * The owner, 2026-09-30: generated questions did not say which paper they were
 * like, and test mode took the paper away with the rest of the reference; then,
 * "just have a label somehow for calculator and non calculator questions",
 * never "Paper 1" for a year or course that has one paper, as that confuses.
 *
 * Every course's Paper 1 is the non-calculator paper and its Paper 2 the
 * calculator one (the marking instructions say so: "Paper-1-Non-calculator").
 * A label with no paper in it is a one-paper course or year, and both are
 * calculator: Higher Applications ("2022 Q1") and Advanced Higher before its
 * two papers ("2019 Q4").
 *
 * Read from the question's own label, "2024 P1 Q3", or for a generated one from
 * the paper question it was modelled on, the same `basedOn[parentIndex]` its
 * printed markscheme names. No N5 variation cites both papers (measured
 * 2026-09-30: 160 Paper 1 only, 168 Paper 2 only, 44 none), so that label is
 * the variation's paper, not a guess among several.
 */
export function calculatorLabel(q: QuestionWithMetadata, courseId: string): string | null {
  const ref = isGenerated(q) ? q.basedOn?.[q.parentIndex ?? 0] : paperRef(q.question);
  if (!ref) return null;
  const paper = /\bP([12])\b/.exec(ref)?.[1];
  if (paper) return paper === '1' ? 'Non-calculator' : 'Calculator';
  return courseId === 'ah' || courseId === 'higher-apps' ? 'Calculator' : null;
}

export function encodeWorksheet(courseId: string, questions: QuestionWithMetadata[]): string {
  const params = new URLSearchParams();
  params.set('c', courseId);
  // Anything that will not pack falls back to its spelled-out reference, so a
  // question outside the ranges costs length rather than dropping out of the
  // sheet. The build gate exists so this never actually happens.
  const packed = questions.map(q => {
    // A generated question packs to its own twelve-character token. Both shapes
    // go in one ordered stream, because the order of a sheet is part of it.
    const gen = parseGeneratedRef(questionRef(q));
    return gen ? packGenerated(gen.code, gen.seed, gen.parentIndex) : packRef(q);
  });
  const q = packed.every(Boolean)
    ? packed.join('')
    : questions.map(questionRef).join(SEP);
  params.set('q', q);
  return params.toString();
}

/** Reads ?c=&q=&t= off a query string. Null when there is no sheet in it. */
export function decodeWorksheet(search: string): SharedWorksheet | null {
  const params = new URLSearchParams(search);
  const courseId = params.get('c');
  const q = params.get('q');
  if (!courseId || !q) return null;
  const refs = decodeRefs(q);
  if (!refs.length) return null;
  return {
    courseId,
    refs,
    title: params.get('t') ?? undefined,
    options: decodeOptions(params.get('o')),
  };
}

/**
 * Turn references back into questions, in the order they were shared.
 *
 * Anything that does not resolve is dropped rather than faked — a link built
 * against a paper that has since been re-split should lose that one question,
 * not silently show a different one. The caller is told how many went missing
 * so it can say so. A generated question whose code names no variation is
 * treated exactly the same way.
 *
 * ## One at a time, and this is not a style preference
 *
 * Generated questions are regenerated from their seed, and the generator's
 * random stream is **module-level**. Two overlapping `withSeed` calls draw from
 * each other. Measured rather than assumed: resolving a ten-question sheet with
 * `Promise.all` changed **all ten** questions, and two concurrent runs did not
 * even match each other — so every pupil would get a different sheet, and a
 * different one each time they opened the link. That is the exact failure this
 * whole phase exists to prevent.
 *
 * So: sequential `for ... await`, never `Promise.all`, never `map` with
 * promises. `check-share-refs.mjs` fails if that ever appears here.
 *
 * Async because of it. The paper half is still a map lookup and costs nothing;
 * the engine is only imported once a link actually contains a generated
 * question, so a sheet of paper questions never loads it at all.
 */
export async function resolveWorksheet(
  refs: string[],
  available: QuestionWithMetadata[]
): Promise<{ questions: QuestionWithMetadata[]; missing: number }> {
  const byRef = new Map(available.map(q => [questionRef(q), q]));
  const questions: QuestionWithMetadata[] = [];
  let missing = 0;

  // Loaded on demand, and at most once. A static import here would put the
  // engine in the bundle of every page that can open a shared sheet.
  let engine: typeof import('./generated-question') | null = null;
  // Built once, and only if a generated question actually turns up: a sheet of
  // paper questions should not pay for a lookup it never reads.
  let byLabel: Map<string, QuestionWithMetadata> | null = null;

  for (const ref of refs) {
    const gen = parseGeneratedRef(ref);
    if (gen) {
      engine ??= await import('./generated-question');
      const made = await engine.questionFromCode(
        gen.code, gen.seed, questions.length, gen.parentIndex);
      if (made) {
        // The original being worked, as the tutorial for this one.
        byLabel ??= byPaperLabel(available);
        questions.push(withParentVideo(made, byLabel));
      } else {
        missing++;
      }
      continue;
    }
    const q = byRef.get(ref);
    if (q) questions.push(q);
    else missing++;
  }
  return { questions, missing };
}

/** The two links for a finished sheet. */
export function shareLinks(
  origin: string,
  courseId: string,
  questions: QuestionWithMetadata[],
  title?: string,
  options: WorksheetOptions = NO_OPTIONS
): { editable: string; locked: string } {
  const base = encodeWorksheet(courseId, questions);
  const locked = new URLSearchParams(base);
  if (title?.trim()) locked.set('t', title.trim());
  // The editable link carries no options: it hands over a working copy, and
  // the recipient's own Explorer controls what they see in it.
  const flags = encodeOptions(options);
  if (flags) locked.set('o', flags);
  return {
    editable: `${origin}/explorer?${base}`,
    locked: `${origin}/worksheet?${locked.toString()}`,
  };
}
