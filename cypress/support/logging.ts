import type { Result } from 'axe-core';

const maxLoggedNodes = 3;

export const a11yLogErrors = (violations: Result[]) => {
  const violationData = violations.map(({ id, impact, description, nodes }) => ({
    id,
    impact,
    description,
    nodes: nodes.length,
    // Without a selector the table says something is wrong but not where, which
    // leaves whoever reads the CI log to reproduce the run just to find out.
    targets: nodes
      .slice(0, maxLoggedNodes)
      .map((node) => node.target.join(' '))
      .join(', '),
  }));

  cy.task('table', violationData);
};
