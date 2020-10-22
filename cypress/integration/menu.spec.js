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
    cy.get('[data-testid=new-registration]').should('be.visible');
    cy.get('[data-testid=my-registrations]').should('be.visible');
    cy.get('[data-testid=menu-admin-institution-button]').should('be.visible');
    cy.get('[data-testid=menu-logout-button]').should('be.visible');
  });

  it('Unauthorized user should not see protected menu options', () => {
    cy.setUserRolesInRedux(noRoles);
    cy.get('[data-testid=menu]').click({ force: true });
    cy.get('[data-testid=menu-user-profile-button]').should('be.visible');
    cy.get('[data-testid=new-registration]').should('not.be.visible');
    cy.get('[data-testid=my-registrations]').should('not.be.visible');
    cy.get('[data-testid=menu-admin-institution-button]').should('not.be.visible');
    cy.get('[data-testid=menu-logout-button]').should('be.visible');
  });

  it('Unauthorized user should see Forbidden page when visiting protected URLs', () => {
    cy.visit('/registration');
    cy.setUserRolesInRedux(noRoles);
    cy.get('[data-testid=forbidden]').should('be.visible');

    cy.visit('/my-registrations');
    cy.setUserRolesInRedux(noRoles);
    cy.get('[data-testid=forbidden]').should('be.visible');

    cy.visit('/worklist');
    cy.setUserRolesInRedux(noRoles);
    cy.get('[data-testid=forbidden]').should('be.visible');

    cy.visit('/my-institution');
    cy.setUserRolesInRedux(noRoles);
    cy.get('[data-testid=forbidden]').should('be.visible');

    cy.visit('/my-institution-users');
    cy.setUserRolesInRedux(noRoles);
    cy.get('[data-testid=forbidden]').should('be.visible');

    cy.visit('/admin-institutions');
    cy.setUserRolesInRedux(noRoles);
    cy.get('[data-testid=forbidden]').should('be.visible');
  });
});
