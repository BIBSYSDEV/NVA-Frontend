import { combineReducers } from 'redux';

import { Resource } from '../types/resource.types';
import User from '../types/user.types';
import { errorReducer } from './errorReducer';
import { resourceReducer } from './resourceReducer';
import { userReducer } from './userReducer';

export interface RootStore {
  error: string | null;
  resources: Resource[];
  user: User;
}

export default combineReducers({ user: userReducer, resources: resourceReducer, error: errorReducer });
