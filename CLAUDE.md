# Clelland Maths - Next.js Website

## Project Overview
A modern Next.js 16 educational platform for Scottish SQA maths revision, replacing the vanilla JS app.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Lucide React icons, KaTeX (math rendering), qrcode (QR generation)

**Deployment:** Netlify auto-deploy from `clellandmaths/maths-app` GitHub repo

---

## Design System

- **Background:** Slate-950 (#020617)
- **Cards:** Slate-900 (#0f172a)
- **Borders:** Slate-800 (#1e293b)
- **Text Primary:** Slate-50 (#f8fafc)
- **Text Secondary:** Slate-400 (#94a3b8)
- **Accent:** Emerald-500 (#10b981)
- **Font:** Inter (Google Fonts, Next.js CSS variable)
- **Navbar:** Glassmorphism (backdrop-blur, semi-transparent `.glass` class)

---

## Courses (5 Total)

| ID | Name | Color | Tier |
|----|------|-------|------|
| `n5` | National 5 | Cyan | 1 (full interactive) |
| `higher` | Higher | Orange | 1 (full interactive) |
| `ah` | Advanced Higher | Purple | 2 (playlists + PDFs) |
| `n5-apps` | N5 Applications | Teal | 2 (playlists + PDFs) |
| `higher-apps` | Higher Applications | Amber | 2 (playlists + PDFs) |

### Tier System
- **Tier 1** (N5, Higher): Full interactive explorer — topic filtering, worksheet builder, presenter, focus mode, print/PDF
- **Tier 2** (AH, N5 Apps, Higher Apps): YouTube playlists + PDF past paper downloads (not yet implemented)

---

## Page Structure

| Route | Description | Status |
|-------|-------------|--------|
| `/` | Home - Hero section, course grid (5 courses), feature highlights | Complete |
| `/course/[courseId]` | Course hub - Video Library + Past Papers tabs | Placeholder |
| `/explorer` | Topic Explorer - Course gate, filters, question cards, worksheet builder | Complete |
| `/exam-hall` | Exam Hall - Warm up, checklists, countdown | Placeholder |

---

## Explorer Features (Main Feature)

### Course Selection Gate
- Explorer opens to a `CourseSelector` screen — two cards (National 5 / Higher)
- **No data loads until a course is chosen** (dynamic `import()` for performance)
- `courseConfig` object maps each course to its `label`, `topicCategories`, `topics`, `availableYears`, `loadQuestions`
- "Change Course" button in header returns to selection screen
- `WorksheetProvider key={selectedCourse}` — worksheet resets when switching courses
- **Strict course separation**: No mixing. An N5 student cannot add Higher questions to their worksheet.

### Guided Filters (NOT free-text search)
- Topic + Subtopic checkboxes (two-level hierarchy from `topicCategories` prop)
- **Topic search** input to filter the topic tree by name (auto-expands matches)
- Year filter (multi-select checkboxes, per-course year list)
- Paper filter: Paper 1 (Non-Calculator) / Paper 2 (Calculator)
- `FilterSidebar` is generic — receives `topicCategories`, `topics`, `availableYears` as props (works for any course)

### Question Cards (Browse Mode)
- **Header**: Year/Paper/Q number prominent (e.g. "2024 Paper 1 Q9"), topic chips below (max 2)
- **Text**: `text-sm` for compact scanning, no height limit
- **Images**: Small thumbnails controlled by `.question-card img` CSS (max-height 5rem, max-width 10rem)
- **Answer**: Collapsible Show/Hide toggle
- **Worksheet indicator**: Emerald ring when question is in worksheet
- No duplicate footer section (topics/Watch Solution removed from cards)

### Worksheet Builder
- **Tabs**: "Browse Questions" / "My Worksheet" (with badge count)
- **Floating action button** (bottom-right, desktop only) showing count → switches to worksheet tab
- **Reorder**: Up/down chevrons + jump to top/bottom (ChevronsUp/ChevronsDown)
- **Visual feedback**: Emerald flash animation on reorder (`card-just-moved` CSS keyframes)
- **Remove**: Individual trash icon per question
- **Clear all**: With confirmation (3-second timeout)
- **Bulk actions**: "Add all X to worksheet" / "Remove all X from worksheet" when filters active
- **Export toggles**: Show answers, show QR codes
- **Session-only** — no localStorage, resets on course change or page reload

### Presenter Mode (Full-Screen Slideshow)
- Desktop (lg+): Split layout — text left (3fr), images right (2fr)
- Images extracted from question HTML via `extractImageSrcs()` and rendered separately
- Mobile: Standard single-column layout
- Navigation: prev/next arrows, keyboard support (arrow keys, Escape)
- Show/Hide answer toggle + Watch Solution button (opens VideoModal)

### Focus Mode (Full-Screen Study)
- Scrollable linear question list (no navigation — shows all questions)
- Question number badges, year/paper/Q metadata, topic tags
- Per-question Show/Hide answer + Watch Solution
- Escape key closes, body scroll locked
- Alternative to Presenter for focused study without navigation

### PDF Export / Print
- Uses `window.print()` with `@media print` CSS — no jsPDF/html2canvas dependencies
- A4 page, 1.5cm margins, white background, dark text
- Print header: "Clelland Maths — [Course Name] Worksheet" + date + question count
- Print footer: "Clelland Maths — www.clellandmaths.com"
- Questions: white cards, border, break-inside avoid
- Toggle answers and QR codes before printing
- `.no-print` hides all UI controls; `.print-only` shows header/footer

### Mobile Explorer UX
- **Filter modal**: Full-screen overlay on mobile (`[&>aside]:w-full`), "Show X questions" done button
- **Worksheet toolbar**: Fixed bottom bar on mobile with answer/QR toggles + clear all
- **FAB**: Hidden on mobile (`hidden lg:block`) — tabs with badge handle navigation
- **Padding**: `p-4 sm:p-6 lg:p-8` matches all pages

---

## Topic Structure (Two Levels)

Topics use two-level filtering with categories for visual grouping:
```
Category → Main Topic → Subtopics
e.g., Algebra → Equations & Inequalities → [Linear equations, Simultaneous equations, ...]
```

- **N5**: 5 categories, ~30 main topics, ~100 subtopics — defined in `lib/n5-topics.ts`
- **Higher**: 11 categories, ~15 main topics, 61 subtopics — defined in `lib/higher-topics.ts`
- **Shared interface**: `TopicCategory` exported from `n5-topics.ts`, imported by both

---

## Data Files

### Location & Status
| Course | Path | Files | Years | Status |
|--------|------|-------|-------|--------|
| N5 | `src/n5/pastpapers/pastpaper-YYYY.js` | 10 | 2014-2019, 2022-2025 | Tagged |
| Higher | `src/higher/pastpapers/higherpastpaper{YYYY}.js` | 9 | 2015-2019, 2022-2025 | Tagged |

Higher also has: `src/higher/topics/` (10 topic files) and `src/higher/specials/` (prelim special)

### Data Loading
- Both courses use **async dynamic imports** (`import()`) — data only loads when a course is selected
- `getAllN5Questions()` and `getAllHigherQuestions()` in `data-loader.ts` use `Promise.all()` for parallel file loading
- `flattenPastPapers()` converts nested structure to flat `QuestionWithMetadata[]`
- `filterQuestions()` filters by subtopics, years, papers
- `getAvailableN5Years()` / `getAvailableHigherYears()` are static (no import needed)

### Question Format
```typescript
{
  question: "HTML/LaTeX formatted question",
  answer: "Answer text with LaTeX support",
  videoId: "YOUTUBE_VIDEO_ID",
  timestamp: "seconds_or_timestring",
  topics: ["Subtopic1", "Subtopic2"]
}
```

### IMPORTANT: Image Tags in Data Files
`<img>` tags in data files must be **clean** — no inline Tailwind classes:
```html
<!-- CORRECT -->
<img src="img/N5_Past_Papers/2024/2024_P1_Q8.png" alt="Graph of y=a cos bx">

<!-- WRONG — do not bake styling into data -->
<img class="mx-auto my-4 rounded-lg w-full max-w-sm h-auto" src="..." alt="...">
```

When importing data files from the old vanilla JS app, **strip all class attributes** from img tags.

---

## Image Styling Strategy

All image sizing is controlled from `globals.css` using context CSS classes — **never** from Tailwind utilities on img tags or `[&_img]:` selectors on components.

| Context | CSS Class | Max Height | Max Width |
|---------|-----------|------------|-----------|
| Browse cards | `.question-card img` | 5rem | 10rem |
| Presenter / Worksheet | `.question-content img` | 400px | 100% |
| Mobile (<768px) | `.question-content img` | 350px | 100% |
| Mobile (<480px) | `.question-content img` | 220px | 100% |
| Print | `.question-content img` | 280px | 85% |
| Presenter desktop | Extracted separately | Fills column | `object-contain` |

**Why not Tailwind utilities?** In Tailwind 4, all utilities are in `@layer utilities`. The globals.css rules are unlayered. Per CSS cascade spec, unlayered CSS always beats layered CSS.

### Lazy Loading
- **MathRenderer** injects `loading="lazy"` into all `<img>` tags via regex before setting `innerHTML` — images only download as they scroll into view
- **QuestionPresenter** explicit `<img>` JSX tags also use `loading="lazy"`
- All Explorer views are covered: browse grid, worksheet, presenter, focus mode
- **IMPORTANT for future development**: Any new page or component rendering question images MUST either use MathRenderer (handles lazy loading automatically) or add `loading="lazy"` to explicit `<img>` tags. This applies to all future courses and pages.
- Uses native browser `loading="lazy"` — no extra dependencies, graceful degradation

---

## Key Files

| File | Purpose |
|------|---------|
| `lib/n5-topics.ts` | N5 topic hierarchy + shared `TopicCategory` interface |
| `lib/higher-topics.ts` | Higher topic hierarchy (imports TopicCategory) |
| `lib/data-loader.ts` | Async dynamic imports, flatten, filter, available years per course |
| `lib/worksheet-context.tsx` | React Context: addItem, removeItem, clearAll, reorderItems, isInWorksheet |
| `components/Navbar.tsx` | Fixed glassmorphism header, desktop links, mobile hamburger |
| `components/MathRenderer.tsx` | KaTeX rendering for `$$..$$` and `\(...\)` math |
| `components/VideoModal.tsx` | Full-screen YouTube iframe embed with timestamp |
| `components/QRCodeImage.tsx` | QR code generator (qrcode package) |
| `components/Explorer/FilterSidebar.tsx` | Generic filter panel (any course via props) |
| `components/Explorer/QuestionCard.tsx` | Browse mode question card |
| `components/Explorer/QuestionPresenter.tsx` | Full-screen presentation slideshow |
| `components/Explorer/FocusMode.tsx` | Distraction-free study mode |
| `components/Explorer/WorksheetFAB.tsx` | Floating action button (desktop only) |
| `components/Explorer/WorksheetDrawer.tsx` | Slide-out worksheet panel |
| `app/explorer/page.tsx` | Explorer with course gate, async loading, all modes |
| `app/globals.css` | Image sizing, print styles, KaTeX fixes, animations |

---

## Gotchas

- **CSS layers**: In Tailwind 4, unlayered CSS in globals.css BEATS `@layer utilities`. Never use `[&_img]:` selectors to override `.question-content img` rules — use unlayered CSS classes in globals.css instead.
- **Data file img tags**: Must be clean `<img src="..." alt="...">` with no classes. Strip classes from old app data files before importing.
- **Next.js dev lock file**: Delete `.next/dev/lock` if server won't start.
- **Tailwind 4 config**: Uses `@theme` directive (CSS-based), not `tailwind.config.js`.
- **JS data files in TS project**: Need `"**/*.js"` in tsconfig `include` array.
- **KaTeX CSS**: Imported via `@import "katex/dist/katex.min.css"` in globals.css.
- **KaTeX compatibility**: N5 had 4 `eqnarray` → `aligned` conversions. Higher had zero issues.
- **Worksheet state**: Session-only (resets on course change or page reload — intentional).
- **DevTools mobile clipping**: Browser reflow quirk with sticky/fixed elements — doesn't happen on real devices.

---

## Not Yet Implemented

- Course page tabs (Video Library, Past Paper Archive) — placeholder only
- Exam Hall countdown — hardcoded, no date picker
- Checklists / progress tracking — demo only
- Tier 2 courses (AH, N5 Apps, Higher Apps) — no data loaded
- Warm Up feature (random questions)
