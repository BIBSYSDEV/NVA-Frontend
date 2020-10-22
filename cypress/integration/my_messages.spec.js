import { RoleName } from '../../src/types/user.types';
import { mockRegistrationsWithPendingDoiRequest } from '../../src/utils/testfiles/mockRegistration';

describe('My messages', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/user');
    cy.mocklogin();
    cy.setUserRolesInRedux([RoleName.CREATOR]);
    cy.get('[data-testid=menu]').click({ force: true });
    cy.get('[data-testid=menu-my-messages-button]').click({ force: true });
  });

  it('The Creator should be able to view my messages', () => {
    cy.url().should('include', '/my-messages');
  });

  it('The Creator should be able to open an item in the DOI request list and see the summary of the registration', () => {
    const { identifier } = mockRegistrationsWithPendingDoiRequest[0];
    cy.get(`[data-testid=doi-request-${identifier}]`).click();
    cy.get(`[data-testid=go-to-registration-${identifier}]`).click();
    cy.url().should('include', `/registration/${identifier}`);
  });
});
