import { Notification, NotificationVariant } from '../../types/notification.types';
import i18n from '../../translations/i18n';

export const SET_NOTIFICATION = 'set notification';
export const REMOVE_NOTIFICATION = 'remove notification';

export const setNotification = (
  message: string,
  variant: NotificationVariant = NotificationVariant.Success
): SetNotificationAction => {
  if (typeof message !== 'string') {
    message = i18n.t('feedback:error.an_error_occurred');
    variant = NotificationVariant.Error;
  }
  return {
    type: SET_NOTIFICATION,
    notification: {
      message,
      variant,
    },
  };
};

export const removeNotification = (): RemoveNotificationAction => ({
  type: REMOVE_NOTIFICATION,
});

interface SetNotificationAction {
  type: typeof SET_NOTIFICATION;
  notification: Notification;
}

interface RemoveNotificationAction {
  type: typeof REMOVE_NOTIFICATION;
}

export type NotificationActions = SetNotificationAction | RemoveNotificationAction;
