import { RoleName } from '../../src/types/user.types';
import { mockRegistrationsWithPendingDoiRequest } from '../../src/utils/testfiles/mockRegistration';

describe('Worklist', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/user');
    cy.mocklogin();
    cy.setUserRolesInRedux([RoleName.CURATOR, RoleName.PUBLISHER]);
    cy.get('[data-testid=menu]').click({ force: true });
    cy.get('[data-testid=menu-my-worklist-button]').click({ force: true });
  });

  it('The Curator should be able to view worklist', () => {
    cy.url().should('include', '/worklist');

    cy.get('[data-testid=doi-requests-button]').click({ force: true });
  });

  it('The Curator should be able to open an item in the DOI request list and see the summary of the registration', () => {
    const { identifier } = mockRegistrationsWithPendingDoiRequest[0];
    cy.get('[data-testid=doi-requests-button]').click();
    cy.get(`[data-testid=doi-request-${identifier}]`).click();
    cy.get(`[data-testid=go-to-publication-${identifier}]`).click();
    cy.url().should('include', `/registration/${identifier}`);
  });
});
