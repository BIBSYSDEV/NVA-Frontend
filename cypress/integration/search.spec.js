import { dataTestId } from '../../src/utils/dataTestIds';

describe('Search', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('The user should see a working pagination', () => {
    cy.get(`[data-testid=${dataTestId.startPage.searchPagination}]`).contains('1-10');
    cy.get(`[data-testid=${dataTestId.startPage.searchPagination}] button`).eq(0).should('be.disabled');
    cy.get(`[data-testid=${dataTestId.startPage.searchPagination}] button`).eq(1).should('be.enabled');
    cy.url().should('include', 'results=10');
    cy.url().should('include', 'from=0');
  });

  it('The user should see a result-list when searching', () => {
    const searchTerm = 'test';
    cy.get(`[data-testid=${dataTestId.startPage.searchField}] input`).type(searchTerm);
    cy.get(`[data-testid=${dataTestId.startPage.searchButton}]`).click();
    cy.get(`[data-testid=${dataTestId.startPage.searchPagination}]`).contains('1-10');
    cy.url().should('include', `query=${searchTerm}`);
  });
});
