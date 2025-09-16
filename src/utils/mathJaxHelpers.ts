interface MathJax {
  typesetPromise: () => Promise<unknown>;
}

interface MathJaxWindow extends Window {
  MathJax?: MathJax;
}

const mathJaxScriptId = 'mathjax-script';

export const typesetMathJax = () => {
  const mathJaxWindow = window as MathJaxWindow;
  if (mathJaxWindow.MathJax?.typesetPromise) {
    mathJaxWindow.MathJax.typesetPromise();
  } else if (!document.getElementById(mathJaxScriptId)) {
    const script = document.createElement('script');
    script.id = mathJaxScriptId;
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js';
    script.async = true;
    script.onload = () => {
      mathJaxWindow.MathJax?.typesetPromise?.();
    };

    document.head.appendChild(script);
  }
};

export const stringIncludesMathJax = (input = '') => {
  return input.includes('\\') || input.includes('$');
};
