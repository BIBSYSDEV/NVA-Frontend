import { dataTestId } from '../../src/utils/dataTestIds';
import { mockPublishedRegistration } from '../../src/utils/testfiles/mockRegistration';
const {
  registrationLandingPage: { projectTitle, status },
  projectLandingPage: { generalInfoBox, participantsAccordion, resultsAccordion, scientificSummaryAccordion },
} = dataTestId;

const pathToLandingPage = `/registration/${mockPublishedRegistration.identifier}/public`;

describe('User opens Landing Page for Registration', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Anonymous user should be able to open Landing Page for Registration', () => {
    cy.visit(pathToLandingPage);
    cy.injectAxe();
    cy.get(`[data-testid=${dataTestId.header.logInButton}]`).should('be.visible');
    cy.get(`[data-testid=${status}]`).should('not.exist');
    cy.checkA11y();
  });

  it('The User should be able to open Landing Page from My Registrations', () => {
    cy.injectAxe();
    cy.mocklogin();
    cy.get(`[data-testid=${dataTestId.header.myPageLink}]`).click();
    cy.get(`[data-testid=${dataTestId.myPage.myRegistrationsLink}]`).click();
    cy.get('[data-testid^=open-registration]').eq(0).click();

    cy.url().should('include', '/public');
    cy.get(`[data-testid=${status}]`).should('be.visible');
    cy.checkA11y();
  });

  it('Project should have a link to Landing Page for Project', () => {
    cy.visit(pathToLandingPage);
    cy.injectAxe();
    cy.get(`[data-testid=${projectTitle}]`).should('be.visible');
    cy.get(`[data-testid=${projectTitle}] > a`).click();

    cy.url().should('include', '/project');
    cy.get(`[data-testid=${generalInfoBox}]`).should('be.visible');
    cy.get(`[data-testid=${participantsAccordion}]`).should('be.visible');
    cy.get(`[data-testid=${resultsAccordion}]`).should('be.visible');
    cy.get(`[data-testid=${scientificSummaryAccordion}]`).should('be.visible');
    cy.checkA11y();
  });
});
