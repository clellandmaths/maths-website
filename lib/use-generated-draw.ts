'use client';

import { useRef, useState } from 'react';
import { appendToSession, sessionItems, useWorksheetOptional } from '@/lib/worksheet-context';
import type { QuestionWithMetadata } from '@/lib/data-loader';

/**
 * Drawing generated questions, on any page.
 *
 * Every surface that offers "another one" needs the same four things, and each
 * of them is a trap that has already been paid for once:
 *
 *   **The engine is loaded at the click.** `await import()`, never a top-level
 *   import. It is ~33,000 lines in 645 KB of lazy chunks, and it is on 0 of 520
 *   pages — `scripts/check-engine-isolation.mjs` fails the build if that stops
 *   being true.
 *
 *   **Draws are sequential.** The generator's random stream is module-level, so
 *   concurrent draws steal each other's numbers: a measured ten-question
 *   `Promise.all` changed all ten, and two concurrent runs did not agree with
 *   each other.
 *
 *   **An exclude set is always passed**, covering what is on the sheet *and*
 *   everything this control has already shown. Without one the engine has no
 *   memory between calls: ten clicks on a six-deep pool gave six byte-identical
 *   repeats, and the basket's own guard does not catch them because it keys on
 *   the uid, which carries the seed.
 *
 *   **The basket may not exist.** Practice, notes and paper pages have no
 *   `WorksheetProvider`. Mounting a second one around the control is the
 *   obvious fix and is wrong — two providers write the same storage key and the
 *   last render wins — so it uses the context when there is one and writes to
 *   the session directly when there is not.
 */
export type DrawState = 'idle' | 'drawing' | 'exhausted' | 'failed';

/**
 * The past paper index, built at most once per page and shared by every control
 * on it.
 *
 * A generated question has no filmed solution of its own; the paper question it
 * was modelled on does, and watching that worked is the tutorial. **Attaching
 * it is done here rather than left to callers**, because three call sites
 * forgot: the Explorer's re-roll dropped it and took the QR code and both
 * full-screen modes' video links with it, and the practice control forgot it
 * too. A caller that has to remember is a caller that will not.
 */
let paperIndex: Map<string, QuestionWithMetadata> | null = null;

async function withVideo(q: QuestionWithMetadata): Promise<QuestionWithMetadata> {
  const { byPaperLabel, withParentVideo } = await import('@/lib/similar-questions');
  if (!paperIndex) {
    const { getAllN5Questions } = await import('@/lib/data-loader');
    paperIndex = byPaperLabel(await getAllN5Questions());
  }
  return withParentVideo(q, paperIndex);
}

export interface GeneratedDraw {
  state: DrawState;
  /** How many this control has drawn, whether or not they were kept. */
  seen: number;
  /** Draw one. Null when the pool is spent or the draw failed. */
  one: () => Promise<QuestionWithMetadata | null>;
  /** Draw several and put them on the sheet. Returns how many landed. */
  toSheet: (want: number) => Promise<number>;
  reset: () => void;
}

/**
 * @param courseId  gates everything; National 5 is the only course with audited
 *                  variations, and elsewhere the control must be absent
 * @param drawOne   how to get one question — the caller supplies this because
 *                  "like this question" and "on this topic" are different calls
 */
export function useGeneratedDraw(
  courseId: string | undefined,
  drawOne: (
    engine: typeof import('@/lib/generated-question'),
    exclude: readonly QuestionWithMetadata[],
  ) => Promise<QuestionWithMetadata | null>,
): GeneratedDraw {
  const [state, setState] = useState<DrawState>('idle');
  const [seen, setSeen] = useState(0);
  const drawn = useRef<QuestionWithMetadata[]>([]);
  const basket = useWorksheetOptional();

  /** Everything off the table: the sheet, plus what this control has shown. */
  const exclude = (): QuestionWithMetadata[] => {
    const held = basket ? basket.items : (courseId ? sessionItems(courseId) : []);
    return [...held, ...drawn.current];
  };

  const one = async (): Promise<QuestionWithMetadata | null> => {
    if (!courseId) return null;
    setState('drawing');
    try {
      const engine = await import('@/lib/generated-question');
      const raw = await drawOne(engine, exclude());
      if (!raw) { setState('exhausted'); return null; }
      const made = await withVideo(raw);
      drawn.current = [...drawn.current, made];
      setSeen(n => n + 1);
      setState('idle');
      return made;
    } catch {
      setState('failed');
      return null;
    }
  };

  const toSheet = async (want: number): Promise<number> => {
    if (!courseId) return 0;
    setState('drawing');
    try {
      const engine = await import('@/lib/generated-question');
      const made: QuestionWithMetadata[] = [];
      // One at a time. See the note above about the module-level random stream.
      for (let i = 0; i < want; i++) {
        const q = await drawOne(engine, [...exclude(), ...made]);
        if (!q) break;
        made.push(await withVideo(q));
      }
      drawn.current = [...drawn.current, ...made];
      setSeen(n => n + made.length);
      // Through the provider when there is one, so the Explorer's own list
      // updates; straight to the session otherwise.
      if (basket) made.forEach(q => basket.addItem(q));
      else appendToSession(courseId, made);
      // Short is not a failure, but it must not pass in silence.
      setState(made.length < want ? 'exhausted' : 'idle');
      return made.length;
    } catch {
      setState('failed');
      return 0;
    }
  };

  const reset = () => { setState('idle'); };

  return { state, seen, one, toSheet, reset };
}
