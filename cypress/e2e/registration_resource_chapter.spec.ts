import { JournalType, BookType, ChapterType } from '../../src/types/publicationFieldNames';
import { ChapterContentType } from '../../src/types/publication_types/content.types';
import { dataTestId } from '../../src/utils/dataTestIds';

describe('Registration: Resource type: Chapter', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('The user should be able to fill out the form for chapter type', () => {
    cy.mocklogin();
    cy.get('[data-testid=new-registration]').click();

    cy.startRegistrationWithDoi();

    cy.get('[data-testid=nav-tabpanel-resource-type]').click();

    // choose Chapter type
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.resourceTypeChip(JournalType.Article)}]`).click();
    cy.get(
      `[data-testid=${dataTestId.registrationWizard.resourceType.resourceTypeChip(ChapterType.AnthologyChapter)}]`
    ).click();
    cy.get(`[data-testid=${dataTestId.confirmDialog.acceptButton}]`).click();
    cy.get(
      `[data-testid=${dataTestId.registrationWizard.resourceType.resourceTypeChip(ChapterType.AnthologyChapter)}]`
    ).should('be.visible');

    // fill out number of page-number fields
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.pagesFromField}]`).type('1');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.pagesToField}]`).type('42');

    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.contentField}]`).click();
    cy.get(
      `[data-testid=${dataTestId.registrationWizard.resourceType.contentValue(ChapterContentType.AcademicChapter)}]`
    ).click();
  });
});
