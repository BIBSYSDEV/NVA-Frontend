describe('Snackbar', () => {
  before(() => {
    cy.server();
    cy.visit('/');
  });

  it('The user should be able to see their user details', () => {
    // Test error snackbar
    let notificationMessage = 'An error occurred';
    cy.setNotificationInRedux(notificationMessage, 'error');
    cy.get('[data-testid=snackbar]')
      .children()
      .should('have.class', 'MuiAlert-filledError')
      .contains(notificationMessage);

    // Test Success snackbar
    notificationMessage = 'Something actually went well';
    cy.setNotificationInRedux(notificationMessage, 'success');
    cy.get('[data-testid=snackbar]')
      .children()
      .should('have.class', 'MuiAlert-filledSuccess')
      .contains(notificationMessage);

    // Test Info snackbar
    notificationMessage = 'This is some information';
    cy.setNotificationInRedux(notificationMessage, 'info');
    cy.get('[data-testid=snackbar]')
      .children()
      .should('have.class', 'MuiAlert-filledInfo')
      .contains(notificationMessage);

    // Test warning snackbar
    notificationMessage = 'Mind the gap';
    cy.setNotificationInRedux(notificationMessage, 'warning');
    cy.get('[data-testid=snackbar]')
      .children()
      .should('have.class', 'MuiAlert-filledWarning')
      .contains(notificationMessage);

    // Test clearing snackbar
    cy.removeNotificationInRedux();
    cy.get('[data-testid=snackbar]').should('not.be.visible');
  });
});
