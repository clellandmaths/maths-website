import type { Metadata } from 'next';
import CoursePageClient from '../CoursePageClient';

/**
 * The past paper archive, on its own address since the course hub took the
 * course's front page (2026-09-28). This address had no page before, only
 * the folder the paper pages sit in, so nothing that worked stops working.
 */
export function generateStaticParams() {
  return [
    { courseId: 'n5' },
    { courseId: 'higher' },
    { courseId: 'ah' },
    { courseId: 'n5-apps' },
    { courseId: 'higher-apps' },
  ];
}

const NAMES: Record<string, string> = {
  n5: 'National 5 Maths',
  higher: 'Higher Maths',
  ah: 'Advanced Higher Maths',
  'n5-apps': 'N5 Applications of Maths',
  'higher-apps': 'Higher Applications of Maths',
};

export async function generateMetadata(
  { params }: { params: Promise<{ courseId: string }> }
): Promise<Metadata> {
  const { courseId } = await params;
  const name = NAMES[courseId];
  if (!name) return {};
  return {
    title: `${name} Past Papers — Video Solutions`,
    description: `Every ${name} past paper, with worked solutions question by question.`,
    alternates: { canonical: `/course/${courseId}/papers/` },
  };
}

export default async function PapersPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  return <CoursePageClient courseId={courseId} />;
}
