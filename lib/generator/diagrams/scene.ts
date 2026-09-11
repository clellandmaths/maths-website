/**
 * The diagram model.
 *
 * A shape routine never emits SVG. It builds a **scene** in mathematical
 * coordinates — y upwards, units are whatever the question is about — and
 * `render.ts` projects that to pixels. Nothing else produces path data.
 *
 * That separation is what makes a generated diagram checkable rather than
 * merely plausible. The 14 hand-written SVGs in apps.ts are the alternative:
 * every coordinate a magic number chosen by eye, label positions guessed, and
 * in the Venn diagrams the data does not appear in the picture at all. That is
 * survivable when the picture is decoration. For National 5 the diagram *is*
 * the question — a triangle labelled 7.2 cm and 43° — so it has to be right,
 * and "right" has to be something a check can establish.
 *
 * What the separation buys:
 *
 *   - every labelled length and angle can be re-measured off the scene and
 *     compared with the number printed in the question (see verify.ts)
 *   - label placement is solved once, here and in the renderer, instead of by
 *     eye in each routine
 *   - the viewBox is computed from the content including label extents, so a
 *     clipped diagram is not expressible
 *   - theme and print are handled in one place
 */

/**
 * How far a label must stay from ink it does not label, in pixels.
 *
 * It lives here because **two functions have to agree about it and did not**.
 * `verify` demanded five pixels of clearance while `place` scored its candidate
 * seats on whether the label box *intersected* anything - so the placer would
 * happily take a seat 1.8px from a line, count zero hits, and hand the verifier
 * a figure it was bound to reject. A layout that could have been drawn was
 * thrown away, silently, by the retry loop.
 *
 * The renderer already leaves a label 8px clear of its own anchor, so this is
 * about drift onto everything else. Below about 5px two marks stop reading as
 * separate at the size these are printed.
 */
export const LABEL_CLEARANCE = 5;

export interface Pt { x: number; y: number }

export const pt = (x: number, y: number): Pt => ({ x, y });

export const add = (a: Pt, b: Pt): Pt => pt(a.x + b.x, a.y + b.y);
export const sub = (a: Pt, b: Pt): Pt => pt(a.x - b.x, a.y - b.y);
export const scale = (a: Pt, k: number): Pt => pt(a.x * k, a.y * k);
export const mid = (a: Pt, b: Pt): Pt => pt((a.x + b.x) / 2, (a.y + b.y) / 2);
export const dist = (a: Pt, b: Pt): number => Math.hypot(b.x - a.x, b.y - a.y);

export function unit(a: Pt): Pt {
  const d = Math.hypot(a.x, a.y);
  return d < 1e-12 ? pt(0, 0) : pt(a.x / d, a.y / d);
}

/** The centroid, used as the default "push the label away from here" point. */
export function centroid(ps: Pt[]): Pt {
  const s = ps.reduce((acc, p) => add(acc, p), pt(0, 0));
  return scale(s, 1 / ps.length);
}

/** The angle at `at`, between the arms to `p` and `q`, in degrees. */
export function angleAt(at: Pt, p: Pt, q: Pt): number {
  const u = unit(sub(p, at)), v = unit(sub(q, at));
  const cos = Math.max(-1, Math.min(1, u.x * v.x + u.y * v.y));
  return Math.acos(cos) * 180 / Math.PI;
}

/** Direction of a point from `at`, in degrees anticlockwise from east. */
export function bearing(at: Pt, to: Pt): number {
  const d = sub(to, at);
  const a = Math.atan2(d.y, d.x) * 180 / Math.PI;
  return a < 0 ? a + 360 : a;
}

// ── the elements a scene is built from ────────────────────────────────────

