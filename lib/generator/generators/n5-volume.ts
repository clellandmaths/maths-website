import { GeneratedQuestion } from './types';
import { getRandomInt } from './utils';
import { toSigFigs } from './n5-rounding';
import { article, withUnit } from './n5-contexts';
import { solidFigure, type SolidSpec } from '../diagrams/shapes/solid';
import { renderScene } from '../diagrams/render';
import { verifyFigure } from '../diagrams/verify';
import { type Element, type Figure, type Pt, pt } from '../diagrams/scene';

/**
 * Volume — the thirteen paper questions, drawn.
 *
 * `n5-measure.ts` already has volume as a *skill*: substitute into a formula
 * stated in words, no picture. That is not what the papers ask. Every one of
 * these gives a picture and most give a solid made of two pieces, and the mark
 * that separates them from the drill is almost always the third one — knowing
 * to add or to subtract:
 *
 *   2018 P2 Q7, 2025 P2 Q2   a sphere                                    3
 *   2015 P2 Q6               a sphere, answered in scientific notation   3+2
 *   2022 P1 Q3               a cone, with pi taken as 3.14               2
 *   2018 P1 Q17              a pyramid, the height wanted from the volume 3
 *   2026 P2 Q6               a sphere, then a cone of the same volume    2+3
 *   2014 P2 Q7               a cone with a hemisphere taken out          5
 *   2016 P2 Q7               a cone with its tip cut off                 5
 *   2017 P2 Q6               a sphere coated in a shell                  5
 *   2019 P2 Q8               a cylinder with a dome on top               5
 *   2022 P2 Q3               a box with a sphere on top                  3
 *   2023 P2 Q9               a pyramid with its tip cut off              4
 *   2024 P2 Q7               a hemisphere set into a box                 4
 *
 * **One variation per paper shape, not per mark total.** Three of the five-mark
 * ones have identical marking instructions — two substitutions, a combining
 * mark, a calculation and a rounding — so they could have been one variation
 * with three pictures. They are not, because `basedOn` is what answers "more
 * questions like this one", and a pupil who asked for more like the coated
 * sweet would have been given a truncated cone. The registry has been wrong
 * that way before and every check passed.
 *
 * **Strategy: input-first with rejection.** The dimensions are picked and the
 * volume falls out, because a volume is a product of three lengths and a pi and
 * there is no answer to work backwards from — the paper's own answers are all
 * rounded. What is rejected is anything undrawable: a solid too tall for its
 * base, a piece that does not fit inside the one it is cut from. `verifyFigure`
 * has the last word on that, so the constraints here only need to make a valid
 * draw likely rather than certain.
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
type Q = Omit<GeneratedQuestion, 'topic'>;

/** A number as the question prints it: no trailing zeros a pupil did not ask for. */
const num = (v: number) => `${Math.round(v * 1000) / 1000}`;

/** Cubic units, the way the answer has to state them for the last mark. */
const cubic = (u: string) => `${u}$^{3}$`;

/** The step that rounds and states the units — the last mark in nine of these. */
const rounded = (n: number, exact: number, sf: number, unit: string): string =>
  `<strong>${n}.</strong> Round to ${sf} significant figures and state the units:` +
  `<br><br>$V = ${toSigFigs(exact, sf)}$ ${cubic(unit)}`;

/**
 * The same three lines every one of these needs, kept together so a variation
 * reads as its maths rather than as its plumbing.
 */
function assemble(
  spec: SolidSpec, subTopic: string, variationId: string,
  prose: string[], board: string, steps: string[], stepMarks: number[],
  finalAnswer: string,
): Q | null {
  const fig = solidFigure(spec);
  if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) return null;
  return {
    subTopic, difficulty: 'exam', variationId,
    questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
    boardQuestionLines: [board],
    solutionSteps: steps, stepMarks, finalAnswer, figure: fig,
  };
}

// ── one round solid ───────────────────────────────────────────────────────

const BALLS = [
  { thing: 'stress ball', made: 'An office supplier sells stress balls in the shape of a sphere', unit: 'centimetres', short: 'cm', band: [5, 12] },
  { thing: 'football', made: 'A shop sells footballs in the shape of a sphere', unit: 'centimetres', short: 'cm', band: [18, 24] },
  { thing: 'marble', made: 'A glass marble is in the shape of a sphere', unit: 'millimetres', short: 'mm', band: [14, 26] },
  { thing: 'gobstopper', made: 'A gobstopper is in the shape of a sphere', unit: 'millimetres', short: 'mm', band: [18, 34] },
  { thing: 'bauble', made: 'A glass bauble is in the shape of a sphere', unit: 'centimetres', short: 'cm', band: [6, 11] },
  { thing: 'ball bearing', made: 'A ball bearing is in the shape of a sphere', unit: 'millimetres', short: 'mm', band: [8, 20] },
  { thing: 'scoop of ice cream', made: 'A scoop of ice cream is in the shape of a sphere', unit: 'centimetres', short: 'cm', band: [4, 8] },
  { thing: 'stone ball', made: 'A stone ball on a gatepost is in the shape of a sphere', unit: 'centimetres', short: 'cm', band: [20, 34] },
  { thing: 'float', made: 'A fishing float is in the shape of a sphere', unit: 'millimetres', short: 'mm', band: [22, 40] },
  { thing: 'melon', made: 'A melon is approximately spherical', unit: 'centimetres', short: 'cm', band: [12, 20] },
];

/** 2018 P2 Q7, 2025 P2 Q2 — substitute, calculate, round. */
function sphere(): Q | null {
  const c = pick(BALLS);
  // a diameter, sometimes to one decimal place as the papers set it
  const d = getRandomInt(c.band[0] * 2, c.band[1] * 2) / (getRandomInt(0, 1) ? 1 : 2) / 2;
  const dia = Math.round(d * 10) / 10;
  const r = dia / 2;
  const sf = pick([2, 3]);
  const exact = 4 / 3 * Math.PI * r ** 3;
  if (Number(toSigFigs(exact, sf)) === 0) return null;

  const prose = [
    `${c.made} with a diameter of ${num(dia)} ${c.unit}.`,
    `Calculate the volume of one ${c.thing}.`,
    `Give your answer correct to ${sf} significant figures.`,
  ];
  const steps = [
    `<strong>1.</strong> The radius is half the diameter, so $r = ${num(r)}$. Substitute into the volume of a sphere:` +
    `<br><br>$V = \\frac{4}{3}\\pi r^{3} = \\frac{4}{3} \\times \\pi \\times ${num(r)}^{3}$`,
    `<strong>2.</strong> Evaluate:<br><br>$V = ${toSigFigs(exact, 6)}\\ldots$`,
    rounded(3, exact, sf, c.short),
  ];
  return assemble({
    stack: [{ kind: 'sphere', r }],
    // Both papers draw the diameter as a double-headed arrow across the ball.
    dims: [{ along: 'width', halfWidth: r, side: 'below', value: dia, text: `${num(dia)} ${c.short}`, arrow: true }],
  }, 'Volume of a Sphere', 'volume.sphere', prose,
    `Sphere, diameter ${num(dia)} ${c.short}. Volume to ${sf} s.f.?`,
    steps, [1, 1, 1], `$${toSigFigs(exact, sf)}$ ${cubic(c.short)}`);
}

/**
 * **Real bodies, real figures.** — 2026-09-25
 *
 * The 2015 P2 sheet measured this building the second volume by dividing the
 * first, so every comparison was fiction: "the volume of the Earth is
 * 2.6 × 10¹³" (24 times the real one), Deimos at 10⁸-10⁹ km³ where it is about
 * 1000, and 26 different volumes for Deimos in 400 draws. The paper's own
 * Earth and Moon never came up. The owner: *"Happy with your assessment but we
 * need to least 20 different questions"*.
 *
 * So each body has its published mean radius. The pupil is given the larger
 * one's radius to 2 s.f., as the paper gives the Earth's 6400; the smaller
 * one's volume is its real volume to 2 s.f., as the paper's Moon 2.2 × 10¹⁰.
 * Only pairs whose two rounded volumes divide to a whole number are asked,
 * because the paper's does (1.1 × 10¹² ÷ 2.2 × 10¹⁰ = 50). Haumea is left out:
 * it is egg-shaped, not approximately spherical.
 */
const BODIES: { first: string; short: string; r: number }[] = [
  { first: 'The Sun', short: 'the Sun', r: 696000 },
  { first: 'Jupiter', short: 'Jupiter', r: 69911 },
  { first: 'Saturn', short: 'Saturn', r: 58232 },
  { first: 'Uranus', short: 'Uranus', r: 25362 },
  { first: 'Neptune', short: 'Neptune', r: 24622 },
  { first: 'The Earth', short: 'the Earth', r: 6371 },
  { first: 'Venus', short: 'Venus', r: 6052 },
  { first: 'Mars', short: 'Mars', r: 3390 },
  { first: "Jupiter's moon Ganymede", short: 'Ganymede', r: 2634 },
  { first: "Saturn's moon Titan", short: 'Titan', r: 2575 },
  { first: 'Mercury', short: 'Mercury', r: 2440 },
  { first: "Jupiter's moon Callisto", short: 'Callisto', r: 2410 },
  { first: "Jupiter's moon Io", short: 'Io', r: 1822 },
  { first: 'The Moon', short: 'the Moon', r: 1737 },
  { first: "Jupiter's moon Europa", short: 'Europa', r: 1561 },
  { first: "Neptune's moon Triton", short: 'Triton', r: 1353 },
  { first: 'The dwarf planet Pluto', short: 'Pluto', r: 1188 },
  { first: 'The dwarf planet Eris', short: 'Eris', r: 1163 },
  { first: "Uranus's moon Titania", short: 'Titania', r: 789 },
  { first: "Saturn's moon Rhea", short: 'Rhea', r: 764 },
  { first: "Uranus's moon Oberon", short: 'Oberon', r: 761 },
  { first: "Saturn's moon Iapetus", short: 'Iapetus', r: 735 },
  { first: 'The dwarf planet Makemake', short: 'Makemake', r: 715 },
  { first: "Pluto's moon Charon", short: 'Charon', r: 606 },
  { first: "Uranus's moon Umbriel", short: 'Umbriel', r: 585 },
  { first: "Uranus's moon Ariel", short: 'Ariel', r: 579 },
  { first: "Saturn's moon Dione", short: 'Dione', r: 561 },
  { first: "Saturn's moon Tethys", short: 'Tethys', r: 531 },
  { first: 'The dwarf planet Ceres', short: 'Ceres', r: 470 },
  { first: 'The asteroid Vesta', short: 'Vesta', r: 263 },
  { first: 'The asteroid Pallas', short: 'Pallas', r: 256 },
  { first: "Saturn's moon Enceladus", short: 'Enceladus', r: 252 },
  { first: "Uranus's moon Miranda", short: 'Miranda', r: 236 },
  { first: 'The asteroid Hygiea', short: 'Hygiea', r: 217 },
  { first: "Saturn's moon Mimas", short: 'Mimas', r: 198 },
];

