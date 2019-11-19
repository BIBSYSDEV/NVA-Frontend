import { combineReducers } from 'redux';

import { FeedbackType } from '../../types/feedback.types';
import { Search } from '../../types/search.types';
import { User } from '../../types/user.types';
import { FormValidator } from '../../types/validation.types';
import { authReducer } from './authReducer';
import { feedbackReducer } from './feedbackReducer';
import { searchReducer } from './searchReducer';
import { userReducer } from './userReducer';
import { validationReducer } from './validationReducer';

export interface RootStore {
  auth: { isLoggedIn: boolean };
  errors: FormValidator;
  feedback: FeedbackType;
  search: Search;
  user: User;
}

export default combineReducers({
  auth: authReducer,
  errors: validationReducer,
  feedback: feedbackReducer,
  search: searchReducer,
  user: userReducer,
});
