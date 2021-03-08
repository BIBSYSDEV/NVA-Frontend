import i18n from '../../src/translations/i18n';
import { LanguageCodes } from '../../src/types/language.types';
import { ErrorMessage } from '../../src/utils/validation/errorMessage';

describe('User opens registration form and can see validation errors', () => {
  before('Given that the user is logged in as Creator:', () => {
    cy.visit('/');
    cy.mocklogin();
    cy.get('[data-testid=my-registrations]').click({ force: true });
    cy.get('[data-testid=edit-registration-4327439]').click({ force: true });
  });

  beforeEach(() => {
    cy.server();
    i18n.changeLanguage(LanguageCodes.ENGLISH);
  });

  it('The User should be see validation errors for every tab', () => {
    cy.get('[data-testid=error-tab]').should('have.length', 4);
  });

  it('The User should be able to see validation errors on description tab', () => {
    cy.get('[data-testid=nav-tabpanel-description]').click({ force: true });

    // Title field
    cy.get('[data-testid=registration-title-field]').contains(ErrorMessage.REQUIRED).should('be.visible');
    cy.get('[data-testid=registration-title-input]').click({ force: true }).type('TITLE INPUT');
    cy.get('[data-testid=registration-title-field]').contains(ErrorMessage.REQUIRED).should('not.exist');

    // Date published field
    cy.get('[data-testid=date-published-field]')
      .parent()
      .within(() => cy.get("input[type='text']").click({ force: true }).type('999'));
    cy.get('[data-testid=date-published-field]').contains(ErrorMessage.INVALID_FORMAT).should('be.visible');
    cy.get('[data-testid=date-published-field]')
      .parent()
      .within(() => cy.get("input[type='text']").clear().click({ force: true }).type('01.01.2000'));
    cy.get('[data-testid=date-published-field]').contains(ErrorMessage.INVALID_FORMAT).should('not.exist');

    cy.get('[data-testid=nav-tabpanel-description]').children('[data-testid=error-tab]').should('not.exist');
  });

  it('The User should be able to see validation errors on reference tab (Journal)', () => {
    cy.get('[data-testid=nav-tabpanel-reference]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-description]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-reference]').click({ force: true });
    cy.get('[data-testid=publication-context-type]').contains(ErrorMessage.REQUIRED).should('be.visible');

    cy.get('[data-testid=publication-context-type]').click({ force: true }).type(' ');
    cy.get('[data-testid=publication-context-type-Journal]').click({ force: true });

    // No errors should be displayed when user has just selected new context type
    cy.get('[data-testid=publication-instance-type]').click({ force: true }).type(' ');
    cy.get('[data-testid=publication-instance-type-JournalArticle]').click({ force: true });
    cy.contains(ErrorMessage.REQUIRED).should('not.exist');

    cy.get('[data-testid=nav-tabpanel-description]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-reference]').click({ force: true });
    cy.get(`p:contains(${ErrorMessage.REQUIRED})`).should('have.length', 1);

    // Publisher (publicationContext) field
    cy.get('[data-testid=journal-search-input]').click({ force: true }).type('test');
    cy.contains('testament').click({ force: true });
    cy.contains(ErrorMessage.REQUIRED).should('not.exist');
    cy.get('[data-testid=journal-search-input]').clear();
    cy.contains(ErrorMessage.REQUIRED).should('be.visible');
    cy.get('[data-testid=journal-search-input]').click({ force: true }).type('test');
    cy.contains('testament').click({ force: true });
    cy.contains(ErrorMessage.REQUIRED).should('not.exist');

    cy.get('[data-testid=volume-field]').click({ force: true }).type('-1');
    cy.get('[data-testid=issue-field]').click({ force: true }).type('-1');
    cy.get('[data-testid=pages-from-field]').click({ force: true }).type('-1');
    cy.get('[data-testid=pages-to-field]').click({ force: true }).type('-2');
    cy.get('[data-testid=article-number-field]').click({ force: true }).type('-1');
    cy.get('[data-testid=volume-field]').contains(ErrorMessage.MUST_BE_POSITIVE);
    cy.get('[data-testid=issue-field]').contains(ErrorMessage.MUST_BE_POSITIVE);
    cy.get('[data-testid=pages-from-field]').contains(ErrorMessage.MUST_BE_POSITIVE);
    cy.get('[data-testid=pages-to-field]').contains(ErrorMessage.INVALID_PAGE_INTERVAL);
    cy.get('[data-testid=article-number-field]').contains(ErrorMessage.MUST_BE_POSITIVE);
    cy.get('[data-testid=volume-field]').click({ force: true }).type('{backspace}{backspace}1');
    cy.get('[data-testid=issue-field]').click({ force: true }).type('{backspace}{backspace}1');
    cy.get('[data-testid=pages-from-field]').click({ force: true }).type('{backspace}{backspace}2');
    cy.get('[data-testid=pages-to-field]').click({ force: true }).type('{backspace}{backspace}1');
    cy.get('[data-testid=pages-from-field]').contains(ErrorMessage.INVALID_PAGE_INTERVAL);
    cy.get('[data-testid=pages-to-field]').contains(ErrorMessage.INVALID_PAGE_INTERVAL);
    cy.get('[data-testid=pages-to-field]').click({ force: true }).type('0');
    cy.get('[data-testid=article-number-field]').click({ force: true }).type('{backspace}{backspace}1');

    cy.get('[data-testid=nav-tabpanel-reference]').children('[data-testid=error-tab]').should('not.exist');
  });

  it('The User should be able to see validation errors on reference tab (Book)', () => {
    cy.get('[data-testid=publication-context-type]').click({ force: true }).type(' ');
    cy.get(`[data-testid=publication-context-type-Book]`).click({ force: true });

    // publicationInstance type
    cy.get('[data-testid=publication-instance-type]').click({ force: true }).type(' ');
    cy.get('[data-testid=publication-instance-type-BookMonograph]').click({ force: true });
    cy.contains(ErrorMessage.REQUIRED).should('not.exist');

    cy.get('[data-testid=nav-tabpanel-description]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-reference]').click({ force: true });
    cy.get(`p:contains(${ErrorMessage.REQUIRED})`).should('have.length', 2);

    // publicationContext
    cy.get('[data-testid=publisher-search-input]').click({ force: true }).type('test');
    cy.contains('testament').click({ force: true });
    // NPI Subject
    cy.selectNpiDiscipline('Linguistics');
    cy.contains(ErrorMessage.REQUIRED).should('not.exist');

    // ISBN and pages
    cy.get('[data-testid=isbn-input]').type('9781787632714x').type('{enter}');
    cy.get('[data-testid=snackbar-warning]').contains(ErrorMessage.INVALID_ISBN);
    cy.get('[data-testid=snackbar-warning]').get('button[title=Close]').click({ force: true });
    cy.get('[data-testid=snackbar-warning]').should('not.exist');
    cy.get('[data-testid=isbn-input]').type('invalid-isbn');
    cy.get('[data-testid=pages-input]').type('-1');
    cy.get('[data-testid=snackbar-warning]').contains(ErrorMessage.INVALID_ISBN);
    cy.get('[data-testid=isbn-chip]').should('have.length', 0);
    cy.contains(ErrorMessage.MUST_BE_MIN_1);
    cy.get('[data-testid=pages-input]').clear().type('1a');
    cy.contains(ErrorMessage.INVALID_FORMAT);
    cy.get('[data-testid=pages-input]').clear().type('20');
    cy.get('[data-testid=nav-tabpanel-reference]').children('[data-testid=error-tab]').should('not.exist');
  });

  it('The User should be able to see validation errors on reference tab (Report)', () => {
    cy.get('[data-testid=publication-context-type]').click({ force: true }).type(' ');
    cy.get(`[data-testid=publication-context-type-Report]`).click({ force: true });

    // publicationInstance type
    cy.get('[data-testid=publication-instance-type]').click({ force: true }).type(' ');
    cy.get('[data-testid=publication-instance-type-ReportResearch]').click({ force: true });
    cy.contains(ErrorMessage.REQUIRED).should('not.exist');

    cy.get('[data-testid=nav-tabpanel-description]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-reference]').click({ force: true });
    cy.get(`p:contains(${ErrorMessage.REQUIRED})`).should('have.length', 1);

    // publicationContext
    cy.get('[data-testid=publisher-search-input]').click({ force: true }).type('test');
    cy.contains('testament').click({ force: true });
    cy.contains(ErrorMessage.REQUIRED).should('not.exist');

    cy.get('[data-testid=nav-tabpanel-reference]').children('[data-testid=error-tab]').should('not.exist');
  });

  it('The User should be able to see validation errors on reference tab (Degree)', () => {
    cy.get('[data-testid=publication-context-type]').click({ force: true }).type(' ');
    cy.get(`[data-testid=publication-context-type-Degree]`).click({ force: true });

    // publicationInstance type
    cy.get('[data-testid=publication-instance-type]').click({ force: true }).type(' ');
    cy.get('[data-testid=publication-instance-type-DegreeBachelor]').click({ force: true });
    cy.contains(ErrorMessage.REQUIRED).should('not.exist');

    cy.get('[data-testid=nav-tabpanel-description]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-reference]').click({ force: true });
    cy.get(`p:contains(${ErrorMessage.REQUIRED})`).should('have.length', 1);

    // publicationContext
    cy.get('[data-testid=publisher-search-input]').click({ force: true }).type('test');
    cy.contains('testament').click({ force: true });
    cy.contains(ErrorMessage.REQUIRED).should('not.exist');

    cy.get('[data-testid=nav-tabpanel-reference]').children('[data-testid=error-tab]').should('not.exist');
  });

  it('The User should be able to see validation errors on contributors tab', () => {
    cy.get('[data-testid=nav-tabpanel-contributors]').first().click({ force: true });
    cy.contains(ErrorMessage.MISSING_AUTHOR).should('be.visible');

    // Add author
    cy.get('[data-testid=add-contributor-Creator]').first().click({ force: true });
    cy.get('[data-testid=search-input]').first().type('test');
    cy.get('[data-testid=author-radio-button]').first().click({ force: true });
    cy.get('[data-testid=connect-author-button]').first().click({ force: true });
    cy.contains(ErrorMessage.MISSING_AUTHOR).should('not.exist');
    cy.contains(ErrorMessage.MISSING_SUPERVISOR).should('be.visible');

    // Add supervisor
    cy.get('[data-testid=add-contributor-Supervisor]').first().click({ force: true });
    cy.get('[data-testid=search-input]').first().type('test');
    cy.get('[data-testid=author-radio-button]').last().click({ force: true });
    cy.get('[data-testid=connect-author-button]').first().click({ force: true });
    cy.contains(ErrorMessage.MISSING_AUTHOR).should('not.exist');
    cy.contains(ErrorMessage.MISSING_SUPERVISOR).should('not.exist');

    // Set corresponding
    cy.get('[data-testid=author-corresponding-checkbox]').eq(0).click({ force: true });
    cy.get('[data-testid=nav-tabpanel-contributors]').children('[data-testid=error-tab]').should('not.exist');
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
    cy.contains(ErrorMessage.MISSING_FILE).should('not.exist');
    cy.contains(ErrorMessage.REQUIRED).should('not.exist');

    // Lincense field
    cy.get('[data-testid=nav-tabpanel-contributors]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-files-and-license]').click({ force: true });
    cy.contains(ErrorMessage.REQUIRED).should('be.visible');
    cy.get('[data-testid=uploaded-file-select-license]').click({ force: true }).type(' ');
    cy.get('[data-testid=license-item]').eq(0).click({ force: true });
    cy.contains(ErrorMessage.REQUIRED).should('not.exist');

    // Embargo field
    cy.get('[data-testid=uploaded-file-embargo-date]')
      .parent()
      .within(() => {
        cy.get("input[type='text']").click({ force: true }).type('0101', { force: true }).blur();
        cy.contains(ErrorMessage.INVALID_FORMAT).should('be.visible');
        cy.get("input[type='text']").click({ force: true }).type('2000', { force: true });
        cy.contains(ErrorMessage.INVALID_FORMAT).should('not.exist');
        cy.contains(ErrorMessage.MUST_BE_FUTURE).should('be.visible');
        cy.get("input[type='text']").clear().click({ force: true }).type('01013000', { force: true });
        cy.contains(ErrorMessage.MUST_BE_FUTURE).should('not.exist');
      });

    cy.get('[data-testid=nav-tabpanel-files-and-license]').children('[data-testid=error-tab]').should('not.exist');
  });
});
