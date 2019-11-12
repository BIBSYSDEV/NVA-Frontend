import { combineReducers } from 'redux';

import { FeedbackMessageType } from '../../types/feedback.types';
import { Search } from '../../types/search.types';
import User from '../../types/user.types';
import { FormValidator } from '../../types/validation.types';
import { feedbackReducer } from './feedbackReducer';
import { searchReducer } from './searchReducer';
import { userReducer } from './userReducer';
import { validationReducer } from './validationReducer';

export interface RootStore {
  errors: FormValidator;
  feedback: FeedbackMessageType[];
  search: Search;
  user: User;
}

export default combineReducers({
  errors: validationReducer,
  user: userReducer,
  search: searchReducer,
  feedback: feedbackReducer,
});
