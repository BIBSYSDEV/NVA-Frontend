import { dataTestId } from '../../src/utils/dataTestIds';
import { mockJournalsSearch } from '../../src/utils/testfiles/mockJournals';
import { mockPublishersSearch } from '../../src/utils/testfiles/mockPublishers';

describe('Registration: Resource type: Report', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('The user should be able to fill out the form for report type', () => {
    cy.mocklogin();
    cy.get('[data-testid=new-registration]').click({ force: true });

    cy.startRegistrationWithDoi();

    cy.get('[data-testid=nav-tabpanel-resource-type]').click({ force: true });

    // choose Report type
    cy.get('[data-testid=publication-context-type]').click({ force: true }).type(' '); //makes the select options open
    cy.get('[data-testid=publication-context-type-Report]').should('be.visible');
    cy.get('[data-testid=publication-context-type-Report]').click({ force: true });
    cy.get('[data-testid=publication-context-type-Report]').contains('Report');

    cy.get('[data-testid=publication-instance-type]').click({ force: true }).type(' ');
    cy.get('[data-testid=publication-instance-type-ReportResearch]').click({ force: true });

    // search for and select a publisher
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.publisherField}] input`)
      .click()
      .type(mockPublishersSearch[1].name);
    cy.contains(mockPublishersSearch[1].name).click();
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.publisherField}] textarea`).should(
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
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.seriesField}] textarea`).should(
      'contain',
      mockJournalsSearch[0].name
    );
  });
});
