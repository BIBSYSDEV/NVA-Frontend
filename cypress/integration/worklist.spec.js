import { RoleName } from '../../src/types/user.types';
import { mockMessages } from '../../src/utils/testfiles/mockRegistration';

describe('Worklist', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/my-profile');
    cy.mocklogin();
    cy.setUserRolesInRedux([RoleName.CURATOR, RoleName.PUBLISHER]);
    cy.get('[data-testid=menu]').click({ force: true });
    cy.get('[data-testid=menu-my-worklist-button]').click({ force: true });
  });

  it('The Curator should be able to view worklist', () => {
    cy.url().should('include', '/worklist');
  });

  it('The Curator should be able to open an item in the DOI request list and see the summary of the registration', () => {
    const { identifier } = mockMessages[0].publication;
    cy.get(`[data-testid=message-${identifier}]`).click();
    cy.get(`[data-testid=go-to-registration-${identifier}]`).click();
    cy.url().should('include', `/registration/${identifier}/public`);
  });
});
