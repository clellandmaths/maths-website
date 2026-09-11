import { GeneratedQuestion } from './types';
import { getRandomInt } from './utils';
import { article } from './n5-contexts';
import {
  algebraicCuboid, borderedRectangle, shapePair, type PlaneShape,
} from '../diagrams/shapes/algebra-shapes';
import { renderScene } from '../diagrams/render';
import { verifyFigure } from '../diagrams/verify';

/**
 * Building an equation out of a shape — the five that were left.
 *
 *   2015 P2 Q14   a border all round a picture        1 + 2 + 4
 *   2026 P2 Q13   a wall on three sides of a floor    1 + 2 + 4
 *   2022 P1 Q15   a triangle against a rectangle      1 + 4
 *   2023 P2 Q14   a cuboid of given volume            2 + 4
 *   2025 P1 Q15   a rectangle against a square        1 + 2 + 3
 *
 * Every one is the same three moves — write an expression, turn it into an
 * equation, solve it — and no two of them are worth the same marks, because
 * what the last part costs depends on how it is solved. The formula is four
 * marks (substitute, discriminant, solve, select and round), factorising is
 * three, and a linear equation is four spread differently. So five ids.
 *
 * **Built answer-first, and it has to be.** These questions turn on the answer
 * being presentable: 2025 P1 Q15 needs a quadratic that factorises over the
 * integers with one root to reject, and the three formula questions need a
 * root that is *not* rational, since the last mark is for rounding it and a
 * scheme that says "requires rounding" cannot be satisfied by 3. Choosing the
 * shape first and hoping would give neither.
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
type Q = Omit<GeneratedQuestion, 'topic'>;

/** A signed term the way a quadratic is written: "+ 44x", "- 153". */
const sgn = (v: number, tail = '') => `${v < 0 ? '-' : '+'} ${Math.abs(v)}${tail}`;
const coef = (v: number, x = 'x') => (v === 1 ? x : v === -1 ? `-${x}` : `${v}${x}`);

/**
 * A signed x term with a coefficient of one left implicit: "+ x", "- 3x".
 *
 * `sgn(1, 'x')` gives "+ 1x", which is not how anybody writes it and not how
 * either paper prints it. That had been shipping on `form-equation.
 * rectangle-square` — a 2025 P1 Q15 clone — as "show that x^2 + 1x - 6 = 0",
 * and no check looks at notation, so it took building a second variation on
 * the same helper to see it.
 */
const sgnCoef = (v: number, x = 'x') =>
  `${v < 0 ? '-' : '+'} ${Math.abs(v) === 1 ? x : `${Math.abs(v)}${x}`}`;

/** "4x^2 + 44x - 153 = 0", with the signs folded in. A zero term is dropped. */
const quadratic = (a: number, b: number, c: number) =>
  [coef(a, 'x^{2}'), b === 0 ? '' : sgnCoef(b), c === 0 ? '' : sgn(c)]
    .filter(Boolean).join(' ') + ' = 0';

/**
 * The four marks a quadratic formula question spends on part (b).
 *
 * •¹ correct substitution, •² evaluate the discriminant, •³ solve for x,
 * •⁴ select the positive root and state it to the accuracy asked for. The
 * middle mark is for the discriminant on its own, which is why it is a step of
 * its own rather than folded into the substitution.
 */
function formulaSteps(a: number, b: number, c: number, dp: number, from: number): string[] {
  const disc = b * b - 4 * a * c;
  const root = Math.sqrt(disc);
  const [hi, lo] = [(-b + root) / (2 * a), (-b - root) / (2 * a)];
  const four = (v: number) => `${Math.round(v * 10000) / 10000}`;
  return [
    `<strong>${from}.</strong> Substitute $a = ${a}$, $b = ${b}$ and $c = ${c}$ into the quadratic formula:` +
    `<br><br>$x = \\frac{-${b} \\pm \\sqrt{${b}^{2} - 4 \\times ${a} \\times (${c})}}{2 \\times ${a}}$`,
    `<strong>${from + 1}.</strong> Work out the discriminant:<br><br>$b^{2} - 4ac = ${disc}$`,
    `<strong>${from + 2}.</strong> Take the square root and use both signs:` +
    `<br><br>$x = ${four(hi)}\\ldots$ or $x = ${four(lo)}\\ldots$`,
    `<strong>${from + 3}.</strong> A length cannot be negative, so take the positive value and round it:` +
    `<br><br>$x = ${hi.toFixed(dp)}$`,
  ];
}

