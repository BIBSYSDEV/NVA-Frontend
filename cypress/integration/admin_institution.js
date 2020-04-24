import { mockUser } from '../../src/utils/testfiles/mock_feide_user';

const authorizedUser = { ...mockUser, 'custom:affiliation': '[member, employee, staff]', email: 'ost@unit.no' }; //@unit.no-address resolves to app admin

describe('User administers institutions ', () => {
  beforeEach('Given that the user is logged in as Application administrator:', () => {
    cy.visit('/');
    cy.server();
    cy.mocklogin();
    cy.setUserInRedux(authorizedUser);
    // Open administer institutions page
    cy.get('[data-testid=menu]').click({ force: true });
    cy.get('[data-testid=menu-admin-institution-button]').click({ force: true });
  });

  it('The User should be able to open admin page for institutions from the menu', () => {
    cy.contains('Norges teknisk-naturvitenskapelige universitet');
    cy.contains('tiril@ntnu.no');
    cy.contains('1.11.2020');
  });

  it('The User should be able to add an institution', () => {
    cy.get('[data-testid=add-institution-button]').click({ force: true });

    cy.get('[data-testid=autosearch-institution]').click({ force: true }).type('ntnu');
    cy.get('.MuiAutocomplete-option').contains('Norges teknisk-naturvitenskapelige universitet').click({ force: true });

    cy.get('[data-testid=customer-institution-display-name-input]').type(
      'Norges teknisk-naturvitenskapelige universitet'
    );
    cy.get('[data-testid=customer-institution-short-name-input]').type('NTNU');
    cy.get('[data-testid=customer-institution-archive-name-input]').type('NTNU Open');
    cy.get('[data-testid=customer-institution-cname-input]').type('ntnu.unit.nva.no');
    cy.get('[data-testid=customer-institution-institution-dns-input]').type('1.1.1.1');
    cy.get('[data-testid=customer-institution-administrator-id-input]').type('tiril@ntnu.no');
    cy.get('[data-testid=customer-institution-feide-organization-id-input]').type('ntnu@ntnu.no');

    cy.get('[data-testid=customer-institution-save-button]').click({ force: true });
    cy.get('[data-testid=snackbar]').contains('Created customer institution');
  });

  it('The User should be able to edit an institution', () => {
    cy.get('[data-testid=edit-institution-NTNU]').click({ force: true });

    cy.get('[data-testid=customer-institution-archive-name-input]').type(' Archive');

    cy.get('[data-testid=customer-institution-save-button]').click({ force: true });
    cy.get('[data-testid=snackbar]').contains('Updated customer institution');
  });

  // TODO: unskip when backend has support for uploading file
  it.skip('The user should be able to upload a file for an institution', () => {
    // Open administer institutions page
    cy.get('[data-testid=menu]').click({ force: true });
    cy.get('[data-testid=menu-admin-institution-button]').click({ force: true });

    // Open new institution page
    cy.get('[data-testid=add-institution-button]').click({ force: true });

    // Mock Uppys upload requests to S3 Bucket
    cy.route({
      method: 'PUT',
      url: 'https://file-upload.com/files/', // Must match URL set in mock-interceptor, which cannot be imported into a test
      response: '',
      headers: { ETag: 'etag' },
    });

    cy.get('input[type=file]').uploadFile('img.jpg');
    cy.get('.uppy-StatusBar-actionBtn--upload').click({ force: true });
    cy.get('[data-testid=uploaded-file-card]').should('be.visible');
  });
});
