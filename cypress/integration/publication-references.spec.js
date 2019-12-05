describe('Publication: References', () => {
  before('Given that the user is logged in:', () => {
    cy.visit('/');
    cy.get('[data-testid=login-button]').click({ force: true });
    cy.get('[data-testid=menu]').contains('Test User');
  });

  it('The user should be able to search for publications in the publication channel, and select one', () => {
    cy.get('[data-testid=new-registration-button]').click({ force: true });
    cy.get('[data-testid=references-tab]').click({ force: true });
    cy.get('[data-testid=autosearch-publisher]')
      .click({ force: true })
      .type('test');
    cy.wait(500);
    cy.get('.MuiAutocomplete-option')
      .contains('Novum Testamentum')
      .click({ force: true });
    cy.get('[data-testid=selected-publisher]').contains('ISSN: 1568-5365');
  });
});
