import { GeneratedQuestion } from './types';
import { getRandomInt } from './utils';
import { sector } from '../diagrams/shapes/sector';
import { circleSegment } from '../diagrams/shapes/circle-segment';
import { polygonInCircle } from '../diagrams/shapes/polygon-in-circle';
import { sectorInTriangle } from '../diagrams/shapes/sector-in-triangle';
import { similarSectors } from '../diagrams/shapes/similar-sectors';
import { renderScene } from '../diagrams/render';
import { verifyFigure } from '../diagrams/verify';

/**
 * Arcs and sectors — nine paper questions on one figure.
 *
 * Everything here is the same two facts, that an arc is its share of the
 * circumference and a sector its share of the area, run in whichever direction
 * the question needs. What makes them different questions is which of the
 * radius, the angle and the arc is missing, so that is how the variations are
 * split rather than by the formula they happen to use.
 *
 *   2016 P1 Q3, 2025 P2 Q6    radius and angle -> area
 *   2018 P2 Q2, 2019 P1 Q4,
 *   2023 P2 Q3                radius and angle -> arc
 *   2024 P2 Q15               radius and arc   -> area
 *   2017 P2 Q14, 2022 P2 Q10  radius and arc   -> angle
 *   2015 P2 Q10               angle and arc    -> radius
 *
 * Paper 1 sets these with pi taken as 3.14, which is not a rounding of the
 * answer but a different sum, so those carry it through the working.
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
type Q = Omit<GeneratedQuestion, 'topic'>;

const dp1 = (v: number) => v.toFixed(1);
const trim = (v: number) => `${Math.round(v * 10) / 10}`;

interface SectorContext {
  /** {0} is the centre, {1} and {2} the ends of the arc. */
  intro: (o: string, a: string, b: string) => string;
  unit: string;
  short: string;
  band: [number, number];
  /** Whether the situation implies a reflex angle, a minor one, or either. */
  sweep: 'minor' | 'major' | 'either';
  letters: [string, string, string];
}

const CONTEXTS: SectorContext[] = [
  { letters: ['C', 'A', 'B'], sweep: 'either', unit: 'centimetres', short: 'cm', band: [6, 40],
    intro: (o, a, b) => `The diagram shows a sector of a circle, centre $${o}$, with arc $${a}${b}$.` },
  { letters: ['O', 'A', 'B'], sweep: 'either', unit: 'centimetres', short: 'cm', band: [5, 30],
    intro: (o, a, b) => `The diagram shows part of a circle, centre $${o}$, and its arc $${a}${b}$.` },
  { letters: ['O', 'A', 'B'], sweep: 'minor', unit: 'centimetres', short: 'cm', band: [15, 45],
    intro: (o, a, b) => `A metronome arm sweeps out an arc of a circle, centre $${o}$, moving from $${a}$ to $${b}$.` },
  { letters: ['C', 'A', 'B'], sweep: 'major', unit: 'metres', short: 'm', band: [8, 22],
    intro: (o, a, b) => `A fairground ride carries a gondola on an arm which travels from $${a}$ to $${b}$ along the arc of a circle, centre $${o}$.` },
  { letters: ['C', 'A', 'B'], sweep: 'minor', unit: 'metres', short: 'm', band: [6, 14],
    intro: (o, a, b) => `The diagram shows part of a garden. A sprinkler at $${o}$ waters as far as $${a}${b}$, an arc of a circle with centre $${o}$.` },
  { letters: ['C', 'A', 'B'], sweep: 'minor', unit: 'centimetres', short: 'cm', band: [10, 30],
    intro: (o, a, b) => `A funnel is rolled from a sheet of card cut as a sector of a circle, centre $${o}$, with arc $${a}${b}$.` },
  { letters: ['O', 'P', 'Q'], sweep: 'minor', unit: 'centimetres', short: 'cm', band: [8, 26],
    intro: (o, a, b) => `A hand fan opens out into a sector of a circle, centre $${o}$, with arc $${a}${b}$.` },
  { letters: ['C', 'A', 'B'], sweep: 'minor', unit: 'centimetres', short: 'cm', band: [20, 50],
    intro: (o, a, b) => `A windscreen wiper turns about $${o}$, and the tip of its blade sweeps the arc $${a}${b}$.` },
  { letters: ['O', 'X', 'Y'], sweep: 'either', unit: 'metres', short: 'm', band: [10, 40],
    intro: (o, a, b) => `A radar at $${o}$ sweeps through the arc $${a}${b}$ of a circle.` },
  { letters: ['C', 'A', 'B'], sweep: 'minor', unit: 'centimetres', short: 'cm', band: [8, 24],
    intro: (o, a, b) => `A slice is cut from a circular cake, centre $${o}$, leaving the arc $${a}${b}$ on its crust.` },
  { letters: ['O', 'A', 'B'], sweep: 'major', unit: 'metres', short: 'm', band: [5, 18],
    intro: (o, a, b) => `A security camera at $${o}$ turns through the arc $${a}${b}$, covering all but a narrow blind spot.` },
  { letters: ['C', 'M', 'N'], sweep: 'minor', unit: 'centimetres', short: 'cm', band: [12, 36],
    intro: (o, a, b) => `A protractor is a sector of a circle, centre $${o}$, with arc $${a}${b}$.` },
];

