import { emptyForms, FormsData } from '../../types/form.types';
import {
  FormActions,
  UPDATE_CONTRIBUTORS_FORM_DATA,
  UPDATE_DESCRIPTION_FORM_DATA,
  UPDATE_REFERENCES_FORM_DATA,
} from '../actions/formsDataActions';

export const formsDataReducer = (state: FormsData = emptyForms, action: FormActions) => {
  switch (action.type) {
    case UPDATE_DESCRIPTION_FORM_DATA:
      return {
        ...state,
        resourceDescription: action.descriptionData,
      };
    case UPDATE_REFERENCES_FORM_DATA:
      return {
        ...state,
        resourceReferences: action.referencesData,
      };
    case UPDATE_CONTRIBUTORS_FORM_DATA:
      return {
        ...state,
        resourceContributors: action.contributorsData,
      };
    default:
      return state;
  }
};
