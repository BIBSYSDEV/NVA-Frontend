describe('Registration: File upload', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.server();
  });

  it('The user should be able to upload a file', () => {
    cy.mocklogin();

    cy.get('[data-testid=new-registration]').click({ force: true });

    cy.startRegistrationWithDoi();

    cy.get('[data-testid=nav-tabpanel-files-and-license]').click({ force: true });

    // Mock Uppys upload requests to S3 Bucket
    cy.route({
      method: 'PUT',
      url: 'https://file-upload.com/files/', // Must match URL set in mock-interceptor, which cannot be imported into a test
      response: '',
      headers: { ETag: 'etag' },
    });

    cy.get('input[type=file]').uploadFile('img.jpg');
    cy.get('[data-testid=uploaded-file-card]').should('be.visible');
  });
});
