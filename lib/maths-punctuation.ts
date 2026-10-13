/**
 * A full stop straight after a closing `\)` goes inside it: the site's punctuation rule (docs/maths-punctuation.md),
 * which the questions already follow. Outside, the stop is a box of its own that a narrow line can break before, so
 * it can wrap onto a line by itself; inside, it travels with the maths it ends.
 *
 * **Applied where hints, working and markschemes are shown** (the independent audit's card 10; the owner, 2026-10-13:
 * "Yes to both", hints and working, and markschemes): the hint panel, the worked example in it, the printed
 * markscheme sheet and the markscheme table on past paper pages. At display, not in the tables or the generator, so
 * no question, card or shared link changes. The same pattern as the generator's own `stopsInsideMaths`
 * (lib/generator/worksheet-question.ts), kept here so these surfaces need not load the generator to use it.
 *
 * Not a stop before another stop: `\(x\)...` is an ellipsis.
 */
export function stopsInsideMaths(html: string): string;
export function stopsInsideMaths(html: string | null | undefined): string | null | undefined;
export function stopsInsideMaths(html: string | null | undefined) {
  return typeof html === 'string' ? html.replace(/\\\)\.(?!\.)/g, '.\\)') : html;
}
