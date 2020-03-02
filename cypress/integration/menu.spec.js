import { mockUser } from '../../src/utils/testfiles/mock_feide_user';

// Weird array format for affiliation is due to current format delivered by FEIDE
const authorizedUser = { ...mockUser, 'custom:affiliation': '[member, employee, staff]', email: 'ost@unit.no' };
const unauthorizedUser = { ...mockUser, 'custom:affiliation': '[]', email: 'ost@loff.org' };

describe('Menu', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/user');
  });

  it('Authorized user should see protected menu options', () => {
    cy.get('[data-testid=menu-login-button]').click({ force: true });
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
    cy.get('[data-testid=menu-login-button]').click({ force: true });
    cy.setUserInRedux(unauthorizedUser);

    cy.get('[data-testid=menu]').click({ force: true });
    cy.get('[data-testid=menu-user-profile-button]').should('be.visible');
    cy.get('[data-testid=menu-logout-button]').should('be.visible');
    cy.get('[data-testid=menu-admin-institution-button]').should('not.be.visible');
    cy.get('[data-testid=menu-my-publications-button]').should('not.be.visible');
    cy.get('[data-testid=menu-my-worklist-button]').should('not.be.visible');
    cy.get('[data-testid=new-publication-button]').should('not.be.visible');
  });

  it('Unauthorized user should see 404-message when visiting protected URLs', () => {
    cy.visit('/publication');
    cy.get('[data-testid=menu-login-button]').click({ force: true });
    cy.setUserInRedux(unauthorizedUser);
    cy.contains('404');

    cy.visit('/my-publications');
    cy.get('[data-testid=menu-login-button]').click({ force: true });
    cy.setUserInRedux(unauthorizedUser);
    cy.contains('404');

    cy.visit('/admin-institutions');
    cy.get('[data-testid=menu-login-button]').click({ force: true });
    cy.setUserInRedux(unauthorizedUser);
    cy.contains('404');

    cy.visit('/worklist');
    cy.get('[data-testid=menu-login-button]').click({ force: true });
    cy.setUserInRedux(unauthorizedUser);
    cy.contains('404');
  });
});
