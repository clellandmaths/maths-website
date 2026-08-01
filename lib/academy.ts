/**
 * Clelland Maths Academy — the paid masterclasses.
 *
 * Brought in from the standalone Academy site (github.com/clellandmaths/Academy)
 * so it lives on the main domain rather than a subdomain: the free site is what
 * brings people in, and a parent who has just watched their child use it should
 * not have to cross a domain boundary to buy.
 *
 * The Stripe links are the live ones, copied across verbatim and checked
 * against the course and time they were attached to on the old page. Getting
 * one wrong charges a parent for the wrong class, so they are never
 * reconstructed or guessed.
 */

export interface AcademyCourse {
  /** Matches the site's course ids, so the page can reuse the course colours. */
  courseId: 'n5' | 'higher' | 'ah' | 'n5-apps' | 'higher-apps';
  name: string;
  day: string;
  time: string;
  /** Live Stripe payment link. */
  url: string;
  cta: string;
}

export const ACADEMY_COURSES: AcademyCourse[] = [
  {
    courseId: 'n5',
    name: 'National 5 Mathematics',
    day: 'Wednesdays',
    time: '5:00 PM',
    url: 'https://buy.stripe.com/9B63cvaQl4gD1Of8J16g805',
    cta: 'Secure National 5 Maths Seat',
  },
  {
    courseId: 'higher',
    name: 'Higher Mathematics',
    day: 'Wednesdays',
    time: '6:00 PM',
    url: 'https://buy.stripe.com/5kQ8wP7E96oL0Kb7EX6g804',
    cta: 'Secure Higher Maths Seat',
  },
  {
    courseId: 'ah',
    name: 'Advanced Higher Mathematics',
    day: 'Wednesdays',
    time: '7:00 PM',
    url: 'https://buy.stripe.com/bJe14n8Id4gD9gH7EX6g801',
    cta: 'Secure Advanced Higher Seat',
  },
  {
    courseId: 'n5-apps',
    name: 'N5 Applications of Mathematics',
    day: 'Thursdays',
    time: '6:30 PM',
    url: 'https://buy.stripe.com/3cI8wP3nT28vdwXcZh6g803',
    cta: 'Secure N5 Applications Seat',
  },
  {
    courseId: 'higher-apps',
    name: 'Higher Applications of Mathematics',
    day: 'Tuesdays',
    time: '7:30 PM',
    url: 'https://buy.stripe.com/dRm4gzaQl14r78z9N56g802',
    cta: 'Secure Higher Applications Seat',
  },
];

export const SEATS_PER_COURSE = 25;
export const TRIAL_PRICE = '£20';
export const MONTHLY_PRICE = '£86.67';

/**
 * Images the page wants but the repo does not have yet.
 *
 * Set a path here once the file is in public/img/academy/ and the slot renders
 * the picture instead of a description of the picture. Left as null the page
 * still reads correctly — a missing photo becomes a labelled gap rather than a
 * broken image icon, which is the difference between "not finished" and
 * "looks broken" on a page asking parents for money.
 */
export const ACADEMY_IMAGES: Record<string, string | null> = {
  hero: null,      // photo of David — teaching, holding an iPad, or to camera
  bbc: null,       // screenshot of the BBC article headline
  youtube: null,   // screenshot of the YouTube channel banner with subscriber count
};