/** Angles the papers use: whole degrees, and never a splinter or a near-circle. */
function drawAngle(sweep: SectorContext['sweep']): number {
  if (sweep === 'minor') return getRandomInt(20, 165);
  if (sweep === 'major') return getRandomInt(200, 340);
  return getRandomInt(0, 1) === 0 ? getRandomInt(20, 165) : getRandomInt(200, 340);
}

type Kind = 'area-angle' | 'arc-angle' | 'area-arc' | 'angle-arc' | 'radius-arc';

// ── the area of a segment: a sector less the triangle inside it ─────────────
// 2014 P2 Q13, a tunnel whose cross-section is the larger of the two pieces.
// Which piece is meant is carried by the shading alone, so the figure is not
// decoration here in any sense — without it the question cannot be asked.
const SEGMENT_CONTEXTS: {
  intro: (o: string, a: string, b: string) => string;
  asks: string; shade: 'minor' | 'major';
  /** The situation says which way up it goes, so the chord is drawn level. */
  level?: boolean;
  unit: string; short: string; band: [number, number];
}[] = [
  { intro: (o, a, b) => `The entrance to a tunnel is part of a circle, centre $${o}$. The floor of the tunnel is the chord $${a}${b}$, and the cross-section of the tunnel is shaded.`,
    asks: 'the shaded area', shade: 'major', level: true,
    unit: 'metres', short: 'm', band: [4, 12] },
  { intro: (o, a, b) => `A window is made from part of a circle, centre $${o}$, resting on the horizontal sill $${a}${b}$. The glass is shaded.`,
    asks: 'the shaded area', shade: 'major', level: true,
    unit: 'metres', short: 'm', band: [1, 4] },
  { intro: (o, a, b) => `A stone archway is part of a circle, centre $${o}$. The doorway below it is the chord $${a}${b}$, and the stone above is shaded.`,
    asks: 'the shaded area', shade: 'major', level: true,
    unit: 'metres', short: 'm', band: [1, 5] },
  { intro: (o, a, b) => `A pond is a circle, centre $${o}$, with a straight decking edge $${a}${b}$. The water is shaded.`,
    asks: 'the shaded area', shade: 'major', level: true,
    unit: 'metres', short: 'm', band: [2, 8] },
  { intro: (o, a, b) => `A porthole is a circle, centre $${o}$. Water covers it up to the level $${a}${b}$, and the part under water is shaded.`,
    asks: 'the shaded area', shade: 'minor', level: true,
    unit: 'centimetres', short: 'cm', band: [12, 34] },
  { intro: (o, a, b) => `A circular cake, centre $${o}$, has a straight cut $${a}${b}$ across it. The smaller of the two pieces is shaded.`,
    asks: 'the shaded area', shade: 'minor',
    unit: 'centimetres', short: 'cm', band: [10, 26] },
  { intro: (o, a, b) => `A circular badge, centre $${o}$, is divided by the chord $${a}${b}$. The enamelled part is shaded.`,
    asks: 'the shaded area', shade: 'minor',
    unit: 'centimetres', short: 'cm', band: [3, 9] },
  { intro: (o, a, b) => `A logo is a circle, centre $${o}$, cut by the chord $${a}${b}$.`,
    asks: 'the shaded area', shade: 'minor',
    unit: 'centimetres', short: 'cm', band: [4, 14] },
];

