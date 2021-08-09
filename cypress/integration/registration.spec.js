import 'cypress-file-upload';

describe('Registration', () => {
  beforeEach(() => {
    cy.visit('/registration');
  });

  it('The user should be able to start registration with a DOI link', () => {
    cy.mocklogin();
    cy.get('[data-testid=new-registration]').click({ force: true });
    cy.url().should('include', '/registration');

    cy.get('[data-testid=new-registration-link]').click({ force: true });
    cy.get('[data-testid=new-registration-link-field] input').type('https://doi.org/10.1098/rspb.2018.0085');
    cy.get('[data-testid=doi-search-button]').click({ force: true });
    cy.contains(
      'Computer simulations show that Neanderthal facial morphology represents adaptation to cold and high energy demands, but not heavy biting'
    );

    cy.get('[data-testid=registration-link-next-button]').click({ force: true });
    cy.get('[data-testid=error-tab]').should('have.length', 0);
    cy.get('[data-testid=registration-title-field] input').should(
      'have.value',
      'Computer simulations show that Neanderthal facial morphology represents adaptation to cold and high energy demands, but not heavy biting'
    );
  });

  it.only('The user should be able to start registration by uploading a file', () => {
    cy.mocklogin();
    cy.get('[data-testid=new-registration]').click({ force: true });
    cy.url().should('include', '/registration');

    cy.get('[data-testid=new-registration-file]').click({ force: true });

    // Mock Uppys upload requests to S3 Bucket
    // cy.route({
    //   method: 'PUT',
    //   url: 'https://file-upload.com/files/', // Must match URL set in mock-interceptor, which cannot be imported into a test
    //   response: '',
    //   headers: { ETag: 'etag' },
    // });

    cy.intercept(
      { method: 'PUT', url: 'http://localhost:3000/custom/files/prepare', headers: { ETag: 'etag' } },
      (req) => {
        req.reply({
          statusCode: 200,
          body: '',
        });
      }
    );

    cy.get('input[type=file]').attachFile('img.jpg');
    cy.get('[data-testid=uploaded-file]').should('be.visible');

    cy.get('[data-testid=registration-file-start-button]').should('be.enabled').click({ force: true });
    cy.get('[data-testid=error-tab]').should('have.length', 0);
  });

  it('The user should not be able to go to the registration page for registration if not logged in', () => {
    cy.get('[data-testid=forbidden]').should('be.visible');
  });
});
