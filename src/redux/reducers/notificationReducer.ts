import { Notification } from '../../types/notification.types';
import { SET_NOTIFICATION, NotificationActions, REMOVE_NOTIFICATION } from '../actions/notificationActions';

export const notificationReducer = (state: Notification | null = null, action: NotificationActions) => {
  switch (action.type) {
    case SET_NOTIFICATION:
      return action.notification;
    case REMOVE_NOTIFICATION:
      return null;
    default:
      return state;
  }
};