/** Build it, or reject the layout and let the caller draw again. */
function assemble(
  fig: ReturnType<typeof shapePair>, subTopic: string, variationId: string,
  prose: string[], board: string, steps: string[], stepMarks: number[], finalAnswer: string,
): Q | null {
  if (verifyFigure(fig, [...prose, ...steps].join(' ')).length) return null;
  return {
    subTopic, difficulty: 'exam', variationId,
    questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
    boardQuestionLines: [board],
    solutionSteps: steps, stepMarks, finalAnswer, figure: fig,
  };
}

// ── a border all round — 2015 P2 Q14 ─────────────────────────────────────

/**
 * Each carries its own sentence rather than slotting a noun into one.
 *
 * "A rectangular lawn is placed on a rectangular garden" is what a shared
 * template produced, and a lawn is not placed on anything. The outdoor ones
 * need a different verb from the ones about paper, so they get one.
 */
const BORDERS: {
  opening: (a: number, b: number, unit: string) => string;
  /** What the border surrounds it with — named again in part (a). */
  outer: string;
  thing: string;
  unit: 'centimetres' | 'metres';
}[] = [
  { thing: 'poster', outer: 'backing board', unit: 'centimetres',
    opening: (a, b, u) => `A rectangular poster measuring ${a} ${u} by ${b} ${u} is fixed to a rectangular backing board.` },
  { thing: 'photograph', outer: 'mount', unit: 'centimetres',
    opening: (a, b, u) => `A rectangular photograph measuring ${a} ${u} by ${b} ${u} is placed on a rectangular mount.` },
  { thing: 'painting', outer: 'frame', unit: 'centimetres',
    opening: (a, b, u) => `A rectangular painting measuring ${a} ${u} by ${b} ${u} sits inside a rectangular frame.` },
  { thing: 'mirror', outer: 'surround', unit: 'centimetres',
    opening: (a, b, u) => `A rectangular mirror measuring ${a} ${u} by ${b} ${u} sits inside a rectangular wooden surround.` },
  { thing: 'tile', outer: 'backing board', unit: 'centimetres',
    opening: (a, b, u) => `A rectangular tile measuring ${a} ${u} by ${b} ${u} is fixed to a rectangular backing board.` },
  { thing: 'poster', outer: 'board', unit: 'centimetres',
    opening: (a, b, u) => `A rectangular poster measuring ${a} ${u} by ${b} ${u} is pinned to a rectangular board.` },
  { thing: 'label', outer: 'jar wrap', unit: 'centimetres',
    opening: (a, b, u) => `A rectangular label measuring ${a} ${u} by ${b} ${u} is printed on a rectangular jar wrap.` },
  { thing: 'lawn', outer: 'garden', unit: 'metres',
    opening: (a, b, u) => `A rectangular lawn measuring ${a} ${u} by ${b} ${u} lies in the middle of a rectangular garden.` },
  { thing: 'pond', outer: 'patio', unit: 'metres',
    opening: (a, b, u) => `A rectangular pond measuring ${a} ${u} by ${b} ${u} is set into a rectangular patio.` },
  { thing: 'rug', outer: 'floor', unit: 'metres',
    opening: (a, b, u) => `A rectangular rug measuring ${a} ${u} by ${b} ${u} lies in the middle of a rectangular floor.` },
];

