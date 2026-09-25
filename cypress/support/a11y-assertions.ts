import type { Result } from 'axe-core';
import { a11yBaseline } from './a11y-baseline';

const maxReportedNodes = 3;

const describeViolation = (violation: Result) => {
  const targets = violation.nodes
    .slice(0, maxReportedNodes)
    .map((node) => node.target.join(' '))
    .join(', ');
  const remaining = violation.nodes.length - maxReportedNodes;
  const more = remaining > 0 ? ` (+${remaining} more)` : '';

  return `${violation.id} [${violation.impact}]: ${violation.help} -> ${targets}${more} | ${violation.helpUrl}`;
};

/**
 * Fails when a snapshot gains a violation it has no waiver for, and equally when
 * a waiver it has is no longer needed. The second half is what makes the list
 * shrink: fixing an issue forces the waiver to be deleted in the same PR.
 */
export const compareWithA11yBaseline = (snapshot: string, violations: Result[]) => {
  const waived = a11yBaseline[snapshot];

  if (!waived) {
    throw new Error(
      `Unknown a11y snapshot "${snapshot}". Register it in cypress/support/a11y-baseline.ts with an empty array before checking it.`
    );
  }

  const waivedRules = waived.map((entry) => entry.rule);
  const violatedRules = violations.map((violation) => violation.id);

  const staleWaivers = waivedRules.filter((rule) => !violatedRules.includes(rule));
  const newViolations = violations.filter((violation) => !waivedRules.includes(violation.id));

  expect(
    staleWaivers,
    `These rules no longer fire on "${snapshot}". Delete them from a11yBaseline in cypress/support/a11y-baseline.ts.`
  ).to.deep.equal([]);

  expect(newViolations.map(describeViolation), `New accessibility violations on "${snapshot}"`).to.deep.equal([]);
};
