# Punctuation next to maths

**A full stop goes INSIDE the closing delimiter.**

```js
// correct
"the twelfth term is \\(-34.\\)"
"the equation \\(y=2x.\\) Find the gradient."

// wrong — the stop can end up alone on the next line
"the twelfth term is \\(-34\\)."
"the equation \\(y=2x\\). Find the gradient."
```

Enforced by `scripts/check-maths-punctuation.mjs`.

---

## Why, and where this came from

**This rule was paid for in the app, not invented here.** It is a CRITICAL RULE
in `Current Deployment/ARCHITECTURE.md`:

> MathJax renders inline `\(...\)` as an SVG span. On narrow screens (~375px),
> a period placed *outside* the closing `\)` can wrap onto its own line — an
> "orphaned period". The fix is to move the period **inside** the closing
> delimiter.
>
> **History**: A bulk fix was applied in March 2026 to move **503 orphaned
> periods inside** `\)` across all existing data files.

The website renders with KaTeX rather than MathJax, but the mechanism is
identical: the expression is one inline box, whatever follows it is a separate
box, and a line is allowed to break between two boxes. So the rule carries over
unchanged.

## The near miss that made this file exist

In September 2026 the website's **1,067 correctly-placed stops were read as a
defect** and a scripted pass to move all of them *out* was nearly proposed.

The reasoning was not stupid, which is the point. A stop inside the maths is
typeset by KaTeX in its serif face, and the body text is a sans — so the stop
after `6·6 km/h.` really does look different from the one after `treadmill.`
two lines above it. That difference is visible, and it is what prompted the
question.

It would have recreated the March bug at twice the scale, across past paper
data. And it would have looked like a success: a render diff would have shown
1,067 stops moved and nothing else changed, because **the damage only appears
on a narrow screen, at a line break** — a condition no diff of the source or of
a desktop render would reproduce.

**The serif stop is a real issue and a separate one. It is a FONT problem.**
If it is ever worth fixing, it is fixed in CSS — never by moving the character.

## Commas are not enforced

The app's rule speaks only of periods. The website is consistent the other way:
**833 commas outside a closing delimiter against 50 inside.** Enforcing the
period rule on commas would be inventing a rule rather than carrying one over,
so the check reports the count and stops there.

If that is ever revisited, note that the orphaning mechanism applies to a comma
just as much — the argument for leaving them is consistency and volume, not
that commas are safe.

## The check

Ratcheted, like `check-responsive.mjs`. **666 violations were recorded as the
baseline**, and the check fails only when the number goes *up*. A check that is
red on its first day gets ignored within a week; one that can only improve gets
obeyed.

```
npm run check:punctuation
node scripts/check-maths-punctuation.mjs --list higherApps   # see them
node scripts/check-maths-punctuation.mjs --baseline          # after fixing some
```

`--baseline` refuses to record a worse number than the one on disk.

Mutation tested both ways: a new question written with the stop outside, and a
correctly-placed stop moved out. Both are caught, and the file is named.

## If you want to burn down the 666

Do it in batches, by file, and after each batch **look at a page on a real
phone at 375px** — not at a diff. The failure this prevents is invisible
everywhere except there.