function borderAllRound(): Q | null {
  const c = pick(BORDERS);
  // A ten-by-fifteen anything is fine in centimetres and absurd in metres, and
  // half this bank is outdoors. The numbers follow the unit.
  const [w, h] = c.unit === 'centimetres'
    ? [getRandomInt(10, 22), getRandomInt(6, 16)]
    : [getRandomInt(4, 9), getRandomInt(2, 6)];
  if (w <= h) return null;
  const area = getRandomInt(Math.ceil(w * h * 1.25), w * h * 4);
  // (w + 2x)(h + 2x) = area  ->  4x^2 + 2(w + h)x + (wh - area) = 0
  const [A, B, C] = [4, 2 * (w + h), w * h - area];
  const disc = B * B - 4 * A * C;
  const root = Math.sqrt(disc);
  if (Number.isInteger(root)) return null;            // the last mark needs rounding
  const x = (-B + root) / (2 * A);
  // A border wider than a fifth of the shorter side stops looking like a
  // border: 5.7 cm round a 10 by 17 label is arithmetically fine and absurd
  // on the page. The paper's own is 2.8 round 9 by 13.
  if (x < 0.6 || x > Math.min(4, h / 4)) return null;

  const prose = [
    c.opening(h, w, c.unit),
    `There is a border $x$ ${c.unit} wide on all sides of the ${c.thing}.`,
    // The area comes before the equation, because the equation is derived from
    // it: stating it afterwards asks a pupil to show a result from a number
    // they have not been given yet.
    `The total area of the ${c.outer} is ${area} square ${c.unit}.`,
    `<strong>(a) (i)</strong> Write down an expression for the length of the ${c.outer} in terms of $x$.`,
    `<strong>(a) (ii)</strong> Hence show that $${quadratic(A, B, C)}$.`,
    `<strong>(b)</strong> Calculate $x$, the width of the border. Give your answer correct to one decimal place.`,
  ];
  const steps = [
    `<strong>1.</strong> The border adds $x$ at each end, so the length is<br><br>$${w} + 2x$`,
    `<strong>2.</strong> The width is $${h} + 2x$, so the area is<br><br>$(2x + ${w})(2x + ${h}) = 4x^{2} ${sgn(B, 'x')} + ${w * h}$`,
    `<strong>3.</strong> Set that equal to ${area} and take everything to one side:<br><br>$${quadratic(A, B, C)}$`,
    ...formulaSteps(A, B, C, 1, 4),
  ];
  // •¹ the expression, •² area and expansion, •³ construct and rearrange,
  // then the four formula marks
  return assemble(
    borderedRectangle({ innerW: w * 10, innerH: h * 10, sides: 4,
      labels: { width: `${w} ${c.unit === 'metres' ? 'm' : 'cm'}`,
                height: `${h} ${c.unit === 'metres' ? 'm' : 'cm'}`, border: 'x' } }),
    'A Border Round a Rectangle', 'form-equation.border', prose,
    `${h} by ${w} with a border $x$; total area ${area}. Find $x$.`,
    steps, [1, 1, 1, 1, 1, 1, 1], `$x = ${((-B + root) / (2 * A)).toFixed(1)}$`);
}

// ── a wall on three sides — 2026 P2 Q13 ──────────────────────────────────

const THREE_SIDED = [
  { thing: 'log store', of: 'the end of a garage', wall: 'wall', unit: 'metres' },
  { thing: 'conservatory', of: 'the side of a cottage', wall: 'wall', unit: 'metres' },
  { thing: 'porch', of: 'the front of a bungalow', wall: 'wall', unit: 'metres' },
  { thing: 'raised bed', of: 'a garden wall', wall: 'timber edge', unit: 'metres' },
  { thing: 'stall', of: 'the back of a market hall', wall: 'partition', unit: 'metres' },
  { thing: 'kennel', of: 'the side of a shed', wall: 'wall', unit: 'metres' },
  { thing: 'planter', of: 'a boundary fence', wall: 'brick edge', unit: 'metres' },
  { thing: 'shelter', of: 'the end of a barn', wall: 'wall', unit: 'metres' },
  { thing: 'store', of: 'the back of a workshop', wall: 'wall', unit: 'metres' },
  { thing: 'annexe', of: 'the gable of a farmhouse', wall: 'wall', unit: 'metres' },
];

