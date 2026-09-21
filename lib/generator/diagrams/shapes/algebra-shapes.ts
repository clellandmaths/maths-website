import {
  dimensionArrow, mid, pt, sideLabel, type Claim, type Element, type Figure, type Pt,
} from '../scene';

/**
 * Shapes whose sides are expressions rather than numbers.
 *
 * Five paper questions build an equation out of a picture — a border round a
 * photograph, a wall on three sides of a floor, a triangle set against a
 * rectangle, a rectangle against a square — and every side of every one of them
 * is written in terms of x.
 *
 * **These figures claim no lengths, and that is not a weakness.** A claim is a
 * number the question prints that the drawing has to agree with; here the
 * question prints `2x + 3`, which is a length only once x is known, and x is
 * the answer. Drawing it "to scale" would mean choosing a value for the unknown
 * and putting it on the page, which is worse than saying nothing. So the
 * figures are marked not to scale and carry only their right angles, which are
 * true whatever x turns out to be.
 *
 * What still gets checked is everything else verify.ts does: labels that do not
 * collide or sit on lines, nothing outside the view, no stroke too short to
 * read, no hardcoded colour.
 */

/** How far the shapes in a pair stand apart, as a fraction of the wider one. */
const PAIR_GAP = 0.34;

// ── a rectangle inside a rectangle ────────────────────────────────────────

export interface BorderedRectangleSpec {
  /** The inner rectangle, in drawing units. */
  innerW: number;
  innerH: number;
  /**
   * How many sides the border runs round.
   *
   * Four for a mount round a picture; three for 2026 P2 Q13, where the
   * extension has a wall on three sides and is open where it meets the house.
   * The difference is the whole of that question's part (a) — the length grows
   * by 2x and the width by only x — so it has to be visible in the drawing and
   * not merely stated.
   */
  sides: 3 | 4;
  labels: {
    width: string; height: string; border: string;
    /** Three-sided only: what the question calls the whole span. */
    length?: string;
  };
}

export function borderedRectangle(spec: BorderedRectangleSpec): Figure {
  const { innerW: w, innerH: h, sides } = spec;
  // Generous, because the border has to hold a label and the drawing is not to
  // scale anyway: a strip drawn at its true width would be a hairline whenever
  // x is small, which is exactly when these questions set it.
  const t = Math.max(w, h) * 0.26;

  // inner rectangle sits at the origin; the outer one grows around it
  const i0 = pt(0, 0), i1 = pt(w, 0), i2 = pt(w, h), i3 = pt(0, h);
  const o0 = pt(-t, -t);
  const o1 = pt(w + t, -t);
  const o2 = pt(w + t, sides === 4 ? h + t : h);
  const o3 = pt(-t, sides === 4 ? h + t : h);

  const elements: Element[] = [
    { kind: 'polygon', points: [o0, o1, o2, o3] },
    { kind: 'polygon', points: [i0, i1, i2, i3] },
    // the inner rectangle's own measurements, written inside it where there is
    // room — the border strip has to hold the third label and nothing else
    sideLabel(i0, i1, spec.labels.width, pt(w / 2, -h)),
    sideLabel(i0, i3, spec.labels.height, pt(-w, h / 2)),
    // the border, measured across the strip on the left with the number beside
    // the line rather than on it
    { kind: 'segment', from: pt(-t, h * 0.55), to: pt(0, h * 0.55), dashed: true },
    { kind: 'label', text: spec.labels.border, anchor: pt(-t / 2, h * 0.55), away: pt(-t / 2, h * 1.4) },
  ];

  /**
   * **What the three-sided figure has to show, and did not.**
   *
   * 2026 P2 Q13 part (a) is *"write down an expression for the LENGTH of
   * the extension in terms of x"*, and the first mark is `2x + 6` — which
   * needs the reader to see a wall at BOTH ends. The figure marked x on the
   * left wall only, named neither the floor nor the wall, shaded nothing,
   * and carried no arrow saying what "length" meant. The paper does all
   * four. The owner, on the 2026 P2 sheet: *"Agreed"*.
   *
   * **The paper's "floor" and "wall" words are NOT reproduced**, and that is
   * a deliberate omission rather than an oversight. Both were tried and
   * `verifyFigure` rejected them at every size tested: the wall strip is too
   * narrow to hold a word without touching one of its own edges, and the floor
   * already carries the width and height labels pushed in from two sides. A
   * label that sits on ink it does not name is worse than no label — that rule
   * is the reason the check exists. What the words were there to disambiguate,
   * the shading and the span arrow now do.
   *
   * **Gated on `sides === 3`**, so `form-equation.border` — the four-sided
   * caller, a different question — is untouched.
   */
  if (sides === 3) {
    // the wall itself, as a ring: outer boundary then back round the inner
    elements.unshift({ kind: 'shadedShape',
      points: [o0, o1, o2, i2, i1, i0, i3, o3] });
    // x on the other two walls, matching the left one already drawn
    elements.push(
      { kind: 'segment', from: pt(w, h * 0.55), to: pt(w + t, h * 0.55), dashed: true },
      { kind: 'label', text: spec.labels.border, anchor: pt(w + t / 2, h * 0.55),
        away: pt(w + t / 2, h * 1.4) },
      { kind: 'segment', from: pt(w * 0.5, -t), to: pt(w * 0.5, 0), dashed: true },
      { kind: 'label', text: spec.labels.border, anchor: pt(w * 0.5, -t / 2),
        away: pt(w * 1.6, -t / 2) },
    );
    // what the question calls the length, spanned and named
    // NB `dimensionArrow` moves the arrow TOWARD its third argument, where
    // `sideLabel` moves a label AWAY from its fourth. Passing a point below
    // the figure — the reading that matches sideLabel — drove the arrow down
    // onto the rectangle's own edge and its label sat on ink at 0.0px.
    elements.push(...dimensionArrow(
      pt(-t, h), pt(w + t, h), pt(w / 2, h * 3), t * 0.9,
      spec.labels.length ?? 'length', true));
  }

  // Right angles at two corners of each rectangle. True whatever x is, which
  // is the only thing about this picture that is.
  const claims: Claim[] = [
    { kind: 'angle', at: i0, arms: [i1, i3], value: 90, shown: false },
    { kind: 'angle', at: i2, arms: [i1, i3], value: 90, shown: false },
    { kind: 'angle', at: o0, arms: [o1, o3], value: 90, shown: false },
  ];
  return { scene: { elements, notToScale: true }, claims };
}

