import { GeneratedQuestion } from './types';
import { getRandomInt, roundDecimalString } from './utils';

/**
 * National 5 Rounding.
 *
 * The largest single gap the practice audit found: 22 authored questions in
 * maths.scot's sequence and nothing built against them. Zeta lists the same two
 * skills — round to decimal places, round to significant figures — and the
 * practice set adds a third the papers never ask directly but every pupil is
 * drilled on: counting the significant figures a number already has.
 *
 * The practice questions pick out exactly the cases that catch people, and the
 * generator reproduces each:
 *
 *   0.02      1 s.f.   leading zeros never count
 *   0.000805  3 s.f.   a zero between significant digits does
 *   125.50    5 s.f.   a trailing zero after the point does
 *   2040      3 s.f.   a trailing zero before it does not
 *
 * And the rounded answers have to be *displayed* to the right precision, which
 * is where a generator goes wrong as readily as a pupil:
 *
 *   1.00023 to 3 s.f.  ->  1.00    not 1
 *   0.999   to 2 s.f.  ->  1.0     not 1
 *   9.99    to 2 s.f.  ->  10
 *
 * `${Number(...)}` drops those zeros and silently changes the answer's meaning,
 * so the formatting is done on the digit string rather than through a number.
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
type Q = Omit<GeneratedQuestion, 'topic'>;

/**
 * How many significant figures a written number has.
 *
 * Works on the string, because that is where the information is: 2040 and
 * 2040.0 are the same number and do not have the same number of significant
 * figures.
 */
export function countSigFigs(s: string): number {
  const t = s.replace('-', '');
  const digits = t.replace('.', '');
  const firstSig = digits.search(/[1-9]/);
  if (firstSig === -1) return 0;
  if (t.includes('.')) return digits.length - firstSig;      // trailing zeros count
  return digits.replace(/0+$/, '').length - firstSig;        // before the point they do not
}

/**
 * Round to n significant figures, kept as a string so trailing zeros survive.
 */
export function toSigFigs(value: number, n: number): string {
  if (value === 0) return '0';
  // The exponent has to come from the *rounded* value, not the original:
  // rounding 0.999 to 2 s.f. carries it up a power of ten, and taking the
  // exponent first prints 1.00, which reads as three figures. maths.scot's
  // answer is 1.0, and 0.0995 to 1 s.f. is 0.1 for the same reason.
  const exp = Math.floor(Math.log10(Math.abs(Number(value.toPrecision(n)))));
  const decimals = n - 1 - exp;
  if (decimals <= 0) {
    // a whole number: round to the right power of ten
    const p = Math.pow(10, -decimals);
    return `${Math.round(value / p) * p}`;
  }
  return value.toFixed(decimals);
}

/** Numbers chosen so every awkward case in the practice set comes up. */
function awkwardNumber(): string {
  const shape = pick(['integer', 'integer', 'trailing-zero', 'small', 'decimal', 'near-nine']);
  switch (shape) {
    case 'trailing-zero':
      return `${getRandomInt(11, 99) * 10 * pick([1, 1, 10])}`;         // 450, 2040
    case 'small': {
      const zeros = '0'.repeat(getRandomInt(1, 4));
      return `0.${zeros}${getRandomInt(1, 9)}${pick(['', `${getRandomInt(0, 9)}`, `0${getRandomInt(1, 9)}`])}`;
    }
    case 'decimal':
      return `${getRandomInt(1, 999)}.${getRandomInt(10, 99)}${pick(['', '0'])}`;   // 125.50
    case 'near-nine':
      return pick(['0.999', '9.99', '99.5', '0.0995', '9.996', '0.98']);
    default:
      return `${getRandomInt(101, 99999)}`;
  }
}

// ── how many significant figures does this number have? ──────────────────

function countingSigFigs(): Q {
  for (let tries = 0; tries < 200; tries++) {
    const s = awkwardNumber();
    const n = countSigFigs(s);
    if (n < 1 || n > 6) continue;

    const why = s.includes('.') && /^0\.0/.test(s)
      ? 'The zeros at the front only fix the size of the number, so they are not significant. Counting starts at the first non-zero digit.'
      : !s.includes('.') && /0$/.test(s)
        ? 'The zeros at the end of a whole number only fix its size, so they are not significant.'
        : s.includes('.') && /0$/.test(s)
          ? 'A zero at the end of a decimal <em>is</em> significant — it says the value was measured to that place.'
          : 'Every digit here is significant.';

    return {
      subTopic: 'Counting Significant Figures',
      difficulty: 'skill',
      variationId: 'rounding.count-sig-figs',
      questionLines: [`How many significant figures does $${s}$ have?`],
      boardQuestionLines: [`Significant figures in $${s}$?`],
      solutionSteps: [
        `<strong>1.</strong> ${why}`,
        `<strong>2.</strong> Count them:<br><br>$${s}$ has <strong>${n}</strong> significant figure${n === 1 ? '' : 's'}`,
      ],
      finalAnswer: `${n} significant figure${n === 1 ? '' : 's'}`,
    };
  }
  throw new Error('rounding.count-sig-figs: no valid question found');
}

