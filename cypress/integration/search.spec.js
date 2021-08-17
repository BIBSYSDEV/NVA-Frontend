describe('Search', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('The user should see a result-list when searching', () => {
    searchForText('test');
    cy.get('[data-testid=search-results]').find('[data-testid=result-list-item] ').should('have.length.greaterThan', 1);
    cy.get('[data-testid=search-results]').contains('2');
  });

  it.skip('The user should see a working pagination', () => {
    searchForText('test');
    cy.get('[data-testid=search-results]').contains('25');
    cy.get('[data-testid=pagination]').contains('2').click({ force: true });
  });
});

const searchForText = (text) => {
  cy.get('[data-testid=search-field] input').click({ force: true }).type(text);
  cy.get('[data-testid=search-button]').click({ force: true });
};
