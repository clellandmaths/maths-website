import { type Element, type Figure, type Pt, LABEL_CLEARANCE, add, angleAt, angleMark, bearing, dist, pt, scale, shadeAngle, sub, unit } from '../scene';
import { textWidth } from '../render';

/**
 * A regular polygon with one side extended to a point outside it.
 *
 * 2018 P1 Q9 and 2025 P2 Q7 are the same picture with a different number of
 * sides: a side is produced past a vertex to a point, that point is joined back
 * to the vertex on the other side, and one angle of the triangle so formed is
 * given.
 *
 *   2018 P1 Q9  regular decagon, AKL a straight line, angle KLJ 17° -> 127°
 *   2025 P2 Q7  regular pentagon, FAB a straight line, angle EFA 65° -> 43°
 *
 * The whole question is that the extended side is *straight*: the angle inside
 * the triangle at that vertex is the polygon's exterior angle, not its interior
 * one. Nothing in the lengths says so, so the figure has to, and a bearing
 * claim asserts it.
 */

export interface PolygonPointSpec {
  /** Number of sides, 5 to 10. */
  sides: number;
  radius: number;
  /** Where the first vertex sits, anticlockwise from east. */
  start: number;
  /** One letter per vertex, in order round the shape. */
  names: string[];
  /** The point outside, on the produced side. */
  point: string;
  /** How far the point sits beyond the vertex. */
  reach: number;
  /** What to write in the angle at that point; empty leaves it unmarked. */
  angleLabel: string;
  /**
   * Shade the angle the question asks for — at the far vertex, between the
   * outside point and the first vertex.
   *
   * **2018 P1 Q9 shades it and says so in its own wording**: *"Calculate the
   * size of shaded angle KJL"*, with the wedge at J filled grey. 2025 P2 Q7,
   * the other paper on this routine, shades nothing and asks for *"the size
   * of angle FEA"*. Two papers, two conventions — so this is opt-in and the
   * generator turns it on for 2018's id alone. 2025 P2 Q7 is signed off and
   * its figure must not move.
   *
   * Added on the owner's word reviewing 2018 P1: *"Raise the decagon share on
   * 2018 id only and shade the angle needed if possible?"*
   */
  shadeAsked?: boolean;
  /**
   * Write the given angle's number **inside its arc, up against the outside
   * point**, and scale the drawing up until it fits there.
   *
   * The owner, on 2018 P1 Q9: *"I'm wondering with where shading and number
   * of other angle sits if this is ambiguous."* It was: the default path puts
   * the arc well back and the number just beyond it, which measured closer to
   * the SHADED corner than to its own in 400 of 400 draws — so it read as the
   * size of the angle the pupil is asked to find. 2025 P2 Q7's paper writes
   * its 65 inside the arc against F; this does the same.
   *
   * Opt-in, because 2025 P2 Q7 is signed off and its figure must not move.
   */
  markAtPoint?: boolean;
}

/**
 * The drawing's own pixels-per-unit, as the renderer will compute it: the
 * target width over the larger span of the geometry. Every point this figure
 * draws is a vertex or the outside point, so those are the whole extent.
 */
function pixelsPerUnit(points: Pt[], target: number): number {
  const xs = points.map(p => p.x), ys = points.map(p => p.y);
  const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), 1e-9);
  return target / span;
}

/**
 * How far along the bisector a label's centre must sit so its box clears
 * both arms of the angle by `clearPx`, at `k` pixels per unit.
 *
 * Solved rather than searched: a corner's signed distance from an arm grows
 * linearly with the distance along the bisector, so each corner and arm give
 * one lower bound and the answer is the largest of them.
 */
function centreDistance(u: [Pt, Pt], bis: Pt, w: number, h: number, k: number, clearPx: number): number {
  const cross = (a: Pt, b: Pt) => a.x * b.y - a.y * b.x;
  const [hw, hh] = [w / 2 / k, h / 2 / k];
  let d = 0;
  for (const arm of u) {
    const lean = cross(arm, bis);                 // sin of the half-angle, signed
    const s = Math.sign(lean) || 1;
    for (const off of [pt(hw, hh), pt(-hw, hh), pt(hw, -hh), pt(-hw, -hh)]) {
      d = Math.max(d, (clearPx / k - s * cross(arm, off)) / (s * lean));
    }
  }
  return d;
}

