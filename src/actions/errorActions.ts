export const LOGIN_FAILURE = 'login failure';
export const REFRESH_TOKEN_FAILURE = 'refresh token failure';
export const ORCID_SIGNIN_ERROR = 'orcid sign in failure';
export const ORCID_REQUEST_ERROR = 'orcid request failure';

export const loginFailureAction = (message: string) => ({
  type: LOGIN_FAILURE,
  message,
});

export const refreshTokenFailureAction = (message: string) => ({
  type: REFRESH_TOKEN_FAILURE,
  message,
});

export const orcidSignInErrorAction = (message: string) => ({
  type: ORCID_SIGNIN_ERROR,
  message,
});

export const orcidRequestErrorAction = (message: string) => ({
  type: ORCID_REQUEST_ERROR,
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

export interface OrcidSignInError {
  type: typeof ORCID_SIGNIN_ERROR;
  message: string;
}
export interface OrcidRequestError {
  type: typeof ORCID_REQUEST_ERROR;
  message: string;
}

export type ErrorActions = LoginFailureAction | RefreshTokenFailureAction | OrcidRequestError | OrcidSignInError;
