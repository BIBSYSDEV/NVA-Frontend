describe('User opens Landing Page for Registration', () => {
  beforeEach('Given that the user is logged in as Creator:', () => {
    cy.visit('/');
  });

  it('The User should be able to open Landing Page from My Registrations', () => {
    cy.mocklogin();
    cy.get('[data-testid=my-registrations]').click({ force: true });
    cy.get('[data-testid^=open-registration]').eq(0).click({ force: true });

    cy.url().should('include', '/public');
    cy.get('[data-testid=public-registration-status]').should('be.visible');
  });

  it('Anonymous user should be able to open Landing Page for Registration', () => {
    cy.visit('/registration/123/public');
    cy.get('[data-testid=my-registrations]').should('not.exist');

    cy.get('[data-testid=public-registration-status]').should('not.exist');
  });

  it('Project should have a link to Landing Page for Project', () => {
    cy.visit('/registration/123/public');
    cy.get('[data-testid=project-title]').should('be.visible');
    cy.get('[data-testid=project-title] > a').click({ force: true });

    cy.url().should('include', '/project');
    cy.get('[data-testid=general-info]').should('be.visible');
    cy.get('[data-testid=participants-accordion]').should('be.visible');
    cy.get('[data-testid=results-accordion]').should('be.visible');
    cy.get('[data-testid=scientific-summary-accordion]').should('be.visible');
  });
});
