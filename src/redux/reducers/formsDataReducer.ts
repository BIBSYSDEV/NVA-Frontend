import { UPDATE_RESOURCE_DESCRIPTION_FORM_DATA, FormActions } from '../actions/formsDataActions';
import { FormsData, emptyForms } from '../../types/form.types';

export const formsDataReducer = (state: FormsData = emptyForms, action: FormActions) => {
  switch (action.type) {
    case UPDATE_RESOURCE_DESCRIPTION_FORM_DATA:
      return {
        ...state,
        resourceDescription: action.resourceDescriptionData,
      };
    default:
      return state;
  }
};
