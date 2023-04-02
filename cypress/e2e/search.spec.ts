import { dataTestId } from '../../src/utils/dataTestIds';
import { terminalLog } from '../support/terminalLog';

describe('Search', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('The user should see a working pagination', () => {
    cy.url().should('not.include', 'results');
    cy.url().should('not.include', 'from');
    cy.get(`[data-testid=${dataTestId.startPage.searchPagination}] button`).eq(0).should('be.disabled');
    cy.get(`[data-testid=${dataTestId.startPage.searchPagination}] button`).eq(1).should('be.disabled');
    cy.get(`[data-testid=${dataTestId.startPage.searchPagination}] button`).eq(2).should('be.enabled');
    cy.get(`[data-testid=${dataTestId.startPage.searchPagination}] button`).eq(3).should('be.enabled');
    cy.get(`[data-testid=${dataTestId.startPage.searchPagination}] button`).eq(2).click();
    cy.url().should('include', 'results=10');
    cy.url().should('include', 'from=10');
    cy.injectAxe();
    cy.checkA11y(null, undefined, terminalLog);
  });

  it('The user should see formulas correctly formatted with MathJax', () => {
    cy.get(`[data-testid=${dataTestId.startPage.searchResultItem}]`).eq(0).should('not.contain', '$');
    cy.get(`[data-testid=${dataTestId.startPage.searchResultItem}]`).eq(0).get('mjx-container').should('be.visible');
  });

  it('The user should see a result-list when searching', () => {
    const searchTerm = 'test';
    cy.get(`[data-testid=${dataTestId.startPage.searchField}] input`).type(searchTerm);
    cy.get(`[data-testid=${dataTestId.startPage.searchButton}]`).click();
    cy.url().should('include', `query=%22${searchTerm}%22`);
    cy.injectAxe();
    cy.checkA11y(null, undefined, terminalLog);
  });
});
