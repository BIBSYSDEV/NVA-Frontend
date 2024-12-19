import { RoleName } from '../../src/types/user.types';
import { dataTestId } from '../../src/utils/dataTestIds';
import { UrlPathTemplate } from '../../src/utils/urlPaths';

const allRoles = Object.values(RoleName);

describe('Menu', () => {
  beforeEach(() => {
    cy.visit(UrlPathTemplate.Home);
  });

  it('Unauthenticated user should not see protected menu options', () => {
    cy.get(`[data-testid=${dataTestId.header.logInButton}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.header.newRegistrationLink}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.header.myPageLink}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.header.basicDataLink}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.header.tasksLink}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.header.editorLink}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.header.menuButton}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.header.logOutLink}]`).should('not.exist');
  });

  it('Authorized user should see protected menu options', () => {
    cy.mocklogin();
    cy.setUserRolesInRedux(allRoles);
    cy.get(`[data-testid=${dataTestId.header.logInButton}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.header.newRegistrationLink}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.header.myPageLink}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.header.basicDataLink}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.header.tasksLink}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.header.editorLink}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.header.menuButton}]`).click();
    cy.get(`[data-testid=${dataTestId.header.logOutLink}]`).should('be.visible');
  });

  // it('Unauthorized user should not see protected menu options', () => {
  //   cy.visit(UrlPathTemplate.Home);
  //   cy.mocklogin();
  //   cy.setUserRolesInRedux([]);
  //   cy.get(`[data-testid=${dataTestId.header.newRegistrationLink}]`).should('not.exist');
  //   cy.get(`[data-testid=${dataTestId.header.myPageLink}]`).should('be.visible');
  //   cy.get(`[data-testid=${dataTestId.header.basicDataLink}]`).should('not.exist');
  //   cy.get(`[data-testid=${dataTestId.header.editorLink}]`).should('not.exist');
  //   cy.get(`[data-testid=${dataTestId.header.menuButton}]`).click();
  //   cy.get(`[data-testid=${dataTestId.header.logOutLink}]`).should('be.visible');
  // });

  // it('User without roles sees My Page menu options', () => {
  //   cy.visit(UrlPathTemplate.Home);
  //   cy.mocklogin();
  //   cy.setUserRolesInRedux([]);
  //   cy.get(`[data-testid=${dataTestId.header.myPageLink}]`).click();

  //   cy.get(`[data-testid=${dataTestId.myPage.messagesAccordion}]`).should('not.exist');
  //   cy.get(`[data-testid=${dataTestId.myPage.myRegistrationsLink}]`).should('not.exist');
  //   cy.get(`[data-testid=${dataTestId.myPage.myProfileAccordion}]`).click();
  //   cy.get(`[data-testid=${dataTestId.myPage.myProfileLink}]`).should('be.visible');
  //   cy.get(`[data-testid=${dataTestId.myPage.researchProfileAccordion}]`).click();
  //   cy.get(`[data-testid=${dataTestId.myPage.researchProfileLink}]`).should('be.visible');
  // });

  // it('Creator without roles sees My Page menu options', () => {
  //   cy.visit(UrlPathTemplate.Home);
  //   cy.mocklogin();
  //   cy.setUserRolesInRedux([RoleName.Creator]);
  //   cy.get(`[data-testid=${dataTestId.header.myPageLink}]`).click();

  //   cy.get(`[data-testid=${dataTestId.myPage.messagesAccordion}]`).click();
  //   cy.get(`[data-testid=${dataTestId.tasksPage.typeSearch.publishingButton}]`).should('be.visible');
  //   cy.get(`[data-testid=${dataTestId.tasksPage.typeSearch.doiButton}]`).should('be.visible');
  //   cy.get(`[data-testid=${dataTestId.tasksPage.typeSearch.supportButton}]`).should('be.visible');
  //   cy.get(`[data-testid=${dataTestId.myPage.registrationsAccordion}]`).click();
  //   cy.get(`[data-testid=${dataTestId.myPage.myRegistrationsPublishedCheckbox}]`).should('be.visible');
  //   cy.get(`[data-testid=${dataTestId.myPage.myRegistrationsUnpublishedCheckbox}]`).should('be.visible');
  //   cy.get(`[data-testid=${dataTestId.myPage.researchProfileAccordion}]`).click();
  //   cy.get(`[data-testid=${dataTestId.myPage.researchProfileLink}]`).should('be.visible');
  //   cy.get(`[data-testid=${dataTestId.myPage.myProfileAccordion}]`).click();
  //   cy.get(`[data-testid=${dataTestId.myPage.myProfileLink}]`).should('be.visible');
  // });

  // it('App-admin sees Basic Data menu options', () => {
  //   cy.visit(UrlPathTemplate.Home);
  //   cy.mocklogin();
  //   cy.setUserRolesInRedux([RoleName.AppAdmin]);
  //   cy.get(`[data-testid=${dataTestId.header.basicDataLink}]`).click();
  //   cy.get(`[data-testid=${dataTestId.basicData.personRegisterLink}]`).should('not.exist');
  //   cy.get(`[data-testid=${dataTestId.basicData.addEmployeeLink}]`).should('not.exist');
  //   cy.get(`[data-testid=${dataTestId.basicData.centralImportLink}]`).should('be.visible');
  //   cy.get(`[data-testid=${dataTestId.basicData.adminInstitutionsLink}]`).should('be.visible');
  // });

  // it('Insitution-admin sees Basic Data menu options', () => {
  //   cy.visit(UrlPathTemplate.Home);
  //   cy.mocklogin();
  //   cy.setUserRolesInRedux([RoleName.InstitutionAdmin]);
  //   cy.get(`[data-testid=${dataTestId.header.basicDataLink}]`).click();
  //   cy.get(`[data-testid=${dataTestId.header.basicDataLink}]`).click();
  //   cy.get(`[data-testid=${dataTestId.basicData.personRegisterLink}]`).should('be.visible');
  //   cy.get(`[data-testid=${dataTestId.basicData.addEmployeeLink}]`).should('be.visible');
  //   cy.get(`[data-testid=${dataTestId.basicData.centralImportLink}]`).should('not.exist');
  //   cy.get(`[data-testid=${dataTestId.basicData.adminInstitutionsLink}]`).should('not.exist');
  // });

  // it('User sees Editor Page menu options', () => {
  //   cy.visit(UrlPathTemplate.Home);
  //   cy.mocklogin();
  //   cy.setUserRolesInRedux([RoleName.Editor]);
  //   cy.get(`[data-testid=${dataTestId.header.editorLink}]`).click();

  //   cy.get(`[data-testid=${dataTestId.editor.overviewAccordion}]`).should('be.visible');
  //   cy.get(`[data-testid=${dataTestId.editor.areaOfResponsibilityLinkButton}]`).should('be.visible');
  //   cy.get(`[data-testid=${dataTestId.editor.settingsAccordion}]`).click();
  //   cy.get(`[data-testid=${dataTestId.editor.institutionsNameLinkButton}]`).should('be.visible');
  //   cy.get(`[data-testid=${dataTestId.editor.vocabularyLinkButton}]`).should('be.visible');
  //   cy.get(`[data-testid=${dataTestId.editor.publishStrategyLinkButton}]`).should('be.visible');
  //   cy.get(`[data-testid=${dataTestId.editor.doiLinkButton}]`).should('be.visible');
  // });

  // it('Unauthorized user should see Forbidden page when visiting new registration', () => {
  //   cy.visit(UrlPathTemplate.RegistrationNew);
  //   cy.get('[data-testid=forbidden]').should('be.visible');
  //   cy.mocklogin();
  //   cy.get('[data-testid=forbidden]').should('not.exist');
  //   cy.setUserRolesInRedux([]);
  //   cy.get('[data-testid=forbidden]').should('be.visible');
  // });

  // it('Unauthorized user should see Forbidden page when visiting my registrations', () => {
  //   cy.visit(UrlPathTemplate.MyPageMyRegistrations);
  //   cy.get('[data-testid=forbidden]').should('be.visible');
  //   cy.mocklogin();
  //   cy.get('[data-testid=forbidden]').should('not.exist');
  //   cy.setUserRolesInRedux([]);
  //   cy.get('[data-testid=forbidden]').should('be.visible');
  // });

  // it('Unauthorized user should see Forbidden page when visiting tasks', () => {
  //   cy.visit(UrlPathTemplate.Tasks);
  //   cy.get('[data-testid=forbidden]').should('be.visible');
  //   cy.mocklogin();
  //   cy.get('[data-testid=forbidden]').should('not.exist');
  //   cy.setUserRolesInRedux([]);
  //   cy.get('[data-testid=forbidden]').should('be.visible');
  // });

  // it('Unauthorized user should see Forbidden page when visiting basic data', () => {
  //   cy.visit(UrlPathTemplate.BasicData);
  //   cy.get('[data-testid=forbidden]').should('be.visible');
  //   cy.mocklogin();
  //   cy.get('[data-testid=forbidden]').should('not.exist');
  //   cy.setUserRolesInRedux([]);
  //   cy.get('[data-testid=forbidden]').should('be.visible');
  // });

  // it('Unauthorized user should see Forbidden page when visiting editor page', () => {
  //   cy.visit(UrlPathTemplate.Institution);
  //   cy.get('[data-testid=forbidden]').should('be.visible');
  //   cy.mocklogin();
  //   cy.get('[data-testid=forbidden]').should('not.exist');
  //   cy.setUserRolesInRedux([]);
  //   cy.get('[data-testid=forbidden]').should('be.visible');
  // });
});
