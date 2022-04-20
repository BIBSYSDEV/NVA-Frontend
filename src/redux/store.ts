import { configureStore } from '@reduxjs/toolkit';
import { notificationReducer } from './reducers/notificationReducer';
import { resourcesReducer } from './reducers/ResourcesReducer';
import { userReducer } from './reducers/userReducer';

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    user: userReducer,
    resources: resourcesReducer,
  },
});
