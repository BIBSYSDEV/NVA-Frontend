import { combineReducers } from 'redux';

import { ErrorMessageType } from '../types/error.types';
import { SearchResults } from '../types/search.types';
import User from '../types/user.types';
import { errorReducer } from './errorReducer';
import { resourceReducer } from './resourceReducer';
import { userReducer } from './userReducer';

export interface RootStore {
  errors: ErrorMessageType[];
  results: SearchResults;
  user: User;
}

export default combineReducers({ user: userReducer, results: resourceReducer, errors: errorReducer });
