describe('Publication: References: Chapter', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.server();
  });

  it('The user should be able to fill out the form for chapter type', () => {
    cy.mocklogin();
    // navigate to References (update this when functionality for starting a registration is done)
    cy.get('[data-testid=new-publication-button]').click({ force: true });
    cy.get('[data-testid=new-schema-button]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-references]').click({ force: true });

    // choose Report type
    cy.get('[data-testid=reference_type]')
      .click({ force: true })
      .type(' '); //makes the select options open
    cy.get('[data-testid=reference_type-chapter]').should('be.visible');
    cy.get('[data-testid=reference_type-chapter]').click({ force: true });

    cy.get('[data-testid=reference_type-heading]').contains('Chapter');

    // fill out LINK field
    cy.get('[data-testid=chapter-link]').type('http://www.banan.no');

    // fill out anthologoy-search
    cy.get('[data-testid=chapter-autosearch-anthology]')
      .click({ force: true })
      .type('Test');
    cy.contains('No hits').click({ force: true });

    // fill out number of page-number fields
    cy.get('[data-testid=chapter-pages-from]').type('1');
    cy.get('[data-testid=chapter-pages-to]').type('42');

    cy.get('[data-testid=nvi-chapter]').should('be.visible');
  });
});
