import { CancelToken } from 'axios';
import { ApiResponse, authenticatedApiRequest } from './apiRequest';
import { RoleName } from '../types/user.types';
import { Registration } from '../types/registration.types';

export enum DoiRequestApiPaths {
  DOI_REQUEST = '/doi-request',
}

export const getRegistrationsWithPendingDoiRequest = async (
  role: RoleName,
  cancelToken?: CancelToken
): Promise<ApiResponse<Registration[]>> =>
  await authenticatedApiRequest<Registration[]>({
    url: `${DoiRequestApiPaths.DOI_REQUEST}?role=${role}`,
    cancelToken,
  });

export const createDoiRequest = async (
  registrationId: string,
  message?: string,
  cancelToken?: CancelToken
): Promise<ApiResponse<unknown>> =>
  await authenticatedApiRequest({
    url: DoiRequestApiPaths.DOI_REQUEST,
    method: 'POST',
    data: {
      publicationId: registrationId,
      message,
    },
    cancelToken,
  });
