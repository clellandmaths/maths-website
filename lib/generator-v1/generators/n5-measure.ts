import { GeneratedQuestion } from './types';
import { getRandomInt } from './utils';

/**
 * National 5 arcs, sectors and volume — the versions needing no diagram.
 *
 * The practice audit found both missing entirely, and maths.scot's own
 * questions show they need no picture: "A sector has radius 5 cm. The angle at
 * its centre is 41°. Calculate the arc length and the area." The shape is fully
 * described by two numbers.
 *
 * More usefully, the practice set works every rearrangement rather than only
 * the forward one, and Zeta says the same for volume — "rearrange each of the
 * formulae to find an unknown". A pupil who has only ever substituted into
 * V = (1/3)πr²h cannot find h when the volume is given, so both directions are
 * generated.
 *
 *   sector      radius + angle -> arc, area
 *               arc + radius -> angle          arc + angle -> radius
 *               area + radius -> angle         area + angle -> radius
 *
 *   volume      cylinder, cone, sphere, hemisphere, prism, pyramid
 *               and each of those run backwards for a missing dimension
 *
 * The exact-multiple-of-pi answer ("give your answer in terms of π") is one of
 * the practice questions and is generated too — it is the only way to ask the
 * question in a non-calculator paper.
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
type Q = Omit<GeneratedQuestion, 'topic'>;

const dp = (v: number, n = 1): string => v.toFixed(n);
const UNITS: [string, string, string][] = [
  ['cm', 'centimetres', 'cm'], ['m', 'metres', 'm'], ['mm', 'millimetres', 'mm'],
];

// ── arcs and sectors ─────────────────────────────────────────────────────

/**
 * Arc length, or sector area — one skill each, not one question asking both.
 *
 * These were a single two-part question. They are two different formulas a
 * starter drills separately, and a teacher wanting ten arc lengths could not
 * ask for them while the topic always handed back both parts.
 */
function sectorForward(wantArc: boolean): Q {
  const [u, , sym] = pick(UNITS);
  const r = getRandomInt(2, 60);
  const angle = getRandomInt(20, 340);
  const arc = 2 * Math.PI * r * angle / 360;
  const area = Math.PI * r * r * angle / 360;

  const lead = `A sector has radius ${r} ${u}. The angle at its centre is $${angle}^{\\circ}$.`;
  const rounding = 'Give your answer correct to one decimal place.';

  return wantArc ? {
    subTopic: 'Arc Length',
    difficulty: 'skill',
    variationId: 'sector.arc-forward',
    questionLines: [lead, 'Calculate the length of the arc.', rounding],
    boardQuestionLines: [`Sector, radius ${r} ${u}, angle $${angle}^{\\circ}$. Arc length?`],
    solutionSteps: [
      `<strong>1.</strong> The sector is $\\frac{${angle}}{360}$ of the whole circle.`,
      `<strong>2.</strong> The arc is that fraction of the whole circumference:<br><br>$\\frac{${angle}}{360} \\times 2\\pi \\times ${r} = ${dp(arc)}$ ${sym}`,
    ],
    finalAnswer: `$${dp(arc)}$ ${sym}`,
  } : {
    subTopic: 'Sector Area',
    difficulty: 'skill',
    variationId: 'sector.area-forward',
    questionLines: [lead, 'Calculate the area of the sector.', rounding],
    boardQuestionLines: [`Sector, radius ${r} ${u}, angle $${angle}^{\\circ}$. Area?`],
    solutionSteps: [
      `<strong>1.</strong> The sector is $\\frac{${angle}}{360}$ of the whole circle.`,
      `<strong>2.</strong> The area is that fraction of the whole circle's area:<br><br>$\\frac{${angle}}{360} \\times \\pi \\times ${r}^{2} = ${dp(area)}$ ${sym}$^{2}$`,
    ],
    finalAnswer: `$${dp(area)}$ ${sym}$^{2}$`,
  };
}

