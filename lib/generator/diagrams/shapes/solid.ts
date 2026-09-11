import { type Claim, type Element, type Figure, type Pt, pt } from '../scene';

/**
 * The solids the volume questions are about — singly, stacked, and hollowed.
 *
 * Thirteen paper questions share one picture with different pieces in it: a
 * cone, a sphere, a cylinder with a dome on top, a box with a ball on top, a
 * cone with its tip cut off. Writing thirteen figures would have meant thirteen
 * chances to place a label badly, so this is one figure with a vocabulary of
 * pieces and one way of measuring them.
 *
 * **Two projections, and which piece gets which.** Round pieces are drawn in
 * elevation: the silhouette is a true vertical section, so a cylinder 24 across
 * and 70 high is drawn 24 across and 70 high and every printed measurement can
 * be re-measured off the page. What is *not* true is the flatness of a rim — a
 * circle lying horizontally is drawn as an ellipse, and its vertical squash is
 * a convention with no number attached. Flat-faced pieces cannot be drawn that
 * way at all: their depth has to go somewhere, so they use the oblique
 * projection the papers and the textbooks use, and any figure containing one is
 * marked `notToScale`, which is what that flag is for.
 *
 * **Measurements sit outside the solid, and this module decides where.** SQA
 * draws the height of a cone as a dashed line inside it, and that reads well on
 * paper where a person placed the number. Generated, the number has to go
 * somewhere no line will be, and inside a cone there is nowhere: the axis, the
 * radius and the two slant sides all converge on the point the label wants. So
 * a caller says *what* it is measuring and which side it wants it on, never
 * where the line goes — the geometry is known here and nowhere else, and a
 * generator computing its own offsets would be the one place a label could
 * quietly land on a rim.
 */

/** How flat a horizontal circle looks. Foreshortening, and nothing measures it. */
const TILT = 0.3;

/**
 * How far back a unit of depth goes in the oblique pieces, and at what angle.
 *
 * Wider than the 0.5 of a textbook cabinet projection, for the same reason
 * `solid-on-axes` opened its own out: a gatepost is 2.4 metres tall on a base
 * of 0.48, and at 0.5 its depth edges came out under the 26px a stroke needs
 * to be legible. The ratio is a convention with no measurement attached, so
 * widening it costs nothing and a box still reads as a box.
 */
const DEPTH = 0.62;
const DEPTH_DIR = pt(Math.cos(Math.PI / 6), Math.sin(Math.PI / 6));

/**
 * One piece of a solid, in the question's own units.
 *
 * `r` is always a radius even where the question states a diameter, because
 * every volume formula wants the radius and the halving is the pupil's first
 * step, not the diagram's.
 */
export type Piece =
  | { kind: 'cylinder'; r: number; h: number }
  | { kind: 'cone'; r: number; h: number }
  /** A cone with its tip cut off — `rTop` is the radius of the cut. */
  | { kind: 'frustum'; r: number; rTop: number; h: number }
  /** Flat face down and dome up, unless `flat` says otherwise. */
  | { kind: 'hemisphere'; r: number; flat?: 'down' | 'up' }
  | { kind: 'sphere'; r: number }
  /** Square base of side `w`. */
  | { kind: 'box'; w: number; h: number }
  | { kind: 'pyramid'; w: number; h: number }
  /** A pyramid with its tip cut off — `wTop` is the side of the cut. */
  | { kind: 'pyramidFrustum'; w: number; wTop: number; h: number };

export const pieceHeight = (p: Piece): number =>
  p.kind === 'sphere' ? 2 * p.r : p.kind === 'hemisphere' ? p.r : p.h;

const isOblique = (p: Piece): boolean =>
  p.kind === 'box' || p.kind === 'pyramid' || p.kind === 'pyramidFrustum';

/** The square side of a flat-faced piece, or twice the radius of a round one. */
const pieceWidth = (p: Piece): number =>
  p.kind === 'box' || p.kind === 'pyramid' || p.kind === 'pyramidFrustum' ? p.w
    : p.kind === 'frustum' ? 2 * Math.max(p.r, p.rTop)
    : 2 * p.r;

/**
 * A measurement to write on the figure.
 *
 * `value` is the number the question prints, and the check re-measures the
 * drawn line against it. A leader measures nothing — it points — so it carries
 * no value and makes no claim.
 *
 * `rank` orders dimension lines on the same side: 0 stands nearest the solid.
 */
