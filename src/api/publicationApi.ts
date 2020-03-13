import Axios from 'axios';
import { Dispatch } from 'redux';

import { setNotification } from '../redux/actions/notificationActions';
import i18n from '../translations/i18n';
import { BackendPublication } from '../types/publication.types';
import { SEARCH_RESULTS_PER_PAGE, StatusCode } from '../utils/constants';
import { searchForPublications } from '../redux/actions/searchActions';
import { NotificationVariant } from '../types/notification.types';

export enum PublicationsApiPaths {
  SEARCH = '/search/publications',
  PUBLICATION = '/publication',
  FETCH_MY_RESOURCES = '/publications/fetch-my-resources',
  DOI_LOOKUP = '/doi-fetch',
  DOI_REQUESTS = '/publications/doi-requests',
  FOR_APPROVAL = '/publications/approval',
}

export const updatePublication = async (publication: BackendPublication) => {
  const { identifier } = publication;
  if (!identifier) {
    return { error: i18n.t('feedback:error.update_publication') };
  }
  try {
    const response = await Axios.put(`${PublicationsApiPaths.PUBLICATION}/${identifier}`, publication);
    if (response.status === StatusCode.OK) {
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
    const response = await Axios.get(url);
    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      return null;
    }
  } catch {
    return { error: i18n.t('feedback:error.get_publication') };
  }
};

export const getMyPublications = async () => {
  const url = PublicationsApiPaths.FETCH_MY_RESOURCES;
  try {
    const response = await Axios.get(url);
    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      return [];
    }
  } catch (error) {
    return { error };
  }
};

export const getPublicationByDoi = async (doiUrl: string) => {
  try {
    const response = await Axios.post(
      `${PublicationsApiPaths.DOI_LOOKUP}/`,
      { doiUrl },
      {
        headers: {
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
    const response = await Axios.get(`${PublicationsApiPaths.SEARCH}/${searchTerm}`);

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
    const response = await Axios.get(PublicationsApiPaths.DOI_REQUESTS);

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
    const response = await Axios.get(PublicationsApiPaths.FOR_APPROVAL);

    if (response.status === StatusCode.OK) {
      return response.data;
    } else {
      return [];
    }
  } catch {
    return { error: i18n.t('feedback:error.get_approvable_publications') };
  }
};
