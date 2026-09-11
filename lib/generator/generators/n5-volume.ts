import { GeneratedQuestion } from './types';
import { getRandomInt } from './utils';
import { toSigFigs } from './n5-rounding';
import { withUnit } from './n5-contexts';
import { solidFigure, type SolidSpec } from '../diagrams/shapes/solid';
import { renderScene } from '../diagrams/render';
import { verifyFigure } from '../diagrams/verify';

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
    dims: [{ along: 'width', halfWidth: r, side: 'below', value: dia, text: `${num(dia)} ${c.short}` }],
  }, 'Volume of a Sphere', 'volume.sphere', prose,
    `Sphere, diameter ${num(dia)} ${c.short}. Volume to ${sf} s.f.?`,
    steps, [1, 1, 1], `$${toSigFigs(exact, sf)}$ ${cubic(c.short)}`);
}

const WORLDS = [
  { name: 'Titan', other: 'the asteroid Hygiea', unit: 'kilometres', short: 'km', band: [2400, 2700] },
  { name: 'Mars', other: 'its moon Deimos', unit: 'kilometres', short: 'km', band: [3200, 3600] },
  { name: 'Venus', other: 'the dwarf planet Ceres', unit: 'kilometres', short: 'km', band: [5900, 6200] },
  { name: 'Jupiter', other: 'the Earth', unit: 'kilometres', short: 'km', band: [68000, 72000] },
  { name: 'The Sun', other: 'Jupiter', unit: 'kilometres', short: 'km', band: [690000, 700000] },
  { name: 'Saturn', other: 'its moon Enceladus', unit: 'kilometres', short: 'km', band: [57000, 61000] },
  { name: 'Neptune', other: 'the Earth', unit: 'kilometres', short: 'km', band: [24000, 25000] },
  { name: 'Uranus', other: 'Mercury', unit: 'kilometres', short: 'km', band: [25000, 26000] },
  { name: 'The Moon', other: 'the asteroid Vesta', unit: 'kilometres', short: 'km', band: [1700, 1800] },
  { name: 'Mercury', other: 'the dwarf planet Pluto', unit: 'kilometres', short: 'km', band: [2400, 2500] },
];

/**
 * 2015 P2 Q6 — the same sphere, answered in scientific notation, then divided.
 *
 * Part (b) only reads properly if the ratio comes out whole, so the second
 * volume is built by dividing the first and is accepted only when dividing it
 * back gives the whole number again. Formatting to two figures is what can
 * spoil that, which is why it is checked after formatting rather than before.
 */
