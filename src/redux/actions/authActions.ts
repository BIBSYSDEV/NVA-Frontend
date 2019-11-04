import { VariantType } from 'notistack';

export const LOGIN_FAILURE = 'login failure';
export const REFRESH_TOKEN_FAILURE = 'refresh token failure';
export const INIT_LOGIN = 'initiate login';
export const INIT_LOGOUT = 'initiate logout';
export const REFRESH_TOKEN_SUCCESS = 'refresh token success';
export const LOGIN_SUCCESS = 'login success';
export const LOGOUT_SUCCESS = 'logout success';

export const initLogin = (): InitLoginAction => ({
  type: INIT_LOGIN,
});

export const initLogout = (): InitLogoutAction => ({
  type: INIT_LOGOUT,
});

export const loginSuccess = (): LoginSuccessAction => ({
  type: LOGIN_SUCCESS,
  message: 'SuccessMessage.Login success',
  variant: 'success',
});

export const logoutSuccess = (): LogoutSuccessAction => ({
  type: LOGOUT_SUCCESS,
});

export const refreshTokenSuccess = (): RefreshTokenSuccessAction => ({
  type: REFRESH_TOKEN_SUCCESS,
});

export const loginFailure = (message: string): LoginFailureAction => ({
  type: LOGIN_FAILURE,
  message,
  variant: 'error',
});

export const refreshTokenFailure = (message: string): RefreshTokenFailureAction => ({
  type: REFRESH_TOKEN_FAILURE,
  message,
  variant: 'error',
});

export interface LoginFailureAction {
  type: typeof LOGIN_FAILURE;
  message: string;
  variant: VariantType;
}

export interface RefreshTokenFailureAction {
  type: typeof REFRESH_TOKEN_FAILURE;
  message: string;
  variant: VariantType;
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
  message: string;
  variant: VariantType;
}

export interface LogoutSuccessAction {
  type: typeof LOGOUT_SUCCESS;
}

export type AuthActions =
  | LoginFailureAction
  | RefreshTokenFailureAction
  | InitLoginAction
  | InitLogoutAction
  | LoginSuccessAction
  | LogoutSuccessAction
  | RefreshTokenSuccessAction;
