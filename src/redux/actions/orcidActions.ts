import { VariantType } from 'notistack';

export const ORCID_REQUEST_FAILURE = 'orcid request failure';
export const SET_ORCID = 'set orcid';

export const orcidRequestFailure = (message: string): OrcidRequestFailureAction => ({
  type: ORCID_REQUEST_FAILURE,
  message,
  variant: 'error',
});

export const setOrcid = (orcid: string[]): SetOrcidAction => ({
  type: SET_ORCID,
  orcid,
});

interface OrcidRequestFailureAction {
  type: typeof ORCID_REQUEST_FAILURE;
  message: string;
  variant: VariantType;
}

interface SetOrcidAction {
  type: typeof SET_ORCID;
  orcid: string[];
}

export type OrcidActions = OrcidRequestFailureAction | SetOrcidAction;
