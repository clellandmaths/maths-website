/**
 * The printed marking instructions for a course, loaded when a teacher asks.
 *
 * **One table per course, because every course labels alike.** A Higher
 * "2019 P1 Q5" and a National 5 "2019 P1 Q5" are different questions, and a
 * single table keyed by label printed N5's scheme under 259 of 267 Higher
 * questions until 2026-09-26. So the table comes back tagged with the course
 * it belongs to, and `MarkschemeSheet` reads it only for that course.
 *
 * Each table is a dynamic import: it arrives with the teacher's press and is
 * never on a pupil's way (see `app/explorer/page.tsx`).
 */
import type { PaperScheme } from '@/lib/generator/generators/paper-markscheme';

export interface CourseSchemes {
  courseId: string;
  table: Record<string, PaperScheme>;
}

/** Courses with a published marking-instructions table. */
export const COURSES_WITH_SCHEMES = ['n5', 'higher', 'higher-apps'] as const;

export async function loadCourseSchemes(courseId: string): Promise<CourseSchemes> {
  switch (courseId) {
    case 'n5': {
      const { PAPER_MARKSCHEME } = await import('@/lib/generator/generators/paper-markscheme');
      return { courseId, table: PAPER_MARKSCHEME };
    }
    case 'higher': {
      const { PAPER_MARKSCHEME_HIGHER } = await import('@/lib/generator/generators/paper-markscheme-higher');
      return { courseId, table: PAPER_MARKSCHEME_HIGHER };
    }
    case 'higher-apps': {
      const { PAPER_MARKSCHEME_HIGHERAPPS } = await import('@/lib/generator/generators/paper-markscheme-higherapps');
      return { courseId, table: PAPER_MARKSCHEME_HIGHERAPPS };
    }
    default:
      // No table for this course yet: the sheet prints each question's own
      // answer and says the published scheme is not included.
      return { courseId, table: {} };
  }
}
