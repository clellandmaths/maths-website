import type { QuestionWithMetadata } from '@/lib/data-loader';
import { paperRef, withoutPaperBadge } from '@/lib/question-number.mjs';

/**
 * A question as Test mode hands it to full screen and Focus (the owner,
 * 2026-10-06: "Clicking test mode and opening full screen or focus mode anywhere
 * still gives topic names").
 *
 * No caption (`label` empty, so `questionLabel` gives nothing), no topic tags,
 * and no paper badge inside the question. The badge is where a past paper
 * question's calculator mark is read from, so its reference moves to `basedOn`,
 * which `calculatorLabel` reads next and which those two views otherwise read
 * only for a drawn twin, which Test mode does not offer.
 *
 * **Done by the two pages that have Test mode, not inside the views.** Full
 * screen and Focus are on every past paper and practice page, and the practice
 * pages had 195 bytes of JS budget to give; this file is imported by the
 * Worksheet Builder and the shared worksheet only.
 */
export function asTestQuestion(q: QuestionWithMetadata): QuestionWithMetadata {
  const ref = paperRef(q.question);
  return {
    ...q,
    question: withoutPaperBadge(q.question),
    label: '',
    topics: [],
    basedOn: q.basedOn ?? (ref ? [ref] : undefined),
  };
}
