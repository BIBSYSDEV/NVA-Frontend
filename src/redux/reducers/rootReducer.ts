import { combineReducers } from 'redux';

import { Notification } from '../../types/notification.types';
import { Search } from '../../types/search.types';
import { User } from '../../types/user.types';
import { notificationReducer } from './notificationReducer';
import { searchReducer } from './searchReducer';
import { userReducer } from './userReducer';

export interface RootStore {
  notifications: Notification[];
  search: Search;
  user: User;
}

export default combineReducers({
  notifications: notificationReducer,
  search: searchReducer,
  user: userReducer,
});
