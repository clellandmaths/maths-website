import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Play, FileText, ArrowRight } from 'lucide-react';
import { getNotesForCourse } from '@/lib/notes-loader';
import { getCourseTheme } from '@/lib/course-theme';
import CourseTabs from '@/components/CourseTabs';

// Crawlable all-topics hub — every topic page linked from one URL.
// Users normally enter the notes straight at a topic; this page is the
// overview (and a landing page for "<course> maths notes" searches).

const COURSE_IDS = ['n5', 'higher', 'ah', 'n5-apps', 'higher-apps'];

const COURSE_NAMES: Record<string, string> = {
  n5: 'National 5 Maths',
  higher: 'Higher Maths',
  ah: 'Advanced Higher Maths',
  'n5-apps': 'N5 Applications of Maths',
  'higher-apps': 'Higher Applications of Maths',
};

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
    title: `${name} Notes — All Topics`,
    description: `Free ${name} course notes: every topic with theory, worked examples and video lessons. Browse the full curriculum.`,
  };
}

export default async function NotesHubPage(
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  const course = await getNotesForCourse(courseId);
  if (!course) notFound();

  const theme = getCourseTheme(courseId);
  const name = COURSE_NAMES[courseId] ?? course.title;
  const first = course.sections[0]?.topics[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <CourseTabs courseId={courseId} active="notes" />
      <div className="mb-10">
        <p className={`font-mono text-xs uppercase tracking-widest ${theme.text} mb-2`}>
          Course notes
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          {name} <span className={theme.text}>Notes</span>
        </h1>
        {first && (
          <Link
            href={`/course/${courseId}/notes/${course.sections[0].id}/${first.id}`}
            className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${theme.gradient} hover:brightness-110 text-white font-semibold rounded-lg transition-all`}
          >
            Start at the beginning
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      <div className="space-y-8">
        {course.sections.map((section, sIdx) => (
          <section key={section.id}>
            <div className="flex items-baseline gap-3 mb-4">
              <span className={`font-mono text-sm font-semibold ${theme.text}`}>
                {String(sIdx + 1).padStart(2, '0')}
              </span>
              <h2 className="font-display text-xl font-bold">{section.title}</h2>
              <span className="font-mono text-xs text-muted-foreground">
                {section.topics.length} topic{section.topics.length === 1 ? '' : 's'}
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {section.topics.map(topic => {
                const hasVideo = Boolean(topic.videoUrl) && !topic.videoUrl.includes('placeholder');
                return (
                  <Link
                    key={topic.id}
                    href={`/course/${courseId}/notes/${section.id}/${topic.id}`}
                    className="group flex flex-col justify-between bg-card border border-border hover:border-white/25 rounded-xl p-4 transition-colors"
                  >
                    <span className="text-sm font-medium text-foreground/90 group-hover:text-foreground leading-snug mb-3">
                      {topic.title}
                    </span>
                    <span className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
                      {hasVideo && (
                        <span className="inline-flex items-center gap-1">
                          <Play className="h-3 w-3" /> Video
                        </span>
                      )}
                      {topic.examples.length > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <FileText className="h-3 w-3" /> {topic.examples.length} example{topic.examples.length === 1 ? '' : 's'}
                        </span>
                      )}
                    </span>
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
