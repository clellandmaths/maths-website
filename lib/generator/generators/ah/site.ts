/**
 * An Advanced Higher card, in the shape the website shows questions in.
 *
 * National 5's adapter (`../../worksheet-question.ts`) reads National 5's
 * registry for a question's papers, hints and part marks, so an Advanced
 * Higher card passed through it would come out with none of the three. This is
 * Advanced Higher's own, beside its engine, and it changes nothing of National
 * 5's: it calls the same layout and the same delimiter conversion, so a
 * generated Advanced Higher question displays exactly as a National 5 one does.
 *
 * What differs:
 *
 * - **The paper behind it is the card itself.** `basedOn` is the card's own
 *   badge ("2016 Q1(a)"), so the site's `withParentVideo` finds that paper
 *   question's video, and the printed markscheme names it.
 * - **Its hints are its own ladder** (`Built.ladder`), the paper card's moves
 *   with this draw's numbers, every string through `toSiteMaths`.
 * - **Its marks are the card's**, per part, from the registry, which
 *   `ah-registry` holds to the site's own card and the marking instructions.
 * - **Its drawings in the marking instructions** travel as `markschemeFigures`,
 *   shown with the working and the printed markscheme, never under Show answer.
 *
 * The website reaches this through its one door, `lib/generated-question.ts`,
 * and only on a press: the routines are loaded per topic (`routines/index.ts`).
 */
import {
  answerPartsOnLines, generatedUid, layoutQuestion, stopsInsideMaths, toSiteMaths, twinKeysOf,
  type WorksheetQuestion,
} from '../../worksheet-question';
import { questionKey, storyFreeKey } from '../../question-key';
import type { Built, CardLabel, CardRoutine, Ladder } from './types';
import { AH_CARDS, idForCard } from './registry';
import { AH_BY_CODE, AH_CODES } from './codes';
import { SITE_CARDS } from './site-cards';
import { drawWith, makeWith, routineFor } from './engine';
import { familyOf } from './families';
import { CORES, coreKey } from './cores';
import { CARD_TWINS, cardTwinKey } from './card-twins';

export interface AhSiteQuestion extends WorksheetQuestion {
  /** The site's subtopics, as an Advanced Higher paper question carries them. */
  subtopics: string[];
  /**
   * The draw's core, `core:<card>:<…>`, on a thin card only (`cores.ts`). A sheet that
   * passes it back in `exclude` is offered a fresh core first next time.
   */
  coreKey?: string;
  /** The hint ladder for this draw, in the site's delimiters. */
  ladder: Ladder;
  /** The marking instructions' drawings, absent on every card without them. */
  markschemeFigures?: { part: string; svg: string }[];
}

/** A built card as the site's question. */
export function toSiteQuestion(id: string, built: Built, seed: string, index: number): AhSiteQuestion {
  const meta = AH_CARDS[id];
  if (!meta) throw new Error(`AH site: no card has the id ${id}`);
  const code = AH_CODES[id];
  if (!code) throw new Error(`AH site: ${meta.card} carries no code, so no link could make it again`);
  const site = SITE_CARDS[meta.card];
  const { ladder } = built;
  return {
    question: stopsInsideMaths(toSiteMaths(layoutQuestion(built.questionLines))),
    answer: answerPartsOnLines(toSiteMaths(built.finalAnswer)),
    steps: built.solutionSteps.map(toSiteMaths),
    stepMarks: built.stepMarks,
    marks: [...meta.marks],
    topics: [...(site?.topics ?? [])],
    subtopics: [...(site?.subtopics ?? [])],
    // No video of its own: the site lends it the paper question's, by `basedOn`.
    videoId: '',
    timestamp: '',
    year: '',
    paperNumber: 0,
    questionIndex: index,
    questionNumber: String(index + 1),
    // The caption, as National 5's: what the question tests, not a paper badge,
    // so nothing on the site mistakes it for the paper question.
    label: site?.subtopics[0] ?? site?.topics[0] ?? meta.card,
    basedOn: [meta.card],
    parentIndex: 0,
    skill: toSiteMaths(meta.skill),
    ladder: {
      moves: ladder.moves.map(toSiteMaths),
      marks: [...ladder.marks],
      shows: ladder.shows.map(s => (s === null ? null : toSiteMaths(s))),
      ...(ladder.watch ? { watch: { at: ladder.watch.at, text: toSiteMaths(ladder.watch.text) } } : {}),
    },
    ...(built.markschemeFigures
      ? { markschemeFigures: built.markschemeFigures.map(({ part, svg }) => ({ part, svg })) }
      : {}),
    // Its "same question" identities, as National 5's carry (no twins on a sheet: the owner on
    // the AH no-twins sheet, 2026-10-10, "Yes"), so a sheet's `exclude` keeps its twins off too.
    twinKeys: twinKeysOf(built),
    uid: generatedUid(code, seed, 0),
  };
}

