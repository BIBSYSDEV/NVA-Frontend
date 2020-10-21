describe('Registration', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/registration');
  });

  it('The user should be able to start registration with a DOI link', () => {
    cy.mocklogin();
    cy.get('[data-testid=new-publication]').click({ force: true });
    cy.url().should('include', '/registration');

    cy.get('[data-testid=new-publication-link]').click({ force: true });
    cy.get('[data-testid=new-publication-link-input]').type('https://doi.org/10.1098/rspb.2018.0085');
    cy.get('[data-testid=doi-search-button]').click({ force: true });
    cy.contains(
      'Computer simulations show that Neanderthal facial morphology represents adaptation to cold and high energy demands, but not heavy biting'
    );

    cy.get('[data-testid=publication-link-next-button]').click({ force: true });
    cy.get('[data-testid=publication-title-input]').should(
      'have.value',
      'Computer simulations show that Neanderthal facial morphology represents adaptation to cold and high energy demands, but not heavy biting'
    );
  });

  it('The user should be able to start registration by uploading a file', () => {
    cy.mocklogin();
    cy.get('[data-testid=new-publication]').click({ force: true });
    cy.url().should('include', '/registration');

    cy.get('[data-testid=new-publication-file]').click({ force: true });

    // Mock Uppys upload requests to S3 Bucket
    cy.route({
      method: 'PUT',
      url: 'https://file-upload.com/files/', // Must match URL set in mock-interceptor, which cannot be imported into a test
      response: '',
      headers: { ETag: 'etag' },
    });

    cy.get('input[type=file]').uploadFile('img.jpg');
    cy.get('[data-testid=uploaded-file-card]').should('be.visible');

    cy.get('[data-testid=publication-file-start-button]').click({ force: true });
  });

  it('The user should not be able to go to the registration page for registration if not logged in', () => {
    cy.get('[data-testid=404]').should('be.visible');
  });
});
