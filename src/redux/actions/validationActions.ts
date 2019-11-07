import { ResourceFormTabs } from '../../types/resource.types';
import { YupError } from '../../types/validation.types';

export const CLEAR_FORM_ERRORS = 'clear errors';
export const FORM_ERROR = 'form error';

export const clearFormErrors = (formArea: ResourceFormTabs): ClearFormErrorsAction => ({
  type: CLEAR_FORM_ERRORS,
  formArea,
});

export const formError = (formArea: ResourceFormTabs, error: YupError[]): FormErrorAction => ({
  type: FORM_ERROR,
  formArea,
  error,
});

interface ClearFormErrorsAction {
  type: typeof CLEAR_FORM_ERRORS;
  formArea: ResourceFormTabs;
}

interface FormErrorAction {
  type: typeof FORM_ERROR;
  formArea: ResourceFormTabs;
  error: YupError[];
}

export type ValidationActions = FormErrorAction | ClearFormErrorsAction;
