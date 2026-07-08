import Link from 'next/link';
import { Play, FileText } from 'lucide-react';
import CoursePageClient from './CoursePageClient';
import { getNotesForCourse } from '@/lib/notes-loader';
import { getCourseTheme } from '@/lib/course-theme';

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

// Server-rendered notes index — a crawlable hub of links to every topic
// page, shown in the Course Notes tab.
async function NotesIndex({ courseId }: { courseId: string }) {
  const course = await getNotesForCourse(courseId);
  const theme = getCourseTheme(courseId);

  if (!course) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Course notes not available yet.</p>
      </div>
    );
  }

  return (
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
  );
}

export default async function CoursePage({ params }: Props) {
  const { courseId } = await params;
  return (
    <CoursePageClient
      courseId={courseId}
      notesIndex={<NotesIndex courseId={courseId} />}
    />
  );
}
