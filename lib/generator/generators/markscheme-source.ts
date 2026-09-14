/**
 * The transcribed marking instructions, read as data.
 *
 * `reference/N5_Markschemes/` holds one markdown file per paper (or per year,
 * for the older ones that carry both), transcribed from the published marking
 * instructions with **one table row per mark**. That shape is what makes them
 * data rather than prose, and it is why a steps table can be built at all:
 * 328 of 328 questions have rows that reconcile with their own mark total.
 *
 * **One reader, two jobs.** `markschemes.ts` needs the totals to prove a
 * variation's marks were checked against the scheme; `emit-paper-steps.ts`
 * needs the rows to tell a pupil what each mark is for. Those were two parses
 * of the same files for a while, which is one parse too many - the second
 * would have drifted from the first and nothing would have said so.
 *
 * **The folder is Qualifications Scotland copyright and deliberately
 * untracked.** A fresh clone does not have it. Callers must handle `null`
 * rather than assume: nine checks used to report "nothing to check" and pass,
 * which is the failure mode this repo has been bitten by before.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/** One mark, as the scheme describes it. */
export interface MarkRow {
  /** The generic scheme: what this mark is for. Never the answer. */
  for: string;
  /** The illustrative scheme: the answer the scheme gives for this mark. */
  illustrative: string;
  /** "(a)", "(i)" — where the transcription carries one. */
  part?: string;
}

export interface SchemeQuestion {
  /** "2024 P2 Q7" */
  label: string;
  /** The heading's total, which the rows are checked against. */
  marks: number;
  /** The line under the heading — "Algebraic fractions." */
  subject: string;
  rows: MarkRow[];
  /** Marks per lettered part, where the question has them. */
  parts: Map<string, number>;
  /**
   * The scheme's notes, one entry per numbered point.
   *
   * These are the most useful thing on the page for anyone marking a class
   * set - "Accept 15 728 or 15 728.10. However, do not accept 15 728.1" - and
   * they are the one part a generated solution can never supply. Kept out of
   * the hint table on purpose and carried into the printed markscheme, which
   * is the document they were written for.
   *
   * A note may be headed for a single part, "**Notes — (b)**"; the heading is
   * kept in front of the note so a marker knows which part it governs.
   */
  notes: string[];
}

/**
 * A mark row, in either shape the corpus uses.
 *
 *   | •¹ | skill | illustrative |
 *   | (i) | •¹ | state value of $a$ | $-2$ | 1 |
 *
 * The bullet is in the first cell in one and the second in the other, and for
 * a long time only the first was read: six questions came back with fewer rows
 * than marks, and three with none at all. So the bullet is *found* rather than
 * assumed, and what follows it is the generic scheme.
 *
 * A row may carry two illustrative columns where the scheme accepts two
 * methods. The first is taken: both describe the same mark, and the generic
 * scheme column already names what the mark is for either way.
 */
function readRow(line: string): MarkRow | null {
  if (!line.startsWith('|')) return null;
  const cells = line.split('|').slice(1, -1).map(c => c.trim());
  if (cells.length < 3) return null;

  const at = cells.findIndex((c, i) => i < 2 && /•/.test(c));
  if (at === -1) return null;

  const scheme = cells[at + 1] ?? '';
  if (!scheme) return null;

  const row: MarkRow = { for: scheme, illustrative: cells[at + 2] ?? '' };
  // The part column, where this shape carries one: "(i)", "(a)".
  const before = at > 0 ? cells[0] : '';
  const part = /^\(([a-z]|[ivx]+)\)$/.exec(before);
  if (part) row.part = before;
  return row;
}

/**
 * Every question in the corpus, keyed by its paper label.
 *
 * Null when the folder is absent, so a caller can say so rather than report
 * that it found nothing wrong.
 */
