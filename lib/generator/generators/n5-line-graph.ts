import { GeneratedQuestion } from './types';

/** "a = b", or just "a" when the simplification changed nothing. */
const orSame = (raw: string, simplified: string): string =>
  raw === simplified ? raw : `${raw} = ${simplified}`;

import { getRandomInt, gcd } from './utils';
import { sketchAxes, type SketchAxesSpec } from '../diagrams/shapes/sketch-axes';
import { renderScene } from '../diagrams/render';
import { verifyFigure } from '../diagrams/verify';

/**
 * The equation of a line read off a graph — six paper questions.
 *
 * Five of them are the same question with different pictures, and the
 * markschemes say so: 2014 P1 Q6, 2016 P1 Q5, 2018 P1 Q7, 2024 P1 Q9 and
 * 2026 P1 Q6 are each headed "Equation of a line, then evaluate" and each pays
 * the same four marks — the gradient, substituting it with a point, stating the
 * equation **in the question's own letters and in simplest form**, then one
 * mark for putting a value through it.
 *
 * So they are one variation. What differs is the story and whether a cloud of
 * points is drawn: four are lines of best fit through a scatter, and the taxi
 * fare is an exact relationship with no scatter about it. That is a property of
 * the context here rather than a separate shape, because nothing else about the
 * question changes.
 *
 * **Two of the eight in this group are not here, and the reason matters.**
 * 2019 P1 Q6 and 2023 P1 Q7 name no points in their prose, so a pupil has to
 * read two off the graph — and their figures are accordingly *gridded*, with
 * numbered axes and gridlines, which `sketch-axes.ts` deliberately does not
 * draw. They wait for that primitive rather than being faked on axes with no
 * scale, which would make them unanswerable.
 *
 * Two things the schemes are strict about, and the working respects both:
 *
 *   2018 P1 Q7   "•³ is not available where the calculated gradient is an
 *                integer or a decimal approximation" — so a fractional gradient
 *                stays a fraction all the way to the answer
 *   2018 P1 Q7   part (b) does not accept 9.5 for £9.50
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
type Q = Omit<GeneratedQuestion, 'topic'>;

interface LineContext {
  /** The opening sentence or two. */
  story: string;
  /** A scatter of readings, or an exact relationship with no spread. */
  scatter: boolean;
  /** The horizontal quantity: its letter and the caption along its axis. */
  x: { letter: string; caption: string };
  y: { letter: string; caption: string };
  /** Money answers are printed to two places, which one scheme insists on. */
  money?: boolean;
  /**
   * What a marked point *is*, as a whole sentence.
   *
   * The papers name the thing rather than the reading: "Point A represents a
   * sandwich which has 5 grams of fat and 200 calories", "a 3 month old calf
   * which weighs 100 kilograms", "a journey of 8 miles which costs £14". A
   * generic "a reading where the amount of fat is 5 grams" is not the same
   * sentence and does not read like an exam, so each context writes its own.
   *
   * **Name x before y**, as the papers do in every one of the five. Eleven of
   * these did and the sunflower did not — "which is 183 centimetres tall after
   * 12 weeks" — and the answer check, which reads the pair out of the sentence,
   * duly reported that the line missed its own marked point at x = 63.
   */
  point: (letter: string, x: string, y: string) => string;
  /**
   * Part (b), also as a whole sentence.
   *
   * "Estimate the weight of a calf 12 months old" is a sentence; "estimate the
   * weight when the age is 12 months" is a template with the nouns slotted in,
   * and it shows. One draw of the first version asked for the monthly bill
   * "when the minutes used is 2 hundreds of minutes".
   */
  estimate: (x: string) => string;
  /** Roughly where the two marked points sit, in the x quantity. */
  band: [number, number];
  /** Roughly where the y quantity sits at the left of that band. */
  base: [number, number];
  /** How steep, as a range for the gradient. Negative for a falling line. */
  slope: [number, number];
  /**
   * A ceiling the y quantity cannot pass, where the world imposes one.
   *
   * Only the exam-marks context has one, and it needs it: with a gradient of 1
   * and an intercept up to 40, a pupil scoring 84 in the prelim was reported as
   * scoring 106 in the final.
   */
  cap?: number;
}

