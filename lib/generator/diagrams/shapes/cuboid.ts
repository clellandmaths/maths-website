import {
  type Element, type Figure, type Pt, add, pt, scale, sideLabel,
} from '../scene';

/**
 * A cuboid drawn in oblique projection, optionally on coordinate axes.
 *
 * For the space-diagonal questions — an umbrella in a locker, the length of a
 * rod across a box — where the pupil has to find a face diagonal first and then
 * use it as one side of a second right-angled triangle. Two applications of
 * Pythagoras, which is why the markscheme reads "start valid strategy for face
 * diagonal" then "continue for space diagonal".
 *
 *   2018 P2 Q16  a plain cuboid locker, 40 x 40 x 70
 *   2022 P2 Q11  a plain cuboid ABCDEFGH
 *   2016 P1 Q7   on coordinate axes, with a vertex to write down
 *   2025 P2 Q8   on coordinate axes, with a vertex to write down
 *
 * Oblique rather than true perspective, because that is what school textbooks
 * and SQA both draw: the front face is a true rectangle, and depth runs back at
 * a fixed angle. It reads as a box and the front face can be measured off the
 * page, which perspective would spoil.
 *
 * The hidden edges are dashed, as they are in every paper diagram, and the two
 * diagonals are dashed too — they are constructions the pupil supplies, not
 * edges of the solid.
 */

/** How far back a unit of depth goes, and at what angle. */
const DEPTH_SCALE = 0.5;
const DEPTH_DIR = pt(Math.cos(Math.PI / 6), Math.sin(Math.PI / 6));

export interface CuboidSpec {
  length: number;
  breadth: number;
  height: number;
  /** Eight vertex names, front face first then back, or none. */
  names?: [string, string, string, string, string, string, string, string];
  labels: { length: string; breadth: string; height: string };
  /** Draw the face diagonal and the space diagonal, dashed. */
  showDiagonals?: boolean;
  /** Draw x, y and z axes from the front-bottom-left corner. */
  showAxes?: boolean;
}

export function cuboid(spec: CuboidSpec): Figure {
  // A cuboid drawn true to scale in all three directions is unreadable when one
  // dimension dwarfs the others, so depth is drawn at a fixed fraction. That is
  // a projection, not a distortion of the maths — every paper does the same, and
  // the lengths are carried by the labels.
  const [L, B, H] = [spec.length, spec.breadth, spec.height];
  const longest = Math.max(L, B, H);
  const u = (v: number) => (v / longest) * 100;

  const back = scale(DEPTH_DIR, u(B) * DEPTH_SCALE);
  // front face, anticlockwise from the bottom-left
  const F0 = pt(0, 0);
  const F1 = pt(u(L), 0);
  const F2 = pt(u(L), u(H));
  const F3 = pt(0, u(H));
  const [K0, K1, K2, K3] = [F0, F1, F2, F3].map(p => add(p, back)) as [Pt, Pt, Pt, Pt];

  const elements: Element[] = [
    { kind: 'polygon', points: [F0, F1, F2, F3] },
    // the two visible back edges and the three visible joins
    { kind: 'segment', from: F1, to: K1 },
    { kind: 'segment', from: F2, to: K2 },
    { kind: 'segment', from: F3, to: K3 },
    { kind: 'segment', from: K1, to: K2 },
    { kind: 'segment', from: K2, to: K3 },
    // the hidden corner, dashed, exactly as the papers draw it
    { kind: 'segment', from: F0, to: K0, dashed: true },
    { kind: 'segment', from: K0, to: K1, dashed: true },
    { kind: 'segment', from: K0, to: K3, dashed: true },
  ];

  if (spec.showDiagonals) {
    // the face diagonal across the base, then up to the far top corner
    elements.push({ kind: 'segment', from: F0, to: K1, dashed: true });
    elements.push({ kind: 'segment', from: F0, to: K2, dashed: true });
  }

  if (spec.names) {
    const n = spec.names;
    const centre = scale(add(add(F0, K2), pt(0, 0)), 0.5);
    for (const [i, p] of [F0, F1, F2, F3, K0, K1, K2, K3].entries()) {
      elements.push({ kind: 'label', text: n[i], anchor: p, away: centre });
    }
  }

  const mid = scale(add(F0, K2), 0.5);
  if (spec.labels.length) elements.push(sideLabel(F0, F1, spec.labels.length, mid));
  if (spec.labels.height) elements.push(sideLabel(F1, F2, spec.labels.height, mid));
  if (spec.labels.breadth) elements.push(sideLabel(F1, K1, spec.labels.breadth, mid));

  const printed = (s: string) => /\d/.test(s);

  return {
    // The drawing is a projection, so the three edge lengths are not in
    // proportion on the page and must not be checked as though they were.
    scene: { elements, notToScale: true },
    claims: [
      // What can be asserted is the front face, which is drawn true: its
      // corners are square and its two sides are in the right ratio.
      { kind: 'angle', at: F1, arms: [F0, F2], value: 90, shown: false },
      { kind: 'angle', at: F0, arms: [F1, F3], value: 90, shown: false },
      { kind: 'length', from: F0, to: F1, value: L, shown: printed(spec.labels.length) },
      { kind: 'length', from: F1, to: F2, value: H, shown: printed(spec.labels.height) },
    ],
  };
}
