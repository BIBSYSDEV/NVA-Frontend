import { emptyForms, FormsData } from '../../types/form.types';
import {
  FormActions,
  UPDATE_CONTRIBUTORS_FORM_DATA,
  UPDATE_DESCRIPTION_FORM_DATA,
  UPDATE_REFERENCE_FORM_DATA,
} from '../actions/formsDataActions';

export const formsDataReducer = (state: FormsData = emptyForms, action: FormActions) => {
  switch (action.type) {
    case UPDATE_DESCRIPTION_FORM_DATA:
      return {
        ...state,
        publicationDescription: action.descriptionData,
      };
    case UPDATE_CONTRIBUTORS_FORM_DATA:
      return {
        ...state,
        publicationContributors: action.contributorsData,
      };
    case UPDATE_REFERENCE_FORM_DATA:
      return {
        ...state,
        publicationBookReference: action.referenceData,
      };

    default:
      return state;
  }
};
