describe('Publication: Contributors', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.server();
  });

  it('The user should be able to open the Add Contributor modal', () => {
    cy.mocklogin();

    // navigate to Contributors (update this when functionality for starting a registration is done)
    cy.get('[data-testid=menu]').click({ force: true });
    cy.get('[data-testid=menu-new-publication-button]').click({ force: true });
    cy.get('[data-testid=new-schema-button]').click({ force: true });
    cy.get('[data-testid=nav-tabpanel-contributors]').click({ force: true });

    // click Add Contributor button
    cy.get('[data-testid=add-contributor]').click({ force: true });

    // verify that there is a search field
    cy.get('[data-testid=search-input]').should('be.visible');
  });
});
