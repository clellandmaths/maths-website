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
  | { kind: 'cylinder'; r: number; h: number;
      /**
       * Something sits on the top, so the back half of the top rim is hidden
       * and dashed, as 2019 P2 Q8 draws the rim under its bollard's dome. The
       * owner, on the 2019 re-review sheet: "Yes". Opt-in; every other
       * cylinder draws its open top whole, as it did.
       */
      capped?: true }
  | { kind: 'cone'; r: number; h: number }
  /** A cone with its tip cut off — `rTop` is the radius of the cut. */
  | { kind: 'frustum'; r: number; rTop: number; h: number }
  /** Flat face down and dome up, unless `flat` says otherwise. */
  | { kind: 'hemisphere'; r: number; flat?: 'down' | 'up' }
  /**
   * `radius` marks it the way 2026 P2 Q6 marks its ball: a dot at the centre
   * and a dashed line out to the rim with the measurement on it. Without it a
   * sphere is a circle and a word, which is what this drew while the paper
   * printed a figure for each part of the question.
   */
  | { kind: 'sphere'; r: number; radius?: string;
      /**
       * A shaded ball with no equator, as 2022 P2 Q3 prints its gatepost's.
       * The owner, on the 2022 re-review: "shade the shapes as per the
       * question". Opt-in; every other sphere draws as it did.
       */
      shaded?: true;
      /**
       * A ball lit from the upper right, pale there and darker to the rim, as
       * 2018 P2 Q7 prints its ball. `shaded`'s flat grey read as a disc. The
       * owner, on the 2018-2014 light pass contact sheet: "Looks like a circle
       * shading needed to make more sphere". Opt-in; `shaded` and every other
       * sphere draw as they did.
       */
      lit?: true }
  /**
   * Square base of side `w`. `shaded` greys its three visible faces and drops
   * the dashed hidden edges, as 2022 P2 Q3's solid gatepost is printed.
   * Opt-in, for that question; every other box draws as it did.
   */
  | { kind: 'box'; w: number; h: number; shaded?: true }
  | { kind: 'pyramid'; w: number; h: number;
      /**
       * Write the base's length on its front and right edges, as 2018 P1 Q17
       * writes "6 cm" on both, rather than on a dimension line under the
       * solid. The owner, on the 2018-2014 light pass: "Yes". Opt-in; every
       * other pyramid draws as it did.
       */
      edgeLabel?: string }
  /**
   * A pyramid with its tip cut off — `wTop` is the side of the cut.
   *
   * `shaded` greys its three visible faces, darker as they turn from the
   * front, the way 2023 P2 Q9 prints its concrete block. Opt-in, for that
   * question only; every other caller draws the outline it always has.
   */
  | { kind: 'pyramidFrustum'; w: number; wTop: number; h: number; shaded?: true };

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
      rank?: number; cx?: number; value: number; text: string; arrow?: true;
      /**
       * The measurement is the thing being asked for, so the figure names it
       * with a word - 2026 P2 Q6 writes "height" up the side of its cone - and
       * the question never prints the number. The line is still claimed, so the
       * drawing has to be in proportion; it is just not required to appear in
       * the text, which is what `shown` on a length claim means.
       */
      unknown?: true;
      /**
       * The ghost whose **apex** this height ends at.
       *
       * An apex stands over the centre of its base, half a depth back, so it
       * is drawn higher than its own height - and a height arrow that stops at
       * the bare height stops short of it. Naming the ghost lets the offset be
       * computed where the projection is known. Also what carries each end of
       * the arrow back to the shape with a rule, the way 2023 P2 Q9 draws it.
       */
      onGhost?: number;
      /**
       * Carry each end of the arrow back to the shape with a thin rule, the
       * way 2023 P2 Q9 draws its two heights.
       *
       * **Opt-in, because this branch is every solid's.** Drawn for all of
       * them, it changed four signed-off questions when the owner had asked
       * about one - `frozen` named 2024 P2 Q7 and 2026 P2 Q6, which nobody
       * had asked to touch. The same trap `angleMark` set earlier in the
       * week: a shared helper widened for one figure moves every figure.
       */
      rules?: true;
      /**
       * **End this height at the *drawn* top of a stacked piece.**
       *
       * A piece that sits on a flat-faced one is seated on that face's
       * *centre*, which in oblique projection is half a depth back - so it is
       * drawn `depthOf(w).y / 2` higher than its own height, and a height
       * arrow that stops at the plain height stops inside it.
       *
       * The owner, on 2022 P2 Q3: *"the total height line does not draw tall
       * enough - stops in middle of sphere... you need accurate drawing
       * here."* Measured off that figure: the sphere's drawn top was at 0.00
       * and the arrow's at 9.92, with the box's depth offset 19.85. Exactly
       * half, exactly as above. The bottom end was already right, because the
       * first piece in a stack sits at the origin with no offset.
       *
       * `onGhost` solves the same problem for a *ghost*'s apex; this is the
       * stack's version, and it is the index of the piece whose top the arrow
       * ends at. **Opt-in, like `rules` and for the same reason**: applied to
       * every solid it would move every stacked figure in the course, which is
       * what happened the last time a dimension branch was made unconditional
       * and `frozen` named the four questions it moved.
       */
      toStackTop?: number;
      /**
       * Start this height at the drawn *seat* of a stacked piece - the level
       * the piece rests on, carrying the same half-depth offset as
       * `toStackTop`. Paired with it, this measures a stacked piece's own
       * extent: on 2022 P2 Q3, the sphere's diameter.
       */
      fromStackSeat?: number }
  /**
   * A horizontal extent, on a line clear above or below everything.
   *
   * `arrow` draws it the way 2018 P2 Q7 and 2025 P2 Q2 draw the diameter of
   * their ball: a solid line with a barb at each end, rather than the dashed
   * line with no ends that every dimension here defaults to. Per dimension
   * rather than for all of them, because the papers behind the other solids
   * have not been read yet and each gets looked at when its own question does.
   */
  | { along: 'width'; halfWidth: number; side: 'above' | 'below';
      rank?: number; cx?: number; value: number; text: string; arrow?: true;
      /**
       * Draw it across a **ghost piece**, on that piece's own seat, rather
       * than on a line standing clear of the whole solid.
       *
       * 2024 P2 Q7 measures the hemisphere's diameter on the flat face itself,
       * inside the dome - and it has to be there, because on a line under the
       * box it is a second horizontal measurement below the first with nothing
       * saying which of them spans what.
       *
       * **It is not enough to give the height.** A ghost on `base` is seated
       * at `baseCentreOf`, which on an oblique box is half a depth *behind*
       * the front edge - the same reason `ghosts` names a face rather than a
       * height. Placing the line at y = 0 on the axis put it across the front
       * face of the cuboid instead of across the dome, which is what the owner
       * saw. So the seat is read from the ghost rather than restated.
       */
      onGhost?: number }
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
  ghosts?: { piece: Piece; on: 'base' | 'top'; lift?: number;
    /**
     * **Seen through the solid, so drawn solid and shaded.** 2014 P2 Q7's
     * cone is glass, and the paper draws the copper hemisphere inside it as a
     * visible, dark body with its outline unbroken. Only a hemisphere takes
     * the shading. Opt-in: every other ghost in the course is a cut-out or a
     * removed tip, and stays dashed and unfilled.
     */
    seen?: true;
    /**
     * **And it hides what is behind it.** 2024 P2 Q7's red glass dome sits
     * inside a clear box, and the box's back edges stop where the dome is in
     * front of them. Without this, the dashed back edge ran through the
     * middle of the dome and through the diameter's number written there, so
     * every draw failed verification. Opt-in, with `seen`: 2014 P2 Q7's cone
     * has no hidden edge behind its dome, and keeps its figure exactly.
     */
    hides?: true }[];
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
        ...rim(at(0, p.h), p.r, !p.capped, dashed),
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
      if (p.shaded && !dashed) {
        const ball: Pt[] = [];
        for (let k = 0; k < 72; k++) {
          const t = 2 * Math.PI * k / 72;
          ball.push(pt(centre.x + p.r * Math.cos(t), centre.y + p.r * Math.sin(t)));
        }
        return [
          { kind: 'shadedShape', points: ball, tone: 2 },
          { kind: 'circle', centre, r: p.r, dashed },
        ];
      }
      // The renderer has only flat fills, so the gradient is built from them:
      // each layer is the ball with a smaller disc cut out, the discs shrinking
      // toward the highlight. A point is under more layers the further it is
      // from the highlight, so the ink deepens toward the rim.
      if (p.lit && !dashed) {
        const ring = (c: Pt, r: number, back: boolean): Pt[] => {
          const out: Pt[] = [];
          for (let k = 0; k <= 72; k++) {
            const t = 2 * Math.PI * (back ? -k : k) / 72;
            out.push(pt(c.x + r * Math.cos(t), c.y + r * Math.sin(t)));
          }
          return out;
        };
        // where 2018 P2 Q7's highlight sits, measured off the scan
        const light = pt(centre.x + 0.22 * p.r, centre.y + 0.2 * p.r);
        const layers: Element[] = [];
        // forty thin layers rather than twenty: at full size twenty showed rings
        for (let k = 1; k <= 40; k++) {
          const r = p.r * (1 - Math.pow(k / 41, 0.8));
          const s = 1 - r / p.r;
          const hole = pt(centre.x + (light.x - centre.x) * s, centre.y + (light.y - centre.y) * s);
          layers.push({ kind: 'shadedShape', points: [...ring(centre, p.r, false), ...ring(hole, r, true)], tone: 0.15 });
        }
        return [...layers, { kind: 'circle', centre, r: p.r, dashed }];
      }
      return [
        { kind: 'circle', centre, r: p.r, dashed },
        ...(dashed ? [] : rim(centre, p.r, false, dashed)),
        ...(p.radius && !dashed ? [
          { kind: 'dot' as const, at: centre },
          { kind: 'segment' as const, from: centre,
            to: at(p.r, p.r), dashed: true },
          { kind: 'label' as const, text: p.radius,
            anchor: at(p.r * 0.55, p.r), away: at(p.r * 0.55, p.r * 2.2) },
        ] : []),
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
      if (p.shaded && !dashed) {
        // A solid block, as the paper prints it: three greys, front lightest,
        // and no hidden edges, since nothing can be seen through it.
        return [
          { kind: 'shadedShape', points: F, tone: 1 },
          { kind: 'shadedShape', points: [F[1], B[1], B[2], F[2]], tone: 2.4 },
          { kind: 'shadedShape', points: [F[3], F[2], B[2], B[3]], tone: 1.6 },
          { kind: 'polygon', points: F, dashed },
          seg(F[1], B[1]), seg(F[2], B[2]), seg(F[3], B[3]),
          seg(B[1], B[2]), seg(B[2], B[3]),
        ];
      }
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
      // The front label goes straight below its edge. The side edge slants, so
      // its label is pushed square off it, on the side away from the base.
      const front = pt((bl.x + br.x) / 2, (bl.y + br.y) / 2);
      const side = pt((br.x + B[1].x) / 2, (br.y + B[1].y) / 2);
      const ex = B[1].x - br.x, ey = B[1].y - br.y, el = Math.hypot(ex, ey) || 1;
      const centre = pt(o.x + back.x / 2, o.y + back.y / 2);
      let nx = ey / el, ny = -ex / el;                    // one of the two normals
      if ((side.x + nx - centre.x) ** 2 + (side.y + ny - centre.y) ** 2
        < (side.x - nx - centre.x) ** 2 + (side.y - ny - centre.y) ** 2) { nx = -nx; ny = -ny; }
      return [
        { kind: 'polygon', points: [bl, br, B[1], B[0]], dashed },
        seg(bl, apex), seg(br, apex), seg(B[1], apex),
        { kind: 'segment', from: B[0], to: apex, dashed: true },
        ...(p.edgeLabel && !dashed ? [
          { kind: 'label' as const, text: p.edgeLabel, anchor: front, away: pt(front.x, front.y + 1) },
          { kind: 'label' as const, text: p.edgeLabel, anchor: side, away: pt(side.x - nx, side.y - ny) },
        ] : []),
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
        // Filled first, so every edge is drawn over the grey.
        ...(p.shaded && !dashed ? [
          { kind: 'shadedShape' as const, points: [bl, br, tr, tl], tone: 1 },
          { kind: 'shadedShape' as const, points: [br, bB[1], tB[1], tr], tone: 2 },
          { kind: 'shadedShape' as const, points: [tl, tr, tB[1], tB[0]], tone: 3 },
        ] : []),
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

/**
 * The parts of segment a-b that lie outside a convex polygon: none, one or
 * two pieces. Cyrus-Beck against each edge; the polygon may wind either way.
 */
function outsideConvex(a: Pt, b: Pt, poly: Pt[], minLen = 0.5): [Pt, Pt][] {
  const d = pt(b.x - a.x, b.y - a.y);
  let area = 0;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length];
    area += p.x * q.y - q.x * p.y;
  }
  const s = area < 0 ? -1 : 1;
  let t0 = 0, t1 = 1;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length];
    const n = pt(-s * (q.y - p.y), s * (q.x - p.x));   // points inwards
    const N = n.x * (a.x - p.x) + n.y * (a.y - p.y), D = n.x * d.x + n.y * d.y;
    if (Math.abs(D) < 1e-12) { if (N < 0) return [[a, b]]; continue; }
    const t = -N / D;
    if (D > 0) t0 = Math.max(t0, t); else t1 = Math.min(t1, t);
    if (t0 >= t1) return [[a, b]];
  }
  const at = (t: number) => pt(a.x + t * d.x, a.y + t * d.y);
  const len = Math.hypot(d.x, d.y);
  return ([[0, t0], [t1, 1]] as const).filter(([u, v]) => (v - u) * len > minLen)
    .map(([u, v]) => [at(u), at(v)] as [Pt, Pt]);
}

