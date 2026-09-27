/**
 * The printed marking instructions for a course, loaded when a teacher asks.
 *
 * **One table per course, because every course labels alike.** A Higher
 * "2019 P1 Q5" and a National 5 "2019 P1 Q5" are different questions, and a
 * single table keyed by label printed N5's scheme under 259 of 267 Higher
 * questions until 2026-09-26. So the table comes back tagged with the course
 * it belongs to, and `MarkschemeSheet` reads it only for that course.
 *
 * Each table is a dynamic import: it arrives with the teacher's press and is
 * never on a pupil's way (see `app/explorer/page.tsx`).
 */
import type { PaperScheme, SchemeMark } from '@/lib/generator/generators/paper-markscheme';
import { paperRef } from '@/lib/question-number.mjs';

export interface CourseSchemes {
  courseId: string;
  table: Record<string, PaperScheme>;
}

/** Courses with a published marking-instructions table. */
export const COURSES_WITH_SCHEMES = ['n5', 'higher', 'higher-apps', 'ah', 'n5-apps'] as const;

/**
 * An Advanced Higher card: its question's label, and the parts it carries.
 *
 * **Some AH cards are one part of a question**, "2019 Q1(a)", or two,
 * "2021 P2 Q11(a)(b)", while the table holds the whole question under
 * "2019 Q1". So a card is looked up by its question and prints only its own
 * parts. Before 2021 there was one paper a year, so the label has no paper.
 */
const AH_CARD = /^(\d{4}(?: P[12])? Q\d+)((?:\([a-z]\))*)$/;

export function ahCard(questionHtml: string | undefined): { label: string; ref: string; parts: string[] } | null {
  const ref = questionHtml ? paperRef(questionHtml) : null;
  const m = ref ? AH_CARD.exec(ref) : null;
  if (!ref || !m) return null;
  return { label: m[1], ref, parts: [...m[2].matchAll(/\(([a-z])\)/g)].map(p => p[1]) };
}

/**
 * An N5 Applications card: its question's label, and the parts it carries.
 *
 * Its part labels come in many forms, "2024 P2 Q7(a)", "Q8(a) & (b)",
 * "Q9(a) and (b)", "Q7 (b), (c), (d)", and ranges, "Q4 (a) - (d)" and
 * "Q6(b)-(c)", which carry every part between. The same reading as the
 * generator's `scripts/card-parts.ts`, which keys the hint ladders.
 */
const N5APPS_CARD = /^(\d{4} P[12] Q\d+)(.*)$/;

export function n5appsCard(questionHtml: string | undefined): { label: string; ref: string; parts: string[] } | null {
  const ref = questionHtml ? paperRef(questionHtml) : null;
  const m = ref ? N5APPS_CARD.exec(ref) : null;
  if (!ref || !m) return null;
  let parts = [...m[2].matchAll(/\(([a-z])\)/g)].map(p => p[1]);
  if (parts.length === 2 && /\)\s*-\s*\(/.test(m[2])) {
    const [a, b] = parts.map(l => l.charCodeAt(0));
    parts = Array.from({ length: b - a + 1 }, (_, i) => String.fromCharCode(a + i));
  }
  return { label: m[1], ref, parts };
}

/**
 * The rows and notes a card prints, each row with its mark's number in the
 * whole question. The part (b) card of a question starts at its own •³, not
 * a new •¹, so it agrees with the scheme's notes, which name marks by number.
 * A note headed for a part, "(b) 1. …", goes with that part; any other note
 * applies to the whole question and is kept.
 */
export function cardScheme(scheme: PaperScheme, parts: string[] = []) {
  const mine = (part: string | undefined) => !parts.length || (part !== undefined && parts.includes(part.slice(1, 2)));
  const rows: { row: SchemeMark; n: number }[] = scheme.rows
    .map((row, n) => ({ row, n }))
    .filter(({ row }) => mine(row.part));
  const notes = scheme.notes.filter(note => {
    const head = /^\(([a-z])\) /.exec(note);
    return !head || !parts.length || parts.includes(head[1]);
  });
  return { rows, notes };
}

export async function loadCourseSchemes(courseId: string): Promise<CourseSchemes> {
  switch (courseId) {
    case 'n5': {
      const { PAPER_MARKSCHEME } = await import('@/lib/generator/generators/paper-markscheme');
      return { courseId, table: PAPER_MARKSCHEME };
    }
    case 'higher': {
      const { PAPER_MARKSCHEME_HIGHER } = await import('@/lib/generator/generators/paper-markscheme-higher');
      return { courseId, table: PAPER_MARKSCHEME_HIGHER };
    }
    case 'higher-apps': {
      const { PAPER_MARKSCHEME_HIGHERAPPS } = await import('@/lib/generator/generators/paper-markscheme-higherapps');
      return { courseId, table: PAPER_MARKSCHEME_HIGHERAPPS };
    }
    case 'ah': {
      const { PAPER_MARKSCHEME_AH } = await import('@/lib/generator/generators/paper-markscheme-ah');
      return { courseId, table: PAPER_MARKSCHEME_AH };
    }
    case 'n5-apps': {
      const { PAPER_MARKSCHEME_N5APPS } = await import('@/lib/generator/generators/paper-markscheme-n5apps');
      return { courseId, table: PAPER_MARKSCHEME_N5APPS };
    }
    default:
      // No table for this course yet: the sheet prints each question's own
      // answer and says the published scheme is not included.
      return { courseId, table: {} };
  }
}
