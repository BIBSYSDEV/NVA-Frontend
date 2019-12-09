import { PublicationFormTabs } from '../../types/publication.types';
import { YupError } from '../../types/validation.types';

export const CLEAR_FORM_ERRORS = 'clear errors';
export const FORM_ERROR = 'form error';

export const clearFormErrors = (formArea: PublicationFormTabs): ClearFormErrorsAction => ({
  type: CLEAR_FORM_ERRORS,
  formArea,
});

export const formError = (formArea: PublicationFormTabs, error: YupError[]): FormErrorAction => ({
  type: FORM_ERROR,
  formArea,
  error,
});

interface ClearFormErrorsAction {
  type: typeof CLEAR_FORM_ERRORS;
  formArea: PublicationFormTabs;
}

interface FormErrorAction {
  type: typeof FORM_ERROR;
  formArea: PublicationFormTabs;
  error: YupError[];
}

export type ValidationActions = FormErrorAction | ClearFormErrorsAction;
