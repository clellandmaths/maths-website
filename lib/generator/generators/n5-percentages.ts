import { GeneratedQuestion } from './types';
import { getRandomInt } from './utils';
import {
  money, plain, ASSET_CONTEXTS, DEPRECIATING_MONEY, REVERSE_CONTEXTS,
  CHANGE_CONTEXTS, PART_OF_WHOLE_CONTEXTS, SURCHARGE_CONTEXTS,
  BETWEEN_YEARS_CONTEXTS, moneyNeat,
  type AssetContext, type Rounding,
} from './n5-contexts';

/**
 * National 5 Percentages.
 *
 * The specification names two skills here, listed separately:
 *   "Working with appreciation/depreciation — appreciation including compound
 *    interest, depreciation"
 *   "Working with reverse percentages — use reverse percentages to calculate an
 *    original quantity"
 *
 * Zeta adds a third the papers never ask on its own: percentage change,
 * difference over original times 100.
 *
 * Shape axis: 2023 P2 Q1 applies one rate in the first year and a different one
 * for the years after, which none of the other twelve do.
 *
 * Every paper question carries a rounding instruction, and the instruction
 * varies by context — nearest ten, nearest pound, nearest thousand pounds,
 * three significant figures, two decimal places. It is part of the final mark,
 * so it is generated with the question rather than bolted on.
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
type Q = Omit<GeneratedQuestion, 'topic'>;

/** Round to n significant figures, as several diets ask. */
function toSigFigs(v: number, n: number): number {
  if (v === 0) return 0;
  const mag = Math.ceil(Math.log10(Math.abs(v)));
  const factor = Math.pow(10, n - mag);
  return Math.round(v * factor) / factor;
}

function roundingPhrase(r: Rounding): string {
  switch (r) {
    case 'money': return 'Give your answer to two decimal places.';
    case 'nearest-pound': return 'Give your answer to the nearest pound.';
    case '3sf': return 'Give your answer correct to three significant figures.';
    case 'whole': return 'Give your answer to the nearest whole number.';
  }
}

/**
 * The rounded answer split into the part that is maths and the part that is not.
 *
 * "590 pupils" is a number and a word, and the word must not go inside `$…$`:
 * MathJax sets it as seven italic variables multiplied together. Every counted
 * compound question had been printing its unit that way in the final step —
 * `$= 67,078 patients$` — which reads as an error a pupil would be marked down
 * for making.
 */
function roundedParts(v: number, r: Rounding, ctx: AssetContext): { math: string; unit: string } {
  switch (r) {
    case 'money': return { math: `£${money(v, 2)}`, unit: '' };
    case 'nearest-pound': return { math: `£${money(Math.round(v), 0)}`, unit: '' };
    case '3sf': return { math: `£${money(toSigFigs(v, 3), 0)}`, unit: '' };
    case 'whole': return { math: plain(v), unit: ctx.unit };
  }
}

/** The rounded answer as a step ends: maths in delimiters, unit outside them. */
const roundedStep = (v: number, r: Rounding, ctx: AssetContext): string => {
  const { math, unit } = roundedParts(v, r, ctx);
  return unit ? `$= ${math}$ ${unit}` : `$= ${math}$`;
};

/** The same thing as one string, for the answer line, which is not maths. */
function applyRounding(v: number, r: Rounding, ctx: AssetContext): string {
  const { math, unit } = roundedParts(v, r, ctx);
  return unit ? `${math} ${unit}` : math;
}

/** "twice", "three times" — never "2 times". */
const timesWord = (n: number): string =>
  ({ 2: 'twice', 3: 'three times', 4: 'four times' }[n] ?? `${n} times`);

// ── skill: compound appreciation and depreciation ────────────────────────
// 2016 P2 Q1, 2018 P2 Q1, 2022 P2 Q2, 2024 P2 Q1, 2026 P2 Q1