const CONTEXTS: LineContext[] = [
  { story: 'A cafe lists the nutrition of the wraps on its menu. The graph shows the relationship between the amount of fat, $F$ grams, and the number of calories, $C$, in each wrap.',
    scatter: true,
    x: { letter: 'F', caption: 'Fat (grams)' },
    y: { letter: 'C', caption: 'Calories' },
    point: (l, x, y) => `Point $${l}$ represents a wrap which has ${x} grams of fat and ${y} calories.`,
    estimate: x => `A new wrap contains ${x} grams of fat. Estimate the number of calories it contains.`,
    band: [4, 30], base: [140, 260], slope: [8, 20] },
  { story: 'A stud farm records the weight of some of its foals. The scattergraph shows the relationship between the age, $A$ months, and the weight, $W$ kilograms, of the foals.',
    scatter: true,
    x: { letter: 'A', caption: 'Age (months)' },
    y: { letter: 'W', caption: 'Weight (kilograms)' },
    point: (l, x, y) => `Point $${l}$ represents a foal ${x} months old which weighs ${y} kilograms.`,
    estimate: x => `Estimate the weight of a foal ${x} months old.`,
    band: [2, 16], base: [60, 130], slope: [14, 28] },
  { story: 'In a car rally, competitors start at different times. The scattergraph shows the relationship between the length of time they have been driving, $T$ minutes, and the distance to the finishing line, $D$ kilometres.',
    scatter: true,
    x: { letter: 'T', caption: 'Time (minutes)' },
    y: { letter: 'D', caption: 'Distance (kilometres)' },
    point: (l, x, y) => `Point $${l}$ represents a competitor who has been driving for ${x} minutes and is ${y} kilometres from the finishing line.`,
    estimate: x => `Estimate how far a competitor is from the finishing line after ${x} minutes.`,
    band: [2, 14], base: [24, 40], slope: [-3, -1] },
  { story: 'A teacher records the marks scored by her class in the prelim exam and the final exam. The scattergraph shows the relationship between the prelim mark, $P$, and the final mark, $F$.',
    scatter: true,
    x: { letter: 'P', caption: 'Prelim mark' },
    y: { letter: 'F', caption: 'Final mark' },
    point: (l, x, y) => `Point $${l}$ represents a pupil who scored ${x} in the prelim exam and ${y} in the final exam.`,
    estimate: x => `A pupil scored ${x} marks in the prelim exam. Estimate their mark in the final exam.`,
    band: [20, 76], base: [16, 28], slope: [1, 1], cap: 100 },
  { story: "The cost of a journey with Tom's Taxis depends on the distance travelled. The graph shows the cost, $P$ pounds, of a journey against the distance travelled, $D$ miles.",
    scatter: false, money: true,
    x: { letter: 'D', caption: 'Distance (miles)' },
    y: { letter: 'P', caption: 'Cost (pounds)' },
    point: (l, x, y) => `Point $${l}$ represents a journey of ${x} miles which costs ${y}.`,
    estimate: x => `Calculate the cost of a journey of ${x} miles.`,
    band: [4, 16], base: [2, 8], slope: [1, 3] },
  { story: 'A plumber charges a call-out fee and then an hourly rate. The graph shows the total charge, $C$ pounds, against the time spent on the job, $H$ hours.',
    scatter: false, money: true,
    x: { letter: 'H', caption: 'Time (hours)' },
    y: { letter: 'C', caption: 'Charge (pounds)' },
    point: (l, x, y) => `Point $${l}$ represents a job lasting ${x} hours for which the charge is ${y}.`,
    estimate: x => `Calculate the charge for a job lasting ${x} hours.`,
    band: [2, 12], base: [30, 60], slope: [15, 35] },
  { story: 'A gardener measures the height of a row of sunflowers each week. The scattergraph shows the relationship between the number of weeks, $W$, and the height, $H$ centimetres.',
    scatter: true,
    x: { letter: 'W', caption: 'Weeks' },
    y: { letter: 'H', caption: 'Height (centimetres)' },
    point: (l, x, y) => `Point $${l}$ represents a sunflower which after ${x} weeks is ${y} centimetres tall.`,
    estimate: x => `Estimate the height of a sunflower after ${x} weeks.`,
    band: [2, 14], base: [20, 45], slope: [8, 18] },
  { story: 'A shop records its ice cream sales against the temperature each day. The scattergraph shows the relationship between the temperature, $T$ degrees Celsius, and the number of sales, $S$.',
    scatter: true,
    x: { letter: 'T', caption: 'Temperature (degrees)' },
    y: { letter: 'S', caption: 'Sales' },
    point: (l, x, y) => `Point $${l}$ represents a day when the temperature was ${x} degrees and ${y} ice creams were sold.`,
    estimate: x => `Estimate the number of ice creams sold on a day when the temperature is ${x} degrees.`,
    band: [8, 26], base: [20, 60], slope: [6, 16] },
  { story: 'A courier charges for a parcel by its weight. The graph shows the delivery charge, $C$ pounds, against the weight of the parcel, $W$ kilograms.',
    scatter: false, money: true,
    x: { letter: 'W', caption: 'Weight (kilograms)' },
    y: { letter: 'C', caption: 'Charge (pounds)' },
    point: (l, x, y) => `Point $${l}$ represents a parcel weighing ${x} kilograms which costs ${y} to deliver.`,
    estimate: x => `Calculate the cost of delivering a parcel weighing ${x} kilograms.`,
    band: [2, 14], base: [3, 8], slope: [1, 3] },
  { story: 'A running club records how far each member trains in a week and their time in a race. The scattergraph shows the relationship between the distance trained, $D$ kilometres, and the race time, $R$ minutes.',
    scatter: true,
    x: { letter: 'D', caption: 'Distance trained (kilometres)' },
    y: { letter: 'R', caption: 'Race time (minutes)' },
    point: (l, x, y) => `Point $${l}$ represents a runner who trains ${x} kilometres a week and races in ${y} minutes.`,
    estimate: x => `Estimate the race time of a runner who trains ${x} kilometres a week.`,
    band: [4, 30], base: [70, 95], slope: [-2, -1] },
  { story: 'A hire company charges a fixed fee plus a daily rate for a van. The graph shows the total cost, $C$ pounds, against the number of days, $N$.',
    scatter: false, money: true,
    x: { letter: 'N', caption: 'Days' },
    y: { letter: 'C', caption: 'Cost (pounds)' },
    point: (l, x, y) => `Point $${l}$ represents a hire of ${x} days which costs ${y}.`,
    estimate: x => `Calculate the cost of hiring the van for ${x} days.`,
    band: [2, 14], base: [20, 45], slope: [12, 30] },
  { story: 'A nursery measures the height of its saplings against their age. The scattergraph shows the relationship between the age, $A$ years, and the height, $H$ centimetres.',
    scatter: true,
    x: { letter: 'A', caption: 'Age (years)' },
    y: { letter: 'H', caption: 'Height (centimetres)' },
    point: (l, x, y) => `Point $${l}$ represents a sapling ${x} years old which is ${y} centimetres tall.`,
    estimate: x => `Estimate the height of a sapling ${x} years old.`,
    band: [1, 12], base: [30, 70], slope: [15, 30] },
];

