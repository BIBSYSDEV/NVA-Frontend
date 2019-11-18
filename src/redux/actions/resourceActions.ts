import { VariantType } from 'notistack';

export const CREATE_RESOURCE_SUCCESS = 'create resource success';
export const CREATE_RESOURCE_FAILURE = 'create resource failure';
export const UPDATE_RESOURCE_SUCCESS = 'update resource success';
export const UPDATE_RESOURCE_FAILURE = 'update resource failure';
export const GET_RESOURCE_SUCCESS = 'get resource success';
export const GET_RESOURCE_FAILURE = 'get resource failure';

export const createResourceSuccess = (): CreateResourceSuccessAction => ({
  type: CREATE_RESOURCE_SUCCESS,
  message: 'success.create_resource',
  variant: 'success',
});

export const createResourceFailure = (message: string): CreateResourceFailureAction => ({
  type: CREATE_RESOURCE_FAILURE,
  message,
  variant: 'error',
});

export const updateResourceSuccess = (): UpdateResourceSuccessAction => ({
  type: UPDATE_RESOURCE_SUCCESS,
  message: 'success.update_resource',
  variant: 'success',
});

export const updateResourceFailure = (message: string): UpdateResourceFailureAction => ({
  type: UPDATE_RESOURCE_FAILURE,
  message,
  variant: 'error',
});

export const getResourceSuccess = (): GetResourceSuccessAction => ({
  type: GET_RESOURCE_SUCCESS,
  variant: 'success',
});

export const getResourceFailure = (message: string): GetResourceFailureAction => ({
  type: GET_RESOURCE_FAILURE,
  message,
  variant: 'error',
});

interface CreateResourceSuccessAction {
  type: typeof CREATE_RESOURCE_SUCCESS;
  message: string;
  variant: VariantType;
}

interface CreateResourceFailureAction {
  type: typeof CREATE_RESOURCE_FAILURE;
  message: string;
  variant: VariantType;
}

interface UpdateResourceSuccessAction {
  type: typeof UPDATE_RESOURCE_SUCCESS;
  message: string;
  variant: VariantType;
}

interface UpdateResourceFailureAction {
  type: typeof UPDATE_RESOURCE_FAILURE;
  message: string;
  variant: VariantType;
}

interface GetResourceSuccessAction {
  type: typeof GET_RESOURCE_SUCCESS;
  variant: VariantType;
}

interface GetResourceFailureAction {
  type: typeof GET_RESOURCE_FAILURE;
  message: string;
  variant: VariantType;
}

export type ResourceActions =
  | CreateResourceSuccessAction
  | CreateResourceFailureAction
  | UpdateResourceSuccessAction
  | UpdateResourceFailureAction
  | GetResourceSuccessAction
  | GetResourceFailureAction;
