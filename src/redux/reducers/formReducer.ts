import { UPDATE_RESOURCE_DESCRIPTION_FORM_DATA, FormActions } from '../actions/formActions';
import { Forms, emptyForms } from '../../types/form.types';

export const formReducer = (state: Forms = emptyForms, action: FormActions) => {
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
