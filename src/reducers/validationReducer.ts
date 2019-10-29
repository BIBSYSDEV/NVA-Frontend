export const CLEAR_PUBLICATION_ERRORS = 'clear publication errors';
export const PUBLICATION_ERROR = 'publication error';
export const DESCRIPTION_ERROR = 'description error';
export const REFERENCES_ERROR = 'references error';

export const initialValidatorState = {
  publicationErrors: [],
  descriptionErrors: [],
  referencesErrors: [],
};

export const validationReducer = (state: any = initialValidatorState, action: any) => {
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
