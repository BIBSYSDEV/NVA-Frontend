import User from '../types/user.types';

// ACTION TYPES
export const SET_USER = 'set user';
export const LOG_IN = 'log in';
export const LOG_OUT = 'log out';

// ACTION CREATORS
export const setUser = (user: User) => ({
  type: SET_USER,
  user,
});

export const login = () => ({
  type: LOG_IN,
});

export const logout = () => ({
  type: LOG_OUT,
});

export interface SetUserAction {
  type: typeof SET_USER;
  user: User;
}

export interface LoginAction {
  type: typeof LOG_IN;
}

export interface LogoutAction {
  type: typeof LOG_OUT;
}

export type UserActions = SetUserAction | LoginAction | LogoutAction;