/**
 * A rate, whole or to one decimal place, with the multiplier it means.
 *
 * Two of the five paper questions here use a decimal rate — 2.8% per annum on a
 * house, 4.5% on a necklace — and every generated one was a whole number, so a
 * pupil practising for those never met the sum they actually get.
 *
 * The multiplier is rounded to four places and then *used*, so what the working
 * shows is what the answer came from. `1 + 2.8/100` is 1.0279999999999998 in
 * binary; a step printing 1.028 while the answer divided by the other is the
 * kind of disagreement nobody notices until a pupil's answer differs in the
 * last place.
 */
function drawRate(up: boolean): { rate: number; multiplier: number } {
  const rate = getRandomInt(0, 2) === 0
    ? (up ? getRandomInt(15, 90) : getRandomInt(45, 180)) / 10
    : (up ? getRandomInt(2, 8) : getRandomInt(8, 30));
  const raw = up ? 1 + rate / 100 : 1 - rate / 100;
  return { rate, multiplier: Math.round(raw * 10000) / 10000 };
}

function compound(): Q {
  const ctx = pick(ASSET_CONTEXTS);
  const up = ctx.appreciates;
  const { rate, multiplier } = drawRate(up);
  const years = getRandomInt(2, 4);
  const start = ctx.unit === '£'
    ? getRandomInt(4, 60) * 500
    : getRandomInt(20, 260) * 500;
  const value = start * Math.pow(multiplier, years);

  return {
    subTopic: 'Compound Appreciation & Depreciation',
    difficulty: 'skill',
    variationId: 'percentages.compound',
    questionLines: [
      ctx.opening(ctx.format(start)),
      `It is expected to ${up ? 'increase' : 'decrease'} by ${rate}% each year.`,
      `Calculate the expected value of ${ctx.subject} after ${years} years.`,
      roundingPhrase(ctx.rounding),
    ],
    boardQuestionLines: [
      `${ctx.format(start)}, ${up ? 'up' : 'down'} ${rate}% each year for ${years} years. Find the value.`,
    ],
    solutionSteps: [
      `<strong>1.</strong> Find the multiplier for ${up ? 'an increase' : 'a decrease'} of ${rate}%:<br><br>$100\\% ${up ? '+' : '-'} ${rate}\\% = ${up ? 100 + rate : 100 - rate}\\% = ${multiplier}$`,
      `<strong>2.</strong> Apply it once for each of the ${years} years:<br><br>$${ctx.unit === '£' ? money(start, 0) : plain(start)} \\times ${multiplier}^{${years}}$`,
      `<strong>3.</strong> Evaluate and round:<br><br>${roundedStep(value, ctx.rounding, ctx)}`,
    ],
    // •¹ know how to change by the rate, •² know how to carry it over the years,
    // •³ evaluate — the same three marks in all four papers
    stepMarks: [1, 1, 1],
    finalAnswer: applyRounding(value, ctx.rounding, ctx),
  };
}

// ── skill: reverse percentages — 2022 P1 Q10, 2023 P2 Q6, 2018 P2 Q11 ────
//
// Built answer-first: choose the original, then the percentage, so the figure
// the pupil is given comes out exact. Working forwards from a given price would
// produce originals like £23.47.