/** A gradient as the answer should print it — 3/2 stays a fraction. */
const slopeTex = (p: number, q: number): string =>
  q === 1 ? `${p}` : `${p < 0 ? '-' : ''}\\frac{${Math.abs(p)}}{${q}}`;

/** m x + c, with the coefficient written as the papers write it. */
function equation(yL: string, xL: string, p: number, q: number, c: number): string {
  const slope = q === 1
    ? (p === 1 ? xL : p === -1 ? `-${xL}` : `${p}${xL}`)
    : `${slopeTex(p, q)}${xL}`;
  if (c === 0) return `${yL} = ${slope}`;
  return `${yL} = ${slope} ${c < 0 ? '-' : '+'} ${Math.abs(c)}`;
}

const money = (v: number) => v.toFixed(2);

/**
 * A number as it should appear after a minus or a times sign.
 *
 * "-15 - -3" is not something any paper prints, and it turned up in the very
 * first draw of both variations here - once in the gradient fraction and once
 * in solving for c. A negative gets brackets round it.
 */
const br = (n: number): string => (n < 0 ? `(${n})` : `${n}`);

/**
 * A cloud of readings sitting about the line.
 *
 * Spread as a fraction of the y-range rather than an absolute amount, so a
 * scatter of calories and a scatter of temperatures both look like scatters.
 * The two named points are drawn separately and are exactly on the line, which
 * is what the question depends on.
 */
function cloudAbout(
  m: number, c: number, xLo: number, xHi: number, spread: number,
): { x: number; y: number }[] {
  const n = getRandomInt(7, 10);
  // Offsets that straddle: half the points below the line and half above,
  // shuffled. Drawing each one independently, about one scatter in a hundred
  // came out with every point on the same side of its own line of best fit,
  // which is visibly not a line of best fit at all — the answer check caught
  // six of those in fifteen hundred.
  const signs: number[] = Array.from({ length: n }, (_, i) => (i % 2 ? 1 : -1));
  for (let i = signs.length - 1; i > 0; i--) {
    const j = getRandomInt(0, i);
    [signs[i], signs[j]] = [signs[j], signs[i]];
  }
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const x = xLo + (xHi - xLo) * (i + 0.5 + (getRandomInt(-25, 25) / 100)) / n;
    const off = signs[i] * (getRandomInt(25, 100) / 100) * spread;
    out.push({ x, y: m * x + c + off });
  }
  return out;
}

