import { Notification } from '../../types/notification.types';
import i18n from '../../translations/i18n';
import { AlertColor } from '@mui/material';

export const SET_NOTIFICATION = 'set notification';
export const REMOVE_NOTIFICATION = 'remove notification';

export const setNotification = (message: string, variant: AlertColor = 'success'): SetNotificationAction => {
  if (typeof message !== 'string') {
    message = i18n.t('feedback:error.an_error_occurred');
    variant = 'error';
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
