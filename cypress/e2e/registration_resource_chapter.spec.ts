import { JournalType, ChapterType } from '../../src/types/publicationFieldNames';
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
    cy.get(
      `[data-testid=${dataTestId.registrationWizard.resourceType.resourceTypeChip(JournalType.AcademicArticle)}]`
    ).click();
    cy.get(
      `[data-testid=${dataTestId.registrationWizard.resourceType.resourceTypeChip(ChapterType.AcademicChapter)}]`
    ).click();
    cy.get(`[data-testid=${dataTestId.confirmDialog.acceptButton}]`).click();
    cy.get(
      `[data-testid=${dataTestId.registrationWizard.resourceType.resourceTypeChip(ChapterType.AcademicChapter)}]`
    ).should('be.visible');

    // fill out number of page-number fields
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.pagesFromField}]`).type('1');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.pagesToField}]`).type('42');
  });
});
