import { RoleName } from '../../src/types/user.types';
import { dataTestId } from '../../src/utils/dataTestIds';
import { UrlPathTemplate } from '../../src/utils/urlPaths';

const allRoles = Object.values(RoleName);

describe('Menu', () => {
  it('Unauthenticated user should not see protected menu options', () => {
    cy.visit(UrlPathTemplate.Home);
    cy.get(`[data-testid=${dataTestId.header.logInButton}]`).should('be.visible');
    cy.get('[data-testid=new-registration]').should('not.exist');
    cy.get(`[data-testid=${dataTestId.header.myPageLink}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.header.basicDataLink}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.header.editorLink}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.header.logOutLink}]`).should('not.exist');
  });

  it('Authorized user should see protected menu options', () => {
    cy.visit(UrlPathTemplate.Home);
    cy.mocklogin();
    cy.setUserRolesInRedux(allRoles);
    cy.get(`[data-testid=${dataTestId.header.menuButton}]`).click();
    cy.get('[data-testid=new-registration]').should('be.visible');
    cy.get(`[data-testid=${dataTestId.header.myPageLink}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.header.basicDataLink}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.header.editorLink}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.header.logOutLink}]`).should('be.visible');
  });

  it('Unauthorized user should not see protected menu options', () => {
    cy.visit(UrlPathTemplate.Home);
    cy.mocklogin();
    cy.setUserRolesInRedux([]);
    cy.get(`[data-testid=${dataTestId.header.menuButton}]`).click();
    cy.get('[data-testid=new-registration]').should('not.exist');
    cy.get(`[data-testid=${dataTestId.header.myPageLink}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.header.basicDataLink}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.header.editorLink}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.header.logOutLink}]`).should('be.visible');
  });

  it('User sees My Page menu options', () => {
    cy.visit(UrlPathTemplate.Home);
    cy.mocklogin();
    cy.get(`[data-testid=${dataTestId.header.myPageLink}]`).click();

    cy.setUserRolesInRedux([]);
    cy.get(`[data-testid=${dataTestId.myPage.messagesLink}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.myPage.myRegistrationsLink}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.myPage.myProfileLink}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.myPage.researchProfileLink}]`).should('be.visible');

    cy.setUserRolesInRedux([RoleName.Creator]);
    cy.get(`[data-testid=${dataTestId.myPage.messagesLink}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.myPage.myRegistrationsLink}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.myPage.myProfileLink}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.myPage.researchProfileLink}]`).should('be.visible');
  });

  it('User sees Basic Data menu options', () => {
    cy.visit(UrlPathTemplate.Home);
    cy.mocklogin();
    cy.setUserRolesInRedux([RoleName.AppAdmin]);
    cy.get(`[data-testid=${dataTestId.header.basicDataLink}]`).click();

    cy.get(`[data-testid=${dataTestId.basicData.personRegisterLink}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.basicData.addEmployeeLink}]`).should('not.exist');
    // cy.get(`[data-testid=${dataTestId.basicData.centralImportLink}]`).should('be.visible'); // TODO: Remove comment when out of beta
    cy.get(`[data-testid=${dataTestId.basicData.adminInstitutionsLink}]`).should('be.visible');

    cy.setUserRolesInRedux([RoleName.InstitutionAdmin]);
    cy.get(`[data-testid=${dataTestId.header.basicDataLink}]`).click();
    cy.get(`[data-testid=${dataTestId.basicData.personRegisterLink}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.basicData.addEmployeeLink}]`).should('be.visible');
    // cy.get(`[data-testid=${dataTestId.basicData.centralImportLink}]`).should('not.exist'); // TODO: Remove comment when out of beta
    cy.get(`[data-testid=${dataTestId.basicData.adminInstitutionsLink}]`).should('not.exist');
  });

  it('User sees Editor Page menu options', () => {
    cy.visit(UrlPathTemplate.Home);
    cy.mocklogin();
    cy.setUserRolesInRedux([RoleName.Editor]);
    cy.get(`[data-testid=${dataTestId.header.editorLink}]`).click();

    cy.get(`[data-testid=${dataTestId.editor.institutionsNameLinkButton}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.editor.vocabularyLinkButton}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.editor.publishStrategyLinkButton}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.editor.areaOfResponsibilityLinkButton}]`).should('be.visible');
  });

  it('Unauthorized user should see Forbidden page when visiting protected URLs', () => {
    cy.visit(UrlPathTemplate.NewRegistration);
    cy.mocklogin();
    cy.setUserRolesInRedux([]);
    cy.get('[data-testid=forbidden]').should('be.visible');

    cy.visit(UrlPathTemplate.MyPageRegistrations);
    cy.mocklogin();
    cy.setUserRolesInRedux([]);
    cy.get('[data-testid=forbidden]').should('be.visible');

    cy.visit(UrlPathTemplate.Tasks);
    cy.mocklogin();
    cy.setUserRolesInRedux([]);
    cy.get('[data-testid=forbidden]').should('be.visible');

    cy.visit(UrlPathTemplate.BasicData);
    cy.mocklogin();
    cy.setUserRolesInRedux([]);
    cy.get('[data-testid=forbidden]').should('be.visible');

    cy.visit(UrlPathTemplate.Editor);
    cy.mocklogin();
    cy.setUserRolesInRedux([]);
    cy.get('[data-testid=forbidden]').should('be.visible');
  });
});
