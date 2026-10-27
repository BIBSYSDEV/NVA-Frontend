import axe, { type Result, type RunOptions } from 'axe-core';
import type { Locator } from 'vitest/browser';

// NOTE: Best-practice rules like "region" are left out, since they assume a whole page and not a single component
const wcag21AaTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

export const colorContrastRuleId = 'color-contrast';

interface A11yCheckOptions {
  /**
   * Turns rules on or off for this check only, like `{ 'color-contrast': { enabled: false } }`.
   * Every override needs a comment explaining why the exception is acceptable.
   */
  rules?: RunOptions['rules'];
}

/**
 * Formats a violation as its rule ID, impact and help text, followed by the help URL and the selector of each failing element.
 */
const formatViolation = (violation: Result) => {
  const heading = `${violation.id} (${violation.impact}): ${violation.help}`;
  const selectors = violation.nodes.map((node) => `  ${node.target.join(' ')}`);
  return [heading, `  ${violation.helpUrl}`, ...selectors].join('\n');
};

/**
 * Runs axe-core on the container, or on the whole document by default, and fails on any WCAG 2.1 A or AA violation.
 * Color contrast is included, since the tests run in a real browser.
 * Wait for the content to render before calling this, for example with `expect.element(...).toBeVisible()`.
 */
export const expectNoA11yViolations = async (
  container: Locator | Element = document.body,
  options: A11yCheckOptions = {}
) => {
  const element = container instanceof Element ? container : container.element();
  const { violations } = await axe.run(element, {
    runOnly: { type: 'tag', values: wcag21AaTags },
    rules: { [colorContrastRuleId]: { enabled: true }, ...options.rules },
  });

  if (violations.length > 0) {
    const summary = `Found ${violations.length} accessibility violation(s):`;
    throw new Error([summary, ...violations.map(formatViolation)].join('\n\n'));
  }
};
