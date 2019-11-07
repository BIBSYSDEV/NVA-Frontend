import { ResourceFormTabs } from '../../types/resource.types';
import { FormValidator, initialFormValidator } from '../../types/validation.types';
import { CLEAR_FORM_ERRORS, FORM_ERROR, ValidationActions } from '../actions/validationActions';

export const validationReducer = (state: FormValidator = initialFormValidator, action: ValidationActions) => {
  switch (action.type) {
    case CLEAR_FORM_ERRORS:
      switch (action.formArea) {
        case ResourceFormTabs.PUBLICATION:
          return { ...state, publicationErrors: [] };
        case ResourceFormTabs.DESCRIPTION:
          return { ...state, descriptionErrors: [] };
        case ResourceFormTabs.REFERENCES:
          return { ...state, referencesErrors: [] };
        case ResourceFormTabs.CONTRIBUTORS:
          return { ...state, contributorsErrors: [] };
        case ResourceFormTabs.FILES_AND_LICENSES:
          return { ...state, filesAndLicensesErrors: [] };
      }
      break;
    case FORM_ERROR:
      switch (action.formArea) {
        case ResourceFormTabs.PUBLICATION:
          return { ...state, publicationErrors: action.error };
        case ResourceFormTabs.DESCRIPTION:
          return { ...state, descriptionErrors: action.error };
        case ResourceFormTabs.REFERENCES:
          return { ...state, referencesErrors: action.error };
        case ResourceFormTabs.CONTRIBUTORS:
          return { ...state, contributorsErrors: action.error };
        case ResourceFormTabs.FILES_AND_LICENSES:
          return { ...state, filesAndLicensesErrors: action.error };
      }
      break;
    default:
      return state;
  }
};
