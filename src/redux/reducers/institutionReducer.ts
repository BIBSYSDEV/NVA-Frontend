import { InstitutionUnitBase } from '../../types/institution.types';
import { SET_INSTITUTIONS, InstitutionActions } from '../actions/institutionActions';

export const institutionReducer = (state: InstitutionUnitBase[] = [], action: InstitutionActions) => {
  switch (action.type) {
    case SET_INSTITUTIONS:
      return action.institutions;
    default:
      return state;
  }
};
