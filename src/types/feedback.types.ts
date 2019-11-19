import { VariantType } from 'notistack';

export const initialFeedbackState = {
  nextNotification: -1,
  notifications: [],
};

export interface NotificationType {
  message: string;
  variant: VariantType;
}

export interface FeedbackType {
  nextNotification: number;
  notifications: NotificationType[];
}
