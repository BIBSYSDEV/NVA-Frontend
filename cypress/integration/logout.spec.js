describe('A user logs out from NVA application', () => {
  it('Given that the user is logged in', () => {
    cy.visit('/');
    cy.contains('Test User');
  });
  it('When they click on the log-out button', () => {
    cy.get('[data-cy=menu]').click();
    cy.get('[data-cy=logout-button]').click();
  });
  it('Then they are logged out of the NVA application', () => {
    cy.get('[data-cy=login-button]').should('be.visible');
    cy.contains('Test User').should('not.exist');
  });
});
