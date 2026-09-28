import Link from 'next/link';
import { BookOpen, ChevronDown, Compass, FileText, GraduationCap, LayoutGrid, PencilLine } from 'lucide-react';
import { getCourseTheme } from '@/lib/course-theme';
import { COURSE_NAMES, courseHref, type CourseSection } from '@/lib/course-nav';

/**
 * The course bar: where you are inside a course, and everything else in it.
 *
 * **Why it exists.** The site used to run two navigation systems at once
 * (docs/navigation.md, 2026-09-28): a course had three tabs, while the Topic
 * Explorer and the Exam Hall sat in the top nav as if site-wide, each quietly
 * working on whichever course was used last. Stepping into either left the
 * course. This bar is on every page that belongs to a course, those two
 * included, so the course is always where you are.
 *
 * **The switcher keeps you in the same place.** Choosing Higher from the
 * Explorer's bar opens the Higher Explorer; from the notes, the Higher notes.
 * One rule, wherever it is pressed.
 *
 * **No JavaScript.** The switcher is a native `<details>`, so the bar renders
 * on the server and adds nothing to a page's bundle. As a client component it
 * put about 10 KB on every notes and practice page, past the budget. It works
 * inside client pages too, having no hooks. Picking a course navigates away,
 * which closes it.
 *
 * **On a phone the tabs scroll sideways.** Six do not fit at 320px (three had
 * 32px to spare), and wrapping them into two rows made the active mark
 * ambiguous. The fade at the right edge says there is more.
 */
const DOTS: Record<string, string> = {
  n5: 'bg-cyan-500',
  higher: 'bg-orange-500',
  ah: 'bg-emerald-500',
  'n5-apps': 'bg-amber-500',
  'higher-apps': 'bg-violet-500',
};

const TABS: { section: CourseSection; label: string; icon: typeof BookOpen }[] = [
  { section: 'overview', label: 'Overview', icon: LayoutGrid },
  { section: 'notes', label: 'Notes', icon: BookOpen },
  { section: 'practice', label: 'Practice', icon: PencilLine },
  { section: 'papers', label: 'Past Papers', icon: FileText },
  { section: 'explorer', label: 'Topic Explorer', icon: Compass },
  { section: 'exam-hall', label: 'Exam Hall', icon: GraduationCap },
];

interface Props {
  courseId: string;
  active: CourseSection;
  className?: string;
}

export default function CourseBar({ courseId, active, className = 'mb-8' }: Props) {
  const theme = getCourseTheme(courseId);

  return (
    <nav aria-label={`${COURSE_NAMES[courseId] ?? 'Course'} sections`} className={`no-print flex items-stretch gap-2 border-b border-border ${className}`}>
      <details className="course-switcher group relative shrink-0 flex items-center">
        <summary
          title="Change course"
          className="flex list-none items-center gap-2 rounded-lg px-2.5 py-1.5 my-1.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors [&::-webkit-details-marker]:hidden"
        >
          <span className={`h-2.5 w-2.5 rounded-full ${DOTS[courseId] ?? 'bg-muted-foreground'} shrink-0`} />
          <span className="whitespace-nowrap">{COURSE_NAMES[courseId] ?? courseId}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
        </summary>
        <div className="absolute left-0 top-full z-50 mt-1 w-60 rounded-xl border border-border bg-card py-2 shadow-xl">
          <p className="px-4 pb-1 pt-0.5 text-xs uppercase tracking-wide text-muted-foreground">Change course</p>
          {Object.keys(COURSE_NAMES).map(id => (
            <Link
              key={id}
              href={courseHref(id, active)}
              aria-current={id === courseId ? 'true' : undefined}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-foreground/5 ${
                id === courseId ? 'font-semibold text-foreground' : 'text-foreground-2 hover:text-foreground'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${DOTS[id]} shrink-0`} />
              {COURSE_NAMES[id]}
            </Link>
          ))}
        </div>
      </details>

      <span aria-hidden="true" className="my-2 w-px shrink-0 bg-border" />

      <div className="course-bar-tabs relative min-w-0 flex-1 overflow-x-auto">
        <div className="flex gap-1 sm:gap-2">
          {TABS.map(({ section, label, icon: Icon }) => {
            const isActive = section === active;
            return (
              <Link
                key={section}
                href={courseHref(courseId, section)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-1.5 whitespace-nowrap px-2.5 sm:px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? `${theme.text} ${theme.border}`
                    : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
