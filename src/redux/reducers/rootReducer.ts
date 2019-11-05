import { combineReducers } from 'redux';

import { FeedbackMessageType } from '../../types/feedback.types';
import User from '../../types/user.types';
import { feedbackReducer } from './feedbackReducer';
import { userReducer } from './userReducer';

export interface RootStore {
  feedback: FeedbackMessageType[];
  user: User;
}

export default combineReducers({
  user: userReducer,
  feedback: feedbackReducer,
});
