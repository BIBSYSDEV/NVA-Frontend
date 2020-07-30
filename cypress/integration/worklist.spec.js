import { RoleName } from '../../src/types/user.types';

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

    cy.get('[data-testid=for-approval-button]').click({ force: true });
    cy.get('[data-testid=doi-requests-button]').click({ force: true });
  });

  it('The Curator should be able to open an item in the DOI request list and see the summary of the publication', () => {
    cy.get('[data-testid=doi-requests-button]').click({ force: true });
    cy.get('[data-testid=open-publication-12345678]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-submission]').should('be.visible');
  });
});
