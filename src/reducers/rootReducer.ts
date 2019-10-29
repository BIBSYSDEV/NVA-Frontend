import { combineReducers } from 'redux';

import { FeedbackMessageType } from '../types/feedback.types';
import { SearchResults } from '../types/search.types';
import User from '../types/user.types';
import { feedbackReducer } from './feedbackReducer';
import { resourceReducer } from './resourceReducer';
import { userReducer } from './userReducer';

export interface RootStore {
  feedback: FeedbackMessageType[];
  results: SearchResults;
  user: User;
}

export default combineReducers({
  user: userReducer,
  results: resourceReducer,
  feedback: feedbackReducer,
});
