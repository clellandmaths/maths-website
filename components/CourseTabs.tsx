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
  // whitespace-nowrap + shrink-0: at 345px the three full labels measure ~464px,
  // so "Past Paper Archive" wrapped onto three lines and its last line was cut
  // off at the viewport edge. Tighter padding and short labels below `sm` bring
  // the row to ~292px, so all three stay visible without a scrolling tab strip
  // — with only three tabs, one off-screen is worse than a shorter word.
  const base =
    'flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-3 font-medium transition-colors border-b-2 -mb-px whitespace-nowrap shrink-0';

  return (
    <div className="flex gap-1 sm:gap-2 mb-8 border-b border-slate-800">
      <Link
        // Always the first topic. Landing on the all-topics grid means asking
        // a pupil to choose again when they have already said what they want.
        href={notesHref ?? `/course/${courseId}/notes`}
        className={`${base} ${active === 'notes' ? activeClasses : inactiveClasses}`}
      >
        <GraduationCap className="h-4 w-4 shrink-0" />
        <span className="sm:hidden">Notes</span>
        <span className="hidden sm:inline">Course Notes</span>
      </Link>

      {/* Only shown where practice questions exist, so courses without them
          do not advertise an empty tab. */}
      {hasPractice(courseId) && (
        <Link
          href={`/course/${courseId}/practice`}
          className={`${base} ${active === 'practice' ? activeClasses : inactiveClasses}`}
        >
          <PencilLine className="h-4 w-4 shrink-0" />
          Practice
        </Link>
      )}

      <Link
        href={`/course/${courseId}`}
        className={`${base} ${active === 'papers' ? activeClasses : inactiveClasses}`}
      >
        <FileText className="h-4 w-4 shrink-0" />
        <span className="sm:hidden">Papers</span>
        <span className="hidden sm:inline">Past Paper Archive</span>
      </Link>
    </div>
  );
}
