import { useEffect } from 'react';
import { getElementsWithMathJax, typesetMathJax } from '../mathJaxHelpers';

const typesetDebounce = 150;

const observerOptions: MutationObserverInit = { childList: true, characterData: true, subtree: true };

/**
 * Typesets formulas whenever an element marked with mathJaxContentClassName appears in the rendered page.
 * Used once, from Layout.
 */
export const useMathJaxTypesetting = () => {
  useEffect(() => {
    // body also covers dialogs and tooltips, which MUI renders in portals
    const root = document.body;

    let isCancelled = false;
    let timeout: ReturnType<typeof setTimeout>;

    const typesetIfNeeded = async () => {
      const elements = getElementsWithMathJax(root);
      if (elements.length === 0) {
        return;
      }

      // MathJax rewrites the DOM, so stop watching while it runs
      observer.disconnect();
      await typesetMathJax(elements);
      if (!isCancelled) {
        observer.observe(root, observerOptions);
      }
    };

    const observer = new MutationObserver(() => {
      clearTimeout(timeout);
      timeout = setTimeout(typesetIfNeeded, typesetDebounce);
    });

    observer.observe(root, observerOptions);
    typesetIfNeeded();

    return () => {
      isCancelled = true;
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, []);
};
