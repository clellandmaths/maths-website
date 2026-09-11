import { GeneratedQuestion } from './types';
import { getRandomInt } from './utils';
import { solidOnAxes, project, type P3, type SolidOnAxesSpec } from '../diagrams/shapes/solid-on-axes';
import { renderScene } from '../diagrams/render';
import { verifyFigure } from '../diagrams/verify';

/**
 * Writing down coordinates off a solid standing on the axes.
 *
 *   2014 P2 Q2    a cube on top of a cuboid            2
 *   2017 P1 Q5    a pyramid on top of a cube           2
 *   2018 P1 Q13   a triangular prism                   2
 *   2019 P2 Q5    a cone, the axes tangent to its base 2
 *
 * All four are two marks and the same two: state one coordinate, state the
 * other. There is no working — which is exactly why the *figure* is the whole
 * question, and why every point below is built from the solid's own dimensions
 * rather than written down beside it. A coordinate that disagreed with the
 * drawing would be unanswerable and there would be nothing in the prose to
 * catch it.
 *
 * Three of the four schemes carry the same note: **at most one mark of the two
 * where the brackets are dropped or the answer is given in component form.**
 * So the answers are always written as coordinates, never as columns, and the
 * worked steps say so.
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];
type Q = Omit<GeneratedQuestion, 'topic'>;

const coord = (p: P3) => `(${p.x}, ${p.y}, ${p.z})`;

/** Build the question, or reject the layout and let the caller draw again. */
function assemble(
  spec: SolidOnAxesSpec, subTopic: string, variationId: string,
  prose: string[], board: string, steps: string[], finalAnswer: string,
): Q | null {
  const fig = solidOnAxes(spec);
  if (verifyFigure(fig).length) return null;
  return {
    subTopic, difficulty: 'exam', variationId,
    questionLines: [prose[0], renderScene(fig.scene), ...prose.slice(1)],
    boardQuestionLines: [board],
    solutionSteps: steps,
    // •¹ state the first coordinate, •² state the second — in all four papers
    stepMarks: [1, 1],
    finalAnswer, figure: fig,
  };
}

/** The two lines every one of these ends with. */
const ask = (n1: string, n2: string) =>
  `Write down the coordinates of $${n1}$ and $${n2}$.`;

// ── a cube on top of a cuboid — 2014 P2 Q2 ───────────────────────────────

function cubeOnCuboid(): Q | null {
  const [X, Y, Z] = [getRandomInt(6, 14), getRandomInt(3, 8), getRandomInt(4, 10)];
  // The cube sits flush into the back-right corner of the cuboid's top face,
  // which is what makes B lie directly above A and gives C two coordinates a
  // pupil has to work out rather than read off.
  //
  // Its edge is the cuboid's width, and that is not a free parameter: it is the
  // only thing that makes the question answerable. Nothing on the figure states
  // the edge, and the figure is marked not to scale, so the single route to it
  // is seeing the cube span the cuboid front to back — which is exactly what
  // 2014 P2 Q2 draws, and why its C has y = 0. Drawn freely, as it was, 74.8%
  // of 2000 draws asked for a length the question never supplies.
  const c = Y;
  if (c > X - 2) return null;      // the cube must still sit ON the cuboid
  const A: P3 = { x: X, y: Y, z: Z };
  const B: P3 = { x: X, y: Y, z: Z + c };
  const C: P3 = { x: X - c, y: Y - c, z: Z + c };

  const prose = [
    `The diagram shows a cube placed on top of a cuboid, relative to the coordinate axes.`,
    `$A$ is the point $${coord(A)}$.`,
    ask('B', 'C'),
  ];
  const steps = [
    `<strong>1.</strong> The cube spans the cuboid from front to back, so its edge is the cuboid's width, ${c} — and being a cube, it is ${c} high too. $B$ is directly above $A$, so only the height changes:` +
    `<br><br>$B${coord(B)}$`,
    `<strong>2.</strong> $C$ is the far top corner of the cube, ${c} back along $x$ and ${c} forward along $y$, which brings it to the front face:` +
    `<br><br>$C${coord(C)}$`,
  ];
  return assemble({
    parts: [
      { kind: 'cuboid', at: { x: 0, y: 0, z: 0 }, size: { x: X, y: Y, z: Z } },
      { kind: 'cuboid', at: { x: X - c, y: Y - c, z: Z }, size: { x: c, y: c, z: c } },
    ],
    names: { A, B, C },
    showCoords: ['A'],
  }, 'Coordinates of a Cube on a Cuboid', 'coords.cube-on-cuboid', prose,
    `Cube ${c} on a cuboid ${X} by ${Y} by ${Z}, $A${coord(A)}$. Find $B$ and $C$.`,
    steps, `$B${coord(B)}$ and $C${coord(C)}$`);
}

