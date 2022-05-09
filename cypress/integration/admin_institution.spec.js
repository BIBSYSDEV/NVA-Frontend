import { RoleName } from '../../src/types/user.types';
import { dataTestId } from '../../src/utils/dataTestIds';
import { mockCustomerInstitution } from '../../src/utils/testfiles/mockCustomerInstitutions';

describe('User administers institutions ', () => {
  beforeEach('Given that the user is logged in as Application administrator:', () => {
    cy.visit('/');
    cy.mocklogin();
    cy.setUserRolesInRedux([RoleName.AppAdmin]);
    cy.get(`[data-testid=${dataTestId.header.basicDataLink}]`).click({ force: true });
    cy.get(`[data-testid=${dataTestId.basicData.adminInstitutionsLink}]`).click({ force: true });
  });

  it('The User should be able to open admin page for institutions from the menu', () => {
    cy.get(`[data-testid=${dataTestId.basicData.customers.customerList}]`);
    cy.contains(mockCustomerInstitution.displayName);
  });

  it('The User should be able to add an institution', () => {
    cy.get(`[data-testid=${dataTestId.basicData.customers.addCustomerButton}]`).click({ force: true });

    cy.get(`[data-testid=${dataTestId.organization.searchField}]`).click({ force: true }).type('sikt');
    cy.get('[class^=MuiAutocomplete-option]').contains('Sikt').click({ force: true });
    cy.get(`[data-testid=${dataTestId.institutionAdmin.shortNameField}] input`).type('Sikt');
    cy.get(`[data-testid=${dataTestId.institutionAdmin.archiveNameField}] input`).type('Sikt arkiv');
    cy.get(`[data-testid=${dataTestId.institutionAdmin.feideField}] input`).type('NO123');

    cy.get(`[data-testid=${dataTestId.institutionAdmin.saveButton}]`).click({ force: true });
    cy.get('[data-testid=snackbar-success]').contains('Created customer institution');
  });

  it('The User should be able to edit an institution', () => {
    cy.get(
      `[data-testid=${dataTestId.basicData.customers.editInstitutionButton(mockCustomerInstitution.displayName)}]`
    ).click();

    cy.get(`[data-testid=${dataTestId.institutionAdmin.archiveNameField}] input`).type(' Archive');

    cy.get(`[data-testid=${dataTestId.institutionAdmin.saveButton}]`).click({ force: true });
    cy.get('[data-testid=snackbar-success]').contains('Updated customer institution');
  });
});
