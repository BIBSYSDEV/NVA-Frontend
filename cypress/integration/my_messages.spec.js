import { mockMessages } from '../../src/utils/testfiles/mockRegistration';

describe('My messages', () => {
  beforeEach(() => {
    cy.visit('/my-profile');
    cy.mocklogin();
    cy.get('[data-testid=my-messages]').click({ force: true });
  });

  it('The Creator should be able to view my messages', () => {
    cy.url().should('include', '/my-messages');
  });

  it('The Creator should be able to open an item in the DOI request list and see the summary of the registration', () => {
    const { identifier } = mockMessages[0].publication;
    cy.get(`[data-testid=message-${identifier}]`).click();
    cy.get(`[data-testid=go-to-registration-${identifier}]`).click();
    cy.url().should('include', `/registration/${identifier}/public`);
  });
});
