import type { GeneratedQuestion } from './generators/types';

/**
 * **The shape of a question, as opposed to its numbers.**
 *
 * `question-key.ts` answers *are these two draws the same question?* — it
 * normalises letters so `x^2 + 5x + 6` and `y^2 + 5y + 6` count once. This
 * answers the coarser question above it: *would a pupil say these two draws
 * were the same KIND of question?* A figure on one and not the other, or "(a)
 * … (b) …" against one line, or a sine against a cosine — each of those is a
 * second question wearing the first one's name.
 *
 * The owner's rule, 2026-09-19: *"we never do a coin toss. A question should
 * only be served by 1 generator."* `__checks__/one-form.ts` enforces it and
 * `scripts/emit-clone-review.ts --forms` shows the forms side by side so the
 * owner can judge them. Both read the shape from here, so they cannot disagree
 * about what a form is.
 *
 * **What it deliberately ignores.** The story is free and is supposed to vary —
 * a cone may be a party hat or a funnel, and `__checks__/contexts.ts` insists
 * that it does — so prose never reaches this. Neither do numbers, letters or
 * rotation, which are the things `docs/PLAN.md` lists a split as never being
 * for. That makes this a floor and not a ceiling: two draws can still be
 * different questions in a way it cannot see, and reading them is still the
 * job. 2022 P1 Q10 tells a discount story on some draws and a "15% more than
 * last year" story on others, and this calls them one form.
 */
export interface QuestionForm {
  /** Does the question print a figure? */
  figure: boolean;
  /** Is it asked in lettered parts rather than one instruction? */
  parts: boolean;
  /** The LaTeX commands its maths uses, sorted and deduplicated. */
  commands: string[];
}

/**
 * Commands that follow from formatting rather than from what is being asked.
 *
 * `\left`/`\right` follow from the brackets, `\circ` from a degree sign and
 * `\cdot` from the way a decimal point is printed. None of the four says
 * anything about the question, and leaving them in made two draws of the same
 * question look like two forms whenever one of them happened to need a bracket.
 */
const FORMATTING = new Set(['left', 'right', 'circ', 'cdot', 'quad', 'qquad']);

export function formOf(q: Pick<GeneratedQuestion, 'questionLines'>): QuestionForm {
  const lines = q.questionLines ?? [];
  const joined = lines.join('\n');

  const commands = new Set<string>();
  for (const m of joined.matchAll(/\\([a-zA-Z]+)/g)) {
    if (!FORMATTING.has(m[1])) commands.add(m[1]);
  }

  return {
    figure: /<svg/.test(joined),
    // "(a)" at the head of a line, however it is marked up — the papers in the
    // corpus that do it use <b>, <strong> and bare text between them.
    parts: lines.some(l =>
      /^(?:<[^>]+>\s*)*\(?[a-h]\)/.test(l.replace(/&nbsp;/g, ' ').trim())),
    commands: [...commands].sort(),
  };
}

/** Two forms are the same form when this matches. */
export const formKey = (f: QuestionForm): string =>
  `figure=${f.figure} parts=${f.parts} maths={${f.commands.join(',')}}`;

/** The same thing in English, for a sheet a person is going to read. */
export function describeForm(f: QuestionForm): string {
  const bits = [
    f.figure ? 'with a figure' : 'no figure',
    f.parts ? 'asked in lettered parts' : 'asked in one instruction',
  ];
  if (f.commands.length) bits.push(`maths uses \\${f.commands.join(', \\')}`);
  else bits.push('no LaTeX commands');
  return bits.join(' · ');
}
