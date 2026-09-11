import type { GeneratedQuestion } from './generators/types';

/**
 * A generated question, in the shape the website shows questions in.
 *
 * **Why this lives here and not in the website.** The mapping needs to be
 * checked by running it, and the checks live in this repo — the website has no
 * way to execute TypeScript and adding one would put a build dependency on the
 * repo that deploys the live site. So the mapping is here, where `adapter.ts`
 * can drive it, and `website-v1/lib/generated-question.ts` is a three-line file
 * that assigns the result to `QuestionWithMetadata`.
 *
 * That assignment is the drift check, and it is a good one: if the website
 * changes its question shape, or this drifts from it, `next build` fails at
 * that line. Nothing has to remember to compare them.
 *
 * The generator already carries `webTopics` — the website's own taxonomy, in
 * the website's own spelling — for the same reason. Where the two sides
 * disagree, this side adapts.
 */
export interface WorksheetQuestion {
  question: string;
  answer: string;
  steps?: string[];
  stepMarks?: number[];
  marks?: number[];
  topics: string[];
  videoId: string;
  timestamp: string;
  year: number | string;
  paperNumber: number;
  questionIndex: number;
  questionNumber: string;
  label?: string;
  uid?: string;
}

/** Marks the boundary between the two sources in a share link and a basket. */
export const GENERATED_UID_PREFIX = 'g';

/**
 * A generated question's identity: its variation's permanent code and its seed.
 *
 * Not the question's text, and not its position on the sheet. The pair is what
 * `withSeed` needs to make the question again, so it is both the identity and
 * the recipe — which is what lets a whole sheet travel as a list of these.
 *
 * See `generators/variation-codes.ts` for why the code is not the variation id,
 * and why it never changes.
 */
export function generatedUid(code: string, seed: string): string {
  return `${GENERATED_UID_PREFIX}:${code}:${seed}`;
}

export interface ToWorksheetOptions {
  /** The seed this question was generated from. Half of its identity. */
  seed: string;
  /** Position on the sheet. Only used for the synthesised paper fields. */
  index: number;
}

/**
 * `GeneratedQuestion` → the website's question shape.
 *
 * Modelled on `toPresenterQuestions()` in the website's `specials-loader.ts`,
 * which is the existing precedent for feeding a non-paper source into that
 * shape by synthesising the paper fields. Everything downstream — the Explorer,
 * the basket, the worksheet page, print — then treats it as an ordinary
 * question, which is the point: **a generated question must display exactly
 * the way a paper one does.**
 *
 * Throws rather than returning null. Every failure here is a mistake at the
 * boundary — a warm-up that slipped past the picker, a Higher question with no
 * code — and a sheet that quietly dropped a question would be a sheet the
 * teacher previewed and the pupil did not get.
 */
export function toWorksheetQuestion(
  q: GeneratedQuestion,
  { seed, index }: ToWorksheetOptions,
): WorksheetQuestion {
  // Warm-ups are not ported. `offeredVariationIds()` is the list the picker
  // works from, and `codes.ts` proves it is the exam tier exactly. This is the
  // guard behind that filter, because a filter is the thing a future caller
  // forgets to apply.
  if (q.difficulty !== 'exam') {
    throw new Error(
      `toWorksheetQuestion: ${q.variationId ?? q.subTopic} is tier ` +
      `'${q.difficulty ?? 'unset'}'. Only exam-tier variations go on a sheet.`);
  }
  if (!q.code) {
    throw new Error(
      `toWorksheetQuestion: ${q.variationId ?? q.subTopic} carries no variation code, ` +
      'so nothing could regenerate it from a shared link. Only National 5 has codes.');
  }

  // Joined the way this generator's own UI joins them, so what a teacher
  // previews there and what a pupil gets are the same question. One of these
  // lines may be an inline <svg>, which carries its own width and needs no
  // website CSS — see "The display requirement" in the porting plan.
  const question = q.questionLines.join('<br><br>');

  // The total, as one part — not the per-step split.
  //
  // The website's `Marks` prints `marks` as a per-*part* breakdown whenever
  // there is more than one entry. A generated question handing it [1, 1, 1]
  // would read "(1, 1, 1) 3 Marks", as though the pupil were answering three
  // lettered parts; a paper question worth three marks in one part reads
  // "3 Marks". The per-step split is a different fact and travels as one.
  const total = q.stepMarks?.reduce((a, b) => a + b, 0);

  return {
    question,
    answer: q.finalAnswer,
    steps: q.solutionSteps,
    stepMarks: q.stepMarks,
    ...(total ? { marks: [total] } : {}),
    topics: q.webTopics ?? [],
    // No video stands behind a generated question and none ever will — the
    // worked steps are what it has instead. Every surface on the site already
    // reads an empty videoId as "no video", which is why this is '' rather
    // than absent.
    videoId: '',
    timestamp: '',

    // The synthesised paper fields. `specials-loader.ts` does the same for
    // guided practice, for the same reason: the shape requires them and a
    // generated question has no paper.
    year: '',
    paperNumber: 0,
    questionIndex: index,
    questionNumber: String(index + 1),

    // The caption. The website's `questionLabel()` prefers this, and without it
    // the sheet would read " Paper 0 Q1". The skill is what the teacher picked,
    // so it is what the caption should say.
    label: q.subTopic,

    uid: generatedUid(q.code, seed),
  };
}
