import Link from 'next/link';
import { GraduationCap, FileText } from 'lucide-react';
import { getCourseTheme } from '@/lib/course-theme';

// Course-context navigation — the same tab bar on the course page (papers)
// and every notes page, so you can always switch between the two.
interface Props {
  courseId: string;
  active: 'notes' | 'papers';
  // Where the Course Notes tab lands when inactive (usually the first topic)
  notesHref?: string;
}

export default function CourseTabs({ courseId, active, notesHref }: Props) {
  const theme = getCourseTheme(courseId);
  const activeClasses = `${theme.text} ${theme.border}`;
  const inactiveClasses = 'text-slate-400 border-transparent hover:text-slate-200';

  return (
    <div className="flex gap-2 mb-8 border-b border-slate-800">
      {active === 'notes' ? (
        <span className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 -mb-px ${activeClasses}`}>
          <GraduationCap className="h-4 w-4" />
          Course Notes
        </span>
      ) : (
        <Link
          href={notesHref ?? `/course/${courseId}/notes`}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${inactiveClasses}`}
        >
          <GraduationCap className="h-4 w-4" />
          Course Notes
        </Link>
      )}
      {active === 'papers' ? (
        <span className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 -mb-px ${activeClasses}`}>
          <FileText className="h-4 w-4" />
          Past Paper Archive
        </span>
      ) : (
        <Link
          href={`/course/${courseId}`}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${inactiveClasses}`}
        >
          <FileText className="h-4 w-4" />
          Past Paper Archive
        </Link>
      )}
    </div>
  );
}