// ── two shapes side by side ───────────────────────────────────────────────

export type PlaneShape =
  | { kind: 'rectangle'; w: number; h: number; labels: { w: string; h: string } }
  | { kind: 'square'; s: number; label: string }
  /**
   * Right-angled, with the perpendicular height as its left side.
   *
   * The paper draws a general triangle with the height dropped inside it, and
   * that is where the height label has to live — inside, between two sides
   * that converge on it. There is no room: measured, the number sat two pixels
   * off the very line it belongs to. A right-angled triangle says the same
   * thing about the same area, and puts the height on the outside where it can
   * be read.
   */
  | { kind: 'triangle'; base: number; height: number; labels: { base: string; height: string } }
  /**
   * Upright and general, with the height as a dimension arrow beside it.
   *
   * **This is what 2022 P1 Q15's own scan draws**, and the note on `triangle`
   * above ruled the paper's shape out on a premise that does not describe it.
   * It says *"the paper draws a general triangle with the height dropped
   * inside it, and that is where the height label has to live"*. It is not.
   * Counted off the scan: a tall upright triangle, `3 cm` written under the
   * base, and `(x + 12) cm` on a **double-headed arrow standing clear of the
   * triangle altogether** — the same device this paper's own Q3 uses for the
   * height of a cone. Outside, so there is room; and no right angle, because
   * the paper marks none.
   *
   * That matters beyond looks: a right angle is information the paper does not
   * give, and the paper's height is a perpendicular distance rather than a
   * side. The area is the same either way, which is why nothing in the suite
   * caught it — the 2023 P1 Q10 fault, right in every number and wrong in its
   * picture. Found by putting the render beside the scan.
   *
   * **Opt-in, and `triangle` is left exactly as it was.**
   * `form-equation.rectangle-triangle` (2016 P1 Q12) is the other caller and
   * is not yet reviewed, so it keeps the right-angled drawing it has.
   */
  | { kind: 'triangle-upright'; base: number; height: number;
      labels: { base: string; height: string } };

