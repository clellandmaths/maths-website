import {
  add, type Element, type Figure, type Pt, pt, scale, sideLabel,
} from '../scene';

/**
 * A sector of a circle: two radii and the arc between them.
 *
 * Nine of the National 5 arc-and-sector questions are this one picture. What
 * changes is which of the three quantities is missing:
 *
 *   radius and angle  ->  the area        2016 P1 Q3, 2025 P2 Q6
 *   radius and angle  ->  the arc length  2018 P2 Q2, 2019 P1 Q4, 2023 P2 Q3
 *   radius and arc    ->  the area        2024 P2 Q15
 *   radius and arc    ->  the angle       2017 P2 Q14, 2022 P2 Q10
 *   angle and arc     ->  the radius      2015 P2 Q10
 *
 * The angle is often reflex — 2018's is 320° and 2022's answer is 265° — and
 * then the arc drawn is the long way round. That is the only thing separating
 * a major sector from a minor one on the page, so it has to be right: a pupil
 * who cannot see which arc is meant cannot start.
 *
 * The two radii are pinned by direction rather than by an angle claim, because
 * a measured angle only ever comes back between 0 and 180 and would call a
 * 320° sector a 40° one. Their two directions fix the sweep exactly.
 */

export interface SectorSpec {
  radius: number;
  /** The angle at the centre, measured anticlockwise from the first radius. */
  angle: number;
  /** Direction of the first radius, anticlockwise from east. */
  start: number;
  names: { centre: string; a: string; b: string };
  /** Empty leaves that measurement off the drawing. */
  labels: { radius: string; angle: string; arc: string };
}

const dir = (deg: number): Pt =>
  pt(Math.cos(deg * Math.PI / 180), Math.sin(deg * Math.PI / 180));

export function sector(spec: SectorSpec): Figure | null {
  const { radius: r, angle, start } = spec;
  // a sector that closes on itself is a circle, and a splinter cannot be read
  if (r <= 0 || angle < 15 || angle > 345) return null;

  const O = pt(0, 0);
  const A = scale(dir(start), r);
  const B = scale(dir(start + angle), r);
  const { centre: nO, a: nA, b: nB } = spec.names;
  const L = spec.labels;

  /** The middle of the wedge. The centre's own label is pushed out of it. */
  const middle = scale(dir(start + angle / 2), r * 0.45);

  /**
   * What the **radius** label is pushed away from, which is not the same point.
   *
   * For a minor sector both labels want the same thing — out of the wedge, into
   * the open. (The radius label used to be pushed away from a point *opposite*
   * the sector, which sent it the other way: into the corner between the two
   * radii, on top of the angle arc and squeezed against both.)
   *
   * **A reflex sector splits them, and that had never been allowed for.** The
   * wedge is now the open side and the gap between the radii is what is
   * narrow — 40° for the 320° sector 2018 P2 Q2 asks about. A label offset ten
   * pixels into a 40° gap is three pixels from each radius, so pushing the
   * radius label "out of the wedge" put it straight onto $OB$ and
   * `verifyFigure` rejected the layout. Measured across every start and every
   * radius, **not one layout above 255° verified** — which is why the major arc
   * was 4·5% of draws against a mix predicting 29%. It was never the mix.
   *
   * The centre's label still wants the gap: it sits at $O$, where the wedge
   * holds the angle arc. So the two are pushed apart deliberately.
   */
  const crowdedForRadius = angle > 180
    ? scale(dir(start + angle / 2 + 180), r * 0.45)
    : middle;

  const elements: Element[] = [
    { kind: 'segment', from: O, to: A },
    { kind: 'segment', from: O, to: B },
    { kind: 'arc', centre: O, r, from: start, to: start + angle },
    { kind: 'label', text: nO, anchor: O, away: middle },
    { kind: 'label', text: nA, anchor: A, away: O },
    { kind: 'label', text: nB, anchor: B, away: O },
  ];

  if (L.radius) elements.push(sideLabel(O, A, L.radius, crowdedForRadius));
  if (L.angle) {
    // The angle mark sweeps the same way as the sector, so a reflex angle is
    // drawn reflex. angleMark cannot be used: it always takes the short way.
    const mark = r * 0.22;
    elements.push({ kind: 'arc', centre: O, r: mark, from: start, to: start + angle });
    elements.push({
      kind: 'label', text: L.angle, small: true,
      anchor: add(O, scale(dir(start + angle / 2), mark)), away: O,
    });
  }
  if (L.arc) {
    elements.push({
      kind: 'label', text: L.arc,
      anchor: add(O, scale(dir(start + angle / 2), r)), away: O,
    });
  }

  return {
    scene: { elements },
    claims: [
      { kind: 'length', from: O, to: A, value: r, shown: /\d/.test(L.radius) },
      { kind: 'length', from: O, to: B, value: r, shown: false },
      // Directions, not an angle: measured angles come back between 0 and 180,
      // so a 320 degree sector would be reported as a 40 degree one and the
      // check would reject a perfectly correct drawing.
      { kind: 'bearing', from: O, to: A, degrees: ((start % 360) + 360) % 360 },
      { kind: 'bearing', from: O, to: B, degrees: (((start + angle) % 360) + 360) % 360 },
    ],
  };
}