// ── the same four marks, read off a ruled grid — 2019 P1 Q6, 2023 P1 Q7 ──
//
// **Its own id, though the marks and the route match `straight-line.best-fit`
// exactly.** The five papers behind that one print their two points as
// sentences — "Point A represents a sandwich which has 5 grams of fat and 200
// calories" — and can be answered with the picture covered up. These two name
// no points at all, so the pupil has to read them off the ruling, and that is a
// different thing to be able to do. `basedOn` answers "more like this one", and
// anyone asking for more like 2019 P1 Q6 must not be handed one with the
// coordinates written out.
//
// Both schemes are strict about *which* points: 2019's says "•¹ is not
// available for using points other than (1·5, 14) and (3·5, 8)" and 2023's
// names three. So the line has to pass through grid intersections and the
// working has to use them.

/**
 * Ruling spacings that put between five and twelve lines across a span.
 *
 * The papers rule finely enough to read a value off and coarsely enough to
 * count: 2019 P1 Q6 has ten columns and eight rows, 2023 P1 Q7 six of each.
 * Only 1, 2, 2.5 and 5 times a power of ten, because those are the only
 * spacings anybody numbers an axis with.
 */
function rulings(span: number): number[] {
  const out: number[] = [];
  for (let k = -2; k <= 6; k++) {
    for (const b of [1, 2, 2.5, 5]) {
      const s = b * Math.pow(10, k);
      const n = span / s;
      if (n >= 5 && n <= 12) out.push(s);
    }
  }
  return out;
}

/**
 * **Answer-first, and twice over.**
 *
 * The first version chose the two points the way the ungridded variation does
 * and then looked for a ruling they both landed on. Two per cent of draws
 * survived: the greatest common divisor of two arbitrary readings is usually 1,
 * and a grid ruled every 1 unit up to 300 calories is not a grid.
 *
 * The second chose the grid first and placed the points on it freely — but then
 * the gradient is whatever those points happen to give, and it landed inside
 * the context's plausible range about a quarter of the time. A calf gaining
 * 3 kg a month is a different question from one gaining 22.
 *
 * So both are chosen: the ruling, then a gradient expressed **in grid steps** —
 * `a` rows for every `b` columns — which is exactly what makes a line readable
 * off squared paper, and is how a pupil would take it. Every point on it is
 * then on an intersection by construction, and the gradient is in range because
 * it was picked to be.
 */
