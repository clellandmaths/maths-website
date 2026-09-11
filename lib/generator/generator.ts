import { Topic, TOPIC_GROUPS, ALL_TOPICS, GeneratedQuestion, COURSES } from './generators/types';
import { questionKey } from './question-key';
import { N5_VARIATIONS, variationsBasedOn, topicsBasedOn } from './generators/n5-variations';
import { VARIATION_CODES } from './generators/variation-codes';
import { mulberry32, random, seedFrom, setRandomStream } from './generators/utils';

export { type Topic, TOPIC_GROUPS, ALL_TOPICS, type GeneratedQuestion, COURSES };

/**
 * Narrow a request to particular variations.
 *
 * A generator picks its own variation inside its topic, so there is no way to
 * ask one for a specific shape. Drawing until the wanted one comes up is how
 * every check here already does it, and with two or three variations to a topic
 * it costs a few tries. The alternative — a `variationId` parameter threaded
 * through forty generator functions — buys precision nothing needs.
 */
export interface GenerateOptions {
  /** Only accept these variation ids. Topics are narrowed to match. */
  variationIds?: string[];
}

/**
 * Generate with a seed, so the same seed gives byte-identical questions.
 *
 * A shared worksheet link carries the seed, and `resolveWorksheet` regenerates
 * from it — so this is what makes a shared sheet the *same* sheet, today and
 * after a rebuild.
 *
 * **Not safe to run concurrently.** The stream is module-level, so two
 * overlapping `withSeed` calls would draw from each other. Generate
 * sequentially — `for (const t of tokens) await withSeed(...)`, never
 * `Promise.all`. The previous stream is restored on the way out, including
 * when `fn` throws, so nesting and failures leave nothing behind.
 */
export async function withSeed<T>(seed: number | string, fn: () => Promise<T> | T): Promise<T> {
  const prev = setRandomStream(mulberry32(seedFrom(seed)));
  try {
    return await fn();
  } finally {
    setRandomStream(prev);
  }
}

/** Enough draws that a one-in-five variation is missed about once in 10^5. */
const DRAW_LIMIT = 60;

