import Link from 'next/link';
import { BookOpen, Check, ChevronDown, Compass, FileText, GraduationCap, LayoutGrid, PencilLine } from 'lucide-react';
import { getCourseTheme } from '@/lib/course-theme';
import { COURSE_IDS, COURSE_NAMES, courseHref, type CourseSection } from '@/lib/course-nav';
import MenuDismiss from '@/components/MenuDismiss';

/**
 * The course bar: where you are inside a course, and everything else in it.
 *
 * **Why it exists.** The site used to run two navigation systems at once
 * (docs/navigation.md, 2026-09-28): a course had three tabs, while the Topic
 * Explorer and the Exam Hall sat in the top nav as if site-wide, each quietly
 * working on whichever course was used last. This bar is on every page that
 * belongs to a course, those two included, so the course is always where you
 * are.
 *
 * **It is a band under the site header, the same on every page.** It was
 * drawn inside each page's own column, and those columns are four different
 * widths with the bar above the heading on some and below it on others, so it
 * jumped sideways and down as you moved between sections. Pages render it as
 * their first element, outside their column, and it takes the header's width.
 *
 * **Nothing scrolls sideways.** On a phone the six sections used to scroll in
 * a strip whose only sign of more was a fade, which hid the last tab, the
 * Exam Hall, behind it. From `lg` up they all fit in one row, with the longest
 * course name. Below that the bar is one labelled button saying where you are
 * (course, then section), which opens the sections and the courses as a list.
 *
 * **The switcher keeps you in the same place.** Choosing Higher from the
 * Explorer's bar opens the Higher Explorer; from the notes, the Higher notes.
 *
 * **Native `<details>`, so the links are in the HTML and work without
 * JavaScript.** `MenuDismiss` adds what a menu is expected to do (close on
 * Escape, on a click elsewhere, and after choosing), and nothing else.
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

/** The five courses, each opening the same section; the current one ticked. */
function CourseList({ courseId, active }: { courseId: string; active: CourseSection }) {
  return (
    <ul>
      {COURSE_IDS.map(id => (
        <li key={id}>
          <Link
            href={courseHref(id, active)}
            aria-current={id === courseId ? 'true' : undefined}
            className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors hover:bg-muted ${
              id === courseId ? 'font-semibold text-foreground' : 'text-foreground-2 hover:text-foreground'
            }`}
          >
            <span className={`h-2 w-2 shrink-0 rounded-full ${DOTS[id]}`} />
            <span className="flex-1">{COURSE_NAMES[id]}</span>
            {id === courseId && <Check aria-hidden="true" className="h-4 w-4 text-muted-foreground" />}
          </Link>
        </li>
      ))}
    </ul>
  );
}

interface Props {
  courseId: string;
  active: CourseSection;
}

export default function CourseBar({ courseId, active }: Props) {
  const theme = getCourseTheme(courseId);
  const name = COURSE_NAMES[courseId] ?? courseId;
  const here = TABS.find(t => t.section === active) ?? TABS[0];
  const HereIcon = here.icon;

  return (
    <nav aria-label={`${name} sections`} className="no-print border-b border-border bg-card">
      <MenuDismiss />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Wide: the course switcher, then every section in one row. */}
        <div className="hidden lg:flex items-stretch gap-3">
          <details data-menu="popup" className="group relative flex shrink-0 items-center">
            <summary
              aria-label={`${name}: change course`}
              className="flex min-h-11 list-none items-center gap-2 rounded-lg px-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted group-open:bg-muted [&::-webkit-details-marker]:hidden"
            >
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${DOTS[courseId] ?? 'bg-muted-foreground'}`} />
              <span className="whitespace-nowrap">{name}</span>
              <ChevronDown aria-hidden="true" className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-xl border border-border bg-card p-2 shadow-xl">
              <p className="px-3 pb-1 pt-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">Change course</p>
              <CourseList courseId={courseId} active={active} />
            </div>
          </details>

          <span aria-hidden="true" className="my-3 w-px shrink-0 bg-border" />

          <ul className="flex gap-1">
            {TABS.map(({ section, label, icon: Icon }) => {
              const isActive = section === active;
              return (
                <li key={section} className="flex">
                  <Link
                    href={courseHref(courseId, section)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3.5 text-sm font-medium transition-colors ${
                      isActive
                        ? `${theme.text} ${theme.border}`
                        : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                    }`}
                  >
                    <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Narrow: one button saying where you are, opening everything. */}
        <details data-menu="disclosure" className="group lg:hidden">
          <summary className="flex list-none items-center gap-3 py-2.5 [&::-webkit-details-marker]:hidden">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${DOTS[courseId] ?? 'bg-muted-foreground'}`} />
            <span className="min-w-0 flex-1">
              <span className="block font-mono text-[11px] uppercase leading-4 tracking-widest text-muted-foreground">{name}</span>
              <span className={`flex items-center gap-1.5 font-semibold leading-6 ${theme.text}`}>
                <HereIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
                {here.label}
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground-2 transition-colors group-open:bg-muted group-hover:bg-muted">
              Menu
              <ChevronDown aria-hidden="true" className="h-4 w-4 transition-transform group-open:rotate-180" />
            </span>
          </summary>

          <div className="grid gap-4 border-t border-border py-3 sm:grid-cols-2 sm:gap-6">
            <div>
              <p className="px-3 pb-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">{name}</p>
              <ul>
                {TABS.map(({ section, label, icon: Icon }) => {
                  const isActive = section === active;
                  return (
                    <li key={section}>
                      <Link
                        href={courseHref(courseId, section)}
                        aria-current={isActive ? 'page' : undefined}
                        className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors ${
                          isActive
                            ? `bg-muted font-semibold ${theme.text}`
                            : 'text-foreground-2 hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <p className="px-3 pb-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">Change course</p>
              <CourseList courseId={courseId} active={active} />
            </div>
          </div>
        </details>
      </div>
    </nav>
  );
}
