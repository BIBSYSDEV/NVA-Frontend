Cypress.Commands.add('mocklogin', () => {
  // ignore the modal
  window.localStorage.setItem('showAuthorityModal', 'false');
  window.localStorage.setItem('showOrcidModal', 'false');

  // log in
  cy.get('[data-testid=login-button]').click({ force: true });

  // set language
  cy.get('[data-testid=menu]').click({ force: true });
  cy.get('[data-testid=user-profile-button]').click({ force: true });

  // need to set language to english in order to check that the translated values are correct
  cy.get('[data-testid=language-selector] .MuiSelect-root').click({ force: true });
  cy.get('[data-testid=user-language-en-US]').click({ force: true });
});
