import { CancelToken } from 'axios';
import { Doi, DoiRequestStatus, Registration } from '../types/registration.types';
import { authenticatedApiRequest } from './apiRequest';
import { MessageType } from '../types/publication_types/messages.types';
import { PublicationsApiPath } from './apiPaths';

export const createRegistration = async (partialRegistration?: Partial<Registration>) =>
  await authenticatedApiRequest<Registration>({
    url: PublicationsApiPath.Registration,
    method: 'POST',
    data: partialRegistration,
  });

export const updateRegistration = async (registration: Registration) =>
  await authenticatedApiRequest<Registration>({
    url: `${PublicationsApiPath.Registration}/${registration.identifier}`,
    method: 'PUT',
    data: registration,
  });

export const publishRegistration = async (identifier: string) =>
  await authenticatedApiRequest({
    url: `${PublicationsApiPath.Registration}/${identifier}/publish`,
    method: 'PUT',
  });

export const getRegistrationByDoi = async (doiUrl: string) =>
  await authenticatedApiRequest<Doi>({
    url: `${PublicationsApiPath.DoiLookup}/`,
    data: { doiUrl },
    method: 'POST',
  });

export const deleteRegistration = async (identifier: string) =>
  await authenticatedApiRequest({
    url: `${PublicationsApiPath.Registration}/${identifier}`,
    method: 'DELETE',
  });

export const createDoiRequest = async (registrationIdentifier: string, message?: string, cancelToken?: CancelToken) =>
  await authenticatedApiRequest({
    url: PublicationsApiPath.DoiRequest,
    method: 'POST',
    data: {
      publicationId: registrationIdentifier,
      message,
    },
    cancelToken,
  });

export const updateDoiRequest = async (registrationIdentifier: string, status: DoiRequestStatus) =>
  await authenticatedApiRequest({
    url: `${PublicationsApiPath.UpdateDoiRequest}/${registrationIdentifier}`,
    method: 'POST',
    data: {
      doiRequestStatus: status,
    },
  });

export const addMessage = async (identifier: string, message: string, messageType: MessageType) =>
  await authenticatedApiRequest({
    url: `${PublicationsApiPath.Messages}`,
    method: 'POST',
    data: {
      publicationIdentifier: identifier,
      message,
      messageType,
    },
  });
