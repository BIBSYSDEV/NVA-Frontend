import { RoleName } from '../../src/types/user.types';

const noRoles = [];
const allRoles = Object.values(RoleName);

describe('Menu', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/user');
    cy.mocklogin();
  });

  it('Authorized user should see protected menu options', () => {
    cy.setUserRolesInRedux(allRoles);
    cy.get('[data-testid=menu]').click({ force: true });
    cy.get('[data-testid=menu-user-profile-button]').should('be.visible');
    cy.get('[data-testid=new-publication]').should('be.visible');
    cy.get('[data-testid=my-publications]').should('be.visible');
    cy.get('[data-testid=menu-admin-institution-button]').should('be.visible');
    cy.get('[data-testid=menu-logout-button]').should('be.visible');
  });

  it('Unauthorized user should not see protected menu options', () => {
    cy.setUserRolesInRedux(noRoles);
    cy.get('[data-testid=menu]').click({ force: true });
    cy.get('[data-testid=menu-user-profile-button]').should('be.visible');
    cy.get('[data-testid=new-publication]').should('not.be.visible');
    cy.get('[data-testid=my-publications]').should('not.be.visible');
    cy.get('[data-testid=menu-admin-institution-button]').should('not.be.visible');
    cy.get('[data-testid=menu-logout-button]').should('be.visible');
  });

  it.skip('Unauthorized user should see 404-message when visiting protected URLs', () => {
    // TODO: find out how to preserve authentication when navigating
    cy.visit('/registration');
    cy.contains('404');

    cy.visit('/my-registrations');
    cy.setUserRolesInRedux(noRoles);
    cy.contains('404');

    cy.visit('/admin-institutions');
    cy.setUserRolesInRedux(noRoles);
    cy.contains('404');

    cy.visit('/worklist');
    cy.setUserRolesInRedux(noRoles);
    cy.contains('404');
  });
});
