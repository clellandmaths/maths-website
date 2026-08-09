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
  // The labels stay full at every width — "Past Paper Archive" says what it is
  // and "Papers" does not. On a narrow phone the longest one wraps onto two or
  // three lines, which is fine and is how it has always read.
  //
  // What was not fine: at 345px the row's minimum width came to ~376px, so it
  // pushed 31px past the viewport and put the whole page into horizontal
  // scroll. That was the padding and gaps, not the words. px-4 + gap-2 needs
  // ~350px before the text even wraps; halving both below `sm` brings the
  // minimum down far enough that it wraps instead of overflowing.
  //
  // px-2 rather than px-2.5 buys the last 12px, which is what a 320px phone
  // (iPhone SE 1st gen, or anyone running large text) needs to clear it.
  //
  // No whitespace-nowrap here on purpose — wrapping is what keeps the full
  // wording affordable on a small screen.
  const base =
    'flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-3 font-medium transition-colors border-b-2 -mb-px';

  return (
    <div className="flex gap-1 sm:gap-2 mb-8 border-b border-slate-800">
      <Link
        // Always the first topic. Landing on the all-topics grid means asking
        // a pupil to choose again when they have already said what they want.
        href={notesHref ?? `/course/${courseId}/notes`}
        className={`${base} ${active === 'notes' ? activeClasses : inactiveClasses}`}
      >
        <GraduationCap className="h-4 w-4 shrink-0" />
        Course Notes
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
        Past Paper Archive
      </Link>
    </div>
  );
}
