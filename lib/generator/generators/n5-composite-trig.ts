import { GeneratedQuestion } from './types';
import { getRandomInt } from './utils';
import { apexOverBase } from '../diagrams/shapes/apex-over-base';
import { splitSide } from '../diagrams/shapes/split-side';
import { regularPolygon } from '../diagrams/shapes/regular-polygon';
import { renderScene } from '../diagrams/render';
import { verifyFigure } from '../diagrams/verify';

/**
 * The five-mark composite questions: two triangles, one answer.
 *
 * What makes these harder than a single application of a rule is that neither
 * triangle has enough in it on its own. An angle is found in the wide triangle
 * and carried into the narrow one, or a side is found in the narrow one and
 * carried out. The figure is what tells a pupil the two triangles share an
 * edge, so it is not optional here in the way a plain triangle's picture is.
 *
 *   2019 P2 Q19  two people watch a balloon, 350 m apart — find its height
 *   2022 P2 Q14  two elevations to a tree across a river — find the width
 *   2024 P2 Q13  triangle ABC, two base angles, BD perpendicular — find BD
 *
 * 2019 and 2024 are the same computation: a base and the angle at each end fix
 * the height over it. They differ only in whether the foot is drawn, so they
 * are one construction with the picture told which points to show.
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
type Q = Omit<GeneratedQuestion, 'topic'>;

const DEG = Math.PI / 180;
const cot = (d: number) => 1 / Math.tan(d * DEG);
const dp1 = (v: number) => v.toFixed(1);

/**
 * These contexts stay here rather than in n5-contexts.ts because each one
 * assigns roles in *this* figure — who stands at each end of the base, and
 * what the vertical is. They do not transfer to another shape.
 */
interface Watchers {
  intro: (k: string, m: string, b: string) => string;
  /** The two on the base, then the thing overhead. */
  who: [string, string, string];
  asks: string;
  unit: 'metres' | 'kilometres';
  band: [number, number];
  letters: [string, string, string];
}

const WATCHERS: Watchers[] = [
  { letters: ['E', 'F', 'P'], who: ['Erin', 'Fraser', 'the parachutist'],
    intro: (e, f, p) => `Erin and Fraser are watching a parachutist descend. In the diagram below, $${e}$, $${f}$ and $${p}$ show the positions of Erin, Fraser and the parachutist.`,
    asks: 'the height of the parachutist above the ground', unit: 'metres', band: [180, 600] },
  { letters: ['P', 'Q', 'H'], who: ['Priya', 'Quinn', 'the helicopter'],
    intro: (p, q, h) => `Priya and Quinn are watching a rescue helicopter hover. In the diagram $${p}$, $${q}$ and $${h}$ show the positions of Priya, Quinn and the helicopter.`,
    asks: 'the height of the helicopter above the ground', unit: 'metres', band: [150, 520] },
  { letters: ['A', 'B', 'D'], who: ['the first observer', 'the second observer', 'the drone'],
    intro: (a, b, d) => `Two observers at $${a}$ and $${b}$ are tracking a drone at $${d}$.`,
    asks: 'the height of the drone above the ground', unit: 'metres', band: [120, 420] },
  { letters: ['S', 'T', 'K'], who: ['Sam', 'Tara', 'the kite'],
    intro: (s, t, k) => `Sam and Tara are flying a kite. In the diagram $${s}$, $${t}$ and $${k}$ represent the positions of Sam, Tara and the kite.`,
    asks: 'the height of the kite above the ground', unit: 'metres', band: [60, 260] },
  { letters: ['C', 'D', 'F'], who: ['the first coastguard', 'the second coastguard', 'the flare'],
    intro: (c, d, f) => `Two coastguards at $${c}$ and $${d}$ see a distress flare at $${f}$.`,
    asks: 'the height of the flare above sea level', unit: 'metres', band: [200, 700] },
  { letters: ['R', 'S', 'E'], who: ['Rory', 'Sasha', 'the eagle'],
    intro: (r, s, e) => `Rory and Sasha are watching a golden eagle circling. In the diagram $${r}$, $${s}$ and $${e}$ show the positions of Rory, Sasha and the eagle.`,
    asks: 'the height of the eagle above the ground', unit: 'metres', band: [220, 800] },
  { letters: ['J', 'L', 'F'], who: ['Jo', 'Leah', 'the firework'],
    intro: (j, l, f) => `Jo and Leah are watching a firework display. In the diagram $${j}$, $${l}$ and $${f}$ represent the positions of Jo, Leah and one firework.`,
    asks: 'the height of the firework above the ground', unit: 'metres', band: [90, 340] },
  { letters: ['G', 'H', 'P'], who: ['the first ranger', 'the second ranger', 'the peak'],
    intro: (g, h, p) => `Two rangers standing at $${g}$ and $${h}$ sight the peak of a hill at $${p}$.`,
    asks: 'the height of the peak above the rangers', unit: 'metres', band: [300, 950] },
  { letters: ['N', 'O', 'A'], who: ['Nia', 'Omar', 'the aircraft'],
    intro: (n, o, a) => `Nia and Omar are plane spotting. In the diagram $${n}$, $${o}$ and $${a}$ show the positions of Nia, Omar and an aircraft.`,
    asks: 'the height of the aircraft above the ground', unit: 'metres', band: [400, 999] },
  { letters: ['B', 'C', 'L'], who: ['the first surveyor', 'the second surveyor', 'the light'],
    intro: (b, c, l) => `Two surveyors at $${b}$ and $${c}$ measure the angle up to a warning light at $${l}$ on a crane.`,
    asks: 'the height of the light above the ground', unit: 'metres', band: [70, 240] },
  { letters: ['V', 'W', 'G'], who: ['Vik', 'Wren', 'the glider'],
    intro: (v, w, g) => `Vik and Wren are tracking a glider. In the diagram $${v}$, $${w}$ and $${g}$ represent the positions of Vik, Wren and the glider.`,
    asks: 'the height of the glider above the ground', unit: 'metres', band: [250, 880] },
];

