import { VariantType } from 'notistack';

export const LOGIN_FAILURE = 'login failure';
export const REFRESH_TOKEN_FAILURE = 'refresh token failure';
export const ORCID_SIGNIN_FAILURE = 'orcid sign in failure';
export const ORCID_REQUEST_FAILURE = 'orcid request failure';

export const loginFailureAction = (message: string) => ({
  type: LOGIN_FAILURE,
  message,
  variant: 'error',
});

export const refreshTokenFailureAction = (message: string) => ({
  type: REFRESH_TOKEN_FAILURE,
  message,
  variant: 'error',
});

export const orcidSignInFailureAction = (message: string) => ({
  type: ORCID_SIGNIN_FAILURE,
  message,
  variant: 'error',
});

export const orcidRequestFailureAction = (message: string) => ({
  type: ORCID_REQUEST_FAILURE,
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

export interface OrcidSignInError {
  type: typeof ORCID_SIGNIN_FAILURE;
  message: string;
  variant: VariantType;
}
export interface OrcidRequestError {
  type: typeof ORCID_REQUEST_FAILURE;
  message: string;
  variant: VariantType;
}

export type ErrorActions = LoginFailureAction | RefreshTokenFailureAction | OrcidRequestError | OrcidSignInError;
