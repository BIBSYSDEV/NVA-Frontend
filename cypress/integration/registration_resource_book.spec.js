import { dataTestId } from '../../src/utils/dataTestIds';

describe('Registration: Resource type: Book', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.server();
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
    cy.get('[data-testid=publication-context-type-Book]').contains('Book');

    cy.get('[data-testid=publication-instance-type]').click({ force: true }).type(' ');
    cy.get('[data-testid=publication-instance-type-BookMonograph]').click({ force: true });

    // search for and select a publisher
    cy.get('[data-testid=publisher-search-field] input').click({ force: true }).type('Test');
    cy.contains('Novum Testamentum').click({ force: true });
    cy.get('[data-testid=publisher-search-field] input').should('have.value', 'Novum Testamentum');

    // NPI Subject
    cy.selectNpiDiscipline('Linguistics');

    // fill out ISBN_LIST field
    cy.get('[data-testid=isbn-field] input').type('978-1-78-763271-4').type('{enter}').type('9788202509460');
    cy.get('[data-testid=is-textbook-checkbox]').click({ force: true });
    cy.get('[data-testid=isbn-chip]').should('have.length', 2);

    // choose peer review value and show NVI status
    cy.get('[data-testid=nvi_book]').get('[data-testid=nvi_fail]');
    cy.get('[data-testid=is-textbook-checkbox]').click({ force: true });
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.peerReviewed}] input`).eq(0).click();
    cy.get('[data-testid=nvi_book]').get('[data-testid=nvi_success]');
    cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.peerReviewed}] input`).eq(1).click();
    cy.get('[data-testid=nvi_book]').get('[data-testid=nvi_fail_no_peer_review]');

    // fill out number of pages field
    cy.get('[data-testid=pages-field] input').type('483');

    // search and select a series
    cy.get('[data-testid=series-search-field] input').click({ force: true }).type('Test');
    cy.contains('New Testament Studies').click({ force: true });
    cy.get('[data-testid=series-search-field] input').should('have.value', 'New Testament Studies');
  });
});
