'use client';

import { useEffect } from 'react';

/**
 * Fits long inline maths to a phone's width (lib/maths-fit.ts; the owner, 2026-10-13: "Let's go E"). Renders
 * nothing. The logic is fetched only on a phone-width screen, once the page has loaded, so no page carries it.
 */
export default function MathsFit() {
  useEffect(() => {
    if (!matchMedia('screen and (max-width: 767px)').matches) return;
    let stop: (() => void) | undefined;
    let gone = false;
    import('@/lib/maths-fit').then(m => { if (!gone) stop = m.startMathsFit(); }).catch(() => {});
    return () => { gone = true; stop?.(); };
  }, []);
  return null;
}
