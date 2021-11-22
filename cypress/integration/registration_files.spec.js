import 'cypress-file-upload';

describe('Registration: File upload', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('The user should be able to upload a file', () => {
    cy.mocklogin();

    cy.get('[data-testid=new-registration]').click({ force: true });

    cy.startRegistrationWithDoi();

    cy.get('[data-testid=nav-tabpanel-files-and-license]').click({ force: true });

    cy.mockFileUpload();

    cy.get('input[type=file]').attachFile('img.jpg');
    cy.get('[data-testid=uploaded-file-card]').should('be.visible');
  });
});
