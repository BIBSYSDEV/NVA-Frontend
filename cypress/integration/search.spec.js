import mockDataWith2Results from './resources_2_random_results_generated';
import mockDataWith45Results from './resources_45_random_results_generated';

describe('Searching', () => {
  beforeEach(function() {
    cy.visit('/');
  });

  it('should show a result-list when searching', () => {
    cy.server();
    cy.route('/search/resources/test', mockDataWith2Results);
    searchForText('test');
    cy.get('[data-cy=search-results]')
      .find('[data-cy=result-list-item] ')
      .should('have.length.greaterThan', 1);
    cy.get('[data-cy=search-results]').contains('2');
  });

  it('should show a working pagination', () => {
    cy.server();
    cy.route('/search/resources/test', mockDataWith45Results);
    searchForText('test');
    cy.get('[data-cy=search-results]').contains('45');
    cy.get('[data-cy=pagination]').contains('2');
    cy.get('[data-cy=pagination]')
      .contains('>')
      .click({ force: true });
    cy.get('[data-cy=search-results]').contains('(11 - 20)');
  });
});

const searchForText = text => {
  cy.get('[data-cy=search-input] .MuiInputBase-input')
    .click({ force: true })
    .type(text);
  cy.get('[data-cy=search-button]').click({ force: true });
};
