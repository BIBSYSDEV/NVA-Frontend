import { dataTestId } from '../../src/utils/dataTestIds';

const {
  registrationLandingPage: { projectTitle, status },
  projectLandingPage: { generalInfoBox, participantsAccordion, resultsAccordion, scientificSummaryAccordion },
} = dataTestId;

describe('User opens Landing Page for Registration', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('The User should be able to open Landing Page from My Registrations', () => {
    cy.mocklogin();
    cy.get('[data-testid=my-registrations]').click({ force: true });
    cy.get('[data-testid^=open-registration]').eq(0).click({ force: true });

    cy.url().should('include', '/public');
    cy.get(`[data-testid=${status}]`).should('be.visible');
  });

  it('Anonymous user should be able to open Landing Page for Registration', () => {
    cy.visit('/registration/123/public');
    cy.get('[data-testid=my-registrations]').should('not.exist');
    cy.get(`[data-testid=${status}]`).should('not.exist');
  });

  it('Project should have a link to Landing Page for Project', () => {
    cy.visit('/registration/123/public');
    cy.get(`[data-testid=${projectTitle}]`).should('be.visible');
    cy.get(`[data-testid=${projectTitle}] > a`).click({ force: true });

    cy.url().should('include', '/project');
    cy.get(`[data-testid=${generalInfoBox}]`).should('be.visible');
    cy.get(`[data-testid=${participantsAccordion}]`).should('be.visible');
    cy.get(`[data-testid=${resultsAccordion}]`).should('be.visible');
    cy.get(`[data-testid=${scientificSummaryAccordion}]`).should('be.visible');
  });
});
