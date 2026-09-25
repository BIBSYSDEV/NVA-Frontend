import type { Result } from 'axe-core';

const maxLoggedNodes = 3;
const maxElementLength = 60;

/**
 * Emotion class names are content-hashed and change between builds, so they make
 * a selector much longer without making it any easier to find the element.
 */
const stripEmotionClasses = (selector: string) => selector.replace(/\.css-[a-z0-9]+(?:-[A-Za-z]+)*/g, '');

/**
 * axe reports the full ancestor chain. The last link is the offending element,
 * and is what someone reading a CI log actually needs.
 */
const describeElement = (target: string[]) => {
  const selector = stripEmotionClasses(target.join(' '));
  const element = selector.split('>').pop()?.trim() || selector;

  return element.length > maxElementLength ? `${element.slice(0, maxElementLength)}…` : element;
};

export const logA11yViolations = (violations: Result[]) => {
  const rows = violations.flatMap((violation) =>
    violation.nodes.slice(0, maxLoggedNodes).map((node) => ({
      rule: violation.id,
      impact: violation.impact,
      element: describeElement(node.target as string[]),
    }))
  );

  cy.task('table', rows);
};
