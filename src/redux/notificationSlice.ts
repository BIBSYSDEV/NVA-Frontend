import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import i18n from '../translations/i18n';
import { Notification } from '../types/notification.types';

const initialState = null as Notification | null;

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (state, action: PayloadAction<Notification>) => {
      const { message, variant, detail } = action.payload;
      if (typeof message !== 'string') {
        state = { message: i18n.t('feedback.error.an_error_occurred'), variant: 'error' };
      } else {
        state = { message, variant, detail };
      }
      return state;
    },
    removeNotification: (state) => {
      state = initialState;
      return state;
    },
  },
});

export const { setNotification, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
