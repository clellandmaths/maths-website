import { getRandomInt, roundHalfUp } from './utils';

/**
 * Shared contexts for National 5 questions that are set in a situation.
 *
 * Randomising the numbers is not enough. A worksheet of ten percentage
 * questions that all depreciate a van, or ten simultaneous-equation questions
 * that all price mangoes and apples, reads as one question asked ten times, and
 * a pupil starts recognising the story rather than doing the maths.
 *
 * Variety comes from two places, which multiply: a list of **subjects** (the
 * jacket, the caravan, the bee colony) and a list of **phrasings** for the same
 * underlying situation. Twelve subjects and four phrasings give forty-eight
 * openings from a page of code, and adding one subject adds four more.
 *
 * `__checks__/contexts.ts` counts the distinct contexts each topic actually
 * produces and fails if the count drops, so this cannot quietly regress.
 */

const pick = <T,>(xs: T[]): T => xs[getRandomInt(0, xs.length - 1)];

/** 22600 -> "22,600"; the thousands separator the papers use. */
export function money(v: number, dp = 2): string {
  // roundHalfUp, not toFixed: toFixed rounds the binary a double holds, so
  // an exact half-penny falls the wrong way. See decimals.ts.
  const [whole, frac] = roundHalfUp(v, dp).split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return frac ? `${grouped}.${frac}` : grouped;
}

/** A count with thousands separators and no decimal part. */
export const plain = (v: number): string => money(Math.round(v), 0);

/** Money with the pence shown only when there are any — £4.25, but £450. */
export const moneyNeat = (v: number): string =>
  Math.abs(v - Math.round(v)) < 1e-9 ? money(v, 0) : money(v, 2);

export type Rounding = 'money' | 'nearest-pound' | '3sf' | 'whole';

// ── things whose value grows or shrinks year on year ──────────────────────

export interface AssetContext {
  /** eg "A van was valued at £22,600." */
  opening: (start: string) => string;
  /** eg "the van" — used in "the value of the van after 3 years" */
  subject: string;
  format: (v: number) => string;
  unit: string;
  rounding: Rounding;
  appreciates: boolean;
}

const gbp = (v: number) => `£${money(v, 0)}`;

/** Money that loses value. */
const DEPRECIATING: [string, string, Rounding][] = [
  ['A van was valued at %.', 'the van', '3sf'],
  ['A new laptop is bought for %.', 'the laptop', 'money'],
  ['A motorhome was bought for %.', 'the motorhome', 'money'],
  ['A tractor was bought new for %.', 'the tractor', 'nearest-pound'],
  ['A motorhome was valued at %.', 'the motorhome', '3sf'],
  ['A printing press was bought for %.', 'the press', 'nearest-pound'],
  ['A minibus was bought by a school for %.', 'the minibus', 'money'],
  ['A fishing boat was valued at %.', 'the boat', '3sf'],
  ['A dentist bought a new x-ray machine for %.', 'the machine', 'money'],
  ['A recording studio bought a mixing desk for %.', 'the mixing desk', 'nearest-pound'],
  ['A farmer bought a combine harvester for %.', 'the harvester', '3sf'],
  ['A courier firm bought an electric van for %.', 'the van', 'money'],
];

/** Money that gains value. */
const APPRECIATING: [string, string, Rounding][] = [
  ["A company's annual profit was %.", 'the profit', 'nearest-pound'],
  ['A house was bought for %.', 'the house', 'nearest-pound'],
  ['% is invested in a savings account.', 'the investment', 'money'],
  ['% is placed in a five year bond.', 'the bond', 'money'],
  ['A flat was bought for %.', 'the flat', 'nearest-pound'],
  ['A painting was valued at %.', 'the painting', '3sf'],
  ['A vintage guitar was bought at auction for %.', 'the guitar', 'money'],
  ['A charity received donations of % last year.', 'the donations', 'nearest-pound'],
  ['A holiday cottage was bought for %.', 'the cottage', 'nearest-pound'],
  ['% is paid into a credit union account.', 'the account', 'money'],
  ['A football club was valued at %.', 'the club', '3sf'],
  ['A woodland was bought for %.', 'the woodland', 'nearest-pound'],
];

/** Countable things, where the answer is a whole number of somethings. */
const COUNTED: [string, string, string, boolean][] = [
  ['A town has a population of %.', 'the town', 'people', true],
  ['Households in a city produced % tonnes of waste last year.', 'the waste produced', 'tonnes', false],
  ['A colony of puffins on an island numbers %.', 'the colony', 'puffins', false],
  ['A red squirrel population in a forest is estimated at %.', 'the population', 'squirrels', true],
  ['A reservoir holds % million litres of water.', 'the reservoir', 'million litres', false],
  ['A leisure centre has % members.', 'the membership', 'members', true],
  ['A wind farm generated % megawatt hours last year.', 'the output', 'megawatt hours', true],
  ['A glacier covers an area of % hectares.', 'the glacier', 'hectares', false],
  ['A deer herd on an estate numbers %.', 'the herd', 'deer', true],
  ['A library lent out % books last year.', 'the number of loans', 'books', false],
  ['A hospital had % patients on its waiting list.', 'the waiting list', 'patients', false],
  ['A bee colony contains % bees.', 'the colony', 'bees', true],
];

export const ASSET_CONTEXTS: AssetContext[] = [
  ...DEPRECIATING.map(([opening, subject, rounding]): AssetContext => ({
    opening: s => opening.replace('%', s), subject, format: gbp,
    unit: '£', rounding, appreciates: false,
  })),
  ...APPRECIATING.map(([opening, subject, rounding]): AssetContext => ({
    opening: s => opening.replace('%', s), subject, format: gbp,
    unit: '£', rounding, appreciates: true,
  })),
  ...COUNTED.map(([opening, subject, unit, appreciates]): AssetContext => ({
    opening: s => opening.replace('%', s), subject, format: plain,
    unit, rounding: 'whole', appreciates,
  })),
];

/** Only the money ones that lose value — what a two-stage question needs. */
export const DEPRECIATING_MONEY = ASSET_CONTEXTS.filter(c => !c.appreciates && c.unit === '£');

// ── reverse percentages: a value after a change, find what it was ─────────

export interface ReverseContext {
  up: boolean;
  lines: (shown: string, rate: number) => string[];
  subject: string;
  /** Plausible range for the *original* value, in whole pounds. */
  band: [number, number];
  /**
   * A thing counted rather than priced, and the word for it.
   *
   * 2017 P2 Q5 is a reverse percentage on 4830 *tickets*, and every context
   * here was money — so the one paper question that counts things had no shape
   * to be generated from. A counted original also has to come out whole: 4200
   * tickets is an answer and 4200.53 is not.
   */
  counted?: string;
}

/** "a jacket" but "an insurance premium". */
/**
 * The unit as a diagram writes it.
 *
 * A figure has no room for "17 millimetres" beside a 40px side, and no exam
 * paper writes it that way either — the prose says centimetres, the drawing
 * says cm. A long word also forces the label so far from its side, to clear its
 * own width, that it stops reading as belonging to it.
 */
export const abbrev = (unit: string): string => ({
  millimetres: 'mm', centimetres: 'cm', metres: 'm', kilometres: 'km',
  grams: 'g', kilograms: 'kg', tonnes: 't', litres: 'l',
}[unit] ?? unit);

export const article = (word: string): string =>
  ('aeiou'.includes(word[0].toLowerCase()) ? 'an' : 'a');

/** A quantity with its unit, singular when the amount is one. */
/**
 * The unit as it should read beside `v`: "2 hours", but "1 hour".
 *
 * Split out of `withUnit` so a caller that formats its own number can still
 * share the rule. `data.quartiles` prints its value through a formatter that
 * can carry a prefix - £5, 17°C - so it cannot use `withUnit` wholesale, and
 * it was appending the plural unchanged: **"1 hours"**, in 0.8% of draws.
 */
export const unitFor = (v: number, unit: string): string =>
  v === 1 ? unit.replace(/s$/, '') : unit;

export function withUnit(v: number, unit: string): string {
  return `${v} ${unitFor(v, unit)}`;
}

// A discount is applied to something you buy, so these are priced like goods —
// not like the flats and paintings below.
const SALE_ITEMS: [string, number, number][] = [
  ['jacket', 30, 180], ['sofa', 250, 900], ['bicycle', 150, 800],
  ['tent', 40, 300], ['guitar', 120, 700], ['dishwasher', 200, 600],
  ['mattress', 150, 700], ['television', 200, 1200], ['pair of running shoes', 40, 160],
  ['garden bench', 60, 300], ['wetsuit', 80, 350], ['drum kit', 250, 1200],
  ['kayak', 300, 1400], ['greenhouse', 250, 1500], ['telescope', 90, 600],
];

