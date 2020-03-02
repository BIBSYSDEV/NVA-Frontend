import { Notification, NotificationVariant } from '../../types/notification.types';

export const ADD_NOTIFICATION = 'add notification';
export const REMOVE_NOTIFICATION = 'remove notification';
export const CLEAR_NOTIFICATIONS = 'clear notifications';

export const addNotification = (
  message: string,
  variant: NotificationVariant = NotificationVariant.Success
): AddNotificationAction => ({
  type: ADD_NOTIFICATION,
  notification: {
    message,
    variant,
  },
});

export const removeNotification = (): RemoveNotificationAction => ({
  type: REMOVE_NOTIFICATION,
});

interface AddNotificationAction {
  type: typeof ADD_NOTIFICATION;
  notification: Notification;
}

interface RemoveNotificationAction {
  type: typeof REMOVE_NOTIFICATION;
}

export type NotificationActions = AddNotificationAction | RemoveNotificationAction;
