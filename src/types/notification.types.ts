import { AlertColor } from '@mui/material';

export interface Notification {
  message: string;
  variant: AlertColor;
  detail?: string;
}
