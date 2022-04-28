import { RoleName } from '../../src/types/user.types';
import { dataTestId } from '../../src/utils/dataTestIds';
import { mockSearchResults } from '../../src/utils/testfiles/mockSearchResults';

describe('Central Import', () => {
  beforeEach(() => {
    cy.visit('/basic-data/central-import');
    cy.mocklogin();
    cy.setUserRolesInRedux([RoleName.APP_ADMIN]);
    window.localStorage.setItem('beta', 'true');
  });

  it('shows a list of imported central-import posts', () => {
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

  it('central import is found via menu', () => {
    cy.visit('/');
    cy.mocklogin();
    cy.get('[data-testid=basic-data-link]').click();
    cy.get('[data-testid=central-import-link]').click();
    cy.url().should('include', '/basic-data/central-import');
  });

  afterEach(() => {
    window.localStorage.removeItem('beta');
  });
});
