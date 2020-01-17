import Axios from 'axios';
import { Dispatch } from 'redux';

import { addNotification } from '../redux/actions/notificationActions';
import i18n from '../translations/i18n';
import { DoiPublication, Publication } from '../types/publication.types';
import { SEARCH_RESULTS_PER_PAGE, StatusCode } from '../utils/constants';
import { searchFailure, searchForPublications } from '../redux/actions/searchActions';
import { getIdToken } from './userApi';

export enum PublicationsApiPaths {
  SEARCH = '/publications',
  DOI = '/publications/doi',
  INSERT_RESOURCE = '/publications/insert-resource',
  UPDATE_RESOURCE = '/publications/update-resource',
  FETCH_RESOURCE = '/publications/fetch-resource',
  DOI_LOOKUP = '/doilookup',
}

export const createNewPublicationFromDoi = async (url: string, owner: string, dispatch: Dispatch) => {
  const data: DoiPublication = {
    url,
    owner,
  };
  try {
    const idToken = await getIdToken();
    const response = await Axios.post(PublicationsApiPaths.DOI, data, {
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

export const getPublication = async (id: string, dispatch: Dispatch) => {
  const url = `${PublicationsApiPaths.FETCH_RESOURCE}/${id}`;
  try {
    const idToken = await getIdToken();
    const response = await Axios.get(url, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    if (response.status === StatusCode.OK) {
      return response.data.Items[0];
    } else {
      dispatch(addNotification(i18n.t('feedback:error.get_publication'), 'error'));
    }
  } catch {
    dispatch(addNotification(i18n.t('feedback:error.get_publication'), 'error'));
  }
};

export const lookupDoiTitle = async (url: string) => {
  try {
    const idToken = await getIdToken();
    const response = await Axios.get(`${PublicationsApiPaths.DOI_LOOKUP}${url}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    if (response.status === StatusCode.OK) {
      return response.data.title;
    } else {
      console.error('error.get_doi'); //TO BE REPLACED
    }
  } catch {
    console.error('error.get_doi'); //TO BE REPLACED
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
