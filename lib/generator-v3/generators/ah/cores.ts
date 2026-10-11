/**
 * What a thin card's core is: the equation, integral or function the pupil works on,
 * read off the card's draw, without the numbers that only fit it (a condition, a
 * limit, a constant that vanishes when differentiated).
 *
 * The owner, 2026-10-05 (variation-depth sheet, card 1): "do we ensure that on a
 * worksheet that you are never given the same equation twice ie with just x = and
 * y = varying?" A sheet that draws one of these cards more than once takes a core it
 * has not used yet first, and repeats one, with new numbers, only once it cannot
 * find a fresh one (`drawCards` in `site.ts`). A preference, never a limit: no sheet
 * is shorter for it, and no card makes fewer questions.
 *
 * Opt-in, on the owner's "with the worksheet rule opt-in on the thin cards": the
 * cards whose core takes few values behind many questions, as measured in
 * `docs/verdicts/ah/variation-depth.md`. Every other card's core already changes with
 * nearly every question, so it needs none. A card not listed here is drawn exactly
 * as before.
 *
 * Reading the draw only: nothing here draws, builds or writes, so no card's
 * questions change and no fingerprint moves.
 */
import type { CardLabel } from './types';

/* eslint-disable @typescript-eslint/no-explicit-any -- each card's draw has its own shape */
export const CORES: Readonly<Record<CardLabel, (d: any) => string>> = {
  // The cards widened on the variation-depth sheet.
  '2025 P1 Q7': d => `${d.beta} ${d.t}`,           // y/(2x + β) or 3y/(2x + β)
  '2017 Q9': d => `${d.a} ${d.k}`,                 // ae^{kx}(1 + y²)
  '2021 P1 Q5': d => `${d.c} ${d.s}`,              // y = c√(x + s)
  '2024 P2 Q8': d => `${d.k} ${d.b}`,              // k/√(b² + x²)
  '2018 Q15': d => `${d.k}`,                       // (a) ∫ x sin kx dx
  '2019 Q16': d => `${d.p} ${d.m}`,                // (a) ∫ (x - p)² e^{mx} dx
  '2026 P2 Q16': d => `${d.k} ${d.j}`,             // (b) ∫ x g(x) dx
  '2025 P2 Q11': d => `${d.m} ${d.a}`,             // (a) ∫ ax e^{-2mx²} dx
  '2023 P2 Q13': d => `${d.event} ${d.dC} ${d.dB}`, // the event's equation
  '2021 P2 Q8': d => `${d.k} ${d.p} ${d.q}`,       // (a): N vanishes
  '2019 Q10': d => `${d.a} ${d.b}`,                // (a): N vanishes
  '2021 P2 Q7': d => `${d.k}`,                     // (a) (a + ki)³
  '2026 P1 Q6': d => `${d.k} ${d.n} ${d.a}`,       // (a) ∫ ax(x - k)^n dx
  '2016 Q11': d => `${d.a}`,                       // V = ah³
  // A part with few versions, the rest of the card varied (the sheet's cards 13 and 14).
  '2022 P1 Q5': d => `${d.k}`,                     // (a) the series for e^{-kx}
  '2023 P1 Q7': d => `${d.k}`,                     // (a) the sum of r² + kr
  '2017 Q10': d => `${d.m}`,                       // (a) the sum, in thirds
  '2024 P2 Q13': d => `${d.k}`,                    // (b) ∫ xe^{kx} dx
  '2023 P2 Q15': d => `${d.a} ${d.c}`,             // the given f'(x)
  '2026 P2 Q10': d => `${d.k} ${d.m}`,             // (a): the constant vanishes
  '2016 Q1(c)': d => `${d.a} ${d.c}`,              // x = at, y = b - c cos t: b vanishes
};

/** The key a sheet holds for a draw's core, or undefined for a card with none. */
export function coreKey(card: CardLabel, draw: unknown): string | undefined {
  const core = CORES[card];
  return core ? `core:${card}:${core(draw)}` : undefined;
}