/**
 * The one way a generated Advanced Higher question is made, from its code and
 * its seed: the builder and a shared link both come through here. Null when
 * the code is not an Advanced Higher card's, which is how the site's door
 * tells the courses apart (`ah-registry` proves no code is in both).
 */
export async function ahQuestionFromCode(code: string, seed: string, index: number): Promise<AhSiteQuestion | null> {
  const id = AH_BY_CODE[code];
  if (!id || !AH_CARDS[id]) return null;
  const routine = await routineFor(id);
  const card = AH_CARDS[id].card;
  const made = withCardTwin(card, toSiteQuestion(id, makeWith(routine, seed), seed, index), routine, seed);
  // A shared sheet, opened again, knows its cores too, so "add more" can avoid them.
  const ck = card in CORES ? coreKey(card, drawWith(routine, seed)) : undefined;
  return ck ? { ...made, coreKey: ck } : made;
}

/**
 * The question with its card's own twin key added (`card-twins.ts`), on the few cards the
 * owner ruled have twins the shared test cannot see. Reads the draw only.
 */
function withCardTwin(card: CardLabel, made: AhSiteQuestion, routine: CardRoutine, seed: string): AhSiteQuestion {
  if (!(card in CARD_TWINS)) return made;
  const tk = cardTwinKey(card, drawWith(routine, seed));
  return tk ? { ...made, twinKeys: [...(made.twinKeys ?? []), tk] } : made;
}

/** Is this badge an Advanced Higher card with a routine? */
export function isAhCard(card: CardLabel): boolean {
  return idForCard(card) !== undefined;
}

/**
 * Refused draws in a row before a card counts as spent. National 5's bound (`drawFrom`) was
 * 40, and on a card with fewer than 20 questions a sheet of 20 then stopped short of the card's
 * questions on 113 of 350 sheets: the last one or two are rare, and 40 misses in a row came
 * first. At 200 none did (tools/never-the-paper `ahtries.mts`; the owner, 2026-10-10: "do the
 * 200"). Only a card a sheet has nearly used up ever reaches it.
 */
const TRIES = 200;

/**
 * Seeds tried for a core the sheet has not used (`cores.ts`) before a thin card
 * repeats one with new numbers. Draws only, nothing built, so they are cheap; a card
 * whose cores are all on the sheet spends these on each further copy, then goes on
 * exactly as a card with no core does.
 */
const CORE_TRIES = 30;

