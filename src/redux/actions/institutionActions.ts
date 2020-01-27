export const ADD_INSTITUTION = 'set institution';

export const setInstitution = (institution: string): SetInstitutionAction => ({
  type: ADD_INSTITUTION,
  orgunitid: institution,
});

interface SetInstitutionAction {
  type: typeof ADD_INSTITUTION;
  orgunitid: string;
}

export type InstitutionActions = SetInstitutionAction;
