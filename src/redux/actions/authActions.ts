import { NotificationVariant } from '../../types/notification.types';

export const LOGIN_FAILURE = 'login failure';
export const REFRESH_TOKEN_FAILURE = 'refresh token failure';
export const LOGIN_SUCCESS = 'login success';
export const LOGOUT_SUCCESS = 'logout success';

export const loginSuccess = (): LoginSuccessAction => ({
  type: LOGIN_SUCCESS,
});

export const logoutSuccess = (): LogoutSuccessAction => ({
  type: LOGOUT_SUCCESS,
});

export const loginFailure = (message: string): LoginFailureAction => ({
  type: LOGIN_FAILURE,
  message,
  variant: NotificationVariant.Error,
});

export const refreshTokenFailure = (message: string): RefreshTokenFailureAction => ({
  type: REFRESH_TOKEN_FAILURE,
  message,
  variant: NotificationVariant.Error,
});

interface LoginFailureAction {
  type: typeof LOGIN_FAILURE;
  message: string;
  variant: NotificationVariant;
}

interface RefreshTokenFailureAction {
  type: typeof REFRESH_TOKEN_FAILURE;
  message: string;
  variant: NotificationVariant;
}

interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
}

interface LogoutSuccessAction {
  type: typeof LOGOUT_SUCCESS;
}

export type AuthActions = LoginFailureAction | RefreshTokenFailureAction | LoginSuccessAction | LogoutSuccessAction;
