import type { QuestionWithMetadata } from '@/lib/data-loader';


/**
 * The "whole course in N hours" marathons.
 *
 * Each is a curated run through every topic in a course, built from past paper
 * questions and timed against a single long video — the live app's headline
 * revision feature, ported here.
 *
 * The data files came across from the live app unchanged, and each entry was
 * checked to resolve to the same question on both sides before being wired up.
 * Most entries reference a past paper question by spreading it; a handful carry
 * their own `question` html instead, where the walkthrough merges two parts
 * into one or uses a question that is not in the paper archive at all. Both
 * shapes arrive here already flattened, so nothing needs to resolve anything.
 */
export interface SpecialQuestion {
  topic: string;
  question: string;
  answer: string;
  videoId: string;
  timestamp: string;
  marks?: number[];
  topics?: string[];
  subtopics?: string[];
  /** Higher Applications entries carry the year explicitly — its data booklet
   *  is per-year, so the presenter needs it to open the right one. */
  _year?: number | string;
}

export interface Special {
  name: string;
  mainVideoId: string;
  pdfLink?: string;
  liveStreamDate?: string;
  membershipLink?: string;
  questions: SpecialQuestion[];
}

/** A topic run within a marathon — contiguous questions sharing a heading. */
export interface SpecialTopic {
  topic: string;
  startIndex: number;
  count: number;
}

const loaders: Record<string, () => Promise<Special>> = {
  n5: () => import('@/src/n5/specials/2026-in-4hours').then(m => m.n52026In4Hours as Special),
  higher: () => import('@/src/higher/specials/higher-2026-in-5-hours').then(m => m.higher2026In5Hours as Special),
  ah: () => import('@/src/ah/specials/ah-2026-in-5-hours').then(m => m.ah2026In5Hours as Special),
  'n5-apps': () => import('@/src/n5apps/specials/2026-in-under-5-hours').then(m => m.n5apps2026InUnder5Hours as Special),
  'higher-apps': () => import('@/src/higherapps/specials/higher-apps-2026-in-4-hours').then(m => m.higherApps2026In4Hours as Special),
};

export function hasSpecial(courseId: string): boolean {
  return courseId in loaders;
}

export async function getSpecial(courseId: string): Promise<Special | null> {
  const load = loaders[courseId];
  return load ? load() : null;
}

/**
 * Questions in the shape every other surface expects, so the marathon can be
 * worked through in the same presenter as a past paper.
 *
 * `label` is set explicitly: these questions come from many different papers,
 * so the usual "{year} Paper {n} Q{m}" caption would be assembled from fields
 * a marathon entry does not have. The topic is what a pupil is actually
 * revising, and the paper reference is kept beside it where there is one.
 */
export function toPresenterQuestions(special: Special): QuestionWithMetadata[] {
  return special.questions.map((q, i) => ({
    ...q,
    topics: q.topics ?? [q.topic],
    // The real year matters: the presenter hands it to the data booklet, which
    // is per-year for Higher Applications. Those entries carry _year; for the
    // rest it is the first thing in the paper label, "2025 P2 Q1".
    year: q._year ?? yearOfPaperRef(q.question) ?? '',
    paperNumber: paperNumberOfRef(q.question) ?? 0,
    questionIndex: i,
    questionNumber: String(i + 1),
    // Just the topic. The question html already opens with its own "2025 P2 Q1"
    // heading, so repeating the paper reference here says it twice.
    label: q.topic,
  }));
}

const PAPER_REF = /^\s*<small>\s*<strong>\s*<span[^>]*>\s*([^<]+?)\s*<\/span>/i;

/** "2025" from a question whose label reads "2025 P2 Q1". */
function yearOfPaperRef(html: string): number | string | null {
  const ref = PAPER_REF.exec(html ?? '')?.[1]?.trim();
  if (!ref) return null;
  if (/^Specimen/i.test(ref)) return 'Specimen';
  const year = /^(\d{4})/.exec(ref)?.[1];
  return year ? Number(year) : null;
}

/** "2" from "2025 P2 Q1"; null when the label carries no paper number. */
function paperNumberOfRef(html: string): number | null {
  const ref = PAPER_REF.exec(html ?? '')?.[1]?.trim();
  const n = ref ? /\bP(\d+)\b/.exec(ref)?.[1] : null;
  return n ? Number(n) : null;
}

/** The topic runs, in order, for the contents list. */
export function topicRuns(special: Special): SpecialTopic[] {
  const runs: SpecialTopic[] = [];
  special.questions.forEach((q, i) => {
    const last = runs[runs.length - 1];
    if (last && last.topic === q.topic) last.count++;
    else runs.push({ topic: q.topic, startIndex: i, count: 1 });
  });
  return runs;
}