export type Element =
  /**
   * `decoration` marks a stroke that is part of a symbol rather than part of
   * the figure — the two barbs of a north arrow, say. It still has to keep
   * clear of labels, but it is exempt from the minimum-length rule, which
   * exists so that a side has room for its measurement. An arrowhead never
   * carries one, and lengthening it to satisfy the rule would only make the
   * arrow wrong.
   */
  | { kind: 'segment'; from: Pt; to: Pt; dashed?: boolean; decoration?: boolean }
  | { kind: 'polygon'; points: Pt[]; dashed?: boolean }
  | { kind: 'circle'; centre: Pt; r: number; dashed?: boolean }
  /** An arc from one bearing to another, anticlockwise, both in degrees. */
  | { kind: 'arc'; centre: Pt; r: number; from: number; to: number; dashed?: boolean }
  /**
   * An axis-aligned elliptical arc — the rim of a round solid seen at an angle.
   *
   * A circle lying flat, viewed from slightly above, is an ellipse on the page,
   * and every cylinder, cone and hemisphere the papers draw is drawn that way.
   * Without it a cone is just a triangle.
   *
   * `ry` is foreshortening and claims nothing: the horizontal `rx` is the
   * solid's true radius and is measured against the question, the vertical
   * squash is a convention of the projection and never is. `from` and `to` are
   * degrees anticlockwise from east, as for `arc`, so the near half of a rim
   * (solid) and the far half (dashed) are two elements. Omit both for a
   * complete ellipse.
   */
  | { kind: 'ellipse'; centre: Pt; rx: number; ry: number; from?: number; to?: number;
      /**
       * The ellipse turned, in degrees anticlockwise. For a circle that lies in
       * a plane the projection shears — the base of a cone standing on the
       * coordinate axes — where the image is an ellipse whose axes are not the
       * page's. Omit it and the rim leans the wrong way, which is the one thing
       * about such a drawing a reader notices.
       */
      tilt?: number;
      dashed?: boolean }
  /** The square corner mark, drawn between the two arms. */
  | { kind: 'rightAngle'; at: Pt; arms: [Pt, Pt] }
  /**
   * The region between a chord and its arc, filled rather than stroked.
   *
   * "Calculate the area of the shaded segment" needs the shading, or the
   * question cannot say which of the two pieces it means.
   */
  | { kind: 'shadedSegment'; centre: Pt; r: number; from: number; to: number }
  /**
   * The wedge at a vertex, filled rather than stroked.
   *
   * The papers shade the angle they are asking for and name it as well —
   * "Calculate the size of shaded angle BCD" — and the two do different jobs.
   * The letters are exact and the shading is instant: a pupil sees which angle
   * before reading anything, which matters most where a vertex has four lines
   * leaving it and three of the angles between them are plausible questions.
   */
  | { kind: 'shadedAngle'; at: Pt; arms: [Pt, Pt]; r: number }
  /**
   * A region bounded by straight sides, filled rather than stroked.
   *
   * Not an answer — a shape. Where a paper's figure is a design rather than a
   * bare diagram, part of it is often filled: 2019 P1 Q11 draws a logo and
   * shades the triangle inside it. The question never mentions the shading and
   * the working never uses it, but the figure is the logo and the logo has a
   * dark triangle in it.
   */
  | { kind: 'shadedShape'; points: Pt[];
      /**
       * How dark, as a multiple of the usual fill. Default 1.
       *
       * Two regions of one figure that the question names separately have to
       * be told apart, and one fill cannot do it. 2015 P2 Q9 prints its flag
       * beside the diagram in two greys for exactly that reason.
       */
      tone?: number }
  /** Equal-length ticks across a segment. */
  | { kind: 'ticks'; from: Pt; to: Pt; count: number }
  /**
   * An open run of points, drawn as one smooth stroke.
   *
   * `polygon` closes itself and `segment` is straight, so neither can draw a
   * parabola or a sine wave, and every graph question in the papers needs one.
   * The curve is sampled by the caller — the shape routine knows the function
   * and the window — and this only has to join the samples up.
   *
   * Samples sit a few pixels apart, so the minimum-stroke-length rule would
   * reject every curve ever drawn. It does not apply: that rule exists so a
   * *side* has room for its measurement, and no curve carries one.
   */
  | { kind: 'path'; points: Pt[]; dashed?: boolean }
  /**
   * One line of a background ruling — a square grid, drawn faintly.
   *
   * **Not a `segment`, and that difference is the whole reason it exists.**
   * Every segment has to keep clear of every label, which is right for ink that
   * asserts something; a grid is the paper the figure is drawn on, and the
   * exams put their axis numbers hard against it — 2019 P1 Q6 prints its 16
   * touching the top gridline. Ruled as segments, every number on every gridded
   * figure would fail the label-clearance rule, and the honest fix is to say a
   * ruling is not that kind of ink rather than to weaken the rule everywhere.
   *
   * So a gridline renders thin and pale, carries no measurement, blocks no
   * label and is never measured. Everything the question actually asserts — an
   * axis, a plotted line, a marked point — is a real element drawn on top of
   * it.
   */
  | { kind: 'gridline'; from: Pt; to: Pt }
  /**
   * A filled marker at a plotted point.
   *
   * The papers print a solid dot wherever a graph question names a coordinate,
   * and it does real work. "The point (−3, 45) lies on the graph" is a claim
   * about *which* point on it, and without the dot a reader has to infer the
   * place from the numbers, which is the wrong way round — the whole question
   * is reading the numbers off the place.
   */
  | { kind: 'dot'; at: Pt; small?: boolean }
  /**
   * Text placed near `anchor`, pushed directly away from `away`.
   *
   * One rule covers every label a school diagram needs: a vertex label pushes
   * away from the centroid so it sits outside the shape, and a side label
   * anchored at the midpoint pushes away from the opposite vertex so it sits
   * outside that side. Routines never choose pixel offsets.
   */
  | {
      kind: 'label'; text: string; anchor: Pt; away: Pt; small?: boolean;
      /**
       * `tick` marks a number printed against an axis as part of its *scale*.
       *
       * A scale is read by comparing one number with the next, so two of them
       * have to be far enough apart to be read as two. Not overlapping is not
       * enough: a half-period and a period 36 degrees apart cleared the overlap
       * rule by a hair and the eye read them as the single blob "36 72". Every
       * other label only has to avoid ink.
       */
      role?: 'tick-x' | 'tick-y';
      /**
       * Further points to push away from, tried in order if the first collides.
       *
       * The rule above gives every label exactly one direction, and for almost
       * every figure that is right — a vertex letter belongs outside its shape
       * and there is one outside. It breaks down when a figure is crowded: on a
       * projected cuboid lettered ABCDEFGH a corner whose letter lands on a
       * hidden back edge has nowhere else to go, and **2.2% of layouts placed
       * all eleven labels**, with 3000 draws giving 37 distinct shapes.
       *
       * So a routine may offer alternatives, and `place()` takes the first that
       * lands clear. This is a *preference order*, not a licence: the first
       * entry is still the one the routine thinks is right, and `verifyFigure`
       * remains the judge of whether the chosen one is acceptable — a label
       * that collides on every candidate still fails, exactly as before.
       */
      alternatives?: Pt[];
      /**
       * Turned a quarter turn, reading upwards.
       *
       * **This is how a paper fits a fine scale under an axis.** 2014 P1 Q10
       * numbers its x-axis every 20 degrees - eighteen numbers - and the only
       * way eighteen of them fit is turned on their sides. Its answer is
       * b = -40, read off the numbered 40 line exactly, so the fine scale is
       * not decoration: it is what makes the question answerable as set.
       *
       * A turned number is also far easier to keep clear of a curve, because
       * it is narrow where a curve is steep.
       */
      rotate?: boolean;
    };

