import { CancelToken } from 'axios';
import { authenticatedApiRequest } from './apiRequest';
import { RoleName } from '../types/user.types';
import { DoiRequestStatus, Registration } from '../types/registration.types';

export enum DoiRequestApiPaths {
  DOI_REQUEST = '/doi-request',
  UPDATE_DOI_REQUEST = '/doi-request/update-doi-request',
}

export const getRegistrationsWithPendingDoiRequest = async (role: RoleName, cancelToken?: CancelToken) =>
  await authenticatedApiRequest<Registration[]>({
    url: `${DoiRequestApiPaths.DOI_REQUEST}?role=${role}`,
    cancelToken,
  });

export const createDoiRequest = async (registrationId: string, message?: string, cancelToken?: CancelToken) =>
  await authenticatedApiRequest({
    url: DoiRequestApiPaths.DOI_REQUEST,
    method: 'POST',
    data: {
      publicationId: registrationId,
      message,
    },
    cancelToken,
  });

export const updateDoiRequest = async (registrationId: string, status: DoiRequestStatus) =>
  await authenticatedApiRequest({
    url: `${DoiRequestApiPaths.UPDATE_DOI_REQUEST}/${registrationId}`,
    method: 'POST',
    data: {
      doiRequestStatus: status,
    },
  });
