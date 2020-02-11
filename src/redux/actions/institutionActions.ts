import { InstitutionUnit } from './../../types/institution.types';

export const ADD_INSTITUTION_UNIT = 'add institution unit';

export const addInstitutionUnit = (institutionUnit: InstitutionUnit): AddInstitutionUnitAction => ({
  type: ADD_INSTITUTION_UNIT,
  institutionUnit: institutionUnit,
});

interface AddInstitutionUnitAction {
  type: typeof ADD_INSTITUTION_UNIT;
  institutionUnit: InstitutionUnit;
}

export type InstitutionActions = AddInstitutionUnitAction;