/**
 * Up to `count` different questions from a set of cards.
 *
 * Different as the site's sheet keys it: the whole question, and the sum
 * without its story, the two keys `keysOfQuestion` gives the site, so a
 * caller's `exclude` built from what a sheet holds works across calls.
 *
 * **A family counts as one card.** Each pick takes the card, or family, used
 * least so far, counting what the sheet already `held` (badges of the paper
 * and generated cards on it). So a topic gives one of a family before a second
 * of anything, and a second Euclid card only once every other card has had its
 * turn. Within a family, its least-used member.
 *
 * Ties go to the card that comes first in `cards`, so the caller's order is
 * the order of first use: shuffled, so a topic of twenty cards does not open
 * on the same five, and interleaved by subtopic where there are several.
 *
 * **A thin card takes a fresh core first** (`cores.ts`, the owner's worksheet rule,
 * 2026-10-05): its copies on one sheet get different equations before any equation
 * comes twice with new numbers. Cores already on the sheet arrive in `exclude` as
 * each question's `coreKey`. Never a limit: after `CORE_TRIES` seeds with no fresh
 * core, the card goes on as before.
 *
 * Sequential, necessarily: the random stream is module-level.
 */
async function drawCards(
  cards: readonly CardLabel[],
  count: number,
  makeSeed: () => string,
  exclude: readonly string[],
  held: readonly CardLabel[],
): Promise<AhSiteQuestion[]> {
  const live = cards.filter(isAhCard);
  const unitOf = (card: CardLabel) => familyOf(card) ?? card;
  const units = new Map<string, CardLabel[]>();
  for (const card of live) units.set(unitOf(card), [...(units.get(unitOf(card)) ?? []), card]);

  const unitUses = new Map<string, number>();
  const cardUses = new Map<CardLabel, number>();
  for (const card of held) {
    if (units.has(unitOf(card))) unitUses.set(unitOf(card), (unitUses.get(unitOf(card)) ?? 0) + 1);
    cardUses.set(card, (cardUses.get(card) ?? 0) + 1);
  }
  const fails = new Map<CardLabel, number>();
  const spent = (card: CardLabel) => (fails.get(card) ?? 0) >= TRIES;
  const coreMisses = new Map<CardLabel, number>();

  const seen = new Set(exclude);
  const drawn = new Set<string>();
  const out: AhSiteQuestion[] = [];
  while (out.length < count) {
    let pick: { unit: string; card: CardLabel } | null = null;
    for (const [unit, members] of units) {
      const open = members.filter(c => !spent(c));
      if (!open.length) continue;
      if (pick && (unitUses.get(unit) ?? 0) >= (unitUses.get(pick.unit) ?? 0)) continue;
      const card = open.reduce((a, b) => ((cardUses.get(b) ?? 0) < (cardUses.get(a) ?? 0) ? b : a));
      pick = { unit, card };
    }
    if (!pick) break;
    const id = idForCard(pick.card)!;
    const routine = await routineFor(id);
    const seed = makeSeed();
    // A core already on the sheet: try another seed, up to CORE_TRIES, before allowing it.
    const ck = pick.card in CORES ? coreKey(pick.card, drawWith(routine, seed)) : undefined;
    if (ck && seen.has(ck) && (coreMisses.get(pick.card) ?? 0) < CORE_TRIES) {
      coreMisses.set(pick.card, (coreMisses.get(pick.card) ?? 0) + 1);
      continue;
    }
    // A draw the sheet has already seen, word for word, has the same keys and the same verdict:
    // refused at once, before the site's question and its twin keys are made (the costly part).
    const built = makeWith(routine, seed);
    const raw = `${pick.card}\n${built.questionLines.join('\n')}\n${built.finalAnswer}`;
    if (drawn.has(raw)) {
      fails.set(pick.card, (fails.get(pick.card) ?? 0) + 1);
      continue;
    }
    drawn.add(raw);
    const made = withCardTwin(pick.card, toSiteQuestion(id, built, seed, out.length), routine, seed);
    const key = questionKey({ questionLines: [made.question], finalAnswer: made.answer });
    const sum = storyFreeKey(made.question, made.answer);
    // A twin of a question on the sheet is the same question too (the Euclid sisters, a
    // factor order, the same equation in other words): the owner, 2026-10-10.
    const twins = made.twinKeys ?? [];
    if (seen.has(key) || seen.has(sum) || twins.some(t => seen.has(t))) {
      fails.set(pick.card, (fails.get(pick.card) ?? 0) + 1);
      continue;
    }
    // Only a fresh core resets the count. A card that has used every core stays spent for
    // the rest of this call, rather than spending CORE_TRIES draws again on each later
    // copy: that took a 20-question separable sheet from 80 to 380 ms (2026-10-06).
    if (ck && !seen.has(ck)) coreMisses.set(pick.card, 0);
    seen.add(key);
    seen.add(sum);
    for (const t of twins) seen.add(t);
    if (ck) seen.add(ck);
    out.push(ck ? { ...made, coreKey: ck } : made);
    unitUses.set(pick.unit, (unitUses.get(pick.unit) ?? 0) + 1);
    cardUses.set(pick.card, (cardUses.get(pick.card) ?? 0) + 1);
  }
  return out;
}

