import { CancelToken } from 'axios';
import { authenticatedApiRequest } from './apiRequest';
import { RoleName } from '../types/user.types';
import { DoiRequest } from '../types/doiRequest.types';

enum DoiRequestApiPaths {
  DOI_REQUEST = '/doi-request',
}

export const getDoiRequests = async (role: RoleName, cancelToken?: CancelToken) =>
  await authenticatedApiRequest<DoiRequest[]>({
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
