describe('Logout', () => {
  before('Given that the user is logged in:', () => {
    cy.visit('/');
    cy.get('[data-cy=menu]').contains('Test User');
  });

  it('The user should be able to log out', () => {
    cy.get('[data-cy=menu]').click({ force: true });
    cy.get('[data-cy=logout-button]').click({ force: true });

    cy.get('[data-cy=login-button]').should('be.visible');
    cy.get('[data-cy=menu]').should('not.exist');
  });
});