function bestFitOnGridQuestion(): Q | null {
  // Both papers are scattergraphs, and a ruling under an exact relationship —
  // a taxi fare — would invite reading the fare straight off the paper instead
  // of from the equation the question asks for.
  const ctx = pick(CONTEXTS.filter(c => c.scatter));

  const xSteps = rulings(ctx.band[1] * 1.2);
  const reach = (ctx.base[0] + ctx.base[1]) / 2
    + Math.abs((ctx.slope[0] + ctx.slope[1]) / 2) * ctx.band[1];
  const ySteps = rulings(reach * 1.2);
  if (!xSteps.length || !ySteps.length) return null;
  const gx = pick(xSteps), gy = pick(ySteps);

  // The gradient as `a` rows per `b` columns, kept only if the slope it gives
  // is one the context could plausibly have.
  const [lo, hi] = [Math.min(...ctx.slope), Math.max(...ctx.slope)];
  const options: { a: number; b: number; m: number }[] = [];
  for (let b = 1; b <= 4; b++) {
    for (let a = -12; a <= 12; a++) {
      if (a === 0) continue;
      const m = (a * gy) / (b * gx);
      if (m >= lo && m <= hi) options.push({ a, b, m });
    }
  }
  if (!options.length) return null;
  const { a, b, m } = pick(options);

  // **The intercept is chosen, not derived.** Deriving it from the two points
  // put it below the axis on two draws in five and off a printable value on
  // another two: c = y1 - m*x1 with y1 near the bottom of a rising line is
  // usually negative. Fixing it to a whole number of rows first makes it
  // positive and printable by construction, and every reading on the line a
  // whole number of rows with it.
  const c = Math.max(1, Math.round(getRandomInt(ctx.base[0], ctx.base[1]) / gy)) * gy;

  // Columns a multiple of `b` apart, so the rise between any two of them is a
  // whole number of rows.
  const cols = Math.max(4, Math.round(ctx.band[1] / gx));
  const t = getRandomInt(1, Math.max(1, Math.floor((cols - 1) / b)));
  const i1 = b * getRandomInt(1, Math.max(1, Math.floor((cols - b * t) / b)));
  const x1 = i1 * gx, x2 = (i1 + b * t) * gx;
  const y1 = m * x1 + c, y2 = m * x2 + c;
  if (y1 <= 0 || y2 <= 0) return null;
  if (ctx.cap !== undefined && Math.max(y1, y2, c) > ctx.cap) return null;

  // The gradient as a fraction in lowest terms, taken from the two readings and
  // not from `a` and `b`. Those are the rise and run in *grid steps*, which is
  // the gradient only when the two rulings happen to be the same size: 200
  // pounds up over 8 years across is 25, and a/b there is 1. Printed straight
  // from a/b it answered "h = a + 50" for a line of gradient 25 — plausible,
  // and wrong.
  const SCALE = 100;                       // the rulings are 2dp at worst
  const numI = Math.round((y2 - y1) * SCALE);
  const denI = Math.round((x2 - x1) * SCALE);
  const g = gcd(Math.abs(numI), Math.abs(denI));
  if (!g) return null;
  const [p, q] = [numI / g, denI / g];
  // A National 5 answer is a whole number or a simple fraction, and the 2018
  // scheme refuses the last mark for a gradient turned into a decimal.
  if (q > 3) return null;
  // The denominator was capped here and the numerator was not, so 53/3 and
  // 43/2 went through — 17% of draws sat outside anything the papers set. Their
  // five fractional gradients are 3/2 and 2/3: numerator 3 at the most. All
  // five are **Paper 1**, so part (b) is evaluated by hand, and a gradient is
  // only a simple fraction if it looks like one. 8 keeps 5/2 and 7/3, which are
  // in the same spirit, and drops the ones that are simple only arithmetically.
  if (q > 1 && Math.abs(p) > 8) return null;

  // Part (b) is evaluated, not read, so its x need not sit on a ruling — 2019
  // P1 Q6 asks about 1.1 litres, between two gridlines. Its answer still has to
  // be printable.
  // Never 1: "a sandwich which contains 1 grams of fat" is the fault this
  // topic already had once, and the floor is what stops it.
  const x3 = getRandomInt(2, Math.max(3, Math.round(x2 * 1.2)));
  const y3 = m * x3 + c;
  if (x3 === x1 || x3 === x2 || y3 <= 0) return null;
  if (Math.abs(y3 * 10 - Math.round(y3 * 10)) > 1e-9) return null;
  if (ctx.cap !== undefined && y3 > ctx.cap) return null;

  const spread = Math.abs(m) * (x2 - x1) * 0.22;
  const xHi = Math.max(x2 * 1.25, x3 * 1.15);
  const cloud = cloudAbout(m, c, Math.max(gx, x1 * 0.5), xHi, spread);
  // **The ceiling binds the scatter, not just the answers.** Checked only
  // against y1, y2 and y3, it let the cloud through: a gridded prelim-against-
  // final scattergraph came out with dots at 120 marks out of 100, and the axis
  // numbered up to 140 to hold them. It is the same fault as the pupil who
  // scored 106, one layer further out.
  // Read into a const: TypeScript will not narrow an optional property
  // across a closure boundary, and `.some()` is one. The four guards that
  // compare `ctx.cap` directly narrow fine and are left as they are.
  const cloudCap = ctx.cap;
  if (cloudCap !== undefined && cloud.some(d => d.y > cloudCap)) return null;
  const yTop = Math.max(y1, y2, c, ...cloud.map(d => d.y)) * 1.08;

  const xMax = Math.ceil(xHi / gx) * gx;
  const yMax = Math.ceil(yTop / gy) * gy;
  if (xMax / gx > 13 || yMax / gy > 13) return null;
  if (xMax / gx < 5 || yMax / gy < 5) return null;
  if (x3 > xMax || y3 > yMax) return null;

  // Numbered every ruling, or every second where that would crowd the axis.
  const ticksOf = (max: number, step: number) => {
    const every = max / step <= 7 ? step : step * 2;
    const out: number[] = [];
    for (let v = 0; v <= max + 1e-9; v += every) out.push(Number(v.toFixed(6)));
    return out;
  };

  const eq = equation(ctx.y.letter, ctx.x.letter, p, q, c);
  const substituted = q === 1 ? `${m} \\times ${x3}` : `\\frac{${p}}{${q}} \\times ${x3}`;
  const prose = [
    ctx.story,
    '',
    'A line of best fit has been drawn.',
    '',
    `<b>(a)</b>&nbsp;&nbsp;Find the equation of the line of best fit in terms of $${ctx.y.letter}$ and $${ctx.x.letter}$. Give the equation in its simplest form.`,
    `<b>(b)</b>&nbsp;&nbsp;Use your answer to part (a). ${ctx.estimate(`${x3}`)}`,
  ];
  const steps = [
    `<strong>1. (a)</strong> Read two points off the line where it crosses the grid — $(${x1}, ${y1})$ and $(${x2}, ${y2})$ — then take the change up over the change across:`
    + `<br><br>$m = \\frac{${y2} - ${br(y1)}}{${x2} - ${br(x1)}} = ${orSame(`\\frac{${y2 - y1}}{${x2 - x1}}`, slopeTex(p, q))}$`,
    `<strong>2. (a)</strong> Put that gradient and one of those points into $y = mx + c$:<br><br>$${y1} = ${slopeTex(p, q)} \\times ${br(x1)} + c$, so $${y1} = ${m * x1} + c$`,
    `<strong>3. (a)</strong> Solve for $c$ and write the equation in the question's own letters:<br><br>$c = ${y1} - ${br(m * x1)} = ${c}$, giving $${eq}$`,
    `<strong>4. (b)</strong> Put $${ctx.x.letter} = ${x3}$ into that equation:<br><br>$${ctx.y.letter} = ${substituted} ${c < 0 ? '-' : '+'} ${Math.abs(c)} = ${y3}$`,
  ];

  const spec: SketchAxesSpec = {
    view: { xMin: -xMax * 0.08, xMax, yMin: -yMax * 0.08, yMax },
    plot: { kind: 'line', m, c },
    // Across the readings, not across the window. Drawn to the window edge the
    // line ran left of the y-axis into negative prelim marks, which is not a
    // thing a line of best fit does; both papers stop theirs within the data.
    domain: [0, xMax],
    cloud,
    grid: { x: gx, y: gy },
    ticks: { x: ticksOf(xMax, gx), y: ticksOf(yMax, gy) },
    axisNames: { x: ctx.x.letter, y: ctx.y.letter },
    axisTitles: { x: ctx.x.caption, y: ctx.y.caption },
  };
  const fig = sketchAxes(spec);
  if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) return null;

  return {
    subTopic: 'A Line of Best Fit on a Grid',
    difficulty: 'exam',
    variationId: 'straight-line.best-fit-grid',
    questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(2)],
    boardQuestionLines: [
      `A line of best fit through (${x1}, ${y1}) and (${x2}, ${y2}). Find its equation, then its value at ${x3}.`,
    ],
    solutionSteps: steps,
    // 3 + 1 in both papers, the same four marks as the ungridded five.
    stepMarks: [1, 1, 1, 1],
    finalAnswer: `(a) $${eq}$<br>(b) ${y3}`,
    figure: fig,
  };
}

