import { GeneratedQuestion } from './types';
import { getRandomInt, roundHalfUp, timesPowerOfTen } from './utils';
import { SCI_CONTEXTS } from './n5-contexts';

/**
 * National 5 Scientific Notation — 5 paper questions, two marks each.
 *
 * Every one is set in a context and does one of three things:
 *
 *   divide     12 g of pollen holding 1.5x10^9 grains, weight of one grain
 *              2016 P2 Q2, 2023 P2 Q2
 *   multiply   250 hectares at 1.22x10^6 ants per hectare
 *              2024 P2 Q2
 *   percent    a poppy seed is 8% of the weight of a sesame seed
 *              2019 P2 Q4, 2025 P2 Q3
 *
 * Every one ends "Give your answer in scientific notation", and 2023 P2 Q2 adds
 * "correct to 3 significant figures" for a third mark. Three significant figures
 * is what all five answers are given to, so it is applied throughout and the
 * instruction printed when the division does not come out exactly.
 *
 * The other Scientific-Notation-tagged paper questions are volume (2015 P2 Q6),
 * arc length (2023 P2 Q3) and percentages (2018 P2 Q11) — tagged only because a
 * number in scientific notation appears in them, so they belong to those topics.
 *
 * Zeta lists "Scientific Notation / Standard Form" as a skill in its own right,
 * which the papers never ask alone, so the conversion drill is built as a
 * skill-tier topic with an empty basedOn.
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
type Q = Omit<GeneratedQuestion, 'topic'>;

/** "1.22 \times 10^{6}", the way the papers print it. */
const sci = (mantissa: number | string, exponent: number): string =>
  `${mantissa} \\times 10^{${exponent}}`;

/**
 * A mantissa written to exactly three significant figures.
 *
 * **`${2.50}` is "2.5" and `${7}` is "7"**, so formatting the mantissa as a
 * NUMBER drops the very digits the question asked for. "Correct to 3
 * significant figures" was being answered $1.4 \\times 10^{9}$ - two figures -
 * and $7 \\times 10^{-20}$ - one - in **8.7%** of draws. A mantissa in [1, 10)
 * carries three significant figures exactly when it is written to two decimal
 * places.
 *
 * `roundHalfUp` rather than `toFixed`, for the reason this file already
 * records below: `toFixed` rounds the stored binary, not the decimal.
 */
const mantissa3sf = (m: number): string => roundHalfUp(m, 2);

/**
 * Split a number into a mantissa in [1, 10) and its power of ten.
 *
 * **Round first, then guard the boundary.** The other way round ships a
 * mantissa of exactly 10, which is not scientific notation at all: a value
 * arriving as 9.999999999999999 clears a `>= 10` test, and the tidy-up to
 * twelve figures immediately afterwards turns it into 10 with the exponent
 * left where it was. That printed "10 x 10^-22 grams", about one question in
 * thirty thousand — rare enough to pass a dozen clean runs of the answer check
 * and be caught on the eleventh.
 */
function normalise(v: number): { m: number; e: number } {
  if (v === 0) return { m: 0, e: 0 };
  let e = Math.floor(Math.log10(Math.abs(v)));
  let m = Number((v / Math.pow(10, e)).toPrecision(12));
  if (Math.abs(m) >= 10) { m = Number((m / 10).toPrecision(12)); e += 1; }
  if (Math.abs(m) < 1) { m = Number((m * 10).toPrecision(12)); e -= 1; }
  return { m, e };
}

/** To three significant figures, trailing zeros trimmed. */
const to3sf = (v: number): number => Number(Number(v.toPrecision(3)));

// `decimal(v)` stood here and is gone: it took a value already multiplied out
// in binary and printed twenty places of it, which is how
// **0.00894999999999999922** reached a pupil as the answer to "write this as an
// ordinary number". Its own problem — that `${1.01e-7}` prints "1.01e-7", so a
// question asking for scientific notation showed it already in that form — is
// solved by `timesPowerOfTen` in utils.ts, which never makes a float at all.

// ── skill: writing a number in scientific notation, and back ────────────
//    Zeta only — the papers have never asked it on its own

