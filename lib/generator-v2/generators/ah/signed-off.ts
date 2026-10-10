/**
 * Which Advanced Higher papers the owner has signed off.
 *
 * The owner's rule, from National 5: *"Once a question has been flagged as done
 * nothing else should change it except me saying so."* A card on a paper named
 * here is frozen: `ah-frozen` fingerprints it and fails if it moves.
 *
 * A paper is added here only on the owner's word, in the commit that records
 * its fingerprints (`scripts/ah/record-snapshots.mts`), with the owner's words
 * in the commit message. Papers are keyed as "2025 P1", or "2019" for a
 * single-paper year.
 *
 * Because every card has its own routine and the maths helpers draw nothing,
 * signing a paper off never has to split anything: there is no routine shared
 * with an unreviewed paper to move off. That is the difference from National
 * 5's `signed-off.ts`, which needed `lock-year` to branch aliases.
 */
import type { CardLabel } from './types';
import { AH_CARD } from './cards';

export const SIGNED_OFF_AH: ReadonlySet<string> = new Set<string>([
  // 2026-09-29, the owner on the sheet: "Yes to all 3" (Q1 keeps sec, Q3
  // keeps √3, Q6's power up) and "Q6 seems fine".
  '2026 P1',
  // 2026-09-29, the owner on the sheet, after their comments were built:
  // "Ok I confirm".
  '2026 P2',
  // 2026-09-29, the owner, after answering the sheet (every card kept as
  // built): "Ok we can lock it".
  '2025 P1',
  // 2026-09-29, the owner, every card kept as built on their answers, then
  // "Ok we are just keep all 8 for 18 then lock".
  '2025 P2',
  // 2026-09-29, the owner on the sheet, every card kept as built ("Yes";
  // Q6 "Yes keep" the rotations), then "Lock it".
  '2024 P1',
  // 2026-09-29, the owner on the sheet, "Yes" to every card but Q11; Q11
  // "More please" (widened to 6), then "Yes" to exempt at 6; then "lock and push".
  '2024 P2',
  // 2026-09-29, the owner on the sheet, "Yes" to every card but Q3 and Q7;
  // Q3 "Make half redundant" and Q7 "biggest should be no larger than paper",
  // each then confirmed; then "Push and lock".
  '2023 P1',
  // 2026-09-30, the owner on the sheet, "Yes" to every card, Q12 "Keep 16",
  // Q13 "Keep all six events"; then "Lock and push".
  '2023 P2',
  // 2026-09-30, the owner on the sheet, "Yes" to every card but Q6, Q6 "Keep
  // all 3 pairs"; then "Lock and push".
  '2022 P1',
  // 2026-10-01, the owner on the sheet, "Yes" to Q1, Q2, Q3, Q5, Q6, Q10, Q11,
  // Q13; Q4 "2 to 4"; Q7 "Either sign"; Q8 "Widen j to 6"; Q9 "Keep the 16";
  // Q12 "Keep it positive … Exempt at 3"; then "Lock and push".
  '2022 P2',
  // 2026-10-01, the owner on the sheet, "I agree with all recommendations";
  // Q7 bare blank axes and its sketches in the marking instructions, on their
  // comments, and "It should say on the diagram provided"; then "Lock and push".
  '2021 P1',
  // 2026-10-02/03, the owner on the sheet, "The rest of your suggestions I agree
  // with"; Q10 "Do number in front up to 4"; Q13 "a = 1, 2, 3", then "6 only"
  // (z⁵ alone, exempt at 6); "ah 2021 confirmed"; then "Lock and push AH".
  '2021 P2',
  // 2026-10-03, the owner on the sheet, "Yes" (or "Confirmed", "agreed", "16")
  // to every card but Q3; Q3 "Keep as a? Could we have 6 more of similar
  // difficulty to initial question?", built, then "Yes, record at 12"; Q18
  // exempt at 8; then "On 2019 I am happy to lock and load", "Lock and push".
  '2019',
  // 2026-10-04, the owner on the sheet, "Yes" to every card but Q9 and Q10;
  // Q9 "Keep 16", Q10 "Keep as built"; then "Lock and push".
  '2018',
  // 2026-10-04, the owner on the sheet, "yes", "agreed" or "confirmed" on every
  // card but Q13 and Q16; Q13 "keep 16"; Q16 "Could we extend so that half the
  // time it is rotated about the x-axis instead?", built; then "confirmed all
  // and lock".
  '2017',
  // 2026-10-04, the owner on the sheet, "Yes" to every card (Q5 exempt at 8);
  // then "Lock and push".
  '2016',
]);

/** The paper a card sits on, as `SIGNED_OFF_AH` keys it: "2025 P1" or "2019". */
export function paperKey(card: CardLabel): string {
  const m = AH_CARD.exec(card);
  if (!m) throw new Error(`paperKey: "${card}" is not an Advanced Higher card label`);
  return m[2] ? `${m[1]} P${m[2]}` : m[1];
}

export function isSignedOffAh(card: CardLabel): boolean {
  return SIGNED_OFF_AH.has(paperKey(card));
}
