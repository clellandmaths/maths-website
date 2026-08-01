import type { Course, Section } from '@/src/notes/types';

const COURSE_META: Record<string, { title: string; description: string }> = {
  higher: { title: 'Higher Maths', description: 'Theory, examples and video lessons for Higher Maths.' },
  n5: { title: 'National 5 Maths', description: 'Theory, examples and video lessons for National 5 Maths.' },
  'higher-apps': { title: 'Higher Applications of Maths', description: 'Theory, examples and video lessons for Higher Applications of Maths.' },
  'n5-apps': { title: 'N5 Applications of Maths', description: 'Theory, examples and video lessons for N5 Applications of Maths.' },
  ah: { title: 'Advanced Higher Maths', description: 'Theory, examples and video lessons for Advanced Higher Maths.' },
};

async function loadSections(courseId: string): Promise<Section[] | null> {
  switch (courseId) {
    case 'higher':
      return (await import('@/src/notes/data/higherMathsData')).higherMathsData;
    case 'n5':
      return (await import('@/src/notes/data/national5MathsData')).national5MathsData;
    case 'higher-apps':
      return (await import('@/src/notes/data/higherAppsData')).higherAppsData;
    case 'n5-apps':
      return (await import('@/src/notes/data/national5AppsData')).national5AppsData;
    case 'ah':
      return (await import('@/src/notes/data/advancedHigherMathsData')).advancedHigherMathsData;
    default:
      return null;
  }
}

export async function getNotesForCourse(courseId: string): Promise<Course | null> {
  const sections = await loadSections(courseId);
  if (!sections) return null;
  const meta = COURSE_META[courseId] ?? { title: courseId, description: '' };
  return { id: courseId, title: meta.title, description: meta.description, sections };
}

/**
 * Where the Course Notes tab should land: the first topic, not the all-topics
 * hub.
 *
 * The hub is a grid of every topic, which is a useful page but a poor landing
 * spot — a pupil clicking "Course Notes" wants to read notes, not choose from a
 * list again. Only the course page used to pass this through, so from Practice
 * or a past paper the tab dropped you on the grid instead.
 */
export async function notesEntryHref(courseId: string): Promise<string> {
  const course = await getNotesForCourse(courseId);
  const section = course?.sections[0];
  const topic = section?.topics[0];
  return section && topic
    ? `/course/${courseId}/notes/${section.id}/${topic.id}`
    : `/course/${courseId}/notes`;
}
