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

import '@cypress/code-coverage/support';
import 'cypress-axe';
import { Notification } from '../../src/types/notification.types';
import { RoleName } from '../../src/types/user.types';
import './commands';

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
