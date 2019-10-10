describe('A user logs out from NVA application', () => {
  it('Given that the user is logged in', () => {
    cy.visit('/');
    cy.contains('.auth__username', 'Test User');
  });
  it('When they click on the log-out button', () => {
    cy.contains('.auth__logout__button', 'Logout').click();
  });
  it('Then they are logged out of the NVA application', () => {
    cy.contains('.auth__login__button', 'login');
    cy.contains('.auth__username', 'Test User').should('not.exist');
  });
});
