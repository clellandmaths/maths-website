import type { PracticeCourse, PracticeTopic, PracticeQuestion } from '@/src/practice/types';
import {
  getAllN5Questions,
  getAllHigherQuestions,
  getAllAHQuestions,
  getAllN5AppsQuestions,
  getAllHigherAppsQuestions,
  type QuestionWithMetadata,
} from '@/lib/data-loader';

// Guided practice loader.
//
// These imports are resolved at BUILD time by server components, so the
// question data is baked into prerendered HTML and never ships to the browser
// as JavaScript. That gives us both things we want: the questions are in the
// markup for search engines, and the client bundle does not grow.
//
// The rule that matters: never import a practice data module from a client
// component. Pass questions down as props instead.

const loaders: Record<string, () => Promise<PracticeCourse>> = {
  n5: () => import('@/src/practice/data/national5Maths').then(m => m.national5MathsPractice),
  higher: () => import('@/src/practice/data/higherMaths').then(m => m.higherMathsPractice),
  ah: () => import('@/src/practice/data/advancedHigherMaths').then(m => m.advancedHigherMathsPractice),
  'n5-apps': () => import('@/src/practice/data/national5Apps').then(m => m.national5AppsPractice),
  'higher-apps': () => import('@/src/practice/data/higherApps').then(m => m.higherAppsPractice),
};

/** Course ids that have guided practice, for conditional nav. */
export const COURSES_WITH_PRACTICE = Object.keys(loaders);

export function hasPractice(courseId: string): boolean {
  return courseId in loaders;
}

export async function getPracticeForCourse(courseId: string): Promise<PracticeCourse | null> {
  const load = loaders[courseId];
  if (!load) return null;
  try {
    return await load();
  } catch {
    return null;
  }
}

/** URL-safe id for a topic, e.g. "Arcs and Sectors" -> "arcs-and-sectors". */
export function topicSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export interface FoundTopic {
  topic: PracticeTopic;
  sectionId: string;
  sectionTitle: string;
  slug: string;
}

/** Every topic in a course, flattened, with its section and slug. */
export async function getPracticeTopics(courseId: string): Promise<FoundTopic[]> {
  const course = await getPracticeForCourse(courseId);
  if (!course) return [];
  return course.sections.flatMap(section =>
    section.topics.map(topic => ({
      topic,
      sectionId: section.id,
      sectionTitle: section.title,
      slug: topicSlug(topic.name),
    }))
  );
}

export async function getPracticeTopic(courseId: string, slug: string): Promise<FoundTopic | null> {
  const all = await getPracticeTopics(courseId);
  return all.find(t => t.slug === slug) ?? null;
}

// ---------------------------------------------------------------------------
// Resolving past paper references
//
// Most practice questions are past paper questions the site already holds, so
// they are stored as a reference ("2023 P2 Q14") rather than a copy. This
// resolves them at build time, which means a correction to a paper flows
// through to practice automatically, and the exam diagrams are not duplicated.

/** A question ready to render: refs resolved, everything inline. */
export interface ResolvedQuestion {
  question: string;
  answer: string;
  videoId?: string;
  timestamp?: number;
  paper?: string;
  solutionUrl?: string;
  marks?: number[];
}

// Every past paper question opens with a badge naming it. Read the label from
// that badge only — searching the whole question would let a year mentioned in
// the question text be mistaken for the label.
const BADGE = /^\s*<small>\s*<strong>[\s\S]*?>([^<]+)</i;

// "2023 P2 Q14", and for Advanced Higher before 2020, when there was a single
// paper, "2016 Q1" — so the paper number is optional.
//
// Everything after the question number is kept as the part suffix, with spaces
// removed. The archive writes parts inconsistently — "Q7(a)", "Q7 (a)",
// "Q7 (b), (c), (d)", "Q4 (a) - (d)" — and matching only the tight form made
// seven N5 Apps questions collapse onto four keys, so a reference to one part
// silently resolved to whichever was indexed last.
// The year is optional too: the Higher Apps specimen paper badges its questions
// "Specimen Q10", with no year at all.
const LABEL = /\b(?:((?:19|20)\d{2})\s*)?(Spec\w*|Exemplar)?\s*(?:P([12])\s*)?Q(\d+)\s*(.*)$/i;

/** The reference string for a past paper question, or null if it has no badge. */
function labelOf(questionHtml: string): string | null {
  const badge = questionHtml.match(BADGE);
  if (!badge) return null;
  const m = badge[1].trim().match(LABEL);
  if (!m) return null;
  const [, year, special, paper, num, rest] = m;
  if (!year && !special) return null;      // "Q4" alone identifies nothing
  const parts = (rest ?? '').replace(/\s+/g, '');
  const head = [year, special].filter(Boolean).join(' ');
  return `${head}${paper ? ` P${paper}` : ''} Q${num}${parts}`;
}

const paperIndexes: Record<string, Promise<Map<string, ResolvedQuestion>>> = {};

