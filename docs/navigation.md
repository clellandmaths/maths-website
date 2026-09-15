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
| `…/generate` | the by-skill worksheet builder, **N5 only** |
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

### `/course/n5/generate` has one inbound link on the whole site

**Partly acted on, 2026-09-14** — it was reported here as a `text-xs`
underlined `by skill…` that appeared only once a subtopic filter was already
set, so filtering by year alone hid the only route to it. It is a styled
**Build by skill** control now, gated on the course rather than the filter, with
a title saying what is behind it. The rest of this finding stands.

It is still not in the navbar, not in the footer, not on the course page, not in
`CourseTabs`, and not in `app/sitemap.ts` — **one link, from one page**. It is a
complete page with its own explanatory copy — *"Every question is modelled on a
past paper question and checked against its marking instructions — so they are
new questions, not reprints"* — that someone who never opens the Explorer will
not meet.

**This is the largest single gap on the site**, and it is not a small fix
dressed up: it is a finished feature with no front door.

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
