import { GeneratedQuestion } from './types';

/** "a = b", or just "a" when the simplification changed nothing. */
const orSame = (raw: string, simplified: string): string =>
  raw === simplified ? raw : `${raw} = ${simplified}`;

import { getRandomInt } from './utils';
import { nestedTriangles } from '../diagrams/shapes/nested-triangles';
import { similarRectangles } from '../diagrams/shapes/similar-rectangles';
import { renderScene } from '../diagrams/render';
import { verifyFigure } from '../diagrams/verify';

/**
 * Similar triangles, one inside the other.
 *
 * A triangle cut by a line parallel to one side. The cut makes a smaller
 * triangle sharing the apex, similar to the whole because the parallel gives
 * equal corresponding angles, and everything follows from the ratio of the two
 * parallel sides.
 *
 * The papers ask it two ways round, and they are different questions to a
 * pupil even though the figure is the same:
 *
 *   2017 P1 Q15  the two parallels and the far part of a ray; find the near
 *                part.       x / (x + outer) = near / far
 *   2024 P1 Q14  the two parallels and the whole ray; find the far part.
 *                whole x (far - near) / far
 *
 * Both are built from the ratio rather than from the answer: pick the two
 * parallel lengths and the ray, and the arithmetic is clean whenever the ray
 * is a multiple of the larger parallel.
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
type Q = Omit<GeneratedQuestion, 'topic'>;

type Names = { apex: string; nearLeft: string; nearRight: string;
               left: string; right: string };

const SETS: Names[] = [
  { apex: 'A', nearLeft: 'B', nearRight: 'C', left: 'D', right: 'E' },
  { apex: 'P', nearLeft: 'T', nearRight: 'S', left: 'Q', right: 'R' },
  { apex: 'K', nearLeft: 'L', nearRight: 'M', left: 'N', right: 'P' },
  { apex: 'W', nearLeft: 'X', nearRight: 'Y', left: 'V', right: 'Z' },
];

/** A triangle that is worth drawing: no angle so thin the letters collide. */
const shape = () => {
  const angleLeft = getRandomInt(38, 62);
  const angleRight = getRandomInt(38, 62);
  return { angleLeft, angleRight, rotate: getRandomInt(0, 3) * 90 + getRandomInt(-14, 14) };
};

const num = (x: number): string =>
  Number.isInteger(x) ? String(x) : String(Number(x.toFixed(2)));

/**
 * 2017 P1 Q15 — the two parallels and the outer part of a ray, find the inner.
 */
export function similarTrianglePartQuestion(): Q {
  for (let tries = 0; tries < 3000; tries++) {
    const n = pick(SETS);
    const far = getRandomInt(6, 12);
    const near = getRandomInt(3, far - 2);
    // Measured, not guessed: the strip between the two parallels is what the
    // cut's own measurement sits in, and it narrows with the ratio. Nine in ten
    // layouts draw up to 0.6 and one in five at 0.8, so without this cap the
    // ratios near 0.8 would quietly stop reaching the page.
    if (near / far > 0.7) continue;
    // the inner part is chosen first, so the outer part is what has to divide
    const inner = getRandomInt(4, 13);
    const outer = inner * (far - near) / near;
    if (!Number.isInteger(outer * 10) || outer < 1.5 || outer > 12) continue;

    const { angleLeft, angleRight, rotate } = shape();
    const fig = nestedTriangles({
      base: far, angleLeft, angleRight, cut: near / far, rotate, names: n,
      nearLabel: `${near} cm`, farLabel: `${far} cm`,
      rayLabels: [{ part: 'inner', text: 'x cm' }, { part: 'outer', text: `${num(outer)} cm` }],
    });
    if (!fig) continue;

    const prose = [
      `In the diagram, $${n.nearLeft}${n.nearRight}$ is parallel to $${n.left}${n.right}$.`,
      '',
      `&bull;&nbsp; $${n.nearLeft}${n.nearRight} = ${near}$ cm`,
      `&bull;&nbsp; $${n.left}${n.right} = ${far}$ cm`,
      `&bull;&nbsp; $${n.nearLeft}${n.left} = ${num(outer)}$ cm`,
      `&bull;&nbsp; The length of $${n.apex}${n.nearLeft}$ is $x$ cm`,
      `Calculate the value of $x$.`,
    ];
    const steps = [
      `<strong>1.</strong> $${n.nearLeft}${n.nearRight}$ is parallel to $${n.left}${n.right}$, so triangles $${n.apex}${n.nearLeft}${n.nearRight}$ and $${n.apex}${n.left}${n.right}$ are similar and their sides are in the same ratio:<br><br>$\\frac{${n.apex}${n.nearLeft}}{${n.apex}${n.left}} = \\frac{${n.nearLeft}${n.nearRight}}{${n.left}${n.right}} = \\frac{${near}}{${far}}$`,
      `<strong>2.</strong> $${n.apex}${n.left}$ is the whole ray, $x + ${num(outer)}$:<br><br>$\\frac{x}{x + ${num(outer)}} = \\frac{${near}}{${far}}$`,
      `<strong>3.</strong> Cross-multiply and collect the $x$ terms:<br><br>$${far}x = ${near}x + ${num(near * outer)}$, so $${far - near}x = ${num(near * outer)}$ and $x = ${num(inner)}$`,
    ];
    if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;

    return {
      subTopic: 'A Side of a Similar Triangle',
      difficulty: 'exam',
      // •¹ the scale factor, •² form the equation, •³ solve it for x
      variationId: 'similarity.triangle-part',
      stepMarks: [1, 1, 1],
      questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(2)],
      boardQuestionLines: [`${n.nearLeft}${n.nearRight} = ${near} cm is parallel to ${n.left}${n.right} = ${far} cm, and ${n.nearLeft}${n.left} = ${num(outer)} cm. Find ${n.apex}${n.nearLeft}.`],
      solutionSteps: steps,
      finalAnswer: `$x = ${num(inner)}$`,
      figure: fig,
    };
  }
  throw new Error('similar triangle part: no valid question found');
}

