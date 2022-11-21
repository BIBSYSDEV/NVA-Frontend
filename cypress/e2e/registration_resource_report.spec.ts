import { JournalType, ReportType } from '../../src/types/publicationFieldNames';
import { dataTestId } from '../../src/utils/dataTestIds';
import { mockJournalsSearch } from '../../src/utils/testfiles/mockJournals';
import { mockPublishersSearch } from '../../src/utils/testfiles/mockPublishers';

describe('Registration: Resource type: Report', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('The user should be able to fill out the form for report type', () => {
    cy.mocklogin();
    cy.get('[data-testid=new-registration]').click();

    cy.startRegistrationWithDoi();

    cy.get('[data-testid=nav-tabpanel-resource-type]').click();

    // choose Report type
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.resourceTypeChip(JournalType.Article)}]`).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.resourceTypeChip(ReportType.Research)}]`).click();
    cy.get(`[data-testid=${dataTestId.confirmDialog.acceptButton}]`).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.resourceTypeChip(ReportType.Research)}]`).should(
      'be.visible'
    );

    // search for and select a publisher
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.publisherField}] input`)
      .click()
      .type(mockPublishersSearch[1].name);
    cy.contains(mockPublishersSearch[1].name).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.publisherChip}]`).should(
      'contain',
      mockPublishersSearch[1].name
    );

    // fill out ISBN_LIST field
    cy.get('[data-testid=isbn-field] input').type('978-1-78-763271-4');

    // fill out number of pages field
    cy.get('[data-testid=pages-field] input').type('483');

    // search and select a series
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.seriesField}] input`)
      .click()
      .type(mockJournalsSearch[0].name);
    cy.contains(mockJournalsSearch[0].name).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.seriesChip}]`).should(
      'contain',
      mockJournalsSearch[0].name
    );
  });
});