/** The 2022 shape: one vertical, and two elevations to its top from a line. */
interface Elevation {
  intro: (a: string, b: string, c: string, d: string) => string;
  /** The vertical, then the near stretch that is being asked for. */
  vertical: string;
  near: string;
  asks: (b: string, c: string) => string;
  unit: 'metres';
  band: [number, number];
  letters: [string, string, string, string];
}

const ELEVATIONS: Elevation[] = [
  { letters: ['A', 'B', 'C', 'D'],
    intro: (a, b, c, d) => `$${b}${c}$ represents the width of a canal in the diagram below. $${a}${b}$ represents a lamp post on the towpath. $${b}${c}${d}$ is a straight line.`,
    vertical: 'lamp post', near: 'canal', asks: (b, c) => `$${b}${c}$, the width of the canal`,
    unit: 'metres', band: [10, 30] },
  { letters: ['T', 'F', 'G', 'H'],
    intro: (t, f, g, h) => `A flagpole $${t}${f}$ stands vertically on level ground. $${f}${g}${h}$ is a straight line along the ground.`,
    vertical: 'flagpole', near: '', asks: (f, g) => `the distance $${f}${g}$`,
    unit: 'metres', band: [8, 26] },
  { letters: ['P', 'Q', 'R', 'S'],
    intro: (p, q, r, s) => `A cliff $${p}${q}$ rises vertically from a beach. $${q}${r}${s}$ is a straight line along the beach.`,
    vertical: 'cliff', near: '', asks: (q, r) => `the distance $${q}${r}$`,
    unit: 'metres', band: [12, 40] },
  { letters: ['M', 'N', 'V', 'W'],
    intro: (m, n, v, w) => `A radio mast $${m}${n}$ stands vertically. $${n}${v}${w}$ is a straight line on level ground.`,
    vertical: 'mast', near: '', asks: (n, v) => `the distance $${n}${v}$`,
    unit: 'metres', band: [15, 45] },
  { letters: ['L', 'B', 'C', 'D'],
    intro: (l, b, c, d) => `A lighthouse $${l}${b}$ stands on a rock. $${b}${c}${d}$ is a straight line along the shore.`,
    vertical: 'lighthouse', near: '', asks: (b, c) => `the distance $${b}${c}$`,
    unit: 'metres', band: [14, 38] },
  { letters: ['W', 'X', 'Y', 'Z'],
    intro: (w, x, y, z) => `A wind turbine tower $${w}${x}$ stands vertically on a moor. $${x}${y}${z}$ is a straight line on level ground.`,
    vertical: 'tower', near: '', asks: (x, y) => `the distance $${x}${y}$`,
    unit: 'metres', band: [20, 55] },
  { letters: ['A', 'B', 'C', 'D'],
    intro: (a, b, c, d) => `A climbing wall $${a}${b}$ rises vertically from the floor of a sports hall. $${b}${c}${d}$ is a straight line along the floor.`,
    vertical: 'wall', near: '', asks: (b, c) => `the distance $${b}${c}$`,
    unit: 'metres', band: [6, 20] },
  { letters: ['S', 'T', 'U', 'V'],
    intro: (s, t, u, v) => `A ship's mast $${s}${t}$ stands vertically on the deck. $${t}${u}${v}$ is a straight line along the deck.`,
    vertical: 'mast', near: '', asks: (t, u) => `the distance $${t}${u}$`,
    unit: 'metres', band: [7, 22] },
  { letters: ['C', 'D', 'E', 'F'],
    intro: (c, d, e, f) => `A chimney $${c}${d}$ stands vertically. $${d}${e}${f}$ is a straight line on level ground.`,
    vertical: 'chimney', near: '', asks: (d, e) => `the distance $${d}${e}$`,
    unit: 'metres', band: [18, 50] },
  { letters: ['G', 'H', 'J', 'K'],
    intro: (g, h, j, k) => `A gorge is spanned by a vertical support $${g}${h}$. $${h}${j}${k}$ is a straight line along the valley floor.`,
    vertical: 'support', near: '', asks: (h, j) => `the distance $${h}${j}$`,
    unit: 'metres', band: [16, 44] },
  { letters: ['P', 'T', 'R', 'S'],
    intro: (p, t, r, s) => `A pylon $${p}${t}$ stands vertically in a field. $${t}${r}${s}$ is a straight line across the field.`,
    vertical: 'pylon', near: '', asks: (t, r) => `the distance $${t}${r}$`,
    unit: 'metres', band: [22, 60] },
];

