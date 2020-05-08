import { InstitutionUnitBase } from '../../types/institution.types';

export const SET_INSTITUTIONS = 'set institutions';

export const setInstitutions = (institutions: InstitutionUnitBase[]): SetInstitutionsAction => ({
  type: SET_INSTITUTIONS,
  institutions,
});

interface SetInstitutionsAction {
  type: typeof SET_INSTITUTIONS;
  institutions: InstitutionUnitBase[];
}

export type InstitutionActions = SetInstitutionsAction;
