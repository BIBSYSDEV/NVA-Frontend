describe('Publication: Description', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.server();
  });

  it('The user should be able to fill out the form for book type', () => {
    cy.mocklogin();

    // navigate to References (update this when functionality for starting a registration is done)
    cy.get('[data-testid=new-publication-button]').click({ force: true });
    cy.get('[data-testid=new-schema-button]').click({ force: true });

    // choose Book type
    cy.get('[data-testid=search_project]')
      .click({ force: true })
      .type('phd')
      .wait(500)
      .type('{downarrow}')
      .type('{enter}');

    // Check that selected project
    cy.get('[data-testid=selected_project0]').contains('PhD prosjekt: Selvbestemmelse uten ord');
  });
});
