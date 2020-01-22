import { Institution } from './../../types/references.types';

export const SET_INSTITUTION = 'set institution';

export const setInstitution = (institution: Institution): SetInstitutionAction => ({
  type: SET_INSTITUTION,
  orgunitids: institution,
});

interface SetInstitutionAction {
  type: typeof SET_INSTITUTION;
  orgunitids: Institution;
}

export type InstitutionActions = SetInstitutionAction;