const RISE_SUBJECTS: [string, string, number, number][] = [
  ['flat', 'The value of a flat has increased by R%.', 80000, 260000],
  ['house', 'House prices in a village have risen by R%.', 120000, 400000],
  ['season ticket', 'The price of a season ticket has gone up by R%.', 300, 1200],
  ['train fare', 'A train fare has increased by R%.', 20, 160],
  ['gym membership', 'A gym has put its annual membership up by R%.', 200, 700],
  ['insurance premium', 'An insurance premium has risen by R%.', 300, 1400],
  ['painting', 'A painting has increased in value by R%.', 800, 9000],
  ['weekly wage', 'A weekly wage has been increased by R%.', 300, 900],
  ['monthly rent', 'A monthly rent has been increased by R%.', 400, 1500],
  ['ferry ticket', 'The price of a ferry ticket has risen by R%.', 20, 140],
  ['plot of land', 'A plot of land has increased in value by R%.', 15000, 90000],
  ['annual fee', 'A club has increased its annual fee by R%.', 60, 400],
];

/**
 * Reverse percentages on a countable.
 *
 * `verb` and `past` are both stated rather than derived, because "sold/sell"
 * and "planted/plant" do not come off one another by any rule worth writing,
 * and a sentence that reads wrong is a question a pupil has to decode twice.
 */
const COUNTED_REVERSE: {
  who: string; they: string; verb: string; past: string;
  unit: string; band: [number, number];
}[] = [
  { who: 'A theatre group', they: 'they', verb: 'sell', past: 'sold', unit: 'tickets', band: [800, 9000] },
  { who: 'A charity', they: 'it', verb: 'deliver', past: 'delivered', unit: 'food parcels', band: [400, 6000] },
  { who: 'A bakery', they: 'it', verb: 'bake', past: 'baked', unit: 'loaves', band: [200, 4000] },
  { who: 'A council', they: 'it', verb: 'plant', past: 'planted', unit: 'trees', band: [300, 5000] },
  { who: 'A cinema', they: 'it', verb: 'sell', past: 'sold', unit: 'tickets', band: [600, 8000] },
  { who: 'A ferry company', they: 'it', verb: 'carry', past: 'carried', unit: 'passengers', band: [2000, 40000] },
  { who: 'A publisher', they: 'they', verb: 'print', past: 'printed', unit: 'books', band: [1000, 20000] },
  { who: 'A garden centre', they: 'it', verb: 'sell', past: 'sold', unit: 'plants', band: [400, 6000] },
  { who: 'A recycling centre', they: 'it', verb: 'collect', past: 'collected', unit: 'bottles', band: [2000, 30000] },
  { who: 'A football club', they: 'it', verb: 'sell', past: 'sold', unit: 'season tickets', band: [500, 9000] },
];

export const REVERSE_CONTEXTS: ReverseContext[] = [
  // reductions — three ways of saying the same thing, over fifteen items
  ...SALE_ITEMS.flatMap(([item, lo, hi]): ReverseContext[] => [
    { up: false, subject: `the ${item}`, band: [lo, hi], lines: (shown, rate) => [
      `In a sale, all prices are reduced by ${rate}%.`,
      `${article(item) === 'a' ? 'A' : 'An'} ${item} costs ${shown} in the sale.`,
      `Calculate the price of the ${item} before the sale.`] },
    { up: false, subject: `the ${item}`, band: [lo, hi], lines: (shown, rate) => [
      `A shop reduces the price of ${article(item)} ${item} by ${rate}%.`,
      `It now costs ${shown}.`,
      `Calculate the price of the ${item} before the reduction.`] },
    { up: false, subject: `the ${item}`, band: [lo, hi], lines: (shown, rate) => [
      `${article(item) === 'a' ? 'A' : 'An'} ${item} is advertised at ${shown} after a ${rate}% discount.`,
      `Calculate its original price.`] },
  ]),
  // increases
  ...RISE_SUBJECTS.flatMap(([thing, opening, lo, hi]): ReverseContext[] => [
    { up: true, subject: `the ${thing}`, band: [lo, hi], lines: (shown, rate) => [
      opening.replace('R', `${rate}`),
      `It is now ${shown}.`,
      `Calculate what it was before the increase.`] },
    { up: true, subject: `the ${thing}`, band: [lo, hi], lines: (shown, rate) => [
      `After an increase of ${rate}%, ${article(thing)} ${thing} is ${shown}.`,
      `Calculate what it was before the increase.`] },
  ]),
  // Counted rather than priced — the shape of 2017 P2 Q5.
  ...COUNTED_REVERSE.flatMap((c): ReverseContext[] => [
    { up: true, subject: `the ${c.unit}`, counted: c.unit, band: c.band, lines: (shown, rate) => [
      `${c.who} ${c.past} ${shown} ${c.unit} this year.`,
      `This was ${rate}% more than ${c.they} ${c.past} last year.`,
      `How many ${c.unit} did ${c.they} ${c.verb} last year?`] },
    { up: false, subject: `the ${c.unit}`, counted: c.unit, band: c.band, lines: (shown, rate) => [
      `${c.who} ${c.past} ${shown} ${c.unit} this year.`,
      `This was ${rate}% fewer than ${c.they} ${c.past} last year.`,
      `How many ${c.unit} did ${c.they} ${c.verb} last year?`] },
  ]),
];

// ── growth stated between two calendar years ──────────────────────────────

/**
 * 2019 P2 Q1 and 2025 P2 Q1, whose own wording is the point.
 *
 * Its own bank rather than the asset openings, because those already carry a
 * time — "A library lent out 45 000 books last year" — and bolting a date onto
 * that gives "last year in 2019". Both papers are counted quantities rather
 * than money, so these are too.
 */
export interface BetweenYearsContext {
  /** The opening, given the starting figure and the year it belongs to. */
  opening: (start: string, year: number) => string;
  /** eg "emergency packages" — what the answer is counted in. */
  unit: string;
  /** How the question asks for the later figure, given the year. */
  ask: (year: number) => string;
  band: [number, number];
}

export const BETWEEN_YEARS_CONTEXTS: BetweenYearsContext[] = [
  { unit: 'meals', band: [20000, 200000],
    opening: (s, y) => `A community kitchen served ${s} meals during ${y}.`,
    ask: y => `Calculate how many meals the kitchen expects to serve in ${y}.` },
  { unit: 'visitors', band: [40000, 400000],
    opening: (s, y) => `The number of visitors to a zoo in ${y} was ${s}.`,
    ask: y => `Calculate the expected number of visitors in ${y}.` },
  { unit: 'passengers', band: [50000, 900000],
    opening: (s, y) => `An airport handled ${s} passengers in ${y}.`,
    ask: y => `Calculate the number of passengers the airport expects to handle in ${y}.` },
  { unit: 'members', band: [2000, 40000],
    opening: (s, y) => `A sports club had ${s} members in ${y}.`,
    ask: y => `Calculate the expected number of members in ${y}.` },
  { unit: 'trees', band: [5000, 90000],
    opening: (s, y) => `A forest contained ${s} trees in ${y}.`,
    ask: y => `Calculate the expected number of trees in ${y}.` },
  { unit: 'households', band: [3000, 60000],
    opening: (s, y) => `${s} households in a region had solar panels in ${y}.`,
    ask: y => `Calculate how many households are expected to have solar panels in ${y}.` },
  { unit: 'meals', band: [10000, 150000],
    opening: (s, y) => `A community kitchen served ${s} meals in ${y}.`,
    ask: y => `Calculate how many meals it expects to serve in ${y}.` },
  { unit: 'journeys', band: [80000, 900000],
    opening: (s, y) => `A bike hire scheme recorded ${s} journeys in ${y}.`,
    ask: y => `Calculate the number of journeys expected in ${y}.` },
  { unit: 'puffins', band: [1000, 30000],
    opening: (s, y) => `A puffin colony on an island numbered ${s} in ${y}.`,
    ask: y => `Calculate the expected size of the colony in ${y}.` },
  { unit: 'megawatt hours', band: [20000, 300000],
    opening: (s, y) => `A wind farm generated ${s} megawatt hours in ${y}.`,
    ask: y => `Calculate how many megawatt hours it expects to generate in ${y}.` },
];

// ── a part stated as a percentage of a total, find the total ──────────────

/**
 * 2014 P1 Q9 and 2026 P1 Q2, which are not reverse percentages in the usual
 * sense: nothing went up or down. A quantity simply *is* a percentage of a
 * whole, and the whole is wanted.
 *
 * The distinction matters to the working, not just the wording. The usual
 * reverse question's first mark is for seeing that the figure given is
 * (100 ± r)% of the original; here it is for seeing that the figure given is
 * r% flat. A pupil who reaches for 100 + r has misread it.
 */
export interface PartOfWholeContext {
  /** The sentences, given the part as it prints and the percentage. */
  lines: (part: string, pct: number) => string[];
  /** The word the answer is counted in — "tickets", "miles", "pupils". */
  unit: string;
  /** Plausible range for the *whole*. */
  band: [number, number];
}

