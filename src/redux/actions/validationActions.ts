import { YupError } from '../../types/validation.types';

export const CLEAR_PUBLICATION_ERRORS = 'clear publication errors';
export const CLEAR_DESCRIPTION_ERRORS = 'clear description errors';
export const PUBLICATION_ERROR = 'publication error';
export const DESCRIPTION_ERROR = 'description error';
export const REFERENCES_ERROR = 'references error';

export const clearPublicationErrors = (): ClearPublicationErrorsAction => ({
  type: CLEAR_PUBLICATION_ERRORS,
});

export const clearDescriptionErrors = (): ClearDescriptionErrorsAction => ({
  type: CLEAR_DESCRIPTION_ERRORS,
});

export const publicationError = (error: YupError[]): PublicationErrorAction => ({
  type: PUBLICATION_ERROR,
  error,
});

export const descriptionError = (error: YupError[]): DescriptionErrorAction => ({
  type: DESCRIPTION_ERROR,
  error,
});

export const referencesError = (error: YupError[]): ReferencesErrorAction => ({
  type: REFERENCES_ERROR,
  error,
});

interface ClearPublicationErrorsAction {
  type: typeof CLEAR_PUBLICATION_ERRORS;
}

interface ClearDescriptionErrorsAction {
  type: typeof CLEAR_DESCRIPTION_ERRORS;
}

interface PublicationErrorAction {
  type: typeof PUBLICATION_ERROR;
  error: YupError[];
}

interface DescriptionErrorAction {
  type: typeof DESCRIPTION_ERROR;
  error: YupError[];
}

interface ReferencesErrorAction {
  type: typeof REFERENCES_ERROR;
  error: YupError[];
}

export type ValidationActions =
  | ClearPublicationErrorsAction
  | ClearDescriptionErrorsAction
  | PublicationErrorAction
  | DescriptionErrorAction
  | ReferencesErrorAction;
