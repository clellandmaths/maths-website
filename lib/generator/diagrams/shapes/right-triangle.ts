import {
  type Element, type Figure, type Pt, centroid, pt, sideLabel,
} from '../scene';

/**
 * A right-angled triangle with its sides labelled.
 *
 * The first shape routine, and the pattern the other eleven follow: it takes
 * the numbers the question was built from, returns a scene and the claims that
 * scene must satisfy, and draws nothing itself.
 *
 * Covers the twelve Pythagoras questions and, with the same code, the four
 * space-diagonal ones once a cuboid is added.
 *
 * Orientation is varied because a pupil who only ever meets the right angle at
 * the bottom left starts recognising the picture instead of the maths — the
 * same reason the contexts vary. The right angle is always at C.
 */

export interface RightTriangleSpec {
  /** The two legs and the hypotenuse, in the question's units. */
  legA: number;
  legB: number;
  hyp: number;
  /** What to write on each side; an empty string leaves it unlabelled. */
  labels: { legA: string; legB: string; hyp: string };
  /** Vertex names, in order [right angle, end of legA, end of legB]. */
  vertices?: [string, string, string];
  /** 0-3, quarter turns. Chosen by the caller so it can be reproduced. */
  turn?: 0 | 1 | 2 | 3;
  /**
   * Reflect in the y-axis, so the horizontal leg runs left instead of right.
   *
   * Needed whenever the prose fixes a direction — "sails from R due east to S"
   * puts R on the left — and useful otherwise for a second layout at no cost.
   */
  mirror?: boolean;
  /**
   * Assert which way up the triangle is drawn.
   *
   * Set when the prose fixes it — "leans against a vertical wall", "rises from
   * level ground", "due north". The geometry is identical whichever way the
   * triangle is turned, so no measurement notices a wall drawn lying flat; only
   * a bearing claim does.
   */
  lockOrientation?: boolean;
}

/**
 * Compress an extreme aspect ratio to something drawable.
 *
 * A 200 m by 3 m rectangle drawn true is a line. SQA draws these schematically
 * and marks them "not drawn to scale", so that is what happens here: the ratio
 * is pulled towards 1 by a power, which is monotonic, so the longer side stays
 * the longer side. Angles are never touched by this — an angle labelled 30 must
 * look like 30 — which is why only the leg lengths go through it.
 */
const MAX_RATIO = 4;

function compress(a: number, b: number): { a: number; b: number; squashed: boolean } {
  const ratio = Math.max(a, b) / Math.min(a, b);
  if (ratio <= MAX_RATIO) return { a, b, squashed: false };
  // pull the ratio down to MAX_RATIO, keeping the order
  const power = Math.log(MAX_RATIO) / Math.log(ratio);
  return a > b
    ? { a: b * Math.pow(a / b, power), b, squashed: true }
    : { a, b: a * Math.pow(b / a, power), squashed: true };
}

export function rightTriangle(spec: RightTriangleSpec): Figure {
  const names = spec.vertices ?? ['C', 'A', 'B'];
  const { a: dx, b: dy, squashed } = compress(spec.legA, spec.legB);

  // right angle at C, legA along the x-axis, legB up the y-axis
  const base: Pt[] = [pt(0, 0), pt(dx, 0), pt(0, dy)];
  const turn = spec.turn ?? 0;
  const rot = (p: Pt): Pt => {
    switch (turn) {
      case 1: return pt(-p.y, p.x);
      case 2: return pt(-p.x, -p.y);
      case 3: return pt(p.y, -p.x);
      default: return p;
    }
  };
  const flip = (p: Pt): Pt => (spec.mirror ? pt(-p.x, p.y) : p);
  const [C, A, B] = base.map(p => flip(rot(p))) as [Pt, Pt, Pt];
  const inside = centroid([C, A, B]);

  const elements: Element[] = [
    { kind: 'polygon', points: [C, A, B] },
    { kind: 'rightAngle', at: C, arms: [A, B] },
    { kind: 'label', text: names[0], anchor: C, away: inside },
    { kind: 'label', text: names[1], anchor: A, away: inside },
    { kind: 'label', text: names[2], anchor: B, away: inside },
  ];
  if (spec.labels.legA) elements.push(sideLabel(C, A, spec.labels.legA, inside));
  if (spec.labels.legB) elements.push(sideLabel(C, B, spec.labels.legB, inside));
  if (spec.labels.hyp) elements.push(sideLabel(A, B, spec.labels.hyp, inside));

  // A side labelled "x cm" carries no number for the question to print — it is
  // the answer. Only sides whose label contains a digit are claimed as shown.
  const printed = (label: string) => /\d/.test(label);

  return {
    scene: { elements, notToScale: squashed },
    claims: [
      // The right angle is claimed explicitly. If a future change rotated or
      // skewed the construction, this is what would notice.
      { kind: 'angle', at: C, arms: [A, B], value: 90, shown: false },
      // Lengths are still claimed when the drawing is compressed: the check
      // switches from "to scale" to "the order of the sides survived".
      { kind: 'length', from: C, to: A, value: spec.legA, shown: printed(spec.labels.legA) },
      { kind: 'length', from: C, to: B, value: spec.legB, shown: printed(spec.labels.legB) },
      { kind: 'length', from: A, to: B, value: spec.hyp, shown: printed(spec.labels.hyp) },
      ...(spec.lockOrientation ? [
        { kind: 'bearing' as const, from: C, to: B, degrees: 90, shown: false },
        { kind: 'bearing' as const, from: C, to: A, degrees: spec.mirror ? 180 : 0, shown: false },
      ] : []),
    ],
  };
}
