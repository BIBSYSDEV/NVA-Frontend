export const CLEAR_PUBLICATION_ERRORS = 'clear publication errors';
export const PUBLICATION_ERROR = 'publication error';
export const DESCRIPTION_ERROR = 'description error';
export const REFERENCES_ERROR = 'references error';

export const initialValidatorState: ValidatorState = {
  publicationErrors: [],
  descriptionErrors: [],
  referencesErrors: [],
};

export interface ValidatorState {
  publicationErrors: YupError[];
  descriptionErrors: YupError[];
  referencesErrors: YupError[];
}

export interface YupError {
  errors: string[];
  message: string;
  name: string;
  path: string;
  type: string;
  value: string;
}

export interface ClearPublicationErrorsAction {
  type: typeof CLEAR_PUBLICATION_ERRORS;
}

export interface PublicationErrorAction {
  type: typeof PUBLICATION_ERROR;
  payload: YupError[];
}

export interface DescriptionErrorAction {
  type: typeof DESCRIPTION_ERROR;
  payload: YupError[];
}

export interface ReferencesErrorAction {
  type: typeof REFERENCES_ERROR;
  payload: YupError[];
}

export type ValidatorActions =
  | ClearPublicationErrorsAction
  | PublicationErrorAction
  | DescriptionErrorAction
  | ReferencesErrorAction;

export const validationReducer = (state: ValidatorState = initialValidatorState, action: ValidatorActions) => {
  switch (action.type) {
    case CLEAR_PUBLICATION_ERRORS:
      return { ...state, publicationErrors: [] };
    case PUBLICATION_ERROR:
      return { ...state, publicationErrors: action.payload };
    case DESCRIPTION_ERROR:
      return { ...state, descriptionErrors: action.payload };
    case REFERENCES_ERROR:
      return { ...state, referencesErrors: action.payload };
    default:
      return state;
  }
};
