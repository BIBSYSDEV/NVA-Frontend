export enum NotificationVariant {
  Error = 'error',
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
}

export interface Notification {
  message: string;
  variant: NotificationVariant;
}
