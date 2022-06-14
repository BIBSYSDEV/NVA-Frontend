import { RoleName } from '../../src/types/user.types';
import { dataTestId } from '../../src/utils/dataTestIds';
import { UrlPathTemplate } from '../../src/utils/urlPaths';

const noRoles: RoleName[] = [];
const allRoles = Object.values(RoleName);

describe('Menu', () => {
  it('Authorized user should see protected menu options', () => {
    cy.visit(UrlPathTemplate.MyProfile);
    cy.mocklogin();
    cy.setUserRolesInRedux(allRoles);
    cy.get(`[data-testid=${dataTestId.header.menuButton}]`).click({ force: true });
    cy.get(`[data-testid=${dataTestId.header.myProfileLink}]`).should('be.visible');
    cy.get('[data-testid=new-registration]').should('be.visible');
    cy.get(`[data-testid=${dataTestId.header.myPageLink}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.header.basicDataLink}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.header.editorLink}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.header.logOutLink}]`).should('be.visible');
  });

  it('Unauthorized user should not see protected menu options', () => {
    cy.visit(UrlPathTemplate.MyProfile);
    cy.mocklogin();
    cy.setUserRolesInRedux(noRoles);
    cy.get(`[data-testid=${dataTestId.header.menuButton}]`).click({ force: true });
    cy.get(`[data-testid=${dataTestId.header.myProfileLink}]`).should('be.visible');
    cy.get('[data-testid=new-registration]').should('not.exist');
    cy.get(`[data-testid=${dataTestId.header.myPageLink}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.header.basicDataLink}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.header.editorLink}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.header.logOutLink}]`).should('be.visible');
  });

  it('Unauthorized user should see Forbidden page when visiting protected URLs', () => {
    cy.visit(UrlPathTemplate.NewRegistration);
    cy.mocklogin();
    cy.setUserRolesInRedux(noRoles);
    cy.get('[data-testid=forbidden]').should('be.visible');

    cy.visit(UrlPathTemplate.MyPageRegistrations);
    cy.mocklogin();
    cy.setUserRolesInRedux(noRoles);
    cy.get('[data-testid=forbidden]').should('be.visible');

    cy.visit(UrlPathTemplate.Worklist);
    cy.mocklogin();
    cy.setUserRolesInRedux(noRoles);
    cy.get('[data-testid=forbidden]').should('be.visible');

    cy.visit(UrlPathTemplate.BasicData);
    cy.mocklogin();
    cy.setUserRolesInRedux(noRoles);
    cy.get('[data-testid=forbidden]').should('be.visible');

    cy.visit(UrlPathTemplate.BasicDataMyInstitution);
    cy.mocklogin();
    cy.setUserRolesInRedux(noRoles);
    cy.get('[data-testid=forbidden]').should('be.visible');

    cy.visit(UrlPathTemplate.BasicDataUsers);
    cy.mocklogin();
    cy.setUserRolesInRedux(noRoles);
    cy.get('[data-testid=forbidden]').should('be.visible');

    cy.visit(UrlPathTemplate.Editor);
    cy.mocklogin();
    cy.setUserRolesInRedux(noRoles);
    cy.get('[data-testid=forbidden]').should('be.visible');
  });
});
