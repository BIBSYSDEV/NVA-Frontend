import { CancelToken } from 'axios';
import { authenticatedApiRequest } from './apiRequest';
import { RoleName } from '../types/user.types';
import { Registration } from '../types/registration.types';

export enum DoiRequestApiPaths {
  DOI_REQUEST = '/doi-request',
}

export const getRegistrationsWithPendingDoiRequest = async (role: RoleName, cancelToken?: CancelToken) =>
  await authenticatedApiRequest<Registration[]>({
    url: `${DoiRequestApiPaths.DOI_REQUEST}?role=${role}`,
    cancelToken,
  });

export const createDoiRequest = async (publicationId: string, message?: string, cancelToken?: CancelToken) =>
  await authenticatedApiRequest({
    url: DoiRequestApiPaths.DOI_REQUEST,
    method: 'POST',
    data: {
      publicationId,
      message,
    },
    cancelToken,
  });
