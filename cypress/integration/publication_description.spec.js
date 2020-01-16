describe('Publication: Description', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.server();
  });

  it('The user should be able to add and remove projects', () => {
    cy.mocklogin();

    cy.get('[data-testid=new-publication-button]').click({ force: true });
    cy.get('[data-testid=new-schema-button]').click({ force: true });

    cy.get('[data-testid=search_project]')
      .click({ force: true })
      .type('phd');
    cy.contains('PhD prosjekt: Selvbestemmelse uten ord').click({ force: true });

    cy.get('[data-testid=selected_project0]').contains('PhD prosjekt: Selvbestemmelse uten ord');

    cy.get('[data-testid=selected_project0_remove_button]').click({ force: true });

    cy.get('[data-testid=selected_project0]').should('not.exist');
  });
});
