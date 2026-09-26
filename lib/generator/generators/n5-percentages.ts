import { GeneratedQuestion } from './types';
import type { Gen } from './n5';
import { getRandomInt } from './utils';
import {
  money, plain, ASSET_CONTEXTS, DEPRECIATING_MONEY, REVERSE_CONTEXTS,
  CHANGE_CONTEXTS, PART_OF_WHOLE_CONTEXTS, SCI_PART_OF_WHOLE_CONTEXTS, SURCHARGE_CONTEXTS,
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
    case 'ten': return 'Give your answer to the nearest ten.';
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
    case 'ten': return { math: plain(Math.round(v / 10) * 10), unit: ctx.unit };
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
 * A rate, with the multiplier it means.
 *
 * **A decimal rate goes up, never down.** The owner, on the 2026-2023 sign-off
 * sheet against a boat depreciating by 13.3%: *"Whole number for percentage"*.
 * Read against all seven papers this variation clones, that is not a ban on
 * decimals - it is a ban on decimals in the direction no paper puts them:
 *
 *   up     2015 P2 Q1  2.8%     2017 P2 Q2  4.5%     2022 P2 Q2  3%
 *   down   2018 P2 Q1  2%       2016 P2 Q1  8%       2014 P2 Q1  15%
 *                              2024 P2 Q1  26%
 *
 * Every decimal in the papers appreciates something, and every depreciation is
 * a whole number. The old draw ran the decimal branch in both directions, and
 * the down band was tenths of 4.5 to 18.0 - so 13.3%, 17.9%, 16.1%, none of
 * them a figure any paper sets. Dropping decimals altogether would have cost
 * 2015 P2 Q1 and 2017 P2 Q2 the sum they actually ask for.
 *
 * The multiplier is rounded to four places and then *used*, so what the working
 * shows is what the answer came from. `1 + 2.8/100` is 1.0279999999999998 in
 * binary; a step printing 1.028 while the answer divided by the other is the
 * kind of disagreement nobody notices until a pupil's answer differs in the
 * last place.
 */
function drawRate(up: boolean): { rate: number; multiplier: number } {
  const rate = up && getRandomInt(0, 2) === 0
    ? getRandomInt(15, 90) / 10          // 1.5 - 9.0, the band 2.8 and 4.5 sit in
    : (up ? getRandomInt(2, 8) : getRandomInt(2, 30));
  const raw = up ? 1 + rate / 100 : 1 - rate / 100;
  return { rate, multiplier: Math.round(raw * 10000) / 10000 };
}

/**
 * **2017 P2 Q2 is an increase, rounded to the nearest pound.** — 2026-09-23
 *
 * Measured on the 2017 P2 sheet, 400 draws of its id: a decrease in 243, and
 * no rounding instruction in 144 — the money contexts that round to the penny,
 * which is right for the four papers that say nothing and wrong for this one,
 * which says *"Give your answer to the nearest pound."* The owner: *"Key to
 * this question ensuring it only affects this one"*.
 *
 * `asked` and not `wanted`: this id is an ALIAS of `percentages.compound`, so
 * it arrives with the same `wanted` as LOCKED 2018 P2 Q1, 2022 P2 Q2 and
 * 2024 P2 Q1. Only this id takes the branch; every other draw is unchanged.
 */
const COMPOUND_2017 = 'percentages.compound-2017';

/**
 * **2015 P2 Q1 is money that rises, to the penny, at a price that fits.** — 2026-09-25
 *
 * A house valued at £240 000, up 2.8% a year, answer £253 628.16 with no
 * rounding line. Measured on the 2015 P2 sheet, 400 draws of its id: a fall in
 * 240, a rounding line in 243, and houses at £2,000 to £30,000. The owner:
 * *"Yes I'd key but also make sure in the contexts the number make sense. Ie
 * scale for a context is right"*.
 *
 * So this id draws only money that gains value and works it to the penny
 * (which goes unsaid). Its prices come from `BANDS` below.
 */
const COMPOUND_2015 = 'percentages.compound-2015';

/**
 * **2014 P2 Q1 is a count that falls, to the nearest ten.** — 2026-09-25
 *
 * 964 pupils on a school roll, down 15% a year for 3 years, "Give your answer
 * to the nearest ten" → 590. Measured on the 2014 P2 sheet, 400 draws of its
 * id: that shape in 0 — a rise in 139, money in 295, "nearest ten" never. The
 * owner: *"Yes"* to keying it to a count that falls, to the nearest ten, at a
 * size that fits each context.
 *
 * Its own list, not a filter of `ASSET_CONTEXTS`: the shared falling counts
 * have no school roll, and adding one there would move every draw of the
 * locked papers that pick from that list. [opening, asks, unit, lo, hi] —
 * odd sizes, stepped by one, as the paper's 964 is.
 */
const COMPOUND_2014 = 'percentages.compound-2014';
const FALLING_COUNTS_2014: AssetContext[] = ([
  ['There are % pupils on the roll of a high school.', 'the expected roll', 'pupils', 600, 1800],
  ['A primary school has % pupils on its roll.', 'the expected roll', 'pupils', 150, 600],
  ['A golf club has % members.', 'the expected membership', 'members', 300, 1500],
  ['An island has a population of %.', 'the expected population of the island', 'people', 400, 4000],
  ['A village has a population of %.', 'the expected population of the village', 'people', 800, 6000],
  ['A colony of puffins on an island numbers %.', 'the expected size of the colony', 'puffins', 2000, 30000],
  ['A herd of red deer on an estate numbers %.', 'the expected size of the herd', 'deer', 200, 2500],
  ['A hospital had % patients on its waiting list.', 'the expected number of patients on the waiting list', 'patients', 500, 9000],
  ['A library lent out % books last year.', 'the expected number of loans', 'books', 5000, 60000],
  ['A newspaper sells % copies a day.', 'the expected daily sales', 'copies', 2000, 40000],
] as [string, string, string, number, number][]).map(([opening, asks, unit, lo, hi]) => ({
  opening: (s: string) => opening.replace('%', s), subject: asks, format: plain,
  asks, unit, rounding: 'ten' as const, appreciates: false, band: [lo, hi] as [number, number],
}));

/**
 * **Every context priced for what it is.** — 2026-09-25
 *
 * Every money context started at £2,000-£30,000 and every counted one at
 * 10,000-130,000, whatever it was: measured on the locked papers, houses at
 * £2,000, a NEW laptop at £26,000 (2024 P2 Q1's own is £460), a new tractor
 * or a passenger boat from £2,000, a deer herd of 122,500 on one estate. The
 * owner, on the 2015 P2 sheet: *"the locked Q1 questions do need sensible
 * prices for each context question"*.
 *
 * Keyed on the opening sentence, because subjects repeat ("the van", "the
 * boat", "the colony"). [lo, hi, step]. The three-significant-figure
 * contexts are not here: they belong to 2026 P2 Q1's own branch, which keeps
 * its range. The first ten are the bands 2015 P2 Q1 was given first.
 */
const BANDS: Record<string, [number, number, number]> = {
  // money that gains value
  "A company's annual profit was %.": [50000, 900000, 5000],
  'A house was bought for %.': [120000, 450000, 5000],
  '% is invested in a savings account.': [1000, 20000, 500],
  '% is placed in a five year bond.': [1000, 25000, 500],
  'A flat was bought for %.': [80000, 300000, 5000],
  'A vintage guitar was bought at auction for %.': [2000, 40000, 500],
  'A charity received donations of % last year.': [10000, 500000, 5000],
  'A holiday cottage was bought for %.': [100000, 400000, 5000],
  '% is paid into a credit union account.': [500, 10000, 100],
  'A woodland was bought for %.': [50000, 600000, 5000],
  // money that loses value
  'A new laptop is bought for %.': [300, 2000, 10],
  'A motorhome was bought for %.': [25000, 90000, 500],
  'A tractor was bought new for %.': [40000, 150000, 1000],
  'A printing press was bought for %.': [20000, 250000, 1000],
  'A minibus was bought by a school for %.': [20000, 60000, 500],
  'A dentist bought a new x-ray machine for %.': [10000, 80000, 500],
  'A recording studio bought a mixing desk for %.': [2000, 40000, 500],
  'A courier firm bought an electric van for %.': [25000, 60000, 500],
  'A haulage firm bought a lorry for %.': [40000, 150000, 1000],
  'A caravan was bought for %.': [8000, 40000, 500],
  'A bakery bought a dough mixer for %.': [2000, 20000, 500],
  'A garage bought a vehicle lift for %.': [2000, 12000, 500],
  'A gym bought a set of rowing machines for %.': [3000, 20000, 500],
  'A photographer bought a camera body for %.': [800, 6000, 100],
  'A landscaper bought a wood chipper for %.': [5000, 40000, 500],
  'A brewery bought a bottling line for %.': [50000, 400000, 5000],
  'A quarry bought a rock crusher for %.': [100000, 800000, 5000],
  'A dairy bought a milking parlour for %.': [50000, 300000, 5000],
  'A print shop bought a laser cutter for %.': [5000, 60000, 500],
  'A ferry operator bought a passenger boat for %.': [100000, 900000, 5000],
  // counted or measured
  'A town has a population of %.': [5000, 60000, 500],
  'Households in a city produced % tonnes of waste last year.': [50000, 400000, 5000],
  'A colony of puffins on an island numbers %.': [2000, 60000, 500],
  'A red squirrel population in a forest is estimated at %.': [200, 3000, 50],
  'A reservoir holds % million litres of water.': [500, 20000, 100],
  'A leisure centre has % members.': [800, 8000, 100],
  'A wind farm generated % megawatt hours last year.': [20000, 400000, 5000],
  'A glacier covers an area of % hectares.': [500, 20000, 100],
  'A deer herd on an estate numbers %.': [100, 2500, 50],
  'A library lent out % books last year.': [10000, 150000, 1000],
  'A hospital had % patients on its waiting list.': [500, 15000, 100],
  'A bee colony contains % bees.': [20000, 80000, 500],
};

function compound(wanted?: string, asked?: string): Q {
  // Pick the shape, then a context that fits it — not a context and whatever
  // shape it implies.
  //
  // Which question this is depends on how it is rounded, and rounding belongs
  // to the context: a van is valued to three significant figures, a savings
  // account to the penny. Only six of the forty-odd contexts round to three
  // figures, so drawing the context first left the four-mark question at 14%
  // of its own topic and `mix.ts` called it suppressed. This is the pattern
  // `diagram-questions.md` §2 sets out — choose the branch once, outside the
  // draw — and the reason it exists.
  // Taught: how it is rounded IS which question this is — three significant
  // figures is the four-mark shape — so the asked id decides it rather than
  // a coin, and the context is then chosen to fit.
  const threeSf = wanted !== undefined
    ? wanted === 'percentages.compound-3sf'
    : getRandomInt(0, 1) === 0;
  const is2017 = asked === COMPOUND_2017;
  // **2016 P2 Q1 is a decrease** — sugar down 8% a year. The owner, on the
  // 2016 P2 sheet: *"Yes key"*, against 151 of 400 draws that increased. The
  // mirror of 2017's key, and it reads a filtered list the same way, so no
  // other id's draws move.
  const is2016 = asked === 'percentages.compound-2016';
  const is2015 = asked === COMPOUND_2015;
  const is2014 = asked === COMPOUND_2014;
  const drawn: AssetContext & { band?: [number, number] } = is2014
    ? pick(FALLING_COUNTS_2014)
    : pick(ASSET_CONTEXTS.filter(c => (c.rounding === '3sf') === threeSf
      && (!is2017 || c.appreciates) && (!is2016 || !c.appreciates)
      && (!is2015 || (c.appreciates && c.unit === '£'))));
  // A copy, never the shared context: money to the penny becomes the nearest
  // pound for this paper alone. Counts already round to the whole number.
  // 2015 goes the other way: whatever the context usually rounds to, this
  // paper works it to the penny and says nothing.
  const ctx = is2017 && drawn.rounding === 'money'
    ? { ...drawn, rounding: 'nearest-pound' as const }
    : is2015 ? { ...drawn, rounding: 'money' as const } : drawn;
  const up = ctx.appreciates;
  let rate = 0, multiplier = 0, years = 0, start = 0, value = 0;
  // **The fourth mark is for the rounding, so there has to be something to
  // round.** 20000 at 30% off for two years is 9800 exactly, and a pupil
  // collects `•⁴ answer correct to 3 significant figures` by copying the line
  // above it. The three-mark contexts fold rounding into evaluating, so an
  // exact answer costs nothing there.
  for (let tries = 0; tries < 200; tries++) {
    ({ rate, multiplier } = drawRate(up));
    years = getRandomInt(2, 4);
    // The three-significant-figure branch (2026 P2 Q1) keeps its own range.
    const band = threeSf ? undefined : BANDS[ctx.opening('%')];
    start = drawn.band
      ? getRandomInt(drawn.band[0], drawn.band[1])
      : band
      ? getRandomInt(band[0] / band[2], band[1] / band[2]) * band[2]
      : ctx.unit === '£'
        ? getRandomInt(4, 60) * 500
        : getRandomInt(20, 260) * 500;
    value = start * Math.pow(multiplier, years);
    // 2014 pays for rounding to the nearest ten, so the answer must not
    // already be one.
    if (is2014) { if (Math.abs(value - Math.round(value / 10) * 10) > 1e-6) break; continue; }
    if (!threeSf || toSigFigs(value, 3) !== value) break;
  }

  // ── two papers, two mark structures ──────────────────────────────────────
  //
  // 2026 P2 Q1 is four marks where the other seven are three, and the official
  // scheme — published after this was first written, which is why the registry
  // carried a note saying the fourth mark could not be explained — says what it
  // is for: `•⁴ answer correct to 3 significant figures`. The other papers fold
  // evaluating and rounding into one mark, because rounding to the penny or to
  // the nearest pound is not a separate skill.
  //
  // So a context asking for three significant figures *is* the 2026 question
  // and pays four marks; every other context is the three-mark question. This
  // was one variation carrying `marksDiffer`, which is one id covering two
  // shapes — the thing `diagram-questions.md` §6 says to split rather than
  // annotate, because `mix.ts` can only see what the registry names.

  return {
    subTopic: 'Compound Appreciation & Depreciation',
    difficulty: 'skill',
    variationId: threeSf ? 'percentages.compound-3sf' : 'percentages.compound',
    questionLines: [
      ctx.opening(ctx.format(start)),
      `It is expected to ${up ? 'increase' : 'decrease'} by ${rate}% each year.`,
      `Calculate ${ctx.asks} after ${years} years.`,
      /**
       * **To the penny needs no telling.** Four of the seven papers give no
       * rounding instruction at all - 2015 P2 Q1, 2016 P2 Q1, 2018 P2 Q1 and
       * 2024 P2 Q1 - and the three that do are the ones asking for something a
       * pupil would not assume: the nearest ten (2014), the nearest pound
       * (2017), the nearest thousand pounds (2022). This printed one on every
       * draw, so the four papers that say nothing had no clone that said
       * nothing either.
       *
       * Money rounded to the penny is the assumption, so it goes unsaid, which
       * is exactly what 2024 P2 Q1 does on its way to (£) 186.40. Everything
       * else still says so.
       */
      ...(ctx.rounding === 'money' ? [] : [roundingPhrase(ctx.rounding)]),
    ],
    boardQuestionLines: [
      `${ctx.format(start)}, ${up ? 'up' : 'down'} ${rate}% each year for ${years} years. Find the value.`,
    ],
    solutionSteps: [
      `<strong>1.</strong> Find the multiplier for ${up ? 'an increase' : 'a decrease'} of ${rate}%:<br><br>$100\\% ${up ? '+' : '-'} ${rate}\\% = ${up ? 100 + rate : 100 - rate}\\% = ${multiplier}$`,
      `<strong>2.</strong> Apply it once for each of the ${years} years:<br><br>$${ctx.unit === '£' ? money(start, 0) : plain(start)} \\times ${multiplier}^{${years}}$`,
      ...(threeSf
        // The scheme's own illustrative keeps the unrounded figure in front of
        // the rounding — `8435(·4048)` for •³, then `(£) 8440` for •⁴ — so the
        // two marks are visibly different moves rather than one move written
        // twice.
        ? [`<strong>3.</strong> Evaluate:<br><br>$= £${money(value, 2)}$`,
           `<strong>4.</strong> Round to 3 significant figures:<br><br>${roundedStep(value, ctx.rounding, ctx)}`]
        : [`<strong>3.</strong> Evaluate and round:<br><br>${roundedStep(value, ctx.rounding, ctx)}`]),
    ],
    // •¹ know how to change by the rate, •² know how to carry it over the years,
    // •³ evaluate — and for the three-significant-figure question, •⁴ round.
    stepMarks: threeSf ? [1, 1, 1, 1] : [1, 1, 1],
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

/**
 * **2019 P2 Q1 spans THREE years, and that span IS the question.**
 *
 * The note above says why: *"a pupil has to subtract two dates before anything
 * else, and it is the step they get wrong — 2018 to 2021 is three years and
 * reads like four."* Measured on the 2019 P2 sheet, 300 draws of that paper's
 * own id: **289 spanned two years, 11 spanned three.** The span is drawn from
 * 2 to 4 uniformly, but the loop below keeps only draws whose value comes out
 * whole, and a third or fourth application of the multiplier survives that far
 * less often — so the trap the question is built around had all but vanished.
 *
 * The other paper here, 2025 P2 Q1, is 2024 to 2026 and says *"over the next
 * two years"* in words, so it carries no such trap.
 *
 * **Only the alias is pinned, deliberately.** 2025 P2 Q1 sits on the target id
 * and is SIGNED OFF, and the sheet promised this fix could not reach it — so
 * the target keeps the free draw it had, and `frozen` should name neither.
 * The owner: *"Yes key it to the year."*
 */
function compoundBetweenYears(asked?: string): Q {
  /**
   * **2025 P2 Q1 is two years, and says so**: "… each year over the next two
   * years". Its own id drew three or four in 19 of 400 and never printed the
   * phrase. The owner, on the 2025 re-review sheet: "Yes". 2019's alias keeps
   * its three and its own wording.
   */
  const is2025 = asked === 'percentages.compound-between-years';
  const pinnedYears = asked === 'percentages.compound-between-years-pre2023'
    ? 3        // 2019 P2 Q1 — 2018 to 2021
    : is2025 ? 2        // 2025 P2 Q1 — 2024 to 2026
    : 0;
  const ctx = pick(BETWEEN_YEARS_CONTEXTS);
  const [lo, hi] = ctx.band;
  const step = hi > 200000 ? 10000 : hi > 40000 ? 2500 : 500;
  let rate = 0, multiplier = 0, years = 0, start = 0, value = 0;
  // **A whole number of visitors, meals or packages.** Both papers come out
  // exact - 80 000 x 1.15^3 is 121 670 and 118 750 x 1.04^2 is 128 440 - and
  // neither asks for any rounding, because neither needs to. Drawn freely this
  // gave 62 500 x 1.05^2 = 68 906.25, printed as "68,906 meals" while the
  // pupil's calculator says something else and nothing in the question tells
  // them what to do about it.
  for (let tries = 0; tries < 400; tries++) {
    ({ rate, multiplier } = drawRate(true));
    years = pinnedYears || getRandomInt(2, 4);
    start = getRandomInt(Math.ceil(lo / step), Math.floor(hi / step)) * step;
    value = start * Math.pow(multiplier, years);
    if (Math.abs(value - Math.round(value)) < 1e-6) break;
  }
  value = Math.round(value);
  const from = getRandomInt(2014, 2025);

  return {
    subTopic: 'Appreciation Between Two Years',
    difficulty: 'exam',
    variationId: 'percentages.compound-between-years',
    questionLines: [
      ctx.opening(plain(start), from),
      `This number is expected to increase by ${rate}% each year${is2025 ? ' over the next two years' : ''}.`,
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

/**
 * **2018 P2 Q11 in standard form.**
 *
 * The paper gives `9.3 x 10^11` cubic kilometres as 85% of Earth's volume and
 * asks for Earth's, which is `1.094 x 10^12`. The arithmetic is the reverse
 * percentage `partOfWhole` already does; what the paper is buying is carrying
 * standard form through it, and its markscheme prices exactly that. The clone
 * printed a plain number in 400 of 400 draws, so none of them asked what the
 * paper asks. The owner: *"Yes key it needs to be scientific notation."*
 *
 * The part is drawn as a one-decimal mantissa, as the paper's 9.3 is, and the
 * whole falls out of it rather than the other way round — so the given number
 * is always tidy and the answer is the one that needs rounding, which is the
 * way round the exam sets it. Four significant figures, as the paper's 1.094.
 */
function sciPartOfWhole(): Q {
  const ctx = pick(SCI_PART_OF_WHOLE_CONTEXTS);
  const pct = pick([20, 25, 40, 60, 65, 75, 80, 85, 90]);
  // the mantissa of the PART, one decimal place — the paper's is 9.3
  const pm = getRandomInt(12, 98) / 10;
  const pe = getRandomInt(ctx.exponent[0], ctx.exponent[1]);
  /**
   * **Every line has to be in standard form, including the middle one.**
   *
   * The first version printed 1% straight from the division — `8 x 10^12 / 90`
   * gives `0.0889 x 10^12`, which is arithmetically right and is not standard
   * form at all. That is the step the markscheme prices (`1% = 9.3 x 10^11 /
   * 85`), so it is the last line that should be sloppy about it.
   *
   * So the mantissa is normalised back into [1, 10) and the exponent carries
   * the difference, both up and down, and the whole is computed FROM the
   * normalised 1% — not alongside it — so the three lines cannot disagree.
   */
  const norm = (m: number, e: number): [number, number] => {
    while (m >= 10) { m /= 10; e += 1; }
    while (m < 1) { m *= 10; e -= 1; }
    return [Math.round(m * 1000) / 1000, e];
  };
  // 1% of the whole, which is the middle step the scheme pays for
  const [om, oe] = norm(pm / pct, pe);
  // and the whole is a hundred times that
  const [wm, we] = norm(om, oe + 2);
  const sci = (m: number, e: number) => `${m} \\times 10^{${e}}`;

  return {
    subTopic: 'Finding a Total from a Percentage',
    difficulty: 'exam',
    variationId: 'percentages.part-of-whole',
    questionLines: ctx.lines(sci(pm, pe), pct),
    boardQuestionLines: [`$${sci(pm, pe)}$ is ${pct}% of the total. Find the total.`],
    solutionSteps: [
      `<strong>1.</strong> Write down what the question tells you:<br><br>$${pct}\\% = ${sci(pm, pe)}$`,
      `<strong>2.</strong> Divide to find $1\\%$, and write the result in standard form:<br><br>$1\\% = \\frac{${sci(pm, pe)}}{${pct}} = ${sci(om, oe)}$`,
      `<strong>3.</strong> Multiply by 100 to get the whole:<br><br>$100\\% = ${sci(om, oe)} \\times 100 = ${sci(wm, we)}$ ${ctx.unit}`,
    ],
    // •¹ know that r% = the figure given, •² begin a valid strategy, •³ answer
    stepMarks: [1, 1, 1],
    finalAnswer: `$${sci(wm, we)}$ ${ctx.unit}`,
  };
}

function partOfWhole(askedId?: string): Q {
  // 2018 P2 Q11 is the standard-form one and nothing else on this routine is.
  // Its alias cites that paper alone — 2026 P1 Q2 and 2014 P1 Q9 are the plain
  // kind and sit on their own ids — so this reaches no other question.
  if (askedId === 'percentages.part-of-whole-pre2023') return sciPartOfWhole();
  for (let tries = 0; tries < 400; tries++) {
    const ctx = pick(PART_OF_WHOLE_CONTEXTS);
    /**
     * **Not 10, and not 50.** The owner, on 2026 P1 Q2: a pupil doubles or
     * multiplies by ten and never meets the method the three marks pay for —
     * know that r% is the figure given, begin a valid strategy, complete it.
     *
     * The three papers use 80, 60 and 85, and none of them goes below 60 or
     * picks a rate that undoes itself. 20 and 25 stay: multiplying by five or
     * four is a step a pupil still has to see, where doubling is not. 85 is
     * added because 2018 P2 Q11 uses it and the pool had no odd multiple of
     * five at all.
     */
    const pct = pick([20, 25, 40, 60, 65, 75, 80, 85, 90]);
    // **2014 P1 Q9 is non-calculator: no 65% or 85%.** Both need a division
    // by 13 or 17 on the way; the paper's is 80% (10% is 60,000). Measured in
    // 90 of 400 draws. The owner, on the 2014 P1 sheet: "Yes". A rejection on
    // 2014's asked id alone, so 2026 P1 Q2 draws exactly as before.
    // **And 2026 P1 Q2 the same way**, also non-calculator (60%): 65% or 85%
    // in 82 of 400 draws. The owner, at the foot of the 2014 P1 sheet: "Yes".
    if ((askedId === 'percentages.part-of-whole-2014' || askedId === 'percentages.part-of-whole')
        && (pct === 65 || pct === 85)) continue;
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
  // **Two, because the one paper is two.** 2023 P2 Q1 depreciates once at 11%
  // and then at 6% "over the next two years", and asks for the value three
  // years after buying. Three of them is a question no paper sets - and the
  // wording and the arithmetic have to move together, which they did not when
  // only the sentence was changed: the page then said "the next two years" over
  // a value that had been depreciated three times.
  const restYears = 2;
  const m1 = 1 - first / 100, m2 = 1 - rest / 100;
  const value = start * m1 * Math.pow(m2, restYears);

  return {
    subTopic: 'Two-Stage Depreciation',
    difficulty: 'exam',
    variationId: 'percentages.two-stage',
    questionLines: [
      ctx.opening(`£${money(start, 0)}`),
      `It depreciated by ${first}% in the first year.`,
      // **Two, because the one paper is two.** 2023 P2 Q1 depreciates once at
      // 11% and then at 6% "over the next two years", and asks for the value
      // three years after buying. A third year is a question no paper sets.
      `It then depreciated by a further ${rest}% each year over the next two years.`,
      `Calculate the value of ${ctx.subject} after ${restYears + 1} years.`,
      // **No rounding line.** 2023 P2 Q1 gives none and answers (£) 15,728.08:
      // money to the penny is the assumption, which is the same ruling made for
      // percentages.compound on 2024 P2 Q1.

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

/** The pound sign, kept out of template literals — see docs/dollar traps. */
const POUND = '\u00a3';
/**
 * **2022 P1 Q10 - the same question, on a paper with no calculator.**
 *
 * The owner, having read the sheet: *"Can we check these are ok for non
 * calculator."* They were not. Over 123 parsed draws of `percentages.reverse`,
 * **61 landed on a divisor that is not a multiple of ten** - 104, 105, 108,
 * 112, 115, 85, 75, 125, 65 - leaving a pupil to divide by 108 to find 1% with
 * nothing to divide with. The worst was 432,000 at 8%.
 *
 * Read the four papers that generator serves and the rule is already there:
 *
 *   2022 P1 Q10   P1   30% off 16.10      divide by 70    no calculator
 *   2025 P1 Q4    P1   20% off 720        divide by 80    no calculator
 *   2023 P2 Q6    P2   8% up, 94,500      divide by 108   calculator
 *   2024 P2 Q5    P2   16% up, 278.40     divide by 116   calculator
 *
 * **Both Paper 1 questions use a divisor that is a multiple of ten**, and 2025
 * P1 Q4's markscheme spells the route out - *"(10% =) 720/8"*. Both Paper 2
 * questions use an awkward one, because there a calculator does the work.
 *
 * ## Why this is a separate routine under its own subTopic
 *
 * A second id inside `reverse()` would have reshuffled which draws that
 * routine keeps for every other paper on it, and three of them are signed off.
 * `generateQuestion` narrows to the topics the wanted variations live in, so a
 * variation under **its own subTopic** gets its own draw loop: `reverse()` is
 * never entered, never rejects anything, and 2025 P1 Q4, 2023 P2 Q6 and 2024
 * P2 Q5 do not move at all.
 *
 * That distinction was missed once and is worth stating plainly, because the
 * wrong half of it was briefly written into `frozen.ts` as though it were
 * general: **a same-topic split moves the sibling; a new-subTopic split does
 * not.** The first is unavoidable, the second is the tool for exactly this
 * case - the owner's rule, *"if we fix something that affects a frozen
 * question we create a new generator"*, working as stated.
 *
 * `webTopics` is unchanged, so the website still shows one Reverse Percentages
 * topic; the split is the generator's, not the site's.
 *
 * **2025 P1 Q4 still has the fault**, and is signed off, so it is left exactly
 * as it is and flagged rather than quietly fixed.
 */
function reverseNonCalculator(): Q {
  for (let tries = 0; tries < 400; tries++) {
    // A discount, because 2022 P1 Q10 is a discount, and a rate whose divisor
    // is a multiple of ten so that 10% is one short division away.
    const rate = pick([10, 20, 30, 40]);
    const divisor = 100 - rate;                     // 90, 80, 70 or 60
    // Paper scale: 16.10 in 2022, 720 in 2025, not the 432,000 the calculator
    // form reaches.
    const ctx = pick(REVERSE_CONTEXTS.filter(c => !c.up && c.band[1] <= 1200));
    const [lo, hi] = ctx.band;
    const step = hi > 400 ? 50 : 10;
    const original = getRandomInt(Math.ceil(lo / step), Math.floor(hi / step)) * step;
    const given = original * (1 - rate / 100);
    // Exact pence, and the 10% step a pupil actually takes has to be exact
    // too: 16.10 / 7 = 2.30 is the paper's own line of working.
    if (Math.abs(given * 100 - Math.round(given * 100)) > 1e-9) continue;
    const tenth = given / (divisor / 10);
    if (Math.abs(tenth * 100 - Math.round(tenth * 100)) > 1e-9) continue;

    const show = (v: number) => POUND + money(v, 2);
    return {
      subTopic: 'Reverse Percentages without a Calculator',
      difficulty: 'skill',
      variationId: 'percentages.reverse-non-calculator',
      questionLines: ctx.lines(POUND + moneyNeat(given), rate),
      boardQuestionLines: [`Down ${rate}% gives ${show(given)}. Find the original.`],
      // 2022 P1 Q10's three marks: know that 70% = 16.10, begin a valid
      // strategy, complete it. The middle one is the 10% step.
      solutionSteps: [
        `<strong>1.</strong> The price paid is ${divisor}% of the original:<br><br>$${divisor}\\% = ${show(given)}$`,
        `<strong>2.</strong> Divide by ${divisor / 10} to get 10%:<br><br>$10\\% = ${show(given)} \\div ${divisor / 10} = ${show(tenth)}$`,
        `<strong>3.</strong> Ten times that is the original:<br><br>$= ${show(original)}$`,
      ],
      stepMarks: [1, 1, 1],
      finalAnswer: POUND + moneyNeat(original),
    };
  }
  throw new Error('percentages.reverse-non-calculator: no valid question found');
}

export const PERCENTAGE_GENERATORS: Record<string, Gen> = {
  // `asked` so 2017 P2 Q2 can be keyed without moving the locked papers that
  // share its target id. See the note above `compound`.
  'Compound Appreciation & Depreciation': (w, asked) => compound(w, asked),
  'Reverse Percentages': reverse,
  'Reverse Percentages without a Calculator': reverseNonCalculator,
  'Percentage Change': percentageChange,
  'Two-Stage Depreciation': twoStage,
  // `asked` is passed through so 2019 P2 Q1 can be pinned to its own
  // three-year span without touching 2025 P2 Q1 on the target id, which is
  // signed off. See the note above `compoundBetweenYears`.
  'Appreciation Between Two Years': (_w, asked) => compoundBetweenYears(asked),
  'Finding a Total from a Percentage': (_w, a) => partOfWhole(a),
  'Finding the Extra Charged': surcharge,
};
