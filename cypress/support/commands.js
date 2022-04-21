import { setRoles } from '../../src/redux/actions/userActions';
import { setNotification, removeNotification } from '../../src/redux/notificationSlice';
import { mockFileUploadUrl } from '../../src/utils/testfiles/mockFiles';
import { dataTestId } from '../../src/utils/dataTestIds';

Cypress.Commands.add('mocklogin', () => {
  cy.get(`[data-testid=${dataTestId.header.logInButton}]`).click({ force: true });

  // need to set language to english in order to check that the translated values are correct
  cy.get(`[data-testid=${dataTestId.header.languageButton}]`).click({ force: true });
  cy.get(`[data-testid=${dataTestId.header.languageMenu}] li`).eq(1).click({ force: true });
});

Cypress.Commands.add('startRegistrationWithDoi', () => {
  cy.get('[data-testid=new-registration-link]').click({ force: true });
  cy.get('[data-testid=new-registration-link-field] input').type('https://doi.org/10.1098/rspb.2018.0085');
  cy.get('[data-testid=doi-search-button]').click({ force: true });
  cy.get(`[data-testid=${dataTestId.registrationWizard.new.startRegistrationButton}]`).filter(':visible').click();
});

Cypress.Commands.add('selectNpiDiscipline', (npiDiscipline) => {
  cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.scientificSubjectField}]`)
    .click({ force: true })
    .type(npiDiscipline);
  cy.contains(npiDiscipline).click({ force: true });
  cy.get(`[data-testid=${dataTestId.registrationWizard.resourceType.scientificSubjectField}]`).should(
    'contain',
    npiDiscipline
  );
});

Cypress.Commands.add('setUserRolesInRedux', (roles) => {
  cy.window()
    .its('store') // Redux store must be exposed via window.store
    .then((store) => store.dispatch(setRoles(roles)));
});

Cypress.Commands.add('setNotificationInRedux', (notification) => {
  cy.window()
    .its('store') // Redux store must be exposed via window.store
    .then((store) => store.dispatch(setNotification(notification)));
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
