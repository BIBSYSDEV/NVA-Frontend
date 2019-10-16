describe('A user searches for a resource', () => {
  it('Given that a user is on the start page and is not logged in', () => {
    cy.visit('/');
    cy.get('[data-cy=menu]').click();
    cy.get('[data-cy=logout-button]').click();
    cy.get('[data-cy=login-button]').should('be.visible');
    cy.get('[data-cy=menu]').should('not.exist');
  });
  it('And there are three documents with the word Norway in the title', () => {
    // mocked during testing. Look in src/utils/testfiles/resources.json
  });
  it('When the user enters Norway into the search input', () => {
    cy.get('[data-cy=search-input] .MuiInputBase-input').type('Norway');
  });
  it('And clicks Search', () => {
    cy.get('[data-cy=search-button]').click({ force: true });
  });
  it('Then the user sees hits for Norway displayed in the search display', () => {
    cy.get('[data-cy=search-results]')
      .find('[data-cy=result-list-item] ')
      .should('have.length.greaterThan', 1);
    cy.get('[data-cy=search-results]').contains('Norway');
    cy.url().should('include', '/Search/Norway');
  });
});