/**
 * 2024 P1 Q14 — the two parallels and the whole ray, find the far part.
 */
export function similarTriangleRestQuestion(): Q {
  for (let tries = 0; tries < 3000; tries++) {
    const n = pick(SETS);
    const far = getRandomInt(6, 12);
    const near = getRandomInt(3, far - 2);
    // Measured, not guessed: the strip between the two parallels is what the
    // cut's own measurement sits in, and it narrows with the ratio. Nine in ten
    // layouts draw up to 0.6 and one in five at 0.8, so without this cap the
    // ratios near 0.8 would quietly stop reaching the page.
    if (near / far > 0.7) continue;
    // the whole ray is a multiple of the larger parallel, so both parts land
    // on a tenth or better
    const whole = far * getRandomInt(3, 15) / 10;
    const inner = whole * near / far;
    const outer = whole - inner;
    if (whole < 5 || whole > 18 || outer < 1.5) continue;
    if (!Number.isInteger(outer * 10) || !Number.isInteger(whole * 10)) continue;

    const { angleLeft, angleRight, rotate } = shape();
    const fig = nestedTriangles({
      base: far, angleLeft, angleRight, cut: near / far, rotate, names: n,
      nearLabel: `${near} cm`, farLabel: `${far} cm`,
      rayLabels: [{ part: 'whole', text: `${num(whole)} cm` }],
    });
    if (!fig) continue;

    const prose = [
      `In the diagram, triangles $${n.apex}${n.nearLeft}${n.nearRight}$ and $${n.apex}${n.left}${n.right}$ are mathematically similar.`,
      '',
      `&bull;&nbsp; $${n.nearLeft}${n.nearRight} = ${near}$ centimetres`,
      `&bull;&nbsp; $${n.left}${n.right} = ${far}$ centimetres`,
      `&bull;&nbsp; $${n.apex}${n.left} = ${num(whole)}$ centimetres`,
      `Calculate the length of $${n.nearLeft}${n.left}$.`,
    ];
    const steps = [
      `<strong>1.</strong> The triangles are similar, so every pair of sides is in the same ratio:<br><br>$\\frac{${n.apex}${n.nearLeft}}{${n.apex}${n.left}} = \\frac{${n.nearLeft}${n.nearRight}}{${n.left}${n.right}} = \\frac{${near}}{${far}}$`,
      `<strong>2.</strong> So $${n.apex}${n.nearLeft}$ is that fraction of $${n.apex}${n.left}$:<br><br>$${n.apex}${n.nearLeft} = ${num(whole)} \\times \\frac{${near}}{${far}} = ${num(inner)}$ cm`,
      `<strong>3.</strong> $${n.nearLeft}$ lies on $${n.apex}${n.left}$, so what is left is the answer:<br><br>$${n.nearLeft}${n.left} = ${num(whole)} - ${num(inner)} = ${num(outer)}$ cm`,
    ];
    if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;

    return {
      subTopic: 'The Rest of a Similar Triangle',
      difficulty: 'exam',
      // •¹ the scale factor, •² scale the whole side consistently, •³ subtract
      variationId: 'similarity.triangle-rest',
      stepMarks: [1, 1, 1],
      questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(2)],
      boardQuestionLines: [`Similar triangles: ${n.nearLeft}${n.nearRight} = ${near} cm, ${n.left}${n.right} = ${far} cm, ${n.apex}${n.left} = ${num(whole)} cm. Find ${n.nearLeft}${n.left}.`],
      solutionSteps: steps,
      finalAnswer: `$${num(outer)}$ cm`,
      figure: fig,
    };
  }
  throw new Error('similar triangle rest: no valid question found');
}

/**
 * 2015 P2 Q9 — the area of what is left when the small triangle is taken out.
 *
 * The same cut, but the question is about area, so the scale factor is
 * squared. A pupil who divides by the ratio instead of its square gets a
 * plausible number, which is why the working says it twice.
 *
 * The numbers stay whole by construction rather than by rounding: with the two
 * parallels in the ratio a : b, an area of k*a^2 for the small triangle makes
 * the whole one k*b^2 and the answer k*(b^2 - a^2).
 */