// ── a pyramid on top of a cube — 2017 P1 Q5 ──────────────────────────────

function pyramidOnCube(): Q | null {
  const s = getRandomInt(4, 12) * 2;                  // even, so the apex is whole
  const h = getRandomInt(1, 3) * (s / 2);
  const A: P3 = { x: s, y: 0, z: 0 };
  const B: P3 = { x: 0, y: s, z: s };
  const C: P3 = { x: s / 2, y: s / 2, z: s + h };

  const prose = [
    `The diagram shows a square-based pyramid placed on top of a cube, relative to the coordinate axes.`,
    `The height of the pyramid is ${h === s / 2 ? 'half of the height of the cube' : `$${h}$ units`}.`,
    `$A$ is the point $${coord(A)}$. The point $C$ is directly above the centre of the base.`,
    ask('B', 'C'),
  ];
  const steps = [
    `<strong>1.</strong> $B$ is the far top corner of the cube. The cube has side ${s}, so:` +
    `<br><br>$B${coord(B)}$`,
    `<strong>2.</strong> $C$ is above the centre of the base, so its $x$ and $y$ are both half of ${s}, and its height is ${s} + ${h}:` +
    `<br><br>$C${coord(C)}$`,
  ];
  return assemble({
    parts: [
      { kind: 'cuboid', at: { x: 0, y: 0, z: 0 }, size: { x: s, y: s, z: s } },
      { kind: 'pyramid', at: { x: 0, y: 0, z: s }, size: { x: s, y: s, z: h } },
    ],
    names: { A, B, C },
    showCoords: ['A'],
  }, 'Coordinates of a Pyramid on a Cube', 'coords.pyramid-on-cube', prose,
    `Pyramid height ${h} on a cube of side ${s}, $A${coord(A)}$. Find $B$ and $C$.`,
    steps, `$B${coord(B)}$ and $C${coord(C)}$`);
}

// ── a triangular prism — 2018 P1 Q13 ─────────────────────────────────────

function prism(): Q | null {
  const w = getRandomInt(2, 6) * 2;                   // even, so the apex is whole
  const e = getRandomInt(1, 5);
  const [z, L] = [getRandomInt(3, 9), getRandomInt(4, 12)];
  const A: P3 = { x: e + w / 2, y: 0, z };
  const B: P3 = { x: e + w / 2, y: L, z };
  const C: P3 = { x: e + w, y: L, z: 0 };
  const E: P3 = { x: e, y: 0, z: 0 };

  /**
   * The apex must not land on the y-axis.
   *
   * $AB$ is parallel to the y-axis by construction - it is the second thing
   * the question says - so on the page the two lines are always parallel, and
   * when A falls near the axis they lie on top of each other. The figure then
   * reads as though A were **on** the axis, which would put its x at 0, while
   * the label beside it says otherwise. Measured across the ranges, it happens
   * often enough to see in a sheet of ten.
   */
  const apex = project(A);
  const yDir = project({ x: 0, y: 1, z: 0 });
  const yLen = Math.hypot(yDir.x, yDir.y) || 1;
  if (Math.abs(apex.x * yDir.y - apex.y * yDir.x) / yLen < 1.4) return null;

  const prose = [
    `The diagram shows a triangular prism $ABCDEF$, relative to the coordinate axes.`,
    `$A${coord(A)}$ and $E${coord(E)}$, with $AD = AE$ and $DC = ${L}$ units.`,
    `Edges $EF$, $DC$ and $AB$ are parallel to the $y$-axis.`,
    ask('B', 'C'),
  ];
  const steps = [
    `<strong>1.</strong> $AB$ runs parallel to the $y$-axis and is ${L} long, so only the $y$ coordinate of $A$ changes:` +
    `<br><br>$B${coord(B)}$`,
    `<strong>2.</strong> $AD = AE$ makes the cross-section isosceles, so $D$ is as far to the right of $A$ as $E$ is to the left — that is $x = ${e + w}$ — and $C$ is ${L} back from it at ground level:` +
    `<br><br>$C${coord(C)}$`,
  ];
  return assemble({
    parts: [{ kind: 'prism', at: { x: e, y: 0, z: 0 }, size: { x: w, y: L, z } }],
    names: {
      A, B, C, D: { x: e + w, y: 0, z: 0 }, E, F: { x: e, y: L, z: 0 },
    },
    // 2018 P1 Q13 prints `A (4,0,5)` and `E (2,0,0)` on the figure, and letters
    // B, C, D and F bare - the two the pupil is given carry their numbers, the
    // four they are not stay plain. This drew none of them, which made it the
    // only one of the five coordinate figures that states its givens in prose
    // alone.
    showCoords: ['A', 'E'],
  }, 'Coordinates of a Triangular Prism', 'coords.prism', prose,
    `Prism, $A${coord(A)}$, $E${coord(E)}$, $DC = ${L}$. Find $B$ and $C$.`,
    steps, `$B${coord(B)}$ and $C${coord(C)}$`);
}

