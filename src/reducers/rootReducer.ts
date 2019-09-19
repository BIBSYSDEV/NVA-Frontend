import { combineReducers } from 'redux';
import { userReducer } from './userReducer';
import User from '../types/user.types';

export interface RootStore {
  user: User;
}

export default combineReducers({ user: userReducer });