export function solidFigure(spec: SolidSpec): Figure {
  const elements: Element[] = [];
  let o = pt(0, 0);
  // Where each piece was actually seated, so a dimension can end on a drawn
  // top rather than on a plain height. See `toStackTop`.
  const seats: Pt[] = [];
  for (const piece of spec.stack) {
    seats.push(o);
    const drawn = drawPiece(piece, o, false);
    // A shaded ball is solid, so the edges of what it sits on stop behind it,
    // as 2022 P2 Q3's gatepost is printed. Only a `shaded` sphere does this.
    if (piece.kind === 'sphere' && piece.shaded) {
      const ball = (drawn.find(e => e.kind === 'shadedShape') as { points: Pt[] }).points;
      const rim = drawn.find(e => e.kind === 'circle') as { centre: Pt; r: number };
      for (let i = elements.length - 1; i >= 0; i--) {
        const e = elements[i];
        // And the greys behind it stop at its edge, so the two fills never
        // overlap into a darker band. The owner, on the 2022 re-review:
        // "Don't like the shadow". Each face's outline is walked finely and
        // any part inside the ball is pushed out to the ball's rim.
        if (e.kind === 'shadedShape') {
          const walked: Pt[] = [];
          for (let k = 0; k < e.points.length; k++) {
            const a = e.points[k], b = e.points[(k + 1) % e.points.length];
            for (let s = 0; s < 40; s++) {
              const p = pt(a.x + (b.x - a.x) * s / 40, a.y + (b.y - a.y) * s / 40);
              const dx = p.x - rim.centre.x, dy = p.y - rim.centre.y, dd = Math.hypot(dx, dy);
              walked.push(dd < rim.r && dd > 1e-9
                ? pt(rim.centre.x + dx * rim.r / dd, rim.centre.y + dy * rim.r / dd) : p);
            }
          }
          elements[i] = { ...e, points: walked };
          continue;
        }
        const edges: [Pt, Pt, boolean][] = e.kind === 'segment' && !e.decoration ? [[e.from, e.to, !!e.dashed]]
          : e.kind === 'polygon' ? e.points.map((p, k) => [p, e.points[(k + 1) % e.points.length], !!e.dashed] as [Pt, Pt, boolean])
          : [];
        if (!edges.length) continue;
        // A threshold in proportion to the ball: this figure is drawn in
        // metres, where the dome's fixed 0.5 would drop every edge.
        elements.splice(i, 1, ...edges.flatMap(([a, b, dash]) => outsideConvex(a, b, ball, piece.r * 0.02)
          .map(([p, q]): Element => ({ kind: 'segment', from: p, to: q, dashed: dash }))));
      }
    }
    elements.push(...drawn);
    o = topOf(piece, o);
  }
  const foot = baseCentreOf(spec.stack[0], pt(0, 0));
  // Everything drawn so far is the stack; a `hides` ghost clips only these.
  const stackCount = elements.length;
  for (const g of spec.ghosts ?? []) {
    /**
     * **A seat is a face's centre; a flat-faced piece is drawn from its front
     * edge.** `topOf` and `baseCentreOf` both return the middle of a face -
     * the axis, as `baseCentreOf`'s own comment says - while `drawPiece` lays
     * a box, pyramid or frustum out from `at(-w, 0)` to `at(w, 0)`, which is
     * the *front* edge, and puts the depth behind it. Handed a centre, such a
     * ghost sits half its own depth too far back.
     *
     * Seen on 2023 P2 Q9: the removed tip floated up and to the right of the
     * cut face it is supposed to stand on, which is what the owner kept
     * reading as the height arrow being wrong. It was the solid, not the
     * arrow.
     *
     * A round ghost has no depth offset - `obliqueDepth` is null for a sphere,
     * a cone, a hemisphere - so it is already seated on its axis and is left
     * exactly as it was. Of the five ghosts in the course only the frustum's
     * tip is flat-faced, so only that figure moves.
     */
    const seat = g.on === 'top' ? o : foot;
    const back = obliqueDepth(g.piece);
    const front = back ? pt(seat.x - back.x / 2, seat.y - back.y / 2) : seat;
    const at0 = pt(front.x, front.y + (g.lift ?? 0));
    if (g.seen && g.piece.kind === 'hemisphere' && g.piece.flat !== 'up') {
      // The dome over the near half of its flat face, filled first so the
      // outline is drawn over it.
      const r = g.piece.r, ry = r * TILT, pts: Pt[] = [];
      for (let k = 0; k <= 36; k++) {
        const t = Math.PI * k / 36;
        pts.push(pt(at0.x + r * Math.cos(t), at0.y + r * Math.sin(t)));
      }
      for (let k = 1; k < 36; k++) {
        const t = Math.PI + Math.PI * k / 36;
        pts.push(pt(at0.x + r * Math.cos(t), at0.y + ry * Math.sin(t)));
      }
      elements.push({ kind: 'shadedShape', points: pts, tone: 3 });
      // `hides`: the stack's hidden edges stop behind the dome. Only the
      // stack's own dashed lines, which are everything before the ghosts.
      if (g.hides) {
        for (let i = stackCount - 1; i >= 0; i--) {
          const e = elements[i];
          if (e.kind !== 'segment' || !e.dashed || e.decoration) continue;
          elements.splice(i, 1, ...outsideConvex(e.from, e.to, pts)
            .map(([a, b]): Element => ({ kind: 'segment', from: a, to: b, dashed: true })));
        }
      }
    }
    // A seen hemisphere is opaque, so the far half of its own flat face is
    // behind it, and so is the far half of the base it sits on: the paper
    // draws neither, and both ran through the number written in the dome.
    const farRim = (e: Element) => e.kind === 'ellipse' && e.dashed === true && e.from === 0 && e.to === 180;
    if (g.seen && g.on === 'base') {
      const i = elements.findIndex(e => farRim(e) && e.kind === 'ellipse'
        && Math.abs(e.centre.x - foot.x) < 1e-9 && Math.abs(e.centre.y - foot.y) < 1e-9);
      if (i >= 0) elements.splice(i, 1);
    }
    elements.push(...drawPiece(g.piece, at0, !g.seen).filter(e => !(g.seen && farRim(e))));
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
      /**
       * **A height that ends at an apex ends where the apex is *drawn*.**
       *
       * The owner, on the closure sheet: *"So 48cm arrow to low. Perhaps do
       * what paper does and connect the top and bottom of each arrow
       * horizontally to their place on the shape?"*
       *
       * A front-face point at height h is drawn at y = h, which is why every
       * other height arrow lines up without help. An apex is not on the front
       * face: it stands over the centre of its base, half a depth back, so it
       * is drawn `depthOf(w).y / 2` higher than its own height. Measured on
       * three draws, the top of the upper arrow sat 17.6, 25.3 and 31.3px
       * below the apex - exactly that offset, and exactly what the owner saw.
       *
       * Naming the ghost the height belongs to (`onGhost`, the field a width
       * already uses to sit on a ghost's seat) is what lets this be computed
       * here; the generator has no access to the projection.
       *
       * The arrow is then longer than its value in proportion - as it is in
       * 2023 P2 Q9's own figure, and for the same reason. Every solid carrying
       * an oblique piece already declares `notToScale`, so the drawing claims
       * nothing metric and this costs no truth.
       */
      const gh = d.onGhost !== undefined ? spec.ghosts?.[d.onGhost] : undefined;
      const ghostW = gh && 'w' in gh.piece ? (gh.piece as { w: number }).w : undefined;
      const ghostH = gh && 'h' in gh.piece ? (gh.piece as { h: number }).h : undefined;
      const back = ghostW !== undefined ? depthOf(ghostW) : pt(0, 0);
      /**
       * **Read the apex off the seat, not off the height.** It stands on
       * *two* half-depths, and the first attempt here added only the second:
       * the ghost sits on the stack's top face, which is itself half the
       * *base's* depth back, and its own apex is half of *its* depth back
       * from there. `o` already carries the first, which is the whole reason
       * `topOf` returns a seat rather than a height — so building from the
       * seat gets both and re-deriving gets one. Measured: 22px of the
       * offset still missing until this was taken from `o`.
       */
      const seat = gh ? (gh.on === 'top' ? o : foot) : undefined;
      // The ghost is seated on the cut face's front edge and its apex stands
      // half its own depth back from there, so the apex is the seat plus the
      // height — the two half-depths cancel.
      const apex = seat && ghostH !== undefined
        ? pt(seat.x, seat.y + (gh!.lift ?? 0) + ghostH)
        : undefined;
      const x = d.side === 'left' ? box.x0 - step : box.x1 + step;
      /**
       * A stacked piece is drawn above its own height by half the depth of
       * whatever it stands on, so an arrow meant to reach its top or its seat
       * is told which piece rather than a number. Both default to the plain
       * heights the caller gave, so no existing figure moves.
       */
      const seatOf = (i: number | undefined) =>
        i !== undefined && seats[i] !== undefined ? seats[i].y : undefined;
      const stackTop = d.toStackTop !== undefined && seats[d.toStackTop] !== undefined
        ? seats[d.toStackTop].y + pieceHeight(spec.stack[d.toStackTop])
        : undefined;
      const lo = seatOf(d.fromStackSeat) ?? d.from;
      const hi = stackTop ?? (apex ? apex.y : d.to);
      [a, b] = [pt(x, lo), pt(x, hi)];
      inward = pt(x + (d.side === 'left' ? 1 : -1), (a.y + b.y) / 2);
      /**
       * And the two ends are carried back to the shape, which is what the
       * owner asked for and what the paper draws: a thin rule at each end,
       * from the height it marks across to the arrow. Without them an arrow
       * floating beside the solid names no level in particular.
       */
      const edge = d.side === 'left' ? box.x0 : box.x1;
      if (d.rules) {
        /**
         * **A rule has to land on the shape, and the cut face has two levels.**
         *
         * The owner, on the second pass: *"It might be my eyes but this still
         * looks too low. Perhaps have the dashed horizontal line meet the
         * bottom of the upper frustum so it is clear?"*
         *
         * A height of `h` on a stacked piece is the height of its face's
         * *centre*, and a cut face drawn obliquely has its near corner below
         * that and its far corner above - measured, 116.2 and 94.2 against a
         * centre of 104.7. So the rule sat between the two corners, touching
         * neither, and the arrow that ended on it read low by half a depth.
         *
         * The near corner is the one to meet: it is the edge closest to the
         * reader and the one 2023 P2 Q9 rules from. Both dimensions that share
         * this level snap to it together, so they still meet.
         *
         * Confined to `rules`, which only the frustum asks for. The same edit
         * made unconditionally would move every solid with a height arrow -
         * which is what it did last time, and `frozen` named the four.
         */
        const topPiece = spec.stack[spec.stack.length - 1];
        const faceW = topPiece && 'wTop' in topPiece ? topPiece.wTop
          : topPiece && 'w' in topPiece ? topPiece.w : 0;
        const faceBack = depthOf(faceW);
        /**
         * A dimension speaks in plain heights; `o` is a seat and carries the
         * face's depth as well, so the two are compared in plain heights or
         * the test never fires - which is what the first attempt did.
         *
         * Measured rather than re-derived, after two wrong signs: a plain
         * height renders at the *centre* of the cut face (corners at 94.2 and
         * 116.2 about a level of 104.7), so the near corner is half the face's
         * own depth below it, and the base's depth does not enter.
         */
        const stackH = spec.stack.reduce((t, p) => t + ('h' in p ? p.h : 0), 0);
        const baseBack = depthOf(topPiece && 'w' in topPiece ? topPiece.w : faceW);
        // `drawPiece` puts the cut face's near corners at `at(±t + lift.x,
        // h + lift.y)`, lift being half the difference between the base's
        // depth and the face's own.
        const near = pt(o.x + faceW / 2 - faceBack.x / 2,
                        stackH + (baseBack.y - faceBack.y) / 2);
        const atFace = (p: Pt) => Math.abs(p.y - stackH) < 1e-6;
        // Asked BEFORE the snap: afterwards the endpoint sits at the corner
        // rather than the plain height, so the same test stops matching and
        // the rule starts from the bounding box instead of the face.
        const wasFace: [boolean, boolean] = [atFace(a), atFace(b)];
        if (wasFace[0]) a = pt(a.x, near.y);
        if (wasFace[1]) b = pt(b.x, near.y);
        inward = pt(a.x + (d.side === 'left' ? 1 : -1), (a.y + b.y) / 2);
        const ends: [Pt, boolean][] = [[a, wasFace[0]], [b, wasFace[1]]];
        for (const [end, onFace] of ends) {
          const startX = onFace ? near.x
            : apex && Math.abs(end.y - apex.y) < 1e-6 ? apex.x : edge;
          if (Math.abs(end.x - startX) > 0.01) {
            elements.push({ kind: 'segment', from: pt(startX, end.y), to: end, dashed: true, decoration: true });
          }
        }
      }
    } else {
      // On a ghost, the line sits on that piece's seat; otherwise it stands
      // clear of everything, one rank further out for each dimension already
      // on that side.
      const g = d.onGhost !== undefined ? spec.ghosts?.[d.onGhost] : undefined;
      const seat = g ? (g.on === 'top' ? o : foot) : undefined;
      const y = seat ? seat.y + (g!.lift ?? 0)
        : d.side === 'below' ? box.y0 - step : box.y1 + step;
      const mx = seat ? seat.x : cx;
      [a, b] = [pt(mx - d.halfWidth, y), pt(mx + d.halfWidth, y)];
      inward = pt(mx, y + (d.side === 'below' ? 1 : -1));
    }
    const mid = pt((a.x + b.x) / 2, (a.y + b.y) / 2);
    const arrow = d.arrow === true;   // leaders return earlier
    elements.push({ kind: 'segment', from: a, to: b, dashed: !arrow });
    if (arrow) {
      // Barbs are decoration strokes, so the minimum-length rule does not reach
      // them — an arrowhead grown until it could carry a measurement would only
      // be a wrong arrowhead.
      const span = Math.max(Math.abs(b.x - a.x), Math.abs(b.y - a.y));
      const len = Math.min(span * 0.1, 5);
      const along = d.along === 'width';
      for (const [end, dir] of [[a, 1], [b, -1]] as [Pt, number][]) {
        for (const off of [1, -1]) {
          elements.push({
            kind: 'segment', decoration: true, from: end,
            to: along
              ? pt(end.x + dir * len, end.y + off * len * 0.45)
              : pt(end.x + off * len * 0.45, end.y + dir * len),
          });
        }
      }
    }
    /**
     * **A measurement drawn across a ghost has its own shaft under the label.**
     *
     * Every other dimension here stands clear of the figure, so anchoring the
     * number on the line and letting the renderer push it off is enough. One
     * drawn on a ghost is surrounded by the piece it measures, and the push is
     * a fixed step: "6 cm" came out 1.4px from its own arrow and `verifyFigure`
     * rejected every draw. The same trap `dimensionArrow` in scene.ts records —
     * lift the anchor clear first, then let the push carry it further.
     *
     * Half the radius, towards the side the dimension names, which for the
     * hemisphere is up into the dome where there is nothing else drawn.
     */
    const labelAt = d.along === 'width' && d.onGhost !== undefined
      ? pt(mid.x, mid.y + (d.side === 'above' ? 1 : -1) * d.halfWidth * 0.5)
      : mid;
    // A `seen` hemisphere (2014 P2 Q7) is a filled dome with its back rims
    // just above the line, so its number is centred in the dome's middle
    // rather than lifted and then pushed, which ran it into the top of the
    // dome. Opt-in through the ghost; every other ghost keeps the push.
    const seenGhost = d.along === 'width' && d.onGhost !== undefined
      && spec.ghosts?.[d.onGhost]?.seen === true;
    elements.push(seenGhost
      ? { kind: 'label', text: d.text, anchor: pt(mid.x, mid.y + d.halfWidth * 0.45), away: inward, centred: true }
      : { kind: 'label', text: d.text, anchor: labelAt, away: inward });
    claims.push({ kind: 'length', from: a, to: b, value: d.value,
      shown: d.along === 'height' && d.unknown ? false : undefined });
  }

  // A projected face is not in proportion in any direction, so a figure holding
  // one claims nothing metric about the page and says so. A figure of round
  // pieces alone is a true vertical section, and does.
  const projected = [...spec.stack, ...(spec.ghosts ?? []).map(g => g.piece)].some(isOblique);
  return { scene: { elements, notToScale: projected }, claims };
}

export { pieceWidth };
