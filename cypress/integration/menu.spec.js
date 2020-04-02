import { mockUser } from '../../src/utils/testfiles/mock_feide_user';

// Weird array format for affiliation is due to current format delivered by FEIDE
const authorizedUser = { ...mockUser, 'custom:affiliation': '[member, employee, staff]', email: 'ost@unit.no' };
const unauthorizedUser = { ...mockUser, 'custom:applicationRoles': '' };

describe('Menu', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/user');
    cy.mocklogin();
  });

  it('Authorized user should see protected menu options', () => {
    cy.setUserInRedux(authorizedUser);
    cy.get('[data-testid=menu]').click({ force: true });
    cy.get('[data-testid=menu-user-profile-button]').should('be.visible');
    cy.get('[data-testid=menu-my-publications-button]').should('be.visible');
    cy.get('[data-testid=menu-admin-institution-button]').should('be.visible');
    cy.get('[data-testid=menu-my-worklist-button]').should('be.visible');
    cy.get('[data-testid=menu-logout-button]').should('be.visible');
    cy.get('[data-testid=new-publication-button]').should('be.visible');
  });

  it('Unauthorized user should not see protected menu options', () => {
    cy.setUserInRedux(unauthorizedUser);
    cy.get('[data-testid=menu]').click({ force: true });
    cy.get('[data-testid=menu-user-profile-button]').should('be.visible');
    cy.get('[data-testid=menu-logout-button]').should('be.visible');
    cy.get('[data-testid=menu-admin-institution-button]').should('not.be.visible');
    cy.get('[data-testid=menu-my-publications-button]').should('not.be.visible');
    cy.get('[data-testid=menu-my-worklist-button]').should('not.be.visible');
    cy.get('[data-testid=new-publication-button]').should('not.be.visible');
  });

  it.skip('Unauthorized user should see 404-message when visiting protected URLs', () => {
    // TODO: find out how to preserve authentication when navigating
    cy.visit('/publication');
    cy.contains('404');

    cy.visit('/my-publications');
    cy.setUserInRedux(unauthorizedUser);
    cy.contains('404');

    cy.visit('/admin-institutions');
    cy.setUserInRedux(unauthorizedUser);
    cy.contains('404');

    cy.visit('/worklist');
    cy.setUserInRedux(unauthorizedUser);
    cy.contains('404');
  });
});
