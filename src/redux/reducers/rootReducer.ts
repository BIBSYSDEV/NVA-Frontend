import { combineReducers } from 'redux';

import { Notification } from '../../types/notification.types';
import { Search } from '../../types/search.types';
import { User } from '../../types/user.types';
import { FormValidator } from '../../types/validation.types';
import { FormsData } from '../../types/form.types';
import { notificationReducer } from './notificationReducer';
import { searchReducer } from './searchReducer';
import { userReducer } from './userReducer';
import { validationReducer } from './validationReducer';
import { formsDataReducer } from './formsDataReducer';

export interface RootStore {
  errors: FormValidator;
  notifications: Notification[];
  search: Search;
  user: User;
  formsData: FormsData;
}

export default combineReducers({
  errors: validationReducer,
  notifications: notificationReducer,
  search: searchReducer,
  user: userReducer,
  formsData: formsDataReducer,
});
