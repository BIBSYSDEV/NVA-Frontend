import { VariantType } from 'notistack';

const ADD_NOTIFICATION = 'add notification';
const REMOVE_NOTIFICATION = 'remove notification';

interface NotiStackNotification {
  key: string;
  message: string;
  variant: VariantType;
}

export const addNotification = (notification: NotiStackNotification) => ({
  type: ADD_NOTIFICATION,
  notification: notification,
});

export const removeNorification = (key: string) => ({});
