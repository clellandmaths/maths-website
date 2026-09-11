import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { offeredTopicGroups } from '@/lib/generator/generators/n5-variations';
import GenerateClient from './GenerateClient';

// The worksheet builder: pick topics and counts, generate, add to the sheet.
//
// **The engine runs here, at build time, and is not shipped from this file.**
// `offeredTopicGroups()` needs the whole variation registry to work out what
// can be generated, and this is a server component, so that happens once during
// the static export and the browser receives the resulting object as a prop —
// about 170 strings. The engine itself is loaded in the browser only when a
// teacher actually presses Generate, through a dynamic import in the client.
//
// National 5 only. The other four courses have no seeding and no audited
// variations — see "Out of scope" in the generator's porting plan.

const GENERATOR_COURSES = ['n5'] as const;

const COURSE_NAMES: Record<string, string> = {
  n5: 'National 5 Maths',
};

interface Params { courseId: string }

export async function generateStaticParams(): Promise<Params[]> {
  return GENERATOR_COURSES.map(courseId => ({ courseId }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { courseId } = await params;
  if (!(GENERATOR_COURSES as readonly string[]).includes(courseId)) return {};

  const groups = offeredTopicGroups();
  const topics = Object.values(groups).reduce((n, ts) => n + ts.length, 0);
  const courseName = COURSE_NAMES[courseId] ?? courseId;

  return {
    title: `${courseName} Worksheet Generator`,
    description:
      `Build a ${courseName} worksheet from ${topics} topics. Every question is ` +
      'modelled on a past paper question and checked against its marking ' +
      'instructions. Print it or share one link.',
    alternates: { canonical: `/course/${courseId}/generate/` },
  };
}

export default async function GeneratePage({ params }: { params: Promise<Params> }) {
  const { courseId } = await params;
  if (!(GENERATOR_COURSES as readonly string[]).includes(courseId)) notFound();

  return (
    <GenerateClient
      courseId={courseId}
      courseName={COURSE_NAMES[courseId] ?? courseId}
      groups={offeredTopicGroups()}
    />
  );
}