export type Dim =
  /** A vertical extent, on a line standing clear to one side. */
  | { along: 'height'; from: number; to: number; side: 'left' | 'right';
      rank?: number; cx?: number; value: number; text: string }
  /** A horizontal extent, on a line clear above or below everything. */
  | { along: 'width'; halfWidth: number; side: 'above' | 'below';
      rank?: number; cx?: number; value: number; text: string }
  /**
   * A line pointing at a feature, with the number at its far end.
   *
   * For a measurement with nowhere to lie: the thickness of a shell, the cut
   * face of a truncated pyramid. Both are spans of a few units inside a figure
   * tens of units across, and a dimension line there would be under the label
   * it carries. Pointing at the feature and writing the number outside is what
   * the papers do in the same position.
   */
  | { along: 'leader'; at: Pt; degrees: number; text: string };

export interface SolidSpec {
  /** Pieces from the ground up. Each stands on top of the one below. */
  stack: Piece[];
  /**
   * A piece cut out of the solid, or a removed tip drawn back in to show what
   * was taken. Dashed, since it is a boundary inside the figure rather than an
   * edge of it.
   *
   * `on` names the face it sits on — the bottom piece's base, or the top of the
   * whole stack — rather than a height, because on an oblique piece those are
   * not on the axis: the centre of a box's base is half a depth behind its
   * front edge, and a hemisphere hollowed out on the axis would sit against the
   * front wall. `lift` raises it from there, for a piece concentric with
   * another rather than resting on a face.
   */
  ghosts?: { piece: Piece; on: 'base' | 'top'; lift?: number }[];
  dims: Dim[];
}

// ── the pieces ────────────────────────────────────────────────────────────

/**
 * A horizontal circle, seen at an angle.
 *
 * The near half lies on the silhouette and the far half is hidden behind the
 * solid, so they are two arcs, solid and dashed, exactly as the papers draw
 * them. `whole` is for a rim nothing hides — the open top of a cylinder.
 */
function rim(centre: Pt, rx: number, whole: boolean, dashed: boolean): Element[] {
  const ry = rx * TILT;
  if (whole) return [{ kind: 'ellipse', centre, rx, ry, dashed }];
  return [
    { kind: 'ellipse', centre, rx, ry, from: 180, to: 360, dashed },
    { kind: 'ellipse', centre, rx, ry, from: 0, to: 180, dashed: true },
  ];
}

/** The depth offset of an oblique piece of width `w`. */
const depthOf = (w: number): Pt =>
  pt(w * DEPTH * DEPTH_DIR.x, w * DEPTH * DEPTH_DIR.y);

