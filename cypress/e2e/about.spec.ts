import { dataTestId } from '../../src/utils/dataTestIds';
import { UrlPathTemplate } from '../../src/utils/urlPaths';
import { a11yLogErrors } from '../support/logging';

describe('About and Privacy policy', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('The user should see about page', () => {
    cy.get(`[data-testid=${dataTestId.header.generalMenuButton}]`).click();
    cy.get(`[data-testid=${dataTestId.header.aboutLink}]`).click();
    cy.url().should('include', UrlPathTemplate.About);
    cy.injectAxe();
    cy.checkA11y(null, undefined, a11yLogErrors);
  });

  it('The user should see privacy policy page', () => {
    cy.get(`[data-testid=${dataTestId.footer.privacyLink}]`).click();
    cy.url().should('include', UrlPathTemplate.PrivacyPolicy);
    cy.injectAxe();
    cy.checkA11y(null, undefined, a11yLogErrors);
  });
});
