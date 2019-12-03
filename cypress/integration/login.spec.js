describe('Login', () => {
  beforeEach('Given that the user is on the start page, and is not logged in', () => {
    cy.visit('/');
  });

  it('The user should be able to log in', () => {
    cy.get('[data-testid=login-button]').click({ force: true });

    cy.get('[data-testid=menu]').should('be.visible');
    cy.get('[data-testid=menu]').contains('Test User');
  });
});
