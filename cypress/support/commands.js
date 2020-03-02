import { setUser } from '../../src/redux/actions/userActions';
import { addNotification, removeNotification } from '../../src/redux/actions/notificationActions';

Cypress.Commands.add('mocklogin', () => {
  // log in
  cy.get('[data-testid=menu-login-button]').click({ force: true });

  // navigate to profile
  cy.get('[data-testid=menu]').click({ force: true });
  cy.get('[data-testid=menu-user-profile-button]').click({ force: true });

  // need to set language to english in order to check that the translated values are correct
  cy.get('[data-testid=language-selector] .MuiSelect-root').click({ force: true });
  cy.get('[data-testid=user-language-en-US]').click({ force: true });
});

Cypress.Commands.add('setUserInRedux', user => {
  cy.window()
    .its('store') // Redux store must be exposed via window.store
    .then(store => store.dispatch(setUser(user)));
});

Cypress.Commands.add('addNotificationInRedux', (message, variant) => {
  cy.window()
    .its('store') // Redux store must be exposed via window.store
    .then(store => store.dispatch(addNotification(message, variant)));
});

Cypress.Commands.add('removeNotificationInRedux', () => {
  cy.window()
    .its('store') // Redux store must be exposed via window.store
    .then(store => store.dispatch(removeNotification()));
});
