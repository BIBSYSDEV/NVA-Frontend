describe('Publication: References: Book', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.server();
  });

  it('The user should be able to fill out the form for book type', () => {
    cy.mocklogin();
    // navigate to References (update this when functionality for starting a registration is done)
    cy.get('[data-testid=new-publication]').click({ force: true });

    cy.startPublicationWithDoi();

    cy.get('[data-testid=nav-tabpanel-reference]').click({ force: true });

    // choose Book type
    cy.get('[data-testid=publication-context-type]').click({ force: true }).type(' '); //makes the select options open
    cy.get('[data-testid=publication-context-type-Book]').should('be.visible');
    cy.get('[data-testid=publication-context-type-Book]').click({ force: true });
    cy.get('[data-testid=publication-context-type-heading]').contains('Book');

    cy.get('[data-testid=publication-instance-type]').click({ force: true }).type(' ');
    cy.get('[data-testid=publication-instance-type-BookMonograph]').click({ force: true });

    // search for and select a publisher
    cy.get('[data-testid=autosearch-publisher]').click({ force: true }).type('Test');
    cy.contains('Novum Testamentum').click({ force: true });
    cy.get('[data-testid=autosearch-results-publisher]').contains('Novum Testamentum');

    // fill out ISBN_LIST field
    cy.get('[data-testid=isbn-input]').type('9788202509460').type('{enter}');
    cy.get('[data-testid=isbn-input]').type('978-1-78-763271-4');
    cy.get('[data-testid=is-textbook-checkbox]').click({ force: true });
    cy.get('[data-testid=isbn-chip]').should('have.length', 2);

    // choose peer review value and show NVI status
    cy.get('[data-testid=peer_review-true]').click({ force: true });
    cy.get('[data-testid=nvi_book]').get('[data-testid=nvi_success]');
    cy.get('[data-testid=peer_review-false]').click({ force: true });
    cy.get('[data-testid=nvi_book]').get('[data-testid=nvi_fail_no_peer_review]');

    // fill out number of pages field
    cy.get('[data-testid=pages-input]').type('483');

    // search and select a series
    cy.get('[data-testid=autosearch-series]').click({ force: true }).type('Test');
    cy.contains('New Testament Studies').click({ force: true });
    cy.get('[data-testid=autosearch-results-series]').contains('New Testament Studies');
  });
});
