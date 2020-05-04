import Axios from 'axios';
import { Dispatch } from 'redux';

import { setNotification } from '../redux/actions/notificationActions';
import i18n from '../translations/i18n';
import { Publication } from '../types/publication.types';
import { SEARCH_RESULTS_PER_PAGE, StatusCode } from '../utils/constants';
import { searchForPublications } from '../redux/actions/searchActions';
import { getIdToken } from './userApi';
import { NotificationVariant } from '../types/notification.types';

export enum PublicationsApiPaths {
  SEARCH = '/search/publications',
  PUBLICATION = '/publication',
  PUBLICATIONS_BY_OWNER = '/publication/by-owner',
  DOI_LOOKUP = '/doi-fetch',
  DOI_REQUESTS = '/publications/doi-requests',
  FOR_APPROVAL = '/publications/approval',
}

export const createPublication = async (publication: Publication) => {
  try {
    const idToken = await getIdToken();
    const response = await Axios.post(PublicationsApiPaths.PUBLICATION, publication, {
      headers: { Authorization: `Bearer ${idToken}` },
    });
    if (response.status === StatusCode.OK || response.status === StatusCode.ACCEPTED) {
      // TODO: temporarily allow accepted status code. remove when fixed in backend
      return response.data;
    } else {
      return { error: i18n.t('feedback:error.create_publication') };
    }
  } catch {
    return { error: i18n.t('feedback:error.create_publication') };
  }
};

export const updatePublication = async (publication: Publication) => {
  const { identifier } = publication;
  if (!identifier) {
    return { error: i18n.t('feedback:error.update_publication') };
  }
  const idToken = await getIdToken();
  try {
    const response = await Axios.put(`${PublicationsApiPaths.PUBLICATION}/${identifier}`, publication, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    if (response.status === StatusCode.OK || response.status === StatusCode.ACCEPTED) {
      // TODO: temporarily allow accepted status code. remove when fixed in backend
      return response.data;
    } else {
      return null;
    }
  } catch {
    return { error: i18n.t('feedback:error.update_publication') };
  }
};

export const getPublication = async (id: string) => {
  const url = `${PublicationsApiPaths.PUBLICATION}/${id}`;

  try {
    const idToken = await getIdToken();
    const response = await Axios.get(url, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      return null;
    }
  } catch {
    return { error: i18n.t('feedback:error.get_publication') };
  }
};

export const publishPublication = async (identifier: string) => {
  if (!identifier) {
    return { error: i18n.t('feedback:error.publish_publication') };
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
    if (response.status === StatusCode.OK || response.status === StatusCode.ACCEPTED) {
      return response.data;
    } else {
      return { error: i18n.t('feedback:error.publish_publication') };
    }
  } catch {
    return { error: i18n.t('feedback:error.publish_publication') };
  }
};

export const getMyPublications = async () => {
  const url = PublicationsApiPaths.PUBLICATIONS_BY_OWNER;
  try {
    const idToken = await getIdToken();
    const response = await Axios.get(url, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    if (response.status === StatusCode.OK) {
      return response.data.publications;
    } else {
      return [];
    }
  } catch (error) {
    return { error };
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

export const search = async (searchTerm: string, dispatch: Dispatch, offset?: number) => {
  try {
    const idToken = await getIdToken();
    const response = await Axios.get(`${PublicationsApiPaths.SEARCH}/${searchTerm}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (response.status === StatusCode.OK) {
      const currentOffset = offset || 0;
      const result = response.data.slice(currentOffset, currentOffset + SEARCH_RESULTS_PER_PAGE);

      dispatch(searchForPublications(result, searchTerm, response.data.length, offset));
    } else {
      dispatch(setNotification(i18n.t('feedback:error.search', NotificationVariant.Error)));
    }
  } catch {
    dispatch(setNotification(i18n.t('feedback:error.search', NotificationVariant.Error)));
  }
};

// Fetch publications where creator also wanted a DOI to be created
export const getDoiRequests = async () => {
  try {
    const idToken = await getIdToken();
    const response = await Axios.get(PublicationsApiPaths.DOI_REQUESTS, {
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
    return { error: i18n.t('feedback:error.get_doi_requests') };
  }
};

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
    return { error: i18n.t('feedback:error.get_approvable_publications') };
  }
};
