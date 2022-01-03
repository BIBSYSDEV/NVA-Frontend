import { RoleName } from '../../src/types/user.types';
import { dataTestId } from '../../src/utils/dataTestIds';

const noRoles = [];
const allRoles = Object.values(RoleName);

describe('Menu', () => {
  beforeEach(() => {
    cy.visit('/my-profile');
    cy.mocklogin();
  });

  it('Authorized user should see protected menu options', () => {
    cy.setUserRolesInRedux(allRoles);
    cy.get(`[data-testid=${dataTestId.header.menuButton}]`).click({ force: true });
    cy.get(`[data-testid=${dataTestId.header.myProfileLink}]`).should('be.visible');
    cy.get('[data-testid=new-registration]').should('be.visible');
    cy.get('[data-testid=my-registrations-link]').should('be.visible');
    cy.get(`[data-testid=${dataTestId.header.adminInstitutionLink}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.header.editorLink}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.header.logOutLink}]`).should('be.visible');
  });

  it('Unauthorized user should not see protected menu options', () => {
    cy.setUserRolesInRedux(noRoles);
    cy.get(`[data-testid=${dataTestId.header.menuButton}]`).click({ force: true });
    cy.get(`[data-testid=${dataTestId.header.myProfileLink}]`).should('be.visible');
    cy.get('[data-testid=new-registration]').should('not.exist');
    cy.get('[data-testid=my-registrations-link]').should('not.exist');
    cy.get(`[data-testid=${dataTestId.header.adminInstitutionLink}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.header.editorLink}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.header.logOutLink}]`).should('be.visible');
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

    cy.visit('/editor');
    cy.setUserRolesInRedux(noRoles);
    cy.get('[data-testid=forbidden]').should('be.visible');
  });
});
