import { initialValidatorState, ValidatorState } from '../../types/validation.types';
import {
  CLEAR_PUBLICATION_ERRORS,
  DESCRIPTION_ERROR,
  PUBLICATION_ERROR,
  REFERENCES_ERROR,
  ValidationActions,
} from '../actions/validationActions';

export const validationReducer = (state: ValidatorState = initialValidatorState, action: ValidationActions) => {
  switch (action.type) {
    case CLEAR_PUBLICATION_ERRORS:
      return { ...state, publicationErrors: [] };
    case PUBLICATION_ERROR:
      return { ...state, publicationErrors: action.error };
    case DESCRIPTION_ERROR:
      return { ...state, descriptionErrors: action.error };
    case REFERENCES_ERROR:
      return { ...state, referencesErrors: action.error };
    default:
      return state;
  }
};
