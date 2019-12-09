import { PublicationFormTabs } from '../../types/publication.types';
import { FormValidator, initialFormValidator } from '../../types/validation.types';
import { CLEAR_FORM_ERRORS, FORM_ERROR, ValidationActions } from '../actions/validationActions';

export const validationReducer = (state: FormValidator = initialFormValidator, action: ValidationActions) => {
  switch (action.type) {
    case CLEAR_FORM_ERRORS:
      switch (action.formArea) {
        case PublicationFormTabs.PUBLICATION:
          return { ...state, publicationErrors: [] };
        case PublicationFormTabs.DESCRIPTION:
          return { ...state, descriptionErrors: [] };
        case PublicationFormTabs.REFERENCES:
          return { ...state, referencesErrors: [] };
        case PublicationFormTabs.CONTRIBUTORS:
          return { ...state, contributorsErrors: [] };
        case PublicationFormTabs.FILES_AND_LICENSE:
          return { ...state, filesAndLicenseErrors: [] };
      }
      break;
    case FORM_ERROR:
      switch (action.formArea) {
        case PublicationFormTabs.PUBLICATION:
          return { ...state, publicationErrors: action.error };
        case PublicationFormTabs.DESCRIPTION:
          return { ...state, descriptionErrors: action.error };
        case PublicationFormTabs.REFERENCES:
          return { ...state, referencesErrors: action.error };
        case PublicationFormTabs.CONTRIBUTORS:
          return { ...state, contributorsErrors: action.error };
        case PublicationFormTabs.FILES_AND_LICENSE:
          return { ...state, filesAndLicenseErrors: action.error };
      }
      break;
    default:
      return state;
  }
};
