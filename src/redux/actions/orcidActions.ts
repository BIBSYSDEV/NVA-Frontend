import { VariantType } from 'notistack';

export const ORCID_REQUEST_FAILURE = 'orcid request failure';
export const SET_EXTERNAL_ORCID = 'set external orcid';

export const orcidRequestFailure = (message: string): OrcidRequestFailureAction => ({
  type: ORCID_REQUEST_FAILURE,
  message,
  variant: 'error',
});

export const setExternalOrcid = (orcid: string): SetExternalOrcidAction => ({
  type: SET_EXTERNAL_ORCID,
  orcid,
});

interface OrcidRequestFailureAction {
  type: typeof ORCID_REQUEST_FAILURE;
  message: string;
  variant: VariantType;
}

interface SetExternalOrcidAction {
  type: typeof SET_EXTERNAL_ORCID;
  orcid: string;
}

export type OrcidActions = OrcidRequestFailureAction | SetExternalOrcidAction;
