import { type Element, type Figure, type Pt, add, pt, scale } from '../scene';

/**
 * A cuboid or a rectangular-based pyramid sitting on coordinate axes.
 *
 * For 2016 P1 Q7 and 2025 P2 Q8, which are the same question twice: write down
 * the coordinates of one vertex, then use Pythagoras in three dimensions to find
 * a length. The coordinate part is why the axes have to be drawn and why the
 * vertex naming has to match the paper's — part (a) is unanswerable otherwise.
 *
 * Oblique projection, in the orientation both papers use: x to the right, y
 * going back up-and-right, z straight up. The solid is drawn from real
 * three-dimensional coordinates and projected once, so the vertices cannot
 * drift out of agreement with the numbers the question states.
 *
 * ⚠️ **A projected figure carries no metric claims.** Three dimensions squashed
 * onto two are not in proportion in any of them, and asserting a length or an
 * angle off the page would be asserting something false — the check would then
 * either pass wrongly or fail correct work. What verify.ts still enforces is
 * everything about the drawing that stays true: labels that do not collide or
 * sit on lines, nothing outside the view, no hardcoded colour.
 */

export interface P3 { x: number; y: number; z: number }

/**
 * How far back the y-axis is thrown.
 *
 * This was 0.52, a conventional cabinet projection, and it crowded the eight
 * corners of a cuboid so badly that a layout succeeded about one attempt in
 * forty — which made the questions that did come out the lucky proportions
 * rather than a fair sample. Opening it up separates the front and back faces:
 * the same run now takes about one attempt in four, and a cuboid still reads
 * as a cuboid.
 */
const DEPTH = 0.82;
const COS30 = Math.cos(Math.PI / 6);
const SIN30 = Math.sin(Math.PI / 6);

/** Three dimensions to two, in the papers' orientation. */
export const project = (p: P3): Pt =>
  pt(p.x + p.y * COS30 * DEPTH, p.z + p.y * SIN30 * DEPTH);

/**
 * One solid in the scene, positioned by the corner nearest the origin.
 *
 * A list rather than a single `kind`, because two of the four paper questions
 * stand one solid on another — a cube on a cuboid, a pyramid on a cube — and
 * the coordinate a pupil has to write down is on the upper one. Drawing them
 * separately and letting the caller place them keeps the arithmetic where the
 * question is, which is the same reason every point in a vector pathway is a
 * combination rather than a coordinate.
 */
export type AxesPart =
  | { kind: 'cuboid'; at: P3; size: P3 }
  /**
   * Rectangular base, apex over its centre.
   *
   * `construction` draws the base diagonals, the vertical from the centre to
   * the apex and the right angle between them. The Pythagoras questions need
   * them — the pupil's whole method is that vertical — and the coordinate ones
   * do not, and are much better without: with them, three of sixty-three
   * cube-and-pyramid layouts could place their labels at all, because the
   * diagonals leave a base corner with four lines meeting at it and no room
   * for its letter.
   */
  | { kind: 'pyramid'; at: P3; size: P3; construction?: boolean }
  /**
   * A triangular prism lying along the y-axis: an isosceles cross-section in
   * the xz-plane, extruded back. `size.z` is the height of the apex above the
   * base edge, which is what 2018 P1 Q13 measures.
   */
  | { kind: 'prism'; at: P3; size: P3 }
  /** A cone standing on the z = 0 plane, its base circle centred over `at`. */
  | { kind: 'cone'; at: P3; r: number; h: number };

export interface SolidOnAxesSpec {
  parts: AxesPart[];
  /** Vertex names, in the order the paper uses. */
  names: Record<string, P3>;
  /** Which vertices show their coordinates rather than just their letter. */
  showCoords: string[];
  /**
   * Named points to mark with a filled dot as well as a letter.
   *
   * A corner of the solid needs no dot — the lines meeting there say where it
   * is. A point part-way along an edge does: 2026 P1 Q11 prints one at the
   * midpoint of CD, and without it M reads as a ninth vertex rather than as a
   * point on that edge.
   */
  dots?: string[];
}

