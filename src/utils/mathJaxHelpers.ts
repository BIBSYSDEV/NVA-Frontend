/** Marks an element whose text may contain formulas, such as a title or an abstract. Other text is not typeset. */
export const mathJaxContentClassName = 'mathjax-content';

/**
 * The formula markers MathJax 3 recognizes by default. A lone '$' is not one of them, so text with
 * a single '$' or a stray '\' has no formula to typeset.
 */
const mathJaxRegex = /\\\(|\\\[|\$\$|\\begin\{/;

export const stringIncludesMathJax = (input = '') => mathJaxRegex.test(input);

/** Finds the elements marked for MathJax that contain a formula. */
export const getElementsWithMathJax = (root: ParentNode) =>
  Array.from(root.querySelectorAll<HTMLElement>(`.${mathJaxContentClassName}`)).filter((element) =>
    stringIncludesMathJax(element.textContent ?? '')
  );

let mathJaxDocumentLoader: Promise<typeof import('./mathJaxDocument')> | null = null;

// MathJax is large, so it is loaded the first time a formula is shown
const loadMathJaxDocument = () => {
  if (!mathJaxDocumentLoader) {
    mathJaxDocumentLoader = import('./mathJaxDocument').catch((error) => {
      // Discard the failed attempt, so a later call can retry instead of awaiting this rejection
      mathJaxDocumentLoader = null;
      throw error;
    });
  }
  return mathJaxDocumentLoader;
};

export const typesetMathJax = async (elements: HTMLElement[]) => {
  try {
    const { typesetElements } = await loadMathJaxDocument();
    typesetElements(elements);
  } catch {
    // Ignore failures (invalid TeX, chunk unavailable, etc.) so one bad run cannot block later ones
  }
};
