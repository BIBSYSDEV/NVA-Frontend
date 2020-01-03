import { VariantType } from 'notistack';

export interface Notification {
  message: string;
  variant: VariantType;
  key: string;
  dismissed?: boolean;
}