/**
 * **Every object here has to BE the triangle in the figure.**
 *
 * The figure is a right-angled triangle cut by a line parallel to its upright
 * side - a flag on a pole, tapering to a point. Three of the old stories were
 * not that shape at all: a **window blind** and a **shop banner** are
 * rectangles, and a **kite** is a diamond. The drawing showed a triangle
 * regardless, so the picture and the story disagreed and the picture was right.
 * A stained-glass panel can be any shape, so it says which.
 *
 * `noun` is the object itself, because 2015 P2 Q9 names it in the ask - "the
 * area of PQTS, the blue section **of the flag**" - and naming it is what ties
 * the lettered region back to the thing the story is about.
 */
const AREA_CONTEXTS: { story: string; noun: string; near: string; far: string }[] = [
  { story: 'The marker flag at each gate on a slalom run is coloured red and blue.',
    noun: 'flag', near: 'red', far: 'blue' },
  { story: 'A sail on a dinghy is made from two panels of cloth.',
    noun: 'sail', near: 'grey', far: 'white' },
  { story: 'A pennant for a school sports day is printed in two colours.',
    noun: 'pennant', near: 'gold', far: 'green' },
  { story: 'A triangular stained-glass panel is made from two pieces of coloured glass.',
    noun: 'panel', near: 'amber', far: 'blue' },
  { story: 'The side panel of a tent is sewn from two pieces of canvas.',
    noun: 'panel', near: 'sand', far: 'olive' },
  { story: 'A triangular warning sign on a building site is painted in two colours.',
    noun: 'sign', near: 'black', far: 'yellow' },
  { story: 'A bunting flag is made from two pieces of felt.',
    noun: 'flag', near: 'pink', far: 'cream' },
  { story: 'A surfboard fin is moulded from two colours of resin.',
    noun: 'fin', near: 'white', far: 'teal' },
  { story: 'A road-race finishing flag is stitched from two pieces of cloth.',
    noun: 'flag', near: 'red', far: 'white' },
  { story: 'A yacht club burgee is sewn from two pieces of cloth.',
    noun: 'burgee', near: 'navy', far: 'white' },
  { story: 'The tail fin of a model rocket is cut from two colours of card.',
    noun: 'fin', near: 'red', far: 'silver' },
];

// Ratios of a half or less, because the strip between the two parallels is
// where the cut's measurement sits and it narrows as the ratio grows: measured
// across the whole set, everything up to 0.6 draws at every orientation and 5/7
// draws at none of them.
const RATIOS: [number, number][] = [[1, 2], [1, 3], [1, 4], [2, 5], [3, 5],
                                    [2, 7], [3, 7], [4, 7], [3, 8]];

export function similarTriangleAreaQuestion(): Q {
  for (let tries = 0; tries < 3000; tries++) {
    const n = pick(SETS);
    const c = pick(AREA_CONTEXTS);
    const [a, b] = pick(RATIOS);
    const k = getRandomInt(4, 40);
    const small = k * a * a;
    const whole = k * b * b;
    const answer = whole - small;
    if (small < 40 || whole > 4000) continue;

    // the two parallels are the heights the question gives, in the same ratio
    const far = getRandomInt(3, 6) * b;
    const near = far * a / b;

    const fig = nestedTriangles({
      base: far, angleLeft: 90, angleRight: getRandomInt(36, 52),
      cut: a / b, rotate: pick([90, 270]), names: n,
      nearLabel: `${near} cm`, farLabel: `${far} cm`,
      rightAngleAtLeft: true,
      // This question names its two regions by colour - "the red section", "the
      // white section" - so the figure has to show two regions. It showed one
      // undivided outline, and the colour words pointed at nothing.
      //
      // A section the story calls white is left unfilled. The rest become two
      // tones, the near one darker, which is how the paper's own small flag
      // beside the diagram tells its red from its blue.
      shadeSections: [c.near === 'white' ? 0 : 1.7,
                      c.far === 'white' ? 0 : 0.55],
    });
    if (!fig) continue;

    const prose = [
      `${c.story} The diagram below represents one ${c.noun}.`,
      '',
      `&bull;&nbsp; Triangle $${n.nearRight}${n.apex}${n.nearLeft}$ is the ${c.near} section and $${n.left}${n.nearLeft}${n.nearRight}${n.right}$ is the ${c.far} section`,
      `&bull;&nbsp; Triangles $${n.left}${n.apex}${n.right}$ and $${n.nearRight}${n.apex}${n.nearLeft}$ are mathematically similar`,
      `&bull;&nbsp; The area of triangle $${n.nearRight}${n.apex}${n.nearLeft}$ is $${small}$ square centimetres`,
      `Calculate the area of $${n.left}${n.nearLeft}${n.nearRight}${n.right}$, the ${c.far} section of the ${c.noun}.`,
    ];
    // 2015 P2 Q9 is four marks: •¹ the linear scale factor, •² know how to find
    // the large triangle's area, •³ find it, •⁴ find what is left. Setting up
    // the squared scale factor and evaluating it are separate marks, so the
    // three steps here were carrying four.
    const steps = [
      `<strong>1.</strong> The two heights give the linear scale factor:<br><br>$k = ${orSame(`\\frac{${far}}{${near}}`, `\\frac{${b}}{${a}}`)}$`,
      `<strong>2.</strong> Areas scale by the <em>square</em> of that:<br><br>$${n.left}${n.apex}${n.right} = ${small} \\times \\left(\\frac{${b}}{${a}}\\right)^{2}$`,
      `<strong>3.</strong> Work that out:<br><br>$${n.left}${n.apex}${n.right} = ${small} \\times \\frac{${b * b}}{${a * a}} = ${whole}$ cm$^{2}$`,
      `<strong>4.</strong> The ${c.far} section is what is left when the ${c.near} section is taken out:<br><br>$${whole} - ${small} = ${answer}$ cm$^{2}$`,
    ];
    if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;

    return {
      subTopic: 'The Area Left by a Similar Triangle',
      difficulty: 'exam',
      variationId: 'similarity.triangle-area',
      stepMarks: [1, 1, 1, 1],
      questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(2)],
      boardQuestionLines: [`Heights ${near} cm and ${far} cm, small triangle ${small} cm². Area of the rest?`],
      solutionSteps: steps,
      finalAnswer: `$${answer}$ cm$^{2}$`,
      figure: fig,
    };
  }
  throw new Error('similar triangle area: no valid question found');
}