function wallOnThreeSides(): Q | null {
  const c = pick(THREE_SIDED);
  const [len, wid] = [getRandomInt(4, 12), getRandomInt(2, 6)];
  if (len <= wid) return null;
  const area = getRandomInt(len * wid + 2, Math.round(len * wid * 2.2));
  // (2x + len)(x + wid) = area  ->  2x^2 + (2·wid + len)x + (len·wid - area) = 0
  const [A, B, C] = [2, 2 * wid + len, len * wid - area];
  const disc = B * B - 4 * A * C;
  const root = Math.sqrt(disc);
  if (Number.isInteger(root)) return null;
  const x = (-B + root) / (2 * A);
  if (x < 0.15 || x > 2.5) return null;               // a wall thickness, not a room

  const prose = [
    `${article(c.thing) === 'a' ? 'A' : 'An'} ${c.thing} with a rectangular base is being added to ${c.of}. The diagram below shows a plan of the rectangular base.`,
    `The base measures ${len} metres by ${wid} metres.`,
    `There is a ${c.wall} $x$ metres thick on three sides.`,
    `<strong>(a)</strong> Write down an expression for the length of the ${c.thing} in terms of $x$.`,
    `The total area of the rectangular base is ${area} square metres.`,
    `<strong>(b)</strong> Show that $${quadratic(A, B, C)}$.`,
    `<strong>(c)</strong> Calculate $x$, the thickness of the ${c.wall}. Give your answer correct to two decimal places.`,
  ];
  const steps = [
    `<strong>1.</strong> There is a ${c.wall} at each end of the length, so it grows by $x$ twice:<br><br>$2x + ${len}$`,
    `<strong>2.</strong> There is a ${c.wall} on only one of the other two sides, so the width grows by $x$ once. The area is<br><br>$(2x + ${len})(x + ${wid}) = 2x^{2} ${sgn(B, 'x')} + ${len * wid}$`,
    `<strong>3.</strong> Set that equal to ${area} and take everything to one side:<br><br>$${quadratic(A, B, C)}$`,
    ...formulaSteps(A, B, C, 2, 4),
  ];
  return assemble(
    borderedRectangle({ innerW: len * 10, innerH: wid * 10, sides: 3,
      labels: { width: `${len} m`, height: `${wid} m`, border: 'x' } }),
    'A Wall on Three Sides', 'form-equation.three-sided', prose,
    `Floor ${len} by ${wid}, wall $x$ thick on three sides, total area ${area}. Find $x$.`,
    steps, [1, 1, 1, 1, 1, 1, 1], `$x = ${x.toFixed(2)}$ m`);
}

// ── a triangle against a rectangle — 2022 P1 Q15 ─────────────────────────

const PLOT_PAIRS = [
  { a: 'flower bed', b: 'lawn', unit: 'metres' },
  { a: 'flag', b: 'banner', unit: 'centimetres' },
  { a: 'sail', b: 'panel', unit: 'metres' },
  { a: 'sign', b: 'poster', unit: 'centimetres' },
  { a: 'patch of gravel', b: 'patch of turf', unit: 'metres' },
  { a: 'tile', b: 'mosaic panel', unit: 'centimetres' },
  { a: 'field', b: 'paddock', unit: 'metres' },
  { a: 'window pane', b: 'door panel', unit: 'centimetres' },
  { a: 'sticker', b: 'label', unit: 'centimetres' },
  { a: 'plot', b: 'yard', unit: 'metres' },
];

