import { GeneratedQuestion } from './types';
import type { Gen } from './n5';
import { getRandomInt, random } from './utils';
import { DATA_CONTEXTS, type DataContext, unitFor } from './n5-contexts';

/**
 * National 5 Comparing Data Sets — 12 paper questions.
 *
 * The arithmetic is the easy half. **The comparison marks are the hard part,
 * and the markscheme is strict about the wording.** 2023 P1 Q9(b) spells it
 * out: a comment must name the quantity *and* the group. Accepted:
 *
 *     "On average the newspaper readers' ages are higher"
 *
 * Not accepted: "on average the ages are higher" (no group), "the median age …
 * is less" (names the statistic instead of saying on average), "the range …",
 * or anything using "results", "scores" or "data" for the quantity.
 *
 * So every context carries its two group names and its quantity separately,
 * and the model answers are built from them rather than from a generic
 * sentence. That is also why this topic needed a context bank before it could
 * be written at all — see docs/context-variety.md.
 *
 * ⚠️ The gap table described 2017 P1 Q12 as "given the standard deviation, find
 * the missing values". It is not: five ratings are given and the standard
 * deviation has to be written in the form a√b/2. Corrected there and built as
 * data.sd-surd.
 *
 * Quartiles follow the N5 convention — the median splits the list, and is
 * excluded from both halves when the count is odd. Confirmed against 2025 P1 Q3
 * (3 11 13 15 15 16 17 18 19 22, IQR 5) and 2024 P1 Q5.
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
type Q = Omit<GeneratedQuestion, 'topic'>;

/** A number as it should read: 4.5 not 4.50, 7 not 7.0. */
const num = (x: number): string => `${Math.round(x * 1000) / 1000}`;

const median = (a: number[]): number => {
  const k = a.length;
  return k % 2 ? a[(k - 1) / 2] : (a[k / 2 - 1] + a[k / 2]) / 2;
};

/** Q1, Q2, Q3 by the National 5 convention. */
function quartiles(sorted: number[]) {
  const n = sorted.length;
  const half = Math.floor(n / 2);
  return {
    q1: median(sorted.slice(0, half)),
    q2: median(sorted),
    q3: median(sorted.slice(n - half)),
  };
}

/** Written as the paper writes it: "£155" or "23". */
const show = (v: number, ctx: DataContext): string => `${ctx.prefix}${num(v)}`;

/** The same value written as prose writes it, with the unit on the end. */
const amount = (v: number, ctx: DataContext): string =>
  `${show(v, ctx)}${ctx.unit ? ` ${unitFor(v, ctx.unit)}` : ''}`;

/** The values as a spaced row, sorted or not as the papers do both. */
const row = (vals: number[], ctx: DataContext): string =>
  vals.map(v => show(v, ctx)).join('&nbsp;&nbsp;&nbsp;');

/** Sample standard deviation, the n-1 form on the N5 formula sheet. */
function stdev(vals: number[]): { mean: number; ssq: number; s: number } {
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const ssq = vals.reduce((a, b) => a + (b - mean) ** 2, 0);
  return { mean, ssq, s: Math.sqrt(ssq / (vals.length - 1)) };
}

/**
 * A sample whose mean is a whole number.
 *
 * Answer-first: choose the mean, then deviations that sum to zero. Working
 * forwards from random values gives means like 26.428571, which no paper prints.
 */
function sampleWithWholeMean(ctx: DataContext, n: number): number[] | null {
  const [lo, hi] = ctx.band;
  for (let tries = 0; tries < 300; tries++) {
    const mean = getRandomInt(lo + Math.ceil((hi - lo) * 0.25), hi - Math.ceil((hi - lo) * 0.25));
    const spread = Math.max(2, Math.round((hi - lo) * 0.18));
    const devs: number[] = [];
    for (let i = 0; i < n - 1; i++) devs.push(getRandomInt(-spread, spread));
    devs.push(-devs.reduce((a, b) => a + b, 0));
    if (Math.abs(devs[n - 1]) > spread) continue;
    const vals = devs.map(d => mean + d);
    if (vals.some(v => v < lo || v > hi)) continue;
    if (new Set(vals).size < n - 1) continue;          // avoid a near-constant list
    return vals;
  }
  return null;
}

/** "the magazine readers" -> "the magazine readers'"; "class 4A" -> "class 4A's". */
/**
 * The two sentences part (b) pays for.
 *
 * `bHigher` and `bWider` are statements about the **second** group, the one
 * whose figures the question states. Both sentences therefore have to name
 * whichever group is actually the higher or the wider one - saying "A's are
 * lower than B's" is the same claim as "B's are higher than A's", so flipping
 * the adjective *and* the subject together leaves the claim unchanged. It did:
 * every draw asserted the second group was the higher one, and half of them
 * were wrong against their own data, medians of 102 and 96 reported as "the
 * adults' times are lower than the children's".
 *
 * The phrasing is "the <quantity> of <group>", which is 2019 P1 Q5's own - "the
 * midday temperatures of Grantford and Endoch". The possessive it replaces read
 * "the bicycles in the shop's prices" on the contexts whose group name does not
 * end in a noun.
 */
function comparison(
  ctx: DataContext, bHigher: boolean, bWider: boolean,
): string[] {
  const [a, b] = [ctx.groupA, ctx.groupB];
  const of = (g: string) => `the ${ctx.quantity} of ${g}`;
  const cap = (t: string) => `${t[0].toUpperCase()}${t.slice(1)}`;
  return [
    `On average, ${of(bHigher ? b : a)} are higher than ${of(bHigher ? a : b)}.`,
    `${cap(of(bWider ? b : a))} are more varied than ${of(bWider ? a : b)}.`,
  ];
}

