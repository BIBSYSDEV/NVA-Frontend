describe('Search', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.server();
  });

  it('The user should see a result-list when searching', () => {
    cy.fixture('resources_2_random_results_generated').as('mockDataWith2Results');
    cy.route('/search/resources/test', '@mockDataWith2Results');
    searchForText('test');
    cy.get('[data-testid=search-results]')
      .find('[data-testid=result-list-item] ')
      .should('have.length.greaterThan', 1);
    cy.get('[data-testid=search-results]').contains('2');
  });

  it('The user should see a working pagination', () => {
    cy.fixture('resources_45_random_results_generated').as('mockDataWith45Results');
    cy.route('/search/resources/test', '@mockDataWith45Results');
    searchForText('test');
    cy.get('[data-testid=search-results]').contains('45');
    cy.get('[data-testid=pagination]').contains('2');
    cy.get('[data-testid=pagination]')
      .contains('>')
      .click({ force: true });
    cy.get('[data-testid=search-results]').contains('(11 - 20)');
  });
});

const searchForText = text => {
  cy.get('[data-testid=search-input] .MuiInputBase-input')
    .click({ force: true })
    .type(text);
  cy.get('[data-testid=search-button]').click({ force: true });
};
