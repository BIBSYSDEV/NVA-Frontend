import { dataTestId } from '../../src/utils/dataTestIds';
import { UrlPathTemplate } from '../../src/utils/urlPaths';

describe('Search', () => {
  beforeEach(() => {
    cy.visit(UrlPathTemplate.Filter);
  });

  it('The user should see a working pagination', () => {
    cy.url().should('not.include', 'results');
    cy.url().should('not.include', 'from');
    cy.get(`[data-testid=${dataTestId.common.pagination}] button`).eq(0).should('be.disabled');
    cy.get(`[data-testid=${dataTestId.common.pagination}] button`).eq(1).should('be.enabled');
    cy.get(`[data-testid=${dataTestId.common.pagination}] button`).eq(2).should('be.enabled');
    cy.get(`[data-testid=${dataTestId.common.pagination}] button`).eq(6).should('be.enabled');
    cy.get(`[data-testid=${dataTestId.common.pagination}] button`).eq(2).click();
    cy.get(`[data-testid=${dataTestId.common.pagination}] button`).eq(0).should('be.enabled');
    cy.url().should('include', 'results=10');
    cy.url().should('include', 'from=10');
    // The URL updates before the new page of results renders, so without this
    // the scan can catch the list mid-update.
    cy.get(`[data-testid=${dataTestId.startPage.searchResultItem}]`).should('be.visible');
    cy.checkA11yWithBaseline('search-filter-paginated');
  });

  it('The user should see formulas correctly formatted with MathJax', () => {
    cy.get(`[data-testid=${dataTestId.startPage.searchResultItem}]`).eq(0).should('not.contain', '$');
    cy.get(`[data-testid=${dataTestId.startPage.searchResultItem}]`).eq(0).get('mjx-container').should('be.visible');
  });

  it('The user should see a result-list when searching', () => {
    const searchTerm = 'test';
    cy.get(`[data-testid=${dataTestId.startPage.searchField}] input`).type(`${searchTerm}{enter}`);
    cy.url().should('include', `query=${searchTerm}`);
    cy.get(`[data-testid=${dataTestId.startPage.searchResultItem}]`).should('be.visible');
    cy.checkA11yWithBaseline('search-filter-query');
  });
});
