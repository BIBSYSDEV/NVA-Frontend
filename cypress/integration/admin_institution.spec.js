import { RoleName } from '../../src/types/user.types';
import { dataTestId } from '../../src/utils/dataTestIds';

describe('User administers institutions ', () => {
  beforeEach('Given that the user is logged in as Application administrator:', () => {
    cy.visit('/');
    cy.mocklogin();
    cy.setUserRolesInRedux([RoleName.APP_ADMIN]);
    // Open administer institutions page
    cy.get(`[data-testid=${dataTestId.header.menuButton}]`).click({ force: true });
    cy.get(`[data-testid=${dataTestId.header.adminInstitutionsLink}]`).click({ force: true });
  });

  it('The User should be able to open admin page for institutions from the menu', () => {
    cy.get('[data-testid=customer-institutions-list]');
    cy.contains('Norwegian University of Science and Technology');
  });

  it('The User should be able to add an institution', () => {
    cy.get('[data-testid=add-institution-button]').click({ force: true });

    cy.get(`[data-testid=${dataTestId.organization.searchField}]`).click({ force: true }).type('ntnu');
    cy.get('[class^=MuiAutocomplete-option]')
      .contains('Norwegian University of Science and Technology')
      .click({ force: true });
    cy.get(`[data-testid=${dataTestId.institutionAdmin.shortNameField}] input`).type('NTNU');
    cy.get(`[data-testid=${dataTestId.institutionAdmin.archiveNameField}] input`).type('NTNU Open');
    cy.get(`[data-testid=${dataTestId.institutionAdmin.feideField}] input`).type('NO919477822');

    cy.get(`[data-testid=${dataTestId.institutionAdmin.saveButton}]`).click({ force: true });
    cy.get('[data-testid=snackbar-success]').contains('Created customer institution');
  });

  it('The User should be able to edit an institution', () => {
    cy.get('[data-testid=edit-institution-NTNU]').click({ force: true });

    cy.get(`[data-testid=${dataTestId.institutionAdmin.archiveNameField}] input`).type(' Archive');

    cy.get(`[data-testid=${dataTestId.institutionAdmin.saveButton}]`).click({ force: true });
    cy.get('[data-testid=snackbar-success]').contains('Updated customer institution');
  });
});