function segmentArea(): Q | null {
  const c = pick(SEGMENT_CONTEXTS);
  const nO = 'O', nA = pick(['A', 'M', 'P']), nB = { A: 'B', M: 'N', P: 'Q' }[nA] ?? 'B';
  const r = getRandomInt(c.band[0], c.band[1]);
  const angle = getRandomInt(40, 165);
  // Level means the chord lies flat with the centre above it, which puts the
  // major piece on top — a tunnel over its floor, glass above its sill.
  const start = c.level ? 270 - angle / 2 : getRandomInt(0, 11) * 30;

  const rad = Math.PI / 180;
  const sector = angle / 360 * Math.PI * r * r;
  const triangle = 0.5 * r * r * Math.sin(angle * rad);
  const minor = sector - triangle;
  const answer = c.shade === 'minor' ? minor : Math.PI * r * r - minor;
  if (answer < 4) return null;

  const fig = circleSegment({
    radius: r, angle, start, shade: c.shade, level: c.level,
    names: { centre: nO, a: nA, b: nB },
    labels: { radius: `${r} ${c.short}`, angle: `${angle}°` },
  });
  if (!fig) return null;

  const prose = [
    c.intro(nO, nA, nB),
    '',
    `The radius of the circle is ${r} ${c.unit}.`,
    `Angle $${nA}${nO}${nB}$ is $${angle}^{\\circ}$.`,
    `Calculate ${c.asks}.`,
    'Give your answer correct to one decimal place.',
  ];
  // 2014 P2 Q13 pays five separate marks and names each one: •¹ know how to
  // find the area of a segment at all, •² know to express the sector as a
  // fraction of a circle, •³ know how to find the sector's area, •⁴ know how to
  // find the triangle's area, •⁵ carry the calculations out. Three steps meant
  // the first hint arrived already holding the strategy and the fraction and
  // the sector area — most of what the question is testing.
  const steps = [
    `<strong>1.</strong> The segment is what is left when triangle $${nO}${nA}${nB}$ is taken away from sector $${nO}${nA}${nB}$, so find each in turn.`,
    `<strong>2.</strong> The sector is $\\frac{${angle}}{360}$ of the whole circle.`,
    `<strong>3.</strong> The whole circle has area $\\pi r^{2}$, so the sector is:<br><br>$\\frac{${angle}}{360} \\times \\pi \\times ${r}^{2} = ${dp1(sector)}$ ${c.short}$^{2}$`,
    `<strong>4.</strong> Triangle $${nO}${nA}${nB}$ has two sides of ${r} ${c.short} with that angle between them:<br><br>$\\frac{1}{2} \\times ${r} \\times ${r} \\times \\sin ${angle}^{\\circ} = ${dp1(triangle)}$ ${c.short}$^{2}$`,
    `<strong>5.</strong> Taking the triangle from the sector leaves the smaller piece:<br><br>$${dp1(sector)} - ${dp1(triangle)} = ${dp1(minor)}$ ${c.short}$^{2}$`,
  ];
  if (c.shade === 'major') {
    // the shaded major piece needs one more subtraction, which the scheme
    // folds into its last mark — "carry out all calculations correctly"
    steps[4] = `<strong>5.</strong> Taking the triangle from the sector leaves the smaller piece, and the shaded piece is the rest of the circle:<br><br>$${dp1(sector)} - ${dp1(triangle)} = ${dp1(minor)}$, then $\\pi \\times ${r}^{2} - ${dp1(minor)} = ${dp1(answer)}$ ${c.short}$^{2}$`;
  }
  if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) return null;

  return {
    subTopic: 'Area of a Segment of a Circle',
    difficulty: 'exam',
    variationId: c.shade === 'minor' ? 'sector.segment-minor' : 'sector.segment-major',
    questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(2)],
    boardQuestionLines: [`Circle radius ${r}, chord subtending ${angle}°. ${c.shade === 'minor' ? 'Smaller' : 'Larger'} piece?`],
    solutionSteps: steps,
    stepMarks: [1, 1, 1, 1, 1],
    finalAnswer: `$${dp1(answer)}$ ${c.short}$^{2}$`,
    figure: fig,
  };
}

// ── a regular polygon on a circle, one segment shaded ───────────────────────
// 2026 P2 Q10. The vertices divide the full turn equally, and that is the way
// in: 360 over the number of sides gives the angle at the centre, after which
// it is a sector less a triangle like any other segment.
const POLY_NAMES = [
  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
  ['P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y'],
];
const POLY_WORD: Record<number, string> = {
  5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon',
};

