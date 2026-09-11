/**
 * How many questions each topic contributes to a sheet, and in what order.
 *
 * This was inline in `App.tsx`, twice — once for the worksheet and once for the
 * board, near enough identical — and it could only do one thing: split the
 * total evenly and shuffle. A teacher building a homework wants neither. They
 * want six on the thing the class is weak at and two on everything else, and
 * they want to choose whether the sheet interleaves or works through a topic at
 * a time.
 *
 * Pure functions, no React, no randomness the caller cannot control: this is
 * the part worth checking, and `sheet-plan.ts`'s check does.
 */

import { random } from './generators/utils';

/** Whether a sheet works through one topic at a time, or interleaves. */
export type SheetOrder = 'shuffled' | 'grouped';

/**
 * Split `total` questions across `topics` as evenly as it goes.
 *
 * The remainder goes one each to the topics at the front of the list, so the
 * caller decides who benefits by deciding the order it passes. Generation
 * passes a shuffled list — with ten topics and five questions you want five
 * *random* topics, not the first five every time — and the count steppers pass
 * the list unshuffled, so the numbers they show sit still.
 *
 * A topic can be given 0. That is not a bug: asking for five questions across
 * ten topics means five of them do not appear, and dropping them silently is
 * exactly what the sheet does.
 */
export function evenSplit(topics: string[], total: number): Record<string, number> {
  const counts: Record<string, number> = {};
  if (topics.length === 0) return counts;

  const base = Math.floor(Math.max(0, total) / topics.length);
  const remainder = Math.max(0, total) % topics.length;
  topics.forEach((topic, i) => {
    counts[topic] = base + (i < remainder ? 1 : 0);
  });
  return counts;
}

/**
 * The topics to generate, one entry per question, in the order they appear.
 *
 * `grouped` follows `courseOrder` — the order the course lists its topics,
 * which is the order the picker shows them, so a grouped sheet reads down the
 * sidebar. It deliberately does *not* follow the order topics were clicked:
 * that is the order a teacher happened to tick boxes in, which is not an order
 * anything should be printed in.
 *
 * `shuffled` interleaves, which is what makes a revision sheet hard the way an
 * exam is: the pupil has to work out *which* method before applying it.
 */
export function planTopics(
  counts: Record<string, number>,
  order: SheetOrder,
  courseOrder: readonly string[],
): string[] {
  const entries = Object.entries(counts).filter(([, n]) => n > 0);

  // A topic the course does not list sorts to the end rather than to the front,
  // which is where indexOf's -1 would put it.
  const rank = (topic: string) => {
    const i = courseOrder.indexOf(topic);
    return i === -1 ? courseOrder.length : i;
  };
  entries.sort((a, b) => rank(a[0]) - rank(b[0]));

  const flat: string[] = [];
  for (const [topic, n] of entries) {
    for (let i = 0; i < n; i++) flat.push(topic);
  }

  return order === 'grouped' ? flat : shuffle(flat);
}

/**
 * Fisher-Yates.
 *
 * The two places this replaces both used `.sort(() => 0.5 - Math.random())`,
 * which is not a shuffle: the comparator is inconsistent, so the result depends
 * on the sort implementation and is measurably biased towards leaving things
 * where they were. It matters here — a "shuffled" sheet that keeps a topic's
 * questions near each other is the grouped sheet the teacher did not ask for.
 */
export function shuffle<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * What a sheet is worth, and how much of it is actually priced.
 *
 * `stepMarks` comes from the marking instructions and every N5 variation
 * carrying marks has it — but the older Higher and Apps variations do not, and
 * a total that quietly skips them would read as "this sheet is worth 12" when
 * it is worth 12 plus four unpriced questions. So the gap is returned rather
 * than absorbed, and the summary says so when there is one.
 */
export function sheetMarks(
  questions: readonly { stepMarks?: number[] }[],
): { marks: number; unpriced: number } {
  let marks = 0;
  let unpriced = 0;
  for (const q of questions) {
    if (q.stepMarks?.length) marks += q.stepMarks.reduce((a, b) => a + b, 0);
    else unpriced++;
  }
  return { marks, unpriced };
}
