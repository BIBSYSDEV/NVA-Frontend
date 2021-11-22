import { dataTestId } from '../../src/utils/dataTestIds';
import { BookMonographContentType } from '../../src/types/publication_types/content.types';
import { mockJournalsSearch } from '../../src/utils/testfiles/mockJournals';
import { mockPublishersSearch } from '../../src/utils/testfiles/mockPublishers';

describe('Registration: Resource type: Book', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('The user should be able to fill out the form for book type', () => {
    cy.mocklogin();
    cy.get('[data-testid=new-registration]').click({ force: true });

    cy.startRegistrationWithDoi();

    cy.get('[data-testid=nav-tabpanel-resource-type]').click({ force: true });

    // choose Book type
    cy.get('[data-testid=publication-context-type]').click({ force: true }).type(' '); //makes the select options open
    cy.get('[data-testid=publication-context-type-Book]').should('be.visible');
    cy.get('[data-testid=publication-context-type-Book]').click({ force: true });
    cy.get('[data-testid=publication-context-type] input').should('have.value', 'Book');

    cy.get('[data-testid=publication-instance-type]').click({ force: true }).type(' ');
    cy.get('[data-testid=publication-instance-type-BookMonograph]').click({ force: true });

    // NPI Subject
    cy.selectNpiDiscipline('Linguistics');

    // fill out ISBN_LIST field
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.isbnField}] input`).type('978-1-787632714');

    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.contentField}]`).click();
    cy.get(`[data-value="${BookMonographContentType.AcademicMonograph}"]`).click();

    // choose peer review value and show NVI status
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.peerReviewed}] input`)
      .eq(0)
      .click({ force: true });
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.nviFailed}]`).should('be.visible');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.publisherField}] input`)
      .click()
      .type(mockPublishersSearch[1].name);
    cy.contains(mockPublishersSearch[1].name).click({ force: true });

    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.nviSuccess}]`).should('be.visible');

    // fill out number of pages field
    cy.get('[data-testid=pages-field] input').type('483');

    // search and select a series
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.seriesField}] input`)
      .click()
      .type(mockJournalsSearch[2].name);
    cy.contains(mockJournalsSearch[2].name).click({ force: true });
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.seriesChip}]`).should(
      'contain',
      mockJournalsSearch[2].name
    );

    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.seriesChip}] svg`).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.seriesChip}]`).should('not.exist');
  });
});
