import Link from 'next/link';
import { GraduationCap, FileText, PencilLine } from 'lucide-react';
import { getCourseTheme } from '@/lib/course-theme';
import { hasPractice } from '@/lib/practice-loader';

// Course-context navigation — the same tab bar on the course page (papers),
// every notes page, and the practice pages. Active tabs stay clickable: the
// active Notes tab goes to the all-topics hub, the active Papers tab back to
// the archive — no dead ends on deep pages.
//
// The three tabs mirror how the material is meant to be used: notes teach,
// practice drills, past papers test.
interface Props {
  courseId: string;
  active: 'notes' | 'papers' | 'practice';
  // Where the Course Notes tab lands when inactive (usually the first topic)
  notesHref?: string;
}

export default function CourseTabs({ courseId, active, notesHref }: Props) {
  const theme = getCourseTheme(courseId);
  const activeClasses = `${theme.text} ${theme.border}`;
  const inactiveClasses = 'text-slate-400 border-transparent hover:text-slate-200';
  const base = 'flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-px';

  return (
    <div className="flex gap-2 mb-8 border-b border-slate-800">
      <Link
        href={active === 'notes' ? `/course/${courseId}/notes` : (notesHref ?? `/course/${courseId}/notes`)}
        className={`${base} ${active === 'notes' ? activeClasses : inactiveClasses}`}
        title={active === 'notes' ? 'All topics' : undefined}
      >
        <GraduationCap className="h-4 w-4" />
        Course Notes
      </Link>

      {/* Only shown where practice questions exist, so courses without them
          do not advertise an empty tab. */}
      {hasPractice(courseId) && (
        <Link
          href={`/course/${courseId}/practice`}
          className={`${base} ${active === 'practice' ? activeClasses : inactiveClasses}`}
        >
          <PencilLine className="h-4 w-4" />
          Practice
        </Link>
      )}

      <Link
        href={`/course/${courseId}`}
        className={`${base} ${active === 'papers' ? activeClasses : inactiveClasses}`}
      >
        <FileText className="h-4 w-4" />
        Past Paper Archive
      </Link>
    </div>
  );
}
