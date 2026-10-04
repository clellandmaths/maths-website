/**
 * Every Advanced Higher card that has a routine, one file per site topic.
 *
 * A topic's cards live in `registry/<topic>.ts` (what each card is) and
 * `routines/<topic>.ts` (how it is made), under the same name, so a reader
 * looking at one card finds both halves by name and nothing else. Add a topic
 * by adding its file here and its loader in `routines/index.ts`; `ah-registry`
 * fails if the two lists disagree.
 *
 * Nothing here is written by hand that could be derived: the id and the
 * paper come from the card label (`cards.ts`), the code from the id
 * (`codes.ts`), and the website topic from the site's own card, which
 * `ah-registry` reads.
 */
import type { CardLabel, CardMeta } from '../types';
import { ahId } from '../cards';
import { BINOMIAL } from './binomial-theorem';
import { COMPLEX } from './complex-numbers';
import { DIFFERENTIAL_EQUATIONS } from './differential-equations';
import { DIFFERENTIATION } from './differentiation';
import { FUNCTIONS } from './functions-and-graphs';
import { INTEGRATION } from './integration';
import { MACLAURIN } from './maclaurin-series';
import { MATRICES } from './matrices';
import { PROOF } from './methods-of-proof';
import { NUMBER_THEORY } from './number-theory';
import { PARTIAL_FRACTIONS } from './partial-fractions';
import { SEQUENCES } from './sequences-and-series';
import { SYSTEMS } from './systems-of-equations';
import { VECTORS } from './vectors';

/**
 * Topic file name to its cards. Alphabetical. A card with two site topics
 * (2026 P2 Q13, Q16; 2025 P1 Q6) lives under the first one the site lists.
 */
const TOPICS: Readonly<Record<string, readonly CardMeta[]>> = {
  'binomial-theorem': BINOMIAL,
  'complex-numbers': COMPLEX,
  'differential-equations': DIFFERENTIAL_EQUATIONS,
  differentiation: DIFFERENTIATION,
  'functions-and-graphs': FUNCTIONS,
  integration: INTEGRATION,
  'maclaurin-series': MACLAURIN,
  matrices: MATRICES,
  'methods-of-proof': PROOF,
  'number-theory': NUMBER_THEORY,
  'partial-fractions': PARTIAL_FRACTIONS,
  'sequences-and-series': SEQUENCES,
  'systems-of-equations': SYSTEMS,
  vectors: VECTORS,
};

export interface Registered extends CardMeta {
  /** `ahId(card)`. */
  id: string;
  /** The topic file both halves live in. */
  file: string;
}

function collect(): Record<string, Registered> {
  const out: Record<string, Registered> = {};
  const seen = new Map<CardLabel, string>();
  for (const [file, cards] of Object.entries(TOPICS)) {
    for (const meta of cards) {
      // One card, one routine: a card listed twice would be two routines
      // answering "another like this one" for the same question.
      const before = seen.get(meta.card);
      if (before) throw new Error(`AH registry: ${meta.card} is in both ${before} and ${file}`);
      seen.set(meta.card, file);
      const id = ahId(meta.card);
      out[id] = { ...meta, id, file };
    }
  }
  return out;
}

/** Every registered card, by id. */
export const AH_CARDS: Readonly<Record<string, Registered>> = collect();

/** The id for a card label, or undefined when that card has no routine yet. */
export function idForCard(card: CardLabel): string | undefined {
  const id = ahId(card);
  return AH_CARDS[id] ? id : undefined;
}

/** The topic files, for `ah-registry` to compare with the routine loaders. */
export const REGISTRY_FILES: readonly string[] = Object.keys(TOPICS);