function polygonSegment(): Q | null {
  const n = pick([5, 6, 7, 8]);
  const letters = pick(POLY_NAMES).slice(0, n);
  const nO = 'O';
  const [unit, u]: [string, string] = pick([['centimetres', 'cm'], ['metres', 'm']]);
  const r = getRandomInt(unit === 'metres' ? 2 : 6, unit === 'metres' ? 9 : 26);
  const start = getRandomInt(0, 11) * 30;

  const step = 360 / n;
  const rad = Math.PI / 180;
  const sector = step / 360 * Math.PI * r * r;
  const triangle = 0.5 * r * r * Math.sin(step * rad);
  const answer = sector - triangle;
  if (answer < 1) return null;

  const fig = polygonInCircle({
    sides: n, radius: r, start, names: letters, centre: nO,
    radiusLabel: `${r} ${u}`,
  });
  if (!fig) return null;

  const prose = [
    `The vertices of a regular ${POLY_WORD[n]}, $${letters.join('')}$, lie on a circle with centre $${nO}$.`,
    '',
    `The radius of the circle is ${r} ${unit}.`,
    'Calculate the area of the shaded segment.',
    'Give your answer correct to one decimal place.',
  ];
  // 2026 P2 Q10 is five marks and has no published scheme, so the five are
  // inferred from 2014 P2 Q13 — the same segment with the angle handed over,
  // also five. There the opening mark is knowing a segment is a sector less a
  // triangle at all; here that goes on deriving the angle from the number of
  // vertices, and setting the sector up stays separate from evaluating it,
  // which is a split 2014's scheme is explicit about.
  const deg = step % 1 === 0 ? String(step) : step.toFixed(2);
  const steps = [
    `<strong>1.</strong> The ${n} vertices are spaced equally round the circle, so each angle at $${nO}$ is:<br><br>$360 \\div ${n} = ${deg}^{\\circ}$`,
    `<strong>2.</strong> The shaded piece is sector $${nO}${letters[0]}${letters[1]}$ with triangle $${nO}${letters[0]}${letters[1]}$ taken out of it, and the sector is $\\frac{${deg}}{360}$ of the whole circle.`,
    `<strong>3.</strong> The whole circle has area $\\pi r^{2}$, so the sector is:<br><br>$\\frac{${deg}}{360} \\times \\pi \\times ${r}^{2} = ${dp1(sector)}$ ${u}$^{2}$`,
    `<strong>4.</strong> Triangle $${nO}${letters[0]}${letters[1]}$ has two sides of ${r} ${u} with that angle between them:<br><br>$\\frac{1}{2} \\times ${r} \\times ${r} \\times \\sin ${deg}^{\\circ} = ${dp1(triangle)}$ ${u}$^{2}$`,
    `<strong>5.</strong> The segment is what is left when the triangle is taken from the sector:<br><br>$${dp1(sector)} - ${dp1(triangle)} = ${dp1(answer)}$ ${u}$^{2}$`,
  ];
  if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) return null;

  return {
    subTopic: 'A Polygon Inside a Circle',
    difficulty: 'exam',
    variationId: 'sector.polygon-segment',
    questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(2)],
    boardQuestionLines: [`Regular ${POLY_WORD[n]} on a circle, radius ${r} ${u}. Shaded segment?`],
    solutionSteps: steps,
    stepMarks: [1, 1, 1, 1, 1],
    finalAnswer: `$${dp1(answer)}$ ${u}$^{2}$`,
    figure: fig,
  };
}

