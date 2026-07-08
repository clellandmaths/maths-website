import type { Metadata } from 'next';
import CoursePageClient from './CoursePageClient';
import { getNotesForCourse } from '@/lib/notes-loader';

export function generateStaticParams() {
  return [
    { courseId: 'n5' },
    { courseId: 'higher' },
    { courseId: 'ah' },
    { courseId: 'n5-apps' },
    { courseId: 'higher-apps' },
  ];
}

const COURSE_META: Record<string, { title: string; description: string }> = {
  n5: {
    title: 'National 5 Maths — Notes, Past Papers & Video Solutions',
    description: 'Free National 5 Maths revision: course notes with worked examples, past papers from 2014–2025 with video solutions, and a custom worksheet builder.',
  },
  higher: {
    title: 'Higher Maths — Notes, Past Papers & Video Solutions',
    description: 'Free Higher Maths revision: course notes with worked examples, past papers from 2015–2025 with video solutions, and a custom worksheet builder.',
  },
  ah: {
    title: 'Advanced Higher Maths — Notes & Video Lessons',
    description: 'Free Advanced Higher Maths revision: course notes with theory and worked examples, plus video lessons. Clelland Maths.',
  },
  'n5-apps': {
    title: 'N5 Applications of Maths — Notes & Video Lessons',
    description: 'Free National 5 Applications of Maths revision: course notes with theory and worked examples, plus video lessons. Clelland Maths.',
  },
  'higher-apps': {
    title: 'Higher Applications of Maths — Notes & Video Lessons',
    description: 'Free Higher Applications of Maths revision: course notes with theory and worked examples, plus video lessons. Clelland Maths.',
  },
};

export async function generateMetadata(
  { params }: { params: Promise<{ courseId: string }> }
): Promise<Metadata> {
  const { courseId } = await params;
  return COURSE_META[courseId] ?? {};
}

interface Props {
  params: Promise<{ courseId: string }>;
}

export default async function CoursePage({ params }: Props) {
  const { courseId } = await params;

  // The Course Notes tab links straight into the first topic — the
  // all-topics hub lives at /course/[courseId]/notes
  const course = await getNotesForCourse(courseId);
  const firstSection = course?.sections[0];
  const firstTopic = firstSection?.topics[0];
  const notesHref = firstSection && firstTopic
    ? `/course/${courseId}/notes/${firstSection.id}/${firstTopic.id}`
    : `/course/${courseId}/notes`;

  return <CoursePageClient courseId={courseId} notesHref={notesHref} />;
}
