import { type Element, type Figure, type Pt, angleAt, angleMark, dist, pt, scale, shadeAngle, sub, unit } from '../scene';
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
  if (spec.angleLabel) {
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
    scene: { elements },
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
