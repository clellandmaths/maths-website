import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CourseBar from '@/components/CourseBar';
import ExamHallApp, { type Course } from '@/components/ExamHall/ExamHallApp';
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
    title: `${name} Exam Hall — Countdown, Checklists & Daily Warm Ups`,
    description: `Count down to your ${name} Maths exam, track revision with topic checklists, and warm up with daily past paper questions.`,
  };
}

export default async function CourseExamHallPage(
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  if (!(COURSE_IDS as readonly string[]).includes(courseId)) notFound();
  return (
    <>
      <RememberCourse courseId={courseId} />
      <CourseBar courseId={courseId} active="exam-hall" />
      <ExamHallApp course={courseId as Course} />
    </>
  );
}