const PART_OF_WHOLE: { lines: (p: string, r: number) => string[]; unit: string; band: [number, number] }[] = [
  { unit: 'tickets', band: [20000, 900000], lines: (p, r) => [
    `${p} tickets were sold for a music festival last summer.`,
    `That was ${r}% of all the tickets on sale.`,
    `Calculate how many tickets were on sale for the festival altogether.`] },
  { unit: 'miles', band: [120, 480], lines: (p, r) => [
    `The fuel gauge on a delivery van shows there is enough fuel left to drive ${p} miles.`,
    `The tank is ${r}% full.`,
    `Calculate the number of miles the van can drive on a full tank.`] },
  { unit: 'pupils', band: [400, 1600], lines: (p, r) => [
    `${p} pupils at a school walk or cycle to school.`,
    `This is ${r}% of all the pupils at the school.`,
    `Calculate the total number of pupils at the school.`] },
  { unit: 'seats', band: [500, 20000], lines: (p, r) => [
    `${p} seats were filled at a concert.`,
    `This represents ${r}% of the seats in the arena.`,
    `Calculate the total number of seats in the arena.`] },
  { unit: 'members', band: [200, 4000], lines: (p, r) => [
    `${p} members of a sports club renewed their membership.`,
    `This is ${r}% of the club's members.`,
    `Calculate the total number of members of the club.`] },
  { unit: 'litres', band: [500, 9000], lines: (p, r) => [
    `A water tank contains ${p} litres.`,
    `The tank is ${r}% full.`,
    `Calculate how many litres the tank holds when it is full.`] },
  { unit: 'books', band: [1000, 40000], lines: (p, r) => [
    `${p} of the books in a library are on loan.`,
    `This is ${r}% of all the books the library owns.`,
    `Calculate the total number of books the library owns.`] },
  { unit: 'kilometres', band: [80, 900], lines: (p, r) => [
    `A cyclist has ridden ${p} kilometres of a long-distance route.`,
    `This is ${r}% of the whole route.`,
    `Calculate the total length of the route.`] },
  { unit: 'people', band: [2000, 60000], lines: (p, r) => [
    `${p} people in a town said they recycle their food waste.`,
    `This represents ${r}% of the people surveyed.`,
    `Calculate how many people were surveyed.`] },
  { unit: 'trees', band: [500, 12000], lines: (p, r) => [
    `${p} of the trees in a wood are Scots pine.`,
    `This is ${r}% of all the trees in the wood.`,
    `Calculate the total number of trees in the wood.`] },
];

export const PART_OF_WHOLE_CONTEXTS: PartOfWholeContext[] = PART_OF_WHOLE;

// ── a surcharge on a bill: how much extra was paid ────────────────────────

/**
 * 2019 P2 Q9. A reverse percentage that stops one step short of the usual
 * answer: having recovered the original bill, the question wants the
 * *difference*, so the number the pupil divides to is not the number they
 * write down. The scheme's third mark is for the difference, not the bill.
 */
export interface SurchargeContext {
  /** The sentences, given the total paid as it prints and the rate. */
  lines: (total: string, rate: number) => string[];
  /** How the question phrases what it wants. */
  ask: string;
  /**
   * Plausible range for the bill before the charge.
   *
   * The same reason the reverse contexts carry one: a 7.5% out-of-hours callout
   * on a plumbing bill of 7,000 pounds is arithmetically fine and obviously
   * wrong on the page.
   */
  band: [number, number];
}

export const SURCHARGE_CONTEXTS: SurchargeContext[] = [
  { band: [400, 2400], ask: 'Calculate how much she would have saved by settling the bill on time.',
    lines: (t, r) => [`Marta had her boiler serviced.`,
      `Because she settled the bill late, ${r}% was added to it.`,
      `In total she paid ${t}.`] },
  { band: [300, 900], ask: 'Calculate how much he would have saved by paying on time.',
    lines: (t, r) => [`Raj paid his car insurance late.`,
      `A late payment charge of ${r}% was added.`,
      `He paid a total of ${t}.`] },
  { band: [40, 400], ask: 'Calculate how much of this was the booking fee.',
    lines: (t, r) => [`A booking fee of ${r}% is added to every online ticket order.`,
      `An order came to ${t} in total.`] },
  { band: [60, 300], ask: 'Calculate how much of this was the service charge.',
    lines: (t, r) => [`A restaurant adds a service charge of ${r}% to every bill.`,
      `A table paid ${t} altogether.`] },
  { band: [30, 250], ask: 'Calculate how much extra the express delivery cost.',
    lines: (t, r) => [`An online shop charges an extra ${r}% for express delivery.`,
      `An order with express delivery came to ${t}.`] },
  { band: [40, 350], ask: 'Calculate how much of this was the card fee.',
    lines: (t, r) => [`A ticket agency adds a card fee of ${r}% to every purchase.`,
      `A customer paid ${t} in total.`] },
  { band: [100, 600], ask: 'Calculate how much she would have saved by hiring during the week.',
    lines: (t, r) => [`A hall costs an extra ${r}% to hire at the weekend.`,
      `Nadia paid ${t} to hire it on a Saturday.`] },
  { band: [80, 500], ask: 'Calculate how much of this was the callout charge.',
    lines: (t, r) => [`A plumber adds ${r}% to a bill for an out-of-hours callout.`,
      `A customer was charged ${t} in total.`] },
  { band: [150, 800], ask: 'Calculate how much extra the insurance cost.',
    lines: (t, r) => [`Hiring a van costs an extra ${r}% if insurance is included.`,
      `A hire with insurance cost ${t}.`] },
  { band: [60, 400], ask: 'Calculate how much of this was the deposit charge.',
    lines: (t, r) => [`A campsite adds a ${r}% deposit charge to every booking.`,
      `A booking cost ${t} altogether.`] },
];

// ── percentage change: a countable that rose or fell ──────────────────────

export interface ChangeContext {
  /** eg "The number of members of a club rose from 250 to 300." */
  line: (from: string, to: string, up: boolean) => string;
}

const CHANGE_SUBJECTS: [string, string][] = [
  ['the number of members of a club', 'members'],
  ['the number of pupils at a school', 'pupils'],
  ['the number of daily bus passengers', 'passengers'],
  ['the number of trees in a wood', 'trees'],
  ['the number of visitors to a museum each week', 'visitors'],
  ['the number of books borrowed from a library each month', 'books'],
  ['the number of birds counted in a garden survey', 'birds'],
  ['the number of season tickets sold by a football club', 'tickets'],
  ['the number of houses in a village', 'houses'],
  ['the number of allotments in use in a town', 'allotments'],
  ['the number of cyclists using a bridge each day', 'cyclists'],
  ['the number of people attending a weekly market', 'people'],
];

export const CHANGE_CONTEXTS: ChangeContext[] = CHANGE_SUBJECTS.flatMap(
  ([subject]): ChangeContext[] => [
    { line: (a, b, up) => `${subject[0].toUpperCase()}${subject.slice(1)} ${up ? 'rose' : 'fell'} from ${a} to ${b}.` },
    { line: (a, b, up) => `Over one year, ${subject} ${up ? 'increased' : 'decreased'} from ${a} to ${b}.` },
  ],
);

// ── two amounts added together, the answer carrying its units ─────────────

export interface SumContext {
  setup: (a: string, b: string) => string;
  ask: string;
  unit: string;
}

export const SUM_CONTEXTS: SumContext[] = [
  { setup: (a, b) => `Nadia cycled ${a} miles to the canal and then cycled a further ${b} miles to the station.`,
    ask: 'Calculate the total distance Nadia cycled.', unit: 'miles' },
  { setup: (a, b) => `A joiner cuts ${a} metres from a plank, then cuts a further ${b} metres.`,
    ask: 'Calculate the total length cut from the plank.', unit: 'metres' },
  { setup: (a, b) => `A recipe uses ${a} cups of flour for the base and ${b} cups for the topping.`,
    ask: 'Calculate the total amount of flour used.', unit: 'cups' },
  { setup: (a, b) => `On Monday a runner ran ${a} kilometres and on Tuesday she ran ${b} kilometres.`,
    ask: 'Calculate the total distance she ran.', unit: 'kilometres' },
  { setup: (a, b) => `A painter uses ${a} litres of paint on the walls and ${b} litres on the ceiling.`,
    ask: 'Calculate the total amount of paint used.', unit: 'litres' },
  { setup: (a, b) => `A gardener digs over ${a} square metres of a plot before lunch and ${b} square metres after.`,
    ask: 'Calculate the total area dug over.', unit: 'square metres' },
  { setup: (a, b) => `A lorry carries ${a} tonnes of sand on its first trip and ${b} tonnes on its second.`,
    ask: 'Calculate the total weight carried.', unit: 'tonnes' },
  { setup: (a, b) => `A tailor uses ${a} metres of cloth for a coat and ${b} metres for a waistcoat.`,
    ask: 'Calculate the total length of cloth used.', unit: 'metres' },
  { setup: (a, b) => `A cyclist rides for ${a} hours in the morning and ${b} hours in the afternoon.`,
    ask: 'Calculate the total time spent cycling.', unit: 'hours' },
  { setup: (a, b) => `A baker uses ${a} kilograms of sugar on Friday and ${b} kilograms on Saturday.`,
    ask: 'Calculate the total amount of sugar used.', unit: 'kilograms' },
  { setup: (a, b) => `A plumber uses ${a} metres of copper pipe upstairs and ${b} metres downstairs.`,
    ask: 'Calculate the total length of pipe used.', unit: 'metres' },
  { setup: (a, b) => `A hillwalker climbs ${a} kilometres to a bothy and a further ${b} kilometres to the summit.`,
    ask: 'Calculate the total distance climbed.', unit: 'kilometres' },
  { setup: (a, b) => `A decorator papers ${a} rolls of wallpaper in one room and ${b} rolls in another.`,
    ask: 'Calculate the total number of rolls used.', unit: 'rolls' },
  { setup: (a, b) => `A farmer spreads ${a} tonnes of feed in one field and ${b} tonnes in a second field.`,
    ask: 'Calculate the total weight of feed spread.', unit: 'tonnes' },
  { setup: (a, b) => `A swimmer covers ${a} kilometres in a morning session and ${b} kilometres in the evening.`,
    ask: 'Calculate the total distance swum.', unit: 'kilometres' },
  { setup: (a, b) => `A knitter uses ${a} balls of wool for a jumper and ${b} balls for a hat.`,
    ask: 'Calculate the total number of balls of wool used.', unit: 'balls of wool' },
  { setup: (a, b) => `A driver uses ${a} litres of fuel on the outward journey and ${b} litres coming home.`,
    ask: 'Calculate the total amount of fuel used.', unit: 'litres' },
  { setup: (a, b) => `A builder mixes ${a} bags of cement on the first day and ${b} bags on the second.`,
    ask: 'Calculate the total number of bags used.', unit: 'bags' },
  { setup: (a, b) => `A jam maker uses ${a} kilograms of fruit for a first batch and ${b} kilograms for a second.`,
    ask: 'Calculate the total weight of fruit used.', unit: 'kilograms' },
  { setup: (a, b) => `A rower covers ${a} kilometres upstream and ${b} kilometres back down.`,
    ask: 'Calculate the total distance rowed.', unit: 'kilometres' },
];

