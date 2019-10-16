describe('A user searches for resources and browses through the result-pages', () => {
  it('Given that a user is on the start page and is not logged in', () => {
    cy.visit('/');
    cy.get('[data-cy=menu]').click();
    cy.get('[data-cy=logout-button]').click();
    cy.get('[data-cy=login-button]').should('be.visible');
    cy.get('[data-cy=menu]').should('not.exist');
  });
  it('When the user enters "test" into the search input', () => {
    cy.get('[data-cy=search-input] .MuiInputBase-input').type('test');
  });
  it('And clicks Search', () => {
    cy.get('[data-cy=search-button]').click({ force: true });
  });
  it('And there is 45 results', () => {
    cy.get('[data-cy=search-results]')
      .find('[data-cy=result-list-item] ')
      .should('have.length.greaterThan', 1);
    cy.get('[data-cy=search-results]').contains('45 results');
  });
  it('Then pagination is shown', () => {
    cy.get('[data-cy=pagination]').contains('2');
  });
  it('And user clicks on ">" in pagination', () => {
    cy.get('[data-cy=pagination]')
      .contains('>')
      .click({ force: true });
  });
  it('Then the result-title should show "(11 - 20)"', () => {
    cy.get('[data-cy=search-results]').contains('(11 - 20)');
  });
});
