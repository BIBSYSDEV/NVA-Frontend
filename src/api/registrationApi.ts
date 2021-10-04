import { CancelToken } from 'axios';
import { Doi, DoiRequestStatus, Registration } from '../types/registration.types';
import { RegistrationFileSet } from '../types/file.types';
import { authenticatedApiRequest } from './apiRequest';
import { MessageType } from '../types/publication_types/messages.types';
import { PublicationsApiPath } from './apiPaths';
import { getRegistrationIdentifier } from '../utils/registration-helpers';

export const createRegistration = async (partialRegistration?: RegistrationFileSet) =>
  await authenticatedApiRequest<Registration>({
    url: PublicationsApiPath.Registration,
    method: 'POST',
    data: partialRegistration,
  });

export const updateRegistration = async (registration: Registration) =>
  await authenticatedApiRequest<Registration>({
    url: `${PublicationsApiPath.Registration}/${getRegistrationIdentifier(registration.id)}`,
    method: 'PUT',
    data: registration,
  });

export const publishRegistration = async (id: string) =>
  await authenticatedApiRequest({
    url: `${PublicationsApiPath.Registration}/${getRegistrationIdentifier(id)}/publish`,
    method: 'PUT',
  });

export const getRegistrationByDoi = async (doiUrl: string) =>
  await authenticatedApiRequest<Doi>({
    url: `${PublicationsApiPath.DoiLookup}/`,
    data: { doiUrl },
    method: 'POST',
  });

export const deleteRegistration = async (id: string) =>
  await authenticatedApiRequest({
    url: `${PublicationsApiPath.Registration}/${getRegistrationIdentifier(id)}`,
    method: 'DELETE',
  });

export const createDoiRequest = async (registrationId: string, message?: string, cancelToken?: CancelToken) =>
  await authenticatedApiRequest({
    url: PublicationsApiPath.DoiRequest,
    method: 'POST',
    data: {
      publicationId: getRegistrationIdentifier(registrationId),
      message,
    },
    cancelToken,
  });

export const updateDoiRequest = async (registrationId: string, status: DoiRequestStatus) =>
  await authenticatedApiRequest({
    url: `${PublicationsApiPath.UpdateDoiRequest}/${getRegistrationIdentifier(registrationId)}`,
    method: 'POST',
    data: {
      doiRequestStatus: status,
    },
  });

export const addMessage = async (id: string, message: string, messageType: MessageType) =>
  await authenticatedApiRequest({
    url: `${PublicationsApiPath.Messages}`,
    method: 'POST',
    data: {
      publicationIdentifier: getRegistrationIdentifier(id),
      message,
      messageType,
    },
  });