// ── a base and the angle at each end fix the height over it ─────────────────
// 2019 P2 Q19 and 2024 P2 Q13. Sine rule for one slant side, then the right
// angle at the foot for the height — two triangles, and neither does it alone.
function heightOverBase(bare: boolean): Q | null {
  const alpha = getRandomInt(26, 68);
  const gamma = getRandomInt(26, 68);
  if (Math.abs(alpha - gamma) < 6 || alpha + gamma > 128) return null;
  const w = pick(WATCHERS);
  const L = bare ? getRandomInt(12, 40) : getRandomInt(w.band[0], w.band[1]);
  const unit = bare ? 'centimetres' : w.unit;
  const short = bare ? 'cm' : 'm';

  const h = L / (cot(alpha) + cot(gamma));
  if (h < L * 0.28 || h > L * 1.15) return null;
  const foot = h * cot(alpha);
  // the slant side the sine rule finds first, opposite the far angle
  const slant = L * Math.sin(gamma * DEG) / Math.sin((alpha + gamma) * DEG);

  const [nA, nC, nB] = bare ? ['A', 'C', 'B'] : w.letters;
  const nD = 'D';
  const fig = apexOverBase({
    base: [nA, bare ? nD : '', nC], apex: nB, over: 1,
    at: [0, foot, L], height: h,
    spans: [{ from: 0, to: 2, text: `${L} ${short}`, value: L }],
    legs: [],
    angles: [
      { at: 0, toward: 2, degrees: alpha, label: `${alpha}°` },
      { at: 2, toward: 0, degrees: gamma, label: `${gamma}°` },
    ],
    draw: bare ? [0, 1, 2] : [0, 2],
    dashed: bare ? 1 : undefined,
    rightAngle: bare,
  });
  if (!fig) return null;

  const prose = bare ? [
    `In triangle $${nA}${nB}${nC}$:`,
    `$${nA}${nC} = ${L}$ centimetres`,
    `angle $${nB}${nA}${nC} = ${alpha}^{\\circ}$`,
    `angle $${nB}${nC}${nA} = ${gamma}^{\\circ}$`,
    `$${nB}${nD}$ is perpendicular to $${nA}${nC}$.`,
    `Calculate the length of $${nB}${nD}$.`,
  ] : [
    w.intro(nA, nC, nB),
    `The angle of elevation of ${w.who[2]} from ${w.who[0]} is $${alpha}^{\\circ}$`,
    `The angle of elevation of ${w.who[2]} from ${w.who[1]} is $${gamma}^{\\circ}$`,
    `${cap(w.who[0])} and ${w.who[1]} are ${L} ${unit} apart on level ground`,
    `Calculate ${w.asks}.`,
  ];
  // 2019 never marks the foot of the perpendicular, so the working cannot name
  // it either — a letter in the solution that is nowhere on the diagram is
  // worse than no letter at all.
  const wanted = bare ? `${nB}${nD}` : '\\text{height}';
  const apex = 180 - alpha - gamma;
  // 2019 P2 Q19 and 2024 P2 Q13 are both five marks with the same five:
  // •¹ correct substitution into the sine rule, •² rearrange it, •³ calculate
  // the intermediate length, •⁴ consistent substitution into the right-angled
  // trig formula, •⁵ calculate the length asked for. Finding the third angle is
  // not a mark of its own, and rearranging is — the reverse of how this was set
  // out, which put two marks in one step twice over.
  const steps = [
    `<strong>1.</strong> The angles of triangle $${nA}${nB}${nC}$ add to $180^{\\circ}$, so $${nA}${nB}${nC} = 180 - ${alpha} - ${gamma} = ${apex}^{\\circ}$. The sine rule pairs $${nA}${nB}$ with the angle at $${nC}$, and $${nA}${nC}$ with the angle at $${nB}$:<br><br>$\\frac{${nA}${nB}}{\\sin ${gamma}^{\\circ}} = \\frac{${L}}{\\sin ${apex}^{\\circ}}$`,
    `<strong>2.</strong> Rearrange to make $${nA}${nB}$ the subject:<br><br>$${nA}${nB} = \\frac{${L} \\times \\sin ${gamma}^{\\circ}}{\\sin ${apex}^{\\circ}}$`,
    `<strong>3.</strong> Work that out:<br><br>$${nA}${nB} = ${dp1(slant)}$ ${short}`,
    `<strong>4.</strong> ${bare
      ? `$${nB}${nD}$ is perpendicular to $${nA}${nC}$, so triangle $${nA}${nB}${nD}$ is right-angled at $${nD}$`
      : `The height is measured straight down to level ground, so it makes a right-angled triangle with $${nA}${nB}$`}:<br><br>$\\sin ${alpha}^{\\circ} = \\frac{${wanted}}{${dp1(slant)}}$`,
    `<strong>5.</strong> Rearrange and evaluate:<br><br>$${wanted} = ${dp1(slant)} \\times \\sin ${alpha}^{\\circ} = ${dp1(h)}$ ${short}`,
  ];
  if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) return null;

  return {
    subTopic: bare ? 'A Perpendicular Inside a Triangle' : 'Two Angles of Elevation',
    difficulty: 'exam',
    variationId: bare ? 'composite.perpendicular-in-triangle' : 'composite.height-from-two-angles',
    questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
    boardQuestionLines: [`Base ${L} ${short}, base angles ${alpha}° and ${gamma}°. Height?`],
    solutionSteps: steps,
    stepMarks: [1, 1, 1, 1, 1],
    finalAnswer: `$${dp1(h)}$ ${unit}`,
    figure: fig,
  };
}