// ── two similar solids, one volume known — 2014 P2 Q5, 2026 P2 Q3 ────────
//
// The five "similar areas/volumes" paper questions have no numbers in their
// pictures except one, so four of the five are cloned with no figure at all:
// the photographs of cookie jars and model aircraft are context, and every
// measurement is in the prose. 2016 P2 Q11 is the exception and has its own
// routine below.
//
// Built from the ratio, not from the answer. With the two heights in the ratio
// a : b, a volume of k·a³ for the small one makes the large one k·b³ and both
// are whole — which is how the papers' own numbers come out: 15 and 24 is
// 5 : 8, and 750 is 6 × 5³, so the answer 3072 is 6 × 8³.
//
// **Up and down are one variation, not two.** The marking scheme is the same
// three lines whichever way the question runs, and 2014 scales up where 2026
// scales down; direction is a parameter of the shape rather than a shape of
// its own. It is drawn per question so a pupil asking for four gets both.

interface SolidPair {
  story: string;             // "A supermarket sells cylindrical cookie jars"
  noun: string;              // "jar"
  measure: string;           // "height"
  unit: string;              // "centimetres"
  volumeUnit: string;        // "cubic centimetres"
  short: string;             // "cm$^{3}$"
}

const SOLID_PAIRS: SolidPair[] = [
  { story: 'A hardware shop sells cylindrical storage tins which are mathematically similar.',
    noun: 'tin', measure: 'height', unit: 'centimetres',
    volumeUnit: 'cubic centimetres', short: 'cm$^{3}$' },
  { story: 'A syrup is sold in two sizes of flask which are mathematically similar.',
    noun: 'flask', measure: 'height', unit: 'centimetres',
    volumeUnit: 'millilitres', short: 'millilitres' },
  { story: 'A garden centre sells two sizes of plant pot which are mathematically similar.',
    noun: 'pot', measure: 'height', unit: 'centimetres',
    volumeUnit: 'cubic centimetres', short: 'cm$^{3}$' },
  { story: 'A dairy sells milk in two mathematically similar cartons.',
    noun: 'carton', measure: 'height', unit: 'centimetres',
    volumeUnit: 'millilitres', short: 'millilitres' },
  { story: 'A candle maker pours wax into two mathematically similar moulds.',
    noun: 'candle', measure: 'height', unit: 'centimetres',
    volumeUnit: 'cubic centimetres', short: 'cm$^{3}$' },
  { story: 'A pet shop sells two mathematically similar fish tanks.',
    noun: 'tank', measure: 'length', unit: 'centimetres',
    volumeUnit: 'litres', short: 'litres' },
  { story: 'A hardware shop sells paint in two mathematically similar tins.',
    noun: 'tin', measure: 'height', unit: 'centimetres',
    volumeUnit: 'millilitres', short: 'millilitres' },
  { story: 'A bakery bakes loaves in two mathematically similar tins.',
    noun: 'loaf tin', measure: 'length', unit: 'centimetres',
    volumeUnit: 'cubic centimetres', short: 'cm$^{3}$' },
  { story: 'A company makes two mathematically similar watering cans.',
    noun: 'can', measure: 'height', unit: 'centimetres',
    volumeUnit: 'litres', short: 'litres' },
  { story: 'A shop sells two mathematically similar glass vases.',
    noun: 'vase', measure: 'height', unit: 'centimetres',
    volumeUnit: 'cubic centimetres', short: 'cm$^{3}$' },
  { story: 'A farm shop sells honey in two mathematically similar pots.',
    noun: 'pot', measure: 'height', unit: 'centimetres',
    volumeUnit: 'millilitres', short: 'millilitres' },
  { story: 'A toy maker makes two mathematically similar wooden crates.',
    noun: 'crate', measure: 'length', unit: 'centimetres',
    volumeUnit: 'cubic centimetres', short: 'cm$^{3}$' },
];

/**
 * Ratios small : large, in lowest terms.
 *
 * With a floor as well as a ceiling, and the floor is not fussiness. Drawn at
 * 7 : 8 the two rectangles in `similar-rectangles.ts` are the same picture
 * twice and there is visibly nothing to compare — the papers set 3 : 5 and
 * 2 : 3, where one is plainly a scaled copy of the other. It reads wrong
 * without a figure too: a "smaller" and a "larger" jar 42 cm and 48 cm tall
 * are not really two sizes.
 */