// ── two people buying two kinds of thing ─────────────────────────────────

export interface TwoItemContext {
  people: [string, string];
  plural: [string, string];
  single: [string, string];
  verb: string;
  total: string;
  kind: 'money' | 'kg' | 'm2';
  vars: [string, string];
  asks: string;
  /** Plausible value for one of the dearer item, in pence / kg / tenths of m^2. */
  band: [number, number];
}

const buys = (
  people: [string, string], plural: [string, string], single: [string, string],
  kind: TwoItemContext['kind'], vars: [string, string], band: [number, number],
  verb = 'buys',
): TwoItemContext => ({
  people, plural, single, verb,
  total: kind === 'money' ? 'The total cost is'
    : kind === 'kg' ? 'The total weight is' : 'The total amount of material used was',
  kind, vars, band,
  asks: kind === 'money'
    ? `the cost of one ${single[0]} and the cost of one ${single[1]}`
    : kind === 'kg'
      ? `the weight of one ${single[0]} and the weight of one ${single[1]}`
      : `the amount of material used for one ${single[0]} and for one ${single[1]}`,
});

export const TWO_ITEM_CONTEXTS: TwoItemContext[] = [
  buys(['Moira', 'Sami'], ['mangoes', 'apples'], ['mango', 'apple'], 'money', ['m', 'a'], [40, 180]),
  buys(['Bill', 'Ben'], ['adult tickets', 'child tickets'], ['adult ticket', 'child ticket'], 'money', ['a', 'c'], [900, 2400]),
  buys(['Aisha', 'Craig'], ['notebooks', 'pens'], ['notebook', 'pen'], 'money', ['n', 'p'], [120, 450]),
  buys(['Rhona', 'Douglas'], ['bags of compost', 'trays of seedlings'], ['bag of compost', 'tray of seedlings'], 'money', ['c', 's'], [250, 800]),
  buys(['Iona', 'Fraser'], ['cinema tickets', 'tubs of popcorn'], ['cinema ticket', 'tub of popcorn'], 'money', ['t', 'p'], [700, 1400]),
  buys(['Nadia', 'Tom'], ['bus passes', 'tram passes'], ['bus pass', 'tram pass'], 'money', ['b', 't'], [400, 1600]),
  buys(['Erin', 'Callum'], ['boxes of tiles', 'tubs of grout'], ['box of tiles', 'tub of grout'], 'money', ['b', 'g'], [800, 2200]),
  buys(['Priya', 'Jack'], ['coffees', 'scones'], ['coffee', 'scone'], 'money', ['c', 's'], [180, 400]),
  buys(['Hamish', 'Leah'], ['rolls of turf', 'bags of sand'], ['roll of turf', 'bag of sand'], 'money', ['t', 's'], [300, 900]),
  buys(['Ravi', 'Shona'], ['theatre tickets', 'programmes'], ['theatre ticket', 'programme'], 'money', ['t', 'p'], [1200, 3500]),
  buys(['Kirsty', 'Owen'], ['punnets of raspberries', 'punnets of blueberries'], ['punnet of raspberries', 'punnet of blueberries'], 'money', ['r', 'b'], [150, 400]),
  buys(['Struan', 'Beth'], ['train tickets', 'bike reservations'], ['train ticket', 'bike reservation'], 'money', ['t', 'b'], [1500, 4000]),
  buys(['Ewan', 'Morag'], ['sacks of plaster', 'sacks of grit'], ['sack of plaster', 'sack of grit'], 'kg', ['p', 'g'], [12, 40], 'bought'),
  buys(['Callum', 'Nadia'], ['pallets of bricks', 'pallets of roof tiles'], ['pallet of bricks', 'pallet of roof tiles'], 'kg', ['b', 'r'], [90, 300], 'has'),
  buys(['Marta', 'Angus'], ['crates of apples', 'crates of pears'], ['crate of apples', 'crate of pears'], 'kg', ['a', 'p'], [8, 25], 'loaded'),
  buys(['Lewis', 'Freya'], ['sacks of potatoes', 'sacks of carrots'], ['sack of potatoes', 'sack of carrots'], 'kg', ['p', 'c'], [10, 30], 'lifted'),
  buys(['Yusuf', 'Elaine'], ['bales of straw', 'bales of hay'], ['bale of straw', 'bale of hay'], 'kg', ['s', 'h'], [15, 45], 'stacked'),
  buys(['Ailsa', 'Grant'], ['barrels of oats', 'barrels of barley'], ['barrel of oats', 'barrel of barley'], 'kg', ['o', 'b'], [20, 60], 'weighed'),
  buys(['Charlie', 'Priya'], ['cloaks', 'dresses'], ['cloak', 'dress'], 'm2', ['c', 'd'], [12, 30], 'made'),
  buys(['Niamh', 'Ross'], ['banners', 'flags'], ['banner', 'flag'], 'm2', ['b', 'f'], [14, 34], 'made'),
  buys(['Sana', 'Duncan'], ['curtains', 'cushion covers'], ['curtain', 'cushion cover'], 'm2', ['c', 'k'], [16, 36], 'made'),
  buys(['Eilidh', 'Marcus'], ['tents', 'awnings'], ['tent', 'awning'], 'm2', ['t', 'a'], [18, 40], 'made'),
];

// ── a sample of measurements, and a second group to compare it with ──────
//
// Every Comparing Data Sets question names a group and a quantity, and the
// comparison marks require both back in the answer — 2023 P1 Q9(b) accepts
// "on average the newspaper readers' ages are higher" and rejects "on average
// the ages are higher". So a context has to carry the two group names and the
// quantity separately, not just an opening sentence.

export interface DataContext {
  /** What was measured — "ages", "midday temperatures", "waiting times". */
  quantity: string;
  /** "in years", "in minutes", or empty where the quantity needs no unit. */
  inUnits: string;
  /** Written before each value: "£" for money, otherwise empty. */
  prefix: string;
  /** Written after a single value in prose: "years", "kg", or empty. */
  unit: string;
  /** The two groups being compared. */
  groupA: string;
  groupB: string;
  /** How the first sample is introduced, given how many values there are. */
  lead: (n: number) => string;
  /** Plausible range for a single measurement. */
  band: [number, number];
}

const data = (
  quantity: string, inUnits: string, unit: string, prefix: string,
  groupA: string, groupB: string, lead: (n: number) => string,
  band: [number, number],
): DataContext => ({ quantity, inUnits, unit, prefix, groupA, groupB, lead, band });