export function sectorQuestion(kinds: Kind[]): Q {
  // chosen once, so a rejected layout retries this kind rather than another
  const kind = pick(kinds);
  // Paper 1 or Paper 2 is settled here too, for the same reason: re-rolling it
  // inside would let the easier one crowd out the other.
  //
  // This used to read `kind === 'area-angle'`, so the *arc* half never got a
  // Paper 1 draw even though 2019 P1 Q4 is one and is cited. The mechanism was
  // already here; only the gate was wrong.
  const paper1 = (kind === 'area-angle' || kind === 'arc-angle')
    && getRandomInt(0, 2) === 0;
  for (let tries = 0; tries < 3000; tries++) {
    const c = pick(CONTEXTS);
    const [nO, nA, nB] = c.letters;
    const r = getRandomInt(c.band[0], c.band[1]);
    const start = getRandomInt(0, 11) * 30;

    // Where the arc is a *given*, it is chosen first and the angle follows from
    // it. The other way round, the arc came out irrational, got printed to one
    // decimal place, and then the answer was still worked out from the exact
    // value — so a pupil using the number actually on the page was told they
    // were wrong by a tenth. Whatever the question prints is what the question
    // means, and everything after it has to be built from that.
    const arcGiven = kind === 'area-arc' || kind === 'angle-arc';
    let angle: number, arc: number;
    if (kind === 'radius-arc') {
      // Here the angle is a given too, printed in whole degrees, so it is
      // fixed first and the radius falls out of the two printed numbers. The
      // radius is the unknown, so it never has to be a round number itself.
      angle = drawAngle(c.sweep);
      arc = Math.round(angle / 360 * 2 * Math.PI * r * 10) / 10;
      if (arc <= 0) continue;
    } else if (arcGiven) {
      const rough = drawAngle(c.sweep) / 360 * 2 * Math.PI * r;
      arc = kind === 'area-arc' ? Math.round(rough) : Math.round(rough * 10) / 10;
      if (arc <= 0) continue;
      angle = arc * 360 / (2 * Math.PI * r);
      if (angle < 15 || angle > 345) continue;
    } else {
      angle = drawAngle(c.sweep);
      arc = angle / 360 * 2 * Math.PI * r;
    }
    const area = angle / 360 * Math.PI * r * r;
    // Paper 1 takes pi as 3.14 and expects it carried through, so those are a
    // different sum rather than a differently rounded answer
    const PI = paper1 ? 3.14 : Math.PI;

    const shown = {
      radius: `${r} ${c.short}`,
      angle: `${Math.round(angle)}°`,
      arc: `${trim(arc)} ${c.short}`,
    };
    // `sector` returns null when the numbers cannot be drawn, and `Q.figure`
    // is optional rather than nullable. Both mean the same thing to the retry
    // below - `if (!q.figure) continue` - so the conversion loses nothing.
    const built = (labels: { radius: string; angle: string; arc: string }) =>
      sector({ radius: r, angle, start, names: { centre: nO, a: nA, b: nB }, labels })
      ?? undefined;

    const facts = {
      radius: `The radius of the circle is ${r} ${c.unit}.`,
      angle: `Angle $${nA}${nO}${nB}$ is $${Math.round(angle)}^{\\circ}$.`,
      arc: `The length of ${angle > 180 ? 'major ' : ''}arc $${nA}${nB}$ is ${trim(arc)} ${c.unit}.`,
    };
    const share = `<strong>1.</strong> The sector is $\\frac{${Math.round(angle)}}{360}$ of the whole circle.`;

    let q: Q | null = null;

    if (kind === 'area-angle') {
      const ans = angle / 360 * PI * r * r;
      q = {
        subTopic: 'Area of a Sector',
        difficulty: 'exam',
        variationId: paper1 ? 'sector.area-angle-pi314' : 'sector.area-angle',
        questionLines: [c.intro(nO, nA, nB), '', facts.radius, facts.angle,
          `Calculate the area of the sector.`,
          paper1 ? 'Take $\\pi = 3\\cdot 14$.' : 'Give your answer correct to one decimal place.'],
        boardQuestionLines: [`Sector radius ${r}, angle ${Math.round(angle)}°. Area?`],
        solutionSteps: [
          share,
          `<strong>2.</strong> The whole circle has area $\\pi r^{2}$:<br><br>$\\text{Area} = \\frac{${Math.round(angle)}}{360} \\times ${paper1 ? '3\\cdot 14' : '\\pi'} \\times ${r}^{2}$`,
          `<strong>3.</strong> Evaluate:<br><br>$\\text{Area} = ${paper1 ? `${Math.round(ans * 100) / 100}` : dp1(ans)}$ ${c.short}$^{2}$`,
        ],
        // •¹ appropriate fraction, •² substitution into the area formula,
        // •³ calculate the area
        stepMarks: [1, 1, 1],
        finalAnswer: `$${paper1 ? `${Math.round(ans * 100) / 100}` : dp1(ans)}$ ${c.short}$^{2}$`,
        figure: built({ radius: shown.radius, angle: shown.angle, arc: '' }),
      };
    } else if (kind === 'arc-angle') {
      // With pi taken as 3.14 the arc is a different number, so it is worked
      // out from PI rather than rounded differently at the end.
      const arcAns = angle / 360 * 2 * PI * r;
      const ans = paper1 ? `${Math.round(arcAns * 100) / 100}` : dp1(arcAns);
      q = {
        subTopic: 'Length of an Arc',
        difficulty: 'exam',
        variationId: paper1 ? 'sector.arc-angle-pi314' : 'sector.arc-angle',
        questionLines: [c.intro(nO, nA, nB), '', facts.radius, facts.angle,
          `Calculate the length of ${angle > 180 ? 'major ' : ''}arc $${nA}${nB}$.`,
          paper1 ? 'Take $\\pi = 3\\cdot 14$.'
                 : 'Give your answer correct to one decimal place.'],
        boardQuestionLines: [`Sector radius ${r}, angle ${Math.round(angle)}°. Arc length?`],
        solutionSteps: [
          share,
          `<strong>2.</strong> The whole circumference is $\\pi d$, and the diameter is twice the radius:<br><br>$\\text{Arc} = \\frac{${Math.round(angle)}}{360} \\times ${paper1 ? '3\\cdot 14' : '\\pi'} \\times ${2 * r}$`,
          `<strong>3.</strong> Evaluate:<br><br>$\\text{Arc} = ${ans}$ ${c.short}`,
        ],
        // •¹ appropriate fraction, •² consistent substitution, •³ calculate
        stepMarks: [1, 1, 1],
        finalAnswer: `$${ans}$ ${c.short}`,
        figure: built({ radius: shown.radius, angle: shown.angle, arc: '' }),
      };
    } else if (kind === 'area-arc') {
      q = {
        subTopic: 'Area of a Sector',
        difficulty: 'exam',
        variationId: 'sector.area-arc',
        questionLines: [c.intro(nO, nA, nB), '', facts.radius, facts.arc,
          'Calculate the area of the sector.',
          'Give your answer correct to one decimal place.'],
        boardQuestionLines: [`Radius ${r}, arc ${trim(arc)}. Sector area?`],
        // 2024 P2 Q15: •¹ the correct fraction, or start the strategy for
        // finding the angle, •² know how to calculate the sector's area,
        // •³ calculate it
        solutionSteps: [
          `<strong>1.</strong> The arc is a known fraction of the circumference, and that fraction gives the angle:<br><br>$\\frac{${trim(arc)}}{\\pi \\times ${2 * r}} \\times 360 = ${Math.round(angle)}^{\\circ}$`,
          `<strong>2.</strong> The area of a sector is half its arc times its radius:<br><br>$\\text{Area} = \\frac{1}{2} \\times ${trim(arc)} \\times ${r}$`,
          `<strong>3.</strong> Work that out:<br><br>$\\text{Area} = ${dp1(arc * r / 2)}$ ${c.short}$^{2}$`,
        ],
        stepMarks: [1, 1, 1],
        finalAnswer: `$${dp1(arc * r / 2)}$ ${c.short}$^{2}$`,
        figure: built({ radius: shown.radius, angle: '', arc: shown.arc }),
      };
    } else if (kind === 'angle-arc') {
      q = {
        subTopic: 'Finding the Angle of a Sector',
        difficulty: 'exam',
        variationId: 'sector.angle-arc',
        questionLines: [c.intro(nO, nA, nB), '', facts.radius, facts.arc,
          `Calculate the size of ${angle > 180 ? 'reflex ' : ''}angle $${nA}${nO}${nB}$.`],
        boardQuestionLines: [`Radius ${r}, arc ${trim(arc)}. Angle?`],
        // •¹ an expression for the arc length, or the arc-to-circumference
        // ratio, •² know how to find the angle from it, •³ calculate the angle
        solutionSteps: [
          `<strong>1.</strong> The whole circumference is $\\pi d$, so the arc is this fraction of it:<br><br>$\\frac{${trim(arc)}}{\\pi \\times ${2 * r}}$`,
          `<strong>2.</strong> The angle is the same fraction of a full turn:<br><br>$\\frac{${trim(arc)}}{\\pi \\times ${2 * r}} \\times 360$`,
          `<strong>3.</strong> Work that out:<br><br>$${Math.round(angle)}^{\\circ}$`,
        ],
        stepMarks: [1, 1, 1],
        finalAnswer: `$${Math.round(angle)}^{\\circ}$`,
        figure: built({ radius: shown.radius, angle: '', arc: shown.arc }),
      };
    } else {
      q = {
        subTopic: 'Finding the Radius from an Arc',
        difficulty: 'exam',
        variationId: 'sector.radius-arc',
        questionLines: [c.intro(nO, nA, nB), '', facts.angle, facts.arc,
          'Calculate the radius of the circle.',
          'Give your answer correct to one decimal place.'],
        boardQuestionLines: [`Angle ${Math.round(angle)}°, arc ${trim(arc)}. Radius?`],
        // 2015 P2 Q10 is four marks, not three: •¹ the correct fraction of the
        // circle, •² construct the equation, •³ know how to solve it, •⁴ solve
        // it and state the length
        solutionSteps: [
          share,
          `<strong>2.</strong> That fraction of the circumference $2\\pi r$ is the arc, which gives an equation for $r$:<br><br>$\\frac{${Math.round(angle)}}{360} \\times 2\\pi r = ${trim(arc)}$`,
          `<strong>3.</strong> Undo the fraction first, to get the whole circumference:<br><br>$2\\pi r = ${trim(arc)} \\div \\frac{${Math.round(angle)}}{360} = ${dp1(arc * 360 / angle)}$ ${c.short}`,
          `<strong>4.</strong> Then divide by $2\\pi$:<br><br>$r = \\frac{${dp1(arc * 360 / angle)}}{2\\pi} = ${dp1(arc * 360 / (2 * Math.PI * angle))}$ ${c.short}`,
        ],
        stepMarks: [1, 1, 1, 1],
        finalAnswer: `$${dp1(arc * 360 / (2 * Math.PI * angle))}$ ${c.short}`,
        figure: sector({
        // drawn at the radius the printed numbers imply, not the one they were
        // generated from, so the picture and the answer are the same circle
        radius: arc * 360 / (2 * Math.PI * angle), angle, start,
        names: { centre: nO, a: nA, b: nB },
        labels: { radius: '', angle: shown.angle, arc: shown.arc },
      // the one branch that does not go through `built`, because it draws at
      // the radius the printed numbers imply rather than the generated one
      }) ?? undefined,
      };
    }

    // The chain above covers every `kind`, but nothing tells the compiler so,
    // and a `kind` added without a branch should retry rather than throw.
    if (!q) continue;
    if (!q.figure) continue;
    const text = [...(q.questionLines ?? []), ...(q.solutionSteps ?? [])].join(' ');
    if (verifyFigure(q.figure, text).length) continue;
    q.questionLines = [q.questionLines![0], renderScene(q.figure.scene),
      ...q.questionLines!.slice(2)];
    return q;
  }
  throw new Error('sector: no valid question found');
}

