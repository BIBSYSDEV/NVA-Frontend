import { dataTestId } from '../../src/utils/dataTestIds';
import { UrlPathTemplate } from '../../src/utils/urlPaths';
import { a11yLogErrors } from '../support/logging';

describe('About and Privacy policy', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('The user should see privacy policy page', () => {
    cy.get(`[data-testid=${dataTestId.footer.privacyLink}]`).click();
    cy.url().should('include', UrlPathTemplate.PrivacyPolicy);
    cy.injectAxe();
    cy.checkA11y(null, { retries: 3, interval: 250 }, a11yLogErrors);
  });
});