const SCALE_RATIOS: [number, number][] = [
  [2, 3], [3, 5], [5, 8], [4, 7], [5, 7], [2, 5], [5, 9], [3, 7], [4, 9], [3, 4],
];

/** Those in a band, as a fraction — 1.4 upwards is "obviously two sizes". */
const ratiosBetween = (lo: number, hi: number): [number, number][] =>
  SCALE_RATIOS.filter(([a, b]) => b / a >= lo && b / a <= hi);

export function similarVolumeQuestion(): Q {
  for (let tries = 0; tries < 3000; tries++) {
    const c = pick(SOLID_PAIRS);
    const [a, b] = pick(ratiosBetween(1.3, 2.5));
    const m = getRandomInt(2, 6);
    const [hSmall, hLarge] = [a * m, b * m];
    if (hSmall < 5 || hLarge > 60) continue;
    const k = getRandomInt(2, 40);
    const vSmall = k * a ** 3, vLarge = k * b ** 3;
    if (vSmall < 40 || vLarge > 12000) continue;

    // Which one the question hands over, and which it asks for. 2014 gives the
    // small and asks for the large; 2026 gives the large and asks for the small.
    const up = getRandomInt(0, 1) === 0;
    const [hGiven, vGiven, hWanted, answer] = up
      ? [hSmall, vSmall, hLarge, vLarge]
      : [hLarge, vLarge, hSmall, vSmall];
    const [givenWord, wantedWord] = up ? ['smaller', 'larger'] : ['larger', 'smaller'];
    // the scale factor as the pupil writes it: wanted over given
    const [sfTop, sfBottom] = up ? [b, a] : [a, b];

    return {
      subTopic: 'Volumes of Similar Solids',
      difficulty: 'exam',
      variationId: 'similarity.volume-scale',
      questionLines: [
        c.story,
        '',
        `The ${givenWord} ${c.noun} has a ${c.measure} of ${hGiven} ${c.unit} and a volume of ${vGiven} ${c.volumeUnit}.`,
        `The ${wantedWord} ${c.noun} has a ${c.measure} of ${hWanted} ${c.unit}.`,
        `Calculate the volume of the ${wantedWord} ${c.noun}.`,
      ],
      boardQuestionLines: [
        `Similar ${c.noun}s: ${hGiven} ${c.unit} holds ${vGiven} ${c.volumeUnit}. What does the ${hWanted} ${c.unit} one hold?`,
      ],
      solutionSteps: [
        `<strong>1.</strong> The two ${c.measure}s give the linear scale factor, ${wantedWord} over ${givenWord}:<br><br>$k = ${orSame(`\\frac{${hWanted}}{${hGiven}}`, `\\frac{${sfTop}}{${sfBottom}}`)}$`,
        `<strong>2.</strong> Volume is three-dimensional, so it scales by the <em>cube</em> of that:<br><br>$V = ${vGiven} \\times \\left(\\frac{${sfTop}}{${sfBottom}}\\right)^{3}$`,
        `<strong>3.</strong> Work that out, and give the units:<br><br>$V = ${vGiven} \\times \\frac{${sfTop ** 3}}{${sfBottom ** 3}} = ${answer}$ ${c.short}`,
      ],
      // 2014 P2 Q5: •¹ state the linear scale factor, •² state the volume scale
      // factor, •³ calculate the volume and state the units
      stepMarks: [1, 1, 1],
      finalAnswer: `$${answer}$ ${c.short}`,
    };
  }
  throw new Error('similarity.volume-scale: no valid question found');
}

// ── two similar figures, one area known — 2025 P2 Q11 ────────────────────
//
// The same construction one dimension down: areas k·a² and k·b². 2025's own
// numbers are 14 and 31.5, which is 4 : 9 at m = 3.5, so the multiplier has to
// be allowed to land on a half — its wing areas are 24 and 121.5.

interface AreaPair {
  story: string; noun: string; measure: string; part: string; unit: string;
}

const AREA_PAIRS: AreaPair[] = [
  { story: 'Two paper darts are mathematically similar.',
    noun: 'dart', measure: 'long', part: 'one panel', unit: 'cm' },
  { story: 'Two flags flown outside a hotel are mathematically similar.',
    noun: 'flag', measure: 'wide', part: 'the red panel', unit: 'cm' },
  { story: 'A photograph is enlarged so that the two prints are mathematically similar.',
    noun: 'print', measure: 'wide', part: 'the sky in the picture', unit: 'cm' },
  { story: 'Two sails on a model yacht are mathematically similar.',
    noun: 'sail', measure: 'tall', part: 'the sail', unit: 'cm' },
  { story: 'A company makes two mathematically similar kites.',
    noun: 'kite', measure: 'long', part: 'the fabric', unit: 'cm' },
  { story: 'Two road signs of the same design are mathematically similar.',
    noun: 'sign', measure: 'wide', part: 'the blue border', unit: 'cm' },
  { story: 'A tile shop sells two mathematically similar patterned tiles.',
    noun: 'tile', measure: 'wide', part: 'the pattern', unit: 'cm' },
  { story: 'Two stained-glass panels in a door are mathematically similar.',
    noun: 'panel', measure: 'tall', part: 'the amber glass', unit: 'cm' },
  { story: 'A theatre prints two mathematically similar posters.',
    noun: 'poster', measure: 'tall', part: 'the photograph on it', unit: 'cm' },
  { story: 'Two mathematically similar sails are cut for a dinghy.',
    noun: 'sail', measure: 'long', part: 'the grey cloth', unit: 'm' },
  { story: 'A school orders two mathematically similar banners.',
    noun: 'banner', measure: 'wide', part: 'the printed area', unit: 'm' },
  { story: 'Two mathematically similar rugs are woven to the same design.',
    noun: 'rug', measure: 'long', part: 'the patterned centre', unit: 'm' },
];

