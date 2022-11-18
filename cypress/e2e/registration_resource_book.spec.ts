import { dataTestId } from '../../src/utils/dataTestIds';
import { BookMonographContentType } from '../../src/types/publication_types/content.types';
import { mockJournalsSearch } from '../../src/utils/testfiles/mockJournals';
import { mockPublishersSearch } from '../../src/utils/testfiles/mockPublishers';
import { BookType, JournalType } from '../../src/types/publicationFieldNames';

describe('Registration: Resource type: Book', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('The user should be able to fill out the form for book type', () => {
    cy.mocklogin();
    cy.get('[data-testid=new-registration]').click();

    cy.startRegistrationWithDoi();

    cy.get('[data-testid=nav-tabpanel-resource-type]').click();

    // choose Book type
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.resourceTypeChip(JournalType.Article)}]`).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.resourceTypeChip(BookType.Monograph)}]`).click();
    cy.get(`[data-testid=${dataTestId.confirmDialog.acceptButton}]`).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.resourceTypeChip(BookType.Monograph)}]`).should(
      'be.visible'
    );

    // NPI Subject
    cy.selectNpiDiscipline('Linguistics');

    // fill out ISBN_LIST field
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.isbnField}] input`).type('978-1-787632714');

    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.contentField}]`).click();
    cy.get(`[data-value="${BookMonographContentType.AcademicMonograph}"]`).click();

    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.nviFailed}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.publisherField}] input`)
      .click()
      .type(mockPublishersSearch[1].name);
    cy.contains(mockPublishersSearch[1].name).click();

    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.nviSuccess}]`).should('be.visible');

    // fill out number of pages field
    cy.get('[data-testid=pages-field] input').type('483');

    // search and select a series
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.seriesField}] input`)
      .click()
      .type(mockJournalsSearch[2].name);
    cy.contains(mockJournalsSearch[2].name).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.seriesChip}]`).should(
      'contain',
      mockJournalsSearch[2].name
    );

    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.seriesChip}] svg`).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.seriesChip}]`).should('not.exist');
  });
});
