import { combineReducers } from 'redux';

import { FeedbackMessageType } from '../../types/feedback.types';
import { Search } from '../../types/search.types';
import { User } from '../../types/user.types';
import { FormValidator } from '../../types/validation.types';
import { FormsData } from '../../types/form.types';
import { authReducer } from './authReducer';
import { feedbackReducer } from './feedbackReducer';
import { searchReducer } from './searchReducer';
import { userReducer } from './userReducer';
import { validationReducer } from './validationReducer';
import { formsDataReducer } from './formsDataReducer';

export interface RootStore {
  auth: { isLoggedIn: boolean };
  errors: FormValidator;
  feedback: FeedbackMessageType[];
  search: Search;
  user: User;
  forms: FormsData;
}

export default combineReducers({
  errors: validationReducer,
  user: userReducer,
  search: searchReducer,
  feedback: feedbackReducer,
  auth: authReducer,
  formsData: formsDataReducer,
});
