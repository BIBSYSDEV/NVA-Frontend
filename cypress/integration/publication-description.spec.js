describe('Publication: Description', () => {
  before('Given that the user is logged in:', () => {
    cy.visit('/');
    cy.get('[data-testid=login-button]').click({ force: true });
    cy.get('[data-testid=menu]').contains('Test User');
  });

  it('The user should be able to search for projects in Cristin, and select one', () => {
    cy.get('[data-testid=new-registration-button]').click({ force: true });
    cy.get('[data-testid=description-tab]').click({ force: true });
    cy.get('[data-testid=autosearch-project]')
      .click({ force: true })
      .type('liv');
    cy.wait(500);
    cy.get('.MuiAutocomplete-option')
      .contains('Livskvalitet og helse i normalbefolkningen')
      .click({ force: true });
    cy.get('[data-testid=selected-project]').contains('Livskvalitet og helse i normalbefolkningen');
  });
});
