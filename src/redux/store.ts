import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './notificationSlice';
import resourcesReducer from './resourcesSlice';
import { userReducer } from './reducers/userReducer';

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    user: userReducer,
    resources: resourcesReducer,
  },
});
