import User from '../types/user.types';

// ACTION TYPES
export const SET_USER = 'set user';
export const INIT_LOGIN = 'initiate login';
export const INIT_LOGOUT = 'initiate logout';

// ACTION CREATORS
export const setUserAction = (user: User) => ({
  type: SET_USER,
  user,
});

export const initLoginAction = () => ({
  type: INIT_LOGIN,
});

export const initLogoutAction = () => ({
  type: INIT_LOGOUT,
});

export interface SetUserAction {
  type: typeof SET_USER;
  user: User;
}

export interface InitLoginAction {
  type: typeof INIT_LOGIN;
}

export interface InitLogoutAction {
  type: typeof INIT_LOGOUT;
}

export type UserActions = SetUserAction | InitLoginAction | InitLogoutAction;
