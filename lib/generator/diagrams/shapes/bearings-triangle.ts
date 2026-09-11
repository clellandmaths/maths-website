import {
  add, bearing, centroid, dist, type Element, type Figure, type Pt, pt, scale,
  sideLabel, sub, unit,
} from '../scene';

/**
 * A triangle with north lines and compass arcs — the navigation questions.
 *
 * These are triangle trigonometry with one extra step at each end: the given
 * angle has to be read off a bearing before the sine or cosine rule can start,
 * and the answer usually has to be turned back into a bearing afterwards. The
 * diagram is where both of those steps happen, so it has to be right about
 * direction and not merely about shape.
 *
 *   2014 P2 Q10  three buoys, three sides, angle then the bearing back
 *   2015 P2 Q13  two towns due north-south, a bearing from each
 *   2017 P2 Q10  two towns due east-west, a bearing from each, one reflex
 *   2018 P2 Q13  ferry, trawler and yacht — three sides and a reflex bearing
 *   2025 P2 Q12  orienteering checkpoints, two sides and one bearing
 *
 * The caller supplies the points, because the caller is the one that knows the
 * bearings — placing them here would mean stating the question twice. What this
 * routine owns is the drawing: the arrows, the arcs sweeping the right way, and
 * a bearing claim per arc so a leg drawn in the wrong direction is caught.
 *
 * Compass bearings run clockwise from north; the scene runs anticlockwise from
 * east. Every conversion between the two happens in `mathsAngle` below and
 * nowhere else.
 */

/** A compass bearing as the scene measures angles: anticlockwise from east. */
export const mathsAngle = (compass: number): number => ((90 - compass) % 360 + 360) % 360;

export interface BearingArc {
  /** The vertex the arc is drawn at, and the vertex its far arm runs to. */
  at: number;
  to: number;
  /** The bearing itself, clockwise from north. Over 180 gives a reflex arc. */
  compass: number;
  /** What to print inside the arc; empty for the angle being asked for. */
  label: string;
  /**
   * Fill the wedge as well as outlining it.
   *
   * 2014 P2 Q10 ends "hence find the size of the shaded angle" and shades a
   * grey wedge at the pivot. Ours printed the words and shaded nothing, so a
   * pupil was told to find a region the picture never identified - and at
   * that vertex there are several angles it could have meant.
   */
  shade?: boolean;
}

export interface BearingsTriangleSpec {
  names: [string, string, string];
  /** Positions in map coordinates: x east, y north. */
  points: [Pt, Pt, Pt];
  /** Which vertices carry a north arrow. */
  north: number[];
  arcs: BearingArc[];
  /** Side labels, for 0–1, 1–2 and 2–0. Empty leaves a side unlabelled. */
  sides: [string, string, string];
  /** "N" as most papers draw it, or "North" as 2014 does. */
  northLabel?: string;
}

/** An upward arrow with a barbed head, built from plain segments. */
function northArrow(at: Pt, len: number, text: string): Element[] {
  const tip = add(at, pt(0, len));
  const head = len * 0.2;
  const barb = (deg: number): Element => ({
    kind: 'segment',
    from: tip,
    to: add(tip, scale(pt(Math.cos(deg * Math.PI / 180), Math.sin(deg * Math.PI / 180)), head)),
    decoration: true,
  });
  return [
    { kind: 'segment', from: at, to: tip },
    barb(240), barb(300),
    { kind: 'label', text, anchor: tip, away: at },
  ];
}