/** 14 and 31.5 are 4 : 9 at three and a half, so halves have to be allowed. */
const dp = (x: number): string =>
  Number.isInteger(x) ? String(x) : String(Number(x.toFixed(2)));

export function similarAreaQuestion(): Q {
  for (let tries = 0; tries < 3000; tries++) {
    const c = pick(AREA_PAIRS);
    const [a, b] = pick(ratiosBetween(1.3, 2.5));
    const m = getRandomInt(2, 12) / 2;
    const [lSmall, lLarge] = [a * m, b * m];
    if (lSmall < 4 || lLarge > 60) continue;
    const k = getRandomInt(2, 30) / 2;
    const areaSmall = k * a * a, areaLarge = k * b * b;
    if (!Number.isInteger(areaSmall * 10) || !Number.isInteger(areaLarge * 10)) continue;
    if (areaSmall < 8 || areaLarge > 3000) continue;

    const up = getRandomInt(0, 1) === 0;
    const [lGiven, aGiven, lWanted, answer] = up
      ? [lSmall, areaSmall, lLarge, areaLarge]
      : [lLarge, areaLarge, lSmall, areaSmall];
    const [givenWord, wantedWord] = up ? ['small', 'large'] : ['large', 'small'];
    const [sfTop, sfBottom] = up ? [b, a] : [a, b];

    return {
      subTopic: 'Areas of Similar Figures',
      difficulty: 'exam',
      variationId: 'similarity.area-scale',
      questionLines: [
        c.story,
        '',
        `The ${givenWord} ${c.noun} is ${dp(lGiven)} ${c.unit} ${c.measure}, and the area of ${c.part} is ${dp(aGiven)} ${c.unit}$^{2}$.`,
        `The ${wantedWord} ${c.noun} is ${dp(lWanted)} ${c.unit} ${c.measure}.`,
        `Calculate the area of ${c.part} on the ${wantedWord} ${c.noun}.`,
      ],
      boardQuestionLines: [
        `Similar ${c.noun}s ${dp(lGiven)} and ${dp(lWanted)} ${c.unit}. Area ${dp(aGiven)} ${c.unit}² becomes?`,
      ],
      solutionSteps: [
        `<strong>1.</strong> The two lengths give the linear scale factor, ${wantedWord} over ${givenWord}:<br><br>$k = ${orSame(`\\frac{${dp(lWanted)}}{${dp(lGiven)}}`, `\\frac{${sfTop}}{${sfBottom}}`)}$`,
        `<strong>2.</strong> Area is two-dimensional, so it scales by the <em>square</em> of that:<br><br>$A = ${dp(aGiven)} \\times \\left(\\frac{${sfTop}}{${sfBottom}}\\right)^{2}$`,
        `<strong>3.</strong> Work that out, and give the units:<br><br>$A = ${dp(aGiven)} \\times \\frac{${sfTop * sfTop}}{${sfBottom * sfBottom}} = ${dp(answer)}$ ${c.unit}$^{2}$`,
      ],
      // 2025 P2 Q11: •¹ find the linear scale factor, •² multiply the area by
      // its square, •³ find the area. Note 3 is not available if either scale
      // factor was rounded, which is why nothing here is ever rounded.
      stepMarks: [1, 1, 1],
      finalAnswer: `$${dp(answer)}$ ${c.unit}$^{2}$`,
    };
  }
  throw new Error('similarity.area-scale: no valid question found');
}

// ── cost proportional to area — 2016 P2 Q11 ──────────────────────────────
//
// The one similarity question whose measurements are in the picture and not in
// the words, so this is the one that has to be drawn. See
// `shapes/similar-rectangles.ts`.
//
// The twist is that the quantity scaling is not an area but something
// *proportional* to one, which is a step a pupil has to make for themselves —
// the words never say "area of the picture" anywhere.

const COST_PAIRS: { story: string; noun: string; asks: string; aspect: number }[] = [
  { story: 'Two mathematically similar mirrors are made for a hotel.', noun: 'mirror',
    asks: 'The cost of each mirror is proportional to its area.', aspect: 0.74 },
  { story: 'Two posters advertising a concert are mathematically similar.', noun: 'poster',
    asks: 'The cost of printing each poster is proportional to its area.', aspect: 1.4 },
  { story: 'A shop sells two mathematically similar rugs.', noun: 'rug',
    asks: 'The price of each rug is proportional to its area.', aspect: 0.66 },
  { story: 'Two mathematically similar banners are made for a school fair.', noun: 'banner',
    asks: 'The cost of each banner is proportional to its area.', aspect: 0.5 },
  { story: 'A gallery sells two mathematically similar prints of the same painting.', noun: 'print',
    asks: 'The cost of each print is proportional to its area.', aspect: 0.8 },
  { story: 'Two mathematically similar panes of glass are cut for a greenhouse.', noun: 'pane',
    asks: 'The cost of each pane is proportional to its area.', aspect: 1.25 },
  { story: 'A signwriter makes two mathematically similar signs.', noun: 'sign',
    asks: 'The cost of each sign is proportional to its area.', aspect: 0.6 },
  { story: 'Two mathematically similar tablecloths are ordered for a hall.', noun: 'tablecloth',
    asks: 'The price of each tablecloth is proportional to its area.', aspect: 0.7 },
];

