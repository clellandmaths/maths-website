import Link from 'next/link';
import { getCourseTheme } from '@/lib/course-theme';

export interface CourseCover {
  id: string;
  band: string;        // qualification band, e.g. "S4/S5 · National 5"
  name: string;        // e.g. "National 5"
  subject: string;     // "Mathematics" | "Applications of Mathematics"
  contents: string[];  // metadata rows, styled like exam-cover print
  /**
   * **`gradient` is deliberately not a field.** It comes from
   * `lib/course-theme.ts`, keyed on `id`. The home page used to carry its own
   * copy of all five stops, and they drifted the moment it mattered: the course
   * accents were darkened to clear WCAG AA and every surface on the site
   * followed except this one, which sat on `from-cyan-600 to-blue-600` still
   * failing at 3.22:1 while `check:contrast` reported every other page clean.
   * One course identity, one place to read it from.
   */
}

export default function ExamCover({ course }: { course: CourseCover }) {
  const theme = getCourseTheme(course.id);
  return (
    <Link href={`/course/${course.id}`} className="group block h-full">
      <div className="graph-paper relative flex flex-col h-full bg-card border border-border rounded-lg overflow-hidden transition-all duration-300 group-hover:border-white/25 group-hover:-translate-y-1">
        {/* Qualification band */}
        <div className={`bg-gradient-to-r ${theme.gradient} px-4 py-2`}>
          {/* Full white, not `text-white/90`. Faded white on a coloured band is
              the thing that failed here: 3.22:1 on the old cyan and still only
              4.37:1 on the corrected amber. The 10% bought nothing a reader
              could see and cost the one thing they need. */}
          <span className="font-mono text-xs uppercase tracking-widest text-white">
            {course.band}
          </span>
        </div>

        {/* Title block */}
        <div className="px-4 pt-4 pb-3">
          <h3 className="font-display text-xl font-bold leading-tight text-foreground">
            {course.name}
          </h3>
          <p className="text-sm text-muted-foreground">{course.subject}</p>
        </div>

        {/* Contents rows — exam-cover metadata */}
        <ul className="px-4 space-y-1.5 flex-1">
          {course.contents.map((row) => (
            <li key={row} className="font-mono text-xs text-muted-foreground flex items-baseline gap-2">
              <span className="text-signal-mint/60">—</span>
              {row}
            </li>
          ))}
        </ul>

        {/* Marks line */}
        <div className="px-4 py-3 mt-4 border-t border-border flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground">Total cost — <span className="text-foreground font-semibold">£0</span></span>
          <span className="text-sm text-foreground/70 group-hover:text-foreground transition-colors">→</span>
        </div>
      </div>
    </Link>
  );
}
