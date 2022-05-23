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

    // choose Report type
    cy.get('[data-testid=publication-context-type]').click({ force: true }).type(' ');
    cy.get('[data-testid=publication-context-type-Chapter]').should('be.visible');
    cy.get('[data-testid=publication-context-type-Chapter]').click();
    cy.get('[data-testid=publication-context-type] input').should('have.value', 'Chapter');

    cy.get('[data-testid=publication-instance-type]').click({ force: true }).type(' ');
    cy.get('[data-testid=publication-instance-type-ChapterArticle]').click();

    // fill out number of page-number fields
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.pagesFromField}]`).type('1');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.pagesToField}]`).type('42');

    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.contentField}]`).click();
    cy.get('[data-testid=content-value-academic-chapter]').click();

    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.peerReviewed}] input`).eq(0).click();
  });
});
