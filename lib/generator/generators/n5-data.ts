import { GeneratedQuestion } from './types';
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
const owns = (group: string): string => (/s$/i.test(group) ? `${group}'` : `${group}'s`);

/**
 * The comparison sentences, worded the way the markscheme demands.
 *
 * The possessive is what SQA's own accepted answer uses — "the newspaper
 * readers' ages" — and it is the only phrasing that stays readable across every
 * context. "The numbers of eggs of the second flock" is grammatical and awful.
 */
function comparison(
  ctx: DataContext, mineHigher: boolean, mineWider: boolean,
): string[] {
  const [a, b] = [ctx.groupA, ctx.groupB];
  return [
    `On average, ${owns(mineHigher ? b : a)} ${ctx.quantity} are ${mineHigher ? 'higher' : 'lower'} than ${owns(mineHigher ? a : b)}.`,
    `${owns(mineWider ? b : a)[0].toUpperCase()}${owns(mineWider ? b : a).slice(1)} ${ctx.quantity} are more varied than ${owns(mineWider ? a : b)}.`,
  ];
}

// ── skill: quartiles and the interquartile range ─────────────────────────
//    2017 P1 Q2 (semi-interquartile range), 2025 P1 Q3 (interquartile range)

function quartilesOnly(): Q {
  for (let tries = 0; tries < 300; tries++) {
    const ctx = pick(DATA_CONTEXTS);
    const n = pick([6, 7, 9, 10]);
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
    const semi = getRandomInt(0, 1) === 0;
    if (semi && (iqr / 2) % 0.5 !== 0) continue;        // keep the halving tidy
    if (!Number.isInteger(iqr) && !semi) continue;

    const wanted = semi ? iqr / 2 : iqr;
    const name = semi ? 'semi-interquartile range' : 'interquartile range';

    return {
      subTopic: 'Quartiles and Interquartile Range',
      difficulty: 'skill',
      variationId: 'data.quartiles',
      questionLines: [
        ctx.lead(n),
        row(vals, ctx),
        `Calculate the ${name} of these ${ctx.quantity}.`,
      ],
      boardQuestionLines: [`${name} of ${row(sorted, ctx)}?`],
      // Two marks in both papers: •¹ find the quartiles, •² calculate the range.
      // Ordering the list and locating the median are how the quartiles are
      // found, not marks of their own, so they open the first step.
      solutionSteps: [
        `<strong>1.</strong> Put the ${ctx.quantity} in order, then find the quartiles. The median splits the list${n % 2 ? ' and is not counted in either half' : ''}, and $Q_{1}$ and $Q_{3}$ are the middles of the two halves:<br><br>${row(sorted, ctx)}<br><br>$Q_{1} = ${num(q1)}$, $Q_{2} = ${num(q2)}$, $Q_{3} = ${num(q3)}$`,
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
  throw new Error('data.quartiles: no valid question found');
}

// ── median and IQR, then compare — 2015 P1 Q10, 2019 P1 Q5, ─────────────
//    2023 P1 Q9, 2024 P1 Q5

function medianCompare(): Q {
  for (let tries = 0; tries < 300; tries++) {
    const ctx = pick(DATA_CONTEXTS);
    const n = pick([6, 7, 9, 10]);
    const [lo, hi] = ctx.band;
    if (hi - lo < n + 4) continue;
    const vals: number[] = [];
    while (vals.length < n) vals.push(getRandomInt(lo, hi));
    const sorted = [...vals].sort((a, b) => a - b);
    const { q1, q2, q3 } = quartiles(sorted);
    const iqr = q3 - q1;
    if (!Number.isInteger(iqr) || iqr < 2) continue;
    if (!Number.isInteger(q2)) continue;

    // the second group's figures are stated, as the papers state them
    const higher = getRandomInt(0, 1) === 0;
    const wider = getRandomInt(0, 1) === 0;
    const otherMed = q2 + (higher ? getRandomInt(2, 8) : -getRandomInt(2, 8));
    const otherIqr = wider ? iqr + getRandomInt(2, 6) : Math.max(1, iqr - getRandomInt(1, Math.max(1, iqr - 1)));
    if (otherMed < lo || otherMed > hi || otherIqr === iqr) continue;

    return {
      subTopic: 'Comparing Median and Interquartile Range',
      difficulty: 'exam',
      variationId: 'data.median-iqr-compare',
      questionLines: [
        ctx.lead(n),
        row(vals, ctx),
        `(a) Calculate the median and the interquartile range of these ${ctx.quantity}.`,
        `A sample taken from ${ctx.groupB} has a median of ${show(otherMed, ctx)} and an interquartile range of ${show(otherIqr, ctx)}.`,
        `(b) Make two valid comparisons between the two samples.`,
      ],
      boardQuestionLines: [`Median and IQR of ${row(sorted, ctx)}, then compare with ${show(otherMed, ctx)} and ${show(otherIqr, ctx)}`],
      // Five marks, 3 + 2: •¹ the median, •² the quartiles, •³ the IQR, then
      // •⁴ a valid comparison of the medians and •⁵ of the IQRs. Both parts had
      // been compressed — part (a)'s three marks into two steps and part (b)'s
      // two into one — so a pupil taking hints was handed two marks at a time
      // and the withheld step covered both comparisons at once.
      solutionSteps: [
        `<strong>(a)</strong> Put them in order and find the median:<br><br>${row(sorted, ctx)}<br><br>$Q_{2} = ${num(q2)}$`,
        `<strong>(a)</strong> $Q_{1}$ is the middle of the lower half and $Q_{3}$ the middle of the upper half:<br><br>$Q_{1} = ${num(q1)}$, $Q_{3} = ${num(q3)}$`,
        `<strong>(a)</strong> The interquartile range is $Q_{3} - Q_{1}$:<br><br>$${num(q3)} - ${num(q1)} = ${num(iqr)}$`,
        `<strong>(b)</strong> Compare the averages. The comparison must name <strong>the quantity and the group</strong> — "on average the ${ctx.quantity} are higher" scores nothing without saying whose:<br><br>${comparison(ctx, higher, wider)[0]}`,
        `<strong>(b)</strong> Now compare the spreads, naming the quantity and the group again:<br><br>${comparison(ctx, higher, wider)[1]}`,
      ],
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `(a) median ${show(q2, ctx)}, interquartile range ${show(iqr, ctx)}. (b) ` +
        comparison(ctx, higher, wider).join(' '),
    };
  }
  throw new Error('data.median-iqr-compare: no valid question found');
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

function meanStdevConsistency(): Q {
  for (let tries = 0; tries < 300; tries++) {
    const ctx = pick(DATA_CONTEXTS);
    const n = pick([5, 6, 7]);
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
        `<b>(b)</b>&nbsp;&nbsp;A second sample of ${n} ${ctx.quantity} was recorded later. `
        + `Its mean is ${show(otherMean, ctx)} and its standard deviation is ${otherS}.`,
        `Is the second sample more consistent than the first? Give a reason for your answer.`,
      ],
      boardQuestionLines: [
        `Mean and s.d. of ${row(vals, ctx)}; then is a sample with s.d. ${otherS} more consistent?`,
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
        + `deviation that answers this and not the mean. The second sample's is ${otherS}, `
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
        `A sample taken from ${ctx.groupB} has a mean of ${show(otherMean, ctx)} and a standard deviation of ${otherS}.`,
        `(b) Make two valid comparisons between the two samples.`,
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
      finalAnswer: `(a) mean ${show(mean, ctx)}, standard deviation ${s.toFixed(1)}. (b) ` +
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

export const DATA_GENERATORS: Record<string, () => Q> = {
  'Quartiles and Interquartile Range': quartilesOnly,
  'Comparing Median and Interquartile Range': medianCompare,
  'Mean and Standard Deviation': meanStdev,
  'Comparing Mean and Standard Deviation': meanStdevCompare,
  'Judging Consistency from the Standard Deviation': meanStdevConsistency,
  'Standard Deviation in Surd Form': stdevSurd,
  'Finding the Variance from a Surd': stdevFindA,
};
