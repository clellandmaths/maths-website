import Link from 'next/link';
import type { Metadata } from 'next';
import { Play, FileText } from 'lucide-react';
import CoursePageClient from './CoursePageClient';
import { getNotesForCourse } from '@/lib/notes-loader';
import { getCourseTheme } from '@/lib/course-theme';

const COURSE_META: Record<string, { title: string; description: string }> = {
  n5: {
    title: 'National 5 Maths — Notes, Past Papers & Video Solutions',
    description: 'Free National 5 Maths revision: course notes with worked examples, past papers from 2014–2025 with video solutions, and a custom worksheet builder.',
  },
  higher: {
    title: 'Higher Maths — Notes, Past Papers & Video Solutions',
    description: 'Free Higher Maths revision: course notes with worked examples, past papers from 2015–2025 with video solutions, and a custom worksheet builder.',
  },
  ah: {
    title: 'Advanced Higher Maths — Notes & Video Lessons',
    description: 'Free Advanced Higher Maths revision: course notes with theory and worked examples, plus video lessons. Clelland Maths.',
  },
  'n5-apps': {
    title: 'N5 Applications of Maths — Notes & Video Lessons',
    description: 'Free National 5 Applications of Maths revision: course notes with theory and worked examples, plus video lessons. Clelland Maths.',
  },
  'higher-apps': {
    title: 'Higher Applications of Maths — Notes & Video Lessons',
    description: 'Free Higher Applications of Maths revision: course notes with theory and worked examples, plus video lessons. Clelland Maths.',
  },
};

export async function generateMetadata(
  { params }: { params: Promise<{ courseId: string }> }
): Promise<Metadata> {
  const { courseId } = await params;
  return COURSE_META[courseId] ?? {};
}

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
