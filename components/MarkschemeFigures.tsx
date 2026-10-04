/**
 * The drawings a generated Advanced Higher card's marking instructions give:
 * a sketch question's finished sketches, one per part.
 *
 * **With the working and the printed markscheme only, never under Show
 * answer** (the owner, 2026-10-01: "don't show the sketches on show answer
 * just the markscheme"). So this is rendered by the worked example and the
 * markscheme sheet, and by nothing a pupil opens by pressing Show answer.
 *
 * Each `svg` is drawn by the generator in `currentColor`, inline as the
 * question's own figure is, so it follows the theme on screen and prints
 * black. Nothing here renders when a card has none.
 */
interface Props {
  figures?: { part: string; svg: string }[];
  className?: string;
}

export default function MarkschemeFigures({ figures, className = '' }: Props) {
  if (!figures?.length) return null;
  return (
    <div className={`markscheme-figures flex flex-wrap gap-4 ${className}`}>
      {figures.map(({ part, svg }, i) => (
        <figure key={i} className="max-w-full">
          {part && <figcaption className="text-sm font-semibold">{part}</figcaption>}
          <div className="max-w-full overflow-x-auto [&_svg]:max-w-full [&_svg]:h-auto" dangerouslySetInnerHTML={{ __html: svg }} />
        </figure>
      ))}
    </div>
  );
}
