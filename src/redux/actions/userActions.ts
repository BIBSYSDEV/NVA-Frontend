import { VariantType } from 'notistack';

import { FeideUser } from '../../types/user.types';

// ACTION TYPES
export const CLEAR_USER = 'clear user';
export const SET_USER_SUCCESS = 'set user';
export const SET_USER_FAILURE = 'set user failure';

// ACTION CREATORS
export const clearUser = (): ClearUserAction => ({
  type: CLEAR_USER,
});

export const setUser = (user: FeideUser): SetUserAction => ({
  type: SET_USER_SUCCESS,
  user,
});

export const setUserFailure = (message: string): SetUserFailureAction => ({
  type: SET_USER_FAILURE,
  message,
  variant: 'error',
});

interface ClearUserAction {
  type: typeof CLEAR_USER;
}
interface SetUserAction {
  type: typeof SET_USER_SUCCESS;
  user: FeideUser;
}

interface SetUserFailureAction {
  type: typeof SET_USER_FAILURE;
  message: string;
  variant: VariantType;
}

export type UserActions = ClearUserAction | SetUserAction | SetUserFailureAction;