export function readSchemes(dir?: string): Map<string, SchemeQuestion> | null {
  const DIR = dir ?? join(process.cwd(), '..', 'reference', 'N5_Markschemes');
  if (!existsSync(DIR)) return null;

  const out = new Map<string, SchemeQuestion>();

  for (const file of readdirSync(DIR).filter(f => f.endsWith('.md'))) {
    const year = file.match(/(20\d\d)/)?.[1];
    if (!year) continue;

    // Two naming shapes: "mi_..._Paper-1_2024.md" and "N5_2023_P1_MS.md".
    // Reading only the first left ten citations reporting no markscheme when
    // the markscheme was sitting right there.
    const named = file.match(/Paper-(\d)/)?.[1] ?? file.match(/_P(\d)_/)?.[1];
    let paper = named ?? '';
    let current: SchemeQuestion | null = null;
    let section: string | null = null;

    for (const line of readFileSync(join(DIR, file), 'utf8').split('\n')) {
      // A year file carries both papers, under "## Paper 1".
      const paperHead = /^##\s+Paper\s+(\d)/.exec(line);
      if (paperHead) { paper = paperHead[1]; current = null; section = null; continue; }

      // "## Q7 — 2 marks ✓", "### Q19 — 7 marks ✓ (2 + 1 + 4)". Singular too:
      // requiring the plural made every one-mark question invisible.
      const head = /^#+\s+Q(\d+)\s*\D*?(\d+)\s+marks?\b/.exec(line);
      if (head && paper) {
        current = {
          label: `${year} P${paper} Q${head[1]}`,
          marks: Number(head[2]),
          subject: '',
          rows: [],
          parts: new Map(),
          notes: [],
        };
        out.set(current.label, current);
        section = null;
        continue;
      }
      if (!current) continue;

      // "**Notes**", "**Notes — (b)**", "**Commonly Observed Responses**".
      // Both are marker's guidance and both belong on a printed markscheme;
      // the part heading travels with the note so it is clear what it governs.
      const marker = /^\*\*(Notes|Commonly Observed Responses)\s*(—\s*\(([a-z])\))?\*\*/.exec(line);
      if (marker) {
        section = marker[3] ? `(${marker[3]}) ` : '';
        if (marker[1] !== 'Notes') section = `${section}Commonly observed: `;
        continue;
      }
      // A numbered point under one of those markers. Anything else ends it —
      // the next table, heading or rule is a new part of the question.
      if (section !== null) {
        if (/^\s*\d+\.\s/.test(line)) {
          current.notes.push(section + line.trim());
          continue;
        }
        // A continuation line, indented under the point it belongs to.
        if (/^\s{3,}\S/.test(line) && current.notes.length) {
          current.notes[current.notes.length - 1] += ' ' + line.trim();
          continue;
        }
        if (line.startsWith('|') || line.startsWith('#') || line.startsWith('---')
            || line.startsWith('**')) {
          section = null;
        } else if (line.trim() && !current.notes.length) {
          // A note with no number, "Ordered list for reference: 2 2 4 …".
          current.notes.push(section + line.trim());
          continue;
        }
      }

      // "**(a) — 4 marks.**", "**(a)(i) — 1 mark.**". Roman sub-parts fold
      // into their letter, so (a)(i) 1 and (a)(ii) 3 make "a" worth 4.
      const part = /^\*\*\(([a-z])\)(?:\([ivx]+\))?\s*\D*?(\d+)\s+marks?\b/.exec(line);
      if (part) {
        current.parts.set(part[1], (current.parts.get(part[1]) ?? 0) + Number(part[2]));
        continue;
      }

      const row = readRow(line);
      if (row) { current.rows.push(row); continue; }

      // The subject line sits under the heading, before any table.
      if (!current.subject && !current.rows.length && line.trim() && !line.startsWith('|')
          && !line.startsWith('**') && !line.startsWith('#') && !line.startsWith('-')) {
        current.subject = line.trim();
      }
    }
  }

  return out;
}
