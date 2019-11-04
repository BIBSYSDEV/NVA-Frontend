import { VariantType } from 'notistack';

export const ORCID_SIGNIN_FAILURE = 'orcid sign in failure';
export const ORCID_REQUEST_FAILURE = 'orcid request failure';
export const SET_ORCID_INFO = 'set orcid info';

export const orcidSignInFailure = (message: string): OrcidSignInFailureAction => ({
  type: ORCID_SIGNIN_FAILURE,
  message,
  variant: 'error',
});

export const orcidRequestFailure = (message: string): OrcidRequestFailureAction => ({
  type: ORCID_REQUEST_FAILURE,
  message,
  variant: 'error',
});

export const setOrcidInfo = (name: string, orcid: string): SetOrcidInfoAction => ({
  type: SET_ORCID_INFO,
  name,
  orcid,
});

export interface OrcidSignInFailureAction {
  type: typeof ORCID_SIGNIN_FAILURE;
  message: string;
  variant: VariantType;
}
export interface OrcidRequestFailureAction {
  type: typeof ORCID_REQUEST_FAILURE;
  message: string;
  variant: VariantType;
}

export interface SetOrcidInfoAction {
  type: typeof SET_ORCID_INFO;
  name: string;
  orcid: string;
}

export type OrcidActions = OrcidRequestFailureAction | OrcidSignInFailureAction | SetOrcidInfoAction;
