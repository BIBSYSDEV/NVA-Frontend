import { VariantType } from 'notistack';

export const ORCID_REQUEST_FAILURE = 'orcid request failure';
export const SET_ORCID = 'set orcid';

export const orcidRequestFailure = (message: string): OrcidRequestFailureAction => ({
  type: ORCID_REQUEST_FAILURE,
  message,
  variant: 'error',
});

export const setOrcid = (orcids: string[]): SetOrcidAction => ({
  type: SET_ORCID,
  orcids,
});

interface OrcidRequestFailureAction {
  type: typeof ORCID_REQUEST_FAILURE;
  message: string;
  variant: VariantType;
}

interface SetOrcidAction {
  type: typeof SET_ORCID;
  orcids: string[];
}

export type OrcidActions = OrcidRequestFailureAction | SetOrcidAction;
