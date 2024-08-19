import { DesignType } from '../../src/types/publication_types/artisticRegistration.types';
import {
  ArtisticType,
  BookType,
  DegreeType,
  JournalType,
  PresentationType,
  ReportType,
} from '../../src/types/publicationFieldNames';
import { dataTestId } from '../../src/utils/dataTestIds';
import { mockJournalsSearch } from '../../src/utils/testfiles/mockJournals';
import { mockPublishersSearch } from '../../src/utils/testfiles/mockPublishers';

describe('User opens registration form and can see validation errors', () => {
  beforeEach('Given that the user is logged in as Creator:', () => {
    cy.visit('/');
    cy.mocklogin();

    cy.get(`[data-testid=${dataTestId.header.myPageLink}]`).click();
    cy.get(`[data-testid=${dataTestId.myPage.registrationsAccordion}]`).click();
    cy.get('[data-testid=edit-registration-4327439]').click({ force: true });
  });

  it('The User should be see validation errors for every tab', () => {
    cy.get('[data-testid=error-tab]').should('have.length', 3);

    /* The User should be able to see validation errors on description tab */
    cy.get(`[data-testid=${dataTestId.registrationWizard.stepper.descriptionStepButton}]`).click();

    cy.get(`[data-testid=${dataTestId.registrationWizard.description.titleField}] p.Mui-error`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.registrationWizard.stepper.descriptionStepButton}]`).within(() =>
      cy.get('[data-testid=error-tab]').should('exist')
    );
    cy.get(`[data-testid=${dataTestId.registrationWizard.description.titleField}] input`).click().type('TITLE INPUT');
    cy.get(`[data-testid=${dataTestId.registrationWizard.description.titleField}] p.Mui-error`).should('not.exist');

    cy.get(`[data-testid=${dataTestId.registrationWizard.description.datePublishedField}]`).click().type('9');
    cy.get(`[data-testid=${dataTestId.registrationWizard.description.datePublishedField}]`)
      .parent()
      .get('p.Mui-error')
      .should('be.visible');
    cy.get(`[data-testid=${dataTestId.registrationWizard.description.datePublishedField}]`)
      .clear()
      .click()
      .type('01.01.2000');
    cy.get(`[data-testid=${dataTestId.registrationWizard.description.datePublishedField}]`)
      .parent()
      .get('p.Mui-error')
      .should('not.exist');

    cy.get(`[data-testid=${dataTestId.registrationWizard.stepper.descriptionStepButton}]`).within(() =>
      cy.get('[data-testid=error-tab]').should('not.exist')
    );

    /* The User should be able to see validation errors on resource tab (Journal) */
    cy.get(`[data-testid=${dataTestId.registrationWizard.stepper.resourceStepButton}]`).click({ force: true });
    cy.get(`[data-testid=${dataTestId.registrationWizard.stepper.descriptionStepButton}]`).click({ force: true });
    cy.get(`[data-testid=${dataTestId.registrationWizard.stepper.resourceStepButton}]`).click({ force: true });
    cy.get(`[data-testid=${dataTestId.registrationWizard.stepper.resourceStepButton}]`).within(() =>
      cy.get('[data-testid=error-tab]').should('exist')
    );

    // No errors should be displayed when user has just selected new context type
    cy.get(
      `[data-testid=${dataTestId.registrationWizard.resourceType.resourceTypeChip(JournalType.AcademicArticle)}]`
    ).click();
    cy.get('p.Mui-error').should('not.exist');

    cy.get(`[data-testid=${dataTestId.registrationWizard.stepper.descriptionStepButton}]`).click({ force: true });
    cy.get(`[data-testid=${dataTestId.registrationWizard.stepper.resourceStepButton}]`).click({ force: true });
    cy.get('p.Mui-error').should('have.length', 1);

    // Journal (publicationContext) field
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.journalField}] input`)
      .click()
      .type(mockJournalsSearch.hits[0].name);
    cy.contains(mockJournalsSearch.hits[0].name).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.journalChip}]`).should(
      'contain',
      mockJournalsSearch.hits[0].name
    );
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.journalField}] p.Mui-error`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.journalChip}] svg`).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.journalChip}]`).should('not.exist');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.journalField}] p.Mui-error`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.journalField}] input`)
      .click()
      .type(mockJournalsSearch.hits[0].name);
    cy.contains(mockJournalsSearch.hits[0].name).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.journalChip}]`).should(
      'contain',
      mockJournalsSearch.hits[0].name
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

    cy.get('[data-testid=nav-tabpanel-resource-type]').within(() =>
      cy.get('[data-testid=error-tab]').should('not.exist')
    );

    /* The User should be able to see validation errors on resource tab (Book) */
    cy.get(
      `[data-testid=${dataTestId.registrationWizard.resourceType.resourceTypeChip(JournalType.AcademicArticle)}]`
    ).click();
    cy.get(
      `[data-testid=${dataTestId.registrationWizard.resourceType.resourceTypeChip(BookType.AcademicMonograph)}]`
    ).click();
    cy.get(`[data-testid=${dataTestId.confirmDialog.acceptButton}]`).click();
    cy.get(
      `[data-testid=${dataTestId.registrationWizard.resourceType.resourceTypeChip(BookType.AcademicMonograph)}]`
    ).should('be.visible');

    cy.get('[data-testid=nav-tabpanel-description]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-resource-type]').click({ force: true });
    cy.get('[data-testid=publication-instance-type] p.Mui-error').should('not.exist');
    cy.get('p.Mui-error').should('have.length', 2);

    // publicationContext
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.publisherField}] input`)
      .click()
      .type(mockPublishersSearch.hits[0].name);
    cy.contains(mockPublishersSearch.hits[0].name).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.publisherField}] p.Mui-error`).should(
      'not.exist'
    );

    // NPI Subject
    cy.selectNpiDiscipline('Lingvistikk');

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

    cy.get('[data-testid=nav-tabpanel-resource-type]').within(() =>
      cy.get('[data-testid=error-tab]').should('not.exist')
    );

    /* The User should be able to see validation errors on resource tab (Report) */
    cy.get(
      `[data-testid=${dataTestId.registrationWizard.resourceType.resourceTypeChip(BookType.AcademicMonograph)}]`
    ).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.resourceTypeChip(ReportType.Report)}]`).click();
    cy.get(`[data-testid=${dataTestId.confirmDialog.acceptButton}]`).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.resourceTypeChip(ReportType.Report)}]`).should(
      'be.visible'
    );

    // publicationInstance type
    cy.get('[data-testid=nav-tabpanel-description]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-resource-type]').click({ force: true });
    cy.get('[data-testid=publication-instance-type] p.Mui-error').should('not.exist');
    cy.get('p.Mui-error').should('have.length', 1);

    // publicationContext
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.publisherField}] input`)
      .click()
      .type(mockPublishersSearch.hits[0].name);
    cy.contains(mockPublishersSearch.hits[0].name).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.publisherField}] p.Mui-error`).should(
      'not.exist'
    );

    cy.get('[data-testid=nav-tabpanel-resource-type]').within(() =>
      cy.get('[data-testid=error-tab]').should('not.exist')
    );

    /* The User should be able to see validation errors on resource tab (Presentation) */
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.resourceTypeChip(ReportType.Report)}]`).click();
    cy.get(
      `[data-testid=${dataTestId.registrationWizard.resourceType.resourceTypeChip(PresentationType.ConferenceLecture)}]`
    ).click();
    cy.get(`[data-testid=${dataTestId.confirmDialog.acceptButton}]`).click();
    cy.get(
      `[data-testid=${dataTestId.registrationWizard.resourceType.resourceTypeChip(PresentationType.ConferenceLecture)}]`
    ).should('be.visible');

    // publicationInstance type
    cy.get('[data-testid=nav-tabpanel-description]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-resource-type]').within(() =>
      cy.get('[data-testid=error-tab]').should('be.visible')
    );
    cy.get('[data-testid=nav-tabpanel-resource-type]').click({ force: true });
    cy.get('[data-testid=publication-instance-type] p.Mui-error').should('not.exist');
    cy.get('p.Mui-error').should('have.length', 3);

    // publicationContext
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.eventTitleField}] input`).type('My Event');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.eventOrganizerField}] input`).type(
      'My Organization'
    );
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.placeField}]`).type('My Place');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.eventCountryField}]`).click();
    cy.get('[id$=-option-1]').click();

    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.dateFromField}]`).type('02.01.2020');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.dateToField}]`).type('01.01.2020');
    cy.get('p.Mui-error').should('have.length', 1);
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.dateToField}]`).clear().type('2021');
    cy.get('p.Mui-error').should('have.length', 0);

    cy.get('[data-testid=nav-tabpanel-resource-type]').within(() =>
      cy.get('[data-testid=error-tab]').should('not.exist')
    );

    /* The User should be able to see validation errors on resource tab (Artistic) */
    cy.get(
      `[data-testid=${dataTestId.registrationWizard.resourceType.resourceTypeChip(PresentationType.ConferenceLecture)}]`
    ).click();
    cy.get(
      `[data-testid=${dataTestId.registrationWizard.resourceType.resourceTypeChip(ArtisticType.ArtisticDesign)}]`
    ).click();
    cy.get(`[data-testid=${dataTestId.confirmDialog.acceptButton}]`).click();
    cy.get(
      `[data-testid=${dataTestId.registrationWizard.resourceType.resourceTypeChip(ArtisticType.ArtisticDesign)}]`
    ).should('be.visible');

    // publicationInstance type
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
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.dateFromField}]`).type('01.01.2020');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.dateToField}]`).type('02.01.2020');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.dateToField}]`).type('02.01.2020');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.artisticOutputSaveButton}]`).click();

    cy.get('p.Mui-error').should('have.length', 0);
    cy.get('[data-testid=nav-tabpanel-resource-type]').within(() =>
      cy.get('[data-testid=error-tab]').should('not.exist')
    );

    /* The User should be able to see validation errors on resource tab (Degree) */
    cy.get(
      `[data-testid=${dataTestId.registrationWizard.resourceType.resourceTypeChip(ArtisticType.ArtisticDesign)}]`
    ).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.resourceTypeChip(DegreeType.Bachelor)}]`).click();
    cy.get(`[data-testid=${dataTestId.confirmDialog.acceptButton}]`).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.resourceTypeChip(DegreeType.Bachelor)}]`).should(
      'be.visible'
    );

    // publicationInstance type
    cy.get('[data-testid=nav-tabpanel-description]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-resource-type]').click({ force: true });
    cy.get('[data-testid=publication-instance-type] p.Mui-error').should('not.exist');
    cy.get('p.Mui-error').should('have.length', 1);

    // publicationContext
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.publisherField}] input`)
      .click()
      .type(mockPublishersSearch.hits[0].name);
    cy.contains(mockPublishersSearch.hits[0].name).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.publisherField}] p.Mui-error`).should(
      'not.exist'
    );

    cy.get('[data-testid=nav-tabpanel-resource-type]').within(() =>
      cy.get('[data-testid=error-tab]').should('not.exist')
    );

    /* The User should be able to see validation errors on contributors tab */
    cy.get('[data-testid=nav-tabpanel-contributors]').click();
    cy.get('p.Mui-error').should('be.visible');
    cy.get('[data-testid=nav-tabpanel-contributors]').within(() => cy.get('[data-testid=error-tab]').should('exist'));

    // Add author
    cy.get(`[data-testid=${dataTestId.registrationWizard.contributors.addContributorButton}]`).first().click();
    cy.get('[data-testid=contributor-modal]').should('be.visible');
    cy.get(`[data-testid=${dataTestId.registrationWizard.contributors.searchField}] input`).type('test');
    cy.get(`[data-testid=${dataTestId.registrationWizard.contributors.selectPersonForContributor}]`).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.contributors.selectUserButton}]`).click();
    cy.get('[data-testid=contributor-modal]').should('not.exist');

    cy.get('p.Mui-error').should('not.exist');

    cy.get('[data-testid=nav-tabpanel-contributors]').within(() =>
      cy.get('[data-testid=error-tab]').should('not.exist')
    );

    /* The User should be able to see validation errors on files tab */
    cy.get('[data-testid="nav-tabpanel-files-and-license"]').click({ force: true });

    cy.get('p.Mui-error').should('have.length', 0);
    cy.get('[data-testid=nav-tabpanel-files-and-license]').within(() =>
      cy.get('[data-testid=error-tab]').should('not.exist')
    );

    cy.mockFileUpload();

    cy.fixture('img.jpg').as('file');
    cy.get('input[type=file]').first().selectFile('@file', { force: true });
    cy.get('[data-testid=uploaded-file-row]').should('be.visible');
    cy.get('p.Mui-error').should('not.exist');

    // Lincense field
    cy.get('[data-testid=nav-tabpanel-contributors]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-files-and-license]').click({ force: true });
    cy.get('[data-testid=uploaded-file-select-license] p.Mui-error').should('exist');
    cy.get('[data-testid=uploaded-file-select-license]').click({ force: true }).type(' ');
    cy.get('[data-testid=license-item]').eq(0).click({ force: true });
    cy.get('[data-testid=uploaded-file-select-license] p.Mui-error').should('not.exist');

    // Embargo field
    cy.get(`[data-testid=${dataTestId.registrationWizard.files.expandFileRowButton}]`).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.files.embargoDateField}]`).type('01013000').blur();
    cy.get(`[data-testid=${dataTestId.registrationWizard.files.embargoDateField}]`)
      .get('p.Mui-error')
      .should('not.exist');

    cy.get('[data-testid=error-tab]').should('not.exist');
  });
});
