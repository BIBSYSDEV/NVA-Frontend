import mockResources from '../../src/utils/testfiles/resources_2_random_results_generated.json';

describe('A user searches for resources and browses through the result-pages', () => {
  it('Search', () => {
    cy.visit('/');
    cy.get('[data-cy=search-input] .MuiInputBase-input').type('XXXXXX');

    cy.server();
    cy.route('**/resources/**', mockResources); //return mock-data on search
    cy.log(mockResources);

    cy.get('[data-cy=search-button]').click({ force: true });
    cy.get('[data-cy=search-results]')
      .find('[data-cy=result-list-item] ')
      .should('have.length.greaterThan', 1);
    cy.get('[data-cy=search-results]').contains('45');
    cy.get('[data-cy=pagination]').contains('2');
    cy.get('[data-cy=pagination]')
      .contains('>')
      .click({ force: true });
    cy.get('[data-cy=search-results]').contains('(11 - 20)');
  });
});
