describe('Publication: References', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.server();
  });

  it('The user should be able to fill out the form for report type', () => {
    cy.mocklogin();
    // navigate to References (update this when functionality for starting a registration is done)
    cy.get('[data-testid=new-publication-button]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-references]').click({ force: true });

    // choose Report type
    cy.get('[data-testid=reference_type]')
      .click({ force: true })
      .type(' '); //makes the select options open
    cy.get('[data-testid=reference_type-report]').should('be.visible');
    cy.get('[data-testid=reference_type-report]').click({ force: true });

    cy.get('[data-testid=reference_type-heading]').contains('Report');

    // search for and select a publisher
    cy.get('[data-testid=autosearch-publisher]')
      .click({ force: true })
      .type('Test');
    cy.contains('Novum Testamentum').click({ force: true });
    cy.get('[data-testid=autosearch-results-publisher]').contains('Novum Testamentum');

    // fill out ISBN field
    cy.get('[data-testid=isbn]').type('978-3-16-148410-0');

    // fill out number of pages field
    cy.get('[data-testid=number_of_pages]').type('483');

    // search and select a series
    cy.get('[data-testid=autosearch-series]')
      .click({ force: true })
      .type('Test');
    cy.contains('New Testament Studies').click({ force: true });
    cy.get('[data-testid=autosearch-results-series]').contains('New Testament Studies');
  });
});