// ── round to a given number of significant figures ───────────────────────

function roundToSigFigs(): Q {
  for (let tries = 0; tries < 300; tries++) {
    const s = awkwardNumber();
    const have = countSigFigs(s);
    if (have < 2) continue;
    // **Fewer figures than the number already has**, or the question is a
    // no-op by construction: "Round 0.0995 to 3 significant figures" asks for
    // something it already is. The old gate allowed one in five through on
    // purpose, which put a question that changes nothing in 4.7% of draws -
    // and on the one topic whose entire subject is rounding, where a pupil
    // reasonably assumes something must change.
    const n = getRandomInt(1, Math.min(3, have) - 1);
    const value = Number(s);
    const out = toSigFigs(value, n);
    if (!Number.isFinite(value)) continue;
    // Belt and braces: `n < have` should make this impossible, and a check
    // that depends on a construction argument is one nobody re-derives.
    if (out === s) continue;

    const digits = s.replace('-', '').replace('.', '').replace(/^0+/, '');
    const nextDigit = digits[n];
    const rounded = nextDigit !== undefined && Number(nextDigit) >= 5;

    return {
      subTopic: 'Rounding to Significant Figures',
      difficulty: 'skill',
      variationId: 'rounding.to-sig-figs',
      questionLines: [
        `Round $${s}$ to ${n} significant figure${n === 1 ? '' : 's'}.`,
      ],
      boardQuestionLines: [`$${s}$ to ${n} s.f.`],
      solutionSteps: [
        `<strong>1.</strong> Counting from the first non-zero digit, the ${n === 1 ? 'first digit is' : `first ${n} digits are`} the one${n === 1 ? '' : 's'} to keep.`,
        `<strong>2.</strong> Look at the next digit${nextDigit === undefined ? '' : `, which is $${nextDigit}$`}: ${rounded ? 'it is 5 or more, so round up' : nextDigit === undefined ? 'there is nothing after it, so nothing changes' : 'it is less than 5, so leave the kept digits alone'}.`,
        `<strong>3.</strong> Write the answer, keeping enough zeros to show the size${out.includes('.') && /0$/.test(out) ? ' and the precision' : ''}:<br><br>$${out}$`,
      ],
      finalAnswer: `$${out}$`,
    };
  }
  throw new Error('rounding.to-sig-figs: no valid question found');
}

// ── round to a given number of decimal places ────────────────────────────
//    Zeta's other rounding skill, and the instruction every paper attaches

function roundToDecimalPlaces(): Q {
  for (let tries = 0; tries < 200; tries++) {
    const whole = getRandomInt(0, 400);
    const frac = `${getRandomInt(1000, 99999)}`;
    const s = `${whole}.${frac}`;
    const n = getRandomInt(1, 3);
    // The exact decimal is right here in `s`, and Number(s).toFixed(n)
    // threw that away to round the binary instead - which printed 0.540
    // for "round 0.5405 to 3 dp" on the rounding topic itself.
    const out = roundDecimalString(s, n);
    const nextDigit = frac[n];
    if (nextDigit === undefined) continue;

    return {
      subTopic: 'Rounding to Decimal Places',
      difficulty: 'skill',
      variationId: 'rounding.to-decimal-places',
      questionLines: [
        `Round $${s}$ to ${n} decimal place${n === 1 ? '' : 's'}.`,
      ],
      boardQuestionLines: [`$${s}$ to ${n} d.p.`],
      solutionSteps: [
        `<strong>1.</strong> Count ${n} digit${n === 1 ? '' : 's'} after the point. ${n === 1 ? 'That is' : 'Those are'} what the answer keeps.`,
        `<strong>2.</strong> The next digit is $${nextDigit}$, ${Number(nextDigit) >= 5 ? 'which is 5 or more, so the last kept digit goes up' : 'which is less than 5, so the kept digits stay as they are'}.`,
        `<strong>3.</strong> Write it with exactly ${n} decimal place${n === 1 ? '' : 's'}:<br><br>$${out}$`,
      ],
      finalAnswer: `$${out}$`,
    };
  }
  throw new Error('rounding.to-decimal-places: no valid question found');
}

export const ROUNDING_GENERATORS: Record<string, () => Q> = {
  'Counting Significant Figures': countingSigFigs,
  'Rounding to Significant Figures': roundToSigFigs,
  'Rounding to Decimal Places': roundToDecimalPlaces,
};
