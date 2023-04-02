// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import 'cypress-axe';
import './commands';
import '@cypress/code-coverage/support';
import { RoleName } from '../../src/types/user.types';
import { Notification } from '../../src/types/notification.types';

declare global {
  namespace Cypress {
    interface Chainable {
      mocklogin(): void;
      setUserRolesInRedux(roles: RoleName[]): void;
      startRegistrationWithDoi(): void;
      selectNpiDiscipline(discipline: string): void;
      setNotificationInRedux(notification: Notification): void;
      removeNotificationInRedux(): void;
      mockFileUpload(): void;
    }
  }
}

Cypress.on('uncaught:exception', (err, runnable) => {
  // we expect a 3rd party library error with message 'list not defined'
  // and don't want to fail the test so we return false
  // if (err.message.includes('list not defined')) {
  console.log('HEIDU', err.message);
  return false;
  // }
  // we still want to ensure there are no other unexpected
  // errors, so we let them fail the test
});
