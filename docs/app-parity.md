# App → website parity checklist

Things the live app (`clellandmaths/maths-app`) does that the website should do
too. Built by reading the app's source rather than from memory, so the status
column is verified, not assumed.

**Legend** — ✅ already in the website · ⚠️ partly there · ❌ missing · ➖ deliberately not porting

---

## Question interaction

| Behaviour | App | Website | Notes |
|---|---|---|---|
| Reveal answer / solution | ✅ | ⚠️ | Exists for past papers; guided practice not built yet |
| **Scroll to the solution on reveal** | `scrollIntoView({behavior:'smooth', block:'center'})` (app.js:2207) | ❌ | No `scrollIntoView` anywhere in the site. This is the one you noticed — without it the answer can open below the fold and appear to do nothing |
| **Scroll to question header on next/prev** | `block:'start'` (app.js:4032, 4039) | ❌ | Same fix, different anchor |
| Video solution at timestamp | ✅ | ⚠️ | Data has `videoId` + `timestamp`; used in Explorer, not yet in practice |
| **Mark allocation on past paper questions** | ✅ | ❌ | `marks?: number[]` is on every question in `lib/data-loader.ts` but **rendered nowhere**. Data is already there — this is display only |
| Markscheme viewer | ✅ | ✅ | `MarkschemeModal.tsx`, wired into Explorer and Focus Mode |
| **Data booklet** | ✅ | ⚠️ | Wired into Explorer, Focus Mode, QuestionCard, QuestionPresenter and paper pages — but **not the Exam Hall**. Also **Higher Apps only**: it is the year-specific booklet of tax bands, formulae and R commands |
| **Formula lists** | ✅ | ❌ | The other four courses have formula sheets rather than a data booklet, and the site has none of them. Needed for N5, Higher, AH and N5 Apps |

## Navigation

| Behaviour | App | Website | Notes |
|---|---|---|---|
| Topic → subtopic → question drill-down | ✅ | ⚠️ | Two-level browse exists for AH notes; needs the same for practice |
| Revise by topic | ✅ | ✅ | Explorer filters |
| Past papers by year/paper | ✅ | ✅ | Full archive, all five courses |
| Prelim / special collections | ✅ | ❌ | `btnPrelimSpecial` — not assessed yet |

## Progress

| Behaviour | App | Website | Notes |
|---|---|---|---|
| Mark question done | ✅ `markDone` | ⚠️ | Site tracks progress per notes topic, not per question |
| **Flag for review** | ✅ `toggleReview`, review count | ❌ | 30 references in the app. Genuinely useful and absent here |
| Storage | `localStorage` key `clellandMaths_v1` | separate scheme | ➖ **Not porting the schema.** Two progress systems in one site would confuse; extend the site's own instead |

## Deliberately not porting

- **The app's progress schema.** Same reasoning as above.
- **The vanilla-JS UI itself.** 4,100 lines of direct DOM manipulation; the site
  is React with static export. The *behaviours* port, the code cannot.

---

## What this means for the guided practice build

The interaction the app provides — show question, reveal answer, watch the
solution at the right second — is something the site already does for past paper
questions in `components/Explorer/QuestionCard.tsx`. Guided practice is the same
interaction over a different question set, so the work is wiring, not inventing.

The genuinely new pieces are small:

1. the `/practice` route and third tab;
2. the maths.scot attribution link in the answer (see
   [`guided-practice-attribution.md`](./guided-practice-attribution.md));
3. the two scroll behaviours above, which are a few lines each and apply to the
   Explorer as well as practice;
4. rendering `marks`, which needs no new data at all.

Doing 3 and 4 while building practice means the Explorer gets them too, rather
than the two surfaces drifting apart.

---

## Performance

Measured, not assumed:

| | Raw | Downloaded (gzip) |
|---|---|---|
| Total JS, whole site (code-split per route) | 1.8 MB / 81 files | — |
| Largest page — `ah/papers/2018/paper-1.html` | 1,593 KB | **78 KB** |
| Explorer | 29 KB | 5 KB |
| Past paper pages | 71 pages, mean 341 KB | — |

**The large paper pages are not a problem.** Prerendered KaTeX is thousands of
near-identical spans, which compresses ~95%. Cloudflare serves gzip/brotli, so
the worst page on the site is about 78 KB over the wire. Judge page weight by
the compressed figure; the raw number is misleading.

### What the site already does well

Most of what you'd do by hand in a vanilla app, Next does automatically:

- **Static export.** Every page is prerendered HTML served from Cloudflare's
  CDN. No server, no database, no round-trip — the fastest possible first byte.
- **Per-route code splitting.** A pupil on a notes page never downloads the
  Explorer's JavaScript.
- **Dynamic imports already in use.** `DataBookletModal` pulls each year's
  booklet with `import()` only when opened, so none of it is in the initial
  payload. That is exactly the lazy loading you built into the app.
- **`loading="lazy"` on images**, applied centrally in `MathHtml.tsx`.

### What actually needs attention

1. **Guided practice data — the one real risk.** 406 National 5 questions, plus
   Higher and Advanced Higher to come. Imported statically it joins the shared
   JS bundle and every page pays for it on first load, and unlike HTML that cost
   does not compress away. It must be loaded with `import()` per course — the
   pattern `DataBookletModal` already uses.
2. **Three font formats.** KaTeX ships `.ttf`, `.woff` and `.woff2`. `woff2`
   covers every browser in use; minor, and only worth doing opportunistically.

### Rule for the practice build

Load question data per course, lazily, on the practice route only. Never import
it from anything that a notes or paper page also imports.