/**
 * The comparison sentences, worded the way the markscheme demands.
 *
 * The possessive is what SQA's own accepted answer uses — "the newspaper
 * readers' ages" — and it is the only phrasing that stays readable across every
 * context. "The numbers of eggs of the second flock" is grammatical and awful.
 */

// ── skill: quartiles and the interquartile range ─────────────────────────
//    2017 P1 Q2 (semi-interquartile range), 2025 P1 Q3 (interquartile range)

/**
 * **The statistic is the question, so it is chosen once and named in the id.**
 *
 * 2017 P1 Q2 asks for the semi-interquartile range; 2025 P1 Q3 asks for the
 * interquartile range. One variation served both and tossed a coin, so half
 * the clones of each paper asked the other paper's statistic — and 2025's own
 * scheme scores 0/2 for the wrong one. Two papers, two unknowns, two
 * variations: a clone may only stand in for a second paper when that paper is
 * the same question with different numbers.
 *
 * Both papers print their ten values **already in ascending order**, and
 * neither pays a mark for sorting — the first mark is "find quartiles". So the
 * list is printed sorted and the working does not pretend otherwise.
 */
function quartilesOnly(semi: boolean): Q {
  for (let tries = 0; tries < 300; tries++) {
    const ctx = pick(DATA_CONTEXTS);
    // Ten, as both papers use. The values vary; the count is part of the
    // question's shape rather than one of its numbers.
    const n = 10;
    const [lo, hi] = ctx.band;
    if (hi - lo < n) continue;
    const vals: number[] = [];
    while (vals.length < n) {
      const v = getRandomInt(lo, hi);
      if (!vals.includes(v) || vals.length > n - 2) vals.push(v);
    }
    const sorted = [...vals].sort((a, b) => a - b);
    const { q1, q2, q3 } = quartiles(sorted);
    const iqr = q3 - q1;
    if (iqr <= 0) continue;
    if (semi && (iqr / 2) % 0.5 !== 0) continue;        // keep the halving tidy
    if (!Number.isInteger(iqr) && !semi) continue;

    const wanted = semi ? iqr / 2 : iqr;
    const name = semi ? 'semi-interquartile range' : 'interquartile range';

    return {
      subTopic: 'Quartiles and Interquartile Range',
      difficulty: 'skill',
      variationId: semi ? 'data.quartiles-semi' : 'data.quartiles',
      questionLines: [
        ctx.lead(n),
        row(sorted, ctx),
        `Calculate the ${name} of these ${ctx.quantity}.`,
      ],
      boardQuestionLines: [`${name} of ${row(sorted, ctx)}?`],
      // Two marks in both papers: •¹ find the quartiles, •² calculate the range.
      // Locating the median is how the quartiles are found, not a mark of its
      // own, so it opens the first step.
      solutionSteps: [
        `<strong>1.</strong> The ${ctx.quantity} are already in order, so find the quartiles. The median splits the list${n % 2 ? ' and is not counted in either half' : ''}, and $Q_{1}$ and $Q_{3}$ are the middles of the two halves:<br><br>${row(sorted, ctx)}<br><br>$Q_{1} = ${num(q1)}$, $Q_{2} = ${num(q2)}$, $Q_{3} = ${num(q3)}$`,
        semi
          ? `<strong>2.</strong> The semi-interquartile range is half of $Q_{3} - Q_{1}$:<br><br>$\\frac{${num(q3)} - ${num(q1)}}{2} = ${num(wanted)}$`
          : `<strong>2.</strong> The interquartile range is $Q_{3} - Q_{1}$:<br><br>$${num(q3)} - ${num(q1)} = ${num(wanted)}$`,
      ],
      stepMarks: [1, 1],
      // An interquartile range of exactly 1 printed "1 hours". Rare - 0.8% of
      // draws - which is why the sweep that fixed three other variations for
      // this never drew it, and why `prose.ts` catches it about one run in
      // three rather than every time.
      finalAnswer: `${show(wanted, ctx)}${ctx.unit ? ` ${unitFor(wanted, ctx.unit)}` : ''}`,
    };
  }
  throw new Error(`data.quartiles${semi ? '-semi' : ''}: no valid question found`);
}

// ── median and IQR or semi-IQR, then compare ────────────────────────────
//    IQR:  2023 P1 Q9, 2024 P1 Q5, 2026 P1 Q3
//    SIQR: 2015 P1 Q10, 2019 P1 Q5

/**
 * **Five papers, two questions.**
 *
 * 2015 P1 Q10 and 2019 P1 Q5 ask for the median and the **semi**-interquartile
 * range; 2023 P1 Q9, 2024 P1 Q5 and 2026 P1 Q3 ask for the median and the
 * **interquartile** range. Within each group the papers are the same question
 * with different numbers — a list, the two statistics, then two comparisons
 * against a stated pair — so each group gets one variation and no more.
 *
 * This offered only the interquartile form, so the two semi papers had no
 * clone that asked what they ask. Their schemes pay a mark for the semi form
 * specifically, and 2019's notes refuse it to a candidate who halves the range
 * instead.
 */
