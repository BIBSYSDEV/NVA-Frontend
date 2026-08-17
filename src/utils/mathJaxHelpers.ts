interface MathJax {
  typesetPromise: () => Promise<unknown>;
  startup?: {
    promise?: Promise<unknown>;
  };
}

interface MathJaxWindow extends Window {
  MathJax?: MathJax;
}

const mathJaxScriptId = 'mathjax-script';
const mathJaxScriptSrc = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js';

/**
 * The formula markers MathJax 3 recognizes by default. A lone '$' is not one of them, so text with
 * a single '$' or a stray '\' has no formula to typeset.
 */
const mathJaxRegex = /\\\(|\\\[|\$\$|\\begin\{/;

export const stringIncludesMathJax = (input = '') => mathJaxRegex.test(input);

let mathJaxLoader: Promise<void> | null = null;

const loadMathJax = () => {
  if (!mathJaxLoader) {
    mathJaxLoader = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.id = mathJaxScriptId;
      script.src = mathJaxScriptSrc;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load MathJax'));

      document.head.appendChild(script);
    });
  }
  return mathJaxLoader;
};

const runTypeset = async () => {
  const mathJaxWindow = window as MathJaxWindow;
  if (!mathJaxWindow.MathJax?.typesetPromise) {
    // Awaiting the shared loader means callers arriving while the script is in flight are served
    // once it is ready, instead of being dropped
    await loadMathJax();
  }
  // Typesetting cannot start before MathJax has finished initializing itself
  await mathJaxWindow.MathJax?.startup?.promise;
  await mathJaxWindow.MathJax?.typesetPromise?.();
};

// MathJax must not be asked to typeset while a previous run is in progress, so runs are chained.
// At most one run is kept waiting: any further callers are covered by that run, since it has not
// looked at the document yet.
let typesetQueue: Promise<void> = Promise.resolve();
let queuedRuns = 0;

export const typesetMathJax = () => {
  if (queuedRuns > 1) {
    return typesetQueue;
  }

  queuedRuns++;
  typesetQueue = typesetQueue
    .then(runTypeset)
    .catch(() => {
      // Ignore failures (invalid TeX, CDN unavailable, etc.) so one bad run cannot block later ones
    })
    .finally(() => {
      queuedRuns--;
    });

  return typesetQueue;
};
