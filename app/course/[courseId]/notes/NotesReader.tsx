import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getNotesForCourse } from '@/lib/notes-loader';
import { getPracticeSlugForTopic } from '@/lib/practice-loader';
import NotesTopicShell, { type NotesNav } from '@/components/Notes/NotesTopicShell';
import CourseBar from '@/components/CourseBar';
import Breadcrumbs from '@/components/Breadcrumbs';

export const NOTES_COURSE_NAMES: Record<string, string> = {
  n5: 'National 5 Maths',
  higher: 'Higher Maths',
  ah: 'Advanced Higher Maths',
  'n5-apps': 'N5 Applications of Maths',
  'higher-apps': 'Higher Applications of Maths',
};

/**
 * One topic of a course's notes, with every topic in the accordion beside it.
 *
 * Shared by the topic pages and by `/course/<id>/notes`, which opens on the
 * course's first topic. That address was an all-topics page whose one real
 * control was "Start at the beginning", which went here (the owner, 2026-09-28:
 * "notes should just open on the whole notes page with accordion at side, the
 * page with start at beginning seems redundant"). The accordion lists every
 * topic, so nothing it offered is lost.
 */
export default async function NotesReader(
  { courseId, sectionId, topicId }: { courseId: string; sectionId: string; topicId: string },
) {
  const course = await getNotesForCourse(courseId);
  if (!course) notFound();

  const sIdx = course.sections.findIndex(s => s.id === sectionId);
  const section = course.sections[sIdx];
  const tIdx = section?.topics.findIndex(t => t.id === topicId) ?? -1;
  const topic = section?.topics[tIdx];
  if (!section || !topic) notFound();

  const practice = await getPracticeSlugForTopic(courseId, topicId);

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
    <>
      <CourseBar courseId={courseId} active="notes" />
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: NOTES_COURSE_NAMES[courseId] ?? course.title, href: `/course/${courseId}` },
          { label: 'Notes', href: `/course/${courseId}/notes` },
          { label: section.title },
          { label: topic.title },
        ]} />
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

        {/* Notes teach, practice drills. Send them straight from one to the
            other rather than making them find it.

            `full=1` opens the questions full screen on arrival, so this is one
            click from reading to working rather than a landing page in between.
            `from` carries the topic they were reading, and every surface of that
            practice set then offers the way back — inside full screen and on the
            page behind it, because closing the mode must not strand them. */}
        {practice && (
          <div className="mt-10 pt-6 border-t border-border">
            <Link
              href={`/course/${courseId}/practice/${practice.slug}?full=1&from=${sectionId}/${topicId}`}
              className="group flex items-center justify-between gap-4 rounded-xl border border-border p-5 hover:border-foreground/25 hover:bg-foreground/5 transition-colors"
            >
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1">
                  Ready to practise?
                </p>
                <p className="font-medium">
                  {practice.count} {practice.name} questions with answers and video solutions
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