function triangleAgainstRectangle(): Q | null {
  const c = pick(PLOT_PAIRS);
  // The scheme's note 2 withholds a mark unless the triangle's area expression
  // has a fraction in it, so the height is always odd.
  const hTri = pick([3, 5, 7, 9]);
  const b = getRandomInt(6, 20);
  const r = getRandomInt(2, 9);
  const k = getRandomInt(6, 16);
  // (hTri/2)(x + b) = r(k - x)  ->  hTri·x + hTri·b = 2r·k - 2r·x
  const A = hTri + 2 * r, B = 2 * r * k - hTri * b;
  if (A === 0 || B % A !== 0) return null;
  const x = B / A;
  // note 3: no mark for dividing by a single digit to reach a whole number
  if (A < 10) return null;
  if (x < 1 || x >= k) return null;

  const prose = [
    `A triangular ${c.a} and a rectangular ${c.b} are shown in the diagram.`,
    `<strong>(a)</strong> Find an expression for the area of the triangle.`,
    `<strong>(b)</strong> Given that the area of the triangle is equal to the area of the rectangle, find algebraically the value of $x$.`,
  ];
  const steps = [
    `<strong>1.</strong> Area of a triangle is half the base times the height:<br><br>$\\frac{${hTri}}{2}(x + ${b})$`,
    `<strong>2.</strong> The rectangle has area $${r}(${k} - x)$, and the two are equal:<br><br>$\\frac{${hTri}}{2}(x + ${b}) = ${r}(${k} - x)$`,
    `<strong>3.</strong> Multiply both sides by 2 to clear the fraction:<br><br>$${hTri}(x + ${b}) = ${2 * r}(${k} - x)$`,
    `<strong>4.</strong> Expand and gather the $x$ terms:<br><br>$${coef(A)} = ${B}$`,
    `<strong>5.</strong> Divide by $${A}$:<br><br>$x = ${x}$`,
  ];
  return assemble(
    shapePair(
      { kind: 'triangle', base: 100, height: 44, labels: { base: `x + ${b}`, height: `${hTri}` } },
      { kind: 'rectangle', w: 52, h: 68, labels: { w: `${k} - x`, h: `${r}` } } as PlaneShape,
    ),
    'A Triangle Against a Rectangle', 'form-equation.triangle-rectangle', prose,
    `Triangle base $x + ${b}$, height ${hTri}; rectangle ${r} by $${k} - x$. Equal areas — find $x$.`,
    steps, [1, 1, 1, 1, 1], `$x = ${x}$`);
}

// ── a rectangle against a square — 2025 P1 Q15 ───────────────────────────

const AREA_PAIRS = [
  { a: 'rug', b: 'rug', unit: 'centimetres' },
  { a: 'patio', b: 'lawn', unit: 'metres' },
  { a: 'panel', b: 'panel', unit: 'centimetres' },
  { a: 'noticeboard', b: 'noticeboard', unit: 'centimetres' },
  { a: 'flower bed', b: 'flower bed', unit: 'metres' },
  { a: 'tray', b: 'tray', unit: 'centimetres' },
  { a: 'window', b: 'window', unit: 'centimetres' },
  { a: 'sail', b: 'sail', unit: 'metres' },
  { a: 'plot', b: 'plot', unit: 'metres' },
  { a: 'mat', b: 'mat', unit: 'centimetres' },
];

/**
 * Answer-first, and it is the only way this one works.
 *
 * The quadratic has to factorise over the integers *and* have one root to
 * reject, so the roots are chosen first — a positive m and a negative -n — and
 * the rectangle and square are solved for. Two equations in three unknowns, so
 * one side is picked and the other two fall out, which they only do when a
 * discriminant comes out square. Most draws fail; that is what the loop is for.
 */
