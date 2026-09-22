import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Manages expand/collapse state for a list with a "show more" button.
 * Calls focus() on firstRestItemRef when the list expands — attach the ref to the first revealed item.
 * @returns showAll, setShowAll, firstRestItemRef
 */
export const useShowAll = () => {
  const [showAll, setShowAll] = useState(false);
  const firstRestItemRef = useRef<HTMLLIElement>(null);

  useLayoutEffect(() => {
    if (showAll) {
      firstRestItemRef.current?.focus();
    }
  }, [showAll]);

  return { showAll, setShowAll, firstRestItemRef };
};