export async function generateQuestion(
  topics: Topic[],
  options: GenerateOptions = {},
): Promise<GeneratedQuestion> {
  const wanted = options.variationIds?.length ? new Set(options.variationIds) : null;

  if (wanted) {
    // Narrow to the topics those variations actually live in, so each draw has
    // a real chance rather than wandering the whole selection.
    const home = new Set<string>();
    for (const id of wanted) {
      const meta = N5_VARIATIONS[id];
      if (meta) home.add(meta.topic);
    }
    const narrowed = (topics ?? []).filter(t => home.has(t));
    topics = (narrowed.length ? narrowed : [...home]) as Topic[];
    if (!topics.length) {
      throw new Error(`generateQuestion: no topic holds any of ${[...wanted].join(', ')}`);
    }
    for (let draw = 0; draw < DRAW_LIMIT; draw++) {
      const q = await generateQuestion(topics);
      if (q.variationId && wanted.has(q.variationId)) return q;
    }
    throw new Error(
      `generateQuestion: none of ${[...wanted].join(', ')} came up in ${DRAW_LIMIT} draws`,
    );
  }

  if (!topics || topics.length === 0) {
    topics = ALL_TOPICS;
  }
  const selected = topics[Math.floor(random() * topics.length)];

  let q: Partial<GeneratedQuestion>;
  
  // Every National 5 group, asked of the course rather than listed here.
  //
  // What this replaces was 26 group names spelled out, and it was one short:
  // "N5 Similarity" had been added to the course and not to the list, so its
  // topics fell through to Higher Maths and a similarity question generated a
  // perpendicular bisector. Nothing failed — the wrong question was a perfectly
  // good question. A list someone has to remember to update is a list that
  // rots, which is the same reason contexts.ts finds its own topics.
  const isN5 = Object.values(COURSES["National 5 Maths"]).some(ts => ts.includes(selected));
  if (isN5) {
    const { generateN5Question } = await import('./generators/n5');
    q = generateN5Question(selected);
  }
  else if (TOPIC_GROUPS["Sequences"].includes(selected)) {
    const { generateSequencesQuestion } = await import('./generators/sequences');
    q = generateSequencesQuestion(selected);
  }
  else if (TOPIC_GROUPS["Functions and Graphs"].includes(selected)) {
    const { generateFunctionsQuestion } = await import('./generators/functions');
    q = generateFunctionsQuestion(selected);
  }
  else if (TOPIC_GROUPS["Quadratics & Polynomials"].includes(selected)) {
    const { generateQuadraticsQuestion } = await import('./generators/quadratics');
    q = generateQuadraticsQuestion(selected);
  }
  else if (TOPIC_GROUPS["Differentiation"].includes(selected)) {
    const { generateDifferentiationQuestion } = await import('./generators/differentiation');
    q = generateDifferentiationQuestion(selected);
  }
  else if (TOPIC_GROUPS["Integration"].includes(selected)) {
    const { generateIntegrationQuestion } = await import('./generators/integration');
    q = generateIntegrationQuestion(selected);
  }
  else if (TOPIC_GROUPS["Trigonometry"].includes(selected)) {
    const { generateTrigonometryQuestion } = await import('./generators/trigonometry');
    q = generateTrigonometryQuestion(selected);
  }
  else if (TOPIC_GROUPS["Circle"].includes(selected)) {
    const { generateCircleQuestion } = await import('./generators/circle');
    q = generateCircleQuestion(selected);
  }
  else if (TOPIC_GROUPS["Exponentials & Logarithms"].includes(selected)) {
    const { generateLogsQuestion } = await import('./generators/logs');
    q = generateLogsQuestion(selected);
  }
  else if (TOPIC_GROUPS["Vectors"]?.includes(selected)) {
    const { generateVectorsQuestion } = await import('./generators/vectors');
    q = generateVectorsQuestion(selected);
  }
  else if (TOPIC_GROUPS["Finance"]?.includes(selected) || 
           TOPIC_GROUPS["Statistics"]?.includes(selected) ||
           TOPIC_GROUPS["Planning And Decision Making"]?.includes(selected) ||
           TOPIC_GROUPS["Modelling"]?.includes(selected)) {
    const { generateHigherAppsQuestion } = await import('./generators/apps');
    q = generateHigherAppsQuestion(selected);
  }
  else {
    const straightLine = await import('./generators/straight_line');
    if (selected === "Median") q = straightLine.generateMedianQuestion();
    else if (selected === "Altitude") q = straightLine.generateAltitudeQuestion();
    else if (selected === "Parallel Line") q = straightLine.generateParallelLineQuestion();
    else if (selected === "Perpendicular Line")
      q = straightLine.generatePerpendicularLineQuestion();
    else if (selected === "Collinearity") q = straightLine.generateCollinearityQuestion();
    else if (selected === "Angle with x-axis") q = straightLine.generateTanThetaQuestion();
    else if (selected === "Calculate Angle") q = straightLine.generateCalculateAngleQuestion();
    else if (selected === "Point of Intersection")
      q = straightLine.generateIntersectionQuestion();
    else if (selected === "Unknown Coordinate")
      q = straightLine.generateUnknownCoordinateQuestion();
    else q = straightLine.generatePerpBisectorQuestion();
  }

  // Find parent topic group
  let parentTopic = "Straight Line";
  for (const [group, groupTopics] of Object.entries(TOPIC_GROUPS)) {
    if (groupTopics.includes(selected)) {
      parentTopic = group;
      break;
    }
  }

  // The registry has the last word on the tier and the website's subtopics.
  //
  // Both are properties of the *variation*, not of the draw, and both are
  // already recorded in one place. A generator function writes `difficulty` by
  // hand and 194 of them do, which is 194 chances to disagree with the registry
  // — and they did disagree, because the tier means "a past paper stands behind
  // this" and only `basedOn` knows that. Overwriting here means the two cannot
  // drift again, rather than a check being asked to notice when they do.
  //
  // Anything the registry does not know — the Higher and Apps variations, which
  // have no registry — keeps whatever its generator set.
  const meta = q.variationId ? N5_VARIATIONS[q.variationId] : undefined;
  return {
    ...q,
    topic: parentTopic,
    ...(meta ? {
      difficulty: meta.difficulty,
      webTopics: meta.webTopics,
      // The code comes from its own table rather than from `meta`, so that a
      // public identifier is never something a variation's author sets in
      // passing. `__checks__/codes.ts` proves the two sets line up.
      code: VARIATION_CODES[q.variationId!],
    } : {}),
  } as GeneratedQuestion;
}

/**
 * Questions modelled on a particular past paper question.
 *
 * The point of `basedOn`: stand on 2023 P1 Q8 and ask for four more like it.
 * Returns fewer than asked only if the variations cannot produce that many
 * distinct questions, which is a property of the variation, not a failure.
 */
export async function questionsLike(
  paperLabel: string,
  count = 4,
): Promise<GeneratedQuestion[]> {
  const ids = variationsBasedOn(paperLabel);
  if (!ids.length) {
    throw new Error(`questionsLike: nothing is modelled on ${paperLabel}`);
  }
  const topics = topicsBasedOn(paperLabel) as Topic[];

  // Distinct, because four copies of one question is not four questions. Four
  // independent draws collide often enough to matter — with thirty possible
  // questions there is roughly a one in five chance of a repeat — so this draws
  // spares rather than handing a teacher a duplicate.
  //
  // Some variations genuinely cannot make many: the trigonometric identities
  // are fixed expressions and there are only so many. Returning what exists is
  // right; similar.ts reports each label's real capacity so the thin ones are
  // visible rather than silently short.
  const seen = new Set<string>();
  const out: GeneratedQuestion[] = [];
  for (let draw = 0; draw < count * 8 && out.length < count; draw++) {
    const q = await generateQuestion(topics, { variationIds: ids });
    // Not the raw text: `x^2+5x+6` and `y^2+5y+6` are one question, and
    // handing a teacher both is handing them the same question twice.
    const key = questionKey(q);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  return out;
}

