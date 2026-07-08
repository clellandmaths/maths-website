import Link from 'next/link';

export interface CourseCover {
  id: string;
  band: string;        // qualification band, e.g. "SQA · S4/S5"
  name: string;        // e.g. "National 5"
  subject: string;     // "Mathematics" | "Applications of Mathematics"
  gradient: string;    // tailwind gradient stops
  contents: string[];  // metadata rows, styled like exam-cover print
}

export default function ExamCover({ course }: { course: CourseCover }) {
  return (
    <Link href={`/course/${course.id}`} className="group block h-full">
      <div className="graph-paper relative flex flex-col h-full bg-card border border-border rounded-lg overflow-hidden transition-all duration-300 group-hover:border-white/25 group-hover:-translate-y-1">
        {/* Qualification band */}
        <div className={`bg-gradient-to-r ${course.gradient} px-4 py-2`}>
          <span className="font-mono text-[11px] uppercase tracking-widest text-white/90">
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
