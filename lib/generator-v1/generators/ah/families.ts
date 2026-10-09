/**
 * Advanced Higher cards that set the same question on different papers.
 *
 * The owner, 2026-09-29: "if routines for a generator are identical can we do
 * anything later that says if doing worksheet don't give 2 questions the
 * same?", and on 2025 P2 Q4 (the Euclid card 2026 P2 Q4 repeats): "Yes I think
 * we will do family label for actual identical questions". Each family below
 * was named on its paper's sheet and answered there. A worksheet drawn across a
 * topic treats a family as one card (`site.ts`), so it takes one of them before
 * it takes a second of anything.
 *
 * Nothing here changes a question: each card keeps its own routine and its own
 * numbers. `ah-site` fails on a label that is not a card, a family of one, or a
 * card in two families.
 */
import type { CardLabel } from './types';

export const AH_FAMILIES: Readonly<Record<string, readonly CardLabel[]>> = {
  // The Euclidean algorithm and back-substitution. On the 2017 and 2018
  // sheets, "the Euclid cards (2018 Q5, 2021 P2 Q2 to 2026 P2 Q4)"; on the
  // 2025 P2 sheet, Q4 with 2026 P2 Q4.
  euclid: ['2017 Q8', '2018 Q5', '2021 P2 Q2', '2022 P2 Q3', '2023 P2 Q6', '2024 P2 Q2', '2025 P2 Q4', '2026 P2 Q4'],
  // Three equations in three unknowns, solved by Gaussian elimination: 2022 P1
  // Q2 with 2026 P1 Q2, on the 2022 P1 sheet. (2025 P1 Q8, which the owner's
  // question of 2026-09-29 was about, is one card of three parts on planes,
  // not the same question, so it is not here.)
  'gaussian-solve': ['2022 P1 Q2', '2026 P1 Q2'],
  // Gaussian elimination with lambda: z, the inconsistent lambda, a solution.
  'gaussian-lambda': ['2017 Q5', '2024 P2 Q3'],
  // A quadratic over a linear and a repeated linear factor.
  'partial-fractions-repeated': ['2017 Q2', '2023 P1 Q2'],
  // A second-order equation, a repeated root, sine and cosine on the right.
  'repeated-root-trig': ['2017 Q14', '2022 P2 Q10'],
  // A second-order equation with a quadratic on the right, and two conditions.
  'quadratic-right-side': ['2016 Q15', '2023 P1 Q5', '2025 P2 Q12'],
  // A second-order homogeneous equation with real roots, and two conditions.
  'homogeneous-conditions': ['2019 Q8', '2024 P2 Q4', '2026 P1 Q4'],
  // A number from one base to another, through base 10.
  'base-change': ['2019 Q12', '2026 P2 Q9'],
  // The derivative of a multiple of an inverse sine of a multiple of x.
  'inverse-sine': ['2023 P2 Q1', '2026 P2 Q1'],
};

const FAMILY_OF: ReadonlyMap<CardLabel, string> = new Map(
  Object.entries(AH_FAMILIES).flatMap(([family, cards]) => cards.map(card => [card, family] as const)));

/** The family a card belongs to, or undefined for a card that has none. */
export function familyOf(card: CardLabel): string | undefined {
  return FAMILY_OF.get(card);
}
