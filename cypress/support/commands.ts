import { removeNotification, setNotification } from '../../src/redux/notificationSlice';
import { setPartialUser } from '../../src/redux/userSlice';
import { RoleName } from '../../src/types/user.types';
import { dataTestId } from '../../src/utils/dataTestIds';
import { mockFileUploadUrl } from '../../src/utils/testfiles/mockFiles';

Cypress.Commands.add('mocklogin', () => {
  cy.get(`[data-testid=${dataTestId.header.logInButton}]`).click();
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
    .then((store) =>
      store.dispatch(
        setPartialUser({
          roles: roles,
          isCreator: roles.includes(RoleName.Creator),
          isAppAdmin: roles.includes(RoleName.AppAdmin),
          isInstitutionAdmin: roles.includes(RoleName.InstitutionAdmin),
          isDoiCurator: roles.includes(RoleName.DoiCurator),
          isPublishingCurator: roles.includes(RoleName.PublishingCurator),
          isSupportCurator: roles.includes(RoleName.SupportCurator),
          isNviCurator: roles.includes(RoleName.NviCurator),
          isThesisCurator: roles.includes(RoleName.CuratorThesis),
          isEmbargoThesisCurator: roles.includes(RoleName.CuratorThesisEmbargo),
          isEditor: roles.includes(RoleName.Editor),
          isInternalImporter: roles.includes(RoleName.InternalImporter),
        })
      )
    );
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