const sphereVolume = (r: number) => 4 / 3 * Math.PI * r ** 3;

/** Every pair the paper's arithmetic works for: [larger, smaller, stated radius, (a), given (b), times]. */
const SCI_PAIRS = BODIES.flatMap(big => {
  const r = Number(toSigFigs(big.r, 2));
  const shown = Number(toSigFigs(sphereVolume(r), 2));
  return BODIES.filter(s => s.r < big.r).flatMap(small => {
    const other = Number(toSigFigs(sphereVolume(small.r), 2));
    const times = Math.round(shown / other);
    return times >= 2 && times <= 1000 && Math.abs(shown / other - times) < 1e-9
      ? [{ big, small, r, shown, other, times }] : [];
  });
});

/**
 * 2015 P2 Q6 — a sphere's volume in scientific notation, then divided by a
 * smaller body's. See `BODIES` for why every figure is a real one.
 */
function sphereScientific(): Q | null {
  const { big, small, r, shown, other, times } = pick(SCI_PAIRS);
  const c = { unit: 'kilometres', short: 'km' };
  const exact = sphereVolume(r);

  // Always two figures: "7.0 × 10¹³", never "7 × 10¹³", which is one.
  const sci = (v: number) => {
    const e = Math.floor(Math.log10(v) + 1e-12);
    return `${(v / 10 ** e).toFixed(1)} \\times 10^{${e}}`;
  };
  const prose = [
    `${big.first} is approximately spherical with a radius of ${r} ${c.unit}.`,
    `<strong>(a)</strong> Calculate the volume of ${big.short}, giving your answer in scientific notation, correct to 2 significant figures.`,
    // First mention in full ("Saturn's moon Iapetus"), then the short name.
    `<strong>(b)</strong> The approximate volume of ${small.first.replace(/^The /, 'the ')} is $${sci(other)}$ cubic ${c.unit}. Calculate how many times greater the volume of ${big.short} is than the volume of ${small.short}.`,
  ];
  const steps = [
    `<strong>1.</strong> Substitute the radius into the volume of a sphere:` +
    `<br><br>$V = \\frac{4}{3}\\pi r^{3} = \\frac{4}{3} \\times \\pi \\times ${r}^{3}$`,
    `<strong>2.</strong> Evaluate:<br><br>$V = ${toSigFigs(exact, 5)}\\ldots$`,
    `<strong>3.</strong> Write it in scientific notation, correct to 2 significant figures:<br><br>$V = ${sci(shown)}$ ${cubic(c.short)}`,
    `<strong>4.</strong> "How many times greater" is a division:<br><br>$\\frac{${sci(shown)}}{${sci(other)}}$`,
    `<strong>5.</strong> Divide the numbers and subtract the powers:<br><br>$= ${times}$ times greater`,
  ];
  return assemble({
    stack: [{ kind: 'sphere', r: 1 }],
    // No dimension on the figure: the paper's is a picture of the Earth with
    // the radius in the words only. The dashed line this drew floated beside
    // the sphere and measured nothing (`docs/verdicts/volume.md`).
    dims: [],
  }, 'A Volume in Scientific Notation', 'volume.sphere-scientific', prose,
    `Sphere radius ${r} ${c.short}. Volume in scientific notation, 2 s.f.?`,
    steps, [1, 1, 1, 1, 1],
    `(a) $${sci(shown)}$ ${cubic(c.short)} &nbsp;&nbsp; (b) ${times} times`);
}

const CONES = [
  { thing: 'cone', intro: 'The diagram below shows a cone' },
  { thing: 'party hat', intro: 'A party hat is in the shape of a cone' },
  { thing: 'funnel', intro: 'A funnel is in the shape of a cone' },
  { thing: 'sand pile', intro: 'A pile of sand is in the shape of a cone' },
  { thing: 'traffic cone', intro: 'A traffic cone is in the shape of a cone' },
  { thing: 'paper cup', intro: 'A paper cup is in the shape of a cone' },
  { thing: 'megaphone', intro: 'A megaphone is in the shape of a cone' },
  { thing: 'wafer cone', intro: 'An ice cream wafer is in the shape of a cone' },
  { thing: 'grit pile', intro: 'A pile of road grit is in the shape of a cone' },
  { thing: 'sun hat', intro: 'A woven sun hat is in the shape of a cone' },
];

/**
 * 2022 P1 Q3 — a cone with pi taken as 3.14.
 *
 * Non-calculator, so the product has to be one a pupil can do.
 *
 * **A whole number was not enough.** Making `r^2 h / 3` an integer turns the
 * formula into 3.14 times a whole number, which is what this asked for at
 * first - and over 200 draws it still reached `3.14 x 1539 = 4832.46`, with
 * 101 of the 200 answers carrying decimals and one running to 25,120. The
 * paper does not do that. It picks a cone of diameter 20 and height 60, which
 * makes the multiplier exactly 2000, and the whole sum is `3.14 x 2000 = 6280`
 * in one line.
 *
 * So the multiplier is held to a **multiple of 50** - `3.14 x 50 = 157`
 * exactly, so every answer comes out whole, the way the paper's does.
 *
 * **And both measurements are multiples of ten.** The owner, on the 2022 P1
 * sheet: *"Given this is non calculator I would go for multiples of 10 on the
 * diameter and height of the cone."* The diameter already was - the radius has
 * to carry a factor of five for the multiplier to land on fifty - but the
 * height was any multiple of three, and the sheet had drawn a cone 20 by 33.
 *
 * Twelve cone shapes survive, and the arithmetic is why there are only twelve.
 * With `d = 10j` and `h = 10i` the multiplier is `250 j^2 i / 3`, so it is a
 * whole number only when three divides `j^2 i` - either the diameter or the
 * height has to carry the three that the formula divides by. Add a volume held
 * near the paper's own 6280 and that is the whole list:
 *
 *   d=10: h=30,60            d=30: h=20,30,40,50,60
 *   d=20: h=30,60,90,120     d=40: h=30
 *
 * Every multiplier in it is a round 250, 500, 1000, 1500, 2000, 2250, 3000,
 * 3750, 4000 or 4500, so the sum is `3.14 x` a round number in one line -
 * which is the point of the whole constraint. The paper's own 20 by 60 is in
 * there, at 2000.
 *
 * Twelve *numbers*, not twelve questions: `questionKey` keeps the prose, so
 * the ten cones this is set in make 120 distinct questions and `pool` sees
 * them. A pupil pressing Variation will still meet a shape twice before the
 * story repeats, which is the price of the round numbers and worth paying on
 * a non-calculator paper.
 */
function conePi(): Q | null {
  const c = pick(CONES);
  const r = pick([5, 10, 15, 20, 25, 30]);
  const h = getRandomInt(1, 15) * 10;
  if (h < r) return null;                     // a cone flatter than it is wide
  if (h > 12 * r) return null;                // and not a spike: h up to 6 x d
  if ((r * r * h) % 3 !== 0) return null;     // the formula's third must be exact
  const third = r * r * h / 3;
  if (third % 50 !== 0 || third > 5000) return null;
  const exact = 3.14 * third;
  if (Math.round(exact * 100) !== exact * 100) return null;

  const prose = [
    `${c.intro} with diameter ${2 * r} centimetres and height ${h} centimetres.`,
    `Calculate the volume of the ${c.thing}.`,
    `Take $\\pi = 3\\cdot 14$.`,
  ];
  const steps = [
    `<strong>1.</strong> The radius is half the diameter, so $r = ${r}$. Substitute into the volume of a cone:` +
    `<br><br>$V = \\frac{1}{3}\\pi r^{2} h = \\frac{1}{3} \\times 3\\cdot 14 \\times ${r}^{2} \\times ${h}$`,
    `<strong>2.</strong> $\\frac{1}{3} \\times ${r}^{2} \\times ${h} = ${third}$, so:<br><br>$V = 3\\cdot 14 \\times ${third} = ${num(exact)}$ ${cubic('cm')}`,
  ];
  return assemble({
    stack: [{ kind: 'cone', r, h }],
    /**
     * **Arrows, because the paper draws arrows.** 2022 P1 Q3 measures its
     * height with a solid double-headed arrow standing to the right of the
     * cone and its diameter with another under the base. Left to the default
     * these came out as dashed lines with no ends, the height one floating
     * clear to the left with a gap between it and the shape, which reads as
     * two stray dashes rather than two measurements.
     *
     * `arrow` is per-dimension exactly so this can be said one figure at a
     * time - its own comment on `Dim` says the other solids' papers "have not
     * been read yet and each gets looked at when its own question does". This
     * is 2022 P1 Q3's turn; nothing else moves.
     */
    dims: [
      { along: 'width', halfWidth: r, side: 'below', value: 2 * r, text: `${2 * r} cm`, arrow: true },
      { along: 'height', from: 0, to: h, side: 'right', value: h, text: `${h} cm`, arrow: true },
    ],
  }, 'Volume of a Cone', 'volume.cone-approx-pi', prose,
    `Cone, diameter ${2 * r} cm, height ${h} cm. Volume, $\\pi = 3\\cdot 14$?`,
    steps, [1, 1], `$${num(exact)}$ ${cubic('cm')}`);
}

