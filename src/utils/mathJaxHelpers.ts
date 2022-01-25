interface MathJax {
  typesetPromise: () => Promise<unknown>;
}

interface MathJaxWindow extends Window {
  MathJax?: MathJax;
}

export const typesetMathJax = () => {
  const mathJaxWindow = window as MathJaxWindow;
  if (mathJaxWindow.MathJax) {
    mathJaxWindow.MathJax.typesetPromise();
  }
};

export const stringIncludesMathJax = (input = '') => {
  return input.includes('$');
};