// ── a sector cut out of a triangle — 2018 P2 Q17 ─────────────────────────
//
// The shaded area is the triangle minus the sector, and what makes it one
// question rather than two is that **they share the angle at O**: A lies on OB
// and D on OC, so the 75 degrees marked at O is the sector's angle and the
// triangle's at once. Five marks, and the scheme buys the two areas separately
// before it buys the subtraction.

function sectorInTriangleQuestion(): Q | null {
  const angle = pick([30, 40, 45, 50, 60, 70, 75, 80, 100, 110, 120, 130]);
  const r = getRandomInt(8, 30);
  // Both triangle sides well clear of the radius, or there is no crescent left
  // to shade — and the figure rejects such a layout anyway.
  const ob = r + getRandomInt(4, 26);
  const oc = ob + getRandomInt(4, 26);

  const triangle = 0.5 * ob * oc * Math.sin(angle * Math.PI / 180);
  const sectorArea = (angle / 360) * Math.PI * r * r;
  const shaded = triangle - sectorArea;
  // A sliver reads as a drawing error rather than as an answer.
  if (shaded < triangle * 0.2) return null;

  const fig = sectorInTriangle({
    radius: r, ob, oc, angle,
    names: { o: 'O', a: 'A', b: 'B', d: 'D', c: 'C' },
    angleLabel: `${angle}°`,
  });
  if (!fig) return null;

  const prose = [
    'In the diagram below AOD is a sector of a circle, with centre O, and BOC is a triangle.',
    renderScene(fig.scene),
    `In sector AOD:<br>&bull;&nbsp;&nbsp;radius = ${r} centimetres<br>&bull;&nbsp;&nbsp;angle AOD = $${angle}^{\\circ}$.`,
    `In triangle OBC:<br>&bull;&nbsp;&nbsp;OB = ${ob} centimetres<br>&bull;&nbsp;&nbsp;OC = ${oc} centimetres.`,
    'Calculate the area of the shaded region, ABCD.',
  ];
  const steps = [
    `<strong>1.</strong> The triangle has two sides and the angle between them, so use $\\frac{1}{2}ab\\sin C$:<br><br>$\\frac{1}{2} \\times ${ob} \\times ${oc} \\times \\sin ${angle}^{\\circ} = ${triangle.toFixed(2)}$`,
    `<strong>2.</strong> The sector is its share of a full circle, and its angle is the same $${angle}^{\\circ}$:<br><br>$\\frac{${angle}}{360}$`,
    `<strong>3.</strong> Put that share into the area of the whole circle:<br><br>$\\frac{${angle}}{360} \\times \\pi \\times ${r}^{2} = ${sectorArea.toFixed(2)}$`,
    `<strong>4.</strong> The shaded region is what is left of the triangle once the sector is taken out of it:<br><br>area of triangle $-$ area of sector`,
    `<strong>5.</strong> So the shaded area is:<br><br>$${triangle.toFixed(2)} - ${sectorArea.toFixed(2)} = ${shaded.toFixed(1)}$ cm$^{2}$`,
  ];
  if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) return null;

  return {
    subTopic: 'A Sector Cut Out of a Triangle',
    difficulty: 'exam',
    variationId: 'sector.triangle-minus-sector',
    questionLines: prose,
    boardQuestionLines: [
      `Triangle OBC, OB ${ob}, OC ${oc}, angle ${angle}°; sector radius ${r}. Shaded area?`,
    ],
    solutionSteps: steps,
    // 2018 P2 Q17: •¹ the triangle, •² the fraction, •³ the sector,
    // •⁴ know to subtract, •⁵ evaluate with units.
    stepMarks: [1, 1, 1, 1, 1],
    finalAnswer: `$${shaded.toFixed(1)}$ cm$^{2}$`,
    figure: fig,
  };
}

