import { describe, expect, it } from 'vitest';
import { stringIncludesMathJax } from '../mathJaxHelpers';

describe('stringIncludesMathJax', () => {
  it('detects the delimiters MathJax recognizes by default', () => {
    expect(stringIncludesMathJax('The title \\(\\sqrt{25} = 5\\)')).toBe(true);
    expect(stringIncludesMathJax('Displayed: \\[a^2 + b^2 = c^2\\]')).toBe(true);
    expect(stringIncludesMathJax('Displayed: $$a^2 + b^2 = c^2$$')).toBe(true);
    expect(stringIncludesMathJax('\\begin{equation}a^2\\end{equation}')).toBe(true);
  });

  it('ignores text without formula notation', () => {
    expect(stringIncludesMathJax('An abstract about mathematics')).toBe(false);
    expect(stringIncludesMathJax('')).toBe(false);
    expect(stringIncludesMathJax()).toBe(false);
  });

  it('ignores a lone dollar sign, which is not an inline delimiter in MathJax 3', () => {
    expect(stringIncludesMathJax('Funded by a $2M grant')).toBe(false);
    expect(stringIncludesMathJax('Costs are given in $ throughout')).toBe(false);
  });

  it('ignores backslashes that do not open a formula', () => {
    expect(stringIncludesMathJax('Stored in C:\\Users\\data')).toBe(false);
    expect(stringIncludesMathJax('Roughly 50\\% of the sample')).toBe(false);
  });
});
