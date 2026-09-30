import { Calculator } from 'lucide-react';

// Whether a calculator is allowed, as a small picture beside the marks: a
// calculator, or a calculator struck through.
//
// The owner, 2026-09-30: every question should say calculator or
// non-calculator, then "I don't want layout to get messed up how about a small
// picture of a calculator and a calculator crossed out?". The words took
// 70-95px of a header that shares its line with the reorder buttons, and a
// tablet card's marks wrapped under them; the picture takes 20px.
//
// The word is still there for anyone who needs it: the tooltip, a screen
// reader's name, and `data-calculator`, which the checks read.

export default function CalculatorMark({
  label,
  className = '',
}: {
  label: 'Calculator' | 'Non-calculator';
  className?: string;
}) {
  const off = label === 'Non-calculator';
  // 16px wide, the icon's own width: on a 320px browse card a 20px box was the
  // 2px that wrapped the marks onto a second line (check:cardheader).
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      data-calculator={label}
      className={`q-calculator relative inline-flex h-5 w-4 shrink-0 items-center justify-center text-muted-foreground print:text-black ${className}`}
    >
      <Calculator className="h-4 w-4" aria-hidden="true" />
      {off && (
        // The strike, drawn twice: a wide band in the card's own colour first,
        // so the line reads clear of the keys it crosses, then the line itself.
        <svg viewBox="0 0 16 20" aria-hidden="true" className="absolute inset-0 h-5 w-4 overflow-visible">
          <line x1="1.5" y1="16.5" x2="14.5" y2="3.5" stroke="var(--card)" strokeWidth="4.5" strokeLinecap="round" className="print:[stroke:white]" />
          <line x1="1.5" y1="16.5" x2="14.5" y2="3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
}
