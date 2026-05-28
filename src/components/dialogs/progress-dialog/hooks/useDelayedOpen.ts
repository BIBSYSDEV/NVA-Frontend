import { useEffect, useRef, useState } from 'react';

/**
 * Derives a "shown" state from a desired-open flag, smoothing out two UX issues:
 *  - skips showing entirely when `open` flips back to false within `openDelayMs` (avoids flashes for short operations)
 *  - once shown, keeps the UI visible for at least `minVisibleMs` (so anything that does appear stays long enough to read)
 *
 * @param open desired open state, typically driven by an async operation's "in progress" flag
 * @param openDelayMs grace period before showing — if `open` becomes false within this window, nothing is shown
 * @param minVisibleMs minimum time to keep showing after first becoming visible
 * @returns the effective open state to pass to the rendered component
 */
export const useDelayedOpen = (open: boolean, openDelayMs: number, minVisibleMs: number): boolean => {
  const [shown, setShown] = useState(false);
  const shownAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (open === shown) return;

    if (open) {
      const timer = setTimeout(() => {
        shownAtRef.current = Date.now();
        setShown(true);
      }, openDelayMs);
      return () => clearTimeout(timer);
    }

    const elapsed = Date.now() - (shownAtRef.current ?? 0);
    const remaining = Math.max(0, minVisibleMs - elapsed);
    const timer = setTimeout(() => {
      shownAtRef.current = null;
      setShown(false);
    }, remaining);
    return () => clearTimeout(timer);
  }, [open, shown, openDelayMs, minVisibleMs]);

  return shown;
};
