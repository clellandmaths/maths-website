/**
 * Twins the shared "same question" test cannot see, card by card, as the owner ruled
 * them on the AH twins follow-up sheet (2026-10-10, https://claude.ai/artifact/3UdQ31WiceQHdHUftEVGCa).
 * Each reads the card's draw and gives one key to every question of a twin set, so two
 * questions with the same key never share a sheet (`drawCards` in `site.ts` adds it to the
 * question's `twinKeys`). Every card still makes every question.
 *
 * Reading the draw only, as `cores.ts`: nothing here draws, builds or writes, so no card's
 * questions change and no fingerprint moves.
 */
import type { CardLabel } from './types';

/** The smallest of a twin set's spellings, as the set's one key. */
const least = (...xs: string[]) => [...xs].sort()[0];

/** The six orders of x, y and z. */
const ORDERS: readonly [number, number, number][] = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
const reorder = (v: readonly number[], o: readonly number[]) => o.map(i => v[i]);

/** f against −f in 2019 Q3: the five forms that are another form negated. */
const NEGATED_2019: Readonly<Record<string, string>> = {
  'a2-x2': 'x2-a2', 'a2x-x3': 'x3-a2x', 'ax-x2': 'x2-ax', '4a2-x2': 'x2-4a2', '2ax-x2': 'x2-2ax',
};

/* eslint-disable @typescript-eslint/no-explicit-any -- each card's draw has its own shape */
export const CARD_TWINS: Readonly<Record<CardLabel, (d: any) => string>> = {
  // A: z1 = a + bi, z2 = c + di against z1 = d + ci, z2 = b + ai: the same four
  // multiplications in z1 times the conjugate of z2, the same answer. The owner: "Same".
  '2022 P1 Q3': ({ a, b, c, d }) => least(`${a},${b},${c},${d}`, `${d},${c},${b},${a}`),
  // D: f against −f, under a modulus: the same parity and the same |f|. The owner: "Same".
  '2019 Q3': ({ form }) => NEGATED_2019[form] ?? form,
  // E: every point's coordinates in another order, the axes relabelled (the owner's N5
  // ruling (b), vector components reordered). The owner: "Same".
  '2021 P2 Q12': ({ n, Q, t, u, v }) => least(...ORDERS.map(o =>
    JSON.stringify([reorder(n, o), reorder(Q, o), t, reorder(u, o), reorder(v, o)]))),
};

/** The twin key of a card's draw, or undefined for a card with none. */
export function cardTwinKey(card: CardLabel, draw: unknown): string | undefined {
  const f = CARD_TWINS[card];
  return f ? `twin:${card}:${f(draw)}` : undefined;
}
