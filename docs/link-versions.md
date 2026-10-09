# Shared links open the questions that were shared

*Made 2026-10-09, on the owner's word: "I don't really want to annoy any teachers who have homework out
right now", then "Go ahead".*

## The problem

A shared worksheet link doesn't hold its questions. It holds, for each generated question, the card's code
and a seed, and the site makes the question again when the link is opened (`lib/worksheet-share.ts`). So a
link reopens exactly what was shared **only while the question-maker behind it is the same**. When the maker
changes what a seed makes, every old link on that card silently opens a different question. It opens fine,
with a correct answer, but it's not the sheet the teacher printed or set.

The first time this mattered: National 5's "never the paper's own question" (generator `hint-quality`
aeb97f0). It widened 18 cards and added a guard, and it would have changed 150 of the 2,585 generated
questions in the 500 recorded test links (113 links, 1 to 3 questions each).

## The rule: a link opens with the maker it was made with

- **Every link carries a version.** `LINK_VERSION` in `lib/worksheet-refs.mjs` is the version new links are
  made with. A short link marks it with one character straight after its leading "." (`VERSION_MARKS`:
  version 2 is "y"). The older formats, never written now, carry `v=`. A link with no mark is **version 1**,
  which covers every link made before 2026-10-09.
- **Each older version's maker is kept, frozen, byte for byte.** Version 1 is `lib/generator-v1/`, the
  generator exactly as it was live at website 767a87c (live 2026-10-06 to 2026-10-09).
- **One routing point:** `lib/link-engines.ts` (`engineForVersion`). Each maker is loaded with
  `await import()`, so an old maker is fetched only when a link made with it is opened, never for a new link
  or by any other page.
- **Which links keep their version:**
  - **Handouts** (`/worksheet?…`, `app/worksheet/page.tsx`) open with their own version.
  - **Editable links** (`/explorer?…`) load into the Builder with the current maker. They hand over a
    working copy, and the owner chose not to preserve them ("I'm not bothered about preserving editable links
    just shared", 2026-10-09).
- **"Another like this one", re-roll, the Builder, practice papers and warm-ups** always use the current maker.
  So even on an old handout, a new question is a new-rules question.

## What holds it

| check | when | what it proves |
|---|---|---|
| `scripts/check-frozen-engines.mjs` (`check:frozen`) | every build | every frozen copy is exactly the files listed in `scripts/frozen-engines.json`, which were taken from `git ls-tree <commit>` and not from the copy: no file changed, added or missing (CRLF read as LF) |
| `scripts/check-share-refs.mjs` (`check:sharerefs`) | every build | the 500 recorded links read as version 1; version 1 is still written exactly as pinned; new links carry the current mark; every mark is one character, outside the link alphabet, no vowel, not escaped in a URL |
| `scripts/check-engine-callsites.mjs` (`check:callsites`) | every build | only `lib/link-engines.ts` reaches a frozen maker's door (`lib/generated-question-v1.ts`) |
| `scripts/verify-share-fixtures.mts` | by hand, before going live | every generated question in the recorded links, made by its own version's maker, has its recorded fingerprint: version 1 from `share-links-2026-10-01.json` and `share-links-short-2026-10-01.json`, version 2 from `share-links-v2-2026-10-09.json` |

## When the generator changes again

Run `npx tsx scripts/verify-share-fixtures.mts` after syncing the generator. If **version 2** links fail, the
change moves what shared links open. Then:

1. Freeze the maker being replaced. Copy `lib/generator` *from the live commit* to `lib/generator-v2/` with
   `git -c core.autocrlf=false archive <live commit> lib/generator`, and check it with
   `git hash-object --no-filters` against `git ls-tree`.
2. Add it to `scripts/frozen-engines.json` from `git ls-tree <live commit> lib/generator`, never from the copy.
3. Add a door, `lib/generated-question-v2.ts` (copy v1's and point it at `generator-v2`), and a branch in
   `engineForVersion`.
4. Raise `LINK_VERSION` to 3, append a mark to `VERSION_MARKS`, and record
   `share-links-v3-<date>.json` with a recorder like `record-v2-fixtures.mts`.
5. Accept the engine size growth with its reason (`check-engine-isolation.mjs --accept-growth "…"`).

**Never edit a frozen copy** to make something pass, and never re-record a fixture. If the site's question
shape changes, adapt it in the version's door file (`lib/generated-question-v<n>.ts`).

Advanced Higher's coming "never the paper's own question" work is exactly such a change. The version 1 copy
already holds AH as it was at 767a87c, so AH links made before 2026-10-09 are covered. Version 2 AH links
will need the steps above.

## How long a version is kept

**Kept, and reviewed once a year** (the owner, 2026-10-09: "Keep old review once per year").
- An old copy costs visitors nothing: only an old handout fetches it.
- Once a year, ideally over the summer, list the frozen versions and ask the owner which to keep. Keep any
  whose links may still be in use.
- Taking a copy out changes what that version's links open, so it's done only on the owner's word, at a
  quiet time.
- The real cost of a copy is a future framework or TypeScript upgrade that stops it building. Then adapt
  around it in its door file, or put retiring it to the owner. Never edit the copy itself.

## Costs, measured

- **Links:** one character longer (the mark), the same for any number of questions.
- **Engine size:** the frozen copy adds its own lazy chunks, counted in `scripts/engine-size-baseline.json`.
  They aren't on any page, and are fetched only when an old handout with a generated question is opened.
  Because the copy can't change, any growth after that recording is still growth in the current maker.
- **Old links keep any paper's own question they already held** (34 questions in 32 of the 500 test links).
  They were made before the rule. New links never get one.
