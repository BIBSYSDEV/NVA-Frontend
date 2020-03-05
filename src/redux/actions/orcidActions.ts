export const SET_EXTERNAL_ORCID = 'set external orcid';

export const setExternalOrcid = (orcid: string): SetExternalOrcidAction => ({
  type: SET_EXTERNAL_ORCID,
  orcid,
});

interface SetExternalOrcidAction {
  type: typeof SET_EXTERNAL_ORCID;
  orcid: string;
}

export type OrcidActions = SetExternalOrcidAction;
