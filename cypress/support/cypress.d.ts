import { Notification } from '../../src/types/notification.types';
import { RoleName } from '../../src/types/user.types';

declare global {
  namespace Cypress {
    interface Chainable {
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
