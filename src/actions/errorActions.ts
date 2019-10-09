export const LOGIN_FAILURE = 'login failure';
export const REFRESH_TOKEN_FAILURE = 'refresh token failure';

export const loginFailureAction = (message: string) => ({
  type: LOGIN_FAILURE,
  message,
});

export const refreshTokenFailureAction = (message: string) => ({
  type: REFRESH_TOKEN_FAILURE,
  message,
});

export interface LoginFailureAction {
  type: typeof LOGIN_FAILURE;
  message: string;
}

export interface RefreshTokenFailureAction {
  type: typeof REFRESH_TOKEN_FAILURE;
  message: string;
}

export type ErrorActions = LoginFailureAction | RefreshTokenFailureAction;
