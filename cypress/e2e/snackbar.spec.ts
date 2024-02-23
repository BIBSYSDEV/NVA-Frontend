describe('Snackbar', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('The user should see snackbar info', () => {
    // Test error snackbar
    let notificationMessage = 'An error occurred';
    cy.setNotificationInRedux({ message: notificationMessage, variant: 'error' });
    cy.get('[data-testid=snackbar-error]')
      .children()
      .should('have.class', 'MuiAlert-filledError')
      .contains(notificationMessage);

    // Test Success snackbar
    notificationMessage = 'Something actually went well';
    cy.setNotificationInRedux({ message: notificationMessage, variant: 'success' });
    cy.get('[data-testid=snackbar-success]')
      .children()
      .should('have.class', 'MuiAlert-filledSuccess')
      .contains(notificationMessage);

    // Test Info snackbar
    notificationMessage = 'This is some information';
    cy.setNotificationInRedux({ message: notificationMessage, variant: 'info' });
    cy.get('[data-testid=snackbar-info]')
      .children()
      .should('have.class', 'MuiAlert-filledInfo')
      .contains(notificationMessage);

    // Test warning snackbar
    notificationMessage = 'Mind the gap';
    cy.setNotificationInRedux({ message: notificationMessage, variant: 'warning' });
    cy.get('[data-testid=snackbar-warning]')
      .children()
      .should('have.class', 'MuiAlert-filledWarning')
      .contains(notificationMessage);

    // Test clearing snackbar
    cy.removeNotificationInRedux();
    cy.get('[data-testid=snackbar-warning]').should('not.exist');
  });
});