function medianCompare(semi: boolean, asked?: string): Q {
  /**
   * **2015 P1 Q10 is ten two-digit scores, on a non-calculator paper.** The
   * clone gave nine values in 196 of 400 draws (2019's split, quartiles found
   * differently) and three-digit data in 187 - "£551 £315 £491 ...". The
   * owner, on the 2015 P1 sheet: *"Yes key"*. Ten values, every one of them
   * and the second group's median under 100. Read by 2015's alias alone, and
   * every coin is still drawn, so LOCKED 2019 P1 Q5 draws exactly as before.
   */
  const paper2015 = asked === 'data.median-siqr-compare-pre2019p1';
  /**
   * **2019 P1 Q5 is nine temperatures, 4 7 4 3 6 10 9 5 3**, and had the
   * same scale fault: values of 100 or more in 155 of 400 draws, and nine
   * values in only 183. Put to the owner at the foot of the 2015 P1 sheet:
   * *"Yes"*. Nine values under 100. Its answers to 2 dp stay, because the
   * paper's own is 2.25.
   */
  const paper2019 = asked === 'data.median-siqr-compare';
  const small = paper2015 || paper2019;
  for (let tries = 0; tries < (small ? 600 : 300); tries++) {
    const ctx = pick(DATA_CONTEXTS);
    // **How many values is part of the question.** With an odd count the median
    // is one of the listed values and each quartile is a single value too; with
    // an even count the median is the mean of the two middles, which is what
    // the first mark is for - 39.5, 200, 7, 19.5. The interquartile papers are
    // ten, six and ten, all even; the semi papers are ten and nine, and 2019's
    // quartiles of 3.5 and 8 come out of that odd split. So each variation
    // takes the counts its own papers use, rather than all four.
    const drawnN = pick(semi ? [9, 10] : [6, 10]);
    // **Each interquartile paper at its own count.** — 2026-09-25, the 2026
    // re-review. 2026 P1 Q3 and 2023 P1 Q9 list ten values and 2024 P1 Q5 six;
    // each id drew six or ten at random. The owner: *"Yes key each paper to
    // it's number"*. The pick is still drawn, so the stream reads the same.
    const n = paper2015 ? 10 : paper2019 ? 9
      : asked === 'data.median-iqr-compare' || asked === 'data.median-iqr-compare-2023' ? 10
      : asked === 'data.median-iqr-compare-2024' ? 6
      : drawnN;
    const [lo, hi] = ctx.band;
    if (hi - lo < n + 4) continue;
    const vals: number[] = [];
    while (vals.length < n) vals.push(getRandomInt(lo, hi));
    const sorted = [...vals].sort((a, b) => a - b);
    const { q1, q2, q3 } = quartiles(sorted);
    const iqr = q3 - q1;
    // The semi form halves it, so the papers' quartiles land on halves —
    // 2019's are 3.5 and 8, giving 2.25. Whole quartiles otherwise.
    if (semi ? (iqr % 0.5 !== 0) : !Number.isInteger(iqr)) continue;
    if (iqr < 2) continue;
    // **A median of 39.5 is the question, not a defect.** This used to require
    // a whole median, which contradicted the note above it by three lines: with
    // an even count the median is the mean of the two middle values, and
    // "39.5, 200, 7, 19.5" are the four the papers actually answer. 2023 P1 Q9
    // answers 39.5 and 2019 P1 Q5 answers 19.5, so the guard made two of the
    // five papers' own first marks unreachable - 0 half medians in 120 draws.
    // Integer data on an even count can only ever give a whole or a half, so
    // there is nothing here to reject.

    const spread = semi ? iqr / 2 : iqr;
    const name = semi ? 'semi-interquartile range' : 'interquartile range';

    // The second group's figures are stated, as the papers state them - and
    // **near the first group's**, as the papers also do: 7 against 9, 70
    // against 73, 11 against 12, 4.5 against 2.5, 2.25 against 1.5. A spread of
    // 1 stated against a sample whose spread is 13 is not a comparison a paper
    // would set, and it makes part (b) answerable without reading part (a).
    const higher = getRandomInt(0, 1) === 0;
    const wider = getRandomInt(0, 1) === 0;
    // A whole number, as every paper states: 2023 P1 Q9 puts 41 beside a
    // median of 39.5.
    const otherMed = Math.round(q2) + (higher ? getRandomInt(2, 8) : -getRandomInt(2, 8));
    const grain = semi ? 0.5 : 1;
    const step = grain * getRandomInt(1, Math.max(1, Math.round(spread * 0.4 / grain)));
    const otherSpread = wider ? spread + step : spread - step;
    if (otherMed < lo || otherMed > hi) continue;
    if (otherSpread < grain || otherSpread === spread) continue;
    if (small && (Math.max(...vals) > 99 || otherMed > 99)) continue;

    return {
      subTopic: 'Comparing Median and Interquartile Range',
      difficulty: 'exam',
      variationId: semi ? 'data.median-siqr-compare' : 'data.median-iqr-compare',
      questionLines: [
        ctx.lead(n),
        row(vals, ctx),
        `(a) Calculate the median and the ${name} of these ${ctx.quantity}.`,
        // The unit goes on both figures, as 2019 P1 Q5 puts it on both: "The
        // median temperature was 8 °C, and the semi-interquartile range was
        // 1.5 °C." And "a interquartile range" was printing in every draw.
        `A sample taken from ${ctx.groupB} has a median of ${amount(otherMed, ctx)} and ${semi ? 'a' : 'an'} ${name} of ${amount(otherSpread, ctx)}.`,
        // Both groups are named, as all five papers name them - "comparing the
        // midday temperatures of Grantford and Endoch". The scheme refuses a
        // comment that does not say whose values are whose, so a question that
        // never names them is asking for something it has not set up.
        `(b) Make two valid comments comparing the ${ctx.quantity} of ${ctx.groupA} and ${ctx.groupB}.`,
      ],
      boardQuestionLines: [`Median and ${semi ? 'SIQR' : 'IQR'} of ${row(sorted, ctx)}, then compare with ${show(otherMed, ctx)} and ${show(otherSpread, ctx)}`],
      // Five marks, 3 + 2: •¹ the median, •² the quartiles, •³ the IQR, then
      // •⁴ a valid comparison of the medians and •⁵ of the IQRs. Both parts had
      // been compressed — part (a)'s three marks into two steps and part (b)'s
      // two into one — so a pupil taking hints was handed two marks at a time
      // and the withheld step covered both comparisons at once.
      solutionSteps: [
        `<strong>(a)</strong> Put them in order and find the median:<br><br>${row(sorted, ctx)}<br><br>$Q_{2} = ${num(q2)}$`,
        `<strong>(a)</strong> $Q_{1}$ is the middle of the lower half and $Q_{3}$ the middle of the upper half:<br><br>$Q_{1} = ${num(q1)}$, $Q_{3} = ${num(q3)}$`,
        semi
          ? `<strong>(a)</strong> The semi-interquartile range is half of $Q_{3} - Q_{1}$:<br><br>$\\frac{${num(q3)} - ${num(q1)}}{2} = ${num(spread)}$`
          : `<strong>(a)</strong> The interquartile range is $Q_{3} - Q_{1}$:<br><br>$${num(q3)} - ${num(q1)} = ${num(spread)}$`,
        `<strong>(b)</strong> Compare the averages. The comparison must name <strong>the quantity and the group</strong> — "on average the ${ctx.quantity} are higher" scores nothing without saying whose:<br><br>${comparison(ctx, higher, wider)[0]}`,
        `<strong>(b)</strong> Now compare the spreads, naming the quantity and the group again:<br><br>${comparison(ctx, higher, wider)[1]}`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `(a) median ${amount(q2, ctx)}, ${name} ${amount(spread, ctx)}. (b) ` +
        comparison(ctx, higher, wider).join(' '),
    };
  }
  throw new Error(`data.median-${semi ? 'siqr' : 'iqr'}-compare: no valid question found`);
}

// ── skill: mean and standard deviation — 2014 P2 Q4(a) ──────────────────
//    the calculation on its own, which Zeta teaches before any comparison
//
// This was written up as having no paper behind it while 2014 P2 Q4 was filed
// under the comparison variation. It is not a comparison question: its part (b)
// asks whether a claim is supported, one mark, "no, with valid explanation" —
// nothing like the two-mark compare-the-means-and-spreads part the other four
// papers carry. Part (a) is exactly this, and is worth four.

function meanStdev(): Q {
  for (let tries = 0; tries < 300; tries++) {
    const ctx = pick(DATA_CONTEXTS);
    const n = pick([5, 6, 7]);
    const vals = sampleWithWholeMean(ctx, n);
    if (!vals) continue;
    const { mean, ssq, s } = stdev(vals);
    if (s < 1 || s > (ctx.band[1] - ctx.band[0]) / 2) continue;

    return {
      subTopic: 'Mean and Standard Deviation',
      difficulty: 'skill',
      variationId: 'data.mean-sd',
      questionLines: [
        ctx.lead(n),
        row(vals, ctx),
        `Calculate the mean and standard deviation of these ${ctx.quantity}.`,
        `Give the standard deviation correct to one decimal place.`,
      ],
      boardQuestionLines: [`Mean and standard deviation of ${row(vals, ctx)}`],
      solutionSteps: [
        `<strong>1.</strong> Add the ${ctx.quantity} and divide by ${n}:<br><br>$\\overline{x} = \\frac{${vals.reduce((a, b) => a + b, 0)}}{${n}} = ${num(mean)}$`,
        `<strong>2.</strong> Square each difference from the mean and add them:<br><br>$\\sum(x - \\overline{x})^{2} = ${vals.map(v => `(${num(v - mean)})^{2}`).join(' + ')} = ${num(ssq)}$`,
        `<strong>3.</strong> Substitute into the formula, dividing by $n - 1$:<br><br>$s = \\sqrt{\\frac{${num(ssq)}}{${n - 1}}}$`,
        `<strong>4.</strong> Take the square root:<br><br>$s = ${s.toFixed(1)}$`,
      ],
      // 2014 P2 Q4(a): •¹ the mean, •² the squared differences, •³ substitute
      // into the formula, •⁴ the standard deviation
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `mean ${show(mean, ctx)}, standard deviation ${s.toFixed(1)}`,
    };
  }
  throw new Error('data.mean-sd: no valid question found');
}

// ── mean, standard deviation, then a judgement — 2014 P2 Q4 ───────────
//
// **The whole of 2014 P2 Q4, all three parts.** It was cloned as part (a) only
// for a long time, cited as "2014 P2 Q4a" — honest about it, but it meant a
// pupil asking for that question got two thirds of it.
//
// It is not the compare-two-samples shape below, and the marks say so: 1 + 3 + 1
// against 4 + 2. The mean is its own one-mark part, and part (b) is a **single
// judgement about one measure** — "has consistency improved?" — where the other
// four papers ask for two comparisons covering both. Consistency is the standard
// deviation and nothing else, and that is the whole of the mark.

/**
 * **Six values, and part (b) is a change made to improve consistency.** — 2026-09-25
 *
 * The paper: six lap times, then *"She changes her training routine hoping to
 * improve her consistency. After this change, she records her times for another
 * six laps. The mean is 55 seconds and the standard deviation 3·2 seconds. Has
 * the new training routine improved her consistency?"* Measured on the 2014 P2
 * sheet, 400 draws: six values in 152, and part (b) always "a second sample was
 * recorded later". The owner: *"Yes"* to six values and the paper's part (b),
 * with Yes or No left free and the mean left whole.
 *
 * Its own contexts, because part (b) needs something someone can change - a
 * shared list with hours of sunshine and rainfall in it cannot be "improved".
 * This variation serves 2014 P2 Q4 alone, so nothing else moves.
 */
interface ConsistencyContext {
  ctx: DataContext;
  /** "She changes her training routine hoping to improve her consistency." */
  change: string;
  /** "After this change, she records her times for another six laps." */
  after: string;
  /** "Has the new training routine improved her consistency?" */
  ask: string;
}
const consistency = (
  quantity: string, unit: string, lead: string, band: [number, number],
  change: string, after: string, ask: string,
): ConsistencyContext => ({
  ctx: { quantity, inUnits: '', unit, prefix: '', groupA: '', groupB: '', lead: () => lead, band },
  change, after, ask,
});
const CONSISTENCY_CONTEXTS: ConsistencyContext[] = [
  consistency('lap times', 'seconds',
    'A runner has recorded her times, in seconds, for six different laps of a running track:', [48, 66],
    'She changes her training routine hoping to improve her consistency.',
    'After this change, she records her times for another six laps.',
    'Has the new training routine improved her consistency?'),
  consistency('length times', 'seconds',
    'A swimmer has recorded his times, in seconds, for six lengths of the pool:', [30, 46],
    'He changes his stroke hoping to improve his consistency.',
    'After this change, he records his times for another six lengths.',
    'Has the new stroke improved his consistency?'),
  consistency('drive distances', 'metres',
    'A golfer has recorded the distances, in metres, of six drives:', [180, 250],
    'She changes her grip hoping to improve her consistency.',
    'After this change, she records the distances of another six drives.',
    'Has the new grip improved her consistency?'),
  consistency('ride times', 'minutes',
    'A cyclist has recorded his times, in minutes, for six rides of the same route:', [30, 50],
    'He changes his training routine hoping to improve his consistency.',
    'After this change, he records his times for another six rides.',
    'Has the new training routine improved his consistency?'),
  consistency('scores', '',
    'An archer has recorded her scores for six rounds:', [30, 60],
    'She changes her bow hoping to improve her consistency.',
    'After this change, she records her scores for another six rounds.',
    'Has the new bow improved her consistency?'),
  consistency('journey times', 'minutes',
    'A bus company has recorded the journey time, in minutes, of its morning bus on six days:', [20, 52],
    'It changes the route hoping to make the journey times more consistent.',
    'After this change, it records the journey time on another six days.',
    'Has the new route made the journey times more consistent?'),
  consistency('masses', 'grams',
    'A machine fills bags of flour. The masses, in grams, of six bags are:', [490, 530],
    'The machine is adjusted hoping to make the masses more consistent.',
    'After this change, another six bags are weighed.',
    'Has the adjustment made the masses more consistent?'),
  consistency('masses', 'grams',
    'A bakery has weighed, in grams, six loaves from one batch:', [780, 830],
    'The bakery services its oven hoping to make the loaves more consistent.',
    'After this change, it weighs another six loaves.',
    'Has servicing the oven made the loaves more consistent?'),
  consistency('solving times', 'seconds',
    'A pupil has recorded her times, in seconds, for solving a puzzle cube six times:', [40, 80],
    'She learns a new method hoping to improve her consistency.',
    'After this change, she records her times for another six solves.',
    'Has the new method improved her consistency?'),
  consistency('jump distances', 'centimetres',
    'A long jumper has recorded the distances, in centimetres, of six jumps:', [520, 600],
    'She changes her run-up hoping to improve her consistency.',
    'After this change, she records the distances of another six jumps.',
    'Has the new run-up improved her consistency?'),
  consistency('scores', '',
    'A darts player has recorded his scores for six throws of three darts:', [40, 100],
    'He changes his grip hoping to improve his consistency.',
    'After this change, he records his scores for another six throws.',
    'Has the new grip improved his consistency?'),
  consistency('lengths', 'millimetres',
    'A machine cuts lengths of pipe. The lengths, in millimetres, of six pipes are:', [985, 1015],
    'The machine is serviced hoping to make the lengths more consistent.',
    'After this change, another six pipes are measured.',
    'Has the service made the lengths more consistent?'),
  consistency('waiting times', 'minutes',
    'A tea room has recorded how long, in minutes, six customers waited to be served:', [4, 20],
    'It takes on another waiter hoping to make the waiting times more consistent.',
    'After this change, it records the waiting times of another six customers.',
    'Has taking on another waiter made the waiting times more consistent?'),
  consistency('points totals', 'points',
    'A basketball player has recorded her points in six games:', [8, 30],
    'She changes her shooting technique hoping to improve her consistency.',
    'After this change, she records her points in another six games.',
    'Has the new technique improved her consistency?'),
  consistency('marks', 'marks',
    'A pupil has recorded her marks in six spelling tests, each out of 40:', [18, 40],
    'She changes how she revises hoping to improve her consistency.',
    'After this change, she records her marks in another six tests.',
    'Has the new way of revising improved her consistency?'),
  consistency('volumes', 'millilitres',
    'A machine fills cartons of juice. The volumes, in millilitres, of six cartons are:', [985, 1015],
    'The machine is adjusted hoping to make the volumes more consistent.',
    'After this change, another six cartons are measured.',
    'Has the adjustment made the volumes more consistent?'),
  consistency('times', 'seconds',
    'A rower has recorded her times, in seconds, for six 500 metre pieces:', [95, 120],
    'She changes her stroke rate hoping to improve her consistency.',
    'After this change, she records her times for another six pieces.',
    'Has the new stroke rate improved her consistency?'),
  consistency('journey times', 'minutes',
    'A commuter has recorded the time, in minutes, of her drive to work on six days:', [20, 45],
    'She changes her route hoping to make her journey times more consistent.',
    'After this change, she records the time on another six days.',
    'Has the new route made her journey times more consistent?'),
  consistency('speeds', 'miles per hour',
    'A cricket bowler has recorded the speed, in miles per hour, of six deliveries:', [60, 85],
    'He changes his run-up hoping to improve his consistency.',
    'After this change, he records the speed of another six deliveries.',
    'Has the new run-up improved his consistency?'),
  consistency('masses', 'grams',
    'A dairy has weighed, in grams, six blocks of cheese from one batch:', [480, 520],
    'It replaces its cutting machine hoping to make the masses more consistent.',
    'After this change, it weighs another six blocks.',
    'Has the new machine made the masses more consistent?'),
  consistency('scores', '',
    'A golfer has recorded her scores for six rounds:', [68, 90],
    'She changes her putter hoping to improve her consistency.',
    'After this change, she records her scores for another six rounds.',
    'Has the new putter improved her consistency?'),
  consistency('baking times', 'minutes',
    'A baker has recorded the baking time, in minutes, of six batches of bread:', [30, 50],
    'She buys a new oven hoping to make the baking times more consistent.',
    'After this change, she records the time for another six batches.',
    'Has the new oven made the baking times more consistent?'),
  consistency('run times', 'seconds',
    'A skier has recorded her times, in seconds, for six runs of the same slope:', [55, 75],
    'She changes her skis hoping to improve her consistency.',
    'After this change, she records her times for another six runs.',
    'Has changing her skis improved her consistency?'),
  consistency('delays', 'minutes',
    'A train company has recorded how many minutes late its morning train was on six days:', [2, 20],
    'It changes the timetable hoping to make the delays more consistent.',
    'After this change, it records the delay on another six days.',
    'Has the new timetable made the delays more consistent?'),
];

function meanStdevConsistency(): Q {
  for (let tries = 0; tries < 300; tries++) {
    const story = pick(CONSISTENCY_CONTEXTS);
    const ctx = story.ctx;
    const n = 6;
    const vals = sampleWithWholeMean(ctx, n);
    if (!vals) continue;
    const { mean, ssq, s } = stdev(vals);
    if (s < 1.2 || s > (ctx.band[1] - ctx.band[0]) / 2) continue;

    // The second sample is more consistent, or less, at random — the paper's
    // answer is "no" but a generated one that was always "no" would teach the
    // answer rather than the reason.
    const tighter = getRandomInt(0, 1) === 0;
    const otherS = tighter
      ? +Math.max(0.3, s - 0.7 - random() * 1.8).toFixed(1)
      : +(s + 0.7 + random() * 2.5).toFixed(1);
    if (Math.abs(otherS - s) < 0.4) continue;
    const otherMean = mean + getRandomInt(-3, 3);
    if (otherMean < ctx.band[0] || otherMean > ctx.band[1]) continue;

    const sd = s.toFixed(1);
    return {
      subTopic: 'Judging Consistency from the Standard Deviation',
      difficulty: 'exam',
      variationId: 'data.mean-sd-consistency',
      questionLines: [
        ctx.lead(n),
        row(vals, ctx),
        `<b>(a)</b>&nbsp;&nbsp;(i) Calculate the mean of these ${ctx.quantity}.`,
        `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(ii) Calculate the standard deviation of these ${ctx.quantity}.`,
        `<b>(b)</b>&nbsp;&nbsp;${story.change} ${story.after} `
        + `The mean is ${amount(otherMean, ctx)} and the standard deviation ${otherS}${ctx.unit ? ` ${unitFor(otherS, ctx.unit)}` : ''}.`,
        `${story.ask} Give a reason for your answer.`,
      ],
      boardQuestionLines: [
        `Mean and s.d. of ${row(vals, ctx)}; then after a change the s.d. is ${otherS}. Improved?`,
      ],
      // 2014 P2 Q4: •¹ the mean, •² the squared differences, •³ substitute into
      // the formula, •⁴ the standard deviation, •⁵ the judgement with a reason.
      solutionSteps: [
        `<strong>1. (a)(i)</strong> Add the ${ctx.quantity} and divide by ${n}:`
        + `<br><br>$\\overline{x} = \\frac{${vals.reduce((a, b) => a + b, 0)}}{${n}} = ${num(mean)}$`,
        `<strong>2. (a)(ii)</strong> Square each difference from the mean and add them:`
        + `<br><br>$\\sum(x - \\overline{x})^{2} = ${num(ssq)}$`,
        `<strong>3. (a)(ii)</strong> Substitute into the formula, dividing by $n - 1$:`
        + `<br><br>$s = \\sqrt{\\frac{${num(ssq)}}{${n - 1}}}$`,
        `<strong>4. (a)(ii)</strong> Take the square root:<br><br>$s = ${sd}$`,
        `<strong>5. (b)</strong> Consistency is about <strong>spread</strong>, so it is the standard `
        + `deviation that answers this and not the mean. After the change it is ${otherS}, `
        + `${tighter ? 'smaller' : 'greater'} than ${sd}:<br><br>`
        + `${tighter ? 'Yes' : 'No'} — its standard deviation is ${tighter ? 'smaller' : 'greater'}, `
        + `so the ${ctx.quantity} are ${tighter ? 'less' : 'more'} spread out.`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `(a)(i) mean ${show(mean, ctx)}, (ii) standard deviation ${sd}`
        + `<br>(b) ${tighter ? 'Yes' : 'No'} — the standard deviation is `
        + `${tighter ? 'smaller' : 'greater'}, so the ${ctx.quantity} are `
        + `${tighter ? 'less' : 'more'} spread out`,
    };
  }
  throw new Error('data.mean-sd-consistency: no valid question found');
}

// ── mean and standard deviation, then compare ───────────────────────────
//    2016 P2 Q6, 2018 P2 Q5, 2022 P2 Q5, 2025 P2 Q4
//
// 2014 P2 Q4 is NOT one of these, though this comment used to list it: it is
// 1 + 3 + 1 and asks a single judgement, not 4 + 2 with two comparisons.
// `data.mean-sd-consistency` above is that question.

function meanStdevCompare(): Q {
  for (let tries = 0; tries < 300; tries++) {
    const ctx = pick(DATA_CONTEXTS);
    const n = pick([5, 6, 7]);
    const vals = sampleWithWholeMean(ctx, n);
    if (!vals) continue;
    const { mean, ssq, s } = stdev(vals);
    if (s < 1.5 || s > (ctx.band[1] - ctx.band[0]) / 2) continue;

    const higher = getRandomInt(0, 1) === 0;
    const wider = getRandomInt(0, 1) === 0;
    const otherMean = mean + (higher ? getRandomInt(2, 9) : -getRandomInt(2, 9));
    const otherS = wider ? +(s + 1 + random() * 3).toFixed(1)
                         : +Math.max(0.4, s - 0.6 - random() * 2).toFixed(1);
    if (otherMean < ctx.band[0] || otherMean > ctx.band[1]) continue;
    if (Math.abs(otherS - s) < 0.3) continue;

    return {
      subTopic: 'Comparing Mean and Standard Deviation',
      difficulty: 'exam',
      variationId: 'data.mean-sd-compare',
      questionLines: [
        ctx.lead(n),
        row(vals, ctx),
        `(a) Calculate the mean and standard deviation of these ${ctx.quantity}.`,
        // The unit goes on both figures, as 2025 P2 Q4 puts it on both: "a mean
        // weight of 105 kilograms and a standard deviation of 5.9 kilograms".
        `A sample taken from ${ctx.groupB} has a mean of ${amount(otherMean, ctx)} and a standard deviation of ${ctx.prefix}${otherS}${ctx.unit ? ` ${unitFor(Number(otherS), ctx.unit)}` : ''}.`,
        // Both groups named, as all four papers name them - 2025 P2 Q4 asks for
        // comments "comparing the weights of the rugby players in the samples
        // from Scotland and France". The scheme refuses a comment that does not
        // say whose values are whose, so a question that never names them is
        // asking for something it has not set up. Same fault, and same fix, as
        // `data.median-iqr-compare` above.
        `(b) Make two valid comments comparing the ${ctx.quantity} of ${ctx.groupA} and ${ctx.groupB}.`,
      ],
      boardQuestionLines: [`Mean and s.d. of ${row(vals, ctx)}, then compare with ${show(otherMean, ctx)} and ${otherS}`],
      // Six marks, 4 + 2, in all four papers that ask it this way: •¹ the mean,
      // •² the squared differences, •³ substitute into the formula, •⁴ the
      // standard deviation, then •⁵ compare the means and •⁶ the deviations.
      // Three steps carried six marks, so every hint jumped two.
      solutionSteps: [
        `<strong>(a)</strong> Add the ${ctx.quantity} and divide by ${n}:<br><br>$\\overline{x} = \\frac{${vals.reduce((a, b) => a + b, 0)}}{${n}} = ${num(mean)}$`,
        `<strong>(a)</strong> Square each difference from the mean and add them:<br><br>$\\sum(x - \\overline{x})^{2} = ${vals.map(v => `(${num(v - mean)})^{2}`).join(' + ')} = ${num(ssq)}$`,
        `<strong>(a)</strong> Substitute into the formula:<br><br>$s = \\sqrt{\\frac{${num(ssq)}}{${n - 1}}}$`,
        `<strong>(a)</strong> Work out the standard deviation:<br><br>$s = ${s.toFixed(1)}$`,
        `<strong>(b)</strong> Compare the means. The comparison must name <strong>the quantity and the group</strong>:<br><br>${comparison(ctx, higher, wider)[0]}`,
        `<strong>(b)</strong> Now compare the standard deviations, naming the quantity and the group again:<br><br>${comparison(ctx, higher, wider)[1]}`,
      ],
      stepMarks: [1, 1, 1, 1, 1, 1],
      finalAnswer: `(a) mean ${amount(mean, ctx)}, standard deviation ${ctx.prefix}${s.toFixed(1)}${ctx.unit ? ` ${unitFor(Number(s.toFixed(1)), ctx.unit)}` : ''}. (b) ` +
        comparison(ctx, higher, wider).join(' '),
    };
  }
  throw new Error('data.mean-sd-compare: no valid question found');
}

// ── the standard deviation in surd form — 2017 P1 Q12 ───────────────────
//
// "In its simplest form, the standard deviation of these ratings can be
// written as a√b/2. Find the values of a and b."
//
// The /2 is not a coincidence: five values give sqrt(n-1) = 2, so the whole
// question only works at n = 5. Answer-first — pick a whole mean, then reject
// unless the sum of squared deviations simplifies to a surd rather than a
// whole number.

function stdevSurd(): Q {
  for (let tries = 0; tries < 400; tries++) {
    const ctx = pick(DATA_CONTEXTS);
    const vals = sampleWithWholeMean(ctx, 5);
    if (!vals) continue;
    const { mean, ssq } = stdev(vals);
    if (!Number.isInteger(ssq) || ssq < 4 || ssq > 200) continue;
    if (Number.isInteger(Math.sqrt(ssq))) continue;      // must stay a surd

    // sqrt(ssq) = a * sqrt(b) with b square-free
    let a = 1, b = ssq;
    for (let k = Math.floor(Math.sqrt(ssq)); k >= 2; k--) {
      if (b % (k * k) === 0) { a *= k; b /= k * k; }
    }
    if (a === 1) continue;                               // a = 1 makes it trivial
    // The question asks for the form a*sqrt(b)/2 **in its simplest form**, and
    // an even a is not: 4*sqrt(2)/2 is 2*sqrt(2). 2017 P1 Q12 answers a = 3,
    // odd, precisely because 3*sqrt(2)/2 cannot reduce. 77.2% of draws gave an
    // even a, so most of them contradicted their own wording.
    if (a % 2 === 0) continue;

    return {
      subTopic: 'Standard Deviation in Surd Form',
      difficulty: 'exam',
      variationId: 'data.sd-surd',
      questionLines: [
        ctx.lead(5),
        row(vals, ctx),
        `In its simplest form, the standard deviation of these ${ctx.quantity} can be written as $\\frac{a\\sqrt{b}}{2}$.`,
        `Find the values of $a$ and $b$.`,
      ],
      boardQuestionLines: [`Standard deviation of ${row(vals, ctx)} as $\\frac{a\\sqrt{b}}{2}$`],
      solutionSteps: [
        `<strong>1.</strong> Find the mean:<br><br>$\\overline{x} = \\frac{${vals.reduce((x, y) => x + y, 0)}}{5} = ${num(mean)}$`,
        `<strong>2.</strong> Add the squared differences:<br><br>$\\sum(x - \\overline{x})^{2} = ${vals.map(v => `(${num(v - mean)})^{2}`).join(' + ')} = ${ssq}$`,
        `<strong>3.</strong> Substitute into the formula. With five values $\\sqrt{n-1} = \\sqrt{4} = 2$, which is where the 2 on the bottom comes from:<br><br>$s = \\sqrt{\\frac{${ssq}}{4}} = \\frac{\\sqrt{${ssq}}}{2}$`,
        `<strong>4.</strong> Simplify the surd by taking out the largest square factor:<br><br>$\\frac{\\sqrt{${ssq}}}{2} = \\frac{${a}\\sqrt{${b}}}{2}$`,
      ],
      // 2017 P1 Q12: •¹ the mean, •² the squared differences, •³ substitute and
      // start to evaluate, •⁴ the values of a and b
      stepMarks: [1, 1, 1, 1],
      finalAnswer: `$a = ${a}$, $b = ${b}$`,
    };
  }
  throw new Error('data.sd-surd: no valid question found');
}

// ── given that the standard deviation is √a, find a — 2015 P1 Q5 ─────────
//
// "The standard deviation of 1, 2, 2, 2, 8 is equal to √a. Find the value of a."
//
// Two things make this its own shape rather than a variant of the others. It is
// **bare** — a Paper 1 non-calculator question with five tiny numbers and no
// story at all, where every other data question in the papers carries a
// context. And it runs backwards: a is what sits *under* the root, so the
// answer is the variance and not the standard deviation. The scheme gives 2 out
// of 3 for an answer of √8, which is the whole trap, so the last step says
// which is which.
//
// Answer-first: pick a whole mean and deviations summing to zero, then keep
// only those whose squared deviations divide by four, since five values give
// n - 1 = 4.

function stdevFindA(): Q {
  for (let tries = 0; tries < 600; tries++) {
    const mean = getRandomInt(3, 9);
    const devs: number[] = [];
    for (let i = 0; i < 4; i++) devs.push(getRandomInt(-3, 3));
    devs.push(-devs.reduce((a, b) => a + b, 0));
    const vals = devs.map(d => mean + d);
    if (vals.some(v => v < 1 || v > 20)) continue;
    if (new Set(vals).size < 2) continue;               // five equal values give a = 0
    const ssq = devs.reduce((a, d) => a + d * d, 0);
    if (ssq % 4 !== 0) continue;
    const a = ssq / 4;
    // a must not be a perfect square, or the standard deviation is a whole
    // number and no paper would write it as a root.
    if (a < 2 || a > 40 || Number.isInteger(Math.sqrt(a))) continue;

    const listed = [...vals].sort((x, y) => x - y);
    const sum = listed.reduce((x, y) => x + y, 0);
    return {
      subTopic: 'Finding the Variance from a Surd',
      difficulty: 'exam',
      variationId: 'data.sd-find-a',
      questionLines: [
        `The standard deviation of ${listed.join(',&nbsp; ')} is equal to $\\sqrt{a}$.`,
        'Find the value of $a$.',
      ],
      boardQuestionLines: [`Standard deviation of ${listed.join(', ')} is $\\sqrt{a}$. Find $a$.`],
      solutionSteps: [
        `<strong>1.</strong> Find the mean, then the squared difference from it for each value:<br><br>$\\overline{x} = \\frac{${sum}}{5} = ${mean}$, and the squared differences are $${listed.map(v => `${(v - mean) ** 2}`).join(', ')}$, adding to $${ssq}$`,
        `<strong>2.</strong> The standard deviation is $\\sqrt{\\frac{\\sum(x - \\overline{x})^{2}}{n - 1}}$, and here it is $\\sqrt{a}$. So $a$ is the whole of what sits under the root:<br><br>$a = \\frac{${ssq}}{5 - 1}$`,
        `<strong>3.</strong> Work that out. $a$ is the number <em>under</em> the root, not the standard deviation itself:<br><br>$a = ${a}$`,
      ],
      // 2015 P1 Q5: •¹ the mean and the squared differences, •² substitute into
      // the formula for a, •³ calculate a. The scheme awards 2/3 for √a.
      stepMarks: [1, 1, 1],
      finalAnswer: `$a = ${a}$`,
    };
  }
  throw new Error('data.sd-find-a: no valid question found');
}

export const DATA_GENERATORS: Record<string, Gen> = {
  // Both statistics are reachable from the topic; each carries its own id, so
  // `variationsBasedOn` can send a paper to the one that asks what it asks.
  // Taught: the id names which statistic is asked for, so read it rather
  // than draw it. A topic sheet names none and keeps the even toss.
  'Quartiles and Interquartile Range': (wanted) => quartilesOnly(
    wanted !== undefined ? wanted === 'data.quartiles-semi' : getRandomInt(0, 1) === 0),
  'Comparing Median and Interquartile Range': (wanted, asked) => medianCompare(
    wanted !== undefined ? wanted === 'data.median-siqr-compare' : getRandomInt(0, 1) === 0, asked),
  'Mean and Standard Deviation': meanStdev,
  'Comparing Mean and Standard Deviation': meanStdevCompare,
  'Judging Consistency from the Standard Deviation': meanStdevConsistency,
  'Standard Deviation in Surd Form': stdevSurd,
  'Finding the Variance from a Surd': stdevFindA,
};
