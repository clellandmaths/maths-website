/**
 * Advanced Higher card labels: what paper a card sits on, and its id.
 *
 * Both are derived from the label rather than written on each card, so they
 * cannot disagree with it. The label is the site's own badge, the one thing
 * every table here (the site's questions, the marking instructions, the hint
 * ladders) is already keyed by.
 */
import type { CardLabel, PaperOf } from './types';

/**
 * "2025 P1 Q3", "2019 Q4", "2019 Q1(b)", "2021 P2 Q11(a)(b)".
 *
 * Papers from 2021 carry P1 or P2; 2016 to 2019 were one paper and carry
 * none. A card that is one part of a question on the site carries its parts.
 */
export const AH_CARD = /^(\d{4})(?: P([12]))? Q(\d+)((?:\([a-z]\))*)$/;

/** The paper a card is on. Throws on a label that is not a card. */
export function paperOf(card: CardLabel): PaperOf {
  const m = AH_CARD.exec(card);
  if (!m) throw new Error(`paperOf: "${card}" is not an Advanced Higher card label`);
  const year = Number(m[1]);
  const paper = m[2] ? (Number(m[2]) as 1 | 2) : null;
  // Two papers from 2021, the first without a calculator. Before that, one
  // paper with a calculator allowed throughout.
  return { year, paper, calculator: paper !== 1 };
}

/**
 * The card's variation id: "ah.2025-p1-q3", "ah.2019-q4", "ah.2019-q1b".
 *
 * Derived, and so permanent: the code in a shared link is derived from it in
 * turn (`codes.ts`). The `ah.` prefix keeps every id distinct from National
 * 5's, whose labels are spelled the same way ("2025 P1 Q3" is a card in both).
 */
export function ahId(card: CardLabel): string {
  const m = AH_CARD.exec(card);
  if (!m) throw new Error(`ahId: "${card}" is not an Advanced Higher card label`);
  const [, year, paper, q, parts] = m;
  const letters = parts.replace(/[()]/g, '');
  return `ah.${year}${paper ? `-p${paper}` : ''}-q${q}${letters}`;
}

/** The part letters a card label names: [] for a whole question, ['a','b'] for "Q11(a)(b)". */
export function partsOf(card: CardLabel): string[] {
  const m = AH_CARD.exec(card);
  if (!m) throw new Error(`partsOf: "${card}" is not an Advanced Higher card label`);
  return m[4].replace(/[()]/g, ' ').trim().split(/\s+/).filter(Boolean);
}