// ── two elevations along a straight line to one vertical ────────────────────
// 2022 P2 Q14. The wide triangle gives the slant, the narrow right-angled one
// turns it into the distance along the ground.
function twoElevations(): Q | null {
  const near = getRandomInt(20, 52);
  const far = getRandomInt(8, near - 9);
  if (near - far < 9) return null;
  const e = pick(ELEVATIONS);
  const d = getRandomInt(e.band[0], e.band[1]);

  const h = d / (cot(far) - cot(near));
  const b1 = h * cot(near);                    // the stretch being asked for
  const b2 = h * cot(far);
  if (h < d * 0.2 || h > d * 1.4 || b1 < d * 0.25) return null;
  // the wide triangle's slant side, found first
  const slant = d * Math.sin(far * DEG) / Math.sin((near - far) * DEG);

  const [nA, nB, nC, nD] = e.letters;
  const fig = apexOverBase({
    base: [nB, nC, nD], apex: nA, over: 0,
    at: [0, b1, b2], height: h,
    spans: [
      { from: 0, to: 1, text: e.near, value: b1 },
      { from: 1, to: 2, text: `${d} m`, value: d },
    ],
    legs: [{ to: 0, text: e.vertical, value: h }],
    angles: [
      { at: 1, toward: 0, degrees: near, label: `${near}°` },
      { at: 2, toward: 0, degrees: far, label: `${far}°` },
    ],
    rightAngle: true,
  });
  if (!fig) return null;

  const prose = [
    e.intro(nA, nB, nC, nD),
    `From $${nC}$, the angle of elevation to $${nA}$ is $${near}^{\\circ}$.`,
    `From $${nD}$, the angle of elevation to $${nA}$ is $${far}^{\\circ}$.`,
    `The distance from $${nC}$ to $${nD}$ is ${d} metres.`,
    `Calculate ${e.asks(nB, nC)}.`,
  ];
  const steps = [
    `<strong>1.</strong> $${nB}${nC}${nD}$ is a straight line, so angle $${nA}${nC}${nD} = 180 - ${near} = ${180 - near}^{\\circ}$, and the angles of triangle $${nA}${nC}${nD}$ give:<br><br>$${nC}${nA}${nD} = 180 - ${180 - near} - ${far} = ${near - far}^{\\circ}$`,
    // 2022 P2 Q14: •¹ substitution into the sine rule, •² rearrange,
    // •³ calculate the slant, •⁴ a valid strategy for the ground distance,
    // •⁵ calculate it
    `<strong>2.</strong> The sine rule in triangle $${nA}${nC}${nD}$ pairs $${nA}${nC}$ with the angle at $${nD}$:<br><br>$\\frac{${nA}${nC}}{\\sin ${far}^{\\circ}} = \\frac{${d}}{\\sin ${near - far}^{\\circ}}$`,
    `<strong>3.</strong> Rearrange and work it out:<br><br>$${nA}${nC} = \\frac{${d} \\times \\sin ${far}^{\\circ}}{\\sin ${near - far}^{\\circ}} = ${dp1(slant)}$ metres`,
    `<strong>4.</strong> Triangle $${nA}${nB}${nC}$ is right-angled at $${nB}$:<br><br>$\\cos ${near}^{\\circ} = \\frac{${nB}${nC}}{${dp1(slant)}}$`,
    `<strong>5.</strong> Rearrange:<br><br>$${nB}${nC} = ${dp1(slant)} \\times \\cos ${near}^{\\circ} = ${dp1(b1)}$ metres`,
  ];
  if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) return null;

  return {
    subTopic: 'Two Angles of Elevation',
    difficulty: 'exam',
    variationId: 'composite.two-elevations',
    stepMarks: [1, 1, 1, 1, 1],
    questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
    boardQuestionLines: [`Elevations ${near}° and ${far}° from two points ${d} m apart. Nearer distance?`],
    solutionSteps: steps,
    finalAnswer: `$${dp1(b1)}$ metres`,
    figure: fig,
  };
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// ── a slant split by a perpendicular: two triangles sharing one angle ───────
// 2016 P2 Q16 and 2023 P2 Q15. The small right-angled triangle gives the angle
// at the corner — as a cosine in one, as a sine in the other — and the large
// triangle spends it. Neither question names that angle; the figure is what
// says the two triangles share it.

