import type { PracticeCourse, PracticeTopic } from '@/src/practice/types';

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
