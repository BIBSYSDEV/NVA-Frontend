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

  it('The User should be able to open Landing Page from My Registrations', () => {
    cy.mocklogin();
    cy.get(`[data-testid=${dataTestId.header.menuButton}]`).click();
    cy.get(`[data-testid=${dataTestId.header.myRegistrationsLink}]`).click();
    cy.get('[data-testid^=open-registration]').eq(0).click();

    cy.url().should('include', '/public');
    cy.get(`[data-testid=${status}]`).should('exist');
  });

  it('Anonymous user should be able to open Landing Page for Registration', () => {
    cy.visit(pathToLandingPage);
    cy.get('[data-testid=my-registrations-link]').should('not.exist');
    cy.get(`[data-testid=${status}]`).should('not.exist');
  });

  it('Project should have a link to Landing Page for Project', () => {
    cy.visit(pathToLandingPage);
    cy.get(`[data-testid=${projectTitle}]`).should('exist');
    cy.get(`[data-testid=${projectTitle}] > a`).click();

    cy.url().should('include', '/project');
    cy.get(`[data-testid=${generalInfoBox}]`).should('exist');
    cy.get(`[data-testid=${participantsAccordion}]`).should('exist');
    cy.get(`[data-testid=${resultsAccordion}]`).should('exist');
    cy.get(`[data-testid=${scientificSummaryAccordion}]`).should('exist');
  });
});
