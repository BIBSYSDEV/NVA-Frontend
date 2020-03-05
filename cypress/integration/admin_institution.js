import { mockUser } from '../../src/utils/testfiles/mock_feide_user';

const authorizedUser = { ...mockUser, 'custom:affiliation': '[member, employee, staff]', email: 'ost@unit.no' }; //@unit.no-address resolves to app admin

describe('User administers institutions ', () => {
  beforeEach('Given that the user is logged in as Application administrator:', () => {
    cy.visit('/');
    cy.server();
    cy.get('[data-testid=menu-login-button]').click({ force: true });
    cy.setUserInRedux(authorizedUser);
  });

  it('The User should be able to open admin page for institutions from the menu', () => {
    // Open administer institutions page
    cy.get('[data-testid=menu]').click({ force: true });
    cy.get('[data-testid=menu-admin-institution-button]').click({ force: true });

    cy.contains('Institutt for osteloff');
    cy.contains('Kjetil');
    cy.contains('1780-01-27');
  });

  it('The User should be able to add an institution', () => {
    // Open administer institutions page
    cy.get('[data-testid=menu]').click({ force: true });
    cy.get('[data-testid=menu-admin-institution-button]').click({ force: true });

    // Open new institution page
    cy.get('[data-testid=add-institution-button]').click({ force: true });

    cy.get('[data-testid=customer-instituiton-name-input]').type('institutt for osteloff');
    cy.get('[data-testid=customer-instituiton-display-name-input]').type('Institutt for osteloff!');
    cy.get('[data-testid=customer-instituiton-short-name-input]').type('OSTEINSTITUTTET');
    cy.get('[data-testid=customer-instituiton-archive-name-input]').type('Jarlsberg');
    cy.get('[data-testid=customer-instituiton-cname-input]').type('www.osteloff.com');
    cy.get('[data-testid=customer-instituiton-institution-dns-input]').type('1.1.1.1');
    cy.get('[data-testid=customer-instituiton-administrator-id-input]').type('12345676');
    cy.get('[data-testid=customer-instituiton-feide-organization-id-input]').type('2345667');

    cy.get('[data-testid=customer-instituiton-save-button]').click({ force: true });
  });

  it('The user should be able to upload a file for an institution', () => {
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

    // Inspired by: https://github.com/cypress-io/cypress/issues/170#issuecomment-533519550
    Cypress.Commands.add('uploadFile', { prevSubject: true }, (subject, fileName) => {
      cy.fixture(fileName).then(content => {
        const el = subject[0];
        const testFile = new File([content], fileName);
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(testFile);
        el.files = dataTransfer.files;
        cy.wrap(subject).trigger('change', { force: true });
      });
    });
    cy.get('input[type=file]').uploadFile('img.jpg');
    cy.get('[data-testid=uploaded-file-card]').should('be.visible');
  });
});