const LETTERS: { base: [string, string, string]; on: string; far: string }[] = [
  { base: ['A', 'E', 'C'], on: 'D', far: 'B' },
  { base: ['A', 'C', 'E'], on: 'B', far: 'D' },
  { base: ['P', 'S', 'R'], on: 'Q', far: 'T' },
  { base: ['J', 'M', 'L'], on: 'K', far: 'N' },
  { base: ['W', 'Y', 'Z'], on: 'X', far: 'V' },
  { base: ['F', 'H', 'G'], on: 'E', far: 'D' },
];
const SPLIT_UNITS: [string, string][] = [['centimetres', 'cm'], ['metres', 'm']];

/** 2016 P2 Q16: the base is split, and the cosine rule closes the figure. */
function splitSideCosine(): Q | null {
  const set = pick(LETTERS);
  const [A, M, E] = set.base;
  const [unit, u] = pick(SPLIT_UNITS);

  const p = getRandomInt(4, 20);            // corner to the point on the slant
  const m = getRandomInt(2, p - 1);         // corner to the foot
  if (m / p < 0.28 || m / p > 0.85) return null;
  const q = getRandomInt(3, 18);            // the rest of the slant
  const e = getRandomInt(2, 14);            // foot to the far end of the base
  const height = Math.sqrt(p * p - m * m);
  const AQ = p + q, AE = m + e;
  if (AQ / AE > 3 || AE / AQ > 3) return null;

  const cosA = m / p;
  const answer = Math.sqrt(AQ * AQ + AE * AE - 2 * AQ * AE * cosA);
  const fig = splitSide({
    base: set.base, on: set.on, far: set.far,
    at: [0, m, AE], height, beyond: q / p,
    labels: {
      leftBase: `${m} ${u}`, rightBase: `${e} ${u}`,
      lower: `${p} ${u}`, upper: `${q} ${u}`, perpendicular: '',
    },
  });
  if (!fig) return null;

  const prose = [
    `In the diagram, $${set.on}${M}$ is perpendicular to $${A}${E}$.`,
    `$${A}${set.on}$ is ${p} ${unit} and $${set.on}${set.far}$ is ${q} ${unit}.`,
    `$${A}${M}$ is ${m} ${unit} and $${M}${E}$ is ${e} ${unit}.`,
    `Calculate the length of $${set.far}${E}$.`,
    'Give your answer correct to one decimal place.',
  ];
  const steps = [
    `<strong>1.</strong> Triangle $${A}${set.on}${M}$ is right-angled at $${M}$, so the angle at $${A}$ comes straight from its two known sides:<br><br>$\\cos ${A} = \\frac{${m}}{${p}}$`,
    // 2016 P2 Q16: •¹ identify cos A, •² substitute into the cosine rule,
    // •³ calculate the square, •⁴ calculate the side. Writing down the two long
    // sides is not a mark on its own, so it opens the substitution; the
    // substitution and its evaluation are separate marks, so they separate.
    `<strong>2.</strong> That is the same angle in the large triangle $${A}${set.far}${E}$, whose two sides through $${A}$ are $${A}${set.far} = ${p} + ${q} = ${AQ}$ ${u} and $${A}${E} = ${m} + ${e} = ${AE}$ ${u}. Substitute into the cosine rule, with that angle between them:<br><br>$${set.far}${E}^{2} = ${AQ}^{2} + ${AE}^{2} - 2 \\times ${AQ} \\times ${AE} \\times \\frac{${m}}{${p}}$`,
    `<strong>3.</strong> Work that out:<br><br>$${set.far}${E}^{2} = ${Math.round((AQ * AQ + AE * AE - 2 * AQ * AE * cosA) * 1000) / 1000}$`,
    `<strong>4.</strong> Take the square root:<br><br>$${set.far}${E} = ${dp1(answer)}$ ${u}`,
  ];
  if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) return null;

  return {
    subTopic: 'Two Triangles Sharing an Angle',
    difficulty: 'exam',
    variationId: 'composite.split-side-cosine',
    stepMarks: [1, 1, 1, 1],
    questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
    boardQuestionLines: [`Slant ${p} then ${q}, base ${m} then ${e}, perpendicular between. Far side?`],
    solutionSteps: steps,
    finalAnswer: `$${dp1(answer)}$ ${unit}`,
    figure: fig,
  };
}

