import type { Course } from '@/src/notes/types';

export async function getNotesForCourse(courseId: string): Promise<Course | null> {
  switch (courseId) {
    case 'higher':
      return (await import('@/src/notes/data/higherMathsData')).higherMathsData as unknown as Course;
    case 'n5':
      return (await import('@/src/notes/data/national5MathsData')).national5MathsData as unknown as Course;
    case 'higher-apps':
      return (await import('@/src/notes/data/higherAppsData')).higherAppsData as unknown as Course;
    case 'n5-apps':
      return (await import('@/src/notes/data/national5AppsData')).national5AppsData as unknown as Course;
    case 'ah':
      return (await import('@/src/notes/data/advancedHigherMathsData')).advancedHigherMathsData as unknown as Course;
    default:
      return null;
  }
}
