import { dataTestId } from '../../src/utils/dataTestIds';
import { UrlPathTemplate } from '../../src/utils/urlPaths';

function terminalLog(violations: any) {
  cy.task(
    'log',
    `${violations.length} accessibility violation${violations.length === 1 ? '' : 's'} ${
      violations.length === 1 ? 'was' : 'were'
    } detected`
  );
  // pluck specific keys to keep the table readable
  const violationData = violations.map(({ id, impact, description, nodes }: any) => ({
    id,
    impact,
    description,
    nodes: nodes.length,
  }));

  cy.task('table', violationData);
}

describe.only('About and Privacy policy', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('The user should see about page', () => {
    cy.get(`[data-testid=${dataTestId.header.generalMenuButton}]`).click();
    cy.get(`[data-testid=${dataTestId.header.aboutLink}]`).click();
    cy.url().should('include', UrlPathTemplate.About);
    cy.injectAxe();
    cy.checkA11y(null, undefined, terminalLog);
    cy.task('log');
  });

  it('The user should see privacy policy page', () => {
    cy.get(`[data-testid=${dataTestId.footer.privacyLink}]`).click();
    cy.url().should('include', UrlPathTemplate.PrivacyPolicy);
    cy.injectAxe();
    cy.checkA11y(null, { retries: 3, interval: 100 }, terminalLog);
  });
});