const PYRAMIDS = [
  { thing: 'pyramid', intro: 'A square based pyramid is shown in the diagram below' },
  { thing: 'tent', intro: 'A tent is in the shape of a square based pyramid' },
  { thing: 'roof', intro: 'The roof of a tower is in the shape of a square based pyramid' },
  { thing: 'paperweight', intro: 'A glass paperweight is in the shape of a square based pyramid' },
  { thing: 'monument', intro: 'A stone monument is in the shape of a square based pyramid' },
  { thing: 'gift box', intro: 'A gift box is in the shape of a square based pyramid' },
  { thing: 'sandcastle', intro: 'A sandcastle is built in the shape of a square based pyramid' },
  { thing: 'lantern', intro: 'A garden lantern is in the shape of a square based pyramid' },
  { thing: 'spire', intro: 'The spire of a clock tower is in the shape of a square based pyramid' },
  { thing: 'candle', intro: 'A wax candle is in the shape of a square based pyramid' },
];

/**
 * 2018 P1 Q17 — the height wanted from the volume.
 *
 * Non-calculator, and the marking instructions insist the last mark needs "a
 * division by a number greater than 10", so the base area has to be more than
 * that and the height has to come out tidy. Both are arranged by choosing the
 * height first in halves and keeping only the volumes that land whole.
 */
function pyramidHeight(): Q | null {
  const c = pick(PYRAMIDS);
  const w = getRandomInt(3, 6) * 2;
  const h = getRandomInt(9, 40) / 2;
  const v = w * w * h / 3;
  if (!Number.isInteger(v) || w * w <= 30) return null;

  const prose = [
    `${c.intro}.`,
    `The square base has length ${w} centimetres.`,
    `The volume is ${v} cubic centimetres.`,
    `Calculate the height of the ${c.thing}.`,
  ];
  const steps = [
    `<strong>1.</strong> Substitute what is known into the volume of a pyramid:` +
    `<br><br>$V = \\frac{1}{3}Ah \\Rightarrow \\frac{1}{3} \\times ${w}^{2} \\times h = ${v}$`,
    `<strong>2.</strong> Work out the base area and simplify:<br><br>$\\frac{${w * w}}{3}h = ${v}$, so $${w * w / 3 === Math.round(w * w / 3) ? w * w / 3 : `\\frac{${w * w}}{3}`}h = ${v}$`,
    `<strong>3.</strong> Divide to find the height:<br><br>$h = \\frac{3 \\times ${v}}{${w * w}} = ${num(h)}$ cm`,
  ];
  return assemble({
    stack: [{ kind: 'pyramid', w, h }],
    dims: [{ along: 'width', halfWidth: w / 2, side: 'below', value: w, text: `${w} cm` }],
  }, 'The Height of a Pyramid', 'volume.pyramid-height', prose,
    `Square pyramid, base ${w} cm, volume ${v} cm³. Height?`,
    steps, [1, 1, 1], `$${num(h)}$ cm`);
}

/**
 * 2026 P2 Q6 — a sphere, then a cone built to match it.
 *
 * 2026 has no published marking instructions, so the split of its five marks
 * across the two parts is our reading of the pattern the other years set: a
 * two-mark "substitute and evaluate" for the sphere, and the three-mark
 * "substitute, rearrange, calculate" that 2018 P1 Q17 uses for exactly the
 * same job on a pyramid. Recorded as `marksInferred` so it is corrected rather
 * than trusted when the real scheme appears.
 */
function sphereConeEqual(): Q | null {
  /**
   * **3 to 16, widened 2026-09-20 on the owner's word.**
   *
   * The declared range was 3..12 and the drawn set was far smaller, which is
   * the trap this file has been caught by before: the guard below keeps only
   * `0.585 rc <= r < rc`, so the two ranges never disagreed openly - they
   * just produced **25 distinct questions** over 300 draws. Counting the
   * surviving pairs by hand gives 26, so nothing was being rejected at
   * random; the geometry was the ceiling, not the declaration.
   *
   * Raising both ends lifts it without printing a sphere the exam would not
   * set: 2026 P2 Q6 is radius 5 with a 12 cm base, and a 16 cm radius is
   * still an ordinary classroom number.
   */
  const r = getRandomInt(3, 16);
  const rc = getRandomInt(3, 16);
  if (rc === r) return null;
  const v = 4 / 3 * Math.PI * r ** 3;
  const h = v / (Math.PI * rc * rc / 3);
  // A cone that looks like a cone. Equal volumes put the height at 4r^3/rc^2,
  // so a sphere wider than the cone's base sends it up fast: radius 8 against a
  // base radius of 7 draws 14 across and 41.8 tall, a spike. 2026 P2 Q6 is 12
  // across and 13.9 tall, a shade over twice its base radius.
  if (h < rc * 0.8 || h > rc * 4) return null;

  const prose = [
    `A sphere has radius ${r} centimetres.`,
    `<strong>(a)</strong> Calculate the volume of the sphere.`,
    `A cone has the same volume as the sphere. The base of the cone has diameter ${2 * rc} centimetres.`,
    `<strong>(b)</strong> Calculate the height of the cone.`,
    // **No rounding line.** 2026 P2 Q6's scheme prints 523.59... or 524 for
    // (a) and 13.88... or 14 for (b) - it accepts either without asking.
    // Owner's word on the 2026 locked-year pass, 2026-09-20.
  ];
  const steps = [
    `<strong>1.</strong> Substitute the radius into the volume of a sphere:` +
    `<br><br>$V = \\frac{4}{3}\\pi r^{3} = \\frac{4}{3} \\times \\pi \\times ${r}^{3}$`,
    `<strong>2.</strong> Evaluate:<br><br>$V = ${v.toFixed(1)}$ ${cubic('cm')}`,
    `<strong>3.</strong> The cone has the same volume, and its radius is ${rc}:` +
    `<br><br>$\\frac{1}{3} \\times \\pi \\times ${rc}^{2} \\times h = ${v.toFixed(1)}$`,
    `<strong>4.</strong> Rearrange for the height:<br><br>$h = \\frac{3 \\times ${v.toFixed(1)}}{\\pi \\times ${rc}^{2}}$`,
    `<strong>5.</strong> Evaluate:<br><br>$h = ${h.toFixed(1)}$ cm`,
  ];
  // **Two figures, one per part, as 2026 P2 Q6 prints them.**
  //
  // This drew the cone alone, on the grounds that a scene is one stack and the
  // only place a vertical stack could put the sphere is inside the cone — which
  // would say the two solids are nested when the whole question is that they
  // are separate and equal. True, and the conclusion did not follow: they are
  // two scenes, not one, and the prose has a place for each. As it stood the
  // cone sat directly under "a sphere has radius 7 centimetres" and read as an
  // illustration of the sphere.
  //
  // The paper's ink, both times: the ball carries a dot at its centre and a
  // dashed radius with the measurement on it; the cone carries a double-headed
  // arrow across its base and another up its side labelled "height", which is
  // the unknown and so is a word rather than a number.
  const sphereFig = solidFigure({
    stack: [{ kind: 'sphere', r, radius: `${r} cm` }],
    // The radius is marked on the piece itself, so there is no dimension line.
    dims: [],
  });
  const coneFig = solidFigure({
    stack: [{ kind: 'cone', r: rc, h }],
    dims: [
      { along: 'width', halfWidth: rc, side: 'below', value: 2 * rc,
        text: `${2 * rc} cm`, arrow: true },
      { along: 'height', from: 0, to: h, side: 'left', value: h,
        text: 'height', arrow: true, unknown: true },
    ],
  });
  const text = [...prose, ...steps].join(' ');
  if (verifyFigure(sphereFig, text).length) return null;
  if (verifyFigure(coneFig, text).length) return null;

  return {
    subTopic: 'A Cone Matching a Sphere',
    difficulty: 'exam',
    variationId: 'volume.sphere-cone-equal',
    questionLines: [
      prose[0], renderScene(sphereFig.scene), prose[1],
      prose[2], renderScene(coneFig.scene), prose[3],
    ],
    boardQuestionLines: [
      `Sphere radius ${r}. A cone of base diameter ${2 * rc} has the same volume. Height?`,
    ],
    solutionSteps: steps,
    stepMarks: [1, 1, 1, 1, 1],
    finalAnswer: `(a) $${v.toFixed(1)}$ ${cubic('cm')} &nbsp;&nbsp; (b) $${h.toFixed(1)}$ cm`,
    figure: coneFig,
  };
}

// ── two pieces, added or taken away ───────────────────────────────────────

