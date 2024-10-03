import { Notification } from '../../src/types/notification.types';
import { RoleName } from '../../src/types/user.types';

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
