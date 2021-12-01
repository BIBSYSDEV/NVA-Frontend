import 'cypress-file-upload';
import { dataTestId } from '../../src/utils/dataTestIds';
import { JournalArticleContentType, BookMonographContentType } from '../../src/types/publication_types/content.types';
import { DesignType } from '../../src/types/publication_types/artisticRegistration.types';
import { mockJournalsSearch } from '../../src/utils/testfiles/mockJournals';
import { mockPublishersSearch } from '../../src/utils/testfiles/mockPublishers';

describe('User opens registration form and can see validation errors', () => {
  before('Given that the user is logged in as Creator:', () => {
    cy.visit('/');
    cy.mocklogin();
    cy.get('[data-testid=my-registrations-link]').click({ force: true });
    cy.get('[data-testid=edit-registration-4327439]').click({ force: true });
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

    // Journal (publicationContext) field
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.journalField}] input`)
      .click()
      .type(mockJournalsSearch[0].name);
    cy.contains(mockJournalsSearch[0].name).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.journalChip}]`).should(
      'contain',
      mockJournalsSearch[0].name
    );
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.journalField}] p.Mui-error`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.journalChip}] svg`).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.journalChip}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.journalField}] p.Mui-error`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.journalField}] input`)
      .click()
      .type(mockJournalsSearch[0].name);
    cy.contains(mockJournalsSearch[0].name).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.journalChip}]`).should(
      'contain',
      mockJournalsSearch[0].name
    );
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.journalField}] p.Mui-error`).should('not.exist');

    // Pages
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.pagesFromField}] input`).type('3');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.pagesToField}] input`).type('1');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.pagesFromField}] p.Mui-error`).should(
      'be.visible'
    );
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.pagesToField}] p.Mui-error`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.pagesToField}] input`).type('1');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.pagesFromField}] p.Mui-error`).should(
      'not.exist'
    );
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.pagesToField}] p.Mui-error`).should('not.exist');

    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.contentField}] p.Mui-error`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.peerReviewed}] input`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.contentField}]`).click();
    cy.get(`[data-value="${JournalArticleContentType.ResearchArticle}"]`).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.peerReviewed}] input`).eq(0).click();
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
    cy.get('p.Mui-error').should('have.length', 3);

    // publicationContext
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.publisherField}] input`)
      .click()
      .type(mockPublishersSearch[0].name);
    cy.contains(mockPublishersSearch[0].name).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.publisherField}] p.Mui-error`).should(
      'not.exist'
    );

    // NPI Subject
    cy.selectNpiDiscipline('Linguistics');

    // ISBN
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.isbnField}]`).within(() => {
      cy.get('input').type('97817876').blur();
      cy.get('.Mui-error').should('be.visible');
      cy.get('input').type('32714');
      cy.get('.Mui-error').should('not.exist');
    });

    // Pages
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.pagesField}]`).within(() => {
      cy.get('input').type('-1');
      cy.get('p.Mui-error').should('be.visible');
      cy.get('input').clear().type('1a');
      cy.get('p.Mui-error').should('be.visible');
      cy.get('input').clear().type('20');
    });

    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.contentField}]`).click();
    cy.get(`[data-value="${BookMonographContentType.Textbook}"]`).click();

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
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.publisherField}] input`)
      .click()
      .type(mockPublishersSearch[0].name);
    cy.contains(mockPublishersSearch[0].name).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.publisherField}] p.Mui-error`).should(
      'not.exist'
    );

    cy.get('[data-testid=nav-tabpanel-resource-type]').within(() =>
      cy.get('[data-testid=error-tab]').should('not.exist')
    );
  });

  it('The User should be able to see validation errors on resource tab (Presentation)', () => {
    cy.get('[data-testid=publication-context-type]').click({ force: true }).type(' ');
    cy.get('[data-testid=publication-context-type-Event]').click({ force: true });

    // publicationInstance type
    cy.get('[data-testid=publication-instance-type]').click({ force: true }).type(' ');
    cy.get('[data-testid=publication-instance-type-ConferenceLecture]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-description]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-resource-type]').within(() =>
      cy.get('[data-testid=error-tab]').should('be.visible')
    );
    cy.get('[data-testid=nav-tabpanel-resource-type]').click({ force: true });
    cy.get('[data-testid=publication-instance-type] p.Mui-error').should('not.exist');
    cy.get('p.Mui-error').should('have.length', 6);

    // publicationContext
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.eventTitleField}] input`).type('My Event');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.eventOrganizerField}] input`).type(
      'My Organization'
    );
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.eventPlaceField}] input`).type('My Place');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.eventCountryField}] input`).click();
    cy.get('[id$=-option-1]').click();

    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.dateFromField}] input`).type('02.01.2020');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.dateToField}] input`).type('01.01.2020');
    cy.get('p.Mui-error').should('have.length', 2);
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.dateFromField}] input`)
      .clear()
      .type('01.01.2020');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.dateToField}] input`).clear().type('02.01.2020');
    cy.get('p.Mui-error').should('have.length', 0);

    cy.get('[data-testid=nav-tabpanel-resource-type]').within(() =>
      cy.get('[data-testid=error-tab]').should('not.exist')
    );
  });

  it('The User should be able to see validation errors on resource tab (Artistic)', () => {
    cy.get('[data-testid=publication-context-type]').click({ force: true }).type(' ');
    cy.get('[data-testid=publication-context-type-Artistic]').click({ force: true });

    // publicationInstance type
    cy.get('[data-testid=publication-instance-type]').click({ force: true }).type(' ');
    cy.get('[data-testid=publication-instance-type-ArtisticDesign]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-description]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-resource-type]').within(() =>
      cy.get('[data-testid=error-tab]').should('be.visible')
    );
    cy.get('[data-testid=nav-tabpanel-resource-type]').click({ force: true });
    cy.get('[data-testid=publication-instance-type] p.Mui-error').should('not.exist');
    cy.get('p.Mui-error').should('have.length', 2);

    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.artisticTypeField}]`).click();
    cy.get(`[data-value=${DesignType.ProductDesign}]`).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.artisticDescriptionField}] textarea`)
      .eq(0)
      .type('My info');

    // Add exhibition place
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.addVenueButton}]`).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.venueNameField}] input`).type('My Venue');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.dateFromField}] input`).type('01.01.2020');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.dateToField}] input`).type('02.01.2020');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.dateToField}] input`).type('02.01.2020');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.saveVenueButton}]`).click();

    cy.get('p.Mui-error').should('have.length', 0);
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
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.publisherField}] input`)
      .click()
      .type(mockPublishersSearch[0].name);
    cy.contains(mockPublishersSearch[0].name).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.publisherField}] p.Mui-error`).should(
      'not.exist'
    );

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

    cy.mockFileUpload();

    cy.get('input[type=file]').attachFile('img.jpg');
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
    cy.get(`[data-testid=${dataTestId.registrationWizard.files.embargoDateField}]`)
      .parent()
      .within(() => {
        cy.get('input').click({ force: true }).type('0101', { force: true }).blur();
        cy.get('p.Mui-error').should('be.visible');
        cy.get('input').click({ force: true }).type('2000', { force: true });
        cy.get('p.Mui-error').should('be.visible');
        cy.get('input').clear().click({ force: true }).type('01013000', { force: true });
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