/**
 * **Each object at its own size.** — 2026-09-25
 *
 * Every context drew a diameter of 6 to 16 cm and a height of up to three
 * times that, so the 2014 P2 sheet measured a 45 cm spinning top, a 44 cm plumb
 * bob and a 42 cm paperweight - 86 of 400 draws over 30 cm tall. The paper's
 * ornament is 8 wide and 15 tall. The owner: *"Yes d them for this question"*,
 * to sizes that fit each object and the paper's figure. `dia` is [lo, hi]
 * in centimetres, and the height follows from it; the paper's own glass
 * ornament is added.
 */
const ORNAMENTS = [
  { thing: 'ornament', inner: 'copper', outer: 'glass', intro: 'An ornament is in the shape of a cone', dia: [6, 10] },
  { thing: 'candle holder', inner: 'granite', outer: 'wax', intro: 'A candle holder is in the shape of a cone', dia: [7, 12] },
  { thing: 'trophy', inner: 'lead', outer: 'resin', intro: 'A trophy is in the shape of a cone', dia: [8, 14] },
  { thing: 'spinning top', inner: 'steel', outer: 'wood', intro: 'A spinning top is in the shape of a cone', dia: [5, 8] },
  { thing: 'paperweight', inner: 'brass', outer: 'acrylic', intro: 'A paperweight is in the shape of a cone', dia: [6, 9] },
  { thing: 'doorstop', inner: 'iron', outer: 'rubber', intro: 'A doorstop is in the shape of a cone', dia: [8, 14] },
  { thing: 'chess piece', inner: 'lead', outer: 'marble', intro: 'A chess piece is in the shape of a cone', dia: [3, 5] },
  { thing: 'buoy', inner: 'concrete', outer: 'plastic', intro: 'A harbour buoy is in the shape of a cone', dia: [50, 90] },
  { thing: 'skittle', inner: 'steel', outer: 'beech', intro: 'A skittle is in the shape of a cone', dia: [6, 9] },
  { thing: 'garden light', inner: 'concrete', outer: 'glass', intro: 'A garden light is in the shape of a cone', dia: [10, 18] },
  { thing: 'plumb bob', inner: 'tungsten', outer: 'brass', intro: 'A plumb bob is in the shape of a cone', dia: [3, 5] },
];

/** 2014 P2 Q7 — a cone with a hemisphere set into its base. */
function coneMinusHemisphere(): Q | null {
  const c = pick(ORNAMENTS);
  const dia = getRandomInt(c.dia[0], c.dia[1]);
  // Height from the width, 1.2 to 2.1 times it: the paper's is 15 on 8, 1.9.
  // Taller than about twice the width, the figure is drawn so narrow that the
  // hemisphere's diameter cannot be written inside it.
  const h = getRandomInt(Math.ceil(dia * 1.2), Math.floor(dia * 2.1));
  // The hemisphere has to fit inside the cone: its radius no more than the
  // distance from the centre of the base to the sloping side. The paper's
  // 3.7 against 4 × 15 / √(4² + 15²) = 3.87 does, at 96% of the room. It is
  // drawn from that room, 85% to 98% of it, rather than as a fixed amount
  // under the base: a squat cone drew the dome straight through its sides,
  // and a fixed gap on a large cone can never fit, which starved the pool to
  // the smallest objects.
  const room = (dia / 2) * h / Math.hypot(dia / 2, h);
  const inner = Math.floor(2 * room * getRandomInt(85, 98) / 100 * 10) / 10;
  if (inner <= dia * 0.6 || inner >= dia || inner / 2 > h * 0.7) return null;
  const sf = 2;
  const cone = Math.PI * (dia / 2) ** 2 * h / 3;
  const hemi = 2 / 3 * Math.PI * (inner / 2) ** 3;
  const exact = cone - hemi;
  if (exact <= 0) return null;

  const prose = [
    `${c.intro} with diameter ${dia} centimetres and height ${h} centimetres.`,
    `The bottom contains a hemisphere made of ${c.inner} with diameter ${num(inner)} centimetres. The rest is made of ${c.outer}.`,
    `Calculate the volume of the ${c.outer} part of the ${c.thing}.`,
    `Give your answer correct to ${sf} significant figures.`,
  ];
  const steps = [
    `<strong>1.</strong> Volume of the cone:<br><br>$\\frac{1}{3} \\times \\pi \\times ${num(dia / 2)}^{2} \\times ${h} = ${cone.toFixed(2)}\\ldots$`,
    `<strong>2.</strong> Volume of the hemisphere, which is half a sphere:` +
    `<br><br>$\\frac{1}{2} \\times \\frac{4}{3} \\times \\pi \\times ${num(inner / 2)}^{3} = ${hemi.toFixed(2)}\\ldots$`,
    `<strong>3.</strong> The ${c.outer} is what is left, so subtract the hemisphere from the cone.`,
    `<strong>4.</strong> Carry out the subtraction:<br><br>$${cone.toFixed(2)}\\ldots - ${hemi.toFixed(2)}\\ldots = ${exact.toFixed(2)}\\ldots$`,
    rounded(5, exact, sf, 'cm'),
  ];
  // Drawn as the paper draws it: the hemisphere seen through the cone, solid
  // and shaded, with its diameter across it; the cone's diameter under the
  // base and its height beside it, both with end marks and the height ruled
  // back to the shape; and the two materials named on leaders.
  const R = dia / 2, ri = inner / 2;
  return assemble({
    stack: [{ kind: 'cone', r: R, h }],
    ghosts: [{ piece: { kind: 'hemisphere', r: ri }, on: 'base', seen: true }],
    dims: [
      { along: 'width', halfWidth: ri, side: 'above', onGhost: 0, arrow: true, value: inner, text: `${num(inner)} cm` },
      { along: 'width', halfWidth: R, side: 'below', rank: 0, arrow: true, value: dia, text: `${dia} cm` },
      { along: 'height', from: 0, to: h, side: 'right', arrow: true, rules: true, value: h, text: `${h} cm` },
      { along: 'leader', at: pt(-R * 0.4, h * 0.6), degrees: 160, text: c.outer },
      { along: 'leader', at: pt(-ri * 0.72, ri * 0.72), degrees: 175, text: c.inner },
    ],
  }, 'A Cone with a Hemisphere Removed', 'volume.cone-minus-hemisphere', prose,
    `Cone ${dia} by ${h}, hemisphere of diameter ${num(inner)} removed. Volume?`,
    steps, [1, 1, 1, 1, 1], `$${toSigFigs(exact, sf)}$ ${cubic('cm')}`);
}

const CARTONS = [
  { thing: 'funnel', intro: 'A funnel is in the shape of a large cone with a small cone removed' },
  { thing: 'plant pot', intro: 'A plant pot is in the shape of a large cone with a small cone removed' },
  { thing: 'lampshade', intro: 'A lampshade is in the shape of a large cone with a small cone removed' },
  { thing: 'bucket', intro: 'A bucket is in the shape of a large cone with a small cone removed' },
  { thing: 'popcorn holder', intro: 'A popcorn holder is in the shape of a large cone with a small cone removed' },
  { thing: 'waste bin', intro: 'A waste bin is in the shape of a large cone with a small cone removed' },
  { thing: 'flower pot', intro: 'A terracotta flower pot is in the shape of a large cone with a small cone removed' },
  { thing: 'coffee filter', intro: 'A coffee filter is in the shape of a large cone with a small cone removed' },
  { thing: 'sieve', intro: 'A kitchen sieve is in the shape of a large cone with a small cone removed' },
  { thing: 'planter', intro: 'A concrete planter is in the shape of a large cone with a small cone removed' },
];

/** 2016 P2 Q7 — a cone with its tip cut off. */
function coneMinusCone(): Q | null {
  const c = pick(CARTONS);
  const bigD = getRandomInt(8, 20) * 2;
  const smallD = getRandomInt(4, bigD / 2 - 1) * 2;
  const bigH = getRandomInt(bigD, bigD * 2);
  const smallH = Math.round(bigH * smallD / bigD * 10) / 10;
  // the tip must be a proper cut of this cone, and both heights printable
  if (smallH * bigD !== bigH * smallD || smallH < 3 || bigH - smallH < 4) return null;
  const sf = 2;
  const big = Math.PI * (bigD / 2) ** 2 * bigH / 3;
  const small = Math.PI * (smallD / 2) ** 2 * smallH / 3;
  const exact = big - small;

  const prose = [
    `${c.intro}.`,
    `The large cone has diameter ${bigD} cm and height ${bigH} cm.`,
    `The small cone has diameter ${smallD} cm and height ${num(smallH)} cm.`,
    `Calculate the volume of the ${c.thing}.`,
    `Give your answer correct to ${sf} significant figures.`,
  ];
  const steps = [
    `<strong>1.</strong> The ${c.thing} is the difference between the two cones, so work out each and subtract.`,
    `<strong>2.</strong> Volume of the large cone:<br><br>$\\frac{1}{3} \\times \\pi \\times ${bigD / 2}^{2} \\times ${bigH} = ${big.toFixed(2)}\\ldots$`,
    `<strong>3.</strong> Volume of the small cone:<br><br>$\\frac{1}{3} \\times \\pi \\times ${smallD / 2}^{2} \\times ${num(smallH)} = ${small.toFixed(2)}\\ldots$`,
    `<strong>4.</strong> Subtract:<br><br>$${big.toFixed(2)}\\ldots - ${small.toFixed(2)}\\ldots = ${exact.toFixed(2)}\\ldots$`,
    rounded(5, exact, sf, 'cm'),
  ];
  const fig = cartonSection(bigD, bigH, smallD, smallH);
  if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) return null;
  return {
    subTopic: 'A Cone with its Tip Removed', difficulty: 'exam', variationId: 'volume.cone-minus-cone',
    questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
    boardQuestionLines: [`Cone ${bigD} by ${bigH}, tip ${smallD} by ${num(smallH)} removed. Volume?`],
    solutionSteps: steps, stepMarks: [1, 1, 1, 1, 1],
    finalAnswer: `$${toSigFigs(exact, sf)}$ ${cubic('cm')}`, figure: fig,
  };
}