function convert(): Q {
  const toScientific = getRandomInt(0, 1) === 0;
  const m = Number((getRandomInt(101, 999) / 100).toFixed(2));
  const e = pick([-7, -6, -5, -4, -3, 4, 5, 6, 7, 8, 9]);
  // Built from the digits, not multiplied out: 8.95 * 10^-3 is
  // 0.008949999999999999 in binary, and that reached pupils as an answer.
  const plain = timesPowerOfTen(m, e);

  if (toScientific) {
    return {
      subTopic: 'Writing in Scientific Notation',
      difficulty: 'skill',
      variationId: 'sci-notation.convert',
      questionLines: [`Write $${plain}$ in scientific notation.`],
      boardQuestionLines: [`$${plain}$ in scientific notation`],
      solutionSteps: [
        `<strong>1.</strong> Move the decimal point so one non-zero digit is in front of it:<br><br>$${m}$`,
        `<strong>2.</strong> Count how many places it moved. It moved ${Math.abs(e)} place${Math.abs(e) === 1 ? '' : 's'} to the ${e > 0 ? 'left' : 'right'}, so the power is $${e}$:<br><br>$${sci(m, e)}$`,
      ],
      finalAnswer: `$${sci(m, e)}$`,
    };
  }

  return {
    subTopic: 'Writing in Scientific Notation',
    difficulty: 'skill',
    variationId: 'sci-notation.convert',
    questionLines: [`Write $${sci(m, e)}$ as an ordinary number.`],
    boardQuestionLines: [`$${sci(m, e)}$ as an ordinary number`],
    solutionSteps: [
      `<strong>1.</strong> The power is $${e}$, so move the decimal point ${Math.abs(e)} place${Math.abs(e) === 1 ? '' : 's'} to the ${e > 0 ? 'right' : 'left'}.`,
      `<strong>2.</strong> Fill the gaps with zeros:<br><br>$${plain}$`,
    ],
    finalAnswer: `$${plain}$`,
  };
}

// ── calculate, then express in scientific notation ──────────────────────
//    2016 P2 Q2, 2019 P2 Q4, 2023 P2 Q2, 2024 P2 Q2, 2025 P2 Q3

/** A count inside the band with one significant figure — 20, 300, 9000. */
function leadingDigitOnly(lo: number, hi: number): number {
  const options: number[] = [];
  for (let scale = 1; scale <= hi; scale *= 10) {
    for (let d = 1; d <= 9; d++) {
      const v = d * scale;
      if (v >= lo && v <= hi) options.push(v);
    }
  }
  return options.length ? pick(options) : getRandomInt(lo, hi);
}

