import { afterEach, describe, expect, it } from 'vitest';
import { getElementsWithMathJax, mathJaxContentClassName, typesetMathJax } from '../mathJaxHelpers';

const createElement = (text: string, className?: string) => {
  const element = document.createElement('p');
  element.textContent = text;
  if (className) {
    element.className = className;
  }
  document.body.append(element);
  return element;
};

afterEach(() => {
  document.body.replaceChildren();
});

describe('getElementsWithMathJax', () => {
  it('finds marked elements that contain a formula', () => {
    const element = createElement('Title \\(x^2\\)', mathJaxContentClassName);
    expect(getElementsWithMathJax(document.body)).toEqual([element]);
  });

  it('ignores marked elements without a formula', () => {
    createElement('A title about mathematics', mathJaxContentClassName);
    expect(getElementsWithMathJax(document.body)).toEqual([]);
  });

  it('ignores formulas in elements that are not marked', () => {
    createElement('Name \\(x^2\\)');
    expect(getElementsWithMathJax(document.body)).toEqual([]);
  });
});

describe('typesetMathJax', () => {
  it('typesets formulas in the given elements', async () => {
    const element = createElement('Title \\(\\sqrt{25} = 5\\) and \\(a \\bmod b\\)', mathJaxContentClassName);
    await typesetMathJax([element]);
    expect(element.querySelectorAll('mjx-container')).toHaveLength(2);
  });

  it('leaves formulas outside the given elements as written', async () => {
    const element = createElement('Title \\(x^2\\)', mathJaxContentClassName);
    const otherText = 'Name \\(x^2\\)';
    const otherElement = createElement(otherText);
    await typesetMathJax([element]);
    expect(otherElement.textContent).toBe(otherText);
    expect(otherElement.querySelector('mjx-container')).toBeNull();
  });
});
