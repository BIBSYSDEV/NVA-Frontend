import { combineReducers, configureStore } from '@reduxjs/toolkit';
import customerReducer from './customerReducer';
import notificationReducer from './notificationSlice';
import resourcesReducer from './resourcesSlice';
import userReducer from './userSlice';

const rootReducer = combineReducers({
  notification: notificationReducer,
  user: userReducer,
  resources: resourcesReducer,
  customer: customerReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

/**
 * The app runs on the single store created below. A test creates one of its own instead, so that it can start from a
 * state it decides, and so that nothing carries over from one test to the next.
 *
 * @param preloadedState The state to start from. Any slice left out starts from its own initial state.
 * @returns A new store.
 */
export const createStore = (preloadedState?: Partial<RootState>) =>
  configureStore({ reducer: rootReducer, preloadedState });

export type AppStore = ReturnType<typeof createStore>;

export const store = createStore();