/**
 * **2016 P2 Q7's own picture — 2026-09-24.**
 *
 * Counted off the scan: the carton stands POINT DOWN, like a cup. The part
 * that is left is shaded; the removed tip hangs below it in dashes. The 32 cm
 * across the open top is written above its rim, and the 18 cm across the cut is
 * written on the cut circle itself. Both heights are double arrows measured
 * from the tip: 24 cm on the right to the rim, 13·5 cm on the left to the cut.
 *
 * The shared `solidFigure` drew it point-up, measured with dashed lines
 * without ends, and put the small cone's diameter above its tip, where nothing
 * is that wide. The owner, on the 2016 P2 sheet: *"Yes redraw"*. Drawn here
 * rather than in `solid.ts`, which every solid in the course shares, so no
 * other figure can move. A true section of round pieces, so it claims its
 * lengths.
 */
function cartonSection(bigD: number, bigH: number, smallD: number, smallH: number): Figure {
  const [R, H, r, h] = [bigD / 2, bigH, smallD / 2, smallH];
  const TILT = 0.24;
  const arc = (cx: number, cy: number, rx: number, from: number, to: number, n = 48): Pt[] =>
    Array.from({ length: n + 1 }, (_, i) => {
      const a = (from + (to - from) * i / n) * Math.PI / 180;
      return pt(cx + rx * Math.cos(a), cy + rx * TILT * Math.sin(a));
    });
  /** A double-headed arrow from a to b, barbs as decoration. */
  const arrow = (a: Pt, b: Pt, head: number): Element[] => {
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    const u = pt((b.x - a.x) / len, (b.y - a.y) / len), n = pt(-u.y, u.x);
    const out: Element[] = [{ kind: 'segment', from: a, to: b, decoration: true }];
    for (const [tip, s] of [[a, 1], [b, -1]] as [Pt, number][]) {
      const back = pt(tip.x + u.x * head * s, tip.y + u.y * head * s);
      for (const side of [1, -1]) {
        out.push({ kind: 'segment', decoration: true, to: tip,
          from: pt(back.x + n.x * head * 0.42 * side, back.y + n.y * head * 0.42 * side) });
      }
    }
    return out;
  };
  const head = R * 0.08;
  const gap = R * 0.22;
  // The side you see: the near half of the rim down to the near half of the cut.
  const shade: Element = { kind: 'shadedShape', points: [...arc(0, H, R, 180, 360), ...arc(0, h, r, 360, 180)] };
  const [rl, rr] = [pt(-R, H), pt(R, H)];
  const [cl, cr] = [pt(-r, h), pt(r, h)];
  const [hr0, hr1] = [pt(R + gap, 0), pt(R + gap, H)];
  const [hl0, hl1] = [pt(-r - gap, 0), pt(-r - gap, h)];
  const elements: Element[] = [
    shade,
    { kind: 'segment', from: rl, to: cl },
    { kind: 'segment', from: rr, to: cr },
    { kind: 'ellipse', centre: pt(0, H), rx: R, ry: R * TILT },
    { kind: 'ellipse', centre: pt(0, h), rx: r, ry: r * TILT },
    // the tip that was removed
    { kind: 'segment', from: cl, to: pt(0, 0), dashed: true },
    { kind: 'segment', from: cr, to: pt(0, 0), dashed: true },
    // across the open top, the number above the rim
    ...arrow(rl, rr, head),
    { kind: 'label', text: `${bigD} cm`, anchor: pt(0, H + R * TILT), away: pt(0, H) },
    // across the cut, the number just under it
    ...arrow(cl, cr, Math.min(head, r * 0.3)),
    { kind: 'label', text: `${smallD} cm`, anchor: pt(0, h - r * TILT), away: pt(0, h) },
    // the heights, both from the tip
    ...arrow(hr0, hr1, head),
    { kind: 'label', text: `${bigH} cm`, anchor: pt(hr0.x, H / 2), away: pt(0, H / 2) },
    ...arrow(hl0, hl1, Math.min(head, h * 0.2)),
    { kind: 'label', text: `${num(smallH)} cm`, anchor: pt(hl0.x, h / 2), away: pt(0, h / 2) },
  ];
  return {
    scene: { elements },
    claims: [
      { kind: 'length', from: rl, to: rr, value: bigD },
      { kind: 'length', from: cl, to: cr, value: smallD },
      { kind: 'length', from: hr0, to: hr1, value: bigH },
      { kind: 'length', from: hl0, to: hl1, value: smallH },
    ],
  };
}

const SHELLS = [
  { thing: 'bead', coat: 'enamel', core: 'glass', unit: 'millimetres', short: 'mm', band: [16, 30] },
  { thing: 'lozenge', coat: 'a sugar shell', core: 'chocolate', unit: 'millimetres', short: 'mm', band: [14, 26] },
  { thing: 'ball', coat: 'rubber', core: 'cork', unit: 'millimetres', short: 'mm', band: [40, 70] },
  { thing: 'bath bomb', coat: 'a glitter layer', core: 'bath salts', unit: 'centimetres', short: 'cm', band: [5, 9] },
  { thing: 'truffle', coat: 'toffee', core: 'nougat', unit: 'millimetres', short: 'mm', band: [20, 34] },
  { thing: 'bead', coat: 'a glaze', core: 'clay', unit: 'millimetres', short: 'mm', band: [12, 22] },
  { thing: 'golf ball', coat: 'a plastic cover', core: 'rubber', unit: 'millimetres', short: 'mm', band: [40, 44] },
  { thing: 'truffle', coat: 'cocoa powder', core: 'ganache', unit: 'millimetres', short: 'mm', band: [24, 36] },
  { thing: 'planet model', coat: 'a painted crust', core: 'foam', unit: 'centimetres', short: 'cm', band: [10, 18] },
  { thing: 'seed ball', coat: 'compost', core: 'clay', unit: 'centimetres', short: 'cm', band: [4, 8] },
];

/** 2017 P2 Q6 — the shell between two spheres. */
function sphereShell(): Q | null {
  const c = pick(SHELLS);
  const dia = getRandomInt(c.band[0], c.band[1]);
  const t = getRandomInt(2, Math.floor(dia / 5));
  if (t < 1) return null;
  const inner = dia / 2 - t;
  if (inner < dia * 0.25) return null;
  const sf = 3;
  const big = 4 / 3 * Math.PI * (dia / 2) ** 3;
  const small = 4 / 3 * Math.PI * inner ** 3;
  const exact = big - small;

  /**
   * **The article belongs in the first sentence, not the third.** — 2026-09-23
   *
   * This read "evenly with plastic cover … the volume of the a plastic cover"
   * in 201 of 400 draws: the "a" was stripped where English needs it and kept
   * where it does not. A countable coating keeps it on the way in ("evenly
   * with a plastic cover") and becomes "the plastic cover" when asked for; a
   * mass noun takes none and is asked for as "the toffee coating", as the
   * paper's "the chocolate coating". The owner: *"Fix"*.
   */
  const coat = c.coat.startsWith('a ') ? c.coat.replace(/^a /, '') : `${c.coat} coating`;
  const prose = [
    `A spherical ${c.thing} is made by coating a ${c.core} sphere evenly with ${c.coat}.`,
    `The diameter of the ${c.thing} is ${withUnit(dia, c.unit)} and the thickness of the coating is ${withUnit(t, c.unit)}.`,
    `Calculate the volume of the ${coat}.`,
    `Give your answer correct to ${sf} significant figures.`,
  ];
  const steps = [
    `<strong>1.</strong> The coating is the difference between the two spheres, so work out each and subtract.`,
    `<strong>2.</strong> Volume of the outer sphere, radius ${num(dia / 2)}:` +
    `<br><br>$\\frac{4}{3} \\times \\pi \\times ${num(dia / 2)}^{3} = ${big.toFixed(2)}\\ldots$`,
    `<strong>3.</strong> The coating is ${withUnit(t, c.unit)} thick, so the inner radius is $${num(dia / 2)} - ${t} = ${num(inner)}$:` +
    `<br><br>$\\frac{4}{3} \\times \\pi \\times ${num(inner)}^{3} = ${small.toFixed(2)}\\ldots$`,
    `<strong>4.</strong> Subtract:<br><br>$${big.toFixed(2)}\\ldots - ${small.toFixed(2)}\\ldots = ${exact.toFixed(2)}\\ldots$`,
    rounded(5, exact, sf, c.short),
  ];
  const fig = shellSection(dia, t, c.short);
  if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) return null;
  return {
    subTopic: 'The Coating on a Sphere', difficulty: 'exam', variationId: 'volume.sphere-shell',
    questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
    boardQuestionLines: [`Sphere diameter ${dia} ${c.short}, coating ${t} ${c.short} thick. Volume of coating?`],
    solutionSteps: steps, stepMarks: [1, 1, 1, 1, 1],
    finalAnswer: `$${toSigFigs(exact, sf)}$ ${cubic(c.short)}`, figure: fig,
  };
}

/**
 * **The sweet cut in half, as 2017 P2 Q6 draws it.** — 2026-09-23
 *
 * The paper prints a cross-section: two circles with the coating between
 * them shaded, the diameter as an arrow straight across, and the thickness as
 * a short arrow across the ring with its number outside. This drew a
 * three-dimensional sphere with a dashed one inside and a leader to the outer
 * surface, so nothing in the picture showed *which* span the thickness was.
 * The owner: *"make the width of coating clearer like the paper. Perhaps
 * shading but not if it makes the diagram worse"*.
 *
 * Built here rather than in `solid.ts`, which draws every solid in the
 * course: this figure is this question's alone, and nothing else moves.
 */
