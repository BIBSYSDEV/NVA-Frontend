import { VariantType } from 'notistack';

export const ORCID_SIGNIN_FAILURE = 'orcid sign in failure';
export const ORCID_REQUEST_FAILURE = 'orcid request failure';
export const SET_ORCID_INFO = 'set orcid info';

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

export const setOrcidInfoAction = (name: string, orcid: string) => ({
  type: SET_ORCID_INFO,
  name,
  orcid,
});

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

export interface SetOrcidInfoAction {
  type: typeof SET_ORCID_INFO;
  name: string;
  orcid: string;
}

export type OrcidActions = OrcidRequestError | OrcidSignInError | SetOrcidInfoAction;