// Where a practice question is a past paper question, we reference it rather
// than restate it: the referenced copy brings its own video, marks and diagram.
// Every course whose papers are loadable can be a reference source.
const paperSources: Record<string, () => Promise<QuestionWithMetadata[]>> = {
  n5: getAllN5Questions,
  higher: getAllHigherQuestions,
  ah: getAllAHQuestions,
  'n5-apps': getAllN5AppsQuestions,
  'higher-apps': getAllHigherAppsQuestions,
};

function indexFor(courseId: string): Promise<Map<string, ResolvedQuestion>> {
  if (!paperIndexes[courseId]) {
    paperIndexes[courseId] = (async () => {
      const map = new Map<string, ResolvedQuestion>();
      const source = paperSources[courseId];
      if (!source) return map;
      for (const q of await source()) {
        const label = labelOf(q.question);
        if (!label) continue;
        map.set(label, {
          // Strip the label prefix — the page shows it as a badge instead
          question: q.question.replace(
            /^\s*<small>\s*<strong>[\s\S]*?<\/strong>\s*<\/small>\s*(<br\s*\/?>)?\s*/i, ''
          ),
          answer: q.answer,
          videoId: q.videoId || undefined,
          timestamp: q.timestamp ? parseInt(q.timestamp, 10) : undefined,
          paper: label,
          marks: q.marks,
        });
      }
      return map;
    })();
  }
  return paperIndexes[courseId];
}

/**
 * Resolve a topic's questions for rendering.
 *
 * A reference that cannot be resolved is dropped rather than rendered empty —
 * and reported, so a paper being removed shows up in the build log instead of
 * silently leaving a blank card on the page.
 */
export async function resolveQuestions(
  courseId: string,
  questions: PracticeQuestion[]
): Promise<ResolvedQuestion[]> {
  const index = await indexFor(courseId);
  const out: ResolvedQuestion[] = [];

  for (const q of questions) {
    if (q.ref) {
      const hit = index.get(q.ref);
      if (!hit) {
        console.warn(`[practice] unresolved past paper reference: ${courseId} ${q.ref}`);
        continue;
      }
      // A reference may retarget the video: in guided practice the useful
      // solution is the topic lesson at a timestamp, not the whole-paper
      // walkthrough the archive copy points at. Everything else — question,
      // answer, marks, diagram — still comes from the one stored copy.
      out.push(
        q.videoId
          ? { ...hit, videoId: q.videoId, timestamp: q.timestamp }
          : hit
      );
      continue;
    }
    if (q.question === undefined || q.answer === undefined) continue;
    out.push({
      question: q.question,
      answer: q.answer,
      videoId: q.videoId,
      timestamp: q.timestamp,
      paper: q.paper,
      solutionUrl: q.solutionUrl,
    });
  }
  return out;
}

/**
 * Notes topic id -> practice slug, where the two differ.
 *
 * Most ids match outright. These are the ones where the notes and the app named
 * the same topic differently, so a notes page can still offer its practice.
 */
const NOTES_TO_PRACTICE: Record<string, Record<string, string>> = {
  n5: {
    'expanding': 'expanding-brackets',
    'equations': 'linear-equations',
    'inequalities': 'linear-inequalities',
    'arcs-sectors': 'arcs-and-sectors',
    'area-of-triangle': 'triangle-area',
    'comparing-data-sets': 'data-sets',
    // Both notes topics drill the same practice set
    'quadratic-graphs': 'quadratics',
  },
  'n5-apps': {
    // Notes ids drop the "and"; the practice slug comes from the topic name,
    // which keeps it. Without these the notes page offers no practice link.
    'ratio-proportion': 'ratio-and-proportion',
    'budgeting-best-deals': 'budgeting-and-best-deals',
    'saving-borrowing': 'saving-and-borrowing',
    'reading-scales-tolerance': 'reading-scales-and-tolerance',
    'speed-distance-time': 'speed-distance-and-time',
    'perimeter-circumference-area': 'perimeter-circumference-and-area',
    'time-management-zones': 'time-management-and-time-zones',
    'scale-drawing-navigation': 'scale-drawing-and-navigation',
    'averages-spread': 'averages-and-spread',
    'interpreting-data': 'interpreting-graphs-and-tables',
    'probability-risk': 'probability-and-risk',
  },
  'higher-apps': {
    // The notes ids are longer or shorter than the practice topic names
    'finance-revision-and-gross-income': 'gross-income',
    'interest-varying-time-units': 'interest-with-varying-time-units',
    'accumulation-calculations': 'accumulation-with-regular-payments',
    'accumulation-irregular': 'accumulation-with-irregular-payments',
  },
};

/** The practice page for a notes topic, or null if there isn't one. */
export async function getPracticeSlugForTopic(
  courseId: string,
  notesTopicId: string
): Promise<{ slug: string; name: string; count: number } | null> {
  const topics = await getPracticeTopics(courseId);
  if (!topics.length) return null;

  const target = NOTES_TO_PRACTICE[courseId]?.[notesTopicId] ?? notesTopicId;
  const found = topics.find(t => t.slug === target);
  if (!found) return null;

  return { slug: found.slug, name: found.topic.name, count: found.topic.questions.length };
}
