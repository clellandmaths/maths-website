/**
 * A card made under a seed: draw, then build, on the one seeded stream.
 *
 * Shared by every course built card by card. Lifted out of AH's `engine.ts`
 * unchanged on 2026-10-07 (docs/higher-course.md, step 2); AH's engine
 * re-exports these, so its callers and its fingerprints are as they were.
 *
 * Always under a seed. A shared link carries the code and the seed, and this
 * is what makes the same pair give the same question in every browser.
 */
import { mulberry32, seedFrom, setRandomStream } from '../utils';
import type { Built, CardRoutine } from './types';

/**
 * Run `fn` with the random stream seeded, restoring the previous stream after,
 * including when `fn` throws.
 *
 * **Synchronous on purpose.** The stream is module-level and shared with
 * National 5, so a seeded draw that awaited could interleave with another. The
 * routine is loaded first (the only await), then drawn and built inside this.
 */
export function withSeed<T>(seed: number | string, fn: () => T): T {
  const prev = setRandomStream(mulberry32(seedFrom(seed)));
  try {
    return fn();
  } finally {
    setRandomStream(prev);
  }
}

/** Draw then build, under a seed. The one place a card is made. */
export function makeWith(routine: CardRoutine, seed: number | string): Built {
  return withSeed(seed, () => routine.build(routine.draw()));
}

/**
 * The draw alone, under a seed: the numbers `makeWith` builds from with the same seed.
 * For reading a card's core (`cores.ts`); builds nothing.
 */
export function drawWith(routine: CardRoutine, seed: number | string): unknown {
  return withSeed(seed, () => routine.draw());
}
