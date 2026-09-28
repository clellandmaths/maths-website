# Navigation and signposting

What the site has, how someone finds it, and where they do not. Written
2026-09-14, alongside the generator work, because that work kept running into
things nobody could reach.

**This is a report, not a work queue.** It is written down so the decision to
act or not act is made deliberately, once, by someone looking at the whole list
— the same rule `responsive.md` follows, and the same reason: a finding acted on
the moment it is found is a change nobody asked for.

Nothing here was changed when it was written. **Two findings have since been
acted on** — both because they blocked work that was asked for, and both marked
where they appear. Everything else stands as reported.

Every claim below was verified against the source or the built output on
2026-09-14, not remembered.

---

## Review of 2026-09-28: findings and recommendations (not acted on)

The owner: "I get a general feeling that site seems off that getting to where
you want to go sometimes doesn't feel intuitive." They are testing `dev` and
will decide what to implement later. Measured in the built site at 1400px and
400px.

**Why it feels off: two navigation systems at once.**

- Each course has three tabs (Course Notes, Practice, Past Paper Archive), but
  the Topic Explorer and the Exam Hall sit in the top nav as if site-wide. Each
  uses whichever course was last visited (`localStorage.preferredCourse`) and
  has no course tabs. So stepping into either leaves the course.
- A course is chosen in four places, which lead to different pages: the nav
  dropdown, the home cards and the footer go to the archive, and the
  Explorer's "Change Course" opens its own picker ("Launch Explorer").
- The course's front page is the archive: on N5, 22 rows of five buttons, 158
  clickable elements. On a phone each paper is about a screen tall. The home
  cards list "Guided practice", "Worksheet builder" and "Whole course revision
  marathon", and none of them is a link.
- The navbar never marks where you are, and the breadcrumbs are still
  inconsistent (see below).

**Hover and cursor**, by forcing `:hover` on every visible control on 14 pages
(scratch `nav/hover.mjs`):

- **Every `<button>` has the arrow cursor**, not the pointer: 90 on
  `/course/n5`, 23 on `/explorer`. Links have the pointer. Tailwind 4 dropped
  the pointer default for buttons, and nothing restores it.
- **Focus Mode on every course page has no hover** (80 buttons over five
  courses): `bg-muted-hover hover:bg-muted-hover`.
- Everything else changes on hover, except the current page's own tab, which
  is correct.

**Recommended, in order:**

1. **Quick fixes:** the pointer cursor on buttons site-wide; Focus Mode's hover;
   the nav marks the current section; consistent breadcrumbs; the "Browse
   Questions" label on phones.
