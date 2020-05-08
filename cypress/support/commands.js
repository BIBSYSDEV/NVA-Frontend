import { setUser } from '../../src/redux/actions/userActions';
import { setNotification, removeNotification } from '../../src/redux/actions/notificationActions';

Cypress.Commands.add('mocklogin', () => {
  cy.get('[data-testid=menu-login-button]').click({ force: true });
  cy.get('[data-testid=author-radio-button]').eq(1).click({ force: true });
  cy.get('[data-testid=connect-author-button]').click({ force: true });
  cy.get('[data-testid=modal_next]').click({ force: true });
  cy.get('[data-testid=skip-connect-to-orcid]').click({ force: true });

  // navigate to profile
  cy.get('[data-testid=menu]').click({ force: true });
  cy.get('[data-testid=menu-user-profile-button]').click({ force: true });

  // need to set language to english in order to check that the translated values are correct
  cy.get('[data-testid=language-selector] .MuiSelect-root').click({ force: true });
  cy.get('[data-testid=user-language-eng]').click({ force: true });
});

Cypress.Commands.add('startPublicationWithDoi', () => {
  cy.get('[data-testid=new-publication-link]').click({ force: true });
  cy.get('[data-testid=new-publication-link-input]').type('https://doi.org/10.1098/rspb.2018.0085');
  cy.get('[data-testid=doi-search-button]').click({ force: true });
  cy.get('[data-testid=publication-link-next-button]').click({ force: true });
});

Cypress.Commands.add('setUserInRedux', (user) => {
  cy.window()
    .its('store') // Redux store must be exposed via window.store
    .then((store) => store.dispatch(setUser(user)));
});

Cypress.Commands.add('setNotificationInRedux', (message, variant) => {
  cy.window()
    .its('store') // Redux store must be exposed via window.store
    .then((store) => store.dispatch(setNotification(message, variant)));
});

Cypress.Commands.add('removeNotificationInRedux', () => {
  cy.window()
    .its('store') // Redux store must be exposed via window.store
    .then((store) => store.dispatch(removeNotification()));
});

// Inspired by: https://github.com/cypress-io/cypress/issues/170#issuecomment-533519550
Cypress.Commands.add('uploadFile', { prevSubject: true }, (subject, fileName) => {
  cy.fixture(fileName).then((content) => {
    const el = subject[0];
    const testFile = new File([content], fileName);
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(testFile);
    el.files = dataTransfer.files;
    cy.wrap(subject).trigger('change', { force: true });
  });
});