function rectangleAgainstSquare(): Q | null {
  const c = pick(AREA_PAIRS);
  // Widely, because the constraint is severe: a discriminant has to come out
  // square, and over m up to 7 there were eleven usable questions in the whole
  // topic. Over these ranges there are forty, which is what a worksheet needs
  // before a repeat is noticeable.
  const m = getRandomInt(2, 12);           // the root to keep
  const n = getRandomInt(1, 10);           // the root to reject, as -n
  const r = getRandomInt(1, 10);
  const d = m * n + r * (n - m) - r * r;
  if (d < 0) return null;
  const root = Math.sqrt(d);
  if (!Number.isInteger(root)) return null;
  const s = r + root;
  const q = n - m - 2 * r + 2 * s;
  if (q < 1 || s < 1) return null;
  if (2 * m + q <= 0 || m + r <= 0 || m + s <= 0) return null;
  // The rectangle has to be a rectangle. Guarding q against r was the wrong
  // pair — what makes it a square is its two *sides* coming out equal at the
  // answer, and (2x + 2)(x + 5) against (x + 5)^2 duly produced "8 by 8", a
  // rectangle equal in area to a square by being that square.
  if (2 * m + q === m + r) return null;
  // and it must not simply be the square with a side renamed
  if (r === s || q === 2 * s) return null;
  // Equal and opposite roots give x^2 - 25 = 0, a difference of two squares
  // rather than the trinomial 2025 P1 Q15 prints, and its •⁴ "factorise" mark
  // becomes trivial. It had been reaching the page as "x^2 + 0x - 25 = 0".
  if (m === n) return null;
  const [B, C] = [n - m, -m * n];

  const prose = [
    `The diagrams of a rectangular ${c.a} and a square ${c.b} are shown below.`,
    `<strong>(a)</strong> Find an expression for the area of the rectangle.`,
    `<strong>(b)</strong> Given that the area of the rectangle is equal to the area of the square, show that $${quadratic(1, B, C)}$.`,
    `<strong>(c)</strong> Hence find, algebraically, the length and breadth of the rectangle.`,
  ];
  const steps = [
    `<strong>1.</strong> Area is length times breadth:<br><br>$(2x + ${q})(x + ${r})$`,
    `<strong>2.</strong> The square has area $(x + ${s})^{2}$, so expand both and equate:` +
    `<br><br>$2x^{2} ${sgn(q + 2 * r, 'x')} + ${q * r} = x^{2} ${sgn(2 * s, 'x')} + ${s * s}$`,
    `<strong>3.</strong> Take everything to one side:<br><br>$${quadratic(1, B, C)}$`,
    `<strong>4.</strong> Factorise:<br><br>$(x ${sgn(-m)})(x ${sgn(n)}) = 0$`,
    `<strong>5.</strong> Solve:<br><br>$x = ${m}$ or $x = ${-n}$`,
    `<strong>6.</strong> A length cannot be negative, so $x = ${m}$, and the rectangle is` +
    `<br><br>$${2 * m + q}$ by $${m + r}$ ${c.unit}`,
  ];
  return assemble(
    shapePair(
      { kind: 'rectangle', w: 96, h: 54, labels: { w: `2x + ${q}`, h: `x + ${r}` } },
      { kind: 'square', s: 68, label: `x + ${s}` },
    ),
    'A Rectangle Against a Square', 'form-equation.rectangle-square', prose,
    `Rectangle $(2x + ${q})(x + ${r})$ equals square $(x + ${s})^{2}$. Find its sides.`,
    steps, [1, 1, 1, 1, 1, 1],
    `Length ${2 * m + q} ${c.unit}, breadth ${m + r} ${c.unit}`);
}

// ── a cuboid of given volume — 2023 P2 Q14 ───────────────────────────────

const UNITS = [
  { thing: 'salt store', material: '' },
  { thing: 'shipping crate', material: '' },
  { thing: 'concrete block', material: '' },
  { thing: 'water trough', material: '' },
  { thing: 'planter', material: '' },
  { thing: 'grit bin', material: '' },
  { thing: 'toolbox', material: '' },
  { thing: 'feed hopper', material: '' },
  { thing: 'log store', material: '' },
  { thing: 'packing case', material: '' },
];

function cuboidVolume(): Q | null {
  const c = pick(UNITS);
  const k = getRandomInt(3, 12);
  const hh = getRandomInt(2, 5);
  const vol = getRandomInt(hh * 6, hh * 90);
  // h·x(x + k) = vol  ->  h·x^2 + h·k·x - vol = 0
  const [A, B, C] = [hh, hh * k, -vol];
  const disc = B * B - 4 * A * C;
  const root = Math.sqrt(disc);
  if (Number.isInteger(root)) return null;
  const x = (-B + root) / (2 * A);
  if (x < 0.8 || x > 9) return null;

  const prose = [
    `A ${c.thing}, built in the shape of a cuboid, is shown.`,
    `It has length $(x + ${k})$ metres, breadth $x$ metres and height $${hh}$ metres.`,
    `The volume of this ${c.thing} is $${vol}$ cubic metres.`,
    `<strong>(a)</strong> Show that $${quadratic(A, B, C)}$.`,
    `<strong>(b)</strong> Calculate $x$, the breadth of the ${c.thing}. Give your answer correct to one decimal place.`,
  ];
  const steps = [
    `<strong>1.</strong> Volume is length times breadth times height:<br><br>$(x + ${k}) \\times x \\times ${hh}$`,
    `<strong>2.</strong> Set that equal to ${vol} and take everything to one side:<br><br>$${quadratic(A, B, C)}$`,
    ...formulaSteps(A, B, C, 1, 3),
  ];
  return assemble(
    algebraicCuboid({ length: 90, breadth: 40, height: 26,
      labels: { length: `x + ${k} m`, breadth: 'x m', height: `${hh} m` } }),
    'A Cuboid of Given Volume', 'form-equation.cuboid', prose,
    `Cuboid $(x + ${k})$ by $x$ by ${hh}, volume ${vol}. Find $x$.`,
    steps, [1, 1, 1, 1, 1, 1], `$x = ${x.toFixed(1)}$`);
}