/** One piece, its base centred at `o`. */
function drawPiece(p: Piece, o: Pt, dashed: boolean): Element[] {
  const at = (x: number, y: number): Pt => pt(o.x + x, o.y + y);
  const seg = (from: Pt, to: Pt): Element => ({ kind: 'segment', from, to, dashed });

  switch (p.kind) {
    case 'cylinder': {
      return [
        seg(at(-p.r, 0), at(-p.r, p.h)),
        seg(at(p.r, 0), at(p.r, p.h)),
        ...rim(at(0, p.h), p.r, true, dashed),
        ...rim(at(0, 0), p.r, false, dashed),
      ];
    }
    case 'cone': {
      const apex = at(0, p.h);
      return [seg(at(-p.r, 0), apex), seg(at(p.r, 0), apex), ...rim(at(0, 0), p.r, false, dashed)];
    }
    case 'frustum': {
      return [
        seg(at(-p.r, 0), at(-p.rTop, p.h)),
        seg(at(p.r, 0), at(p.rTop, p.h)),
        ...rim(at(0, p.h), p.rTop, true, dashed),
        ...rim(at(0, 0), p.r, false, dashed),
      ];
    }
    case 'hemisphere': {
      // Flat side down: the dome is the upper half of a circle centred on the
      // flat face. Flat side up: the lower half, and the flat face is then an
      // opening you see all of, so its rim is one unbroken curve.
      const up = p.flat === 'up';
      const centre = at(0, up ? p.r : 0);
      return [
        { kind: 'arc', centre, r: p.r, from: up ? 180 : 0, to: up ? 360 : 180, dashed },
        ...rim(centre, p.r, up, dashed),
      ];
    }
    case 'sphere': {
      const centre = at(0, p.r);
      // A solid sphere gets its equator, which is what stops a circle reading
      // as a disc. A ghost sphere does not: inside another sphere it is already
      // a dashed circle, and a dashed equator across a dashed circle inside a
      // solid one with *its* equator made four curves of a coated sweet where
      // two say it.
      return [
        { kind: 'circle', centre, r: p.r, dashed },
        ...(dashed ? [] : rim(centre, p.r, false, dashed)),
      ];
    }
    case 'box': {
      const w = p.w / 2;
      const back = depthOf(p.w);
      const F = [at(-w, 0), at(w, 0), at(w, p.h), at(-w, p.h)];
      const B = F.map(q => pt(q.x + back.x, q.y + back.y));
      // Drawn as edges rather than as a second polygon: the visible back of a
      // box is an L of five edges, and closing it as a quadrilateral runs a
      // line from the top-left-front corner to the bottom-right-back one,
      // straight through the middle of the solid. It looked like a fold.
      return [
        { kind: 'polygon', points: F, dashed },
        seg(F[1], B[1]), seg(F[2], B[2]), seg(F[3], B[3]),
        seg(B[1], B[2]), seg(B[2], B[3]),
        // the corner round the back, dashed as the papers draw it
        { kind: 'segment', from: B[0], to: B[1], dashed: true },
        { kind: 'segment', from: B[0], to: B[3], dashed: true },
        { kind: 'segment', from: F[0], to: B[0], dashed: true },
      ];
    }
    case 'pyramid': {
      const w = p.w / 2;
      const back = depthOf(p.w);
      const bl = at(-w, 0), br = at(w, 0);
      const B = [bl, br].map(q => pt(q.x + back.x, q.y + back.y));
      const apex = pt(o.x + back.x / 2, o.y + back.y / 2 + p.h);
      return [
        { kind: 'polygon', points: [bl, br, B[1], B[0]], dashed },
        seg(bl, apex), seg(br, apex), seg(B[1], apex),
        { kind: 'segment', from: B[0], to: apex, dashed: true },
      ];
    }
    case 'pyramidFrustum': {
      const [w, t] = [p.w / 2, p.wTop / 2];
      const back = depthOf(p.w), backTop = depthOf(p.wTop);
      // the cut face is centred over the base, so it carries half the
      // difference in depth as well as half the difference in width
      const lift = pt((back.x - backTop.x) / 2, (back.y - backTop.y) / 2);
      const bl = at(-w, 0), br = at(w, 0);
      const bB = [bl, br].map(q => pt(q.x + back.x, q.y + back.y));
      const tl = at(-t + lift.x, p.h + lift.y), tr = at(t + lift.x, p.h + lift.y);
      const tB = [tl, tr].map(q => pt(q.x + backTop.x, q.y + backTop.y));
      return [
        { kind: 'polygon', points: [bl, br, bB[1], bB[0]], dashed },
        { kind: 'polygon', points: [tl, tr, tB[1], tB[0]], dashed },
        seg(bl, tl), seg(br, tr), seg(bB[1], tB[1]),
        { kind: 'segment', from: bB[0], to: tB[0], dashed: true },
      ];
    }
  }
}

/**
 * Where the piece above this one stands.
 *
 * On a round piece, directly on top. On a flat-faced one, on the centre of its
 * top face — which in oblique projection is half a depth back from the front
 * edge, and that shift is the difference between a ball sitting on a gatepost
 * and a ball balanced on its front lip.
 *
 * The depth is always the *base* width, including for a truncated pyramid: its
 * cut face is centred over its base, so the two faces share a centre line and
 * the narrower face is not half its own depth back but half the base's. Using
 * the cut width instead put a removed tip 6 units in front of the hole it came
 * out of, which drew perfectly and was wrong.
 */
function topOf(p: Piece, o: Pt): Pt {
  const back = obliqueDepth(p);
  if (!back) return pt(o.x, o.y + pieceHeight(p));
  return pt(o.x + back.x / 2, o.y + pieceHeight(p) + back.y / 2);
}

/** The centre of a piece's base face — its axis, not its front edge. */
function baseCentreOf(p: Piece, o: Pt): Pt {
  const back = obliqueDepth(p);
  return back ? pt(o.x + back.x / 2, o.y + back.y / 2) : o;
}