const money = (p: number): string => (p / 100).toFixed(2);

export function similarCostQuestion(): Q {
  for (let tries = 0; tries < 3000; tries++) {
    const c = pick(COST_PAIRS);
    const [a, b] = pick(ratiosBetween(1.4, 2));
    const m = getRandomInt(4, 20);
    const [wSmall, wLarge] = [a * m, b * m];
    if (wSmall < 20 || wLarge > 120) continue;
    // Costs in whole pence, so the money is exact rather than rounded: with a
    // unit cost of k pence per square of the ratio, both come out to the penny.
    const k = getRandomInt(2, 60) * 5;
    const [pSmall, pLarge] = [k * a * a, k * b * b];
    if (pSmall < 150 || pLarge > 20000) continue;

    const fig = similarRectangles({
      largeWidth: wLarge, smallWidth: wSmall, aspect: c.aspect,
      labels: { large: `${wLarge} cm`, small: `${wSmall} cm` },
    });

    const prose = [
      c.story,
      '',
      c.asks,
      `The large ${c.noun} costs &pound;${money(pLarge)}.`,
      `Find the cost of the small ${c.noun}.`,
    ];
    const steps = [
      `<strong>1.</strong> The two widths give the linear scale factor, small over large:<br><br>$k = \\frac{${wSmall}}{${wLarge}} = \\frac{${a}}{${b}}$`,
      `<strong>2.</strong> The cost follows the area, and area scales by the <em>square</em> of the linear scale factor:<br><br>$\\text{cost} = ${money(pLarge)} \\times \\left(\\frac{${a}}{${b}}\\right)^{2}$`,
      `<strong>3.</strong> Work that out:<br><br>$\\text{cost} = ${money(pLarge)} \\times \\frac{${a * a}}{${b * b}} = $ &pound;${money(pSmall)}`,
    ];
    if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) continue;

    return {
      subTopic: 'Cost of a Similar Figure',
      difficulty: 'exam',
      variationId: 'similarity.area-from-cost',
      questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(2)],
      boardQuestionLines: [
        `Similar ${c.noun}s ${wLarge} cm and ${wSmall} cm, cost proportional to area. The large costs £${money(pLarge)}. The small?`,
      ],
      solutionSteps: steps,
      // 2016 P2 Q11: •¹ the linear scale factor, •² know to multiply the cost
      // by its square, •³ find the cost. The scheme takes it either way up.
      stepMarks: [1, 1, 1],
      finalAnswer: `&pound;${money(pSmall)}`,
      figure: fig,
    };
  }
  throw new Error('similarity.area-from-cost: no valid question found');
}

// ── show two solids are NOT similar, then fix one — 2018 P2 Q18 ──────────
//
// Five marks in two parts, and the only similarity question in the papers that
// runs the argument backwards. Part (a) is a proof by contradiction in all but
// name: assume similar, work out what the volume would have to be, and point
// at the gap. Part (b) then hands over a volume and asks for the depth, which
// needs the *cube root* of the volume scale factor — the one move none of the
// other four questions make.

// `measure` is the adjective the statement uses and `dimension` the noun the
// question asks for. They have to agree: a cup stated as "15 cm tall" and then
// asked for its "depth" is two different measurements as far as a pupil can
// tell, and part (b) hardcoded "depth" for all eight.
const NOT_SIMILAR: {
  story: string; noun: string; small: string; large: string;
  measure: string; dimension: string;
}[] = [
  { story: 'A juice bar serves smoothies in two different sized beakers.', noun: 'beaker',
    small: 'small', large: 'large', measure: 'deep', dimension: 'depth' },
  { story: 'A cafe serves milkshakes in two different sized cups.', noun: 'cup',
    small: 'regular', large: 'large', measure: 'tall', dimension: 'height' },
  { story: 'A garden centre sells compost in two different sized tubs.', noun: 'tub',
    small: 'small', large: 'giant', measure: 'deep', dimension: 'depth' },
  { story: 'A bakery sells cake in two different sized boxes.', noun: 'box',
    small: 'small', large: 'party', measure: 'deep', dimension: 'depth' },
  { story: 'A shop sells popcorn buckets in two different sizes.', noun: 'bucket',
    small: 'standard', large: 'sharing', measure: 'tall', dimension: 'height' },
  { story: 'A takeaway packs noodles in two different sized containers.', noun: 'container',
    small: 'single', large: 'family', measure: 'deep', dimension: 'depth' },
  { story: 'A dairy sells yoghurt in two different sized pots.', noun: 'pot',
    small: 'small', large: 'large', measure: 'tall', dimension: 'height' },
  { story: 'A hardware shop sells wood stain in two different sized tins.', noun: 'tin',
    small: 'small', large: 'trade', measure: 'tall', dimension: 'height' },
];

