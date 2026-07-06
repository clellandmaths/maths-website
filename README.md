# Clelland Maths Website

Free SQA maths revision for Scottish students — National 5 through Advanced Higher.

**Live site:** Cloudflare Pages (auto-deploys from `master`)
**Repo:** `clellandmaths/maths-website`

---

## Tech Stack

- **Next.js 16** (App Router, `output: 'export'` static site)
- **React 19**, TypeScript, Tailwind CSS 4
- **KaTeX** — LaTeX math rendering
- **Lucide React** — icons
- **Cloudflare Pages** — free static hosting

---

## Courses

| ID | Course | Past Papers | Course Notes | Explorer |
|----|--------|-------------|--------------|---------|
| `n5` | National 5 | ✅ 10 papers (2014–2025) | ✅ Full | ✅ |
| `higher` | Higher Maths | ✅ 9 papers (2015–2025) | ✅ Full | ✅ |
| `higher-apps` | Higher Applications | ❌ | ✅ Full | ❌ |
| `n5-apps` | N5 Applications | ❌ | ✅ Full | ❌ |
| `ah` | Advanced Higher | ❌ | ⚠️ Stub | ❌ |

---

## Pages

| Route | Feature | Status |
|-------|---------|--------|
| `/` | Homepage — course cards, hero | ✅ |
| `/course/[courseId]` | Course Notes tab + Past Paper Archive tab | ✅ |
| `/explorer` | Topic Explorer — filter, worksheet builder, presenter, PDF | ✅ N5 + Higher |
| `/exam-hall` | Countdown, checklists, warm-up | ⚠️ Partial |

---

## Local Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export → /out directory
```

> `worksheet_generator/` and `Course Notes/` directories are excluded from the TypeScript compiler (`tsconfig.json`) and from git (`.gitignore`). They are separate apps that live in the same folder for convenience.

---

## Deployment

Push to `master` → Cloudflare Pages auto-builds and deploys.

**Cloudflare build settings:**
- Build command: `npm run build`
- Output directory: `out`
- Framework preset: Next.js (Static HTML Export)

---

## Adding Content

### Add or update a past paper
Past paper files live in `src/n5/pastpapers/` and `src/higher/pastpapers/` as `.js` files. Each exports a `PastPaper` object:
```js
export const pastPaper2025 = {
  year: 2025,
  papers: [
    { paperNumber: 1, questions: [{ question, answer, videoId, timestamp, topics }] },
    { paperNumber: 2, questions: [...] }
  ]
}
```
Questions appear automatically in the Explorer and course page archive. Video metadata (for the paper-level archive view) is in `lib/past-paper-videos.ts`.

### Add or edit course notes
Notes files are in `src/notes/data/` — one TSX file per course. Each exports a `Section[]` array:
```tsx
import { InlineMath, BlockMath } from '@/src/notes/math-components'; // not 'react-katex'
import { SomeIllustration } from '@/src/notes/illustrations';

export const higherMathsData: Section[] = [
  {
    id: 'section-id',
    title: 'Section Title',
    topics: [
      {
        id: 'topic-id',
        title: 'Topic Title',
        videoUrl: 'https://www.youtube.com/embed/VIDEO_ID',
        theory: (
          <div>
            Theory with <InlineMath math="x^2 + y^2" /> inline math.
            <BlockMath math="\int_0^1 x^2\,dx = \frac{1}{3}" />
          </div>
        ),
        examples: [
          {
            id: 'ex1',
            question: <span>Find the gradient of...</span>,
            solution: <span>Step 1: ...</span>,
          }
        ]
      }
    ]
  }
]
```

### Add a new course to the Explorer
1. Add past paper JS files to `src/{courseId}/pastpapers/`
2. Create topic hierarchy in `lib/{courseId}-topics.ts` (follow `lib/n5-topics.ts`)
3. Add load function to `lib/data-loader.ts`
4. Wire into `app/explorer/page.tsx` course config

---

## Key Files

| File | Purpose |
|------|---------|
| `app/page.tsx` | Homepage |
| `app/course/[courseId]/CoursePageClient.tsx` | Course page — notes + past papers tabs |
| `app/explorer/page.tsx` | Topic Explorer (filters, worksheet, presenter) |
| `lib/notes-loader.ts` | Dynamically imports notes data by courseId |
| `lib/data-loader.ts` | Loads and filters past paper questions |
| `lib/past-paper-videos.ts` | YouTube video IDs and question counts per paper |
| `lib/n5-topics.ts` | N5 topic/subtopic hierarchy for Explorer |
| `lib/higher-topics.ts` | Higher topic/subtopic hierarchy |
| `src/notes/types.ts` | Course / Section / Topic / Example types |
| `src/notes/math-components.tsx` | InlineMath + BlockMath (katex wrapper, no extra dep) |
| `src/notes/illustrations.tsx` | 100+ SVG React diagram components |
| `components/Notes/CourseNotes.tsx` | Notes sidebar + topic navigation |
| `components/Notes/TopicView.tsx` | Video + theory + worked examples per topic |
| `components/MathRenderer.tsx` | KaTeX renderer for past paper question HTML strings |
| `next.config.ts` | `output: 'export'` for static Cloudflare deployment |
| `CLAUDE.md` | Full architecture reference for AI-assisted development |