2. **A course hub (the owner's idea).** `/course/[id]` becomes one page with
   everything for that course as cards: Notes, Practice, Past Papers, Topic
   Explorer and worksheets, Exam Hall (countdown, warm-up, marathon,
   checklists), Formulae, and the course's extras. Inside a course, one course
   bar on every page (the Explorer and Exam Hall included): the course name with
   a switcher, then Hub, Notes, Practice, Past Papers, Topic Explorer and Exam
   Hall, with the current page marked. "Change course" keeps you on the same
   page in the new course. The archive moves to its own tab.

   **The Topic Explorer stays in the top nav** (the owner, 2026-09-28: "I also
   think explorer shouldn't be hidden from nav bar"). It is what teachers come
   for, and hiding it would add a click for them. The fault was never that it
   is in the nav, only that it silently picks a course. So:
   - the top nav is Courses, Topic Explorer, Exam Hall, Academy and Connect,
     with the logo as Home (the separate Home link goes);
   - from the nav, the Explorer opens the course last used, or asks which
     course if there is none (as its picker does today);
   - once open, it shows the same course bar as the rest of that course, with a
     switcher that stays in the Explorer;
   - the Exam Hall is treated the same way.

   So the Explorer is reached from the top nav and from the course bar, and
   both land on the same page.

   **No address changes.** `/course/[id]`, `/explorer`, `/exam-hall`, the paper,
   notes and practice pages, and `/worksheet` links all keep working. The only
   new address is `/course/[id]/papers`, which has no page today. Before
   merging, a link check confirms that every address in the live build (the
   sitemap, internal links and redirect targets) still resolves.
3. **A calmer archive:** one or two main actions per paper, the rest under
   "More", and compact rows on a phone.
4. **The Explorer's first screen**, reached from a course, shows that course's
   papers or topics, not an empty state.

**Building, on the branch `navigation` (off `hint-quality`, 2026-09-28).** The
owner: "let's do this on another new branch… I can easily just not merge it
until happy". It merges after `hint-quality`, on the owner's word only.

- Done: 1 (the quick fixes; the nav marks the current section, and has no Home
  link because the logo is Home) and 2 (the course hub at `/course/[id]`, the
  archive at `/course/[id]/papers`, `CourseBar` on every course page, the
  Explorer and the Exam Hall included). The Exam Hall reads `?c=`. The phone
  menu lists the courses first.
- Checked: full build (the archive now loads Full screen, Focus Mode and the
  video player when first opened, so it is lighter than the old course page);
  every internal link in the build resolves (22,548 links, 575 addresses); the
  round trip `check-course-explorer.mjs` (rewritten for the course bar) and
  `check-explorer-generate.mjs` pass.
- **Second pass, the same day.** The owner, testing the preview: "quite a
  layout shift when in one section and you click to another such as notes to
  exam hall… it's not at all clear that it scrolls horizontally on phone and I
  think horizontal scrolling not great for users… in N5 applications if you go
  to exam hall the writing for that pill starts to get cut off". Three causes,
  all fixed:
  - **The bar jumped.** Each page drew it inside its own column: four widths
    (`max-w-3xl` to `6xl`), above the heading on some pages and below it on
    others. It is now a band directly under the header, at the header's width,
    the first thing on every course page. Measured at 375, 1024 and 1280px on
    all nine kinds of N5 Applications page: the same position and size on
    every one.
  - **The Explorer and the Exam Hall flashed a chooser.** They were
    `/explorer?c=` and `/exam-hall?c=`, read the course in an effect, and so
    drew the course chooser first and swapped the page in, with the bar
    arriving late. They are now `/course/[id]/explorer` and
    `/course/[id]/exam-hall`, built with their course (the code moved to
    `components/Explorer/ExplorerApp.tsx` and
    `components/ExamHall/ExamHallApp.tsx`). **The old addresses still work**:
    `/explorer` and `/exam-hall` are the choosers, and a script in the page
    forwards `?c=` (keeping `q=`, so shared worksheets still open) or the course
    last used before anything is drawn. The Exam Hall's countdown is now worked
    out in the browser, and its date is formatted in UK time, since the page
    is built in advance.
  - **The tabs scrolled sideways, and the fade hid the last one.** From `lg`
    (1024px) all six sections fit in one row, with the longest course name.
    Below that the bar is one button that says where you are (course, then
    section) with a visible "Menu", opening the sections and the courses as a
    list. The menus close on Escape, after a choice, and (the desktop switcher)
    on a click elsewhere (`components/MenuDismiss.tsx`).
  - So the note above ("No address changes") is now: no address **breaks**.
    Two new ones per course, and the old ones forward.
- **Notes open on the reading (the owner, the same day).** "notes should just
  open on the whole notes page with accordion at side, the page with start at
  beginning seems redundant". `/course/[id]/notes` now shows the course's first
  topic with the whole course in the accordion (`NotesReader`, shared with the
  topic pages), and names that topic's own address as canonical. The accordion's
  "All topics" link, which went to the old grid, is gone (fc02924).
- **4 is dropped (the owner, 2026-09-28).** A topic grid in front of the
  Explorer was offered and turned down: "it should just go straight to
  building a worksheet". The first screen already is that, with the filters
  beside it on a desktop and an "Open Filters" button under "Build Your
  Worksheet" on a phone.
- **3 is parked until after launch (the owner, 2026-09-28).** Proposed: group
  the archive by year with both papers side by side, Start and Video visible,
  and Focus, Browse, New paper like this and the paper page under a "⋯ More"
  menu. Not built.
- **Colour on the hub and the practice index (the owner, the same day: "a bit
  boring. Could do with some colour accents better hover").** The hub's title
  sits on the course gradient with chips (days to go, topics, papers, practice
  questions); every card carries a band of the gradient, its icon on the
  gradient, and a hover that lifts it and slides its arrow. Practice topic cards
  are white with a gradient stripe, the same lift, and a "▶ N with video" chip;
  the heading takes the course colour. White text on the gradients measured
  AA on all five (the contrast check now includes the N5 Apps hub and a
  practice index). Not yet: a sticky course bar was discussed and left.
- Found: a guided practice question on vectors linked "surd" to `/nat5/surds`,
  a maths.scot path that does not exist here. Link removed in both copies on
  the owner's word (website `dev` afa5842, app `dev` 8ba88b5). Not changed: the
  Exam Hall says "1 hours to go".

---

## The shape of the site

Five courses, and every route statically exported — 542 pages, no server
routes, no API. The chrome is a fixed navbar and a footer on every page, plus
three local devices: `Breadcrumbs`, `CourseTabs` (Course Notes / Practice / Past
Paper Archive), and two sidebars that belong to the notes and the Explorer.

| route | what it is |
|---|---|
| `/` | hero, five course covers, a question to try, a countdown |
| `/course/[courseId]` | **the past paper archive**. This is the course landing page |
| `…/notes`, `…/notes/[section]/[topic]` | the hub and 35 N5 topics |
| `…/practice`, `…/practice/[topic]` | the index and 34 N5 topics |
| `…/papers/[year]/[paper]` | 22 static N5 paper pages, fully crawlable |
| `…/generate/paper/[year]/[paper]` | a practice paper cloned from a real one, **N5 only** |
| `/explorer` | browse, filter, and build a worksheet |
| `/exam-hall` | countdown, checklists, daily warm up, marathon |
| `/worksheet` | a locked shared handout. Reached by link only, by design |

---

## What is well signposted

Worth saying first, because the rest of this document is faults.

- **The five courses** have three routes to the same page: the navbar dropdown,
  the footer, and the home page covers.
- **Notes to practice** is the best signpost on the site. Every notes topic ends
  with a card naming the practice set and its question count. It now opens the
  questions full screen and carries the way back — see
  `scripts/check-notes-to-practice.mjs`.
- **The Explorer's empty states** say what to do rather than just that there is
  nothing: *"Use the filters to find questions by topic and year. Click '+ Add'
  on any question to add it to your worksheet."*
- **`/worksheet`'s invalid-link state** names the likely cause: *"The link may
  have been cut short when it was copied — worksheet links are long."*

---

## What is hard or impossible to find

### `/course/n5/generate`: removed

**Closed, 2026-09-28.** This section reported the by-skill builder as a finished
feature with one inbound link. The owner removed it instead: "Build by skill is
too much". The page is gone, its one link in the Explorer toolbar is gone, and
`public/_redirects` sends the old address to the Explorer. The practice-paper
generator at `/course/n5/generate/paper/…` is separate and stays.

### The Explorer shows nothing until a filter is set

`hasFilters` gates the grid. A pupil arriving from the course page's
**`Practise by topic`** card — which promises practice — lands on an empty
screen with an icon. Measured: `Showing 0 questions` on arrival.

### The Explorer is called four different things

| where | what it says |
|---|---|
| navbar | `Explorer`, with a compass icon |
| footer | `Topic Explorer` |
| home hero, and its own `<h1>` | `Topic Explorer` |
| course page cross-link | `Practise by topic` |
| the generate page, after adding | "your sheet" |

Its own landing page uses a graduation-cap icon, not the compass the navbar
used to get there.

### The static paper pages are barely linked

*Unchanged, and worth re-reading now that the archive row has a fifth control:
**New Paper Like This** goes to the generated practice paper, not to the paper
page. The paper page itself is still reached only by the heading.*

22 crawlable pages carrying every question, answer and markscheme — and the only
route to them from the UI is clicking the small **`2025 Paper 1`** heading on a
course row, which sits directly above five large coloured buttons that all do
something else. Most people will never discover the heading is a link.

### The Marathon is advertised where it cannot be reached

The home page's National 5 cover lists **`Whole-course revision marathon`** as a
feature. There is no link. The thing it names is three clicks deep inside the
Exam Hall, behind a door labelled something else.

---

## Where you are, and how you get back

### Nothing in the chrome says where you are

`components/Navbar.tsx` does not call `usePathname` — verified, zero
occurrences. No nav item is ever marked active, on any page.

### ~~`/explorer` has no breadcrumb and no course identity~~ — half fixed 2026-09-15

`/explorer` now carries "Back to <course>" beside its course chip, and the
course page carries "Open the Topic Explorer" above the paper archive rather
than in a card beneath it. The name is settled at **Topic Explorer** everywhere
— the navbar said "Explorer" and the course page said "Practise by topic",
which was priority 3 on the list below. `check:roundtrip` holds all of it.

**`/exam-hall` is unchanged** and still has neither.

### `/explorer` and `/exam-hall` have no breadcrumb and no course identity

Both are client routes with no `Breadcrumbs` and no `CourseTabs`. The course
they are operating on lives in `localStorage.preferredCourse` and shows as a
small coloured chip. **After one visit to `/course/n5`, the navbar item
"Explorer" silently means "N5 Explorer" forever**, and the only thing saying so
is a `Change Course` button.

### Breadcrumbs are inconsistent where they exist

The course, notes and paper pages start `Home / National 5 Maths / …`. The two
practice pages start `National 5 Maths / …` — no `Home` crumb.

### Full-screen modes replace the page

`QuestionPresenter` and `FocusMode` are returned *instead of* the page, so the
navbar and footer disappear and the mode's own control is the only way out. That
is right for a presenter, and it is why the notes-to-practice work had to put
the way back **inside** the mode as well as on the page behind it.

---

## Sizing, cross-referenced

Two findings belong to `responsive.md` and are repeated here because they are
navigation faults as much as sizing ones:

- **The per-paper buttons are 36–38px** against a 44px minimum. There were 88 of
  them on the National 5 course page when this was measured, and the
  *New Paper Like This* link added a fifth to every National 5 row — so the
  count is worse now, not better. Nothing else about the finding changed.
- **`Browse Questions` / `Hide Questions` are `hidden sm:inline`**
  (`CoursePageClient.tsx:271,276`). `sm:` is 640px, so **no phone in portrait
  ever shows the label** — the control is a bare chevron. This is the same
  never-fires trap `responsive.md` records for text sizes, in a different guise.

---

## Two things that are correct and look like faults

Worth writing down so they are not "fixed" later.

**`/worksheet` is not in the sitemap and nothing links to it.** It is a share
target. That is the design.

**The 22 practice-paper pages are not in the sitemap either.** Their questions
are drawn in the browser after mount, so a crawler is served an empty shell.
Indexing them would be 22 pages of thin content. They are reached from the paper
they clone, which is where someone wanting one already is.

---

## If any of this is ever acted on

The order that would matter most, and the reasoning rather than the tasks:

1. **A front door for the generator.** It is finished and invisible. Everything
   else on this list is a degree of friction; this one is a feature that may as
   well not exist.
2. **The Explorer's first screen.** Landing on "nothing" from a card that
   promised practice is the worst first impression on the site.
3. **One name for the Explorer.** Four names for one tool means no one builds a
   mental model of it.
4. **The `sm:` label trap**, because it is one line and it affects every phone.

Items 3 and 4 touch all five courses. Item 1 is National 5 only today.
