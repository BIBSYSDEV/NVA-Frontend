import { NotificationType } from '../../types/feedback.types';

export const ADD_NOTIFICATION = 'add notification';
export const REMOVE_NOTIFICATION = 'remove notification';

export const addNotification = (notification: NotificationType): AddNotificationAction => ({
  type: ADD_NOTIFICATION,
  notification: notification,
});

export const removeNotification = (key: string): RemoveNotificationAction => ({
  type: REMOVE_NOTIFICATION,
  key: key,
});

interface AddNotificationAction {
  type: typeof ADD_NOTIFICATION;
  notification: NotificationType;
}

interface RemoveNotificationAction {
  type: typeof REMOVE_NOTIFICATION;
  key: string;
}

export type FeedbackActions = AddNotificationAction | RemoveNotificationAction;