/** The depth offset of a flat-faced piece, or null for a round one. */
function obliqueDepth(p: Piece): Pt | null {
  return p.kind === 'box' || p.kind === 'pyramid' || p.kind === 'pyramidFrustum'
    ? depthOf(p.w) : null;
}

// ── the figure ────────────────────────────────────────────────────────────

/** Every point the pieces touch, for deciding where the dimension lines stand. */
function extent(elements: Element[]): { x0: number; x1: number; y0: number; y1: number } {
  const ps: Pt[] = [];
  for (const e of elements) {
    if (e.kind === 'segment') ps.push(e.from, e.to);
    else if (e.kind === 'polygon') ps.push(...e.points);
    else if (e.kind === 'circle') ps.push(pt(e.centre.x - e.r, e.centre.y - e.r), pt(e.centre.x + e.r, e.centre.y + e.r));
    else if (e.kind === 'arc') ps.push(pt(e.centre.x - e.r, e.centre.y - e.r), pt(e.centre.x + e.r, e.centre.y + e.r));
    else if (e.kind === 'ellipse') ps.push(pt(e.centre.x - e.rx, e.centre.y - e.ry), pt(e.centre.x + e.rx, e.centre.y + e.ry));
  }
  const xs = ps.map(p => p.x), ys = ps.map(p => p.y);
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
}

export function solidFigure(spec: SolidSpec): Figure {
  const elements: Element[] = [];
  let o = pt(0, 0);
  for (const piece of spec.stack) {
    elements.push(...drawPiece(piece, o, false));
    o = topOf(piece, o);
  }
  const foot = baseCentreOf(spec.stack[0], pt(0, 0));
  for (const g of spec.ghosts ?? []) {
    const seat = g.on === 'top' ? o : foot;
    elements.push(...drawPiece(g.piece, pt(seat.x, seat.y + (g.lift ?? 0)), true));
  }

  const box = extent(elements);
  // How far a dimension line stands off the figure, and how far the next one
  // out stands beyond that. Proportional, so a bollard 70 tall and a sweet 24
  // across get the same look rather than the same number of units.
  const gap = 0.11 * Math.max(box.x1 - box.x0, box.y1 - box.y0);

  const claims: Claim[] = [];
  for (const d of spec.dims) {
    if (d.along === 'leader') {
      const reach = gap * 2.2;
      const rad = d.degrees * Math.PI / 180;
      const end = pt(d.at.x + reach * Math.cos(rad), d.at.y + reach * Math.sin(rad));
      elements.push({ kind: 'segment', from: d.at, to: end, decoration: true });
      elements.push({ kind: 'label', text: d.text, anchor: end, away: d.at });
      continue;
    }
    // A second line on the same side stands well clear of the first, not one
    // gap beyond it: the inner line's number is pushed *outward*, so a single
    // gap puts it on top of the line outside it.
    const step = gap * (1 + 1.9 * (d.rank ?? 0));
    const cx = d.cx ?? 0;
    let a: Pt, b: Pt, inward: Pt;
    if (d.along === 'height') {
      const x = d.side === 'left' ? box.x0 - step : box.x1 + step;
      [a, b] = [pt(x, d.from), pt(x, d.to)];
      inward = pt(x + (d.side === 'left' ? 1 : -1), (d.from + d.to) / 2);
    } else {
      const y = d.side === 'below' ? box.y0 - step : box.y1 + step;
      [a, b] = [pt(cx - d.halfWidth, y), pt(cx + d.halfWidth, y)];
      inward = pt(cx, y + (d.side === 'below' ? 1 : -1));
    }
    const mid = pt((a.x + b.x) / 2, (a.y + b.y) / 2);
    elements.push({ kind: 'segment', from: a, to: b, dashed: true });
    elements.push({ kind: 'label', text: d.text, anchor: mid, away: inward });
    claims.push({ kind: 'length', from: a, to: b, value: d.value });
  }

  // A projected face is not in proportion in any direction, so a figure holding
  // one claims nothing metric about the page and says so. A figure of round
  // pieces alone is a true vertical section, and does.
  const projected = [...spec.stack, ...(spec.ghosts ?? []).map(g => g.piece)].some(isOblique);
  return { scene: { elements, notToScale: projected }, claims };
}

export { pieceWidth };
