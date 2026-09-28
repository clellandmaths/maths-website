import MathHtml from '@/components/MathHtml';
import type { SchemeMark } from '@/lib/generator/generators/paper-markscheme';

/**
 * One card's marking instructions on screen: a row per mark, then the notes.
 *
 * Used where AH shows its markscheme in place of a video (2016 to 2019 and
 * 2021): the Explorer's modal and the paper page. Rows arrive from
 * `cardScheme`, each with its mark's number in the whole question, so a part
 * card starts at its own mark rather than at •¹.
 */
export default function SchemeTable({
  rows,
  notes,
  accent,
}: {
  rows: { row: SchemeMark; n: number }[];
  notes: string[];
  /** The course's text colour class, for the headings. */
  accent: string;
}) {
  return (
    <div className="space-y-4">
      {/* `relative`, so the table's maths stays inside this scroll box. KaTeX
          writes each formula a second time for screen readers, absolutely
          positioned, and an absolute box escapes any scroll box that is not
          its positioning parent: on AH 2016 P1 those copies sat past the edge
          of the table and made the whole page 408px wide on a 320px phone
          (2026-09-28). */}
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className={`text-left font-mono text-xs uppercase tracking-widest ${accent}`}>
              <th className="py-2 pr-3 font-semibold">Mark</th>
              <th className="py-2 pr-3 font-semibold">Awarded for</th>
              <th className="py-2 font-semibold">Illustrative answer</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ row, n }) => (
              <tr key={n} className="border-t border-border align-top">
                <td className="py-2 pr-3 whitespace-nowrap text-foreground/70">
                  {row.part ? `${row.part} ` : ''}&bull;<sup>{n + 1}</sup>
                </td>
                <td className="py-2 pr-3 text-foreground/85">
                  <MathHtml html={row.for} className="inline" />
                </td>
                <td className="py-2 text-foreground/85">
                  <MathHtml html={row.shows} className="inline" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {notes.length > 0 && (
        <div>
          <h4 className={`font-mono text-xs font-semibold uppercase tracking-widest ${accent} mb-2`}>Notes</h4>
          <ul className="space-y-1.5 text-sm text-foreground/80">
            {notes.map((note, i) => (
              <li key={i}><MathHtml html={note} className="inline" /></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
