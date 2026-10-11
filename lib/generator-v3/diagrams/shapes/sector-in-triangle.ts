import {
  type Claim, type Element, type Figure, type Pt,
  add, pt, scale,
} from '../scene';

/**
 * A sector cut out of a triangle, with the region between them shaded.
 *
 * 2018 P2 Q17, and it is one picture doing something no other figure here does:
 * the two shapes **share their apex and their angle**. O is both the centre of
 * the sector and a vertex of the triangle, A lies on OB and D on OC, so the
 * 75° marked at O is the sector's angle and the triangle's angle at once. That
 * is the whole question — the shaded area is the triangle minus the sector, and
 * a pupil who cannot see that the angle is shared has nothing to subtract.
 *
 * So the sector's radius must be visibly shorter than both triangle sides, and
 * the arc must fall clear of BC. If the arc touched or crossed BC the shaded
 * region would not be the crescent the paper draws.
 *
 * **Only the angle is drawn as a measurement.** The three lengths are in the
 * prose — radius 30, OB 38, OC 55 — and the paper prints none of them on the
 * figure, so neither does this. They are still claimed, because the drawing has
 * to be to scale for the picture to mean what it says.
 */

export interface SectorInTriangleSpec {
  /** Sector radius, and the two triangle sides from the same vertex. */
  radius: number;
  ob: number;
  oc: number;
  /** The angle at O, shared by the sector and the triangle, in degrees. */
  angle: number;
  /** Apex, then along OB, then along OC: O, A, B, D, C. */
  names: { o: string; a: string; b: string; d: string; c: string };
  /** What to write in the angle, e.g. "75°". Empty leaves it off. */
  angleLabel: string;
}

const dir = (deg: number): Pt =>
  pt(Math.cos(deg * Math.PI / 180), Math.sin(deg * Math.PI / 180));

export function sectorInTriangle(spec: SectorInTriangleSpec): Figure | null {
  const { radius: r, ob, oc, angle } = spec;
  if (r <= 0 || angle < 20 || angle > 150) return null;
  // The sector has to sit inside the triangle with room to spare, or there is
  // no crescent to shade.
  if (r >= ob * 0.92 || r >= oc * 0.92) return null;

  // O at the top with the wedge hanging below it, as the paper draws it: the
  // triangle's long side BC is then the bottom edge and the arc bows up into
  // the figure, which is what makes the shaded region read as a crescent.
  const start = -90 - angle / 2;
  const uB = dir(start + angle);                 // towards B
  const uC = dir(start);                         // towards C
  const O = pt(0, 0);
  const B = scale(uB, ob);
  const C = scale(uC, oc);
  const A = scale(uB, r);
  const D = scale(uC, r);

  // The arc must clear BC, or the "shaded region" is not one region. Distance
  // from O to the line BC, against the radius.
  const n = pt(C.y - B.y, B.x - C.x);
  const len = Math.hypot(n.x, n.y);
  if (len < 1e-9) return null;
  const toLine = Math.abs((n.x * (O.x - B.x) + n.y * (O.y - B.y)) / len);
  if (r >= toLine * 0.95) return null;

  // The shaded region: out along OB to A... no — round the outside. A to B,
  // B to C, C back to D, then the arc from D back to A. `shadedShape` takes a
  // polygon, so the arc is approximated by points along it, which is the only
  // way to fill a region bounded partly by a curve.
  const STEPS = 48;
  const arcBack: Pt[] = [];
  for (let i = 0; i <= STEPS; i++) {
    // from D (at `start`) round to A (at `start + angle`)
    const t = start + angle * (i / STEPS);
    arcBack.push(scale(dir(t), r));
  }
  const region = [A, B, C, ...arcBack];

  const inside = scale(dir(start + angle / 2), Math.min(ob, oc) * 0.45);

  const elements: Element[] = [
    { kind: 'shadedShape', points: region },
    { kind: 'segment', from: O, to: B },
    { kind: 'segment', from: O, to: C },
    { kind: 'segment', from: B, to: C },
    { kind: 'arc', centre: O, r, from: start, to: start + angle },
    { kind: 'label', text: spec.names.o, anchor: O, away: inside },
    { kind: 'label', text: spec.names.a, anchor: A, away: inside },
    { kind: 'label', text: spec.names.b, anchor: B, away: inside },
    { kind: 'label', text: spec.names.d, anchor: D, away: inside },
    { kind: 'label', text: spec.names.c, anchor: C, away: inside },
  ];

  if (spec.angleLabel) {
    const mark = Math.min(ob, oc) * 0.17;
    elements.push({ kind: 'arc', centre: O, r: mark, from: start, to: start + angle });
    elements.push({
      kind: 'label', text: spec.angleLabel, small: true,
      anchor: add(O, scale(dir(start + angle / 2), mark)), away: O,
    });
  }

  const claims: Claim[] = [
    { kind: 'length', from: O, to: B, value: ob, shown: false },
    { kind: 'length', from: O, to: C, value: oc, shown: false },
    { kind: 'length', from: O, to: A, value: r, shown: false },
    { kind: 'length', from: O, to: D, value: r, shown: false },
    // The shared angle, which is the point of the picture.
    { kind: 'angle', at: O, arms: [B, C], value: angle, shown: /\d/.test(spec.angleLabel) },
  ];

  return { scene: { elements }, claims };
}
