import Axios from 'axios';
import { Dispatch } from 'redux';

import { addNotification } from '../redux/actions/notificationActions';
import i18n from '../translations/i18n';
import { DoiPublication, Publication } from '../types/publication.types';
import { API_TOKEN, ApiBaseUrl, StatusCode } from '../utils/constants';

export const createNewPublicationFromDoi = async (url: string, owner: string, dispatch: Dispatch) => {
  const data: DoiPublication = {
    url,
    owner,
  };
  try {
    const response = await Axios.post(`/${ApiBaseUrl.PUBLICATIONS}/doi`, data, {
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
  const url = '/insert-resource';

  try {
    const response = await Axios.post(url, publication, {
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

  const url = `/update-resource/${id}`;

  try {
    const response = await Axios.put(url, publication, {
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
  const url = `/fetch-resource/${id}`;
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
    const response = await Axios.get(`/${ApiBaseUrl.DOI_LOOKUP}${url}`);
    if (response.status === StatusCode.OK) {
      return response.data.title;
    } else {
      console.error('error.get_doi'); //TO BE REPLACED
    }
  } catch {
    console.error('error.get_doi'); //TO BE REPLACED
  }
};
