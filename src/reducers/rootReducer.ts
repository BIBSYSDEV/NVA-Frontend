import { combineReducers } from 'redux';

import { Resource } from '../types/resource.types';
import User from '../types/user.types';
import { resourceReducer } from './resourceReducer';
import { userReducer } from './userReducer';

export interface RootStore {
  user: User;
  resources: Resource[];
}

export default combineReducers({ user: userReducer, resources: resourceReducer });
