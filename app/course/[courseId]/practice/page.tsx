import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { COURSES_WITH_PRACTICE, getPracticeForCourse, topicSlug, resolveQuestions } from '@/lib/practice-loader';
import { getCourseTheme } from '@/lib/course-theme';
import CourseTabs from '@/components/CourseTabs';
import Breadcrumbs from '@/components/Breadcrumbs';

// Index of practice topics for a course. Deliberately a hub page: it links to
// every topic page so crawlers reach them, and gives a pupil one place to pick
// from rather than hunting through the notes.

const COURSE_NAMES: Record<string, string> = {
  n5: 'National 5 Maths',
  higher: 'Higher Maths',
  ah: 'Advanced Higher Maths',
  'n5-apps': 'National 5 Applications of Maths',
  'higher-apps': 'Higher Applications of Maths',
};

interface Params { courseId: string }

export async function generateStaticParams(): Promise<Params[]> {
  return COURSES_WITH_PRACTICE.map(courseId => ({ courseId }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { courseId } = await params;
  const course = await getPracticeForCourse(courseId);
  if (!course) return {};

  const courseName = COURSE_NAMES[courseId] ?? courseId;
  const topics = course.sections.reduce((n, s) => n + s.topics.length, 0);
  const questions = course.sections.reduce(
    (n, s) => n + s.topics.reduce((m, t) => m + t.questions.length, 0), 0
  );
  const videos = (await Promise.all(
    course.sections.flatMap(s => s.topics.map(t => resolveQuestions(courseId, t.questions)))
  )).flat().filter(q => q.videoId).length;

  return {
    title: `${courseName} Practice Questions`,
    description:
      `${questions} guided practice questions across ${topics} ${courseName} topics, ` +
      `with answers${videos === questions ? ' and video solutions' : ''} for every question.`,
    alternates: { canonical: `/course/${courseId}/practice/` },
  };
}

export default async function PracticeIndexPage({ params }: { params: Promise<Params> }) {
  const { courseId } = await params;
  const course = await getPracticeForCourse(courseId);
  if (!course) notFound();

  const theme = getCourseTheme(courseId);
  const courseName = COURSE_NAMES[courseId] ?? courseId;
  const total = course.sections.reduce(
    (n, s) => n + s.topics.reduce((m, t) => m + t.questions.length, 0), 0
  );
  // A referenced past paper question brings the paper's own video, so the
  // references have to be resolved before the count means anything
  const videos = (await Promise.all(
    course.sections.flatMap(s => s.topics.map(t => resolveQuestions(courseId, t.questions)))
  )).flat().filter(q => q.videoId).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs
        items={[{ label: courseName, href: `/course/${courseId}` }, { label: 'Practice' }]}
      />
      <CourseTabs courseId={courseId} active="practice" />

      <div className="mb-10">
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          {courseName} Practice Questions
        </h1>
        <p className="text-muted-foreground">
          {total} questions across {course.sections.reduce((n, s) => n + s.topics.length, 0)} topics.
          {/* Only claim video where it exists — most Advanced Higher topics
              have no guided practice filmed yet */}
          {videos === total
            ? ' Every question has an answer and a video solution.'
            : ` Every question has an answer${videos ? `, and ${videos} have a video solution` : ''}.`}
        </p>
      </div>

      <div className="space-y-10">
        {course.sections.map(section => (
          <section key={section.id}>
            <h2 className={`font-mono text-xs uppercase tracking-widest ${theme.text} mb-4`}>
              {section.title}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {section.topics.map(topic => {
                const papers = topic.questions.filter(q => q.paper).length;
                return (
                  <Link
                    key={topic.name}
                    href={`/course/${courseId}/practice/${topicSlug(topic.name)}`}
                    className={`block rounded-xl border border-border p-4 hover:border-white/25 hover:bg-white/5 transition-colors`}
                  >
                    <p className="font-medium mb-1">{topic.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {topic.questions.length} questions
                      {papers > 0 && ` · ${papers} past paper`}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
