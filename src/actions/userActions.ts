import User from '../types/user.types';

// ACTION TYPES
export const SET_USER = 'set user';
export const INIT_LOGIN = 'initiate login';
export const INIT_LOGOUT = 'initiate logout';
export const REFRESH_TOKEN_SUCCESS = 'refresh token success';
export const LOGIN_SUCCESS = 'login success';
export const LOGOUT_SUCCESS = 'logout success';
export const SET_ORCID_INFO = 'set orcid info';

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

export const refreshTokenSuccessAction = () => ({
  type: REFRESH_TOKEN_SUCCESS,
});

export const loginSuccessAction = () => ({
  type: LOGIN_SUCCESS,
});

export const logoutSuccessAction = () => ({
  type: LOGOUT_SUCCESS,
});

export const setOrcidInfo = (name: string, orcid: string) => ({
  type: SET_ORCID_INFO,
  name,
  orcid,
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

export interface RefreshTokenSuccessAction {
  type: typeof REFRESH_TOKEN_SUCCESS;
}

export interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
}

export interface LogoutSuccessAction {
  type: typeof LOGOUT_SUCCESS;
}

export interface SetOrcidInfoAction {
  type: typeof SET_ORCID_INFO;
  name: string;
  orcid: string;
}

export type UserActions =
  | SetUserAction
  | InitLoginAction
  | InitLogoutAction
  | LoginSuccessAction
  | LogoutSuccessAction
  | RefreshTokenSuccessAction
  | SetOrcidInfoAction;
