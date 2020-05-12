import i18n from '../../src/translations/i18n';
i18n.changeLanguage('eng'); // Must set language before ErrorMessage is imported
import { ErrorMessage } from '../../src/pages/publication/PublicationFormValidationSchema';

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
    cy.get('[data-testid=nav-tabpanel-submission]').click({ force: true });

    // Error messages
    cy.get('[data-testid=error-summary-card]')
      .parent()
      .within(() => {
        cy.contains(`Publication type: ${ErrorMessage.REQUIRED}`);
        cy.contains(`Authors: ${ErrorMessage.MISSING_CONTRIBUTOR}`);
        cy.contains(`Publisher: ${ErrorMessage.REQUIRED}`);
        cy.contains(`Files: ${ErrorMessage.MISSING_FILE}`);
      });

    // Error tabs
    cy.get('.error-tab').should('have.length', 4);
  });

  it('The User should be able to see validation errors on description tab', () => {
    cy.get('[data-testid=nav-tabpanel-description]').click({ force: true });

    // Title field
    cy.get('[data-testid=publication-title-field]').contains(ErrorMessage.REQUIRED).should('be.visible');
    cy.get('[data-testid=publication-title-input]').click({ force: true }).type('TITLE INPUT');
    cy.get('[data-testid=publication-title-field]').contains(ErrorMessage.REQUIRED).should('not.be.visible');

    // Date published field
    cy.get('[data-testid=date-published-field]')
      .parent()
      .within(() => cy.get("input[type='text']").click({ force: true }).type('999'));
    cy.get('[data-testid=date-published-field]').contains('Invalid Date Format').should('be.visible');
    cy.get('[data-testid=date-published-field]')
      .parent()
      .within(() => cy.get("input[type='text']").clear().click({ force: true }).type('01.01.2000'));
    cy.get('[data-testid=date-published-field]').contains('Invalid Date Format').should('not.be.visible');
  });

  it('The User should be able to see validation errors on reference tab', () => {
    cy.get('[data-testid=nav-tabpanel-references]').click({ force: true });
    cy.get('[data-testid=publication-context-type]').contains(ErrorMessage.REQUIRED).should('be.visible');

    // Journal type
    cy.get('[data-testid=publication-context-type]').click({ force: true }).type(' ');
    cy.get('[data-testid=publication-instance-type-Journal]').click({ force: true });
    // No errors should be displayed when user has just selected new context type
    cy.contains(ErrorMessage.REQUIRED).should('not.be.visible');

    cy.get('[data-testid=nav-tabpanel-description]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-references]').click({ force: true });
    cy.get(`p:contains(${ErrorMessage.REQUIRED})`).should('have.length', 2);

    // publicationInstance type
    cy.get('[data-testid=publication-instance-type]').click({ force: true }).type(' ');
    cy.get('[data-testid=publication-instance-type-JournalArticle]').click({ force: true });

    // Publisher (publicationContext) field
    cy.get('[data-testid=autosearch-publisher]').click({ force: true }).type('natur');
    cy.contains('testament').click({ force: true });
    cy.contains(ErrorMessage.REQUIRED).should('not.be.visible');
    cy.get('[data-testid=remove-publisher]').click({ force: true });
    cy.contains(ErrorMessage.REQUIRED).should('be.visible');
    cy.get('[data-testid=autosearch-publisher]').click({ force: true }).type('natur');
    cy.contains('testament').click({ force: true });
    cy.contains(ErrorMessage.REQUIRED).should('not.be.visible');

    // TODO: Book type, Report type, etc
  });

  it('The User should be able to see validation errors on contributors tab', () => {
    cy.get('[data-testid=nav-tabpanel-contributors]').click({ force: true });
    cy.contains(ErrorMessage.MISSING_CONTRIBUTOR).should('be.visible');

    // Add author
    cy.get('[data-testid=add-contributor]').click({ force: true });
    cy.get('[data-testid=search-input]').click({ force: true }).type('test');
    cy.get('[data-testid=search-button]').click({ force: true });
    cy.get('[data-testid=author-radio-button]').eq(0).click({ force: true });
    cy.get('[data-testid=connect-author-button]').click({ force: true });
    cy.contains(ErrorMessage.MISSING_CONTRIBUTOR).should('not.be.visible');

    // Set corresponding (and email)
    cy.get('[data-testid=author-corresponding-checkbox]').click({ force: true });
    cy.contains(ErrorMessage.REQUIRED).should('not.be.visible');
    cy.get('[data-testid=nav-tabpanel-references]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-contributors]').click({ force: true });
    cy.contains(ErrorMessage.REQUIRED).should('be.visible');

    cy.get('[data-testid=author-email-input]').click({ force: true }).type('test');
    cy.contains(ErrorMessage.INVALID_FORMAT).should('be.visible');
    cy.get('[data-testid=author-email-input]').click({ force: true }).type('@email.com');
    cy.contains(ErrorMessage.INVALID_FORMAT).should('not.be.visible');
    cy.contains(ErrorMessage.REQUIRED).should('not.be.visible');
  });

  it('The User should be able to see validation errors on files tab', () => {
    cy.get('[data-testid="nav-tabpanel-files-and-license"]').click({ force: true });
    cy.contains(ErrorMessage.MISSING_FILE).should('be.visible');

    // Mock Uppys upload requests to S3 Bucket
    cy.route({
      method: 'PUT',
      url: 'https://file-upload.com/files/', // Must match URL set in mock-interceptor, which cannot be imported into a test
      response: '',
      headers: { ETag: 'etag' },
    });
    cy.get('input[type=file]').uploadFile('img.jpg');
    cy.get('[data-testid=uploaded-file-card]').should('be.visible');
    cy.contains(ErrorMessage.MISSING_FILE).should('not.be.visible');
    cy.contains(ErrorMessage.REQUIRED).should('not.be.visible');

    // Embargo field
    cy.get('[data-testid=uploaded-file-embargo-date]')
      .parent()
      .within(() => {
        cy.get("input[type='text']").click({ force: true }).type('01.01.').blur();
        cy.contains(ErrorMessage.INVALID_FORMAT).should('be.visible');
        cy.get("input[type='text']").click({ force: true }).type('2000');
        cy.contains(ErrorMessage.INVALID_FORMAT).should('not.be.visible');
        cy.contains(ErrorMessage.MUST_BE_FUTURE).should('be.visible');
        cy.get("input[type='text']").clear().click({ force: true }).type('01.01.3000');
        cy.contains(ErrorMessage.MUST_BE_FUTURE).should('not.be.visible');
      });

    // Lincense field
    cy.get('[data-testid=nav-tabpanel-contributors]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-files-and-license]').click({ force: true });
    cy.contains(ErrorMessage.REQUIRED).should('be.visible');
    cy.get('[data-testid=uploaded-file-select-license]')
      .parent()
      .within(() => cy.get('.MuiSelect-root').click({ force: true }));
    cy.get('[data-testid=license-item]').eq(0).click({ force: true });
    cy.contains(ErrorMessage.REQUIRED).should('not.be.visible');
  });

  it('The user navigates to submission tab and see no errors', () => {
    cy.get('[data-testid=nav-tabpanel-submission]').click({ force: true });
    cy.get('[data-testid=error-summary-card]').should('not.be.visible');
    cy.get('.error-tab').should('have.length', 0);
  });
});
