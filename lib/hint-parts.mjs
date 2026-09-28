/**
 * Short hints on a card with several parts: a step for every part.
 *
 * The owner, 2026-09-28: "I think that a card with 3 parts needs to be able to
 * show hints for all parts?" The short hints (`SHORT_HINTS` in
 * `components/Hints.tsx`) were the nudge, the first step and one watch-out, all
 * taken from the top of the ladder, so on a card asking (a), (b) and (c) the
 * hint helped with (a) and said nothing about the rest. The full ladders were
 * never short of the later parts; only the cut was.
 *
 * So the ladder is split into its parts first, and the cut is made in each.
 * Where a part begins is known two ways:
 *
 * - **by name**, where the moves say which part they are for: "(a) Factorise",
 *   "B: Write a number…". Every Higher, Advanced Higher and Higher Apps
 *   multi-part card, and most of N5 Apps';
 * - **by marks**, where they do not (National 5, whose moves are written per
 *   variation): the card prints what each part is worth, each move carries
 *   what it earns, and the part ends where its marks are used up.
 *
 * **JavaScript, not TypeScript, so a check can run it.** `check-hint-gap.mjs`
 * runs in every build and holds every multi-part card to a step per part with
 * these very functions; the site's checks cannot run TypeScript, and a copy
 * of the logic in the check would be a second thing to keep in step. The
 * types are in the comments, which the TypeScript side reads.
 */

/**
 * @typedef {{ move: string, marks?: number, shows?: string | null, watch?: string }} PartRung
 */

/** "(a)" or "A:" leading a move, as the part it is for. */
const MOVE_PART = /^\s*(?:<strong>\s*)?(?:\(([a-h])\)|([A-H])\s*[:.)])/;

/**
 * @param {string} move
 * @returns {string | null}
 */
export function partOfMove(move) {
  const m = move.match(MOVE_PART);
  return m ? (m[1] ?? m[2].toLowerCase()) : null;
}

/**
 * The parts a question prints marks beside, in order, from its HTML: "(a)",
 * "(b)", or "(a)(i)", "(a)(ii)", "(b)" where a letter is split into romans.
 * A part opens a line or follows a tag, a space or an `&nbsp;` (its `;`), so
 * `f(a)` is not one.
 *
 * @param {string} questionHtml
 * @returns {string[]}
 */
export function partNames(questionHtml) {
  // Not the printed badge: "2022 P2 Q5(a) & (b)" names parts too, and its
  // "& (b)" was read as the question's first part.
  const html = questionHtml.replace(/^\s*<small>[\s\S]*?<\/small>/i, '');
  const letters = [...html.matchAll(/(?:^|[\s>;])\(([a-h])\)/g)]
    .filter((m, i, all) => all.findIndex(x => x[1] === m[1]) === i);
  /** @type {string[]} */
  const out = [];
  letters.forEach((m, i) => {
    const end = i + 1 < letters.length ? letters[i + 1].index : html.length;
    const romans = [...new Set([...html.slice(m.index, end).matchAll(/(?:^|[\s>;])\((i{1,3}|iv|v)\)/g)].map(r => r[1]))];
    if (romans.length >= 2) romans.forEach(r => out.push(`(${m[1]})(${r})`));
    else out.push(`(${m[1]})`);
  });
  return out;
}

/**
 * The ladder in parts, or null where the card has one part or the split
 * cannot be trusted.
 *
 * By name first: moves that name two or more parts are grouped by the part
 * they name, and a move before any part is named joins the first. Otherwise by
 * marks, and only when the moves' marks add up to the card's: a part ends at
 * the move that uses up its marks, and a move worth nothing goes with the part
 * it leads into. Every part must earn something, or the split is wrong.
 *
 * @template {PartRung} R
 * @param {R[]} rungs
 * @param {number[]} [partMarks]
 * @returns {R[][] | null}
 */
export function splitByPart(rungs, partMarks) {
  const named = rungs.map(r => partOfMove(r.move));
  if (new Set(named.filter(Boolean)).size >= 2) {
    /** @type {R[][]} */
    const groups = [];
    /** @type {string | null} */
    let current = null;
    rungs.forEach((r, i) => {
      const p = named[i];
      if (p && p !== current) { groups.push([]); current = p; }
      if (!groups.length) groups.push([]);
      groups[groups.length - 1].push(r);
    });
    return groups;
  }

  if (!partMarks || partMarks.length < 2) return null;
  const want = partMarks.reduce((a, b) => a + b, 0);
  const have = rungs.reduce((a, r) => a + (r.marks ?? 0), 0);
  if (want !== have) return null;
  /** @type {R[][]} */
  const groups = partMarks.map(() => []);
  let part = 0, used = 0, bound = partMarks[0];
  for (const r of rungs) {
    groups[part].push(r);
    used += r.marks ?? 0;
    while (part < partMarks.length - 1 && used >= bound) { part++; bound += partMarks[part]; }
  }
  return groups.every(g => g.some(r => (r.marks ?? 0) > 0)) ? groups : null;
}

/**
 * The short hint for a card in parts: the nudge where the course writes one,
 * then for each part its first step, named for the part where the move does not
 * already say, and that part's watch-out after it. A step shows no working,
 * exactly as the one-part short hint does.
 *
 * @param {PartRung[][]} groups
 * @param {string[]} names
 * @param {boolean} nudges
 * @returns {PartRung[]}
 */
export function shortByPart(groups, names, nudges) {
  /** @type {PartRung[]} */
  const out = [];
  groups.forEach((g, i) => {
    const nudge = i === 0 && nudges && g[0]?.marks === 0;
    if (nudge) out.push({ move: g[0].move });
    const first = g.find((_, j) => !(nudge && j === 0));
    if (first) {
      const name = names.length === groups.length ? names[i] : '';
      const move = partOfMove(first.move) || !name ? first.move : `${name} ${first.move}`;
      out.push({ move, marks: first.marks });
    }
    const watch = g.find(r => r.watch)?.watch;
    if (watch) out.push({ move: '', watch });
  });
  return out;
}

/**
 * "2022 P2 Q5(a) & (b)" -> ["2022 P2 Q5(a)", "2022 P2 Q5(b)"], or null.
 *
 * @param {string} label
 * @returns {string[] | null}
 */
export function cardParts(label) {
  const m = label.match(/^(.*Q\d+)\s*\(([a-h])\)((?:\s*&\s*\([a-h]\))+)$/);
  if (!m) return null;
  return [m[2], ...[...m[3].matchAll(/\(([a-h])\)/g)].map(x => x[1])].map(p => `${m[1]}(${p})`);
}