// ── a rectangle against a triangle, showing the equation — 2016 P1 Q12 ────

/**
 * Three parts, and the middle one is a **"show that"**, which is what makes it
 * a different question from `form-equation.triangle-rectangle` rather than the
 * same one drawn the other way round.
 *
 * 2022 P1 Q15 asks for x and pays 1 + 4. This asks for an expression, then for
 * the quadratic to be *derived*, then for the sides — 1 + 3 + 3 — and the
 * scheme buys each expansion separately: •² the rectangle expanded, •³ the
 * triangle expanded, •⁴ the two equated and rearranged into the printed form.
 * A pupil who reaches the right quadratic by a shortcut still has to show both
 * expansions, so the working shows both.
 *
 * Answer-first, and the arithmetic below is the reason. The quadratic must come
 * out **monic** for the "show that" to read as the papers write it, which fixes
 * the triangle's height coefficient one above the rectangle's:
 *
 *     rectangle  (Ax + B)(x + C)          = Ax^2 + (AC + B)x + BC
 *     triangle   ½ · 2(x + D) · Ex        = Ex^2 + EDx          with E = A + 1
 *     equate                                x^2 + (ED - AC - B)x - BC = 0
 *
 * so with roots p to keep and -q to reject, BC = pq and ED - AC - B = q - p.
 * Choosing the roots first and solving back is the only way to land both.
 * The paper's own numbers are A=2, B=1, C=8, E=3, D=5, giving x² - 2x - 8 = 0.
 */
