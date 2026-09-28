'use client';

import { useEffect } from 'react';

/**
 * What a menu is expected to do, for the `<details data-menu>` menus in the
 * course bar. A native `<details>` opens and closes on its own button and
 * nothing else, so it would stay open over the page after a click elsewhere,
 * ignore Escape, and stay open after a choice when the next page reuses the
 * same markup (Higher practice after National 5 practice).
 *
 * - **Escape** closes any open menu and returns focus to its button.
 * - **Choosing a link** inside one closes it.
 * - **A press elsewhere** closes a `popup` (the dropdown over the page), but
 *   not a `disclosure`, which sits in the page and pushes it down: closing that
 *   under a finger would move whatever the finger was about to press.
 *
 * One listener set per page, however many bars.
 */
let mounted = 0;

export default function MenuDismiss() {
  useEffect(() => {
    if (mounted++) return () => { mounted--; };

    const openMenus = () => document.querySelectorAll<HTMLDetailsElement>('details[data-menu][open]');

    const onPointerDown = (e: PointerEvent) => {
      for (const d of openMenus()) {
        if (d.dataset.menu === 'popup' && !d.contains(e.target as Node)) d.open = false;
      }
    };
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a');
      const menu = link?.closest<HTMLDetailsElement>('details[data-menu]');
      if (menu) menu.open = false;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      for (const d of openMenus()) {
        d.open = false;
        d.querySelector('summary')?.focus();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      mounted--;
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return null;
}