function shellSection(dia: number, t: number, short: string): Figure {
  const R = dia / 2, r = R - t;
  const ring = (rad: number, from: number, to: number, n = 96): Pt[] =>
    Array.from({ length: n + 1 }, (_, i) => {
      const a = (from + (to - from) * i / n) * Math.PI / 180;
      return pt(rad * Math.cos(a), rad * Math.sin(a));
    });
  // The ring as one keyhole outline: round the outside one way, in along a
  // seam, round the inside the other way. Filled, the hole winds to zero and
  // stays clear, and the seam is never stroked.
  const shade: Element = { kind: 'shadedShape', points: [...ring(R, 0, 360), ...ring(r, 360, 0)] };

  /** A double-headed arrow from a to b, barbs as decoration. */
  const arrow = (a: Pt, b: Pt, head: number): Element[] => {
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    const u = pt((b.x - a.x) / len, (b.y - a.y) / len), n = pt(-u.y, u.x);
    const out: Element[] = [{ kind: 'segment', from: a, to: b, decoration: true }];
    for (const [tip, s] of [[a, 1], [b, -1]] as [Pt, number][]) {
      const back = pt(tip.x + u.x * head * s, tip.y + u.y * head * s);
      for (const side of [1, -1]) {
        out.push({ kind: 'segment', decoration: true, to: tip,
          from: pt(back.x + n.x * head * 0.42 * side, back.y + n.y * head * 0.42 * side) });
      }
    }
    return out;
  };

  // The diameter straight across, its number above the shaft in the hole.
  const [dl, dr] = [pt(-R, 0), pt(R, 0)];
  // The thickness at the paper's angle, up and to the right, number outside.
  const deg = 40 * Math.PI / 180;
  const [ti, to] = [pt(r * Math.cos(deg), r * Math.sin(deg)), pt(R * Math.cos(deg), R * Math.sin(deg))];
  const elements: Element[] = [
    shade,
    { kind: 'circle', centre: pt(0, 0), r: R },
    { kind: 'circle', centre: pt(0, 0), r },
    ...arrow(dl, dr, R * 0.07),
    { kind: 'label', text: `${dia} ${short}`, anchor: pt(0, 0), away: pt(0, -1) },
    ...arrow(ti, to, Math.min(t * 0.3, R * 0.06)),
    { kind: 'label', text: `${t} ${short}`, anchor: to, away: pt(0, 0) },
  ];
  /**
   * **And the whole sweet beside it, so the ring reads as a sphere cut in
   * half.** — 2026-09-24
   *
   * The paper prints a small shaded ball to the right of its cross-section.
   * Without it the two circles are just a ring, and nothing says the solid is
   * a sphere. The owner, on the rebuilt sheet: *"now i would also show a
   * picture of a sphere like original question to ensure candidates know
   * this represents a sphere"*. Smaller than the section, as the paper's is,
   * shaded, with its equator drawn front solid and back dashed so it reads as
   * a ball. It carries no measurement; the section does.
   */
  const rs = R * 0.5;
  const sc = pt(R * 1.95, -R * 0.3);
  elements.push(
    { kind: 'shadedShape', points: ring(rs, 0, 360).map(p => pt(p.x + sc.x, p.y + sc.y)), tone: 1.4 },
    { kind: 'circle', centre: sc, r: rs },
    { kind: 'ellipse', centre: sc, rx: rs, ry: rs * 0.3, from: 180, to: 360 },
    { kind: 'ellipse', centre: sc, rx: rs, ry: rs * 0.3, from: 0, to: 180, dashed: true },
  );
  return {
    // Wider than the section alone, so drawn wider: the ring keeps the size it
    // had and the ball sits in the extra room.
    scene: { elements, target: 400 },
    claims: [
      { kind: 'length', from: dl, to: dr, value: dia },
      { kind: 'length', from: ti, to, value: t },
    ],
  };
}

const BOLLARDS = [
  { thing: 'fence post', intro: 'A fence post is in the shape of a cylinder with a hemisphere on top', unit: 'centimetres', short: 'cm', band: [18, 30], tall: [3, 6] },
  { thing: 'grain silo', intro: 'A grain silo is in the shape of a cylinder with a hemisphere on top', unit: 'metres', short: 'm', band: [6, 12], tall: [2, 4] },
  { thing: 'water tank', intro: 'A water tank is in the shape of a cylinder with a hemisphere on top', unit: 'metres', short: 'm', band: [3, 7], tall: [2, 4] },
  { thing: 'salt shaker', intro: 'A salt shaker is in the shape of a cylinder with a hemisphere on top', unit: 'centimetres', short: 'cm', band: [4, 8], tall: [2, 4] },
  { thing: 'lipstick case', intro: 'A lipstick case is in the shape of a cylinder with a hemisphere on top', unit: 'centimetres', short: 'cm', band: [2, 4], tall: [3, 6] },
  { thing: 'pepper mill', intro: 'A pepper mill is in the shape of a cylinder with a hemisphere on top', unit: 'centimetres', short: 'cm', band: [5, 9], tall: [2, 4] },
  { thing: 'mooring post', intro: 'A mooring post is in the shape of a cylinder with a hemisphere on top', unit: 'centimetres', short: 'cm', band: [20, 36], tall: [3, 5] },
  { thing: 'grain hopper', intro: 'A grain hopper is in the shape of a cylinder with a hemisphere on top', unit: 'metres', short: 'm', band: [2, 5], tall: [2, 4] },
  { thing: 'lava lamp', intro: 'A lava lamp is in the shape of a cylinder with a hemisphere on top', unit: 'centimetres', short: 'cm', band: [8, 14], tall: [2, 4] },
  { thing: 'gas cylinder', intro: 'A gas cylinder is in the shape of a cylinder with a hemisphere on top', unit: 'centimetres', short: 'cm', band: [24, 40], tall: [2, 4] },
];

/** 2019 P2 Q8 — a cylinder with a dome on top, total height given. */
function cylinderPlusHemisphere(): Q | null {
  const c = pick(BOLLARDS);
  const dia = getRandomInt(c.band[0], c.band[1]);
  const total = dia * getRandomInt(c.tall[0], c.tall[1]);
  const r = dia / 2;
  const straight = total - r;
  if (straight < r) return null;
  const sf = 3;
  const hemi = 2 / 3 * Math.PI * r ** 3;
  const cyl = Math.PI * r * r * straight;
  const exact = hemi + cyl;

  /**
   * **2019 P2 Q8 in its paper's layout — 2026-09-26.** "The bollard has" and
   * two bullets, "• diameter 24 centimetres" and "• height 70 centimetres.";
   * the figure draws both as arrows, the height on the right, and dashes the
   * back of the rim hidden by the dome. This ran the two into one sentence
   * and drew plain dashed lines with the height on the left. The owner, on
   * the 2019 re-review sheet: "Yes". This routine is that paper's alone, and
   * the rim is an opt-in on the shared cylinder.
   */
  const prose = [
    `${c.intro}.`,
    `The ${c.thing} has`,
    `&bull;&nbsp; diameter ${dia} ${c.unit}`,
    `&bull;&nbsp; height ${total} ${c.unit}.`,
    `Calculate the volume of the ${c.thing}.`,
    `Give your answer correct to ${sf} significant figures.`,
  ];
  const steps = [
    `<strong>1.</strong> The dome is half a sphere of radius ${num(r)}:` +
    `<br><br>$\\frac{1}{2} \\times \\frac{4}{3} \\times \\pi \\times ${num(r)}^{3} = ${hemi.toFixed(2)}\\ldots$`,
    `<strong>2.</strong> The dome takes up ${withUnit(r, c.unit)} of the height, so the cylinder is $${total} - ${num(r)} = ${num(straight)}$:` +
    `<br><br>$\\pi \\times ${num(r)}^{2} \\times ${num(straight)} = ${cyl.toFixed(2)}\\ldots$`,
    `<strong>3.</strong> The two pieces make up the ${c.thing}, so add them.`,
    `<strong>4.</strong> Carry out the addition:<br><br>$${hemi.toFixed(2)}\\ldots + ${cyl.toFixed(2)}\\ldots = ${exact.toFixed(2)}\\ldots$`,
    rounded(5, exact, sf, c.short),
  ];
  return assemble({
    stack: [{ kind: 'cylinder', r, h: straight, capped: true }, { kind: 'hemisphere', r }],
    dims: [
      { along: 'width', halfWidth: r, side: 'below', value: dia, text: `${dia} ${c.short}`, arrow: true },
      { along: 'height', from: 0, to: total, side: 'right', value: total, text: `${total} ${c.short}`, arrow: true },
    ],
  }, 'A Cylinder with a Dome on Top', 'volume.cylinder-plus-hemisphere', prose,
    `Cylinder with a hemisphere on top, diameter ${dia}, height ${total}. Volume?`,
    steps, [1, 1, 1, 1, 1], `$${toSigFigs(exact, sf)}$ ${cubic(c.short)}`);
}

