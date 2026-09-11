import { generateQuestion, withSeed } from './generator';
import {
  N5_VARIATIONS, variationsBasedOn, variationsForSubtopic,
} from './generators/n5-variations';
import { VARIATION_BY_CODE, VARIATION_CODES } from './generators/variation-codes';
import { questionKey } from './question-key';
import type { GeneratedQuestion, Topic } from './generators/types';

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
  /**
   * The past paper questions this was modelled on, **best first**.
   *
   * The website turns the first of these into a video link, so a pupil meeting
   * a generated question can watch the original being worked. Empty for
   * anything with no registry behind it.
   */
  basedOn?: string[];
  /**
   * Which of `basedOn` the video should be, as an index into it.
   *
   * 0 - the most recent paper - unless the caller knew better. `similarTo`
   * does: a teacher clicking "Variation" on a 2014 question was looking at the
   * 2014 question, so that is the video they and their pupils get.
   *
   * **It is in the uid, and therefore in the link.** That is the whole point:
   * a pupil's browser resolves the question from the link alone, so anything
   * not carried there cannot be recovered, and teacher and pupil would differ.
   */
  parentIndex?: number;
}

/**
 * Paper labels ordered most recent first.
 *
 * A variation can be modelled on several past paper questions - 63 of the 197
 * offered are - so something has to choose which one's video to offer. The most
 * recent is the one whose wording and marking most resemble what a pupil is
 * sitting now.
 *
 * **Ordered here rather than chosen by the caller, and this matters.** The
 * question a teacher clicked "Variation" on is not necessarily the one that
 * ends up first, which is a small loss - but the alternative is worse: a link
 * carries only the code and the seed, so a pupil's copy has no way to know
 * which question the teacher was looking at. Choosing per-caller would mean the
 * teacher and the pupil saw different videos under identical questions, and
 * nothing on either screen would say so.
 */
function bestFirst(labels: readonly string[]): string[] {
  const rank = (s: string) => {
    const m = /^(\d{4}) P(\d) Q(\d+)/.exec(s.trim());
    return m ? Number(m[1]) * 10000 + Number(m[2]) * 100 + Number(m[3]) : -1;
  };
  return [...labels].sort((a, b) => rank(b) - rank(a));
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
export function generatedUid(code: string, seed: string, parentIndex = 0): string {
  return `${GENERATED_UID_PREFIX}:${code}:${seed}:${parentIndex.toString(36)}`;
}

export interface ToWorksheetOptions {
  /** The seed this question was generated from. Half of its identity. */
  seed: string;
  /** Position on the sheet. Only used for the synthesised paper fields. */
  index: number;
  /** Which of the variation's papers the video is of. Defaults to the most recent. */
  parentIndex?: number;
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
  { seed, index, parentIndex = 0 }: ToWorksheetOptions,
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
  const meta = q.variationId ? N5_VARIATIONS[q.variationId] : undefined;

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

    // The papers behind this question, so the website can offer the original
    // being worked as a tutorial. Ordered here so that the teacher's copy and
    // every pupil's copy agree on which video that is.
    ...(meta?.basedOn?.length
      ? { basedOn: bestFirst(meta.basedOn), parentIndex }
      : {}),

    uid: generatedUid(q.code, seed, parentIndex),
  };
}

/**
 * Fresh questions modelled on one past paper question.
 *
 * "Add a variation of this" in the Explorer. The label is the paper's own -
 * `'2023 P1 Q8'` - and it should be read from the question's printed badge
 * rather than rebuilt from metadata, because one surface synthesises its
 * question numbers and would produce a plausible, wrong label.
 *
 * **Why this does not wrap `questionsLike()`.** That draws unseeded, and a seed
 * cannot be attached to a question after the fact: the seed is what *produces*
 * the question. A `uid` carrying a seed that did not make the question would
 * regenerate something else from a shared link - silently, and only for the
 * pupil. So these are drawn through `questionFromCode`, the same path a link
 * resolves through, and every one that comes back is shareable.
 *
 * `questionsLike()` stays as it is: the right shape for a caller that only
 * wants to *show* questions and never needs to name them again.
 *
 * The seed comes from the caller because its shape belongs to the link rather
 * than to the generator - six base36 characters, fixed by `worksheet-refs.mjs`.
 *
 * Sequential, necessarily: the stream is module-level.
 *
 * Returns fewer than asked when the variations cannot make that many
 * *different* questions. That is a property of the variation, not a failure -
 * `pool.ts` reports which are thin. Handing back the same question twice would
 * be worse than handing back one.
 */
export async function similarTo(
  paperLabel: string,
  count: number,
  makeSeed: () => string,
): Promise<WorksheetQuestion[]> {
  // Exam tier only. `variationsBasedOn` does not filter, and a warm-up would be
  // refused by `toWorksheetQuestion` anyway - better not to draw it at all.
  return drawFrom(
    variationsBasedOn(paperLabel).filter(id => N5_VARIATIONS[id]?.difficulty === 'exam'),
    count, makeSeed,
    // The teacher was looking at THIS question, so it is the video they get -
    // and because the index travels in the uid, their pupils get it too.
    // Measured before adding it: without this, 138 of 335 question/variation
    // pairs offered a sibling paper's video instead. Not wrong, since a sibling
    // is the same question shape, but surprising on a sheet built from 2014.
    (id) => parentIndexOf(id, paperLabel));
}

