import type { CourseTheme } from '@/lib/course-theme';
import CalculatorMark from '@/components/CalculatorMark';

// Mark allocation, shown as the app shows it: the per-part breakdown in
// brackets when a question has several parts, then the total as a badge.
//
//    (3, 1, 2)  [ 6 Marks ]
//
// A pupil needs the total to judge how long to spend, and the breakdown to
// know how the marks are split across parts.
//
// And, where the caller says, whether a calculator is allowed, as a picture
// just before them (`CalculatorMark`). Here rather than beside each card's
// title so it sits in the same place on every view that shows a question:
// the worksheet, full screen, focus, the papers, the warm up (the owner,
// 2026-09-30: "the calculator icon needs to appear everywhere").

export default function Marks({
  marks,
  theme,
  calculator,
  className = '',
}: {
  marks?: number[];
  /** Omit on surfaces with no course context — falls back to neutral styling. */
  theme?: CourseTheme;
  /** From `calculatorLabel`; null or omitted shows no picture. */
  calculator?: 'Calculator' | 'Non-calculator' | null;
  className?: string;
}) {
  if (!marks || marks.length === 0) return null;

  const total = marks.reduce((a, b) => a + b, 0);
  const badge = theme ? `${theme.tint} ${theme.text}` : 'bg-foreground/5 text-muted-foreground';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* 4px nearer the badge than the row's gap: it belongs with the marks,
          and on a 320px browse card those 4px keep the row on one line. */}
      {calculator && <CalculatorMark label={calculator} className="-mr-1" />}
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