/** 2023 P2 Q15: the area of the large triangle is given, and a side is wanted. */
function splitSideArea(): Q | null {
  const set = pick(LETTERS);
  const [A, M, E] = set.base;
  const [unit, u] = pick(SPLIT_UNITS);

  const p = getRandomInt(10, 26);           // corner to the point on the slant
  const h = getRandomInt(4, p - 3);         // the perpendicular
  if (h / p < 0.25 || h / p > 0.8) return null;
  const q = getRandomInt(3, 14);
  const base = getRandomInt(12, 44);        // the length being asked for
  const m = Math.sqrt(p * p - h * h);
  if (base < m + 3) return null;

  const AQ = p + q;
  const area = AQ * base * h / (2 * p);
  // the paper gives a whole number of square centimetres, so only take the
  // draws that produce one — otherwise the question reads as reverse-engineered
  if (Math.abs(area - Math.round(area)) > 1e-9 || area < 40) return null;

  const fig = splitSide({
    base: set.base, on: set.on, far: set.far,
    at: [0, m, base], height: h, beyond: q / p,
    labels: {
      leftBase: '', rightBase: '',
      lower: `${p} ${u}`, upper: `${q} ${u}`, perpendicular: `${h} ${u}`,
    },
  });
  if (!fig) return null;

  const prose = [
    `In the diagram, $${set.on}${M}$ is perpendicular to $${A}${E}$.`,
    `$${A}${set.on}$ is ${p} ${unit} and $${set.on}${set.far}$ is ${q} ${unit}.`,
    `$${set.on}${M}$ is ${h} ${unit}.`,
    `The area of triangle $${A}${set.far}${E}$ is ${Math.round(area)} square ${unit}.`,
    `Calculate the length of $${A}${E}$.`,
  ];
  const steps = [
    `<strong>1.</strong> Triangle $${A}${set.on}${M}$ is right-angled at $${M}$, so the angle at $${A}$ comes from the opposite side and the hypotenuse:<br><br>$\\sin ${A} = \\frac{${h}}{${p}}$`,
    `<strong>2.</strong> That is the same angle in triangle $${A}${set.far}${E}$, and $${A}${set.far} = ${p} + ${q} = ${AQ}$ ${u}. The area formula uses the angle between the two sides:<br><br>$\\text{Area} = \\frac{1}{2} \\times ${AQ} \\times ${A}${E} \\times \\frac{${h}}{${p}}$`,
    `<strong>3.</strong> Put in the area that is given:<br><br>$${Math.round(area)} = \\frac{1}{2} \\times ${AQ} \\times ${A}${E} \\times \\frac{${h}}{${p}}$`,
    `<strong>4.</strong> Rearrange:<br><br>$${A}${E} = \\frac{2 \\times ${Math.round(area)} \\times ${p}}{${AQ} \\times ${h}} = ${base}$ ${u}`,
  ];
  if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) return null;

  return {
    subTopic: 'Two Triangles Sharing an Angle',
    difficulty: 'exam',
    // 2023 P2 Q15: •¹ the correct trig ratio, •² substitution into the area
    // formula, •³ form the equation, •⁴ solve it for the length
    variationId: 'composite.split-side-area',
    stepMarks: [1, 1, 1, 1],
    questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
    boardQuestionLines: [`Slant ${p} then ${q}, perpendicular ${h}, area ${Math.round(area)}. Base?`],
    solutionSteps: steps,
    finalAnswer: `$${base}$ ${unit}`,
    figure: fig,
  };
}

