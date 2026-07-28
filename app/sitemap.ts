import type { MetadataRoute } from 'next';
import { getNotesForCourse } from '@/lib/notes-loader';
import { getAllN5Questions, getAllHigherQuestions, getAllAHQuestions, getAllHigherAppsQuestions, getAllN5AppsQuestions } from '@/lib/data-loader';
import { COURSES_WITH_PRACTICE, getPracticeTopics } from '@/lib/practice-loader';

const BASE = 'https://clellandmaths.com';
const COURSE_IDS = ['n5', 'higher', 'ah', 'n5-apps', 'higher-apps'];

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, priority: 1 },
    { url: `${BASE}/explorer`, lastModified: now, priority: 0.8 },
    { url: `${BASE}/exam-hall`, lastModified: now, priority: 0.6 },
    // Static page served from public/ — Next generates no route for it, so it
    // has to be listed by hand or crawlers only reach it via the notes link.
    { url: `${BASE}/course/higher-apps/rstudio/`, lastModified: now, priority: 0.8 },
  ];

  // Guided practice — one page per topic, each targeting its own search term
  for (const courseId of COURSES_WITH_PRACTICE) {
    entries.push({ url: `${BASE}/course/${courseId}/practice`, lastModified: now, priority: 0.8 });
    for (const { slug } of await getPracticeTopics(courseId)) {
      entries.push({
        url: `${BASE}/course/${courseId}/practice/${slug}`,
        lastModified: now,
        priority: 0.7,
      });
    }
  }

  for (const courseId of COURSE_IDS) {
    entries.push({ url: `${BASE}/course/${courseId}`, lastModified: now, priority: 0.9 });
    entries.push({ url: `${BASE}/course/${courseId}/notes`, lastModified: now, priority: 0.8 });
    const course = await getNotesForCourse(courseId);
    if (!course) continue;
    for (const section of course.sections) {
      for (const topic of section.topics) {
        entries.push({
          url: `${BASE}/course/${courseId}/notes/${section.id}/${topic.id}`,
          lastModified: now,
          priority: 0.7,
        });
      }
    }
  }

  // Past paper pages — all five courses
  const paperLoaders = {
    n5: getAllN5Questions,
    higher: getAllHigherQuestions,
    ah: getAllAHQuestions,
    'n5-apps': getAllN5AppsQuestions,
    'higher-apps': getAllHigherAppsQuestions,
  } as const;
  for (const [courseId, load] of Object.entries(paperLoaders)) {
    const questions = await load();
    const combos = new Set(questions.map(q => `${q.year}/${q.paperNumber}`));
    for (const combo of combos) {
      const [year, paperNumber] = combo.split('/');
      entries.push({
        url: `${BASE}/course/${courseId}/papers/${year}/paper-${paperNumber}`,
        lastModified: now,
        priority: 0.8,
      });
    }
  }

  return entries;
}
