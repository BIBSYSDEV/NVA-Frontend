import Axios, { CancelToken } from 'axios';
import i18n from '../translations/i18n';
import { DoiRequestStatus, Registration } from '../types/registration.types';
import { RegistrationFileSet } from '../types/file.types';
import { StatusCode } from '../utils/constants';
import { getIdToken } from './userApi';
import { authenticatedApiRequest2 as authenticatedApiRequest } from './apiRequest';
import { MessageType } from '../types/publication_types/messages.types';

export enum PublicationsApiPaths {
  PUBLICATION = '/publication',
  PUBLICATIONS_BY_OWNER = '/publication/by-owner',
  DOI_LOOKUP = '/doi-fetch',
  DOI_REQUEST = '/publication/doirequest',
  UPDATE_DOI_REQUEST = '/publication/update-doi-request',
  MESSAGES = '/publication/messages',
}

export const createRegistration = async (partialPublication?: RegistrationFileSet) => {
  try {
    const idToken = await getIdToken();
    const response = await Axios.post(PublicationsApiPaths.PUBLICATION, partialPublication, {
      headers: { Authorization: `Bearer ${idToken}` },
    });
    if (response.status === StatusCode.CREATED) {
      return response.data;
    } else {
      return { error: i18n.t('feedback:error.create_registration') };
    }
  } catch {
    return { error: i18n.t('feedback:error.create_registration') };
  }
};

export const updateRegistration = async (registration: Registration) => {
  const { identifier } = registration;
  if (!identifier) {
    return { error: i18n.t('feedback:error.update_registration') };
  }
  const idToken = await getIdToken();
  try {
    const response = await Axios.put(`${PublicationsApiPaths.PUBLICATION}/${identifier}`, registration, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      return { error: i18n.t('feedback:error.update_registration') };
    }
  } catch {
    return { error: i18n.t('feedback:error.update_registration') };
  }
};

export const publishRegistration = async (identifier: string) =>
  await authenticatedApiRequest({
    url: `${PublicationsApiPaths.PUBLICATION}/${identifier}/publish`,
    method: 'PUT',
  });

export const getRegistrationByDoi = async (doiUrl: string) => {
  try {
    const idToken = await getIdToken();
    const response = await Axios.post(
      `${PublicationsApiPaths.DOI_LOOKUP}/`,
      { doiUrl },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
          Accept: 'application/vnd.citationstyles.csl+json',
        },
      }
    );

    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    return { error };
  }
};

export const deleteRegistration = async (identifier: string) =>
  authenticatedApiRequest({
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