function reverse(): Q {
  for (let tries = 0; tries < 400; tries++) {
    const up = getRandomInt(0, 1) === 1;
    const rate = pick(up ? [4, 5, 8, 10, 12, 15, 20, 25] : [10, 15, 20, 25, 30, 35, 40]);

    // The value has to suit the thing being talked about — a jacket reduced
    // from £6,500 is arithmetically fine and obviously wrong on the page. Each
    // context carries the range that makes sense for it.
    const ctx = pick(REVERSE_CONTEXTS.filter(c => c.up === up));
    const [lo, hi] = ctx.band;
    const step = hi > 20000 ? 5000 : hi > 2000 ? 500 : hi > 400 ? 50 : 10;
    const original = getRandomInt(Math.ceil(lo / step), Math.floor(hi / step)) * step;
    const multiplier = up ? 1 + rate / 100 : 1 - rate / 100;
    const given = original * multiplier;
    // Money has to land on exact pence; a countable has to land on a whole
    // thing, since 4200.5 tickets is not an answer to anything.
    if (ctx.counted ? !Number.isInteger(given) : Math.abs(given * 100 - Math.round(given * 100)) > 1e-9) continue;

    // The same three marks either way; only how the amounts are written differs.
    const show = (v: number) => ctx.counted ? plain(v) : `£${money(v, 2)}`;
    const answer = ctx.counted ? `${plain(original)} ${ctx.counted}` : `£${moneyNeat(original)}`;
    const setup = ctx.lines(ctx.counted ? plain(given) : `£${moneyNeat(given)}`, rate);

    return {
      subTopic: 'Reverse Percentages',
      difficulty: 'skill',
      variationId: 'percentages.reverse',
      questionLines: setup,
      boardQuestionLines: [
        `${up ? 'Up' : 'Down'} ${rate}% gives ${show(given)}. Find the original.`,
      ],
      // Three marks, and the second is the one this used to skip: the schemes
      // read •¹ know that 70% = £16.10, •² begin a valid strategy, •³ complete
      // the calculation within it. Setting up the division and carrying it out
      // are separately creditable, so they are separate steps.
      solutionSteps: [
        `<strong>1.</strong> The amount given is ${up ? 100 + rate : 100 - rate}% of the original:<br><br>$${up ? 100 + rate : 100 - rate}\\% = ${show(given)}$`,
        `<strong>2.</strong> To get back to 100%, divide by the multiplier:<br><br>$${show(given)} \\div ${multiplier}$`,
        `<strong>3.</strong> Carry out the division:<br><br>$= ${show(original)}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: answer,
    };
  }
  throw new Error('percentages.reverse: no valid question found');
}

// ── shape: the years are given as dates — 2019 P2 Q1, 2025 P2 Q1 ─────────
//
// "A charity distributed 80 000 packages during 2018... Calculate how many it
// expects to distribute in 2021." The maths is `compound` exactly and so is the
// marking scheme; what differs is that the number of years is not stated. A
// pupil has to subtract two dates before anything else, and it is the step they
// get wrong — 2018 to 2021 is three years and reads like four.

function compoundBetweenYears(): Q {
  const ctx = pick(BETWEEN_YEARS_CONTEXTS);
  const { rate, multiplier } = drawRate(true);
  const years = getRandomInt(2, 4);
  const from = getRandomInt(2014, 2025);
  const [lo, hi] = ctx.band;
  const step = hi > 200000 ? 10000 : hi > 40000 ? 2500 : 500;
  const start = getRandomInt(Math.ceil(lo / step), Math.floor(hi / step)) * step;
  const value = Math.round(start * Math.pow(multiplier, years));

  return {
    subTopic: 'Appreciation Between Two Years',
    difficulty: 'exam',
    variationId: 'percentages.compound-between-years',
    questionLines: [
      ctx.opening(plain(start), from),
      `This number is expected to increase by ${rate}% each year.`,
      ctx.ask(from + years),
    ],
    boardQuestionLines: [`${plain(start)} in ${from}, up ${rate}% a year. How many in ${from + years}?`],
    solutionSteps: [
      `<strong>1.</strong> Find the multiplier for an increase of ${rate}%:<br><br>$100\\% + ${rate}\\% = ${Math.round((100 + rate) * 10) / 10}\\% = ${multiplier}$`,
      `<strong>2.</strong> From ${from} to ${from + years} is ${years} years, so apply the multiplier ${timesWord(years)}:` +
      `<br><br>$${plain(start)} \\times ${multiplier}^{${years}}$`,
      `<strong>3.</strong> Evaluate:<br><br>$= ${plain(value)}$ ${ctx.unit}`,
    ],
    // •¹ know how to increase by the rate, •² know how to calculate the value
    // after the right number of years, •³ evaluate
    stepMarks: [1, 1, 1],
    finalAnswer: `${plain(value)} ${ctx.unit}`,
  };
}

// ── shape: a part stated as a percentage of a whole — 2014 P1 Q9, 2026 P1 Q2
//
// Not a reverse percentage in the usual sense: nothing rose or fell. The
// figure given simply *is* r% of the total, so the first mark is for reading
// "80% = 480 000" and a pupil reaching for 100 + r has misread the question.
// Both are Paper 1, so the numbers have to divide by hand.

function partOfWhole(): Q {
  for (let tries = 0; tries < 400; tries++) {
    const ctx = pick(PART_OF_WHOLE_CONTEXTS);
    const pct = pick([10, 20, 25, 40, 50, 60, 75, 80, 90]);
    const [lo, hi] = ctx.band;
    const step = hi > 100000 ? 20000 : hi > 10000 ? 1000 : hi > 1000 ? 100 : 20;
    const whole = getRandomInt(Math.ceil(lo / step), Math.floor(hi / step)) * step;
    const part = whole * pct / 100;
    if (!Number.isInteger(part) || part === whole) continue;
    const onePercent = whole / 100;

    return {
      subTopic: 'Finding a Total from a Percentage',
      difficulty: 'exam',
      variationId: 'percentages.part-of-whole',
      questionLines: ctx.lines(plain(part), pct),
      boardQuestionLines: [`${plain(part)} is ${pct}% of the total. Find the total.`],
      solutionSteps: [
        `<strong>1.</strong> Write down what the question tells you:<br><br>$${pct}\\% = ${plain(part)}$`,
        `<strong>2.</strong> Divide to find $1\\%$:<br><br>$1\\% = \\frac{${plain(part)}}{${pct}} = ${plain(onePercent)}$`,
        `<strong>3.</strong> Multiply by 100 to get the whole:<br><br>$100\\% = ${plain(onePercent)} \\times 100 = ${plain(whole)}$ ${ctx.unit}`,
      ],
      // •¹ know that r% = the figure given, •² begin a valid strategy,
      // •³ answer — 2014 P1 Q9 exactly
      stepMarks: [1, 1, 1],
      finalAnswer: `${plain(whole)} ${ctx.unit}`,
    };
  }
  throw new Error('percentages.part-of-whole: no valid question found');
}

// ── shape: a surcharge, and the extra is what is wanted — 2019 P2 Q9 ─────
//
// A reverse percentage that stops one step short of the usual answer. Having
// divided back to the bill, the question wants the *difference*, so the number
// the pupil divides to is not the number they write down — and the scheme's
// third mark is for the difference, not for the bill.

function surcharge(): Q {
  for (let tries = 0; tries < 600; tries++) {
    const ctx = pick(SURCHARGE_CONTEXTS);
    const rate = pick([1.5, 2, 2.5, 3, 4, 5, 7.5, 10, 12.5, 15]);
    const [lo, hi] = ctx.band;
    const step = hi > 1000 ? 50 : hi > 300 ? 20 : 10;
    const bill = getRandomInt(Math.ceil(lo / step), Math.floor(hi / step)) * step;
    const multiplier = Math.round((1 + rate / 100) * 10000) / 10000;
    const total = bill * multiplier;
    if (Math.abs(total * 100 - Math.round(total * 100)) > 1e-9) continue;
    const extra = Math.round((total - bill) * 100) / 100;
    if (extra < 1) continue;                     // a saving of 40p is not a question

    const pct = Math.round((100 + rate) * 10) / 10;
    return {
      subTopic: 'Finding the Extra Charged',
      difficulty: 'exam',
      variationId: 'percentages.surcharge',
      questionLines: [...ctx.lines(`£${moneyNeat(total)}`, rate), ctx.ask],
      boardQuestionLines: [`£${moneyNeat(total)} includes a ${rate}% charge. How much was the charge?`],
      solutionSteps: [
        `<strong>1.</strong> The total is ${pct}% of the amount before the charge:<br><br>$${pct}\\% = £${money(total, 2)}$`,
        `<strong>2.</strong> Divide by the multiplier to get back to $100\\%$:<br><br>$£${money(total, 2)} \\div ${multiplier} = £${money(bill, 2)}$`,
        `<strong>3.</strong> The question asks for the extra, so subtract:<br><br>$£${money(total, 2)} - £${money(bill, 2)} = £${money(extra, 2)}$`,
      ],
      // •¹ know that (100 + r)% = the total, •² begin a valid strategy,
      // •³ complete the calculation — and •³ is the difference, not the bill
      stepMarks: [1, 1, 1],
      // the working shows pence because the subtraction has them; the answer
      // line does not print "£55.00" for fifty-five pounds
      finalAnswer: `£${moneyNeat(extra)}`,
    };
  }
  throw new Error('percentages.surcharge: no valid question found');
}

// ── skill: percentage change — Zeta only, never asked alone in the papers ─

function percentageChange(): Q {
  for (let tries = 0; tries < 400; tries++) {
    const up = getRandomInt(0, 1) === 1;
    const original = getRandomInt(4, 40) * 25;
    const rate = pick([4, 5, 8, 10, 12, 15, 20, 24, 25, 30]);
    const change = original * rate / 100;
    if (!Number.isInteger(change)) continue;
    const now = up ? original + change : original - change;

    return {
      subTopic: 'Percentage Change',
      difficulty: 'skill',
      variationId: 'percentages.change',
      questionLines: [
        pick(CHANGE_CONTEXTS).line(plain(original), plain(now), up),
        `Calculate the percentage ${up ? 'increase' : 'decrease'}.`,
      ],
      boardQuestionLines: [`${original} to ${now}. Percentage ${up ? 'increase' : 'decrease'}?`],
      solutionSteps: [
        `<strong>1.</strong> Find the difference:<br><br>$${up ? `${now} - ${original}` : `${original} - ${now}`} = ${change}$`,
        `<strong>2.</strong> Divide by the <strong>original</strong> and multiply by 100:<br><br>$\\frac{${change}}{${original}} \\times 100 = ${rate}\\%$`,
      ],
      finalAnswer: `${rate}%`,
    };
  }
  throw new Error('percentages.change: no valid question found');
}

// ── shape: two rates — 2023 P2 Q1 ────────────────────────────────────────
//
// "Bought for £20,000. Depreciated by 11% in the first year, then by a further
// 6% each year over the next two years." One rate then another is what makes
// this different from the other twelve.

function twoStage(): Q {
  const ctx = pick(DEPRECIATING_MONEY);
  const start = getRandomInt(8, 60) * 500;
  const first = getRandomInt(9, 18);
  const rest = getRandomInt(4, 8);
  const restYears = getRandomInt(2, 3);
  const m1 = 1 - first / 100, m2 = 1 - rest / 100;
  const value = start * m1 * Math.pow(m2, restYears);

  return {
    subTopic: 'Two-Stage Depreciation',
    difficulty: 'exam',
    variationId: 'percentages.two-stage',
    questionLines: [
      ctx.opening(`£${money(start, 0)}`),
      `It depreciated by ${first}% in the first year.`,
      `It then depreciated by a further ${rest}% each year over the next ${restYears === 2 ? 'two' : 'three'} years.`,
      `Calculate the value of ${ctx.subject} after ${restYears + 1} years.`,
      `Give your answer to two decimal places.`,
    ],
    boardQuestionLines: [
      `£${money(start, 0)}, down ${first}% then ${rest}% for ${restYears} years. Value?`,
    ],
    solutionSteps: [
      `<strong>1.</strong> Find each multiplier:<br><br>$100\\% - ${first}\\% = ${m1}$ and $100\\% - ${rest}\\% = ${m2}$`,
      `<strong>2.</strong> Apply the first once, then the second ${restYears === 2 ? 'twice' : 'three times'}:<br><br>$${money(start, 0)} \\times ${m1} \\times ${m2}^{${restYears}}$`,
      `<strong>3.</strong> Evaluate:<br><br>$= £${money(value, 2)}$`,
    ],
    // 2023 P2 Q1: •¹ know how to decrease by both rates, •² know how to
    // calculate the value, •³ evaluate
    stepMarks: [1, 1, 1],
    finalAnswer: `£${money(value, 2)}`,
  };
}

export const PERCENTAGE_GENERATORS: Record<string, () => Q> = {
  'Compound Appreciation & Depreciation': compound,
  'Reverse Percentages': reverse,
  'Percentage Change': percentageChange,
  'Two-Stage Depreciation': twoStage,
  'Appreciation Between Two Years': compoundBetweenYears,
  'Finding a Total from a Percentage': partOfWhole,
  'Finding the Extra Charged': surcharge,
};