export interface Scene {
  elements: Element[];
  /**
   * How wide this drawing should be, in pixels, before its labels are added.
   *
   * Defaults to the renderer's own constant and is overridden by exactly one
   * shape. A label is a fixed 13px however the geometry is scaled, so on a
   * figure that letters every vertex the lettering is what runs out of room -
   * the lettered cuboid of 2026 P1 Q11 placed **8 of about 1,800** legal
   * arrangements, which left it sitting on the variety check's floor and
   * failing about one run in six.
   *
   * Per figure rather than a bigger constant, which is the rule `docs/PLAN.md`
   * records: nothing that already places can be disturbed by a shape that does
   * not.
   */
  target?: number;
  /**
   * Set when the drawing had to be compressed because the true proportions are
   * undrawable. The renderer prints the note SQA prints.
   */
  notToScale?: boolean;
  /**
   * This figure's measurements are allowed to lie across its own curves.
   *
   * Two overlapping circles have no room that is outside both of them, so every
   * chord and radius crosses an outline somewhere and a measurement on one has
   * nowhere else to go. Stated per figure rather than assumed, because it is
   * true of exactly one shape and would hide a real fault anywhere else: when
   * this was measured across every figure, that shape was the only one doing it.
   */
  labelsMayCrossCurves?: boolean;
}

// ── what the routine says the picture shows ───────────────────────────────

/**
 * A claim is a number the question prints and the diagram must agree with.
 *
 * The routine returns these alongside the scene, and verify.ts measures the
 * projected scene against them. This is the check that catches a mislabelled
 * vertex or a wrong projection — the failure that looks entirely fine.
 */
/**
 * `shown` marks a claim whose number the question also prints, so verify.ts can
 * confirm the two agree. Structural claims are `shown: false` — a right angle
 * is asserted geometrically but appears on the page as a square mark, never as
 * the number 90.
 */
