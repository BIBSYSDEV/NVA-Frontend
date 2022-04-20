import { RoleName } from '../../src/types/user.types';
import { dataTestId } from '../../src/utils/dataTestIds';
import { UrlPathTemplate } from '../../src/utils/urlPaths';

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
    cy.get(`[data-testid=${dataTestId.header.basicDataLink}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.header.editorLink}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.header.logOutLink}]`).should('be.visible');
  });

  it('Unauthorized user should not see protected menu options', () => {
    cy.setUserRolesInRedux(noRoles);
    cy.get(`[data-testid=${dataTestId.header.menuButton}]`).click({ force: true });
    cy.get(`[data-testid=${dataTestId.header.myProfileLink}]`).should('be.visible');
    cy.get('[data-testid=new-registration]').should('not.exist');
    cy.get('[data-testid=my-registrations-link]').should('not.exist');
    cy.get(`[data-testid=${dataTestId.header.basicDataLink}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.header.editorLink}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.header.logOutLink}]`).should('be.visible');
  });

  it('Unauthorized user should see Forbidden page when visiting protected URLs', () => {
    cy.visit(UrlPathTemplate.NewRegistration);
    cy.setUserRolesInRedux(noRoles);
    cy.get('[data-testid=forbidden]').should('be.visible');

    cy.visit(UrlPathTemplate.MyRegistrations);
    cy.setUserRolesInRedux(noRoles);
    cy.get('[data-testid=forbidden]').should('be.visible');

    cy.visit(UrlPathTemplate.Worklist);
    cy.setUserRolesInRedux(noRoles);
    cy.get('[data-testid=forbidden]').should('be.visible');

    cy.visit(UrlPathTemplate.BasicData);
    cy.setUserRolesInRedux(noRoles);
    cy.get('[data-testid=forbidden]').should('be.visible');

    cy.visit(UrlPathTemplate.BasicDataMyInstitution);
    cy.setUserRolesInRedux(noRoles);
    cy.get('[data-testid=forbidden]').should('be.visible');

    cy.visit(UrlPathTemplate.BasicDataUsers);
    cy.setUserRolesInRedux(noRoles);
    cy.get('[data-testid=forbidden]').should('be.visible');

    cy.visit(UrlPathTemplate.Editor);
    cy.setUserRolesInRedux(noRoles);
    cy.get('[data-testid=forbidden]').should('be.visible');
  });
});
