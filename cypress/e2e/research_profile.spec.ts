import { dataTestId } from '../../src/utils/dataTestIds';
import { UrlPathTemplate } from '../../src/utils/urlPaths';

describe('User opens their Research Profile from My Registrations Page', () => {
  before('Given that the user is logged in as Creator:', () => {
    cy.visit('/');
    cy.mocklogin();
  });

  it('The User should be able to open their Research Profile from the page My Registrations', () => {
    // Open My Registrations
    cy.get(`[data-testid=${dataTestId.header.myPageLink}]`).click();
    cy.get(`[data-testid=${dataTestId.myPage.myRegistrationsLink}]`).click();

    // Open Public Profile
    cy.get('[data-testid=public-profile-button]').click({ force: true });
    cy.url().should('include', UrlPathTemplate.ResearchProfile);
  });
});