const POSTS = [
  { thing: 'sundial base', material: 'sandstone', intro: 'A sandstone sundial base is made in the shape of a cuboid with a sphere on top' },
  { thing: 'newel post', material: 'oak', intro: 'An oak newel post is made in the shape of a cuboid with a sphere on top' },
  { thing: 'bed knob', material: 'brass', intro: 'A brass bed post is made in the shape of a cuboid with a sphere on top' },
  { thing: 'chess piece', material: 'marble', intro: 'A marble chess piece is made in the shape of a cuboid with a sphere on top' },
  { thing: 'railing post', material: 'iron', intro: 'An iron railing post is made in the shape of a cuboid with a sphere on top' },
  { thing: 'bollard', material: 'granite', intro: 'A granite bollard is made in the shape of a cuboid with a sphere on top' },
  { thing: 'trophy', material: 'resin', intro: 'A resin trophy is made in the shape of a cuboid with a sphere on top' },
  { thing: 'lamp post base', material: 'concrete', intro: 'A concrete lamp post base is made in the shape of a cuboid with a sphere on top' },
  { thing: 'fence post', material: 'sandstone', intro: 'A sandstone fence post is made in the shape of a cuboid with a sphere on top' },
  { thing: 'sundial pillar', material: 'limestone', intro: 'A limestone sundial pillar is made in the shape of a cuboid with a sphere on top' },
];

/** 2022 P2 Q3 — a box with a ball on top, total height given. */
function boxPlusSphere(): Q | null {
  const c = pick(POSTS);
  const w = getRandomInt(30, 60) / 100;
  const dia = Math.round(w * getRandomInt(60, 95)) / 100;
  const total = getRandomInt(Math.round(w * 300), Math.round(w * 460)) / 100;
  const boxH = Math.round((total - dia) * 100) / 100;
  if (boxH <= w) return null;
  const sphere3 = 4 / 3 * Math.PI * (dia / 2) ** 3;
  const box = w * w * boxH;
  const exact = sphere3 + box;
  // Two decimal places on a volume under 0.1 leaves one significant figure —
  // "0.07 m³" — and the scheme's last mark is for a consistent calculation
  // stated in the right units, which that barely shows. The paper's own answer
  // is 0.49, so the post is kept big enough to answer in two figures.
  if (exact < 0.15) return null;

  const prose = [
    `${c.intro}.`,
    `The sphere has diameter ${num(dia)} metres. The cuboid has a square base of length ${num(w)} metres.`,
    `The total height of the ${c.thing} is ${num(total)} metres.`,
    `Calculate the volume of ${c.material} needed to make one ${c.thing}.`,
    // No rounding line: 2022 P2 Q3 prints none, and its scheme takes
    // 0.49(4...). The owner, on the 2022 re-review: "Yes", as Q6 was.
  ];
  const steps = [
    `<strong>1.</strong> The sphere has radius ${num(dia / 2)}:` +
    `<br><br>$\\frac{4}{3} \\times \\pi \\times ${num(dia / 2)}^{3} = ${sphere3.toFixed(4)}\\ldots$`,
    `<strong>2.</strong> The sphere takes up ${num(dia)} m of the height, so the cuboid is $${num(total)} - ${num(dia)} = ${num(boxH)}$ m tall. Add its volume to the sphere's:` +
    `<br><br>$${sphere3.toFixed(4)}\\ldots + ${num(w)} \\times ${num(w)} \\times ${num(boxH)}$`,
    `<strong>3.</strong> Work it out and state the units:<br><br>$V = ${exact.toFixed(4)}\\ldots \\approx ${exact.toFixed(2)}$ ${cubic('m')}`,
  ];
  return assemble({
    // Shaded, as the paper's solid gatepost is. The owner, on the 2022
    // re-review: "shade the shapes as per the question".
    stack: [{ kind: 'box', w, h: boxH, shaded: true }, { kind: 'sphere', r: dia / 2, shaded: true }],
    /*
     * **Three arrows, because the paper draws three arrows.**
     *
     * 2022 P2 Q3's own figure measures the base across the bottom, the total
     * height up the right, and the sphere's diameter down its left — all three
     * as double-headed arrows. This drew none of them: two plain dashed lines
     * and, for the diameter, a *leader* pointing at the ball.
     *
     * Two of those read wrongly, and the question turns on both. A dashed line
     * with no heads does not say where it starts and stops, and the total
     * height is the number the cuboid's height is worked *out* of — the whole
     * first move is `total - diameter`. A leader is worse: it points at the
     * sphere without spanning it, so nothing on the page says whether 0·42 is
     * the diameter or the radius. Read off the render, the height line also
     * appeared to stop partway up the ball.
     *
     * So the diameter becomes a height arrow across the sphere's own extent
     * (`boxH` to `total`, on the right, clear of the total-height arrow on the
     * left), and both others ask for `arrow`. `arrow` and `rule` are per
     * dimension exactly so this can be said for one figure without touching
     * any other caller of `assemble`.
     */
    dims: [
      { along: 'width', halfWidth: w / 2, side: 'below', value: w, text: `${num(w)} m`, arrow: true },
      // `toStackTop`/`fromStackSeat` name the sphere (piece 1) rather than a
      // plain height, because it is *drawn* half the box's depth above its own
      // height - it is seated on the top face's centre, which is half a depth
      // back. Measured on the first attempt, which did not do this: the
      // sphere's drawn top was at 0.00 and the arrow's at 9.92, exactly half
      // the box's 19.85 depth offset, so the total-height arrow stopped inside
      // the ball and the diameter arrow sat a whole offset low while being the
      // right length. The owner: *"the total height line does not draw tall
      // enough - stops in middle of sphere... you need accurate drawing here."*
      { along: 'height', from: 0, to: total, toStackTop: 1, side: 'left',
        value: total, text: `${num(total)} m`, arrow: true },
      { along: 'height', from: boxH, to: total, fromStackSeat: 1, toStackTop: 1,
        side: 'right', value: dia, text: `${num(dia)} m`, arrow: true, rules: true },
    ],
  }, 'A Box with a Sphere on Top', 'volume.box-plus-sphere', prose,
    `Cuboid ${num(w)} square, sphere ${num(dia)} on top, total ${num(total)}. Volume?`,
    steps, [1, 1, 1], `$${exact.toFixed(2)}$ ${cubic('m')}`);
}

const BLOCKS = [
  { thing: 'marble base', material: 'marble' },
  { thing: 'stone plinth', material: 'stone' },
  { thing: 'glass paperweight', material: 'glass' },
  { thing: 'wooden doorstop', material: 'wood' },
  { thing: 'clay brick', material: 'clay' },
  { thing: 'chocolate slab', material: 'chocolate' },
  { thing: 'stone finial', material: 'stone' },
  { thing: 'metal ingot', material: 'metal' },
  { thing: 'wax candle', material: 'wax' },
  { thing: 'foam model', material: 'foam' },
];

/**
 * 2023 P2 Q9 — a pyramid with its tip cut off.
 *
 * The two pyramids are similar, so the small one's base and height are the same
 * fraction of the large one's. Built from that fraction rather than picked
 * independently: choose it freely and the cut is not a cut, it is a lie the
 * picture tells.
 */
function pyramidMinusPyramid(): Q | null {
  const q = getRandomInt(5, 10);
  const p = getRandomInt(2, q - 2);
  const a = getRandomInt(2, 12);
  const b = getRandomInt(1, 5) * 3;
  const [bigW, smallW] = [q * a, p * a];
  const [bigH, smallH] = [q * b, p * b];
  const blockH = bigH - smallH;
  if (blockH < smallW / 2 || bigW > 200 || bigH > 200) return null;
  const big = bigW * bigW * bigH / 3;
  const small = smallW * smallW * smallH / 3;
  if (!Number.isInteger(big) || !Number.isInteger(small)) return null;
  const c = pick(BLOCKS);

  const prose = [
    `A ${c.thing} is in the shape of a large pyramid with a small pyramid removed.`,
    `The large pyramid has a square base of length ${bigW} centimetres.`,
    `The small pyramid has a square base of length ${smallW} centimetres and a height of ${smallH} centimetres.`,
    `The ${c.thing} has height ${blockH} centimetres.`,
    `Calculate the volume of the ${c.thing}.`,
  ];
  const steps = [
    `<strong>1.</strong> Volume of the small pyramid:<br><br>$\\frac{1}{3} \\times ${smallW} \\times ${smallW} \\times ${smallH} = ${small}$`,
    `<strong>2.</strong> The large pyramid is ${blockH} + ${smallH} = ${bigH} cm tall:` +
    `<br><br>$\\frac{1}{3} \\times ${bigW} \\times ${bigW} \\times ${bigH} = ${big}$`,
    `<strong>3.</strong> The ${c.thing} is what is left, so subtract the small pyramid from the large one.`,
    `<strong>4.</strong> Carry out the subtraction and state the units:<br><br>$V = ${big} - ${small} = ${big - small}$ ${cubic('cm')}`,
  ];
  return assemble({
    // Shaded as 2023 P2 Q9 shades its block. The owner, on the 2023
    // re-review: "Yes". This routine's only paper.
    stack: [{ kind: 'pyramidFrustum', w: bigW, wTop: smallW, h: blockH, shaded: true }],
    ghosts: [{ piece: { kind: 'pyramid', w: smallW, h: smallH }, on: 'top' }],
    /**
     * **Four arrows, and the top face measured across itself.**
     *
     * 2023 P2 Q9 draws every length as a solid line barbed at both ends: 90 cm
     * under the base, 60 cm and 48 cm stacked to the right, and 40 cm *across
     * the top face*. This drew the three as dashed lines with no ends, and
     * pointed at the top face with a leader instead of spanning it - so the one
     * measurement a pupil has to pick out of the middle of the figure was the
     * one drawn least like a measurement.
     */
    dims: [
      { along: 'width', halfWidth: bigW / 2, side: 'below', arrow: true,
        value: bigW, text: `${bigW} cm` },
      /**
       * **Both heights stack on the right, sharing the line between them.**
       *
       * The owner, on the 2026-2023 sign-off sheet: *"It is not clear 18 is
       * height looks like it starts too low"*. The block's height was drawn on
       * the left and the tip's on the right, one on each side of the solid, so
       * nothing showed where one ended and the other began - the 18 appeared to
       * start somewhere in mid-air.
       *
       * 2023 P2 Q9 stacks them: 48 from the apex down to the top face, 60 from
       * the top face down to the base, both to the right of the solid and both
       * ending on the same horizontal line at the top face. That line is what
       * makes each arrow's extent readable, and it only exists if the two are
       * on the same side.
       */
      { along: 'height', from: 0, to: blockH, side: 'right', arrow: true,
        rules: true, value: blockH, text: `${blockH} cm` },
      // `onGhost` names the tip this height belongs to, so the arrow can end
      // where that pyramid's apex is *drawn* rather than at its bare height —
      // half a depth lower, which is what the owner read as "48cm arrow too
      // low". See the note in solid.ts's height branch.
      { along: 'height', from: blockH, to: bigH, side: 'right', arrow: true,
        onGhost: 0, rules: true, value: smallH, text: `${smallH} cm` },
      /**
       * **The top face keeps its leader, and that is a compromise.**
       *
       * 2023 P2 Q9 spans the top face with an arrow, like the other three.
       * Drawn that way here the number has the ghost pyramid's dashed edges
       * above it and the frustum's own top line below, and `verifyFigure`
       * rejects all but one set of proportions — the pool collapsed from varied
       * numbers to a single question, every draw answering 392. Three arrows
       * and one leader is worse than the paper and much better than one
       * question.
       *
       * The fix, when someone takes it: the label needs a placement that
       * clears both lines, the way `dimensionArrow` solved the same squeeze on
       * 2024 P1 Q14 by moving along the measured line rather than across it.
       */
      { along: 'leader', at: { x: smallW / 4, y: blockH * 1.1 }, degrees: 200, text: `${smallW} cm` },
    ],
  }, 'A Pyramid with its Tip Removed', 'volume.pyramid-minus-pyramid', prose,
    `Pyramid base ${bigW}, tip ${smallW} by ${smallH} removed, block ${blockH} tall. Volume?`,
    steps, [1, 1, 1, 1], `$${big - small}$ ${cubic('cm')}`);
}

