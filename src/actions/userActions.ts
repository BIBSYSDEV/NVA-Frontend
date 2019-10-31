import { VariantType } from 'notistack';

import User from '../types/user.types';

// ACTION TYPES
export const CLEAR_USER = 'clear user';
export const SET_USER_SUCCESS = 'set user';
export const SET_USER_FAILURE = 'set user failure';

// ACTION CREATORS
export const clearUserAction = () => ({
  type: CLEAR_USER,
});

export const setUserAction = (user: User) => ({
  type: SET_USER_SUCCESS,
  user,
});

export const setUserFailureAction = (message: string) => ({
  type: SET_USER_FAILURE,
  message,
  variant: 'error',
});

export interface ClearUserAction {
  type: typeof CLEAR_USER;
}
export interface SetUserAction {
  type: typeof SET_USER_SUCCESS;
  user: User;
}

export interface SetUserFailureAction {
  type: typeof SET_USER_FAILURE;
  message: string;
  variant: VariantType;
}

export type UserActions = ClearUserAction | SetUserAction | SetUserFailureAction;
