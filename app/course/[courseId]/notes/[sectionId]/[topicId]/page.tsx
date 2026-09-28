import type { Metadata } from 'next';
import { getNotesForCourse } from '@/lib/notes-loader';
import NotesReader from '../../NotesReader';

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
  return <NotesReader courseId={courseId} sectionId={sectionId} topicId={topicId} />;
}
