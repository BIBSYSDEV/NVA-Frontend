import axe, { type Result, type RunOptions } from 'axe-core';
import type { Locator } from 'vitest/browser';

// NOTE: Best-practice rules like "region" are left out, since they assume a whole page and not a single component
// NOTE: axe-core has no WCAG 2.2 level A rules, so wcag22aa is the only 2.2 tag
const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

export const getViolationSummary = (count: number) => `Found ${count} accessibility violation(s):`;

interface A11yCheckOptions {
  /**
   * axe rules to skip in this call only, like `['color-contrast']`.
   * The rule IDs are shown in the failure message and listed at https://dequeuniversity.com/rules/axe/.
   * Only skip a rule for a known exception, and add a comment explaining why.
   */
  skippedRules?: string[];
}

const toDisabledRules = (ruleIds: string[]): RunOptions['rules'] =>
  Object.fromEntries(ruleIds.map((ruleId) => [ruleId, { enabled: false }]));

/**
 * Formats a violation as its rule ID, impact and help text,
 * followed by the help URL and the selector of each failing element.
 */
const formatViolation = (violation: Result) => {
  const heading = `${violation.id} (${violation.impact}): ${violation.help}`;
  const selectors = violation.nodes.map((node) => `  ${node.target.join(' ')}`);
  return [heading, `  ${violation.helpUrl}`, ...selectors].join('\n');
};

const hasFiniteDuration = (animation: Animation) => animation.effect?.getComputedTiming().endTime !== Infinity;

const waitForNextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

/**
 * Waits for running CSS transitions and animations to finish. Infinite ones, like spinners, are skipped.
 */
const waitForAnimationsToFinish = async () => {
  // NOTE: Wait one frame first, so transitions triggered by the last state change have started
  await waitForNextFrame();
  const finiteAnimations = document.getAnimations().filter(hasFiniteDuration);
  await Promise.allSettled(finiteAnimations.map((animation) => animation.finished));
};

/**
 * Runs axe-core on the container, or on the whole document by default, and fails on any WCAG 2.2 A or AA violation.
 * Color contrast is included, since the tests run in a real browser.
 * Checks that axe can't decide, like contrast on background images, are not reported.
 * Running CSS animations and transitions are awaited first, so content that is fading in is checked in its final state.
 * Wait for the content to render before calling this, for example with `expect.element(...).toBeVisible()`.
 */
export const expectNoA11yViolations = async (
  container: Locator | Element = document.body,
  options: A11yCheckOptions = {}
) => {
  // NOTE: axe skips elements with opacity 0, so content that is still fading in, like an opening MUI dialog, would pass
  await waitForAnimationsToFinish();
  const element = container instanceof Element ? container : container.element();
  const { violations } = await axe.run(element, {
    runOnly: { type: 'tag', values: wcagTags },
    rules: toDisabledRules(options.skippedRules ?? []),
  });

  if (violations.length > 0) {
    const summary = getViolationSummary(violations.length);
    throw new Error([summary, ...violations.map(formatViolation)].join('\n\n'));
  }
};