function sphereScientific(): Q | null {
  const c = pick(WORLDS);
  const r = getRandomInt(c.band[0] / 100, c.band[1] / 100) * 100;
  const times = pick([20, 25, 40, 50, 80, 100, 200, 250]);
  const exact = 4 / 3 * Math.PI * r ** 3;
  const shown = Number(toSigFigs(exact, 2));
  const other = Number(toSigFigs(shown / times, 2));
  if (Math.abs(shown / other - times) > 1e-9) return null;

  const sci = (v: number) => {
    const e = Math.floor(Math.log10(v));
    return `${Math.round(v / 10 ** e * 100) / 100} \\times 10^{${e}}`;
  };
  const prose = [
    `${c.name} is approximately spherical with a radius of ${r} ${c.unit}.`,
    `<strong>(a)</strong> Calculate the volume of ${c.name.replace(/^The /, 'the ')}, giving your answer in scientific notation, correct to 2 significant figures.`,
    `<strong>(b)</strong> The approximate volume of ${c.other} is $${sci(other)}$ cubic ${c.unit}. Calculate how many times greater the volume of ${c.name.replace(/^The /, 'the ')} is than the volume of ${c.other}.`,
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
    dims: [{ along: 'height', from: 1, to: 2, side: 'left', value: r, text: `${r} ${c.short}` }],
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
 * Non-calculator, so the product has to be one a pupil can do: the radius
 * squared times the height is made divisible by three, which turns the formula
 * into 3.14 times a whole number.
 */
function conePi(): Q | null {
  const c = pick(CONES);
  const r = pick([3, 5, 6, 9, 10, 12, 15, 20]);
  const h = getRandomInt(2, 20) * 3;
  if (h < r) return null;                     // a cone flatter than it is wide
  const third = r * r * h / 3;
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
    dims: [
      { along: 'width', halfWidth: r, side: 'below', value: 2 * r, text: `${2 * r} cm` },
      { along: 'height', from: 0, to: h, side: 'left', value: h, text: `${h} cm` },
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
  const r = getRandomInt(3, 12);
  const rc = getRandomInt(3, 12);
  if (rc === r) return null;
  const v = 4 / 3 * Math.PI * r ** 3;
  const h = v / (Math.PI * rc * rc / 3);
  if (h < rc * 0.8 || h > rc * 6) return null;         // a drawable cone

  const prose = [
    `A sphere has radius ${r} centimetres.`,
    `<strong>(a)</strong> Calculate the volume of the sphere.`,
    `A cone has the same volume as the sphere. The base of the cone has diameter ${2 * rc} centimetres.`,
    `<strong>(b)</strong> Calculate the height of the cone.`,
    `Give each answer correct to one decimal place.`,
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
  // The picture is the cone alone. The paper prints two figures, one per part,
  // and a scene is one stack — but drawing the sphere *inside* the cone, which
  // is the only place a vertical stack could put it, would say the two solids
  // are nested when the whole question is that they are separate and equal.
  // The sphere is a radius and a word, and the prose carries it.
  return assemble({
    stack: [{ kind: 'cone', r: rc, h }],
    dims: [
      { along: 'width', halfWidth: rc, side: 'below', value: 2 * rc, text: `${2 * rc} cm` },
    ],
  }, 'A Cone Matching a Sphere', 'volume.sphere-cone-equal', prose,
    `Sphere radius ${r}. A cone of base diameter ${2 * rc} has the same volume. Height?`,
    steps, [1, 1, 1, 1, 1],
    `(a) $${v.toFixed(1)}$ ${cubic('cm')} &nbsp;&nbsp; (b) $${h.toFixed(1)}$ cm`);
}

// ── two pieces, added or taken away ───────────────────────────────────────

const ORNAMENTS = [
  { thing: 'candle holder', inner: 'granite', outer: 'wax', intro: 'A candle holder is in the shape of a cone' },
  { thing: 'trophy', inner: 'lead', outer: 'resin', intro: 'A trophy is in the shape of a cone' },
  { thing: 'spinning top', inner: 'steel', outer: 'wood', intro: 'A spinning top is in the shape of a cone' },
  { thing: 'paperweight', inner: 'brass', outer: 'acrylic', intro: 'A paperweight is in the shape of a cone' },
  { thing: 'doorstop', inner: 'iron', outer: 'rubber', intro: 'A doorstop is in the shape of a cone' },
  { thing: 'chess piece', inner: 'lead', outer: 'marble', intro: 'A chess piece is in the shape of a cone' },
  { thing: 'buoy', inner: 'concrete', outer: 'plastic', intro: 'A harbour buoy is in the shape of a cone' },
  { thing: 'skittle', inner: 'steel', outer: 'beech', intro: 'A skittle is in the shape of a cone' },
  { thing: 'garden light', inner: 'concrete', outer: 'glass', intro: 'A garden light is in the shape of a cone' },
  { thing: 'plumb bob', inner: 'tungsten', outer: 'brass', intro: 'A plumb bob is in the shape of a cone' },
];

/** 2014 P2 Q7 — a cone with a hemisphere set into its base. */
function coneMinusHemisphere(): Q | null {
  const c = pick(ORNAMENTS);
  const dia = getRandomInt(6, 16);
  const h = getRandomInt(dia + 2, dia * 3);
  const inner = Math.round((dia - getRandomInt(3, 12) / 10) * 10) / 10;
  if (inner <= dia * 0.6 || inner / 2 > h * 0.7) return null;
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
  return assemble({
    stack: [{ kind: 'cone', r: dia / 2, h }],
    ghosts: [{ piece: { kind: 'hemisphere', r: inner / 2 }, on: 'base' }],
    dims: [
      { along: 'width', halfWidth: inner / 2, side: 'below', rank: 0, value: inner, text: `${num(inner)} cm` },
      { along: 'width', halfWidth: dia / 2, side: 'below', rank: 1, value: dia, text: `${dia} cm` },
      { along: 'height', from: 0, to: h, side: 'left', value: h, text: `${h} cm` },
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
  return assemble({
    stack: [{ kind: 'frustum', r: bigD / 2, rTop: smallD / 2, h: bigH - smallH }],
    ghosts: [{ piece: { kind: 'cone', r: smallD / 2, h: smallH }, on: 'top' }],
    dims: [
      { along: 'width', halfWidth: bigD / 2, side: 'below', value: bigD, text: `${bigD} cm` },
      { along: 'width', halfWidth: smallD / 2, side: 'above', value: smallD, text: `${smallD} cm` },
      { along: 'height', from: 0, to: bigH, side: 'left', value: bigH, text: `${bigH} cm` },
      { along: 'height', from: bigH - smallH, to: bigH, side: 'right', value: smallH, text: `${num(smallH)} cm` },
    ],
  }, 'A Cone with its Tip Removed', 'volume.cone-minus-cone', prose,
    `Cone ${bigD} by ${bigH}, tip ${smallD} by ${num(smallH)} removed. Volume?`,
    steps, [1, 1, 1, 1, 1], `$${toSigFigs(exact, sf)}$ ${cubic('cm')}`);
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

  const coat = c.coat.startsWith('a ') ? c.coat : `${c.coat} coating`;
  const prose = [
    `A spherical ${c.thing} is made by coating a ${c.core} sphere evenly with ${c.coat.replace(/^a /, '')}.`,
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
  return assemble({
    stack: [{ kind: 'sphere', r: dia / 2 }],
    ghosts: [{ piece: { kind: 'sphere', r: inner }, on: 'base', lift: dia / 2 - inner }],
    dims: [
      { along: 'width', halfWidth: dia / 2, side: 'below', value: dia, text: `${dia} ${c.short}` },
      { along: 'leader', at: { x: -(dia / 2) * 0.62, y: dia / 2 + (dia / 2) * 0.7 }, degrees: 140, text: `${t} ${c.short}` },
    ],
  }, 'The Coating on a Sphere', 'volume.sphere-shell', prose,
    `Sphere diameter ${dia} ${c.short}, coating ${t} ${c.short} thick. Volume of coating?`,
    steps, [1, 1, 1, 1, 1], `$${toSigFigs(exact, sf)}$ ${cubic(c.short)}`);
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

  const prose = [
    `${c.intro}.`,
    `The ${c.thing} has diameter ${dia} ${c.unit} and height ${total} ${c.unit}.`,
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
    stack: [{ kind: 'cylinder', r, h: straight }, { kind: 'hemisphere', r }],
    dims: [
      { along: 'width', halfWidth: r, side: 'below', value: dia, text: `${dia} ${c.short}` },
      { along: 'height', from: 0, to: total, side: 'left', value: total, text: `${total} ${c.short}` },
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
    `Give your answer correct to two decimal places.`,
  ];
  const steps = [
    `<strong>1.</strong> The sphere has radius ${num(dia / 2)}:` +
    `<br><br>$\\frac{4}{3} \\times \\pi \\times ${num(dia / 2)}^{3} = ${sphere3.toFixed(4)}\\ldots$`,
    `<strong>2.</strong> The sphere takes up ${num(dia)} m of the height, so the cuboid is $${num(total)} - ${num(dia)} = ${num(boxH)}$ m tall. Add its volume to the sphere's:` +
    `<br><br>$${sphere3.toFixed(4)}\\ldots + ${num(w)} \\times ${num(w)} \\times ${num(boxH)}$`,
    `<strong>3.</strong> Work it out and state the units:<br><br>$V = ${exact.toFixed(2)}$ ${cubic('m')}`,
  ];
  return assemble({
    stack: [{ kind: 'box', w, h: boxH }, { kind: 'sphere', r: dia / 2 }],
    dims: [
      { along: 'width', halfWidth: w / 2, side: 'below', value: w, text: `${num(w)} m` },
      { along: 'height', from: 0, to: total, side: 'left', value: total, text: `${num(total)} m` },
      { along: 'leader', at: { x: 0, y: boxH + dia * 0.85 }, degrees: 125, text: `${num(dia)} m` },
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
    stack: [{ kind: 'pyramidFrustum', w: bigW, wTop: smallW, h: blockH }],
    ghosts: [{ piece: { kind: 'pyramid', w: smallW, h: smallH }, on: 'top' }],
    dims: [
      { along: 'width', halfWidth: bigW / 2, side: 'below', value: bigW, text: `${bigW} cm` },
      { along: 'height', from: 0, to: blockH, side: 'left', value: blockH, text: `${blockH} cm` },
      { along: 'height', from: blockH, to: bigH, side: 'right', value: smallH, text: `${smallH} cm` },
      { along: 'leader', at: { x: smallW / 4, y: blockH * 1.1 }, degrees: 200, text: `${smallW} cm` },
    ],
  }, 'A Pyramid with its Tip Removed', 'volume.pyramid-minus-pyramid', prose,
    `Pyramid base ${bigW}, tip ${smallW} by ${smallH} removed, block ${blockH} tall. Volume?`,
    steps, [1, 1, 1, 1], `$${big - small}$ ${cubic('cm')}`);
}

const WEIGHTS = [
  { thing: 'desk weight', inner: 'a steel core', outer: 'solid acrylic' },
  { thing: 'display block', inner: 'blue resin', outer: 'poured resin' },
  { thing: 'soap bar', inner: 'a scented core', outer: 'plain soap' },
  { thing: 'candle', inner: 'a coloured core', outer: 'white wax' },
  { thing: 'ice block', inner: 'a fruit centre', outer: 'plain ice' },
  { thing: 'jelly mould', inner: 'a cream centre', outer: 'set jelly' },
  { thing: 'chocolate bar', inner: 'a caramel centre', outer: 'dark chocolate' },
  { thing: 'concrete slab', inner: 'a hollow', outer: 'concrete' },
  { thing: 'foam insert', inner: 'a cut-out for a ball', outer: 'foam' },
  { thing: 'butter block', inner: 'a herb centre', outer: 'plain butter' },
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
    `A ${c.thing} is in the shape of a cuboid. It consists of a hemisphere of ${c.inner} surrounded by ${c.outer}.`,
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
    ghosts: [{ piece: { kind: 'hemisphere', r: dia / 2 }, on: 'base' }],
    dims: [
      { along: 'width', halfWidth: dia / 2, side: 'below', rank: 0, value: dia, text: `${dia} cm` },
      { along: 'width', halfWidth: w / 2, side: 'below', rank: 1, value: w, text: `${w} cm` },
      { along: 'height', from: 0, to: h, side: 'left', value: h, text: `${h} cm` },
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
