import { InstitutionUnit } from './../../types/institution.types';

export const ADD_INSTITUTION_PRESENTATION = 'add institution presentation';

export const addInstitutionPresentation = (
  institutionPresentation: InstitutionUnit
): AddInstitutionPresentationAction => ({
  type: ADD_INSTITUTION_PRESENTATION,
  institutionPresentation,
});

interface AddInstitutionPresentationAction {
  type: typeof ADD_INSTITUTION_PRESENTATION;
  institutionPresentation: InstitutionUnit;
}

export type InstitutionActions = AddInstitutionPresentationAction;