/** The five rearrangements the practice set drills. */
function sectorReverse(): Q {
  for (let tries = 0; tries < 200; tries++) {
    const [u, , sym] = pick(UNITS);
    const find = pick(['angle-from-arc', 'angle-from-area', 'radius-from-arc', 'radius-from-area'] as const);
    const r = getRandomInt(2, 40);
    const angle = getRandomInt(20, 340);
    const arc = 2 * Math.PI * r * angle / 360;
    const area = Math.PI * r * r * angle / 360;

    const shown = (v: number) => Number(dp(v, 2));
    let lines: string[], steps: string[], answer: string;

    if (find === 'angle-from-arc') {
      const got = shown(arc) * 360 / (2 * Math.PI * r);
      lines = [`A sector has arc length ${shown(arc)} ${u} and radius ${r} ${u}.`,
               `Calculate the angle at the centre, correct to one decimal place.`];
      steps = [
        `<strong>1.</strong> The arc is a fraction of the circumference, so that fraction is:<br><br>$\\frac{${shown(arc)}}{2\\pi \\times ${r}}$`,
        `<strong>2.</strong> Multiply by 360 to turn the fraction into an angle:<br><br>$a = ${dp(got)}^{\\circ}$`,
      ];
      answer = `$${dp(got)}^{\\circ}$`;
    } else if (find === 'angle-from-area') {
      const got = shown(area) * 360 / (Math.PI * r * r);
      lines = [`A sector has area ${shown(area)} ${u}$^{2}$ and radius ${r} ${u}.`,
               `Calculate the angle at the centre, correct to one decimal place.`];
      steps = [
        `<strong>1.</strong> The sector is a fraction of the whole circle's area:<br><br>$\\frac{${shown(area)}}{\\pi \\times ${r}^{2}}$`,
        `<strong>2.</strong> Multiply by 360:<br><br>$a = ${dp(got)}^{\\circ}$`,
      ];
      answer = `$${dp(got)}^{\\circ}$`;
    } else if (find === 'radius-from-arc') {
      const got = shown(arc) * 360 / (2 * Math.PI * angle);
      lines = [`A sector has arc length ${shown(arc)} ${u}. The angle at the centre is $${angle}^{\\circ}$.`,
               `Calculate the radius, correct to one decimal place.`];
      steps = [
        `<strong>1.</strong> Write down what the arc is:<br><br>$${shown(arc)} = \\frac{${angle}}{360} \\times 2\\pi r$`,
        `<strong>2.</strong> Rearrange for $r$:<br><br>$r = \\frac{${shown(arc)} \\times 360}{${angle} \\times 2\\pi} = ${dp(got)}$ ${sym}`,
      ];
      answer = `$${dp(got)}$ ${sym}`;
    } else {
      const got = Math.sqrt(shown(area) * 360 / (Math.PI * angle));
      lines = [`A sector has area ${shown(area)} ${u}$^{2}$. The angle at the centre is $${angle}^{\\circ}$.`,
               `Calculate the radius, correct to one decimal place.`];
      steps = [
        `<strong>1.</strong> Write down what the area is:<br><br>$${shown(area)} = \\frac{${angle}}{360} \\times \\pi r^{2}$`,
        `<strong>2.</strong> Rearrange for $r^{2}$, then take the square root:<br><br>$r = \\sqrt{\\frac{${shown(area)} \\times 360}{${angle} \\times \\pi}} = ${dp(got)}$ ${sym}`,
      ];
      answer = `$${dp(got)}$ ${sym}`;
    }

    return {
      subTopic: 'Finding a Missing Value in a Sector',
      difficulty: 'skill',
      variationId: 'sector.reverse',
      questionLines: lines,
      boardQuestionLines: [lines[0]],
      solutionSteps: steps,
      finalAnswer: answer,
    };
  }
  throw new Error('sector.reverse: no valid question found');
}

// ── volume ───────────────────────────────────────────────────────────────

type Solid = {
  name: string;
  /** How the question states its dimensions. */
  states: (a: number, b: number, u: string) => string;
  volume: (a: number, b: number) => number;
  /** The formula as the pupil writes it. */
  formula: string;
  substituted: (a: number, b: number) => string;
  /** Whether the second dimension is used at all. */
  twoDims: boolean;
};

