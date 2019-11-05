import { combineReducers } from 'redux';

import { FeedbackMessageType } from '../../types/feedback.types';
import { Search } from '../../types/search.types';
import User from '../../types/user.types';
import { feedbackReducer } from './feedbackReducer';
import { searchReducer } from './searchReducer';
import { userReducer } from './userReducer';

export interface RootStore {
  feedback: FeedbackMessageType[];
  search: Search;
  user: User;
}

export default combineReducers({
  user: userReducer,
  search: searchReducer,
  feedback: feedbackReducer,
});
