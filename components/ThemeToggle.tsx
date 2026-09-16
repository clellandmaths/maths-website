'use client';

import { useEffect, useState } from 'react';

/**
 * Two icons, drawn here rather than imported.
 *
 * `lucide-react` is already in the navbar's bundle, so two more of its icons
 * looked free — and the whole control measured **1.0 KB**, which is what it
 * should cost. The problem was where that KB landed: `course/*` templates had
 * silently drifted to **9.4 KB of their 10 KB budget headroom**, so one more
 * kilobyte anywhere failed `check:budget` on all five courses at once. That is
 * the failure mode `worksheet_generator/docs/new-course.md` describes — growth
 * inside the headroom is never reported, so a template reaches the edge quietly
 * and the next person to add a button pays for everyone.
 *
 * Inlining them is not a fix for the drift, which is recorded in
 * docs/light-mode.md as its own item. It is this control declining to be the
 * straw, for two paths of markup.
 */
const ICON = 'h-5 w-5';
const SVG = {
  fill: 'none', stroke: 'currentColor', strokeWidth: 2,
  strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24', 'aria-hidden': true,
};

const SunIcon = () => (
  <svg {...SVG} className={ICON}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4" />
  </svg>
);

const MoonIcon = () => (
  <svg {...SVG} className={ICON}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

/**
 * Light or dark, and the choice sticks.
 *
 * **The attribute is the source of truth, not this component's state.** The
 * pre-paint script in `app/layout.tsx` has already stamped `data-theme` on
 * `<html>` before React exists, so this reads what is actually showing rather
 * than deciding it. Two things deciding the same thing is how a toggle ends up
 * one press behind the page.
 *
 * **Why the state starts at `'dark'` rather than at the real value.** This is a
 * static export: the HTML was built once with `data-theme="dark"` on it, so
 * that is what hydration compares against. Reading `localStorage` during the
 * first render would make the client disagree with the markup it is hydrating —
 * the same fault `PracticeModes` documents for reading `location` in a lazy
 * initialiser. So the first render matches the build, and an effect corrects it.
 * A reader who has chosen light sees this one icon settle; the page itself does
 * not flash, because the script fixed that before paint.
 */
export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const now = document.documentElement.getAttribute('data-theme');
    if (now === 'light' || now === 'dark') setTheme(now);
  }, []);

  const flip = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    /**
     * **Storage first, then the attribute, and the order is load-bearing.**
     *
     * The pre-paint script in `app/layout.tsx` watches `data-theme` and puts
     * back whatever `localStorage` says, because React wipes attributes it did
     * not author whenever a page hydrates with a mismatch. Set the attribute
     * first and that guard sees a value disagreeing with storage and reverts
     * it — the toggle would visibly bounce back. Written this way the guard
     * reads the new choice and agrees with it.
     *
     * Wrapped because a private window can throw on write, and a toggle that
     * throws would take the click handler down with it.
     */
    try { localStorage.setItem('theme', next); } catch { /* no memory, still works */ }
    document.documentElement.setAttribute('data-theme', next);
  };

  const toLight = theme === 'dark';

  return (
    <button
      onClick={flip}
      /* The label says what pressing it DOES, not what is currently showing.
         A control named for its own state reads as a status line, and a reader
         using a screen reader cannot tell whether "Dark" is a label or a
         button. */
      aria-label={toLight ? 'Switch to light mode' : 'Switch to dark mode'}
      title={toLight ? 'Switch to light mode' : 'Switch to dark mode'}
      className={className || 'p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors'}
    >
      {toLight ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
