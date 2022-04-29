import { RoleName } from '../../src/types/user.types';
import { dataTestId } from '../../src/utils/dataTestIds';
import { mockSearchResults } from '../../src/utils/testfiles/mockSearchResults';
import { UrlPathTemplate } from '../../src/utils/urlPaths';

describe('Central Import', () => {
  beforeEach(() => {
    cy.visit('/basic-data/central-import');
    cy.mocklogin();
    cy.setUserRolesInRedux([RoleName.APP_ADMIN]);
    window.localStorage.setItem('beta', 'true');
  });

  it('should show a list of imported central-import publications', () => {
    const resultItemTestId = `${dataTestId.basicData.centralImport.resultItem}-${mockSearchResults.hits[1].identifier}`;
    cy.get(`[data-testid=${resultItemTestId}]`).contains(mockSearchResults.hits[1].entityDescription.mainTitle);
    cy.get(`[data-testid=${resultItemTestId}]`).contains('Journal article');
    cy.get(`[data-testid=${resultItemTestId}]`).contains(
      mockSearchResults.hits[1].entityDescription.contributors[1].identity.name
    );
    cy.get(`[data-testid=${resultItemTestId}]`).contains('(1 av 2)');
    cy.get(`[data-testid=${resultItemTestId}]`).contains(
      mockSearchResults.hits[1].entityDescription.contributors[1].affiliations[0].labels.en
    );
  });

  it('should show working pagination', () => {
    cy.url().should('not.include', 'results');
    cy.url().should('not.include', 'from');
    cy.get(`[data-testid=${dataTestId.basicData.centralImport.searchPagination}] button`).eq(0).should('be.disabled');
    cy.get(`[data-testid=${dataTestId.basicData.centralImport.searchPagination}] button`).eq(1).should('be.disabled');
    cy.get(`[data-testid=${dataTestId.basicData.centralImport.searchPagination}] button`).eq(2).should('be.enabled');
    cy.get(`[data-testid=${dataTestId.basicData.centralImport.searchPagination}] button`).eq(3).should('be.enabled');
    cy.get(`[data-testid=${dataTestId.basicData.centralImport.searchPagination}] button`).eq(2).click();
    cy.url().should('include', 'results=10');
    cy.url().should('include', 'from=10');
  });

  it('central import is found via menu', () => {
    cy.visit('/');
    cy.mocklogin();
    cy.get(`[data-testid=${dataTestId.header.basicDataLink}]`).click();
    cy.get(`[data-testid=${dataTestId.basicData.centralImportLink}]`).click();
    cy.url().should('include', UrlPathTemplate.BasicDataCentralImport);
  });

  afterEach(() => {
    window.localStorage.removeItem('beta');
  });
});