// ── a point off a straight line: the angle on the line is the first step ────
// 2018 P2 Q9. The angle given at the base is between the leg and the line
// running the *other* way, so the angle inside the triangle is its supplement.
// Nothing about the lengths reveals that; only the picture does.
function straightLineAngle(): Q | null {
  const set = pick(LETTERS);
  const [A, B, C] = [set.base[0], set.base[1], set.base[2]];
  const D = set.far;
  const [unit, u] = pick(SPLIT_UNITS);

  const theta = getRandomInt(45, 145);      // the angle marked on the line
  const phi = getRandomInt(25, 70);         // the angle at the point off it
  if (theta - phi < 22) return null;
  const L = getRandomInt(8, 42);

  const rad = Math.PI / 180;
  const DC = L * Math.sin(theta * rad) / Math.sin(phi * rad);
  const BD = L * Math.sin((theta - phi) * rad) / Math.sin(phi * rad);
  if (DC / L > 3.5 || BD / L < 0.3 || BD / L > 3) return null;

  // B at the origin of the base, C to its right, D up and back over the line
  const height = BD * Math.sin((180 - theta) * rad);
  const dx = BD * Math.cos((180 - theta) * rad);
  const a = Math.max(L * 0.4, -dx + L * 0.2);
  const fig = apexOverBase({
    base: [A, B, C], apex: D, over: 1,
    apexX: a + dx, at: [0, a, a + L], height,
    spans: [{ from: 1, to: 2, text: `${L} ${u}`, value: L }],
    legs: [],
    angles: [{ at: 1, toward: 0, degrees: theta, label: `${theta}°` }],
    apexAngles: [{ toward: [1, 2], degrees: phi, label: `${phi}°` }],
    draw: [1, 2],
  });
  if (!fig) return null;

  const prose = [
    'In this diagram:',
    `&bull;&nbsp; angle $${A}${B}${D} = ${theta}^{\\circ}$`,
    `&bull;&nbsp; angle $${B}${D}${C} = ${phi}^{\\circ}$`,
    `&bull;&nbsp; $${B}${C}$ is ${L} ${unit}.`,
    `Calculate the length of $${D}${C}$.`,
    'Give your answer correct to one decimal place.',
  ];
  // 2018 P2 Q9: •¹ correct substitution into the sine rule, •² rearrange it,
  // •³ calculate the length. The straight-line angle is not a mark of its own,
  // so it opens the substitution rather than standing as a step.
  const steps = [
    `<strong>1.</strong> $${A}${B}${C}$ is a straight line, so the angle inside the triangle at $${B}$ is $180 - ${theta} = ${180 - theta}^{\\circ}$. The sine rule pairs $${D}${C}$ with the angle at $${B}$, and $${B}${C}$ with the angle at $${D}$:<br><br>$\\frac{${D}${C}}{\\sin ${180 - theta}^{\\circ}} = \\frac{${L}}{\\sin ${phi}^{\\circ}}$`,
    `<strong>2.</strong> Rearrange to make $${D}${C}$ the subject:<br><br>$${D}${C} = \\frac{${L} \\times \\sin ${180 - theta}^{\\circ}}{\\sin ${phi}^{\\circ}}$`,
    `<strong>3.</strong> Work it out:<br><br>$${D}${C} = ${dp1(DC)}$ ${u}`,
  ];
  if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) return null;

  return {
    subTopic: 'A Point Off a Straight Line',
    difficulty: 'exam',
    variationId: 'composite.straight-line-angle',
    stepMarks: [1, 1, 1],
    questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
    boardQuestionLines: [`Straight line ${A}${B}${C}. Angle ${A}${B}${D} = ${theta}, angle ${B}${D}${C} = ${phi}, ${B}${C} = ${L}. Find ${D}${C}.`],
    solutionSteps: steps,
    finalAnswer: `$${dp1(DC)}$ ${unit}`,
    figure: fig,
  };
}

// ── a regular hexagon cut into six triangles by its diagonals ───────────────
// 2015 P2 Q11. The three diagonals cross at the centre and divide the shape
// into six triangles, each with two sides of half a diagonal and sixty degrees
// between them. Half ab sin C, six times.
/**
 * Each of these carries its own unit and size, because the shape does not.
 * Sharing one range across them all put an eight-metre badge on the page.
 */
const HEXAGON_CONTEXTS: {
  intro: (d: string) => string; asks: string;
  unit: string; short: string; band: [number, number];
}[] = [
  { intro: d => `A trivet is in the shape of a regular hexagon. Its three diagonals, shown as dotted lines in the diagram below, each have length ${d}.`,
    asks: 'the area of the trivet',
    unit: 'centimetres', short: 'cm', band: [30, 70] },
  { intro: d => `A paving slab is a regular hexagon. Its three diagonals, shown dotted below, are each ${d} long.`,
    asks: 'the area of the paving slab',
    unit: 'centimetres', short: 'cm', band: [15, 40] },
  { intro: d => `A mirror is cut in the shape of a regular hexagon. The three diagonals, shown as dotted lines, each measure ${d}.`,
    asks: 'the area of the mirror',
    unit: 'centimetres', short: 'cm', band: [25, 60] },
  { intro: d => `A ceramic tile is a regular hexagon whose three diagonals, drawn dotted below, are each ${d}.`,
    asks: 'the area of the tile',
    unit: 'centimetres', short: 'cm', band: [6, 18] },
  { intro: d => `A garden pond is built as a regular hexagon. Its three diagonals, shown dotted, each have length ${d}.`,
    asks: 'the area of the surface of the pond',
    unit: 'metres', short: 'm', band: [2, 7] },
  { intro: d => `A badge is made in the shape of a regular hexagon. The three diagonals, shown as dotted lines below, are each ${d}.`,
    asks: 'the area of the badge',
    unit: 'centimetres', short: 'cm', band: [3, 9] },
  { intro: d => `A wooden coaster is a regular hexagon. Its three diagonals, drawn dotted in the diagram, each measure ${d}.`,
    asks: 'the area of the coaster',
    unit: 'centimetres', short: 'cm', band: [5, 13] },
  { intro: d => `A window pane is a regular hexagon whose three diagonals, shown dotted below, are each ${d} long.`,
    asks: 'the area of the window pane',
    unit: 'centimetres', short: 'cm', band: [20, 50] },
  { intro: d => `A wooden gazebo has a floor in the shape of a regular hexagon. Its three diagonals, drawn dotted, are each ${d}.`,
    asks: 'the area of the floor',
    unit: 'metres', short: 'm', band: [3, 9] },
  { intro: d => `A trampoline is a regular hexagon. The three diagonals, shown as dotted lines below, each measure ${d}.`,
    asks: 'the area of the trampoline',
    unit: 'metres', short: 'm', band: [2, 5] },
];


