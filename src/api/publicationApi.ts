import Axios, { CancelToken } from 'axios';
import i18n from '../translations/i18n';
import { Publication } from '../types/publication.types';
import { PublicationFileSet } from '../types/file.types';
import { StatusCode } from '../utils/constants';
import { getIdToken } from './userApi';
import { apiRequest } from './apiRequest';
import { SearchResult } from '../types/search.types';

export enum PublicationsApiPaths {
  SEARCH = '/search/resources',
  PUBLICATION = '/publication',
  PUBLICATIONS_BY_OWNER = '/publication/by-owner',
  DOI_LOOKUP = '/doi-fetch',
  FOR_APPROVAL = '/publications/approval',
}

export const createPublication = async (partialPublication?: PublicationFileSet) => {
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

export const updatePublication = async (publication: Publication) => {
  const { identifier } = publication;
  if (!identifier) {
    return { error: i18n.t('feedback:error.update_registration') };
  }
  const idToken = await getIdToken();
  try {
    const response = await Axios.put(`${PublicationsApiPaths.PUBLICATION}/${identifier}`, publication, {
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

export const getPublications = async (cancelToken?: CancelToken) => {
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

export const getPublication = async (id: string, cancelToken?: CancelToken) => {
  const url = `${PublicationsApiPaths.PUBLICATION}/${id}`;

  try {
    const response = await Axios.get(url, { cancelToken });
    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      return { error: i18n.t('feedback:error.get_registration') };
    }
  } catch (error) {
    if (!Axios.isCancel(error)) {
      return { error: i18n.t('feedback:error.get_registration') };
    }
  }
};

export const publishPublication = async (identifier: string) => {
  if (!identifier) {
    return { error: i18n.t('feedback:error.publish_registration') };
  }
  try {
    const idToken = await getIdToken();
    const response = await Axios.put(
      `${PublicationsApiPaths.PUBLICATION}/${identifier}/publish`,
      {},
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );
    if (response.status === StatusCode.OK) {
      return response.data;
    } else if (response.status === StatusCode.ACCEPTED) {
      return { info: i18n.t('feedback:info.publishing_publication') };
    } else {
      return { error: i18n.t('feedback:error.publish_registration') };
    }
  } catch {
    return { error: i18n.t('feedback:error.publish_registration') };
  }
};

export const getMyPublications = async (cancelToken?: CancelToken) => {
  const url = PublicationsApiPaths.PUBLICATIONS_BY_OWNER;
  try {
    const idToken = await getIdToken();
    const response = await Axios.get(url, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      cancelToken,
    });
    if (response.status === StatusCode.OK) {
      return response.data.publications;
    } else {
      return { error: i18n.t('feedback:error.get_registrations') };
    }
  } catch (error) {
    if (!Axios.isCancel(error)) {
      return { error: i18n.t('feedback:error.get_registrations') };
    }
  }
};

export const getPublicationByDoi = async (doiUrl: string) => {
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

export const search = async (
  searchTerm: string,
  numberOfResults?: number,
  searchAfter?: string,
  cancelToken?: CancelToken
) =>
  await apiRequest<SearchResult[]>({
    url: `${PublicationsApiPaths.SEARCH}?query=${searchTerm}`,
    cancelToken,
  });

// Fetch publications ready for approval
export const getPublicationsForApproval = async () => {
  try {
    const idToken = await getIdToken();
    const response = await Axios.get(PublicationsApiPaths.FOR_APPROVAL, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      return [];
    }
  } catch {
    return { error: i18n.t('feedback:error.get_approvable_registrations') };
  }
};
