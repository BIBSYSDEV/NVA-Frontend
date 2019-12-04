import { VariantType } from 'notistack';

export const CREATE_PUBLICATION_SUCCESS = 'create publication success';
export const CREATE_PUBLICATION_FAILURE = 'create publication failure';
export const UPDATE_PUBLICATION_SUCCESS = 'update publication success';
export const UPDATE_PUBLICATION_FAILURE = 'update publication failure';
export const GET_PUBLICATION_SUCCESS = 'get publication success';
export const GET_PUBLICATION_FAILURE = 'get publication failure';

export const createPublicationSuccess = (): CreatePublicationSuccessAction => ({
  type: CREATE_PUBLICATION_SUCCESS,
  message: 'success.create_publication',
  variant: 'success',
});

export const createPublicationFailure = (message: string): CreatePublicationFailureAction => ({
  type: CREATE_PUBLICATION_FAILURE,
  message,
  variant: 'error',
});

export const updatePublicationSuccess = (): UpdatePublicationSuccessAction => ({
  type: UPDATE_PUBLICATION_SUCCESS,
  message: 'success.update_publication',
  variant: 'success',
});

export const updatePublicationFailure = (message: string): UpdatePublicationFailureAction => ({
  type: UPDATE_PUBLICATION_FAILURE,
  message,
  variant: 'error',
});

export const getPublicationSuccess = (): GetPublicationSuccessAction => ({
  type: GET_PUBLICATION_SUCCESS,
  variant: 'success',
});

export const getPublicationFailure = (message: string): GetPublicationFailureAction => ({
  type: GET_PUBLICATION_FAILURE,
  message,
  variant: 'error',
});

interface CreatePublicationSuccessAction {
  type: typeof CREATE_PUBLICATION_SUCCESS;
  message: string;
  variant: VariantType;
}

interface CreatePublicationFailureAction {
  type: typeof CREATE_PUBLICATION_FAILURE;
  message: string;
  variant: VariantType;
}

interface UpdatePublicationSuccessAction {
  type: typeof UPDATE_PUBLICATION_SUCCESS;
  message: string;
  variant: VariantType;
}

interface UpdatePublicationFailureAction {
  type: typeof UPDATE_PUBLICATION_FAILURE;
  message: string;
  variant: VariantType;
}

interface GetPublicationSuccessAction {
  type: typeof GET_PUBLICATION_SUCCESS;
  variant: VariantType;
}

interface GetPublicationFailureAction {
  type: typeof GET_PUBLICATION_FAILURE;
  message: string;
  variant: VariantType;
}

export type PublicationActions =
  | CreatePublicationSuccessAction
  | CreatePublicationFailureAction
  | UpdatePublicationSuccessAction
  | UpdatePublicationFailureAction
  | GetPublicationSuccessAction
  | GetPublicationFailureAction;
