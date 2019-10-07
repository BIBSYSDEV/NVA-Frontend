import User from '../types/user.types';

// ACTION TYPES
export const SET_USER = 'set user';
export const INIT_LOGIN = 'initiate login';
export const INIT_LOGOUT = 'initiate logout';
export const LOGIN_SUCCESS = 'login success';
export const LOGOUT_SUCCESS = 'logout success';

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

export const loginSuccessAction = () => ({
  type: LOGIN_SUCCESS,
});

export const logoutSuccessAction = () => ({
  type: LOGOUT_SUCCESS,
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

export interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
}

export interface LogoutSuccessAction {
  type: typeof LOGOUT_SUCCESS;
}

export type UserActions = SetUserAction | InitLoginAction | InitLogoutAction | LoginSuccessAction | LogoutSuccessAction;
