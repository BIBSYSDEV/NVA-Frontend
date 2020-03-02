import { NotificationVariant } from '../../types/notification.types';

export const ORCID_REQUEST_FAILURE = 'orcid request failure';
export const SET_EXTERNAL_ORCID = 'set external orcid';

export const orcidRequestFailure = (message: string): OrcidRequestFailureAction => ({
  type: ORCID_REQUEST_FAILURE,
  message,
  variant: NotificationVariant.Error,
});

export const setExternalOrcid = (orcid: string): SetExternalOrcidAction => ({
  type: SET_EXTERNAL_ORCID,
  orcid,
});

interface OrcidRequestFailureAction {
  type: typeof ORCID_REQUEST_FAILURE;
  message: string;
  variant: NotificationVariant;
}

interface SetExternalOrcidAction {
  type: typeof SET_EXTERNAL_ORCID;
  orcid: string;
}

export type OrcidActions = OrcidRequestFailureAction | SetExternalOrcidAction;