export function notSimilarQuestion(): Q {
  for (let tries = 0; tries < 3000; tries++) {
    const c = pick(NOT_SIMILAR);
    const [a, b] = pick(ratiosBetween(1.3, 1.8));
    const m = getRandomInt(2, 8);
    const [dSmall, dLarge] = [a * m, b * m];
    if (dSmall < 8 || dLarge > 40) continue;
    const k = getRandomInt(2, 12);
    const vSmall = k * a ** 3;
    const wouldBe = k * b ** 3;                     // if they were similar
    if (vSmall < 100 || wouldBe > 9000) continue;
    // The stated large volume, clearly not the similar one. Rounded to a whole
    // number that is far enough away that "not equal" is not a rounding
    // argument: 2018's own pair is 1944 against 1125.
    const vLarge = Math.round(wouldBe * (getRandomInt(50, 75) / 100) / 25) * 25;
    if (vLarge <= vSmall || Math.abs(vLarge - wouldBe) < wouldBe * 0.15) continue;

    // part (b): a redesign whose depth needs a cube root and does not land whole
    const vNew = Math.round(wouldBe * (getRandomInt(105, 160) / 100) / 25) * 25;
    const newDepth = dSmall * Math.cbrt(vNew / vSmall);
    if (Number.isInteger(Number(newDepth.toFixed(3)))) continue;   // it must need rounding
    if (newDepth < dSmall * 1.05 || newDepth > 60) continue;

    return {
      subTopic: 'Showing Two Solids Are Not Similar',
      difficulty: 'exam',
      variationId: 'similarity.not-similar',
      questionLines: [
        c.story,
        '',
        `The ${c.small} ${c.noun} is ${dSmall} cm ${c.measure} and has a volume of ${vSmall} cubic centimetres.`,
        `The ${c.large} ${c.noun} is ${dLarge} cm ${c.measure} and has a volume of ${vLarge} cubic centimetres.`,
        `<b>(a)</b>&nbsp;&nbsp;Show that the two ${c.noun}s are <em>not</em> mathematically similar.`,
        `<b>(b)</b>&nbsp;&nbsp;The ${c.large} ${c.noun} is redesigned so that the two ${c.noun}s are now mathematically similar. The volume of the redesigned ${c.large} ${c.noun} is ${vNew} cubic centimetres.<br>Calculate the ${c.dimension} of the redesigned ${c.large} ${c.noun}. Give your answer correct to one decimal place.`,
      ],
      boardQuestionLines: [
        `${dSmall} cm holds ${vSmall} cm³; ${dLarge} cm holds ${vLarge} cm³. Similar? Then find the ${c.dimension} for ${vNew} cm³.`,
      ],
      solutionSteps: [
        `<strong>1. (a)</strong> Start by assuming they are similar. The two ${c.dimension}s would give the linear scale factor:<br><br>$k = \\frac{${dLarge}}{${dSmall}} = \\frac{${b}}{${a}}$`,
        `<strong>2. (a)</strong> Volume scales by the cube of that, so work out what the ${c.large} ${c.noun} would have to hold:<br><br>$${vSmall} \\times \\left(\\frac{${b}}{${a}}\\right)^{3} = ${vSmall} \\times \\frac{${b ** 3}}{${a ** 3}} = ${wouldBe}$ cm$^{3}$`,
        `<strong>3. (a)</strong> Compare that with the volume it actually has, and say what it means:<br><br>$${wouldBe} \\neq ${vLarge}$, so the two ${c.noun}s are not mathematically similar.`,
        `<strong>4. (b)</strong> Now the two <em>are</em> similar, so start from the volumes. Their ratio is the volume scale factor:<br><br>$\\frac{${vNew}}{${vSmall}} = ${(vNew / vSmall).toFixed(4)}$`,
        `<strong>5. (b)</strong> The ${c.dimension} is a length, so it scales by the <em>cube root</em> of that:<br><br>$${dSmall} \\times \\sqrt[3]{\\frac{${vNew}}{${vSmall}}} = ${newDepth.toFixed(1)}$ cm`,
      ],
      // 2018 P2 Q18 is 3 + 2: •¹ the linear scale factor, •² know to cube it,
      // •³ the calculation, the comparison and the conclusion together; then
      // •⁴ the volume scale factor, •⁵ a calculation involving its cube root.
      stepMarks: [1, 1, 1, 1, 1],
      finalAnswer: `(a) they are not similar, since $${wouldBe} \\neq ${vLarge}$<br>(b) $${newDepth.toFixed(1)}$ cm`,
    };
  }
  throw new Error('similarity.not-similar: no valid question found');
}

export const SIMILARITY_GENERATORS: Record<string, () => Q> = {
  'A Side of a Similar Triangle': similarTrianglePartQuestion,
  'The Rest of a Similar Triangle': similarTriangleRestQuestion,
  'The Area Left by a Similar Triangle': similarTriangleAreaQuestion,
  'Volumes of Similar Solids': similarVolumeQuestion,
  'Areas of Similar Figures': similarAreaQuestion,
  'Cost of a Similar Figure': similarCostQuestion,
  'Showing Two Solids Are Not Similar': notSimilarQuestion,
};
