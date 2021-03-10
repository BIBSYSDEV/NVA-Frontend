import Axios, { CancelToken } from 'axios';
import i18n from '../translations/i18n';
import { DoiRequestStatus, Registration, RegistrationPreview } from '../types/registration.types';
import { RegistrationFileSet } from '../types/file.types';
import { StatusCode } from '../utils/constants';
import { getIdToken } from './userApi';
import { apiRequest, authenticatedApiRequest } from './apiRequest';
import { RoleName } from '../types/user.types';
import { Message } from '../types/publication_types/messages.types';

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

export const getRegistrations = async (cancelToken?: CancelToken) => {
  const url = PublicationsApiPaths.PUBLICATION;

  try {
    const response = await Axios.get(url, { cancelToken });
    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      return { error: i18n.t('feedback:error.get_registrations') };
    }
  } catch (error) {
    if (!Axios.isCancel(error)) {
      return { error: i18n.t('feedback:error.get_registrations') };
    }
  }
};

export const getRegistration = async (id: string, cancelToken?: CancelToken) => {
  const url = `${PublicationsApiPaths.PUBLICATION}/${id}`;
  return apiRequest<Registration>({
    url,
    cancelToken,
  });
};

export const publishRegistration = async (identifier: string) =>
  await authenticatedApiRequest({
    url: `${PublicationsApiPaths.PUBLICATION}/${identifier}/publish`,
    method: 'PUT',
  });

interface MyRegistrationsResponse {
  publications?: RegistrationPreview[]; // "publications" key is absent if user has no registrations
}

export const getMyRegistrations = async (cancelToken?: CancelToken) =>
  authenticatedApiRequest<MyRegistrationsResponse>({
    url: PublicationsApiPaths.PUBLICATIONS_BY_OWNER,
    cancelToken,
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

export const getMessages = async (role: RoleName, cancelToken?: CancelToken) =>
  await authenticatedApiRequest<Message[]>({
    url: `${PublicationsApiPaths.MESSAGES}?role=${role}`,
    method: 'GET',
    cancelToken,
  });

export const addMessage = async (identifier: string, message: string) =>
  await authenticatedApiRequest({
    url: `${PublicationsApiPaths.MESSAGES}`,
    method: 'POST',
    data: {
      publicationIdentifier: identifier,
      message,
    },
  });