// ── a cone with the axes tangent to its base — 2019 P2 Q5 ────────────────

function coneOnAxes(): Q | null {
  const r = getRandomInt(2, 7);
  const h = getRandomInt(r + 2, r * 4);
  const A: P3 = { x: r, y: 0, z: 0 };
  const B: P3 = { x: r, y: r, z: h };

  const prose = [
    `The diagram shows a cone with diameter ${2 * r} units and height ${h} units.`,
    `$\\bullet \\quad$ The $x$-axis and the $y$-axis are tangents to the base`,
    `$\\bullet \\quad$ $A$ is the point of contact between the base and the $x$-axis`,
    `$\\bullet \\quad$ $B$ is directly above the centre of the base`,
    ask('A', 'B'),
  ];
  const steps = [
    `<strong>1.</strong> Both axes touch the base, so the centre is one radius from each: the centre is at $(${r}, ${r})$. $A$ is where the base touches the $x$-axis, directly in front of the centre:` +
    `<br><br>$A${coord(A)}$`,
    `<strong>2.</strong> $B$ is above the centre, at the full height of the cone:` +
    `<br><br>$B${coord(B)}$`,
  ];
  return assemble({
    parts: [{ kind: 'cone', at: { x: r, y: r, z: 0 }, r, h }],
    names: { A, B },
    showCoords: [],
  }, 'Coordinates on a Cone', 'coords.cone', prose,
    `Cone, diameter ${2 * r}, height ${h}, axes tangent to the base. Find $A$ and $B$.`,
    steps, `$A${coord(A)}$ and $B${coord(B)}$`);
}

// ── 2026 P1 Q11 is deferred, and this is why ────────────────────────────
//
// A lettered cuboid ABCDEFGH standing off the origin, with a midpoint marked on
// one top edge. It was built and then withdrawn, because the figure will not
// lay out often enough to be worth shipping: **nine labels on a projected box
// pass one attempt in a hundred, and 3000 draws produced ten distinct shapes.**
// A variation that always draws nearly the same picture is worse than one that
// does not exist, since it looks like coverage.
//
// It is not the parameters. Every band tried — deeper, longer, taller, further
// back — sat between 0.4% and 1.3%. It is the label count, and that is
// measurable: drop A and the rate doubles, drop A and F and it reaches 6%.
// Dropping them is not an option here, because the prose names the solid
// ABCDEFGH and a diagram missing two of its letters contradicts its own name.
//
// What it actually needs is **a label that can try more than one side.**
// Placement today is a single `away` direction decided by the shape routine,
// and a corner whose letter lands on a hidden back edge has nowhere else to go;
// the pixel positions are only known later, inside verify. Giving a label a
// list of candidate offsets and letting the placement pick the first clear one
// would lift every figure in this file, including the documented 9% bias on
// `pythagoras.coordinates-cuboid`. That is the piece of work this question is
// waiting on, not a tweak to its numbers.
//
// One more thing was learned and then undone. The axis length is 1.25 times the
// largest *raw* dimension, and that is the wrong quantity: the y-axis projects
// diagonally, so a box long in x pushes its screen edge past a y-axis sized
// from y alone and the axis letter lands on the solid. Sizing each axis from
// the projected bounding box instead does fix that — and **regressed
// `coords.pyramid-on-cube` to zero layouts**, because a longer axis widens the
// view, everything shrinks, and labels that are a fixed size in pixels then
// collide. Reverted. It is only worth doing alongside the label work above,
// which is what would absorb the shrinkage.

// ── dispatch ──────────────────────────────────────────────────────────────

const tried = (name: string, make: () => Q | null): (() => Q) => () => {
  for (let i = 0; i < 6000; i++) {
    const q = make();
    if (q) return q;
  }
  throw new Error(`${name}: no valid question found`);
};

