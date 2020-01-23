export const SET_INSTITUTION = 'set institution';

export const setInstitution = (institution: string): SetInstitutionAction => ({
  type: SET_INSTITUTION,
  orgunitids: institution,
});

interface SetInstitutionAction {
  type: typeof SET_INSTITUTION;
  orgunitids: string;
}

export type InstitutionActions = SetInstitutionAction;
