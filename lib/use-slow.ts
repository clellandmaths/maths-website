'use client';

import { useEffect, useState } from 'react';

/**
 * True once `on` has stayed true for `ms` (the loading-states rules, the owner
 * 2026-10-14): a press that ends within a second shows only a busy button, and
 * only a longer one says in words what it is doing. Resets when `on` goes false.
 */
export function useSlow(on: boolean, ms = 1000): boolean {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    if (!on) { setSlow(false); return; }
    const t = setTimeout(() => setSlow(true), ms);
    return () => clearTimeout(t);
  }, [on, ms]);
  return on && slow;
}
