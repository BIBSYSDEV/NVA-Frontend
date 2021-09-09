import { setRoles } from '../../src/redux/actions/userActions';
import { setNotification, removeNotification } from '../../src/redux/actions/notificationActions';
import { mockFileUploadUrl } from '../../src/api/mock-interceptor';
import { dataTestId } from '../../src/utils/dataTestIds';

Cypress.Commands.add('mocklogin', () => {
  cy.get(`[data-testid=${dataTestId.header.logInButton}]`).click({ force: true });
  cy.get('[data-testid=author-radio-button]').eq(1).click({ force: true });
  cy.get('[data-testid=connect-author-button]').click({ force: true });
  cy.get('[data-testid=modal_next]').click({ force: true });
  cy.get('[data-testid=cancel-connect-to-orcid]').click({ force: true });

  // need to set language to english in order to check that the translated values are correct
  cy.get(`[data-testid=${dataTestId.header.languageButton}]`).click({ force: true });
  cy.get(`[data-testid=${dataTestId.header.languageMenu}] li`).eq(1).click({ force: true });
});

Cypress.Commands.add('startRegistrationWithDoi', () => {
  cy.get('[data-testid=new-registration-link]').click({ force: true });
  cy.get('[data-testid=new-registration-link-field] input').type('https://doi.org/10.1098/rspb.2018.0085');
  cy.get('[data-testid=doi-search-button]').click({ force: true });
  cy.get('[data-testid=registration-link-next-button]').click({ force: true });
});

Cypress.Commands.add('selectNpiDiscipline', (npiDiscipline) => {
  cy.get('[data-testid=search_npi]').click({ force: true }).type(npiDiscipline);
  cy.contains(npiDiscipline).click({ force: true });
  cy.get('[data-testid=search_npi]').within(() => {
    cy.get('input').should('have.value', npiDiscipline);
  });
});

Cypress.Commands.add('setUserRolesInRedux', (roles) => {
  cy.window()
    .its('store') // Redux store must be exposed via window.store
    .then((store) => store.dispatch(setRoles(roles)));
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

Cypress.Commands.add('mockFileUpload', () => {
  cy.intercept(
    { method: 'PUT', url: mockFileUploadUrl },
    { statusCode: 200, headers: { ETag: Math.floor(Math.random() * 1000).toString() } }
  );
});
