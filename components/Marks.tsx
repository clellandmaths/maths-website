import type { CourseTheme } from '@/lib/course-theme';

// Mark allocation, shown as the app shows it: the per-part breakdown in
// brackets when a question has several parts, then the total as a badge.
//
//    (3, 1, 2)  [ 6 Marks ]
//
// A pupil needs the total to judge how long to spend, and the breakdown to
// know how the marks are split across parts.

export default function Marks({
  marks,
  theme,
  className = '',
}: {
  marks?: number[];
  /** Omit on surfaces with no course context — falls back to neutral styling. */
  theme?: CourseTheme;
  className?: string;
}) {
  if (!marks || marks.length === 0) return null;

  const total = marks.reduce((a, b) => a + b, 0);
  const badge = theme ? `${theme.tint} ${theme.text}` : 'bg-white/5 text-muted-foreground';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {marks.length > 1 && (
        <span className="text-muted-foreground text-xs font-mono print:text-black">
          ({marks.join(', ')})
        </span>
      )}
      <span className={`${badge} text-xs font-bold px-2 py-1 rounded whitespace-nowrap print:bg-transparent print:text-black print:border print:border-black/40`}>
        {total} {total === 1 ? 'Mark' : 'Marks'}
      </span>
    </div>
  );
}