function shuffle<T>(xs: readonly T[], rand: () => number): T[] {
  const out = [...xs];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Fresh questions like one card: "Another like this one", a variation in the
 * Worksheet Builder, the Exam Hall's five new questions. Fewer than asked when
 * the card cannot make that many different ones; the caller says so.
 */
export function ahLike(
  card: CardLabel,
  count: number,
  makeSeed: () => string,
  exclude: readonly string[] = [],
): Promise<AhSiteQuestion[]> {
  return drawCards([card], count, makeSeed, exclude, []);
}

/**
 * The cards filed under a site subtopic, as the Explorer filters Advanced
 * Higher's paper questions: by subtopic, or by the main topic where it has
 * none (Maclaurin Series, Systems of Equations).
 */
function cardsUnder(subtopic: string): CardLabel[] {
  return Object.values(AH_CARDS)
    .map(m => m.card)
    .filter(card => {
      const site = SITE_CARDS[card];
      return !!site && (site.subtopics.includes(subtopic) || site.topics.includes(subtopic));
    });
}

/**
 * The cards under any of the subtopics, interleaved: the first of each
 * subtopic, then the second of each, as National 5's `generateForSubtopics`
 * does, so two subtopics and two questions give one of each. Each subtopic's
 * own list is shuffled first; a card filed under two comes once, where it
 * first falls.
 *
 * **`rand` is the caller's** (the site's, or a check's fixed stream), never
 * read here: nothing in `ah/` may reach for randomness outside the seeded
 * stream (`ah-purity`). It orders the cards only; each question is still
 * made from its code and seed, which is all a link carries.
 */
export function cardsForSubtopics(subtopics: readonly string[], rand: () => number): CardLabel[] {
  const lists = subtopics.map(s => shuffle(cardsUnder(s), rand));
  const out: CardLabel[] = [];
  for (let rank = 0; lists.some(l => rank < l.length); rank++) {
    for (const list of lists) if (rank < list.length && !out.includes(list[rank])) out.push(list[rank]);
  }
  return out;
}

/** The cards of one practice topic: its registry file, named as the site's practice id. */
export function cardsForTopic(file: string): CardLabel[] {
  return Object.values(AH_CARDS).filter(m => m.file === file).map(m => m.card);
}

/** Fresh questions across the Worksheet Builder's subtopic filter. */
export function ahForSubtopics(
  subtopics: readonly string[],
  count: number,
  makeSeed: () => string,
  rand: () => number,
  exclude: readonly string[] = [],
  held: readonly CardLabel[] = [],
): Promise<AhSiteQuestion[]> {
  return drawCards(cardsForSubtopics(subtopics, rand), count, makeSeed, exclude, held);
}

/** Fresh questions on one practice topic. */
export function ahForTopic(
  file: string,
  count: number,
  makeSeed: () => string,
  rand: () => number,
  exclude: readonly string[] = [],
  held: readonly CardLabel[] = [],
): Promise<AhSiteQuestion[]> {
  return drawCards(shuffle(cardsForTopic(file), rand), count, makeSeed, exclude, held);
}