// ── two similar sectors — 2019 P2 Q12 ────────────────────────────────────
//
// The radii are on the drawing and nowhere else, which is why this one needs a
// figure at all. Two independent parts: scale the area down by the square of
// the linear factor, then recover the angle from the larger sector's own area.
// Part (b) does not use part (a), so a pupil who gets (a) wrong can still earn
// all three marks of (b).

function similarSectorsQuestion(): Q | null {
  const angle = pick([100, 110, 120, 126, 130, 140, 150]);
  const big = pick([40, 45, 50, 55, 60]);
  // A ratio near one draws the same picture twice — the fault the similar
  // rectangles turned up at 7 : 8.
  const small = Math.round(big * pick([0.4, 0.5, 0.6, 0.6, 0.7]));
  if (small < 12 || small >= big * 0.8) return null;

  const area = (angle / 360) * Math.PI * big * big;
  // The paper states a whole number of square centimetres. Only combinations
  // that give a round one are set: otherwise part (b) recovers the angle from a
  // rounded area and the answer disagrees with the angle actually drawn.
  const stated = Math.round(area / 10) * 10;
  if (Math.abs(stated - area) > area * 0.004) return null;
  const smallArea = stated * (small / big) ** 2;
  if (Math.abs(smallArea - Math.round(smallArea)) > 1e-9) return null;
  const backAngle = (stated * 360) / (Math.PI * big * big);

  const fig = similarSectors({
    largeRadius: big, smallRadius: small, angle,
    largeNames: ['C', 'A', 'B'], smallNames: ['F', 'D', 'E'],
    labels: { large: `${big} cm`, small: `${small} cm` },
  });
  if (!fig) return null;

  const prose = [
    'In the diagram<br>&bull;&nbsp;&nbsp;ABC is a sector of a circle, centre C<br>&bull;&nbsp;&nbsp;DEF is a sector of a circle, centre F.',
    renderScene(fig.scene),
    'The sectors are mathematically similar.',
    `The area of the larger sector, ABC, is ${stated} square centimetres.`,
    '<b>(a)</b>&nbsp;&nbsp;Calculate the area of the smaller sector, DEF.',
    '<b>(b)</b>&nbsp;&nbsp;Calculate the size of angle ACB.',
  ];
  const steps = [
    `<strong>1. (a)</strong> The linear scale factor is the ratio of the radii:<br><br>$\\frac{${small}}{${big}}$`,
    `<strong>2. (a)</strong> Areas scale by the <strong>square</strong> of that factor:<br><br>$${stated} \\times \\left(\\frac{${small}}{${big}}\\right)^{2}$`,
    `<strong>3. (a)</strong> Work it out:<br><br>$${Math.round(smallArea)}$ cm$^{2}$`,
    `<strong>4. (b)</strong> The larger sector's area is its share of the whole circle:<br><br>$\\frac{\\text{angle}}{360} \\times \\pi \\times ${big}^{2} = ${stated}$`,
    `<strong>5. (b)</strong> Rearrange to get the angle on its own:<br><br>$\\text{angle} = \\frac{${stated} \\times 360}{\\pi \\times ${big}^{2}}$`,
    `<strong>6. (b)</strong> Work it out:<br><br>$${backAngle.toFixed(0)}^{\\circ}$`,
  ];
  if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) return null;

  return {
    subTopic: 'Two Similar Sectors',
    difficulty: 'exam',
    variationId: 'sector.similar-sectors',
    questionLines: prose,
    boardQuestionLines: [
      `Similar sectors, radii ${big} cm and ${small} cm; larger has area ${stated} cm². Find the smaller area and the angle.`,
    ],
    solutionSteps: steps,
    // 2019 P2 Q12: (a) •¹ scale factor, •² square it, •³ evaluate.
    // (b) •⁴ the area expression, •⁵ rearrange, •⁶ evaluate.
    stepMarks: [1, 1, 1, 1, 1, 1],
    finalAnswer: `(a) $${Math.round(smallArea)}$ cm$^{2}$<br>(b) $${backAngle.toFixed(0)}^{\\circ}$`,
    figure: fig,
  };
}

