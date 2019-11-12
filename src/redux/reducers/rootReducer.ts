import { combineReducers } from 'redux';

import ContributorType from '../../types/contributor.types';
import { FeedbackMessageType } from '../../types/feedback.types';
import { Search } from '../../types/search.types';
import User from '../../types/user.types';
import { FormValidator } from '../../types/validation.types';
import { contributorReducer } from './contributorReducer';
import { feedbackReducer } from './feedbackReducer';
import { searchReducer } from './searchReducer';
import { userReducer } from './userReducer';
import { validationReducer } from './validationReducer';

export interface RootStore {
  errors: FormValidator;
  feedback: FeedbackMessageType[];
  search: Search;
  user: User;
  contributors: ContributorType[];
}

export default combineReducers({
  errors: validationReducer,
  user: userReducer,
  search: searchReducer,
  feedback: feedbackReducer,
  contributors: contributorReducer,
});