export const DATA_CONTEXTS: DataContext[] = [
  data('ages', 'in years', 'years', '', 'the magazine readers', 'the newspaper readers',
    n => `A magazine company surveyed the ages of its readers. The ages, in years, of a sample of ${n} readers are shown.`, [28, 60]),
  data('times', 'in minutes', 'minutes', '', 'class 4A', 'class 4B',
    n => `${n} pupils in class 4A recorded how long, in minutes, it took them to walk to school.`, [4, 26]),
  data('midday temperatures', 'in °C', '°C', '', 'Grantford', 'Aberdour',
    n => `The midday temperature in Grantford was recorded over ${n} days.`, [2, 17]),
  data('press-up counts', '', '', '', 'the athletics squad', 'the swimming squad',
    n => `Every member of an athletics squad was timed doing as many press-ups as they could in one minute. The counts for the ${n} members were:`, [18, 36]),
  data('weights', 'in kilograms', 'kilograms', '', 'the university squad', 'the college squad',
    n => `The weights, in kilograms, of ${n} rowers in a university squad are shown.`, [86, 112]),
  data('prices', 'in pounds', '', '£', 'the bicycles in the shop', 'the bicycles sold online',
    n => `The prices, in pounds (£), of ${n} bicycles on sale at a market stall are listed below.`, [150, 265]),
  data('waiting times', 'in minutes', 'minutes', '', 'the first provider', 'the second provider',
    n => `Jack called his internet provider on ${n} occasions and noted how long, in minutes, he waited before speaking to an adviser.`, [4, 26]),
  data('daily call totals', '', '', '', 'the first week', 'the second week',
    n => `The number of calls received by a police control room was recorded over ${n} days.`, [190, 270]),
  data('heights', 'in centimetres', 'centimetres', '', 'the first plot', 'the second plot',
    n => `The heights, in centimetres, of ${n} sunflowers grown in one plot are shown.`, [140, 205]),
  data('daily rainfall totals', 'in millimetres', 'millimetres', '', 'Oban', 'Dundee',
    n => `The daily rainfall in Oban, in millimetres, was recorded over ${n} days.`, [0, 26]),
  data('journey times', 'in minutes', 'minutes', '', 'the morning bus', 'the evening bus',
    n => `The journey time, in minutes, of the morning bus was recorded on ${n} days.`, [20, 52]),
  data('reaction times', 'in hundredths of a second', 'hundredths of a second', '', 'the left hand', 'the right hand',
    n => `${n} pupils measured their reaction time, in hundredths of a second, using their left hand.`, [15, 42]),
  data('marks', '', 'marks', '', 'paper 1', 'paper 2',
    n => `The marks scored by ${n} pupils in paper 1 are shown.`, [30, 92]),
  data('masses', 'in grams', 'grams', '', 'the first orchard', 'the second orchard',
    n => `The masses, in grams, of ${n} apples picked in one orchard are shown.`, [90, 185]),
  data('daily visitor numbers', '', 'visitors', '', 'the first museum', 'the second museum',
    n => `The number of visitors to a museum was recorded on ${n} days.`, [60, 210]),
  data('wind speeds', 'in miles per hour', 'miles per hour', '', 'the first headland', 'the second headland',
    n => `The wind speed, in miles per hour, was recorded at a headland on ${n} days.`, [5, 46]),
  data('hours of sunshine', '', 'hours', '', 'May', 'June',
    n => `The number of hours of sunshine was recorded on ${n} days in May.`, [2, 15]),
  data('lengths', 'in centimetres', 'centimetres', '', 'the first loch', 'the second loch',
    n => `The lengths, in centimetres, of ${n} trout caught in one loch are shown.`, [20, 46]),
  data('prices', 'in pounds', '', '£', 'the first showroom', 'the second showroom',
    n => `The prices, in pounds (£), of ${n} guitars in one showroom are listed below.`, [200, 620]),
  data('weekly egg totals', '', 'eggs', '', 'the first flock', 'the second flock',
    n => `The number of eggs laid each week by a flock of hens was recorded over ${n} weeks.`, [150, 330]),
  data('distances', 'in metres', 'metres', '', 'the under-16s', 'the under-18s',
    n => `The distances, in metres, thrown by ${n} athletes in the under-16 competition are shown.`, [15, 46]),
  data('times', 'in seconds', 'seconds', '', 'the adults', 'the children',
    n => `${n} adults were timed, in seconds, completing a puzzle.`, [40, 165]),
  data('pulse rates', 'in beats per minute', 'beats per minute', '', 'the resting group', 'the exercising group',
    n => `The pulse rate, in beats per minute, of ${n} people was measured at rest.`, [55, 95]),
  data('ratings', '', '', '', 'the first museum', 'the second museum',
    n => `Visitors to a museum were asked to score their visit out of 6. The scores given by ${n} visitors were:`, [1, 6]),
];

// ── something going round, whose height follows a cosine ─────────────────
//
// 2017 P2 Q15 (a wind turbine blade), 2023 P2 Q11 (the hour hand of a
// grandfather clock) and 2025 P2 Q14 (a theme park ride) are the same question
// three ways: a height h = B ± A cos x°, then either evaluate it, find its
// extremes, or solve for x.

export interface RotatingContext {
  /** "A wind turbine has three blades." */
  scene: string;
  /** "the tip of blade A" */
  thing: string;
  /** What x measures: "the angle the blade has turned through". */
  angle: string;
  unit: string;
  /** Plausible centre height and swing, in the unit above. */
  centre: [number, number];
  swing: [number, number];
}

export const ROTATING_CONTEXTS: RotatingContext[] = [
  { scene: 'A wind pump at a water treatment works has four vanes.', thing: 'the tip of vane P',
    angle: 'the angle the vanes have turned through', unit: 'metres',
    centre: [30, 55], swing: [12, 26] },
  { scene: 'A station waiting room has a long-case clock on the wall.', thing: 'the tip of the minute hand',
    angle: 'the angle the minute hand has turned through since the hour', unit: 'centimetres',
    centre: [120, 165], swing: [12, 28] },
  { scene: 'A quarry conveyor lifts its buckets round a large wheel.', thing: 'bucket A',
    angle: 'the angle the wheel has turned through', unit: 'metres',
    centre: [8, 16], swing: [5, 9] },
  { scene: 'A big wheel at a fair carries sixteen capsules.', thing: 'capsule 1',
    angle: 'the angle the wheel has turned through', unit: 'metres',
    centre: [16, 32], swing: [12, 26] },
  { scene: 'A water wheel at a mill has buckets around its rim.', thing: 'one bucket',
    angle: 'the angle the wheel has turned through', unit: 'metres',
    centre: [3, 7], swing: [2, 5] },
  { scene: 'A carousel horse moves up and down as the carousel turns.', thing: 'the horse',
    angle: 'the angle the carousel has turned through', unit: 'centimetres',
    centre: [95, 140], swing: [20, 40] },
  { scene: 'A windmill has four sails.', thing: 'the tip of one sail',
    angle: 'the angle the sail has turned through', unit: 'metres',
    centre: [9, 18], swing: [5, 11] },
  { scene: 'A pedal on an exercise bike turns in a circle.', thing: 'the pedal',
    angle: 'the angle the pedal has turned through', unit: 'centimetres',
    centre: [24, 40], swing: [12, 20] },
  { scene: 'A crane has a counterweight fixed to a rotating jib.', thing: 'the counterweight',
    angle: 'the angle the jib has turned through', unit: 'metres',
    centre: [14, 26], swing: [6, 12] },
  { scene: 'A cable car system runs on a continuous loop.', thing: 'cabin B',
    angle: 'the angle the drive wheel has turned through', unit: 'metres',
    centre: [20, 38], swing: [10, 18] },
  { scene: 'A fairground swing boat rocks back and forward.', thing: 'the front seat',
    angle: 'the angle the boat has swung through', unit: 'metres',
    centre: [4, 9], swing: [2, 4] },
  { scene: 'A paddle steamer has a paddle wheel on each side.', thing: 'one paddle',
    angle: 'the angle the paddle wheel has turned through', unit: 'metres',
    centre: [2, 5], swing: [1, 3] },
  { scene: 'A vertical wind pump drives a rod up and down.', thing: 'the top of the rod',
    angle: 'the angle the crank has turned through', unit: 'centimetres',
    centre: [80, 130], swing: [25, 45] },
  { scene: 'A clock in a station has a second hand.', thing: 'the tip of the second hand',
    angle: 'the angle the second hand has rotated through', unit: 'centimetres',
    centre: [200, 260], swing: [15, 30] },
  { scene: 'A rotating advertising sign turns above a shop.', thing: 'the top corner of the sign',
    angle: 'the angle the sign has turned through', unit: 'metres',
    centre: [5, 10], swing: [2, 4] },
  { scene: 'A ski lift carries chairs on a continuous cable.', thing: 'chair 12',
    angle: 'the angle the drive wheel has turned through', unit: 'metres',
    centre: [12, 24], swing: [6, 11] },
];

// ── very large or very small quantities ──────────────────────────────────
//
// All five scientific-notation questions are set in a context and use one of
// three operations. Each context belongs to exactly one, because the sentence
// only makes sense for that operation:
//
//   divide    12 g of pollen containing 1.5x10^9 grains — weight of one grain
//   multiply  250 hectares at 1.22x10^6 ants per hectare — ants in the colony
//   percent   a poppy seed is 8% of the weight of a sesame seed

export interface SciContext {
  op: 'divide' | 'multiply' | 'percent';
  /** The scene, given the two printed quantities. */
  lines: (a: string, b: string) => string[];
  /** The unit the answer carries, or empty for a pure count. */
  unit: string;
  /** Sensible magnitude for the quantity written in scientific notation. */
  exponent: [number, number];
  /**
   * Range for the *plain* quantity in the sentence. It has to suit the thing
   * being described — a first draft gave a drop of blood a volume of 678 litres,
   * which divides perfectly well and is nonsense on the page.
   */
  first: [number, number];
}

