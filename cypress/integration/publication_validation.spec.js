const ErrorMessages = {
  REQUIRED: 'Required field',
  INVALID_DATE: 'Invalid Date Format',
};

describe('User opens publication form and can see validation errors', () => {
  before('Given that the user is logged in as Creator:', () => {
    cy.visit('/');
    cy.mocklogin();
    cy.get('[data-testid=menu]').click({ force: true });
    cy.get('[data-testid=menu-my-publications-button]').click({ force: true });
    cy.get('[data-testid=edit-publication-4327439]').click({ force: true });
  });

  it('The User should be able to see validation summary on submission tab', () => {
    // TODO: Test if tab is marked with error
    cy.get('[data-testid=nav-tabpanel-submission]').click({ force: true });
    cy.get('[data-testid=error-summary-card]').contains('Title: Required field');
    cy.get('[data-testid=error-summary-card]').contains('Publication type: Required field');
    cy.get('[data-testid=error-summary-card]').contains(
      'Authors: You need to have at least one author registered for this publication'
    );
    cy.get('[data-testid=error-summary-card]').contains('Publisher: Required field');
    cy.get('[data-testid=error-summary-card]').contains(
      'Files: You need to have at least one file uploaded for this publication'
    );
  });

  it('The User should be able to see validation errors on description tab', () => {
    cy.get('[data-testid=nav-tabpanel-description]').click({ force: true });

    // Title field
    cy.get('[data-testid=publication-title-field]').contains(ErrorMessages.REQUIRED).should('be.visible');
    cy.get('[data-testid=publication-title-input]').click({ force: true }).type('TITLE INPUT');
    cy.get('[data-testid=publication-title-field]').contains(ErrorMessages.REQUIRED).should('not.be.visible');

    // Date published field
    cy.get('[data-testid=date-published-field]')
      .parent()
      .within(() => {
        cy.get("input[type='text']").click({ force: true }).type('999');
      });
    cy.get('[data-testid=date-published-field]').contains(ErrorMessages.INVALID_DATE).should('be.visible');
    cy.get('[data-testid=date-published-field]')
      .parent()
      .within(() => {
        cy.get("input[type='text']").clear().click({ force: true }).type('01.01.2000');
      });
    cy.get('[data-testid=date-published-field]').contains(ErrorMessages.INVALID_DATE).should('not.be.visible');
  });

  it('The User should be able to see validation errors on reference tab', () => {
    cy.get('[data-testid=nav-tabpanel-references]').click({ force: true });
    cy.get('[data-testid=publication-context-type]').contains(ErrorMessages.REQUIRED).should('be.visible');

    // Journal type
    cy.get('[data-testid=publication-context-type]').click({ force: true }).type(' ');
    cy.get('[data-testid=publication-instance-type-Journal]').click({ force: true });

    // No errors should be displayed when user has just selected new context type
    // cy.contains(ErrorMessages.REQUIRED).should('not.be.visible'); // TODO: Fix bug

    cy.get('[data-testid=nav-tabpanel-description]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-references]').click({ force: true });
    cy.get(`p:contains(${ErrorMessages.REQUIRED})`).should('have.length', 2);

    cy.get('[data-testid=publication-instance-type]').click({ force: true }).type(' ');
    cy.get('[data-testid=publication-instance-type-JournalArticle]').click({ force: true });
    cy.get('[data-testid=autosearch-publisher]').click({ force: true }).type('natur');
    cy.contains('testament').click({ force: true });
    cy.contains(ErrorMessages.REQUIRED).should('not.be.visible');

    // TODO: Book type, Report type, etc
  });
});
