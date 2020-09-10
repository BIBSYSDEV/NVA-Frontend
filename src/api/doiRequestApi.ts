import { CancelToken } from 'axios';
import { authenticatedApiRequest } from './apiRequest';

enum DoiRequestApiPaths {
  DOI_REQUEST = '/doi-request',
}

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
