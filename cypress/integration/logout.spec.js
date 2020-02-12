describe('Logout', () => {
  before('Given that the user is logged in:', () => {
    cy.visit('/');
    cy.get('[data-testid=menu-login-button]').click({ force: true });
    cy.get('[data-testid=menu]').contains('Test User');
  });

  it('The user should be able to log out', () => {
    cy.get('[data-testid=menu]').click({ force: true });
    cy.get('[data-testid=menu-logout-button]').click({ force: true });

    cy.get('[data-testid=menu-login-button]').should('be.visible');
    cy.get('[data-testid=menu]').should('not.exist');
  });
});
