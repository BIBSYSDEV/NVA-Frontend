import Axios from 'axios';
import { Dispatch } from 'redux';

import i18n from '../translations/i18n';
import { DoiPublication, Publication } from '../types/publication.types';
import { ApiServiceUrl, StatusCode, API_URL, API_TOKEN } from '../utils/constants';
import { addNotification } from '../redux/actions/notificationActions';

export const PUBLICATION_INSERT_RESOURCE_URL = `${ApiServiceUrl.PUBLICATIONS}/insert-resource`;
export const PUBLICATION_UPDATE_RESOURCE_URL = `${ApiServiceUrl.PUBLICATIONS}/update-resource`;
export const PUBLICATION_FETCH_RESOURCE_URL = `${ApiServiceUrl.PUBLICATIONS}/fetch-resource`;
export const PUBLICATION_DOI_URL = `${ApiServiceUrl.PUBLICATIONS}/doi`;

export const createNewPublicationFromDoi = async (url: string, owner: string, dispatch: Dispatch) => {
  const data: DoiPublication = {
    url,
    owner,
  };
  try {
    const response = await Axios.post(PUBLICATION_DOI_URL, data, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
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
    const response = await Axios.post(PUBLICATION_INSERT_RESOURCE_URL, publication, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
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
  try {
    const response = await Axios.put(`${PUBLICATION_UPDATE_RESOURCE_URL}/${id}`, publication, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
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
  const url = `${PUBLICATION_FETCH_RESOURCE_URL}/${id}`;
  try {
    const response = await Axios.get(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
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
    const response = await Axios.get(`${API_URL}/${ApiServiceUrl.DOI_LOOKUP}${url}`);
    if (response.status === StatusCode.OK) {
      return response.data.title;
    } else {
      console.error('error.get_doi'); //TO BE REPLACED
    }
  } catch {
    console.error('error.get_doi'); //TO BE REPLACED
  }
};
