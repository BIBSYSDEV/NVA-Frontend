describe('Menu', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/user');
  });

  it('The user should see menu options', () => {
    cy.get('[data-testid=menu-login-button]').click({ force: true });
    cy.get('[data-testid=menu]').click({ force: true });

    cy.get('[data-testid=menu-user-profile-button]').should('be.visible');
    cy.get('[data-testid=menu-my-publications-button]').should('be.visible');
    cy.get('[data-testid=menu-admin-institution-button]').should('be.visible');
    cy.get('[data-testid=menu-my-worklist-button]').should('be.visible');
    cy.get('[data-testid=menu-logout-button]').should('be.visible');
  });
});
