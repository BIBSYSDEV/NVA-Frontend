import { InstitutionState } from '../../types/institution.types';
import { SET_INSTITUTIONS, InstitutionActions } from '../actions/institutionActions';

const defaultState: InstitutionState = {
  items: [],
};

export const institutionReducer = (state = defaultState, action: InstitutionActions) => {
  switch (action.type) {
    case SET_INSTITUTIONS:
      return { items: action.institutions, language: localStorage.getItem('i18nextLng') };
    default:
      return state;
  }
};
