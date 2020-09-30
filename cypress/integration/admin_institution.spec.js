import { RoleName } from '../../src/types/user.types';

describe('User administers institutions ', () => {
  beforeEach('Given that the user is logged in as Application administrator:', () => {
    cy.visit('/');
    cy.server();
    cy.mocklogin();
    cy.setUserRolesInRedux([RoleName.APP_ADMIN]);
    // Open administer institutions page
    cy.get('[data-testid=menu]').click({ force: true });
    cy.get('[data-testid=menu-admin-institution-button]').click({ force: true });
  });

  it('The User should be able to open admin page for institutions from the menu', () => {
    cy.get('[data-testid=customer-institutions-list]');
    cy.contains('Norwegian University of Science and Technology');
  });

  it('The User should be able to add an institution', () => {
    cy.get('[data-testid=add-institution-button]').click({ force: true });

    cy.get('[data-testid=autocomplete-institution]').click({ force: true }).type('ntnu');
    cy.get('.MuiAutocomplete-option').contains('Norwegian University of Science and Technology').click({ force: true });
    cy.get('[data-testid=customer-institution-short-name-input]').type('NTNU');
    cy.get('[data-testid=customer-institution-archive-name-input]').type('NTNU Open');
    cy.get('[data-testid=customer-institution-cname-input]').type('ntnu.unit.nva.no');
    cy.get('[data-testid=customer-institution-institution-dns-input]').type('1.1.1.1');
    cy.get('[data-testid=customer-institution-feide-organization-id-input]').type('NO919477822');

    cy.get('[data-testid=customer-institution-save-button]').click({ force: true });
    cy.get('[data-testid=snackbar]').contains('Created customer institution');
  });

  it('The User should be able to edit an institution', () => {
    cy.get('[data-testid=edit-institution-NTNU]').click({ force: true });

    cy.get('[data-testid=customer-institution-archive-name-input]').type(' Archive');

    cy.get('[data-testid=customer-institution-save-button]').click({ force: true });
    cy.get('[data-testid=snackbar]').contains('Updated customer institution');
  });
});