export const SECTOR_GENERATORS: Record<string, () => Q> = {
  'A Sector Cut Out of a Triangle': () => {
    for (let i = 0; i < 4000; i++) {
      const q = sectorInTriangleQuestion();
      if (q) return q;
    }
    throw new Error('sector.triangle-minus-sector: no valid question found');
  },
  'Two Similar Sectors': () => {
    for (let i = 0; i < 6000; i++) {
      const q = similarSectorsQuestion();
      if (q) return q;
    }
    throw new Error('sector.similar-sectors: no valid question found');
  },
  'A Polygon Inside a Circle': () => {
    for (let i = 0; i < 3000; i++) {
      const q = polygonSegment();
      if (q) return q;
    }
    throw new Error('polygon segment: no valid question found');
  },
  'Area of a Segment of a Circle': () => {
    for (let i = 0; i < 3000; i++) {
      const q = segmentArea();
      if (q) return q;
    }
    throw new Error('segment: no valid question found');
  },
  'Area of a Sector': () => sectorQuestion(['area-angle', 'area-arc']),
  'Length of an Arc': () => sectorQuestion(['arc-angle']),
  'Finding the Angle of a Sector': () => sectorQuestion(['angle-arc']),
  'Finding the Radius from an Arc': () => sectorQuestion(['radius-arc']),
};
