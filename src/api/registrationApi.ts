import { CancelToken } from 'axios';
import { Doi, DoiRequestStatus, Registration } from '../types/registration.types';
import { RegistrationFileSet } from '../types/file.types';
import { authenticatedApiRequest } from './apiRequest';
import { MessageType } from '../types/publication_types/messages.types';
import { PublicationsApiPaths } from './apiPaths';

export const createRegistration = async (partialRegistration?: RegistrationFileSet) =>
  await authenticatedApiRequest<Registration>({
    url: PublicationsApiPaths.PUBLICATION,
    method: 'POST',
    data: partialRegistration,
  });

export const updateRegistration = async (registration: Registration) =>
  await authenticatedApiRequest<Registration>({
    url: `${PublicationsApiPaths.PUBLICATION}/${registration.identifier}`,
    method: 'PUT',
    data: registration,
  });

export const publishRegistration = async (identifier: string) =>
  await authenticatedApiRequest({
    url: `${PublicationsApiPaths.PUBLICATION}/${identifier}/publish`,
    method: 'PUT',
  });

export const getRegistrationByDoi = async (doiUrl: string) =>
  await authenticatedApiRequest<Doi>({
    url: `${PublicationsApiPaths.DOI_LOOKUP}/`,
    data: { doiUrl },
    method: 'POST',
  });

export const deleteRegistration = async (identifier: string) =>
  await authenticatedApiRequest({
    url: `${PublicationsApiPaths.PUBLICATION}/${identifier}`,
    method: 'DELETE',
  });

export const createDoiRequest = async (registrationId: string, message?: string, cancelToken?: CancelToken) =>
  await authenticatedApiRequest({
    url: PublicationsApiPaths.DOI_REQUEST,
    method: 'POST',
    data: {
      publicationId: registrationId,
      message,
    },
    cancelToken,
  });

export const updateDoiRequest = async (registrationId: string, status: DoiRequestStatus) =>
  await authenticatedApiRequest({
    url: `${PublicationsApiPaths.UPDATE_DOI_REQUEST}/${registrationId}`,
    method: 'POST',
    data: {
      doiRequestStatus: status,
    },
  });

export const addMessage = async (identifier: string, message: string, messageType: MessageType) =>
  await authenticatedApiRequest({
    url: `${PublicationsApiPaths.MESSAGES}`,
    method: 'POST',
    data: {
      publicationIdentifier: identifier,
      message,
      messageType,
    },
  });
