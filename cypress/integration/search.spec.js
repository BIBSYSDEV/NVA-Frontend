import { dataTestId } from '../../src/utils/dataTestIds';

describe('Search', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('The user should see a working pagination', () => {
    cy.get(`[data-testid=${dataTestId.startPage.searchPagination}]`).contains('1-10');
    cy.get(`[data-testid=${dataTestId.startPage.searchPagination}] button`).eq(0).should('be.disabled');
    cy.get(`[data-testid=${dataTestId.startPage.searchPagination}] button`).eq(1).should('be.enabled');
  });

  it('The user should see a result-list when searching', () => {
    cy.get(`[data-testid=${dataTestId.startPage.searchField}] input`).type('test');
    cy.get(`[data-testid=${dataTestId.startPage.searchButton}]`).click();
    cy.get(`[data-testid=${dataTestId.startPage.searchPagination}]`).contains('1-3');
  });
});
