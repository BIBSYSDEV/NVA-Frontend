const ErrorMessages = {
  REQUIRED: 'Required field',
  INVALID_DATE: 'Invalid Date Format',
};

describe('User opens publication form and can see validation errors', () => {
  before('Given that the user is logged in as Creator:', () => {
    cy.visit('/');
    cy.mocklogin();
  });

  it('The User should be able to see error messages for invalid fields', () => {
    // Open My Publications
    cy.get('[data-testid=menu]').click({ force: true });
    cy.get('[data-testid=menu-my-publications-button]').click({ force: true });
    cy.get('[data-testid=edit-publication-4327439]').click({ force: true });

    // TODO: Test if tab is marked with error

    // Test empty form
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

    // Description tab
    cy.get('[data-testid=nav-tabpanel-description]').click({ force: true });

    // Title field
    cy.get('[data-testid=publication-title-field]').contains(ErrorMessages.REQUIRED).should('be.visible');
    cy.get('[data-testid=publication-title-input]').click().type('TITLE INPUT');
    cy.get('[data-testid=publication-title-field]').contains(ErrorMessages.REQUIRED).should('not.be.visible');

    // Date published field
    cy.get('[data-testid=date-published-field]')
      .parent()
      .within(() => {
        cy.get("input[type='text']").click().type('999');
      });
    cy.get('[data-testid=date-published-field]').contains(ErrorMessages.INVALID_DATE).should('be.visible');
    cy.get('[data-testid=date-published-field]')
      .parent()
      .within(() => {
        cy.get("input[type='text']").clear().click().type('01.01.2000');
      });
    cy.get('[data-testid=date-published-field]').contains(ErrorMessages.INVALID_DATE).should('not.be.visible');
  });
});