const SOLIDS: Solid[] = [
  { name: 'cylinder', twoDims: true,
    states: (r, h, u) => `base radius ${r} ${u} and height ${h} ${u}`,
    volume: (r, h) => Math.PI * r * r * h,
    formula: 'V = \\pi r^{2} h',
    substituted: (r, h) => `\\pi \\times ${r}^{2} \\times ${h}` },
  { name: 'cone', twoDims: true,
    states: (r, h, u) => `base radius ${r} ${u} and vertical height ${h} ${u}`,
    volume: (r, h) => Math.PI * r * r * h / 3,
    formula: 'V = \\frac{1}{3}\\pi r^{2} h',
    substituted: (r, h) => `\\frac{1}{3} \\times \\pi \\times ${r}^{2} \\times ${h}` },
  { name: 'sphere', twoDims: false,
    states: (r, _h, u) => `radius ${r} ${u}`,
    volume: r => 4 * Math.PI * r * r * r / 3,
    formula: 'V = \\frac{4}{3}\\pi r^{3}',
    substituted: r => `\\frac{4}{3} \\times \\pi \\times ${r}^{3}` },
  { name: 'hemisphere', twoDims: false,
    states: (r, _h, u) => `radius ${r} ${u}`,
    volume: r => 2 * Math.PI * r * r * r / 3,
    formula: 'V = \\frac{2}{3}\\pi r^{3}',
    substituted: r => `\\frac{2}{3} \\times \\pi \\times ${r}^{3}` },
];

function volumeForward(): Q {
  const solid = pick(SOLIDS);
  const [u, , sym] = pick(UNITS);
  const a = getRandomInt(2, 24);
  const b = getRandomInt(3, 30);
  const v = solid.volume(a, b);
  // "in terms of pi" is the only way to ask this without a calculator, and it
  // is one of the practice questions
  const exact = !solid.twoDims && getRandomInt(1, 3) === 1;
  const piCoef = v / Math.PI;
  const nice = Math.abs(piCoef * 3 - Math.round(piCoef * 3)) < 1e-9;
  const inPi = exact && nice
    ? (Number.isInteger(piCoef) ? `${piCoef}\\pi` : `\\frac{${Math.round(piCoef * 3)}}{3}\\pi`)
    : null;

  return {
    subTopic: 'Volume of a Solid',
    difficulty: 'skill',
    variationId: 'volume.forward',
    questionLines: [
      `Calculate the volume of a ${solid.name} with ${solid.states(a, b, u)}.`,
      inPi ? `Give your answer in terms of $\\pi$.` : `Give your answer correct to one decimal place.`,
    ],
    boardQuestionLines: [`Volume of a ${solid.name}, ${solid.states(a, b, u)}`],
    solutionSteps: [
      `<strong>1.</strong> Write down the formula:<br><br>$${solid.formula}$`,
      `<strong>2.</strong> Substitute:<br><br>$V = ${solid.substituted(a, b)}$`,
      inPi
        ? `<strong>3.</strong> Leave $\\pi$ as it is:<br><br>$V = ${inPi}$ ${sym}$^{3}$`
        : `<strong>3.</strong> Evaluate and round:<br><br>$V = ${dp(v)}$ ${sym}$^{3}$`,
    ],
    finalAnswer: inPi ? `$${inPi}$ ${sym}$^{3}$` : `$${dp(v)}$ ${sym}$^{3}$`,
  };
}

