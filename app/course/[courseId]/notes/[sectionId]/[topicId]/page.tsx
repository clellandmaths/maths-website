import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getNotesForCourse } from '@/lib/notes-loader';
import NotesTopicShell, { type NotesNav } from '@/components/Notes/NotesTopicShell';
import CourseTabs from '@/components/CourseTabs';
import Breadcrumbs from '@/components/Breadcrumbs';

// Every notes topic is a statically generated, crawlable page:
// /course/higher/notes/straight-line/gradient etc.

const COURSE_IDS = ['n5', 'higher', 'ah', 'n5-apps', 'higher-apps'];

const COURSE_NAMES: Record<string, string> = {
  n5: 'National 5 Maths',
  higher: 'Higher Maths',
  ah: 'Advanced Higher Maths',
  'n5-apps': 'N5 Applications of Maths',
  'higher-apps': 'Higher Applications of Maths',
};

interface Params {
  courseId: string;
  sectionId: string;
  topicId: string;
}

export async function generateStaticParams(): Promise<Params[]> {
  const params: Params[] = [];
  for (const courseId of COURSE_IDS) {
    const course = await getNotesForCourse(courseId);
    if (!course) continue;
    for (const section of course.sections) {
      for (const topic of section.topics) {
        params.push({ courseId, sectionId: section.id, topicId: topic.id });
      }
    }
  }
  return params;
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { courseId, sectionId, topicId } = await params;
  const course = await getNotesForCourse(courseId);
  const section = course?.sections.find(s => s.id === sectionId);
  const topic = section?.topics.find(t => t.id === topicId);
  if (!course || !section || !topic) return {};

  const courseName = COURSE_NAMES[courseId] ?? course.title;
  const hasVideo = Boolean(topic.videoUrl) && !topic.videoUrl.includes('placeholder');
  const parts = [
    'theory',
    topic.examples.length > 0
      ? `${topic.examples.length} worked example${topic.examples.length === 1 ? '' : 's'}`
      : null,
    hasVideo ? 'video lesson' : null,
  ].filter(Boolean).join(', ');

  return {
    title: `${topic.title} — ${section.title} | ${courseName} Notes`,
    description: `Free ${courseName} revision notes on ${topic.title} (${section.title}): ${parts}. Clelland Maths.`,
  };
}

export default async function NotesTopicPage(
  { params }: { params: Promise<Params> }
) {
  const { courseId, sectionId, topicId } = await params;
  const course = await getNotesForCourse(courseId);
  if (!course) notFound();

  const sIdx = course.sections.findIndex(s => s.id === sectionId);
  const section = course.sections[sIdx];
  const tIdx = section?.topics.findIndex(t => t.id === topicId) ?? -1;
  const topic = section?.topics[tIdx];
  if (!section || !topic) notFound();

  // Serializable nav model for the client shell — ids and titles only
  const nav: NotesNav = {
    courseTitle: course.title,
    sections: course.sections.map(s => ({
      id: s.id,
      title: s.title,
      topics: s.topics.map(t => ({ id: t.id, title: t.title })),
    })),
  };

  // Prev/next across section boundaries
  const flat = course.sections.flatMap(s =>
    s.topics.map(t => ({ sectionId: s.id, topicId: t.id, title: t.title }))
  );
  const flatIdx = flat.findIndex(t => t.sectionId === sectionId && t.topicId === topicId);
  const prev = flatIdx > 0 ? flat[flatIdx - 1] : undefined;
  const next = flatIdx < flat.length - 1 ? flat[flatIdx + 1] : undefined;
  const href = (t: { sectionId: string; topicId: string }) =>
    `/course/${courseId}/notes/${t.sectionId}/${t.topicId}`;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <Breadcrumbs items={[
        { label: 'Home', href: '/' },
        { label: COURSE_NAMES[courseId] ?? course.title, href: `/course/${courseId}` },
        { label: 'Notes', href: `/course/${courseId}/notes` },
        { label: section.title },
        { label: topic.title },
      ]} />
      <CourseTabs courseId={courseId} active="notes" />
      <NotesTopicShell
        courseId={courseId}
        nav={nav}
        sectionId={sectionId}
        topicId={topicId}
        topic={topic}
        sectionTitle={section.title}
        topicNumber={tIdx + 1}
        topicCount={section.topics.length}
        prevHref={prev ? href(prev) : undefined}
        prevTitle={prev?.title}
        nextHref={next ? href(next) : undefined}
        nextTitle={next?.title}
      />
    </div>
  );
}