const shapeWidth = (s: PlaneShape): number =>
  s.kind === 'rectangle' ? s.w : s.kind === 'square' ? s.s : s.base;

const shapeHeight = (s: PlaneShape): number =>
  s.kind === 'rectangle' ? s.h : s.kind === 'square' ? s.s : s.height;

/**
 * One shape with its bottom-left corner at `at`.
 *
 * `side` says which half of the pair this is, and only one thing depends on it:
 * a vertical measurement goes on the *outward* face. Put both on the right and
 * the left shape's height lands in the gap, against the other shape.
 */
function drawShape(s: PlaneShape, at: Pt, side: 'left' | 'right'): Element[] {
  const P = (x: number, y: number) => pt(at.x + x, at.y + y);
  const w = shapeWidth(s), h = shapeHeight(s);
  // `sideLabel` pushes a label *away* from the point it is given, so the point
  // that sends a measurement below the shape is one above it, not one below.
  const above = P(w / 2, h * 2);
  const outward = side === 'left' ? P(w * 2, h / 2) : P(-w, h / 2);

  if (s.kind === 'triangle') {
    const [a, b, apex] = [P(0, 0), P(s.base, 0), P(0, s.height)];
    return [
      { kind: 'polygon', points: [a, b, apex] },
      { kind: 'rightAngle', at: a, arms: [b, apex] },
      sideLabel(a, b, s.labels.base, above),
      { kind: 'label', text: s.labels.height, anchor: mid(a, apex), away: outward },
    ];
  }

  if (s.kind === 'triangle-upright') {
    // Apex over the middle of the base, so no side is vertical and nothing
    // reads as a right angle — the paper's triangle leans both ways.
    const [a, b, apex] = [P(0, 0), P(s.base, 0), P(s.base / 2, s.height)];
    // The arrow stands on the OUTWARD side, the same rule the rectangles
    // follow: on the left shape it goes left, so the pair's gap stays clear.
    // `dimensionArrow` takes a point on the side the arrow should sit, which
    // is the opposite convention to `sideLabel`'s `away` — hence the flip.
    const armX = side === 'left' ? 0 : s.base;
    return [
      { kind: 'polygon', points: [a, b, apex] },
      sideLabel(a, b, s.labels.base, above),
      // `extend` draws the dashed leaders out to the arrow, so it is clear the
      // measurement runs from the base line up to the apex's level rather than
      // along any side. 2022 P1 Q15's scan draws exactly those leaders.
      ...dimensionArrow(
        P(armX, 0), P(armX, s.height),
        side === 'left' ? P(-w, h / 2) : P(w * 2, h / 2),
        Math.max(w * 0.3, 14), s.labels.height, true,
      ),
    ];
  }

  const [c0, c1, c2, c3] = [P(0, 0), P(w, 0), P(w, h), P(0, h)];
  const vertical = side === 'left' ? [c0, c3] : [c1, c2];
  const labels: Element[] = s.kind === 'square'
    // One label on a square: the other side is the same, and saying so twice
    // reads as though the two might differ.
    ? [sideLabel(c0, c1, s.label, above)]
    : [
      sideLabel(c0, c1, s.labels.w, above),
      { kind: 'label', text: s.labels.h, anchor: mid(vertical[0], vertical[1]), away: outward },
    ];
  return [{ kind: 'polygon', points: [c0, c1, c2, c3] }, ...labels];
}

/**
 * Two shapes standing side by side on the same line.
 *
 * Both questions that need this compare areas, so the shapes have to be seen
 * together and neither may look like part of the other — hence the gap, and
 * hence bottoms aligned rather than centres, which is how a pupil reads them as
 * two separate things.
 */