/** Zeta: "rearrange each of the formulae to find an unknown". */
function volumeReverse(): Q {
  for (let tries = 0; tries < 200; tries++) {
    const [u, , sym] = pick(UNITS);
    const kind = pick(['sphere-radius', 'cylinder-height', 'cone-height', 'pyramid-height'] as const);
    const shown = (v: number) => Number(dp(v, 1));

    if (kind === 'sphere-radius') {
      const r = getRandomInt(2, 20);
      const v = shown(4 * Math.PI * r * r * r / 3);
      const got = Math.cbrt(3 * v / (4 * Math.PI));
      return {
        subTopic: 'Finding a Missing Dimension from a Volume',
        difficulty: 'skill',
        variationId: 'volume.reverse',
        questionLines: [
          `A sphere has volume ${v} cubic ${u === 'cm' ? 'centimetres' : u === 'm' ? 'metres' : 'millimetres'}.`,
          `Calculate its diameter, correct to one decimal place.`,
        ],
        boardQuestionLines: [`Sphere of volume ${v}. Diameter?`],
        solutionSteps: [
          `<strong>1.</strong> Start from the formula and substitute the volume:<br><br>$${v} = \\frac{4}{3}\\pi r^{3}$`,
          `<strong>2.</strong> Rearrange for $r^{3}$:<br><br>$r^{3} = \\frac{3 \\times ${v}}{4\\pi}$`,
          `<strong>3.</strong> Take the cube root, then double it — the question asks for the <strong>diameter</strong>:<br><br>$r = ${dp(got, 3)}$, so $d = ${dp(2 * got)}$ ${sym}`,
        ],
        finalAnswer: `$${dp(2 * got)}$ ${sym}`,
      };
    }

    if (kind === 'pyramid-height') {
      const base = getRandomInt(6, 60);
      const h = getRandomInt(3, 20);
      const v = base * h / 3;
      if (!Number.isInteger(v)) continue;
      return {
        subTopic: 'Finding a Missing Dimension from a Volume',
        difficulty: 'skill',
        variationId: 'volume.reverse',
        questionLines: [
          `A pyramid with base area ${base} ${u}$^{2}$ has volume ${v} ${u}$^{3}$.`,
          `Calculate its height.`,
        ],
        boardQuestionLines: [`Pyramid, base area ${base}, volume ${v}. Height?`],
        solutionSteps: [
          `<strong>1.</strong> A pyramid is a third of the prism on the same base:<br><br>$V = \\frac{1}{3} \\times \\text{base area} \\times h$`,
          `<strong>2.</strong> Substitute and rearrange:<br><br>$${v} = \\frac{1}{3} \\times ${base} \\times h$, so $h = \\frac{3 \\times ${v}}{${base}} = ${v * 3 / base}$ ${sym}`,
        ],
        finalAnswer: `$${v * 3 / base}$ ${sym}`,
      };
    }

    const cone = kind === 'cone-height';
    const r = getRandomInt(2, 15);
    const h = getRandomInt(3, 25);
    const v = shown((cone ? 1 / 3 : 1) * Math.PI * r * r * h);
    const got = v / ((cone ? 1 / 3 : 1) * Math.PI * r * r);
    return {
      subTopic: 'Finding a Missing Dimension from a Volume',
      difficulty: 'skill',
      variationId: 'volume.reverse',
      questionLines: [
        `A ${cone ? 'cone' : 'cylinder'} has base radius ${r} ${u} and volume ${v} ${u}$^{3}$.`,
        `Calculate its height, correct to one decimal place.`,
      ],
      boardQuestionLines: [`${cone ? 'Cone' : 'Cylinder'}, radius ${r}, volume ${v}. Height?`],
      solutionSteps: [
        `<strong>1.</strong> Start from the formula:<br><br>$${cone ? 'V = \\frac{1}{3}\\pi r^{2} h' : 'V = \\pi r^{2} h'}$`,
        `<strong>2.</strong> Substitute what is known:<br><br>$${v} = ${cone ? '\\frac{1}{3} \\times ' : ''}\\pi \\times ${r}^{2} \\times h$`,
        `<strong>3.</strong> Divide to find $h$:<br><br>$h = ${dp(got)}$ ${sym}`,
      ],
      finalAnswer: `$${dp(got)}$ ${sym}`,
    };
  }
  throw new Error('volume.reverse: no valid question found');
}

export const MEASURE_GENERATORS: Record<string, () => Q> = {
  'Arc Length': () => sectorForward(true),
  'Sector Area': () => sectorForward(false),
  'Finding a Missing Value in a Sector': sectorReverse,
  'Volume of a Solid': volumeForward,
  'Finding a Missing Dimension from a Volume': volumeReverse,
};
