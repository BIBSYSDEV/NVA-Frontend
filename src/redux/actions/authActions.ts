import { VariantType } from 'notistack';

export const LOGIN_FAILURE = 'login failure';
export const REFRESH_TOKEN_FAILURE = 'refresh token failure';
export const SESSION_INVALID_FAILURE = 'session invalid failure';
const INIT_LOGIN = 'initiate login';
const INIT_LOGOUT = 'initiate logout';
const REFRESH_TOKEN_SUCCESS = 'refresh token success';
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

export const sessionInvalidFailure = (message: string): SessionInvalidFailure => ({
  type: SESSION_INVALID_FAILURE,
  message,
  variant: 'error',
});

interface LoginFailureAction {
  type: typeof LOGIN_FAILURE;
  message: string;
  variant: VariantType;
}

interface RefreshTokenFailureAction {
  type: typeof REFRESH_TOKEN_FAILURE;
  message: string;
  variant: VariantType;
}

interface SessionInvalidFailure {
  type: typeof SESSION_INVALID_FAILURE;
  message: string;
  variant: VariantType;
}

interface InitLoginAction {
  type: typeof INIT_LOGIN;
}

interface InitLogoutAction {
  type: typeof INIT_LOGOUT;
}

interface RefreshTokenSuccessAction {
  type: typeof REFRESH_TOKEN_SUCCESS;
}

interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
}

interface LogoutSuccessAction {
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