// ── the equation of a line of best fit, then an estimate ─────────────────

export function bestFitQuestion(): Q | null {
  const ctx = pick(CONTEXTS);

  // The gradient, as a fraction in lowest terms. Mostly whole, because most of
  // the papers are — but 2018 is 3/2 and 2026 is 2/3, and the 2018 scheme
  // refuses the last mark for a gradient turned into a decimal, so the
  // fractional case has to be generated and carried as a fraction.
  const q = pick([1, 1, 1, 2, 3]);
  const [lo, hi] = ctx.slope;
  const p = getRandomInt(Math.min(lo, hi) * q, Math.max(lo, hi) * q);
  if (p === 0 || gcd(Math.abs(p), q) !== 1) return null;
  // A fractional gradient only where the papers put one: at a small magnitude.
  //
  // `p` is scaled by `q` so that `p/q` lands in the context's slope band — and
  // a band reaching into the twenties then produces 70/3 and 31/2. 17% of draws
  // were outside anything the exam sets. Both fractional gradients in the five
  // papers are 3/2 and 2/3, and all five are **Paper 1**: the pupil evaluates
  // this by hand in part (b), and a gradient is only a simple fraction if it
  // looks like one. 8 keeps 5/2 and 7/3, in the same spirit; it drops the ones
  // that are simple only in the arithmetic sense.
  if (q > 1 && Math.abs(p) > 8) return null;
  const m = p / q;

  // Two x values in the context's band, both multiples of q so the marked
  // points land on whole numbers as every paper's do — and **well apart**. The
  // first version stepped 2 to 5 units from the bottom of the band whatever the
  // band was, so a scatter of sandwiches spanning 4 to 30 grams had both its
  // marked points at 4 and 6, huddled at the left with the cloud stretching
  // away from them. The papers put A and B across the graph: 5 and 25 grams,
  // 3 and 15 months, 30 and 90 marks.
  const span = ctx.band[1] - ctx.band[0];
  const x1 = Math.ceil((ctx.band[0] + span * 0.05) / q) * q;
  const step = Math.max(q, Math.round(span * (getRandomInt(45, 70) / 100) / q) * q);
  const x2 = x1 + step;
  if (x2 > ctx.band[1]) return null;
  const c = getRandomInt(ctx.base[0], ctx.base[1]);
  const y1 = m * x1 + c, y2 = m * x2 + c;
  if (!Number.isInteger(y1) || !Number.isInteger(y2)) return null;
  if (y1 <= 0 || y2 <= 0) return null;
  if (ctx.cap !== undefined && Math.max(y1, y2) > ctx.cap) return null;

  // the value to put through the equation
  // Somewhere sensible to read off: inside the plotted range, and never 1,
  // which would have the question ask about "1 grams of fat".
  const x3 = ctx.money
    ? getRandomInt(2, x2 + Math.round(step * 0.3))   // money may land on a half
    : Math.round(getRandomInt(2, x2 + Math.round(step * 0.3)) / q) * q;
  const y3 = m * x3 + c;
  if (x3 < 2 || x3 === x1 || x3 === x2 || y3 <= 0) return null;
  if (ctx.cap !== undefined && y3 > ctx.cap) return null;
  if (!ctx.money && !Number.isInteger(y3)) return null;
  if (ctx.money && !Number.isInteger(y3 * 2)) return null;

  const [A, B] = ['A', 'B'];
  const spread = Math.abs(m) * (x2 - x1) * 0.22;
  const xHi = x2 + (x2 - x1) * 0.45;
  const cloud = ctx.scatter ? cloudAbout(m, c, Math.max(0.5, x1 * 0.6), xHi, spread) : undefined;
  // The ceiling binds the scatter as well as the answers — see the gridded
  // variation, where dots at 120 marks out of 100 were what exposed it.
  // Read into a const: TypeScript will not narrow an optional property
  // across a closure boundary, and `.some()` is one. The four guards that
  // compare `ctx.cap` directly narrow fine and are left as they are.
  const cloudCap = ctx.cap;
  if (cloudCap !== undefined && (cloud ?? []).some(d => d.y > cloudCap)) return null;
  const ys = [y1, y2, c, ...(cloud ?? []).map(d => d.y)];
  const yTop = Math.max(...ys) * 1.12;

  const value = (v: number) => (ctx.money ? `&pound;${money(v)}` : `${v}`);
  const prose = [
    ctx.story,
    '',
    // Only a scatter has a line of *best fit*. A taxi fare against distance is
    // an exact relationship, and calling its graph a line of best fit - which
    // the first version did, for four of the twelve contexts - says the fares
    // are approximate.
    ctx.scatter ? 'A line of best fit has been drawn.' : '',
    ctx.point(A, `${x1}`, value(y1)),
    ctx.point(B, `${x2}`, value(y2)),
    '',
    `<b>(a)</b>&nbsp;&nbsp;Find the equation of the ${ctx.scatter ? 'line of best fit' : 'line'} in terms of $${ctx.x.letter}$ and $${ctx.y.letter}$. Give the equation in its simplest form.`,
    `<b>(b)</b>&nbsp;&nbsp;Use your answer to part (a). ${ctx.estimate(`${x3}`)}`,
  ];

  const eq = equation(ctx.y.letter, ctx.x.letter, p, q, c);
  const substituted = q === 1
    ? `${m} \\times ${x3}`
    : `\\frac{${p}}{${q}} \\times ${x3}`;
  const steps = [
    `<strong>1. (a)</strong> The gradient is the change up over the change across, taken between the two marked points:<br><br>$m = \\frac{${y2} - ${br(y1)}}{${x2} - ${br(x1)}} = ${orSame(`\\frac{${y2 - y1}}{${x2 - x1}}`, slopeTex(p, q))}$`,
    `<strong>2. (a)</strong> Put that gradient and one of the points into $y = mx + c$, using $${A}$:<br><br>$${y1} = ${slopeTex(p, q)} \\times ${br(x1)} + c$, so $${y1} = ${m * x1} + c$`,
    `<strong>3. (a)</strong> Solve for $c$ and write the equation in the question's own letters:<br><br>$c = ${y1} - ${br(m * x1)} = ${c}$, giving $${eq}$`,
    `<strong>4. (b)</strong> Put $${ctx.x.letter} = ${x3}$ into that equation:<br><br>$${ctx.y.letter} = ${substituted} ${c < 0 ? '-' : '+'} ${Math.abs(c)} = ${ctx.money ? money(y3) : y3}$, giving ${value(y3)}`,
  ];

  const spec: SketchAxesSpec = {
    view: { xMin: -xHi * 0.07, xMax: xHi, yMin: -yTop * 0.07, yMax: yTop },
    plot: { kind: 'line', m, c },
    points: [
      { x: x1, y: y1, text: A, side: 'below' },
      { x: x2, y: y2, text: B, side: 'below' },
    ],
    cloud,
    axisNames: { x: ctx.x.letter, y: ctx.y.letter },
    axisTitles: { x: ctx.x.caption, y: ctx.y.caption },
  };
  const fig = sketchAxes(spec);
  if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) return null;

  return {
    subTopic: 'The Equation of a Line of Best Fit',
    difficulty: 'exam',
    variationId: 'straight-line.best-fit',
    questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(2)],
    boardQuestionLines: [
      `A line through (${x1}, ${y1}) and (${x2}, ${y2}). Find its equation in $${ctx.y.letter}$ and $${ctx.x.letter}$, then its value at ${x3}.`,
    ],
    solutionSteps: steps,
    // 3 + 1 in all five papers: •¹ the gradient, •² substitute it with a point,
    // •³ state the equation in the question's letters and in simplest form,
    // then •⁴ evaluate.
    stepMarks: [1, 1, 1, 1],
    finalAnswer: `(a) $${eq}$<br>(b) ${value(y3)}`,
    figure: fig,
  };
}

