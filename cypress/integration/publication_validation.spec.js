const ErrorMessages = {
  INVALID_DATE: 'Invalid Date Format',
  INVALID_FORMAT: 'Invalid format',
  MISSING_AUTHORS: 'You need to have at least one author registered for this publication',
  MISSING_FILES: 'You need to have at least one file uploaded for this publication',
  REQUIRED: 'Required field',
};

describe('User opens publication form and can see validation errors', () => {
  before('Given that the user is logged in as Creator:', () => {
    cy.visit('/');
    cy.mocklogin();
    cy.get('[data-testid=menu]').click({ force: true });
    cy.get('[data-testid=menu-my-publications-button]').click({ force: true });
    cy.get('[data-testid=edit-publication-4327439]').click({ force: true });
  });

  beforeEach(() => {
    cy.server();
  });

  it('The User should be able to see validation summary on submission tab', () => {
    // TODO: Test if tab is marked with error
    cy.get('[data-testid=nav-tabpanel-submission]').click({ force: true });
    cy.get('[data-testid=error-summary-card]').contains(`Title: ${ErrorMessages.REQUIRED}`);
    cy.get('[data-testid=error-summary-card]').contains(`Publication type: ${ErrorMessages.REQUIRED}`);
    cy.get('[data-testid=error-summary-card]').contains(`Authors: ${ErrorMessages.MISSING_AUTHORS}`);
    cy.get('[data-testid=error-summary-card]').contains(`Publisher: ${ErrorMessages.REQUIRED}`);
    cy.get('[data-testid=error-summary-card]').contains(`Files: ${ErrorMessages.MISSING_FILES}`);
  });

  it('The User should be able to see validation errors on description tab', () => {
    cy.get('[data-testid=nav-tabpanel-description]').click({ force: true });

    // Title field
    cy.get('[data-testid=publication-title-field]').contains(ErrorMessages.REQUIRED).should('be.visible');
    cy.get('[data-testid=publication-title-input]').click({ force: true }).type('TITLE INPUT');
    cy.get('[data-testid=publication-title-field]').contains(ErrorMessages.REQUIRED).should('not.be.visible');

    // Date published field
    cy.get('[data-testid=date-published-field]')
      .parent()
      .within(() => cy.get("input[type='text']").click({ force: true }).type('999'));
    cy.get('[data-testid=date-published-field]').contains(ErrorMessages.INVALID_DATE).should('be.visible');
    cy.get('[data-testid=date-published-field]')
      .parent()
      .within(() => cy.get("input[type='text']").clear().click({ force: true }).type('01.01.2000'));
    cy.get('[data-testid=date-published-field]').contains(ErrorMessages.INVALID_DATE).should('not.be.visible');
  });

  it('The User should be able to see validation errors on reference tab', () => {
    cy.get('[data-testid=nav-tabpanel-references]').click({ force: true });
    cy.get('[data-testid=publication-context-type]').contains(ErrorMessages.REQUIRED).should('be.visible');

    // Journal type
    cy.get('[data-testid=publication-context-type]').click({ force: true }).type(' ');
    cy.get('[data-testid=publication-instance-type-Journal]').click({ force: true });

    // No errors should be displayed when user has just selected new context type
    // cy.contains(ErrorMessages.REQUIRED).should('not.be.visible'); // TODO: Fix bug

    cy.get('[data-testid=nav-tabpanel-description]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-references]').click({ force: true });
    cy.get(`p:contains(${ErrorMessages.REQUIRED})`).should('have.length', 2);

    cy.get('[data-testid=publication-instance-type]').click({ force: true }).type(' ');
    cy.get('[data-testid=publication-instance-type-JournalArticle]').click({ force: true });
    cy.get('[data-testid=autosearch-publisher]').click({ force: true }).type('natur');
    cy.contains('testament').click({ force: true });
    cy.contains(ErrorMessages.REQUIRED).should('not.be.visible');

    // TODO: Book type, Report type, etc
  });

  it('The User should be able to see validation errors on contributors tab', () => {
    cy.get('[data-testid=nav-tabpanel-contributors]').click({ force: true });
    cy.contains(ErrorMessages.MISSING_AUTHORS).should('be.visible');

    // Add author
    cy.get('[data-testid=add-contributor]').click({ force: true });
    cy.get('[data-testid=search-input]').click({ force: true }).type('test');
    cy.get('[data-testid=search-button]').click({ force: true });
    cy.get('[data-testid=author-radio-button]').eq(0).click({ force: true });
    cy.get('[data-testid=connect-author-button]').click({ force: true });
    cy.contains(ErrorMessages.MISSING_AUTHORS).should('not.be.visible');

    // Set corresponding (and email)
    cy.get('[data-testid=author-corresponding-checkbox]').click({ force: true });
    cy.contains(ErrorMessages.REQUIRED).should('not.be.visible');
    cy.get('[data-testid=nav-tabpanel-references]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-contributors]').click({ force: true });
    cy.contains(ErrorMessages.REQUIRED).should('be.visible');

    cy.get('[data-testid=author-email-input]').click({ force: true }).type('test');
    cy.contains(ErrorMessages.INVALID_FORMAT).should('be.visible');
    cy.get('[data-testid=author-email-input]').click({ force: true }).type('@email.com');
    cy.contains(ErrorMessages.INVALID_FORMAT).should('not.be.visible');
    cy.contains(ErrorMessages.REQUIRED).should('not.be.visible');
  });

  it('The User should be able to see validation errors on files tab', () => {
    cy.get('[data-testid="nav-tabpanel-files-and-license"]').click({ force: true });
    cy.contains(ErrorMessages.MISSING_FILES).should('be.visible');

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
    cy.contains(ErrorMessages.MISSING_FILES).should('not.be.visible');
    cy.contains(ErrorMessages.REQUIRED).should('not.be.visible');

    cy.get('[data-testid=nav-tabpanel-contributors]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-files-and-license]').click({ force: true });
    cy.contains(ErrorMessages.REQUIRED).should('be.visible');
    cy.get('[data-testid=uploaded-file-select-license]')
      .parent()
      .within(() => cy.get('.MuiSelect-root').click({ force: true }));
    cy.get('[data-testid=license-item]').eq(0).click({ force: true });
    cy.contains(ErrorMessages.REQUIRED).should('not.be.visible');
  });

  it('The user navigates to submission tab and see no errors', () => {
    cy.get('[data-testid=nav-tabpanel-submission]').click({ force: true });
    cy.get('[data-testid=error-summary-card]').should('not.be.visible');
  });
});
