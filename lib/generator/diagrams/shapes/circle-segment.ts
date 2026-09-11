import {
  add, type Element, type Figure, type Pt, pt, scale, sideLabel,
} from '../scene';

/**
 * A circle with a chord, and one of the two pieces shaded.
 *
 * 2014 P2 Q13 is a tunnel whose cross-section is the larger piece. The method
 * is the same either way — the sector less the triangle gives the smaller
 * piece, and the whole circle less that gives the larger — so which piece is
 * meant is carried entirely by the shading. Without it the question cannot be
 * asked at all, which is why the renderer had to learn to fill something.
 *
 * The two radii are drawn because the angle between them is what the working
 * starts from; the paper draws them for the same reason.
 */

export interface CircleSegmentSpec {
  radius: number;
  /** The angle at the centre subtended by the chord, under 180. */
  angle: number;
  /** Direction of the first radius, anticlockwise from east. */
  start: number;
  names: { centre: string; a: string; b: string };
  /** Which piece the question is about. */
  shade: 'minor' | 'major';
  /**
   * The chord runs level, with the centre above it.
   *
   * A tunnel entrance whose floor slopes at forty degrees is not a tunnel. The
   * situation fixes the orientation in those cases, and nothing about the
   * geometry would notice if it were drawn any other way round.
   */
  level?: boolean;
  labels: { radius: string; angle: string };
}

const dir = (deg: number): Pt =>
  pt(Math.cos(deg * Math.PI / 180), Math.sin(deg * Math.PI / 180));

export function circleSegment(spec: CircleSegmentSpec): Figure | null {
  const { radius: r, angle, start } = spec;
  if (r <= 0 || angle < 25 || angle > 170) return null;

  const O = pt(0, 0);
  const A = scale(dir(start), r);
  const B = scale(dir(start + angle), r);
  const { centre: nO, a: nA, b: nB } = spec.names;
  const L = spec.labels;
  const inside = scale(dir(start + angle / 2), r * 0.4);

  const elements: Element[] = [
    // the shaded piece goes down first, so every line is drawn over it
    spec.shade === 'minor'
      ? { kind: 'shadedSegment', centre: O, r, from: start, to: start + angle }
      : { kind: 'shadedSegment', centre: O, r, from: start + angle, to: start + 360 },
    { kind: 'circle', centre: O, r },
    { kind: 'segment', from: O, to: A },
    { kind: 'segment', from: O, to: B },
    { kind: 'segment', from: A, to: B },
    { kind: 'label', text: nO, anchor: O, away: inside },
    { kind: 'label', text: nA, anchor: A, away: O },
    { kind: 'label', text: nB, anchor: B, away: O },
  ];
  // Away from the middle of the triangle O-A-B, so the measurement steps
  // outside it. Pushed away from a point opposite the chord instead, it went
  // the other way and landed on the chord itself — which killed every figure
  // whose orientation was fixed, silently, because the retry simply moved on
  // to a context that had no orientation to fix.
  if (L.radius) {
    const tri = pt((A.x + B.x) / 3, (A.y + B.y) / 3);
    elements.push(sideLabel(O, A, L.radius, tri));
  }
  if (L.angle) {
    const mark = r * 0.2;
    elements.push({ kind: 'arc', centre: O, r: mark, from: start, to: start + angle });
    elements.push({
      kind: 'label', text: L.angle, small: true,
      anchor: add(O, scale(dir(start + angle / 2), mark)), away: O,
    });
  }

  return {
    scene: { elements },
    claims: [
      { kind: 'length', from: O, to: A, value: r, shown: /\d/.test(L.radius) },
      { kind: 'length', from: O, to: B, value: r, shown: false },
      // under 180, so a measured angle comes back as itself and can be claimed
      // directly — unlike a sector, where the reflex case makes that useless
      { kind: 'angle', at: O, arms: [A, B], value: angle, shown: /\d/.test(L.angle) },
      // the floor of the tunnel is level, and only the prose knows that
      ...(spec.level ? [{ kind: 'bearing' as const, from: A, to: B, degrees: 0 }] : []),
    ],
  };
}
