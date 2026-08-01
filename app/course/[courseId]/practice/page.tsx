import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import type { Metadata } from 'next';
import { COURSES_WITH_PRACTICE, getPracticeForCourse, topicSlug, resolveQuestions } from '@/lib/practice-loader';
import { getCourseTheme } from '@/lib/course-theme';
import CourseTabs from '@/components/CourseTabs';
import { notesEntryHref } from '@/lib/notes-loader';
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

  // Two shapes of course, and they want different pages.
  //
  // Higher and Advanced Higher have one topic per section, and the topic is
  // named after the section — so the old layout printed 10 and 14 headings
  // each sitting above a single card, in a two-column grid that never had a
  // second item. That is a list of cards with every entry labelled twice.
  //
  // National 5, N5 Applications and Higher Applications genuinely group:
  // Higher Applications alone has 51 topics, 19 of them under Finance, which
  // is far too long a page to scroll to find one topic.
  const isFlat = course.sections.every(
    s => s.topics.length === 1 && s.topics[0].name === s.title
  );
  const flatTopics = course.sections.flatMap(s => s.topics);

  const topicCard = (topic: (typeof flatTopics)[number]) => {
    const papers = topic.questions.filter(q => q.paper).length;
    return (
      <Link
        key={topic.name}
        href={`/course/${courseId}/practice/${topicSlug(topic.name)}`}
        className="block rounded-xl border border-border p-4 hover:border-white/25 hover:bg-white/5 transition-colors"
      >
        <p className="font-medium mb-1">{topic.name}</p>
        <p className="font-mono text-xs text-muted-dim">
          {topic.questions.length} questions
          {papers > 0 && ` · ${papers} past paper`}
        </p>
      </Link>
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumbs
        items={[{ label: courseName, href: `/course/${courseId}` }, { label: 'Practice' }]}
      />
      <CourseTabs courseId={courseId} active="practice" notesHref={await notesEntryHref(courseId)} />

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

      {isFlat ? (
        // One grid, no headings — the card already carries the topic name.
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {flatTopics.map(topicCard)}
        </div>
      ) : (
        // Collapsible sections. <details> rather than a JS accordion: the links
        // stay in the DOM either way, so crawlers still reach every topic page,
        // and it works before hydration. The first section is open so the page
        // does not land looking empty.
        <div className="space-y-3">
          {course.sections.map((section, i) => {
            const questions = section.topics.reduce((n, t) => n + t.questions.length, 0);
            return (
              <details
                key={section.id}
                open={i === 0}
                className="group rounded-xl border border-border overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 px-4 py-3 cursor-pointer list-none hover:bg-white/5 transition-colors">
                  <span className={`font-mono text-xs uppercase tracking-widest ${theme.text}`}>
                    {section.title}
                  </span>
                  <span className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-xs text-muted-dim">
                      {section.topics.length} topics · {questions} questions
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-dim transition-transform group-open:rotate-180" />
                  </span>
                </summary>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 p-4 pt-1">
                  {section.topics.map(topicCard)}
                </div>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}
