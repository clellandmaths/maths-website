import type { QuestionWithMetadata } from '@/lib/data-loader';

/**
 * A generated Advanced Higher question's ladder, staged as its paper card's.
 *
 * Its marks line is its paper card's ("(a) 2 marks, (b) 2 marks"), which
 * names no value. Its skill is its card's, written to fit every draw; the
 * paper card's names the paper's own numbers. The rungs are its own moves,
 * marks, working and watch-out, with this draw's numbers.
 *
 * **Loaded at the press**, as the paper tables are: `Hints` is on every
 * practice and paper page, and those pages' JavaScript budget had a few bytes
 * of headroom.
 */
export async function stageAhLadder(question: QuestionWithMetadata) {
  const { PLAN_AH } = await import('@/lib/generator/generators/paper-plan-ah');
  const paper = PLAN_AH[question.basedOn?.[0] ?? ''];
  const l = question.ladder!;
  const worth = l.marks.reduce((a, b) => a + b, 0);
  return {
    skill: question.skill ?? paper?.skill ?? '',
    method: paper?.method ?? `${worth} mark${worth === 1 ? '' : 's'}`,
    rungs: l.moves.map((move, i) => ({
      move, marks: l.marks[i], shows: l.shows[i],
      ...(l.watch?.at === i ? { watch: l.watch.text } : {}),
    })),
    heldBack: false,
  };
}
