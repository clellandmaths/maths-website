/**
 * Where each part of a course lives. Shared by the course bar (a client
 * component) and the course hub (a server one), so it is a plain module: a
 * server component cannot call a function exported from a `'use client'`
 * file, and the build refuses the page that tries.
 */
export type CourseSection = 'overview' | 'notes' | 'practice' | 'papers' | 'explorer' | 'exam-hall';

export const COURSE_NAMES: Record<string, string> = {
  n5: 'National 5',
  higher: 'Higher',
  ah: 'Advanced Higher',
  'n5-apps': 'N5 Applications',
  'higher-apps': 'Higher Applications',
};

/** Where a section lives for a course. The Explorer and Exam Hall carry the course in the query. */
export function courseHref(courseId: string, section: CourseSection): string {
  switch (section) {
    case 'overview': return `/course/${courseId}`;
    case 'notes': return `/course/${courseId}/notes`;
    case 'practice': return `/course/${courseId}/practice`;
    case 'papers': return `/course/${courseId}/papers`;
    case 'explorer': return `/explorer?c=${courseId}`;
    case 'exam-hall': return `/exam-hall?c=${courseId}`;
  }
}