function hexagonArea(): Q | null {
  const c = pick(HEXAGON_CONTEXTS);
  const { unit, short: u } = c;
  // an even diagonal, so halving it stays a whole number
  const d = getRandomInt(Math.ceil(c.band[0] / 2), Math.floor(c.band[1] / 2)) * 2;
  const r = d / 2;
  // six triangles, two sides of r with sixty degrees between them
  const one = 0.5 * r * r * Math.sin(60 * Math.PI / 180);
  const area = 6 * one;

  const fig = regularPolygon({ sides: 6, radius: r, turn: pick([0, 30]) });
  if (!fig) return null;

  const prose = [
    c.intro(`${d} ${unit}`),
    `Calculate ${c.asks}.`,
    'Give your answer correct to one decimal place.',
  ];
  const steps = [
    // 2015 P2 Q11: •¹ the correct angle, •² substitution into the area of a
    // triangle formula, •³ know how to find the hexagon's area from it,
    // •⁴ the calculation, with the units. Halving the diagonal is not a mark,
    // so it opens the step that finds the angle.
    `<strong>1.</strong> The three diagonals cross at the centre and cut the hexagon into six triangles, each with two sides of half a diagonal, $${d} \\div 2 = ${r}$ ${u}. The six angles at the centre fill a full turn:<br><br>$360 \\div 6 = 60^{\\circ}$`,
    `<strong>2.</strong> One triangle, by $\\frac{1}{2}ab\\sin C$:<br><br>$\\frac{1}{2} \\times ${r} \\times ${r} \\times \\sin 60^{\\circ}$`,
    `<strong>3.</strong> The hexagon is six of them:<br><br>$6 \\times \\frac{1}{2} \\times ${r} \\times ${r} \\times \\sin 60^{\\circ}$`,
    `<strong>4.</strong> Work it out, and give the units:<br><br>$6 \\times ${one.toFixed(2)} = ${dp1(area)}$ ${u}$^{2}$`,
  ];
  if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) return null;

  return {
    subTopic: 'Area of a Regular Hexagon',
    difficulty: 'exam',
    variationId: 'composite.hexagon-area',
    stepMarks: [1, 1, 1, 1],
    questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
    boardQuestionLines: [`Regular hexagon, diagonals ${d} ${u}. Area?`],
    solutionSteps: steps,
    finalAnswer: `$${dp1(area)}$ ${u}$^{2}$`,
    figure: fig,
  };
}

function composite(kinds: string[]): Q {
  // The branch is chosen once, before the retry loop, not inside it.
  //
  // Choosing inside means a rejected layout re-enters the lottery rather than
  // retrying the branch that was asked for, so what reaches the page ends up
  // proportional to (chosen x survived) instead of to chosen. A figure that is
  // harder to lay out is then quietly buried by an easier one: the cuboid on
  // axes was picked half the time and reached the page 9% of the time.
  //
  // Fixing it here also makes a branch that can *never* lay out fail loudly
  // instead of silently substituting its neighbour, which is how a figure once
  // went missing entirely without a single check noticing.
  const kind = pick(kinds);
  for (let tries = 0; tries < 4000; tries++) {
    const q = kind === 'two-elevations' ? twoElevations()
      : kind === 'split-cosine' ? splitSideCosine()
      : kind === 'split-area' ? splitSideArea()
      : kind === 'straight-line' ? straightLineAngle()
      : kind === 'hexagon' ? hexagonArea()
      : heightOverBase(kind === 'bare');
    if (q) return q;
  }
  throw new Error('composite-trig: no valid question found');
}

export const COMPOSITE_TRIG_GENERATORS: Record<string, () => Q> = {
  'Two Angles of Elevation': () => composite(['elevation', 'two-elevations']),
  'A Perpendicular Inside a Triangle': () => composite(['bare']),
  'Two Triangles Sharing an Angle': () => composite(['split-cosine', 'split-area']),
  'A Point Off a Straight Line': () => composite(['straight-line']),
  'Area of a Regular Hexagon': () => composite(['hexagon']),
};
