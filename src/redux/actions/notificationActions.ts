import { Notification } from '../../types/feedback.types';

export const ADD_NOTIFICATION = 'add notification';
export const REMOVE_NOTIFICATION = 'remove notification';
export const CLOSE_NOTIFICATION = 'close notification';
export const CLEAR_NOTIFICATIONS = 'clear notifications';

export const addNotification = (notification: Notification): AddNotificationAction => ({
  type: ADD_NOTIFICATION,
  notification: notification,
});

export const removeNotification = (key: string): RemoveNotificationAction => ({
  type: REMOVE_NOTIFICATION,
  key,
});

export const closeNotification = (key: string): CloseNotificationAction => ({
  type: CLOSE_NOTIFICATION,
  dismissAll: !key,
  key,
});

export const clearNotifications = (): ClearNotificationAction => ({
  type: CLEAR_NOTIFICATIONS,
});

interface AddNotificationAction {
  type: typeof ADD_NOTIFICATION;
  notification: Notification;
}

interface RemoveNotificationAction {
  type: typeof REMOVE_NOTIFICATION;
  key: string;
}

interface CloseNotificationAction {
  type: typeof CLOSE_NOTIFICATION;
  dismissAll: boolean;
  key: string;
}

interface ClearNotificationAction {
  type: typeof CLEAR_NOTIFICATIONS;
}

export type NotificationActions =
  | AddNotificationAction
  | RemoveNotificationAction
  | CloseNotificationAction
  | ClearNotificationAction;
