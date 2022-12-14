import { configureStore } from '@reduxjs/toolkit';
import customerReducer from './customerReducer';
import notificationReducer from './notificationSlice';
import resourcesReducer from './resourcesSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    user: userReducer,
    resources: resourcesReducer,
    customer: customerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