/** Where `paperLabel` sits in a variation's papers, best-first. 0 if unknown. */
function parentIndexOf(variationId: string, paperLabel: string): number {
  const stem = (s: string) => s.trim().replace(/([a-z])$/, '');
  const papers = bestFirst(N5_VARIATIONS[variationId]?.basedOn ?? []);
  const at = papers.findIndex(p => stem(p) === stem(paperLabel));
  return at === -1 ? 0 : at;
}

/**
 * Fresh questions across a set of the website's own subtopics.
 *
 * What the Explorer's filter produces. A teacher who has narrowed to
 * "Rationalising the denominator" and "Simplifying surds" can ask for five more
 * on the same footing, without meeting a second topic picker - the filter is
 * already the topic list, in the website's own words.
 *
 * Draws across all the matching variations rather than exhausting one, so five
 * questions over two subtopics gives both rather than five of whichever came
 * first.
 *
 * Empty when nothing files under any of them. Returns short when the variations
 * cannot make that many *different* questions.
 */
export async function generateForSubtopics(
  subtopics: readonly string[],
  count: number,
  makeSeed: () => string,
): Promise<WorksheetQuestion[]> {
  // Interleaved, not concatenated. `drawFrom` walks its candidates in order, so
  // a flat list of "everything under the first subtopic, then everything under
  // the second" balances by how many variations each happens to have: filtering
  // to two topics and asking for six returned six of the first. Taking one from
  // each subtopic in turn, then a second from each, gives the teacher the
  // topics they picked rather than the topics with the most variations.
  const perSubtopic = subtopics.map(s => variationsForSubtopic(s));
  const ids: string[] = [];
  for (let rank = 0; ; rank++) {
    let anyLeft = false;
    for (const list of perSubtopic) {
      if (rank >= list.length) continue;
      anyLeft = true;
      // A variation can carry more than one subtopic - 42 of them do - so a
      // filter naming two of its tags must not make it twice as likely.
      if (!ids.includes(list[rank])) ids.push(list[rank]);
    }
    if (!anyLeft) break;
  }
  return drawFrom(ids, count, makeSeed);
}

/**
 * Draw `count` different questions from a set of variations.
 *
 * Shared by both of the above, because they differ only in which variations are
 * candidates - and a second copy of this is exactly where the two would drift
 * apart on seeding, ordering or distinctness.
 *
 * Sequential, necessarily: the stream is module-level, so overlapping draws
 * take each other's numbers.
 */
async function drawFrom(
  ids: readonly string[],
  count: number,
  makeSeed: () => string,
  parentFor: (variationId: string) => number = () => 0,
): Promise<WorksheetQuestion[]> {
  if (!ids.length) return [];

  const seen = new Set<string>();
  const out: WorksheetQuestion[] = [];
  // Bounded the way `questionsLike` is: a thin variation returns short rather
  // than spinning after a question that does not exist.
  for (let draw = 0; draw < count * 8 && out.length < count; draw++) {
    // Round-robin rather than random, so asking for three across two variations
    // gives both rather than the same one three times by chance.
    const id = ids[draw % ids.length];
    const made = await questionFromCode(
      VARIATION_CODES[id], makeSeed(), out.length, parentFor(id));
    if (!made) continue;
    // Not the raw text: `x^2+5x+6` and `y^2+5y+6` are one question, and handing
    // a teacher both is handing them the same question twice.
    const key = questionKey({ questionLines: [made.question], finalAnswer: made.answer });
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(made);
  }
  return out;
}

/**
 * The one way a generated question is made, from its code and its seed.
 *
 * **Both sides of the promise run through here.** The builder calls it to show
 * a teacher a question; `resolveWorksheet` calls it to make that same question
 * again in every pupil's browser. If those were two call sites that merely
 * agreed, "the sheet is what the teacher previewed" would hold until someone
 * changed one of them.
 *
 * The draw is `generateQuestion` narrowed to the one variation, which retries
 * until that variation comes up. How many retries that takes depends on what
 * else lives in the topic - but it is the same number every time for a given
 * seed, which is all reproducibility needs. It is also why the builder must not
 * draw some other way.
 *
 * **Never run two of these at once.** `withSeed` sets a module-level stream, so
 * overlapping calls draw from each other and neither reproduces. Sequential
 * `for ... await`, never `Promise.all`. See the note on `withSeed` itself.
 *
 * Returns null when the code names no variation - a link made by a newer
 * version of the site, or a variation withdrawn since. The caller counts that
 * as a missing question rather than substituting a different one, which is the
 * same thing the paper path does with a reference it cannot resolve.
 */
export async function questionFromCode(
  code: string,
  seed: string,
  index: number,
  parentIndex = 0,
): Promise<WorksheetQuestion | null> {
  const variationId = VARIATION_BY_CODE[code];
  if (!variationId) return null;
  const meta = N5_VARIATIONS[variationId];
  if (!meta) return null;

  const q = await withSeed(seed, () =>
    generateQuestion([meta.topic as Topic], { variationIds: [variationId] }));
  return toWorksheetQuestion(q, { seed, index, parentIndex });
}
