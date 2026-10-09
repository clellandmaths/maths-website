/**
 * The only randomness an Advanced Higher routine may use.
 *
 * Every function here reads the one seeded stream in `utils.ts`, so a card
 * drawn under a seed is byte-identical wherever it is drawn: in a shared link,
 * in the fingerprint, in a teacher's browser a year later. `ah-purity` fails
 * any file under `ah/` that reaches for randomness another way, and any file
 * outside `ah/routines/` that imports this one: helpers in `ah/maths/` draw
 * nothing, so the draws a card makes are all in its own `draw`.
 *
 * The engine only ever calls a routine inside a seed (`engine.ts`), so the
 * unseeded fallback in `utils.random` is never reached from here.
 */
import { random } from '../utils';

/** A whole number from `min` to `max`, both included. */
export function int(min: number, max: number): number {
  if (!Number.isInteger(min) || !Number.isInteger(max) || max < min) {
    throw new Error(`int: bad range ${min}..${max}`);
  }
  return min + Math.floor(random() * (max - min + 1));
}

/** A whole number from `min` to `max`, never 0. */
export function nonZero(min: number, max: number): number {
  const choices: number[] = [];
  for (let v = min; v <= max; v++) if (v !== 0) choices.push(v);
  if (!choices.length) throw new Error(`nonZero: no choice in ${min}..${max}`);
  return pick(choices);
}

/** 1 or -1. */
export function sign(): 1 | -1 {
  return random() < 0.5 ? 1 : -1;
}

/** One of `xs`. */
export function pick<T>(xs: readonly T[]): T {
  if (!xs.length) throw new Error('pick: nothing to choose from');
  return xs[Math.floor(random() * xs.length)];
}

/** `n` different values from `xs`, in the order drawn. */
export function distinct<T>(xs: readonly T[], n: number): T[] {
  if (n > xs.length) throw new Error(`distinct: ${n} from ${xs.length}`);
  const pool = [...xs];
  const out: T[] = [];
  for (let i = 0; i < n; i++) out.push(pool.splice(Math.floor(random() * pool.length), 1)[0]);
  return out;
}

/**
 * Draw until `ok` holds, a bounded number of times, then throw.
 *
 * For a constraint the answer-first construction cannot build in directly
 * (a denominator that factorises, no zero coefficient). **Throw rather than
 * fall back**: a silent fallback hands out a malformed question, and a throw
 * is something `ah-draws` sees. Keep what `ok` rejects rare, and measure it:
 * a loop that keeps only "nice" draws quietly starves the rarer shapes.
 */
export function until<T>(make: () => T, ok: (v: T) => boolean, limit = 200): T {
  for (let i = 0; i < limit; i++) {
    const v = make();
    if (ok(v)) return v;
  }
  throw new Error(`until: no acceptable draw in ${limit} tries`);
}
