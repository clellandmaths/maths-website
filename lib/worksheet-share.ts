import type { QuestionWithMetadata } from '@/lib/data-loader';
import { packRef, decodeRefs } from '@/lib/worksheet-refs.mjs';

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
}

export const NO_OPTIONS: WorksheetOptions = { answers: false, qrCodes: false, video: false };

const FLAGS: [keyof WorksheetOptions, string][] = [
  ['answers', 'a'],
  ['qrCodes', 'q'],
  ['video', 'v'],
];

export function encodeOptions(o: WorksheetOptions): string {
  return FLAGS.filter(([key]) => o[key]).map(([, flag]) => flag).join('');
}

export function decodeOptions(s: string | null): WorksheetOptions {
  const set = new Set((s ?? '').toLowerCase());
  return { answers: set.has('a'), qrCodes: set.has('q'), video: set.has('v') };
}

export interface SharedWorksheet {
  courseId: string;
  refs: string[];
  title?: string;
  options: WorksheetOptions;
}

/** "2026-1-4" for one question. */
export function questionRef(q: QuestionWithMetadata): string {
  return `${q.year}-${q.paperNumber}-${q.questionIndex}`;
}

export function encodeWorksheet(courseId: string, questions: QuestionWithMetadata[]): string {
  const params = new URLSearchParams();
  params.set('c', courseId);
  // Anything that will not pack falls back to its spelled-out reference, so a
  // question outside the ranges costs length rather than dropping out of the
  // sheet. The build gate exists so this never actually happens.
  const packed = questions.map(q => packRef(q));
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
 * so it can say so.
 */
export function resolveWorksheet(
  refs: string[],
  available: QuestionWithMetadata[]
): { questions: QuestionWithMetadata[]; missing: number } {
  const byRef = new Map(available.map(q => [questionRef(q), q]));
  const questions: QuestionWithMetadata[] = [];
  let missing = 0;
  for (const ref of refs) {
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
