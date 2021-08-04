import { dataTestId } from '../../src/utils/dataTestIds';
import { JournalArticleContentType } from '../../src/types/publication_types/journalRegistration.types';

describe('User opens registration form and can see validation errors', () => {
  before('Given that the user is logged in as Creator:', () => {
    cy.visit('/');
    cy.mocklogin();
    cy.get('[data-testid=my-registrations]').click({ force: true });
    cy.get('[data-testid=edit-registration-4327439]').click({ force: true });
  });

  beforeEach(() => {
    cy.server();
  });

  it('The User should be see validation errors for every tab', () => {
    cy.get('[data-testid=error-tab]').should('have.length', 4);
  });

  it('The User should be able to see validation errors on description tab', () => {
    cy.get('[data-testid=nav-tabpanel-description]').click({ force: true });

    // Title field
    cy.get('[data-testid=registration-title-field] p.Mui-error').should('be.visible');
    cy.get('[data-testid=nav-tabpanel-description]').within(() => cy.get('[data-testid=error-tab]').should('exist'));
    cy.get('[data-testid=registration-title-field] input').click({ force: true }).type('TITLE INPUT');
    cy.get('[data-testid=registration-title-field] p.Mui-error').should('not.exist');

    // Date published field
    cy.get('[data-testid=date-published-field] input').click({ force: true }).type('999');
    cy.get('[data-testid=date-published-field] p.Mui-error').should('be.visible');
    cy.get('[data-testid=date-published-field] input').clear().click({ force: true }).type('01.01.2000');
    cy.get('[data-testid=date-published-field] p.Mui-error').should('not.exist');

    cy.get('[data-testid=nav-tabpanel-description]').within(() =>
      cy.get('[data-testid=error-tab]').should('not.exist')
    );
  });

  it('The User should be able to see validation errors on resource tab (Journal)', () => {
    cy.get('[data-testid=nav-tabpanel-resource-type]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-description]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-resource-type]').click({ force: true });
    cy.get('[data-testid=publication-context-type] .Mui-error').should('be.visible');
    cy.get('[data-testid=nav-tabpanel-resource-type]').within(() => cy.get('[data-testid=error-tab]').should('exist'));

    cy.get('[data-testid=publication-context-type]').click({ force: true }).type(' ');
    cy.get('[data-testid=publication-context-type-Journal]').click({ force: true });

    // No errors should be displayed when user has just selected new context type
    cy.get('[data-testid=publication-instance-type]').click({ force: true }).type(' ');
    cy.get('[data-testid=publication-instance-type-JournalArticle]').click({ force: true });
    cy.get('p.Mui-error').should('not.exist');

    cy.get('[data-testid=nav-tabpanel-description]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-resource-type]').click({ force: true });
    cy.get('p.Mui-error').should('have.length', 2);

    // Publisher (publicationContext) field
    cy.get('[data-testid=journal-search-field] input').click({ force: true }).type('test');
    cy.contains('testament').click({ force: true });
    cy.get('[data-testid=journal-search-field] p.Mui-error').should('not.exist');
    cy.get('[data-testid=journal-search-field] input').clear();
    cy.get('[data-testid=journal-search-field] p.Mui-error').should('be.visible');
    cy.get('[data-testid=journal-search-field] input').click({ force: true }).type('test');
    cy.contains('testament').click({ force: true });
    cy.get('[data-testid=journal-search-field] p.Mui-error').should('not.exist');

    cy.get('[data-testid=volume-field] input').type('-1');
    cy.get('[data-testid=issue-field] input').type('-1');
    cy.get('[data-testid=pages-from-field] input').type('-1');
    cy.get('[data-testid=pages-to-field] input').type('-2');
    cy.get('[data-testid=article-number-field] input').type('-1');
    cy.get('[data-testid=volume-field] p.Mui-error').should('be.visible');
    cy.get('[data-testid=issue-field] p.Mui-error').should('be.visible');
    cy.get('[data-testid=pages-from-field] p.Mui-error').should('be.visible');
    cy.get('[data-testid=pages-to-field] p.Mui-error').should('be.visible');
    cy.get('[data-testid=article-number-field] p.Mui-error').should('not.exist');
    cy.get('[data-testid=volume-field] input').type('{backspace}{backspace}1');
    cy.get('[data-testid=issue-field] input').type('{backspace}{backspace}1');
    cy.get('[data-testid=pages-from-field] input').type('{backspace}{backspace}2');
    cy.get('[data-testid=pages-to-field] input').type('{backspace}{backspace}1');
    cy.get('[data-testid=pages-from-field] p.Mui-error').should('be.visible');
    cy.get('[data-testid=pages-to-field] p.Mui-error').should('be.visible');
    cy.get('[data-testid=pages-to-field] input').type('0');
    cy.get('[data-testid=article-number-field] input').type('{backspace}{backspace}1');

    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.contentField}] p.Mui-error`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.peerReviewed}] input`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.originalResearchField}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.contentField}]`).click();
    cy.get(`[data-value="${JournalArticleContentType.ResearchArticle}"]`).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.peerReviewed}] input`).eq(0).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.originalResearchField}] input`).eq(1).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.contentField}] p.Mui-error`).should('not.exist');

    cy.get('[data-testid=nav-tabpanel-resource-type]').within(() =>
      cy.get('[data-testid=error-tab]').should('not.exist')
    );
  });

  it('The User should be able to see validation errors on resource tab (Book)', () => {
    cy.get('[data-testid=publication-context-type]').click({ force: true }).type(' ');
    cy.get(`[data-testid=publication-context-type-Book]`).click({ force: true });

    // publicationInstance type
    cy.get('[data-testid=publication-instance-type]').click({ force: true }).type(' ');
    cy.get('[data-testid=publication-instance-type-BookMonograph]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-description]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-resource-type]').click({ force: true });
    cy.get('[data-testid=publication-instance-type] p.Mui-error').should('not.exist');
    cy.get('p.Mui-error').should('have.length', 2);

    // publicationContext
    cy.get('[data-testid=publisher-search-field] input').click({ force: true }).type('test');
    cy.contains('testament').click({ force: true });
    // NPI Subject
    cy.selectNpiDiscipline('Linguistics');
    cy.get('[data-testid=publisher-search-field] p').should('not.exist');

    // ISBN and pages
    cy.get('[data-testid=isbn-field] input').type('9781787632714x').type('{enter}');
    cy.get('[data-testid=snackbar-warning]').should('be.visible');
    cy.get('[data-testid=snackbar-warning]').get('button[title=Close]').click({ force: true });
    cy.get('[data-testid=snackbar-warning]').should('not.exist');
    cy.get('[data-testid=isbn-field] input').type('invalid-isbn');
    cy.get('[data-testid=pages-field] input').type('-1');
    cy.get('[data-testid=snackbar-warning]').should('be.visible');
    cy.get('[data-testid=isbn-chip]').should('have.length', 0);
    cy.get('[data-testid=pages-field] p.Mui-error').should('be.visible');
    cy.get('[data-testid=pages-field] input').clear().type('1a');
    cy.get('[data-testid=pages-field] p.Mui-error').should('be.visible');
    cy.get('[data-testid=pages-field] input').clear().type('20');

    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.peerReviewed}] input`).eq(0).click();

    cy.get('[data-testid=nav-tabpanel-resource-type]').within(() =>
      cy.get('[data-testid=error-tab]').should('not.exist')
    );
  });

  it('The User should be able to see validation errors on resource tab (Report)', () => {
    cy.get('[data-testid=publication-context-type]').click({ force: true }).type(' ');
    cy.get(`[data-testid=publication-context-type-Report]`).click({ force: true });

    // publicationInstance type
    cy.get('[data-testid=publication-instance-type]').click({ force: true }).type(' ');
    cy.get('[data-testid=publication-instance-type-ReportResearch]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-description]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-resource-type]').click({ force: true });
    cy.get('[data-testid=publication-instance-type] p.Mui-error').should('not.exist');
    cy.get('p.Mui-error').should('have.length', 1);

    // publicationContext
    cy.get('[data-testid=publisher-search-field] input').click({ force: true }).type('test');
    cy.contains('testament').click({ force: true });
    cy.get('[data-testid=publisher-search-field] p').should('not.exist');

    cy.get('[data-testid=nav-tabpanel-resource-type]').within(() =>
      cy.get('[data-testid=error-tab]').should('not.exist')
    );
  });

  it('The User should be able to see validation errors on resource tab (Degree)', () => {
    cy.get('[data-testid=publication-context-type]').click({ force: true }).type(' ');
    cy.get(`[data-testid=publication-context-type-Degree]`).click({ force: true });

    // publicationInstance type
    cy.get('[data-testid=publication-instance-type]').click({ force: true }).type(' ');
    cy.get('[data-testid=publication-instance-type-DegreeBachelor]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-description]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-resource-type]').click({ force: true });
    cy.get('[data-testid=publication-instance-type] p.Mui-error').should('not.exist');
    cy.get('p.Mui-error').should('have.length', 1);

    // publicationContext
    cy.get('[data-testid=publisher-search-field] input').click({ force: true }).type('test');
    cy.contains('testament').click({ force: true });
    cy.get('[data-testid=publisher-search-field] p').should('not.exist');

    cy.get('[data-testid=nav-tabpanel-resource-type]').within(() =>
      cy.get('[data-testid=error-tab]').should('not.exist')
    );
  });

  it('The User should be able to see validation errors on contributors tab', () => {
    cy.get('[data-testid=nav-tabpanel-contributors]').click();
    cy.get('p.Mui-error').should('be.visible');
    cy.get('[data-testid=nav-tabpanel-contributors]').within(() => cy.get('[data-testid=error-tab]').should('exist'));

    // Add author
    cy.get('[data-testid=add-Creator]').first().click();
    cy.get('[data-testid=contributor-modal]').should('be.visible');
    cy.get('[data-testid=search-field] input').type('test');
    cy.get('[data-testid=author-radio-button]').first().click({ force: true });
    cy.get('[data-testid=author-radio-button]').first().click({ force: true });
    cy.get('[data-testid=connect-author-button]').click();
    cy.get('[data-testid=contributor-modal]').should('not.exist');
    cy.get('p.Mui-error').should('be.visible');

    // Add supervisor
    cy.get('[data-testid=add-Supervisor]').first().click();
    cy.get('[data-testid=contributor-modal]').should('be.visible');
    cy.get('[data-testid=search-field] input').type('test');
    cy.get('[data-testid=author-radio-button]').last().click({ force: true });
    cy.get('[data-testid=author-radio-button]').last().click({ force: true });
    cy.get('[data-testid=connect-author-button]').click();
    cy.get('[data-testid=contributor-modal]').should('not.exist');
    cy.get('p.Mui-error').should('not.exist');

    cy.get('[data-testid=nav-tabpanel-contributors]').within(() =>
      cy.get('[data-testid=error-tab]').should('not.exist')
    );
  });

  it('The User should be able to see validation errors on files tab', () => {
    cy.get('[data-testid="nav-tabpanel-files-and-license"]').click({ force: true });
    cy.get('p.Mui-error').should('have.length', 1);
    cy.get('[data-testid=nav-tabpanel-files-and-license]').within(() =>
      cy.get('[data-testid=error-tab]').should('exist')
    );

    // Mock Uppys upload requests to S3 Bucket
    cy.route({
      method: 'PUT',
      url: 'https://file-upload.com/files/', // Must match URL set in mock-interceptor, which cannot be imported into a test
      response: '',
      headers: { ETag: 'etag' },
    });
    cy.get('input[type=file]').uploadFile('img.jpg');
    cy.get('[data-testid=uploaded-file-card]').should('be.visible');
    cy.get('p.Mui-error').should('not.exist');

    // Lincense field
    cy.get('[data-testid=nav-tabpanel-contributors]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-files-and-license]').click({ force: true });
    cy.get('[data-testid=uploaded-file-select-license] p.Mui-error').should('be.visible');
    cy.get('[data-testid=uploaded-file-select-license]').click({ force: true }).type(' ');
    cy.get('[data-testid=license-item]').eq(0).click({ force: true });
    cy.get('[data-testid=uploaded-file-select-license] p.Mui-error').should('not.exist');

    // Embargo field
    cy.get('[data-testid=uploaded-file-embargo-date]')
      .parent()
      .within(() => {
        cy.get("input[type='text']").click({ force: true }).type('0101', { force: true }).blur();
        cy.get('p.Mui-error').should('be.visible');
        cy.get("input[type='text']").click({ force: true }).type('2000', { force: true });
        cy.get('p.Mui-error').should('be.visible');
        cy.get("input[type='text']").clear().click({ force: true }).type('01013000', { force: true });
        cy.get('p.Mui-error').should('not.exist');
      });

    cy.get('[data-testid=nav-tabpanel-files-and-license]').within(() => {
      cy.get('[data-testid=error-tab]').should('be.visible');
    });
    cy.get(`[data-testid=${dataTestId.registrationWizard.files.version}]`).within(() => {
      cy.get('input').eq(0).click();
    });
    cy.get('[data-testid=error-tab]').should('not.exist');
  });
});