export function bearingsTriangle(spec: BearingsTriangleSpec): Figure | null {
  const [P, Q, R] = spec.points;
  const [nP, nQ, nR] = spec.names;
  const legs: [Pt, Pt][] = [[P, Q], [Q, R], [R, P]];
  const inside = centroid([P, Q, R]);

  // a triangle so thin the arcs cannot be told apart is not worth drawing
  const lens = legs.map(([a, b]) => dist(a, b));
  if (Math.min(...lens) < 1e-6) return null;
  const ref = (lens[0] + lens[1] + lens[2]) / 3;

  const elements: Element[] = [
    { kind: 'polygon', points: [P, Q, R] },
    { kind: 'label', text: nP, anchor: P, away: inside },
    { kind: 'label', text: nQ, anchor: Q, away: inside },
    { kind: 'label', text: nR, anchor: R, away: inside },
  ];
  spec.sides.forEach((text, i) => {
    if (text) elements.push(sideLabel(legs[i][0], legs[i][1], text, inside));
  });

  // The arrow has to outrun the arcs or the arc crosses the arrowhead, and the
  // reflex ones are the widest, so the radius is set once for the whole figure.
  const arrow = ref * 0.45;
  const radius = ref * 0.17;
  for (const i of spec.north) {
    elements.push(...northArrow(spec.points[i], arrow, spec.northLabel ?? 'N'));
  }

  for (const a of spec.arcs) {
    // A bearing arc is an annotation, not part of the shape, and it has to
    // read as an angle. Past about 300 degrees it closes into a circle with the
    // north arrow trapped inside it; under about 30 the wedge is too narrow to
    // hold its own number, which then lands on the north line. The papers stay
    // well inside both ends — 2017's 230 and 2018's 240 are the widest drawn.
    const sweep = ((a.compass % 360) + 360) % 360;
    if (sweep < 30 || sweep > 300) return null;

    const at = spec.points[a.at];
    const to = spec.points[a.to];
    // The compass sweep runs clockwise from north down to the leg. Scene arcs
    // sweep anticlockwise, so the same arc is drawn from the leg back up to
    // north — which is why `from` is the leg and `to` is due north.
    const from = mathsAngle(a.compass);
    const drawn = dist(at, to) < radius * 1.6 ? radius * 0.6 : radius;
    elements.push({ kind: 'arc', centre: at, r: drawn, from, to: 90 });
    if (a.shade) {
      /**
       * **Sampled along the arc's own sweep, not built from two arms.**
       *
       * `shadedAngle` fills the short way round between its arms, which is
       * right for a corner of a shape and wrong for a bearing: at 257 degrees
       * it filled the 103 on the other side. Reaching for SVG's large-arc flag
       * to flip it filled the complement instead - the wrong region, and no
       * check can tell one filled wedge from another, so it would have stood.
       *
       * Sampling the same `from`-to-north sweep the arc above draws means the
       * fill and the outline come from the same two numbers and cannot
       * disagree, whatever the bearing.
       */
      const span = ((90 - from) % 360 + 360) % 360;
      const steps = Math.max(8, Math.round(span / 5));
      const wedge: Pt[] = [at];
      for (let k = 0; k <= steps; k++) {
        const d = (from + span * k / steps) * Math.PI / 180;
        wedge.push(add(at, pt(Math.cos(d) * drawn, Math.sin(d) * drawn)));
      }
      elements.push({ kind: 'shadedShape', points: wedge });
    }
    if (a.label) {
      const midDeg = from + (((90 - from) % 360 + 360) % 360) / 2;
      const rad = midDeg * Math.PI / 180;
      elements.push({
        kind: 'label',
        text: a.label,
        // on the arc, as angleMark does — the renderer adds the clearance
        anchor: add(at, scale(pt(Math.cos(rad), Math.sin(rad)), drawn)),
        away: at,
        small: true,
      });
    }
  }

  return {
    scene: { elements },
    claims: [
      ...legs.flatMap(([a, b], i) => spec.sides[i]
        ? [{ kind: 'length' as const, from: a, to: b, value: lens[i], shown: /\d/.test(spec.sides[i]) }]
        : []),
      // The claim that matters. A bearing is a direction, and no measurement of
      // the shape notices when a leg is drawn the wrong way round — that is
      // exactly how a diagram once showed a wall lying flat.
      ...spec.arcs.map(a => ({
        kind: 'bearing' as const,
        from: spec.points[a.at],
        to: spec.points[a.to],
        degrees: mathsAngle(a.compass),
      })),
    ],
  };
}

/** The point reached by travelling `d` from `at` on a compass bearing. */
export function travel(at: Pt, compass: number, d: number): Pt {
  const rad = mathsAngle(compass) * Math.PI / 180;
  return add(at, scale(pt(Math.cos(rad), Math.sin(rad)), d));
}

/** The bearing of `to` from `at`, clockwise from north. */
export function compassOf(at: Pt, to: Pt): number {
  return ((90 - bearing(at, to)) % 360 + 360) % 360;
}

export { dist, sub, unit };