function calculate(): Q {
  // Which of the two paper shapes to build. Four of the five papers give an
  // answer that already sits at three significant figures and are worth two
  // marks; only 2023 P2 Q2 asks for rounding, and is worth three. Left to the
  // arithmetic this came out as 294 rounding to 6 not, so the two-mark shape
  // was effectively unreachable — mix.ts called it suppressed. It is chosen up
  // front now, in the papers' proportion.
  //
  // A tidy answer is constructible rather than lucky: a two-figure mantissa
  // times a single significant digit (times a power of ten) never exceeds three
  // figures — 4.5 x 700 = 3150 — while a three-figure mantissa, a percentage or
  // a division almost never lands. So the two-mark shape multiplies.
  //
  // One in three rather than the papers' one in five: at one in five the
  // three-mark shape lands just under mix.ts's floor and reports as suppressed,
  // and a guard against a variation going unreachable is worth more than
  // matching a five-paper sample exactly.
  const wantRounding = getRandomInt(1, 3) === 1;
  for (let tries = 0; tries < 600; tries++) {
    const ctx = pick(wantRounding ? SCI_CONTEXTS : SCI_CONTEXTS.filter(c => c.op === 'multiply'));
    const m = wantRounding
      ? Number((getRandomInt(101, 989) / 100).toFixed(2))
      : Number((getRandomInt(11, 98) / 10).toFixed(1));
    const e = getRandomInt(ctx.exponent[0], ctx.exponent[1]);
    const big = m * Math.pow(10, e);

    let result: number, aTex: string, bTex: string, method: string;

    if (ctx.op === 'percent') {
      const rate = Number((getRandomInt(15, 940) / 10).toFixed(1));
      result = big * rate / 100;
      aTex = sci(m, e);
      bTex = `${rate}\\%`;
      method = `Find ${rate}% by multiplying by $${rate / 100}$:<br><br>$${sci(m, e)} \\times ${rate / 100}$`;
    } else if (ctx.op === 'multiply') {
      const count = wantRounding
        ? getRandomInt(ctx.first[0], ctx.first[1])
        : leadingDigitOnly(ctx.first[0], ctx.first[1]);
      result = count * big;
      aTex = `${count}`;
      bTex = sci(m, e);
      method = `Multiply the two quantities:<br><br>$${count} \\times ${sci(m, e)}$`;
    } else {
      // The plain quantity comes from the context, because it has to suit its
      // subject: a first draft gave a drop of blood a volume of 678 litres,
      // which divides perfectly well and is nonsense on the page.
      const total = getRandomInt(ctx.first[0], ctx.first[1]);
      result = total / big;
      aTex = `${total}`;
      bTex = sci(m, e);
      method = `Divide the total by the number of parts:<br><br>$${total} \\div ${sci(m, e)}$`;
    }

    if (!Number.isFinite(result) || result === 0) continue;
    const exact = normalise(result);
    const rounded = normalise(to3sf(result) === 0 ? result : Number(result.toPrecision(3)));
    if (Math.abs(rounded.e) > 30) continue;

    // 2023 P2 Q2 asks for 3 significant figures explicitly; the others give
    // answers that already sit at three, so the instruction is printed whenever
    // the exact value does not
    const needsRounding = Math.abs(exact.m - rounded.m) > 1e-9;
    // The construction above is meant to guarantee this, so a disagreement is a
    // rejection rather than a silent change of shape — otherwise the question
    // would quietly become the other variation and carry the wrong marks.
    if (needsRounding !== wantRounding) continue;
    // the unit sits outside the maths, or it renders as italic algebra
    // Rounding the mantissa for display can carry it to 10 in its own right,
    // so it goes back through normalise rather than being printed as it falls.
    const shown = normalise(Number(rounded.m.toPrecision(3)) * Math.pow(10, rounded.e));
    // Only the 3sf shape pads. The other one's answer is exact, so claiming a
    // precision it was never asked for would be its own kind of wrong.
    const shownTex = needsRounding ? mantissa3sf(shown.m) : `${shown.m}`;
    const answer = `$${sci(shownTex, shown.e)}$${ctx.unit ? ` ${ctx.unit}` : ''}`;

    // The rounding is not a flourish, it is a mark. 2023 P2 Q2 is three marks
    // — correct method, evaluate, then express in scientific notation rounded
    // to three significant figures — while 2016 P2 Q2, 2019 P2 Q4, 2024 P2 Q2
    // and 2025 P2 Q3 are two, the evaluation and the notation together. So the
    // two shapes cannot share a variation id, and the one that does not round
    // does not get a third step.
    return {
      subTopic: 'Calculating in Scientific Notation',
      difficulty: 'exam',
      variationId: needsRounding ? 'sci-notation.calculate-3sf' : 'sci-notation.calculate',
      questionLines: [
        // the quantities are LaTeX, so they need their own delimiters inside the prose
        ...ctx.lines(`$${aTex}$`, `$${bTex}$`),
        `Give your answer in scientific notation${needsRounding ? ', correct to 3 significant figures' : ''}.`,
      ],
      boardQuestionLines: [`${ctx.op === 'divide' ? `${aTex} \\div ${bTex}` : ctx.op === 'multiply' ? `${aTex} \\times ${bTex}` : `${bTex} of ${aTex}`} in scientific notation`],
      solutionSteps: needsRounding
        ? [
          `<strong>1.</strong> ${method}`,
          `<strong>2.</strong> Work it out on the calculator:<br><br>$= ${sci(Number(exact.m.toPrecision(6)), exact.e)}$`,
          // `shown`, not `rounded`: they differ when rounding carries the
          // mantissa to 10 and normalise moves the exponent, and the working
          // must state the same number the answer does.
          `<strong>3.</strong> Round the front number to three significant figures:<br><br>$= ${sci(mantissa3sf(shown.m), shown.e)}$`,
        ]
        : [
          `<strong>1.</strong> ${method}`,
          `<strong>2.</strong> Work it out and write it in scientific notation, with one digit before the point:<br><br>$= ${sci(Number(rounded.m.toPrecision(3)), rounded.e)}$`,
        ],
      stepMarks: needsRounding ? [1, 1, 1] : [1, 1],
      finalAnswer: answer,
    };
  }
  throw new Error('sci-notation.calculate: no valid question found');
}

export const SCINOT_GENERATORS: Record<string, () => Q> = {
  'Writing in Scientific Notation': convert,
  'Calculating in Scientific Notation': calculate,
};