export const SCI_CONTEXTS: SciContext[] = [
  // ── a total shared out ───────────────────────────────────────────────
  { op: 'divide', unit: 'grams', exponent: [7, 11], first: [8, 60], lines: (a, b) => [
    `A dust sample weighs ${a} grams and is made up of ${b} particles.`,
    `Calculate the weight of one dust particle in grams.`] },
  { op: 'divide', unit: '', exponent: [-26, -21], first: [50, 500], lines: (a, b) => [
    `The mass of an argon atom is ${b} grams. A sealed cylinder holds ${a} grams of argon.`,
    `Calculate the number of argon atoms in the cylinder.`] },
  { op: 'divide', unit: 'grams', exponent: [7, 10], first: [40, 900], lines: (a, b) => [
    `A jar holds ${a} grams of salt made up of ${b} crystals.`,
    `Calculate the mass of one salt crystal in grams.`] },
  { op: 'divide', unit: 'litres', exponent: [23, 26], first: [2, 40], lines: (a, b) => [
    `A tank holds ${a} litres of water containing ${b} molecules.`,
    // "per molecule" would read as a multiplying question — every other divide
    // context avoids "per" and "each", which is what lets a marker (and the
    // check) tell the two apart from the wording alone
    `Calculate the volume of water taken up by one molecule, in litres.`] },
  { op: 'divide', unit: 'grams', exponent: [4, 6], first: [500, 9000], lines: (a, b) => [
    `A sack of rice weighs ${a} grams and holds ${b} grains.`,
    `Calculate the weight of one grain of rice in grams.`] },
  { op: 'divide', unit: '', exponent: [-9, -7], first: [5, 400], lines: (a, b) => [
    `One red blood cell has a volume of ${b} millilitres. A blood sample has a volume of ${a} millilitres.`,
    `Calculate the number of red blood cells in the sample.`] },
  { op: 'divide', unit: 'metres', exponent: [4, 7], first: [800, 9000], lines: (a, b) => [
    `A reel holds ${a} metres of fibre optic cable made from ${b} strands laid end to end.`,
    `Calculate the length of one strand in metres.`] },
  { op: 'divide', unit: '', exponent: [-9, -7], first: [4, 60], lines: (a, b) => [
    `A single grain of sand weighs ${b} kilograms. A bucket holds ${a} kilograms of sand.`,
    `Calculate the number of grains of sand in the bucket.`] },

  // ── so many of something, each of that size ──────────────────────────
  { op: 'multiply', unit: '', exponent: [5, 8], first: [20, 900], lines: (a, b) => [
    `A reservoir holds ${a} litres of water. Each litre contains an average of ${b} bacteria.`,
    `Calculate the number of bacteria in the reservoir.`] },
  { op: 'multiply', unit: '', exponent: [8, 11], first: [50, 900], lines: (a, b) => [
    `A galaxy cluster contains ${a} galaxies, each with an average of ${b} stars.`,
    `Calculate the number of stars in the cluster.`] },
  { op: 'multiply', unit: '', exponent: [6, 10], first: [200, 9000], lines: (a, b) => [
    `A factory produces ${a} microchips, each carrying ${b} transistors.`,
    `Calculate the total number of transistors produced.`] },
  { op: 'multiply', unit: '', exponent: [17, 21], first: [50, 800], lines: (a, b) => [
    `A tablet contains ${a} milligrams of a compound, and each milligram holds ${b} molecules.`,
    `Calculate the number of molecules in the tablet.`] },
  { op: 'multiply', unit: '', exponent: [4, 8], first: [20, 900], lines: (a, b) => [
    `A cloud covers ${a} square kilometres and holds an average of ${b} droplets per square kilometre.`,
    `Calculate the number of droplets in the cloud.`] },
  { op: 'multiply', unit: 'bytes', exponent: [9, 13], first: [200, 9000], lines: (a, b) => [
    `A data centre has ${a} drives, each storing ${b} bytes.`,
    `Calculate the total storage in bytes.`] },
  { op: 'multiply', unit: 'metres', exponent: [-9, -6], first: [200, 9000], lines: (a, b) => [
    `A film is built from ${a} layers, each of thickness ${b} metres.`,
    `Calculate the total thickness of the film in metres.`] },
  { op: 'multiply', unit: '', exponent: [4, 7], first: [20, 400], lines: (a, b) => [
    `A hive has ${a} combs, each holding ${b} cells.`,
    `Calculate the number of cells in the hive.`] },

  // ── a percentage of a very large or very small quantity ──────────────
  { op: 'percent', unit: 'kilograms', exponent: [-8, -4], first: [0, 0], lines: (a, b) => [
    `A grain of rice weighs ${a} kilograms. The weight of a grain of quinoa is ${b} of the weight of a grain of rice.`,
    `Calculate the weight of a grain of quinoa in kilograms.`] },
  { op: 'percent', unit: 'grams', exponent: [-24, -20], first: [0, 0], lines: (a, b) => [
    `The mass of one atom of lead is ${a} grams. The mass of an atom of silicon is ${b} of the mass of an atom of lead.`,
    `Calculate the mass of one atom of silicon in grams.`] },
  { op: 'percent', unit: '', exponent: [6, 10], first: [0, 0], lines: (a, b) => [
    `A country has ${a} trees. In one year ${b} of them are felled.`,
    `Calculate the number of trees felled.`] },
  { op: 'percent', unit: 'litres', exponent: [9, 13], first: [0, 0], lines: (a, b) => [
    `A reservoir holds ${a} litres. Evaporation removes ${b} of the water in a month.`,
    `Calculate the volume of water lost in litres.`] },
  { op: 'percent', unit: 'metres', exponent: [-7, -4], first: [0, 0], lines: (a, b) => [
    `A human hair has a diameter of ${a} metres. A spider silk thread is ${b} of that diameter.`,
    `Calculate the diameter of the spider silk in metres.`] },
  { op: 'percent', unit: '', exponent: [5, 9], first: [0, 0], lines: (a, b) => [
    `A city has ${a} households. ${b} of them have solar panels.`,
    `Calculate the number of households with solar panels.`] },
  { op: 'percent', unit: 'tonnes', exponent: [6, 10], first: [0, 0], lines: (a, b) => [
    `A country produces ${a} tonnes of waste each year. ${b} of it is recycled.`,
    `Calculate the weight of waste recycled in tonnes.`] },
  { op: 'percent', unit: 'grams', exponent: [-20, -16], first: [0, 0], lines: (a, b) => [
    `A virus particle has a mass of ${a} grams. A protein on its surface is ${b} of that mass.`,
    `Calculate the mass of the protein in grams.`] },
];

export { pick as pickContext };

// ── a right-angled triangle in a situation — Pythagoras ──────────────────
//
// The paper questions are never a bare triangle: a ladder against a wall, a
// support wire, a diagonal across a rectangular field. The scene names the
// vertices, so the diagram's labels and the question's wording use the same
// letters — which is what lets the check confirm the two agree.
//
// Placeholders are positional, {0} {1} {2}, and substituted globally. Naming
// them after letters and replacing "%A" with String.replace was wrong twice
// over: replace with a string argument only changes the first occurrence, so
// "the wall {2}{0}" kept its placeholder, and the scheme broke entirely for a
// context whose vertices are P, Q, R.

export interface PythagorasContext {
  vertices: [string, string, string];
  /** The situation. {0} is the right angle, {1} and {2} the other vertices. */
  scene: (v: [string, string, string]) => string;
  /** What is asked for, given whether the unknown is the hypotenuse. */
  asks: (findHyp: boolean, v: [string, string, string]) => string;
  unit: string;
  /** The letter used for the unknown side. */
  unknown: string;
  /**
   * Whether the prose fixes which way up the triangle goes.
   *
   * "leans against a vertical wall", "rises from level ground", "due north" —
   * all of those are contradicted by a picture showing the wall lying flat, and
   * no geometric check can notice, because the geometry is identical. Contexts
   * that describe a shape rather than a situation ("a rectangular field has a
   * corner at D") are free to turn any way.
   *
   *   free      any of the four quarter turns
   *   upright   the second leg points up, the first runs right
   *   mirrored  the second leg points up, the first runs left
   */
  layout: 'free' | 'upright' | 'mirrored';
}

const fill = (tpl: string, v: [string, string, string]): string =>
  tpl.replace(/\{0\}/g, v[0]).replace(/\{1\}/g, v[1]).replace(/\{2\}/g, v[2]);

const rt = (
  vertices: [string, string, string], scene: string,
  hypName: string, legName: string, unit: string,
  layout: PythagorasContext['layout'], unknown = 'x',
): PythagorasContext => ({
  vertices,
  scene: v => fill(scene, v),
  asks: (findHyp, v) => fill(findHyp ? hypName : legName, v),
  unit, unknown, layout,
});