/**
 * **`inner` is a material, not a thing.**
 *
 * The sentence is 2024 P2 Q7's own: *"It consists of a hemisphere of red glass
 * surrounded by clear glass."* So what follows "a hemisphere of" has to be a
 * substance. Half of these were noun phrases carrying their own article, and
 * the page then read "a hemisphere of a steel core surrounded by solid
 * acrylic" — and twice it was not a substance at all: "a hemisphere of a
 * hollow" and "a hemisphere of a cut-out for a ball", which is a hole, so
 * there was nothing for the hemisphere to be made of.
 *
 * `outer` is the material the question asks for the volume of, and it reads
 * back in "Calculate the volume of X in the Y" — so the two are kept distinct
 * enough that the sentence does not say "the volume of foam in the foam
 * insert".
 */
const cap = (w: string): string => w[0].toUpperCase() + w.slice(1);

const WEIGHTS = [
  { thing: 'desk weight', inner: 'steel', outer: 'solid acrylic' },
  { thing: 'display block', inner: 'blue resin', outer: 'clear resin' },
  { thing: 'soap bar', inner: 'scented soap', outer: 'plain soap' },
  { thing: 'candle', inner: 'coloured wax', outer: 'white wax' },
  { thing: 'ice lolly', inner: 'fruit puree', outer: 'plain ice' },
  { thing: 'jelly mould', inner: 'cream', outer: 'set jelly' },
  { thing: 'chocolate bar', inner: 'caramel', outer: 'dark chocolate' },
  // No paving slab: at 2 to 12 centimetres it was a slab a few centimetres
  // across. The owner, on the 2024 re-review sheet: "Yes". In its place the
  // paper's own paperweight, on the owner's "Yes".
  { thing: 'paperweight', inner: 'red glass', outer: 'clear glass' },
  { thing: 'packing block', inner: 'dense foam', outer: 'light foam' },
  { thing: 'butter block', inner: 'herb butter', outer: 'plain butter' },
];

/** 2024 P2 Q7 — a hemisphere set into a box. */
function boxMinusHemisphere(): Q | null {
  const c = pick(WEIGHTS);
  const w = getRandomInt(5, 12);
  const dia = getRandomInt(3, w - 1);
  const h = getRandomInt(Math.ceil(dia / 2), Math.max(Math.ceil(dia / 2), w - 1));
  if (h < dia / 2 || h > w) return null;
  const sf = 2;
  const hemi = 2 / 3 * Math.PI * (dia / 2) ** 3;
  const box = w * w * h;
  const exact = box - hemi;
  if (Number(toSigFigs(exact, sf)) === Math.round(exact)) return null;   // •⁴ needs rounding to happen

  const prose = [
    // "An ice lolly", not "A ice lolly". The article was hardcoded, and the
    // list has always had a vowel in it.
    `${cap(article(c.thing))} ${c.thing} is in the shape of a cuboid. It consists of a hemisphere of ${c.inner} surrounded by ${c.outer}.`,
    `The cuboid has height ${h} centimetres and a square base of length ${w} centimetres. The hemisphere has diameter ${dia} centimetres.`,
    `Calculate the volume of ${c.outer} in the ${c.thing}.`,
    `Give your answer correct to ${sf} significant figures.`,
  ];
  const steps = [
    `<strong>1.</strong> The hemisphere is half a sphere of radius ${num(dia / 2)}:` +
    `<br><br>$\\frac{1}{2} \\times \\frac{4}{3} \\times \\pi \\times ${num(dia / 2)}^{3} = ${hemi.toFixed(2)}\\ldots$`,
    `<strong>2.</strong> The ${c.outer} is the cuboid with the hemisphere taken out, so subtract:` +
    `<br><br>$${w} \\times ${w} \\times ${h} - ${hemi.toFixed(2)}\\ldots$`,
    `<strong>3.</strong> Carry out the subtraction:<br><br>$${box} - ${hemi.toFixed(2)}\\ldots = ${exact.toFixed(2)}\\ldots$`,
    rounded(4, exact, sf, 'cm'),
  ];
  return assemble({
    stack: [{ kind: 'box', w, h }],
    // **Shaded, as the paper draws its red glass**: 2024 P2 Q7's hemisphere
    // is a filled grey dome inside the clear box. The owner, on the 2024
    // re-review sheet: "Could also do with shading on sphere like real
    // question". The `seen` opt-in 2014 P2 Q7 added, and `hides` so the box's
    // back edges stop behind the dome as the paper's do.
    ghosts: [{ piece: { kind: 'hemisphere', r: dia / 2 }, on: 'base', seen: true, hides: true }],
    /**
     * **Arrows, and the diameter drawn across the hemisphere itself.**
     *
     * 2024 P2 Q7 measures every length with a solid line barbed at both ends
     * - the 4 cm height and the 7 cm base outside the box, the 6 cm diameter
     * *inside*, lying on the hemisphere's flat face. This drew all three as
     * dashed lines with no ends, stacked below and beside the box, so the
     * diameter sat under the cuboid looking like a second base measurement.
     *
     * The note on `arrow` in solid.ts says each solid gets its arrows when its
     * own question is read. This is that question.
     */
    dims: [
      { along: 'width', halfWidth: dia / 2, side: 'above', onGhost: 0, arrow: true,
        value: dia, text: `${dia} cm` },
      { along: 'width', halfWidth: w / 2, side: 'below', rank: 0, arrow: true,
        value: w, text: `${w} cm` },
      { along: 'height', from: 0, to: h, side: 'left', arrow: true,
        value: h, text: `${h} cm` },
    ],
  }, 'A Hemisphere Set into a Box', 'volume.box-minus-hemisphere', prose,
    `Cuboid ${w} by ${w} by ${h}, hemisphere of diameter ${dia} removed. Volume?`,
    steps, [1, 1, 1, 1], `$${toSigFigs(exact, sf)}$ ${cubic('cm')}`);
}

// ── dispatch ──────────────────────────────────────────────────────────────

/**
 * Every one of these is input-first with rejection, so every one needs the
 * same loop: draw dimensions, and if the figure will not lay out, draw again.
 */
const tried = (name: string, make: () => Q | null): (() => Q) => () => {
  for (let i = 0; i < 4000; i++) {
    const q = make();
    if (q) return q;
  }
  throw new Error(`${name}: no valid question found`);
};

export const VOLUME_GENERATORS: Record<string, () => Q> = {
  'Volume of a Sphere': tried('volume.sphere', sphere),
  'A Volume in Scientific Notation': tried('volume.sphere-scientific', sphereScientific),
  'Volume of a Cone': tried('volume.cone-approx-pi', conePi),
  'The Height of a Pyramid': tried('volume.pyramid-height', pyramidHeight),
  'A Cone Matching a Sphere': tried('volume.sphere-cone-equal', sphereConeEqual),
  'A Cone with a Hemisphere Removed': tried('volume.cone-minus-hemisphere', coneMinusHemisphere),
  'A Cone with its Tip Removed': tried('volume.cone-minus-cone', coneMinusCone),
  'The Coating on a Sphere': tried('volume.sphere-shell', sphereShell),
  'A Cylinder with a Dome on Top': tried('volume.cylinder-plus-hemisphere', cylinderPlusHemisphere),
  'A Box with a Sphere on Top': tried('volume.box-plus-sphere', boxPlusSphere),
  'A Pyramid with its Tip Removed': tried('volume.pyramid-minus-pyramid', pyramidMinusPyramid),
  'A Hemisphere Set into a Box': tried('volume.box-minus-hemisphere', boxMinusHemisphere),
};