// ── the equation of a line through two marked points — 2025 P1 Q6 ────────
//
// No story and no scatter: a bare line with its two points lettered and their
// coordinates printed beside them. Three marks rather than four, because
// nothing is evaluated afterwards.

export function lineThroughMarkedPointsQuestion(): Q | null {
  const x1 = getRandomInt(-4, 4);
  const x2 = x1 + getRandomInt(2, 7);
  const q = pick([1, 1, 1, 2]);
  const p = getRandomInt(-4 * q, 4 * q);
  if (p === 0 || gcd(Math.abs(p), q) !== 1) return null;
  if ((x2 - x1) % q !== 0) return null;
  const m = p / q;
  const c = getRandomInt(-6, 14);
  const y1 = m * x1 + c, y2 = m * x2 + c;
  if (!Number.isInteger(y1) || !Number.isInteger(y2)) return null;
  if (Math.abs(y1) > 20 || Math.abs(y2) > 20) return null;
  if (y1 === y2) return null;                    // a horizontal line is a different question

  const eq = equation('y', 'x', p, q, c);
  const prose = [
    'The diagram shows the straight line passing through points $A$ and $B$.',
    '',
    'Find the equation of the line $AB$.',
    'Give the equation in its simplest form.',
  ];
  const steps = [
    `<strong>1.</strong> Take the gradient between the two points:<br><br>$m = \\frac{${y2} - ${br(y1)}}{${x2} - ${br(x1)}} = ${orSame(`\\frac{${y2 - y1}}{${x2 - x1}}`, slopeTex(p, q))}$`,
    `<strong>2.</strong> Put the gradient and one point into $y = mx + c$, using $A$:<br><br>$${y1} = ${slopeTex(p, q)} \\times ${br(x1)} + c$, so $${y1} = ${m * x1} + c$`,
    `<strong>3.</strong> Solve for $c$ and write the equation out:<br><br>$c = ${y1} - ${br(m * x1)} = ${c}$, giving $${eq}$`,
  ];

  const xs = [0, x1, x2], ys = [0, y1, y2];
  const padX = Math.max(1.5, (Math.max(...xs) - Math.min(...xs)) * 0.22);
  const padY = Math.max(2, (Math.max(...ys) - Math.min(...ys)) * 0.22);
  const fig = sketchAxes({
    view: {
      xMin: Math.min(...xs) - padX, xMax: Math.max(...xs) + padX,
      yMin: Math.min(...ys) - padY, yMax: Math.max(...ys) + padY,
    },
    plot: { kind: 'line', m, c },
    points: [
      { x: x1, y: y1, text: `A (${x1}, ${y1})`, side: 'right' },
      { x: x2, y: y2, text: `B (${x2}, ${y2})`, side: 'right' },
    ],
  });
  if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) return null;

  return {
    subTopic: 'The Equation of a Line Through Two Marked Points',
    difficulty: 'exam',
    variationId: 'straight-line.from-marked-points',
    questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(2)],
    boardQuestionLines: [`Find the equation of the line through $A(${x1}, ${y1})$ and $B(${x2}, ${y2})$.`],
    solutionSteps: steps,
    // 2025 P1 Q6: •¹ the gradient, •² substitute it with a point, •³ state it
    stepMarks: [1, 1, 1],
    finalAnswer: `$${eq}$`,
    figure: fig,
  };
}

// ── dispatch ─────────────────────────────────────────────────────────────

const tried = (name: string, make: () => Q | null): (() => Q) => () => {
  for (let i = 0; i < 6000; i++) {
    const made = make();
    if (made) return made;
  }
  throw new Error(`${name}: no valid question found`);
};

export const LINE_GRAPH_GENERATORS: Record<string, () => Q> = {
  'The Equation of a Line of Best Fit': tried('straight-line.best-fit', bestFitQuestion),
  'A Line of Best Fit on a Grid': tried('straight-line.best-fit-grid', bestFitOnGridQuestion),
  'The Equation of a Line Through Two Marked Points':
    tried('straight-line.from-marked-points', lineThroughMarkedPointsQuestion),
};