/**
 * A circle lying flat in the z = 0 plane, as the projection leaves it.
 *
 * The projection shears — a unit step in y goes back *and* up — so a circle
 * comes out as an ellipse whose axes are not the page's. Semi-axes and turn
 * are the singular values and rotation of the 2x2 matrix the map amounts to,
 * which for this projection is [[1, cos30 x depth], [0, sin30 x depth]].
 * Drawing it upright instead leans the rim the wrong way, and that is the one
 * thing about a cone on axes a reader notices at a glance.
 */
function flatCircle(centre: P3, r: number): { rx: number; ry: number; tilt: number; at: Pt } {
  const [b, d] = [COS30 * DEPTH, SIN30 * DEPTH];
  const [E, F, G, H] = [(1 + d) / 2, (1 - d) / 2, b / 2, -b / 2];
  const [Q, R] = [Math.hypot(E, H), Math.hypot(F, G)];
  const phi = (Math.atan2(H, E) + Math.atan2(G, F)) / 2;
  return {
    rx: r * (Q + R), ry: r * Math.abs(Q - R),
    tilt: phi * 180 / Math.PI, at: project(centre),
  };
}

export function solidOnAxes(spec: SolidOnAxesSpec): Figure {
  const P = (x: number, y: number, z: number) => project({ x, y, z });
  const elements: Element[] = [];

  // ── the axes, long enough to clear everything ─────────────────────────
  const reach = Math.max(...spec.parts.map(p => {
    const s = p.kind === 'cone' ? { x: 2 * p.r, y: 2 * p.r, z: p.h } : p.size;
    return Math.max(p.at.x + s.x, p.at.y + s.y, p.at.z + s.z);
  }));
  const O = P(0, 0, 0);

  /**
   * Each axis is grown until it is **clear of the solid on the page**.
   *
   * `reach * 1.25` is one number for all three, taken from the largest extent
   * in any direction, and that is not the same as clearing the drawing. On a
   * cuboid 13 wide and 5 deep the y axis ran to y = 16 and still stopped inside
   * the projected box, so its label landed on the shape beside a vertex letter.
   * 2014 P2 Q2 and 2017 P1 Q5 both run the y axis well past the solid and
   * label it in open space.
   *
   * The projected outline is what matters, not the modelled extent, because
   * depth foreshortens: the same y in units travels a shorter way across the
   * page than the same x does.
   */
  const hull = spec.parts.flatMap(p => {
    const s = p.kind === 'cone' ? { x: 2 * p.r, y: 2 * p.r, z: p.h } : p.size;
    const out: Pt[] = [];
    for (const dx of [0, s.x]) for (const dy of [0, s.y]) for (const dz of [0, s.z]) {
      out.push(P(p.at.x + dx, p.at.y + dy, p.at.z + dz));
    }
    return out;
  });
  /**
   * A margin past the solid, **in pixels on the page**.
   *
   * It now gets converted into scene units, and that conversion was missing.
   * `perT` is scene units per unit t, not pixels per unit t, and the whole
   * scene is scaled by `target / span` afterwards - so `AXIS_CLEAR / perT`
   * asked for sixteen *scene* units. At a target of 320px across a solid
   * spanning about twelve, one scene unit is some twenty-five pixels, and a
   * margin meant to be 16px was running at 146 to 236 on solids only 74 to
   * 150px across. Every figure on axes had axes longer than the shape.
   *
   * Measured along each axis's own direction, the papers barely overrun at
   * all: 2018 P1 Q13 gives x -33, z -12, y +98 on a solid 570px across, and
   * 2017 P1 Q5 gives x +25, z -18, y -11 on one 350px across. They stop at
   * about the solid's own extent.
   */
  const AXIS_CLEAR_PX = 16;

  /**
   * Scene units per pixel, which is what turns that margin into a length.
   *
   * `place()` scales by `target / max(spanX, spanY)` over every geometry
   * point, so the ratio is known here only once the axes are known - and the
   * axes are what this is for. One refinement settles it: the axes now end
   * so near the solid that they barely move the span at all.
   */
  const frame = (extra: Pt[]) => {
    const all = [...hull, O, ...extra];
    return Math.max(
      Math.max(...all.map(q => q.x)) - Math.min(...all.map(q => q.x)),
      Math.max(...all.map(q => q.y)) - Math.min(...all.map(q => q.y)), 1e-9);
  };

  const axisEnd = (dir: [number, number, number], unitsPerPx: number): Pt => {
    const unit1 = P(dir[0], dir[1], dir[2]);
    // The projection is linear, so distance along the ray is t times this.
    const perT = Math.hypot(unit1.x - O.x, unit1.y - O.y) || 1;

    /**
     * How far the drawing itself reaches **along this axis's own direction**.
     *
     * Measured by projecting rather than by walking the ray, which is exact
     * and cannot miss. The ray version asked whether a point on the ray was
     * inside the solid's projected box, and on a cuboid set back along y the
     * answer is never: the box starts to the right of x = 0 and the z axis
     * runs straight up x = 0. So it reported nothing to clear and the axis
     * fell back to its model extent - about six tenths of the height the
     * cuboid appears to stand, because depth adds to apparent height.
     */
    const u = pt((unit1.x - O.x) / perT, (unit1.y - O.y) / perT);
    const along = (q: Pt) => (q.x - O.x) * u.x + (q.y - O.y) * u.y;
    const inside = Math.max(0, ...hull.map(along)) / perT;

    /**
     * The floor is **this axis's own extent**, not the biggest of the three.
     *
     * `reach` is the largest extent in any direction, so a cuboid 13 wide gave
     * its z axis a length of 16 when the solid stood 9 high - a tall empty
     * stalk with the shape crouched at the bottom of it.
     */
    const own = Math.max(...spec.parts.map(p => {
      const s = p.kind === 'cone' ? { x: 2 * p.r, y: 2 * p.r, z: p.h } : p.size;
      return dir[0] * (p.at.x + s.x) + dir[1] * (p.at.y + s.y) + dir[2] * (p.at.z + s.z);
    }));
    const len = Math.max(own * 1.15, inside + AXIS_CLEAR_PX * unitsPerPx / perT);
    return P(dir[0] * len, dir[1] * len, dir[2] * len);
  };

  /**
   * Room for the lettering, on the figures that letter everything.
   *
   * Six or more named points means a cuboid with every corner lettered, and at
   * the shared width its labels collide in all but a handful of arrangements.
   * Four or five - a cube on a cuboid, a cone - place comfortably and keep the
   * width they have always had.
   *
   * Read here rather than at the return, because the axis lengths depend on it.
   */
  const named = Object.keys(spec.names ?? {}).length;
  const target = named >= 6 ? 340 : 320;

  const DIRS: [number, number, number][] = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  let unitsPerPx = frame([]) / target;
  let axisEnds = DIRS.map(d => axisEnd(d, unitsPerPx));
  unitsPerPx = frame(axisEnds) / target;
  axisEnds = DIRS.map(d => axisEnd(d, unitsPerPx));

  for (const [end, name] of [
    [axisEnds[0], 'x'], [axisEnds[1], 'y'], [axisEnds[2], 'z'],
  ] as [Pt, string][]) {
    elements.push({ kind: 'segment', from: O, to: end });
    elements.push({ kind: 'label', text: name, anchor: end, away: O, small: true });
  }

  for (const part of spec.parts) {
    const { x: ox, y: oy, z: oz } = part.at;
    const v = (x: number, y: number, z: number) => P(ox + x, oy + y, oz + z);

    if (part.kind === 'cone') {
      const rim = flatCircle({ x: ox, y: oy, z: oz }, part.r);
      const apex = P(ox, oy, oz + part.h);
      const phi = rim.tilt * Math.PI / 180;
      const on = (t: number) => {
        const [x, y] = [rim.rx * Math.cos(t), rim.ry * Math.sin(t)];
        return pt(rim.at.x + x * Math.cos(phi) - y * Math.sin(phi),
                  rim.at.y + x * Math.sin(phi) + y * Math.cos(phi));
      };

      // Where the silhouette actually touches the rim.
      //
      // Drawn to the ends of the major axis first, which is only right for an
      // untilted ellipse — and a tilted one made the cone lean, its two slant
      // lines cutting across the base instead of grazing it. The chord of
      // contact from the apex gives the true pair: in the rim's own frame the
      // apex sits at (px, py), and (rx cos t, ry sin t) is a point of tangency
      // exactly when (px/rx) cos t + (py/ry) sin t = 1, which solves in closed
      // form.
      const d = pt(apex.x - rim.at.x, apex.y - rim.at.y);
      const px0 = d.x * Math.cos(phi) + d.y * Math.sin(phi);
      const py0 = -d.x * Math.sin(phi) + d.y * Math.cos(phi);
      const [Ac, Bc] = [px0 / rim.rx, py0 / rim.ry];
      const mag = Math.hypot(Ac, Bc);
      // the apex inside the rim on the page is a cone flatter than its own
      // base, which has no silhouette to draw
      if (mag <= 1.0001) continue;
      const delta = Math.atan2(Bc, Ac);
      const spread = Math.acos(1 / mag);
      const [t1, t2] = [delta - spread, delta + spread];

      elements.push({ kind: 'segment', from: on(t1), to: apex });
      elements.push({ kind: 'segment', from: on(t2), to: apex });
      // the arc in front of the solid, then the one it hides — split at the
      // points of tangency, which is where the silhouette changes over
      const deg = (t: number) => ((t * 180 / Math.PI) % 360 + 360) % 360;
      const rim2 = { centre: rim.at, rx: rim.rx, ry: rim.ry, tilt: rim.tilt };
      elements.push({ kind: 'ellipse', ...rim2, from: deg(t2), to: deg(t1) });
      elements.push({ kind: 'ellipse', ...rim2, from: deg(t1), to: deg(t2), dashed: true });
      continue;
    }

    const { x: X, y: Y, z: Z } = part.size;

    if (part.kind === 'cuboid') {
      // the visible outline, then the three edges hidden behind the solid
      const front = [v(0, 0, 0), v(X, 0, 0), v(X, 0, Z), v(0, 0, Z)];
      const back = [v(0, Y, 0), v(X, Y, 0), v(X, Y, Z), v(0, Y, Z)];
      elements.push({ kind: 'polygon', points: front });
      // The visible back is an open chain of three edges, not a closed shape.
      // Drawn as a polygon it closed from the top-left-front corner to the
      // bottom-right-back one — a line straight across the middle of the box,
      // on every one of these questions. Nothing measured it, because no check
      // asks what a stroke is *for*.
      elements.push({ kind: 'segment', from: back[1], to: back[2] });
      elements.push({ kind: 'segment', from: back[2], to: back[3] });
      elements.push({ kind: 'segment', from: back[3], to: front[3] });
      elements.push({ kind: 'segment', from: front[1], to: back[1] });
      elements.push({ kind: 'segment', from: front[2], to: back[2] });
      // the corner hidden behind, dashed as the papers draw it
      elements.push({ kind: 'segment', from: back[0], to: back[1], dashed: true });
      elements.push({ kind: 'segment', from: back[0], to: back[3], dashed: true });
      elements.push({ kind: 'segment', from: front[0], to: back[0], dashed: true });
    } else if (part.kind === 'prism') {
      // an isosceles triangle in the xz-plane, extruded along y
      const near = [v(0, 0, 0), v(X, 0, 0), v(X / 2, 0, Z)];
      const far = near.map((_, i) => [v(0, Y, 0), v(X, Y, 0), v(X / 2, Y, Z)][i]);
      elements.push({ kind: 'polygon', points: near });
      elements.push({ kind: 'segment', from: near[1], to: far[1] });
      elements.push({ kind: 'segment', from: near[2], to: far[2] });
      elements.push({ kind: 'segment', from: far[1], to: far[2] });
      // the far bottom corner is behind the solid
      elements.push({ kind: 'segment', from: far[0], to: far[1], dashed: true });
      elements.push({ kind: 'segment', from: far[0], to: far[2], dashed: true });
      elements.push({ kind: 'segment', from: near[0], to: far[0], dashed: true });
    } else {
      // a rectangular base with the apex over its centre
      const base = [v(0, 0, 0), v(X, 0, 0), v(X, Y, 0), v(0, Y, 0)];
      const apex = v(X / 2, Y / 2, Z);
      elements.push({ kind: 'polygon', points: base });
      for (const b of base) elements.push({ kind: 'segment', from: b, to: apex });
      if (part.construction) {
        // the base diagonals and the vertical, dashed — they are the construction
        elements.push({ kind: 'segment', from: base[0], to: base[2], dashed: true });
        elements.push({ kind: 'segment', from: base[1], to: base[3], dashed: true });
        const centre = v(X / 2, Y / 2, 0);
        elements.push({ kind: 'segment', from: centre, to: apex, dashed: true });
        elements.push({ kind: 'rightAngle', at: centre, arms: [apex, base[1]] });
      }
    }
  }

  // ── the vertex labels ─────────────────────────────────────────────────
  // Pushed away from the middle of the *solid*, not of the named points. Only
  // two or three vertices are ever named, and their centroid can sit anywhere
  // — for a pyramid on a cube it fell on the far side of the base, which sent
  // B straight down an edge.
  const corners: Pt[] = [];
  for (const part of spec.parts) {
    const s = part.kind === 'cone'
      ? { x: 2 * part.r, y: 2 * part.r, z: part.h }
      : part.size;
    for (const dx of [0, s.x]) for (const dy of [0, s.y]) for (const dz of [0, s.z]) {
      corners.push(project({ x: part.at.x + dx, y: part.at.y + dy, z: part.at.z + dz }));
    }
  }
  const middle = scale(corners.reduce((a, b) => add(a, b), pt(0, 0)), 1 / corners.length);
  // A vertex sitting *on* a drawn line — the point where a cone's base touches
  // the x-axis — is pushed across that line rather than away from the middle,
  // which for a horizontal axis sends the letter along it. Same rule the
  // pathway figures use, and the same reason.
  const drawn: [Pt, Pt][] = [];
  for (const e of elements) if (e.kind === 'segment') drawn.push([e.from, e.to]);
  const onLine = (q: Pt): [Pt, Pt] | null => {
    const d = (a: Pt, b: Pt) => Math.hypot(b.x - a.x, b.y - a.y);
    for (const [a, b] of drawn) {
      if (d(q, a) < 1e-6 || d(q, b) < 1e-6) continue;
      if (Math.abs(d(a, q) + d(q, b) - d(a, b)) < 1e-6) return [a, b];
    }
    return null;
  };

  /**
   * The directions of the drawn lines that actually **meet** a point.
   *
   * A vertex letter is exempt from these in `verify` - they are the lines it
   * is meant to sit beside - so nothing was stopping a letter being laid flat
   * along one of them, and for D on a cuboid that is exactly what happened.
   */
  const meetingAt = (q: Pt): number[] => {
    const out: number[] = [];
    for (const [a, b] of drawn) {
      for (const [here, there] of [[a, b], [b, a]] as [Pt, Pt][]) {
        if (Math.hypot(here.x - q.x, here.y - q.y) > 1e-6) continue;
        out.push(Math.atan2(there.y - here.y, there.x - here.x));
      }
    }
    return out;
  };

  /**
   * The middle of the **widest gap** between those directions.
   *
   * Three edges meet a cuboid's corner, so there are three gaps and one of
   * them is the roomiest. That is where a letter belongs and where 2017 P1 Q5
   * puts the letter on its interior point: in open face, square to nothing.
   */
  const widestGap = (angles: number[]): number | null => {
    if (angles.length < 2) return null;
    const s = [...angles].sort((a, b) => a - b);
    let best = -1, at = 0;
    for (let i = 0; i < s.length; i++) {
      const next = i + 1 < s.length ? s[i + 1] : s[0] + 2 * Math.PI;
      const span = next - s[i];
      if (span > best) { best = span; at = s[i] + span / 2; }
    }
    return best > 0 ? at : null;
  };

  for (const [name, p] of Object.entries(spec.names)) {
    const text = spec.showCoords.includes(name)
      ? `${name}(${p.x}, ${p.y}, ${p.z})`
      : name;
    const anchor = project(p);
    const line = onLine(anchor);
    let away = middle;
    /**
     * A long label may only go outward, the preference included.
     *
     * The ring below already refuses an inward candidate for a coordinate
     * label. Pointing the *preference* into the widest gap was escaping that
     * test, and `A(3, 0, 5)` came out lying along the very edge it names.
     */
    const outward = spec.showCoords.includes(name);
    const fromMiddle = pt(anchor.x - middle.x, anchor.y - middle.y);
    const gap = widestGap(meetingAt(anchor));
    if (gap !== null
        && !(outward && Math.cos(gap) * fromMiddle.x + Math.sin(gap) * fromMiddle.y <= 0)) {
      // `away` is the point the label is pushed *away from*, so it goes on the
      // opposite side of the anchor from the direction wanted.
      away = pt(anchor.x - Math.cos(gap), anchor.y - Math.sin(gap));
    }
    if (line) {
      // Across the line rather than away from the middle, which for a horizontal
      // axis would send the letter along it.
      //
      // Steering this further was tried three ways - probing both
      // perpendiculars, pushing down, pushing down and right - to put the
      // pyramid's B where 2017 P1 Q5 puts it. All three changed nothing:
      // `place()` finds the preferred direction uncomfortable and takes a ring
      // candidate, 120 times out of 120. The preference is not the lever here.
      const [a, b] = line;
      const n = pt(-(b.y - a.y), b.x - a.x);
      const k = Math.hypot(n.x, n.y) || 1;
      const towards = (n.x * (middle.x - anchor.x) + n.y * (middle.y - anchor.y)) > 0 ? 1 : -1;
      away = pt(anchor.x + towards * n.x / k, anchor.y + towards * n.y / k);
    }
    // **Eight directions to try, not one.** The rule above picks the one
    // direction that is right in principle — outward from the solid, or square
    // off the edge the vertex sits on — and on a lettered cuboid that is often
    // straight into a hidden back edge with nowhere else to go. Measured, 1.5%
    // of layouts placed all eleven labels of 2026 P1 Q11. The preferred
    // direction is still tried first; these are what `place()` falls back
    // through when it collides.
    /**
     * A label carrying coordinates may only go **outward**.
     *
     * 2014 P2 Q2 prints "A (8,4,6)" clear to the right of its dot, outside the
     * solid, and so does 2017 P1 Q5 with its "A (6,0,0)" below the x axis. Ours
     * offered the full ring, and a long label taking an inward candidate lands
     * across the drawing: measured, one layout in three put A up and to the
     * left, over the cuboid, 5.9px from an edge.
     *
     * A bare letter still gets the whole ring - it is small enough to sit in a
     * gap, and on a lettered cuboid it has to.
     */
    const alternatives: Pt[] = [];
    for (let i = 1; i < 8; i++) {
      const t = (Math.atan2(away.y - anchor.y, away.x - anchor.x) + i * Math.PI / 4);
      // the push runs from the away point back through the anchor
      if (outward && -Math.cos(t) * fromMiddle.x - Math.sin(t) * fromMiddle.y <= 0) continue;
      alternatives.push(pt(anchor.x + Math.cos(t), anchor.y + Math.sin(t)));
    }
    /**
     * **Every named point gets a dot.**
     *
     * 2014 P2 Q2 dots A, B and C; 2017 P1 Q5 dots every vertex it draws. A
     * letter beside a projected corner does not say which corner - on a
     * wireframe cuboid three edges meet within a few pixels of each other -
     * and ours drew none at all except one midpoint.
     *
     * `dots` stays for a point that is **not** a labelled corner, such as a
     * midpoint the prose names.
     */
    elements.push({ kind: 'dot', at: anchor });
    elements.push({ kind: 'label', text, anchor, away, alternatives });
  }

  return {
    // Projected, so nothing about it is to scale and nothing metric is claimed.
    scene: { elements, notToScale: true, target },
    claims: [],
  };
}
