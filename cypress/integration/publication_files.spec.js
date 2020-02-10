describe('Publication: File upload', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.server();
  });

  it('The user should be able to upload a file', () => {
    cy.mocklogin();

    cy.get('[data-testid=new-publication-button]').click({ force: true });
    cy.get('[data-testid=new-schema-button]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-files-and-license]').click({ force: true });

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
