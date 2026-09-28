/**
 * Where each part of a course lives. Shared by the course bar and the course
 * hub (server components) and the two course pickers, so it is a plain
 * module: a server component cannot call a function exported from a
 * `'use client'` file, and the build refuses the page that tries.
 */
export type CourseSection = 'overview' | 'notes' | 'practice' | 'papers' | 'explorer' | 'exam-hall';

/** The five courses, in the order every list of them uses. */
export const COURSE_IDS = ['n5', 'higher', 'ah', 'n5-apps', 'higher-apps'] as const;

export const COURSE_NAMES: Record<string, string> = {
  n5: 'National 5',
  higher: 'Higher',
  ah: 'Advanced Higher',
  'n5-apps': 'N5 Applications',
  'higher-apps': 'Higher Applications',
};

/**
 * Where a section lives for a course. Every one is a path of its own.
 *
 * The Explorer and the Exam Hall were `/explorer?c=<id>` and
 * `/exam-hall?c=<id>` until 2026-09-28. Those links still work: the two pages
 * forward them here before anything is drawn.
 */
export function courseHref(courseId: string, section: CourseSection): string {
  return section === 'overview' ? `/course/${courseId}` : `/course/${courseId}/${section}`;
}
