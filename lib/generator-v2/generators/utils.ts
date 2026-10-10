export interface Point {
  x: number;
  y: number;
}

/**
 * **Every draw of randomness in the National 5 path comes through here.**
 *
 * A shared worksheet link carries a seed and has to reproduce exactly, a day
 * later and after a rebuild, or it is not a shared sheet. That needs one
 * stream that can be swapped, rather than forty files calling `Math.random`.
 *
 * Unseeded it *is* `Math.random`, so nothing changes for any existing caller,
 * and `withSeed` in `generator.ts` is the only thing that swaps it.
 */
let stream: (() => number) | null = null;

/** A float in [0, 1), from the current stream. */
export function random(): number {
  return stream === null ? Math.random() : stream();
}

/** Swap the stream. `null` restores `Math.random`. Returns the previous one. */
export function setRandomStream(next: (() => number) | null): (() => number) | null {
  const prev = stream;
  stream = next;
  return prev;
}

/**
 * mulberry32 — small, fast, and good enough for choosing questions.
 *
 * Not cryptographic and does not need to be. What it needs is to be *the same
 * everywhere*: the same seed must give the same sheet in the teacher's browser
 * and in every pupil's, so the algorithm has to live in the code rather than
 * in whatever the platform's PRNG happens to be.
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A seed from a string, so a link can carry something readable. */
export function seedFrom(seed: number | string): number {
  if (typeof seed === 'number') return seed >>> 0;
  // FNV-1a, 32-bit.
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function getRandomInt(min: number, max: number) {
  return Math.floor(random() * (max - min + 1)) + min;
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  if (b === 0) return a;
  return gcd(b, a % b);
}

export function simplifyFraction(num: number, den: number) {
  if (den === 0) throw new Error("Denominator is zero");
  let g = gcd(num, den);
  num /= g;
  den /= g;
  if (den < 0) {
    num = -num;
    den = -den;
  }
  return { num, den };
}

export function formatFraction(num: number, den: number) {
  const f = simplifyFraction(num, den);
  if (f.den === 1) return `${f.num}`;
  if (f.num === 0) return `0`;
  if (f.num < 0) return `-\\frac{${Math.abs(f.num)}}{${f.den}}`;
  return `\\frac{${f.num}}{${f.den}}`;
}

export function formatFractionWithSub(num: number, den: number) {
  const f = simplifyFraction(num, den);
  if (f.den === 1) return `${f.num}`;
  if (f.num === 0) return `0`;
  if (f.num < 0) {
    return `-\\frac{${Math.abs(f.num)}}{${f.den}}`;
  }
  return `\\frac{${f.num}}{${f.den}}`;
}

export function formatTerm(coeff: number, variable: string, isFirst: boolean) {
  if (coeff === 0) return "";
  let term = "";
  if (coeff < 0) {
    term += isFirst ? "-" : " - ";
  } else if (!isFirst) {
    term += " + ";
  }
  const absCoeff = Math.abs(coeff);
  if (absCoeff !== 1 || variable === "") {
    term += absCoeff;
  }
  term += variable;
  return term;
}

export function formatEquation(A: number, B: number, C: number) {
  if (A < 0 || (A === 0 && B < 0)) {
    A = -A;
    B = -B;
    C = -C;
  }
  let parts = [];
  if (A !== 0) parts.push(formatTerm(A, "x", true));
  if (B !== 0) parts.push(formatTerm(B, "y", parts.length === 0));
  if (C !== 0) parts.push(formatTerm(C, "", parts.length === 0));
  return parts.join("") + " = 0";
}

export function generateTriangle(
  validator: (A: Point, B: Point, C: Point) => boolean,
) {
  while (true) {
    let A = { x: getRandomInt(-10, 10), y: getRandomInt(-10, 10) };
    let B = { x: getRandomInt(-10, 10), y: getRandomInt(-10, 10) };
    let C = { x: getRandomInt(-10, 10), y: getRandomInt(-10, 10) };

    if (A.x === B.x || A.y === B.y) continue;
    if (B.x === C.x || B.y === C.y) continue;
    if (C.x === A.x || C.y === A.y) continue;

    if ((B.y - A.y) * (C.x - A.x) === (C.y - A.y) * (B.x - A.x)) continue;

    if (validator(A, B, C)) {
      return { A, B, C };
    }
  }
}

export const formatNum = (v: number) => (v < 0 ? `(${v})` : `${v}`);

export const nonZeroInt = (min: number, max: number) => {
  let r = 0;
  while (r === 0) r = getRandomInt(min, max);
  return r;
};

// ── decimals a pupil would recognise ──────────────────────────────────────
//
// `toFixed` rounds the value a double actually holds, not the one it was
// written as. £15,134.925 is stored a hair below itself, so `toFixed(2)` gives
// .92 where every marking instruction rounds half up to .93 — measured at 111
// of 3,000 two-stage depreciation answers. The same fault made "Round 0.5405
// to 3 dp" print 0.540, on the one topic whose whole subject is rounding.
//
// Both are fixed by rounding the *decimal* rather than the binary.

/**
 * Round a decimal STRING half-up. The core: no float arithmetic happens here,
 * so an exact half stays an exact half.
 *
 * Half-up is away from zero on a negative, which is the school convention.
 */
export function roundDecimalString(s: string, dp: number): string {
  const t = s.trim();
  const neg = t.startsWith('-');
  const [w, f = ''] = t.replace('-', '').split('.');
  const sign = neg ? '-' : '';

  if (f.length <= dp) {
    return dp ? `${sign}${w}.${f.padEnd(dp, '0')}` : `${sign}${w}`;
  }

  const digits = (w + f.slice(0, dp)).split('');
  if (Number(f[dp]) >= 5) {
    let i = digits.length - 1;
    for (;;) {
      if (i < 0) { digits.unshift('1'); break; }          // 9.99 -> 10.0
      if (digits[i] === '9') { digits[i] = '0'; i--; continue; }
      digits[i] = String(Number(digits[i]) + 1);
      break;
    }
  }
  const cut = digits.length - dp;
  return sign + (dp
    ? `${digits.slice(0, cut).join('')}.${digits.slice(cut).join('')}`
    : digits.join(''));
}

/**
 * Round a number half-up, on the decimal it was written as.
 *
 * `toPrecision(15)` is what recovers that: a double holds 15134.925 as
 * 15134.92499999999927, and fifteen significant figures round it back to
 * 15134.9250000000. Doubles carry 15 to 17 significant digits, so fifteen sits
 * safely inside the noise while still outside the value.
 */
export function roundHalfUp(v: number, dp: number): string {
  if (!Number.isFinite(v)) return `${v}`;
  let s = Math.abs(v).toPrecision(15);
  // toPrecision reaches for exponent form at the extremes, and nothing that far
  // out is a half-way case, so the ordinary path is enough there.
  if (s.includes('e')) s = Math.abs(v).toFixed(Math.max(dp, 0));
  return (v < 0 ? '-' : '') + roundDecimalString(s, dp);
}

/**
 * `m × 10^e` as a plain decimal, built by moving the point along the digits
 * rather than multiplying out.
 *
 * `8.95 * Math.pow(10, -3)` is 0.008949999999999999 in binary, and printing
 * that to twenty places put **0.00894999999999999922** in front of a pupil as
 * the answer to "write this as an ordinary number". Moving a point cannot do
 * that, because no arithmetic happens.
 */
export function timesPowerOfTen(m: number, e: number): string {
  const neg = m < 0;
  const [w, f = ''] = `${Math.abs(m)}`.split('.');
  const digits = w + f;
  const pos = w.length + e;                    // where the point lands

  let out: string;
  if (pos <= 0) out = `0.${'0'.repeat(-pos)}${digits}`;
  else if (pos >= digits.length) out = digits + '0'.repeat(pos - digits.length);
  else out = `${digits.slice(0, pos)}.${digits.slice(pos)}`;

  if (out.includes('.')) out = out.replace(/0+$/, '').replace(/\.$/, '');
  return (neg ? '-' : '') + out;
}
