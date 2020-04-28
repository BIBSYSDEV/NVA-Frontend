import { combineReducers } from 'redux';

import { Notification } from '../../types/notification.types';
import { Search } from '../../types/search.types';
import { User } from '../../types/user.types';
import { InstitutionUnitBase } from '../../types/institution.types';
import { notificationReducer } from './notificationReducer';
import { searchReducer } from './searchReducer';
import { userReducer } from './userReducer';
import { publicationReducer } from './publicationReducer';
import { institutionReducer } from './institutionReducer';

export interface RootStore {
  institutions: InstitutionUnitBase[];
  notification: Notification;
  search: Search;
  user: User;
}

export default combineReducers({
  institutions: institutionReducer,
  notification: notificationReducer,
  search: searchReducer,
  user: userReducer,
  publications: publicationReducer,
});