export const PYTHAGORAS_CONTEXTS: PythagorasContext[] = [
  rt(['C', 'A', 'B'], 'A ladder {1}{2} leans against a vertical wall {2}{0}, with its foot at {1} on level ground.',
     'the ladder {1}{2}', 'the wall {2}{0}', 'metres', 'upright'),
  rt(['R', 'P', 'Q'], 'A support wire {1}{2} runs from the top of a vertical mast {2}{0} to a point {1} on the ground.',
     'the wire {1}{2}', 'the mast {2}{0}', 'metres', 'upright'),
  rt(['D', 'E', 'F'], 'A rectangular field has a corner at {0}. {0}{1} runs along one edge and {0}{2} along the other.',
     'the diagonal {1}{2}', 'the edge {0}{2}', 'metres', 'free'),
  rt(['N', 'L', 'M'], 'A ramp {1}{2} rises from level ground at {1} to a loading bay at {2}, directly above {0}.',
     'the ramp {1}{2}', 'the height {2}{0}', 'metres', 'upright'),
  rt(['C', 'A', 'B'], 'A television screen is measured across its diagonal {1}{2}. {1}{0} is its width and {2}{0} its height.',
     'the diagonal {1}{2}', 'the height {2}{0}', 'inches', 'upright'),
  rt(['S', 'R', 'T'], 'A yacht sails from {1} due east to {0}, then due north to {2}.',
     'the direct distance {1}{2}', 'the northward leg {0}{2}', 'kilometres', 'mirrored'),
  rt(['G', 'H', 'K'], 'A gate is braced by a diagonal strut {1}{2} across a rectangular frame with a corner at {0}.',
     'the strut {1}{2}', 'the side {0}{2}', 'centimetres', 'free'),
  rt(['O', 'P', 'Q'], 'A slide {1}{2} runs from a platform at {2} down to the ground at {1}, with the platform directly above {0}.',
     'the slide {1}{2}', 'the platform height {2}{0}', 'metres', 'upright'),
  rt(['W', 'U', 'V'], 'A tent pole {2}{0} stands vertically, with a guy rope {1}{2} pegged to the ground at {1}.',
     'the guy rope {1}{2}', 'the pole {2}{0}', 'metres', 'upright'),
  rt(['Z', 'X', 'Y'], 'A path {1}{2} cuts diagonally across a rectangular park, from {1} to {2}, with a corner at {0}.',
     'the path {1}{2}', 'the side {2}{0}', 'metres', 'free'),
  rt(['C', 'A', 'B'], 'A picture frame is checked for square. {1}{0} and {2}{0} are the two sides meeting at the corner {0}.',
     'the diagonal {1}{2}', 'the side {2}{0}', 'centimetres', 'free'),
  rt(['J', 'H', 'I'], 'A cable car runs on a straight cable {1}{2} from a station at {1} up to a peak at {2}, directly above {0}.',
     'the cable {1}{2}', 'the height {2}{0}', 'metres', 'upright'),
];

// ── a circular segment in a situation — the chord questions ──────────────
//
// Every one of the eight is an object that happens to be part of a circle: a
// tunnel cross-section, a paving slab, a perfume label, a door sign. The word
// the question uses for the answer changes with the object — height for a
// tunnel, width for a slab — so the context carries it.

export interface ChordContext {
  /** The scene, given the centre and the two ends of the chord. */
  scene: (o: string, a: string, b: string) => string;
  /** "the height of the tunnel", "the width of the paving slab". */
  asks: string;
  /** The larger piece of the circle, or the smaller. */
  major: boolean;
  /**
   * Draw the piece **below** the chord rather than above it.
   *
   * 2015 P2 Q12 is a container of liquid: the surface is the chord and the
   * liquid sits under it, with the depth measured downwards. Same arithmetic,
   * mirrored picture — and until `circleChord` grew a flip this paper was
   * cited and not clonable.
   */
  flip?: boolean;
  unit: string;
  /** Plausible radius, in the unit above. */
  band: [number, number];
}

export const CHORD_CONTEXTS: ChordContext[] = [
  { scene: (o, a, b) => `A road culvert has a circular cross-section with a flat concrete base. The centre of the circle is ${o} and the base is the chord ${a}${b}.`,
    asks: 'the height of the culvert', major: true, unit: 'metres', band: [3, 9] },
  // 2015 P2 Q12's shape: the piece being asked about hangs *below* its chord.
  { scene: (o, a, b) => `A cylindrical tank lies on its side. On the circular end, centre ${o}, the surface of the oil inside is the chord ${a}${b}.`,
    asks: 'the depth of the oil', major: true, flip: true, unit: 'metres', band: [2, 6] },
  { scene: (o, a, b) => `A water trough has a circular cross-section with centre ${o}. The surface of the water is the chord ${a}${b}.`,
    asks: 'the depth of the water', major: false, flip: true, unit: 'centimetres', band: [30, 80] },
  { scene: (o, a, b) => `A stone doorstep is part of a circle with centre ${o}. The straight edge of the step is the chord ${a}${b}.`,
    asks: 'the width of the doorstep', major: false, unit: 'centimetres', band: [30, 90] },
  { scene: (o, a, b) => `A jam jar has a sticker in the shape of part of a circle, centre ${o}, with straight edge ${a}${b}.`,
    asks: 'the height of the sticker', major: true, unit: 'centimetres', band: [5, 14] },
  { scene: (o, a, b) => `A window is made from part of a circle with centre ${o}, resting on a horizontal sill ${a}${b}.`,
    asks: 'the height of the window', major: true, unit: 'metres', band: [1, 4] },
  { scene: (o, a, b) => `A wooden shelf bracket is cut as part of a circle with centre ${o}. Its straight edge is ${a}${b}.`,
    asks: 'the depth of the bracket', major: false, unit: 'centimetres', band: [12, 40] },
  { scene: (o, a, b) => `A stone archway over a doorway is part of a circle with centre ${o}. The doorway is the chord ${a}${b}.`,
    asks: 'the height of the archway', major: true, unit: 'metres', band: [1, 5] },
  { scene: (o, a, b) => `A logo is part of a circle with centre ${o}, sitting on the line ${a}${b}.`,
    asks: 'the height of the logo', major: true, unit: 'centimetres', band: [8, 30] },
  // Deliberately not a liquid. `circleChord` always draws the segment of
  // interest *above* the chord, and a liquid fills from the bottom — so "a
  // channel filled to the level MN, calculate the depth of the water" drew the
  // water sitting on top of its own surface. The maths was right and the
  // picture was upside down.
  //
  // 2015 P2 Q12 is that exact question, and the paper draws it the other way
  // up: a full circle, the milk level ML near the top, the milk shaded below
  // it, the depth bracketed down the right-hand side. Cloning that shape needs
  // `circleChord` to be able to flip, which it cannot yet — recorded in
  // docs/PLAN.md rather than bodged here.
  { scene: (o, a, b) => `A speed bump has a cross-section that is part of a circle with centre ${o}, sitting on the road ${a}${b}.`,
    asks: 'the height of the speed bump', major: false, unit: 'centimetres', band: [15, 60] },
  { scene: (o, a, b) => `A biscuit is cut from a circular sheet of dough, centre ${o}, along the straight edge ${a}${b}.`,
    asks: 'the width of the biscuit', major: false, unit: 'centimetres', band: [4, 12] },
  { scene: (o, a, b) => `The end of a fuel tank is part of a circle with centre ${o}, welded to a flat base ${a}${b}.`,
    asks: 'the height of the tank end', major: true, unit: 'metres', band: [1, 4] },
  { scene: (o, a, b) => `A bridge arch is part of a circle with centre ${o}, spanning the river along ${a}${b}.`,
    asks: 'the height of the arch', major: false, unit: 'metres', band: [8, 30] },
  { scene: (o, a, b) => `A name badge is part of a circle with centre ${o}, with a straight bottom edge ${a}${b}.`,
    asks: 'the height of the badge', major: false, unit: 'centimetres', band: [4, 14] },
];

// ── three distances, and is the corner square? — the converse ────────────
//
// 2014 P2 Q6 (three towns), 2017 P2 Q7 (two triangles joined), 2019 P2 Q11
// (a jet-ski course), 2023 P2 Q8 (a beam against a wall). 2026 P2 Q7 asks it
// with no context and no diagram at all.
//
// The answer is "yes" about as often as "no", and the numbers are always close
// to a triple either way, so it cannot be settled by eye.

export interface ConverseContext {
  /** The scene, given the three vertex names. */
  scene: (a: string, b: string, c: string) => string;
  /** The question, given the vertex at the corner being tested. */
  asks: (corner: string, a: string, b: string, c: string) => string;
  unit: string;
  band: [number, number];
}

export const CONVERSE_CONTEXTS: ConverseContext[] = [
  { scene: (a, b, c) => `The diagram shows the positions of three towns ${a}, ${b} and ${c}.`,
    asks: (k, a, b, c) => `Determine whether the angle at ${k} is a right angle. Justify your answer.`,
    unit: 'kilometres', band: [30, 160] },
  { scene: (a, b, c) => `The course for a jet-ski race is marked by buoys at ${a}, ${b} and ${c}.`,
    asks: (k) => `Determine whether the course turns through a right angle at ${k}. Justify your answer.`,
    unit: 'metres', band: [200, 900] },
  { scene: (a, b, c) => `A wooden prop ${a}${b} braces a fence panel standing on horizontal ground. ${c} is where the panel meets the ground.`,
    asks: (k) => `Determine whether the beam meets the ground at right angles at ${k}. Justify your answer.`,
    unit: 'metres', band: [4, 20] },
  { scene: (a, b, c) => `A triangular garden bed has corners at ${a}, ${b} and ${c}.`,
    asks: (k) => `Determine whether the corner at ${k} is a right angle. Justify your answer.`,
    unit: 'metres', band: [3, 18] },
  { scene: (a, b, c) => `A surveyor measures the three sides of a triangular field ${a}${b}${c}.`,
    asks: (k) => `Determine whether the field has a right angle at ${k}. Justify your answer.`,
    unit: 'metres', band: [20, 140] },
  { scene: (a, b, c) => `A sail is cut in the shape of triangle ${a}${b}${c}.`,
    asks: (k) => `Determine whether the sail has a right angle at ${k}. Justify your answer.`,
    unit: 'centimetres', band: [40, 200] },
  { scene: (a, b, c) => `Three mobile phone masts stand at ${a}, ${b} and ${c}.`,
    asks: (k) => `Determine whether the angle at ${k} is a right angle. Justify your answer.`,
    unit: 'kilometres', band: [5, 40] },
  { scene: (a, b, c) => `A gate is braced by a strut, forming triangle ${a}${b}${c}.`,
    asks: (k) => `Determine whether the strut meets the frame at right angles at ${k}. Justify your answer.`,
    unit: 'centimetres', band: [30, 150] },
  { scene: (a, b, c) => `A picture frame is checked by measuring triangle ${a}${b}${c} across one corner.`,
    asks: (k) => `Determine whether the frame is square at ${k}. Justify your answer.`,
    unit: 'centimetres', band: [15, 90] },
  { scene: (a, b, c) => `A walker records the distances between three summits ${a}, ${b} and ${c}.`,
    asks: (k) => `Determine whether the angle at ${k} is a right angle. Justify your answer.`,
    unit: 'kilometres', band: [3, 25] },
];