// ── a fully lettered cuboid, and a midpoint — 2026 P1 Q11 ───────────
//
// **Built once and withdrawn**, because eleven labels on a projected box placed
// 1.5% of the time and 3000 draws gave under forty distinct shapes — a variation
// that always draws nearly the same picture is worse than none, since it looks
// like coverage. What it needed was a label able to try more than one side,
// which `place()` now does; the same figure places 12% of the time and gives
// over two hundred distinct shapes. `label-rate.mts` is that measurement.
//
// Unlike the other four, this one letters **every** vertex and prints two of
// them as full coordinates, which is what makes it the crowded case. Part (b)
// asks for a midpoint, so it is the only one of the five where a coordinate is
// worked out rather than read off.

function letteredCuboid(): Q | null {
  const w = getRandomInt(6, 16);                  // along x
  /**
   * Where it starts in y, and it has to **look** like a deliberate offset.
   *
   * 2026 P1 Q11 stands its cuboid two units up the y axis against a width of
   * twelve, so E sits a clear distance from O along that axis. Ours allowed
   * y0 = 1 against a width of 16, which projects to **four and a half pixels**
   * - the near vertical edge a whisker off the z axis, reading as a wobble
   * rather than as a solid standing back from the origin.
   *
   * Tied to the width, since the drawing is scaled to fit and a fixed number of
   * units means nothing on the page.
   */
  const y0 = getRandomInt(3, 10);
  const dd = 2 * getRandomInt(2, 5);              // its depth in y, even so the
  const y1 = y0 + dd;                             //   midpoint is a whole number
  const h = getRandomInt(3, 9);                   // its height in z

  // Lettered as the paper does: ABCD round the top, EFGH beneath them, with A
  // above E. The two whose coordinates are printed are diagonally opposite on
  // the solid, which is what leaves G genuinely to be worked out.
  const A = { x: 0, y: y0, z: h }, B = { x: 0, y: y1, z: h };
  const C = { x: w, y: y1, z: h }, D = { x: w, y: y0, z: h };
  const E = { x: 0, y: y0, z: 0 }, F = { x: 0, y: y1, z: 0 };
  const G = { x: w, y: y1, z: 0 }, H = { x: w, y: y0, z: 0 };
  const M = { x: w, y: (y0 + y1) / 2, z: h };     // the midpoint of CD

  const prose = [
    'The diagram shows a cuboid, ABCDEFGH, relative to the coordinate axes.',
    `&bull;&nbsp;&nbsp;B has coordinates $${coord(B)}$.`,
    `&bull;&nbsp;&nbsp;H has coordinates $${coord(H)}$.`,
    '&bull;&nbsp;&nbsp;EH is parallel to the x-axis.',
    '<b>(a)</b>&nbsp;&nbsp;State the coordinates of G.',
    '<b>(b)</b>&nbsp;&nbsp;M is the midpoint of CD.<br>State the coordinates of M.',
  ];
  const steps = [
    `<strong>1. (a)</strong> G is directly below C, and C is at the far end of the cuboid from B. `
    + `Take the $x$ from H, the $y$ from B, and G sits on the base so its $z$ is 0:`
    + `<br><br>$G${coord(G)}$`,
    `<strong>2. (b)</strong> C and D are the two top corners at the far end, at $y = ${y1}$ and $y = ${y0}$. `
    + `The midpoint is halfway between them, and everything else about them is the same:`
    + `<br><br>$M\\left(${w}, \\frac{${y1} + ${y0}}{2}, ${h}\\right) = M${coord(M)}$`,
  ];

  return assemble(
    {
      parts: [{ kind: 'cuboid', at: { x: 0, y: y0, z: 0 }, size: { x: w, y: dd, z: h } }],
      names: { A, B, C, D, E, F, G, H, M },
      showCoords: ['B', 'H'],
      dots: ['M'],
    },
    'A Lettered Cuboid and a Midpoint', 'coords.lettered-cuboid', prose,
    `Cuboid ABCDEFGH, B${coord(B)}, H${coord(H)}. Find G and the midpoint of CD.`,
    // Named, as the other four are: the answer says *which* point each triple
    // is, and the check then verifies the figure draws them there.
    steps, `(a) $G${coord(G)}$<br>(b) $M${coord(M)}$`);
}

export const COORDS_3D_GENERATORS: Record<string, () => Q> = {
  'Coordinates of a Cube on a Cuboid': tried('coords.cube-on-cuboid', cubeOnCuboid),
  'Coordinates of a Pyramid on a Cube': tried('coords.pyramid-on-cube', pyramidOnCube),
  'Coordinates of a Triangular Prism': tried('coords.prism', prism),
  'Coordinates on a Cone': tried('coords.cone', coneOnAxes),
  'A Lettered Cuboid and a Midpoint': tried('coords.lettered-cuboid', letteredCuboid),
};
