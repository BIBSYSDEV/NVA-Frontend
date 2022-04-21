import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '../types/notification.types';
import i18n from '../translations/i18n';

const initialState = null as Notification | null;

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (state, action: PayloadAction<Notification>) => {
      const { message, variant } = action.payload;
      if (typeof message !== 'string') {
        state = { message: i18n.t('feedback:error.an_error_occurred'), variant: 'error' };
      } else {
        state = { message, variant };
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
