import type { QuestionWithMetadata } from '@/lib/data-loader';

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

export interface SharedWorksheet {
  courseId: string;
  refs: string[];
  title?: string;
}

/** "2026-1-4" for one question. */
export function questionRef(q: QuestionWithMetadata): string {
  return `${q.year}-${q.paperNumber}-${q.questionIndex}`;
}

export function encodeWorksheet(courseId: string, questions: QuestionWithMetadata[]): string {
  const params = new URLSearchParams();
  params.set('c', courseId);
  params.set('q', questions.map(questionRef).join(SEP));
  return params.toString();
}

/** Reads ?c=&q=&t= off a query string. Null when there is no sheet in it. */
export function decodeWorksheet(search: string): SharedWorksheet | null {
  const params = new URLSearchParams(search);
  const courseId = params.get('c');
  const q = params.get('q');
  if (!courseId || !q) return null;
  const refs = q.split(SEP).map(r => r.trim()).filter(Boolean);
  if (!refs.length) return null;
  return { courseId, refs, title: params.get('t') ?? undefined };
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
  title?: string
): { editable: string; locked: string } {
  const base = encodeWorksheet(courseId, questions);
  const locked = new URLSearchParams(base);
  if (title?.trim()) locked.set('t', title.trim());
  return {
    editable: `${origin}/explorer?${base}`,
    locked: `${origin}/worksheet?${locked.toString()}`,
  };
}
