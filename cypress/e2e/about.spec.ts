import { dataTestId } from '../../src/utils/dataTestIds';
import { UrlPathTemplate } from '../../src/utils/urlPaths';

describe('About and Privacy policy', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('The user should see about page', () => {
    cy.injectAxe();
    cy.get(`[data-testid=${dataTestId.header.generalMenuButton}]`).click();
    cy.get(`[data-testid=${dataTestId.header.aboutLink}]`).click();
    cy.url().should('include', UrlPathTemplate.About);
    cy.checkA11y();
  });

  it('The user should see privacy policy page', () => {
    cy.injectAxe();
    cy.get(`[data-testid=${dataTestId.header.generalMenuButton}]`).click();
    cy.get(`[data-testid=${dataTestId.header.privacyLink}]`).click();
    cy.url().should('include', UrlPathTemplate.PrivacyPolicy);
    cy.checkA11y();
  });
});
