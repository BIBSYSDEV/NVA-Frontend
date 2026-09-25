import { Options } from 'cypress-axe';
import { Notification } from '../../src/types/notification.types';
import { RoleName } from '../../src/types/user.types';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Runs axe and fails on any violation not waived for `snapshot` in
       * cypress/support/a11y-baseline.ts, and on any waiver there that is no
       * longer needed.
       */
      checkA11yWithBaseline(snapshot: string, axeOptions?: Options): void;
      mocklogin(): void;
      typeInDateField(testId: string, value: string, sectionIndex?: number): Chainable<JQuery<HTMLElement>>;
      setUserRolesInRedux(roles: RoleName[]): void;
      startRegistrationWithDoi(): void;
      selectNpiDiscipline(discipline: string): void;
      setNotificationInRedux(notification: Notification): void;
      removeNotificationInRedux(): void;
      mockFileUpload(): void;
    }
  }
}
