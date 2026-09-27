# Board mode: PARKED until after going live

The owner, 2026-09-27: "Might be worth parking this until later and we are
live." Everything below is agreed or proposed, and none of it is built.

## Why

Present, the one-at-a-time full screen, is what a teacher puts on a Promethean
board, and the owner has had to use Chrome zoom in class. Present uses laptop
sizes: the question is at most `text-2xl` (24px) and the answer `text-xl`
(20px), whatever the screen (`components/Explorer/QuestionPresenter.tsx`).

## Agreed

- **One mode with a board setting, not a second component.** Board mode is
  `QuestionPresenter` with board sizing. Hints, answers, "Another like this
  one" and "Back to the question" stay as they are.
- **The same names everywhere:** "Full screen" for one at a time and "Focus"
  for the whole list, with the same icons on every page. Today the
  one-at-a-time mode is called "Start Paper" (past papers), "Full screen"
  (practice topics and shared worksheet) and "Present" (Explorer worksheet),
  and practice topics swap the Explorer's icons.
- **The "Board mode" button only where a teacher shows a class:**
  - the Explorer worksheet ("Present" becomes "Board mode", with "Full screen"
    beside it for a laptop);
  - past papers on the course page.
  - **Not** practice topics (the owner: "No to practice topics"), the shared
    worksheet or the Exam Hall Marathon. Those are pupils on their own
    devices.

## Proposed (owner to confirm when resumed)

1. Type scaled to the screen (question, answer, hints, figures), roughly two to
   three times today's size on a 1080p or 4K board.
2. An A− / A+ size control in the header, with + and − keys, remembered per
   device (localStorage, as a convenience only).
3. On a wide screen, a slim control strip at the bottom and the question
   filling the rest.
4. Clicker keys: Page Up and Page Down as well as the arrows (already there),
   A for Show Answer, H for Hint, maybe N for Another like this one.

## Big questions and many figures (proposed)

Today on a wide screen, `img` figures are pulled into a right-hand column and
share its height, so three figures get a third each, and long questions
scroll. Figures drawn inline in the page (some generated questions) are not
pulled out.

1. Fit to the screen: start at board size and step down to a readable floor.
2. Past the floor, step part by part ((a), then (b), with the stem kept at the
   top) on the clicker, instead of shrinking. Anything without parts scrolls,
   with a "more below" cue.
3. Figures: one goes beside the text at full height; several show the current
   part's figure large, with thumbnails for the rest. Clicking a figure opens
   it on its own. Check inline figures separately.

**First step when resumed:** render every N5 question at 1920×1080 and count
how many overflow at the floor, how many have 2+ figures, and how many have
parts to step through. Show the owner the numbers and the worst examples
before building steps 2 and 3.

## Already done (2026-09-27)

The Explorer worksheet's Present and Focus now offer "Another like this one"
for N5 (website `dev` 94ea313, on `hint-quality` too). The drawn question isn't
added to the sheet. An "Add to sheet" button beside it was offered and not
yet asked for.