export function polygonPoint(spec: PolygonPointSpec): Figure | null {
  const { sides: n, radius: r, start, reach } = spec;
  if (n < 5 || n > 10 || r <= 0 || reach <= 0 || spec.names.length !== n) return null;

  const step = 360 / n;
  const V = Array.from({ length: n }, (_, i) => {
    const a = (start + i * step) * Math.PI / 180;
    return pt(r * Math.cos(a), r * Math.sin(a));
  });
  // produced past V[0], away from V[1] — so V[1], V[0] and P are one line
  const away = unit(sub(V[0], V[1]));
  const P = pt(V[0].x + away.x * reach, V[0].y + away.y * reach);
  const last = V[n - 1];
  const side = 2 * r * Math.sin(Math.PI / n);

  const O = pt(0, 0);
  const elements: Element[] = [
    // The shading goes down first so every line is drawn over it, as it is on
    // the paper — see `shadeAsked`. The angle is at the far vertex, between
    // the outside point and the vertex the side was produced past.
    ...(spec.shadeAsked ? [shadeAngle(last, [P, V[0]])] : []),
    { kind: 'polygon', points: V },
    // **The centre, and a dashed spoke to every vertex** — 2025 P2 Q7 rules
    // them and marks the centre with a filled dot. They are what show the
    // polygon to be regular, and the interior angle the working needs comes
    // out of the equal angles they make at the centre: 360 over the number of
    // sides. Drawn without them the figure asserts "regular" in the prose and
    // shows nothing of it.
    { kind: 'dot', at: O },
    ...V.map((v): Element => ({ kind: 'segment', from: O, to: v, dashed: true })),
    { kind: 'segment', from: V[0], to: P },
    { kind: 'segment', from: P, to: last },
    /**
     * Every vertex pushes its letter straight out from the centre — **except
     * the one the triangle reaches back to.**
     *
     * The owner, on the 2026-2023 sign-off sheet: *"H vertex should be
     * readable"*. Measured off the clone's own SVG, H sat at (95.97, 160.08)
     * and the segment from the outside point J passed through (95.8, 160.0):
     * the letter was sitting on that line. It happens because the line P-last
     * and the radius O-last run in nearly the same direction — the outside
     * point is produced from the far side of the polygon — so pushing the
     * letter outward pushes it along the line rather than off it.
     *
     * `verifyFigure` allows it, and is right to: the segment ends at that
     * vertex, so it is ink the label belongs to. Allowed is not readable.
     *
     * Pushed square off that line instead, on the side away from the centre,
     * which is where 2018 P1 Q9 prints the same letter.
     */
    ...V.map((p, i): Element => {
      if (i !== n - 1) return { kind: 'label', text: spec.names[i], anchor: p, away: O };
      const alongLine = unit(sub(p, P));
      const outward = sub(p, O);
      const dot = outward.x * alongLine.x + outward.y * alongLine.y;
      const square = sub(outward, scale(alongLine, dot));
      /**
       * Dead collinear - the outside point produced straight back through the
       * centre - leaves no square component to push along, and falling back to
       * the radius puts the letter on the line again, which is the fault. A
       * true perpendicular to the line, turned to the side the centre is not
       * on, is off it either way round.
       */
      const perp = pt(-alongLine.y, alongLine.x);
      /**
       * **Where the angle here is shaded, the letter goes on the other side.**
       *
       * "Away from the centre" lands it inside the shaded wedge whenever the
       * first vertex is on that side too - the grey sat on the K in half the
       * decagons looked at on 2018 P1 Q9. The wedge runs from this line
       * towards the first vertex, so the side the first vertex is NOT on is
       * clear of it by construction, and it is where the paper prints its J.
       * On `markAtPoint` with shading, which is 2018 alone - keyed to the new
       * flag rather than to `shadeAsked`, so the figure 2018 was locked with
       * can still be built exactly, for the generator to hold its draws to.
       */
      if (spec.shadeAsked && spec.markAtPoint) {
        const toFirst = sub(V[0], p);
        const clear = perp.x * toFirst.x + perp.y * toFirst.y >= 0 ? -1 : 1;
        return { kind: 'label', text: spec.names[i], anchor: p, away: sub(p, scale(perp, clear)) };
      }
      const side = perp.x * outward.x + perp.y * outward.y >= 0 ? 1 : -1;
      const offLine = Math.hypot(square.x, square.y) < 0.05
        ? scale(perp, side) : square;
      return { kind: 'label', text: spec.names[i], anchor: p, away: sub(p, unit(offLine)) };
    }),
    { kind: 'label', text: spec.point, anchor: P, away: pt(0, 0) },
  ];
  /**
   * **A narrow wedge is marked further back, where it can hold its number.**
   *
   * The owner, on the 2026-2023 sign-off sheet against a 22-degree apex: *"22
   * coming out of triangle"*. The arc was inside the triangle and so was the
   * label's anchor; what stuck out was the text box. At 22 degrees the wedge is
   * `2 r sin 11` across - nine pixels at the default radius - and "22°" renders
   * about twenty-one, so it overhung both edges however well it was centred.
   *
   * 2018 P1 Q9 has the same problem, 17 degrees at L, and answers it by drawing
   * the mark and writing the number **well back from the vertex**, where the
   * opening has grown wide enough to take them. The radius is computed the same
   * way here: far enough out that the wedge is wider than the text, never
   * closer than the default, and capped at seven tenths of the shorter arm so
   * the mark stays inside the triangle.
   *
   * Passed in rather than built into `angleMark`, which every figure in the
   * course shares. Widening it there broke `tangent semicircle` outright - its
   * label landed on other ink, `verifyFigure` threw every attempt away and the
   * generator ran out of tries. A narrow apex is this figure's problem, so the
   * fix lives with this figure.
   */
  /**
   * **The `markAtPoint` path: the number up against its own vertex.**
   *
   * The default path below sizes its arc from `need / (2 half)`, which is the
   * text width in PIXELS against arms in figure UNITS - one to three of them
   * against twenty-odd pixels - so it always landed on its cap of seven tenths
   * of the shorter arm, and `angleMark` then wrote the number beyond that. It
   * is left exactly as it is: 2025 P2 Q7 is drawn by it and signed off.
   *
   * Here the number is placed centred on the bisector, at the least distance
   * where its box clears both arms, with the arc drawn round it. At the shared
   * width a 17-degree wedge cannot hold its number that close, because the
   * text is a fixed size however the geometry is scaled - so the drawing is
   * scaled up, a tenth at a time, until the number sits within `NEAR` of the
   * way to the shaded corner. `tangent-meets-diameter` sizes its frame for its
   * number the same way. Capped, and a draw that cannot fit is refused, so the
   * generator takes another rather than printing an ambiguous one.
   */
  let target: number | undefined;
  if (spec.angleLabel && spec.markAtPoint) {
    const NEAR = 0.45;          // of the way from the point to the shaded corner
    const FRAME_CAP = 2;        // still larger lettering, for its size, than the paper prints
    const SMALL_PX = 11;
    // Near its own arms, not on them: `verify` exempts the two arms of the
    // angle a number measures, as the papers print a narrow wedge touching one,
    // so this gap is the only thing keeping it off them. Two pixels is clear
    // of the stroke; the six the rest of the figure keeps lost 44 of the 52
    // decagon layouts the paper's own shape has.
    const ARM_GAP = 2;
    const u: [Pt, Pt] = [unit(sub(V[0], P)), unit(sub(last, P))];
    const bis = unit(add(u[0], u[1]));
    const w = textWidth(spec.angleLabel, SMALL_PX);
    const toCorner = dist(P, last);
    const shortArm = Math.min(dist(P, V[0]), toCorner);
    let placed: { d: number; arc: number } | null = null;
    for (let frame = 1; frame <= FRAME_CAP + 1e-9; frame += 0.1) {
      const k = pixelsPerUnit([...V, P], 250 * frame);
      const d = centreDistance(u, bis, w, SMALL_PX, k, ARM_GAP);
      // the arc clears the box's farthest corner by the same margin
      const arc = d + Math.hypot(w / 2, SMALL_PX / 2) / k + (LABEL_CLEARANCE + 2) / k;
      if (d <= NEAR * toCorner && arc <= 0.85 * shortArm) {
        placed = { d, arc };
        target = Math.round(250 * frame);
        break;
      }
    }
    if (!placed) return null;
    const a = bearing(P, V[0]), b = bearing(P, last);
    let [from, to] = [a, b];
    if (((to - from) % 360 + 360) % 360 > 180) [from, to] = [b, a];
    elements.push(
      { kind: 'arc', centre: P, r: placed.arc, from, to },
      { kind: 'label', text: spec.angleLabel, anchor: add(P, scale(bis, placed.d)), away: P,
        small: true, centred: true },
    );
  } else if (spec.angleLabel) {
    const span = Math.abs(angleAt(P, V[0], last));
    const arm = Math.min(dist(P, V[0]), dist(P, last));
    const half = Math.sin(span / 2 * Math.PI / 180);
    // the renderer's own per-character estimate, at the small label size
    const need = textWidth(spec.angleLabel, 11);
    const fits = half > 0.01 ? need / (2 * half) : arm * 0.22;
    const radius = Math.max(arm * 0.22, Math.min(fits, arm * 0.7));
    elements.push(...angleMark(P, [V[0], last], spec.angleLabel, radius));
  }

  return {
    // `target` is set only on the `markAtPoint` path; everything else keeps
    // the renderer's default, so 2025 P2 Q7's scene is byte-for-byte as it was
    scene: target === undefined ? { elements } : { elements, target },
    claims: [
      // every side equal is what "regular" means, and the interior angle the
      // working uses follows from it
      ...V.map((p, i) => ({
        kind: 'length' as const, from: p, to: V[(i + 1) % n], value: side, shown: false,
      })),
      // and every spoke is the same radius, now that each one is drawn
      ...V.map(v => ({ kind: 'length' as const, from: O, to: v, value: r, shown: false })),
      // The produced side really is straight. That is the whole question — the
      // angle inside the triangle at V[0] is the exterior angle, not the
      // interior one — and no length or angle above would notice if the point
      // were drawn a few degrees off the line.
      // Stated as a straight angle rather than as two measured directions.
      // Deriving the directions from the points just plotted would compare the
      // drawing with itself and agree whatever happened; 180 is an intent the
      // construction has to live up to.
      { kind: 'angle' as const, at: V[0], arms: [P, V[1]] as [Pt, Pt], value: 180, shown: false },
    ],
  };
}