function rectangleAgainstTriangle(): Q | null {
  const p = getRandomInt(2, 9);                  // the root to keep
  const q = getRandomInt(1, 8);                  // the root to reject, as -q
  // Equal and opposite roots give x^2 + 0x - 25 = 0, which is a difference of
  // two squares rather than the trinomial the "show that" prints — and the
  // printed form would carry a "+ 0x". Both papers set distinct roots.
  if (p === q) return null;
  const A = getRandomInt(1, 3);
  const E = A + 1;
  // BC has to be pq, so split it — B small, since it is the constant beside Ax
  const prod = p * q;
  const divisors = [];
  for (let b = 1; b <= prod; b++) if (prod % b === 0) divisors.push(b);
  const B = pick(divisors);
  const C = prod / B;
  const num = q - p + A * C + B;
  if (num % E !== 0) return null;
  const D = num / E;
  // Kept near the paper's own size — it sets C = 8 and D = 5. A breadth of
  // "x + 25" beside a base of "2(x + 19)" is arithmetically fine and reads
  // like nothing the exam prints.
  if (D < 1 || D > 15) return null;
  if (C > 15 || B > 15) return null;
  // Every side has to be a positive length at the answer, and the two shapes
  // must not come out as the same picture — equal areas by being congruent is
  // not a question.
  const [long, short] = [p + C, A * p + B];
  if (long <= 0 || short <= 0 || long === short) return null;
  // The figure draws (x + C) along the bottom and (Ax + B) up the side, wider
  // than tall, so the horizontal side has to be the longer one *at the answer*
  // too. Without this the answer read "length 11 cm, breadth 16 cm" beside a
  // picture plainly wider than it is high — caught by the answer check, not by
  // anything that looks at the drawing.
  if (long < short) return null;
  const base = 2 * (p + D), height = E * p;
  if (base <= 0 || height <= 0) return null;
  // The middle mark is for expanding, so the rectangle must actually need it:
  // (x + 1)(x + 8) with A = 1 is fine, but B = C makes it a square.
  if (A === 1 && B === C) return null;

  const Bx = q - p;                              // the x coefficient of the quadratic
  const Cc = -prod;                              // its constant
  const shown = quadratic(1, Bx, Cc);
  const left = A === 1 ? `(x + ${B})` : `(${A}x + ${B})`;
  const prose = [
    'The diagrams below show a rectangle and a triangle. All measurements are in centimetres.',
    `<strong>(a)</strong> Find an expression for the area of the rectangle.`,
    `<strong>(b)</strong> Given that the area of the rectangle is equal to the area of the triangle, show that $${shown}$.`,
    `<strong>(c)</strong> Hence find, algebraically, the length and breadth of the rectangle.`,
  ];
  const steps = [
    `<strong>1.</strong> Area of a rectangle is length times breadth:<br><br>$${left}(x + ${C})$`,
    `<strong>2.</strong> Expand that:<br><br>$${A === 1 ? '' : A}x^{2} ${sgn(A * C + B, 'x')} + ${B * C}$`,
    `<strong>3.</strong> The triangle is half its base times its height, and its base is $2(x + ${D})$:` +
    `<br><br>$\\frac{1}{2} \\times 2(x + ${D}) \\times ${E}x = ${E === 1 ? '' : E}x^{2} + ${E * D}x$`,
    `<strong>4.</strong> The two areas are equal, so put them together and take everything to one side:` +
    `<br><br>$${A === 1 ? '' : A}x^{2} ${sgn(A * C + B, 'x')} + ${B * C} = ${E === 1 ? '' : E}x^{2} + ${E * D}x$, giving $${shown}$`,
    `<strong>5.</strong> Factorise — two numbers multiplying to $${Cc}$ and adding to $${Bx}$:<br><br>$(x ${sgn(-p)})(x ${sgn(q)}) = 0$`,
    `<strong>6.</strong> Solve:<br><br>$x = ${p}$ or $x = ${-q}$`,
    `<strong>7.</strong> A length cannot be negative, so $x = ${p}$, and the rectangle measures` +
    `<br><br>$${long}$ cm by $${short}$ cm`,
  ];
  return assemble(
    shapePair(
      { kind: 'rectangle', w: 96, h: 60, labels: { w: `x + ${C}`, h: A === 1 ? `x + ${B}` : `${A}x + ${B}` } },
      { kind: 'triangle', base: 88, height: 74, labels: { base: `2(x + ${D})`, height: `${E === 1 ? '' : E}x` } } as PlaneShape,
    ),
    'A Rectangle Against a Triangle', 'form-equation.rectangle-triangle', prose,
    `Rectangle $${left}(x + ${C})$ equals triangle base $2(x + ${D})$, height $${E}x$. Show $${shown}$ and find its sides.`,
    // 2016 P1 Q12: (a) 1, (b) 3 — expand each and equate, (c) 3 — factorise,
    // solve, reject and state both sides.
    steps, [1, 1, 1, 1, 1, 1, 1],
    `Length ${long} cm, breadth ${short} cm`);
}

// ── dispatch ──────────────────────────────────────────────────────────────

const tried = (name: string, make: () => Q | null): (() => Q) => () => {
  for (let i = 0; i < 6000; i++) {
    const q = make();
    if (q) return q;
  }
  throw new Error(`${name}: no valid question found`);
};

export const FORM_EQUATION_GENERATORS: Record<string, () => Q> = {
  'A Border Round a Rectangle': tried('form-equation.border', borderAllRound),
  'A Wall on Three Sides': tried('form-equation.three-sided', wallOnThreeSides),
  'A Triangle Against a Rectangle': tried('form-equation.triangle-rectangle', triangleAgainstRectangle),
  'A Rectangle Against a Square': tried('form-equation.rectangle-square', rectangleAgainstSquare),
  'A Cuboid of Given Volume': tried('form-equation.cuboid', cuboidVolume),
  'A Rectangle Against a Triangle':
    tried('form-equation.rectangle-triangle', rectangleAgainstTriangle),
};
