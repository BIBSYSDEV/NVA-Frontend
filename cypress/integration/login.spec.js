describe('A user logs in with Feide', () => {
  it('Given that the user is on the start page', () => {
    cy.visit('/');
    // Logging out since allready logged in
    cy.contains('.auth__logout__button', 'Logout').click();
  });
  it('When they click on the log-in button', () => {
    // Unable to test login via Feide, so mocking login by setting REACY_APP_USE_MOCK=true in .env file
    cy.contains('.auth__login__button', 'login').click();
  });
  it('And they are redirected to Feide', () => {
    // mocked during testing
  });
  it('And they enter their valid credentials', () => {
    // mocked during testing
  });
  it('Then they are redirected back to the NVA application', () => {
    cy.contains('.logo', 'NVA').should('be.visible');
    cy.contains('.auth__username', 'Test User').should('be.visible');
  });
});
