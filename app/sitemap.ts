import type { MetadataRoute } from 'next';
import { getNotesForCourse } from '@/lib/notes-loader';

const BASE = 'https://clellandmaths.com';
const COURSE_IDS = ['n5', 'higher', 'ah', 'n5-apps', 'higher-apps'];

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, priority: 1 },
    { url: `${BASE}/explorer`, lastModified: now, priority: 0.8 },
    { url: `${BASE}/exam-hall`, lastModified: now, priority: 0.6 },
  ];

  for (const courseId of COURSE_IDS) {
    entries.push({ url: `${BASE}/course/${courseId}`, lastModified: now, priority: 0.9 });
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

  return entries;
}
