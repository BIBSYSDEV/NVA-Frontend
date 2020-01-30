describe('Publication: Description', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.server();
  });

  it('The user should be able to add and remove projects', () => {
    cy.mocklogin();

    const title = 'Sample title';
    const description = 'Sample description.';

    const isbn = '9788202485238';

    cy.get('[data-testid=new-publication-button]').click({ force: true });

    // TODO: Change this when DOI-link is used
    cy.get('[data-testid=new-schema-button]').click({ force: true });

    // choose fill inn some values on description-tab
    cy.get('[data-testid=nav-tabpanel-description]').click({ force: true });
    cy.get('[data-testid=publication-title-input]').type(title);
    cy.get('[data-testid=publication-description-input]').type(description);

    // choose Book type and fill inn some data
    cy.get('[data-testid=nav-tabpanel-references]').click({ force: true });
    cy.get('[data-testid=reference_type]')
      .click({ force: true })
      .type(' ');
    cy.get('[data-testid=reference_type-book]').click({ force: true });
    cy.get('[data-testid=isbn]').type(isbn);

    cy.get('[data-testid=nav-tabpanel-submission]').click({ force: true });
    cy.contains(title);
    cy.contains(isbn);
    cy.contains(description);
  });
});