// ── something long inside a box — the space diagonal ─────────────────────
//
// 2018 P2 Q16 is an umbrella in a locker: does it fit? 2022 P2 Q11 asks for the
// length of the diagonal outright. Both need two applications of Pythagoras —
// the face diagonal first, then the space diagonal — which is what the four
// marks are for.

export interface BoxContext {
  /** The box, given its three dimensions already written out. */
  scene: (l: string, b: string, h: string) => string;
  /** Asks for the diagonal outright. */
  asks: string;
  /** Asks whether a given object fits, and what that object is. */
  fits: { object: string; asks: (len: string) => string } | null;
  unit: string;
  band: [number, number];
}

export const BOX_CONTEXTS: BoxContext[] = [
  { scene: (l, b, h) => `A locker is a cuboid with internal length ${l}, breadth ${b} and height ${h}.`,
    asks: 'the length of the longest straight rod that will fit inside the locker',
    fits: { object: 'umbrella', asks: len => `An umbrella is ${len} long. Determine whether it will fit inside the locker. Justify your answer.` },
    unit: 'centimetres', band: [30, 90] },
  { scene: (l, b, h) => `A packing crate is a cuboid measuring ${l} by ${b} by ${h}.`,
    asks: 'the length of the longest pole that will fit inside the crate',
    fits: { object: 'pole', asks: len => `A pole is ${len} long. Determine whether it will fit inside the crate. Justify your answer.` },
    unit: 'centimetres', band: [40, 120] },
  { scene: (l, b, h) => `A shipping container is a cuboid ${l} long, ${b} wide and ${h} high.`,
    asks: 'the length of the longest girder that will fit inside the container',
    fits: { object: 'girder', asks: len => `A girder is ${len} long. Determine whether it will fit inside the container. Justify your answer.` },
    unit: 'metres', band: [3, 14] },
  { scene: (l, b, h) => `A fish tank is a cuboid of length ${l}, breadth ${b} and height ${h}.`,
    asks: 'the length of the diagonal from one bottom corner to the opposite top corner',
    fits: null, unit: 'centimetres', band: [30, 110] },
  { scene: (l, b, h) => `A cardboard box measures ${l} by ${b} by ${h}.`,
    asks: 'the length of the longest knitting needle that will lie flat inside the box',
    fits: { object: 'knitting needle', asks: len => `A knitting needle is ${len} long. Determine whether it will fit inside the box. Justify your answer.` },
    unit: 'centimetres', band: [15, 60] },
  { scene: (l, b, h) => `A storage room is a cuboid ${l} long, ${b} wide and ${h} high.`,
    asks: 'the length of the longest ladder that will fit in the room',
    fits: { object: 'ladder', asks: len => `A ladder is ${len} long. Determine whether it will fit in the room. Justify your answer.` },
    unit: 'metres', band: [2, 9] },
  { scene: (l, b, h) => `A display case is a cuboid measuring ${l} by ${b} by ${h}.`,
    asks: 'the length of the diagonal of the case',
    fits: null, unit: 'centimetres', band: [20, 90] },
  { scene: (l, b, h) => `A greenhouse frame is a cuboid ${l} long, ${b} deep and ${h} high.`,
    asks: 'the length of the longest brace that will fit inside the frame',
    fits: { object: 'brace', asks: len => `A brace is ${len} long. Determine whether it will fit inside the frame. Justify your answer.` },
    unit: 'metres', band: [2, 8] },
];

// ── navigation, for the bearings questions ─────────────────────────────────
/**
 * Three positions on a map, with letters for them.
 *
 * The papers set these two ways: lettered points with a sentence saying what
 * they are ("A, B and C represent three checkpoints"), or named places with the
 * letters as initials ("P, Q and R represent Portlee, Queenstown and Rushton").
 * `refer` carries whichever is used in the rest of the question, so the same
 * template covers both.
 */
export interface BearingContext {
  letters: [string, string, string];
  /** The opening sentence. {0}{1}{2} are the letters. */
  intro: string;
  /** How each point is named in the rest of the question. */
  refer: [string, string, string];
  unit: 'kilometres' | 'metres';
  short: 'km' | 'm';
  band: [number, number];
}

const bc = (
  letters: [string, string, string], intro: string, refer: [string, string, string],
  unit: 'kilometres' | 'metres', band: [number, number],
): BearingContext => ({ letters, intro, refer, unit, short: unit === 'metres' ? 'm' : 'km', band });

export const BEARING_CONTEXTS: BearingContext[] = [
  bc(['A', 'B', 'C'], 'In the diagram {0}, {1} and {2} represent three markers on a mountain-bike trail.',
     ['A', 'B', 'C'], 'metres', [150, 480]),
  bc(['A', 'B', 'C'], 'A sailing course is marked out by three turning marks at {0}, {1} and {2} in the diagram below.',
     ['A', 'B', 'C'], 'kilometres', [5, 16]),
  bc(['G', 'H', 'J'], 'In the diagram below {0}, {1} and {2} represent the positions of Glenmore, Hartfield and Jedburn respectively.',
     ['Glenmore', 'Hartfield', 'Jedburn'], 'kilometres', [14, 42]),
  bc(['L', 'T', 'C'], 'A lifeboat at {0} and a tug at {1} are both making for a broken-down cargo ship at {2}.',
     ['the lifeboat', 'the tug', 'the cargo ship'], 'kilometres', [4, 13]),
  bc(['K', 'L', 'M'], 'In the diagram below {0}, {1} and {2} represent the positions of Kilbrae, Larkhill and Monkston respectively.',
     ['Kilbrae', 'Larkhill', 'Monkston'], 'kilometres', [9, 34]),
  bc(['L', 'M', 'N'], 'The points {0}, {1} and {2} represent three lighthouses along a stretch of coast.',
     ['L', 'M', 'N'], 'kilometres', [8, 28]),
  bc(['A', 'B', 'C'], 'In the diagram {0}, {1} and {2} represent three airfields.',
     ['A', 'B', 'C'], 'kilometres', [22, 65]),
  bc(['S', 'T', 'U'], 'A hillwalker plans a route over three summits, shown as {0}, {1} and {2} on the map below.',
     ['S', 'T', 'U'], 'kilometres', [3, 11]),
  bc(['G', 'H', 'K'], 'The points {0}, {1} and {2} show the positions of three oil rigs in the North Sea.',
     ['G', 'H', 'K'], 'kilometres', [11, 33]),
  bc(['W', 'X', 'Z'], 'Three wind turbines stand at {0}, {1} and {2} on a level moor.',
     ['W', 'X', 'Z'], 'metres', [220, 700]),
  bc(['B', 'C', 'D'], 'In the diagram {0}, {1} and {2} represent three coastguard stations.',
     ['B', 'C', 'D'], 'kilometres', [6, 22]),
  bc(['J', 'K', 'L'], 'On a rally stage, {0}, {1} and {2} are the positions of three control points.',
     ['J', 'K', 'L'], 'kilometres', [5, 19]),
  bc(['A', 'C', 'H'], 'A mountain rescue team is called out. On the diagram {0} is the team base, {1} is the casualty and {2} is the helicopter.',
     ['the base', 'the casualty', 'the helicopter'], 'kilometres', [2, 10]),
  bc(['V', 'W', 'Y'], 'The points {0}, {1} and {2} represent three villages on a moor.',
     ['V', 'W', 'Y'], 'kilometres', [9, 31]),
  bc(['M', 'N', 'P'], 'Three radio masts stand at {0}, {1} and {2}.',
     ['M', 'N', 'P'], 'metres', [320, 950]),
  bc(['R', 'S', 'T'], 'A surveyor places markers at {0}, {1} and {2} on level ground.',
     ['R', 'S', 'T'], 'metres', [110, 470]),
  bc(['A', 'B', 'C'], 'In the diagram {0}, {1} and {2} represent three harbours.',
     ['A', 'B', 'C'], 'kilometres', [12, 38]),
  bc(['E', 'F', 'G'], 'A drone is flown between three landing pads at {0}, {1} and {2}.',
     ['E', 'F', 'G'], 'metres', [130, 520]),
];
