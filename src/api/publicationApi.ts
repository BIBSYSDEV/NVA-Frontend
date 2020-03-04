import Axios from 'axios';
import { Dispatch } from 'redux';

import { addNotification } from '../redux/actions/notificationActions';
import i18n from '../translations/i18n';
import { Publication } from '../types/publication.types';
import { SEARCH_RESULTS_PER_PAGE, StatusCode } from '../utils/constants';
import { searchFailure, searchForPublications } from '../redux/actions/searchActions';
import { getIdToken } from './userApi';

export enum PublicationsApiPaths {
  SEARCH = '/publications',
  CREATE_WITH_DOI = '/publications/doi',
  INSERT_RESOURCE = '/publications/insert-resource',
  UPDATE_RESOURCE = '/publications/update-resource',
  FETCH_RESOURCE = '/publications/fetch-resource',
  FETCH_MY_RESOURCES = '/publications/fetch-my-resources',
  DOI_LOOKUP = '/doi-fetch',
  DOI_REQUESTS = '/publications/doi-requests',
  FOR_APPROVAL = '/publications/approval',
}

export const createNewPublicationFromDoi = async (doiUrl: string, dispatch: Dispatch) => {
  const payload = { doiUrl };
  try {
    const idToken = await getIdToken();
    const response = await Axios.post(PublicationsApiPaths.CREATE_WITH_DOI, payload, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    if (response.status === StatusCode.OK) {
      dispatch(addNotification(i18n.t('feedback:success.create_publication')));
    } else {
      dispatch(addNotification(i18n.t('feedback:error.create_publication'), 'error'));
    }
  } catch {
    dispatch(addNotification(i18n.t('feedback:error.create_publication'), 'error'));
  }
};

export const createNewPublication = async (publication: Publication, dispatch: Dispatch) => {
  try {
    const idToken = await getIdToken();
    const response = await Axios.post(PublicationsApiPaths.INSERT_RESOURCE, publication, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    if (response.status === StatusCode.OK) {
      dispatch(addNotification(i18n.t('feedback:success.create_publication')));
    } else {
      dispatch(addNotification(i18n.t('feedback:error.create_publication'), 'error'));
    }
  } catch {
    dispatch(addNotification(i18n.t('feedback:error.create_publication'), 'error'));
  }
};

export const updatePublication = async (publication: Publication, dispatch: Dispatch) => {
  const { id } = publication;
  if (!id) {
    dispatch(addNotification(i18n.t('feedback:error.update_publication'), 'error'));
    return;
  }
  const idToken = await getIdToken();
  try {
    const response = await Axios.put(`${PublicationsApiPaths.UPDATE_RESOURCE}/${id}`, publication, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    if (response.status === StatusCode.OK) {
      dispatch(addNotification(i18n.t('feedback:success.update_publication')));
    } else {
      dispatch(addNotification(i18n.t('feedback:error.update_publication'), 'error'));
    }
  } catch {
    dispatch(addNotification(i18n.t('feedback:error.update_publication'), 'error'));
  }
};

export const getPublication = async (id: string) => {
  const url = `${PublicationsApiPaths.FETCH_RESOURCE}/${id}`;
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
  } catch (error) {
    return { error };
  }
};

export const getMyPublications = async () => {
  const url = PublicationsApiPaths.FETCH_MY_RESOURCES;
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
      dispatch(searchFailure(i18n.t('feedback:error.search')));
    }
  } catch {
    dispatch(searchFailure(i18n.t('feedback:error.search')));
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
