import i18n from '../../translations/i18n';
import { InstitutionState } from '../../types/institution.types';
import { InstitutionActions, SET_INSTITUTIONS } from '../actions/institutionActions';

const defaultState: InstitutionState = {
  items: [],
};

export const institutionReducer = (state = defaultState, action: InstitutionActions) => {
  switch (action.type) {
    case SET_INSTITUTIONS:
      return { items: action.institutions, language: i18n.language };
    default:
      return state;
  }
};
