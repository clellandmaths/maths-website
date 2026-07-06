import CoursePageClient from './CoursePageClient';

export function generateStaticParams() {
  return [
    { courseId: 'n5' },
    { courseId: 'higher' },
    { courseId: 'ah' },
    { courseId: 'n5-apps' },
    { courseId: 'higher-apps' },
  ];
}

interface Props {
  params: Promise<{ courseId: string }>;
}

export default async function CoursePage({ params }: Props) {
  const { courseId } = await params;
  return <CoursePageClient courseId={courseId} />;
}
