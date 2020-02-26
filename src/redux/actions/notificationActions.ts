import { v4 as uuidv4 } from 'uuid';
import { VariantType } from 'notistack';
import { Notification } from '../../types/notification.types';

export const ADD_NOTIFICATION = 'add notification';
export const REMOVE_NOTIFICATION = 'remove notification';
export const CLEAR_NOTIFICATIONS = 'clear notifications';

export const addNotification = (message: string, variant: VariantType = 'success'): AddNotificationAction => ({
  type: ADD_NOTIFICATION,
  notification: {
    message,
    variant,
    key: uuidv4(),
  },
});

export const removeNotification = (key: string): RemoveNotificationAction => ({
  type: REMOVE_NOTIFICATION,
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

interface ClearNotificationAction {
  type: typeof CLEAR_NOTIFICATIONS;
}

export type NotificationActions = AddNotificationAction | RemoveNotificationAction | ClearNotificationAction;
