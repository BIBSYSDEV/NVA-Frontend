import { RoleName } from '../../src/types/user.types';
import { dataTestId } from '../../src/utils/dataTestIds';
import { UrlPathTemplate } from '../../src/utils/urlPaths';

const allRoles = Object.values(RoleName);
const waitBeforeUserUpdate = 500;

describe('Menu', () => {
  it('Unauthenticated user should not see protected menu options', () => {
    cy.visit(UrlPathTemplate.Root);
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
    cy.visit(UrlPathTemplate.Root);
    cy.mocklogin();
    cy.wait(waitBeforeUserUpdate);
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

  it('Unauthorized user should not see protected menu options', () => {
    cy.visit(UrlPathTemplate.Root);
    cy.mocklogin();
    cy.wait(waitBeforeUserUpdate);
    cy.setUserRolesInRedux([]);

    cy.get(`[data-testid=${dataTestId.header.logInButton}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.header.newRegistrationLink}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.header.myPageLink}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.header.basicDataLink}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.header.tasksLink}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.header.editorLink}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.header.menuButton}]`).click();
    cy.get(`[data-testid=${dataTestId.header.logOutLink}]`).should('be.visible');
  });

  it('User without roles sees My Page menu options', () => {
    cy.visit(UrlPathTemplate.Root);
    cy.mocklogin();
    cy.wait(waitBeforeUserUpdate);
    cy.setUserRolesInRedux([]);
    cy.get(`[data-testid=${dataTestId.header.myPageLink}]`).click();

    cy.get(`[data-testid=${dataTestId.myPage.messagesAccordion}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.myPage.myRegistrationsLink}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.myPage.researchProfileAccordion}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.myPage.myProfileLink}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.myPage.myFieldAndBackgroundLink}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.myPage.myResultsLink}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.myPage.myProjectsLink}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.myPage.userRolesAndHelpLink}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.myPage.termsLink}]`).should('be.visible');
  });

  it('Creator without roles sees My Page menu options', () => {
    cy.visit(UrlPathTemplate.Root);
    cy.mocklogin();
    cy.wait(waitBeforeUserUpdate);
    cy.setUserRolesInRedux([RoleName.Creator]);
    cy.get(`[data-testid=${dataTestId.header.myPageLink}]`).click();

    cy.get(`[data-testid=${dataTestId.myPage.messagesAccordion}]`).click();
    cy.get(`[data-testid=${dataTestId.tasksPage.typeSearch.publishingButton}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.tasksPage.typeSearch.doiButton}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.tasksPage.typeSearch.supportButton}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.myPage.registrationsAccordion}]`).click();
    cy.get(`[data-testid=${dataTestId.myPage.myRegistrationsPublishedCheckbox}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.myPage.myRegistrationsUnpublishedCheckbox}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.myPage.researchProfileAccordion}]`).click();
  });

  it('App-admin sees Basic Data menu options', () => {
    cy.visit(UrlPathTemplate.Root);
    cy.mocklogin();
    cy.wait(waitBeforeUserUpdate);
    cy.setUserRolesInRedux([RoleName.AppAdmin]);
    cy.get(`[data-testid=${dataTestId.header.basicDataLink}]`).click();

    cy.get(`[data-testid=${dataTestId.basicData.personRegisterAccordion}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.basicData.institutionsAccordion}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.basicData.nviPeriodsLink}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.basicData.centralImportAccordion}]`).should('not.exist');
  });

  it('Insitution-admin sees Basic Data menu options', () => {
    cy.visit(UrlPathTemplate.Root);
    cy.mocklogin();
    cy.wait(waitBeforeUserUpdate);
    cy.setUserRolesInRedux([RoleName.InstitutionAdmin]);
    cy.get(`[data-testid=${dataTestId.header.basicDataLink}]`).click();

    cy.get(`[data-testid=${dataTestId.basicData.personRegisterAccordion}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.basicData.addEmployeeLink}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.basicData.institutionsAccordion}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.basicData.nviPeriodsLink}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.basicData.centralImportAccordion}]`).should('not.exist');
  });

  it('Internal-importer sees Basic Data menu options', () => {
    cy.visit(UrlPathTemplate.Root);
    cy.mocklogin();
    cy.wait(waitBeforeUserUpdate);
    cy.setUserRolesInRedux([RoleName.InternalImporter]);
    cy.get(`[data-testid=${dataTestId.header.basicDataLink}]`).click();

    cy.get(`[data-testid=${dataTestId.basicData.personRegisterAccordion}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.basicData.addEmployeeLink}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.basicData.institutionsAccordion}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.basicData.nviPeriodsLink}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.basicData.centralImportAccordion}]`).should('be.visible');
  });

  it('User sees Institution Page menu options', () => {
    cy.visit(UrlPathTemplate.Root);
    cy.mocklogin();
    cy.wait(waitBeforeUserUpdate);
    cy.setUserRolesInRedux([]);
    cy.get(`[data-testid=${dataTestId.header.editorLink}]`).click();

    cy.get(`[data-testid=${dataTestId.editor.institutionsNameLinkButton}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.editor.organizationOverviewLinkButton}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.editor.curatorsOverviewLinkButton}]`).click();
    cy.get(`[data-testid=${dataTestId.editor.doiLinkButton}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.editor.publishStrategyOverviewLinkButton}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.editor.vocabularyOverviewLinkButton}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.editor.categoriesLinkButton}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.editor.settingsAccordion}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.editor.resultsPortfolioAccordion}]`).should('not.exist');
  });

  it('Editor sees Institution Page menu options', () => {
    cy.visit(UrlPathTemplate.Root);
    cy.mocklogin();
    cy.wait(waitBeforeUserUpdate);
    cy.setUserRolesInRedux([RoleName.Editor]);
    cy.get(`[data-testid=${dataTestId.header.editorLink}]`).click();

    cy.get(`[data-testid=${dataTestId.editor.overviewAccordion}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.editor.settingsAccordion}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.editor.resultsPortfolioAccordion}]`).should('be.visible');
  });

  it('Curator sees Tasks Page menu options', () => {
    cy.visit(UrlPathTemplate.Root);
    cy.mocklogin();
    cy.wait(waitBeforeUserUpdate);
    cy.setUserRolesInRedux([RoleName.SupportCurator, RoleName.DoiCurator, RoleName.PublishingCurator]);
    cy.get(`[data-testid=${dataTestId.header.tasksLink}]`).click();

    cy.get(`[data-testid=${dataTestId.tasksPage.userDialogAccordion}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.tasksPage.resultRegistrationsAccordion}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.tasksPage.nviAccordion}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.tasksPage.correctionList.correctionListAccordion}]`).should('not.exist');
  });

  it('NVI Curator sees Tasks Page menu options', () => {
    cy.visit(UrlPathTemplate.Root);
    cy.mocklogin();
    cy.wait(waitBeforeUserUpdate);
    cy.setUserRolesInRedux([RoleName.NviCurator]);
    cy.get(`[data-testid=${dataTestId.header.tasksLink}]`).click();

    cy.get(`[data-testid=${dataTestId.tasksPage.userDialogAccordion}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.tasksPage.resultRegistrationsAccordion}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.tasksPage.nviAccordion}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.tasksPage.correctionList.correctionListAccordion}]`).should('be.visible');
  });

  it('Unauthorized user should see Forbidden page when visiting new registration', () => {
    cy.visit(UrlPathTemplate.RegistrationNew);
    cy.get('[data-testid=forbidden]').should('be.visible');
    cy.mocklogin();
    cy.wait(waitBeforeUserUpdate);
    cy.get('[data-testid=forbidden]').should('not.exist');
    cy.setUserRolesInRedux([]);
    cy.get('[data-testid=forbidden]').should('be.visible');
  });

  it('Unauthorized user should see Forbidden page when visiting my registrations', () => {
    cy.visit(UrlPathTemplate.MyPageMyRegistrations);
    cy.get('[data-testid=forbidden]').should('be.visible');
    cy.mocklogin();
    cy.wait(waitBeforeUserUpdate);
    cy.get('[data-testid=forbidden]').should('not.exist');
    cy.setUserRolesInRedux([]);
    cy.get('[data-testid=forbidden]').should('be.visible');
  });

  it('Unauthorized user should see Forbidden page when visiting tasks', () => {
    cy.visit(UrlPathTemplate.Tasks);
    cy.get('[data-testid=forbidden]').should('be.visible');
    cy.mocklogin();
    cy.wait(waitBeforeUserUpdate);
    cy.get('[data-testid=forbidden]').should('not.exist');
    cy.setUserRolesInRedux([]);
    cy.get('[data-testid=forbidden]').should('be.visible');
  });

  it('Unauthorized user should see Forbidden page when visiting basic data', () => {
    cy.visit(UrlPathTemplate.BasicData);
    cy.get('[data-testid=forbidden]').should('be.visible');
    cy.mocklogin();
    cy.wait(waitBeforeUserUpdate);
    cy.get('[data-testid=forbidden]').should('not.exist');
    cy.setUserRolesInRedux([]);
    cy.get('[data-testid=forbidden]').should('be.visible');
  });

  it('Unauthorized user should see Forbidden page when visiting editor page', () => {
    cy.visit(UrlPathTemplate.InstitutionOverviewPage);
    cy.get('[data-testid=forbidden]').should('be.visible');
    cy.mocklogin();
    cy.wait(waitBeforeUserUpdate);
    cy.get('[data-testid=forbidden]').should('not.exist');
    cy.setUserRolesInRedux([]);
    cy.get('[data-testid=forbidden]').should('not.exist');
  });
});
