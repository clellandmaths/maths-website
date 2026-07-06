# Clelland Maths - Next.js Website (CLAUDE.md)

## Project Overview
Next.js 16 educational platform for Scottish SQA maths revision.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Lucide React, KaTeX, qrcode
**Repo:** `clellandmaths/maths-website` on GitHub
**Deployment:** Cloudflare Pages — auto-deploys on push to `master`. Build: `npm run build`, output: `out/`
**Static export:** `output: 'export'` in `next.config.ts` — no server-side features. All data loaded via dynamic imports.

---

## Design System

- **Background:** Slate-950 (#020617)
- **Cards:** Slate-900 (#0f172a), borders Slate-800 (#1e293b)
- **Text Primary:** Slate-50, Secondary: Slate-400
- **Accent:** Emerald-500 (#10b981)
- **Font:** Inter (Google Fonts, CSS variable `--font-inter`)
- **Navbar:** Glassmorphism (`glass` class, `backdrop-blur`, fixed top-0)
- **Page padding:** `p-4 sm:p-6 lg:p-8`, max-width `max-w-6xl mx-auto`

---

## Courses

| ID | Name | Color | Past Papers | Course Notes | Explorer |
|----|------|-------|-------------|--------------|---------|
| `n5` | National 5 | Cyan | ✅ 10 papers | ✅ Full | ✅ |
| `higher` | Higher | Orange | ✅ 9 papers | ✅ Full | ✅ |
| `higher-apps` | Higher Applications | Amber | ❌ | ✅ Full | ❌ |
| `n5-apps` | N5 Applications | Teal | ❌ | ✅ Full | ❌ |
| `ah` | Advanced Higher | Purple | ❌ | ⚠️ Stub | ❌ |

---

## Page / Route Structure

| Route | Component | Status |
|-------|-----------|--------|
| `/` | `app/page.tsx` | ✅ Complete |
| `/course/[courseId]` | `app/course/[courseId]/CoursePageClient.tsx` | ✅ Notes + Papers |
| `/explorer` | `app/explorer/page.tsx` | ✅ N5 + Higher |
| `/exam-hall` | `app/exam-hall/page.tsx` | ⚠️ Partial |

`app/course/[courseId]/page.tsx` is a thin server wrapper with `generateStaticParams()` — it awaits params and renders `<CoursePageClient courseId={courseId} />`. Required for `output: 'export'` with dynamic routes.

---

## Course Page (`/course/[courseId]`)

Two tabs: **Course Notes** | **Past Paper Archive**

### Course Notes tab
Renders `<CourseNotes courseId={courseId} />`. Data loads dynamically on tab open.
- Desktop: sticky sidebar (260px) + content
- Mobile: slide-out overlay sidebar
- Sidebar: expandable sections → topic list, active topic in emerald
- Content: `<TopicView>` — video iframe, theory JSX, collapsible examples

### Past Paper Archive tab
Configured for `n5` and `higher` only (via `courseConfig` object in `CoursePageClient.tsx`). Shows papers grouped by year with: Watch Video, Start Paper (presenter), Focus Mode, Browse Questions buttons.

---

## Course Notes System

### Data format
Files in `src/notes/data/` export `Section[]` arrays (NOT Course objects — the loader wraps them):
```tsx
export const higherMathsData: Section[] = [
  {
    id: string,
    title: string,
    topics: [
      {
        id: string,
        title: string,
        videoUrl: string,          // YouTube embed URL or contains 'placeholder'
        theory?: React.ReactNode,  // JSX — rendered directly
        examples: [
          { id: string, question: React.ReactNode, solution: React.ReactNode }
        ]
      }
    ]
  }
]
```

### Math in notes
Use `import { InlineMath, BlockMath } from '@/src/notes/math-components'` — NOT `react-katex`.
`math-components.tsx` is a thin shim using the already-installed `katex` package. No extra dependency.

### Illustrations
Import SVG React components from `@/src/notes/illustrations`. Contains 100+ components: tree diagrams, Venn diagrams, geometry figures, graphs, etc.

### Loader (`lib/notes-loader.ts`)
`getNotesForCourse(courseId)` → dynamically imports the correct data file, wraps the `Section[]` in a `Course` object with hardcoded title/description, returns `Course | null`.

### Adding notes content
- Edit the relevant `src/notes/data/{course}Data.tsx` file
- Follow the `Section[]` export pattern
- Use `InlineMath`/`BlockMath` from `@/src/notes/math-components`
- `videoUrl: 'https://www.youtube.com/embed/placeholder'` for topics without video yet

---

## Explorer Feature (`/explorer`)

### Course Selection Gate
- Two cards: National 5 / Higher
- No data loads until a course is chosen
- `courseConfig` maps courseId → `{ label, topicCategories, topics, availableYears, loadQuestions }`
- `WorksheetProvider key={selectedCourse}` — worksheet resets on course change

### Filters (`FilterSidebar.tsx` — generic, driven by props)
- Topic hierarchy (categories → main topics → subtopics — checkboxes)
- Topic search input (auto-expands matches)
- Year filter (multi-select checkboxes)
- Paper filter (P1 / P2)

### Browse Mode
- Grid of `QuestionCard` — year/paper/Q header, topic chips, collapsible answer, Add to Worksheet
- Bulk: "Add all X" / "Remove all X" when filters active
- Active filters bar with X to remove individual filters

### Worksheet Mode
- Add/remove/reorder questions (up/down/top/bottom chevrons)
- Toggle answers + QR codes (print toggles)
- Present (full-screen `QuestionPresenter`), Focus Mode, Print/PDF
- Session-only — no localStorage, resets on course change

### Presenter Mode (`QuestionPresenter.tsx`)
- Desktop: 3fr text / 2fr images split layout
- Images extracted from question HTML via `extractImageSrcs()`
- Keyboard nav (arrow keys, Escape)

### Focus Mode (`FocusMode.tsx`)
- Scrollable linear list, all questions visible
- Per-question Show/Hide answer + Watch Solution
- Escape to close

---

## Past Paper Data

### File locations
- N5: `src/n5/pastpapers/pastpaper-YYYY.js` (10 files, 2014–2019 + 2022–2025)
- Higher: `src/higher/pastpapers/higherpastpaper{YYYY}.js` (9 files, 2015–2019 + 2022–2025)

### File format
```js
export const pastPaper2025 = {
  year: 2025,
  papers: [
    {
      paperNumber: 1,
      questions: [
        { question: 'HTML string', answer: 'HTML string', videoId: 'YT_ID', timestamp: '1:23', topics: ['Subtopic'] }
      ]
    }
  ]
}
```
- `question` and `answer` are HTML strings (may contain `$...$` for KaTeX via `MathRenderer`)
- `topics` must match subtopic strings from `lib/n5-topics.ts` or `lib/higher-topics.ts`
- Images: `<img src="/img/N5_Past_Papers/YYYY/..." alt="...">` — no inline classes

### Video metadata
Paper-level video IDs and question counts are in `lib/past-paper-videos.ts` — separate from question data. Used by the course page archive (thumbnails, Watch Video, question count).

### Data loader (`lib/data-loader.ts`)
- `getAllN5Questions()` / `getAllHigherQuestions()` — `Promise.all()` parallel import of all year files
- `flattenPastPapers()` — converts nested structure to `QuestionWithMetadata[]`
- `filterQuestions(questions, subtopics, years, papers)` — in-memory filter
- `getAvailableN5Years()` / `getAvailableHigherYears()` — static arrays (no import needed)

---

## Topic Hierarchies

### Explorer topics (`lib/n5-topics.ts`, `lib/higher-topics.ts`)
Used for past paper filtering. Fine-grained subtopic strings that match `topics[]` in question data.
```ts
interface TopicCategory {
  category: string;
  topics: Record<string, string[]>;  // mainTopic → subtopics[]
}
```
- N5: 5 categories, ~30 main topics, ~100 subtopics
- Higher: 11 categories, ~15 main topics, 61 subtopics

### Exam Hall checklists (`lib/checklist-topics.ts`)
Separate curriculum-level topic list for self-assessment. Not connected to past paper topic strings.

---

## Image Handling

### Past paper images
- Files in `public/img/N5_Past_Papers/YYYY/` and `public/img/Higher_Past_Papers/YYYY/`
- Referenced in question HTML as `<img src="/img/..." alt="...">` — no inline classes
- `MathRenderer` injects `loading="lazy"` via regex on all img tags

### Image CSS (in `app/globals.css` — unlayered, beats Tailwind utilities)
| Context | CSS Class | Max Height |
|---------|-----------|------------|
| Browse cards | `.question-card img` | 5rem |
| Presenter / Worksheet | `.question-content img` | 400px |
| Mobile <768px | `.question-content img` | 350px |
| Mobile <480px | `.question-content img` | 220px |
| Print | `.question-content img` | 280px |

**Rule:** Never use `[&_img]:` Tailwind selectors to override these — unlayered CSS always wins.

---

## Math Rendering (Two Systems)

### Past paper questions: `MathRenderer.tsx`
- Takes HTML string input, processes `$$...$$` and `\(...\)` delimiters using KaTeX
- Injects `loading="lazy"` on all img tags
- Used in: QuestionCard, QuestionPresenter, FocusMode, WorksheetDrawer

### Course notes: `src/notes/math-components.tsx`
- `<InlineMath math="..." />` and `<BlockMath math="..." />`
- Thin shim on installed `katex` package — no separate dependency
- Used inside JSX content in `src/notes/data/*.tsx` files

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `app/page.tsx` | Homepage (hero, course grid, features) |
| `app/course/[courseId]/page.tsx` | Server wrapper with `generateStaticParams` |
| `app/course/[courseId]/CoursePageClient.tsx` | Course page client — tabs, notes, papers |
| `app/explorer/page.tsx` | Full topic explorer |
| `app/exam-hall/page.tsx` | Exam countdown + checklists |
| `lib/notes-loader.ts` | `getNotesForCourse(courseId)` — dynamic import + Course wrapper |
| `lib/data-loader.ts` | Past paper loading, flattening, filtering |
| `lib/past-paper-videos.ts` | Paper-level YouTube IDs + question counts |
| `lib/n5-topics.ts` | N5 topic hierarchy + shared `TopicCategory` interface |
| `lib/higher-topics.ts` | Higher topic hierarchy |
| `lib/checklist-topics.ts` | Exam Hall curriculum checklists |
| `lib/worksheet-context.tsx` | React Context — add/remove/reorder/clear worksheet |
| `src/notes/types.ts` | Course, Section, Topic, Example interfaces |
| `src/notes/math-components.tsx` | InlineMath + BlockMath shim |
| `src/notes/illustrations.tsx` | 100+ SVG React diagram components |
| `components/Notes/CourseNotes.tsx` | Notes sidebar + topic navigation |
| `components/Notes/TopicView.tsx` | Video + theory + examples renderer |
| `components/Navbar.tsx` | Fixed glassmorphism nav |
| `components/MathRenderer.tsx` | KaTeX renderer for HTML strings |
| `components/VideoModal.tsx` | YouTube iframe with timestamp |
| `components/Explorer/FilterSidebar.tsx` | Generic filter panel |
| `components/Explorer/QuestionPresenter.tsx` | Full-screen slideshow |
| `components/Explorer/FocusMode.tsx` | Distraction-free study mode |
| `app/globals.css` | Image sizing, print styles, KaTeX CSS fixes |
| `next.config.ts` | `output: 'export'` |
| `tsconfig.json` | Excludes `node_modules`, `worksheet_generator`, `Course Notes` |

---

## Gotchas

- **Static export + dynamic routes**: `/course/[courseId]` needs `generateStaticParams()` in a server component wrapper. The client component (`CoursePageClient.tsx`) receives `courseId` as a plain prop.
- **Notes data exports `Section[]` not `Course`**: `lib/notes-loader.ts` wraps the array in a `Course` object. If adding a new data file, check the export type.
- **`react-katex` is NOT installed**: Use `@/src/notes/math-components` for `InlineMath`/`BlockMath` in notes content.
- **CSS layers**: Unlayered CSS in `globals.css` beats `@layer utilities`. Never use `[&_img]:` to override `.question-content img`.
- **`tsconfig.json` excludes**: `worksheet_generator` and `Course Notes` are excluded. Any other co-located non-Next.js projects must be added here.
- **Tailwind 4**: Uses `@theme` directive (CSS-based config), not `tailwind.config.js`.
- **KaTeX CSS**: Imported via `@import "katex/dist/katex.min.css"` in `globals.css` — do not re-import in individual files.
- **Worksheet state**: Session-only — intentional. No persistence across page reloads.
- **`output: 'export'` limits**: No API routes, no server actions, no `next/image` optimization. All data must be statically importable or client-side dynamic imports.

---

## Not Yet Implemented

- Past papers for AH, Higher Apps, N5 Apps
- Full Explorer support for AH / Higher Apps / N5 Apps
- Exam Hall countdown date picker (hardcoded date)
- Exam Hall checklists persistence (demo only)
- Advanced Higher course notes (stub exists, needs content)
- Warm Up feature (random question practice)
- User accounts / cross-device progress tracking