export function shapePair(
  left: PlaneShape, right: PlaneShape,
  /**
   * Whether to print "not drawn to scale" in the corner.
   *
   * On by default, and off where the paper being cloned does not print it -
   * 2025 P1 Q15 draws its rectangle and square with no such note. The flag is
   * only ever the caption here: this figure claims no lengths, because every
   * side is an expression, so there is no length-ratio check for it to waive.
   */
  opts: { notToScale?: boolean } = {},
): Figure {
  const gap = Math.max(shapeWidth(left), shapeWidth(right)) * PAIR_GAP;
  const elements = [
    ...drawShape(left, pt(0, 0), 'left'),
    ...drawShape(right, pt(shapeWidth(left) + gap, 0), 'right'),
  ];
  // Only the right angles, for the reason in the header: every side is an
  // expression, so no length on this page is a number anybody printed.
  const claims: Claim[] = [];
  for (const [s, x] of [[left, 0], [right, shapeWidth(left) + gap]] as [PlaneShape, number][]) {
    // An upright triangle has no right angle to claim — its apex sits over the
    // middle of the base, so the corner at (x, 0) is acute. Claiming 90 here
    // would assert something the drawing deliberately does not show.
    if (s.kind === 'triangle-upright') continue;
    claims.push({
      kind: 'angle', at: pt(x, 0),
      arms: [pt(x + shapeWidth(s), 0), pt(x, shapeHeight(s))],
      value: 90, shown: false,
    });
  }
  return { scene: { elements, notToScale: opts.notToScale ?? true }, claims };
}

// ── a cuboid whose edges are expressions ──────────────────────────────────

/** How far back a unit of depth goes, and at what angle. */
const DEPTH = 0.55;
const DEPTH_DIR = pt(Math.cos(Math.PI / 6), Math.sin(Math.PI / 6));

export interface AlgebraicCuboidSpec {
  length: number;
  breadth: number;
  height: number;
  labels: { length: string; breadth: string; height: string };
}

/**
 * 2023 P2 Q14 — a storage unit (x + 7) by x by 2.
 *
 * Its own routine rather than `cuboid`, for one reason: `cuboid` asserts its
 * front face's two lengths, and it decides whether to look for them in the
 * question by asking whether the label contains a digit. "x + 7 m" contains a
 * digit and is not a length, so the claim went looking for the drawing's own
 * scratch number in the question text and reported the figure as showing a
 * number nobody printed. Widening that test would have weakened the check for
 * every Pythagoras question that relies on it.
 */
export function algebraicCuboid(spec: AlgebraicCuboidSpec): Figure {
  const longest = Math.max(spec.length, spec.breadth, spec.height);
  const u = (v: number) => (v / longest) * 100;
  const [L, H] = [u(spec.length), u(spec.height)];
  const back = pt(u(spec.breadth) * DEPTH * DEPTH_DIR.x, u(spec.breadth) * DEPTH * DEPTH_DIR.y);

  const F = [pt(0, 0), pt(L, 0), pt(L, H), pt(0, H)];
  const B = F.map(q => pt(q.x + back.x, q.y + back.y));
  const elements: Element[] = [
    { kind: 'polygon', points: F },
    { kind: 'segment', from: F[1], to: B[1] },
    { kind: 'segment', from: F[2], to: B[2] },
    { kind: 'segment', from: F[3], to: B[3] },
    { kind: 'segment', from: B[1], to: B[2] },
    { kind: 'segment', from: B[2], to: B[3] },
    // the corner round the back, dashed as the papers draw it
    { kind: 'segment', from: B[0], to: B[1], dashed: true },
    { kind: 'segment', from: B[0], to: B[3], dashed: true },
    { kind: 'segment', from: F[0], to: B[0], dashed: true },
    // Three measurements on three faces, each pushed off the far side of the
    // box so none of them lands in the crowded bottom-right corner where the
    // depth edge, the height edge and the base all meet.
    { kind: 'label', text: spec.labels.length, anchor: mid(F[0], F[1]), away: pt(L / 2, H * 2) },
    { kind: 'label', text: spec.labels.height, anchor: mid(F[0], F[3]), away: pt(L, H / 2) },
    // Pushed *across* the depth edge, not along it: a point chosen inside the
    // box sends this label in almost the same direction the edge runs, so it
    // slides along the line instead of clearing it.
    { kind: 'label', text: spec.labels.breadth, anchor: mid(F[1], B[1]),
      away: pt(mid(F[1], B[1]).x - back.y, mid(F[1], B[1]).y + back.x) },
  ];
  return {
    scene: { elements, notToScale: true },
    claims: [
      { kind: 'angle', at: F[0], arms: [F[1], F[3]], value: 90, shown: false },
      { kind: 'angle', at: F[1], arms: [F[0], F[2]], value: 90, shown: false },
    ],
  };
}

