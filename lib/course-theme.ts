// Per-course visual identity — mirrors the gradients on the homepage
// exam-cover cards (which mirror the live app's course buttons).
// Literal Tailwind class strings: Tailwind only generates classes it can
// see in source, so these must never be built dynamically.
//
// ## Two themes, seven fields, and only some of them care
//
// A field needs a `dark:` variant exactly when it is read **against the page**.
// `text`, `border` and `progress` sit on the page background and change with
// it. `gradient` and `bg` are surfaces carrying their own text: the button is
// the same colour on either theme, so one value serves both, and a `dark:`
// variant there would be noise pretending to be a decision.
//
// ## Every value here was measured, not picked
//
// **The gradients were failing WCAG AA on the dark site, and had been for a
// long time.** `check:contrast` found 48 nodes below AA and they were all this
// family: `text-white` on `from-cyan-600 to-blue-600` is **3.62:1** against a
// 4.5 requirement — on the exam hall, the academy, every course page, generate,
// full screen and the hint overlay, which is the site's primary call to action.
// The same mistake was already written down in `globals.css` for the brand
// magenta (*white on this magenta fails at 3.2:1*) and never generalised to
// these, because nothing measured them.
//
// 700 is the first level where white clears AA in every hue used here:
//
//     cyan-600    3.62 -> cyan-700    5.28     amber-500   2.13 -> amber-700   5.03
//     orange-600  3.58 -> orange-700  5.22     emerald-600 3.65 -> emerald-700 5.36
//     blue-600    5.25 already AA             violet-600 5.89, purple-600 5.54 already AA
//
// Higher Applications is therefore unchanged: violet and purple are dark enough
// at 600 that white already passed. Matching it to the others would have been
// consistency for its own sake, moving a colour that was not wrong.
//
// **A dark hue is not the same hue.** `text-cyan-800` is the accessible version
// of cyan on white and it does not read as cyan — it reads GREEN, because
// cyan's dark end is teal. "National 5 **Maths**" came out green while the
// gradient pill beside it looked right, which is the whole lesson: a solid
// background and a text colour are **different roles**, and Radix's scale names
// them separately for exactly this reason — steps 9-10 are solid backgrounds,
// steps 11-12 are text, and some hues are simply never one of the two.
//
// So the light accent takes the **other end of the course's own gradient**,
// where that end is a hue that survives being darkened:
//
//     n5           cyan -> blue-700      because dark cyan is teal
//     higher       orange -> red-700     because dark orange is brown
//     higher-apps  violet-700            violet stays violet
//     ah           emerald-800           AH is green; dark green is still green
//     n5-apps      amber-800             a deep amber, and the one to watch
//
// Each clears AA on the page, on a card, and on its own 15% tint — the tint is
// the tightest of the three and the reason the first attempt went to 800.
//
// **`text` at 400 cannot survive a light page, and 700 is not enough either.**
// Those levels were chosen to glow on near-black: `text-cyan-400` is 10.94:1 on
// the dark page and **1.65:1** on the light one.
//
// 700 clears AA on a plain card (5.28) and on the page (4.81), and it was the
// first answer — but `theme.text` is also read **on `theme.tint`**, which is the
// accent itself at 15% over the page, and 246 nodes landed there at 4.05 to
// 4.43. Just under, everywhere, which is the most expensive kind of just-under.
//
// Lightening the tint does not rescue it: at 8% the page-tint still only gives
// cyan-700 **4.39**. The page ground is what costs it, not the wash. 800 clears
// every context the token is used in — card, page, and tint over either:
//
//     worst case, light   cyan-800 5.53   orange-800 5.58   emerald-800 5.82
//                         amber-800 5.51  violet-800 6.60
//
// The accent is deeper in light than the dark theme's glow, which is the honest
// trade: a 400 that reads on black cannot also read on white.
//
// **The whole accent family follows the text hue in light, not just the text.**
// An outlined button is `border` + `tint` + `text` together, and leaving the
// first two on cyan while the third moved to blue put a blue label inside a
// cyan ring. In light, National 5 is blue and Higher is red throughout; the
// gradients and solid buttons stay cyan and orange, because those are surfaces
// and a surface is the role that hue was always right for.
//
// The light wash is **12%, not 15%**: `text` sits on `tint`, and red-700 on a
// 15% red tint is 4.48:1 — under by a hair. At 12% it is 4.74. All five use the
// same alpha so the washes read at one strength.
//
// `border` and `progress` are not text, so the bar is 3:1 rather than 4.5 — but
// the 500s fail even that on white (cyan-500 is 2.37), so they take 600 in light.

export interface CourseTheme {
  gradient: string;   // qualification band / primary buttons
  text: string;       // accent text (labels, numbering, active nav)
  bg: string;         // solid accent surfaces
  bgHover: string;
  tint: string;       // translucent accent wash (active nav row)
  border: string;     // accent borders (active bar, hairlines)
  progress: string;   // progress bar fill
}

export const COURSE_THEMES: Record<string, CourseTheme> = {
  n5: {
    gradient: 'from-cyan-700 to-blue-700',
    text: 'text-blue-700 dark:text-cyan-400',
    bg: 'bg-cyan-700',
    bgHover: 'hover:bg-cyan-600',
    tint: 'bg-blue-600/12 dark:bg-cyan-600/15',
    border: 'border-blue-600 dark:border-cyan-500',
    progress: 'bg-blue-600 dark:bg-cyan-500',
  },
  higher: {
    gradient: 'from-orange-700 to-red-700',
    text: 'text-red-700 dark:text-orange-400',
    bg: 'bg-orange-700',
    bgHover: 'hover:bg-orange-600',
    tint: 'bg-red-600/12 dark:bg-orange-600/15',
    border: 'border-red-600 dark:border-orange-500',
    progress: 'bg-red-600 dark:bg-orange-500',
  },
  ah: {
    gradient: 'from-emerald-700 to-teal-700',
    text: 'text-emerald-800 dark:text-emerald-400',
    bg: 'bg-emerald-700',
    bgHover: 'hover:bg-emerald-600',
    tint: 'bg-emerald-600/12 dark:bg-emerald-600/15',
    border: 'border-emerald-600 dark:border-emerald-500',
    progress: 'bg-emerald-600 dark:bg-emerald-500',
  },
  'n5-apps': {
    gradient: 'from-amber-700 to-orange-700',
    text: 'text-amber-800 dark:text-amber-400',
    bg: 'bg-amber-700',
    bgHover: 'hover:bg-amber-600',
    tint: 'bg-amber-600/12 dark:bg-amber-600/15',
    border: 'border-amber-600 dark:border-amber-500',
    progress: 'bg-amber-600 dark:bg-amber-500',
  },
  'higher-apps': {
    // Unchanged: white on violet-600 is 5.89 and on purple-600 is 5.54, both
    // already AA. See the note above about not moving a colour that was right.
    gradient: 'from-violet-600 to-purple-600',
    text: 'text-violet-700 dark:text-violet-400',
    bg: 'bg-violet-600',
    bgHover: 'hover:bg-violet-500',
    tint: 'bg-violet-600/12 dark:bg-violet-600/15',
    border: 'border-violet-600 dark:border-violet-500',
    progress: 'bg-violet-600 dark:bg-violet-500',
  },
};

export function getCourseTheme(courseId: string): CourseTheme {
  return COURSE_THEMES[courseId] ?? COURSE_THEMES.higher;
}
