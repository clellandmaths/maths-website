import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CourseBar from '@/components/CourseBar';
import ExplorerApp, { type Course } from '@/components/Explorer/ExplorerApp';
import { RememberCourse } from '@/components/CourseHubBits';
import { COURSE_IDS, COURSE_NAMES } from '@/lib/course-nav';

export function generateStaticParams() {
  return COURSE_IDS.map(courseId => ({ courseId }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ courseId: string }> }
): Promise<Metadata> {
  const { courseId } = await params;
  const name = COURSE_NAMES[courseId];
  if (!name) return {};
  return {
    title: `${name} Worksheet Builder — Past Paper Questions by Topic`,
    description: `Filter ${name} Maths past paper questions by topic, year and paper, then build a custom worksheet with answers, QR-coded video solutions and PDF export. Free for students and teachers.`,
  };
}

export default async function CourseExplorerPage(
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  if (!(COURSE_IDS as readonly string[]).includes(courseId)) notFound();
  return (
    <>
      <RememberCourse courseId={courseId} />
      <CourseBar courseId={courseId} active="explorer" />
      <ExplorerApp course={courseId as Course} />
    </>
  );
}