export type Claim =
  | { kind: 'length'; from: Pt; to: Pt; value: number; shown?: boolean }
  | { kind: 'angle'; at: Pt; arms: [Pt, Pt]; value: number; shown?: boolean }
  /**
   * The direction a segment must be drawn in, anticlockwise from east.
   *
   * A wall is vertical, a ramp rises, a yacht sails north. The geometry is
   * identical whichever way the triangle is turned, so no measurement check
   * notices when the picture shows the wall lying flat — only the prose knows,
   * and this is how the prose says so.
   */
  | { kind: 'bearing'; from: Pt; to: Pt; degrees: number; shown?: boolean };

export interface Figure {
  scene: Scene;
  claims: Claim[];
}

// ── helpers routines use to build scenes ──────────────────────────────────

/** A closed shape, with each vertex labelled and pushed clear of the middle. */
export function labelledPolygon(points: Pt[], names: string[]): Element[] {
  const c = centroid(points);
  return [
    { kind: 'polygon', points },
    ...points.map((p, i): Element =>
      ({ kind: 'label', text: names[i], anchor: p, away: c })),
  ];
}

/** A label on a side, sitting outside it. */
export function sideLabel(from: Pt, to: Pt, text: string, inside: Pt): Element {
  return { kind: 'label', text, anchor: mid(from, to), away: inside };
}

/**
 * The chevron that says two lines are parallel.
 *
 * Notation, not geometry: the prose can say "AC and ED are parallel" and be
 * believed, but the papers mark it on the figure and a pupil reads the mark
 * before the words. Built from decoration strokes so it is exempt from the
 * minimum-length rule — an arrowhead never carries a measurement, and growing
 * one until it could would only make it wrong.
 *
 * Both marks in a pair must point the same way round, or they say nothing.
 * Callers pass the two points in the order the arrow should run.
 */
export function parallelMark(from: Pt, to: Pt, count = 1): Element[] {
  const u = unit(sub(to, from));
  const n = pt(-u.y, u.x);
  // A tenth, not a sixth. On a segment spanning the figure a sixth is an
  // arrowhead 40px long, and it reaches far enough off the line to collide
  // with a length label a quarter of the way along.
  const size = dist(from, to) * 0.1;
  const out: Element[] = [];
  for (let k = 0; k < count; k++) {
    const tip = add(mid(from, to), scale(u, size * 0.8 * k));
    const back = sub(tip, scale(u, size));
    for (const side of [1, -1]) {
      out.push({
        kind: 'segment',
        from: add(back, scale(n, size * 0.55 * side)),
        to: tip,
        decoration: true,
      });
    }
  }
  return out;
}

/**
 * The shaded wedge at a vertex, sized the way an angle mark is.
 *
 * Slightly wider than the arc `angleMark` draws, so that where a question both
 * shades an angle and marks another at the same vertex the two are told apart
 * at a glance rather than by looking twice.
 */
export function shadeAngle(at: Pt, arms: [Pt, Pt], radius?: number): Element {
  return {
    kind: 'shadedAngle', at, arms,
    r: radius ?? Math.min(dist(at, arms[0]), dist(at, arms[1])) * 0.3,
  };
}

/**
 * An angle arc at a vertex, with its size written outside the arc.
 *
 * The radius is a fraction of the shorter arm so the arc always sits inside the
 * shape, and never so small that the label has nowhere to go.
 *
 * A caller may set the radius instead. An angle at a point *on* a circle needs
 * it: the number is written along the bisector, the circle curves away from
 * that point in both directions, and at the default radius the two collide —
 * the label ends up sitting on an outline it has nothing to do with. Pushing it
 * out is only possible if the arc goes with it, or the number stops looking
 * like it belongs to the angle.
 */
export function angleMark(at: Pt, arms: [Pt, Pt], text?: string, radius?: number): Element[] {
  const r = radius ?? Math.min(dist(at, arms[0]), dist(at, arms[1])) * 0.22;
  const a = bearing(at, arms[0]);
  const b = bearing(at, arms[1]);
  // sweep the short way round
  let [from, to] = [a, b];
  if (((to - from) % 360 + 360) % 360 > 180) [from, to] = [b, a];
  const out: Element[] = [{ kind: 'arc', centre: at, r, from, to }];
  if (text) {
    const midDeg = from + (((to - from) % 360 + 360) % 360) / 2;
    const rad = midDeg * Math.PI / 180;
    // Anchored *on* the arc, not beyond it. The renderer then pushes the label
    // clear of its anchor by its own size, so the number ends up just outside
    // the curve. Anchoring further out as well put it at roughly twice the arc
    // radius, far enough from the angle to look like it belonged to something
    // else.
    const anchor = add(at, scale(pt(Math.cos(rad), Math.sin(rad)), r));
    out.push({ kind: 'label', text, anchor, away: at, small: true });
  }
  return out;
}
